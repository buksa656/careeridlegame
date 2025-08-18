(() => {
  'use strict';

  const el = (q) => document.querySelector(q);

  function fmt(n) { return (Math.round(n * 100) / 100).toLocaleString("pl"); }

  function makeTaskTile(task, idx, canUnlock) {
    const prog = Math.max(0, Math.min(1, task.progress || 0));
    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-task-idx="${idx}">
        <div class="kafelek-info">
          <div class="title">${task.name}</div>
          <div class="kafelek-progbar">
            <div class="kafelek-progbar-inner" style="width:${Math.floor(prog * 100)}%"></div>
          </div>
          <div class="kafelek-row">
            Poziom: <b>${task.lvl}</b> &nbsp; Punkty: <b>${fmt(task.points)}</b>
          </div>
          <div class="kafelek-row">
            Idle: <b>${fmt(task.idleRate || task.baseIdle || 0)}</b> PKT/s
            ${task.clickGain ? ` &bull; Pracuj: <b>${fmt(task.clickGain)}</b> PKT/klik` : ""}
          </div>
        </div>
        <div class="kafelek-akcje">
          ${!task.unlocked
            ? `<button class="unlock-btn" ${!canUnlock ? "disabled" : ""}>Odblokuj za ${task.unlockCost} PKT</button>`
            : `<button class="pracuj-btn">Pracuj</button>
               <button class="upg-btn">Ulepsz (+0.5 PKT/s) (${fmt(10 * Math.pow(2.1, task.lvl))} PKT)</button>`
          }
        </div>
      </div>
    `;
  }

  let cfg = {};

  const QRI_UI = {
    mount(config) {
      cfg = config;
      this.updateTasks([], '', false);
    },
    updateTasks(tasks, position, prestigeReady) {
      const wrap = el('#careerList');
      if (!wrap) return;

      wrap.innerHTML = `
        <div style="font-size:1.15em;margin-bottom:12px;"><b>Stanowisko:</b> ${position}</div>
        ${tasks.map((task, i) =>
          makeTaskTile(task, i, i === 0 || (tasks[i - 1].points >= (task.unlockCost || 0))).trim()
        ).join("")}
        ${prestigeReady ? `<button id="prestigeBtn" style="display:block;margin:28px auto 8px auto;padding:10px 38px;border-radius:8px;background:#1976d2;color:#fff;font-weight:700;font-size:1.1em;">Awansuj na wyższy szczebel</button>` : ""}
        <button id="clearSave" style="margin:22px 0 0 0;float:right;background:#eee;border:none;padding:8px 15px;border-radius:6px;color:#c22;">Wyczyść zapis</button>
      `;

      // Obsługa KAŻDEGO kliknięcia po renderze!
      Array.from(wrap.querySelectorAll('.kafelek')).forEach(div => {
        const idx = Number(div.dataset.taskIdx);
        const unlockBtn = div.querySelector('.unlock-btn');
        if (unlockBtn) {
          unlockBtn.onclick = () => {
            if(idx>0 && tasks[idx-1].points >= (tasks[idx].unlockCost || 0)){
              tasks[idx].unlocked = true;
              tasks[idx-1].points -= (tasks[idx].unlockCost || 0);
              this.updateTasks(tasks, position, this._prestigeReady(tasks));
            }
          };
        }
        const pracujBtn = div.querySelector('.pracuj-btn');
        if (pracujBtn) pracujBtn.onclick = () => cfg.onClickTask(idx);
        const upgBtn = div.querySelector('.upg-btn');
        if (upgBtn) upgBtn.onclick = () => cfg.onUpgradeTask(idx);
      });

      const prestigeBtn = wrap.querySelector('#prestigeBtn');
      if (prestigeBtn) prestigeBtn.onclick = () => cfg.onPrestige();

      const clearSaveBtn = wrap.querySelector('#clearSave');
      if (clearSaveBtn) clearSaveBtn.onclick = () => cfg.onClearSave();
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
