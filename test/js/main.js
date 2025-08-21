(() => {
  'use strict';

  // Bazowe wartości za klik
  const BASE_CLICKS = [1, 2, 4, 7, 11, 16, 23, 33, 46, 64, 88, 121, 166, 227, 311, 426];
  const TASKS = [
    { name: "Robienie kawy Szefowi", unlocked: true,  level: 0, baseClick: BASE_CLICKS[0],  baseIdle: 0.02, cycleTime: 1600, multiplier: 1, progress: 0, active: false, unlockCost: 0 },
    { name: "Ctrl+C, Ctrl+V", unlocked: false,  level: 0, baseClick: BASE_CLICKS[1],  baseIdle: 0.04, cycleTime: 2000, multiplier: 1, progress: 0, active: false, unlockCost: 40 },
    { name: "Przerzucanie maili do folderu", unlocked: false,  level: 0, baseClick: BASE_CLICKS[2],  baseIdle: 0.06, cycleTime: 2600, multiplier: 1, progress: 0, active: false, unlockCost: 120 },
    { name: "Small talk w kuchni", unlocked: false,  level: 0, baseClick: BASE_CLICKS[3],  baseIdle: 0.09, cycleTime: 2700, multiplier: 1, progress: 0, active: false, unlockCost: 260 },
    { name: "Zlecenie ticketu w JIRZE", unlocked: false,  level: 0, baseClick: BASE_CLICKS[4],  baseIdle: 0.13, cycleTime: 3150, multiplier: 1, progress: 0, active: false, unlockCost: 850 },
    { name: "Wklejka do Excela", unlocked: false,  level: 0, baseClick: BASE_CLICKS[5],  baseIdle: 0.18, cycleTime: 4050, multiplier: 1, progress: 0, active: false, unlockCost: 1850 },
    { name: "Prezentacja na Teamsy", unlocked: false, level: 0, baseClick: BASE_CLICKS[6],  baseIdle: 0.24, cycleTime: 5000, multiplier: 1, progress: 0, active: false, unlockCost: 4000 },
    { name: "Fake brainstorming", unlocked: false, level: 0, baseClick: BASE_CLICKS[7],  baseIdle: 0.30, cycleTime: 6000, multiplier: 1, progress: 0, active: false, unlockCost: 7200 },
    { name: "Przeklejka z Google Docs", unlocked: false, level: 0, baseClick: BASE_CLICKS[8],  baseIdle: 0.36, cycleTime: 7200, multiplier: 1, progress: 0, active: false, unlockCost: 11500 },
    { name: "Zebranie (udawaj, że słuchasz)", unlocked: false, level: 0, baseClick: BASE_CLICKS[9],  baseIdle: 0.47, cycleTime: 9000, multiplier: 1, progress: 0, active: false, unlockCost: 18000 },
    { name: "Standup 'co zrobisz dziś?'", unlocked: false,  level: 0, baseClick: BASE_CLICKS[10], baseIdle: 0.60, cycleTime: 11000, multiplier: 1, progress: 0, active: false, unlockCost: 29000 },
    { name: "Delegowanie lemingowi", unlocked: false,  level: 0, baseClick: BASE_CLICKS[11], baseIdle: 0.75, cycleTime: 13000, multiplier: 1, progress: 0, active: false, unlockCost: 52000 },
    { name: "Lunch break", unlocked: false,  level: 0, baseClick: BASE_CLICKS[12], baseIdle: 0.9, cycleTime: 17000, multiplier: 1, progress: 0, active: false, unlockCost: 76000 },
    { name: "Wysyłanie GIF-ów", unlocked: false,  level: 0, baseClick: BASE_CLICKS[13], baseIdle: 1.12, cycleTime: 22000, multiplier: 1, progress: 0, active: false, unlockCost: 120000 },
    { name: "Przeklikanie LinkedIna", unlocked: false,  level: 0, baseClick: BASE_CLICKS[14], baseIdle: 1.35, cycleTime: 32000, multiplier: 1, progress: 0, active: false, unlockCost: 230000 },
    { name: "Król Open Space", unlocked: false,  level: 0, baseClick: BASE_CLICKS[15], baseIdle: 2.17, cycleTime: 47000, multiplier: 1, progress: 0, active: false, unlockCost: 450000 }
  ];

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
  }
];
  const hotspotMap = {
  "hotspot-cup": 0,
  "hotspot-flower": 1,
  "hotspot-lamp": 2,
  "hotspot-monitor": 3,
  "hotspot-lama": 4
  };
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
    id: 'mail-master',
    name: "Mailowy Mistrz",
    desc: "Kliknij 100 razy w zadanie „Przerzucanie maili do folderu”",
    unlocked: false,
    reward: { taskIdx: 2, multiplierInc: 0.10 },
    condition: () => topClicks[2] >= 100
    },
    {
    id: 'coffee-baron',
    name: "Baron Kawowy",
    desc: "Zdobywaj łącznie 2500 punktów z „Robienie kawy Szefowi”",
    unlocked: false,
    reward: { taskIdx: 0, multiplierInc: 0.12 }, // większy bonus
    condition: () => tasks.level * BASE_CLICKS >= 2500
    },
    {
      id: 'level-up-5',
      name: "Poziom 5",
      desc: "Podnieś dowolne zadanie do poziomu 5",
      unlocked: false,
      reward: { taskIdx: null, multiplierInc: 0.05 }, // globalny modyfikator
      condition: () => tasks.some(t => t.level >= 5)
    },
    {
    id: 'daily-speaker',
    name: "Mówca na daily",
    desc: "Kliknij 75 razy w „Standup 'co zrobisz dziś?'”",
    unlocked: false,
    reward: { taskIdx: 10, multiplierInc: 0.18 },
    condition: () => topClicks[10] >= 75
    },
    {
    id: 'delegator',
    name: "Mistrz Delegowania",
    desc: "Podnieś „Delegowanie lemingowi” do poziomu 3",
    unlocked: false,
    reward: { taskIdx: 11, multiplierInc: 0.14 },
    condition: () => tasks.level >= 3
    },
    {
    id: 'giphy-enthusiast',
    name: "GIFoholik",
    desc: "Kliknij 40 razy w „Wysyłanie GIF-ów”",
    unlocked: false,
    reward: { taskIdx: 13, multiplierInc: 0.10 },
    condition: () => topClicks >= 40
    },
    {
  id: 'unlock-all',
  name: "KorpoLemur",
  desc: "Odblokuj wszystkie zadania kariery – każdy klik jest teraz mocniejszy!",
  unlocked: false,
  reward: { type: "baseClick", value: 2 }, // +2 do każdego kliknięcia wszędzie!
  condition: () => tasks.every(t => t.unlocked)
    },
    {
  id: 'first-softskill',
  name: 'Nowa Umiejętność',
  desc: 'Zgromadź pierwszy soft-skill przy pomocy przycisku!',
  unlocked: false,
  reward: { taskIdx: null, multiplierInc: 0.05 },
  condition: () => softSkills >= 1
    },
    {
  id: 'baseclick-power',
  name: "TurboKliki",
  desc: "Zdobądź 5 różnych osiągnięć – wszystkie Twoje kliknięcia stają się mocniejsze!",
  unlocked: false,
  reward: { type: "baseClick", value: 2 },
  condition: () => ACHIEVEMENTS.filter(a => a.unlocked).length >= 5
}
  ];

  window.ACHIEVEMENTS = ACHIEVEMENTS;

  let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];
  let pointsHistory = []; // do wykresu
  let topClicks = Array(TASKS.length).fill(0);

  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks, totalPoints, softSkills, burnout, pointsHistory, topClicks,
      achievements: ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: a.unlocked })),
      deskModsOwned
    }));
  }

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
        topClicks = Array.isArray(s.topClicks) ? s.topClicks : Array(TASKS.length).fill(0);
        if (Array.isArray(s.achievements)) {
          s.achievements.forEach(saved => {
            const orig = ACHIEVEMENTS.find(a => a.id === saved.id);
            if (orig) orig.unlocked = saved.unlocked;
          });
        }
        deskModsOwned = Array.isArray(s.deskModsOwned) ? s.deskModsOwned : [];
        tasks.forEach((t, i) => {
          if (typeof t.multiplier !== 'number') t.multiplier = 1;
          if (typeof t.baseIdle !== 'number') t.baseIdle = TASKS[i] && typeof TASKS[i].baseIdle === 'number' ? TASKS[i].baseIdle : 0.01;
          if (typeof t.baseClick !== 'number') t.baseClick = BASE_CLICKS[i];
        });
      } catch (e) {
        tasks = JSON.parse(JSON.stringify(TASKS));
        pointsHistory = [];
        topClicks = Array(TASKS.length).fill(0);
        ACHIEVEMENTS.forEach(a => a.unlocked = false);
        deskModsOwned = [];
        applyDeskModsEffects();
      }
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
      pointsHistory = [];
      topClicks = Array(TASKS.length).fill(0);
      ACHIEVEMENTS.forEach(a => a.unlocked = false);
      deskModsOwned = [];
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
    if (idx < tasks.length && !tasks[idx].unlocked && totalPoints >= tasks[idx].unlockCost)
      tasks[idx].unlocked = true;
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
        const idlePts = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01) * (typeof task.multiplier === 'number' ? task.multiplier : 1);
        totalPoints += idlePts;
        task.multiplier = ((typeof task.multiplier === 'number') ? task.multiplier : 1) + (gameState.idleMultiplierGrow || 0.01);
        tryUnlockTask(idx + 1);
        checkAchievements();
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout);
        ui.renderProgress(idx, task.progress, task.multiplier);
        renderMultipliersBar();
        floatingScore(idlePts, idx, "#87c686");
        flashPoints();
        ui.renderAchievements(window.ACHIEVEMENTS);
      }
      ui.renderProgress(idx, task.progress, task.multiplier);
    }, 1000 / 30);
  }

  function clickTask(idx) {
    const task = tasks[idx];
    if (task.unlocked) {
      totalPoints += task.baseClick || 1;
      topClicks[idx] += 1;
      tryUnlockTask(idx + 1);
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
      renderMultipliersBar();
      floatingScore(task.baseClick || 1, idx, "#1976d2");
      flashPoints();
      ui.renderAchievements(window.ACHIEVEMENTS);
    }
    if (!task.active) startIdle(idx);
  }

  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = Math.floor(20 * Math.pow(2.25, task.level));
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
      ui.renderUpgradeAffordances(tasks, totalPoints);
      renderMultipliersBar();
      checkAchievements();
      ui.renderAchievements(window.ACHIEVEMENTS);
    }
  }

  function prestige() {
    timers.forEach(t => clearInterval(t));
    if (totalPoints < 10000) return;
    softSkills += 1;
    burnout += 1;
    totalPoints = 0;
    tasks = JSON.parse(JSON.stringify(TASKS));
    applyDeskModsEffects();
    checkAchievements();
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
    confetti();
    ui.renderAchievements(window.ACHIEVEMENTS);

    // MODAL PO PIERWSZYM SOFTSKILLU!
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
  ACHIEVEMENTS.forEach(a => {
    if (!a.unlocked && (!a.condition || a.condition())) {
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

function floatingScore(points, idx, color) {
  const list = document.querySelectorAll(".kafelek");
  const el = list[idx];
  if (!el) return;
  el.classList.remove("clicked-anim");
  // Aby animacja zawsze się odpaliła, nawet po szybkim kliku
  void el.offsetWidth;
  el.classList.add("clicked-anim");
  setTimeout(() => el.classList.remove("clicked-anim"), 180);
}
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
    "Czy był tu kiedyś onboarding?",
    "Od tego jest PowerPoint!",
    "Tak było na daily, nie pamiętasz?",
    "Możesz to wrzucić na SLACKA?",
    "Deadline wczoraj, prezentacja dziś",
    "Daj mi 5 minut na prodzie",
    "Robimy szybki brainstorming",
    "Wyślij mi briefa na maila"
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
    let rows = topClicks.map((c, i) =>
      c > 0 ? `<tr><td>${TASKS[i].name}</td><td>${c}</td></tr>` : ''
    ).filter(Boolean).join('');
    if (!rows) return '';
    return `<div class="topk-table"><b>Twoje top klikane zadania:</b>
      <table>${rows}</table></div>`;
  }
const ui = window.IdleUI; // lub używaj window.IdleUI bezpośrednio

function init() {
  loadGame();
  timers = Array(tasks.length).fill(null);
  ui.init({
    onClickTask: clickTask,
    onUpgradeTask: upgradeTask,
    onPrestige: prestige,
    onClearSave: clearSave
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
