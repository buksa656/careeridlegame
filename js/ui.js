(() => {
'use strict';

let eventHandlers = {};
function e(q) { return document.querySelector(q); }
function fmt(n) { return typeof n === "number" && n >= 1000 ? n.toLocaleString("pl") : Math.round(n); }
function getBarCycleMs(task) {
  const speedGrowth = 0.94;
  const lvl = Math.min(task.level, 15);
  const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
  return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap;
}
const colorByLevel = lvl => lvl >= 30 ? "#caa806" : lvl >= 20 ? "#299a4d" : lvl >= 10 ? "#1976d2" : "";

function taskTile(task, idx, totalPoints, locked = false) {
  const upgCost = Math.floor(20 * Math.pow(2.25, task.level));
  const gainIdle = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01) * (typeof task.multiplier === 'number' ? task.multiplier : 1);
  const barMs = getBarCycleMs(task);
  const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
  const style = colorByLevel(task.level) && !locked ? `style="border-color:${colorByLevel(task.level)}"` : '';
  return `<div class="kafelek ${locked ? 'locked' : ''}" ${style}">
    <div class="kafelek-info">
      <div class="title">${task.name}</div>
      <div class="kafelek-row">Idle: <strong>${perSec}/s</strong></div>
      <div class="kafelek-row">Level: ${task.level}</div>
      <div class="kafelek-row">Mnożnik: x${(typeof task.multiplier === 'number' ? task.multiplier : 1).toFixed(3)}</div>
    </div>
    <div class="kafelek-progbar">
      <div class="kafelek-progbar-inner" style="width:${(task.progress || 0) * 100}%"></div>
    </div>
    <button class="kafelek-ulepsz-btn" data-upgrade="${idx}" ${totalPoints < upgCost ? 'disabled' : ''}>Ulepsz (${fmt(upgCost)})</button>
  </div>`;
}

function renderAll(tasks, totalPoints, softSkills, burnout) {
  const careerList = e('.career-list');
  careerList.innerHTML = tasks.map((t, i) => taskTile(t, i, totalPoints, !t.unlocked)).join("");
  e('#top-total-points').innerText = fmt(totalPoints);
  e('#soft-skills').innerText = softSkills;
  e('#burnout').innerText = burnout;
}
function renderProgress(idx, progress, multiplier) {
  const bar = document.querySelectorAll('.kafelek-progbar-inner')[idx];
  if (bar) bar.style.width = `${progress * 100}%`;
}
function renderUpgradeAffordances(tasks, totalPoints) {
  document.querySelectorAll('.kafelek-ulepsz-btn').forEach((btn, idx) => {
    const cost = Math.floor(20 * Math.pow(2.25, tasks[idx].level));
    btn.disabled = totalPoints < cost;
  });
}

// MODAL
function showModal(html) {
  let modal = document.createElement('div');
  modal.id = "reward-modal";
  modal.innerHTML = html + `<br><button onclick="this.parentNode.remove()">OK</button>`;
  document.body.appendChild(modal);
}

// ACHIEVEMENT TAB
function renderAchievementsTab() {
  const achList = document.querySelector('.ach-list');
  const {ACHIEVEMENTS, unlockedAchievements} = window.korposzczur;
  achList.innerHTML = ACHIEVEMENTS.map(ach => `<div class="ach-item${unlockedAchievements && unlockedAchievements.includes(ach.id) ? ' completed' : ''}">
    <span class="emoji">${ach.emoji}</span>
    <span>
      <span class="ach-name">${ach.name}</span><br>
      <span class="ach-desc">${ach.desc}</span>
    </span>
  </div>`).join('');
}

window.ui = {
  renderAll, renderProgress, renderUpgradeAffordances, showModal, renderAchievementsTab
};
})();
