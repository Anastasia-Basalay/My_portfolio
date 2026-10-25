# Сайт-портфолио

Открыть: двойной щелчок по index.html (нужен интернет).

## Структура
index.html              — каркас страницы
css/style.css           — весь дизайн (цвета в :root)
js/data/profile.js      — имя, контакты, о себе, цифры
js/data/skills.js       — навыки, бегущая строка, этапы работы
js/data/models.js       — 3D-модели (.glb из папки models/)
js/data/projects.js     — проекты
js/components/viewer.js — 3D-просмотрщик
js/components/render.js — вставка данных в страницу
js/components/effects.js— интерактив и анимации
js/main.js              — порядок запуска
images/  models/        — картинки и 3D-модели

## Что делать, чтобы добавить
Проект: новый блок в items в js/data/projects.js
3D-модель: .glb в models/ + блок в js/data/models.js
