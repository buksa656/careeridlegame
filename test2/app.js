// Korposzczur - Corporate Idle Game - Advanced Version - Final Fix
// Complete game logic with major improvements - All issues resolved

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
        this.currentMultiBuy = 1;
        this.unlockedFeatures = {
            multibuyUpgrades: false,
            multibuyAscend: false,
            maxBuy: false,
            autobuyer: false
        };
        
        this.init();
    }

    initializeGameData() {
        return {
            "tasks": [
                {"id": "email", "nameKey": "task_email", "baseCost": 10, "baseIdle": 1, "unlockCost": 0, "costMultiplier": 1.15, "idleMultiplier": 1.2},
                {"id": "coffee", "nameKey": "task_coffee", "baseCost": 25, "baseIdle": 3, "unlockCost": 75, "costMultiplier": 1.15, "idleMultiplier": 1.2},
                {"id": "meeting", "nameKey": "task_meeting", "baseCost": 150, "baseIdle": 12, "unlockCost": 500, "costMultiplier": 1.15, "idleMultiplier": 1.2},
                {"id": "kpi", "nameKey": "task_kpi", "baseCost": 1500, "baseIdle": 70, "unlockCost": 3500, "costMultiplier": 1.15, "idleMultiplier": 1.2},
                {"id": "brainstorm", "nameKey": "task_brainstorm", "baseCost": 15000, "baseIdle": 400, "unlockCost": 35000, "costMultiplier": 1.15, "idleMultiplier": 1.2},
                {"id": "optimize", "nameKey": "task_optimize", "baseCost": 180000, "baseIdle": 2200, "unlockCost": 350000, "costMultiplier": 1.15, "idleMultiplier": 1.2}
            ],
            "achievements": [
                {"id": "first_unlock", "nameKey": "ach_first_unlock", "descKey": "ach_first_unlock_desc", "condition": {"type": "tasks_unlocked", "value": 2}, "reward": {"type": "bp_bonus", "value": 1.05}, "bonusDesc": "bonusDesc_bp_5"},
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
                    "ach_first_unlock_desc": "Odblokuj drugie zadanie",
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
                    "help_content": "Witaj w Korposzczur!\n\nCel: Rozwijaj karierę korporacyjną wykonując zadania i zdobywając Biuro-Punkty (BP).\n\nMechaniki:\n• Odblokuj zadania za BP\n• Ulepszaj zadania za BP aby zwiększyć przychód\n• Awansuj zadania do wyższych rang\n• Użyj Prestiżu aby zresetować grę za Soft Skills\n• Kup przedmioty biurkowe za Soft Skills\n• Zdobywaj achievementy aby odblokować nowe funkcje\n\nWskazówki:\n• Każde zadanie musi być najpierw odblokowane\n• Multi-buy i auto-kupowanie odblokują się przez achievementy\n• Biurko stanie się dostępne po pierwszym prestiżu\n• Prestiż staje się dostępny automatycznie po zebraniu wystarczającej ilości BP"
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
                    "ach_first_unlock_desc": "Unlock second task",
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
                    "help_content": "Welcome to Corporate Rat!\n\nGoal: Develop your corporate career by completing tasks and earning Office Points (BP).\n\nMechanics:\n• Unlock tasks with BP\n• Upgrade tasks with BP to increase income\n• Ascend tasks to higher ranks\n• Use Prestige to reset game for Soft Skills\n• Buy desk items with Soft Skills\n• Earn achievements to unlock new features\n\nTips:\n• Each task must be unlocked first\n• Multi-buy and auto-buyer unlock through achievements\n• Desk becomes available after first prestige\n• Prestige becomes available automatically after collecting enough BP"
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
            tasks: {
                // Email task starts unlocked
                email: { level: 1, progress: 0, unlocked: true, ascensions: 0 }
            },
            achievements: {},
            deskItems: {},
            settings: {
                language: 'pl',
                theme: 'light'
            },
            stats: {
                totalUpgrades: 0,
                totalAscensions: 0,
                multibuyUsed: 0,
                playTime: 0,
                startTime: Date.now()
            }
        };

        try {
            const saved = localStorage.getItem('korposzczur-save-v4');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...defaultState, ...parsed, stats: { ...defaultState.stats, ...parsed.stats } };
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }

        return defaultState;
    }

    saveGameState() {
        try {
            localStorage.setItem('korposzczur-save-v4', JSON.stringify(this.gameState));
            this.lastSave = Date.now();
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    init() {
        this.updateUnlockedFeatures();
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.renderAll();
        this.startGameLoop();
        this.startQuoteRotation();
        this.updateTabVisibility();

        // Make sure global functions work
        window.game = this;

        // Initialize debug commands
        window.debug = {
            addBP: (amount) => { 
                this.gameState.bp += amount; 
                this.gameState.totalBPEarned += amount;
                this.updateDisplay(); 
            },
            addSS: (amount) => { this.gameState.softSkills += amount; this.updateDisplay(); },
            unlockAll: () => { 
                this.gameData.tasks.forEach(task => { 
                    this.unlockTask(task.id, true); 
                }); 
                this.renderTasks(); 
            },
            reset: () => { localStorage.removeItem('korposzczur-save-v4'); location.reload(); }
        };
    }

    updateUnlockedFeatures() {
        this.unlockedFeatures.multibuyUpgrades = this.gameState.achievements['first_upgrade'] || false;
        this.unlockedFeatures.multibuyAscend = this.gameState.achievements['first_ascend'] || false;
        this.unlockedFeatures.maxBuy = this.gameState.achievements['multibuy_expert'] || false;
        this.unlockedFeatures.autobuyer = this.gameState.deskItems['autobuyer'] || false;
    }

    setupEventListeners() {
        // Tab navigation - Fixed to properly handle all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Modal handlers
        this.setupModalHandlers();
        
        // Settings handlers
        this.setupSettingsHandlers();

        // Prestige modal handlers
        this.setupPrestigeHandlers();

        // Help modal
        const helpBtn = document.getElementById('help-btn');
        const helpClose = document.getElementById('help-close');
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                document.getElementById('help-content').textContent = this.translations[this.currentLanguage]['help_content'];
                document.getElementById('help-modal').classList.remove('hidden');
            });
        }

        if (helpClose) {
            helpClose.addEventListener('click', () => {
                document.getElementById('help-modal').classList.add('hidden');
            });
        }
    }

    setupModalHandlers() {
        // Generic modal close handlers
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });
    }

    setupSettingsHandlers() {
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');

        if (settingsToggle && settingsModal) {
            settingsToggle.addEventListener('click', () => {
                settingsModal.classList.remove('hidden');
            });
        }

        if (settingsClose) {
            settingsClose.addEventListener('click', () => {
                settingsModal.classList.add('hidden');
            });
        }

        const languageSelect = document.getElementById('language-select');
        const themeSelect = document.getElementById('theme-select');
        const resetBtn = document.getElementById('reset-save');

        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.gameState.settings.language = e.target.value;
                this.currentLanguage = e.target.value;
                this.updateLanguage();
                this.renderAll();
                this.saveGameState();
            });
        }

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.gameState.settings.theme = e.target.value;
                this.updateTheme();
                this.saveGameState();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const confirmText = this.currentLanguage === 'pl' ? 
                    'Czy na pewno chcesz zresetować grę? Tej operacji nie można cofnąć!' :
                    'Are you sure you want to reset your save? This cannot be undone!';
                
                if (confirm(confirmText)) {
                    localStorage.removeItem('korposzczur-save-v4');
                    location.reload();
                }
            });
        }
    }

    setupPrestigeHandlers() {
        const prestigeCancel = document.getElementById('prestige-cancel');
        const prestigeConfirm = document.getElementById('prestige-confirm');

        if (prestigeCancel) {
            prestigeCancel.addEventListener('click', () => {
                document.getElementById('prestige-modal').classList.add('hidden');
            });
        }

        if (prestigeConfirm) {
            prestigeConfirm.addEventListener('click', () => {
                this.performPrestige();
                document.getElementById('prestige-modal').classList.add('hidden');
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content - Fixed to handle all tabs properly
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Map tab names to their content IDs
        let targetTabId;
        switch(tabName) {
            case 'career':
                targetTabId = 'career-tab';
                break;
            case 'desk':
                targetTabId = 'desk-tab-content';
                break;
            case 'achievements':
                targetTabId = 'achievements-tab-content';
                break;
        }
        
        const targetTab = document.getElementById(targetTabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    updateTabVisibility() {
        const deskTab = document.getElementById('desk-tab');
        const ssCurrency = document.getElementById('ss-currency');
        
        if (this.gameState.softSkills > 0) {
            if (deskTab) deskTab.style.display = 'block';
            if (ssCurrency) ssCurrency.style.display = 'flex';
        } else {
            if (deskTab) deskTab.style.display = 'none';
            if (ssCurrency) ssCurrency.style.display = 'none';
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                el.textContent = translation;
            }
        });

        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = this.currentLanguage;
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
        }, 100); // 10 FPS for consistent updates

        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000);
    }

    startQuoteRotation() {
        const rotateQuote = () => {
            const quotes = this.gameData.quotes[this.currentLanguage];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const quoteEl = document.getElementById('quote-text');
            if (quoteEl) {
                quoteEl.textContent = randomQuote;
            }
        };

        rotateQuote();
        this.quoteInterval = setInterval(rotateQuote, 20000);
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // Update play time
        this.gameState.stats.playTime += deltaTime;

        // Generate BP from unlocked tasks
        let totalBPGained = 0;
        let activeTasksCount = 0;

        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState || !taskState.unlocked) return;

            const idleRate = this.calculateTaskIdleRate(taskId);
            if (idleRate > 0) {
                activeTasksCount++;
                const progressIncrement = (deltaTime / 1000) * idleRate;
                
                taskState.progress += progressIncrement;
                if (taskState.progress >= 1) {
                    const cycles = Math.floor(taskState.progress);
                    taskState.progress = taskState.progress % 1;
                    totalBPGained += cycles;
                }
            }
        });

        if (totalBPGained > 0) {
            this.gameState.bp += totalBPGained;
            this.gameState.totalBPEarned += totalBPGained;
        }

        // Update idle animation
        const idleAnimation = document.getElementById('idle-animation');
        if (idleAnimation) {
            if (activeTasksCount > 0) {
                idleAnimation.classList.add('active');
            } else {
                idleAnimation.classList.remove('active');
            }
        }

        // Check achievements and prestige periodically
        if (now - this.lastSave > 1000) {
            this.checkAllAchievements();
            this.checkPrestigeAvailability();
            this.updateDisplay();
            this.updateProgressBars();
            this.lastSave = now;
        }
    }

    calculateTaskIdleRate(taskId, level = null) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        if (!taskData || !taskState) return 0;

        const taskLevel = level !== null ? level : taskState.level;
        let rate = taskData.baseIdle * Math.pow(taskData.idleMultiplier, taskLevel - 1);
        
        // Apply ascension multiplier
        rate *= Math.pow(2, taskState.ascensions);
        
        // Apply global multipliers
        rate *= this.getGlobalMultiplier();
        
        return rate;
    }

    getGlobalMultiplier() {
        let multiplier = 1;
        
        // Achievement bonuses
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward) {
                    switch (achievement.reward.type) {
                        case 'bp_bonus':
                        case 'idle_bonus':
                        case 'global_mult':
                            multiplier *= achievement.reward.value;
                            break;
                    }
                }
            }
        });
        
        // Soft skills multiplier
        multiplier *= Math.pow(1.1, this.gameState.prestigeCount);
        
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

    calculateUpgradeCost(taskId, level = null) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        if (!taskData || !taskState) return Infinity;

        const taskLevel = level !== null ? level : taskState.level;
        let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, taskLevel);
        
        // Apply upgrade discount from achievements and desk items
        let discount = 1;
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward && achievement.reward.type === 'upgrade_discount') {
                    discount *= achievement.reward.value;
                }
            }
        });

        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'upgrade_discount') {
                    discount *= item.bonus.value;
                }
            }
        });
        
        return Math.floor(cost * discount);
    }

    // Fixed unlock method to work with onclick handlers
    unlockTask(taskId, force = false) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        if (!taskData) {
            console.error('Task not found:', taskId);
            return false;
        }

        console.log(`Attempting to unlock ${taskId}, cost: ${taskData.unlockCost}, current BP: ${this.gameState.bp}`);

        if (force || this.gameState.bp >= taskData.unlockCost) {
            if (!this.gameState.tasks[taskId]) {
                this.gameState.tasks[taskId] = { level: 1, progress: 0, unlocked: false, ascensions: 0 };
            }
            
            if (!this.gameState.tasks[taskId].unlocked) {
                if (!force && taskData.unlockCost > 0) {
                    this.gameState.bp -= taskData.unlockCost;
                    this.gameState.totalBPSpent += taskData.unlockCost;
                }
                this.gameState.tasks[taskId].unlocked = true;
                
                console.log(`Successfully unlocked ${taskId}`);
                this.renderTasks();
                this.updateDisplay();
                this.checkAllAchievements(); // Check for unlock achievements
                this.showNotification(`${this.translations[this.currentLanguage]['unlock']}: ${this.translations[this.currentLanguage][taskData.nameKey]}!`);
                return true;
            }
        } else {
            console.log(`Not enough BP to unlock ${taskId}. Need: ${taskData.unlockCost}, have: ${this.gameState.bp}`);
        }
        return false;
    }

    upgradeTask(taskId, amount = null) {
        const taskState = this.gameState.tasks[taskId];
        if (!taskState || !taskState.unlocked) return false;

        const cost = this.calculateUpgradeCost(taskId);

        if (this.gameState.bp >= cost) {
            this.gameState.bp -= cost;
            this.gameState.totalBPSpent += cost;
            taskState.level += 1;
            this.gameState.stats.totalUpgrades += 1;
            
            this.checkAllAchievements(); // This will check first_upgrade achievement
            this.renderTasks();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    ascendTask(taskId, amount = 1) {
        const taskState = this.gameState.tasks[taskId];
        if (!taskState || !taskState.unlocked || taskState.level < 25) return false;

        const levels = Math.floor(taskState.level / 25) * amount;
        taskState.level = Math.max(1, taskState.level - levels * 25);
        taskState.ascensions += amount;
        taskState.progress = 0;
        this.gameState.stats.totalAscensions += amount;
        
        this.checkAllAchievements();
        this.renderTasks();
        return true;
    }

    checkPrestigeAvailability() {
        const canPrestige = this.gameState.totalBPEarned >= this.gameData.prestigeThreshold;
        const progressContainer = document.getElementById('prestige-progress-container');
        
        if (progressContainer) {
            if (canPrestige && this.gameState.totalBPEarned < this.gameData.prestigeThreshold * 2) {
                progressContainer.style.display = 'block';
            }
        }
    }

    showPrestigeModal() {
        const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / this.gameData.prestigeThreshold));
        const gainEl = document.getElementById('prestige-gain');
        if (gainEl) {
            gainEl.textContent = softSkillsGain;
        }
        
        const modal = document.getElementById('prestige-modal');
        if (modal && modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
        }
    }

    performPrestige() {
        const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / this.gameData.prestigeThreshold));
        
        // Keep achievements, desk items, and settings
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const statsToKeep = { ...this.gameState.stats };

        // Reset progress but keep prestige count and soft skills
        this.gameState.bp = 0;
        this.gameState.totalBPEarned = 0;
        this.gameState.totalBPSpent = 0;
        this.gameState.softSkills += softSkillsGain;
        this.gameState.prestigeCount++;
        this.gameState.tasks = { email: { level: 1, progress: 0, unlocked: true, ascensions: 0 } };
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.stats = statsToKeep;

        this.checkAllAchievements();
        this.updateTabVisibility();
        this.renderAll();
        this.showNotification(`${this.translations[this.currentLanguage]['prestige']}! +${softSkillsGain} Soft Skills!`);
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId] || this.gameState.softSkills < item.cost) return false;

        this.gameState.softSkills -= item.cost;
        this.gameState.deskItems[itemId] = true;
        this.updateUnlockedFeatures();
        this.renderDeskShop();
        this.renderDesk();
        this.updateDisplay();
        return true;
    }

    checkAllAchievements() {
        this.gameData.achievements.forEach(achievement => {
            if (!this.gameState.achievements[achievement.id]) {
                if (this.checkAchievementCondition(achievement)) {
                    this.unlockAchievement(achievement.id);
                }
            }
        });
    }

    checkAchievementCondition(achievement) {
        const condition = achievement.condition;
        
        switch (condition.type) {
            case 'tasks_unlocked':
                const unlockedCount = Object.values(this.gameState.tasks).filter(t => t.unlocked).length;
                return unlockedCount >= condition.value;
            
            case 'upgrades_bought':
                return this.gameState.stats.totalUpgrades >= condition.value;
            
            case 'task_unlocked':
                return this.gameState.tasks[condition.taskId] && this.gameState.tasks[condition.taskId].unlocked;
            
            case 'task_level':
                return this.gameState.tasks[condition.taskId] && this.gameState.tasks[condition.taskId].level >= condition.value;
            
            case 'ascensions':
                return this.gameState.stats.totalAscensions >= condition.value;
            
            case 'bp_spent':
                return this.gameState.totalBPSpent >= condition.value;
            
            case 'prestiges':
                return this.gameState.prestigeCount >= condition.value;
            
            case 'multibuy_used':
                return this.gameState.stats.multibuyUsed >= condition.value;
            
            case 'total_ascensions':
                return this.gameState.stats.totalAscensions >= condition.value;
            
            case 'idle_rate':
                let totalRate = 0;
                Object.keys(this.gameState.tasks).forEach(taskId => {
                    if (this.gameState.tasks[taskId] && this.gameState.tasks[taskId].unlocked) {
                        totalRate += this.calculateTaskIdleRate(taskId);
                    }
                });
                return totalRate >= condition.value;
            
            case 'play_time':
                return this.gameState.stats.playTime >= condition.value;
                
            default:
                return false;
        }
    }

    unlockAchievement(achievementId) {
        this.gameState.achievements[achievementId] = true;
        const achievement = this.gameData.achievements.find(a => a.id === achievementId);
        
        // Apply achievement rewards
        if (achievement.reward) {
            switch (achievement.reward.type) {
                case 'multibuy_unlock':
                    this.updateUnlockedFeatures();
                    break;
            }
        }
        
        // Show notification
        const achievementName = this.translations[this.currentLanguage][achievement.nameKey];
        const bonusDesc = this.translations[this.currentLanguage][achievement.bonusDesc];
        this.showAchievementNotification(achievementName, bonusDesc);
        
        this.renderAchievements();
    }

    setMultiBuy(amount) {
        this.currentMultiBuy = amount;
        this.renderTasks();
    }

    renderAll() {
        this.renderTasks();
        this.renderDeskShop();
        this.renderDesk();
        this.renderAchievements();
        this.updateDisplay();
        this.updateProgressBars();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        if (!container) return;
        
        container.innerHTML = '';

        // Show unlocked tasks first
        this.gameData.tasks.forEach(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            if (taskState && taskState.unlocked) {
                const taskCard = this.createTaskCard(taskData, taskState, false);
                container.appendChild(taskCard);
            }
        });

        // Show next locked task
        const nextLockedTask = this.gameData.tasks.find(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            return !taskState || !taskState.unlocked;
        });

        if (nextLockedTask) {
            const taskCard = this.createTaskCard(nextLockedTask, null, true);
            container.appendChild(taskCard);
        }
    }

    createTaskCard(taskData, taskState, isLocked) {
        const card = document.createElement('div');
        card.className = `task-card ${isLocked ? 'locked' : ''}`;
        
        if (isLocked) {
            const canUnlock = this.gameState.bp >= taskData.unlockCost;
            card.innerHTML = `
                <div class="task-header">
                    <div class="task-info">
                        <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                        <div class="task-rank">${this.translations[this.currentLanguage]['locked']}</div>
                    </div>
                </div>
                <div class="unlock-cost">
                    ${this.translations[this.currentLanguage]['unlock']}: ${this.formatNumber(taskData.unlockCost)} BP
                </div>
                <div class="task-actions">
                    <button class="btn ${canUnlock ? 'btn--primary' : 'btn--secondary disabled'}" 
                            onclick="window.game.unlockTask('${taskData.id}')" ${!canUnlock ? 'disabled' : ''}>
                        ${this.translations[this.currentLanguage]['unlock']} (${this.formatNumber(taskData.unlockCost)} BP)
                    </button>
                </div>
            `;
        } else {
            const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
            const idleRate = this.calculateTaskIdleRate(taskData.id);
            const upgradeCost = this.calculateUpgradeCost(taskData.id);
            const canUpgrade = this.gameState.bp >= upgradeCost;
            const canAscend = taskState.level >= 25;

            card.innerHTML = `
                <div class="task-header">
                    <div class="task-info">
                        <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                        <div class="task-rank">${rank}</div>
                    </div>
                    <div class="task-progress-circle">
                        <svg class="progress-circle" viewBox="0 0 36 36">
                            <path class="progress-circle-bg" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                stroke-dasharray="100, 100"/>
                            <path class="progress-circle-fill" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                stroke-dasharray="${taskState.progress * 100}, 100"/>
                        </svg>
                        <div class="progress-percentage">${Math.floor(taskState.progress * 100)}%</div>
                    </div>
                </div>
                
                <div class="task-stats">
                    <div class="task-stat">
                        <div class="stat-label">${this.translations[this.currentLanguage]['level']}</div>
                        <div class="stat-value">${taskState.level}</div>
                    </div>
                    <div class="task-stat">
                        <div class="stat-label">BP/s</div>
                        <div class="stat-value">${this.formatNumber(idleRate)}</div>
                    </div>
                    <div class="task-stat">
                        <div class="stat-label">${this.translations[this.currentLanguage]['rank']}</div>
                        <div class="stat-value">${taskState.ascensions}</div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="btn ${canUpgrade ? 'btn--primary' : 'btn--secondary disabled'}" 
                            onclick="window.game.upgradeTask('${taskData.id}')" ${!canUpgrade ? 'disabled' : ''}>
                        ${this.translations[this.currentLanguage]['upgrade']} (${this.formatNumber(upgradeCost)})
                    </button>
                    ${canAscend ? `
                        <button class="btn btn--outline" 
                                onclick="window.game.ascendTask('${taskData.id}')">
                            ${this.translations[this.currentLanguage]['ascend']}
                        </button>
                    ` : ''}
                </div>
            `;
        }

        return card;
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
                    <div class="shop-item-desc">${this.getItemBonusDescription(item)}</div>
                    <div class="shop-item-cost">${owned ? 'Owned' : `${item.cost} SS`}</div>
                </div>
                <button class="btn btn--sm ${canBuy ? 'btn--primary' : 'btn--secondary disabled'}" 
                        onclick="window.game.buyDeskItem('${item.id}')" ${!canBuy ? 'disabled' : ''}>
                    ${owned ? '✓' : this.translations[this.currentLanguage]['buy']}
                </button>
            `;

            container.appendChild(shopItem);
        });
    }

    getItemBonusDescription(item) {
        switch (item.bonus.type) {
            case 'global_mult':
                return `+${Math.round((item.bonus.value - 1) * 100)}% global multiplier`;
            case 'idle_mult':
                return `+${Math.round((item.bonus.value - 1) * 100)}% idle rate`;
            case 'upgrade_discount':
                return `-${Math.round((1 - item.bonus.value) * 100)}% upgrade costs`;
            case 'prestige_mult':
                return `+${Math.round((item.bonus.value - 1) * 100)}% prestige bonus`;
            case 'ascend_bonus':
                return `+${Math.round((item.bonus.value - 1) * 100)}% ascension bonus`;
            case 'auto_buyer':
                return 'Automatically buys profitable upgrades';
            default:
                return 'Special bonus';
        }
    }

    renderDesk() {
        const itemsGroup = document.getElementById('desk-items');
        if (!itemsGroup) return;
        
        itemsGroup.innerHTML = '';

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
                    item.innerHTML = `<rect x="65" y="130" width="30" height="20" fill="#2c3e50" rx="2"/>
                                     <rect x="67" y="132" width="26" height="16" fill="#3498db" rx="1"/>`;
                    break;
                case 'autobuyer':
                    item.innerHTML = `<rect x="300" y="100" width="30" height="15" fill="#e74c3c" rx="3"/>
                                     <circle cx="315" cy="107" r="3" fill="#2ecc71"/>`;
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
                <div class="achievement-content">
                    <div class="achievement-name">${this.translations[this.currentLanguage][achievement.nameKey]}</div>
                    <div class="achievement-desc">${this.translations[this.currentLanguage][achievement.descKey]}</div>
                    <div class="achievement-bonus">${this.translations[this.currentLanguage][achievement.bonusDesc]}</div>
                </div>
            `;

            container.appendChild(achievementEl);
        });
    }

    updateDisplay() {
        const bpDisplay = document.getElementById('bp-display');
        const ssDisplay = document.getElementById('ss-display');
        const bpRate = document.getElementById('bp-rate');
        
        if (bpDisplay) bpDisplay.textContent = this.formatNumber(Math.floor(this.gameState.bp));
        if (ssDisplay) ssDisplay.textContent = Math.floor(this.gameState.softSkills);
        
        // Calculate and display BP rate
        let totalRate = 0;
        Object.keys(this.gameState.tasks).forEach(taskId => {
            if (this.gameState.tasks[taskId] && this.gameState.tasks[taskId].unlocked) {
                totalRate += this.calculateTaskIdleRate(taskId);
            }
        });
        if (bpRate) bpRate.textContent = `${this.formatNumber(totalRate)}/s`;
    }

    updateProgressBars() {
        // Update unlock progress
        const nextTask = this.gameData.tasks.find(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            return !taskState || !taskState.unlocked;
        });

        const unlockProgress = document.getElementById('unlock-progress');
        const unlockText = document.getElementById('unlock-text');
        
        if (nextTask && unlockProgress && unlockText) {
            const progress = Math.min(this.gameState.bp / nextTask.unlockCost, 1);
            unlockProgress.style.width = `${progress * 100}%`;
            unlockText.textContent = 
                `${this.translations[this.currentLanguage][nextTask.nameKey]} (${this.formatNumber(nextTask.unlockCost)} BP)`;
        } else if (unlockProgress && unlockText) {
            unlockProgress.style.width = '100%';
            unlockText.textContent = 'All tasks unlocked!';
        }

        // Update prestige progress
        const prestigeProgress = document.getElementById('prestige-progress');
        const prestigeText = document.getElementById('prestige-text');
        
        if (prestigeProgress && prestigeText) {
            const progress = Math.min(this.gameState.totalBPEarned / this.gameData.prestigeThreshold, 1);
            prestigeProgress.style.width = `${progress * 100}%`;
            prestigeText.textContent = 
                `${this.formatNumber(this.gameState.totalBPEarned)} / ${this.formatNumber(this.gameData.prestigeThreshold)} BP`;
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
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-surface);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1002;
            animation: slideInRight 0.5s ease-out;
            min-width: 250px;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showAchievementNotification(title, bonus) {
        const notification = document.getElementById('achievement-notification');
        const achievementText = document.getElementById('achievement-text');
        const achievementBonus = document.getElementById('achievement-bonus');
        
        if (notification && achievementText && achievementBonus) {
            achievementText.textContent = title;
            achievementBonus.textContent = bonus;
            
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 4000);
        }
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.quoteInterval) clearInterval(this.quoteInterval);
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