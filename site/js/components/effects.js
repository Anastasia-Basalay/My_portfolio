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
    if (e.pointerType !== "mouse") return; // на телефоне курсор, наклон и параллакс не нужны
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

// Подгоняет размер имени под доступную ширину, чтобы любое имя помещалось целиком
function fitName() {
  const h1 = $("name");
  const box = h1.parentElement;
  const style = getComputedStyle(box);
  const limit = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const widest = () => Math.max(...[...h1.children].map((line) => line.offsetWidth));

  h1.style.fontSize = ""; // сначала размер из CSS
  let size = parseFloat(getComputedStyle(h1).fontSize);
  while (widest() > limit && size > 18) {
    size -= 2;
    h1.style.fontSize = size + "px";
  }
}

function initNameFit() {
  fitName();
  document.fonts?.ready.then(fitName); // пересчёт, когда загрузится шрифт
  addEventListener("resize", fitName);
}

function initMenu() {
  const menu = $("menu"), burger = $("burger");
  const set = (open) => {
    menu.classList.toggle("open", open);
    burger.textContent = open ? "ЗАКРЫТЬ" : "МЕНЮ";
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.onclick = () => set(!menu.classList.contains("open"));
  menu.addEventListener("click", () => set(false));
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

// Печатающаяся строка в шапке
function initTyped() {
  const el = $("role"), words = profile.roles || [profile.role];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return (el.textContent = words[0]);
  let w = 0, i = 0, erasing = false;
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, i);
    if (!erasing && i === word.length) { erasing = true; return setTimeout(tick, 1500); }
    if (erasing && i === 0) { erasing = false; w = (w + 1) % words.length; }
    i += erasing ? -1 : 1;
    setTimeout(tick, erasing ? 30 : 70);
  })();
}

// Сеть точек в шапке: линии соединяют соседние точки, курсор их отталкивает (как вершины low poly сетки)
function initNetwork() {
  const hero = document.querySelector(".hero"), canvas = $("net"), ctx = canvas.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const dense = matchMedia("(hover:none)").matches ? 24000 : 14000;
  const dpr = Math.min(devicePixelRatio, 2), mouse = { x: -999, y: -999 };
  let w = 0, h = 0, points = [], visible = true;

  function resize() {
    if (hero.clientWidth === w && Math.abs(hero.clientHeight - h) < 120) return; // адресная строка телефона не пересоздаёт точки
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = Array.from({ length: Math.round((w * h) / dense) }, () => ({
      x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
  }
  resize();
  addEventListener("resize", resize);
  hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("pointerleave", () => (mouse.x = mouse.y = -999));
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(hero);

  (function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < 120) { p.x += (dx / d) * 1.4; p.y += (dy / d) * 1.4; }
    }
    ctx.fillStyle = "rgba(255,154,213,.85)";
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      ctx.fillRect(a.x - 1, a.y - 1, 2, 2);
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.strokeStyle = `rgba(255,46,147,${(1 - d / 110) * 0.35})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
  })();
}

// Подсветка текущего раздела в меню
function initScrollSpy() {
  const links = [...document.querySelectorAll(".menu a")];
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const section = document.querySelector(a.hash); if (section) spy.observe(section); });
}

// Фон у меню при прокрутке и кнопка «наверх»
function initToTop() {
  const nav = document.querySelector("nav"), button = $("toTop");
  addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", scrollY > 40);
    button.classList.toggle("show", scrollY > innerHeight);
  }, { passive: true });
  button.onclick = () => scrollTo({ top: 0 });
}
