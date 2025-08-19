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
    ["firma", "ustawienia", "achievementy", "automaty"].forEach(id => {
      let el = document.getElementById("panel-" + id.replace("panel-", ""));
      if (el) el.style.display = "none";
    });
  }

  function taskTile(task, idx, totalPoints) {
    const upgCost = Math.floor(20 * Math.pow(2.25, task.level));
    const canUpgrade = totalPoints >= upgCost;
    const gainClick = Math.round(task.baseGain * Math.pow(task.gainGrowth, task.level));
    const gainIdle = gainClick; // tu możesz dodać oddzielne bonusy dla idle wg logiki main.js

    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-taskidx="${idx}" tabindex="0">
        <div class="kafelek-info">
          <div class="title">${task.name}</div>
          <div class="kafelek-row">Poziom: <b>${task.level}</b></div>
          <div class="kafelek-row">Punkty pracy: <b>${fmt(task.points)}</b></div>
          <div class="kafelek-row">Za klik: <b>${gainClick}</b></div>
          <div class="kafelek-row">Za pasek idle: <b>${gainIdle}</b></div>
          <div class="kafelek-progbar">
            <div class="kafelek-progbar-inner" style="width:${Math.round((task.progress||0)*100)}%"></div>
          </div>
        </div>
        <button class="kafelek-ulepsz-btn" data-do="upg" data-idx="${idx}" ${!task.unlocked || !canUpgrade ? "disabled" : ""}>
          Ulepsz<br>(${fmt(upgCost)})
        </button>
      </div>`;
  }

  function renderAll(tasks, totalPoints, softSkills, burnout = 0, achievements = [], automaty = []) {
    e("#panel-kariera").innerHTML = `
      <h2>Twoja kariera w korpo</h2>
      <div class="career-list">${tasks.map((task, idx) => taskTile(task, idx, totalPoints)).join('')}</div>
      <div class="softskill-info">
        <span>🧠 Soft Skills: <b>${softSkills}</b></span>
        ${burnout ? ` | 😵‍💫 Burnout Level: <b style="color:#a22">${burnout}</b>` : ''}
      </div>
      <div style="color:#e79522;margin-top:10px;font-size:1.02em"><b>Tip:</b> Klikaj na KAFELKI żeby pracować! Użyj przycisku Ulepsz aby rozwinąć zadanie.</div>
    `;
    addEvents(tasks.length);
  }

  function renderProgress(idx, progress) {
    const bar = document.querySelector(`.kafelek[data-taskidx="${idx}"] .kafelek-progbar-inner`);
    if (bar) bar.style.width = Math.round(progress * 100) + "%";
  }

  function renderUpgradeAffordances(tasks, totalPoints) {
    document.querySelectorAll('.kafelek-akcje [data-do="upg"], .kafelek-ulepsz-btn').forEach((btn, idx) => {
      const upgCost = Math.floor(20 * Math.pow(2.25, tasks[idx].level));
      btn.disabled = (!tasks[idx].unlocked || totalPoints < upgCost);
    });
  }

  function addEvents(tasksLen) {
    // KAFEL – klik = zarabiaj punkty
    document.querySelectorAll(".kafelek").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.classList.contains("kafelek-ulepsz-btn")) return; // Jeśli klik na "Ulepsz", nie bij punktu podwójnie
        if (el.classList.contains("locked")) return;
        const idx = Number(el.dataset.taskidx);
        eventHandlers.onClickTask(idx);
      };
      // Enter/Space na kafelku też klik
      el.onkeydown = (e) => {
        if ((e.key === "Enter" || e.key === " ") && !el.classList.contains("locked")) {
          e.preventDefault();
          eventHandlers.onClickTask(Number(el.dataset.taskidx));
        }
      }
    });
    // ulepszanie ("Ulepsz" = +lvl)
    document.querySelectorAll('[data-do="upg"]').forEach(btn =>
      btn.onclick = (e) => {
        e.stopPropagation();
        eventHandlers.onUpgradeTask(Number(btn.dataset.idx));
      }
    );
    // pozostałe: prestige, reset, automaty – jak wcześniej
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
    // ...reszta metod wrzucaj modułowo (statystyki, automaty, achievementy itd.)
  };
})();
