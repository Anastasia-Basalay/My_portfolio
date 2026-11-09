// ЛЕНТА ВЫБОРА РАБОТ (вкладки 3D и Unity).
// Карточки листаются свайпом, мышью (перетаскиванием), стрелками клавиатуры, кнопками и точками.
// Центральная карточка крупнее и светится, соседние уходят вбок с поворотом (эффект Cover Flow).
// Если работа одна, лента показывает её одну крупно. Новые работы появляются в ленте сами.

const reels = {};
const pad2 = (n) => String(n).padStart(2, "0");

function reelHtml(id, cards, cls = "") {
  const n = cards.length;
  return `
    <div class="reel ${cls}${n < 2 ? " single" : ""}" id="reel-${id}" data-reel="${id}">
      <div class="reel-top">
        <span class="reel-count"><b>01</b><i>/</i><em>${pad2(n)}</em></span>
        <div class="reel-dots">${cards.map((_, i) => `<button class="rd${i ? "" : " on"}" data-rd="${i}" aria-label="Работа ${i + 1}"></button>`).join("")}</div>
        <div class="reel-arrows"><button class="car-btn" data-rstep="-1" aria-label="Назад">‹</button><button class="car-btn" data-rstep="1" aria-label="Вперёд">›</button></div>
      </div>
      <div class="reel-track" tabindex="0">${cards.join("")}</div>
    </div>`;
}

function initReel(id, onSelect) {
  const root = $("reel-" + id), track = root.querySelector(".reel-track");
  const cards = [...track.querySelectorAll(".rc")], n = cards.length;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const r = { index: 0, visual: 0, go, step, refresh, onUser: null };
  let queued = false, endTimer, drag = null, justDragged = false, nudged = false;

  const centerOf = (c) => c.offsetLeft + c.offsetWidth / 2 - track.clientWidth / 2;

  function paint() {
    queued = false;
    if (!track.clientWidth) return; // вкладка сейчас скрыта
    const mid = track.scrollLeft + track.clientWidth / 2;
    const stepPx = n > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    let best = 0, bestD = Infinity;
    cards.forEach((c, i) => {
      const d = c.offsetLeft + c.offsetWidth / 2 - mid;
      c.style.setProperty("--o", (d / stepPx).toFixed(3));
      c.style.setProperty("--ab", Math.min(Math.abs(d / stepPx), 2.5).toFixed(3));
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
    });
    if (best !== r.visual || !cards[best].classList.contains("on")) {
      r.visual = best;
      cards.forEach((c, i) => c.classList.toggle("on", i === best));
      root.querySelectorAll(".rd").forEach((d, i) => d.classList.toggle("on", i === best));
      const num = root.querySelector(".reel-count b");
      num.textContent = pad2(best + 1);
      num.classList.remove("tick"); void num.offsetWidth; num.classList.add("tick");
    }
  }

  function settle() { // прокрутка остановилась: выбираем ближайшую карточку
    if (r.visual !== r.index) { r.index = r.visual; onSelect?.(r.index); }
  }

  function go(i) {
    i = (i + n) % n;
    r.index = i;
    onSelect?.(i);
    track.scrollTo({ left: centerOf(cards[i]), behavior: calm ? "auto" : "smooth" });
  }
  function step(d) { go(r.index + d); }

  function refresh() { // вкладку показали: ставим выбранную карточку по центру и проигрываем появление
    track.scrollLeft = centerOf(cards[r.index]);
    paint();
    root.classList.remove("in", "idle", "nudge"); void root.offsetWidth; root.classList.add("in");
    setTimeout(() => {
      root.classList.remove("in"); root.classList.add("idle");
      if (n > 1 && !nudged && !calm) { nudged = true; root.classList.add("nudge"); setTimeout(() => root.classList.remove("nudge"), 3600); }
    }, 1600);
  }

  track.addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(paint); }
    clearTimeout(endTimer);
    endTimer = setTimeout(settle, 130);
  }, { passive: true });

  // мышь: тянем ленту рукой (на телефоне работает обычный свайп)
  track.addEventListener("pointerdown", (e) => {
    r.onUser?.();
    if (e.pointerType === "mouse" && e.button === 0) drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; track.classList.add("dragging"); }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    track.classList.remove("dragging");
    justDragged = true; setTimeout(() => (justDragged = false), 60);
    go(r.visual);
  });
  track.addEventListener("click", (e) => { if (justDragged) { e.stopPropagation(); e.preventDefault(); } }, true);
  addEventListener("resize", () => { if (track.clientWidth) refresh(); });

  return Object.assign(r, { track });
}
