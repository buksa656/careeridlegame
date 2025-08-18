(() => {
  'use strict';
  // --- TASKI I KONFIG ---
  const TASKS = [
    {name:"Robienie kawy Szefowi",unlocked:true,level:0,baseGain:1,gainGrowth:1.14,points:0,cycleTime:1600,progress:0,active:false,unlockCost:0,autoCapable:true},
    {name:"Ctrl+C, Ctrl+V - Copypasta",unlocked:false,level:0,baseGain:9,gainGrowth:1.13,points:0,cycleTime:2500,progress:0,active:false,unlockCost:48,autoCapable:false},
    {name:"Odpisanie na maila z RE: FW:",unlocked:false,level:0,baseGain:20,gainGrowth:1.17,points:0,cycleTime:4000,progress:0,active:false,unlockCost:180,autoCapable:false},
    {name:"Wklejka do Excela",unlocked:false,level:0,baseGain:44,gainGrowth:1.156,points:0,cycleTime:5700,progress:0,active:false,unlockCost:570,autoCapable:true},
    {name:"Prezentacja na Teamsy",unlocked:false,level:0,baseGain:113,gainGrowth:1.13,points:0,cycleTime:8000,progress:0,active:false,unlockCost:1450,autoCapable:false},
    {name:"Zebranie – udawanie słuchania",unlocked:false,level:0,baseGain:330,gainGrowth:1.09,points:0,cycleTime:12000,progress:0,active:false,unlockCost:3550,autoCapable:true},
    {name:"Standup: co zrobisz dziś?",unlocked:false,level:0,baseGain:600,gainGrowth:1.12,points:0,cycleTime:17000,progress:0,active:false,unlockCost:8600,autoCapable:false},
    {name:"Delegowanie spraw lemingowi",unlocked:false,level:0,baseGain:1600,gainGrowth:1.15,points:0,cycleTime:23000,progress:0,active:false,unlockCost:22000,autoCapable:true},
    {name:"Lunch break: 7/8 dnia 🥪",unlocked:false,level:0,baseGain:3600,gainGrowth:1.17,points:0,cycleTime:31000,progress:0,active:false,unlockCost:64000,autoCapable:false},
    {name:"Król Open Space",unlocked:false,level:0,baseGain:9000,gainGrowth:1.19,points:0,cycleTime:47000,progress:0,active:false,unlockCost:230000,autoCapable:true}
  ];
  const SKILL_TREE = [
    { id:"faster_idle", name:"Szybszy progres", reqSS:1, desc:"Idle bary +15% szybciej", max:1 },
    { id:"cheaper_upgrades", name:"Tanie ulepszenia", reqSS:2, desc:"Ulepszenia kosztują -25%", max:1 },
    { id:"double_click", name:"Podwójny klik", reqSS:3, desc:"Klikaj za podwójne punkty!", max:1 }
  ];
  const AUTOMATY = [
    {name:"Ekspres do Kawy",desc:"Automatycznie nalewa kawę co 1.7s!",emoji:"☕",taskIdx:0,interval:1700,unlocked:false},
    {name:"ExcelBot",desc:"Sam wkleja do Excela co 4s!",emoji:"📊",taskIdx:3,interval:4000,unlocked:false},
    {name:"Notatnik AI",desc:"Automat spisuje zebrania co 9s!",emoji:"🤖",taskIdx:5,interval:9000,unlocked:false}
  ];
  const ACHIEVEMENTS = [
    {emoji:'☕',name:"Caffeinated Intern",desc:"150 kliknięć kawy",check:d=>d.tasks[0].points>=150,reward:{type:"points",value:100},rewardDesc:"+100 pkt"},
    {emoji:'💾',name:"Master Copypasta",desc:"2000 biuro-punktów ogółem",check:d=>d.totalPoints>=2000,reward:{type:"softSkill",value:1},rewardDesc:"+1 Soft Skill"},
    {emoji:'☕',name:"Ekspresowy korposzczur",desc:"700 pkt. kawy – nagroda: Ekspres do Kawy",check:d=>d.tasks.points>=700,reward:{type:"automat",idx:0},rewardDesc:"Automat Ekspres do Kawy"},
    {emoji:'📊',name:"Excelowa magia",desc:"2000 pkt. do Excela – nagroda: ExcelBot",check:d=>d.tasks[1]&&d.tasks[1].points>=2000,reward:{type:"automat",idx:1},rewardDesc:"Automat ExcelBot"},
    {emoji:'🤖',name:"Meeting Terminator",desc:"3000 pkt na zebraniu – Notatnik AI",check:d=>d.tasks&&d.tasks.points>=3000,reward:{type:"automat",idx:2},rewardDesc:"Automat Notatnik AI"},
    {emoji:'🧠',name:"Szef od HR",desc:"2 Soft Skills przez prestige",check:d=>d.softSkills>=2,reward:{type:"points",value:700},rewardDesc:"+700 pkt"}
  ];
  // --- RANDOM EVENTY ---
  const RANDOM_EVENTS = [
    { msg:"System padł! 💻 Wszystko wolniej 20s.", effect:()=>window.tempEventMod=0.65, reset:()=>window.tempEventMod=1, duration:20000 },
    { msg:"Dzień pizzy! 🍕 Kliknij, by mieć 2x punkty na 10s!", effect:()=>window.tempClick=2, reset:()=>window.tempClick=1, duration:10000 }
  ];

  let tasks=[], totalPoints=0, softSkills=0, burnout=0, crowns=0, timers=[], automaty=[], activeAutoTimers=[],
      stats={spentOnUpgrades:0, totalClicks:0, activeTime:0, maxPointsPerHour:0, pointsHistory:[]},
      skills={}, achievements=[], nickname="", eventTimer=null, dailyMissionState={}, leaderboard=[];
  let skillUnlockCb = null;
  // --- ZAPIS/ODCZYT ---
  function saveGame() {
    localStorage.setItem("korposzczur_save", JSON.stringify({
      tasks,totalPoints,softSkills,burnout,crowns,achievements,stats,skills,automaty,nickname,leaderboard
    }));
  }
  function loadGame() {
    const save = localStorage.getItem("korposzczur_save");
    if(save) {
      try {
        const s = JSON.parse(save);
        if(Array.isArray(s.tasks)) tasks=s.tasks;
        if(typeof s.totalPoints==="number") totalPoints = s.totalPoints;
        if(typeof s.softSkills==="number") softSkills = s.softSkills;
        if(typeof s.burnout==="number") burnout = s.burnout;
        if(typeof s.crowns==="number") crowns = s.crowns;
        if(Array.isArray(s.achievements)) achievements = s.achievements;
        if(Array.isArray(s.automaty)) automaty = s.automaty;
        if(typeof s.stats==="object") stats=s.stats;
        if(typeof s.skills==="object") skills=s.skills;
        if(typeof s.nickname==="string") nickname=s.nickname;
        if(Array.isArray(s.leaderboard)) leaderboard = s.leaderboard;
      } catch(e){}
    } else {
      tasks = JSON.parse(JSON.stringify(TASKS));
      automaty = AUTOMATY.map(a=>({...a}));
      skills = {};
      achievements = [];
      leaderboard = [];
      stats = {spentOnUpgrades:0, totalClicks:0, activeTime:0,maxPointsPerHour:0, pointsHistory:[]};
      nickname = localStorage.getItem('korpo_nick')||"";
    }
  }
  // --- FUNKCJE GRY ---
  function getUpgradeCost(task) {
    let base = Math.floor(20 * Math.pow(2.25, task.level));
    if(skills.cheaper_upgrades) base = Math.floor(base*0.75);
    return base;
  }
  function tryUnlockTask(idx) {
    if(idx<tasks.length && !tasks[idx].unlocked && totalPoints>=tasks[idx].unlockCost)
      tasks[idx].unlocked=true;
  }
  function startIdle(idx) {
    if(tasks[idx].active) return;
    tasks[idx].active=true;
    tasks[idx].progress=0;
    let prev=Date.now();
    timers[idx]=setInterval(()=>{
      let sMod = skills.faster_idle ? 0.85 : 1;
      let treeMod = Math.pow(0.89, tasks[idx].level) * Math.pow(0.90, softSkills) * sMod * (window.tempEventMod||1);
      const now=Date.now();
      tasks[idx].progress += (now-prev)/(tasks[idx].cycleTime*treeMod);
      prev=now;
      if(tasks[idx].progress>=1){
        tasks[idx].progress=0;
        const gain = tasks[idx].baseGain*Math.pow(tasks[idx].gainGrowth,tasks[idx].level);
        tasks[idx].points += gain;
        totalPoints += gain;
        tryUnlockTask(idx+1);
        checkAchievements();
        saveGame();
        ui.renderAll(tasks,totalPoints,softSkills,burnout,achievements, automaty, skills, crowns, stats, nickname);
      }
      ui.renderProgress(idx,tasks[idx].progress);
    }, 1000/30);
  }
  function clickTask(idx) {
    let task=tasks[idx], factor = skills.double_click?2:1; factor *= (window.tempClick||1);
    if(task.unlocked){
      const gain = factor * task.baseGain * Math.pow(task.gainGrowth,task.level);
      task.points+=gain; totalPoints+=gain;
      tryUnlockTask(idx+1);
      stats.totalClicks = (stats.totalClicks||0)+1;
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty, skills, crowns, stats, nickname);
    }
    if(!task.active) startIdle(idx);
  }
  function upgradeTask(idx) {
    const cost=getUpgradeCost(tasks[idx]);
    if(totalPoints>=cost) {
      tasks[idx].level += 1;
      totalPoints -= cost;
      stats.spentOnUpgrades = (stats.spentOnUpgrades||0) + cost;
      checkAchievements();
      saveGame();
      ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty, skills, crowns, stats, nickname);
      ui.renderUpgradeAffordances(tasks, totalPoints);
    }
  }
  // --- PRESTIGE/MULTIPRESTIŻ ---
  function prestige() {
    timers.forEach(clearInterval);
    clearAutomaty();
    if(totalPoints<10000) return;
    softSkills++; burnout++; let addCrown=0;
    if((burnout)%5===0){ crowns++; addCrown=1;}
    totalPoints=0;
    tasks=JSON.parse(JSON.stringify(TASKS));
    automaty=AUTOMATY.map(a=>({...a}));
    checkAchievements();
    leaderboard = updateLeaderboard();
    saveGame();
    ui.renderAll(tasks,totalPoints,softSkills,burnout,achievements,automaty,skills,crowns,stats,nickname);
    ui.renderUpgradeAffordances(tasks,totalPoints);
    if(addCrown) setTimeout(()=>alert("Zdobywasz nową KORONĘ! 👑"),200);
  }
  // --- AUTOMATY ---
  function clearAutomaty() { activeAutoTimers.forEach(clearInterval); activeAutoTimers=[]; }
  function updateAutomaty() {
    clearAutomaty();
    automaty.forEach((auto,i)=>{
      if(auto.unlocked){
        activeAutoTimers[i]=setInterval(()=>{
          let task=tasks[auto.taskIdx];
          if(task&&task.unlocked){
            let gain=Math.max(1,task.baseGain*Math.pow(task.gainGrowth,task.level));
            task.points+=gain; totalPoints+=gain;
            tryUnlockTask(auto.taskIdx+1);
            checkAchievements();
            saveGame();
            ui.renderAll(tasks,totalPoints,softSkills,burnout,achievements,automaty,skills,crowns,stats,nickname);
          }
        },auto.interval);
      }
    });
  }
  // --- ACHIEVEMENTY+NAGRODY ---
  function checkAchievements() {
    let unlocked = achievements?achievements.slice():[];
    let data = {tasks, totalPoints, softSkills, burnout, stats};
    ACHIEVEMENTS.forEach((ach,idx)=>{
      if(!unlocked.includes(idx)&&ach.check(data)){
        unlocked.push(idx);
        setTimeout(()=>showRewardModal(ach,idx),80);
      }
    });
    achievements=unlocked;
    for(let idx of unlocked) {
      const ach=ACHIEVEMENTS[idx];
      if(ach.reward&&ach.reward.type==="automat"&&!automaty[ach.reward.idx].unlocked){
        automaty[ach.reward.idx].unlocked=true;
        updateAutomaty();
      }
    }
  }
  function showRewardModal(ach, idx) {
    if(!ach.reward) return;
    ui.showRewardModal(ach.emoji, ach.name, ach.desc, ach.rewardDesc, ()=>collectReward(ach, idx));
  }
  function collectReward(ach, idx) {
    if(ach.reward.type==="points")  totalPoints+=ach.reward.value;
    else if(ach.reward.type==="softSkill") softSkills+=ach.reward.value;
    else if(ach.reward.type==="automat") { automaty[ach.reward.idx].unlocked=true; updateAutomaty();}
    saveGame();
    ui.hideRewardModal();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty, skills, crowns, stats, nickname);
    ui.renderUpgradeAffordances(tasks, totalPoints);
  }
  // --- SKILL TREE (Global!) ---
  window.unlockSkillCb=function(skillId){ skills[skillId]=true; saveGame(); ui.renderSkillTree(SKILL_TREE,skills,softSkills); };
  // --- RANDOM EVENT ---
  function triggerRandomEvent() {
    if(eventTimer) return;
    let e=RANDOM_EVENTS[Math.floor(Math.random()*RANDOM_EVENTS.length)];
    ui.showRandomEvent(e.msg,()=>{e.effect();setTimeout(()=>{e.reset();ui.hideRandomEvent();eventTimer=null;},e.duration)});
    eventTimer=true;
  }
  // --- MISJE DZIENNE ---
  function getDailyMission() {
    const today = Math.floor(Date.now() / 86400000);
    const d = [
      {desc:"Zrób 30 klików kawy!", id:0, task:0, goal:30, reward:"+233 pkt", type:'points', val:233},
      {desc:"Wbij lvl 3 w Excelu", id:1, task:3, goal:3, reward:"+1 Soft Skill", type:'softskill',val:1},
      {desc:"Odpędź burnout (prestige)", id:2, task:-1, goal:1, reward:"Korona", type:'crown',val:1}
    ];
    let idx = today % d.length;
    return d[idx];
  }
  // --- STATYSTYKI+LEADERBOARD ---
  function updateLeaderboard(){
    let arr=JSON.parse(localStorage.getItem("korpo_leaderboard")||"[]");
    let nick = nickname || (localStorage.getItem('korpo_nick')||"Anon");
    arr.unshift({nick,points:totalPoints,burnout});
    arr.sort((a,b)=>b.points-a.points);
    arr=arr.slice(0,7);
    localStorage.setItem("korpo_leaderboard",JSON.stringify(arr));
    return arr;
  }
  // --- INICJALIZACJA ---
  const ui=window.IdleUI;
  function init() {
    loadGame();
    timers=Array(tasks.length).fill(null);
    automaty=automaty.length?automaty:AUTOMATY.map(a=>({...a}));
    nickname=nickname||localStorage.getItem('korpo_nick')||"";
    skills=skills||{};
    ui.init({
      onClickTask: clickTask,
      onUpgradeTask: upgradeTask,
      onPrestige: prestige,
      onClearSave: clearSave
    });
    checkAchievements();
    ui.renderAll(tasks, totalPoints, softSkills, burnout, achievements, automaty, skills, crowns, stats, nickname);
    ui.renderUpgradeAffordances(tasks, totalPoints);
    updateAutomaty();
    // random event co kilka min
    setInterval(()=>{if(Math.random()<0.014) triggerRandomEvent();},8000);
    // sample stat tracking
    setInterval(()=>{ stats.activeTime=(stats.activeTime||0)+10;
      stats.pointsHistory=stats.pointsHistory||[];
      stats.pointsHistory.push(totalPoints); 
      if(stats.pointsHistory.length>10) stats.pointsHistory.shift();
      saveGame();
    },10000);
  }
  window.addEventListener("load", init);
})();
