// ТОЧКА ВХОДА: порядок запуска сайта.

// 1. Отрисовываем содержимое из данных
renderBrand();
renderHome();
renderAbout();
render3D();
renderUnity();
renderDesign();
renderExperience();
renderContacts();

// 2. Включаем интерактив
initBackdrop();
initReveal();
initScrollBar();
initPointerEffects();
initMenu();
initClicks();
initNameFit();
initTyped();
initSlideshows();

// 3. Открываем нужную вкладку (по адресу или главную)
initRouter();
