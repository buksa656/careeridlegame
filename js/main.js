(() => {
  'use strict';
  // ----------- KONFIGURACJA GRY -----------
  const TASKS = [
    {
      name: "Kliknięcie myszą",
      unlocked: true,
      level: 0,
      baseGain: 1,
      gainGrowth: 1.12,
      points: 0,
      auto: true,
      cycleTime: 2000, // 2 sekundy cyklu
      progress: 0,     // 0..1 do animacji
      active: false
    },
    {
      name: "Wstawienie Excela",
      unlocked: false,
      level: 0,
      baseGain: 10,
      gainGrowth: 1.14,
      unlockCost: 100,
      points: 0,
      auto: true,
      cycleTime: 4000,
      progress: 0,
      active: false
    },
    {
      name: "Zrobienie prezentacji",
      unlocked: false,
      level: 0,
      baseGain: 50,
      gainGrowth: 1.17,
      unlockCost: 500,
      points: 0,
      auto: true,
      cycleTime: 6000,
      progress: 0,
      active: false
    }
  ];

  let tasks = [];
  let totalPoints = 0;
  let softSkills = 0;
  let timers = [];

  // ----------- ZAPIS/ODCZYT -----------
  function saveGame() {
    localStorage.setItem("idle_game", JSON.stringify({
      tasks,
      totalPoints,
      softSkills
    }));
  }

  function loadGame() {
    const save = localStorage.getItem("idle_game");
    if (save) {
      try {
        const s = JSON.parse(save);
        if (Array.isArray(s.tasks)) tasks = s.tasks;
        if (typeof s.totalPoints === "number") totalPoints = s.totalPoints;
        if (typeof s.softSkills === "number") softSkills = s.softSkills;
      } catch (e) {}
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
    }
  }

  function clearSave() {
    timers.forEach(t => clearInterval(t));
    localStorage.removeItem("idle_game");
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
      const lvlCycle = task.cycleTime * Math.pow(0.93, task.level); // 7% szybciej na lvl
      
      // Aktualizuj progres paska
      const now = Date.now();
      task.progress += (now - prev) / lvlCycle;
      prev = now;

      if (task.progress >= 1) {
        task.progress = 0;
        const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
        task.points += gain;
        totalPoints += gain;
        // auto-unlock nowego taska, jeśli możliwe
        if (idx + 1 < tasks.length && !tasks[idx + 1].unlocked && task.points >= tasks[idx + 1].unlockCost) {
          tasks[idx + 1].unlocked = true;
        }
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills);
      }
      ui.renderProgress(idx, task.progress);
    }, 1000/30); // ~30 fps na pasek
  }

  // ----------- GŁÓWNA EKONOMIA CLICK -----------
  function clickTask(idx) {
    startIdle(idx); // pierwszy klik uruchamia tryb idle
  }

  // ----------- ULEPSZENIA -----------
  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = 10 * Math.pow(2, task.level);
    if (task.points >= cost) {
      task.points -= cost;
      task.level += 1;
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills);
    }
  }

  // ----------- PRESTIGE -----------
  function prestige() {
    timers.forEach(t => clearInterval(t));
    if (totalPoints < 1000) return;
    softSkills += 1;
    totalPoints = 0;
    tasks = JSON.parse(JSON.stringify(TASKS));
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills);
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
    ui.renderAll(tasks, totalPoints, softSkills);
  }

  window.addEventListener("load", init);
})();
