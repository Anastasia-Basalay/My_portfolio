// ФОН И ДЕКОР.
//  • сетка из треугольников в стиле low poly: её подсвечивает курсор (на телефоне свет плавает сам),
//    цвет подсветки меняется от вкладки к вкладке;
//  • мягкие цветные пятна и плавающие значки;
//  • кристалл на главной и кубик на вкладке «Контакты» (мышь двигает их, как в параллаксе);
// Всё лёгкое: на телефоне меньше точек и 30 кадров, при «уменьшении движения» в системе фон не анимируется.

const backdrop = { tint: [255, 46, 147], target: [255, 46, 147], started: false };
const pageTint = { home: [255, 46, 147], about: [231, 200, 143], "3d": [255, 46, 147], unity: [231, 200, 143], design: [255, 154, 213], experience: [231, 200, 143], contacts: [255, 46, 147] };

function onPageChange(name) {
  backdrop.target = pageTint[name] || pageTint.home;
}



const dieHtml = () => {
  const pips = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
  const face = (n, cls) => `<div class="face ${cls}">${pips[n].map((p) => `<b style="grid-area:${Math.ceil(p / 3)}/${((p - 1) % 3) + 1}"></b>`).join("")}</div>`;
  return `<button class="die3d" id="rollDie" type="button" aria-label="Бросить кубик"><span class="cube">${face(1, "fr")}${face(6, "bk")}${face(3, "rt")}${face(4, "lf")}${face(2, "tp")}${face(5, "bt")}</span></button>`;
};

function initBackdrop() {
  const touch = matchMedia("(hover:none)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  const bg = document.createElement("div");
  bg.id = "bg";
  bg.innerHTML = `<span class="blob b1"></span><span class="blob b2"></span><canvas id="mesh"></canvas><div class="deco" id="deco"></div>`;
  document.body.prepend(bg);

  // плавающие значки
  const glyphs = ["◆", "+", "▲", "●", "✦", "◇"];
  $("deco").innerHTML = Array.from({ length: touch ? 7 : 13 }, (_, i) =>
    `<i style="left:${rand(2, 96).toFixed(1)}%;top:${rand(8, 95).toFixed(1)}%;font-size:${rand(10, 24).toFixed(0)}px;--d:${rand(16, 32).toFixed(1)}s;--dl:-${rand(0, 30).toFixed(1)}s;--c:${i % 3 ? "var(--gold)" : "var(--pink)"}">${glyphs[i % glyphs.length]}</i>`).join("");

  // Кубик на вкладке «Контакты»: нажми, чтобы бросить.
  $("p-contacts").insertAdjacentHTML("beforeend", dieHtml());

  const die = $("rollDie");

  die.addEventListener("click", () => {
    const turns = () => 720 + Math.floor(Math.random() * 4) * 360;
    const rx = Math.floor(Math.random() * 4) * 90;
    const ry = Math.floor(Math.random() * 4) * 90;

    die.style.setProperty("--rx", `${turns() + rx}deg`);
    die.style.setProperty("--ry", `${turns() + ry}deg`);

    die.classList.remove("rolling");
    void die.offsetWidth;
    die.classList.add("rolling");
  });

  // сетка из треугольников
  const cv = $("mesh"), ctx = cv.getContext("2d");
  const dpr = Math.min(devicePixelRatio, touch ? 1 : 1.5);
  let W = 0, H = 0, pts = [], tris = [], frame = 0;
  const mouse = { x: innerWidth * 0.6, y: innerHeight * 0.4, tx: 0, ty: 0, used: false };
  const par = { x: 0, y: 0, tx: 0, ty: 0 };

  function build() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const size = touch ? 92 : 112;
    const cols = Math.ceil(W / size) + 3, rows = Math.ceil(H / size) + 3;
    pts = []; tris = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      pts.push({ bx: (c - 1) * size + rand(-0.28, 0.28) * size, by: (r - 1) * size + rand(-0.28, 0.28) * size, ph: rand(0, 6.28), sp: rand(0.3, 0.7), x: 0, y: 0 });
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
      const i = r * cols + c;
      tris.push([i, i + 1, i + cols, rand(0.45, 1)], [i + 1, i + cols + 1, i + cols, rand(0.45, 1)]);
    }
  }

  function draw(now) {
    if (!calm) requestAnimationFrame(draw);
    if (document.hidden || (touch && frame++ % 2)) return; // на телефоне 30 кадров в секунду
    const t = now / 1000;
    if (mouse.used) { mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08; }
    else { mouse.x = W * (0.5 + 0.34 * Math.sin(t * 0.22)); mouse.y = H * (0.45 + 0.28 * Math.sin(t * 0.31 + 1.2)); }
    for (let k = 0; k < 3; k++) backdrop.tint[k] += (backdrop.target[k] - backdrop.tint[k]) * 0.04;
    const [cr, cg, cb] = backdrop.tint.map(Math.round);
    for (const p of pts) { p.x = p.bx + (calm ? 0 : Math.sin(t * p.sp + p.ph) * 9); p.y = p.by + (calm ? 0 : Math.cos(t * p.sp * 0.9 + p.ph) * 9); }

    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 0.7;
    const two = 2 * (Math.max(W, H) * 0.22) ** 2;
    for (const [a, b, c, k] of tris) {
      const A = pts[a], B = pts[b], C = pts[c];
      const d2 = ((A.x + B.x + C.x) / 3 - mouse.x) ** 2 + ((A.y + B.y + C.y) / 3 - mouse.y) ** 2;
      const L = Math.exp(-d2 / two);
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${(0.012 + k * 0.02 + L * 0.16 * k).toFixed(3)})`; ctx.fill();
      ctx.strokeStyle = `rgba(231,200,143,${(0.025 + L * 0.15).toFixed(3)})`; ctx.stroke();
    }

    // параллакс: кристалл и значки слегка следуют за мышью
    par.x += (par.tx - par.x) * 0.06; par.y += (par.ty - par.y) * 0.06;

    $("deco").style.transform = `translate(${(par.x * -10).toFixed(1)}px,${(par.y * -8).toFixed(1)}px)`;
  }

  build();
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    mouse.used = true; mouse.tx = e.clientX; mouse.ty = e.clientY;
    par.tx = (e.clientX / innerWidth) * 2 - 1; par.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  let timer;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (innerWidth !== W || Math.abs(innerHeight - H) > 160) { build(); if (calm) draw(performance.now()); } }, 200);
  });
  requestAnimationFrame(draw);
  backdrop.started = true;
}
