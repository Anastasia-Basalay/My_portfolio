// ДАННЫЕ О ТЕБЕ. Меняй значения, названия свойств (слева) не трогай.

const profile = {
  name: "Имя Фамилия",
  role: "Game Designer · 3D Artist",
  tagline: "Придумываю игровые миры: механики в Unity, модели в 3ds Max.",
  about: "Студентка, изучаю геймдизайн. Делаю игры в Unity, моделирую в 3ds Max и ищу производственную практику на весну–лето 2027.",
  photo: "images/photo.jpg",
  email: "your@email.com",
  contacts: [
    { label: "GitHub", href: "https://github.com/your-name" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-name" },
    { label: "ArtStation", href: "https://artstation.com/your-name" }
  ],
  stats: [
    { value: 5, label: "проектов" },
    { value: 3, label: "3D-модели" },
    { value: 2, label: "года опыта" }
  ],

  // Вычисляемые свойства объекта (геттеры): считаются из name
  get firstName() { return this.name.split(" ")[0]; },
  get lastName() { return this.name.split(" ").slice(1).join(" "); },
  get initials() { return this.name.split(" ").map((word) => word[0]).join(""); }
};
