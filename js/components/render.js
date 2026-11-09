// ОТРИСОВКА страниц из данных js/data/. Вкладка 3D собирается в stage3d.js.

let designKind = "all";

const pageHead = (num, label, title, sub = "") => `
  <p class="label">${num} — ${label}</p><h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ""}`;

function renderBrand() {
  $("brandName").textContent = profile.brand;
  $("brandSub").textContent = profile.brandSub;
  document.title = `${profile.name} — ${profile.role}`;
}

function renderHome() {
  $("role").innerHTML = `<span id="typed"></span><i class="caret">▮</i>`;
  $("name").innerHTML = `<span>${profile.firstName}</span><span class="out">${profile.lastName}</span>`;
  $("tagline").textContent = profile.tagline;
  $("marquee").innerHTML = [...ticker, ...ticker].map((t) => `<span>${t} ✦</span>`).join("");
  // Меню как в игре: ведёт на вкладки с работами
  $("gmenu").innerHTML = profile.focus.map((f, i) =>
    `<a href="#${f.go}" data-go="${f.go}"><em>0${i + 1}</em><b>${f.title}</b><i>◆</i></a>`).join("");

  const img = new Image();
  img.alt = profile.name;
  img.src = profile.photo;
  img.onerror = () => { // если фото нет — заглушка с буквой
    const stub = document.createElement("div");
    stub.className = "ph";
    stub.textContent = profile.firstName[0];
    img.replaceWith(stub);
  };
  $("photoBox").append(img);
}

function renderAbout() {
  $("aboutRoot").innerHTML = `
    ${pageHead("01", "Обо мне", profile.aboutTitle)}
    <div class="about-grid">
      <div class="reveal">
        <p class="statement">${profile.intro}</p>
        <p class="lead">${profile.uni}</p>
        <div class="facts">${profile.facts.map((f) => `<span class="fact">${f}</span>`).join("")}</div>
        <div class="tools-row">${profile.tools.map((t) => `<i>${t}</i>`).join("")}</div>
      </div>
      <div class="seeking reveal">
        <div class="ribbon"><div>${Array(8).fill(`<span>${profile.seeking.ribbon} ✦</span>`).join("")}</div></div>
        <span class="pulse"></span>
        <b>${profile.seeking.title}</b>
        <p>${profile.seeking.text}</p>
        <p class="can">${profile.seeking.tasksTitle}</p>
        <ul class="tasks">${profile.seeking.tasks.map((t, i) => `<li style="--i:${i}">✓ ${t}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="focus">${profile.focus.map((f, i) => `
      <button class="tile reveal" style="--i:${i}" data-go="${f.go}">
        <i>${f.icon}</i><b>${f.title}</b><span>${f.text}</span><em>Открыть вкладку →</em>
      </button>`).join("")}
    </div>`;
}

// Подсказка с анимацией: слова проявляются по очереди, потом по ним пробегает подсветка, слева «касание»
const hintHtml = (text) => `<p class="hint-anim"><span class="tap" aria-hidden="true"><i></i><i></i><b></b></span><span class="hw">${text.split(" ").map((w, i) => `<span style="--w:${i}">${w}</span>`).join(" ")}</span></p>`;

// Подпись внизу обложки: 1–2 главные цифры проекта
function artCap(p) {
  const bits = (p.facts || []).map((f) => `<span><b>${f.v}</b> ${f.l}</span>`);
  if (p.stages) bits.unshift(`<span><b>${p.stages.filter((x) => x.done).length}/${p.stages.length}</b> этапов готово</span>`);
  return bits.length ? `<div class="art-cap">${bits.slice(0, 2).join("")}</div>` : "";
}

// Вместо пустой картинки: цифры, этапы или маленькая анимация по теме проекта
function artHtml(p) {
  if (arts[p.art]) return arts[p.art]() + artCap(p); // анимированная обложка по смыслу проекта (arts.js)
  if (p.art === "pong") return `<div class="art-pong"><i class="pad l"></i><i class="pad r"></i><i class="ball"></i></div>`;
  if (p.art === "code") return `<div class="art-code"><b style="--w:62%"></b><b style="--w:84%"></b><b style="--w:48%"></b><b style="--w:73%"></b><u></u></div>`;
  if (p.art === "people") return `<div class="art-people"><i></i><i></i><i class="lead"></i><i></i></div>`;
  const facts = (p.facts || []).slice(0, 3).map((f) => `<div><b>${f.v}</b><small>${f.l}</small></div>`).join("");
  const done = p.stages ? p.stages.filter((x) => x.done).length : 0;
  const progress = p.stages
    ? `<div class="art-progress"><span style="--w:${(done / p.stages.length) * 100}%"></span></div><small class="art-note">${done} из ${p.stages.length} этапов готово</small>`
    : "";
  return `<div class="art-facts">${facts}</div>${progress}`;
}

// Верхняя часть карточки: смена экранов, видео, картинка или информационная панель
function coverHtml(p) {
  const badges = `${p.wip ? `<span class="badge bwip"><i></i>В разработке</span>` : ""}${p.demo ? `<span class="badge bplay">▶ Играть</span>` : p.video ? `<span class="badge bplay">▶ Видео</span>` : ""}`;
  if (p.video) return `<div class="w-cover hud"><video class="w-video" autoplay muted loop playsinline src="${p.video}" ${p.cover ? `poster="${p.cover}"` : ""}></video>${badges}</div>`;
  if (p.gallery?.length > 1) return `<div class="w-cover hud slides">${p.gallery.map((src, i) => `<img class="slide${i ? "" : " on"}" src="${src}" alt="" loading="lazy">`).join("")}${badges}</div>`;
  if (p.cover) return `<div class="w-cover hud" style="background-image:url('${p.cover}');background-position:${p.coverPos || "center"}${p.coverRatio ? `;height:auto;aspect-ratio:${p.coverRatio}` : ""}">${badges}</div>`;
  return `<div class="w-cover hud panel">${artHtml(p)}${badges}</div>`;
}

function cardHtml(p, i) {
  return `
    <article class="work tilt${p.size === "wide" ? " wide" : ""}" style="--i:${i}" data-project="${p.title}">
      ${coverHtml(p)}
      <div class="w-body"><span class="status">${projects.idOf(p)} · ${p.status}</span><h3>${p.title}</h3><p>${p.summary}</p>${tagsHtml(p.tools)}</div>
    </article>`;
}

function renderDesign() {
  $("designRoot").innerHTML = `
    ${pageHead("04", "Геймдизайн", "Гейм<em>дизайн</em>", "Проекты, исследования и интерфейсы. Внутри каждой карточки: что делала, цифры и результат.")}
    <div class="chips" id="chips"></div>
    <div class="bento" id="bento"></div>`;
  paintDesign();
}

function paintDesign() {
  const items = projects.byTab("design");
  const used = new Set(items.map((p) => p.kind));
  $("chips").innerHTML = [...kinds]
    .filter(([key]) => key === "all" || used.has(key))
    .map(([key, label]) => `<button class="btn${key === designKind ? " on" : ""}" data-filter="${key}">${label} <sup>${key === "all" ? items.length : items.filter((p) => p.kind === key).length}</sup></button>`)
    .join("");
  $("bento").innerHTML = items.filter((p) => designKind === "all" || p.kind === designKind).map(cardHtml).join("");
}

function setDesignKind(kind) {
  designKind = kind;
  paintDesign();
}

function renderExperience() {
  $("experienceRoot").innerHTML = `
    ${pageHead("05", "Опыт", "Опыт <em>и образование</em>")}
    <div class="tl">${experience.map((e, i) => `
      <div class="tl-item reveal" style="--i:${i}"><div class="tl-card">
        <span class="tl-when">${e.when}</span><h3>${e.title}</h3>
        ${e.where ? `<div class="tl-where">${e.where}</div>` : ""}<p>${e.text}</p>
        ${e.image ? `<button class="btn" data-image="${e.image}" data-caption="${e.imageCaption || ""}">${e.imageLabel || "Смотреть"}</button>` : ""}
      </div></div>`).join("")}
    </div>`;
}

function renderContacts() {
  const c = profile.contacts;
  const handle = (url) => "@" + url.replace(/\/$/, "").split("/").pop();
  const cards = [["TG", "Telegram", c.telegram], ["IG", "Instagram", c.instagram], ["GH", "GitHub", c.github]];
  $("contactsRoot").innerHTML = `
    <p class="label">06 — Контакты</p>
    <h2 class="fun-title"><span class="wave">👋</span> Давайте работать <em>вместе</em><i class="caret">▮</i></h2>
    <div class="players">PLAYER 1: ГОТОВА · PLAYER 2: ТЫ?</div>
    <button class="press-start" data-start>▶ PRESS START</button>
    <div><a class="mail-big" href="mailto:${c.email}">${c.email}</a></div>
    <div class="c-cards">${cards.map(([icon, name, url]) => `
      <a class="c-card" href="${url}" target="_blank" rel="noreferrer"><i>${icon}</i><span><b>${name}</b><small>${handle(url)}</small></span></a>`).join("")}
    </div>
    <button class="btn" id="copyMail">Скопировать почту</button>`;
}
