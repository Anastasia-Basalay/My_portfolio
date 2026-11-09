# Сайт-портфолио

Открыть: двойной щелчок по index.html (нужен интернет: подгружаются шрифты и Three.js).
Вкладки: Главная, Обо мне, 3D, Unity, Геймдизайн, Опыт, Контакты. Клавиши 1–7 переключают вкладки; стрелки ← → листают вкладки, а на вкладках 3D и Unity листают ленту работ.

## Где что менять (всё содержимое — в js/data/)
js/data/profile.js      имя, «Обо мне», «Ищу стажировку», контакты (почта, телефон, Telegram, Instagram, GitHub)
js/data/projects.js     ВСЕ работы: у каждой есть tab: "3d", "unity" или "design"
js/data/models.js       файлы 3D-моделей (.glb лежат в models/) и их материалы
js/data/experience.js   опыт и образование, бегущая строка
js/data/settings.js     allowModelDrop: перед публикацией поставь false
images/ videos/ games/ models/   фото, видео, сборки Unity WebGL, 3D-модели
css/style.css           оформление (цвета и шрифты в :root)
js/components/          код (трогать не нужно)

## Как добавить работу
Блок в items в js/data/projects.js. Все поля описаны в начале файла.
- Unity-игра: tab: "unity", cover (скриншот), video (видео), demo (сборка WebGL: games/название/index.html)
- Геймдизайн: tab: "design", kind: "game" / "research" / "ui", facts, bars, flow, stages, gallery, proof
- 3D-модель: .glb в models/, блок в models.js, и работа с tab: "3d", model: номер, cover и render (картинка рендера)

## Публикация (GitHub + Vercel)
Загружай в репозиторий СОДЕРЖИМОЕ папки (index.html, css, js, images, models...), а не саму папку.
Перед публикацией в js/data/settings.js поставь allowModelDrop: false.

## Лента работ (вкладки 3D и Unity)
Работы в ленте появляются сами, как только в projects.js добавляется блок с tab: "3d" или tab: "unity". Никаких заглушек «скоро» нет.
Ленту можно листать свайпом, мышью (потянуть), стрелками, кнопками и точками. Одна работа показывается крупно, несколько собираются в «Cover Flow».
Игра с видео (video) или сборкой (demo) открывается в большом окне: видео занимает почти всю ширину и открывается во весь экран.

## Обложки геймдизайна
Для работ без картинок есть анимированные обложки по смыслу проекта: art: "sledak", "farm", "board", "loop", "lowpoly", "mentor" (js/components/arts.js).
Своя картинка (cover или gallery) главнее: если она есть, анимация не показывается.
