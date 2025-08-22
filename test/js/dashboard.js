const TASKS_KPI = [
  {name:"Kawa",   icon:"☕", color:"#3888d7"},
  {name:"Kopiuj", icon:"🗂️",color:"#886b20"},
  {name:"Mail",   icon:"📧", color:"#3ebfae"},
  {name:"Small Talk",icon:"💬",color:"#7aa82b"},
  {name:"Ticket JIRA",icon:"🎟️",color:"#258cc6"},
  {name:"Excel",  icon:"📊", color:"#e1be17"},
  {name:"PowerPoint",icon:"📈",color:"#e15dc9"},
  {name:"Teams",  icon:"💼", color:"#8655db"},
  {name:"Google Docs",icon:"📝",color:"#34a853"},
  {name:"Zebranie",icon:"📡",color:"#78c2ad"},
  {name:"Standup", icon:"🎤",color:"#cf465e"},
  {name:"Deleguj",icon:"🦙",color:"#f3921c"},
  {name:"Lunch", icon:"🍱",color:"#d45390"},
  {name:"GIFy", icon:"🖼️",color:"#4ec7ff"},
  {name:"LinkedIn", icon:"🔗",color:"#085777"},
  {name:"Król Biura",icon:"👑",color:"#f8a33a"}
];

const centerX = 235, centerY = 210, HEX_R = 50;
const layout = [
  {q:0, r:0}, {q:1,r:0}, {q:0,r:1}, {q:-1,r:1}, {q:-1,r:0}, {q:0,r:-1}, {q:1,r:-1}, {q:2,r:0},
  {q:1,r:1}, {q:0,r:2}, {q:-1,r:2}, {q:-2,r:1}, {q:-2,r:0}, {q:-1,r:-1}, {q:0,r:-2}, {q:1,r:-2}
];

function axialToPixel(q, r) {
    const x = centerX + HEX_R * Math.sqrt(3) * (q + r/2);
    const y = centerY + HEX_R * 1.5 * r;
    return {x, y};
}

function hexPointsFill(cx, cy, r, progress) {
  const pts = [];
  let n = 6;
  let angleStep = Math.PI / 3;
  let baseAngle = -Math.PI / 6;
  for (let i = 0; i < n; i++) {
    let ang = i * angleStep + baseAngle;
    let px = cx + r * Math.cos(ang);
    let py = cy + r * Math.sin(ang);
    pts.push([px, py]);
  }
  let fillH = 2 * r * progress; 
  let yBottom = cy + r;
  let yCut = yBottom - fillH;
  let up = [];
  let down = [];
  for (let i = 0; i < pts.length; i++) {
    let [x1, y1] = pts[i];
    let [x2, y2] = pts[(i + 1) % n];
    if (y1 >= yCut) up.push([x1, y1]);
    if ((y1 >= yCut && y2 < yCut) || (y1 < yCut && y2 >= yCut)) {
      // Przecięcie z linią yCut
      let t = (yCut - y1) / (y2 - y1);
      let xx = x1 + t * (x2 - x1);
      up.push([xx, yCut]);
    }
  }
  return up.map(([x, y]) => x + ',' + y).join(' ');
}

function hexPoints(cx, cy, r) {
  const pts = [];
  for(let a=0; a<6; a++) {
    let ang = Math.PI/3 * a - Math.PI/6;
    pts.push((cx + r*Math.cos(ang)) + "," + (cy + r*Math.sin(ang)));
  }
  return pts.join(" ");
}

// --- DODANE: funkcja obliczająca idle zadania przez index
function getTaskIdle(idx) {
  if (!window.tasks || !window.tasks[idx]) return 0;
  const t = window.tasks[idx];
  const ascendStages = window.ASCEND_STAGES || [ { idleMult: 1 } ];
  const ascendLevel = typeof t.ascendLevel === "number" ? t.ascendLevel : 0;
  const ascendStage = ascendStages[ascendLevel] || { idleMult: 1 };
  return (
      (typeof t.baseIdle === "number" ? t.baseIdle : 0.01)
    * (typeof t.multiplier === "number" ? t.multiplier : 1)
    * ascendStage.idleMult
  );
}

const svgNS = "http://www.w3.org/2000/svg";

// --- PEŁNY PATCH: HEX się wypełnia na stałe gdy idle >= 5
function drawKpiHexDashboard(progresses) {
  const container = document.getElementById("kpi-dashboard");
  if (!container) return;
  container.innerHTML = "";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", 470); svg.setAttribute("height", 410);
  svg.style.display = "block";
  svg.style.position = "relative";
  container.appendChild(svg);

  layout.forEach((coord, i) => {
    const {x, y} = axialToPixel(coord.q, coord.r);
    const clr = TASKS_KPI[i].color;
    // Warunek: rysujemy tylko unlocked taski!
    const unlocked = typeof window !== "undefined" && window.tasks
      ? window.tasks[i] && window.tasks[i].unlocked
      : (progresses[i] > 0 || progresses[i] > 0.01);

    if (!unlocked) return;

    // HEX border
    const hex = document.createElementNS(svgNS, "polygon");
    hex.setAttribute("points", hexPoints(x, y, HEX_R));
    hex.setAttribute("fill", "#f9fbfd");
    hex.setAttribute("stroke", "#1370b8");
    hex.setAttribute("stroke-width", "3");
    svg.appendChild(hex);

    // --- KLUCZ: jeśli idle >= 5 → pełny HEX statyczny kolor (brak animacji), inaczej klasyczny progress ---
    // Obliczanie gainIdle:
    const gainIdle = getTaskIdle(i);

    let progress = Math.max(0, Math.min(1, progresses[i]));
    let overlayColor = clr;
    let overlayOpacity = "0.65";
    let drawAsFull = false;

    if (gainIdle >= 5) {
      progress = 1.0;
      overlayColor = "#7dbbcf"; // identyczny jak unlock-progress-bar, możesz dopasować
      overlayOpacity = "0.88";
      drawAsFull = true;
    }

    if (progress > 0.005) {
      const fill = document.createElementNS(svgNS, "polygon");
      fill.setAttribute("points", hexPointsFill(x, y, HEX_R, progress));
      fill.setAttribute("fill", overlayColor);
      fill.setAttribute("opacity", overlayOpacity);
      svg.appendChild(fill);
    }

    // Ikona/emotka
    const ico = document.createElementNS(svgNS, "text");
    ico.setAttribute("x", x);
    ico.setAttribute("y", y-6);
    ico.setAttribute("text-anchor", "middle");
    ico.setAttribute("font-size", "2.0em");
    ico.setAttribute("font-family", "Segoe UI,Arial,sans-serif");
    ico.textContent = TASKS_KPI[i].icon;
    svg.appendChild(ico);

    // Nazwa taska
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", x);
    label.setAttribute("y", y+22);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "0.95em");
    label.setAttribute("fill", "#205288");
    label.setAttribute("font-family", "Segoe UI,Arial,sans-serif");
    label.textContent = TASKS_KPI[i].name;
    svg.appendChild(label);

    // Progress number (tylko jeśli animowany)
    if (!drawAsFull && progress > 0.08) {
      const txt = document.createElementNS(svgNS,"text");
      txt.setAttribute("x", x);
      txt.setAttribute("y", y+42);
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-size", "0.82em");
      txt.setAttribute("fill","#444");
      txt.textContent = Math.round(progress*100)+'%';
      svg.appendChild(txt);
    }
  });
}
