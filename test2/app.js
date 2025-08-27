// Korposzczur - Corporate Idle Game
// Main game logic and state management

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
        
        this.init();
    }

    initializeGameData() {
        return {
            "tasks": [
                {"id": "email", "nameKey": "task_email", "baseCost": 0, "baseIdle": 1, "unlockCost": 0},
                {"id": "coffee", "nameKey": "task_coffee", "baseCost": 15, "baseIdle": 2, "unlockCost": 50},
                {"id": "meeting", "nameKey": "task_meeting", "baseCost": 100, "baseIdle": 8, "unlockCost": 300},
                {"id": "kpi", "nameKey": "task_kpi", "baseCost": 1000, "baseIdle": 47, "unlockCost": 2000},
                {"id": "brainstorm", "nameKey": "task_brainstorm", "baseCost": 11000, "baseIdle": 260, "unlockCost": 20000},
                {"id": "optimize", "nameKey": "task_optimize", "baseCost": 120000, "baseIdle": 1400, "unlockCost": 200000}
            ],
            "achievements": [
                {"id": "first_upgrade", "nameKey": "ach_first_upgrade", "descKey": "ach_first_upgrade_desc", "reward": "multibuy"},
                {"id": "first_unlock", "nameKey": "ach_first_unlock", "descKey": "ach_first_unlock_desc", "reward": "bp_bonus"},
                {"id": "first_ascend", "nameKey": "ach_first_ascend", "descKey": "ach_first_ascend_desc", "reward": "ascend_bonus"},
                {"id": "first_prestige", "nameKey": "ach_first_prestige", "descKey": "ach_first_prestige_desc", "reward": "prestige_bonus"}
            ],
            "deskItems": [
                {"id": "mug", "nameKey": "desk_mug", "cost": 1, "bonus": {"type": "global_mult", "value": 1.1}},
                {"id": "monitor", "nameKey": "desk_monitor", "cost": 5, "bonus": {"type": "idle_mult", "value": 1.2}},
                {"id": "plant", "nameKey": "desk_plant", "cost": 10, "bonus": {"type": "upgrade_discount", "value": 0.95}},
                {"id": "mousepad", "nameKey": "desk_mousepad", "cost": 25, "bonus": {"type": "prestige_mult", "value": 1.15}},
                {"id": "lamp", "nameKey": "desk_lamp", "cost": 50, "bonus": {"type": "ascend_bonus", "value": 1.1}}
            ],
            "translations": {
                "pl": {
                    "game_title": "Korposzczur",
                    "biuro_punkty": "Biuro-Punkty",
                    "soft_skills": "Soft Skills",
                    "achievements": "Achievementy",
                    "settings": "Ustawienia",
                    "prestige": "Prestiż",
                    "upgrade": "Ulepsz",
                    "ascend": "Awansuj",
                    "buy": "Kup",
                    "level": "Poziom",
                    "rank": "Ranga",
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
                    "desk_lamp": "Lampka LED",
                    "ach_first_upgrade": "Pierwsze ulepszenie",
                    "ach_first_unlock": "Nowy task",
                    "ach_first_ascend": "Pierwszy awans",
                    "ach_first_prestige": "Soft Skills master",
                    "ach_first_upgrade_desc": "Ulepsz pierwsze zadanie",
                    "ach_first_unlock_desc": "Odblokuj nowe zadanie",
                    "ach_first_ascend_desc": "Wykonaj pierwszy awans",
                    "ach_first_prestige_desc": "Wykonaj pierwszy prestiż"
                },
                "en": {
                    "game_title": "Corporate Rat",
                    "biuro_punkty": "Office Points",
                    "soft_skills": "Soft Skills", 
                    "achievements": "Achievements",
                    "settings": "Settings",
                    "prestige": "Prestige",
                    "upgrade": "Upgrade",
                    "ascend": "Promote",
                    "buy": "Buy",
                    "level": "Level",
                    "rank": "Rank",
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
                    "desk_lamp": "LED lamp",
                    "ach_first_upgrade": "First upgrade",
                    "ach_first_unlock": "New task",
                    "ach_first_ascend": "First promotion", 
                    "ach_first_prestige": "Soft Skills master",
                    "ach_first_upgrade_desc": "Upgrade your first task",
                    "ach_first_unlock_desc": "Unlock a new task",
                    "ach_first_ascend_desc": "Perform first promotion",
                    "ach_first_prestige_desc": "Perform first prestige"
                }
            },
            "quotes": {
                "pl": [
                    "Zrobimy szybki catch-up po daily standup-ie",
                    "Musimy to deep-dive'ować na najbliższym sprint planning'u",
                    "Poczekajmy na feedback od stakeholderów",
                    "To jest bardzo low-hanging fruit",
                    "Potrzebujemy więcej synergii w teamie"
                ],
                "en": [
                    "Let's do a quick catch-up after the daily standup",
                    "We need to deep-dive this in the next sprint planning",
                    "Let's wait for stakeholder feedback",
                    "This is very low-hanging fruit",
                    "We need more synergy in the team"
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
                playTime: 0
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
        // Settings modal
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');
        const modalBackdrop = settingsModal.querySelector('.modal-backdrop');

        settingsToggle.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });

        const closeModal = () => {
            settingsModal.classList.add('hidden');
        };

        settingsClose.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);

        // Language and theme selectors
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.gameState.settings.language = e.target.value;
            this.currentLanguage = e.target.value;
            this.updateLanguage();
            this.renderAll();
            this.saveGameState();
        });

        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.gameState.settings.theme = e.target.value;
            this.updateTheme();
            this.saveGameState();
        });

        // Reset save
        document.getElementById('reset-save').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your save? This cannot be undone!')) {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        });

        // Prestige button
        document.getElementById('prestige-btn').addEventListener('click', () => {
            this.performPrestige();
        });

        // Achievements toggle
        const achievementsToggle = document.getElementById('achievements-toggle');
        const achievementsList = document.getElementById('achievements-list');

        achievementsToggle.addEventListener('click', () => {
            achievementsToggle.classList.toggle('collapsed');
            achievementsList.classList.toggle('collapsed');
        });
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
                    if (!this.gameState.tasks[task.id]) {
                        this.gameState.tasks[task.id] = { level: 1, progress: 0, unlocked: false, ascensions: 0 };
                    }
                    this.gameState.tasks[task.id].unlocked = true;
                    this.renderTasks();
                    this.checkAchievement('first_unlock');
                }
            }
        });
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
                unlocked = Object.values(this.gameState.tasks).filter(t => t.unlocked).length > 1;
                break;
            case 'first_ascend':
                unlocked = this.gameState.stats.totalAscensions > 0;
                break;
            case 'first_prestige':
                unlocked = this.gameState.prestigeCount > 0;
                break;
        }

        if (unlocked) {
            this.gameState.achievements[achievementId] = true;
            this.renderAchievements();
            this.showNotification(`Achievement Unlocked: ${this.translations[this.currentLanguage][achievement.nameKey]}`);
        }
    }

    upgradeTask(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        const cost = this.calculateUpgradeCost(taskId);
        if (this.gameState.bp >= cost) {
            this.gameState.bp -= cost;
            taskState.level++;
            this.gameState.stats.totalUpgrades++;
            this.checkAchievement('first_upgrade');
            this.renderTasks();
            this.updateDisplay();
        }
    }

    calculateUpgradeCost(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let cost = taskData.baseCost * Math.pow(1.15, taskState.level);
        
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

        this.gameState = this.loadGameState();
        this.gameState.softSkills += softSkillsGain;
        this.gameState.prestigeCount++;
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;

        this.checkAchievement('first_prestige');
        this.renderAll();
        this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skills!`);
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId] || this.gameState.softSkills < item.cost) return;

        this.gameState.softSkills -= item.cost;
        this.gameState.deskItems[itemId] = true;
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
            if (!taskState || !taskState.unlocked) return;

            const taskCard = this.createTaskCard(taskData, taskState);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(taskData, taskState) {
        const card = document.createElement('div');
        card.className = 'task-card';
        
        const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
        const idleRate = this.calculateTaskIdleRate(taskData.id);
        const upgradeCost = this.calculateUpgradeCost(taskData.id);
        const canUpgrade = this.gameState.bp >= upgradeCost;
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
                        onclick="game.upgradeTask('${taskData.id}')" ${!canUpgrade ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].upgrade} (${this.formatNumber(upgradeCost)})
                </button>
                <button class="btn ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}" 
                        onclick="game.ascendTask('${taskData.id}')" ${!canAscend ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].ascend}
                </button>
            </div>
        `;

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
                        onclick="game.buyDeskItem('${item.id}')" ${!canBuy ? 'disabled' : ''}>
                    ${owned ? '✓' : this.translations[this.currentLanguage].buy}
                </button>
            `;

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
                case 'lamp':
                    item.innerHTML = `<line x1="80" y1="140" x2="80" y2="120" stroke="#333" stroke-width="3"/>
                                     <circle cx="80" cy="118" r="8" fill="#FFD700"/>`;
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
            const taskId = Object.keys(this.gameState.tasks)[index];
            const taskState = this.gameState.tasks[taskId];
            if (taskState && taskState.unlocked) {
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