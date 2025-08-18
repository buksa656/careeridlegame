(() => {
  'use strict';

  const el = (q) => document.querySelector(q);

  function fmt(n) { return Math.round(n); }

  function makeTaskTile(task, idx, canUnlock, onClickTask, onUpgradeTask) {
    const wrap = document.createElement('div');
    wrap.className = 'kafelek' + (task.unlocked ? '' : ' locked');

    const info = document.createElement('div');
    info.className = 'kafelek-info';
    info.innerHTML = `
      <div class="title">${task.name}</div>
      <div class="kafelek-progbar">
        <div class="kafelek-progbar-inner" style="width:${Math.min(100, (task.points / (task.unlockCost || 1)) * 100)}%"></div>
      </div>
      <div class="kafelek-row">Poziom: <b>${task.lvl}</b> &nbsp; Punkty: <b>${fmt(task.points)}</b></div>
      <div class="kafelek-row">Zysk na klik: ${fmt(task.baseGain * Math.pow(task.gainGrowth, task.lvl))}</div>
    `;

    const actions = document.createElement('div');
    actions.className = 'kafelek-akcje';

    if (!task.unlocked) {
      actions.innerHTML = `<button ${!canUnlock ? "disabled" : ""} data-unlock="${idx}">Odblokuj za ${task.unlockCost} PKT</button>`;
    } else {
      actions.innerHTML = `
        <button data-click="${idx}">Pracuj</button>
        <button data-upg="${idx}">Ulepsz (${fmt(10 * Math.pow(2.1, task.lvl))} PKT)</button>`;
    }

    wrap.appendChild(info);
    wrap.appendChild(actions);
    return wrap;
  }

  let cfg = {};

  const QRI_UI = {
    mount(config) {
      cfg = config;
      el('#careerList').addEventListener('click', e => {
        const t = e.target;
        if (t.matches('button[data-click]')) cfg.onClickTask(Number(t.dataset.click));
        if (t.matches('button[data-upg]')) cfg.onUpgradeTask(Number(t.dataset.upg));
        if (t.matches('button[data-unlock]')) {
          const idx = Number(t.dataset.unlock);
          // Unlock: pobierz taski, odblokuj jeśli poprzedni ma wystarczająco punktów
          const event = new CustomEvent('unlock-task', { detail: { idx }});
          el('#careerList').dispatchEvent(event);
        }
        if (t.matches('#prestigeBtn')) cfg.onPrestige();
        if (t.matches('#clearSave')) cfg.onClearSave();
      });

      // Unlock handler
      el('#careerList').addEventListener('unlock-task', e => {
        const idx = e.detail.idx;
        if (idx > 0) {
          const tasks = cfg.getTasks ? cfg.getTasks() : [];
          if (tasks[idx - 1].points >= tasks[idx].unlockCost) {
            tasks[idx].unlocked = true;
            tasks[idx - 1].points -= tasks[idx].unlockCost;
            QRI_UI.updateTasks(tasks, cfg.currentPosition || "", QRI_UI._prestigeReady(tasks));
          }
        }
      });
    },
    updateTasks(tasks, position, prestigeReady) {
      el('#careerList').innerHTML = `
        <div style="font-size:1.15em;margin-bottom:12px;"><b>Stanowisko:</b> ${position}</div>
        ${tasks.map((task, i) =>
          makeTaskTile(task, i, i === 0 || tasks[i - 1].points >= (task.unlockCost || 0), cfg.onClickTask, cfg.onUpgradeTask).outerHTML
        ).join("")}
        ${prestigeReady ? `<button id="prestigeBtn" style="display:block;margin:28px auto 8px auto;padding:10px 38px;border-radius:8px;background:#1976d2;color:#fff;font-weight:700;font-size:1.1em;">Awansuj na wyższy szczebel</button>` : ""}
        <button id="clearSave" style="margin:24px 0 0 0;float:right;background:#eee;border:none;padding:8px 15px;border-radius:6px;color:#c22;">Wyczyść zapis</button>
      `;
    },
    _prestigeReady(tasks) {
      return tasks && tasks.length && tasks.every(t => t.unlocked);
    },
    updateSoftSkills(soft, level, total) {
      const stats = document.querySelector('#softStats');
      if (stats)
        stats.innerHTML = `Obecny szczebel kariery: <b>${level}/${total}</b><br> Soft Skills (prestige): <b>${soft}</b>`;
    }
  };

  window.QRI_UI = QRI_UI;
})();
