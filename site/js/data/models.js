// 3D-МОДЕЛИ ИЗ 3DS MAX
// 1. Экспортируй модель из 3ds Max в формат .glb и положи файл в папку models/
// 2. Добавь сюда блок с путём src, например: src: "models/pitcher.glb"
//
// Параметры модели (все, кроме title и src, необязательные):
//   description — подпись под окном модели
//   exposure    — яркость сцены: меньше число — темнее (по умолчанию 0.85)
//   materials   — свои материалы для частей модели (имена частей выводятся
//                 в консоли браузера: F12 → Console, строка «Части модели»).
//                 Пример:
//                 materials: { Sphere001: { color: "#edcca8", roughness: 0.45 } }
//                 Свойства: color, metalness, roughness, emissive,
//                 emissiveIntensity, opacity
//
// Загрузка по src работает, когда сайт открыт по ссылке (Vercel, GitHub Pages,
// Live Server). При открытии двойным щелчком по index.html браузер блокирует
// загрузку по пути — тогда перетащи .glb на окно модели (см. settings.js).

const models = [
  {
    title: "Свеча",
    description: "Моделирование и материалы в 3ds Max.",
    src: "models/svechechka_fixed2.glb"
  },
   {
    title: "Кувшин",
    description: "Моделирование и материалы в 3ds Max.",
    src: "models/kuvshin.glb"
  }
];
