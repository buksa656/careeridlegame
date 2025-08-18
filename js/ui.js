(() => {
  'use strict';
  const el = (q) => document.querySelector(q);

  function fmt(n) { return Math.round(n); }

  function makeTaskTile(task, idx, canUnlock, onClickTask, onUpgradeTask) {
    const wrap = document.createElement('div');
    wrap.className = 'kafelek' + (task.unlocked ? '' : ' locked');
    const info = document.createElement('div');
    info.className = 'kafelek-info';
    info.innerHTML = `
      <div class="title">${task.name}</div>
      <div class="kafelek-row">Zarobek: <b>${fmt(task.baseGain * Math.pow(task.gainGrowth, task.lvl))}</b></div>
      <div class="kafelek-row">Poziom: <b>${task.lvl}</b></div>
      <div class="kafelek-progbar"><div class="kafelek-progbar-inner" style="width:${Math.min(100, (task.points / (task.unlockCost || 1)) * 100)}%"></div></div>
      <div class="kafelek-row">Punkty: <b>${fmt(task.points)}</b></div>
      <div class="kafelek-row">${task.unlocked || !task.unlockCost ? "" : `Odblokuj za <b>${fmt(task.unlockCost)}</b> pkt`}</div>
    `;
    wrap.appendChild(info);
    const akcje = document.createElement('div');
    akcje.className = 'kafelek-akcje';
    const taskBtn = document.createElement('button');
    taskBtn.textContent = task.unlocked ? 'Wykonaj' : 'Zablokowane';
    taskBtn.disabled = !task.unlocked;
    taskBtn.onclick = () => onClickTask(idx);
    akcje.appendChild(taskBtn);
    const upgBtn = document.createElement('button');
    upgBtn.textContent = `Ulepsz`;
    upgBtn.disabled = !task.unlocked;
    upgBtn.onclick = () => onUpgradeTask(idx);
    akcje.appendChild(upgBtn);
    wrap.appendChild(akcje);
    return wrap;
  }

  window.QRI_UI = {
    mount: function (opts) {
      // Obsługa zakładek
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
      // Reset
      document.getElementById("reset-btn").onclick = opts.onClearSave;
    },
    updateTasks: function(tasks, careerName, canPrestige) {
      const panel = el("#panel-kariera");
      panel.innerHTML = `<h2>${careerName}</h2>`;
      const list = document.createElement("div");
      list.className = "career-list";
      tasks.forEach((task, idx) => {
        list.appendChild(makeTaskTile(task, idx, canPrestige, opts.onClickTask, opts.onUpgradeTask));
      });
      panel.appendChild(list);
    },
    updateSoftSkills: function(softSkills, currCareerNum, careersTotal) {
      // widok na panelu kariera
      const panel = el("#panel-kariera");
      let skills = panel.querySelector(".softskill-info");
      if (!skills) {
        skills = document.createElement("div");
        skills.className = "softskill-info";
        panel.appendChild(skills);
      }
      skills.innerHTML = `Soft Skills: <b>${softSkills}</b> &nbsp;&nbsp; Etap kariery: <b>${currCareerNum} / ${careersTotal}</b>`;
    },
    updatePrestigeBox: function(softSkills, prestigeReady, onPrestige) {
      const box = document.getElementById("prestige-box");
      if (!box) return;
      box.innerHTML = `
        <h3>Zmiana firmy (Prestige)</h3>
        <p>Soft Skills: <b>${softSkills}</b></p>
        <button id="prestige-btn" ${!prestigeReady ? "disabled" : ""}>Zmień firmę! (+1 soft skill)</button>
        <div>
          <h4>Benefity / Boosty</h4>
          <ul>
            <li><b>Networking</b>: +10% do przychodów z każdej pozycji / soft skill</li>
            <li><b>Mocniejsza kawa</b>: +6% wydajności pracy / soft skill</li>
            <li><b>Umiejętność ściemniania</b>: +2% zysku przy awansach / soft skill</li>
          </ul>
        </div>
      `;
      box.querySelector("#prestige-btn").onclick = () => onPrestige();
    }
  };
})();
