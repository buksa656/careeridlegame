(() => {
  'use strict';

  // ------- Konfiguracja bazowa (balans po korektach) -------
  const T = [2, 3, 4.5, 6.5, 9.5, 13.5, 19, 26, 36, 50];
  const dv = [0.25, 0.22, 0.20, 0.18, 0.16, 0.14, 0.12, 0.10, 0.08, 0.06];
  const gainBase = [0.025, 0.025, 0.018, 0.016, 0.014, 0.012, 0.010, 0.008, 0.006, 0.004]; // R1,R2 podbite
  const costBase = [9, 36, 160, 600, 2200, 8000, 28000, 95000, 320000, 1050000]; // R1–R2 -10%
  const growth = [1.14, 1.15, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22, 1.23, 1.24];  // R1–R2 -0.01
  const baseGain0 = 1.0;

  const prestige = {
    threshold: 1e6,
    base: 1,
    exp: 0.52
  };

  // ------- Stan gry -------
  const state = {
    energy: 0,
    energyTotal: 0,
    baseGain: baseGain0,
    reactors: Array.from({ length: 10 }, (_, i) => ({
      name: `R${i + 1}`,
      T: T[i],
      vBase: 1.0,
      v: 1.0,
      progress: 0,
      m: 1.0,
      gain: gainBase[i],
      level: 0,
      costBase: costBase[i],
      growth: growth[i],
      spent: 0
    })),
    q: 0,
    qUpg: { base: 0, speed: 0, mult: 0 },
    lastUpdate: performance.now(),
    fps: 0,
    prestigeCount: 0,
    firstPrestigeTime: null,
    lastPrestigeTime: null,
    offlineCapHrs: 8
  };

  // ------- Import narzędzi UI/telemetrii -------
  const ui = window.QRI_UI;
  const tm = window.QRI_Telemetry;

  // ------- Save/Load -------
  const SAVE_KEY = 'qri_save_v1';
  const SAVE_TELEMETRY = 'qri_telemetry_v1';

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
    for (const r of state.reactors) M *= Math.max(1, r.m);
    return M;
  }

  function qGainNow() {
    const ratio = state.energyTotal / prestige.threshold;
    if (ratio < 1) return 0;
    return Math.floor(prestige.base * Math.pow(ratio, prestige.exp));
  }

  // ------- Tick/pętla -------
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

    // Ruch i mnożniki
    for (const r of state.reactors) {
      const speedBoost = 1 + 0.06 * state.qUpg.speed; // +6% per Q
      const vEff = r.v * speedBoost;
      r.progress += (vEff / r.T) * dt;
      if (r.progress >= 1) {
        r.progress -= 1;
        r.m += r.gain * (1 + 0.02 * state.qUpg.mult); // +2% per Q
      }
    }

    // Dochód
    const baseBoost = 1 + 0.10 * state.qUpg.base; // +10% per Q
    const M = computeGlobalM();
    const eps = state.baseGain * baseBoost * M;
    const dE = eps * dt;
    state.energy += dE;
    state.energyTotal += dE;

    // Telemetria
    tm.sample(now, eps, M, state.fps);
    ui.updateTopbar(state.energy, eps, M);
    ui.updateReactors(state.reactors);
    ui.updatePrestige(qGainNow(), state.q, state.qUpg);

    requestAnimationFrame(tick);
  }

  // ------- Zakupy i akcje -------
  function buy(i) {
    const r = state.reactors[i];
    const cost = r.costBase * Math.pow(r.growth, r.level);
    if (state.energy >= cost) {
      state.energy -= cost;
      r.level += 1;
      r.v += dv[i];
      r.spent += cost;
      tm.logAction('Buy', i + 1, cost, r.level, r.v, r.gain);
      ui.flashBuy(i);
    }
  }

  function ascend(i) {
    const r = state.reactors[i];
    if (r.m < 2.0) return; // próg odblokowania
    r.level = 0;
    r.v = r.vBase;
    const add = r.gain * 0.5; // +50% bieżącego gain_i
    r.gain += add;
    r.m = 1.0;
    r.progress = 0;
    tm.logAction('Ascend', i + 1, 0, r.level, r.v, r.gain);
    ui.flashAscend(i);
  }

  function doPrestige() {
    const qg = qGainNow();
    if (qg <= 0) return;
    state.q += qg;
    state.prestigeCount++;
    const now = performance.now();
    if (state.prestigeCount === 1 && state.firstPrestigeTime == null) {
      tm.setFirstPrestigeTime(now);
      state.firstPrestigeTime = now;
    }
    state.lastPrestigeTime = now;
    tm.logPrestige(qg, state.energyTotal);

    // Reset m_i i progresów, zachowaj ascend bonusy
    for (const r of state.reactors) {
      r.m = 1.0;
      r.progress = 0;
    }
    // Reset energii (możesz zostawić 0 lub część)
    state.energy = 0;
  }

  function buyQ(upg) {
    if (state.q <= 0) return;
    state.q -= 1;
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
    // Przybliżenie: policz E przy stałym eps z chwili startu offline
    const baseBoost = 1 + 0.10 * state.qUpg.base;
    const M = computeGlobalM();
    const eps = state.baseGain * baseBoost * M;
    const dE = eps * off * 0.9; // 90% skuteczności offline
    state.energy += dE;
    state.energyTotal += dE;
  }

  // ------- Init -------
  function init() {
    loadGame();
    applyOffline();
    ui.mount({
      reactors: state.reactors,
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
    // autosave
    setInterval(saveGame, 10000);
    requestAnimationFrame((t) => { state.lastUpdate = t; requestAnimationFrame(tick); });
  }

  window.addEventListener('load', init);
})();
