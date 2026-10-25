// ТОЧКА ВХОДА: порядок запуска сайта.

// 1. Отрисовываем содержимое из данных
renderProfile();
renderSkills();
renderModels();
renderWorkflow();
renderChips();
renderProjects("all");

// 2. Запускаем 3D-окна (нужен интернет для Three.js)
document.querySelectorAll(".viewer").forEach((box) => {
  if (window.Three) createViewer(box, models[box.dataset.i].src);
  else box.insertAdjacentHTML("beforeend", "<p style='padding:20px'>3D не загрузилось: проверь интернет.</p>");
});

// 3. Включаем интерактив
initReveal();
initScrollBar();
initPointerEffects();
initMenu();
initCopyMail();
initClicks();
