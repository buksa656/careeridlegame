(() => {
  'use strict';
  // ----------- TASKI -----------
  const TASKS = [
    // ...bez zmian, szczegóły tasków jak wcześniej
    // dodaj automatyczne taski dla niektórych, np. 3, 5, 8 (ważne później!)
    {
      name: "Robienie kawy Szefowi",
      unlocked: true,
      level: 0,
      baseGain: 1,
      gainGrowth: 1.14,
      cycleTime: 1600,
      progress: 0,
      active: false,
      unlockCost: 0,
      autoCapable: true // ten task może mieć „automat”
    },
    {
      name: "Ctrl+C, Ctrl+V - Copypasta ofisowa",
      unlocked: false,
      level: 0,
      baseGain: 9,
      gainGrowth: 1.13,
      cycleTime: 2500,
      progress: 0,
      active: false,
      unlockCost: 48,
      autoCapable: false
    },
    {
      name: "Odpisanie na maila z RE: FW: FW:  ",
      unlocked: false,
      level: 0,
      baseGain: 20,
      gainGrowth: 1.17,
      cycleTime: 4000,
      progress: 0,
      active: false,
      unlockCost: 180,
      autoCapable: false
    },
    {
      name: "Wklejka do Excela (magia tabel)",
      unlocked: false,
      level: 0,
      baseGain: 44,
      gainGrowth: 1.156,
      cycleTime: 5700,
      progress: 0,
      active: false,
      unlockCost: 570,
      autoCapable: true
    },
    {
      name: "Prezentacja – z google slides pod stołem",
      unlocked: false,
      level: 0,
      baseGain: 113,
      gainGrowth: 1.13,
      cycleTime: 8000,
      progress: 0,
      active: false,
      unlockCost: 1450,
      autoCapable: false
    },
    {
      name: "Zebranie – symulacja słuchania",
      unlocked: false,
      level: 0,
      baseGain: 330,
      gainGrowth: 1.09,
      cycleTime: 12000,
      progress: 0,
      active: false,
      unlockCost: 3550,
      autoCapable: true
    },
    // ...i reszta, jak wcześniej, z autoCapable: true/false dla niektórych
  ];

  // ----------- ACHIEVEMENTY Z NAGRODAMI oraz automaty -----------
  const AUTOMATY = [
    {
      name: "Ekspres do Kawy",
      desc: "Automatycznie nalewa kawę dla szefa co 1.7 sekundy!",
      emoji: "☕",
      taskIdx: 0,
      interval: 1700,
      unlocked: false,
    },
    {
      name: "ExcelBot",
      desc: "Samodzielnie wkleja do Excela co 4 sekundy!",
      emoji: "📊",
      taskIdx: 3,
      interval: 4000,
      unlocked: false,
    },
    {
      name: "Notatnik Sztucznej Inteligencji",
      desc: "Automat spisuje zebrania co 9 sekund!",
      emoji: "🤖",
      taskIdx: 5,
      interval: 9000,
      unlocked: false,
    }
  ];

  const ACHIEVEMENTS = [
    { 
      emoji:'☕', name: "Caffeinated Intern", desc: "Zrób 150 kliknięć w 'Robienie kawy Szefowi'",
      check: data => data.tasks[0].points >= 150,
      reward: { type: "points", value: 100 },
      rewardDesc: "+100 biuro-punktów"
    },
    {
      emoji: '💾', name: "Master Copypasta", desc: "Zgarnij 2 000 biuro-punktów ogółem",
      check: data => data.totalPoints >= 2000,
      reward: { type: "softSkill", value: 1 },
      rewardDesc: "+1 Soft Skill"
    },
    {
      emoji: '☕', name: "Ekspresowy korposzczur", desc: "Pokaż mistrzostwo kawy! (zdobądź 700 pkt. w tasku 1)",
      check: data => data.tasks.points >= 700,
      reward: { type: "automat", idx: 0 },
      rewardDesc: "Automat: Ekspres do Kawy"
    },
    {
      emoji: '📊', name: "Excelowa magia", desc: "Wklej łącznie 2000 pkt. do Excel tasku",
      check: data => data.tasks[1] && data.tasks[1].points >= 2000,
      reward: { type: "automat", idx: 1 },
      rewardDesc: "Automat: ExcelBot"
    },
    {
      emoji: '🤖', name: "Meeting Terminator", desc: "Zgarnij 3000 pkt w zadaniu 'Zebranie...'",
      check: data => data.tasks && data.tasks.points >= 3000,
      reward: { type: "automat", idx: 2 },
      rewardDesc: "Automat: Notatnik Sztucznej Inteligencji"
    },
    {
      emoji: '🧠', name: "Szef od HR", desc: "Zdobądź 2 Soft Skills",
      check: data => data.softSkills >= 2,
      reward: { type: "points", value: 700 },
      rewardDesc: "+700 biuro-punktów"
    }
  ];

  let tasks = [];
  let totalPoints = 0;
  let softSkills = 0;
  let burnout = 0;
  let timers = [];
  let achievements = [];
  let stats = { spentOnUpgrades: 0 };
  let automaty = [];
  let activeAutoTimers = [];

  // ----------- ZAPIS/ODCZYT -----------
  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks,
      totalPoints,
      softSkills,
      burnout,
      achievements,
      stats,
      automaty
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
        if (typeof s.stats === "object") stats = s.stats || { spentOnUpgrades: 0 };
        if (Array.isArray(s.automaty)) automaty = s.automaty;
      } catch (e) {}
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
      achievements = [];
      automaty = AUTOMATY.map(a => ({...a, unlocked: false}));
      stats = { spentOnUpgrades: 0 };
    }
  }

  function clearSave() {
    timers.forEach(t => clearInterval(t));
    clearAutomaty();
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
      const lvlCycle = task.cycleTime * Math.pow(0.89, task.level) * Math.pow(0.90, softSkills);
      const now = Date.now();
      task.progress += (now - prev) / lvlCycle;
      prev = now;

      if (task.progress >= 1) {
        task.progress = 0;
        const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
        totalPoints += gain;
        tryUnlockTask(idx + 1);
        checkAchievements();
        saveGame();
        ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
      }
      ui.renderProgress(idx, task.progress);
    }, 1000 / 30);
  }

  function tryUnlockTask(idx) {
    if (idx < tasks.length &&
        !tasks[idx].unlocked &&
        totalPoints >= tasks[idx].unlockCost) {
      tasks[idx].unlocked = true;
    }
  }

  function clickTask(idx) {
    const task = tasks[idx];
    if (task.unlocked) {
      const gain = task.baseGain * Math.pow(task.gainGrowth, task.level);
      totalPoints += gain;
      tryUnlockTask(idx + 1);
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
    }
    if (!task.active) startIdle(idx);
  }

  // ----------- ULEPSZENIA -----------
  function upgradeTask(idx) {
    const task = tasks[idx];
    const cost = Math.floor(20 * Math.pow(2.25, task.level));
    if (totalPoints >= cost) {
      task.level += 1;
      totalPoints -= cost;
      stats.spentOnUpgrades = (stats.spentOnUpgrades || 0) + cost;
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
      ui.renderUpgradeAffordances(tasks, totalPoints);
    }
  }

  // ----------- PRESTIGE / RZUĆ ROBOTĘ -----------
  function prestige() {
    timers.forEach(t => clearInterval(t));
    clearAutomaty();
    if (totalPoints < 10000) return;
    softSkills += 1;
    burnout += 1;
    totalPoints = 0;
    tasks = JSON.parse(JSON.stringify(TASKS));
    // Automaty resetują się na nową karierę (wyzwanie!)
    automaty = AUTOMATY.map(a => ({...a, unlocked: false}));
    checkAchievements();
    saveGame();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
    ui.renderUpgradeAffordances(tasks, totalPoints);
  }

  // ----------- AUTOMATY ---------------
  function clearAutomaty() {
    activeAutoTimers.forEach(id => clearInterval(id));
    activeAutoTimers = [];
  }

  function updateAutomaty() {
    clearAutomaty();
    automaty.forEach((auto, i) => {
      if (auto.unlocked) {
        // Automat co [interval] dokłada taskowi punkty!
        activeAutoTimers[i] = setInterval(() => {
          const task = tasks[auto.taskIdx];
          if (task && task.unlocked) {
            const gain = Math.max(1, task.baseGain * Math.pow(task.gainGrowth, task.level));
            task.points += gain;
            totalPoints += gain;
            // Unlock kolejnego taska, jeśli to możliwe!
            tryUnlockTask(auto.taskIdx + 1);
            checkAchievements();
            saveGame();
            ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
          }
        }, auto.interval);
      }
    });
  }

  // ----------- ACHIEVEMENTY + REWARDY ---------
  function checkAchievements() {
    let unlocked = achievements ? achievements.slice() : [];
    let data = { tasks, totalPoints, softSkills, burnout, stats };
    ACHIEVEMENTS.forEach((ach, idx) => {
      if (!unlocked.includes(idx) && ach.check(data)) {
        unlocked.push(idx);
        // Zapisz achievement i wyświetl nagrodę do odebrania
        setTimeout(() => showRewardModal(ach, idx), 80);
      }
    });
    achievements = unlocked;
    // po zdobyciu achievementu z automatem: unlock automaty!
    for (let idx of unlocked) {
      const ach = ACHIEVEMENTS[idx];
      if (ach.reward && ach.reward.type === "automat" && !automaty[ach.reward.idx].unlocked) {
        automaty[ach.reward.idx].unlocked = true;
        updateAutomaty();
      }
    }
  }

  function showRewardModal(ach, idx) {
    // tylko jeśli jeszcze nie odebrano
    if (!ach.reward) return;
    ui.showRewardModal(
      ach.emoji,
      ach.name,
      ach.desc,
      ach.rewardDesc,
      () => collectReward(ach, idx)
    );
  }

  function collectReward(ach, idx) {
    // użyj typu nagrody
    if (ach.reward.type === "points") {
      totalPoints += ach.reward.value;
    } else if (ach.reward.type === "softSkill") {
      softSkills += ach.reward.value;
    } else if (ach.reward.type === "automat") {
      if (automaty[ach.reward.idx]) {
        automaty[ach.reward.idx].unlocked = true;
        updateAutomaty();
      }
    }
    saveGame();
    ui.hideRewardModal();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
    ui.renderUpgradeAffordances(tasks, totalPoints);
  }

  // ----------- INICJALIZACJA -----------
  const ui = window.IdleUI;

  function init() {
    loadGame();
    timers = Array(tasks.length).fill(null);
    automaty = automaty.length ? automaty : AUTOMATY.map(a => ({...a, unlocked: false}));
    ui.init({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave
    });
    checkAchievements();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    updateAutomaty();
  }

  window.addEventListener("load", init);
})();
