(() => {
  'use strict';

  // --- Nowa "korpo" tematyka ---
  const KARIERA = [
    "Stażysta",
    "Młodszy Specjalista",
    "Specjalista",
    "Starszy Specjalista",
    "Team Leader",
    "Manager",
    "Senior Manager",
    "Dyrektor",
    "VP",
    "CEO"
  ];
  const OPISEY = [
    "Zna się na kawie. Przyciska klawisze, głównie spację.",
    "Już wie co to Jira, ale nie wie do końca po co.",
    "Zamyka tickety lepiej niż domyka KPI.",
    "Tworzy makra w Excelu dla sportu.",
    "Umie zorganizować zebranie i nie być na nim obecnym.",
    "Ma zawsze czas (na calla).",
    "Ma pod sobą ludzi, ale nie wiadomo ilu.",
    "Jest na 'offsite', więc wszystko załatwiane mailowo.",
    "Używa forwarda jak miecza.",
    "Nikt nie wie, czym się zajmuje, ale każdy wie, że istnieje."
  ];

  // ------- Bazowa ekonomia (parametry dostrojone do kariery) -------
  const T = [2, 3, 4.5, 6.5, 9.5, 13.5, 19, 26, 36, 50];
  const dv = [0.25, 0.22, 0.20, 0.18, 0.16, 0.14, 0.12, 0.10, 0.08, 0.06];
  const gainBase = [0.025, 0.025, 0.018, 0.016, 0.014, 0.012, 0.010, 0.008, 0.006, 0.004]; // dolne szczeble szybciej
  const costBase = [15, 55, 230, 900, 3000, 12000, 45000, 170000, 600000, 2150000];
  const growth = [1.14, 1.15, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22, 1.23, 1.24];
  const baseGain0 = 1.0;

  const prestige = {
    threshold: 2e6,        // Trochę trudniej niż reaktory ;–)
    base: 1,
    exp: 0.52
  };

  // ------- Stan gry -------
  const state = {
    korpogrosze: 0,
    korpogroszeTotal: 0,
    baseGain: baseGain0,
    stanowiska: Array.from({ length: 10 }, (_, i) => ({
      nazwa: KARIERA[i],
      opis: OPISEY[i],
      T: T[i],
      vBase: 1.0,
      v: 1.0,
      progress: 0,
      m: 1.0,          // multiplier (motywacja/boost na szczeblu)
      gain: gainBase[i],
      level: 0,
      costBase: costBase[i],
      growth: growth[i],
      spent: 0
    })),
    soft: 0,             // soft skills (prestige points)
    qUpg: { base: 0, speed: 0, mult: 0 },
    lastUpdate: performance.now(),
    fps: 0,
    prestigeCount: 0,
    firstPrestigeTime: null,
    lastPrestigeTime: null,
    offlineCapHrs: 8
  };

  // ------- Import UI/telemetry -------
  const ui = window.QRI_UI;
  const tm = window.QRI_Telemetry;

  // ------- Save/Load -------
  const SAVE_KEY = 'korpo_sim_save_v1';

  function saveGame() {
    const save = {
      s: state,
      t: ui.shouldSaveTelemetry() ? tm.getData() : null
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }
  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.s) {
        Object.assign(state, parsed.s);
      }
      if (parsed?.t) {
        tm.setData(parsed.t);
        ui.setTelemetryToggle(true);
      }
    } catch (e) { console.warn('Save load error', e); }
  }
  function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }

  // ------- Ekonomia -------
  function computeGlobalM() {
    let M = 1.0;
    for (const r of state.stanowiska) M *= Math.max(1, r.m);
    return M;
  }
  function softSkillsGainNow() {
    const ratio = state.korpogroszeTotal / prestige.threshold;
    if (ratio < 1) return 0;
    return Math.floor(prestige.base * Math.pow(ratio, prestige.exp));
  }

  // ------- Tick/pętla kariery -------
  let frameCount = 0, fpsTimer = performance.now();
  function tick(now) {
    const dtMs = now - state.lastUpdate;
    state.lastUpdate = now;
    const dt = dtMs / 1000;

    // Update FPS
    frameCount++;
    if (now - fpsTimer >= 1000) {
      state.fps = frameCount;
      frameCount = 0;
      fpsTimer = now;
    }

    // Rozwój stanowisk (każdy szczebel)
    for (const p of state.stanowiska) {
      const speedBoost = 1 + 0.06 * state.qUpg.speed; // +6% per soft skill
      const vEff = p.v * speedBoost;
      p.progress += (vEff / p.T) * dt;
      if (p.progress >= 1) {
        p.progress -= 1;
        p.m += p.gain * (1 + 0.02 * state.qUpg.mult); // +2% per Q-upgrade
      }
    }

    // Przychód (korpogrosze)
    const baseBoost = 1 + 0.10 * state.qUpg.base; // +10% per networking
    const M = computeGlobalM();
    const eps = state.baseGain * baseBoost * M;
    const dE = eps * dt;
    state.korpogrosze += dE;
    state.korpogroszeTotal += dE;

    // Telemetria
    tm.sample(now, eps, M, state.fps);
    ui.updateTopbar(state.korpogrosze, eps, M);
    ui.updateReactors(state.stanowiska, KARIERA, OPISEY);
    ui.updatePrestige(softSkillsGainNow(), state.soft, state.qUpg);

    requestAnimationFrame(tick);
  }

  // ------- Akcje kariery -------
  function buy(i) {
    const p = state.stanowiska[i];
    const cost = p.costBase * Math.pow(p.growth, p.level);
    if (state.korpogrosze >= cost) {
      state.korpogrosze -= cost;
      p.level += 1;
      p.v += dv[i];
      p.spent += cost;
      tm.logAction('Buy', i + 1, cost, p.level, p.v, p.gain);
      ui.flashBuy(i);
    }
  }
  function ascend(i) {
    const p = state.stanowiska[i];
    if (p.m < 2.0) return;
    p.level = 0;
    p.v = p.vBase;
    const add = p.gain * 0.5;
    p.gain += add;
    p.m = 1.0;
    p.progress = 0;
    tm.logAction('Ascend', i + 1, 0, p.level, p.v, p.gain);
    ui.flashAscend(i);
  }
  function doPrestige() {
    const qg = softSkillsGainNow();
    if (qg <= 0) return;
    state.soft += qg;
    state.prestigeCount++;
    const now = performance.now();
    if (state.prestigeCount === 1 && state.firstPrestigeTime == null) {
      tm.setFirstPrestigeTime(now);
      state.firstPrestigeTime = now;
    }
    state.lastPrestigeTime = now;
    tm.logPrestige(qg, state.korpogroszeTotal);

    // Reset boostów stanowisk, zachowaj soft skills
    for (const p of state.stanowiska) {
      p.m = 1.0;
      p.progress = 0;
    }
    state.korpogrosze = 0;
  }
  function buyQ(upg) {
    if (state.soft <= 0) return;
    state.soft -= 1;
    state.qUpg[upg] += 1;
    tm.logAction('Q-Buy', upg, 1, 0, 0, 0);
  }

  // ------- Offline progress -------
  function applyOffline() {
    const last = Number(localStorage.getItem(SAVE_KEY + '_last'));
    const now = Date.now();
    localStorage.setItem(SAVE_KEY + '_last', String(now));
    if (!last) return;
    const delta = Math.max(0, now - last) / 1000; // sekundy
    const cap = state.offlineCapHrs * 3600;
    const off = Math.min(delta, cap);
    if (off <= 0) return;
    const baseBoost = 1 + 0.10 * state.qUpg.base;
    const M = computeGlobalM();
    const eps = state.baseGain * baseBoost * M;
    const dE = eps * off * 0.9;
    state.korpogrosze += dE;
    state.korpogroszeTotal += dE;
  }

  // ------- INIT -------
  function init() {
    loadGame();
    applyOffline();
    ui.mount({
      reactors: state.stanowiska,
      KARIERY: KARIERA,
      OPISEY, 
      onBuy: buy,
      onAscend: ascend,
      onDoPrestige: doPrestige,
      onBuyQ: buyQ,
      onToggleTelemetry: (v) => ui.showTelemetry(v),
      onExportTelemetry: () => ui.exportTelemetry(tm.getData()),
      onClearTelemetry: () => { tm.clear(); ui.refreshTelemetry(tm.getData()); },
      onClearSave: clearSave,
      onTopbarCollapse: ui.toggleTopbar
    });
    setInterval(saveGame, 10000);
    requestAnimationFrame((t) => { state.lastUpdate = t; requestAnimationFrame(tick); });
  }

  window.addEventListener('load', init);
})();
