(() => {
'use strict';

// Bazowe wartości za klik
const BASE_CLICKS = [1, 2, 4, 7, 11, 16, 23, 33, 46, 64, 88, 121, 166, 227, 311, 426];

const TASKS = [
{ name: "Robienie kawy Szefowi", unlocked: true, level: 0, baseClick: BASE_CLICKS[0], baseIdle: 0.02, cycleTime: 1600, multiplier: 1, progress: 0, active: false, unlockCost: 0 },
{ name: "Ctrl+C, Ctrl+V", unlocked: false, level: 0, baseClick: BASE_CLICKS[1], baseIdle: 0.04, cycleTime: 2000, multiplier: 1, progress: 0, active: false, unlockCost: 40 },
{ name: "Przerzucanie maili do folderu", unlocked: false, level: 0, baseClick: BASE_CLICKS[2], baseIdle: 0.06, cycleTime: 2600, multiplier: 1, progress: 0, active: false, unlockCost: 120 },
{ name: "Small talk w kuchni", unlocked: false, level: 0, baseClick: BASE_CLICKS[3], baseIdle: 0.09, cycleTime: 2700, multiplier: 1, progress: 0, active: false, unlockCost: 260 },
{ name: "Zlecenie ticketu w JIRZE", unlocked: false, level: 0, baseClick: BASE_CLICKS[4], baseIdle: 0.13, cycleTime: 3150, multiplier: 1, progress: 0, active: false, unlockCost: 850 },
{ name: "Wklejka do Excela", unlocked: false, level: 0, baseClick: BASE_CLICKS[5], baseIdle: 0.18, cycleTime: 4050, multiplier: 1, progress: 0, active: false, unlockCost: 1850 },
{ name: "Prezentacja na Teamsy", unlocked: false, level: 0, baseClick: BASE_CLICKS[6], baseIdle: 0.24, cycleTime: 5000, multiplier: 1, progress: 0, active: false, unlockCost: 4000 },
{ name: "Fake brainstorming", unlocked: false, level: 0, baseClick: BASE_CLICKS[7], baseIdle: 0.30, cycleTime: 6000, multiplier: 1, progress: 0, active: false, unlockCost: 7200 },
{ name: "Przeklejka z Google Docs", unlocked: false, level: 0, baseClick: BASE_CLICKS[8], baseIdle: 0.36, cycleTime: 7200, multiplier: 1, progress: 0, active: false, unlockCost: 11500 },
{ name: "Zebranie (udawaj, że słuchasz)", unlocked: false, level: 0, baseClick: BASE_CLICKS[9], baseIdle: 0.47, cycleTime: 9000, multiplier: 1, progress: 0, active: false, unlockCost: 18000 },
{ name: "Standup 'co zrobisz dziś?'", unlocked: false, level: 0, baseClick: BASE_CLICKS[10], baseIdle: 0.60, cycleTime: 11000, multiplier: 1, progress: 0, active: false, unlockCost: 29000 },
{ name: "Delegowanie lemingowi", unlocked: false, level: 0, baseClick: BASE_CLICKS[11], baseIdle: 0.75, cycleTime: 13000, multiplier: 1, progress: 0, active: false, unlockCost: 52000 },
{ name: "Lunch break 🥪", unlocked: false, level: 0, baseClick: BASE_CLICKS[12], baseIdle: 0.9, cycleTime: 17000, multiplier: 1, progress: 0, active: false, unlockCost: 76000 },
{ name: "Wysyłanie GIF-ów", unlocked: false, level: 0, baseClick: BASE_CLICKS[13], baseIdle: 1.12, cycleTime: 22000, multiplier: 1, progress: 0, active: false, unlockCost: 120000 },
{ name: "Przeklikanie LinkedIna", unlocked: false, level: 0, baseClick: BASE_CLICKS[14], baseIdle: 1.35, cycleTime: 32000, multiplier: 1, progress: 0, active: false, unlockCost: 230000 },
{ name: "Król Open Space", unlocked: false, level: 0, baseClick: BASE_CLICKS[15], baseIdle: 2.17, cycleTime: 47000, multiplier: 1, progress: 0, active: false, unlockCost: 450000 }
];

// ACHIEVEMENTS
const ACHIEVEMENTS = [
  { id: 1, name: "Pierwszy dzień w korpo", desc: "Zdobądź 10 punktów.", emoji: "🎉", condition: () => totalPoints >= 10, reward: () => { tasks[0].multiplier += 0.1; } },
  { id: 2, name: "Automatyzator", desc: "Odblokuj automatyzację pierwszego zadania.", emoji: "🤖", condition: () => tasks[1] && tasks[1].unlocked, reward: () => { totalPoints += 50; } },
  { id: 3, name: "Awansik", desc: "Pierwszy awans (ulepsz 1. pracę).", emoji: "⬆️", condition: () => tasks[0].level >= 1, reward: () => { tasks.multiplier += 0.25; } },
  { id: 5, name: "Pracoholik", desc: "Zdobądź 10000 punktów!", emoji: "😵‍💫", condition: () => totalPoints >= 10000, reward: () => { burnout += 1; } }
  // Dodaj śmiało kolejne!
];
let unlockedAchievements = [];

// Save/load/burnout/prestige
let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];
let pointsHistory = [];
let topClicks = Array(TASKS.length).fill(0);

function saveGame() {
  localStorage.setItem("korposzczur_save", JSON.stringify({tasks, totalPoints, softSkills, burnout, pointsHistory, topClicks, unlockedAchievements}));
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
      unlockedAchievements = Array.isArray(s.unlockedAchievements) ? s.unlockedAchievements : [];
      tasks.forEach((t, i) => {
        if (typeof t.multiplier !== 'number') t.multiplier = 1;
        if (typeof t.baseIdle !== 'number') t.baseIdle = TASKS[i] && typeof TASKS[i].baseIdle === 'number' ? TASKS[i].baseIdle : 0.01;
        if (typeof t.baseClick !== 'number') t.baseClick = BASE_CLICKS[i];
      });
    } catch (e) {
      tasks = JSON.parse(JSON.stringify(TASKS));
      unlockedAchievements = [];
      pointsHistory = [];
      topClicks = Array(TASKS.length).fill(0);
    }
  } else {
    tasks = JSON.parse(JSON.stringify(TASKS));
    unlockedAchievements = [];
    pointsHistory = [];
    topClicks = Array(TASKS.length).fill(0);
  }
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
  return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap;
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
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
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
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    renderMultipliersBar();
    floatingScore(task.baseClick || 1, idx, "#1976d2");
    flashPoints();
    if (!task.active) startIdle(idx);
    checkAchievements();
  }
}

// NOWA MECHANIKA MNOŻNIKÓW — przesunięcie efektu na upgrade poprzedniej pracy
function upgradeTask(idx) {
  const task = tasks[idx];
  let cost = Math.floor(20 * Math.pow(2.25, task.level));
  // Ulepszanie przez kolejny mnożnik:
  if (idx > 0 && tasks[idx].multiplier > 1) {
    // Zmniejsz koszt ulepszenia poprzedniej pracy i zwiększ mnożnik
    // const prevUpgrade = Math.floor(tasks[idx-1].level + 1);
    tasks[idx-1].upgradeDiscount = (tasks[idx].multiplier || 1);
    tasks[idx-1].multiplier *= tasks[idx].multiplier;
  }
  const effectiveCost = cost - (task.upgradeDiscount || 0);

  if (totalPoints >= effectiveCost) {
    task.level += 1;
    totalPoints -= effectiveCost;
    // Zerujemy zniżkę po upgrade żeby nie nawarstwiała się:
    task.upgradeDiscount = 0;
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    renderMultipliersBar();
    checkAchievements();
  }
}

function prestige() {
  timers.forEach(t => clearInterval(t));
  if (totalPoints < 10000) return;
  softSkills += 1;
  burnout += 1;
  totalPoints = 0;
  tasks = JSON.parse(JSON.stringify(TASKS));
  unlockedAchievements = [];
  saveGame();
  ui.renderAll(tasks, totalPoints, softSkills, burnout);
  ui.renderUpgradeAffordances(tasks, totalPoints);
  renderMultipliersBar();
  confetti();
}

// Achievement check & modal
function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (!unlockedAchievements.includes(a.id) && a.condition()) {
      unlockedAchievements.push(a.id);
      a.reward();
      showAchievementModal(a);
      saveGame();
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
      .join(' | ');
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

// Achievement modal
function showAchievementModal(ach) {
  ui.showModal(`<div class="emoji" style="font-size:2.5em">${ach.emoji}</div>
  <div><strong>${ach.name}</strong></div>
  <div>${ach.desc}</div>
  <div class="reward">Nagroda przyznana!</div>`);
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
  el.innerHTML = "💬 " + OFFICE_QUOTES[idx] + "";
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
    c > 0 ? `<tr><td>${TASKS[i].name}</td><td>${c}</td></tr>` : ""
  ).join("");
  return `<table class="topk-table"><tr><th>Praca</th><th>Klików</th></tr>${rows}</table>`;
}

// Eksportowanie globalne
window.korposzczur = {
  tasks, totalPoints, softSkills, burnout, pointsHistory, topClicks,
  saveGame, loadGame, clearSave, clickTask, upgradeTask, startIdle, prestige,
  updatePointsChart, renderMultipliersBar, topClickersTable, checkAchievements,
  unlockedAchievements, ACHIEVEMENTS,
};
})();
