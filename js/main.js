(() => {
  'use strict';

  // === Opis progresu kariery (każdy szczebel/poziom to nowy PRESTIGE) ===
  const CAREER_TRACKS = [
    {
      name: "Stażysta",
      tasks: [
        { name: "Kopiowanie dokumentów", unlockCost: 0, unlocked: true, lvl: 0, points: 0, baseGain: 1, gainGrowth: 1.15 },
        { name: "Parzenie kawy", unlockCost: 50, unlocked: false, lvl: 0, points: 0, baseGain: 2, gainGrowth: 1.18 },
        { name: "Skanowanie faktur", unlockCost: 120, unlocked: false, lvl: 0, points: 0, baseGain: 4, gainGrowth: 1.22 },
        { name: "Przygotowanie prezentacji", unlockCost: 270, unlocked: false, lvl: 0, points: 0, baseGain: 9, gainGrowth: 1.25 },
        { name: "Zamknięcie refaktury", unlockCost: 500, unlocked: false, lvl: 0, points: 0, baseGain: 18, gainGrowth: 1.28 },
      ]
    },
    {
      name: "Młodszy Specjalista",
      tasks: [
        { name: "Wysyłanie maili", unlockCost: 0, unlocked: true, lvl: 0, points: 0, baseGain: 2, gainGrowth: 1.14 },
        { name: "Zamykanie ticketów", unlockCost: 74, unlocked: false, lvl: 0, points: 0, baseGain: 4, gainGrowth: 1.18 },
        { name: "Wypełnianie raportów", unlockCost: 190, unlocked: false, lvl: 0, points: 0, baseGain: 8, gainGrowth: 1.22 },
        { name: "Wrzuta na Teamsa", unlockCost: 410, unlocked: false, lvl: 0, points: 0, baseGain: 17, gainGrowth: 1.28 },
        { name: "Obsługa klienta", unlockCost: 690, unlocked: false, lvl: 0, points: 0, baseGain: 30, gainGrowth: 1.32 },
      ]
    }
    // Dodaj kolejne szczeble podobnie
  ];

  let careerLevel = 0; // numer szczebla kariery
  let currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks)); // Głęboka kopia!
  let softSkills = 0;

  // === UI ===
  const ui = window.QRI_UI;

  function saveGame() {
    localStorage.setItem("korpo_sim_v2", JSON.stringify({
      careerLevel,
      currentTasks,
      softSkills
    }));
  }
  function loadGame() {
    const raw = localStorage.getItem("korpo_sim_v2");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (typeof s.careerLevel === "number") careerLevel = s.careerLevel;
      if (Array.isArray(s.currentTasks)) currentTasks = s.currentTasks;
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
    } catch (e) {}
  }
  function clearSave() { localStorage.removeItem("korpo_sim_v2"); location.reload(); }

  // === Główna ekonomia — klikanie jobów ===
  function clickTask(idx) {
    const task = currentTasks[idx];
    if (!task.unlocked) return;
    const earned = task.baseGain * Math.pow(task.gainGrowth, task.lvl) || 1;
    task.points += earned;

    // Odblokuj kolejny jeśli warunek spełniony:
    if (idx + 1 < currentTasks.length && !currentTasks[idx + 1].unlocked) {
      if (task.points >= currentTasks[idx + 1].unlockCost) {
        currentTasks[idx + 1].unlocked = true;
      }
    }
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  // Ulepszanie taska (przyrost KP na klik)
  function upgradeTask(idx) {
    const task = currentTasks[idx];
    const upgCost = 10 * Math.pow(2.1, task.lvl); // Lekko progresywny koszt
    if (task.points >= upgCost) {
      task.points -= upgCost;
      task.lvl += 1;
    }
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  function prestigeReady() {
    // Czy wszystkie zadania unlocked? (level wymagany np. >= 1, albo dowolny)
    return currentTasks.every(t => t.unlocked);
  }

  function prestige() {
    if (!prestigeReady()) return;
    softSkills += 1;
    careerLevel = Math.min(careerLevel + 1, CAREER_TRACKS.length - 1);
    currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks));
    // Resety, możesz dodać pasywkę z poprzedniego szczebla
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
  }

  // === INIT ===
  function init() {
    loadGame();
    ui.mount({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave
    });
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
    setInterval(saveGame, 10_000);
  }

  window.addEventListener('load', init);
})();
(() => {
  'use strict';

  // === Opis progresu kariery (każdy szczebel/poziom to nowy PRESTIGE) ===
  const CAREER_TRACKS = [
    {
      name: "Stażysta",
      tasks: [
        { name: "Kopiowanie dokumentów", unlockCost: 0, unlocked: true, lvl: 0, points: 0, baseGain: 1, gainGrowth: 1.15 },
        { name: "Parzenie kawy", unlockCost: 50, unlocked: false, lvl: 0, points: 0, baseGain: 2, gainGrowth: 1.18 },
        { name: "Skanowanie faktur", unlockCost: 120, unlocked: false, lvl: 0, points: 0, baseGain: 4, gainGrowth: 1.22 },
        { name: "Przygotowanie prezentacji", unlockCost: 270, unlocked: false, lvl: 0, points: 0, baseGain: 9, gainGrowth: 1.25 },
        { name: "Zamknięcie refaktury", unlockCost: 500, unlocked: false, lvl: 0, points: 0, baseGain: 18, gainGrowth: 1.28 },
      ]
    },
    {
      name: "Młodszy Specjalista",
      tasks: [
        { name: "Wysyłanie maili", unlockCost: 0, unlocked: true, lvl: 0, points: 0, baseGain: 2, gainGrowth: 1.14 },
        { name: "Zamykanie ticketów", unlockCost: 74, unlocked: false, lvl: 0, points: 0, baseGain: 4, gainGrowth: 1.18 },
        { name: "Wypełnianie raportów", unlockCost: 190, unlocked: false, lvl: 0, points: 0, baseGain: 8, gainGrowth: 1.22 },
        { name: "Wrzuta na Teamsa", unlockCost: 410, unlocked: false, lvl: 0, points: 0, baseGain: 17, gainGrowth: 1.28 },
        { name: "Obsługa klienta", unlockCost: 690, unlocked: false, lvl: 0, points: 0, baseGain: 30, gainGrowth: 1.32 },
      ]
    }
    // Dodaj kolejne szczeble podobnie
  ];

  let careerLevel = 0; // numer szczebla kariery
  let currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks)); // Głęboka kopia!
  let softSkills = 0;

  // === UI ===
  const ui = window.QRI_UI;

  function saveGame() {
    localStorage.setItem("korpo_sim_v2", JSON.stringify({
      careerLevel,
      currentTasks,
      softSkills
    }));
  }
  function loadGame() {
    const raw = localStorage.getItem("korpo_sim_v2");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (typeof s.careerLevel === "number") careerLevel = s.careerLevel;
      if (Array.isArray(s.currentTasks)) currentTasks = s.currentTasks;
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
    } catch (e) {}
  }
  function clearSave() { localStorage.removeItem("korpo_sim_v2"); location.reload(); }

  // === Główna ekonomia — klikanie jobów ===
  function clickTask(idx) {
    const task = currentTasks[idx];
    if (!task.unlocked) return;
    const earned = task.baseGain * Math.pow(task.gainGrowth, task.lvl) || 1;
    task.points += earned;

    // Odblokuj kolejny jeśli warunek spełniony:
    if (idx + 1 < currentTasks.length && !currentTasks[idx + 1].unlocked) {
      if (task.points >= currentTasks[idx + 1].unlockCost) {
        currentTasks[idx + 1].unlocked = true;
      }
    }
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  // Ulepszanie taska (przyrost KP na klik)
  function upgradeTask(idx) {
    const task = currentTasks[idx];
    const upgCost = 10 * Math.pow(2.1, task.lvl); // Lekko progresywny koszt
    if (task.points >= upgCost) {
      task.points -= upgCost;
      task.lvl += 1;
    }
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  function prestigeReady() {
    // Czy wszystkie zadania unlocked? (level wymagany np. >= 1, albo dowolny)
    return currentTasks.every(t => t.unlocked);
  }

  function prestige() {
    if (!prestigeReady()) return;
    softSkills += 1;
    careerLevel = Math.min(careerLevel + 1, CAREER_TRACKS.length - 1);
    currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks));
    // Resety, możesz dodać pasywkę z poprzedniego szczebla
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
  }

  // === INIT ===
  function init() {
    loadGame();
    ui.mount({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave
    });
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
    setInterval(saveGame, 10_000);
  }

  window.addEventListener('load', init);
})();
