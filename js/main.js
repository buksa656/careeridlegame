(() => {
  'use strict';

  const CAREER_TRACKS = [
    {
      name: "Stażysta",
      tasks: [
        { name: "Kopiowanie dokumentów", unlockCost: 0, unlocked: true, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.15 },
        { name: "Parzenie kawy", unlockCost: 50, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.18 },
        { name: "Skanowanie faktur", unlockCost: 120, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.22 },
        { name: "Przygotowanie prezentacji", unlockCost: 270, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.25 },
        { name: "Zamknięcie refaktury", unlockCost: 500, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.28 },
      ]
    },
    // Dodaj szczeble analogicznie...
  ];

  let careerLevel = 0;
  let currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks));
  let softSkills = 0;
  let idleTimers = [];

  // --- SOFTCAP na bonus idle za klik ---
  function clickToIdleBonus(numClicks) {
    if (numClicks <= 30) return 0.1;
    else if (numClicks <= 60) return 0.05;
    else if (numClicks <= 150) return 0.02;
    else return 0.005;
  }

  // --- UI ---
  const ui = window.QRI_UI;

  function saveGame() {
    localStorage.setItem("korpo_sim_v3", JSON.stringify({
      careerLevel,
      currentTasks,
      softSkills
    }));
  }
  function loadGame() {
    const raw = localStorage.getItem("korpo_sim_v3");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (typeof s.careerLevel === "number") careerLevel = s.careerLevel;
      if (Array.isArray(s.currentTasks)) currentTasks = s.currentTasks;
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
    } catch (e) {}
  }
  function clearSave() { localStorage.removeItem("korpo_sim_v3"); location.reload(); }

  // --- Idle pętla per task ---
  function startIdle(task, idx) {
    if (idleTimers[idx]) return;
    task.started = true;
    idleTimers[idx] = setInterval(() => {
      task.points += task.idleRate;
      // Auto-odblokowanie kolejnych tasków
      if (
        idx + 1 < currentTasks.length &&
        !currentTasks[idx + 1].unlocked &&
        task.points >= currentTasks[idx + 1].unlockCost
      ) {
        currentTasks[idx + 1].unlocked = true;
      }
      saveGame();
      ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    }, 1000);
  }

  // === Główna ekonomia — klik: boostuje idle, daje PKT
  function clickTask(idx) {
    const task = currentTasks[idx];
    if (!task.unlocked) return;

    // Klik boostuje tymczasowo (PKT) + trwale (idleRate)
    task.points += task.clickGain;
    task.numClicks = (task.numClicks || 0) + 1;

    // Softcap — klik klik klik!
    task.idleRate = (task.idleRate || task.baseIdle || 0) + clickToIdleBonus(task.numClicks);

    if (!task.started) {
      task.baseIdle = 0.2; // idle/sec inicjalne (możesz zmienić)
      task.idleRate = task.baseIdle + clickToIdleBonus(task.numClicks); // dodaj początkowe
      startIdle(task, idx);
    }

    // Odblokuj kolejny task jeśli warunek spełniony
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
      task.idleRate += 0.5; // upgrade podbija idle/sec o 0.5
      task.clickGain += 0.5; // i klik zyskuje trochę wartości
    }
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
  }

  function prestigeReady() {
    return currentTasks.every(t => t.unlocked);
  }
  function prestige() {
    if (!prestigeReady()) return;
    // Zatrzymaj stare intervale
    idleTimers.forEach(x => clearInterval(x));
    idleTimers = [];
    // Awans — przestaw się na kolejny szczebel!
    softSkills += 1;
    careerLevel = Math.min(careerLevel + 1, CAREER_TRACKS.length - 1);
    currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks));
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
      onClearSave: clearSave,
      getTasks: () => currentTasks,  // nowy getter dodałem dla poprawności unlock
      currentPosition: CAREER_TRACKS[careerLevel].name
    });
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
    setInterval(saveGame, 10_000);
  }
  window.addEventListener('load', init);
})();
