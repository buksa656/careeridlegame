(() => {
  'use strict';

  // Bazowe wartości za klik
  const BASE_CLICKS = [1, 2, 4, 7, 11, 16, 23, 33, 46, 64, 88, 121, 166, 227, 311, 426];
  const TASKS = [
    { name: "Robienie kawy Szefowi", unlocked: true,  level: 0, baseClick: BASE_CLICKS[0],  baseIdle: 0.02, cycleTime: 1600, multiplier: 1, progress: 0, active: false, unlockCost: 0, ascendLevel:0 },
    { name: "Ctrl+C, Ctrl+V", unlocked: false,  level: 0, baseClick: BASE_CLICKS[1],  baseIdle: 0.04, cycleTime: 2000, multiplier: 1, progress: 0, active: false, unlockCost: 40, ascendLevel:0 },
    { name: "Przerzucanie maili do folderu", unlocked: false,  level: 0, baseClick: BASE_CLICKS[2],  baseIdle: 0.06, cycleTime: 2600, multiplier: 1, progress: 0, active: false, unlockCost: 120, ascendLevel:0 },
    { name: "Small talk w kuchni", unlocked: false,  level: 0, baseClick: BASE_CLICKS[3],  baseIdle: 0.09, cycleTime: 2700, multiplier: 1, progress: 0, active: false, unlockCost: 260, ascendLevel:0 },
    { name: "Zlecenie ticketu w JIRZE", unlocked: false,  level: 0, baseClick: BASE_CLICKS[4],  baseIdle: 0.13, cycleTime: 3150, multiplier: 1, progress: 0, active: false, unlockCost: 850, ascendLevel:0 },
    { name: "Wklejka do Excela", unlocked: false,  level: 0, baseClick: BASE_CLICKS[5],  baseIdle: 0.18, cycleTime: 4050, multiplier: 1, progress: 0, active: false, unlockCost: 1850, ascendLevel:0 },
    { name: "Prezentacja na Teamsy", unlocked: false, level: 0, baseClick: BASE_CLICKS[6],  baseIdle: 0.24, cycleTime: 5000, multiplier: 1, progress: 0, active: false, unlockCost: 4000, ascendLevel:0 },
    { name: "Fake brainstorming", unlocked: false, level: 0, baseClick: BASE_CLICKS[7],  baseIdle: 0.30, cycleTime: 6000, multiplier: 1, progress: 0, active: false, unlockCost: 7200, ascendLevel:0 },
    { name: "Przeklejka z Google Docs", unlocked: false, level: 0, baseClick: BASE_CLICKS[8],  baseIdle: 0.36, cycleTime: 7200, multiplier: 1, progress: 0, active: false, unlockCost: 11500, ascendLevel:0 },
    { name: "Zebranie (udawaj, że słuchasz)", unlocked: false, level: 0, baseClick: BASE_CLICKS[9],  baseIdle: 0.47, cycleTime: 9000, multiplier: 1, progress: 0, active: false, unlockCost: 18000, ascendLevel:0 },
    { name: "Standup 'co zrobisz dziś?'", unlocked: false,  level: 0, baseClick: BASE_CLICKS[10], baseIdle: 0.60, cycleTime: 11000, multiplier: 1, progress: 0, active: false, unlockCost: 29000, ascendLevel:0 },
    { name: "Delegowanie lemingowi", unlocked: false,  level: 0, baseClick: BASE_CLICKS[11], baseIdle: 0.75, cycleTime: 13000, multiplier: 1, progress: 0, active: false, unlockCost: 52000, ascendLevel:0 },
    { name: "Lunch break", unlocked: false,  level: 0, baseClick: BASE_CLICKS[12], baseIdle: 0.9, cycleTime: 17000, multiplier: 1, progress: 0, active: false, unlockCost: 76000, ascendLevel:0 },
    { name: "Wysyłanie GIF-ów", unlocked: false,  level: 0, baseClick: BASE_CLICKS[13], baseIdle: 1.12, cycleTime: 22000, multiplier: 1, progress: 0, active: false, unlockCost: 120000, ascendLevel:0 },
    { name: "Przeklikanie LinkedIna", unlocked: false,  level: 0, baseClick: BASE_CLICKS[14], baseIdle: 1.35, cycleTime: 32000, multiplier: 1, progress: 0, active: false, unlockCost: 230000, ascendLevel:0 },
    { name: "Król Open Space", unlocked: false,  level: 0, baseClick: BASE_CLICKS[15], baseIdle: 2.17, cycleTime: 47000, multiplier: 1, progress: 0, active: false, unlockCost: 450000, ascendLevel:0 }
  ];
  window.topClicks = Array(TASKS.length).fill(0);        // kliknięcia wszystkich tasków globalnie
  window.prestigeClicks = Array(TASKS.length).fill(0);   // kliknięcia wszystkich tasków od ostatniego prestiżu
  // 1. Progresywny koszt unlocku kafelków
  for (let i = 1; i < TASKS.length; ++i) {
    TASKS[i].unlockCost = Math.floor(55 * Math.pow(3.25, i));
  }

  // 2. Dynamiczne koszty ulepszeń (optymalizacji)
  TASKS.forEach((t, i) => {
    t.getUpgradeCost = function() {
      return Math.floor(60 * Math.pow(1.65 + i * 0.13, this.level));
    };
  });
const ASCEND_STAGES = [
  { name: "Junior",    idleMult: 1.0, clickMult: 1.0 },
  { name: "Mid",       idleMult: 1.25, clickMult: 1.15 },
  { name: "Senior",    idleMult: 1.5, clickMult: 1.30 },
  { name: "Manager",   idleMult: 1.8, clickMult: 1.50 },
  { name: "Principal", idleMult: 2.15, clickMult: 1.85 },
  { name: "Director",  idleMult: 2.6, clickMult: 2.2 },
  { name: "Expert",    idleMult: 3.2, clickMult: 2.6 },
  { name: "C-Level",   idleMult: 4.0, clickMult: 3.3 },
  { name: "Korpo Yoda",idleMult: 5.0, clickMult: 4.2 },
  { name: "Legenda Open Space",idleMult: 6.3, clickMult: 5.3 }
];
window.ASCEND_STAGES = ASCEND_STAGES;
  // --- MODYFIKACJE BIURKA --- //
const DESK_MODS = [
  {
    id: "cup", name: "Kubek", emoji: "☕",
    desc: "Twój ulubiony kubek! Burnout -10%.", cost: 1,
    svg: `<ellipse cx="70" cy="175" rx="9" ry="11" fill="#fff"/>
          <rect x="67" y="172" width="6" height="11" rx="2.2" fill="#c8a869" />
          <ellipse cx="70" cy="180" rx="8" ry="4" fill="#faa" opacity="0.25"/>`
  },
  {
    id: "flower", name: "Kwiatuszek", emoji: "🌼",
    desc: "Zwiększa wszystkie mnożniki idle o 5%.", cost: 2,
    svg: `<circle cx="320" cy="157" r="10" fill="#aef4e9"/>
         <circle cx="320" cy="157" r="6" fill="#fff"/>
         <circle cx="320" cy="157" r="2.9" fill="#ffe45e"/>
         <ellipse cx="320" cy="150" rx="2" ry="5" fill="#fff"/>
         <ellipse cx="326" cy="157" rx="5" ry="2" fill="#fff"/>
         <ellipse cx="320" cy="164" rx="2" ry="5" fill="#fff"/>
         <ellipse cx="314" cy="157" rx="5" ry="2" fill="#fff"/>
    `
  },
  {
    id: "lamp", name: "Lampka RGB", emoji: "💡",
    desc: "Softcap poziomu tasków przesunięty o +3.", cost: 3,
    svg: `<ellipse cx="205" cy="112" rx="10" ry="6" fill="#eaf"/> 
          <rect x="199" y="113" width="12" height="21" rx="4" fill="#bbb"/>
          <ellipse cx="205" cy="137" rx="6" ry="2" fill="#eaeaea"/>`
  },
  {
    id: "monitor", name: "Monitor", emoji: "🖥️",
    desc: "Wszystkie taski idle szybciej o 10%.", cost: 4,
    svg: `<rect x="248" y="122" width="24" height="14" rx="2" fill="#333"/>
          <rect x="252" y="126" width="16" height="7" rx="1.5" fill="#0cc" opacity="0.63"/>`
  },
  {
    id: "lama", name: "Lama", emoji: "🦙",
    desc: "Idle mnożniki rosną szybciej (+30%).", cost: 5,
    svg: `<ellipse cx="115" cy="194" rx="8" ry="5" fill="#fff9f6"/>
          <ellipse cx="115" cy="189" rx="3" ry="4" fill="#fff"/>
          <rect x="112" y="188" width="6" height="8" rx="2.5" fill="#f7dcc3"/>`
  },
    {
    id: "ekspres", name: "Ekspres do kawy", emoji: "☕",
    desc: "Idle we wszystkich zadaniach +12%",
    cost: 8,
    svg: "<ellipse cx='165' cy='165' rx='13' ry='13' fill='#eee'/>",
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.12 }
  },
  {
    id: "podkladka", name: "Antystresowa podkładka", emoji: "🖱️",
    desc: "Kliky +10% (trwały efekt)",
    cost: 12,
    svg: "<rect x='50' y='180' width='24' height='9' rx='4.5' fill='#def'/>",
    effect: gs => { gs.baseClick = (gs.baseClick || 1) * 1.1; }
  },
  {
    id: "prestiżowe-biurko", name: "BIURKOWY PRESTIŻ", emoji: "💎",
    desc: "Globalny mnożnik idle *1.17. Najwyższy biurowy upgrade.",
    cost: 25,
    svg: "<ellipse cx='290' cy='190' rx='11' ry='11' fill='#87c4ff'/><ellipse cx='290' cy='190' rx='7' ry='7' fill='#fff'/>",
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.17; }
  }
];
  const hotspotMap = {
  "hotspot-cup": 0,
  "hotspot-flower": 1,
  "hotspot-lamp": 2,
  "hotspot-monitor": 3,
  "hotspot-lama": 4
  };
  const ui = window.IdleUI;
let deskModsOwned = [];
function renderDeskSVG() {
  for (const id in hotspotMap) {
    let idx = hotspotMap[id];
    const group = document.getElementById(id);
    group.classList.remove("desk-hotspot-hover", "desk-hotspot-bought", "desk-hotspot-locked");
    group.querySelector("g").innerHTML = "";

    group.onmouseenter = (ev) => { showDeskTooltip(idx, group); group.classList.add("desk-hotspot-hover"); }
    group.onmouseleave = (ev) => { hideDeskTooltip(); group.classList.remove("desk-hotspot-hover"); }
    group.onclick = () => {
      if (!deskModsOwned.includes(idx)) {
        if (softSkills >= DESK_MODS[idx].cost) {
          deskModsOwned.push(idx);
          softSkills -= DESK_MODS[idx].cost;
          if (typeof DESK_MODS[idx].effect === "function") DESK_MODS[idx].effect(gameState);
          applyDeskModsEffects();
          saveGame();
          ui.renderAll(tasks, totalPoints, softSkills, burnout);
          renderDeskSVG();
        }
      }
    }
    if (deskModsOwned.includes(idx)) {
      group.classList.add("desk-hotspot-bought");
      group.querySelector("g").innerHTML = DESK_MODS[idx].svg;
    } else {
      group.classList.add(softSkills >= DESK_MODS[idx].cost ? "" : "desk-hotspot-locked");
    }
  }
}
function showDeskTooltip(idx, group) {
  const tooltip = document.getElementById("desk-tooltip");
  const box = group.getBoundingClientRect();
  tooltip.innerHTML = `<b>${DESK_MODS[idx].emoji} ${DESK_MODS[idx].name}</b><br>
    <span style="color:#946;-webkit-font-smoothing:antialiased;line-height:1.5">
      ${DESK_MODS[idx].desc}</span>
    <br>${deskModsOwned.includes(idx) ? '<span style="color:#53a055">Kupiono</span>' : `<b>Koszt:</b> ${DESK_MODS[idx].cost} <span style="color:#bbb">Soft Skill${DESK_MODS[idx].cost>1?"e":""}</span>`}`;
  tooltip.style.display = "block";
  tooltip.style.opacity = 1;
  // Pozycja
  tooltip.style.left = (box.left + box.width/2 + window.scrollX) + "px";
  tooltip.style.top = (box.top - 45 + window.scrollY) + "px";
}
function hideDeskTooltip() {
  const tooltip = document.getElementById("desk-tooltip");
  tooltip.style.opacity = 0;
  tooltip.style.display = "none";
}

window.renderDeskSVG = renderDeskSVG; 
  // ---- TU MUSI BYĆ DEFINICJA ACHIEVEMENTS JAKO PIERWSZA! ----
const ACHIEVEMENTS = [
  {
    id: "pracownik-roku",
    name: "Pracownik Roku",
    desc: "Zdobądź pierwszy 1.000 biuro-punktów.",
    condition: gs => gs.totalPoints >= 1000,
    reward: { type: "baseClick", value: 3 }
  },
  {
    id: "kawowy-mistrz",
    name: "Kawowy Mistrz",
    desc: "Kliknij 50 razy w kafelek 'Kawa'.",
    condition: gs => gs.topClicks && gs.topClicks[0] >= 50,
    reward: { type: "multiplierInc", multiplierInc: 0.045, taskIdx: 0 }
  },
  {
    id: "excel-heros",
    name: "Excel Heros",
    desc: "Osiągnij 1. poziom w Excelu.",
    condition: gs => gs.tasks && gs.tasks && gs.tasks[5].level >= 1,
    reward: { type: "multiplierInc", multiplierInc: 0.06, taskIdx: 5 }
  },
  {
    id: "maraton-sesji",
    name: "Maraton Sesji",
    desc: "Zarób 100.000 biuro-punktów jednym prestige runem.",
    condition: gs => gs.sessionPoints && gs.sessionPoints >= 100000,
    reward: { type: "multiplierInc", multiplierInc: 0.10 }
  },
  {
    id: "ranna-kawa",
    name: "Ranna Kawa",
    desc: "Zgromadź 5 Soft Skills przed 10:00 rano.",
    condition: gs => (new Date()).getHours() < 10 && gs.softSkills >= 5,
    reward: { type: "baseClick", value: 7 }
  },
  {
    id: "awansator",
    name: "Awansator",
    desc: "Wykonaj 15 awansów (ascendów) w sumie.",
    condition: gs => gs.ascendCount >= 15,
    reward: { type: "multiplierInc", multiplierInc: 0.08 }
  },
  {
    id: "optymalizator",
    name: "Optymalizator",
    desc: "Zoptymalizuj dowolne zadanie 30 razy.",
    condition: gs => gs.upgradeCount >= 30,
    reward: { type: "baseClick", value: 13 }
  },
  {
    id: "dzial-it",
    name: "Wsparcie IT",
    desc: "Kup przedmiot na biurko o temacie informatycznym.",
    condition: gs => gs.deskModsOwned && gs.deskModsOwned.includes('monitor'),
    reward: { type: "multiplierInc", multiplierInc: 0.05, taskIdx: 2 }
  },
  {
    id: "meeting-pro",
    name: "Meeting Pro",
    desc: "Zakończ 100 cykli idle na zadaniu 'Zebranie'.",
    condition: gs => gs.tasks && gs.tasks && gs.tasks[9].idleCycles >= 100,
    reward: { type: "baseClick", value: 20 }
  },
  {
    id: "korpo-pacykarz",
    name: "Korpo Pacykarz",
    desc: "Kliknij wszystkie kafelki przynajmniej raz.",
    condition: gs => gs.topClicks && gs.topClicks.every(cnt => cnt > 0),
    reward: { type: "multiplierInc", multiplierInc: 0.07 }
  },
  {
    id: "sztos-biurko",
    name: "Sztos Biurko",
    desc: "Zbierz co najmniej 4 przedmioty na biurko.",
    condition: gs => gs.deskModsOwned && gs.deskModsOwned.length >= 4,
    reward: { type: "multiplierInc", multiplierInc: 0.10 }
  },
  {
    id: "król-softskill",
    name: "Król Soft Skill",
    desc: "Kup najdroższy przedmiot z biurka.",
    condition: gs => gs.deskModsOwned && gs.deskModsOwned.includes("prestiżowe-biurko"),
    reward: { type: "multiplierInc", multiplierInc: 0.13 }
  },
  {
    id: "dziesiec-karier",
    name: "Dziesięć Karier",
    desc: "Odblokuj wszystkie zadania (16 kafli).",
    condition: gs => gs.tasks && gs.tasks.filter(t=>t.unlocked).length === 16,
    reward: { type: "multiplierInc", multiplierInc: 0.15 }
  },
  {
    id: "mistrz-softskilli",
    name: "Mistrz Soft Skilli",
    desc: "Uzbieraj co najmniej 20 Soft Skills.",
    condition: gs => gs.softSkills >= 20,
    reward: { type: "baseClick", value: 50 }
  },
  {
    id: "przeciazenie-epizod2",
    name: "Przeciążenie soft-skilli",
    desc: "Do zobaczenia w kolejnym update gry! 🔒",
    condition: gs => false, // NIEREALIZOWALNE, tylko teaser nowej wersji
    reward: null // lub pusta/ukryta
  }
];

  window.ACHIEVEMENTS = ACHIEVEMENTS;

  let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];
  let pointsHistory = []; // do wykresu

function saveGame() {
  localStorage.setItem("korposzczur_save", JSON.stringify({
    tasks, totalPoints, softSkills, burnout, pointsHistory,
    topClicks: window.topClicks,
    prestigeClicks: window.prestigeClicks,
    achievements: ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: a.unlocked })),
    deskModsOwned
  }));
}
window.saveGame = saveGame;
function loadGame() {
  const saveString = localStorage.getItem("korposzczur_save");
  if (saveString) {
    try {
      const s = JSON.parse(saveString);
      if (Array.isArray(s.tasks)) tasks = s.tasks;
      if (typeof s.totalPoints === "number") totalPoints = s.totalPoints;
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
      if (typeof s.burnout === "number") burnout = s.burnout;
      pointsHistory = Array.isArray(s.pointsHistory) ? s.pointsHistory : [];
      window.topClicks = Array.isArray(s.topClicks) ? s.topClicks : Array(TASKS.length).fill(0);
      window.prestigeClicks = Array.isArray(s.prestigeClicks) ? s.prestigeClicks : Array(TASKS.length).fill(0);
      if (Array.isArray(s.achievements)) {
        s.achievements.forEach(saved => {
          const orig = ACHIEVEMENTS.find(a => a.id === saved.id);
          if (orig) orig.unlocked = saved.unlocked;
        });
      }
      deskModsOwned = Array.isArray(s.deskModsOwned) ? s.deskModsOwned : [];
      // PATCH: zawsze napraw funkcję po loadzie!
      tasks.forEach((t, i) => {
        t.getUpgradeCost = function() {
          return Math.floor(60 * Math.pow(1.65 + i * 0.13, this.level));
        };
      });

      // KLUCZOWA LINIA — ustawiamy window.tasks na końcu udanego wczytania!
      window.tasks = tasks;
    } catch (e) {
      // Brak save/błąd: reset do defa
      tasks = JSON.parse(JSON.stringify(TASKS));
      pointsHistory = [];
      window.topClicks = Array(TASKS.length).fill(0);
      window.prestigeClicks = Array(TASKS.length).fill(0);
      ACHIEVEMENTS.forEach(a => a.unlocked = false);
      deskModsOwned = [];
      applyDeskModsEffects();
      // PATCH: napraw funkcję po resecie!
      tasks.forEach((t, i) => {
        t.getUpgradeCost = function() {
          return Math.floor(60 * Math.pow(1.65 + i * 0.13, this.level));
        };
      });
      window.tasks = tasks; // <-- KLUCZOWE TUTAJ TEŻ
    }
  } else {
    // Brak save: reset jawny
    tasks = JSON.parse(JSON.stringify(TASKS));
    pointsHistory = [];
    window.topClicks = Array(TASKS.length).fill(0);
    window.prestigeClicks = Array(TASKS.length).fill(0);
    ACHIEVEMENTS.forEach(a => a.unlocked = false);
    deskModsOwned = [];
    // PATCH: napraw funkcję po resecie!
    tasks.forEach((t, i) => {
      t.getUpgradeCost = function() {
        return Math.floor(60 * Math.pow(1.65 + i * 0.13, this.level));
      };
    });
    window.tasks = tasks; // <-- KLUCZOWE! 
  }
  tasks.forEach((t, i) => { if (t.unlocked && !t.active) startIdle(i); });
  ui.renderAchievements(window.ACHIEVEMENTS);
}

  function clearSave() {
    timers.forEach(t => clearInterval(t));
    localStorage.removeItem("korposzczur_save");
    location.reload();
  }

function tryUnlockTask(idx) {
  if (idx < tasks.length && !tasks[idx].unlocked && totalPoints >= tasks[idx].unlockCost) {
    tasks[idx].unlocked = true;
    startIdle(idx);
    window.tasks = tasks;
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
    if (typeof refreshHexKpiDashboard === "function") refreshHexKpiDashboard();
    ui.renderAchievements(window.ACHIEVEMENTS);
  }
}

function getBarCycleMs(task) {
  const speedGrowth = 0.94;
  // Użyj z gameState.softcapShift (domyślnie 0, po lampce będzie 3)
  const lvl = Math.min(task.level, 15 + (gameState.softcapShift || 0));
  const softcap = task.level > (15 + (gameState.softcapShift || 0))
    ? Math.pow(0.98, task.level - (15 + (gameState.softcapShift || 0)))
    : 1;
  return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap / Math.max(0.001, (typeof task.multiplier === 'number' ? task.multiplier : 1));
}

function startIdle(idx) {
  if (tasks[idx].active) return;
  tasks[idx].active = true;
  tasks[idx].progress = 0;
  let prev = Date.now();
  timers[idx] = setInterval(() => {
    const task = tasks[idx];
    const barMs = getBarCycleMs(task);
    const now = Date.now();
    task.progress += (now - prev) / barMs;
    prev = now;
    if (task.progress >= 1) {
      task.progress = 0;
      const ascendLevel = typeof task.ascendLevel === "number" ? task.ascendLevel : 0;
      const ascendStage = ASCEND_STAGES[ascendLevel];
      const idlePts = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01)
        * (typeof task.multiplier === 'number' ? task.multiplier : 1)
        * ascendStage.idleMult;
      totalPoints += idlePts;
      task.multiplier = ((typeof task.multiplier === 'number') ? task.multiplier : 1) + (gameState.idleMultiplierGrow || 0.01);
      tryUnlockTask(idx + 1); // wywoła renderAll + dashboard jeśli unlock
      checkAchievements();
      saveGame();
      ui.updateSingleTile(idx, task, totalPoints);
      if (typeof renderGridProgress === "function") renderGridProgress(tasks, totalPoints);
      ui.renderProgress(idx, task.progress, task.multiplier);
      renderMultipliersBar();
      floatingScore(idlePts, idx, "#87c686");
      flashPoints();
      window.IdleUI.updateTotalPoints(totalPoints);
      ui.renderAchievements(window.ACHIEVEMENTS);
      if (typeof refreshHexKpiDashboard === "function") refreshHexKpiDashboard();
      return;
    }
    ui.renderProgress(idx, task.progress, task.multiplier);
    if (typeof refreshHexKpiDashboard === "function") refreshHexKpiDashboard();
  }, 1000 / 30);
}

function clickTask(idx) {
  const task = tasks[idx];
  if (task.unlocked) {
    const ascendLevel = typeof task.ascendLevel === "number" ? task.ascendLevel : 0;
    const ascendStage = ASCEND_STAGES[ascendLevel];
    const clickPts = (typeof task.baseClick === "number" ? task.baseClick : 1) * ascendStage.clickMult;
    totalPoints += clickPts;
    window.topClicks[idx] += 1;
    window.prestigeClicks[idx] += 1;
    tryUnlockTask(idx + 1);
    checkAchievements();
    saveGame();
    if (typeof ui.updateTotalPoints === "function") ui.updateTotalPoints(totalPoints);
    ui.updateSingleTile(idx, task, totalPoints);
    if (typeof renderGridProgress === "function") renderGridProgress(tasks, totalPoints);
    if (typeof refreshHexKpiDashboard === "function") refreshHexKpiDashboard();
    renderMultipliersBar();
    floatingScore(clickPts, idx, "#1976d2");
    flashPoints();
    ui.renderAchievements(window.ACHIEVEMENTS);
  }
  if (!task.active) startIdle(idx);
}

  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = task.getUpgradeCost();
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
      ui.renderUpgradeAffordances(tasks, totalPoints);
      renderMultipliersBar();
      checkAchievements();
      ui.renderAchievements(window.ACHIEVEMENTS);
      if (typeof renderGridProgress === "function") renderGridProgress(tasks, totalPoints);
    }
  }
  function refreshHexKpiDashboard() {
  if (typeof drawKpiHexDashboard === "function") {
    drawKpiHexDashboard(getAllTaskProgresses());
  }
}
function ascendTask(idx) {
  const task = tasks[idx];
  const current = task.ascendLevel || 0;
  const next = current + 1;
  if (!ASCEND_STAGES[next]) return; // już max awans
  // const cost = ASCEND_STAGES[next].cost;   // <--- ZAMIEŃ NA:
  const cost = Math.floor(4500 * Math.pow(2 + idx * 0.15, next));
  if (totalPoints >= cost) {
    totalPoints -= cost;
    task.ascendLevel = next;
    // Reset tylko bazowego idle (reszta premii/trwałych boostów zostają):
    task.baseIdle = TASKS[idx].baseIdle;
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    renderMultipliersBar();
    if (typeof renderGridProgress === "function") renderGridProgress(tasks, totalPoints);
  }
}
function prestige(ignorePointsRequirement = false) {
  console.log("PRESTIGE TRIGGERED!");
  timers.forEach(t => clearInterval(t));
  if (!ignorePointsRequirement && totalPoints < 10000) return;
  softSkills += 1;
  burnout += 1;
  tasks = JSON.parse(JSON.stringify(TASKS));
  tasks.forEach((t, i) => {
    t.getUpgradeCost = function() {
      return Math.floor(60 * Math.pow(1.65 + i * 0.13, this.level));
    };
  });
  totalPoints = 0;
  tasks.forEach(t => t.ascendLevel = 0);
  applyDeskModsEffects();
  saveGame();
  window.tasks = tasks;
  ui.renderAll(tasks, totalPoints, softSkills, burnout);
  ui.renderUpgradeAffordances(tasks, totalPoints);
  renderMultipliersBar();
  if (typeof renderDeskSVG === "function") renderDeskSVG();
  window.prestigeClicks = Array(tasks.length).fill(0);
  if (typeof renderGridProgress === "function") renderGridProgress(tasks, totalPoints);
  if (softSkills === 1) showSoftSkillModal();
}
  // ---- MODAL Z GRATULACJAMI ----
  function showSoftSkillModal() {
    document.getElementById('softskill-modal').style.display = 'flex';
  }
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  // ---- ZAKŁADKA "Biurko" renderowanie ----

const gameState = {
  tasks,
  softcapShift: 0,
  burnoutReduction: 0,
  idleMultiplierGrow: 0.01 // domyślnie jak w bazowej mechanice
};
function applyDeskModsEffects() {
  gameState.softcapShift = 0;
  gameState.burnoutReduction = 0;
  gameState.idleMultiplierGrow = 0.01;
  tasks.forEach((t, i) => {
    t.cycleTime = TASKS[i].cycleTime; // przywraca domyślną wartość
    t.multiplier = TASKS[i].multiplier; // przywraca domyślny mnożnik
  });
  deskModsOwned.forEach(idx => {
    if (typeof DESK_MODS[idx].effect === "function") {
      DESK_MODS[idx].effect(gameState);
    }
  });
}


  function renderMultipliersBar() {
    const bar = document.getElementById('multipliersBar');
    bar.innerHTML =
      'Akt. mnożnik idle: ' +
      tasks
        .map(t =>
          t.unlocked
            ? `<strong>${t.name}</strong>: x${(typeof t.multiplier === 'number' ? t.multiplier : 1).toFixed(3)}`
            : null
        )
        .filter(Boolean)
        .join(' &nbsp;&nbsp; | &nbsp;&nbsp; ');
  }

function checkAchievements() {
    const state = {
    totalPoints,
    softSkills,
    burnout,
    tasks,
    topClicks: window.topClicks,
    prestigeClicks: window.prestigeClicks,
    deskModsOwned,
  };
  ACHIEVEMENTS.forEach(a => {
    if (!a.unlocked && (!a.condition || a.condition(state))) {
      a.unlocked = true;

      // Ulepszenie baseClick dla wszystkich zadań
      if (a.reward && a.reward.type === "baseClick") {
        tasks.forEach(t => {
          t.baseClick = (t.baseClick || 1) + a.reward.value;
        });
      }
      // Mnożnik wybranego tasku
      else if (a.reward && typeof a.reward.taskIdx === "number" && a.reward.taskIdx !== null) {
        tasks[a.reward.taskIdx].multiplier += a.reward.multiplierInc;
      }
      // Globalny mnożnik
      else if (a.reward && typeof a.reward.multiplierInc === "number") {
        tasks.forEach(t => { if (t.unlocked) t.multiplier += a.reward.multiplierInc; });
      }

      // Komunikat/gratulacje
      if (window.IdleUI && typeof window.IdleUI.showAchievement === 'function') {
        window.IdleUI.showAchievement(a);
      } else {
        alert(`Osiągnięcie odblokowane: ${a.name}!`);
      }
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
      ui.renderAchievements(window.ACHIEVEMENTS);
    }
  });
}

function floatingScore(points, idx, color) {}
  function flashPoints() {
    const score = document.getElementById('top-total-points');
    if(!score) return;
    score.classList.add("points-flash");
    setTimeout(() => score.classList.remove("points-flash"), 400);
  }
  function confetti() {
    const c = document.createElement("div");
    c.innerText = "🎉";
    c.className = "confetti";
    document.body.appendChild(c);
    setTimeout(() => { c.style.top = "120%"; c.style.opacity = "0"; }, 50);
    setTimeout(() => c.remove(), 1200);
  }
  const OFFICE_QUOTES = [
    "Pierwszy dzień w biurze to 98% szkoleń BHP",
    "95% statystyk w PowerPoincie nikt nie sprawdza",
    "Microsoft Teams zjada rocznie 1 dzień Twojego życia",
    "Biuro nigdy nie śpi... ale Ty musisz",
    "Najlepsze pomysły wpadają przy kawie – rzadko na spotkaniach",
    "Ctrl+F to najważniejsza umiejętność korposzczura",
    "Mówienie: „Zaraz to wrzucę na SharePoint” – czasem wystarcza za wykonanie zadania",
    "Najczęstszy powód spotkań: 'musimy się zsynchronizować'",
    "Szansa na wpadnięcie na Prezesa: rośnie w windzie, spada przy windzie",
    "Odpowiedź 'dziękuję, odnotowane' zazwyczaj kończy wątek mailowy",
  ];
let quoteIndex = -1;

function setMarqueeQuote(idx = null) {
  const el = document.getElementById('quote');
  let nextIdx;
  do {
    nextIdx = typeof idx === "number"
      ? idx
      : Math.floor(Math.random() * OFFICE_QUOTES.length);
  } while (nextIdx === quoteIndex && OFFICE_QUOTES.length > 1);
  quoteIndex = nextIdx;

  // Ustaw cytat z resetem animacji
  el.innerHTML = `<span>💬 ${OFFICE_QUOTES[quoteIndex]}</span>`;
  const span = el.querySelector('span');
  span.style.animation = 'none';
  // trigger reflow
  void span.offsetWidth;
  span.style.animation = null;

  // Po zakończeniu przewijania, wywołaj kolejny cytat
  span.addEventListener('animationend', () => setMarqueeQuote(), { once: true });
}
  
function getAllTaskProgresses() {
  return tasks.map(t => t.unlocked ? t.progress : 0);
}
window.getAllTaskProgresses = getAllTaskProgresses;
window.refreshHexKpiDashboard = function() {
  if (typeof drawKpiHexDashboard === "function") {
    drawKpiHexDashboard(getAllTaskProgresses());
  }
};
  
  function updatePointsChart() {
    if (!window.pointsHistory) window.pointsHistory = [];
    pointsHistory.push(totalPoints);
    if (pointsHistory.length > 40) pointsHistory.shift();
    const c = document.getElementById('points-chart');
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#1976d233";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    pointsHistory.forEach((v, i) => {
      const max = Math.max(...pointsHistory, 1);
      let y = c.height - (v / max) * (c.height - 12);
      ctx.lineTo(i * (c.width / 40), y);
    });
    ctx.stroke();
  }
  setInterval(updatePointsChart, 2000);
function topClickersTable() {
  let rows = window.topClicks.map((c, i) =>
    c > 0 ? `<tr><td>${TASKS[i].name}</td><td>${c}</td></tr>` : ''
  ).filter(Boolean).join('');
  if (!rows) return '';
  return `<div class="topk-table"><b>Twoje top klikane zadania:</b>
    <table>${rows}</table></div>`;
}

function init() {
  loadGame();
  timers = Array(tasks.length).fill(null);
  ui.init({
    onClickTask: clickTask,
    onUpgradeTask: upgradeTask,
    onPrestige: prestige,
    onClearSave: clearSave,
    onAscendTask: ascendTask
  });
  tasks.forEach((task, idx) => { if (task.unlocked) startIdle(idx); });
  ui.renderAll(tasks, totalPoints, softSkills, burnout);
  ui.renderUpgradeAffordances(tasks, totalPoints);
  renderMultipliersBar();
  updatePointsChart();
  ui.renderAchievements(window.ACHIEVEMENTS);
  setMarqueeQuote();
  // KLUCZOWE!
  window.IdleUI.panelNav();
}
window.addEventListener("load", init);

// ------ Przełączanie zakładek menu
window.renderDeskSVG = renderDeskSVG;
window.closeModal = closeModal;
})();
