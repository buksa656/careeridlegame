(() => {
  'use strict';

  const fmt = (n) => {
    if (!isFinite(n)) return '∞';
    if (n < 1000) return n.toFixed(2);
    const units = ['k','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
    let u = -1;
    while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
    return n.toFixed(2) + (u >= 0 ? units[u] : '');
  };

  const el = (q) => document.querySelector(q);
  const elAll = (q) => Array.from(document.querySelectorAll(q));

  const state = {
    saveTelemetry: false
  };

  function makeRing(i) {
    const wrap = document.createElement('div');
    wrap.className = 'reactor';

    const ring = document.createElement('div');
    ring.className = 'ring';
    ring.innerHTML = `
      <svg width="96" height="96">
        <circle cx="48" cy="48" r="42" stroke="#10202a" stroke-width="8" fill="none" />
        <circle data-ring="${i}" cx="48" cy="48" r="42" stroke="var(--accent)" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="264"/>
      </svg>
      <div class="label"><div>R${i+1}</div><div><span data-rpm="${i}">0</span> RPM</div></div>
    `;
    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `
      <div class="title">Reaktor R${i+1}</div>
      <div class="row">
        <span>m: <b data-m="${i}">1.00</b></span>
        <span>gain: <b data-gain="${i}">0</b></span>
        <span>v: <b data-v="${i}">1.00</b></span>
      </div>
      <div class="row">
        <span>Koszt: <b data-cost="${i}">0</b></span>
        <span>Poziom: <b data-level="${i}">0</b></span>
      </div>
    `;
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.innerHTML = `
      <button data-buy="${i}">Buy</button>
      <button data-asc="${i}">Ascend</button>
    `;

    wrap.appendChild(ring);
    wrap.appendChild(info);
    wrap.appendChild(actions);
    return wrap;
  }

  const QRI_UI = {
    mount(cfg) {
      this.cfg = cfg;
      // Tabs
      elAll('.tab').forEach(b => {
        b.addEventListener('click', () => {
          elAll('.tab').forEach(x => x.classList.remove('active'));
          elAll('.tabview').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          el('#' + b.dataset.tab).classList.add('active');
        });
      });
      // Topbar collapse
      el('#collapseTopbar').addEventListener('click', this.toggleTopbar);

      // Reactors
      const list = el('#reactorList');
      list.innerHTML = '';
      cfg.reactors.forEach((_, i) => list.appendChild(makeRing(i)));
      list.addEventListener('click', (e) => {
        const t = e.target;
        if (t.matches('button[data-buy]')) cfg.onBuy(Number(t.dataset.buy));
        if (t.matches('button[data-asc]')) cfg.onAscend(Number(t.dataset.asc));
      });

      // Prestige
      el('#doPrestige').addEventListener('click', cfg.onDoPrestige);
      elAll('.q-buy').forEach(b => {
        b.addEventListener('click', () => cfg.onBuyQ(b.dataset.upg));
      });

      // Settings
      el('#toggleTelemetry').addEventListener('change', (e) => this.showTelemetry(e.target.checked));
      el('#saveTelemetry').addEventListener('change', (e) => state.saveTelemetry = e.target.checked);
      el('#exportTelemetry').addEventListener('click', () => cfg.onExportTelemetry());
      el('#clearTelemetry').addEventListener('click', () => cfg.onClearTelemetry());
      el('#clearSave').addEventListener('click', () => {
        if (confirm('Na pewno wyczyścić zapis gry?')) cfg.onClearSave();
      });
      el('#closeTelemetry').addEventListener('click', () => this.showTelemetry(false));

      // Autosave telemetry toggle reflects state
      this.setTelemetryToggle(false);

      // Resize handler (optional)
      window.addEventListener('resize', () => {});
    },

    shouldSaveTelemetry() { return state.saveTelemetry; },
    setTelemetryToggle(v) { el('#toggleTelemetry').checked = v; },

    showTelemetry(v) {
      el('#telemetryOverlay').classList.toggle('hidden', !v);
    },

    updateTopbar(E, eps, M) {
      el('#energy').textContent = `E: ${fmt(E)}`;
      el('#eps').textContent = `E/s: ${fmt(eps)}`;
      el('#mult').textContent = `M: ${M.toFixed(2)}`;
    },

    updateReactors(reactors) {
      reactors.forEach((r, i) => {
        const dash = 264;
        const off = dash * (1 - Math.max(0, Math.min(1, r.progress)));
        const c = document.querySelector(`circle[data-ring="${i}"]`);
        if (c) c.setAttribute('stroke-dashoffset', String(off));
        const rpm = (r.v / r.T) * 60;
        const speedBoost = 1; // tu pokazujemy bazowy RPM (bez Q), dla prostoty
        const rpmEl = document.querySelector(`[data-rpm="${i}"]`);
        if (rpmEl) rpmEl.textContent = (rpm * speedBoost).toFixed(2);
        const mEl = document.querySelector(`[data-m="${i}"]`);
        if (mEl) mEl.textContent = r.m.toFixed(3);
        const vEl = document.querySelector(`[data-v="${i}"]`);
        if (vEl) vEl.textContent = r.v.toFixed(2);
        const gEl = document.querySelector(`[data-gain="${i}"]`);
        if (gEl) gEl.textContent = r.gain.toFixed(3);
        const lvlEl = document.querySelector(`[data-level="${i}"]`);
        if (lvlEl) lvlEl.textContent = String(r.level);
        const cost = r.costBase * Math.pow(r.growth, r.level);
        const costEl = document.querySelector(`[data-cost="${i}"]`);
        if (costEl) costEl.textContent = fmt(cost);
      });
    },

    updatePrestige(qGain, qTotal, qUpg) {
      el('#qGain').textContent = String(qGain);
      el('#qTotal').textContent = String(qTotal);
      el('[data-upg-lvl="base"]').textContent = String(qUpg.base);
      el('[data-upg-lvl="speed"]').textContent = String(qUpg.speed);
      el('[data-upg-lvl="mult"]').textContent = String(qUpg.mult);
    },

    flashBuy(i) {
      // Opcjonalna animacja feedbacku
    },
    flashAscend(i) {
      // Opcjonalna animacja feedbacku
    },

    exportTelemetry(data) {
      const txt = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(txt).then(() => {
        alert('Telemetria skopiowana do schowka');
      }).catch(() => {
        // fallback
        const w = window.open('', '_blank');
        if (w) {
          w.document.write('<pre>' + txt.replace(/</g, '&lt;') + '</pre>');
          w.document.close();
        }
      });
    },

    refreshTelemetry(data) {
      // natychmiastowy rerender overlayu (opcjonalne)
    },

    toggleTopbar() {
      const bar = document.getElementById('topbar');
      if (bar.style.display === 'none') bar.style.display = '';
      else bar.style.display = 'none';
    }
  };

  window.QRI_UI = QRI_UI;
})();
