(() => {
  'use strict';

  const data = {
    sessionStart: Date.now(),
    activeSeconds: 0,
    lastSampleTs: performance.now(),
    offlineGaps: [],
    epsSamples: [], // {t, eps}, max ~180 (30 min przy 10s)
    epsAvg30: 0,
    Mlive: 1,
    FPS: 0,
    firstPrestigeMs: null,
    lastPrestigeMs: null,
    actions: [], // ostatnie 50: {t, type, r?, cost?, level?, v?, gain?}
    prestige: [], // ostatnie 10: {t, E_total, Q_gained, Q_total_after}
    spent: { reactors: Array(10).fill(0), q: { base:0, speed:0, mult:0 } },
    snapshots: [] // max 5: {t, m:[..], v:[..]}
  };

  let snapshotTimer = performance.now();
  const SNAPSHOT_EVERY = 30000; // 30s

  function sample(now, eps, M, fps) {
    // live
    data.Mlive = M;
    data.FPS = fps;

    // sample E/s co 10s
    if (now - data.lastSampleTs >= 10000) {
      data.lastSampleTs = now;
      data.epsSamples.push({ t: Date.now(), eps });
      if (data.epsSamples.length > 180) data.epsSamples.shift(); // cap
      // rolling avg 30s
      const last3 = data.epsSamples.slice(-3).map(x => x.eps);
      const avg = last3.length ? last3.reduce((a,b)=>a+b,0)/last3.length : 0;
      data.epsAvg30 = avg;
    }

    // snapshots co 30s (UI pobiera stan m_i i v_i z zewnątrz—tu sygnał)
    if (now - snapshotTimer >= SNAPSHOT_EVERY) {
      snapshotTimer = now;
      if (window?.QRI_SnapshotProvider) {
        const snap = window.QRI_SnapshotProvider();
        data.snapshots.push({ t: Date.now(), m: snap.m, v: snap.v });
        if (data.snapshots.length > 5) data.snapshots.shift();
      }
    }

    // render overlay live
    const fmt = (n) => {
      if (!isFinite(n)) return '∞';
      if (n < 1000) return n.toFixed(2);
      const units = ['k','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
      let u = -1;
      while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
      return n.toFixed(2) + (u >= 0 ? units[u] : '');
    };
    const $ = (q) => document.querySelector(q);
    const epsLiveEl = $('#t_eps_live');
    if (epsLiveEl) {
      epsLiveEl.textContent = fmt(eps);
      const epsAvgEl = $('#t_eps_avg');
      if (epsAvgEl) epsAvgEl.textContent = fmt(data.epsAvg30);
      const MEl = $('#t_M'); if (MEl) MEl.textContent = M.toFixed(2);
      const FPSEl = $('#t_fps'); if (FPSEl) FPSEl.textContent = String(fps);
      const t1pEl = $('#t_t1p'); if (t1pEl) t1pEl.textContent = data.firstPrestigeMs ? (data.firstPrestigeMs/1000).toFixed(1)+' s' : '—';
      const tlpEl = $('#t_tlp'); if (tlpEl) tlpEl.textContent = data.lastPrestigeMs ? (data.lastPrestigeMs/1000).toFixed(1)+' s' : '—';
      const actionsEl = $('#t_actions'); if (actionsEl) actionsEl.textContent = JSON.stringify(data.actions.slice(-20), null, 2);
      const spendEl = $('#t_spend'); if (spendEl) spendEl.textContent = JSON.stringify(data.spent, null, 2);
      const snapsEl = $('#t_snapshots'); if (snapsEl) snapsEl.textContent = JSON.stringify(data.snapshots, null, 2);
    }
  }

  function logAction(type, rOrUpg, cost, level, v, gain) {
    const rec = { t: Date.now(), type, target: rOrUpg, cost, level, v, gain };
    data.actions.push(rec);
    if (data.actions.length > 50) data.actions.shift();

    // Wydatki
    if (type === 'Buy' && typeof rOrUpg === 'number') {
      data.spent.reactors[rOrUpg - 1] += cost || 0;
    }
    if (type === 'Q-Buy') {
      if (rOrUpg === 'base') data.spent.q.base += 1;
      if (rOrUpg === 'speed') data.spent.q.speed += 1;
      if (rOrUpg === 'mult') data.spent.q.mult += 1;
    }
  }

  function logPrestige(qGained, ETotal) {
    const lastQ = (data.prestige.length ? data.prestige[data.prestige.length - 1].Q_total_after : 0);
    const rec = { t: Date.now(), E_total: ETotal, Q_gained: qGained, Q_total_after: lastQ + qGained };
    data.prestige.push(rec);
    if (data.prestige.length > 10) data.prestige.shift();
    if (!data.firstPrestigeMs) data.firstPrestigeMs = (Date.now() - data.sessionStart);
    data.lastPrestigeMs = (Date.now() - data.sessionStart);
  }

  function getData() { return data; }
  function setData(d) { Object.assign(data, d || {}); }
  function clear() {
    data.epsSamples = [];
    data.snapshots = [];
    data.actions = [];
    data.prestige = [];
    data.spent = { reactors: Array(10).fill(0), q: { base:0, speed:0, mult:0 } };
    data.firstPrestigeMs = null;
    data.lastPrestigeMs = null;
  }

  // Udostępnij API
  window.QRI_Telemetry = { sample, logAction, logPrestige, getData, setData, clear };

  // Snapshot provider hook (main może podpiąć swoją funkcję)
  window.QRI_SnapshotProvider = () => {
    try {
      const reactors = window.QRI_Debug_GetReactors?.() || [];
      const m = reactors.map(r => Number(r.m?.toFixed ? r.m.toFixed(3) : r.m));
      const v = reactors.map(r => Number(r.v?.toFixed ? r.v.toFixed(2) : r.v));
      return { m, v };
    } catch {
      return { m: [], v: [] };
    }
  };
})();
