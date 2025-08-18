(() => {
  'use strict';
  // ----------- ŻARTOBLIWE TASKI! ----------
  const TASKS = [
    {
      name: "Robienie kawy Szefowi",
      unlocked: true,
      level: 0,
      baseGain: 1,
      gainGrowth: 1.14,
      points: 0,
      cycleTime: 1600,
      progress: 0,
      active: false
    },
    {
      name: "Ctrl+C, Ctrl+V - Copypasta ofisowa",
      unlocked: false,
      level: 0,
      baseGain: 9,
      gainGrowth: 1.13,
      unlockCost: 33,
      points: 0,
      cycleTime: 2500,
      progress: 0,
      active: false
    },
    {
      name: "Odpisanie na maila z RE: FW: FW:  ",
      unlocked: false,
      level: 0,
      baseGain: 20,
      gainGrowth: 1.17,
      unlockCost: 170,
      points: 0,
      cycleTime: 4000,
      progress: 0,
      active: false
    },
    {
      name: "Wklejka do Excela (magia tabel)",
      unlocked: false,
      level: 0,
      baseGain: 44,
      gainGrowth: 1.156,
      unlockCost: 540,
      points: 0,
      cycleTime: 5700,
      progress: 0,
      active: false
    },
    {
      name: "Prezentacja – z google slides pod stołem",
      unlocked: false,
      level: 0,
      baseGain: 113,
      gainGrowth: 1.13,
      unlockCost: 2100,
      points: 0,
      cycleTime: 8000,
      progress: 0,
      active: false
    },
    {
      name: "Zebranie – symulacja słuchania",
      unlocked: false,
      level: 0,
      baseGain: 330,
      gainGrowth: 1.09,
      unlockCost: 4800,
      points: 0,
      cycleTime: 12000,
      progress: 0,
      active: false
    },
    {
      name: "Standup 'co zrobisz dziś?'",
      unlocked: false,
      level: 0,
      baseGain: 600,
      gainGrowth: 1.12,
      unlockCost: 13100,
      points: 0,
      cycleTime: 17000,
      progress: 0,
      active: false
    },
    {
      name: "Delegowanie spraw lemingowi",
      unlocked: false,
      level: 0,
      baseGain: 1600,
      gainGrowth: 1.15,
      unlockCost: 29000,
      points: 0,
      cycleTime: 23000,
      progress: 0,
      active: false
    },
    {
      name: "Lunch break: 7/8 dnia 🥪",
      unlocked: false,
      level: 0,
      baseGain: 3600,
      gainGrowth: 1.17,
      unlockCost: 100000,
      points: 0,
      cycleTime: 31000,
      progress: 0,
      active: false
    },
    {
      name: "Król Open Space – 'Co tu się dzieje?!'",
      unlocked: false,
      level: 0,
      baseGain: 9000,
      gainGrowth: 1.19,
      unlockCost: 790000,
      points: 0,
      cycleTime: 47000,
      progress: 0,
      active: false
    }
  ];

  let tasks = [];
  let totalPoints = 0;
  let softSkills = 0;
  let burnout = 0; // mini-system: liczba prestige
  let timers = [];

  // ----------- ZAPIS/ODCZYT -----------
  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks,
      totalPoints,
      softSkills,
      burnout
    }));
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
      } catch (e) {}
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
    }
  }

  function clearSave() {
    timers.forEach(t => clearInterval(t));
    localStorage.removeItem("korposzczur_save");
    location.reload();
  }

  // ----------- START IDLE TASKA -----------
  function startIdle(idx) {
    if (tasks[idx].active) return; // już działa
    tasks[idx].active = true;
    tasks[idx].progress = 0;
    let prev = Date.now();

    timers[idx] = setInterval(() => {
      const task = tasks[idx];
      // Szybkość cyklu zależy od poziomu i softSkills
      const lvlCycle = task.cycleTime * Math.pow(0.91, task.level) * Math.pow(0.90, softSkills);
      const now = Date.now();
      task.progress += (now - prev) / lvlCycle;
      prev = now;

      if (task.progress >= 1) {
        task.progress = 0;
        const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
        task.points += gain;
        totalPoints += gain;
        // Odblokuj nowy task jeśli warunek spełniony
        if (idx + 1 < tasks.length && !tasks[idx + 1].unlocked && task.points >= tasks[idx + 1].unlockCost) {
          tasks[idx + 1].unlocked = true;
        }
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout);
      }
      ui.renderProgress(idx, task.progress);
    }, 1000 / 30); // ~30fps
  }

  // ----------- CLICK = natychmiastowe punkty i idle start -----------
  function clickTask(idx) {
    const task = tasks[idx];
    // Klik natychmiastowy
    if (task.unlocked) {
      const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
      task.points += gain;
      totalPoints += gain;
      // Odblokuj nowy task, jeśli warunek spełniony
      if (idx + 1 < tasks.length && !tasks[idx + 1].unlocked && task.points >= tasks[idx + 1].unlockCost) {
        tasks[idx + 1].unlocked = true;
      }
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
    }
    // Idle startuje tylko raz na taska
    if (!task.active) startIdle(idx);
  }

  // ----------- ULEPSZENIA -----------
  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = 10 * Math.pow(2, task.level);
    if (task.points >= cost) {
      task.points -= cost;
      task.level += 1;
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
    }
  }

  // ----------- PRESTIGE / RZUĆ ROBOTĘ -----------
  function prestige() {
    timers.forEach(t => clearInterval(t));
    if (totalPoints < 10000) return;
    softSkills += 1;
    burnout += 1;
    totalPoints = 0;
    tasks = JSON.parse(JSON.stringify(TASKS));
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
  }

  // ----------- INICJALIZACJA -----------
  const ui = window.IdleUI;

  function init() {
    loadGame();
    timers = Array(tasks.length).fill(null);
    ui.init({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave
    });
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
  }

  window.addEventListener("load", init);
})();
