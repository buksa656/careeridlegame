(() => {
  'use strict';
  let eventHandlers = {};

  function e(q) { return document.querySelector(q); }
  function fmt(n) {
    return typeof n === "number" && n >= 1000 ? n.toLocaleString("pl") : Math.round(n);
  }

  // ----
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

  // ------------- NAV + NIGHT ---------------
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
    ["firma", "ustawienia", "skills", "panel-achievementy", "panel-misje", "panel-automaty", "panel-statystyki"].forEach(id => {
      let el = document.getElementById("panel-" + id.replace("panel-", ""));
      if(el) el.style.display = "none";
    });
    // tryb nocny
    const nt = e("#night-toggle");
    if(nt) nt.oninput = () => {
      document.body.classList.toggle("night", nt.checked);
      localStorage.setItem("korpo_night", nt.checked ? "1":"");
    };
    // inicjuj noc
    if(localStorage.getItem("korpo_night")==="1") {
      document.body.classList.add("night");
      if(nt) nt.checked = true;
    }
  }

  // ------------- TASKS/PANELS -------------
  function taskTile(task, idx, totalPoints) {
    const upgCost = Math.floor(20 * Math.pow(2.25, task.level));
    const canUpgrade = totalPoints >= upgCost;
    return `
      <div class="kafelek${task.unlocked ? '' : ' locked'}" data-taskidx="${idx}">
        <div class="kafelek-info">
          <div class="title">${task.name}${task.level > 5 ? '🍕' : ''}${task.level > 15 ? '🔥' : ''}</div>
          <div class="kafelek-row">Zarobek: <b>${fmt(task.baseGain * Math.pow(task.gainGrowth, task.level))}</b> | lvl: <b>${task.level}</b></div>
          <div class="kafelek-row">Punkty: <b>${fmt(task.points)}</b></div>
          ${!task.unlocked && task.unlockCost ? `<div class="kafelek-row">Odblokuj za <b>${fmt(task.unlockCost)}</b></div>` : ''}
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

  function renderAll(tasks, totalPoints, softSkills, burnout = 0, achievements = [], automaty = [], skills = {}, crowns = 0, stats = {}, nickname = "") {
    e("#top-total-points").textContent = fmt(totalPoints);
    e("#top-soft-skills").textContent = fmt(softSkills);
    e("#top-crowns").textContent = fmt(crowns || 0);
    e("#top-nick").textContent = nickname ? ("👤 " + nickname) : "";

    e("#panel-kariera").innerHTML = `
      <h2>Twoja kariera w korpo</h2>
      <div class="career-list">${tasks.map((task, idx) => taskTile(task, idx, totalPoints)).join('')}</div>
      <div class="softskill-info">
        <span>🧠 Soft Skills: <b>${softSkills}</b></span>
        ${burnout ? ` | 😵‍💫 Burnout Level: <b style="color:#a22">${burnout}</b>` : ''}
        ${crowns? ` | 👑 Korony: <b>${crowns}</b>` : ''}
      </div>
      <div class="nick-wrap">
        <label for="nick-input">Twoja ksywa: </label>
        <input id="nick-input" maxlength="16" 
          style="font-size:1.08em;padding:3px 8px;" value="${nickname || ""}">
        <button id="nick-btn">OK</button>
      </div>
      <div style="color:#e79522;margin-top:10px;font-size:1.02em"><b>Tip:</b> Klikaj na zadania i rozwijaj biuro, odblokuj wszystkie poziomy!</div>
    `;

    renderSkillTreePanel(skills, softSkills);
    renderAchievements(achievements);
    renderMissions();
    renderAutomaty(automaty, tasks);
    renderStatsPanel(stats, tasks);

    addEvents(tasks.length);
    setTimeout(()=>{
      if(e("#nick-btn")) e("#nick-btn").onclick = ()=>{
        if(e("#nick-input")) localStorage.setItem("korpo_nick", e("#nick-input").value.trim());
        renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty, skills, crowns, stats, e("#nick-input").value.trim());
      };
    },40);
  }

  // ----- SKILL TREE -----
  function renderSkillTreePanel(skillsObj, softSkills) {
    const SKILL_TREE = [
      { id:"faster_idle", name:"Szybszy progres", reqSS:1, desc:"Idle bary +15% szybciej", max:1 },
      { id:"cheaper_upgrades", name:"Tanie ulepszenia", reqSS:2, desc:"Ulepszenia kosztują -25%", max:1 },
      { id:"double_click", name:"Podwójny klik", reqSS:3, desc:"Klikaj za podwójne punkty!", max:1 },
    ];
    e("#panel-skills").innerHTML = `
      <h2>Rozwój Umiejętności (Skill tree)</h2>
      <div class="career-list">
        ${SKILL_TREE.map(s=>`
          <div class="kafelek${skillsObj && skillsObj[s.id]?" completed":""}">
            <div class="kafelek-info"><b>${s.name}</b><br>${s.desc}
            <br>Wymaga Soft Skills: <b>${s.reqSS}</b></div>
            <div class="kafelek-akcje">
              <button onclick="window.unlockSkill && window.unlockSkill('${s.id}')" ${skillsObj&&skillsObj[s.id]||softSkills<s.reqSS?'disabled':''}>Odblokuj</button>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  // ----- ACHIEVEMENTS -----
  function renderAchievements(achievements = []) {
    const ACHIEVEMENTS = [
      { emoji:'☕', name: "Caffeinated Intern", desc: "Zrób 150 kliknięć w 'Robienie kawy Szefowi'" },
      { emoji: '💾', name: "Master Copypasta", desc: "Zgarnij 2 000 biuro-punktów ogółem" },
      { emoji: '☕', name: "Ekspresowy korposzczur", desc: "700 pkt. kawy – nagroda: Ekspres do Kawy" },
      { emoji: '📊', name: "Excelowa magia", desc: "2000 pkt. do Excela – nagroda: ExcelBot" },
      { emoji: '🤖', name: "Meeting Terminator", desc: "3000 pkt. na Zebraniu – nagroda: Notatnik AI" },
      { emoji: '🧠', name: "Szef od HR", desc: "Zdobądź 2 Soft Skills" }
    ];
    e("#panel-achievementy").innerHTML = `
      <h2>Osiągnięcia</h2>
      <div class="ach-list">
      ${ACHIEVEMENTS.map((ach, i) =>
        `<div class="ach-item${achievements && achievements.includes(i) ? ' completed' : ''}">
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

  // ----- AUTOMATY -----
  function renderAutomaty(automaty=[], tasks=[]) {
    e("#panel-automaty").innerHTML = `
      <h2>Automaty – odblokuj przez wyzwania!</h2>
      <div class="auto-tabs">
      ${(automaty||[]).map(auto => `
        <div class="auto-box${auto.unlocked ? ' active' : ''}">
          <div class="auto-header">${auto.emoji} <b>${auto.name}</b></div>
          <div>${auto.desc}</div>
          <div style="font-size:0.96em;color:#9a9;">Obsługiwany task: <b>${tasks[auto.taskIdx] ? tasks[auto.taskIdx].name : ""}</b></div>
          <span style="color:#999">${auto.unlocked ? "Aktywny!" : "Zablokowany"}</span>
        </div>
      `).join('')}
      </div>
    `;
  }

  // ----- MISJE -----
  function renderMissions() {
    const today = Math.floor(Date.now() / 86400000);
    const dailyMissions = [
      {desc:"Zrób 30 klików kawy!", id:0, task:0, goal:30, reward:"+233 pkt", type:'points', val:233},
      {desc:"Wbij lvl 3 w Excelu", id:1, task:3, goal:3, reward:"+1 Soft Skill", type:'softskill',val:1},
      {desc:"Odpędź burnout (prestige)", id:2, task:-1, goal:1, reward:"Korona", type:'crown',val:1}
    ];
    let idx = today % dailyMissions.length;
    let m = dailyMissions[idx];
    e("#panel-misje").innerHTML = `
      <h2>Misja dnia</h2>
      <div class="ach-list">
        <div class="ach-item">
          <span class="emoji">⭐</span>
          <div>
            <span class="ach-name">${m.desc}</span>
            <div class="ach-desc">Nagroda: ${m.reward}</div>
          </div>
        </div>
      </div>
      <div style="font-size:.97em; color:#666; margin-top:10px">Kolejna misja: o północy</div>
    `;
  }

  // ----- STATS/WYKRES -----
  function renderStatsPanel(stats = {}, tasks = []) {
    const clicks = stats.totalClicks || 0;
    const activeTime = stats.activeTime || 0;
    const maxPointsHour = stats.maxPointsPerHour || 0;
    const pointsHistory = stats.pointsHistory || [];

    // Prosty wykres SVG
    let svgPoints = "";
    if(pointsHistory.length > 1){
      let maxP = Math.max(...pointsHistory);
      svgPoints = pointsHistory.map(
        (pt,i)=> `${10+i*45},${110-(pt/maxP)*90}`
      ).join(" ");
    }
    e("#panel-statystyki").innerHTML = `
      <h2>Statystyki</h2>
      <table class="leaderboard">
        <tr><th>Ksywa</th><th>Punkty</th><th>Burnout</th></tr>
        ${leaderboardRows()}
      </table>
      <div style="margin:14px 0;font-size:1.05em">
        Twoje kliknięcia: <b>${fmt(clicks)}</b> |
        Najlepszy task: <b>${
            tasks.reduce((a,b)=>a.baseGain > b.baseGain?a:b).name}</b>
      </div>
      <svg height="130">
        ${svgPoints?`<polyline fill="none" stroke="#4389db" stroke-width="4" points="${svgPoints}"/>`:''}
        <line x1="10" x2="460" y1="110" y2="110" stroke="#ddd"/>
      </svg>
    `;
  }

  function leaderboardRows() {
    let arr = JSON.parse(localStorage.getItem("korpo_leaderboard") || "[]");
    return arr.slice(0,7).map(x =>
      `<tr><td>${x.nick}</td><td>${fmt(x.points)}</td><td>${fmt(x.burnout||0)}</td></tr>`
    ).join('');
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

  // -------- MODAL REWARDY -----------
  function showRewardModal(emoji, name, desc, rewardDesc, onCollect) {
    const modal = e("#reward-modal");
    modal.innerHTML = `
      <div class="emoji">${emoji}</div>
      <div style="font-size:1.12em"><b>${name}</b></div>
      <div style="margin:10px 0 11px 0">${desc}</div>
      <div style="padding:10px 0 10px 0;color:#246">${rewardDesc}</div>
      <button id="collect-reward-btn">Odbierz nagrodę!</button>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    e("#collect-reward-btn").onclick = () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
      if (onCollect) onCollect();
    };
  }
  function hideRewardModal() {
    const modal = e("#reward-modal");
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  // -------- RANDOM EVENT ----------
  function showRandomEvent(msg, onClick) {
    const el = e("#random-event");
    el.style.display = "block";
    el.innerHTML = `<div style="background:#fffae8;padding:18px 22px;border-radius:13px;border:2px solid #f4a523;font-size:1.17em;text-align:center">
      <b>${msg}</b><br>
      <button id="rand-event-ok">OK!</button>
    </div>`;
    e("#rand-event-ok").onclick = onClick;
  }
  function hideRandomEvent() { e("#random-event").style.display = "none"; }

  window.IdleUI = {
    init(opts) {
      eventHandlers = opts;
      panelNav();
    },
    renderAll,
    renderProgress,
    renderUpgradeAffordances,
    renderSkillTree: renderSkillTreePanel,
    showRewardModal,
    hideRewardModal,
    showRandomEvent,
    hideRandomEvent
  };

  // Global potrzebny dla skill unlock
  window.unlockSkill = function(id) {
    if(window.unlockSkillCb) window.unlockSkillCb(id);
  };
})();
