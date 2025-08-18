(() => {
  'use strict';
  let eventHandlers = {};

  function e(q) { return document.querySelector(q); }

  function fmt(n) {
    if (typeof n === "number")
      return n >= 1000 ? n.toLocaleString("pl") : Math.round(n);
    return n;
  }

  function taskTile(task, idx) {
    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-taskidx="${idx}">
        <div class="kafelek-info">
          <b>${task.name}</b><br>
          Zarobek: <b>${fmt(task.baseGain * Math.pow(task.gainGrowth, task.level))}</b><br>
          Poziom: ${task.level}<br>
          Punkty: <b>${fmt(task.points)}</b><br>
          ${!task.unlocked && task.unlockCost ? `Odblokuj za <b>${fmt(task.unlockCost)}</b>` : ''}
          <div class="kafelek-progbar">
            <div class="kafelek-progbar-inner" style="width:${Math.round((task.progress||0)*100)}%"></div>
          </div>
        </div>
        <div class="kafelek-akcje">
          <button ${!task.unlocked ? "disabled" : ""} data-do="click" data-idx="${idx}">Wykonaj</button>
          <button ${!task.unlocked ? "disabled" : ""} data-do="upg" data-idx="${idx}">Ulepsz</button>
        </div>
      </div>`;
  }

  function renderAll(tasks, totalPoints, softSkills) {
    e("#panel-kariera").innerHTML = `
      <h2>Kariera</h2>
      <div class="career-list">${tasks.map(taskTile).join('')}</div>
      <div><b>Wszystkie punkty: ${fmt(totalPoints)}</b></div>
    `;

    e("#panel-firma").innerHTML = `
      <h2>Zmiana firmy (Prestige)</h2>
      <div>Soft Skills: <b>${softSkills}</b></div>
      <button id="prestige-btn" ${totalPoints < 1000 ? "disabled" : ""}>Zmień firmę (1000+ pkt)</button>
    `;

    e("#panel-ustawienia").innerHTML = `<button id="reset-btn">Resetuj całą grę</button>`;

    addEvents(tasks.length);
  }

  function renderProgress(idx, progress) {
    const bar = document.querySelector(`.kafelek[data-taskidx="${idx}"] .kafelek-progbar-inner`);
    if (bar) bar.style.width = Math.round(progress * 100) + "%";
  }

  function addEvents(tasksLen) {
    [...document.querySelectorAll("[data-do='click']")].forEach(btn =>
      btn.onclick = () => eventHandlers.onClickTask(Number(btn.dataset.idx)));
    [...document.querySelectorAll("[data-do='upg']")].forEach(btn =>
      btn.onclick = () => eventHandlers.onUpgradeTask(Number(btn.dataset.idx)));
    const pbtn = document.getElementById("prestige-btn");
    if (pbtn) pbtn.onclick = () => eventHandlers.onPrestige();
    const rbtn = document.getElementById("reset-btn");
    if (rbtn) rbtn.onclick = () => eventHandlers.onClearSave();
  }

  window.IdleUI = {
    init(opts) { eventHandlers = opts; },
    renderAll,
    renderProgress
  };
})();
