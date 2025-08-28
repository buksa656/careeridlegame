// Korposzczur - Corporate Idle Game
// Fixed version addressing critical gameplay issues

class KorposzczurGame {
    constructor() {
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.translations = this.gameData.translations;
        this.currentLanguage = this.gameState.settings.language;
        this.lastSave = Date.now();
        this.lastUpdate = Date.now();
        this.updateInterval = null;
        this.saveInterval = null;
        this.quoteInterval = null;
        this.uiUpdateInterval = null;
        this.activeTab = 'career';
        this.multiBuyAmount = 1;
        
        this.init();
    }

    initializeGameData() {
        return {
            "tasks": [
                {"id": "email", "nameKey": "task_email", "baseCost": 10, "baseIdle": 1, "unlockCost": 0, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 2000},
                {"id": "coffee", "nameKey": "task_coffee", "baseCost": 25, "baseIdle": 3, "unlockCost": 75, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1800},
                {"id": "meeting", "nameKey": "task_meeting", "baseCost": 150, "baseIdle": 12, "unlockCost": 500, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1500},
                {"id": "kpi", "nameKey": "task_kpi", "baseCost": 1500, "baseIdle": 70, "unlockCost": 3500, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1200},
                {"id": "brainstorm", "nameKey": "task_brainstorm", "baseCost": 15000, "baseIdle": 400, "unlockCost": 35000, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1000},
                {"id": "optimize", "nameKey": "task_optimize", "baseCost": 180000, "baseIdle": 2200, "unlockCost": 350000, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 800}
            ],
            "achievements": [
                {"id": "first_unlock", "nameKey": "ach_first_unlock", "descKey": "ach_first_unlock_desc", "condition": {"type": "tasks_unlocked", "value": 1}, "reward": {"type": "bp_bonus", "value": 1.05}, "bonusDesc": "bonusDesc_bp_5"},
                {"id": "first_upgrade", "nameKey": "ach_first_upgrade", "descKey": "ach_first_upgrade_desc", "condition": {"type": "upgrades_bought", "value": 1}, "reward": {"type": "multibuy_unlock", "value": "upgrades"}, "bonusDesc": "bonusDesc_multibuy_upgrades"},
                {"id": "coffee_lover", "nameKey": "ach_coffee_lover", "descKey": "ach_coffee_lover_desc", "condition": {"type": "task_unlocked", "taskId": "coffee"}, "reward": {"type": "idle_bonus", "value": 1.1}, "bonusDesc": "bonusDesc_idle_10"},
                {"id": "meeting_master", "nameKey": "ach_meeting_master", "descKey": "ach_meeting_master_desc", "condition": {"type": "task_level", "taskId": "meeting", "value": 10}, "reward": {"type": "upgrade_discount", "value": 0.95}, "bonusDesc": "bonusDesc_upgrade_discount_5"},
                {"id": "first_ascend", "nameKey": "ach_first_ascend", "descKey": "ach_first_ascend_desc", "condition": {"type": "ascensions", "value": 1}, "reward": {"type": "multibuy_unlock", "value": "ascend"}, "bonusDesc": "bonusDesc_multibuy_ascend"},
                {"id": "kpi_analyst", "nameKey": "ach_kpi_analyst", "descKey": "ach_kpi_analyst_desc", "condition": {"type": "task_unlocked", "taskId": "kpi"}, "reward": {"type": "prestige_bonus", "value": 1.15}, "bonusDesc": "bonusDesc_prestige_15"},
                {"id": "big_spender", "nameKey": "ach_big_spender", "descKey": "ach_big_spender_desc", "condition": {"type": "bp_spent", "value": 10000}, "reward": {"type": "bp_bonus", "value": 1.1}, "bonusDesc": "bonusDesc_bp_10"},
                {"id": "innovation_guru", "nameKey": "ach_innovation_guru", "descKey": "ach_innovation_guru_desc", "condition": {"type": "task_unlocked", "taskId": "brainstorm"}, "reward": {"type": "ascend_bonus", "value": 1.2}, "bonusDesc": "bonusDesc_ascend_20"},
                {"id": "first_prestige", "nameKey": "ach_first_prestige", "descKey": "ach_first_prestige_desc", "condition": {"type": "prestiges", "value": 1}, "reward": {"type": "soft_skill_bonus", "value": 1.25}, "bonusDesc": "bonusDesc_soft_skill_25"},
                {"id": "optimizer", "nameKey": "ach_optimizer", "descKey": "ach_optimizer_desc", "condition": {"type": "task_unlocked", "taskId": "optimize"}, "reward": {"type": "global_mult", "value": 1.3}, "bonusDesc": "bonusDesc_global_30"},
                {"id": "multibuy_expert", "nameKey": "ach_multibuy_expert", "descKey": "ach_multibuy_expert_desc", "condition": {"type": "multibuy_used", "value": 10}, "reward": {"type": "max_buy_unlock", "value": 1}, "bonusDesc": "bonusDesc_max_buy"},
                {"id": "corporate_ladder", "nameKey": "ach_corporate_ladder", "descKey": "ach_corporate_ladder_desc", "condition": {"type": "total_ascensions", "value": 5}, "reward": {"type": "ascend_discount", "value": 0.9}, "bonusDesc": "bonusDesc_ascend_discount_10"},
                {"id": "idle_master", "nameKey": "ach_idle_master", "descKey": "ach_idle_master_desc", "condition": {"type": "idle_rate", "value": 1000}, "reward": {"type": "idle_bonus", "value": 1.2}, "bonusDesc": "bonusDesc_idle_20"},
                {"id": "dedication", "nameKey": "ach_dedication", "descKey": "ach_dedication_desc", "condition": {"type": "play_time", "value": 3600000}, "reward": {"type": "global_mult", "value": 1.15}, "bonusDesc": "bonusDesc_global_15"}
            ],
            "deskItems": [
                {"id": "mug", "nameKey": "desk_mug", "cost": 1, "bonus": {"type": "global_mult", "value": 1.1}},
                {"id": "monitor", "nameKey": "desk_monitor", "cost": 5, "bonus": {"type": "idle_mult", "value": 1.2}},
                {"id": "plant", "nameKey": "desk_plant", "cost": 10, "bonus": {"type": "upgrade_discount", "value": 0.95}},
                {"id": "mousepad", "nameKey": "desk_mousepad", "cost": 25, "bonus": {"type": "prestige_mult", "value": 1.15}},
                {"id": "laptop", "nameKey": "desk_laptop", "cost": 50, "bonus": {"type": "ascend_bonus", "value": 1.1}},
                {"id": "autobuyer", "nameKey": "desk_autobuyer", "cost": 100, "bonus": {"type": "auto_buyer", "value": 1}}
            ],
            "multiBuyOptions": [1, 2, 5, 10, 20, 50, "max"],
            "prestigeThreshold": 50000,
            "translations": {
                "pl": {
                    "game_title": "Korposzczur",
                    "tab_career": "Kariera",
                    "tab_desk": "Biurko",
                    "tab_achievements": "Achievementy",
                    "help": "Pomoc",
                    "biuro_punkty": "Biuro-Punkty",
                    "soft_skills": "Soft Skills",
                    "settings": "Ustawienia",
                    "prestige": "Prestiż",
                    "prestige_ready": "Prestiż Dostępny!",
                    "upgrade": "Ulepsz",
                    "ascend": "Awansuj",
                    "unlock": "Odblokuj",
                    "buy": "Kup",
                    "level": "Poziom",
                    "rank": "Ranga",
                    "locked": "Zablokowane",
                    "auto_buyer": "Auto-Kupowanie",
                    "multibuy": "Multi-buy",
                    "buy_max": "Kup max",
                    "next_unlock": "Następne Odblokowanie",
                    "prestige_progress": "Progres do Prestiżu",
                    "cost": "Koszt",
                    "per_second": "/s",
                    "task_email": "Pisanie maili",
                    "task_coffee": "Robienie kawki",
                    "task_meeting": "Spotkania Teams",
                    "task_kpi": "Analiza KPI",
                    "task_brainstorm": "Burza mózgów",
                    "task_optimize": "Optymalizacja procesów",
                    "desk_mug": "Kubek z logo",
                    "desk_monitor": "Drugi monitor",
                    "desk_plant": "Kwiatek na biurko",
                    "desk_mousepad": "Ergonomiczna podkładka",
                    "desk_laptop": "Laptop służbowy",
                    "desk_autobuyer": "AI Asystent",
                    "ach_first_unlock": "Pierwszy krok",
                    "ach_first_unlock_desc": "Odblokuj pierwsze zadanie",
                    "ach_first_upgrade": "Pierwsze ulepszenie", 
                    "ach_first_upgrade_desc": "Kup pierwsze ulepszenie zadania",
                    "ach_coffee_lover": "Miłośnik kawy",
                    "ach_coffee_lover_desc": "Odblokuj zadanie kawowe",
                    "ach_meeting_master": "Mistrz spotkań",
                    "ach_meeting_master_desc": "Osiągnij 10 poziom spotkań",
                    "ach_first_ascend": "Pierwszy awans",
                    "ach_first_ascend_desc": "Awansuj pierwsze zadanie",
                    "ach_kpi_analyst": "Analityk KPI",
                    "ach_kpi_analyst_desc": "Odblokuj analizę KPI",
                    "ach_big_spender": "Wielki wydawca",
                    "ach_big_spender_desc": "Wydaj 10,000 BP na ulepszenia",
                    "ach_innovation_guru": "Guru innowacji",
                    "ach_innovation_guru_desc": "Odblokuj burzę mózgów",
                    "ach_first_prestige": "Soft Skills mistrz",
                    "ach_first_prestige_desc": "Wykonaj pierwszy prestiż",
                    "ach_optimizer": "Optymalizator",
                    "ach_optimizer_desc": "Odblokuj optymalizację procesów",
                    "ach_multibuy_expert": "Expert multi-buy",
                    "ach_multibuy_expert_desc": "Użyj multi-buy 10 razy",
                    "ach_corporate_ladder": "Drabina korporacyjna",
                    "ach_corporate_ladder_desc": "Wykonaj 5 awansów",
                    "ach_idle_master": "Mistrz idle",
                    "ach_idle_master_desc": "Osiągnij 1000 BP/s",
                    "ach_dedication": "Oddanie",
                    "ach_dedication_desc": "Graj przez godzinę",
                    "bonusDesc_bp_5": "+5% do generowania BP",
                    "bonusDesc_bp_10": "+10% do generowania BP",
                    "bonusDesc_idle_10": "+10% do idle wszystkich zadań",
                    "bonusDesc_idle_20": "+20% do idle wszystkich zadań",
                    "bonusDesc_global_15": "+15% do wszystkich bonusów",
                    "bonusDesc_global_30": "+30% do wszystkich bonusów",
                    "bonusDesc_upgrade_discount_5": "-5% koszt ulepszeń",
                    "bonusDesc_ascend_20": "+20% bonusu z awansów",
                    "bonusDesc_ascend_discount_10": "-10% koszt awansów", 
                    "bonusDesc_prestige_15": "+15% Soft Skills z prestiżu",
                    "bonusDesc_soft_skill_25": "+25% efektywność Soft Skills",
                    "bonusDesc_multibuy_upgrades": "Odblokowanie multi-buy dla ulepszeń",
                    "bonusDesc_multibuy_ascend": "Odblokowanie multi-buy dla awansów",
                    "bonusDesc_max_buy": "Odblokowanie opcji 'Kup max'",
                    "help_content": "Witaj w Korposzczur!\n\nCel: Rozwijaj karierę korporacyjną wykonując zadania i zdobywając Biuro-Punkty (BP).\n\nMechaniki:\n• Ręcznie odblokuj każde zadanie za BP\n• Ulepszaj zadania za BP aby zwiększyć przychód\n• Awansuj zadania do wyższych rang\n• Użyj Prestiżu aby zresetować grę za Soft Skills\n• Kup przedmioty biurkowe za Soft Skills\n• Zdobywaj achievementy aby odblokować nowe funkcje\n\nWskazówki:\n• Każde zadanie musi być najpierw ręcznie odblokowane\n• Buttony aktualizują się w czasie rzeczywistym\n• Multi-buy i auto-kupowanie odblokują się przez achievementy\n• Prestiż staje się dostępny po zebraniu wystarczającej ilości BP"
                },
                "en": {
                    "game_title": "Corporate Rat",
                    "tab_career": "Career", 
                    "tab_desk": "Desk",
                    "tab_achievements": "Achievements",
                    "help": "Help",
                    "biuro_punkty": "Office Points",
                    "soft_skills": "Soft Skills",
                    "settings": "Settings",
                    "prestige": "Prestige",
                    "prestige_ready": "Prestige Ready!",
                    "upgrade": "Upgrade",
                    "ascend": "Promote",
                    "unlock": "Unlock",
                    "buy": "Buy",
                    "level": "Level",
                    "rank": "Rank",
                    "locked": "Locked",
                    "auto_buyer": "Auto-Buyer",
                    "multibuy": "Multi-buy",
                    "buy_max": "Buy max",
                    "next_unlock": "Next Unlock",
                    "prestige_progress": "Prestige Progress",
                    "cost": "Cost",
                    "per_second": "/s",
                    "task_email": "Writing emails",
                    "task_coffee": "Making coffee",
                    "task_meeting": "Teams meetings",
                    "task_kpi": "KPI analysis", 
                    "task_brainstorm": "Brainstorming",
                    "task_optimize": "Process optimization",
                    "desk_mug": "Company mug",
                    "desk_monitor": "Second monitor",
                    "desk_plant": "Desk plant",
                    "desk_mousepad": "Ergonomic mousepad",
                    "desk_laptop": "Company laptop",
                    "desk_autobuyer": "AI Assistant",
                    "ach_first_unlock": "First step",
                    "ach_first_unlock_desc": "Unlock first task",
                    "ach_first_upgrade": "First upgrade",
                    "ach_first_upgrade_desc": "Buy first task upgrade",
                    "ach_coffee_lover": "Coffee lover",
                    "ach_coffee_lover_desc": "Unlock coffee task",
                    "ach_meeting_master": "Meeting master",
                    "ach_meeting_master_desc": "Reach level 10 in meetings",
                    "ach_first_ascend": "First promotion",
                    "ach_first_ascend_desc": "Ascend first task",
                    "ach_kpi_analyst": "KPI analyst",
                    "ach_kpi_analyst_desc": "Unlock KPI analysis",
                    "ach_big_spender": "Big spender",
                    "ach_big_spender_desc": "Spend 10,000 BP on upgrades",
                    "ach_innovation_guru": "Innovation guru",
                    "ach_innovation_guru_desc": "Unlock brainstorming",
                    "ach_first_prestige": "Soft Skills master",
                    "ach_first_prestige_desc": "Perform first prestige",
                    "ach_optimizer": "Optimizer",
                    "ach_optimizer_desc": "Unlock process optimization",
                    "ach_multibuy_expert": "Multi-buy expert",
                    "ach_multibuy_expert_desc": "Use multi-buy 10 times",
                    "ach_corporate_ladder": "Corporate ladder",
                    "ach_corporate_ladder_desc": "Perform 5 ascensions",
                    "ach_idle_master": "Idle master",
                    "ach_idle_master_desc": "Reach 1000 BP/s",
                    "ach_dedication": "Dedication",
                    "ach_dedication_desc": "Play for one hour",
                    "bonusDesc_bp_5": "+5% BP generation",
                    "bonusDesc_bp_10": "+10% BP generation",
                    "bonusDesc_idle_10": "+10% idle for all tasks",
                    "bonusDesc_idle_20": "+20% idle for all tasks", 
                    "bonusDesc_global_15": "+15% to all bonuses",
                    "bonusDesc_global_30": "+30% to all bonuses",
                    "bonusDesc_upgrade_discount_5": "-5% upgrade costs",
                    "bonusDesc_ascend_20": "+20% ascension bonuses",
                    "bonusDesc_ascend_discount_10": "-10% ascension costs",
                    "bonusDesc_prestige_15": "+15% Soft Skills from prestige",
                    "bonusDesc_soft_skill_25": "+25% Soft Skills effectiveness",
                    "bonusDesc_multibuy_upgrades": "Unlocks multi-buy for upgrades",
                    "bonusDesc_multibuy_ascend": "Unlocks multi-buy for ascensions", 
                    "bonusDesc_max_buy": "Unlocks 'Buy max' option",
                    "help_content": "Welcome to Corporate Rat!\n\nGoal: Develop your corporate career by completing tasks and earning Office Points (BP).\n\nMechanics:\n• Manually unlock each task with BP\n• Upgrade tasks with BP to increase income\n• Ascend tasks to higher ranks\n• Use Prestige to reset game for Soft Skills\n• Buy desk items with Soft Skills\n• Earn achievements to unlock new features\n\nTips:\n• Each task must be manually unlocked first\n• Buttons update in real-time\n• Multi-buy and auto-buyer unlock through achievements\n• Prestige becomes available after collecting enough BP"
                }
            },
            "quotes": {
                "pl": [
                    "Zrobimy szybki catch-up po daily standup-ie",
                    "Musimy to deep-dive'ować na najbliższym sprint planning'u",
                    "Poczekajmy na feedback od stakeholderów",
                    "To jest bardzo low-hanging fruit",
                    "Potrzebujemy więcej synergii w teamie",
                    "Zorganizujemy brainstorming na ten temat",
                    "Trzeba to jeszcze raz przeanalizować",
                    "Prześlij mi ten deck po meetingu",
                    "Wdrożymy to w następnym release'ie",
                    "Potrzebujemy alignment z business'em"
                ],
                "en": [
                    "Let's do a quick catch-up after the daily standup",
                    "We need to deep-dive this in the next sprint planning",
                    "Let's wait for stakeholder feedback",
                    "This is very low-hanging fruit",
                    "We need more synergy in the team",
                    "Let's organize a brainstorming session", 
                    "We need to analyze this once more",
                    "Send me that deck after the meeting",
                    "We'll implement this in the next release",
                    "We need alignment with business"
                ]
            },
            "ranks": ["Junior", "Mid", "Senior", "Lead", "Manager", "Director"]
        };
    }

    loadGameState() {
        const defaultState = {
            bp: 0,
            softSkills: 0,
            totalBPEarned: 0,
            totalBPSpent: 0,
            prestigeCount: 0,
            startTime: Date.now(),
            tasks: {
                // Critical: Initialize first task as LOCKED
                email: { level: 1, progress: 0, locked: true, ascensions: 0 }
            },
            achievements: {},
            deskItems: {},
            settings: {
                language: 'pl',
                theme: 'light',
                reducedMotion: false
            },
            stats: {
                totalUpgrades: 0,
                totalAscensions: 0,
                multiBuyUsed: 0,
                playTime: 0
            },
            unlocks: {
                multiBuyUpgrades: false,
                multiBuyAscend: false,
                maxBuy: false,
                autoBuyer: false
            }
        };

        try {
            const saved = localStorage.getItem('korposzczur-save');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure first task is locked in existing saves
                const mergedState = { ...defaultState, ...parsed };
                if (!mergedState.tasks.email) {
                    mergedState.tasks.email = { level: 1, progress: 0, locked: true, ascensions: 0 };
                }
                return mergedState;
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }

        return defaultState;
    }

    saveGameState() {
        try {
            localStorage.setItem('korposzczur-save', JSON.stringify(this.gameState));
            this.lastSave = Date.now();
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    init() {
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.initializeTabs(); // Critical: Properly initialize tabs
        this.startGameLoop();
        this.startQuoteRotation();
        this.startUIUpdates(); // Critical: Start real-time UI updates

        // Initialize debug commands
        window.debug = {
            addBP: (amount) => {
                this.gameState.bp += amount;
                this.onBPChanged();
            },
            addSS: (amount) => {
                this.gameState.softSkills += amount;
                this.updateDisplay();
            },
            unlockAll: () => {
                this.gameData.tasks.forEach(task => {
                    if (!this.gameState.tasks[task.id]) {
                        this.gameState.tasks[task.id] = { level: 1, progress: 0, locked: true, ascensions: 0 };
                    }
                    this.gameState.tasks[task.id].locked = false;
                });
                this.renderTasks();
            },
            reset: () => {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        };
    }

    // Critical: Fix tab initialization
    initializeTabs() {
        // Set career tab as active by default
        this.switchTab('career');
    }

    // Critical: Real-time UI updates every 100ms
    startUIUpdates() {
        this.uiUpdateInterval = setInterval(() => {
            this.updateButtonStates();
            this.updateTaskProgress();
        }, 100);
    }

    // Critical: Event-driven BP change handler
    onBPChanged() {
        this.updateDisplay();
        this.updateButtonStates();
        this.updateUnlockProgress();
    }

    // Critical: Update all button states based on current BP
    updateButtonStates() {
        // Update upgrade buttons
        document.querySelectorAll('[data-action="upgrade"]').forEach(btn => {
            const taskId = btn.dataset.taskId;
            const cost = this.calculateUpgradeCost(taskId);
            const canAfford = this.gameState.bp >= cost;
            
            btn.disabled = !canAfford;
            btn.classList.toggle('disabled', !canAfford);
            
            if (canAfford) {
                btn.classList.remove('btn--secondary');
                btn.classList.add('btn--primary');
            } else {
                btn.classList.remove('btn--primary');
                btn.classList.add('btn--secondary');
            }
        });

        // Update unlock buttons
        document.querySelectorAll('[data-action="unlock"]').forEach(btn => {
            const taskId = btn.dataset.taskId;
            const task = this.gameData.tasks.find(t => t.id === taskId);
            const canAfford = this.gameState.bp >= task.unlockCost;
            
            btn.disabled = !canAfford;
            btn.classList.toggle('disabled', !canAfford);
            
            if (canAfford) {
                btn.classList.remove('btn--secondary');
                btn.classList.add('btn--primary');
            } else {
                btn.classList.remove('btn--primary');
                btn.classList.add('btn--secondary');
            }
        });

        // Update ascend buttons
        document.querySelectorAll('[data-action="ascend"]').forEach(btn => {
            const taskId = btn.dataset.taskId;
            const taskState = this.gameState.tasks[taskId];
            const canAscend = taskState && taskState.level >= 10;
            
            btn.disabled = !canAscend;
            btn.classList.toggle('disabled', !canAscend);
        });

        // Update prestige button
        const prestigeBtn = document.getElementById('prestige-btn');
        const canPrestige = this.gameState.totalBPEarned >= this.gameData.prestigeThreshold;
        if (prestigeBtn) {
            prestigeBtn.disabled = !canPrestige;
            prestigeBtn.classList.toggle('disabled', !canPrestige);
        }

        // Update desk shop buttons
        document.querySelectorAll('[data-action="buy-desk"]').forEach(btn => {
            const itemId = btn.dataset.itemId;
            const item = this.gameData.deskItems.find(d => d.id === itemId);
            const owned = this.gameState.deskItems[itemId];
            const canAfford = !owned && this.gameState.softSkills >= item.cost;
            
            btn.disabled = !canAfford;
            btn.classList.toggle('disabled', !canAfford);
            
            if (owned) {
                btn.textContent = '✓';
            } else if (canAfford) {
                btn.classList.remove('btn--secondary');
                btn.classList.add('btn--primary');
            } else {
                btn.classList.remove('btn--primary');
                btn.classList.add('btn--secondary');
            }
        });
    }

    setupEventListeners() {
        // Tab system - Critical: Fix event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                e.preventDefault();
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchTab(tab);
                }
            }
            
            // Task action delegation
            if (e.target.dataset.action) {
                const action = e.target.dataset.action;
                const taskId = e.target.dataset.taskId;
                const itemId = e.target.dataset.itemId;

                switch (action) {
                    case 'upgrade':
                        this.upgradeTask(taskId);
                        break;
                    case 'ascend':
                        this.ascendTask(taskId);
                        break;
                    case 'unlock':
                        this.unlockTask(taskId);
                        break;
                    case 'buy-desk':
                        this.buyDeskItem(itemId);
                        break;
                }
            }
        });

        // Multi-buy selector
        const multiBuySelect = document.getElementById('multibuy-select');
        if (multiBuySelect) {
            multiBuySelect.addEventListener('change', (e) => {
                this.multiBuyAmount = e.target.value;
            });
        }

        // Settings modal
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');
        const modalBackdrop = settingsModal?.querySelector('.modal-backdrop');

        if (settingsToggle && settingsModal) {
            settingsToggle.addEventListener('click', () => {
                settingsModal.classList.remove('hidden');
            });

            const closeModal = () => {
                settingsModal.classList.add('hidden');
            };

            settingsClose?.addEventListener('click', closeModal);
            modalBackdrop?.addEventListener('click', closeModal);
        }

        // Help modal
        const helpToggle = document.getElementById('help-toggle');
        const helpModal = document.getElementById('help-modal');
        const helpClose = document.getElementById('help-close');
        const helpBackdrop = helpModal?.querySelector('.modal-backdrop');

        if (helpToggle && helpModal) {
            helpToggle.addEventListener('click', () => {
                const helpContent = document.getElementById('help-content');
                helpContent.textContent = this.translations[this.currentLanguage].help_content;
                helpModal.classList.remove('hidden');
            });

            const closeHelpModal = () => {
                helpModal.classList.add('hidden');
            };

            helpClose?.addEventListener('click', closeHelpModal);
            helpBackdrop?.addEventListener('click', closeHelpModal);
        }

        // Language and theme selectors
        document.getElementById('language-select')?.addEventListener('change', (e) => {
            this.gameState.settings.language = e.target.value;
            this.currentLanguage = e.target.value;
            this.updateLanguage();
            this.renderAll();
            this.saveGameState();
        });

        document.getElementById('theme-select')?.addEventListener('change', (e) => {
            this.gameState.settings.theme = e.target.value;
            this.updateTheme();
            this.saveGameState();
        });

        // Reset save
        document.getElementById('reset-save')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your save? This cannot be undone!')) {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        });

        // Prestige button
        document.getElementById('prestige-btn')?.addEventListener('click', () => {
            this.performPrestige();
        });
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tabName);
        });

        // Render content for the active tab immediately
        this.renderCurrentTab();
    }

    renderCurrentTab() {
        if (this.activeTab === 'career') {
            this.renderTasks();
        } else if (this.activeTab === 'desk') {
            this.renderDeskShop();
            this.renderDesk();
        } else if (this.activeTab === 'achievements') {
            this.renderAchievements();
        }
        
        this.updateDisplay();
        this.updateUnlockProgress();
        this.updateMultiBuyOptions();
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                if (el.tagName === 'OPTION') {
                    el.textContent = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
        document.documentElement.lang = this.currentLanguage;
    }

    updateTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.gameState.settings.theme);
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.gameState.settings.theme;
        }
    }

    startGameLoop() {
        this.updateInterval = setInterval(() => {
            this.gameLoop();
        }, 50); // 20 FPS for smooth idle progress

        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 10000); // Auto-save every 10 seconds
    }

    startQuoteRotation() {
        const rotateQuote = () => {
            const quotes = this.gameData.quotes[this.currentLanguage];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const quoteElement = document.getElementById('quote-text');
            if (quoteElement) {
                quoteElement.textContent = randomQuote;
            }
        };

        rotateQuote(); // Initial quote
        this.quoteInterval = setInterval(rotateQuote, 15000); // Change every 15 seconds
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // Update play time
        this.gameState.stats.playTime += deltaTime;

        // Update task progress and generate BP
        let totalBPGained = 0;
        let totalIdleRate = 0;

        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState || taskState.locked) return;

            const taskData = this.gameData.tasks.find(t => t.id === taskId);
            if (!taskData) return;

            const idleRate = this.calculateTaskIdleRate(taskId);
            totalIdleRate += idleRate;

            // Calculate progress based on cycle time and idle rate
            const cycleProgress = deltaTime / taskData.cycleTime;
            taskState.progress += cycleProgress;

            if (taskState.progress >= 1) {
                const cycles = Math.floor(taskState.progress);
                taskState.progress = taskState.progress % 1;
                totalBPGained += idleRate * cycles;
            }
        });

        if (totalBPGained > 0) {
            this.gameState.bp += totalBPGained;
            this.gameState.totalBPEarned += totalBPGained;
            this.onBPChanged(); // Critical: Trigger BP change event
        }

        // Check achievements periodically
        this.checkAchievements();

        // Auto-buyer functionality
        if (this.gameState.deskItems.autobuyer && this.gameState.unlocks.autoBuyer) {
            this.runAutoBuyer(deltaTime);
        }
    }

    // Critical: Manual task unlocking system
    unlockTask(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        if (!taskData) return;

        if (this.gameState.bp >= taskData.unlockCost) {
            this.gameState.bp -= taskData.unlockCost;
            this.gameState.totalBPSpent += taskData.unlockCost;

            if (!this.gameState.tasks[taskId]) {
                this.gameState.tasks[taskId] = { level: 1, progress: 0, locked: true, ascensions: 0 };
            }
            
            this.gameState.tasks[taskId].locked = false;
            
            this.onBPChanged();
            this.renderTasks();
            this.checkAchievements();
            this.showNotification(`${this.translations[this.currentLanguage][taskData.nameKey]} ${this.translations[this.currentLanguage].unlock.toLowerCase()}ed!`);
        }
    }

    calculateTaskIdleRate(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        if (!taskData || !taskState) return 0;
        
        let rate = taskData.baseIdle * Math.pow(taskData.idleMultiplier, taskState.level - 1);
        
        // Apply ascension multiplier
        rate *= Math.pow(2, taskState.ascensions);
        
        // Apply global multipliers
        rate *= this.getGlobalMultiplier();
        
        return rate;
    }

    getGlobalMultiplier() {
        let multiplier = 1;
        
        // Prestige multiplier
        multiplier *= Math.pow(1.1, this.gameState.prestigeCount);
        
        // Achievement bonuses
        Object.keys(this.gameState.achievements).forEach(achievementId => {
            if (this.gameState.achievements[achievementId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achievementId);
                if (achievement?.reward?.type === 'global_mult') {
                    multiplier *= achievement.reward.value;
                } else if (achievement?.reward?.type === 'bp_bonus') {
                    multiplier *= achievement.reward.value;
                } else if (achievement?.reward?.type === 'idle_bonus') {
                    multiplier *= achievement.reward.value;
                }
            }
        });
        
        // Desk item bonuses
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && (item.bonus.type === 'global_mult' || item.bonus.type === 'idle_mult')) {
                    multiplier *= item.bonus.value;
                }
            }
        });
        
        return multiplier;
    }

    checkAchievements() {
        this.gameData.achievements.forEach(achievement => {
            if (this.gameState.achievements[achievement.id]) return;

            let unlocked = false;
            const condition = achievement.condition;

            switch (condition.type) {
                case 'tasks_unlocked':
                    const unlockedTasks = Object.values(this.gameState.tasks).filter(t => !t.locked).length;
                    unlocked = unlockedTasks >= condition.value;
                    break;
                case 'upgrades_bought':
                    unlocked = this.gameState.stats.totalUpgrades >= condition.value;
                    break;
                case 'task_unlocked':
                    const taskState = this.gameState.tasks[condition.taskId];
                    unlocked = taskState && !taskState.locked;
                    break;
                case 'task_level':
                    const levelTaskState = this.gameState.tasks[condition.taskId];
                    unlocked = levelTaskState && levelTaskState.level >= condition.value;
                    break;
                case 'ascensions':
                    unlocked = this.gameState.stats.totalAscensions >= condition.value;
                    break;
                case 'bp_spent':
                    unlocked = this.gameState.totalBPSpent >= condition.value;
                    break;
                case 'prestiges':
                    unlocked = this.gameState.prestigeCount >= condition.value;
                    break;
                case 'multibuy_used':
                    unlocked = this.gameState.stats.multiBuyUsed >= condition.value;
                    break;
                case 'total_ascensions':
                    unlocked = this.gameState.stats.totalAscensions >= condition.value;
                    break;
                case 'idle_rate':
                    let totalRate = 0;
                    Object.keys(this.gameState.tasks).forEach(taskId => {
                        if (!this.gameState.tasks[taskId].locked) {
                            totalRate += this.calculateTaskIdleRate(taskId);
                        }
                    });
                    unlocked = totalRate >= condition.value;
                    break;
                case 'play_time':
                    unlocked = this.gameState.stats.playTime >= condition.value;
                    break;
            }

            if (unlocked) {
                this.gameState.achievements[achievement.id] = true;
                this.applyAchievementReward(achievement);
                this.renderAchievements();
                this.showNotification(`Achievement: ${this.translations[this.currentLanguage][achievement.nameKey]}!`);
            }
        });
    }

    applyAchievementReward(achievement) {
        const reward = achievement.reward;
        switch (reward.type) {
            case 'multibuy_unlock':
                if (reward.value === 'upgrades') {
                    this.gameState.unlocks.multiBuyUpgrades = true;
                } else if (reward.value === 'ascend') {
                    this.gameState.unlocks.multiBuyAscend = true;
                }
                break;
            case 'max_buy_unlock':
                this.gameState.unlocks.maxBuy = true;
                this.updateMultiBuyOptions();
                break;
            case 'auto_buyer':
                this.gameState.unlocks.autoBuyer = true;
                break;
        }
    }

    updateMultiBuyOptions() {
        const multiBuySelect = document.getElementById('multibuy-select');
        if (!multiBuySelect) return;

        // Clear existing options
        multiBuySelect.innerHTML = '';

        // Add basic options
        [1, 2, 5, 10, 20, 50].forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            multiBuySelect.appendChild(option);
        });

        // Add max option if unlocked
        if (this.gameState.unlocks.maxBuy) {
            const maxOption = document.createElement('option');
            maxOption.value = 'max';
            maxOption.textContent = this.translations[this.currentLanguage].buy_max;
            multiBuySelect.appendChild(maxOption);
        }
    }

    upgradeTask(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        if (!taskData || !taskState || taskState.locked) return;
        
        const amount = this.calculateBuyAmount(taskId, 'upgrade');
        let totalCost = 0;
        let actualBuys = 0;

        // Calculate total cost for multi-buy
        for (let i = 0; i < amount; i++) {
            const cost = this.calculateUpgradeCost(taskId, taskState.level + actualBuys);
            if (totalCost + cost <= this.gameState.bp) {
                totalCost += cost;
                actualBuys++;
            } else {
                break;
            }
        }

        if (actualBuys > 0 && this.gameState.bp >= totalCost) {
            this.gameState.bp -= totalCost;
            this.gameState.totalBPSpent += totalCost;
            taskState.level += actualBuys;
            this.gameState.stats.totalUpgrades += actualBuys;
            
            if (actualBuys > 1) {
                this.gameState.stats.multiBuyUsed++;
            }
            
            this.onBPChanged();
            this.renderTasks();
            this.checkAchievements();
        }
    }

    calculateUpgradeCost(taskId, level = null) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        if (!taskData || !taskState) return Infinity;
        
        const currentLevel = level !== null ? level : taskState.level;
        let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);
        
        // Apply upgrade discount from achievements
        Object.keys(this.gameState.achievements).forEach(achievementId => {
            if (this.gameState.achievements[achievementId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achievementId);
                if (achievement?.reward?.type === 'upgrade_discount') {
                    cost *= achievement.reward.value;
                }
            }
        });

        // Apply upgrade discount from desk items
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'upgrade_discount') {
                    cost *= item.bonus.value;
                }
            }
        });
        
        return Math.floor(cost);
    }

    calculateBuyAmount(taskId, type) {
        if (this.multiBuyAmount === 'max') {
            return this.calculateMaxBuy(taskId, type);
        }
        return parseInt(this.multiBuyAmount);
    }

    calculateMaxBuy(taskId, type) {
        let maxAffordable = 0;
        let currentCost = 0;
        
        if (type === 'upgrade') {
            const taskState = this.gameState.tasks[taskId];
            let totalCost = 0;
            let level = taskState.level;
            
            while (totalCost <= this.gameState.bp && maxAffordable < 1000) {
                const cost = this.calculateUpgradeCost(taskId, level);
                if (totalCost + cost <= this.gameState.bp) {
                    totalCost += cost;
                    maxAffordable++;
                    level++;
                } else {
                    break;
                }
            }
        }
        
        return maxAffordable;
    }

    // Critical: Ascend button in individual task tiles
    ascendTask(taskId) {
        const taskState = this.gameState.tasks[taskId];
        if (!taskState || taskState.level < 10) return;

        const amount = this.calculateBuyAmount(taskId, 'ascend');
        let actualAscensions = 0;

        for (let i = 0; i < amount; i++) {
            if (taskState.level >= 10) {
                taskState.level = Math.max(1, taskState.level - 9); // Keep some levels
                taskState.ascensions++;
                actualAscensions++;
                this.gameState.stats.totalAscensions++;
            } else {
                break;
            }
        }

        if (actualAscensions > 0) {
            taskState.progress = 0;
            
            if (actualAscensions > 1) {
                this.gameState.stats.multiBuyUsed++;
            }
            
            this.renderTasks();
            this.checkAchievements();
            this.showNotification(`${this.translations[this.currentLanguage][this.gameData.tasks.find(t => t.id === taskId).nameKey]} ${this.translations[this.currentLanguage].ascend.toLowerCase()}ed!`);
        }
    }

    performPrestige() {
        if (this.gameState.totalBPEarned < this.gameData.prestigeThreshold) return;

        const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / this.gameData.prestigeThreshold));
        
        // Reset game state but keep achievements, desk items, and settings
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const unlocksToKeep = { ...this.gameState.unlocks };

        this.gameState = this.loadGameState();
        this.gameState.softSkills += softSkillsGain;
        this.gameState.prestigeCount++;
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.unlocks = unlocksToKeep;
        
        // Initialize first task as locked (critical fix)
        this.gameState.tasks = {
            email: { level: 1, progress: 0, locked: true, ascensions: 0 }
        };

        this.checkAchievements();
        this.renderAll();
        this.onBPChanged();
        this.showNotification(`${this.translations[this.currentLanguage].prestige}! +${softSkillsGain} ${this.translations[this.currentLanguage].soft_skills}!`);
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId] || this.gameState.softSkills < item.cost) return;

        this.gameState.softSkills -= item.cost;
        this.gameState.deskItems[itemId] = true;
        
        this.renderDeskShop();
        this.renderDesk();
        this.updateDisplay();
        this.showNotification(`${this.translations[this.currentLanguage][item.nameKey]} ${this.translations[this.currentLanguage].buy.toLowerCase()}ed!`);
    }

    runAutoBuyer(deltaTime) {
        // Simple auto-buyer that tries to buy the cheapest available upgrade
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (taskState && !taskState.locked) {
                const cost = this.calculateUpgradeCost(taskId);
                if (this.gameState.bp >= cost && cost <= this.gameState.bp * 0.1) {
                    this.upgradeTask(taskId);
                }
            }
        });
    }

    renderAll() {
        this.renderCurrentTab();
        this.updateDisplay();
        this.updateUnlockProgress();
        this.updateMultiBuyOptions();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        if (!container) return;
        
        container.innerHTML = '';

        // Show all tasks (locked and unlocked)
        this.gameData.tasks.forEach(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            const isLocked = !taskState || taskState.locked;
            
            const taskCard = this.createTaskCard(taskData, taskState, isLocked);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(taskData, taskState, isLocked) {
        const card = document.createElement('div');
        card.className = `task-card ${isLocked ? 'locked' : ''}`;
        
        if (isLocked) {
            // Locked task display
            const canUnlock = this.gameState.bp >= taskData.unlockCost;
            
            card.innerHTML = `
                <div class="task-header">
                    <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                    <div class="task-rank">${this.translations[this.currentLanguage].locked}</div>
                </div>
                
                <div class="task-stats">
                    <div class="task-stat">
                        <div class="stat-label">${this.translations[this.currentLanguage].cost}</div>
                        <div class="stat-value">${this.formatNumber(taskData.unlockCost)} BP</div>
                    </div>
                    <div class="task-stat">
                        <div class="stat-label">Base BP/s</div>
                        <div class="stat-value">${this.formatNumber(taskData.baseIdle)}</div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="btn ${canUnlock ? 'btn--primary' : 'btn--secondary disabled'}" 
                            data-action="unlock" data-task-id="${taskData.id}" ${!canUnlock ? 'disabled' : ''}>
                        ${this.translations[this.currentLanguage].unlock} (${this.formatNumber(taskData.unlockCost)})
                    </button>
                </div>
            `;
        } else {
            // Unlocked task display
            const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
            const idleRate = this.calculateTaskIdleRate(taskData.id);
            const upgradeCost = this.calculateUpgradeCost(taskData.id);
            const canUpgrade = this.gameState.bp >= upgradeCost;
            const canAscend = taskState.level >= 10;
            
            // Critical: Progress bar animation speed tied to idle rate
            const progressAnimationClass = idleRate > 0 ? 'animated' : '';
            
            card.innerHTML = `
                <div class="task-header">
                    <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                    <div class="task-rank">${rank}</div>
                </div>
                
                <div class="task-progress">
                    <div class="task-progress-bar">
                        <div class="task-progress-fill ${progressAnimationClass}" 
                             data-task-id="${taskData.id}" 
                             style="width: ${taskState.progress * 100}%"></div>
                    </div>
                </div>
                
                <div class="task-stats">
                    <div class="task-stat">
                        <div class="stat-label">${this.translations[this.currentLanguage].level}</div>
                        <div class="stat-value">${taskState.level}</div>
                    </div>
                    <div class="task-stat">
                        <div class="stat-label">BP/s</div>
                        <div class="stat-value">${this.formatNumber(idleRate)}</div>
                    </div>
                    <div class="task-stat">
                        <div class="stat-label">${this.translations[this.currentLanguage].rank}</div>
                        <div class="stat-value">${taskState.ascensions}</div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="btn ${canUpgrade ? 'btn--primary' : 'btn--secondary disabled'}" 
                            data-action="upgrade" data-task-id="${taskData.id}" ${!canUpgrade ? 'disabled' : ''}>
                        ${this.translations[this.currentLanguage].upgrade} (${this.formatNumber(upgradeCost)})
                    </button>
                    <button class="btn ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}" 
                            data-action="ascend" data-task-id="${taskData.id}" ${!canAscend ? 'disabled' : ''}>
                        ${this.translations[this.currentLanguage].ascend}
                    </button>
                </div>
            `;
        }

        return card;
    }

    // Critical: Update task progress bars with animation speed based on idle rate
    updateTaskProgress() {
        document.querySelectorAll('.task-progress-fill').forEach(progressBar => {
            const taskId = progressBar.dataset.taskId;
            const taskState = this.gameState.tasks[taskId];
            
            if (taskState && !taskState.locked) {
                const progress = taskState.progress * 100;
                progressBar.style.width = `${progress}%`;
                
                // Update animation speed based on idle rate
                const idleRate = this.calculateTaskIdleRate(taskId);
                if (idleRate > 0) {
                    progressBar.classList.add('animated');
                    // Adjust animation duration based on idle rate (faster idle = faster animation)
                    const animationDuration = Math.max(0.5, 3 - (idleRate / 100));
                    progressBar.style.animationDuration = `${animationDuration}s`;
                } else {
                    progressBar.classList.remove('animated');
                }
            }
        });
    }

    renderDeskShop() {
        const container = document.getElementById('shop-items');
        if (!container) return;
        
        container.innerHTML = '';

        this.gameData.deskItems.forEach(item => {
            const owned = this.gameState.deskItems[item.id];
            const canBuy = !owned && this.gameState.softSkills >= item.cost;

            const shopItem = document.createElement('div');
            shopItem.className = `shop-item ${owned ? 'owned' : ''}`;
            
            shopItem.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${this.translations[this.currentLanguage][item.nameKey]}</div>
                    <div class="shop-item-cost">${owned ? 'Owned' : `${item.cost} SS`}</div>
                    <div class="shop-item-bonus">${this.getBonusDescription(item.bonus)}</div>
                </div>
                <button class="btn btn--sm ${canBuy ? 'btn--primary' : 'btn--secondary disabled'}" 
                        data-action="buy-desk" data-item-id="${item.id}" ${!canBuy ? 'disabled' : ''}>
                    ${owned ? '✓' : this.translations[this.currentLanguage].buy}
                </button>
            `;

            container.appendChild(shopItem);
        });
    }

    getBonusDescription(bonus) {
        const multiplier = ((bonus.value - 1) * 100).toFixed(0);
        const discount = ((1 - bonus.value) * 100).toFixed(0);
        
        switch (bonus.type) {
            case 'global_mult':
                return `+${multiplier}% global bonus`;
            case 'idle_mult':
                return `+${multiplier}% idle speed`;
            case 'upgrade_discount':
                return `-${discount}% upgrade costs`;
            case 'prestige_mult':
                return `+${multiplier}% prestige gain`;
            case 'ascend_bonus':
                return `+${multiplier}% ascension bonus`;
            case 'auto_buyer':
                return 'Auto-buy upgrades';
            default:
                return 'Special bonus';
        }
    }

    renderDesk() {
        const itemsGroup = document.getElementById('desk-items');
        if (!itemsGroup) return;
        
        itemsGroup.innerHTML = '';

        // Add visual representations of owned desk items
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (!this.gameState.deskItems[itemId]) return;

            const item = document.createElement('g');
            item.className = 'desk-item';
            
            switch (itemId) {
                case 'mug':
                    item.innerHTML = `<circle cx="120" cy="160" r="12" fill="#8B4513"/>
                                     <rect x="115" y="165" width="10" height="3" fill="#654321"/>`;
                    break;
                case 'monitor':
                    item.innerHTML = `<rect x="210" y="125" width="50" height="35" fill="#2c3e50" rx="3"/>
                                     <rect x="213" y="128" width="44" height="29" fill="#3498db" rx="2"/>`;
                    break;
                case 'plant':
                    item.innerHTML = `<circle cx="320" cy="168" r="8" fill="#8B4513"/>
                                     <circle cx="320" cy="155" r="12" fill="#228B22"/>`;
                    break;
                case 'mousepad':
                    item.innerHTML = `<ellipse cx="200" cy="240" rx="40" ry="15" fill="#1a1a1a"/>`;
                    break;
                case 'laptop':
                    item.innerHTML = `<rect x="65" y="125" width="20" height="15" fill="#333" rx="2"/>
                                     <rect x="67" y="127" width="16" height="11" fill="#555" rx="1"/>`;
                    break;
                case 'autobuyer':
                    item.innerHTML = `<circle cx="350" cy="130" r="12" fill="#4CAF50"/>
                                     <text x="350" y="135" text-anchor="middle" fill="white" font-size="8">AI</text>`;
                    break;
            }
            
            itemsGroup.appendChild(item);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;
        
        container.innerHTML = '';

        this.gameData.achievements.forEach(achievement => {
            const unlocked = this.gameState.achievements[achievement.id];
            
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement ${unlocked ? 'unlocked' : ''}`;
            
            achievementEl.innerHTML = `
                <div class="achievement-icon">${unlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${this.translations[this.currentLanguage][achievement.nameKey]}</div>
                    <div class="achievement-desc">${this.translations[this.currentLanguage][achievement.descKey]}</div>
                    <div class="achievement-bonus">${unlocked ? this.translations[this.currentLanguage][achievement.bonusDesc] || 'Special bonus' : ''}</div>
                </div>
            `;

            container.appendChild(achievementEl);
        });
    }

    updateDisplay() {
        const bpDisplay = document.getElementById('bp-display');
        const ssDisplay = document.getElementById('ss-display');
        
        if (bpDisplay) {
            bpDisplay.textContent = this.formatNumber(Math.floor(this.gameState.bp));
        }
        if (ssDisplay) {
            ssDisplay.textContent = Math.floor(this.gameState.softSkills);
        }

        // Update prestige button
        const canPrestige = this.gameState.totalBPEarned >= this.gameData.prestigeThreshold;
        const prestigeBtn = document.getElementById('prestige-btn');
        const prestigeInfo = document.getElementById('prestige-info');
        
        if (prestigeBtn && prestigeInfo) {
            prestigeBtn.disabled = !canPrestige;
            if (canPrestige) {
                const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / this.gameData.prestigeThreshold));
                prestigeInfo.textContent = `Gain ${softSkillsGain} ${this.translations[this.currentLanguage].soft_skills}`;
                prestigeBtn.classList.remove('disabled');
                prestigeBtn.textContent = this.translations[this.currentLanguage].prestige_ready;
            } else {
                prestigeInfo.textContent = `Requires ${this.formatNumber(this.gameData.prestigeThreshold)} total BP earned`;
                prestigeBtn.classList.add('disabled');
                prestigeBtn.textContent = this.translations[this.currentLanguage].prestige;
            }
        }
    }

    updateUnlockProgress() {
        const nextTask = this.gameData.tasks.find(task => {
            const taskState = this.gameState.tasks[task.id];
            return !taskState || taskState.locked;
        });

        const progressBar = document.getElementById('unlock-progress');
        const progressText = document.getElementById('unlock-text');
        
        if (nextTask && progressBar && progressText) {
            const progress = Math.min(this.gameState.bp / nextTask.unlockCost, 1);
            progressBar.style.width = `${progress * 100}%`;
            progressText.textContent = `${this.formatNumber(this.gameState.bp)} / ${this.formatNumber(nextTask.unlockCost)} BP`;
        } else if (progressBar && progressText) {
            progressBar.style.width = '100%';
            progressText.textContent = `All tasks available`;
        }
    }

    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        return (num / 1000000000000).toFixed(1) + 'T';
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-surface);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            font-size: var(--font-size-sm);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.quoteInterval) clearInterval(this.quoteInterval);
        if (this.uiUpdateInterval) clearInterval(this.uiUpdateInterval);
    }
}

// Initialize game when DOM is loaded
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new KorposzczurGame();
});

// Save on page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.saveGameState();
    }
});

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);