(() => {
  'use strict';
  const TASKS = [
    { name: "Robienie kawy Szefowi", unlocked: true, level: 0, baseGain: 1, baseIdle: 0.02, cycleTime: 1600, multiplier: 1, progress: 0, active: false, unlockCost: 0 },
    { name: "Ctrl+C, Ctrl+V",        unlocked: false, level: 0, baseGain: 1, baseIdle: 0.04, cycleTime: 2500, multiplier: 1, progress: 0, active: false, unlockCost: 48 },
    { name: "Odpisanie na maila",    unlocked: false, level: 0, baseGain: 1, baseIdle: 0.09, cycleTime: 4000, multiplier: 1, progress: 0, active: false, unlockCost: 180 },
    { name: "Wklejka do Excela",     unlocked: false, level: 0, baseGain: 1, baseIdle: 0.18, cycleTime: 5700, multiplier: 1, progress: 0, active: false, unlockCost: 570 },
    { name: "Prezentacja na Teamsy", unlocked: false, level: 0, baseGain: 1, baseIdle: 0.28, cycleTime: 8000, multiplier: 1, progress: 0, active: false, unlockCost: 1450 },
    { name: "Zebranie – słuchanie",  unlocked: false, level: 0, baseGain: 1, baseIdle: 0.38, cycleTime: 12000, multiplier: 1, progress: 0, active: false, unlockCost: 3550 },
    { name: "Standup",               unlocked: false, level: 0, baseGain: 1, baseIdle: 0.67, cycleTime: 17000, multiplier: 1, progress: 0, active: false, unlockCost: 8600 },
    { name: "Delegowanie lemingowi", unlocked: false, level: 0, baseGain: 1, baseIdle: 1.12, cycleTime: 23000, multiplier: 1, progress: 0, active: false, unlockCost: 22000 },
    { name: "Lunch break 🥪",        unlocked: false, level: 0, baseGain: 1, baseIdle: 1.8, cycleTime: 31000, multiplier: 1, progress: 0, active: false, unlockCost: 64000 },
    { name: "Król Open Space",       unlocked: false, level: 0, baseGain: 1, baseIdle: 3.1, cycleTime: 47000, multiplier: 1, progress: 0, active: false, unlockCost: 230000 }
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
        // MIGRACJA SAFE - DOPEŁNIENIE POL TASKÓW
        tasks.forEach((t,i)=>{
          if(typeof t.multiplier !== 'number') t.multiplier = 1;
          if(typeof t.baseIdle !== 'number') t.baseIdle = TASKS[i] && typeof TASKS[i].baseIdle === 'number' ? TASKS[i].baseIdle : 0.01;
        });
      } catch (e) {
        tasks = JSON.parse(JSON.stringify(TASKS));
      }
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
  function getBarCycleMs(task) {
    const speedGrowth = 0.94;
    const lvl = Math.min(task.level, 15);
    const softcap = task.level > 15 ? Math.pow(0.98, task.level - 15) : 1;
    return task.cycleTime * Math.pow(speedGrowth, lvl) * softcap;
  }
  function startIdle(idx) {
    if (tasks[idx].active) return;
    tasks[idx].active = true;
    tasks[idx].progress = 0;
    let prev = Date.now();
    timers[idx] = setInterval(() => {
      const task = tasks[idx];
      const barMs = getBarCycleMs(task);
      const now = Date.now();
      task.progress += (now - prev) / barMs;
      prev = now;
      if (task.progress >= 1) {
        task.progress = 0;
        const idlePts = (typeof task.baseIdle === 'number' ? task.baseIdle : 0.01) * (typeof task.multiplier === 'number' ? task.multiplier : 1);
        totalPoints += idlePts;
        task.multiplier = ((typeof task.multiplier === 'number') ? task.multiplier : 1) + 0.001;
        tryUnlockTask(idx + 1);
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout);
        ui.renderProgress(idx, task.progress, task.multiplier);
        renderMultipliersBar();
      }
      ui.renderProgress(idx, task.progress, task.multiplier);
    }, 1000 / 30);
  }
  function clickTask(idx) {
    const task = tasks[idx];
    if (task.unlocked) {
      totalPoints += 1;
      tryUnlockTask(idx + 1);
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout);
      renderMultipliersBar();
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
      renderMultipliersBar();
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
    renderMultipliersBar();
  }
  function renderMultipliersBar() {
    const bar = document.getElementById('multipliersBar');
    bar.innerHTML = 'Akt. mnożnik idle: ' + tasks.map((t,i) =>
      t.unlocked
        ? `<strong>${t.name}</strong>: x${(typeof t.multiplier === 'number'?t.multiplier:1).toFixed(3)}`
        : `<span style="color:#bbb">${t.name}: x1.000</span>`
    ).join(' &nbsp;&nbsp; | &nbsp;&nbsp; ');
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
    renderMultipliersBar();
  }
  window.addEventListener("load", init);
})();
