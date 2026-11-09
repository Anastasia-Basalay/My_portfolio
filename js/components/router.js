// ВКЛАДКИ: показывает одну страницу за раз, адрес вида index.html#3d.

const pages = ["home", "about", "3d", "unity", "design", "experience", "contacts"];

function showPage(name) {
  if (!pages.includes(name)) name = "home";
  const previous = document.body.dataset.page;
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === name));
  document.querySelectorAll("[data-go]").forEach((a) => a.classList.toggle("current", a.dataset.go === name));
  if (location.hash !== "#" + name) location.hash = name;
  $("menu").classList.remove("open");
  document.body.dataset.page = name;
  if (typeof onPageChange === "function") onPageChange(name);
  scrollTo(0, 0);
  if (previous === "3d" && name !== "3d") leave3D();
  if (previous === "unity" && name !== "unity") leaveUnity();
  if (name === "3d" && previous !== "3d") enter3D();
  if (name === "home") fitName();
  observeReveals();
  reels[name]?.refresh();
}

function initRouter() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-go]");
    if (!link) return;
    e.preventDefault();
    showPage(link.dataset.go);
  });
  addEventListener("hashchange", () => showPage(location.hash.slice(1)));
  // Подгружаем 3D заранее, когда курсор подошёл к вкладке 3D
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest('[data-go="3d"]')) window.loadThree?.().catch(() => {});
  });
  showPage(location.hash.slice(1));

  // Клавиши 1–7 открывают вкладки, стрелки ← → листают их (на вкладках 3D и Unity стрелки листают ленту работ)
  addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]") || e.metaKey || e.ctrlKey || e.altKey) return;
    const page = document.body.dataset.page || "home";
    if (reels[page] && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { // на вкладках 3D и Unity стрелки листают ленту
      reels[page].onUser?.();
      return reels[page].step(e.key === "ArrowRight" ? 1 : -1);
    }
    const at = pages.indexOf(page);
    if (/^[1-7]$/.test(e.key)) showPage(pages[+e.key - 1]);
    if (e.key === "ArrowRight") showPage(pages[Math.min(at + 1, pages.length - 1)]);
    if (e.key === "ArrowLeft") showPage(pages[Math.max(at - 1, 0)]);
  });
}
