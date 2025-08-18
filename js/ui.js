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

  // Obsługa paneli nav
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
  }

  function taskTile(task, idx) {
    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-taskidx="${idx}">
        <div class="kafelek-info">
          <div class="title">${task.name}
            ${task.level > 5 ? '🍕' : ''}
            ${task.level > 15 ? '🔥' : ''}
          </div>
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
          <button ${!task.unlocked ? "disabled" : ""} data-do="upg" data-idx="${idx}">Ulepsz<br>(${fmt(10 * Math.pow(2, task.level))})</button>
        </div>
      </div>`;
  }

  function renderAll(tasks, totalPoints, softSkills, burnout = 0) {
    e("#panel-kariera").innerHTML = `
      <h2>Twoja kariera w korpo</h2>
      <div class="career-list">${tasks.map(taskTile).join('')}</div>
      <div><b>💼 Wszystkie biuro-punkty: ${fmt(totalPoints)}</b></div>
      <div class="softskill-info">
        <span>🧠 Soft Skills: <b>${softSkills}</b></span>
        ${burnout ? ` | 😵‍💫 Burnout Level: <b style="color:#a22">${burnout}</b>` : ''}
      </div>
      <div style="color:#e79522;margin-top:10px;font-size:1.02em"><b>Tip:</b> Kliknij „Wykonaj” i zmień się w Pół-Automata! A potem podrasuj taski, biuro jeszcze nie widziało takich wyników.</div>
    `;

    e("#panel-firma").innerHTML = `
      <h2>Rzuć robotę (PRESTIGE)</h2>
      <p>Poczuj przypływ motywacji – zmieniasz biuro, zachowujesz 🧠 Soft Skills i możesz awansować jeszcze szybciej!</p>
      <div>Soft Skills: <b>${softSkills}</b><br>Burnout Level: <b>${burnout}</b></div>
      <button id="prestige-btn" ${totalPoints < 10000 ? "disabled" : ""}>Rzuć papierami (10&nbsp;000+ pkt)</button>
      <div style="margin-top:14px; font-size:1.06em; color:#495;">Bonus: Każdy Soft Skill daje 10% szybciej pasek progresu!</div>
      <div style="font-size:.98em;color:#8888aa;margin-top:15px">Nowa firma = nowe absurdy. Sprawdź, ile wytrzymasz tym razem!</div>
    `;

    e("#panel-ustawienia").innerHTML = `<button id="reset-btn">Resetuj postęp (🔥 ZACZYNASZ OD ZERA!)</button>`;
    addEvents(tasks.length);
  }

  function renderProgress(idx, progress) {
    const bar = document.querySelector(`.kafelek[data-taskidx="${idx}"] .kafelek-progbar-inner`);
    if (bar) bar.style.width = Math.round(progress * 100) + "%";
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
    renderProgress
  };
})();
