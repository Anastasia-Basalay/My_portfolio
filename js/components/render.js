// ОТРИСОВКА: берёт данные из js/data/ и вставляет их в страницу.

function renderProfile() {
  document.title = `${profile.name} — ${profile.role}`;
  $("logo").textContent = profile.initials;
  $("role").textContent = profile.role;
  $("name").innerHTML = `<span>${profile.firstName}</span><span class="out">${profile.lastName}</span>`;
  $("tagline").textContent = profile.tagline;
  $("aboutText").textContent = profile.about;
  $("mail").textContent = profile.email;
  $("avail").textContent = `${info.seeking.title} · ${info.seeking.period}`;
  $("badgeText").textContent = `Ищу стажировку · ${info.seeking.period}`;
  $("loc").innerHTML = `${pinIcon} ${info.city}`;
  const phone = $("phone");
  phone.hidden = !info.phone;
  if (info.phone) {
    phone.textContent = info.phone;
    phone.href = "tel:" + info.phone.replace(/[^\d+]/g, "");
    phone.onclick = (e) => { // на компьютере копируем номер, на телефоне открывается звонок
      if (!matchMedia("(hover:hover)").matches) return;
      e.preventDefault(); navigator.clipboard?.writeText(info.phone); toast();
    };
  }
  const contacts = profile.contacts.filter((c) => !c.href.includes("your-name")); // заглушки не показываем
  if (profile.cv) contacts.unshift({ label: "Резюме (PDF)", href: profile.cv });
  if (info.instagram) contacts.push({ label: "Instagram", href: info.instagram });
  $("contactLinks").innerHTML = contacts.map(linkButton).join("");
  $("footer").textContent = `© ${new Date().getFullYear()} ${profile.name}`;
  $("stats").innerHTML = profile.stats
    .map((s) => `<div class="stat"><b data-to="${s.value}">0</b><span>${s.label}</span></div>`)
    .join("");
  $("marquee").innerHTML = [...ticker, ...ticker].map((t) => `<span>${t} ✦</span>`).join("");
  renderPhoto();
}

function renderPhoto() {
  const img = new Image();
  img.alt = profile.name;
  img.src = profile.photo;
  img.onerror = () => { // если фото нет — красивая заглушка с буквой
    const stub = document.createElement("div");
    stub.className = "ph";
    stub.textContent = profile.firstName[0];
    img.replaceWith(stub);
  };
  $("photoBox").append(img);
}

function renderSkills() {
  $("skillGrid").innerHTML = skills.map((s) => `
    <article class="card tilt skill">
      <div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.text}</p>
      <div class="more"><p style="color:var(--text);margin-top:10px">${s.more}</p>${tagsHtml(s.tags)}</div>
    </article>`).join("");
}

function renderModels() {
  $("modelGrid").innerHTML = models.map((m, i) => `
    <article class="card">
      <div class="viewer" data-i="${i}"><div class="hint">${matchMedia("(hover:none)").matches ? "Крути пальцем · щипок — приближение" : "Крути · колесо — приближение" + (settings.allowModelDrop ? " · перетащи сюда .glb" : "")}</div></div>
      <h3>${m.title}</h3><p>${m.description}</p>
    </article>`).join("");
}

function renderExperience() {
  $("timeline").innerHTML = experience.map((e) => `
    <div class="entry"><div class="when">${e.when}</div>
      <div><h3>${e.title}</h3><div class="where">${e.where}</div><p>${e.text}</p></div></div>`).join("");
}

function renderChips() {
  const used = projects.usedCategories();
  $("chips").innerHTML = [...categories]
    .filter(([key]) => key === "all" || used.has(key))
    .map(([key, label]) => `<button class="btn${key === "all" ? " on" : ""}" data-f="${key}">${label}</button>`)
    .join("");
}

function renderProjects(cat) {
  $("projectGrid").innerHTML = projects.byCategory(cat).map((p, i) => `
    <article class="card tilt project" data-t="${p.title}" style="--i:${i}">
      <div class="cover" ${p.image ? `style="background-image:url('${p.image}')"` : ""}></div>
      <span class="status">${p.status}</span><h3>${p.title}</h3><p>${p.description}</p>
      ${tagsHtml(p.tools)}
    </article>`).join("");
}

function showProjectModal(title) {
  const p = projects.findByTitle(title);
  if (!p) return;
  $("modal").innerHTML = `
    <span class="status">${p.status} · ${categories.get(p.cat)}</span><h3>${p.title}</h3><p>${p.description}</p>
    ${tagsHtml(p.tools)}
    <div class="btns">${p.link ? `<a class="btn" href="${p.link}" target="_blank" rel="noreferrer">Открыть</a>` : ""}<button class="btn" id="close">Закрыть</button></div>`;
  $("modal").showModal();
  $("close").onclick = () => $("modal").close();
}

const pinIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';

function toast() {
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 1800);
}

// Плитки «коротко обо мне»; у английского шкала уровней A1–C2
function renderFacts() {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"], at = levels.indexOf(info.english);
  const tile = (label, value, extra = "") => `<div class="card tilt fact"><span>${label}</span><b>${value}</b>${extra}</div>`;
  $("facts").innerHTML =
    tile("Город", info.city) + tile("Возраст", info.age) + tile("Учусь", info.study) +
    tile("Английский", info.english, `<div class="scale">${levels.map((l, i) => `<i class="${i <= at ? "on" : ""}" style="--i:${i}">${l}</i>`).join("")}</div>`);
}

// Роли: вкладки, сами переключаются, пока не нажмёшь; кнопка открывает нужные проекты
function renderRoles() {
  $("seekText").textContent = `Производственная практика и стажировка, ${info.seeking.period}. Выбери роль — покажу, что умею и что уже делала.`;
  $("roleTabs").innerHTML = roles.map((r, i) => `<button class="btn" role="tab" data-i="${i}">${r.title}</button>`).join("");
  const panel = $("rolePanel");
  let current = 0, timer;
  const show = (i) => {
    current = i;
    const r = roles[i];
    document.querySelectorAll("#roleTabs .btn").forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    panel.innerHTML = `<h3>${r.title}</h3><p>${r.text}</p>${tagsHtml(r.tags)}<div class="btns"><button class="btn" data-go="${r.filter}">Смотреть работы</button></div>`;
  };
  show(0);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => show((current + 1) % roles.length), 6000);
  $("roleTabs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) { clearInterval(timer); show(+b.dataset.i); }
  });
  panel.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (!go) return;
    clearInterval(timer);
    document.querySelector(`#chips [data-f="${go.dataset.go}"]`)?.click();
    $("projects").scrollIntoView({ behavior: "smooth" });
  });
}
