(() => {
  'use strict';

const TASKS = [
    { name: "Robienie kawy Szefowi", unlocked: false,  level: 0, baseIdle: 0.21, cycleTime: 1200, multiplier: 1, progress: 0, active: false, unlockCost: 0, ascendLevel: 0 },
    { name: "Obsługa kserokopiarki", unlocked: false, level: 0, baseIdle: 0.34, cycleTime: 1450, multiplier: 1, progress: 0, active: false, unlockCost: 60, ascendLevel: 0 },
    { name: "Przerzucanie maili do folderu", unlocked: false, level: 0, baseIdle: 0.51, cycleTime: 1600, multiplier: 1, progress: 0, active: false, unlockCost: 180, ascendLevel: 0 },
    { name: "Small talk w kuchni", unlocked: false, level: 0, baseIdle: 0.67, cycleTime: 1850, multiplier: 1, progress: 0, active: false, unlockCost: 410, ascendLevel: 0 },
    { name: "Raportowanie błędów do HelpDesku", unlocked: false, level: 0, baseIdle: 0.88, cycleTime: 2250, multiplier: 1, progress: 0, active: false, unlockCost: 1300, ascendLevel: 0 },
    { name: "Wklejka do Excela", unlocked: false, level: 0, baseIdle: 1.1, cycleTime: 3100, multiplier: 1, progress: 0, active: false, unlockCost: 2950, ascendLevel: 0 },
    { name: "Tworzenie Prezentacji do Statusu", unlocked: false, level: 0, baseIdle: 1.45, cycleTime: 3800, multiplier: 1, progress: 0, active: false, unlockCost: 5000, ascendLevel: 0 },
    { name: "Szkolenie z Microsoft Teams", unlocked: false, level: 0, baseIdle: 1.81, cycleTime: 4250, multiplier: 1, progress: 0, active: false, unlockCost: 8000, ascendLevel: 0 },
    { name: "Przeklejka z Google Docs", unlocked: false, level: 0, baseIdle: 2.32, cycleTime: 5100, multiplier: 1, progress: 0, active: false, unlockCost: 14200, ascendLevel: 0 },
    { name: "Zebranie (udawaj zainteresowanego)", unlocked: false, level: 0, baseIdle: 2.56, cycleTime: 6650, multiplier: 1, progress: 0, active: false, unlockCost: 22800, ascendLevel: 0 },
    { name: "Showtime dla Zarządu", unlocked: false, level: 0, baseIdle: 3.02, cycleTime: 8000, multiplier: 1, progress: 0, active: false, unlockCost: 34000, ascendLevel: 0 },
    { name: "Rytuał poniedziałkowego calla", unlocked: false, level: 0, baseIdle: 3.83, cycleTime: 9300, multiplier: 1, progress: 0, active: false, unlockCost: 64000, ascendLevel: 0 },
    { name: "Lunch break", unlocked: false, level: 0, baseIdle: 6.1, cycleTime: 12000, multiplier: 1, progress: 0, active: false, unlockCost: 95000, ascendLevel: 0 },
    { name: "Wysyłanie GIF-ów", unlocked: false, level: 0, baseIdle: 6.6, cycleTime: 16000, multiplier: 1, progress: 0, active: false, unlockCost: 170000, ascendLevel: 0 },
    { name: "Networking na LinkedInie", unlocked: false, level: 0, baseIdle: 8.22, cycleTime: 26000, multiplier: 1, progress: 0, active: false, unlockCost: 350000, ascendLevel: 0 },
    { name: "Król Open Space", unlocked: false, level: 0, baseIdle: 11, cycleTime: 43000, multiplier: 1, progress: 0, active: false, unlockCost: 650000, ascendLevel: 0 }
  ];

  for (let i = 1; i < TASKS.length; ++i) {
    TASKS[i].unlockCost = Math.floor(40 * Math.pow(2.2, i));
  }

  const ASCEND_STAGES = [
    { name: "Junior",    idleMult: 1.0, rewardMult: 1.0 },
    { name: "Mid",       idleMult: 1.25, rewardMult: 1.15 },
    { name: "Senior",    idleMult: 1.5, rewardMult: 1.30 },
    { name: "Manager",   idleMult: 1.8, rewardMult: 1.50 },
    { name: "Principal", idleMult: 2.15, rewardMult: 1.85 },
    { name: "Director",  idleMult: 2.6, rewardMult: 2.2 },
    { name: "Expert",    idleMult: 3.2, rewardMult: 2.6 },
    { name: "C-Level",   idleMult: 4.0, rewardMult: 3.3 },
    { name: "Korpo Yoda",idleMult: 5.0, rewardMult: 4.2 },
    { name: "Legenda Open Space",idleMult: 6.3, rewardMult: 5.3 }
  ];
window.ASCEND_STAGES = ASCEND_STAGES;
  
function applyTaskMethods(tasksArray) {
  tasksArray.forEach((t, i) => {
    const a = 0.88, b = 1.33;
    t.getUpgradeCost = function() {
      return Math.ceil(a * Math.pow(b, this.level));
    };
    const ascendBase = t.unlockCost || 50, ascendGrowth = 2.3;
    t.getAscendCost = function() {
      const currentLevel = typeof this.ascendLevel === "number" ? this.ascendLevel : 0;
      if (currentLevel >= (ASCEND_STAGES.length - 1)) return null;
      return Math.floor(ascendBase * Math.pow(ascendGrowth, currentLevel + 1));
    };
  });
}
  // --- MODYFIKACJE BIURKA --- //

  const DESK_MODS = [
  {
    id: "cup", name: "Kubek", emoji: "☕",
    desc: "Twój ulubiony kubek! Wszystkie zadania idle +5%.", cost: 1,
    svg: `<ellipse cx="0" cy="0" rx="18" ry="22" fill="#fff"/>
          <rect x="-9" y="-11" width="18" height="22" rx="4" fill="#c8a869" />
          <ellipse cx="0" cy="12" rx="16" ry="6" fill="#faa" opacity="0.25"/>`,
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.05; }
  },
  {
    id: "flower", name: "Kwiatuszek", emoji: "🌼",
    desc: "Każdy task idle +5%.", cost: 2,
    svg: `<circle cx="0" cy="0" r="20" fill="#aef4e9"/>
         <circle cx="0" cy="0" r="12" fill="#fff"/>
         <circle cx="0" cy="0" r="6" fill="#ffe45e"/>
         <ellipse cx="0" cy="-14" rx="3" ry="10" fill="#fff"/>
         <ellipse cx="13" cy="0" rx="9" ry="3" fill="#fff"/>
         <ellipse cx="0" cy="14" rx="3" ry="10" fill="#fff"/>
         <ellipse cx="-13" cy="0" rx="9" ry="3" fill="#fff"/>`,
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.05; }
  },
  {
    id: "lamp", name: "Lampka RGB", emoji: "💡",
    desc: "Softcap poziomu tasków +3.", cost: 3,
    svg: `<ellipse cx="0" cy="-14" rx="18" ry="9" fill="#eaf"/> 
          <rect x="-13" y="-13" width="26" height="32" rx="8" fill="#bbb"/>
          <ellipse cx="0" cy="11" rx="10" ry="3" fill="#eaeaea"/>`,
    effect: gs => { gs.softcapShift = (gs.softcapShift || 0) + 3; }
  },
  {
    id: "monitor", name: "Monitor", emoji: "🖥️",
    desc: "Wszystkie taski idle szybciej o 10%.", cost: 4,
    svg: `<rect x="-22" y="-14" width="44" height="28" rx="4" fill="#333"/>
          <rect x="-14" y="-4" width="28" height="14" rx="3" fill="#0cc" opacity="0.63"/>`,
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.10; }
  },
  {
    id: "lama", name: "Lama", emoji: "🦙",
    desc: "Idle mnożniki rosną szybciej (+30%).", cost: 5,
    svg: `<ellipse cx="0" cy="4" rx="16" ry="10" fill="#fff9f6"/>
          <ellipse cx="0" cy="-4" rx="6" ry="8" fill="#fff"/>
          <rect x="-9" y="-11" width="18" height="16" rx="5" fill="#f7dcc3"/>`,
    effect: gs => { gs.idleMultiplierGrow = (gs.idleMultiplierGrow || 0.01) * 1.3; }
  },
  {
    id: "ekspres", name: "Ekspres do kawy", emoji: "☕",
    desc: "Idle we wszystkich zadaniach +12%.", cost: 8,
    svg: `<ellipse cx="0" cy="0" rx="26" ry="26" fill="#eee"/>`,
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.12; }
  },
  {
    id: "podkladka", name: "Antystresowa podkładka", emoji: "🖱️",
    desc: "Kliky +10% (trwały efekt).", cost: 12,
    svg: `<rect x="-22" y="-9" width="44" height="18" rx="9" fill="#def"/>`,
    effect: gs => { gs.baseClick = (gs.baseClick || 1) * 1.1; }
  },
  {
    id: "prestiżowe-biurko", name: "BIURKOWY PRESTIŻ", emoji: "💎",
    desc: "Globalny mnożnik idle *1.17. Najwyższy biurowy upgrade.", cost: 25,
    svg: `<ellipse cx="0" cy="0" rx="22" ry="22" fill="#87c4ff"/><ellipse cx="0" cy="0" rx="14" ry="14" fill="#fff"/>`,
    effect: gs => { gs.idleMultiplier = (gs.idleMultiplier || 1) * 1.17; }
  }
];
  const hotspotMap = {
  "hotspot-cup": 0,
  "hotspot-flower": 1,
  "hotspot-lamp": 2,
  "hotspot-monitor": 3,
  "hotspot-lama": 4,
  "hotspot-ekspres": 5,
  "hotspot-podkladka": 6,
  "hotspot-prestiżowe-biurko": 7
  };
  const ui = window.IdleUI;
let deskModsOwned = [];
  
function renderDeskSVG() {
  for (const id in hotspotMap) {
    let idx = hotspotMap[id];
    const group = document.getElementById(id);

    // WAŻNE: jeśli nie masz elementu SVG o tym id, pomiń!
    if (!group) continue;

    group.classList.remove("desk-hotspot-hover", "desk-hotspot-bought", "desk-hotspot-locked");
    // Sprawdzenie czy g istnieje (np. dla czystych hotspotów!):
    let gElement = group.querySelector("g");
    if (gElement) gElement.innerHTML = "";

    group.onmouseenter = (ev) => {
      showDeskTooltip(idx, group);
      group.classList.add("desk-hotspot-hover");
    };
    group.onmouseleave = (ev) => {
      hideDeskTooltip();
      group.classList.remove("desk-hotspot-hover");
    };
    group.onclick = () => {
      if (!deskModsOwned.includes(idx)) {
        if (softSkills >= DESK_MODS[idx].cost) {
          deskModsOwned.push(idx);
          softSkills -= DESK_MODS[idx].cost;
          window.softSkills = softSkills; // zawsze synchronizuj window
          if (typeof DESK_MODS[idx].effect === "function") DESK_MODS[idx].effect(gameState);
          applyDeskModsEffects();
          saveGame();
          ui.renderAll(tasks, totalPoints, softSkills, burnout);
          renderDeskSVG();
        }
      }
    };

    if (deskModsOwned.includes(idx)) {
      group.classList.add("desk-hotspot-bought");
      if (gElement) gElement.innerHTML = DESK_MODS[idx].svg;
    } else {
      if (softSkills < DESK_MODS[idx].cost) {
        group.classList.add("desk-hotspot-locked");
      }
      // Dla pustych miejsc powiększ/zmień wygląd hotspotu
      if (gElement) {
        gElement.innerHTML = `<circle cx="0" cy="0" r="38" fill="#ffee90" stroke="#ffa800" stroke-width="7" opacity="0.9"/>` +
                             `<text x="0" y="12" font-size="32" font-weight="bold" fill="#ffa800" text-anchor="middle" pointer-events="none">+</text>`;
      }
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
    id: "pierwszy-upg",
    name: "Pierwsza Optymalizacja",
    desc: "Wykonaj pierwszą optymalizację dowolnego zadania.",
    condition: gs => gs.upgradeCount && gs.upgradeCount >= 1,
    reward: { type: "multiplierInc", multiplierInc: 0.1 }
  },
  {
    id: "drugi-task",
    name: "Pierwszy Kolega z pracy",
    desc: "Odblokuj drugi kafelek (nowy task).",
    condition: gs => gs.tasks && gs.tasks.filter(t=>t.unlocked).length >= 2,
    reward: { type: "multiplierInc", multiplierInc: 0.07 }
  },
  {
    id: "quick-earn",
    name: "100 BP na start!",
    desc: "Zdobądź 100 biuro-punktów.",
    condition: gs => gs.totalPoints >= 100,
    reward: { type: "multiplierInc", multiplierInc: 0.08 }
  },
  {
    id: "early-ascend",
    name: "Pierwszy Awans",
    desc: "Wykonaj pierwszy awans w dowolnym zadaniu.",
    condition: gs => (gs.tasks && gs.tasks.some(t => t.ascendLevel && t.ascendLevel >= 1)),
    reward: { type: "multiplierInc", multiplierInc: 0.09 }
  },
  {
    id: "pracownik-roku",
    name: "Pracownik Roku",
    desc: "Zdobądź pierwszy 1.000 biuro-punktów.",
    condition: gs => gs.totalPoints >= 1000,
    reward: { type: "multiplierInc", multiplierInc: 0.07 }
  },
  {
    id: "excel-heros",
    name: "Excel Heros",
    desc: "Osiągnij 2. poziom w zadaniu 'Wklejka do Excela'.",
    condition: gs => gs.tasks && gs.tasks[5].level >= 2,
    reward: { type: "multiplierInc", multiplierInc: 0.09, taskIdx: 5 }
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
    reward: { type: "multiplierInc", multiplierInc: 0.08 }
  },
  {
    id: "awansator",
    name: "Awansator",
    desc: "Wykonaj 15 awansów w sumie.",
    condition: gs => gs.ascendCount >= 15,
    reward: { type: "multiplierInc", multiplierInc: 0.08 }
  },
  {
    id: "optymalizator",
    name: "Optymalizator",
    desc: "Zoptymalizuj dowolne zadanie 30 razy.",
    condition: gs => gs.upgradeCount >= 30,
    reward: { type: "multiplierInc", multiplierInc: 0.09 }
  },
  {
    id: "dzial-it",
    name: "Wsparcie IT",
    desc: "Kup przedmiot na biurko o temacie informatycznym.",
    condition: gs => gs.deskModsOwned && gs.deskModsOwned.includes('monitor'),
    reward: { type: "multiplierInc", multiplierInc: 0.06, taskIdx: 2 }
  },
  {
    id: "meeting-pro",
    name: "Meeting Pro",
    desc: "Zakończ 100 cykli idle na zadaniu 'Zebranie (udawaj zainteresowanego)'.",
    condition: gs => gs.tasks && gs.tasks[9].idleCycles >= 100,
    reward: { type: "multiplierInc", multiplierInc: 0.11 }
  },
  {
    id: "sztos-biurko",
    name: "Sztos Biurko",
    desc: "Zbierz co najmniej 4 przedmioty na biurko.",
    condition: gs => gs.deskModsOwned && gs.deskModsOwned.length >= 4,
    reward: { type: "multiplierInc", multiplierInc: 0.12 }
  },
  {
  id: "softskill-overdrive",
  name: "Pęknięty limit!",
  desc: "Zdobądź 10 Soft Skilli w sumie, aby odblokować przełamywanie limitu.",
  condition: gs => gs.softSkills >= 10,
  reward: { type: "softSkillOverflow", enabled: true }
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
    reward: { type: "multiplierInc", multiplierInc: 0.14 }
  },
  {
    id: "mistrz-softskilli",
    name: "Mistrz Soft Skilli",
    desc: "Uzbieraj co najmniej 100 Soft Skills.",
    condition: gs => gs.softSkills >= 100,
    reward: { type: "multiplierInc", multiplierInc: 0.15 }
  }
];

  window.ACHIEVEMENTS = ACHIEVEMENTS;

  let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];
  let pointsHistory = []; // do wykresu

function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks, totalPoints, softSkills, burnout, pointsHistory,
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
      window.softSkills = softSkills;
      if (typeof s.burnout === "number") burnout = s.burnout;
      pointsHistory = Array.isArray(s.pointsHistory) ? s.pointsHistory : [];
      if (Array.isArray(s.achievements)) {
        s.achievements.forEach(saved => {
          const orig = ACHIEVEMENTS.find(a => a.id === saved.id);
          if (orig) orig.unlocked = saved.unlocked;
        });
      }
      deskModsOwned = Array.isArray(s.deskModsOwned) ? s.deskModsOwned : [];
      // NOWA FORMUŁA
      tasks.forEach((t, i) => {
        const a = 0.88;
        const b = 1.33;
        t.getUpgradeCost = function() {
          return Math.ceil(a * Math.pow(b, this.level));
        };
      });
      window.tasks = tasks;
    } catch (e) {
      tasks = JSON.parse(JSON.stringify(TASKS));
      applyTaskMethods(tasks);
      pointsHistory = [];
      ACHIEVEMENTS.forEach(a => a.unlocked = false);
      deskModsOwned = [];
      applyDeskModsEffects();
      tasks.forEach((t, i) => {
        const a = 0.88;
        const b = 1.33;
        t.getUpgradeCost = function() {
          return Math.ceil(a * Math.pow(b, this.level));
        };
      });
      window.tasks = tasks;
    }
  } else {
    tasks = JSON.parse(JSON.stringify(TASKS));
    applyTaskMethods(tasks);
    pointsHistory = [];
    ACHIEVEMENTS.forEach(a => a.unlocked = false);
    deskModsOwned = [];
    // NOWA FORMUŁA
    tasks.forEach((t, i) => {
      const a = 0.88;
      const b = 1.33;
      t.getUpgradeCost = function() {
        return Math.ceil(a * Math.pow(b, this.level));
      };
    });
    window.tasks = tasks;
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
  if (
    idx < tasks.length &&
    !tasks[idx].unlocked &&
    (totalPoints >= tasks[idx].unlockCost || tasks[idx].unlockCost === 0)
  ) {
    // Odejmij punkty tylko jeśli koszt > 0
    if (tasks[idx].unlockCost > 0) {
      totalPoints -= tasks[idx].unlockCost;
      if (totalPoints < 0) totalPoints = 0; // bezpieczeństwo
    }
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
  // Dodawanie do mnożnika:
  const REWARD_MULT_INC = 0.0012;
  task.rewardMultiplier = (task.rewardMultiplier || 1) + REWARD_MULT_INC;

  // Reszta dotychczasowego kodu:
  const ascendLevel = typeof task.ascendLevel === "number" ? task.ascendLevel : 0;
  const stage = ASCEND_STAGES[ascendLevel] || ASCEND_STAGES[0];
const reward = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01)
  * (stage.rewardMult || 1)
  * (typeof task.rewardMultiplier === 'number' ? task.rewardMultiplier : 1);

  totalPoints += reward;
      window.totalPoints = totalPoints;   // <-- zawsze sync z window
      window.tasks = tasks;               // <-- zapewnij, że wszędzie ten sam obiekt
      window.IdleUI.updateTotalPoints(totalPoints);
      checkAchievements();
      saveGame();
      window.tasks = tasks; // sync again po ewentualnych zmianach (np. unlock)
      ui.updateSingleTile(idx, task, totalPoints);
      if (typeof renderGridProgress === "function")
        renderGridProgress(tasks, totalPoints);
      ui.renderProgress(idx, task.progress, task.multiplier);
      renderMultipliersBar();
      floatingScore(reward, idx, "#87c686");
      flashPoints();
      window.IdleUI.updateTotalPoints(totalPoints);
      ui.renderAchievements(window.ACHIEVEMENTS);
      if (typeof refreshHexKpiDashboard === "function")
        refreshHexKpiDashboard();
      return;
    }
    ui.renderProgress(idx, task.progress, task.multiplier);
    if (typeof refreshHexKpiDashboard === "function")
      refreshHexKpiDashboard();
  }, 1000 / 30);
}

function clickTask(idx) {
  const task = tasks[idx];
  if (!task.unlocked && task.unlockCost === 0) {
    tryUnlockTask(idx);
    return;
  }
  if (task.unlocked && !task.active) {
    startIdle(idx);
  }
}
let upgradeCount = 0;
function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = task.getUpgradeCost();
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      upgradeCount += 1;
      const REWARD_UPG = 0.03; // lub 0.03 albo wyższe!
      task.rewardMultiplier = (task.rewardMultiplier || 1) + REWARD_UPG;
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
  
// Zakładam, że ASCEND_COSTS jest tablicą 2D z kosztami awansu (zdefiniowaną globalnie)
// np. ASCEND_COSTS[idx][current]

function ascendTask(idx) {
  const task = tasks[idx];
  const current = typeof task.ascendLevel === "number" ? task.ascendLevel : 0; // Bieżący poziom kariery
  const nextStage = ASCEND_STAGES[current + 1];
  const cost = task.getAscendCost(); // Koszt awansu z current na kolejny poziom

  if (!nextStage) return;      // Brak kolejnego poziomu - max awans!
  if (!cost) return;           // Brak kosztu (możliwe przy błędnej tablicy)

  if (totalPoints >= cost) {
    totalPoints -= cost;
    task.ascendLevel = current + 1;
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
    window.softSkills = softSkills;
    burnout += 1;
    tasks = JSON.parse(JSON.stringify(TASKS));
    applyTaskMethods(tasks);
tasks.forEach((t, i) => {
  const a = 1;
  const b = 1.33;
  t.getUpgradeCost = function() {
    return Math.floor(a * Math.pow(b, this.level));
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
  idleMultiplierGrow: 0.01
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
    'Akt. mnożnik punktów: ' +
    tasks
      .map(t =>
        t.unlocked
          ? `<strong>${t.name}</strong>: x${(typeof t.rewardMultiplier === 'number' ? t.rewardMultiplier : 1).toFixed(3)}`
          : null
      )
      .filter(Boolean)
      .join(' &nbsp;&nbsp; | &nbsp;&nbsp; ');
}
let softSkillOverflowEnabled = false;
function checkAchievements() {
    const state = {
    totalPoints,
    softSkills,
    burnout,
    tasks,
    deskModsOwned,
    upgradeCount,  
  };
  ACHIEVEMENTS.forEach(a => {
    if (!a.unlocked && (!a.condition || a.condition(state))) {
      a.unlocked = true;
      if (a.reward && a.reward.type === "softSkillOverflow" && a.reward.enabled) {
        softSkillOverflowEnabled = true;
      }
      // Ulepszenie baseClick dla wszystkich zadań
      else if (a.reward && a.reward.type === "baseClick") {
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

  function init() {
    loadGame();
    timers = Array(tasks.length).fill(null);
    ui.init({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave,
      onAscendTask: ascendTask,
      onUnlockTask: tryUnlockTask
    });
tasks.forEach((task, idx) => {
  // Startuj idle TYLKO dla odblokowanych, ALE NIE pierwotnie/tylko po kliknięciu!
  if (task.unlocked && idx > 0) startIdle(idx);
  // Czyli for the first task (idx=0) NIE aktywuj na starcie
});
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
    updatePointsChart();
    ui.renderAchievements(window.ACHIEVEMENTS);
    setMarqueeQuote();
    window.IdleUI.panelNav();
  }
  window.addEventListener("load", init);

  window.renderDeskSVG = renderDeskSVG;
  window.closeModal = closeModal;
})();
