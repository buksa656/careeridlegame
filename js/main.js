(() => {
  'use strict';
  // ---------- KONFIG ----------
  const TASKS = [
    { name: "Robienie kawy Szefowi", unlocked: true, level: 0, baseGain: 1, gainGrowth: 1.14, cycleTime: 1600, progress: 0, active: false, unlockCost: 0 },
    { name: "Ctrl+C, Ctrl+V", unlocked: false, level: 0, baseGain: 9, gainGrowth: 1.13, cycleTime: 2500, progress: 0, active: false, unlockCost: 48 },
    { name: "Odpisanie na maila z RE: FW:", unlocked: false, level: 0, baseGain: 20, gainGrowth: 1.17, cycleTime: 4000, progress: 0, active: false, unlockCost: 180 },
    { name: "Wklejka do Excela", unlocked: false, level: 0, baseGain: 44, gainGrowth: 1.156, cycleTime: 5700, progress: 0, active: false, unlockCost: 570 },
    { name: "Prezentacja na Teamsy", unlocked: false, level: 0, baseGain: 113, gainGrowth: 1.13, cycleTime: 8000, progress: 0, active: false, unlockCost: 1450 },
    { name: "Zebranie – udawanie słuchania", unlocked: false, level: 0, baseGain: 330, gainGrowth: 1.09, cycleTime: 12000, progress: 0, active: false, unlockCost: 3550 },
    { name: "Standup: co zrobisz dziś?", unlocked: false, level: 0, baseGain: 600, gainGrowth: 1.12, cycleTime: 17000, progress: 0, active: false, unlockCost: 8600 },
    { name: "Delegowanie spraw lemingowi", unlocked: false, level: 0, baseGain: 1600, gainGrowth: 1.15, cycleTime: 23000, progress: 0, active: false, unlockCost: 22000 },
    { name: "Lunch break 🥪", unlocked: false, level: 0, baseGain: 3600, gainGrowth: 1.17, cycleTime: 31000, progress: 0, active: false, unlockCost: 64000 },
    { name: "Król Open Space", unlocked: false, level: 0, baseGain: 9000, gainGrowth: 1.19, cycleTime: 47000, progress: 0, active: false, unlockCost: 230000 }
  ];

  let tasks = [], totalPoints = 0, softSkills = 0, burnout = 0, timers = [];

  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks, totalPoints, softSkills, burnout
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
  function tryUnlockTask(idx) {
    if (idx < tasks.length && !tasks[idx].unlocked && totalPoints >= tasks[idx].unlockCost)
      tasks[idx].unlocked = true;
  }
  function startIdle(idx) {
    if (tasks[idx].active) return;
    tasks[idx].active = true;
    tasks[idx].progress = 0;
    let prev = Date.now();
    timers[idx] = setInterval(() => {
      const task = tasks[idx];
      const lvlCycle = task.cycleTime * Math.pow(0.89, task.level) * Math.pow(0.90, softSkills);
      const now = Date.now();
      task.progress += (now - prev) / lvlCycle;
      prev = now;
      if (task.progress >= 1) {
        task.progress = 0;
        const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
        totalPoints += gain;
        tryUnlockTask(idx + 1);
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout);
      }
      ui.renderProgress(idx, task.progress);
    }, 1000 / 30);
  }
  function clickTask(idx) {
    const task = tasks[idx];
    if (task.unlocked) {
      const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
      totalPoints += gain;
      tryUnlockTask(idx + 1);
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
    }
    if (!task.active) startIdle(idx);
  }
  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = Math.floor(20 * Math.pow(2.25, task.level));
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
      ui.renderUpgradeAffordances(tasks, totalPoints);
    }
  }
  function prestige() {
    timers.forEach(t => clearInterval(t));
    if (totalPoints < 10000) return;
    softSkills += 1;
    burnout += 1;
    totalPoints = 0;
    tasks = JSON.parse(JSON.stringify(TASKS));
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout);
    ui.renderUpgradeAffordances(tasks, totalPoints);
  }
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
    ui.renderUpgradeAffordances(tasks, totalPoints);
  }
  window.addEventListener("load", init);
})();
