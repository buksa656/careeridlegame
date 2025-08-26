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
const lastHexProgress = {};
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

function drawKpiHexDashboard(progresses) {
  const container = document.getElementById("kpi-dashboard");
  if (!container) return;
  container.innerHTML = "";
  const HEX_R = 60;
  const ROWS = 3;
  const SPACING_X = HEX_R * 1.7;
  const SPACING_Y = HEX_R * 1.5;
  const COLS = Math.ceil(window.tasks.length / ROWS);
  const PADDING_X = 50;
  const PADDING_Y = 50;
  const WIDTH = (COLS - 1) * SPACING_X + HEX_R * 2 + SPACING_X + PADDING_X * 2;
  const HEIGHT = (ROWS - 1) * SPACING_Y + HEX_R * 2 + PADDING_Y * 2;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", WIDTH);
  svg.setAttribute("height", HEIGHT);
  svg.style.display = "block";
  svg.style.position = "relative";
  svg.style.margin = "0 auto";
  container.appendChild(svg);
  let idx = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (idx >= window.tasks.length) continue;
      const x = PADDING_X + col * SPACING_X + ((row % 2) ? SPACING_X / 2 : 0);
      const y = PADDING_Y + row * SPACING_Y;
      const clr = TASKS_KPI[idx].color;
      const unlocked = window.tasks[idx]?.unlocked;
      // HEX border/background
      const hex = document.createElementNS(svgNS, "polygon");
      hex.setAttribute("points", hexPoints(x, y, HEX_R));
      hex.setAttribute("fill", unlocked ? "#f9fbfd" : "#ededed");
      hex.setAttribute("stroke", unlocked ? "#1370b8" : "#bfc8d1");
      hex.setAttribute("stroke-width", "3");
      hex.setAttribute("opacity", unlocked ? "1" : "0.33");
      svg.appendChild(hex);
      if (unlocked) {
        // Progress bar w hexie
        const gainIdle = getTaskIdle(idx);
        let progress = Math.max(0, Math.min(1, progresses[idx]));
        let overlayColor = clr;
        let overlayOpacity = "0.65";
        let drawAsFull = false;
        if (gainIdle >= 5) {
          progress = 1.0;
          overlayColor = "#7dbbcf";
          overlayOpacity = "0.88";
          drawAsFull = true;
        }
        if (progress > 0.005) {
          const fill = document.createElementNS(svgNS, "polygon");
          const prev = lastHexProgress[idx] ?? 0;
          const delta = Math.abs(progress - prev);
          const ANIMATION_CUTOFF = 0.25;
          if (delta > ANIMATION_CUTOFF) {
            // natychmiastowy fill, bez żadnych przejść
            fill.style.transition = "none";
          } else {
            // opcjonalnie: nie ustawiaj transition (native SVG jest natychmiastowy), chyba że robisz custom fade/effect
            fill.style.transition = "";
          }
          fill.setAttribute("points", hexPointsFill(x, y, HEX_R, progress));
          fill.setAttribute("fill", overlayColor);
          fill.setAttribute("opacity", overlayOpacity);
          svg.appendChild(fill);
        }
        // Ikona główna
        const ico = document.createElementNS(svgNS, "text");
        ico.setAttribute("x", x);
        ico.setAttribute("y", y - 6);
        ico.setAttribute("text-anchor", "middle");
        ico.setAttribute("font-size", "2.0em");
        ico.setAttribute("font-family", "Segoe UI,Arial,sans-serif");
        ico.textContent = TASKS_KPI[idx].icon;
        svg.appendChild(ico);
        // Nazwa zadania
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y + 22);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "0.95em");
        label.setAttribute("fill", "#205288");
        label.setAttribute("font-family", "Segoe UI,Arial,sans-serif");
        label.textContent = TASKS_KPI[idx].name;
        svg.appendChild(label);
        if (!drawAsFull && progress > 0.08) {
          const txt = document.createElementNS(svgNS, "text");
          txt.setAttribute("x", x);
          txt.setAttribute("y", y + 42);
          txt.setAttribute("text-anchor", "middle");
          txt.setAttribute("font-size", "0.82em");
          txt.setAttribute("fill", "#444");
          txt.textContent = Math.round(progress * 100) + '%';
          svg.appendChild(txt);
        }
      } else {
        // ZABLOKOWANY: TYLKO KŁÓDKA, BEZ labela!
        const lock = document.createElementNS(svgNS, "text");
        lock.setAttribute("x", x);
        lock.setAttribute("y", y - 6);
        lock.setAttribute("text-anchor", "middle");
        lock.setAttribute("font-size", "2.0em");
        lock.setAttribute("font-family", "Segoe UI,Arial,sans-serif");
        lock.setAttribute("fill", "#bbb");
        lock.setAttribute("opacity", "0.67");
        lock.textContent = "🔒";
        svg.appendChild(lock);
        // NIE dodawaj labela pod kłódką!
      }
      idx++;
    }
  }
}
