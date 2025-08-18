(() => {
  'use strict';

  const CAREER_TRACKS = [
    {
      name: "Stażysta",
      tasks: [
        { name: "Kopiowanie dokumentów", unlockCost: 0, unlocked: true, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false },
        { name: "Parzenie kawy", unlockCost: 50, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false },
        { name: "Skanowanie faktur", unlockCost: 120, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false },
        { name: "Przygotowanie prezentacji", unlockCost: 270, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false },
        { name: "Zamknięcie refaktury", unlockCost: 500, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false }
      ]
    }
    // Dodaj kolejne poziomy kariery...
  ];

  let careerLevel = 0;
  let currentTasks = CAREER_TRACKS[careerLevel].tasks.map(t => Object.assign({}, t));
  let softSkills = 0;

  function clickToIdleBonus(numClicks) {
    if (numClicks <= 30) return 0.1;
    else if (numClicks <= 60) return 0.05;
    else if (numClicks <= 150) return 0.02;
    else return 0.005;
  }

  const ui = window.QRI_UI;

  function saveGame() {
    localStorage.setItem("korpo_sim_simple", JSON.stringify({
      careerLevel,
      currentTasks,
      softSkills
    }));
  }
  function loadGame() {
    const raw = localStorage.getItem("korpo_sim_simple");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (typeof s.careerLevel === "number") careerLevel = s.careerLevel;
      if (Array.isArray(s.currentTasks)) currentTasks = s.currentTasks.map(t => Object.assign({}, t));
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
    } catch (e) {}
  }
  function clearSave() {
    localStorage.removeItem("korpo_sim_simple");
    location.reload();
  }

  function clickTask(idx) {
    const task = currentTasks[idx];
    if (!task.unlocked) return;
    if (!task.clickGain) task.clickGain = 1;
    if (!task.idleRate) task.idleRate = 0;
    if (!task.numClicks) task.numClicks = 0;
    // dodaj PKT za klik
    task.points += task.clickGain;
    // każdy klik podbija idle/sec (softcap: jak poprzednio)
    task.numClicks += 1;
    task.idleRate += clickToIdleBonus(task.numClicks);
    // auto-unlock:
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
      task.idleRate += 0.5;
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
    currentTasks = CAREER_TRACKS[careerLevel].tasks.map(t => Object.assign({}, t));
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
  }

  function idleTick() {
    currentTasks.forEach((task, idx) => {
      if (task.unlocked && task.idleRate > 0) {
        task.points += task.idleRate / 2; // co 0.5s
        // auto-unlock:
        if (
          idx + 1 < currentTasks.length &&
          !currentTasks[idx + 1].unlocked &&
          task.points >= currentTasks[idx + 1].unlockCost
        ) {
          currentTasks[idx + 1].unlocked = true;
        }
      }
    });
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
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
    setInterval(saveGame, 10000);
    setInterval(idleTick, 500);
  }
  window.addEventListener('load', init);
})();
