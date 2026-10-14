/* ============================================================
   Lumina — Premium Dashboard (vanilla JS, zero-dependency)
   ============================================================ */
"use strict";

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const svgNS = "http://www.w3.org/2000/svg";

const rupiah = (n) =>
  "Rp" + Math.round(n).toLocaleString("id-ID");

const rupiahShort = (n) => {
  if (n >= 1e9) return "Rp" + (n / 1e9).toFixed(1).replace(".", ",") + " M";
  if (n >= 1e6) return "Rp" + (n / 1e6).toFixed(1).replace(".", ",") + " jt";
  if (n >= 1e3) return "Rp" + Math.round(n / 1e3) + " rb";
  return rupiah(n);
};

const el = (tag, attrs = {}, parent) => {
  const node = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
};

const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const lerp = (a, b, t) => a + (b - a) * t;

/* Smooth number counter */
function animateCount(node, target, { format = (v) => Math.round(v).toLocaleString("id-ID"), duration = 1100 } = {}) {
  const start = performance.now();
  const from = 0;
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = format(lerp(from, target, eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Catmull-Rom → bezier smooth path */
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/* ============================================================
   Data
   ============================================================ */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const DATA = {
  "7d": {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    revenue: [18.2, 21.4, 19.6, 24.8, 27.1, 23.5, 29.4].map((v) => v * 1e6),
    target: [20, 20.5, 21, 21.5, 22, 22.5, 23].map((v) => v * 1e6),
    bars: [142, 168, 155, 190, 214, 176, 231],
    kpis: [
      { label: "Pendapatan", value: rupiah(164e6), raw: 164e6, fmt: rupiahShort, delta: 12.4, up: true, color: "#38bdf8", bg: "rgba(56,189,248,.14)", glow: "rgba(56,189,248,.45)", icon: "coin", spark: [12, 18, 15, 22, 27, 23, 29] },
      { label: "Pesanan", value: "1.274", raw: 1274, fmt: (v) => Math.round(v).toLocaleString("id-ID"), delta: 8.1, up: true, color: "#34d399", bg: "rgba(52,211,153,.13)", glow: "rgba(52,211,153,.4)", icon: "bag", spark: [60, 74, 68, 88, 96, 84, 104] },
      { label: "Pelanggan Aktif", value: "8.912", raw: 8912, fmt: (v) => Math.round(v).toLocaleString("id-ID"), delta: 4.6, up: true, color: "#60a5fa", bg: "rgba(96,165,250,.14)", glow: "rgba(96,165,250,.4)", icon: "users", spark: [70, 72, 75, 74, 78, 80, 83] },
      { label: "Tingkat Konversi", value: "4,8%", raw: 4.8, fmt: (v) => v.toFixed(1).replace(".", ",") + "%", delta: 0.7, up: false, color: "#fbbf24", bg: "rgba(251,191,36,.14)", glow: "rgba(251,191,36,.4)", icon: "target", spark: [5.2, 5.0, 4.9, 5.1, 4.8, 4.9, 4.8] },
    ],
  },
  "30d": {
    labels: ["1 Okt", "5 Okt", "10 Okt", "15 Okt", "20 Okt", "25 Okt", "30 Okt"],
    revenue: [412e6, 468e6, 441e6, 523e6, 562e6, 608e6, 664e6],
    target: [430e6, 450e6, 470e6, 495e6, 520e6, 548e6, 575e6],
    bars: [642, 718, 690, 812, 904, 768, 934],
    kpis: [
      { label: "Pendapatan", value: rupiah(3408e6), raw: 3408e6, fmt: rupiahShort, delta: 18.2, up: true, color: "#38bdf8", bg: "rgba(56,189,248,.14)", glow: "rgba(56,189,248,.45)", icon: "coin", spark: [38, 44, 41, 52, 56, 61, 66] },
      { label: "Pesanan", value: "5.470", raw: 5470, fmt: (v) => Math.round(v).toLocaleString("id-ID"), delta: 9.8, up: true, color: "#34d399", bg: "rgba(52,211,153,.13)", glow: "rgba(52,211,153,.4)", icon: "bag", spark: [320, 360, 348, 410, 452, 390, 470] },
      { label: "Pelanggan Aktif", value: "24.108", raw: 24108, fmt: (v) => Math.round(v).toLocaleString("id-ID"), delta: 6.3, up: true, color: "#60a5fa", bg: "rgba(96,165,250,.14)", glow: "rgba(96,165,250,.4)", icon: "users", spark: [20, 21, 22, 21.5, 23, 23.6, 24.1] },
      { label: "Tingkat Konversi", value: "5,2%", raw: 5.2, fmt: (v) => v.toFixed(1).replace(".", ",") + "%", delta: 1.4, up: true, color: "#fbbf24", bg: "rgba(251,191,36,.14)", glow: "rgba(251,191,36,.4)", icon: "target", spark: [4.4, 4.6, 4.5, 4.9, 5.0, 5.1, 5.2] },
    ],
  },
  "12m": {
    labels: MONTHS,
    revenue: [2.1e9, 2.4e9, 2.2e9, 2.8e9, 3.1e9, 2.9e9, 3.4e9, 3.7e9, 3.5e9, 4.1e9, 4.4e9, 4.9e9],
    target: [2.3e9, 2.5e9, 2.7e9, 2.9e9, 3.1e9, 3.3e9, 3.5e9, 3.7e9, 3.9e9, 4.1e9, 4.3e9, 4.5e9],
    bars: [2840, 3120, 2960, 3480, 3820, 3540, 4010],
    kpis: [
      { label: "Pendapatan", value: rupiah(39.5e9), raw: 39.5e9, fmt: rupiahShort, delta: 24.7, up: true, color: "#38bdf8", bg: "rgba(56,189,248,.14)", glow: "rgba(56,189,248,.45)", icon: "coin", spark: [21, 24, 22, 28, 31, 29, 34, 37, 35, 41, 44, 49] },
      { label: "Pesanan", value: "62.840", raw: 62840, fmt: (v) => Math.round(v).toLocaleString("id-ID"), delta: 15.9, up: true, color: "#34d399", bg: "rgba(52,211,153,.13)", glow: "rgba(52,211,153,.4)", icon: "bag", spark: [4.1, 4.6, 4.3, 5.2, 5.8, 5.4, 6.2, 6.8, 6.4, 7.4, 8.0, 8.9] },
      { label: "Pelanggan Aktif", value: "86.420", raw: 86420, fmt: (v) => Math.round(v).toLocaleString("id-ID"), delta: 11.2, up: true, color: "#60a5fa", bg: "rgba(96,165,250,.14)", glow: "rgba(96,165,250,.4)", icon: "users", spark: [58, 62, 66, 64, 70, 74, 72, 78, 81, 83, 85, 86] },
      { label: "Tingkat Konversi", value: "5,6%", raw: 5.6, fmt: (v) => v.toFixed(1).replace(".", ",") + "%", delta: 2.1, up: true, color: "#fbbf24", bg: "rgba(251,191,36,.14)", glow: "rgba(251,191,36,.4)", icon: "target", spark: [4.2, 4.4, 4.3, 4.7, 4.9, 4.8, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6] },
    ],
  },
};

const DONUT = [
  { name: "Langganan Pro", value: 1480e6, color: "#38bdf8" },
  { name: "Marketplace", value: 980e6, color: "#34d399" },
  { name: "Enterprise", value: 620e6, color: "#2563eb" },
  { name: "Afiliasi", value: 328e6, color: "#fbbf24" },
];

const GOALS = [
  { name: "Target Pendapatan Q4", value: 82, display: "82%", color: "linear-gradient(90deg,#38bdf8,#22d3ee)" },
  { name: "Akuisisi Pelanggan Baru", value: 67, display: "1.340 / 2.000", color: "linear-gradient(90deg,#34d399,#6ee7b7)" },
  { name: "Retensi Pelanggan", value: 94, display: "94%", color: "linear-gradient(90deg,#2563eb,#60a5fa)" },
  { name: "NPS Skor", value: 71, display: "71 / 100", color: "linear-gradient(90deg,#fbbf24,#fde68a)" },
];

const ORDERS = [
  { name: "Nadia Prameswari", mail: "nadia@studio.co", initials: "NP", hue: 262, order: "#LMN-24190", date: "13 Okt, 09:41", amount: 12400000, status: "success", label: "Selesai" },
  { name: "Rizky Mahendra", mail: "rizky.m@corp.id", initials: "RM", hue: 160, order: "#LMN-24189", date: "13 Okt, 08:55", amount: 3750000, status: "warning", label: "Diproses" },
  { name: "Sinta Ayu Larasati", mail: "sinta@laras.design", initials: "SA", hue: 20, order: "#LMN-24188", date: "12 Okt, 21:12", amount: 8920000, status: "success", label: "Selesai" },
  { name: "Bagas Nugroho", mail: "bagas.n@tech.id", initials: "BN", hue: 200, order: "#LMN-24187", date: "12 Okt, 17:03", amount: 2150000, status: "danger", label: "Gagal" },
  { name: "Citra Wulandari", mail: "citra@wulan.id", initials: "CW", hue: 320, order: "#LMN-24186", date: "12 Okt, 14:47", amount: 15600000, status: "success", label: "Selesai" },
];

const FEED = [
  { icon: "coin", color: "#34d399", text: "<strong>Nadia Prameswari</strong> menyelesaikan pembayaran <strong>Rp12,4 jt</strong>", time: "3 menit lalu" },
  { icon: "users", color: "#0ea5e9", text: "<strong>184 pelanggan baru</strong> mendaftar hari ini", time: "26 menit lalu" },
  { icon: "target", color: "#fbbf24", text: "Kampanye <strong>Q4 Launch</strong> mencapai 71% target", time: "1 jam lalu" },
  { icon: "star", color: "#38bdf8", text: "Skor ratah peringkat produk naik ke <strong>4,8 ★</strong>", time: "3 jam lalu" },
  { icon: "shield", color: "#f87171", text: "3 percobaan login mencurigakan diblokir", time: "5 jam lalu" },
];

const AVATAR_HUES = { NP: 262, RM: 160, SA: 20, BN: 200, CW: 320 };

/* ============================================================
   Icons
   ============================================================ */
const ICONS = {
  coin: '<path d="M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3zm9 6v6c0 1.66-4.03 3-9 3s-9-1.34-9-3V9m18 6v6c0 1.66-4.03 3-9 3s-9-1.34-9-3v-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  bag: '<path d="M5 7h14l-1.2 11.2A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.8L5 7zm4 0V5.5a3 3 0 0 1 6 0V7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  users: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  target: '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
  star: '<path d="M12 4l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.5 12l1.8 1.8 3.4-3.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
};

const iconSvg = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${ICONS[name] || ICONS.coin}</svg>`;

/* ============================================================
   KPI cards
   ============================================================ */
function renderKPIs(kpis, animate = true) {
  const grid = $("#kpiGrid");
  grid.innerHTML = "";

  kpis.forEach((k, i) => {
    const card = document.createElement("article");
    card.className = "kpi-card reveal";
    card.style.animationDelay = `${i * 90}ms`;
    card.style.setProperty("--kpi-color", k.color);
    card.style.setProperty("--kpi-bg", k.bg);
    card.style.setProperty("--kpi-glow", k.glow);

    const trendIcon = k.up ? "▲" : "▼";
    card.innerHTML = `
      <div class="kpi-top">
        <div class="kpi-icon">${iconSvg(k.icon)}</div>
      </div>
      <div class="kpi-value">0</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-bottom">
        <span class="kpi-trend ${k.up ? "up" : "down"}">${trendIcon} ${Math.abs(k.delta)}% <small>vs periode lalu</small></span>
        <div class="kpi-spark"></div>
      </div>
    `;
    grid.appendChild(card);

    const valueNode = $(".kpi-value", card);
    if (animate) animateCount(valueNode, k.raw, { format: k.fmt, duration: 1200 });
    else valueNode.textContent = k.fmt(k.raw);

    drawSparkline($(".kpi-spark", card), k.spark, k.color);
  });
}

function drawSparkline(container, values, color) {
  container.innerHTML = "";
  const W = 96, H = 38, pad = 3;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none" });
  container.appendChild(svg);

  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (W - pad * 2),
    y: H - pad - ((v - min) / span) * (H - pad * 2),
  }));

  const defs = el("defs", {}, svg);
  const grad = el("linearGradient", { id: `spark-${Math.random().toString(36).slice(2)}`, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  const gid = grad.getAttribute("id");
  el("stop", { offset: "0%", "stop-color": color, "stop-opacity": .35 }, grad);
  el("stop", { offset: "100%", "stop-color": color, "stop-opacity": 0 }, grad);

  const line = smoothPath(pts);
  el("path", { d: `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`, fill: `url(#${gid})` }, svg);
  const p = el("path", { d: line, fill: "none", stroke: color, "stroke-width": 2, "stroke-linecap": "round" }, svg);

  // Entrance draw animation
  const len = p.getTotalLength();
  p.style.strokeDasharray = len;
  p.style.strokeDashoffset = len;
  p.getBoundingClientRect();
  p.style.transition = "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)";
  p.style.strokeDashoffset = "0";

  // Glow dot at the end
  el("circle", { cx: pts[pts.length - 1].x, cy: pts[pts.length - 1].y, r: 2.6, fill: color }, svg);
}

/* ============================================================
   Revenue area chart
   ============================================================ */
let currentRange = "30d";
let revState = null;

function renderRevenueChart(rangeKey) {
  const container = $("#revenueChart");
  const tooltip = $("#revTooltip");
  $$("svg", container).forEach((s) => s.remove());

  const d = DATA[rangeKey];
  const W = 760, H = 280;
  const pad = { top: 18, right: 14, bottom: 30, left: 56 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none" }, container);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  // Defs: gradients
  const defs = el("defs", {}, svg);
  const areaGrad = el("linearGradient", { id: "areaGrad", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: "0%", "stop-color": cssVar("--accent") || "#38bdf8", "stop-opacity": .38 }, areaGrad);
  el("stop", { offset: "100%", "stop-color": cssVar("--accent") || "#38bdf8", "stop-opacity": 0 }, areaGrad);
  const lineGrad = el("linearGradient", { id: "lineGrad", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  el("stop", { offset: "0%", "stop-color": "#38bdf8" }, lineGrad);
  el("stop", { offset: "100%", "stop-color": "#22d3ee" }, lineGrad);

  const all = [...d.revenue, ...d.target];
  const max = Math.max(...all) * 1.1;
  const min = Math.min(...all) * 0.75;

  const xAt = (i) => pad.left + (i / (d.revenue.length - 1)) * innerW;
  const yAt = (v) => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  // Grid + Y labels
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const v = min + ((max - min) / ticks) * i;
    const y = yAt(v);
    el("line", { class: "grid-line", x1: pad.left, y1: y, x2: W - pad.right, y2: y }, svg);
    const label = el("text", { class: "axis-label", x: pad.left - 10, y: y + 3.5, "text-anchor": "end" }, svg);
    label.textContent = rupiahShort(v);
  }

  // X labels
  d.labels.forEach((lab, i) => {
    const t = el("text", { class: "axis-label", x: xAt(i), y: H - 8, "text-anchor": "middle" }, svg);
    t.textContent = lab;
  });

  // Target line
  const targetPts = d.target.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  el("path", { class: "line-target", d: smoothPath(targetPts) }, svg);

  // Area + line
  const pts = d.revenue.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const lineD = smoothPath(pts);
  const area = el("path", { class: "area-path", d: `${lineD} L ${pts[pts.length - 1].x} ${pad.top + innerH} L ${pts[0].x} ${pad.top + innerH} Z` }, svg);
  const line = el("path", { class: "line-path", d: lineD }, svg);

  const len = line.getTotalLength();
  line.style.setProperty("--len", len);
  line.style.strokeDasharray = len;
  requestAnimationFrame(() => {
    line.classList.add("animate");
    area.classList.add("animate");
  });

  // Hover layer
  const hoverLine = el("line", { class: "hover-line", x1: 0, y1: pad.top, x2: 0, y2: pad.top + innerH, opacity: 0 }, svg);
  const hoverDot = el("circle", { class: "hover-dot", r: 5, opacity: 0 }, svg);
  const hit = el("rect", { x: pad.left, y: pad.top, width: innerW, height: innerH, fill: "transparent", style: "cursor:crosshair" }, svg);

  revState = { pts, d, svg, hoverLine, hoverDot, tooltip, container };

  const onMove = (evt) => {
    const rect = svg.getBoundingClientRect();
    const px = ((evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left) * (W / rect.width);
    let nearest = 0, best = Infinity;
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - px);
      if (dist < best) { best = dist; nearest = i; }
    });
    const p = pts[nearest];
    hoverLine.setAttribute("x1", p.x);
    hoverLine.setAttribute("x2", p.x);
    hoverLine.setAttribute("opacity", 1);
    hoverDot.setAttribute("cx", p.x);
    hoverDot.setAttribute("cy", p.y);
    hoverDot.setAttribute("opacity", 1);

    tooltip.hidden = false;
    tooltip.style.left = (p.x / W) * rect.width + "px";
    tooltip.style.top = (p.y / H) * rect.height + "px";
    tooltip.innerHTML = `<span class="tt-label">${d.labels[nearest]}</span><span class="tt-value">${rupiah(d.revenue[nearest])}</span>`;
  };

  const onLeave = () => {
    hoverLine.setAttribute("opacity", 0);
    hoverDot.setAttribute("opacity", 0);
    tooltip.hidden = true;
  };

  hit.addEventListener("mousemove", onMove);
  hit.addEventListener("mouseleave", onLeave);
  hit.addEventListener("touchmove", onMove, { passive: true });
  hit.addEventListener("touchend", onLeave);
}

/* ============================================================
   Donut chart
   ============================================================ */
function renderDonut() {
  const wrap = $("#donutChart");
  const legend = $("#donutLegend");
  const total = DONUT.reduce((s, x) => s + x.value, 0);

  wrap.querySelectorAll("svg").forEach((s) => s.remove());
  legend.innerHTML = "";

  const svg = el("svg", { viewBox: "0 0 200 200" }, wrap);
  const R = 76, C = 2 * Math.PI * R;
  const gap = 6;

  let offset = 0;
  DONUT.forEach((seg, i) => {
    const frac = seg.value / total;
    const dashLen = frac * C - gap;
    const circle = el("circle", {
      class: "donut-seg",
      cx: 100, cy: 100, r: R,
      stroke: seg.color,
      "stroke-dasharray": `0 ${C}`,
      "stroke-dashoffset": -offset,
    }, svg);

    // Animate in
    setTimeout(() => {
      circle.style.transition = "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)";
      circle.setAttribute("stroke-dasharray", `${dashLen} ${C}`);
    }, 220 + i * 160);

    offset += frac * C;

    // Hover interactions
    const li = document.createElement("li");
    li.innerHTML = `
      <i class="dot" style="background:${seg.color}"></i>
      <span class="lg-name">${seg.name}</span>
      <span class="lg-val">${rupiahShort(seg.value)}</span>
    `;
    li.addEventListener("mouseenter", () => {
      wrap.classList.add("has-hover");
      circle.style.strokeWidth = 21;
      $(".donut-total", wrap.parentElement).textContent = rupiahShort(seg.value);
    });
    li.addEventListener("mouseleave", () => {
      wrap.classList.remove("has-hover");
      circle.style.strokeWidth = "";
      $(".donut-total", wrap.parentElement).textContent = rupiahShort(total);
    });
    legend.appendChild(li);
  });

  animateCount($("#donutTotal"), total, { format: rupiahShort, duration: 1400 });
}

/* ============================================================
   Bar chart
   ============================================================ */
function renderBars(rangeKey) {
  const wrap = $("#barChart");
  wrap.innerHTML = "";
  const vals = DATA[rangeKey].bars;
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const max = Math.max(...vals) * 1.08;
  const todayIdx = vals.indexOf(Math.max(...vals));

  vals.forEach((v, i) => {
    const col = document.createElement("div");
    col.className = "bar-col" + (i === todayIdx ? " today" : "");
    col.innerHTML = `
      <div class="bar-track"><div class="bar-fill" data-val="${v.toLocaleString("id-ID")}"></div></div>
      <span class="bar-label">${days[i]}</span>
    `;
    wrap.appendChild(col);
    const fill = $(".bar-fill", col);
    setTimeout(() => { fill.style.height = (v / max) * 100 + "%"; }, 120 + i * 80);
  });
}

/* ============================================================
   Goals
   ============================================================ */
function renderGoals() {
  const list = $("#goalList");
  list.innerHTML = "";
  GOALS.forEach((g, i) => {
    const li = document.createElement("li");
    li.className = "goal-item";
    li.innerHTML = `
      <div class="goal-top">
        <span class="goal-name">${g.name}</span>
        <span class="goal-val">${g.display}</span>
      </div>
      <div class="goal-bar"><div class="goal-fill" style="background:${g.color}"></div></div>
    `;
    list.appendChild(li);
    setTimeout(() => { $(".goal-fill", li).style.width = g.value + "%"; }, 200 + i * 130);
  });
}

/* ============================================================
   Orders table
   ============================================================ */
function renderOrders() {
  const body = $("#ordersBody");
  body.innerHTML = "";
  ORDERS.forEach((o) => {
    const hue = AVATAR_HUES[o.initials] ?? o.hue ?? 240;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="cell-user">
          <div class="avatar" style="background:linear-gradient(135deg,hsl(${hue} 80% 62%),hsl(${hue + 40} 75% 52%))">${o.initials}</div>
          <div>
            <div class="cell-user-name">${o.name}</div>
            <div class="cell-user-mail">${o.mail}</div>
          </div>
        </div>
      </td>
      <td><span class="cell-order">${o.order}</span></td>
      <td>${o.date}</td>
      <td><span class="cell-amount">${rupiah(o.amount)}</span></td>
      <td><span class="badge badge-${o.status}">${o.label}</span></td>
    `;
    body.appendChild(tr);
  });
}

/* ============================================================
   Feed
   ============================================================ */
function renderFeed() {
  const list = $("#feedList");
  list.innerHTML = "";
  FEED.forEach((f) => {
    const li = document.createElement("li");
    li.className = "feed-item";
    li.innerHTML = `
      <div class="feed-icon" style="color:${f.color};background:${f.color}1f">${iconSvg(f.icon)}</div>
      <div class="feed-body">
        <p class="feed-text">${f.text}</p>
        <span class="feed-time">${f.time}</span>
      </div>
    `;
    list.appendChild(li);
  });
}

/* ============================================================
   Interactions
   ============================================================ */
function initRangePicker() {
  $$(".range-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.classList.contains("active")) return;
      $$(".range-chip").forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-selected", "true");
      currentRange = chip.dataset.range;
      renderKPIs(DATA[currentRange].kpis);
      renderRevenueChart(currentRange);
      renderBars(currentRange);
    });
  });
}

function initTheme() {
  const saved = localStorage.getItem("lumina-theme");
  if (saved) document.documentElement.dataset.theme = saved;

  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("lumina-theme", next);
    renderRevenueChart(currentRange); // grad colors follow theme
  });
}

function initSidebar() {
  const sidebar = $("#sidebar");
  const overlay = $("#overlay");
  const open = () => { sidebar.classList.add("open"); overlay.classList.add("open"); };
  const close = () => { sidebar.classList.remove("open"); overlay.classList.remove("open"); };
  $("#menuBtn").addEventListener("click", open);
  overlay.addEventListener("click", close);

  $$("[data-nav]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      $$("[data-nav]").forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
      if (window.innerWidth <= 920) close();
    });
  });
}

/* ============================================================
   Dropdown menus
   ============================================================ */
function initDropdowns() {
  // Reuse the master profile menu inside the sidebar dropdown (no markup dupes)
  const master = $("#profileMenuList");
  $$(".menu-clone").forEach((slot) => {
    if (master) slot.innerHTML = master.innerHTML;
  });

  const closeAll = (except = null) => {
    $$("[data-dropdown]").forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove("open");
      $("[data-dropdown-toggle]", dd)?.setAttribute("aria-expanded", "false");
    });
  };

  $$("[data-dropdown]").forEach((dd) => {
    const trigger = $("[data-dropdown-toggle]", dd);

    trigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains("open");
      closeAll(dd);
      dd.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });

    // Close when any menu item is chosen
    $$(".dropdown-item", dd).forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        closeAll();
      });
    });
  });

  // Outside click & Escape close everything
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown]")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

function initNotifications() {
  const markRead = () => {
    $$(".notif-item.unread").forEach((n) => n.classList.remove("unread"));
    $("#bellBtn")?.classList.remove("has-dot");
    const count = $("#notifCount");
    if (count) {
      count.textContent = "0 baru";
      count.classList.add("is-zero");
    }
  };

  $("#markReadBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    markRead();
  });

  // Clicking a single notification marks just that one as read
  $$(".notif-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("unread")) return;
      item.classList.remove("unread");
      const remaining = $$(".notif-item.unread").length;
      const count = $("#notifCount");
      if (count) {
        count.textContent = remaining > 0 ? `${remaining} baru` : "0 baru";
        if (remaining === 0) {
          count.classList.add("is-zero");
          $("#bellBtn")?.classList.remove("has-dot");
        }
      }
    });
  });
}

function initSearchShortcut() {
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $(".search input").focus();
    }
  });
}

/* ============================================================
   Boot
   ============================================================ */
function boot() {
  const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });
  $("#todayLabel").textContent = dateFmt.format(new Date());

  renderKPIs(DATA[currentRange].kpis);
  renderRevenueChart(currentRange);
  renderDonut();
  renderBars(currentRange);
  renderGoals();
  renderOrders();
  renderFeed();

  initRangePicker();
  initTheme();
  initSidebar();
  initDropdowns();
  initNotifications();
  initSearchShortcut();
}

document.addEventListener("DOMContentLoaded", boot);
