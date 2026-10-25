// ПРОЕКТЫ
// cat — категория: "design", "research", "unity" или "max".
// image (картинка из images/) и link (ссылка) — необязательные.

// Map: ключ категории -> название для кнопки фильтра
const categories = new Map([
  ["all", "Все"],
  ["design", "Геймдизайн"],
  ["research", "Исследования"],
  ["unity", "Unity"],
  ["max", "3ds Max"]
]);

// Объект с данными и методами для работы с ними
const projects = {
  items: [
    { title: "Sledak", cat: "design", tools: ["Game design", "Taiga", "Atlassian"], status: "В разработке",
      description: "Некоммерческий командный проект по разработке игры. Моя роль — геймдизайнер: анализирую механики, дополняю детали, придумываю мини-игры, описываю логику систем и собираю референсы.", image: "", link: "" },
    { title: "Ферма с элементами выживания", cat: "design", tools: ["Core loop", "Анализ рынка", "Mood board"], status: "В разработке",
      description: "Курсовая по разработке игровой концепции: описание core loop, сеттинга и анализ рынка.", image: "", link: "" },
    { title: "Ментор на хакатоне", cat: "design", tools: ["Менторство", "Концепт", "Презентация"], status: "Готово",
      description: "Как ментор по геймдизайну помогала школьникам придумать концепт игры и подготовить презентацию.", image: "", link: "" },
    { title: "Анализ жанра выживания", cat: "research", tools: ["Core loop", "Игры на ПК"], status: "Готово",
      description: "Разбор жанра выживания на ПК: core loop и механики игр жанра.", image: "", link: "" },
    { title: "Настольная игра", cat: "design", tools: ["Механики", "Баланс", "Команда"], status: "Готово",
      description: "Переделывала настольные игры с ограничениями (убирала, меняла, добавляла механики), затем с командой создала свою игру из заданных ресурсов.", image: "", link: "" },
    { title: "Low poly в геймдизайне", cat: "research", tools: ["Научная работа", "Low poly"], status: "Готово",
      description: "Научная работа вместе с подругой: low poly как художественный стиль в геймдизайне.", image: "", link: "" },
    { title: "Pong", cat: "unity", tools: ["Unity", "C#"], status: "Готово",
      description: "2D-игра со счётом, проигрышем и кнопкой «Переиграть».", image: "", link: "" },
    { title: "Свеча", cat: "max", tools: ["3ds Max"], status: "Готово",
      description: "3D-модель свечи с материалами воска и пламени.", image: "images/svecha.jpg", link: "" }
  ],

  // Проекты выбранной категории (filter)
  byCategory(cat) {
    return cat === "all" ? this.items : this.items.filter((p) => p.cat === cat);
  },

  // Поиск проекта по названию (find)
  findByTitle(title) {
    return this.items.find((p) => p.title === title);
  },

  // Категории, в которых есть проекты (Set убирает повторы)
  usedCategories() {
    return new Set(this.items.map((p) => p.cat));
  }
};
