// ВКЛАДКА 3D: большое окно с моделью, описание рядом и лента работ внизу (reel.js).
// Живой 3D-просмотрщик создаётся, когда вкладка открыта, и удаляется, когда её закрывают (экономит ресурсы).

const stage = { index: 0, viewer: null, timer: null, touched: false };
const list3d = () => projects.byTab("3d");

function render3D() {
  const cards = list3d().map((p, i) => `
    <button class="rc c3d hud" data-ri="${i}" style="--i:${i}">
      <span class="rc-img" style="background-image:url('${p.cover || ""}')"></span>
      <span class="rc-no">${pad2(i + 1)}</span>
      <span class="cap"><b>${p.title}</b><small>${projects.idOf(p)} · 3ds Max</small></span>
    </button>`);
  $("threeRoot").innerHTML = `
    <p class="label">02 — 3D</p><h2>3D-<em>работы</em></h2>
    ${hintHtml("Листай ленту внизу: модель сверху сменится. Крути её, включай сетку, открывай рендер.")}
    <div class="stage">
      <div class="stage-view hud" id="stageView">
        <div class="viewer" id="stageViewer">
          <img class="v-poster" id="stagePoster" alt="">
          <div class="v-tools">
            <button data-vtool="wire">⬡ Сетка</button><button class="on" data-vtool="rotate">↻ Вращение</button>
            <button data-vtool="reset">⟲ Сброс</button><button data-vtool="full">⛶</button>
          </div>
          <div class="v-hint-drag"><i>↔</i><span>Потяни, чтобы повернуть<em> · колесо — приблизить</em></span></div>
        </div>
      </div>
      <aside class="stage-info" id="stageInfo"></aside>
    </div>
    ${reelHtml("3d", cards)}`;
  $("stageView").addEventListener("pointerdown", () => { stage.touched = true; stopAuto(); });
  stage.reel = reels["3d"] = initReel("3d", select3D);
  stage.reel.onUser = () => { stage.touched = true; stopAuto(); };
  paint3D();
}

function paint3D() {
  const p = list3d()[stage.index];
  if (!p) return;
  $("stagePoster").src = p.cover || "";
  $("stagePoster").hidden = !p.cover;
  const info = $("stageInfo");
  info.innerHTML = `
    <span class="status">${projects.idOf(p)} · ${p.status}</span>
    <h3>${p.title}</h3><p class="m-sum">${p.summary}</p>
    <ul class="points">${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>
    ${tagsHtml(p.tools)}
    <div class="btns">${p.render ? `<button class="btn" data-image="${p.render.image}" data-caption="${p.render.caption}">◈ Посмотреть рендер</button>` : ""}</div>`;
  info.classList.remove("swap"); void info.offsetWidth; info.classList.add("swap"); // плавная смена описания
}

function select3D(i) {
  const n = list3d().length;
  if (!n) return;
  stage.index = (i + n) % n;
  paint3D();
  if (document.body.dataset.page === "3d") loadStageModel();
}

function stageNote(text) {
  const box = $("stageViewer");
  box.querySelector(".v-loading")?.remove();
  if (text) box.insertAdjacentHTML("beforeend", `<div class="v-loading">${text}</div>`);
}

function loadStageModel() {
  const box = $("stageViewer");
  const p = list3d()[stage.index];
  box.classList.remove("ready");
  stageNote("Загрузка 3D…");
  window.loadThree().then(() => {
    if (document.body.dataset.page !== "3d") return; // уже ушли с вкладки
    if (!stage.viewer) stage.viewer = createViewer(box);
    box.addEventListener("pointerdown", () => box.classList.add("touched"), { once: true }); // подсказка исчезает после касания
    stage.viewer.setModel(models[p.model], () => { box.classList.add("ready"); stageNote(""); }, () =>
      stageNote(settings.allowModelDrop
        ? "Локально модель не загружается: перетащи .glb сюда или опубликуй сайт."
        : "Не удалось загрузить модель."));
  }).catch(() => stageNote("3D не загрузилось: проверь интернет."));
}

// Карусель сама перелистывается, пока посетитель ничего не трогал (если работ больше одной)
function startAuto() {
  stopAuto();
  if (list3d().length < 2 || stage.touched) return;
  stage.timer = setInterval(() => stage.reel.go(stage.index + 1), 7000);
}
function stopAuto() { clearInterval(stage.timer); }

function enter3D() {
  loadStageModel();
  startAuto();
}

function leave3D() {
  stopAuto();
  if (document.fullscreenElement) document.exitFullscreen();
  stage.viewer?.dispose();
  stage.viewer = null;
}

function stageTool(tool, button) {
  if (tool === "full") {
    document.fullscreenElement ? document.exitFullscreen() : $("stageView").requestFullscreen?.();
    return;
  }
  if (!stage.viewer) return;
  if (tool === "wire") button.classList.toggle("on", stage.viewer.toggleWireframe());
  if (tool === "rotate") button.classList.toggle("on", stage.viewer.toggleRotate());
  if (tool === "reset") stage.viewer.reset();
}
