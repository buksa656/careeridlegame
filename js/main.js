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
      active: false,
      unlockCost: 0
    },
    {
      name: "Ctrl+C, Ctrl+V - Copypasta ofisowa",
      unlocked: false,
      level: 0,
      baseGain: 9,
      gainGrowth: 1.13,
      points: 0,
      cycleTime: 2500,
      progress: 0,
      active: false,
      unlockCost: 48 // progresywny, patrz niżej
    },
    {
      name: "Odpisanie na maila z RE: FW: FW:  ",
      unlocked: false,
      level: 0,
      baseGain: 20,
      gainGrowth: 1.17,
      points: 0,
      cycleTime: 4000,
      progress: 0,
      active: false,
      unlockCost: 180
    },
    {
      name: "Wklejka do Excela (magia tabel)",
      unlocked: false,
      level: 0,
      baseGain: 44,
      gainGrowth: 1.156,
      points: 0,
      cycleTime: 5700,
      progress: 0,
      active: false,
      unlockCost: 570
    },
    {
      name: "Prezentacja – z google slides pod stołem",
      unlocked: false,
      level: 0,
      baseGain: 113,
      gainGrowth: 1.13,
      points: 0,
      cycleTime: 8000,
      progress: 0,
      active: false,
      unlockCost: 1450
    },
    {
      name: "Zebranie – symulacja słuchania",
      unlocked: false,
      level: 0,
      baseGain: 330,
      gainGrowth: 1.09,
      points: 0,
      cycleTime: 12000,
      progress: 0,
      active: false,
      unlockCost: 3550
    },
    {
      name: "Standup 'co zrobisz dziś?'",
      unlocked: false,
      level: 0,
      baseGain: 600,
      gainGrowth: 1.12,
      points: 0,
      cycleTime: 17000,
      progress: 0,
      active: false,
      unlockCost: 8600
    },
    {
      name: "Delegowanie spraw lemingowi",
      unlocked: false,
      level: 0,
      baseGain: 1600,
      gainGrowth: 1.15,
      points: 0,
      cycleTime: 23000,
      progress: 0,
      active: false,
      unlockCost: 22000
    },
    {
      name: "Lunch break: 7/8 dnia 🥪",
      unlocked: false,
      level: 0,
      baseGain: 3600,
      gainGrowth: 1.17,
      points: 0,
      cycleTime: 31000,
      progress: 0,
      active: false,
      unlockCost: 64000
    },
    {
      name: "Król Open Space – 'Co tu się dzieje?!'",
      unlocked: false,
      level: 0,
      baseGain: 9000,
      gainGrowth: 1.19,
      points: 0,
      cycleTime: 47000,
      progress: 0,
      active: false,
      unlockCost: 230000
    }
  ];

  // ----------- ACHIEVEMENTS SYSTEM -----------
  const ACHIEVEMENTS = [
    { 
      emoji:'☕', name: "Caffeinated Intern", desc: "Zrób 150 kliknięć w 'Robienie kawy Szefowi'", 
      check: data => data.tasks[0].points >= 150,
    },
    {
      emoji: '💾', name: "Master Copypasta", desc: "Zgarnij 2 000 biuro-punktów ogółem",
      check: data => data.totalPoints >= 2000,
    },
    {
      emoji: '💸', name: "Sknerus korporacji", desc: "Wydaj >10 000 punktów na ulepszenia",
      check: data => data.stats.spentOnUpgrades >= 10000,
    },
    {
      emoji: '🧠', name: "Szef od HR", desc: "Zdobądź co najmniej 2 soft skills przez rzucenie roboty",
      check: data => data.softSkills >= 2,
    },
    {
      emoji: '🔥', name: "Burnout Hero", desc: "Rzuć robotę co najmniej 3 razy (Burnout)",
      check: data => data.burnout >= 3,
    },
    {
      emoji: '👑', name: "Król Open Space", desc: "Odblokuj ostatni poziom kariery",
      check: data => data.tasks[9] && data.tasks.unlocked,
    }
  ];

  let tasks = [];
  let totalPoints = 0;
  let softSkills = 0;
  let burnout = 0;
  let timers = [];
  let achievements = [];
  let stats = {
    spentOnUpgrades: 0
  };

  // ----------- ZAPIS/ODCZYT -----------
  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks,
      totalPoints,
      softSkills,
      burnout,
      achievements,
      stats
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
        if (Array.isArray(s.achievements)) achievements = s.achievements;
        if (typeof s.stats === "object") stats = s.stats;
      } catch (e) {}
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
      achievements = [];
      stats = { spentOnUpgrades: 0 };
    }
  }

  function clearSave() {
    timers.forEach(t => clearInterval(t));
    localStorage.removeItem("korposzczur_save");
    location.reload();
  }

  // ----------- IDLE TASK -----------
  function startIdle(idx) {
    if (tasks[idx].active) return;
    tasks[idx].active = true;
    tasks[idx].progress = 0;
    let prev = Date.now();

    timers[idx] = setInterval(() => {
      const task = tasks[idx];
      // Szybkość cyklu zależy od levela i softskills
      const lvlCycle = task.cycleTime * Math.pow(0.89, task.level) * Math.pow(0.90, softSkills);
      const now = Date.now();
      task.progress += (now - prev) / lvlCycle;
      prev = now;

      if (task.progress >= 1) {
        task.progress = 0;
        const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
        task.points += gain;
        totalPoints += gain;
        tryUnlockTask(idx + 1); // unlock kolejny, jeśli warunek spełniony
        checkAchievements();
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements);
      }
      ui.renderProgress(idx, task.progress);
    }, 1000 / 30);
  }

  function tryUnlockTask(idx) {
    if (
      idx < tasks.length &&
      !tasks[idx].unlocked &&
      totalPoints >= tasks[idx].unlockCost
    ) {
      tasks[idx].unlocked = true;
    }
  }

  function clickTask(idx) {
    const task = tasks[idx];
    if (task.unlocked) {
      const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
      task.points += gain;
      totalPoints += gain;
      tryUnlockTask(idx + 1); // unlock nowego, jeśli warunek spełniony
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements);
    }
    if (!task.active) startIdle(idx);
  }

  // ----------- ULEPSZENIA (z centralnych punktów!) -----------
  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = Math.floor(20 * Math.pow(2.25, task.level));
    // koszt idzie z totalPoints (zgromadzone, globalne)
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      stats.spentOnUpgrades = (stats.spentOnUpgrades || 0) + cost;
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements);
      ui.renderUpgradeAffordances(tasks, totalPoints);
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
    checkAchievements();
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements);
  }

  // ----------- ACHIEVEMENTY -----------
  function checkAchievements() {
    let unlocked = achievements ? achievements.slice() : [];
    let data = { tasks, totalPoints, softSkills, burnout, stats };
    ACHIEVEMENTS.forEach((ach, idx) => {
      if (!unlocked.includes(idx) && ach.check(data)) {
        unlocked.push(idx);
        setTimeout(() => alert(
          `Osiągnięcie odblokowane!\n\n${ach.emoji} ${ach.name}\n${ach.desc}`), 100
        );
      }
    });
    achievements = unlocked;
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
    checkAchievements();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements);
    ui.renderUpgradeAffordances(tasks, totalPoints);
  }

  window.addEventListener("load", init);
})();
