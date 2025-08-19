(() => {
  'use strict';
  // Bazowe wartości za klik (progresywnie)
  const BASE_CLICKS = [1, 2, 4, 7, 11, 16, 23, 33, 46, 64, 88, 121, 166, 227, 311, 426];
  // Progresywnie rosnące mnożniki (wpływ na poprzedni task po odblokowaniu nowego)
  const NEXT_MULTIPLIERS = [1, 1.07, 1.13, 1.15, 1.18, 1.22, 1.26, 1.31, 1.37, 1.44, 1.53, 1.62, 1.72, 1.84, 2.00, 2.20];

  // Główne zadania + progresywny mnożnik oraz klik
  const TASKS = [
    { name: "Robienie kawy Szefowi", unlocked: true,  level: 0, baseClick: BASE_CLICKS[0],  baseIdle: 0.02, cycleTime: 1600, multiplier: 1, progress: 0, active: false, unlockCost: 0, nextMultiplier: NEXT_MULTIPLIERS },
    { name: "Ctrl+C, Ctrl+V", unlocked: false,  level: 0, baseClick: BASE_CLICKS[1],  baseIdle: 0.04, cycleTime: 2000, multiplier: 1, progress: 0, active: false, unlockCost: 40, nextMultiplier: NEXT_MULTIPLIERS[1] },
    { name: "Przerzucanie maili do folderu", unlocked: false,  level: 0, baseClick: BASE_CLICKS[2],  baseIdle: 0.06, cycleTime: 2600, multiplier: 1, progress: 0, active: false, unlockCost: 120, nextMultiplier: NEXT_MULTIPLIERS[2]},
    { name: "Small talk w kuchni", unlocked: false,  level: 0, baseClick: BASE_CLICKS[3],  baseIdle: 0.09, cycleTime: 2700, multiplier: 1, progress: 0, active: false, unlockCost: 260, nextMultiplier: NEXT_MULTIPLIERS[3]},
    { name: "Zlecenie ticketu w JIRZE", unlocked: false,  level: 0, baseClick: BASE_CLICKS[4],  baseIdle: 0.13, cycleTime: 3150, multiplier: 1, progress: 0, active: false, unlockCost: 850, nextMultiplier: NEXT_MULTIPLIERS[4]},
    { name: "Wklejka do Excela", unlocked: false,  level: 0, baseClick: BASE_CLICKS[5],  baseIdle: 0.18, cycleTime: 4050, multiplier: 1, progress: 0, active: false, unlockCost: 1850, nextMultiplier: NEXT_MULTIPLIERS[5]},
    { name: "Prezentacja na Teamsy", unlocked: false, level: 0, baseClick: BASE_CLICKS,  baseIdle: 0.24, cycleTime: 5000, multiplier: 1, progress: 0, active: false, unlockCost: 4000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Fake brainstorming", unlocked: false,   level: 0, baseClick: BASE_CLICKS,  baseIdle: 0.30, cycleTime: 6000, multiplier: 1, progress: 0, active: false, unlockCost: 7200, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Przeklejka z Google Docs", unlocked: false,  level: 0, baseClick: BASE_CLICKS,  baseIdle: 0.36, cycleTime: 7200, multiplier: 1, progress: 0, active: false, unlockCost: 11500, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Zebranie (udawaj, że słuchasz)", unlocked: false, level: 0, baseClick: BASE_CLICKS,  baseIdle: 0.47, cycleTime: 9000, multiplier: 1, progress: 0, active: false, unlockCost: 18000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Standup 'co zrobisz dziś?'", unlocked: false,  level: 0, baseClick: BASE_CLICKS, baseIdle: 0.60, cycleTime: 11000, multiplier: 1, progress: 0, active: false, unlockCost: 29000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Delegowanie lemingowi", unlocked: false,  level: 0, baseClick: BASE_CLICKS, baseIdle: 0.75, cycleTime: 13000, multiplier: 1, progress: 0, active: false, unlockCost: 52000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Lunch break 🥪", unlocked: false,  level: 0, baseClick: BASE_CLICKS, baseIdle: 0.9, cycleTime: 17000, multiplier: 1, progress: 0, active: false, unlockCost: 76000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Wysyłanie GIF-ów", unlocked: false,  level: 0, baseClick: BASE_CLICKS, baseIdle: 1.12, cycleTime: 22000, multiplier: 1, progress: 0, active: false, unlockCost: 120000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Przeklikanie LinkedIna", unlocked: false,  level: 0, baseClick: BASE_CLICKS, baseIdle: 1.35, cycleTime: 32000, multiplier: 1, progress: 0, active: false, unlockCost: 230000, nextMultiplier: NEXT_MULTIPLIERS},
    { name: "Król Open Space", unlocked: false,  level: 0, baseClick: BASE_CLICKS, baseIdle: 2.17, cycleTime: 47000, multiplier: 1, progress: 0, active: false, unlockCost: 450000, nextMultiplier: NEXT_MULTIPLIERS}
  ];
  let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];
  let pointsHistory = [], topClicks = Array(TASKS.length).fill(0), achievements = [], prestigeCount = 0;

  // ---- Achievementy ----
  const ACHIEVEMENTS = [
    { name: "Order Kawosza", desc: "Kliknij w 'Robienie kawy Szefowi' 100 razy.", check: st=>st.topClicks[0]>=100, reward: {type:"points", value:250}, emoji: "☕" },
    { name: "Główny Kopiowacz", desc: "Kliknij w 'Ctrl+C, Ctrl+V' 200 razy.", check: st=>st.topClicks[1]>=200, reward: {type:"multiplier", value:1.05}, emoji: "📋" },
    { name: "Szef wszystkich szefów", desc: "Osiągnij poziom 10 w dowolnej pracy.", check: st=>st.tasks.some(t=>t.level>=10), reward: {type:"points", value:1000}, emoji: "👑" },
    { name: "Excelowy Mistrz", desc: "Zdobądź 10 000 biuro-punktów.", check: st=>st.totalPoints>=10000, reward: {type:"badge", value:"💾 Excel Master"}, emoji: "💾" },
    { name: "Korporacyjny Weteran", desc: "Przejdź karierę od nowa 3 razy.", check: st=>st.prestigeCount>=3, reward: {type:"points", value:3000}, emoji: "🦸‍♂️" }
  ];

  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks, totalPoints, softSkills, burnout, pointsHistory, topClicks, achievements, prestigeCount
    }));
  }
  function loadGame() {
    const save = localStorage.getItem("korposzczur_save");
    if (save) {
      try {
        const s = JSON.parse(save);
        if (Array.isArray(s.tasks)) tasks = s.tasks;
        if (typeof s.totalPoints === "number") totalPoints = s.totalPoints;
        if (typeof s.softSkills === "number") softSkills = s.softSkills;
        if (typeof s.burnout === "number") burnout = s.burnout;
        pointsHistory = Array.isArray(s.pointsHistory) ? s.pointsHistory : [];
        topClicks = Array.isArray(s.topClicks) ? s.topClicks : Array(TASKS.length).fill(0);
        achievements = Array.isArray(s.achievements) ? s.achievements : [];
        prestigeCount = typeof s.prestigeCount === "number" ? s.prestigeCount : 0;
        tasks.forEach((t, i) => {
          if (typeof t.multiplier !== 'number') t.multiplier = 1;
          if (typeof t.baseIdle !== 'number') t.baseIdle = TASKS[i] && typeof TASKS[i].baseIdle === 'number' ? TASKS[i].baseIdle : 0.01;
          if (typeof t.baseClick !== 'number') t.baseClick = BASE_CLICKS[i];
          if (typeof t.nextMultiplier !== 'number') t.nextMultiplier = NEXT_MULTIPLIERS[i];
        });
      } catch (e) { /* reset na default */ }
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
      pointsHistory = [];
      topClicks = Array(TASKS.length).fill(0);
      achievements = [];
      prestigeCount = 0;
    }
  }
  function clearSave() {
    timers.forEach(t => clearInterval(t));
    localStorage.removeItem("korposzczur_save");
    location.reload();
  }
  function tryUnlockTask(idx) {
    if (idx < tasks.length && !tasks[idx].unlocked && totalPoints >= tasks[idx].unlockCost) {
      tasks[idx].unlocked = true;
      // NOWOŚĆ: mnożnik nowej pracy bonusuje poprzednią!
      const m = tasks[idx].nextMultiplier || 1;
      if(idx-1 >= 0) {
        tasks[idx-1].multiplier *= m;
        if(!tasks[idx-1].upgradeDiscount) tasks[idx-1].upgradeDiscount=1;
        tasks[idx-1].upgradeDiscount *= m;
      }
    }
  }
  function getBarCycleMs(task) {
    const speedGrowth = 0.94;
    const lvl = Math.min(task.level, 15);
    const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
    return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap;
  }
  function upgradeTask(idx) {
    const task = tasks[idx];
    let cost = Math.floor(20 * Math.pow(2.25, task.level));
    if(task.upgradeDiscount) cost = Math.floor(cost / task.upgradeDiscount);
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, prestigeCount);
      ui.renderUpgradeAffordances(tasks, totalPoints);
      renderMultipliersBar();
      checkAchievements();
    }
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
        task.multiplier = ((typeof task.multiplier === 'number') ? task.multiplier : 1) + 0.001;
        tryUnlockTask(idx + 1);
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, prestigeCount);
        ui.renderProgress(idx, task.progress, task.multiplier);
        renderMultipliersBar();
        floatingScore(idlePts, idx, "#87c686");
        flashPoints();
        checkAchievements();
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
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, prestigeCount);
      renderMultipliersBar();
      floatingScore(task.baseClick || 1, idx, "#1976d2");
      flashPoints();
      checkAchievements();
    }
    if (!task.active) startIdle(idx);
  }
  // --- Achievementy: odblokowanie, nagroda, celebracja
  function checkAchievements() {
    let state = {tasks, totalPoints, softSkills, burnout, topClicks, prestigeCount};
    ACHIEVEMENTS.forEach((a,i)=>{
      if(!achievements.includes(i) && a.check(state)) {
        achievements.push(i);
        setTimeout(()=>ui.showRewardModal(a,i), 200);
        saveGame();
        ui.renderAchievementyPanel(achievements);
      }
    });
  }
  // PANEL KARIERY / PRESTIŻU
  function prestige() {
    timers.forEach(t => clearInterval(t));
    if (totalPoints < 10000) return;
    softSkills += 1;
    burnout += 1;
    prestigeCount++;
    totalPoints = 0;
    tasks = JSON.parse(JSON.stringify(TASKS));
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, prestigeCount);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    ui.renderAchievementyPanel(achievements);
    ui.renderPrestigePanel(prestigeCount, softSkills);
    renderMultipliersBar();
    confetti();
    checkAchievements();
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
    "„Czy był tu kiedyś onboarding?”",
    "„Od tego jest PowerPoint!”",
    "„Tak było na daily, nie pamiętasz?”",
    "„Możesz to wrzucić na SLACKA?”",
    "„Deadline wczoraj, prezentacja dziś”",
    "„Daj mi 5 minut na prodzie”",
    "„Robimy szybki brainstorming…”",
    "„Wyślij mi briefa na maila”"
  ];
  function randomQuote() {
    const el = document.getElementById('quote');
    let idx = Math.floor(Math.random() * OFFICE_QUOTES.length);
    el.innerHTML = "💬 <span>" + OFFICE_QUOTES[idx] + "</span>";
    el.classList.remove("quote-anim");
    void el.offsetWidth;
    el.classList.add("quote-anim");
  }
  setInterval(randomQuote, 42000);
  setTimeout(randomQuote, 2000);
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
      onClearSave: clearSave,
      renderPrestigePanel: (pc,ss) => ui.renderPrestigePanel(pc,ss)
    });
    tasks.forEach((task, idx) => { if(task.unlocked) startIdle(idx); });
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, prestigeCount);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
  }
  window.addEventListener("load", init);
})();
