const profile = {
  name: "Анастасия Басалай",
  brand: "Basalay",
  brandSub: "3D Artist/game design",
  role: "Game Designer · 3D · UI",
  tagline: "Продумываю игровые механики и логику систем, создаю 3D-модели и изучаю инструменты разработки игр.",
  roles: ["Game Designer", "3D Artist", "UI в Photoshop", "Исследователь жанров"], // печатаются по очереди на главной
  photo: "images/photo.jpg",

  // Раздел «Обо мне»
  aboutTitle: "Привет, я <em>Анастасия</em>",
  intro: "Геймдизайнер и 3D-художник из Минска. Разрабатываю игровые механики и концепции, создаю 3D-модели и осваиваю разработку игр в Unity.",
  uni: "Студентка 3 курса БГУИР (ФИТиУ), специальность «Информационные системы и технологии в игровой индустрии».",
  facts: ["Минск, Беларусь", "Game Design", "3ds Max · Unity · Photoshop · Blender"],
  seeking: {
    title: "Ищу практику и стажировку",
    text: "в геймдизайне. Работаю в команде, быстро учусь и довожу идеи до документации и прототипа.",
    ribbon: "ОТКРЫТА К ПРЕДЛОЖЕНИЯМ",
    tasksTitle: "Что могу взять на себя:",
    tasksTitle: "Что могу взять на себя:",
    tasks: [
      "Создание 3D-моделей",
      "Моделирование объектов",
      "Настройка материалов и текстур",
      "Подбор визуальных референсов",
      "Разработка игровых механик",
      "Создание мини-игр",
      "Проработка логики игровых систем",
      "Анализ игровых аналогов",
      "Описание задач для команды",
      "Работа с Unity"
    ] },
  // Плитки в «Обо мне» и меню на главной: go — вкладка, на которую ведут
  focus: [
    { icon: "3D", title: "3D", text: "Модели из 3ds Max: можно вертеть, смотреть сетку и рендер.", go: "3d" },
    { icon: "C#", title: "Unity", text: "Игры и прототипы: видео, скриншоты.", go: "unity" },
    { icon: "GD", title: "Геймдизайн", text: "Механики, мини-игры, исследования жанров и UI-концепты.", go: "design" }
  ],
  tools: ["3ds Max", "Unity", "C#", "Photoshop", "Java", "C++", "Python", "Taiga", "Atlassian"],

  // Контакты (используются в окне «Связаться» и на вкладке «Контакты»)
  contacts: {
    email: "k14n10s02@gmail.com",
    phone: "+375 33 379-43-59",
    telegram: "https://t.me/nastshmvv",
    instagram: "https://instagram.com/nastshmvv?obrf=dTd6eXJ1a2pmNGpq&utm_source=qr",
    github: "https://github.com/Anastasia-Basalay"
  },

  get firstName() { return this.name.split(" ")[0]; },
  get lastName() { return this.name.split(" ").slice(1).join(" "); }
};
