// ТОЧКА ВХОДА: порядок запуска сайта.

// 1. Отрисовываем содержимое из данных
renderProfile();
renderSkills();
renderModels();
renderFacts();
renderRoles();
renderExperience();
renderChips();
renderProjects("all");

// 2. Запускаем 3D-окна (нужен интернет для Three.js)
document.querySelectorAll(".viewer").forEach((box) => {
  if (window.Three) createViewer(box, models[box.dataset.i]);
  else box.insertAdjacentHTML("beforeend", "<p style='padding:20px'>3D не загрузилось: проверь интернет.</p>");
});

// 3. Включаем интерактив
initReveal();
initScrollBar();
initPointerEffects();
initMenu();
initNameFit();
initCopyMail();
initClicks();
initTyped();
initNetwork();
initScrollSpy();
initToTop();
