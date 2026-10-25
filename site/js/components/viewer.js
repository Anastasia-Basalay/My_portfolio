// 3D-ПРОСМОТРЩИК: показывает .glb, крутится сам, вращается мышью/пальцем.

let embeddedPromise; // встроенные копии моделей (js/data/model-data.js) — нужны при открытии по file://
const getEmbedded = () => (embeddedPromise ??= new Promise((resolve) => {
  if (window.modelData) return resolve(window.modelData);
  const script = document.createElement("script");
  script.src = "js/data/model-data.js";
  script.onload = () => resolve(window.modelData || {});
  script.onerror = () => resolve({});
  document.head.append(script);
}));

function createViewer(box, model) {
  const { src, materials: overrides = {} } = model;
  const { THREE, OrbitControls, GLTFLoader, RoomEnvironment } = window.Three;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia("(hover:none)").matches ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // мягко приглушает пересветы
  renderer.toneMappingExposure = model.exposure ?? 0.85; // яркость сцены; можно задать в models.js
  box.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { autoRotate: true, autoRotateSpeed: 2.5, enablePan: false, enableDamping: true });

  renderer.domElement.style.touchAction = "pan-y"; // на телефоне вертикальный свайп листает страницу, горизонтальный крутит модель

  // Освещение: розовый боковой свет, белый свет от камеры и мягкий общий свет
  const light = new THREE.DirectionalLight(0xff9ad5, 1.2);
  light.position.set(3, 4, 2);
  scene.add(light);

  const cameraLight = new THREE.DirectionalLight(0xffffff, 1.0); // светит туда же, куда смотрит камера
  camera.add(cameraLight);
  scene.add(camera);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));
  scene.environmentIntensity = 0.6;

  let current = null, wire = false, home = () => {};

  // Материалы, заданные на сайте (js/data/models.js), перекрывают материалы из файла.
  // Часть модели находим по её имени из 3ds Max (Cylinder001, Sphere001...).
  function makeMaterial(o) {
    const opacity = o.opacity ?? 1;
    return new THREE.MeshStandardMaterial({
      color: o.color ?? "#cccccc",
      metalness: o.metalness ?? 0,
      roughness: o.roughness ?? 0.5,
      emissive: o.emissive ?? "#000000",
      emissiveIntensity: o.emissiveIntensity ?? 1,
      opacity,
      transparent: opacity < 1
    });
  }

  // У модели без материала цвет по умолчанию белый, а у «fallback» из экспорта — чёрный.
  // Оба случая заменяем средне-серым, чтобы модель не была ни пересвеченной, ни чёрной.
  const isPlainDefault = (m) => m.color && !m.map && [0x000000, 0xffffff].includes(m.color.getHex());

  function applyMaterials(object) {
    const names = [];
    object.traverse((child) => {
      if (!child.isMesh) return;
      names.push(child.name);
      const custom = overrides[child.name];
      if (custom) child.material = makeMaterial(custom);
      else if (isPlainDefault(child.material)) child.material = makeMaterial({ color: "#8f8f8f" });
      child.material.side = THREE.DoubleSide;
      child.material.wireframe = wire;
    });
    console.info("Части модели (имена для models.js):", names);
  }

  // Ставит модель в центр и подбирает расстояние камеры
  function show(object) {
    if (current) scene.remove(current);
    current = object;
    applyMaterials(object);
    scene.add(object);
    const box3 = new THREE.Box3().setFromObject(object);
    const size = box3.getSize(new THREE.Vector3()).length();
    object.position.sub(box3.getCenter(new THREE.Vector3()));
    home = () => { camera.position.set(0, size * 0.15, size * 1.1); controls.target.set(0, 0, 0); controls.update(); };
    home();
  }

  function showPlaceholder() {
    const geometry = new THREE.TorusKnotGeometry(0.7, 0.25, 160, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xff2e93, metalness: 0.85, roughness: 0.2 });
    show(new THREE.Mesh(geometry, material));
  }

  // Сообщение поверх окна (загрузка / ошибка) и панель кнопок
  const msg = document.createElement("div");
  msg.className = "vmsg";
  const say = (text) => { msg.textContent = text; msg.hidden = !text; };
  box.append(msg);
  say("Загрузка модели…");

  const bar = document.createElement("div");
  bar.className = "vtools";
  bar.innerHTML = `<button data-a="spin" title="Вращение вкл/выкл">⟳</button><button data-a="wire" title="Каркас (сетка)">▦</button><button data-a="reset" title="Сбросить вид">⌂</button>${box.requestFullscreen ? '<button data-a="full" title="На весь экран">⛶</button>' : ""}`;
  bar.addEventListener("click", (e) => {
    const a = e.target.dataset.a;
    if (a === "spin") { controls.autoRotate = !controls.autoRotate; e.target.classList.toggle("off", !controls.autoRotate); }
    if (a === "wire") { wire = !wire; e.target.classList.toggle("on", wire); current?.traverse((c) => { if (c.isMesh) c.material.wireframe = wire; }); }
    if (a === "reset") home();
    if (a === "full") document.fullscreenElement ? document.exitFullscreen() : box.requestFullscreen();
  });
  box.append(bar);

  const loader = new GLTFLoader();
  const done = (gltf) => { say(""); show(gltf.scene); };
  const fail = (url, error) => {
    console.warn(`Модель «${model.title}» не загрузилась (${url}).`, error);
    say("Модель не загрузилась (подробности — в консоли F12). Показана заглушка.");
    showPlaceholder();
  };

  async function load(url) {
    // По file:// браузер не даёт читать файлы по пути — берём встроенную копию (build_models.py)
    if (location.protocol === "file:" && !url.startsWith("blob:")) {
      const base64 = (await getEmbedded())[url];
      if (!base64) return fail(url, "Нет встроенной копии. Запусти build_models.py или перетащи .glb на окно.");
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      return loader.parse(bytes.buffer, "", done, (e) => fail(url, e));
    }
    loader.load(url, done, (e) => e.total && say(`Загрузка… ${Math.round((e.loaded / e.total) * 100)}%`), (e) => fail(url, e));
  }
  src ? load(src) : showPlaceholder();

  // Перетаскивание своего .glb на окно модели (включается в js/data/settings.js)
  if (settings.allowModelDrop) {
    box.addEventListener("dragover", (e) => { e.preventDefault(); box.classList.add("drag"); });
    box.addEventListener("dragleave", () => box.classList.remove("drag"));
    box.addEventListener("drop", (e) => {
      e.preventDefault();
      box.classList.remove("drag");
      const file = e.dataTransfer.files[0];
      if (file && /\.(glb|gltf)$/i.test(file.name)) load(URL.createObjectURL(file));
    });
  }

  // Рисуем только когда окно видно на экране
  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(box);

  const resize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight, false);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(box);
  resize();

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  });
}
