// Korposzczur - Corporate Idle Game - Enhanced Version
// Main game logic and state management

class KorposzczurGame {
    constructor() {
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.translations = this.gameData.translations;
        this.currentLanguage = this.gameState.settings.language;
        this.currentTab = 'career';
        this.multiBuyAmount = 1;
        this.autoBuyerEnabled = false;
        this.lastSave = Date.now();
        this.lastUpdate = Date.now();
        this.updateInterval = null;
        this.saveInterval = null;
        this.quoteInterval = null;
        this.autoBuyerInterval = null;
        
        this.init();
    }

    initializeGameData() {
        return {
            "tasks": [
                {"id": "email", "nameKey": "task_email", "baseCost": 10, "baseIdle": 1, "unlockCost": 0, "costMultiplier": 1.15},
                {"id": "coffee", "nameKey": "task_coffee", "baseCost": 15, "baseIdle": 2, "unlockCost": 50, "costMultiplier": 1.15},
                {"id": "meeting", "nameKey": "task_meeting", "baseCost": 100, "baseIdle": 8, "unlockCost": 300, "costMultiplier": 1.15},
                {"id": "kpi", "nameKey": "task_kpi", "baseCost": 1000, "baseIdle": 47, "unlockCost": 2000, "costMultiplier": 1.15},
                {"id": "brainstorm", "nameKey": "task_brainstorm", "baseCost": 11000, "baseIdle": 260, "unlockCost": 20000, "costMultiplier": 1.15},
                {"id": "optimize", "nameKey": "task_optimize", "baseCost": 120000, "baseIdle": 1400, "unlockCost": 200000, "costMultiplier": 1.15}
            ],
            "achievements": [
                {"id": "first_upgrade", "nameKey": "ach_first_upgrade", "descKey": "ach_first_upgrade_desc", "reward": "multibuy_upgrade"},
                {"id": "first_unlock", "nameKey": "ach_first_unlock", "descKey": "ach_first_unlock_desc", "reward": "bp_bonus"},
                {"id": "first_ascend", "nameKey": "ach_first_ascend", "descKey": "ach_first_ascend_desc", "reward": "multibuy_ascend"},
                {"id": "first_prestige", "nameKey": "ach_first_prestige", "descKey": "ach_first_prestige_desc", "reward": "prestige_bonus"},
                {"id": "multibuy_master", "nameKey": "ach_multibuy_master", "descKey": "ach_multibuy_master_desc", "reward": "max_buy"}
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
                    "upgrade": "Ulepsz",
                    "ascend": "Awansuj",
                    "unlock": "Odblokuj",
                    "buy": "Kup",
                    "level": "Poziom",
                    "rank": "Ranga",
                    "auto_buyer": "Auto-Kupowanie",
                    "multibuy": "Multi-buy",
                    "buy_max": "Kup max",
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
                    "ach_first_upgrade": "Pierwsze ulepszenie",
                    "ach_first_unlock": "Nowy task",
                    "ach_first_ascend": "Pierwszy awans",
                    "ach_first_prestige": "Soft Skills master",
                    "ach_multibuy_master": "Multi-buy expert",
                    "ach_first_upgrade_desc": "Ulepsz pierwsze zadanie",
                    "ach_first_unlock_desc": "Odblokuj nowe zadanie",
                    "ach_first_ascend_desc": "Wykonaj pierwszy awans",
                    "ach_first_prestige_desc": "Wykonaj pierwszy prestiż",
                    "ach_multibuy_master_desc": "Kup 100 ulepszeń naraz",
                    "help_content": "Witaj w Korposzczur!\\n\\nCel: Rozwijaj karierę korporacyjną wykonując zadania i zdobywając Biuro-Punkty (BP).\\n\\nMechaniki:\\n• Zadania generują BP automatycznie\\n• Ulepsz zadania za BP aby zwiększyć przychód\\n• Odblokuj nowe zadania wydając BP\\n• Awansuj zadania do wyższych rang\\n• Użyj Prestiżu aby zresetować grę za Soft Skills\\n• Kup przedmioty biurkowe za Soft Skills\\n• Zdobywaj achievementy aby odblokować nowe funkcje\\n\\nWskazówki:\\n• Multi-buy i auto-kupowanie odblokują się przez achievementy\\n• Biurko stanie się dostępne po pierwszym soft skillu\\n• Każdy prestiż zwiększa przychód w następnym runie"
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
                    "upgrade": "Upgrade",
                    "ascend": "Promote",
                    "unlock": "Unlock",
                    "buy": "Buy",
                    "level": "Level",
                    "rank": "Rank",
                    "auto_buyer": "Auto-Buyer",
                    "multibuy": "Multi-buy",
                    "buy_max": "Buy max",
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
                    "ach_first_upgrade": "First upgrade",
                    "ach_first_unlock": "New task",
                    "ach_first_ascend": "First promotion",
                    "ach_first_prestige": "Soft Skills master",
                    "ach_multibuy_master": "Multi-buy expert",
                    "ach_first_upgrade_desc": "Upgrade your first task",
                    "ach_first_unlock_desc": "Unlock a new task",
                    "ach_first_ascend_desc": "Perform first promotion",
                    "ach_first_prestige_desc": "Perform first prestige",
                    "ach_multibuy_master_desc": "Buy 100 upgrades at once",
                    "help_content": "Welcome to Corporate Rat!\\n\\nGoal: Develop your corporate career by completing tasks and earning Office Points (BP).\\n\\nMechanics:\\n• Tasks generate BP automatically\\n• Upgrade tasks with BP to increase income\\n• Unlock new tasks by spending BP\\n• Ascend tasks to higher ranks\\n• Use Prestige to reset game for Soft Skills\\n• Buy desk items with Soft Skills\\n• Earn achievements to unlock new features\\n\\nTips:\\n• Multi-buy and auto-buyer unlock through achievements\\n• Desk becomes available after first soft skill\\n• Each prestige increases income in next run"
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
                    "Prześlij mi ten deck po meetingu"
                ],
                "en": [
                    "Let's do a quick catch-up after the daily standup",
                    "We need to deep-dive this in the next sprint planning",
                    "Let's wait for stakeholder feedback",
                    "This is very low-hanging fruit",
                    "We need more synergy in the team",
                    "Let's organize a brainstorming session",
                    "We need to analyze this once more",
                    "Send me that deck after the meeting"
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
            prestigeCount: 0,
            tasks: {
                email: { level: 1, progress: 0, unlocked: true, ascensions: 0 }
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
                totalUnlocks: 0,
                totalMultiBuys: 0,
                playTime: 0
            },
            features: {
                multiBuyUnlocked: false,
                autoBuyerUnlocked: false,
                maxBuyUnlocked: false,
                deskUnlocked: false
            }
        };

        try {
            const saved = localStorage.getItem('korposzczur-save');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...defaultState, ...parsed };
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
        this.renderAll();
        this.startGameLoop();
        this.startQuoteRotation();
        this.checkFeatureUnlocks();

        // Initialize debug commands
        window.debug = {
            addBP: (amount) => {
                this.gameState.bp += amount;
                this.updateDisplay();
            },
            addSS: (amount) => {
                this.gameState.softSkills += amount;
                this.updateDisplay();
            },
            unlockAll: () => {
                this.gameData.tasks.forEach(task => {
                    if (!this.gameState.tasks[task.id]) {
                        this.gameState.tasks[task.id] = { level: 1, progress: 0, unlocked: true, ascensions: 0 };
                    } else {
                        this.gameState.tasks[task.id].unlocked = true;
                    }
                });
                this.renderTasks();
            },
            reset: () => {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        };
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tab = e.target.getAttribute('data-tab');
                if (!e.target.classList.contains('disabled')) {
                    this.switchTab(tab);
                }
            });
        });

        // Settings modal
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');
        const settingsBackdrop = settingsModal.querySelector('.modal-backdrop');

        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            settingsModal.classList.remove('hidden');
        });

        const closeSettingsModal = () => {
            settingsModal.classList.add('hidden');
        };

        settingsClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettingsModal();
        });
        settingsBackdrop.addEventListener('click', closeSettingsModal);

        // Help modal
        const helpToggle = document.getElementById('help-toggle');
        const helpModal = document.getElementById('help-modal');
        const helpClose = document.getElementById('help-close');
        const helpBackdrop = helpModal.querySelector('.modal-backdrop');

        helpToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            helpModal.classList.remove('hidden');
        });

        const closeHelpModal = () => {
            helpModal.classList.add('hidden');
        };

        helpClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeHelpModal();
        });
        helpBackdrop.addEventListener('click', closeHelpModal);

        // Multi-buy buttons
        document.querySelectorAll('.multibuy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.multibuy-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.multiBuyAmount = e.target.getAttribute('data-amount');
            });
        });

        // Auto-buyer toggle
        const autoBuyerCheckbox = document.getElementById('autobuyer-checkbox');
        autoBuyerCheckbox.addEventListener('change', (e) => {
            e.stopPropagation();
            this.autoBuyerEnabled = e.target.checked;
            if (this.autoBuyerEnabled && !this.autoBuyerInterval) {
                this.startAutoBuyer();
            } else if (!this.autoBuyerEnabled && this.autoBuyerInterval) {
                this.stopAutoBuyer();
            }
        });

        // Language and theme selectors
        document.getElementById('language-select').addEventListener('change', (e) => {
            e.stopPropagation();
            this.gameState.settings.language = e.target.value;
            this.currentLanguage = e.target.value;
            this.updateLanguage();
            this.renderAll();
            this.saveGameState();
        });

        document.getElementById('theme-select').addEventListener('change', (e) => {
            e.stopPropagation();
            this.gameState.settings.theme = e.target.value;
            this.updateTheme();
            this.saveGameState();
        });

        // Reset save
        document.getElementById('reset-save').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to reset your save? This cannot be undone!')) {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        });

        // Prestige button
        document.getElementById('prestige-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.performPrestige();
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
    }

    checkFeatureUnlocks() {
        // Unlock desk tab after earning first soft skill
        if (this.gameState.softSkills > 0 && !this.gameState.features.deskUnlocked) {
            this.gameState.features.deskUnlocked = true;
            document.querySelector('[data-tab="desk"]').classList.remove('disabled');
        }

        // Unlock multi-buy after first upgrade achievement
        if (this.gameState.achievements.first_upgrade && !this.gameState.features.multiBuyUnlocked) {
            this.gameState.features.multiBuyUnlocked = true;
            document.getElementById('multibuy-controls').classList.remove('hidden');
        }

        // Unlock max buy after multibuy master achievement
        if (this.gameState.achievements.multibuy_master && !this.gameState.features.maxBuyUnlocked) {
            this.gameState.features.maxBuyUnlocked = true;
            document.querySelector('[data-amount="max"]').classList.remove('hidden');
        }

        // Unlock auto-buyer after buying autobuyer desk item
        if (this.gameState.deskItems.autobuyer && !this.gameState.features.autoBuyerUnlocked) {
            this.gameState.features.autoBuyerUnlocked = true;
            document.getElementById('autobuyer-controls').classList.remove('hidden');
        }
    }

    startAutoBuyer() {
        this.autoBuyerInterval = setInterval(() => {
            this.performAutoBuy();
        }, 1000); // Run every second
    }

    stopAutoBuyer() {
        if (this.autoBuyerInterval) {
            clearInterval(this.autoBuyerInterval);
            this.autoBuyerInterval = null;
        }
    }

    performAutoBuy() {
        if (!this.autoBuyerEnabled) return;

        // Find cheapest affordable upgrade
        let cheapestUpgrade = null;
        let cheapestCost = Infinity;

        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState.unlocked) return;

            const cost = this.calculateUpgradeCost(taskId);
            if (cost <= this.gameState.bp && cost < cheapestCost) {
                cheapestCost = cost;
                cheapestUpgrade = taskId;
            }
        });

        if (cheapestUpgrade) {
            this.upgradeTask(cheapestUpgrade);
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                if (key === 'help_content') {
                    el.textContent = translation.replace(/\\n/g, '\n');
                } else {
                    el.textContent = translation;
                }
            }
        });

        document.getElementById('language-select').value = this.currentLanguage;
        document.documentElement.lang = this.currentLanguage;
    }

    updateTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.gameState.settings.theme);
        document.getElementById('theme-select').value = this.gameState.settings.theme;
    }

    startGameLoop() {
        this.updateInterval = setInterval(() => {
            this.gameLoop();
        }, 50); // 20 FPS for smooth idle progress

        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000); // Auto-save every 30 seconds
    }

    startQuoteRotation() {
        const rotateQuote = () => {
            const quotes = this.gameData.quotes[this.currentLanguage];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote-text').textContent = randomQuote;
        };

        rotateQuote(); // Initial quote
        this.quoteInterval = setInterval(rotateQuote, 15000); // Change every 15 seconds
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // Update task progress and generate BP
        let totalBPGained = 0;
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState.unlocked) return;

            const taskData = this.gameData.tasks.find(t => t.id === taskId);
            if (!taskData) return;

            const idleRate = this.calculateTaskIdleRate(taskId);
            const progressIncrement = deltaTime / 1000; // Convert to seconds

            taskState.progress += progressIncrement;
            if (taskState.progress >= 1) {
                const cycles = Math.floor(taskState.progress);
                taskState.progress = taskState.progress % 1;
                totalBPGained += idleRate * cycles;
            }
        });

        if (totalBPGained > 0) {
            this.gameState.bp += totalBPGained;
            this.gameState.totalBPEarned += totalBPGained;
            this.updateDisplay();
        }

        // Check for new unlocks
        this.checkUnlocks();
        this.checkFeatureUnlocks();
        
        // Update UI periodically
        if (now - this.lastSave > 1000) { // Update UI every second
            this.updateTaskProgress();
            this.updateUnlockProgress();
            this.lastSave = now;
        }
    }

    calculateTaskIdleRate(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let rate = taskData.baseIdle * Math.pow(1.15, taskState.level - 1);
        
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

    checkUnlocks() {
        this.gameData.tasks.forEach(task => {
            if (!this.gameState.tasks[task.id] || !this.gameState.tasks[task.id].unlocked) {
                if (this.gameState.bp >= task.unlockCost) {
                    // Don't auto-unlock, just make it available for manual unlock
                }
            }
        });
    }

    unlockTask(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        if (!taskData) return;

        if (this.gameState.bp >= taskData.unlockCost) {
            this.gameState.bp -= taskData.unlockCost;
            
            if (!this.gameState.tasks[taskId]) {
                this.gameState.tasks[taskId] = { level: 1, progress: 0, unlocked: true, ascensions: 0 };
            } else {
                this.gameState.tasks[taskId].unlocked = true;
            }
            
            this.gameState.stats.totalUnlocks++;
            this.checkAchievement('first_unlock');
            this.renderTasks();
            this.updateDisplay();
        }
    }

    checkAchievement(achievementId) {
        if (this.gameState.achievements[achievementId]) return;

        const achievement = this.gameData.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        let unlocked = false;

        switch (achievementId) {
            case 'first_upgrade':
                unlocked = this.gameState.stats.totalUpgrades > 0;
                break;
            case 'first_unlock':
                unlocked = this.gameState.stats.totalUnlocks > 0;
                break;
            case 'first_ascend':
                unlocked = this.gameState.stats.totalAscensions > 0;
                break;
            case 'first_prestige':
                unlocked = this.gameState.prestigeCount > 0;
                break;
            case 'multibuy_master':
                unlocked = this.gameState.stats.totalMultiBuys >= 100;
                break;
        }

        if (unlocked) {
            this.gameState.achievements[achievementId] = true;
            this.renderAchievements();
            this.checkFeatureUnlocks();
            this.showNotification(`Achievement Unlocked: ${this.translations[this.currentLanguage][achievement.nameKey]}`);
        }
    }

    calculateMultiBuyCost(taskId, amount) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let totalCost = 0;
        let currentLevel = taskState.level;
        
        for (let i = 0; i < amount; i++) {
            let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);
            
            // Apply upgrade discount from desk items
            Object.keys(this.gameState.deskItems).forEach(itemId => {
                if (this.gameState.deskItems[itemId]) {
                    const item = this.gameData.deskItems.find(d => d.id === itemId);
                    if (item && item.bonus.type === 'upgrade_discount') {
                        cost *= item.bonus.value;
                    }
                }
            });
            
            totalCost += cost;
            currentLevel++;
        }
        
        return Math.floor(totalCost);
    }

    calculateMaxBuyAmount(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let amount = 0;
        let totalCost = 0;
        let currentLevel = taskState.level;
        
        while (totalCost <= this.gameState.bp && amount < 1000) { // Cap at 1000 to prevent infinite loops
            let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);
            
            // Apply upgrade discount from desk items
            Object.keys(this.gameState.deskItems).forEach(itemId => {
                if (this.gameState.deskItems[itemId]) {
                    const item = this.gameData.deskItems.find(d => d.id === itemId);
                    if (item && item.bonus.type === 'upgrade_discount') {
                        cost *= item.bonus.value;
                    }
                }
            });
            
            if (totalCost + cost <= this.gameState.bp) {
                totalCost += cost;
                amount++;
                currentLevel++;
            } else {
                break;
            }
        }
        
        return amount;
    }

    upgradeTask(taskId) {
        const amount = this.multiBuyAmount === 'max' ? this.calculateMaxBuyAmount(taskId) : parseInt(this.multiBuyAmount);
        if (amount === 0) return;

        const cost = this.multiBuyAmount === 'max' ? this.calculateMultiBuyCost(taskId, amount) : this.calculateMultiBuyCost(taskId, amount);
        
        if (this.gameState.bp >= cost) {
            this.gameState.bp -= cost;
            this.gameState.tasks[taskId].level += amount;
            this.gameState.stats.totalUpgrades += amount;
            
            if (amount >= 100) {
                this.gameState.stats.totalMultiBuys += amount;
                this.checkAchievement('multibuy_master');
            }
            
            this.checkAchievement('first_upgrade');
            this.renderTasks();
            this.updateDisplay();
        }
    }

    calculateUpgradeCost(taskId) {
        return this.calculateMultiBuyCost(taskId, 1);
    }

    ascendTask(taskId) {
        const taskState = this.gameState.tasks[taskId];
        if (taskState.level < 10) return;

        taskState.level = 1;
        taskState.ascensions++;
        taskState.progress = 0;
        this.gameState.stats.totalAscensions++;
        this.checkAchievement('first_ascend');
        this.renderTasks();
    }

    performPrestige() {
        if (this.gameState.totalBPEarned < 1000000) return;

        const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / 1000000));
        
        // Reset game state but keep achievements and desk items
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const featuresState = { ...this.gameState.features };

        this.gameState = this.loadGameState();
        this.gameState.softSkills += softSkillsGain;
        this.gameState.prestigeCount++;
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.features = featuresState;

        this.checkAchievement('first_prestige');
        this.checkFeatureUnlocks();
        this.renderAll();
        this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skills!`);
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId] || this.gameState.softSkills < item.cost) return;

        this.gameState.softSkills -= item.cost;
        this.gameState.deskItems[itemId] = true;
        this.checkFeatureUnlocks();
        this.renderDeskShop();
        this.renderDesk();
        this.updateDisplay();
    }

    renderAll() {
        this.renderTasks();
        this.renderDeskShop();
        this.renderDesk();
        this.renderAchievements();
        this.updateDisplay();
        this.updateUnlockProgress();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        this.gameData.tasks.forEach(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            
            if (!taskState || !taskState.unlocked) {
                // Show unlock button if player can afford it
                if (this.gameState.bp >= taskData.unlockCost) {
                    const unlockBtn = document.createElement('div');
                    unlockBtn.className = `unlock-task-btn`;
                    unlockBtn.innerHTML = `
                        <div>${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                        <div>${this.translations[this.currentLanguage].unlock} (${this.formatNumber(taskData.unlockCost)} BP)</div>
                    `;
                    unlockBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.unlockTask(taskData.id);
                    });
                    container.appendChild(unlockBtn);
                }
                return;
            }

            const taskCard = this.createTaskCard(taskData, taskState);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(taskData, taskState) {
        const card = document.createElement('div');
        card.className = 'task-card';
        
        const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
        const idleRate = this.calculateTaskIdleRate(taskData.id);
        const buyAmount = this.multiBuyAmount === 'max' ? this.calculateMaxBuyAmount(taskData.id) : parseInt(this.multiBuyAmount);
        const upgradeCost = this.calculateMultiBuyCost(taskData.id, buyAmount);
        const canUpgrade = this.gameState.bp >= upgradeCost && buyAmount > 0;
        const canAscend = taskState.level >= 10;

        card.innerHTML = `
            <div class="task-header">
                <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                <div class="task-rank">${rank}</div>
            </div>
            
            <div class="hex-progress">
                <svg viewBox="0 0 60 52">
                    <polygon class="hex-bg" points="30,2 52,15 52,37 30,50 8,37 8,15" stroke-dasharray="140"/>
                    <polygon class="hex-fill" points="30,2 52,15 52,37 30,50 8,37 8,15" 
                             stroke-dasharray="${140 * taskState.progress}, 140"/>
                </svg>
                <div class="hex-text">${Math.floor(taskState.progress * 100)}%</div>
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
            </div>
            
            <div class="task-actions">
                <button class="btn ${canUpgrade ? 'btn--primary' : 'btn--secondary disabled'}" 
                        data-task-id="${taskData.id}" data-action="upgrade" ${!canUpgrade ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].upgrade} ${buyAmount > 1 ? `(${buyAmount}x)` : ''} (${this.formatNumber(upgradeCost)})
                </button>
                <button class="btn ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}" 
                        data-task-id="${taskData.id}" data-action="ascend" ${!canAscend ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].ascend}
                </button>
            </div>
        `;

        // Add event listeners to task action buttons
        const upgradeBtn = card.querySelector('[data-action="upgrade"]');
        const ascendBtn = card.querySelector('[data-action="ascend"]');
        
        if (upgradeBtn && !upgradeBtn.disabled) {
            upgradeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.upgradeTask(taskData.id);
            });
        }
        
        if (ascendBtn && !ascendBtn.disabled) {
            ascendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.ascendTask(taskData.id);
            });
        }

        return card;
    }

    renderDeskShop() {
        const container = document.getElementById('shop-items');
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
                </div>
                <button class="btn btn--sm ${canBuy ? 'btn--primary' : 'btn--secondary disabled'}" 
                        data-item-id="${item.id}" ${!canBuy ? 'disabled' : ''}>
                    ${owned ? '✓' : this.translations[this.currentLanguage].buy}
                </button>
            `;

            const buyBtn = shopItem.querySelector('button');
            if (buyBtn && !buyBtn.disabled) {
                buyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.buyDeskItem(item.id);
                });
            }

            container.appendChild(shopItem);
        });
    }

    renderDesk() {
        const itemsGroup = document.getElementById('desk-items');
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
                    item.innerHTML = `<rect x="70" y="130" width="20" height="15" fill="#2c3e50" rx="2"/>
                                     <rect x="72" y="132" width="16" height="11" fill="#3498db" rx="1"/>`;
                    break;
                case 'autobuyer':
                    item.innerHTML = `<circle cx="350" cy="140" r="10" fill="#FFD700"/>
                                     <circle cx="350" cy="140" r="6" fill="#FFA500"/>`;
                    break;
            }
            
            itemsGroup.appendChild(item);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
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
                </div>
            `;

            container.appendChild(achievementEl);
        });
    }

    updateDisplay() {
        document.getElementById('bp-display').textContent = this.formatNumber(Math.floor(this.gameState.bp));
        document.getElementById('ss-display').textContent = Math.floor(this.gameState.softSkills);

        // Update prestige button
        const canPrestige = this.gameState.totalBPEarned >= 1000000;
        const prestigeBtn = document.getElementById('prestige-btn');
        const prestigeInfo = document.getElementById('prestige-info');
        
        prestigeBtn.disabled = !canPrestige;
        if (canPrestige) {
            const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / 1000000));
            prestigeInfo.textContent = `Gain ${softSkillsGain} Soft Skills`;
            prestigeBtn.classList.remove('disabled');
        } else {
            prestigeInfo.textContent = 'Requires 1,000,000 total BP earned';
            prestigeBtn.classList.add('disabled');
        }
    }

    updateTaskProgress() {
        document.querySelectorAll('.hex-fill').forEach((fill, index) => {
            const tasks = Object.keys(this.gameState.tasks).filter(taskId => 
                this.gameState.tasks[taskId].unlocked
            );
            const taskId = tasks[index];
            if (taskId) {
                const taskState = this.gameState.tasks[taskId];
                const progress = taskState.progress * 140;
                fill.setAttribute('stroke-dasharray', `${progress}, 140`);
                
                const textEl = fill.parentElement.nextElementSibling;
                if (textEl) {
                    textEl.textContent = `${Math.floor(taskState.progress * 100)}%`;
                }
            }
        });
    }

    updateUnlockProgress() {
        const nextTask = this.gameData.tasks.find(task => {
            const taskState = this.gameState.tasks[task.id];
            return !taskState || !taskState.unlocked;
        });

        if (nextTask) {
            const progress = Math.min(this.gameState.bp / nextTask.unlockCost, 1);
            const progressBar = document.getElementById('unlock-progress');
            progressBar.style.width = `${progress * 100}%`;
        } else {
            const progressBar = document.getElementById('unlock-progress');
            progressBar.style.width = '100%';
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
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-surface);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.quoteInterval) clearInterval(this.quoteInterval);
        if (this.autoBuyerInterval) clearInterval(this.autoBuyerInterval);
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

// Add some CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);