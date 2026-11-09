// 3D-ПРОСМОТРЩИК: один экземпляр на окно. Умеет вращаться сам, вертеться мышью,
// показывать сетку (wireframe) и сбрасывать вид.

function createViewer(box, opts = {}) {
  const { THREE, OrbitControls, GLTFLoader, RoomEnvironment } = window.Three;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const inDialog = Boolean(box.closest("dialog"));
  renderer.setPixelRatio(Math.min(devicePixelRatio, opts.compact ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  box.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { autoRotate: true, autoRotateSpeed: 2.5, enablePan: false, enableDamping: true });

  if (opts.compact) { // окно в карточке: колесо листает страницу, вертикальный свайп тоже
    controls.enableZoom = false;
    renderer.domElement.style.touchAction = "pan-y";
  }

  const sideLight = new THREE.DirectionalLight(0xff9ad5, 1.2);
  sideLight.position.set(3, 4, 2);
  const cameraLight = new THREE.DirectionalLight(0xffffff, 1.0); // светит туда, куда смотрит камера
  camera.add(cameraLight);
  scene.add(sideLight, camera, new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));

  let config = {};
  let current = null;
  let wireframe = false;
  let onReady = null; // вызывается, когда модель показана

  // Материал из описания в models.js
  function makeMaterial(o) {
    const opacity = o.opacity ?? 1;
    return new THREE.MeshStandardMaterial({
      color: o.color ?? "#cccccc", metalness: o.metalness ?? 0, roughness: o.roughness ?? 0.5,
      emissive: o.emissive ?? "#000000", emissiveIntensity: o.emissiveIntensity ?? 1,
      opacity, transparent: opacity < 1
    });
  }

  // У модели без материала цвет белый, у «fallback» из экспорта — чёрный: заменяем средне-серым
  const isPlainDefault = (m) => m.color && !m.map && [0x000000, 0xffffff].includes(m.color.getHex());

  function prepare(object) {
    const overrides = config.materials || {};
    const names = [];
    object.traverse((child) => {
      if (!child.isMesh) return;
      names.push(child.name);
      if (overrides[child.name]) child.material = makeMaterial(overrides[child.name]);
      else if (isPlainDefault(child.material)) child.material = makeMaterial({ color: "#8f8f8f" });
      child.material.side = THREE.DoubleSide;
      child.material.wireframe = wireframe;
    });
    console.info("Части модели (имена для models.js):", names);
  }

  // Ставит модель по центру и подбирает расстояние камеры
  function show(object) {
    if (current) scene.remove(current);
    current = object;
    prepare(object);
    scene.add(object);
    const bounds = new THREE.Box3().setFromObject(object);
    const size = bounds.getSize(new THREE.Vector3()).length();
    object.position.sub(bounds.getCenter(new THREE.Vector3()));
    camera.position.set(0, size * 0.15, size * 1.1);
    controls.update();
    controls.saveState();
    onReady?.();
  }

  function showPlaceholder() {
    show(new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.7, 0.25, 160, 24),
      new THREE.MeshStandardMaterial({ color: 0xff2e93, metalness: 0.85, roughness: 0.2 })
    ));
  }

  const loader = new GLTFLoader();
  let onFail = null; // что делать, если файл не загрузился
  const load = (url) =>
    loader.load(url, (gltf) => show(gltf.scene), undefined, (error) => {
      console.warn(`Модель «${config.title}» не загрузилась (${url}).`, error);
      onFail ? onFail() : showPlaceholder();
    });

  // Перетаскивание своего .glb на окно (включается в js/data/settings.js)
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

  const resize = () => {
    if (!box.clientWidth || !box.clientHeight) return;
    renderer.setSize(box.clientWidth, box.clientHeight, false);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(box);
  resize();
  // Рисуем только когда окно видно, а карточечные окна ещё и стоят на паузе, пока открыто любое диалоговое окно
  let visible = true;
  const visibility = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  visibility.observe(box);
  renderer.setAnimationLoop(() => {
    if (!visible || (!inDialog && document.querySelector("dialog[open]"))) return;
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    setModel(cfg, ready, fail) {
      config = cfg;
      onReady = ready;
      onFail = fail;
      renderer.toneMappingExposure = cfg.exposure ?? 0.85;
      cfg.src ? load(cfg.src) : showPlaceholder();
    },
    toggleWireframe() {
      wireframe = !wireframe;
      current?.traverse((c) => { if (c.isMesh) c.material.wireframe = wireframe; });
      return wireframe;
    },
    toggleRotate() { controls.autoRotate = !controls.autoRotate; return controls.autoRotate; },
    reset() { controls.reset(); },
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibility.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
