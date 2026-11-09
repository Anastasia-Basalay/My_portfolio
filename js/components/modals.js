// ОКНА: карточка проекта (Unity и геймдизайн), просмотр картинок, окно «Связаться».

let modalGallery = { images: [], i: 0, title: "" };
let lightbox = { images: [], i: 0 };

// Кнопка «во весь экран» для видео и запущенной игры (там, где браузер это умеет)
const fsButton = () => (document.fullscreenEnabled ? `<button class="m-full" data-fs>⛶ Во весь экран</button>` : "");

function mediaHtml(p) {
  if (p.video) {
    return `<div class="m-media">${fsButton()}<video controls playsinline preload="metadata" src="${p.video}" ${p.cover ? `poster="${p.cover}"` : ""}></video></div>`;
  }
  const images = p.gallery?.length ? p.gallery : p.cover ? [p.cover] : [];
  modalGallery = { images, i: 0, title: p.title };
  if (!images.length) return `<div class="m-media panel hud">${artHtml(p)}</div>`;
  const thumbs = images.length > 1
    ? `<div class="thumbs">${images.map((src, i) => `<img src="${src}" class="${i ? "" : "on"}" data-ti="${i}" alt="">`).join("")}</div>`
    : "";
  const play = p.demo ? `<button class="play" data-play="${p.demo}">▶ Играть</button>` : "";
  // картинка целиком помещается в окно; клик открывает её крупно, там можно листать
  return `<div class="m-media">${play}<div class="m-stage hud" data-zoom><img id="mImg" src="${images[0]}" alt="${p.title}"><span class="zoom-pill">⤢ Нажми, чтобы увеличить</span></div>${thumbs}</div>`;
}

function openProject(title) {
  const p = projects.findByTitle(title);
  if (!p) return;
  const links = p.links || (p.link ? [{ label: "Открыть", href: p.link }] : []);
  const proof = p.proof
    ? `<button class="proof-card" data-image="${p.proof.image}" data-caption="${p.proof.caption}"><i>★</i><span><b>${p.proof.label}</b><small>Нажми, чтобы открыть документ</small></span></button>`
    : "";

  $("modal").classList.toggle("theater", Boolean(p.video || p.demo)); // с видео или игрой окно шире, а видео крупнее
  $("modal").innerHTML = `
    ${mediaHtml(p)}
    <div class="m-body">
      <span class="status">${projects.idOf(p)} · ${p.status}</span>
      <h3>${p.title}</h3><p class="m-sum">${p.summary}</p>
      ${proof}
      ${p.facts?.length ? `<div class="facts-row">${p.facts.map((f) => `<div class="fk"><b>${f.v}</b>${f.l}</div>`).join("")}</div>` : ""}
      ${p.bars ? `<div class="bars">${p.bars.map((b) => `<div class="bar"><span>${b.l}</span><u><i style="--w:${b.v}%"></i></u><em>${b.t}</em></div>`).join("")}</div>` : ""}
      ${p.flow ? `<ol class="flow">${p.flow.map((s, i) => `<li style="--i:${i}"><b>${i + 1}</b>${s}</li>`).join("")}</ol>` : ""}
      ${p.stages ? `<div class="stages">${p.stages.map((x) => `<span class="st ${x.done ? "done" : "wip"}">${x.done ? "✓" : "◌"} ${x.t}</span>`).join("")}</div>` : ""}
      <ul class="points">${p.points.map((x) => `<li>${x}</li>`).join("")}</ul>
      ${tagsHtml(p.tools)}
      <div class="btns">${p.video && p.demo ? `<button class="btn" data-play="${p.demo}">▶ Играть в игру</button>` : ""}${links.map((l) => `<a class="btn" href="${l.href}" target="_blank" rel="noreferrer">${l.label}</a>`).join("")}<button class="btn" data-close>Закрыть</button></div>
    </div>`;
  if (!$("modal").open) $("modal").showModal();
  $("modal").scrollTop = 0; // браузер мог прокрутить окно к первой ссылке
}

// Просмотр картинок в красивой анимированной карточке; несколько картинок листаются стрелками
function openLightbox(images, index = 0, caption = "") {
  lightbox = { images, i: index, caption };
  const many = images.length > 1;
  $("docDialog").innerHTML = `
    <div class="doc tilt"><div class="doc-in">
      <div class="doc-stage">
        ${many ? `<button class="lb-arrow" data-lb="-1" aria-label="Назад">‹</button>` : ""}
        <img id="lbImg" src="${images[index]}" alt="">
        ${many ? `<button class="lb-arrow r" data-lb="1" aria-label="Вперёд">›</button>` : ""}
      </div>
      <p class="doc-cap" id="lbCap"></p>
      <button class="btn" data-close>Закрыть</button>
    </div></div>`;
  paintLightbox();
  if (!$("docDialog").open) $("docDialog").showModal();
}

function paintLightbox() {
  const { images, i, caption } = lightbox;
  $("lbImg").src = images[i];
  $("lbCap").textContent = caption + (images.length > 1 ? ` · ${i + 1} / ${images.length}` : "");
}

function lbStep(d) {
  lightbox.i = (lightbox.i + d + lightbox.images.length) % lightbox.images.length;
  paintLightbox();
}

function openContact() {
  const c = profile.contacts;
  $("contactDialog").innerHTML = `
    <h3>Связаться со мной</h3>
    <p class="lead" style="margin:8px 0 0">Выбери удобный способ. Отвечу как можно скорее.</p>
    <div class="c-list">
      <a class="c-item" href="${c.telegram}" target="_blank" rel="noreferrer"><span>Telegram</span><small>написать →</small></a>
      <a class="c-item" href="mailto:${c.email}"><span>Email</span><small>${c.email}</small></a>
      <button class="c-item" id="phoneBtn"><span>Телефон</span><small id="phoneVal">показать номер</small></button>
      <a class="c-item" href="${c.instagram}" target="_blank" rel="noreferrer"><span>Instagram</span><small>открыть →</small></a>
      <a class="c-item" href="${c.github}" target="_blank" rel="noreferrer"><span>GitHub</span><small>открыть →</small></a>
    </div>
    <button class="btn" data-close>Закрыть</button>`;
  $("contactDialog").showModal();
  $("contactDialog").scrollTop = 0;
}

// Номер скрыт: первое нажатие показывает его, второе открывает звонок
function revealPhone(button) {
  if (button.dataset.shown) { location.href = "tel:" + profile.contacts.phone.replace(/[^\d+]/g, ""); return; }
  button.dataset.shown = "1";
  $("phoneVal").textContent = profile.contacts.phone;
}
