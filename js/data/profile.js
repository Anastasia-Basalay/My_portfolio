const profile = {
  name: "Анастасия Басалай",
  role: "Game Designer · Unity · 3D",
  tagline: "Разбираю механики, придумываю игровые системы и мини-игры, делаю прототипы в Unity и модели в 3ds Max.",
  about:
    "Студентка 3 курса БГУИР (ФИТиУ), специальность «Информационные системы и технологии в игровой индустрии». " +
    "Занимаюсь геймдизайном: анализирую механики и жанры, описываю логику игровых систем, придумываю мини-игры и собираю референсы. " +
    "Участвую в некоммерческой командной разработке игры Sledak в роли геймдизайнера. Работаю в Unity и 3ds Max, пишу на C++, Java и Python.",
  photo: "images/photo.jpg",
  roles: ["Game Designer", "Прототипы в Unity", "3D в 3ds Max", "Анализ механик и жанров"],
  availability: "Открыта к командным проектам и стажировке в геймдеве.",
  cv: "", // путь к резюме
  email: "k14n10s02@gmail.com",
  contacts: [
    { label: "GitHub", href: "https://github.com/Anastasia-Basalay" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-name" },
    { label: "Telegram", href: "https://t.me/nastshmvv" }
  ],
  stats: [
    { value: 3, label: "курс, БГУИР" },
    { value: 3, label: "языка программирования" },
    { value: 1, label: "игра в разработке" }
  ],

  get firstName() { return this.name.split(" ")[0]; },
  get lastName() { return this.name.split(" ").slice(1).join(" "); },
  get initials() { return this.name.split(" ").map((word) => word[0]).join(""); }
};
