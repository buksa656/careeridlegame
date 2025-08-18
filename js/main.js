(() => {
  'use strict';

  // --- Kariera: bazowa struktura zadań ---
  const CAREER_TRACKS = [
    {
      name: "Stażysta",
      tasks: [
        { name: "Kopiowanie dokumentów", unlockCost: 0, unlocked: true, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.15, progress: 0, lastTick: 0 },
        { name: "Parzenie kawy", unlockCost: 50, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.18, progress: 0, lastTick: 0 },
        { name: "Skanowanie faktur", unlockCost: 120, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.22, progress: 0, lastTick: 0 },
        { name: "Przygotowanie prezentacji", unlockCost: 270, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.25, progress: 0, lastTick: 0 },
        { name: "Zamknięcie refaktury", unlockCost: 500, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.28, progress: 0, lastTick: 0 }
      ]
    }
    // Dodaj kolejne poziomy kariery i zadania tu...
  ];

  let careerLevel = 0;
  let currentTasks = CAREER_TRACKS[careerLevel].tasks.map(t => Object.assign({}, t)); // Uwaga: płytka kopia, ale nowy obiekt!
  let softSkills = 0;

  function clickToIdleBonus(numClicks) {
    if (numClicks <= 30) return 0.1;
    else if (numClicks <= 60) return 0.05;
    else if (numClicks <= 150) return 0.02;
    else return 0.005;
  }

  // --- UI API
  const ui = window.QRI_UI;

  function saveGame() {
    localStorage.setItem("korpo_sim_v6", JSON.stringify({
      careerLevel,
      currentTasks,
      softSkills
    }));
  }

  function loadGame() {
    const raw = localStorage.getItem("korpo_sim_v6");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (typeof s.careerLevel === "number") careerLevel = s.careerLevel;
      if (Array.isArray(s.currentTasks)) {
        // Podstawiam NOVE obiekty (płytka kopia na nowo)
        currentTasks = s.currentTasks.map(t => Object.assign({}, t));
      }
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
    } catch (e) {}
  }

  function clearSave() {
    localStorage.removeItem("korpo_sim_v6");
    location.reload();
  }

  function clickTask(idx) {
    const task = currentTasks[idx];
    if (!task.unlocked) return;

    // Wartości domyślne
    if (typeof task.baseIdle !== "number") task.baseIdle = 0.2;
    if (typeof task.progress !== "number") task.progress = 0;
    if (!task.lastTick) task.lastTick = Date.now();
    if (!task.clickGain) task.clickGain = 1;
    if (!task.numClicks) task.numClicks = 0;

    task.points += task.clickGain;
    task.numClicks += 1;

    if (!task.started) {
      task.baseIdle = 0.2;
      task.idleRate = task.baseIdle + clickToIdleBonus(task.numClicks);
      task.started = true;
      task.lastTick = Date.now();
    } else {
      task.idleRate = (task.baseIdle || 0) + clickToIdleBonus(task.numClicks) + (task.lvl * 0.5);
    }
    task.progress = 1;

    if (
      idx + 1 < currentTasks.length &&
      !currentTasks[idx + 1].unlocked &&
      task.points >= currentTasks[idx + 1].unlockCost
    ) {
      currentTasks[idx + 1].unlocked = true;
    }

    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  function upgradeTask(idx) {
    const task = currentTasks[idx];
    const upgCost = 10 * Math.pow(2.1, task.lvl);
    if (task.points >= upgCost) {
      task.points -= upgCost;
      task.lvl += 1;
      task.idleRate = (task.baseIdle || 0) + clickToIdleBonus(task.numClicks) + (task.lvl * 0.5);
      task.clickGain += 0.5;
    }
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  function prestigeReady() {
    return currentTasks.every(t => t.unlocked);
  }

  function prestige() {
    if (!prestigeReady()) return;
    softSkills += 1;
    careerLevel = Math.min(careerLevel + 1, CAREER_TRACKS.length - 1);
    // Inicjalizuj taski na nowo – NOWE OBIEKTY
    currentTasks = CAREER_TRACKS[careerLevel].tasks.map(t => Object.assign({}, t));
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
  }

  function idleLoop() {
    const now = Date.now();
    currentTasks.forEach((task, idx) => {
      if(task.unlocked && (task.idleRate || 0) > 0) {
        if (!task.lastTick) task.lastTick = now;
        const dt = (now - task.lastTick) / 1000;
        task.lastTick = now;
        const cycleTime = 1 / (task.idleRate || 1e-9);
        task.progress = (task.progress || 0) + dt / cycleTime;
        while(task.progress >= 1) {
          task.points += 1;
          task.progress -= 1;
          if (
            idx + 1 < currentTasks.length &&
            !currentTasks[idx + 1].unlocked &&
            task.points >= currentTasks[idx + 1].unlockCost
          ) {
            currentTasks[idx + 1].unlocked = true;
          }
        }
      } else {
        task.progress = 0;
        task.lastTick = now;
      }
    });
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    requestAnimationFrame(idleLoop);
  }

  function init() {
    loadGame();
    ui.mount({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave,
      getTasks: () => currentTasks,
      currentPosition: CAREER_TRACKS[careerLevel].name
    });
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
    setInterval(saveGame, 10_000);
    idleLoop();
  }

  window.addEventListener('load', init);
})();
