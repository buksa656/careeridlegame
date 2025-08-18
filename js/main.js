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
      points: 0
    },
    {
      name: "Wstawienie Excela",
      unlocked: false,
      level: 0,
      baseGain: 10,
      gainGrowth: 1.14,
      unlockCost: 100,
      points: 0
    },
    {
      name: "Zrobienie prezentacji",
      unlocked: false,
      level: 0,
      baseGain: 50,
      gainGrowth: 1.17,
      unlockCost: 500,
      points: 0
    }
    // Dodaj kolejne taski analogicznie!
  ];

  let tasks = [];
  let totalPoints = 0;
  let softSkills = 0;

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
    localStorage.removeItem("idle_game");
    location.reload();
  }

  // ----------- GŁÓWNA EKONOMIA CLICK -----------
  function clickTask(idx) {
    const task = tasks[idx];
    if (!task.unlocked) return;
    const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
    task.points += gain;
    totalPoints += gain;
    // Odblokuj kolejny task jeśli masz wymagane punkty
    if (idx + 1 < tasks.length && !tasks[idx + 1].unlocked && task.points >= tasks[idx + 1].unlockCost) {
      tasks[idx + 1].unlocked = true;
    }
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills);
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

  // ----------- UMIEJĘTNOŚĆ PRESTIGE (opcjonalnie) -----------
  function prestige() {
    if (totalPoints < 1000) return; // Przykładowy warunek
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
    ui.init({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave
    });
    ui.renderAll(tasks, totalPoints, softSkills);
    setInterval(saveGame, 10000);
  }

  window.addEventListener("load", init);
})();
