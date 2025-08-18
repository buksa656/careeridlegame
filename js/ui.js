(() => {
  'use strict';
  let eventHandlers = {};

  function e(q) { return document.querySelector(q); }
  function fmt(n) {
    return typeof n === "number" && n >= 1000 ? n.toLocaleString("pl") : Math.round(n);
  }

  const JOKES = [
    "Sztuka kopiowania – podstawa sukcesu 🖨️",
    "Kawa nie robi się sama... ale spróbuj!",
    "Excelem cie nie posadzą, ale odkliknieć musisz",
    "Czy ten raport jest w ogóle potrzebny?",
    "Restart kompa zawsze działa – polecane!",
    "Klient czeka... na odpowiedź bota.",
    "Ogarnianie Teamów – skill XXI w.",
    "Awans przez przypadek 😅",
    "Automat wygrał z tobą – czas na urlop?",
    "Nigdy nie podpisuj się imieniem, podpisz się Zespołem!"
  ];

  function panelNav() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        document.querySelectorAll(".panel").forEach(panel => panel.style.display = "none");
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        const target = btn.dataset.panel;
        btn.classList.add("active");
        document.getElementById("panel-" + target).style.display = "";
      });
    });
    document.querySelector('.tab-btn[data-panel="kariera"]').classList.add("active");
    document.getElementById("panel-kariera").style.display = "";
    document.getElementById("panel-firma").style.display = "none";
    document.getElementById("panel-ustawienia").style.display = "none";
    document.getElementById("panel-achievementy").style.display = "none";
  }

  function taskTile(task, idx, totalPoints) {
    const upgCost = Math.floor(20 * Math.pow(2.25, task.level));
    const canUpgrade = totalPoints >= upgCost;
    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-taskidx="${idx}">
        <div class="kafelek-info">
          <div class="title">${task.name} ${task.level > 5 ? '🍕' : ''}${task.level > 15 ? '🔥' : ''}</div>
          <div class="kafelek-row">Zarobek: <b>${fmt(task.baseGain * Math.pow(task.gainGrowth, task.level))}</b> | lvl: <b>${task.level}</b></div>
          <div class="kafelek-row">Punkty: <b>${fmt(task.points)}</b></div>
          ${!task.unlocked && task.unlockCost ? `<div class="kafelek-row">Odblokuj za <b>${fmt(task.unlockCost)}</b> biuro-pkt</div>` : ''}
          <div class="kafelek-progbar">
            <div class="kafelek-progbar-inner" style="width:${Math.round((task.progress||0)*100)}%"></div>
          </div>
          <div class="funny">${JOKES[idx % JOKES.length]}</div>
        </div>
        <div class="kafelek-akcje">
          <button ${!task.unlocked ? "disabled" : ""} data-do="click" data-idx="${idx}">Wykonaj</button>
          <button ${!task.unlocked || !canUpgrade ? "disabled" : ""} data-do="upg" data-idx="${idx}">
            Ulepsz<br>(${fmt(upgCost)})
          </button>
        </div>
      </div>`;
  }

  function renderAll(tasks, totalPoints, softSkills, burnout = 0, achievements = []) {
    // Pasek na górę
    e("#top-total-points").textContent = fmt(totalPoints);
    e("#top-soft-skills").textContent = fmt(softSkills);

    e("#panel-kariera").innerHTML = `
      <h2>Twoja kariera w korpo</h2>
      <div class="career-list">${tasks.map((task, idx) => taskTile(task, idx, totalPoints)).join('')}</div>
      <div class="softskill-info">
        <span>🧠 Soft Skills: <b>${softSkills}</b></span>
        ${burnout ? ` | 😵‍💫 Burnout Level: <b style="color:#a22">${burnout}</b>` : ''}
      </div>
      <div style="color:#e79522;margin-top:10px;font-size:1.02em"><b>Tip:</b> Klikaj na zadania i rozwijaj biuro, odblokuj wszystkie poziomy!</div>
    `;

    renderAchievements(achievements);

    e("#panel-firma").innerHTML = `
      <h2>Rzuć robotę (PRESTIGE)</h2>
      <p>Poczuj przypływ motywacji – zmieniasz biuro, zachowujesz 🧠 Soft Skills i możesz awansować jeszcze szybciej!</p>
      <div>Soft Skills: <b>${softSkills}</b><br>Burnout Level: <b>${burnout}</b></div>
      <button id="prestige-btn" ${totalPoints < 10000 ? "disabled" : ""}>Rzuć papierami (10&nbsp;000+ pkt)</button>
      <div style="margin-top:14px; font-size:1.06em; color:#495;">Bonus: Każdy Soft Skill = +10% szybciej pasek progressu</div>
      <div style="font-size:.98em;color:#8888aa;margin-top:15px">Nowa firma = nowe absurdy. Sprawdź, ile wytrzymasz tym razem!</div>
    `;

    e("#panel-ustawienia").innerHTML = `<button id="reset-btn">Resetuj postęp (🔥 ZACZYNASZ OD ZERA!)</button>`;
    addEvents(tasks.length);
  }

  function renderAchievements(achievements) {
    const ACHIEVEMENTS = [
      { emoji:'☕', name: "Caffeinated Intern", desc: "Zrób 150 kliknięć w 'Robienie kawy Szefowi'" },
      { emoji: '💾', name: "Master Copypasta", desc: "Zgarnij 2 000 biuro-punktów ogółem" },
      { emoji: '💸', name: "Sknerus korporacji", desc: "Wydaj >10 000 punktów na ulepszenia" },
      { emoji: '🧠', name: "Szef od HR", desc: "Zdobądź 2 Soft Skills przez Prestige" },
      { emoji: '🔥', name: "Burnout Hero", desc: "Rzuć robotę co najmniej 3 razy!" },
      { emoji: '👑', name: "Król Open Space", desc: "Odblokuj ostatni poziom kariery" }
    ];
    e("#panel-achievementy").innerHTML = `
      <h2>Osiągnięcia</h2>
      <div class="ach-list">
      ${ACHIEVEMENTS.map((ach, i) =>
        `<div class="ach-item${achievements.includes(i) ? ' completed' : ''}">
          <span class="emoji">${ach.emoji}</span>
          <div>
            <span class="ach-name">${ach.name}</span>
            <div class="ach-desc">${ach.desc}</div>
          </div>
        </div>`
      ).join('')}
      </div>
    `;
  }

  function renderProgress(idx, progress) {
    const bar = document.querySelector(`.kafelek[data-taskidx="${idx}"] .kafelek-progbar-inner`);
    if (bar) bar.style.width = Math.round(progress * 100) + "%";
  }

  function renderUpgradeAffordances(tasks, totalPoints) {
    document.querySelectorAll('.kafelek-akcje [data-do="upg"]').forEach((btn, idx) => {
      const upgCost = Math.floor(20 * Math.pow(2.25, tasks[idx].level));
      btn.disabled = (!tasks[idx].unlocked || totalPoints < upgCost);
    });
  }

  function addEvents(tasksLen) {
    [...document.querySelectorAll("[data-do='click']")].forEach(btn =>
      btn.onclick = () => eventHandlers.onClickTask(Number(btn.dataset.idx)));
    [...document.querySelectorAll("[data-do='upg']")].forEach(btn =>
      btn.onclick = () => eventHandlers.onUpgradeTask(Number(btn.dataset.idx)));
    const pbtn = document.getElementById("prestige-btn");
    if (pbtn) pbtn.onclick = () => eventHandlers.onPrestige();
    const rbtn = document.getElementById("reset-btn");
    if (rbtn) rbtn.onclick = () => eventHandlers.onClearSave();
  }

  window.IdleUI = {
    init(opts) {
      eventHandlers = opts;
      panelNav();
    },
    renderAll,
    renderProgress,
    renderUpgradeAffordances
  };
})();
