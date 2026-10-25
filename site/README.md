# Сайт-портфолио

Открыть: двойной щелчок по index.html (нужен интернет — подгружаются Three.js и шрифты).
3D-модели при этом берутся из встроенной копии (js/data/model-data.js).

## Новая 3D-модель
1. Положи .glb в models/ и добавь блок в js/data/models.js (между блоками — запятая!)
2. Запусти:  python build_models.py   (обновит встроенные копии для запуска двойным щелчком)
На хостинге (Vercel/GitHub Pages) шаг 2 не обязателен, но безвреден.

## Структура
index.html                 каркас страницы
css/style.css              весь дизайн (цвета и шрифты в :root)
js/data/settings.js        общие настройки (перетаскивание моделей)
js/data/profile.js         имя, почта, контакты, «обо мне», цифры
js/data/skills.js          навыки, бегущая строка, опыт и образование
js/data/models.js          3D-модели
js/data/projects.js        проекты
js/data/work.js            «Чем могу помочь» и этапы работы
build_models.py            собирает встроенные копии моделей
js/components/viewer.js    3D-просмотрщик
js/components/render.js    вставка данных в страницу
js/components/effects.js   интерактив и анимации
js/main.js                 порядок запуска
images/                    фото (photo.jpg), скриншоты, рендеры
models/                    модели .glb

## Как менять содержимое
Контент меняется только в js/data/. Код в js/components/ трогать не нужно.
- Своё имя, почта, ссылки: js/data/profile.js
- Новый проект: блок в items в js/data/projects.js
- Новая 3D-модель: .glb в models/ + блок в js/data/models.js
- Фото: положи images/photo.jpg

## Публикация (GitHub + Vercel)
Загружай в репозиторий СОДЕРЖИМОЕ папки (index.html, css, js, images, models), а не саму папку.
Перед публикацией в js/data/settings.js поставь allowModelDrop: false.
