// ИНТЕРАКТИВ И ЭФФЕКТЫ: появление блоков, курсор, наклон карточек, клики, меню.

let revealObserver;

function initReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  observeReveals();
}

// Вызывается при показе вкладки и после перерисовки карточек
function observeReveals() {
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
}

function initScrollBar() {
  let queued = false;
  addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { // не чаще одного раза за кадр
      const max = document.body.scrollHeight - innerHeight;
      $("bar").style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      $("toTop").classList.toggle("show", scrollY > 400);
      queued = false;
    });
  }, { passive: true });
  $("toTop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
}

// Кольцо-курсор, параллакс фото, наклон и подсветка карточек.
// Всё считается не чаще одного раза за кадр и только на устройствах с мышью.
function initPointerEffects() {
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const cursor = $("cursor");
  let x = 0, y = 0, cx = 0, cy = 0, tilted = null, last = null, queued = false, moving = false;

  function follow() {
    cx += (x - cx) * 0.25;
    cy += (y - cy) * 0.25;
    cursor.style.transform = `translate(${cx}px,${cy}px)`;
    if (Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5) requestAnimationFrame(follow);
    else moving = false;
  }

  function frame() {
    queued = false;
    const e = last;
    cursor.classList.toggle("big", Boolean(e.target.closest("a,button,.tilt,.viewer")));
    if (document.body.dataset.page === "home") {
      $("photoBox").style.setProperty("--px", (x / innerWidth - 0.5) * -24 + "px");
      $("photoBox").style.setProperty("--py", (y / innerHeight - 0.5) * -24 + "px");
    }
    const card = e.target.closest(".tilt");
    if (tilted && tilted !== card) setTilt(tilted, 0, 0);
    tilted = card;
    if (card) {
      const r = card.getBoundingClientRect();
      setTilt(card, ((e.clientY - r.top) / r.height - 0.5) * -8, ((e.clientX - r.left) / r.width - 0.5) * 8);
      card.style.setProperty("--sx", e.clientX - r.left + "px");
      card.style.setProperty("--sy", e.clientY - r.top + "px");
    }
    if (!moving) { moving = true; requestAnimationFrame(follow); } // цикл идёт, только пока курсор догоняет мышь
  }

  addEventListener("pointermove", (e) => {
    x = e.clientX; y = e.clientY; last = e;
    if (!queued) { queued = true; requestAnimationFrame(frame); }
  });
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
  if (limit <= 0) return; // главная сейчас скрыта
  const widest = () => Math.max(...[...h1.children].map((line) => line.offsetWidth));

  h1.style.fontSize = "";
  let size = parseFloat(getComputedStyle(h1).fontSize);
  while (widest() > limit && size > 18) {
    size -= 2;
    h1.style.fontSize = size + "px";
  }
}

function initNameFit() {
  fitName();
  document.fonts?.ready.then(fitName);
  addEventListener("resize", fitName);
}

// Печатающаяся строка роли на главной
function initTyped() {
  const el = $("typed");
  let word = 0, letters = 0, deleting = false;
  (function tick() {
    const text = profile.roles[word];
    el.textContent = text.slice(0, letters);
    if (!deleting && letters === text.length) { deleting = true; return setTimeout(tick, 1400); }
    if (deleting && letters === 0) { deleting = false; word = (word + 1) % profile.roles.length; }
    letters += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 40 : 85);
  })();

}

// Брызги искр из точки клика
function burst(x, y) {
  for (let k = 0; k < 18; k++) {
    const spark = document.createElement("i");
    const angle = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 90;
    spark.className = "spark";
    spark.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;background:${k % 2 ? "#ff2e93" : "#ffe3f1"}`;
    document.body.append(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

// Смена экранов в карточках с несколькими картинками
function initSlideshows() {
  setInterval(() => {
    if (document.body.dataset.page !== "design") return;
    document.querySelectorAll(".slides").forEach((box) => {
      const items = [...box.querySelectorAll(".slide")];
      const at = items.findIndex((s) => s.classList.contains("on"));
      items[at].classList.remove("on");
      items[(at + 1) % items.length].classList.add("on");
    });
  }, 2800);
}

function initMenu() {
  $("burger").onclick = () => $("menu").classList.toggle("open");
}

// Все клики страницы в одном месте (делегирование)
function initClicks() {
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("#contactBtn, [data-contact]")) return openContact();
    if (t.closest("#phoneBtn")) return revealPhone(t.closest("#phoneBtn"));
    if (t.closest("[data-start]")) { burst(e.clientX, e.clientY); return setTimeout(openContact, 450); }
    const play = t.closest("[data-play]");
    if (play) { $("modal").querySelector(".m-media").innerHTML = `${fsButton()}<iframe src="${play.dataset.play}" allowfullscreen allow="fullscreen; gamepad"></iframe>`; return; }
    const fs = t.closest("[data-fs]");
    if (fs) { const box = fs.closest(".m-media"); document.fullscreenElement ? document.exitFullscreen() : box.requestFullscreen?.(); return; }
    if (t.closest("[data-close]") || t.tagName === "DIALOG") return t.closest("dialog").close();

    // лента работ: нажатие по боковой карточке выводит её в центр, по центральной открывает окно (Unity)
    const rc = t.closest(".rc");
    if (rc) {
      const reel = reels[rc.closest("[data-reel]").dataset.reel];
      reel.onUser?.();
      if (+rc.dataset.ri !== reel.visual) return reel.go(+rc.dataset.ri);
    }
    const dot = t.closest("[data-rd]");
    if (dot) { const reel = reels[dot.closest("[data-reel]").dataset.reel]; reel.onUser?.(); return reel.go(+dot.dataset.rd); }
    const arrow = t.closest("[data-rstep]");
    if (arrow) { const reel = reels[arrow.closest("[data-reel]").dataset.reel]; reel.onUser?.(); return reel.step(+arrow.dataset.rstep); }

    const project = t.closest("[data-project]");
    if (project) return openProject(project.dataset.project);

    const filter = t.closest("[data-filter]");
    if (filter) return setDesignKind(filter.dataset.filter);

    if (t.closest("[data-uvideo]")) return toggleUnityVideo();
    const uplay = t.closest("[data-uplay]");
    if (uplay) { $("unityFrame").innerHTML = `<iframe class="u-iframe" src="${uplay.dataset.uplay}" allowfullscreen allow="fullscreen; gamepad"></iframe>`; return; }

    const tool = t.closest("[data-vtool]");
    if (tool) return stageTool(tool.dataset.vtool, tool);

    // картинки: документ из «Опыта» или кнопки, увеличение, листание
    const image = t.closest("[data-image]");
    if (image) return openLightbox([image.dataset.image], 0, image.dataset.caption);
    if (t.closest("[data-zoom]")) return openLightbox(modalGallery.images, modalGallery.i, modalGallery.title);
    const thumb = t.closest("[data-ti]");
    if (thumb) {
      modalGallery.i = +thumb.dataset.ti;
      $("mImg").src = modalGallery.images[modalGallery.i];
      document.querySelectorAll(".thumbs img").forEach((img) => img.classList.toggle("on", img === thumb));
      return;
    }
    const lb = t.closest("[data-lb]");
    if (lb) return lbStep(+lb.dataset.lb);

    if (t.closest("#copyMail")) {
      navigator.clipboard?.writeText(profile.contacts.email);
      $("toast").classList.add("show");
      setTimeout(() => $("toast").classList.remove("show"), 1800);
    }
  });

  // В просмотре картинок листаем стрелками клавиатуры
  addEventListener("keydown", (e) => {
    if (!$("docDialog").open || lightbox.images.length < 2) return;
    if (e.key === "ArrowRight") lbStep(1);
    if (e.key === "ArrowLeft") lbStep(-1);
  });
}
