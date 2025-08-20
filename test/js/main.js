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

  // --- ACHIEVEMENTY ---
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
      desc: "Uzyskaj 1000 punktów z pracy „Robienie kawy Szefowi” (Lvl * bazowy klik >= 1000)",
      unlocked: false,
      reward: { taskIdx: 0, multiplierInc: 0.10 },
      condition: () => tasks.level * BASE_CLICKS >= 1000
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
      desc: "Kliknij 50 razy w „Standup 'co zrobisz dziś?'”",
      unlocked: false,
      reward: { taskIdx: 10, multiplierInc: 0.12 },
      condition: () => topClicks[10] >= 50
    },
    {
      id: 'delegator',
      name: "Mistrz Delegowania",
      desc: "Odblokuj zadanie „Delegowanie lemingowi”",
      unlocked: false,
      reward: { taskIdx: 11, multiplierInc: 0.15 },
      condition: () => tasks.unlocked
    },
    {
      id: 'giphy-enthusiast',
      name: "GIFoholik",
      desc: "Kliknij 25 razy w „Wysyłanie GIF-ów”",
      unlocked: false,
      reward: { taskIdx: 13, multiplierInc: 0.08 },
      condition: () => topClicks >= 25
    },
    {
      id: 'linkedin-pro',
      name: "LinkedIn Pro",
      desc: "Uzyskaj 500 punktów z „Przeklikanie LinkedIna” (Lvl * bazowy klik >= 500)",
      unlocked: false,
      reward: { taskIdx: 14, multiplierInc: 0.10 },
      condition: () => tasks.level * BASE_CLICKS >= 500
    },
    {
      id: 'burnout-survivor',
      name: "Survivor",
      desc: "Prestige (zdobądź dodatkową umiejętność miękką)",
      unlocked: false,
      reward: { taskIdx: null, multiplierInc: 0.10 },
      condition: () => softSkills >= 1
    }
  ];

  // Udostępnij globalnie ACHIEVEMENTS do UI
  window.ACHIEVEMENTS = ACHIEVEMENTS;

  let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];
  let pointsHistory = []; // do wykresu
  let topClicks = Array(TASKS.length).fill(0);

  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks, totalPoints, softSkills, burnout, pointsHistory, topClicks,
      achievements: ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: a.unlocked }))
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
        // Wczytaj stan ev. achievementów
        if (Array.isArray(s.achievements)) {
          s.achievements.forEach(saved => {
            const orig = ACHIEVEMENTS.find(a => a.id === saved.id);
            if (orig) orig.unlocked = saved.unlocked;
          });
        }
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
      }
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
      pointsHistory = [];
      topClicks = Array(TASKS.length).fill(0);
      ACHIEVEMENTS.forEach(a => a.unlocked = false);
    }
    // Upewnij się, że automaty idle ruszają
    tasks.forEach((t, i) => { if (t.unlocked && !t.active) startIdle(i); });
    // Od razu po loadzie odśwież osiągnięcia
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
    const lvl = Math.min(task.level, 15);
    const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
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
        task.multiplier = ((typeof task.multiplier === 'number') ? task.multiplier : 1) + 0.01;
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
    checkAchievements();
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
    confetti();
    ui.renderAchievements(window.ACHIEVEMENTS);
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
        if (a.reward.taskIdx !== null) {
          tasks[a.reward.taskIdx].multiplier += a.reward.multiplierInc;
        } else {
          tasks.forEach(t => { if (t.unlocked) t.multiplier += a.reward.multiplierInc; });
        }
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
    const float = document.createElement("div");
    float.className = "floating-score";
    float.style.color = color || "#1976d2";
    float.textContent = "+" + (points % 1 === 0 ? points : points.toFixed(3));
    float.style.left = "47%";
    float.style.top = "25px";
    el.appendChild(float);
    setTimeout(() => { float.style.transform = "translateY(-32px) scale(1.15)"; float.style.opacity = "0"; }, 10);
    setTimeout(() => el.removeChild(float), 600);
    el.classList.add("clicked-anim");
    setTimeout(() => el.classList.remove("clicked-anim"), 320);
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
  const ui = window.IdleUI;
function init() {
  loadGame();
  timers = Array(tasks.length).fill(null);
  ui.init({
    onClickTask: clickTask,
    onUpgradeTask: upgradeTask,
    onPrestige: prestige,
    onClearSave: clearSave
  });
  // inne rzeczy ustawiane przy starcie gry...
  ui.renderAll(tasks, totalPoints, softSkills, burnout);
  ui.renderUpgradeAffordances(tasks, totalPoints);
  renderMultipliersBar();
  updatePointsChart();
  ui.renderAchievements(window.ACHIEVEMENTS); // <- po starcie
  setMarqueeQuote();
}
    // START IDLE od razu dla odblokowanych!
    tasks.forEach((task, idx) => { if(task.unlocked) startIdle(idx); });
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
    updatePointsChart();
    ui.renderAchievements(window.ACHIEVEMENTS); // <- po starcie
  }
  window.addEventListener("load", init);
})();
