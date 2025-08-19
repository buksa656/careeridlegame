(() => {
'use strict';
// Pomocnicze funkcje
function e(q) { return document.querySelector(q); }
function fmt(n) {
  return typeof n === "number" && n >= 1000 ? n.toLocaleString("pl") : Math.round(n);
}
function getBarCycleMs(task) {
  const speedGrowth = 0.94;
  const lvl = Math.min(task.level, 15);
  const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
  return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap;
}
const colorByLevel = lvl => lvl >= 30 ? "#caa806" : lvl >= 20 ? "#299a4d" : lvl >= 10 ? "#1976d2" : "";
// Kafelek zadania
function taskTile(task, idx, totalPoints, locked = false) {
  const upgCost = Math.floor(20 * Math.pow(2.25, task.level));
  const gainIdle = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01) * (typeof task.multiplier === 'number' ? task.multiplier : 1);
  const barMs = getBarCycleMs(task);
  const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
  const style = colorByLevel(task.level) && !locked ? `style="border-color:${colorByLevel(task.level)}"` : '';
  return `<div class="kafelek${locked ? ' locked' : ''}" ${style}>
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
// Renderowanie panelu kariery
function renderAll(tasks, totalPoints, softSkills, burnout) {
  const list = e('#panel-kariera .career-list');
  if (list) {
    list.innerHTML = tasks.map((t, i) => taskTile(t, i, totalPoints, !t.unlocked)).join("");
  }
  if (e('#top-total-points')) e('#top-total-points').innerText = fmt(totalPoints);
  if (e('#soft-skills')) e('#soft-skills').innerText = softSkills;
  if (e('#burnout')) e('#burnout').innerText = burnout;
}
// Pasek progresu kafelka
function renderProgress(idx, progress, multiplier) {
  const bars = document.querySelectorAll('.kafelek-progbar-inner');
  if (bars[idx]) bars[idx].style.width = `${progress * 100}%`;
}
// Aktywacja/dezaktywacja przycisków ulepszania
function renderUpgradeAffordances(tasks, totalPoints) {
  const btns = document.querySelectorAll('.kafelek-ulepsz-btn');
  btns.forEach((btn, idx) => {
    const cost = Math.floor(20 * Math.pow(2.25, tasks[idx].level));
    btn.disabled = totalPoints < cost;
  });
}
// MODAL reward/achievement
function showModal(html) {
  let modal = document.createElement('div');
  modal.id = "reward-modal";
  modal.innerHTML = html + `<br><button onclick="this.parentNode.remove()">OK</button>`;
  document.body.appendChild(modal);
}
// Achievementy — generowanie tablicy
function renderAchievementsTab() {
  const achList = document.querySelector('#panel-achievementy .ach-list');
  const {ACHIEVEMENTS, unlockedAchievements} = window.korposzczur;
  if (achList) {
    achList.innerHTML = ACHIEVEMENTS.map(ach =>
      `<div class="ach-item${unlockedAchievements && unlockedAchievements.includes(ach.id) ? ' completed' : ''}">
        <span class="emoji">${ach.emoji}</span>
        <span>
          <span class="ach-name">${ach.name}</span><br>
          <span class="ach-desc">${ach.desc}</span>
        </span>
      </div>`
    ).join('');
  }
}
// ------ Obsługa zakładek ------
function openPanel(panel) {
  document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
  const active = document.getElementById('panel-' + panel);
  if (active) active.style.display = '';
  document.querySelectorAll('.tab-btn').forEach(btn =>
    btn.classList.toggle('active', btn.getAttribute('data-panel') === panel)
  );
  // Dodatkowe renderowanie dla achievementów
  if (panel === 'achievementy') renderAchievementsTab();
  // Dla kariery – zawsze renderAll!
  if (panel === 'kariera' && window.korposzczur && window.korposzczur.tasks)
    renderAll(window.korposzczur.tasks, window.korposzczur.totalPoints, window.korposzczur.softSkills, window.korposzczur.burnout);
}
window.openPanel = openPanel;
// Obsługa kliknięć w zakładki nawigacji
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('tab-btn')) {
    openPanel(e.target.dataset.panel);
  }
});
// ------ Inicjalizacja gry po załadowaniu strony ------
document.addEventListener("DOMContentLoaded", function() {
  // startowa zakładka
  openPanel('kariera');
  if(window.korposzczur && window.korposzczur.loadGame) window.korposzczur.loadGame();
  if(window.korposzczur && window.korposzczur.tasks) renderAll(
    window.korposzczur.tasks,
    window.korposzczur.totalPoints,
    window.korposzczur.softSkills,
    window.korposzczur.burnout
  );
  if(window.korposzczur && window.korposzczur.renderMultipliersBar) window.korposzczur.renderMultipliersBar();
});
// Eksport funkcji do globalnego obiektu ui
window.ui = {
  renderAll,
  renderProgress,
  renderUpgradeAffordances,
  showModal,
  renderAchievementsTab
};
})();
