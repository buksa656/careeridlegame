(() => {
  'use strict';

  const CAREER_TRACKS = [
    {
      name: "Stażysta",
      tasks: [
        { name: "Kopiowanie dokumentów", unlockCost: 0, unlocked: true, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.15, progress: 0, lastTick: Date.now() },
        { name: "Parzenie kawy", unlockCost: 50, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.18, progress: 0, lastTick: Date.now() },
        { name: "Skanowanie faktur", unlockCost: 120, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.22, progress: 0, lastTick: Date.now() },
        { name: "Przygotowanie prezentacji", unlockCost: 270, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.25, progress: 0, lastTick: Date.now() },
        { name: "Zamknięcie refaktury", unlockCost: 500, unlocked: false, lvl: 0, points: 0, numClicks: 0, clickGain: 1, idleRate: 0, started: false, baseIdle: 0, gainGrowth: 1.28, progress: 0, lastTick: Date.now() },
      ]
    },
    // Możesz dodać kolejne szczeble...
  ];

  let careerLevel = 0;
  let currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks));
  let softSkills = 0;

  // --- SOFTCAP idle/sec za klik ---
  function clickToIdleBonus(numClicks) {
    if (numClicks <= 30) return 0.1;
    else if (numClicks <= 60) return 0.05;
    else if (numClicks <= 150) return 0.02;
    else return 0.005;
  }

  // --- UI ---
  const ui = window.QRI_UI;

  function saveGame() {
    localStorage.setItem("korpo_sim_v4", JSON.stringify({
      careerLevel,
      currentTasks,
      softSkills
    }));
  }
  function loadGame() {
    const raw = localStorage.getItem("korpo_sim_v4");
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (typeof s.careerLevel === "number") careerLevel = s.careerLevel;
      if (Array.isArray(s.currentTasks)) currentTasks = s.currentTasks;
      if (typeof s.softSkills === "number") softSkills = s.softSkills;
    } catch (e) {}
  }
  function clearSave() { localStorage.removeItem("korpo_sim_v4"); location.reload(); }

  // --- Klik: dopełnienie paska, boost idleRate ---
function clickTask(idx) {
  const task = currentTasks[idx];
  if (!task.unlocked) return;

  // SAFETY: popraw domyślne wartości:
  if (task.baseIdle == null) task.baseIdle = 0.2;
  if (task.progress == null) task.progress = 0;
  if (task.lastTick == null) task.lastTick = Date.now();
  if (task.clickGain == null) task.clickGain = 1;
  if (task.numClicks == null) task.numClicks = 0;
  if (task.lvl == null) task.lvl = 0;

  // Klik dodaje PKT
  task.points += task.clickGain;

  // Klik nalicza...
  task.numClicks += 1;

  // Uruchom idle po raz pierwszy (jeżeli nie chodzi):
  if (!task.started) {
    task.started = true;
    task.baseIdle = 0.2;
    task.idleRate = task.baseIdle + clickToIdleBonus(task.numClicks) + (task.lvl * 0.5);
    task.progress = 1; // dopełnij bar
    task.lastTick = Date.now();
  } else {
    task.idleRate = (task.baseIdle || 0) + clickToIdleBonus(task.numClicks) + (task.lvl * 0.5);
    task.progress = 1;
    task.lastTick = Date.now();
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
    currentTasks = JSON.parse(JSON.stringify(CAREER_TRACKS[careerLevel].tasks));
    saveGame();
    ui.updateTasks(currentTasks, CAREER_TRACKS[careerLevel].name, prestigeReady());
    ui.updateSoftSkills(softSkills, careerLevel + 1, CAREER_TRACKS.length);
  }

  // --- Globalny cykliczny idle loop ---
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
          // Auto-odblokowanie
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

  // === INIT ===
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
