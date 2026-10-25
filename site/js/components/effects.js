// ИНТЕРАКТИВ И ЭФФЕКТЫ: появление блоков, курсор, наклон карточек, меню и т.д.

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      e.target.classList.add("visible");
      e.target.querySelectorAll("[data-to]").forEach(countUp);
      observer.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function countUp(el) {
  const target = Number(el.dataset.to);
  let n = 0;
  const timer = setInterval(() => {
    n = Math.min(target, n + Math.max(1, Math.round(target / 30)));
    el.textContent = n;
    if (n === target) clearInterval(timer);
  }, 40);
}

function initScrollBar() {
  addEventListener("scroll", () => {
    const max = document.body.scrollHeight - innerHeight;
    $("bar").style.width = (scrollY / max) * 100 + "%";
  }, { passive: true });
}

// Кольцо-курсор, параллакс фото и наклон карточек — всё на одном pointermove
function initPointerEffects() {
  const cursor = $("cursor");
  let x = 0, y = 0, cx = 0, cy = 0, tilted = null;

  addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    cursor.classList.toggle("big", Boolean(e.target.closest("a,button,.card,.viewer")));
    $("photoBox").style.setProperty("--px", (x / innerWidth - 0.5) * -24 + "px");
    $("photoBox").style.setProperty("--py", (y / innerHeight - 0.5) * -24 + "px");

    const card = e.target.closest(".tilt");
    if (tilted && tilted !== card) setTilt(tilted, 0, 0);
    tilted = card;
    if (card) {
      const r = card.getBoundingClientRect();
      setTilt(card, ((e.clientY - r.top) / r.height - 0.5) * -10, ((e.clientX - r.left) / r.width - 0.5) * 10);
    }
  });

  (function follow() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(follow);
  })();
}

function setTilt(el, rx, ry) {
  el.style.setProperty("--rx", rx + "deg");
  el.style.setProperty("--ry", ry + "deg");
}

function initMenu() {
  $("burger").onclick = () => $("menu").classList.toggle("open");
  $("menu").addEventListener("click", () => $("menu").classList.remove("open"));
}

function initCopyMail() {
  $("mail").onclick = () => {
    navigator.clipboard?.writeText(profile.email);
    $("toast").classList.add("show");
    setTimeout(() => $("toast").classList.remove("show"), 1800);
  };
}

// Клики: раскрытие навыков, фильтр проектов, окно проекта
function initClicks() {
  $("skillGrid").addEventListener("click", (e) => e.target.closest(".skill")?.classList.toggle("open"));

  $("chips").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    document.querySelectorAll("#chips .btn").forEach((b) => b.classList.toggle("on", b === button));
    renderProjects(button.dataset.f);
  });

  $("projectGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    if (card) showProjectModal(card.dataset.t);
  });

  $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) $("modal").close(); });
}
