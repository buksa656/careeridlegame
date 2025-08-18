(() => {
  'use strict';

  let KARIERY = [];
  let OPISEY = [];

  // Proste SVG z literką – flat design
  function svgAvatar(letter, color="#1976d2", bg="#e3eaf3") {
    return `
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="${bg}" stroke="${color}" stroke-width="2"/>
        <text x="50%" y="54%" text-anchor="middle" fill="${color}" font-size="22" font-family="Segoe UI,Arial,sans-serif" dy=".3em" font-weight="bold">${letter}</text>
      </svg>
    `;
  }

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

  function makeCareerTile(i) {
    const wrap = document.createElement('div');
    wrap.className = 'kafelek';
    // SVG z literą stanowiska
    const firstLetter = (KARIERY[i]?.[0] || "?").toUpperCase();

    const ikona = document.createElement('span');
    ikona.className = 'kafelek-ikona';
    ikona.innerHTML = svgAvatar(firstLetter);

    const info = document.createElement('div');
    info.className = 'kafelek-info';
    info.innerHTML = `
      <div class="title">${KARIERY[i]}</div>
      <div class="korpo-desc">${OPISEY[i]}</div>
      <div class="kafelek-progbar"><div class="kafelek-progbar-inner" data-prog="${i}" style="width: 0%"></div></div>
      <div class="kafelek-row">
        Poziom: <b data-level="${i}">0</b>
        &nbsp;&ndash;&nbsp; Motywacja: <b data-m="${i}">1.00</b>
        &nbsp;&ndash;&nbsp; Wydajność: <b data-v="${i}">1.00</b>
      </div>
      <div class="kafelek-row">
        Koszt szkolenia: <b data-cost="${i}">0</b> &bull; Zysk awansu: <b data-gain="${i}">0.0</b>
      </div>
    `;
    const actions = document.createElement('div');
    actions.className = 'kafelek-akcje';
    actions.innerHTML = `
      <button data-buy="${i}">Szkolenie</button>
      <button data-asc="${i}">Awans</button>
    `;

    wrap.appendChild(ikona);
    wrap.appendChild(info);
    wrap.appendChild(actions);
    return wrap;
  }

  const QRI_UI = {
    mount(cfg) {
      KARIERY = cfg.KARIERY || [];
      OPISEY = cfg.OPISEY || [];
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

      // Kariera (stanowiska)
      const list = el('#careerList');
      if(list) {
        list.innerHTML = '';
        cfg.reactors.forEach((_, i) => list.appendChild(makeCareerTile(i)));
        list.addEventListener('click', (e) => {
          const t = e.target;
          if (t.matches('button[data-buy]')) cfg.onBuy(Number(t.dataset.buy));
          if (t.matches('button[data-asc]')) cfg.onAscend(Number(t.dataset.asc));
        });
      }

      // Prestige i upgrades jak poprzednio
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
    },

    shouldSaveTelemetry() { return state.saveTelemetry; },
    setTelemetryToggle(v) { el('#toggleTelemetry').checked = v; },

    showTelemetry(v) {
      el('#telemetryOverlay').classList.toggle('hidden', !v);
    },

    updateTopbar(E, eps, M) {
      el('#energy').textContent = `Korpogrosze: ${fmt(E)}`;
      el('#eps').textContent = `Korpogrosze/s: ${fmt(eps)}`;
      el('#mult').textContent = `Soft Skills: ${M.toFixed(2)}`;
    },

    updateReactors(stanowiska) {
      stanowiska.forEach((r, i) => {
        // Progress bar
        const percent = Math.max(0, Math.min(1, r.progress)) * 100;
        const progEl = document.querySelector(`.kafelek-progbar-inner[data-prog="${i}"]`);
        if (progEl) progEl.style.width = `${percent}%`;

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

    updatePrestige(softSkillsGain, soft, qUpg) {
      el('#qGain').textContent = String(softSkillsGain);
      el('#qTotal').textContent = String(soft);
      el('[data-upg-lvl="base"]').textContent = String(qUpg.base);
      el('[data-upg-lvl="speed"]').textContent = String(qUpg.speed);
      el('[data-upg-lvl="mult"]').textContent = String(qUpg.mult);
    },

    flashBuy(i) {},
    flashAscend(i) {},

    exportTelemetry(data) {
      const txt = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(txt).then(() => {
        alert('Telemetria skopiowana do schowka');
      }).catch(() => {
        const w = window.open('', '_blank');
        if (w) {
          w.document.write('<pre>' + txt.replace(/</g, '&lt;') + '</pre>');
          w.document.close();
        }
      });
    },

    refreshTelemetry(data) {},

    toggleTopbar() {
      const bar = document.getElementById('topbar');
      if (bar.style.display === 'none') bar.style.display = '';
      else bar.style.display = 'none';
    }
  };

  window.QRI_UI = QRI_UI;
})();
