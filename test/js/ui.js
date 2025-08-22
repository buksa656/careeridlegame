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
  const ascendLevel = typeof task.ascendLevel === "number" ? task.ascendLevel : 0;
  const ascendStage = ASCEND_STAGES[ascendLevel];
  const nextStage = ASCEND_STAGES[ascendLevel + 1];
  const upgCost = typeof task.getUpgradeCost === "function"
    ? task.getUpgradeCost()
    : Math.floor(20 * Math.pow(2.25, task.level));
  const canUpgrade = totalPoints >= upgCost;
  const gainIdle = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01)
    * (typeof task.multiplier === 'number' ? task.multiplier : 1)
    * ascendStage.idleMult;
  const clickVal = (typeof task.baseClick === 'number' ? task.baseClick : 1)
    * ascendStage.clickMult;
  const barMs = getBarCycleMs(task);
  const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
  const multiplierLabel = (typeof task.multiplier === 'number' ? task.multiplier : 1).toFixed(3);
  const style = colorByLevel(task.level) && !locked ? `style="border-color:${colorByLevel(task.level)}"` : '';

  return `
  <div class="kafelek${locked ? ' locked' : ''}" data-taskidx="${idx}" tabindex="0">
    <div class="kafelek-info">
      <div class="title">${task.name}</div>
      <div class="kafelek-row asc-badge">
        <span class="tile-stage" style="color:#425;font-size:.97em;">${ascendStage.name}</span>
        <span class="tile-asc-perc asc-perc"
           style="color:#2477c7;font-weight:700;margin-left:7px;font-size:0.98em;">
           +${Math.round((ascendStage.idleMult - 1)*100)}% idle
        </span>
      </div>
      <div class="kafelek-row">Lvl: <b class="tile-lvl">${task.level}</b></div>
      <div class="kafelek-row">
        Idle: <b class="tile-idle">${perSec}</b> pkt/s 
        <span class="tile-mult" style="font-size:.96em;color:#888;font-weight:400;">(x${multiplierLabel})</span>
      </div>
      <div class="kafelek-row">
        Klik: <b class="tile-click">${clickVal}</b>
      </div>
      <div class="kafelek-row stats">
        <span>Kliki: <b class="tile-clicks">${window.topClicks ? window.topClicks[idx] : 0}</b></span>
        <span style="margin-left:13px">
          ta kariera: <b class="tile-prestige">${window.prestigeClicks ? window.prestigeClicks[idx] : 0}</b>
        </span>
      </div>
      ${locked && typeof task.unlockCost === 'number'
        ? `<div class="kafelek-row" style="color:#b7630b;">Koszt: <b class="tile-unlock">${fmt(task.unlockCost)}</b></div>` : ''
      }
    </div>
    <!-- PRZYCISKI (i cała reszta) pozostają BEZ zmian -->
    <div class="kafelek-bottom-row" style="display:flex;gap:9px; margin-top:13px;">
      <button class="kafelek-ulepsz-btn"
          data-do="upg"
          data-idx="${idx}"
          style="flex:1;min-width:0;"
          ${(!task.unlocked || !canUpgrade) ? "disabled" : ""}>
        Optymalizuj<br>(${fmt(upgCost)})
      </button>
      ${
        nextStage
          ? `<button class="ascend-btn" data-task="${idx}" style="flex:1;min-width:0;">
              Awans<br>(${nextStage.cost})
             </button>`
          : `<span style="flex:1; color:#c89;font-size:.97em;display:inline-block;text-align:center;">Max awans!</span>`
      }
    </div>
  </div>
  `;
}
function renderSingleTile(idx, task, totalPoints) {
  const kafelHtml = taskTile(task, idx, totalPoints, !task.unlocked);
  const outers = document.querySelectorAll('.kafelek-outer');
  const outer = outers[idx];
  if (outer) {
    outer.innerHTML = kafelHtml;
    addEvents(1);
  }
}
function updateSingleTile(idx, task, totalPoints) {
  const kafelek = document.querySelector(`.kafelek[data-taskidx="${idx}"]`);
  if (!kafelek) return;
  const ascendLevel = typeof task.ascendLevel === "number" ? task.ascendLevel : 0;
  const ascendStage = ASCEND_STAGES[ascendLevel];
  const gainIdle = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01)
    * (typeof task.multiplier === 'number' ? task.multiplier : 1)
    * ascendStage.idleMult;
  const barMs = getBarCycleMs(task);
  const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
  const clickVal = (typeof task.baseClick === 'number' ? task.baseClick : 1)
    * ascendStage.clickMult;
  const multiplierLabel = (typeof task.multiplier === 'number' ? task.multiplier : 1).toFixed(3);
  const nextStage = ASCEND_STAGES[ascendLevel + 1] || null;

  if (kafelek.querySelector('.tile-stage')) kafelek.querySelector('.tile-stage').innerText = ascendStage.name;
  if (kafelek.querySelector('.tile-asc-perc')) kafelek.querySelector('.tile-asc-perc').innerText = `+${Math.round((ascendStage.idleMult - 1) * 100)}% idle`;
  if (kafelek.querySelector('.tile-lvl')) kafelek.querySelector('.tile-lvl').innerText = task.level;
  if (kafelek.querySelector('.tile-idle')) kafelek.querySelector('.tile-idle').innerText = perSec;
  if (kafelek.querySelector('.tile-mult')) kafelek.querySelector('.tile-mult').innerText = `(x${multiplierLabel})`;
  if (kafelek.querySelector('.tile-click')) kafelek.querySelector('.tile-click').innerText = clickVal;
  if (kafelek.querySelector('.tile-clicks')) kafelek.querySelector('.tile-clicks').innerText = window.topClicks ? window.topClicks[idx] : 0;
  if (kafelek.querySelector('.tile-prestige')) kafelek.querySelector('.tile-prestige').innerText = window.prestigeClicks ? window.prestigeClicks[idx] : 0;

  // Jeśli masz unlock cost:
  const unlock = kafelek.querySelector('.tile-unlock');
  if (unlock && typeof task.unlockCost === 'number') unlock.innerText = fmt(task.unlockCost);

  // Przycisk optymalizuj
  const upgCost = typeof task.getUpgradeCost === "function"
    ? task.getUpgradeCost() : Math.floor(20 * Math.pow(2.25, task.level));
  const btnUpg = kafelek.querySelector('.kafelek-ulepsz-btn');
  if (btnUpg) btnUpg.innerHTML = `Optymalizuj<br>(${fmt(upgCost)})`;
  if (btnUpg) btnUpg.disabled = (!task.unlocked || totalPoints < upgCost);

  // Przycisk awans
  const btnAsc = kafelek.querySelector('.ascend-btn');
  if (btnAsc && nextStage)
    btnAsc.innerHTML = `Awans<br>(${nextStage.cost})`;
  if (btnAsc && !nextStage)
    btnAsc.outerHTML = `<span style="flex:1; color:#c89;font-size:.97em;display:inline-block;text-align:center;">Max awans!</span>`;
}
function panelNav() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      document.querySelectorAll(".panel").forEach(panel => panel.style.display = "none");
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      const target = btn.dataset.panel;
      btn.classList.add("active");
      document.getElementById("panel-" + target).style.display = "";

      // Tu uruchamiaj odpowiedni renderer:
      if (target === "kariera" && window.tasks) {
        renderAll(window.tasks, window.totalPoints, window.softSkills, window.burnout);
        window.tasks = tasks;  
        if (typeof refreshHexKpiDashboard === "function") refreshHexKpiDashboard();
      } else if (target === "osiagniecia" && window.ACHIEVEMENTS) {
        renderAchievements(window.ACHIEVEMENTS);
      } else if (target === "biurko" && typeof window.renderDeskSVG === "function") {
        window.renderDeskSVG();
      }
    });
  });

  // Ustaw domyślny panel i aktywny button:
  document.querySelector('.tab-btn[data-panel="kariera"]').classList.add("active");
  document.getElementById("panel-kariera").style.display = "";
  document.querySelectorAll(".panel").forEach(panel => {
    if (panel.id !== "panel-kariera") panel.style.display = "none";
  });
}
function renderGridProgress(tasks, totalPoints) {
  let maxUnlockedIdx = -1;
  for (let i = 0; i < tasks.length; ++i) if (tasks[i].unlocked) maxUnlockedIdx = i;
  const next = tasks[maxUnlockedIdx + 1];
  const progressDiv = document.getElementById("grid-progress");
  if (next && next.unlockCost && progressDiv) {
    const prog = Math.min(Number(totalPoints) / Number(next.unlockCost), 1);
    progressDiv.innerHTML = `<div class="unlock-progress">
      <div class="unlock-progress-bar" style="width:${(prog * 100).toFixed(1)}%"></div>
      <span>${Math.min((prog * 100), 100).toFixed(0)}% do odblokowania nowej pracy</span>
    </div>`;
  } else if (progressDiv) {
    progressDiv.innerHTML = ""; // czyść jeśli wszystko już odblokowane
  }
}
window.renderGridProgress = renderGridProgress;
function renderAll(tasks, totalPoints, softSkills, burnout = 0) {
  let maxUnlockedIdx = -1;
  for (let i = 0; i < tasks.length; ++i) if (tasks[i].unlocked) maxUnlockedIdx = i;

  let visibleTasks = [];
  for (let i = 0; i < tasks.length; ++i) {
    let kafel = '';
    if (tasks[i].unlocked) {
      kafel += taskTile(tasks[i], i, totalPoints, false);
    } else if (i === maxUnlockedIdx + 1) {
      kafel += taskTile(tasks[i], i, totalPoints, true);
    }
    if (kafel) {
      visibleTasks.push(`<div class="kafelek-outer">${kafel}</div>`);
    }
  }

  // Zliczanie punktów do wyświetlenia
  let totalPointsStr = Number(totalPoints).toLocaleString('pl-PL', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  let [intPart, fracPart] = totalPointsStr.split(',');

  e("#top-total-points").innerHTML = `<span>${intPart}</span><span class="fraction">,${fracPart}</span>`;
  e("#top-soft-skills").textContent = fmt(softSkills);

  renderMultipliersBar(tasks);

  // Button do zbierania soft-skill
  let softSkillBtn = '';
  const SOFTSKILL_COST = 10000;
  if (totalPoints >= SOFTSKILL_COST) {
    softSkillBtn = `
      <button id="get-softskill-btn" class="get-softskill-btn">
        <span class="ss-badge">🎓</span>
        <span class="ss-label">
          <b>Awans!</b>
          <div class="ss-desc">Zbierz <b>1 Soft Skill</b><br><small>(koszt: ${SOFTSKILL_COST})</small></div>
        </span>
      </button>
    `;
  }

  // ---- TU NASTĘPUJE GENEROWANIE CAŁEJ ZAWARTOŚCI panelu-kariera: ----
  e("#panel-kariera").innerHTML = `
    <div id="kpi-dashboard" style="display:flex; justify-content:center; margin-top:10px;"></div>
    <div id="grid-progress"></div>
    ${softSkillBtn}
    <div class="career-list">${visibleTasks.join('')}</div>
  `;

  // ---- I NATYCHMIAST PO WYGENEROWANIU HTML-a panelu --> dashboard!
  if (typeof refreshHexKpiDashboard === "function") refreshHexKpiDashboard();

  // Pasek postępu do odblokowania nowej pracy:
  const next = tasks[maxUnlockedIdx + 1];
  if (next && next.unlockCost) {
    const prog = Math.min(Number(totalPoints) / Number(next.unlockCost), 1);
    e("#grid-progress").innerHTML = `<div class="unlock-progress">
      <div class="unlock-progress-bar" style="width:${(prog * 100).toFixed(1)}%"></div>
      <span>${Math.min((prog * 100), 100).toFixed(0)}% do odblokowania nowej pracy</span>
    </div>`;
  }

  // Handler soft-skilla
  if (totalPoints >= SOFTSKILL_COST) {
    const btn = document.getElementById('get-softskill-btn');
    btn.onclick = () => {
      if (window.totalPoints >= SOFTSKILL_COST) {
        window.totalPoints -= SOFTSKILL_COST;
        window.softSkills += 1;
        saveGame();
        renderAll(window.tasks, window.totalPoints, window.softSkills, window.burnout);
      }
    };
  }

  addEvents(tasks.length);
  updateTopClicks();
}
function updateTotalPoints(points) {
  let totalPointsStr = Number(points).toLocaleString('pl-PL', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  let [intPart, fracPart] = totalPointsStr.split(',');
  const score = document.querySelector("#top-total-points");
  if(score)
    score.innerHTML = `<span>${intPart}</span><span class="fraction">,${fracPart}</span>`;
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
document.querySelectorAll(".kafelek-info").forEach((el) => {
  el.onclick = (e) => {
    e.stopPropagation();
    if (el.closest(".kafelek").classList.contains("locked")) return;
    const idx = Number(el.closest(".kafelek").dataset.taskidx);
    eventHandlers.onClickTask(idx);
  };
    el.onkeydown = (e) => {
      if ((e.key === "Enter" || e.key === " ") && !el.closest(".kafelek").classList.contains("locked")) {
        e.preventDefault();
        const idx = Number(el.closest(".kafelek").dataset.taskidx);
        eventHandlers.onClickTask(idx);
      }
    }
  });
    document.querySelectorAll('.ascend-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
      const idx = Number(btn.dataset.task);
      eventHandlers.onAscendTask(idx);
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
  if (a.reward.type === 'baseClick') {
    rewardText = `Nagroda: <b>+${a.reward.value}</b> do kliku we wszystkich zadaniach`;
  } else if (typeof a.reward.taskIdx === "number" && a.reward.taskIdx !== null) {
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
    // NIE wywołuj panelNav tu! Wywołasz po inicjalizacji w main.js
  },
  panelNav,
  renderAll,
  renderProgress,
  renderUpgradeAffordances,
  renderSingleTile,
  updateSingleTile,
  updateTotalPoints,
  renderAchievements,
  showAchievement
};
})();
