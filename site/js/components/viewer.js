// 3D-ПРОСМОТРЩИК: показывает .glb, крутится сам, вращается мышью/пальцем.

function createViewer(box, src) {
  const { THREE, OrbitControls, GLTFLoader, RoomEnvironment } = window.Three;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  box.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { autoRotate: true, autoRotateSpeed: 2.5, enablePan: false, enableDamping: true });

  // Освещение: розовый боковой свет, белый свет от камеры и мягкий общий свет
  const light = new THREE.DirectionalLight(0xff9ad5, 2.5);
  light.position.set(3, 4, 2);
  scene.add(light);

  const cameraLight = new THREE.DirectionalLight(0xffffff, 2.5); // светит туда же, куда смотрит камера
  camera.add(cameraLight);
  scene.add(camera);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 1.5));
  scene.environmentIntensity = 1.5;

  let current = null;

  // Ставит модель в центр и подбирает расстояние камеры
  function show(object) {
    if (current) scene.remove(current);
    current = object;
    object.traverse((child) => {
      if (child.isMesh) child.material.side = THREE.DoubleSide;
    });
    scene.add(object);
    const box3 = new THREE.Box3().setFromObject(object);
    const size = box3.getSize(new THREE.Vector3()).length();
    object.position.sub(box3.getCenter(new THREE.Vector3()));
    camera.position.set(0, size * 0.15, size * 1.1);
    controls.update();
  }

  function showPlaceholder() {
    const geometry = new THREE.TorusKnotGeometry(0.7, 0.25, 160, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xff2e93, metalness: 0.85, roughness: 0.2 });
    show(new THREE.Mesh(geometry, material));
  }

  const loader = new GLTFLoader();
  const load = (url) => loader.load(url, (gltf) => show(gltf.scene), undefined, showPlaceholder);
  src ? load(src) : showPlaceholder();

  // Перетаскивание своего .glb на окно модели
  box.addEventListener("dragover", (e) => { e.preventDefault(); box.classList.add("drag"); });
  box.addEventListener("dragleave", () => box.classList.remove("drag"));
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.classList.remove("drag");
    const file = e.dataTransfer.files[0];
    if (file && /\.(glb|gltf)$/i.test(file.name)) load(URL.createObjectURL(file));
  });

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