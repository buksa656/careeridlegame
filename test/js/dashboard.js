// Przygotuj dane tasków:
const TASKS_KPI = [
  {name:"Kawa",   icon:"☕", color:"#3888d7"},
  {name:"Mail",   icon:"📧", color:"#3ebfae"},
  {name:"Excel",  icon:"📊", color:"#e1be17"},
  {name:"Teams",  icon:"💼", color:"#8655db"},
  {name:"Small Talk",icon:"💬",color:"#7aa82b"},
  {name:"PowerPoint",icon:"📈",color:"#e15dc9"},
  {name:"Deleguj",icon:"🦙",color:"#f3921c"},
  {name:"GIFy", icon:"🖼️",color:"#4ec7ff"},
  {name:"Lunch", icon:"🍱",color:"#d45390"},
  {name:"LinkedIn", icon:"🔗",color:"#085777"},
  {name:"Google Docs",icon:"📝",color:"#34a853"},
  {name:"Raport", icon:"🗂️",color:"#886b20"},
  {name:"Ticket JIRA",icon:"🎟️",color:"#258cc6"},
  {name:"Standup", icon:"🎤",color:"#cf465e"},
  {name:"OpenSpace",icon:"📡",color:"#78c2ad"},
  {name:"Król Biura",icon:"👑",color:"#f8a33a"}
];

// Niech progressy będą na start losowe dla efektu wow:
const progressArr = Array(16).fill(0).map((_,i)=> i<3? 0.7 : Math.random()*0.93);

const centerX = 235, centerY = 210, HEX_R = 50; // central point, hex radius
const layout = [
  {q:0, r:0}, {q:1,r:0}, {q:0,r:1}, {q:-1,r:1}, {q:-1,r:0}, {q:0,r:-1}, {q:1,r:-1}, {q:2,r:0},
  {q:1,r:1}, {q:0,r:2}, {q:-1,r:2}, {q:-2,r:1}, {q:-2,r:0}, {q:-1,r:-1}, {q:0,r:-2}, {q:1,r:-2}
];
function axialToPixel(q, r) {
    const x = centerX + HEX_R * Math.sqrt(3) * (q + r/2);
    const y = centerY + HEX_R * 1.5 * r;
    return {x, y};
}

function hexPoints(cx, cy, r) {
    const pts = [];
    for(let a=0; a<6; a++) {
        let ang = Math.PI/3 * a - Math.PI/6; // -30deg
        pts.push((cx + r*Math.cos(ang)) + "," + (cy + r*Math.sin(ang)));
    }
    return pts.join(" ");
}

const svgNS = "http://www.w3.org/2000/svg";
function drawKpiHexDashboard(progresses) {
  const container = document.getElementById("kpi-dashboard");
  container.innerHTML = "";
  // Tooltip
  let tooltip = document.createElement("div"); tooltip.className="kpi-tooltip";
  document.body.appendChild(tooltip);

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", 470); svg.setAttribute("height", 410);
  svg.style.display = "block";
  svg.style.position = "relative";
  container.appendChild(svg);

  layout.forEach((coord, i) => {
    const {x,y} = axialToPixel(coord.q, coord.r);
    const clr = TASKS_KPI[i].color;
    // Hex tło
    const hex = document.createElementNS(svgNS,"polygon");
    hex.setAttribute("points", hexPoints(x, y, HEX_R));
    hex.setAttribute("fill", "#f9fbfd");
    hex.setAttribute("stroke", progresses[i]>0?"#1370b8":"#abb5c6");
    hex.setAttribute("stroke-width", "3");
    svg.appendChild(hex);

    // Arc progress
    if(progresses[i]>0.04) {
      const angle = Math.max(0.05, progresses[i]) * 2*Math.PI;
      const arcR = HEX_R*0.79;
      const x1 = x + arcR * Math.cos(-Math.PI/2);
      const y1 = y + arcR * Math.sin(-Math.PI/2);
      const x2 = x + arcR * Math.cos(angle - Math.PI/2);
      const y2 = y + arcR * Math.sin(angle - Math.PI/2);
      const largeArc = progresses[i]>=0.5?1:0;
      let d = [
        `M ${x} ${y}`,
        `L ${x1} ${y1}`,
        `A ${arcR} ${arcR} 0 ${largeArc} 1 ${x2} ${y2}`,
        "Z"
      ].join(" ");
      const arc = document.createElementNS(svgNS,"path");
      arc.setAttribute("d",d);
      arc.setAttribute("fill", clr);
      arc.setAttribute("opacity","0.72");
      svg.appendChild(arc);
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

    // Progress number
    if(progresses[i]>0.08) {
      const txt = document.createElementNS(svgNS,"text");
      txt.setAttribute("x", x);
      txt.setAttribute("y", y+42);
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-size", "0.82em");
      txt.setAttribute("fill","#444");
      txt.textContent = Math.round(progresses[i]*100)+'%';
      svg.appendChild(txt);
    }

    // Tooltip mini
    [hex, ico, label].forEach(elem => {
      elem.addEventListener("mouseenter", (e) => {
        tooltip.innerHTML = `<b>${TASKS_KPI[i].icon}&nbsp;${TASKS_KPI[i].name}</b><br>
        Progres: <b>${Math.round(progresses[i]*100)}%</b>`;
        tooltip.style.left = (e.clientX+8) + "px";
        tooltip.style.top = (e.clientY-24) + "px";
        tooltip.style.display = "block";
      });
      elem.addEventListener("mousemove", (e)=>{
        tooltip.style.left = (e.clientX+8) + "px";
        tooltip.style.top = (e.clientY-24) + "px";
      });
      elem.addEventListener("mouseleave", ()=>{
        tooltip.style.display = "none";
      });
    });
  });
}

// pierwsze wywołanie
drawKpiHexDashboard(progressArr);

// PRZYKŁAD: dynamiczny update np. po idlu/clicku/awansie taska
// progressArr[2] = 0.93; drawKpiHexDashboard(progressArr);
