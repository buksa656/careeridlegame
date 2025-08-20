(() => {
  'use strict';
  let eventHandlers = {};

  function e(q) { return document.querySelector(q); }

  function fmt(n) {
    return typeof n === "number" && n >= 1000
      ? n.toLocaleString("pl") : Math.round(n);
  }

  function getBarCycleMs(task) {
    const speedGrowth = 0.94;
    const lvl = Math.min(task.level, 15);
    const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
    return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap / Math.max(0.001, (typeof task.multiplier === 'number' ? task.multiplier : 1));
  }

  const colorByLevel = lvl =>
    lvl >= 30 ? "#caa806" : lvl >= 20 ? "#299a4d" : lvl >= 10 ? "#1976d2" : "";

  function taskTile(task, idx, totalPoints, locked = false) {
    const upgCost = typeof task.getUpgradeCost === "function"
      ? task.getUpgradeCost()
      : Math.floor(20 * Math.pow(2.25, task.level));
    const canUpgrade = totalPoints >= upgCost;
    const gainIdle = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01) * (typeof task.multiplier === 'number' ? task.multiplier : 1);
    const barMs = getBarCycleMs(task);
    const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
    const multiplierLabel = (typeof task.multiplier === 'number' ? task.multiplier : 1).toFixed(3);
    const style = colorByLevel(task.level) && !locked ? `style="border-color:${colorByLevel(task.level)}"` : '';
    return `
      <div class="kafelek${locked ? ' locked' : ''} ${task.level >= 10 && !locked ? "lvled" : ""}" data-taskidx="${idx}" tabindex="0" ${style}>
        <div class="kafelek-info">
          <div class="title">${task.name}</div>
          <div class="kafelek-row">Poziom: <b>${task.level}</b></div>
          <div class="kafelek-row">Idle: <b>${perSec}</b> pkt/s <span style="font-size:.96em;color:#888;font-weight:400;">(x${multiplierLabel})</span></div>
          <div class="kafelek-row">Za klik: <b>${task.baseClick || 1}</b></div>
          <div class="kafelek-progbar">
            <div class="kafelek-progbar-inner" style="width:${Math.round((task.progress || 0) * 100)}%"></div>
          </div>
          ${locked && typeof task.unlockCost === 'number' ? `<div class="kafelek-row" style="color:#b7630b;">Odblokuj za <b>${fmt(task.unlockCost)}</b> biuro-pkt</div>` : ''}
        </div>
        <button class="kafelek-ulepsz-btn" data-do="upg" data-idx="${idx}" ${locked || !canUpgrade ? "disabled" : ""}>
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
      // RENDERUJ ODPOWIEDNI PANEL:
      if (target === "kariera" && window.tasks && typeof renderAll === "function") {
        renderAll(window.tasks, window.totalPoints, window.softSkills, window.burnout);
      } else if (target === "osiagniecia" && window.ACHIEVEMENTS && typeof renderAchievements === "function") {
        renderAchievements(window.ACHIEVEMENTS);
      } else if (target === "biurko" && typeof window.renderDeskSVG === "function") {
        window.renderDeskSVG();
      }
      });
    });
    // Ustaw domyślną aktywną (Kariera)
    document.querySelector('.tab-btn[data-panel="kariera"]').classList.add("active");
    document.getElementById("panel-kariera").style.display = "";
    document.querySelectorAll(".panel").forEach(panel => {
      if(panel.id !== "panel-kariera") panel.style.display = "none";
    });
  }

  function renderAll(tasks, totalPoints, softSkills, burnout = 0) {
    let maxUnlockedIdx = -1;
    for (let i = 0; i < tasks.length; ++i) if (tasks[i].unlocked) maxUnlockedIdx = i;
    let visibleTasks = [];
    for (let i = 0; i < tasks.length; ++i) {
      if (tasks[i].unlocked) visibleTasks.push(taskTile(tasks[i], i, totalPoints, false));
      else if (i === maxUnlockedIdx + 1) visibleTasks.push(taskTile(tasks[i], i, totalPoints, true));
    }
    let totalPointsStr = Number(totalPoints).toLocaleString('pl-PL', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    let [intPart, fracPart] = totalPointsStr.split(',');
    e("#top-total-points").innerHTML =
      `<span>${intPart}</span><span class="fraction">,${fracPart}</span>`;
    e("#top-soft-skills").textContent = fmt(softSkills);
    renderMultipliersBar(tasks);
    e("#panel-kariera").innerHTML = `
      <h2>Twoja kariera w korpo</h2>
      <div class="career-list">${visibleTasks.join('')}</div>
      <div class="softskill-info">
        <span>Soft Skills: <b>${softSkills}</b></span>
        ${burnout ? ` |  Burnout Level: <b style="color:#a22">${burnout}</b>` : ''}
      </div>
      <div style="color:#e79522;margin-top:10px;font-size:1.02em"><b>Tip:</b> Klikaj na kafelki żeby pracować! Pasek idle się wyświetla, a mnożniki znajdziesz pod Biuro-punktami.</div>
      <div id="grid-progress"></div>
    `;
    const next = tasks[maxUnlockedIdx + 1];
    if (next && next.unlockCost) {
      const prog = Math.min(Number(totalPoints) / Number(next.unlockCost), 1);
      e("#grid-progress").innerHTML = `<div class="unlock-progress">
        <div class="unlock-progress-bar" style="width:${(prog * 100).toFixed(1)}%"></div>
        <span>${Math.min((prog * 100), 100).toFixed(0)}% do odblokowania nowej pracy</span>
      </div>`;
    }
    addEvents(tasks.length);
    updateTopClicks();
  }

  function renderMultipliersBar(tasks) {
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

  function updateTopClicks() {
    if (window.topClicks && window.TASKS) {
      let rows = window.topClicks.map((c, i) =>
        c > 0 ? `<tr><td>${window.TASKS[i].name}</td><td>${c}</td></tr>` : ''
      ).filter(Boolean).join('');
      let panel = document.getElementById("panel-kariera");
      if (rows && panel) {
        let html = `<div class="topk-table" style="margin-top:9px;"><b>Twoje top klikane zadania:</b>
        <table>${rows}</table></div>`;
        if (!document.querySelector(".topk-table")) panel.insertAdjacentHTML('beforeend', html);
      }
    }
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

  // --------- ACHIEVEMENTY, wyświetlanie ------------

function renderAchievements(achArr) {
  const container = document.getElementById('achievements-container');
  if (!container) return;
  container.innerHTML = achArr.map(a => {
    // Opis nagrody
    let rewardText = '';
    if (a.reward) {
      if (a.reward.taskIdx !== null) {
        rewardText = `Nagroda: +${Math.round(a.reward.multiplierInc * 100)}% mnożnika do zadania`;
      } else {
        rewardText = `Nagroda: +${Math.round(a.reward.multiplierInc * 100)}% mnożnika globalnego`;
      }
    }
    return `
      <div class="ach-item${a.unlocked ? ' completed' : ''}">
        <div class="emoji">${a.unlocked ? '🏆' : '🔒'}</div>
        <div>
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
          <div class="ach-reward">${rewardText}</div>
          ${a.unlocked ? `<div class="ach-date">Zdobyte</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function showAchievement(a) {
  let toast = document.getElementById('achievement-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'achievement-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <span class="emoji">🏆</span>
    <div>
      <div style="font-weight:bold;font-size:1.1em;letter-spacing:0.2px">${a.name}</div>
      <div class="desc">${a.desc}</div>
    </div>
  `;
  toast.classList.add("visible");
  toast.style.display = "flex";

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => { toast.style.display = "none"; }, 370);
  }, 3200);
}

  // --- eksport API ---
window.IdleUI = {
  init: function (opts) {
    eventHandlers = opts;
    // NIE wywołuj panelNav od razu!
  },
  panelNav,          // <-- Eksportuj funkcję panelNav jako funkcję!
  renderAll,
  renderProgress,
  renderUpgradeAffordances,
  renderAchievements,
  showAchievement
};
})();
