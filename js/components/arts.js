// АНИМИРОВАННЫЕ ОБЛОЖКИ для работ без картинок: у каждой своя сценка по смыслу проекта.
// Чтобы подключить к работе, в projects.js напиши art: "sledak" | "farm" | "board" | "loop" | "lowpoly" | "mentor".
// Рисуются как SVG, подстраиваются под размер карточки и окна. Анимация описана в css/style.css (блок «ОБЛОЖКИ»).

const artSvg = (inner) => `<svg class="art-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${inner}</svg>`;
const artText = (x, y, text, cls = "a-mono", anchor = "") => `<text x="${x}" y="${y}" class="${cls}"${anchor ? ` text-anchor="${anchor}"` : ""}>${text}</text>`;

const arts = {
  // Sledak: сканируют QR-код улики и голосуют за роль
  sledak() {
    const N = 13, s = 7, x0 = 28, y0 = 44;
    let dots = "";
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const corner = (r < 5 && c < 5) || (r < 5 && c > N - 6) || (r > N - 6 && c < 5);
      if (!corner && (r * 7 + c * 11 + r * c) % 3 === 0) dots += `<rect x="${x0 + c * s}" y="${y0 + r * s}" width="${s - 1}" height="${s - 1}" rx="1"/>`;
    }
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="34" height="34" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="${x + 9}" y="${y + 9}" width="16" height="16" rx="1.5"/>`;
    const roles = ["БИОХИМИК", "СЛЕДОВАТЕЛЬ", "КРИМИНАЛИСТ", "СУДМЕДЭКСПЕРТ"];
    const chips = roles.map((t, i) => `<g class="a-chip" style="--d:${i * 2}s"><rect x="150" y="${44 + i * 27}" width="152" height="21" rx="10.5"/><circle cx="162" cy="${54.5 + i * 27}" r="3.2"/>${artText(173, 57.5 + i * 27, t, "")}</g>`).join("");
    return artSvg(`<g fill="currentColor">${dots}${finder(x0, y0)}${finder(x0 + (N - 5) * s, y0)}${finder(x0, y0 + (N - 5) * s)}</g>
      <rect class="a-scan" x="22" y="44" width="103" height="3" rx="1.5"/>
      ${artText(28, 33, "QR · УЛИКА №1")}${chips}${artText(150, 168, "ГОЛОСОВАНИЕ ЗА РОЛЬ…", "a-mono a-blink")}`);
  },

  // Ферма: смена дня и ночи, растения растут и собираются, по земле ходит гусь
  farm() {
    const plant = (x, y, k, d) => `<g transform="translate(${x} ${y})"><g class="a-sprout" style="--d:${d}s"><path d="M0 0V-${12 * k}"/><ellipse cx="-4" cy="-${12 * k}" rx="5" ry="2.4" transform="rotate(-30 -4 -${12 * k})"/><ellipse cx="4" cy="-${8 * k}" rx="5" ry="2.4" transform="rotate(30 4 -${8 * k})"/></g></g>`;
    let plants = "";
    [34, 76, 118, 160, 202, 244, 286].forEach((x, i) => (plants += plant(x, 158, 1, i * 0.35)));
    [55, 97, 139, 181, 223, 265].forEach((x, i) => (plants += plant(x, 178, 1.2, 0.2 + i * 0.35)));
    return `<div class="art-sky"></div><div class="art-night"></div>` + artSvg(`
      <g class="a-arm"><circle class="a-sun" cx="40" cy="140" r="13"/><circle class="a-moon" cx="280" cy="140" r="10"/><circle cx="284" cy="137" r="2.4" fill="#b9c2ee"/></g>
      <rect x="-400" y="140" width="1120" height="200" fill="#2d2019"/><path d="M-400 162H720M-400 186H720" stroke="#4a3426" stroke-width="2"/>
      ${plants}
      <g class="a-goose"><g transform="translate(0 140)"><g class="a-bob"><ellipse cx="0" cy="-6" rx="10" ry="5.5" fill="#f5eef3"/><path d="M7 -8q6-8 4-14" stroke="#f5eef3" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="11.5" cy="-23" r="3.2" fill="#f5eef3"/><path d="M14 -23l5 1.4-5 1.2z" fill="#ff9d2e"/><circle cx="12" cy="-23.6" r=".8" fill="#222"/></g></g></g>`);
  },

  // Лютый забив: поле, две фигуры идут навстречу, кость, баррикада
  board() {
    let cells = "";
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) cells += `<rect class="a-cell${(r + c) % 2 ? " b" : ""}" x="${70 + c * 30}" y="${24 + r * 30}" width="30" height="30"/>`;
    return artSvg(`${cells}
      <rect class="a-start p" x="70" y="114" width="30" height="30"/><rect class="a-start g" x="220" y="24" width="30" height="30"/>
      <rect class="a-barr" x="163" y="81" width="24" height="6" rx="2"/>
      <circle class="a-pawn p" cx="85" cy="129" r="9"/><circle class="a-pawn g" cx="235" cy="39" r="9"/>
      <g transform="translate(38 62)"><g class="a-dice"><rect x="-17" y="-17" width="34" height="34" rx="7"/>
        <circle class="a-p1" r="3.4"/>
        <g class="a-p3"><circle cx="-9" cy="-9" r="3"/><circle r="3"/><circle cx="9" cy="9" r="3"/></g>
        <g class="a-p5"><circle cx="-9" cy="-9" r="3"/><circle cx="9" cy="-9" r="3"/><circle r="3"/><circle cx="-9" cy="9" r="3"/><circle cx="9" cy="9" r="3"/></g></g></g>
      ${artText(160, 170, "ШАГ ИЛИ КОСТЬ → БАРРИКАДА", "a-mono", "middle")}`);
  },

  // Анализ жанра: core loop по кругу, в центре телефон (мобильная платформа)
  loop() {
    const nodes = [["ИССЛЕДОВАНИЕ", 160, 38], ["ДОБЫЧА", 220, 98], ["ВЫЖИВАНИЕ", 160, 158], ["РАЗВИТИЕ", 100, 98]];
    return artSvg(`<circle class="a-ring" cx="160" cy="98" r="60"/>
      ${nodes.map(([t, x, y], i) => `<g class="a-node" style="--d:${i * 2}s"><rect x="${x - 42}" y="${y - 10}" width="84" height="20" rx="10"/>${artText(x, y + 3, t, "a-nt", "middle")}</g>`).join("")}
      <g class="a-orbit"><circle cx="160" cy="38" r="4.5"/></g>
      <rect class="a-phone" x="147" y="73" width="26" height="50" rx="5"/><rect class="a-screen" x="151" y="79" width="18" height="34" rx="2"/><circle cx="160" cy="118" r="1.6" fill="currentColor"/>
      ${artText(160, 191, "CORE LOOP · MOBILE", "a-mono", "middle")}`);
  },

  // Low poly: лодка из треугольников; грани гаснут, остаётся один силуэт, и лодку всё равно узнают
  lowpoly() {
    const tri = (pts, c) => `<polygon class="a-tri" style="--c:${c}" points="${pts}"/>`;
    let wave = "M20 172";
    for (let x = 20; x < 300; x += 20) wave += `l10-7 10 7`;
    return artSvg(`<g class="a-boat"><path class="a-mast" d="M160 34V132"/>
      ${tri("160,38 98,122 160,80", "#ffd9ec")}${tri("160,80 98,122 160,122", "#ff9ad5")}
      ${tri("168,50 220,122 168,95", "#fff0f7")}${tri("168,95 220,122 168,122", "#ffc6e3")}
      ${tri("86,130 160,130 112,160", "#e7c88f")}${tri("160,130 112,160 160,160", "#c9a56a")}${tri("160,130 234,130 160,160", "#f0d9ab")}${tri("234,130 160,160 210,160", "#b8905a")}</g>
      <path class="a-water" d="${wave}"/>
      ${artText(160, 190, "С ГРАНЯМИ", "a-mono a-t1", "middle")}${artText(160, 190, "ТОЛЬКО СИЛУЭТ · ≈85% УЗНАЮТ ЛОДКУ", "a-mono a-t2", "middle")}`);
  },

  // Ментор: идея загорается, команды связаны с наставником, в конце появляется слайд презентации
  mentor() {
    const team = [[82, 64], [238, 64], [82, 142], [238, 142]];
    return artSvg(`${team.map(([x, y]) => `<path class="a-flow" d="M160 100L${x} ${y}"/>`).join("")}
      ${team.map(([x, y], i) => `<circle class="a-team" style="--d:${i * 0.6}s" cx="${x}" cy="${y}" r="11"/>`).join("")}
      <circle class="a-mentor" cx="160" cy="100" r="21"/>${artText(160, 103, "МЕНТОР", "a-mono", "middle")}
      <g transform="translate(160 36)"><path class="a-rays" d="M0-15V-21M-13-8L-18-12M13-8L18-12"/><circle class="a-bulb" r="9"/><rect x="-4" y="9" width="8" height="5" rx="1.5" fill="#8a7a55"/></g>
      <g transform="translate(125 160)"><rect class="a-slide" width="70" height="26" rx="4"/><path class="a-sl" d="M9 8H46M9 14H58M9 20H34"/></g>`);
  }
};
