// ПРОЕКТЫ
// cat — категория: "unity", "max" или "design".
// image (картинка из images/) и link (ссылка) — необязательные.

// Map: ключ категории -> название для кнопки фильтра
const categories = new Map([
  ["all", "Все"],
  ["unity", "Unity"],
  ["max", "3ds Max"],
  ["design", "Геймдизайн"]
]);

// Объект с данными и методами для работы с ними
const projects = {
  items: [
    { title: "Pong", cat: "unity", tools: ["Unity", "C#"], status: "Готово", description: "2D-игра со счётом, проигрышем и кнопкой «Переиграть».", image: "", link: "" },
    { title: "Ферма с выживанием", cat: "design", tools: ["Mood board", "GDD"], status: "В разработке", description: "Сеттинг и мудборд игры «Ферма с элементами выживания».", image: "", link: "" },
    { title: "Медный кувшин", cat: "max", tools: ["3ds Max", "Arnold"], status: "Готово", description: "Модель с материалами и финальными рендерами.", image: "", link: "" }
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
