// ВКЛАДКА UNITY: сверху большой блок с выбранной игрой (скриншот, описание, кнопка «Смотреть видео»),
// внизу лента игр (reel.js). Видео проигрывается прямо в блоке: скриншот плавно растворяется,
// а когда видео закончилось (или нажали «Вернуться»), так же плавно возвращается.

const uni = { index: 0, playing: false };
const listUnity = () => projects.byTab("unity");
const unityRatio = (p) => (p.coverRatio || "16 / 9");

function renderUnity() {
  const list = listUnity();
  const cards = list.map((p, i) => `
    <button class="rc c3d cu hud" data-ri="${i}" style="--i:${i};--ar:${unityRatio(p)}">
      <span class="rc-img" style="background-image:url('${p.cover || ""}')"></span>
      <span class="rc-no">${pad2(i + 1)}</span>
      <span class="cap"><b>${p.title}</b><small>${projects.idOf(p)} · Unity</small></span>
    </button>`);
  $("unityRoot").innerHTML = `
    ${pageHead("03", "Unity", "Игры <em>и прототипы</em>")}
    ${hintHtml("Листай ленту внизу: игра сверху сменится. Жми «Смотреть видео», чтобы увидеть её в действии.")}
    <div class="stage">
      <div class="stage-view hud" id="unityView"><div class="u-frame" id="unityFrame"></div></div>
      <aside class="stage-info" id="unityInfo"></aside>
    </div>
    ${reelHtml("unity", cards, "reel-wide")}`;
  reels.unity = initReel("unity", selectUnity);
  paintUnity();
}

function paintUnity() {
  const p = listUnity()[uni.index];
  if (!p) return;
  uni.playing = false;

  const frame = $("unityFrame");
  frame.style.setProperty("--ar", unityRatio(p));
  frame.classList.remove("playing");
  frame.innerHTML = `
    ${p.cover ? `<img class="u-shot" src="${p.cover}" alt="${p.title}">` : `<div class="u-shot u-art">${artHtml(p)}</div>`}
    ${p.video ? `<video class="u-video" playsinline preload="metadata" controls src="${p.video}"></video>
    <button class="u-big" data-uvideo aria-label="Смотреть видео"><i>▶</i></button>` : ""}`;
  frame.classList.remove("fresh"); void frame.offsetWidth; frame.classList.add("fresh"); // плавное появление нового скриншота

  const video = frame.querySelector(".u-video");
  if (video) video.addEventListener("ended", () => setUnityPlaying(false));

  const info = $("unityInfo");
  info.innerHTML = `
    <span class="status">${projects.idOf(p)} · ${p.status}</span>
    <h3>${p.title}</h3><p class="m-sum">${p.summary}</p>
    <ul class="points">${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>
    ${tagsHtml(p.tools)}
    <div class="btns">
      ${p.video
        ? `<button class="btn" id="unityVideoBtn" data-uvideo>▶ Смотреть видео игры</button>`
        : `<button class="btn" disabled title="Добавь в projects.js строку video: &quot;videos/имя.mp4&quot;">▶ Видео скоро появится</button>`}
      ${p.demo ? `<button class="btn" data-uplay="${p.demo}">🎮 Играть</button>` : ""}
    </div>`;
  info.classList.remove("swap"); void info.offsetWidth; info.classList.add("swap");
}

function selectUnity(i) {
  const n = listUnity().length;
  if (!n) return;
  const next = (i + n) % n;
  if (next === uni.index) return;
  uni.index = next;
  paintUnity();
}

// Включает или выключает видео; при выключении скриншот плавно возвращается
function setUnityPlaying(on) {
  const frame = $("unityFrame"), video = frame?.querySelector(".u-video");
  if (!video || uni.playing === on) return;
  uni.playing = on;
  frame.classList.toggle("playing", on);
  const btn = $("unityVideoBtn");
  if (btn) btn.textContent = on ? "↩ Вернуться к скриншоту" : "▶ Смотреть видео игры";
  if (on) {
    video.currentTime = 0;
    video.play().catch(() => {});
  } else {
    video.pause();
    frame.classList.remove("back"); void frame.offsetWidth; frame.classList.add("back"); // скриншот «возвращается»
    setTimeout(() => { if (!uni.playing) video.currentTime = 0; }, 700); // когда видео уже растворилось
    if (document.fullscreenElement) document.exitFullscreen();
  }
}

function toggleUnityVideo() { setUnityPlaying(!uni.playing); }

function leaveUnity() { setUnityPlaying(false); }
