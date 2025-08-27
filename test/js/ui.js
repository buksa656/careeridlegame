(() => {
  'use strict';

  // ===== KONFIGURACJA =====
  const SOFTSKILL_COST = 10000;
  
  // ===== ZMIENNE MODUŁU =====
  let eventHandlers = {};
  const lastProgress = {};

  // ===== UTILITKI =====
  function $(selector) { 
    return document.querySelector(selector); 
  }

  function fmt(n) {
    if (typeof n !== 'number') return n;
    if (Math.abs(n) < 100) return n.toFixed(2);
    if (Math.abs(n) < 1000) return n.toFixed(1);
    return Math.round(n).toLocaleString('pl');
  }

  function safeValue(value, fallback, type = 'number') {
    return (typeof value === type) ? value : fallback;
  }

  // ===== OBLICZENIA GAMEPLAY =====
  function getBarCycleMs(task) {
    const speedGrowth = 0.94;
    const lvl = Math.min(task.level, 15);
    const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
    const multiplier = Math.max(0.001, safeValue(task.multiplier, 1));
    return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap / multiplier;
  }

  function calculateTaskMetrics(task) {
    const ascendLevel = safeValue(task.ascendLevel, 0);
    const ascendStage = window.ASCEND_STAGES?.[ascendLevel] || { name: "Junior", idleMult: 1.0 };
    const baseIdle = safeValue(task.baseIdle, 0.01);
    const multiplier = safeValue(task.multiplier, 1);
    const gainIdle = baseIdle * multiplier * ascendStage.idleMult;
    const barMs = getBarCycleMs(task);
    const perSec = isFinite(gainIdle * 1000 / barMs) ? (gainIdle * 1000 / barMs).toFixed(3) : "0.000";
    
    return { ascendLevel, ascendStage, gainIdle, perSec };
  }

  // ===== GENERATORY HTML =====
  function createLockedTile(task, idx, totalPoints) {
    const canUnlock = safeValue(task.unlockCost, 0, 'number') <= totalPoints;
    return `
      <div class="kafelek locked${canUnlock ? ' can-unlock' : ''}" data-taskidx="${idx}" tabindex="0">
        <div class="kafelek-info">
          <div class="kafelek-locked-overlay">
            <div class="overlay-content">
              <b>${task.name}</b><br>
              Koszt odblokowania: <b>${fmt(task.unlockCost)}</b> BP
            </div>
          </div>
        </div>
      </div>`;
  }

function createUnlockedTile(task, idx, totalPoints) {
  const { ascendLevel, ascendStage, perSec } = calculateTaskMetrics(task);
  const upgCost = (typeof task.getUpgradeCost === "function") 
    ? task.getUpgradeCost() 
    : Math.floor(7 * Math.pow(1.58, task.level));
  const canUpgrade = totalPoints >= upgCost;
  const nextStage = window.ASCEND_STAGES?.[ascendLevel + 1];
  const ascendCost = (nextStage && typeof task.getAscendCost === "function") 
    ? task.getAscendCost() 
    : null;
  const ascendButton = (nextStage && typeof ascendCost === 'number')
    ? `<button class="ascend-btn" data-task="${idx}">Awans<br>(${fmt(ascendCost)})</button>`
    : `<span style="flex:1; color:#c89;font-size:.97em;display:inline-block;text-align:center;">Max awans!</span>`;

  // Usunięto multiBuyPart - globalny multi-buy pojawia się tylko raz nad kafelkami!

  return `
    <div class="kafelek" data-taskidx="${idx}" tabindex="0">
      <div class="kafelek-info">
        <div class="title">${task.name}</div>
        <div class="kafelek-row asc-badge">
          <span class="tile-stage">${ascendStage.name}</span>
        </div>
        <div class="kafelek-row">
          Idle: <b class="tile-idle">${perSec}</b> pkt/s
        </div>
      </div>
      <div class="kafelek-bottom-row">
        <button class="kafelek-ulepsz-btn" data-do="upg" data-idx="${idx}" 
                ${(!task.unlocked || !canUpgrade) ? "disabled" : ""}>
          Opt.<br>(${fmt(upgCost)})
        </button>
        ${ascendButton}
      </div>
    </div>`;
}

  function createSoftSkillButton(totalPoints) {
    const isOverflowEnabled = (typeof window.softSkillOverflowEnabled !== 'undefined') && window.softSkillOverflowEnabled;
    const maxSkills = isOverflowEnabled ? Math.floor(totalPoints / SOFTSKILL_COST) : 1;
    const cost = isOverflowEnabled ? maxSkills * SOFTSKILL_COST : SOFTSKILL_COST;
    const skillText = isOverflowEnabled ? `${maxSkills} Soft Skills` : '1 Soft Skill';

    return `
      <button id="get-softskill-btn" class="get-softskill-btn">
        <span class="ss-badge">🎓</span>
        <span class="ss-label">
          <b>Awans!</b>
          <div class="ss-desc">
            Zbierz <b>${skillText}</b><br>
            <small>(koszt: ${fmt(cost)})</small>
          </div>
        </span>
      </button>`;
  }
  
  function createMultiBuyButton(selected = 1) {
    const values = [1, 5, 10, 20, 100, "max"];
    const idx = values.findIndex(v => v === selected);
    const next = values[(idx + 1) % values.length];
    // Pokazujemy obecny wybór, klik zmienia na next
    const label = typeof selected === "number" ? `${selected}x` : "max";
    return `
      <button type="button" class="single-multibuy-btn" data-next="${next}">
        ${label}
      </button>
    `;
  }
  
  function createProgressBar(progress, label) {
    return `
      <div class="unlock-progress">
        <div class="unlock-progress-bar" style="width:${(progress * 100).toFixed(1)}%"></div>
        <span>${Math.min(progress * 100, 100).toFixed(0)}% ${label}</span>
      </div>`;
  }

  // ===== RENDEROWANIE KAFELK脫W =====
  function taskTile(task, idx, totalPoints, locked = false) {
    return locked 
      ? createLockedTile(task, idx, totalPoints)
      : createUnlockedTile(task, idx, totalPoints);
  }

  function renderSingleTile(idx, task, totalPoints) {
    const kafelHtml = taskTile(task, idx, totalPoints, !task.unlocked);
    const outer = document.querySelectorAll('.kafelek-outer')[idx];
    if (outer) {
      outer.innerHTML = kafelHtml;
      addEvents();
    }
  }

  function updateSingleTile(idx, task, totalPoints) {
    const kafelek = $(`.kafelek[data-taskidx="${idx}"]`);
    if (!kafelek) return;

    const { ascendLevel, ascendStage, perSec } = calculateTaskMetrics(task);
    const nextStage = window.ASCEND_STAGES?.[ascendLevel + 1];
    const ascendCost = (nextStage && typeof task.getAscendCost === "function") 
      ? task.getAscendCost() 
      : null;

    // Aktualizuj elementy
    const stageEl = kafelek.querySelector('.tile-stage');
    if (stageEl) stageEl.textContent = ascendStage.name;
    
    const idleEl = kafelek.querySelector('.tile-idle');
    if (idleEl) idleEl.textContent = perSec;

    // Aktualizuj przyciski
    const upgCost = (typeof task.getUpgradeCost === "function") 
      ? task.getUpgradeCost() 
      : Math.floor(20 * Math.pow(2.25, task.level));
    
    const btnUpg = kafelek.querySelector('.kafelek-ulepsz-btn');
    if (btnUpg) {
      btnUpg.innerHTML = `Opt.<br>(${fmt(upgCost)})`;
      btnUpg.disabled = (!task.unlocked || totalPoints < upgCost);
    }

    const btnAsc = kafelek.querySelector('.ascend-btn');
    if (btnAsc) {
      if (nextStage && ascendCost) {
        btnAsc.innerHTML = `Awans<br>(${fmt(ascendCost)})`;
      } else if (!nextStage) {
        btnAsc.outerHTML = `<span style="flex:1; color:#c89;font-size:.97em;display:inline-block;text-align:center;">Max awans!</span>`;
      }
    }
  }

  // ===== RENDEROWANIE G艁脫WNEGO INTERFEJSU =====
  function updateTopBar(totalPoints, softSkills) {
    const totalPointsStr = Number(totalPoints).toLocaleString('pl-PL', { 
      minimumFractionDigits: 3, 
      maximumFractionDigits: 3 
    });
    const [intPart, fracPart] = totalPointsStr.split(',');
    
    const pointsEl = $("#top-total-points");
    if (pointsEl) {
      pointsEl.innerHTML = `<span>${intPart}</span><span class="fraction">,${fracPart}</span>`;
    }
    
    const softSkillsEl = $("#top-soft-skills");
    if (softSkillsEl) {
      softSkillsEl.textContent = fmt(softSkills);
    }
  }

  function renderVisibleTasks(tasks, totalPoints) {
    const visibleTasks = [];
    let lockedShown = false;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].unlocked) {
        visibleTasks.push(`<div class="kafelek-outer">${taskTile(tasks[i], i, totalPoints, false)}</div>`);
      } else if (!lockedShown) {
        visibleTasks.push(`<div class="kafelek-outer">${taskTile(tasks[i], i, totalPoints, true)}</div>`);
        lockedShown = true;
      }
    }
    return visibleTasks;
  }

function renderAll(tasks, totalPoints, softSkills, burnout = 0) {
  const SOFTSKILL_COST = 10000;
  updateTopBar(totalPoints, softSkills);
  renderMultipliersBar(tasks);
  const visibleTasks = renderVisibleTasks(tasks, totalPoints);
  const softSkillBtn = (totalPoints >= SOFTSKILL_COST) ? createSoftSkillButton(totalPoints) : '';
  const multiBuyHTML = window.multiBuyEnabled
    ? `<div id="multi-buy-row" style="display:flex;justify-content:center;margin:4px 0 12px 0;">
          ${createMultiBuyButton(window.multiBuyAmount || 1)}
       </div>`
    : '';
  const karrieraPanel = $("#panel-kariera");
  if (karrieraPanel) {
    karrieraPanel.innerHTML = `
      <div id="kpi-dashboard" style="display:flex; justify-content:center; margin-top:10px;"></div>
      <div id="grid-progress"></div>
      ${multiBuyHTML}
      ${softSkillBtn}
      <div class="career-list">${visibleTasks.join('')}</div>`;
  }
  renderUnlockProgress(tasks, totalPoints); // aktualny progres do kolejnego taska
  setupSoftSkillButton(); // ZAWSZE po innerHTML!
  addEvents();
  // Zawsze natychmiast obsłuż dashboard + osiągnięcia!
  if (typeof window.refreshHexKpiDashboard === "function") {
    window.refreshHexKpiDashboard();
  }
  if (typeof window.IdleUI.renderAchievements === "function") {
    window.IdleUI.renderAchievements(window.ACHIEVEMENTS);
  }
}

  function renderUnlockProgress(tasks, totalPoints) {
    const nextTask = tasks.find(t => !t.unlocked);
    const progressDiv = $("#grid-progress");
    
    if (nextTask && nextTask.unlockCost && progressDiv) {
      const progress = Math.min(Number(totalPoints) / Number(nextTask.unlockCost), 1);
      progressDiv.innerHTML = createProgressBar(progress, "do odblokowania nowego zadania");
    } else if (progressDiv) {
      progressDiv.innerHTML = "";
    }
  }

  // ===== SOFT SKILL BUTTON =====
function setupSoftSkillButton() {
  const btn = document.getElementById('get-softskill-btn');
  if (!btn) return;
  btn.onclick = () => {
    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; }, 250);
    // Najpierw zrób snapshot ile można zdobyć softskills
    let max = 0;
    if (window.softSkillOverflowEnabled) {
      max = Math.floor(window.totalPoints / 10000);
    } else if (window.totalPoints >= 10000) {
      max = 1;
    }
    if (max > 0) {
      let prevSoftSkills = window.softSkills;
      for (let i=0; i < max; ++i) {
        window.prestige(true);
        // Zabezpieczenie pętli: jeśli liczba softskills nie rośnie, przerywamy
        if (window.softSkills == prevSoftSkills) break;
        prevSoftSkills = window.softSkills;
      }
    }
  };
}

  // ===== POZOSTALE FUNKCJE RENDEROWANIA =====
  function updateTotalPoints(points) {
    const totalPointsStr = Number(points).toLocaleString('pl-PL', { 
      minimumFractionDigits: 3, 
      maximumFractionDigits: 3 
    });
    const [intPart, fracPart] = totalPointsStr.split(',');
    const score = $("#top-total-points");
    if (score) {
      score.innerHTML = `<span>${intPart}</span><span class="fraction">,${fracPart}</span>`;
    }
  }

  function renderMultipliersBar(tasks) {
    const bar = $('#multipliersBar');
    if (!bar) return;
    
    const multipliers = tasks
      .filter(t => t.unlocked)
      .map(t => `<strong>${t.name}</strong>: x${safeValue(t.multiplier, 1).toFixed(3)}`)
      .join(' | ');
    
    bar.innerHTML = multipliers ? `Akt. mnożnik idle: ${multipliers}` : '';
  }

  function renderProgress(idx, progress) {
    const bar = $(`.kafelek[data-taskidx="${idx}"] .kafelek-progbar-inner`);
    if (!bar) return;
    const prev = lastProgress[idx] !== undefined ? lastProgress[idx] : 0;
    const delta = Math.abs(progress - prev);
    const ANIMATION_CUTOFF = 0.25; // próg wyłączenia animacji przy szybkim wzroście (dostosuj wg potrzeby)
  
    // Jeśli duży skok – wyłącz transition CSS na szerokość (czyli NATYCHMIAST bez animacji)
    if (delta > ANIMATION_CUTOFF) {
      bar.style.transition = 'none';
      bar.style.width = `${Math.round(progress * 100)}%`;
      // Po krótkiej chwili przywróć transition do domyślnego (żeby potem animować normalne rośnięcie)
      setTimeout(() => { bar.style.transition = ''; }, 80);
    } else {
      bar.style.transition = '';
      bar.style.width = `${Math.round(progress * 100)}%`;
    }
    lastProgress[idx] = progress;
  }

  function renderUpgradeAffordances(tasks, totalPoints) {
    document.querySelectorAll('.kafelek-ulepsz-btn').forEach((btn, idx) => {
      if (!tasks[idx]) return;
      const upgCost = Math.floor(20 * Math.pow(2.25, tasks[idx].level));
      btn.disabled = (!tasks[idx].unlocked || totalPoints < upgCost);
    });
  }

  // ===== SYSTEM EVENT脫W =====
function addEvents() {
  // Eventy kafelków
  document.querySelectorAll(".kafelek-info").forEach(el => {
    const kafelek = el.closest(".kafelek");
    if (!kafelek) return;
    const idx = Number(kafelek.dataset.taskidx);
    const isLocked = kafelek.classList.contains('locked');
    const handleClick = () => {
      if (isLocked) {
        eventHandlers.onUnlockTask?.(idx);
      } else {
        eventHandlers.onClickTask?.(idx);
      }
    };
    el.onclick = (e) => {
      e.stopPropagation();
      handleClick();
    };
    el.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };
  });

  // Eventy przycisków awansu
  document.querySelectorAll('.ascend-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.task);
      eventHandlers.onAscendTask?.(idx);
    };
  });

  // Eventy przycisków optymalizacji
  document.querySelectorAll('[data-do="upg"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const idx = Number(btn.dataset.idx);
      eventHandlers.onUpgradeTask?.(idx);
    };
  });

  // Eventy globalnych przycisków
  const prestigeBtn = $("#prestige-btn");
  if (prestigeBtn) {
    prestigeBtn.onclick = () => eventHandlers.onPrestige?.();
  }
  const resetBtn = $("#reset-btn");
  if (resetBtn) {
    resetBtn.onclick = () => eventHandlers.onClearSave?.();
  }

  // Event single multi-buy switch
const multiBuyGlobalBtn = document.querySelector('#multi-buy-row .single-multibuy-btn');
if (multiBuyGlobalBtn) {
  multiBuyGlobalBtn.onclick = () => {
    const nextVal = multiBuyGlobalBtn.dataset.next;
    window.multiBuyAmount = (nextVal === "max") ? "max" : Number(nextVal);
    window.IdleUI.renderAll(window.tasks, window.totalPoints, window.softSkills, window.burnout);
  };
}
}

  // ===== NAWIGACJA PANELI =====
  function panelNav() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        // Ukryj wszystkie panele i usu艅 aktywn膮 klas臋
        document.querySelectorAll(".panel").forEach(panel => panel.style.display = "none");
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

        // Poka偶 wybrany panel
        const target = btn.dataset.panel;
        btn.classList.add("active");
        const targetPanel = $(`#panel-${target}`);
        if (targetPanel) targetPanel.style.display = "";

        // Uruchom odpowiedni renderer
        switch (target) {
          case "kariera":
            if (window.tasks) {
              renderAll(window.tasks, window.totalPoints, window.softSkills, window.burnout);
              if (typeof window.refreshHexKpiDashboard === "function") {
                window.refreshHexKpiDashboard();
              }
            }
            break;
          case "osiagniecia":
            if (window.ACHIEVEMENTS) {
              renderAchievements(window.ACHIEVEMENTS);
            }
            break;
          case "biurko":
            if (typeof window.renderDeskSVG === "function") {
              window.renderDeskSVG();
            }
            break;
          case "statystyki":
            if (typeof renderStats === "function") {
              renderStats();
            }
            break;
        }
      });
    });

    // Ustaw domy艣lny panel (Kariera)
    const defaultBtn = $('.tab-btn[data-panel="kariera"]');
    if (defaultBtn) {
      defaultBtn.classList.add("active");
      const karrieraPanel = $("#panel-kariera");
      if (karrieraPanel) karrieraPanel.style.display = "";
    }

    // Ukryj pozosta艂e panele
    document.querySelectorAll(".panel").forEach(panel => {
      if (panel.id !== "panel-kariera") {
        panel.style.display = "none";
      }
    });
  }

  // ===== SYSTEM OSI膭GNI臉膯 =====
  function renderAchievements(achievements) {
    const container = $('#achievements-container');
    if (!container) return;

    container.innerHTML = achievements.map(a => {
      let rewardText = '';
      if (a.reward?.taskIdx !== undefined && a.reward?.multiplierInc) {
        rewardText = `Nagroda: +${Math.round(a.reward.multiplierInc * 100)}% mnożnika do zadania`;
      } else if (a.reward?.multiplierInc) {
        rewardText = `Nagroda: +${Math.round(a.reward.multiplierInc * 100)}% mnożnika globalnego`;
      }

      return `
        <div class="ach-item${a.unlocked ? ' completed' : ''}">
          <div class="emoji">${a.unlocked ? '🏆' : '🔒'}</div>
          <div>
            <div class="ach-name">${a.name}</div>
            <div class="ach-desc">${a.desc}</div>
            <div class="ach-reward">${rewardText}</div>
            ${a.unlocked ? '<div class="ach-date">Zdobyte</div>' : ''}
          </div>
        </div>`;
    }).join('');
  }

  function showAchievement(achievement) {
    let toast = $('#achievement-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'achievement-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span class="emoji">🏆</span>
      <div>
        <div style="font-weight:bold;font-size:1.1em;letter-spacing:0.2px">${achievement.name}</div>
        <div class="desc">${achievement.desc}</div>
      </div>`;

    toast.classList.add("visible");
    toast.style.display = "flex";
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => { toast.style.display = "none"; }, 370);
    }, 3200);
  }

  // ===== FUNKCJA POMOCNICZA DLA PROGRESS BAR =====
  function renderGridProgress(tasks, totalPoints) {
    renderUnlockProgress(tasks, totalPoints);
    
    // Dostosuj szeroko艣膰 przycisku soft skill do progress bara
    const progressDiv = $("#grid-progress");
    const softSkillBtn = $("#get-softskill-btn");
    
    if (progressDiv && softSkillBtn) {
      const progressBar = progressDiv.querySelector('.unlock-progress');
      if (progressBar) {
        softSkillBtn.style.width = `${progressBar.offsetWidth}px`;
        softSkillBtn.style.maxWidth = `${progressBar.offsetWidth}px`;
        softSkillBtn.style.display = 'block';
        softSkillBtn.style.margin = '12px auto';
      }
    }
  }

  // ===== EKSPORT MODU艁U =====
  window.IdleUI = {
    init: function(handlers) {
      eventHandlers = handlers || {};
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

  // Eksportuj r贸wnie偶 renderGridProgress dla kompatybilno艣ci
  window.renderGridProgress = renderGridProgress;
})();
