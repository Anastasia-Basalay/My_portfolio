// ОТРИСОВКА: берёт данные из js/data/ и вставляет их в страницу.

function renderProfile() {
  document.title = `${profile.name} — ${profile.role}`;
  $("logo").textContent = profile.initials;
  $("role").textContent = profile.role;
  $("name").innerHTML = `<span>${profile.firstName}</span><span class="out">${profile.lastName}</span>`;
  $("tagline").textContent = profile.tagline;
  $("aboutText").textContent = profile.about;
  $("mail").textContent = profile.email;
  $("contactLinks").innerHTML = profile.contacts.map(linkButton).join("");
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
      <div class="viewer" data-i="${i}"><div class="hint">Крути · колесо — приближение</div></div>
      <h3>${m.title}</h3><p>${m.description}</p>
    </article>`).join("");
}

function renderWorkflow() {
  $("steps").innerHTML = workflow.map((step, i) =>
    `<div class="step"><b>0${i + 1}</b><h3>${step.title}</h3><p>${step.text}</p></div>`).join("");
}

function renderChips() {
  const used = projects.usedCategories();
  $("chips").innerHTML = [...categories]
    .filter(([key]) => key === "all" || used.has(key))
    .map(([key, label]) => `<button class="btn${key === "all" ? " on" : ""}" data-f="${key}">${label}</button>`)
    .join("");
}

function renderProjects(cat) {
  $("projectGrid").innerHTML = projects.byCategory(cat).map((p) => `
    <article class="card tilt project" data-t="${p.title}">
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
