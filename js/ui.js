(() => {
  'use strict';
  let eventHandlers = {};
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
  function taskTile(task, idx, totalPoints) {
    const upgCost = Math.floor(20 * Math.pow(2.25, task.level));
    const canUpgrade = totalPoints >= upgCost;
    const gainIdle = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01) * (typeof task.multiplier === 'number' ? task.multiplier : 1);
    const barMs = getBarCycleMs(task);
    const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
    const multiplierLabel = (typeof task.multiplier === 'number'?task.multiplier:1).toFixed(3);

    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-taskidx="${idx}" tabindex="0">
        <div class="kafelek-info">
          <div class="title">${task.name}</div>
          <div class="kafelek-row">Poziom: <b>${task.level}</b></div>
          <div class="kafelek-row">Idle: <b>${perSec}</b> pkt/s <span style="font-size:.96em;color:#888;font-weight:400;">(x${multiplierLabel})</span></div>
          <div class="kafelek-row">Za klik: <b>1</b></div>
          <div class="kafelek-progbar">
            <div class="kafelek-progbar-inner" style="width:${Math.round((task.progress||0)*100)}%"></div>
          </div>
        </div>
        <button class="kafelek-ulepsz-btn" data-do="upg" data-idx="${idx}" ${!task.unlocked || !canUpgrade ? "disabled" : ""}>
          Ulepsz<br>(${fmt(upgCost)})
        </button>
      </div>`;
  }

  function panelNav() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        document.querySelectorAll(".panel").forEach(panel => panel.style.display = "none");
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        const target = btn.dataset.panel;
        btn.classList.add("active");
        document.getElementById("panel-" + target).style.display = "";
      });
    });
    document.querySelector('.tab-btn[data-panel="kariera"]').classList.add("active");
    document.getElementById("panel-kariera").style.display = "";
    document.getElementById("panel-firma").style.display = "none";
    document.getElementById("panel-ustawienia").style.display = "none";
  }

  function renderAll(tasks, totalPoints, softSkills, burnout = 0) {
    e("#top-total-points").textContent = fmt(totalPoints);
    e("#top-soft-skills").textContent = fmt(softSkills);
    e("#panel-kariera").innerHTML = `
      <h2>Twoja kariera w korpo</h2>
      <div class="career-list">${tasks.map((task, idx) => taskTile(task, idx, totalPoints)).join('')}</div>
      <div class="softskill-info">
        <span>🧠 Soft Skills: <b>${softSkills}</b></span>
        ${burnout ? ` | 😵‍💫 Burnout Level: <b style="color:#a22">${burnout}</b>` : ''}
      </div>
      <div style="color:#e79522;margin-top:10px;font-size:1.02em"><b>Tip:</b> Klikaj na kafelki żeby pracować! Pasek idle się wyświetla, a mnożniki znajdziesz pod Biuro-punktami.</div>
    `;
    addEvents(tasks.length);
  }

  function renderProgress(idx, progress) {
    const bar = document.querySelector(`.kafelek[data-taskidx="${idx}"] .kafelek-progbar-inner`);
    if (bar) bar.style.width = Math.round(progress * 100) + "%";
  }

  function renderUpgradeAffordances(tasks, totalPoints) {
    document.querySelectorAll('.kafelek-ulepsz-btn').forEach((btn, idx) => {
      const upgCost = Math.floor(20 * Math.pow(2.25, tasks[idx].level));
      btn.disabled = (!tasks[idx].unlocked || totalPoints < upgCost);
    });
  }

  function addEvents(tasksLen) {
    document.querySelectorAll(".kafelek").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.classList.contains("kafelek-ulepsz-btn")) return;
        if (el.classList.contains("locked")) return;
        const idx = Number(el.dataset.taskidx);
        eventHandlers.onClickTask(idx);
      };
      el.onkeydown = (e) => {
        if ((e.key === "Enter" || e.key === " ") && !el.classList.contains("locked")) {
          e.preventDefault();
          eventHandlers.onClickTask(Number(el.dataset.taskidx));
        }
      }
    });
    document.querySelectorAll('[data-do="upg"]').forEach(btn =>
      btn.onclick = (e) => {
        e.stopPropagation();
        eventHandlers.onUpgradeTask(Number(btn.dataset.idx));
      }
    );
    const pbtn = document.getElementById("prestige-btn");
    if (pbtn) pbtn.onclick = () => eventHandlers.onPrestige();
    const rbtn = document.getElementById("reset-btn");
    if (rbtn) rbtn.onclick = () => eventHandlers.onClearSave();
  }

  window.IdleUI = {
    init(opts) {
      eventHandlers = opts;
      panelNav();
    },
    renderAll,
    renderProgress,
    renderUpgradeAffordances
  };
})();
