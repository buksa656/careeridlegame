// Enhanced Game State Management for Corporate Rat Idle

class GameStateManager {
    constructor() {
        this.initializeState();
        this.loadGame();
        this.setupAutoSave();
        this.bindEvents();
    }

    initializeState() {
        this.state = {
            // Core currencies
            officePoints: 0,
            infinityPoints: 0,
            totalOfficePoints: 0,
            totalInfinityPoints: 0,

            // Progression tracking
            infinities: 0,
            totalInfinities: 0,
            bestInfinityTime: null,
            currentInfinityStartTime: Date.now(),

            // Tasks state - will be initialized from GameData
            tasks: {},
            taskCompletions: {},

            // Upgrades and unlocks
            deskUpgrades: {},
            achievements: {},
            challengeProgress: {},

            // Automation settings
            automation: {
                enabled: false,
                autoClicker: false,
                autoUpgrade: false,
                autoInfinity: false,
                
                // Timing settings
                autoClickInterval: 1000, // 1 second
                autoUpgradeInterval: 2000, // 2 seconds
                autoInfinityMinTime: 30000 // 30 seconds minimum between infinities
            },

            // Time tracking
            gameStartTime: Date.now(),
            lastSaveTime: Date.now(),
            totalPlayTime: 0,
            lastTickTime: Date.now(),

            // Statistics
            stats: {
                clicksMade: 0,
                upgradesPurchased: 0,
                tasksUnlocked: 0,
                deskUpgradesBought: 0,
                challengesCompleted: 0,
                totalTaskCompletions: 0,
                fastestInfinity: null,
                automationTime: 0
            },

            // Current game state flags
            currentChallenge: null,
            inChallenge: false,
            challengeStartTime: null,
            preChallengeState: null,

            // Settings
            settings: {
                theme: 'auto',
                language: 'en',
                showFloatingNumbers: true,
                pauseOnBlur: false
            },

            // Version for save compatibility
            version: GameData.version
        };

        this.initializeTaskStates();
        this.initializeAchievements();
        this.initializeDeskUpgrades();
        this.initializeChallenges();
    }

    initializeTaskStates() {
        GameData.tasks.forEach(task => {
            this.state.tasks[task.id] = {
                unlocked: task.unlockCost === 0,
                level: 0,
                progress: 0,
                isActive: false,
                totalCompletions: 0,
                automated: false
            };
            this.state.taskCompletions[task.id] = 0;
        });
    }

    initializeAchievements() {
        GameData.achievements.forEach(achievement => {
            this.state.achievements[achievement.id] = {
                unlocked: false,
                unlockedAt: null
            };
        });
    }

    initializeDeskUpgrades() {
        GameData.deskUpgrades.forEach(upgrade => {
            this.state.deskUpgrades[upgrade.id] = {
                owned: false,
                purchasedAt: null
            };
        });
    }

    initializeChallenges() {
        GameData.challenges.forEach(challenge => {
            this.state.challengeProgress[challenge.id] = {
                attempted: false,
                completed: false,
                bestTime: null
            };
        });
    }

    // Save/Load System
    saveGame() {
        try {
            this.state.lastSaveTime = Date.now();
            this.state.totalPlayTime += Date.now() - this.state.gameStartTime;
            
            const saveData = {
                state: this.state,
                timestamp: Date.now(),
                version: this.state.version
            };

            const compressed = this.compressSave(saveData);
            localStorage.setItem('corporateRatIdle_save', compressed);
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            this.showNotification('error', 'Failed to save game!');
            return false;
        }
    }

    loadGame() {
        try {
            const saveData = localStorage.getItem('corporateRatIdle_save');
            if (!saveData) return false;

            const decompressed = this.decompressSave(saveData);
            const parsed = JSON.parse(decompressed);

            // Version compatibility check
            if (!parsed.version || parsed.version !== this.state.version) {
                console.warn('Save version mismatch, applying migration...');
                this.migrateSave(parsed);
            } else {
                // Merge loaded state with default state
                this.state = this.deepMerge(this.state, parsed.state);
            }

            // Handle offline progression
            this.handleOfflineProgression(parsed.timestamp);
            
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            this.showNotification('error', 'Failed to load save data!');
            return false;
        }
    }

    compressSave(saveData) {
        // Simple compression by removing unnecessary whitespace and rounding numbers
        const json = JSON.stringify(saveData, (key, value) => {
            if (typeof value === 'number' && !Number.isInteger(value)) {
                return Math.round(value * 1000) / 1000; // Round to 3 decimal places
            }
            return value;
        });
        return btoa(json); // Base64 encode
    }

    decompressSave(compressed) {
        return atob(compressed); // Base64 decode
    }

    migrateSave(oldSave) {
        console.log('Migrating save from version', oldSave.version, 'to', this.state.version);
        // For now, merge what we can and reset the rest
        if (oldSave.state) {
            // Preserve core progress
            if (oldSave.state.officePoints) this.state.officePoints = oldSave.state.officePoints;
            if (oldSave.state.infinityPoints) this.state.infinityPoints = oldSave.state.infinityPoints;
            if (oldSave.state.infinities) this.state.infinities = oldSave.state.infinities;
            if (oldSave.state.stats) this.state.stats = { ...this.state.stats, ...oldSave.state.stats };
            
            // Migrate tasks if structure is compatible
            if (oldSave.state.tasks) {
                Object.keys(oldSave.state.tasks).forEach(taskId => {
                    if (this.state.tasks[taskId]) {
                        this.state.tasks[taskId] = { ...this.state.tasks[taskId], ...oldSave.state.tasks[taskId] };
                    }
                });
            }
        }
    }

    handleOfflineProgression(lastSaveTime) {
        if (!lastSaveTime) return;

        const offlineTime = Date.now() - lastSaveTime;
        const maxOfflineTime = GameData.config.maxOfflineHours * 3600 * 1000;
        const effectiveOfflineTime = Math.min(offlineTime, maxOfflineTime);

        if (effectiveOfflineTime > 60000 && this.state.automation.enabled) { // Minimum 1 minute offline
            const offlineGain = this.calculateOfflineGain(effectiveOfflineTime);
            if (offlineGain > 0) {
                this.state.officePoints += offlineGain;
                this.state.totalOfficePoints += offlineGain;
                
                const offlineHours = Math.floor(effectiveOfflineTime / 3600000);
                const offlineMinutes = Math.floor((effectiveOfflineTime % 3600000) / 60000);
                
                let timeStr = '';
                if (offlineHours > 0) timeStr += `${offlineHours}h `;
                if (offlineMinutes > 0) timeStr += `${offlineMinutes}m`;
                
                this.showNotification('success', `Welcome back! You earned ${Lang.formatNumber(offlineGain)} office points while away for ${timeStr}.`);
            }
        }
    }

    calculateOfflineGain(timeMs) {
        let totalGain = 0;
        const multipliers = this.getMultipliers();

        Object.keys(this.state.tasks).forEach(taskId => {
            const task = this.state.tasks[taskId];
            if (task.unlocked && task.automated && task.level > 0) {
                const gameTask = GameData.getTaskById(taskId);
                if (gameTask) {
                    const production = GameData.calculateTaskProduction(taskId, task.level, multipliers);
                    const cyclesPerSecond = 1000 / gameTask.cycleTime;
                    const totalCycles = (timeMs / 1000) * cyclesPerSecond;
                    totalGain += production * totalCycles * GameData.config.offlineEfficiency;
                }
            }
        });

        return Math.floor(totalGain);
    }

    setupAutoSave() {
        setInterval(() => {
            this.saveGame();
        }, GameData.config.autoSaveInterval);

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        // Save when page loses focus (mobile/tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveGame();
            }
        });
    }

    // State modification methods
    addOfficePoints(amount) {
        if (amount <= 0) return;
        
        this.state.officePoints += amount;
        this.state.totalOfficePoints += amount;
        
        this.checkTaskUnlocks();
        this.checkAchievements();
        this.checkInfinityAvailability();
    }

    spendOfficePoints(amount) {
        if (this.state.officePoints >= amount) {
            this.state.officePoints -= amount;
            return true;
        }
        return false;
    }

    addInfinityPoints(amount) {
        if (amount <= 0) return;
        
        this.state.infinityPoints += amount;
        this.state.totalInfinityPoints += amount;
        
        this.checkAchievements();
    }

    spendInfinityPoints(amount) {
        if (this.state.infinityPoints >= amount) {
            this.state.infinityPoints -= amount;
            return true;
        }
        return false;
    }

    unlockTask(taskId) {
        const task = this.state.tasks[taskId];
        if (task && !task.unlocked) {
            task.unlocked = true;
            this.state.stats.tasksUnlocked++;
            this.showNotification('success', `${Lang.get(taskId)} ${Lang.get('task-unlocked')}`);
            this.checkAchievements();
            return true;
        }
        return false;
    }

    upgradeTask(taskId) {
        const task = this.state.tasks[taskId];
        const gameTask = GameData.getTaskById(taskId);
        
        if (task && gameTask && task.level < gameTask.maxLevel) {
            const cost = GameData.calculateTaskCost(taskId, task.level);
            if (this.spendOfficePoints(cost)) {
                task.level++;
                this.state.stats.upgradesPurchased++;
                this.checkAchievements();
                return true;
            }
        }
        return false;
    }

    purchaseDeskUpgrade(upgradeId) {
        const upgrade = GameData.getDeskUpgradeById(upgradeId);
        const state = this.state.deskUpgrades[upgradeId];
        
        if (upgrade && state && !state.owned) {
            if (this.spendInfinityPoints(upgrade.cost)) {
                state.owned = true;
                state.purchasedAt = Date.now();
                this.state.stats.deskUpgradesBought++;
                this.showNotification('success', `${Lang.get(upgradeId)} purchased!`);
                this.checkAchievements();
                return true;
            }
        }
        return false;
    }

    completeTask(taskId) {
        const task = this.state.tasks[taskId];
        if (task) {
            task.totalCompletions++;
            this.state.taskCompletions[taskId]++;
            this.state.stats.totalTaskCompletions++;
            this.checkAchievements();
        }
    }

    performInfinity() {
        if (!this.canPerformInfinity()) return 0;

        const infinityGain = GameData.calculateInfinityPoints(this.state.officePoints);
        const infinityTime = Date.now() - this.state.currentInfinityStartTime;
        
        // Track best infinity time
        if (!this.state.stats.fastestInfinity || infinityTime < this.state.stats.fastestInfinity) {
            this.state.stats.fastestInfinity = infinityTime;
        }

        this.addInfinityPoints(infinityGain);
        this.state.infinities++;
        this.state.totalInfinities++;
        
        // Reset pre-infinity progress
        this.resetForInfinity();
        
        this.showNotification('success', `${Lang.get('infinity-reached')} +${Lang.formatNumber(infinityGain)} IP`);
        this.checkAchievements();
        
        return infinityGain;
    }

    resetForInfinity() {
        // Reset currencies
        this.state.officePoints = 0;
        this.state.currentInfinityStartTime = Date.now();

        // Reset tasks
        Object.keys(this.state.tasks).forEach(taskId => {
            const task = this.state.tasks[taskId];
            const gameTask = GameData.getTaskById(taskId);
            
            task.level = 0;
            task.progress = 0;
            task.isActive = false;
            task.automated = false;
            task.unlocked = gameTask && gameTask.unlockCost === 0;
        });

        // Reset task completions (but not total completions)
        Object.keys(this.state.taskCompletions).forEach(taskId => {
            this.state.taskCompletions[taskId] = 0;
        });

        // Enable automation if we have enough infinities
        if (this.state.infinities >= 1 && !this.state.automation.enabled) {
            this.state.automation.enabled = true;
            this.showNotification('success', Lang.get('automation-unlocked'));
        }
    }

    canPerformInfinity() {
        return this.state.officePoints >= GameData.config.firstInfinityThreshold;
    }

    checkInfinityAvailability() {
        const infinitySection = document.getElementById('infinity-section');
        const infinityGainElement = document.getElementById('infinity-gain');
        
        if (infinitySection) {
            if (this.canPerformInfinity()) {
                infinitySection.classList.remove('hidden');
                if (infinityGainElement) {
                    const gain = GameData.calculateInfinityPoints(this.state.officePoints);
                    infinityGainElement.textContent = Lang.formatNumber(gain);
                }
            } else {
                infinitySection.classList.add('hidden');
            }
        }
    }

    checkTaskUnlocks() {
        GameData.tasks.forEach(gameTask => {
            const task = this.state.tasks[gameTask.id];
            if (task && !task.unlocked && this.state.officePoints >= gameTask.unlockCost) {
                this.unlockTask(gameTask.id);
            }
        });
    }

    getMultipliers() {
        let multipliers = { all: 1 };

        // Apply desk upgrade effects
        Object.keys(this.state.deskUpgrades).forEach(upgradeId => {
            const state = this.state.deskUpgrades[upgradeId];
            const upgrade = GameData.getDeskUpgradeById(upgradeId);
            
            if (state && state.owned && upgrade) {
                if (upgrade.effect.type === 'multiplier') {
                    if (upgrade.effect.target === 'all') {
                        multipliers.all *= upgrade.effect.value;
                    } else {
                        multipliers[upgrade.effect.target] = (multipliers[upgrade.effect.target] || 1) * upgrade.effect.value;
                    }
                }
            }
        });

        // Apply achievement effects
        Object.keys(this.state.achievements).forEach(achievementId => {
            const state = this.state.achievements[achievementId];
            const achievement = GameData.getAchievementById(achievementId);
            
            if (state && state.unlocked && achievement) {
                if (achievement.reward.type === 'multiplier' || achievement.reward.type === 'efficiency') {
                    if (achievement.reward.target === 'all') {
                        multipliers.all *= achievement.reward.value;
                    } else {
                        multipliers[achievement.reward.target] = (multipliers[achievement.reward.target] || 1) * achievement.reward.value;
                    }
                }
            }
        });

        return multipliers;
    }

    checkAchievements() {
        GameData.achievements.forEach(achievement => {
            const state = this.state.achievements[achievement.id];
            if (state && !state.unlocked && this.isAchievementRequirementMet(achievement)) {
                state.unlocked = true;
                state.unlockedAt = Date.now();
                this.showNotification('success', `${Lang.get('achievement-unlocked')} ${Lang.get(achievement.id)}!`);
            }
        });
    }

    isAchievementRequirementMet(achievement) {
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'officePoints':
                return this.state.officePoints >= req.value;
            
            case 'taskCompletions':
                if (req.target === 'all') {
                    return Object.values(this.state.taskCompletions).reduce((sum, count) => sum + count, 0) >= req.value;
                } else {
                    return (this.state.taskCompletions[req.target] || 0) >= req.value;
                }
            
            case 'infinities':
                return this.state.infinities >= req.value;
            
            case 'totalPointsEarned':
                return this.state.totalOfficePoints >= req.value;
            
            case 'deskUpgradesBought':
                return this.state.stats.deskUpgradesBought >= req.value;
            
            case 'challengesCompleted':
                return this.state.stats.challengesCompleted >= req.value;
            
            case 'allTasksAutomated':
                return Object.values(this.state.tasks).every(task => !task.unlocked || task.automated);
            
            default:
                return false;
        }
    }

    showNotification(type, message) {
        const notifications = document.getElementById('notifications');
        if (!notifications) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    bindEvents() {
        // Export save
        const exportBtn = document.getElementById('export-save');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSave();
            });
        }

        // Import save
        const importBtn = document.getElementById('import-save');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                document.getElementById('import-modal').classList.remove('hidden');
            });
        }

        // Confirm import
        const confirmImport = document.getElementById('confirm-import');
        if (confirmImport) {
            confirmImport.addEventListener('click', () => {
                const textarea = document.getElementById('import-textarea');
                if (textarea && textarea.value.trim()) {
                    this.importSave(textarea.value.trim());
                    document.getElementById('import-modal').classList.add('hidden');
                    textarea.value = '';
                }
            });
        }

        // Reset game
        const resetBtn = document.getElementById('reset-game');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm(Lang.get('confirm-reset'))) {
                    this.resetGame();
                }
            });
        }

        // Theme switching
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.state.settings.theme;
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        // Modal close functionality
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    exportSave() {
        try {
            this.saveGame();
            const saveData = localStorage.getItem('corporateRatIdle_save');
            if (saveData) {
                navigator.clipboard.writeText(saveData).then(() => {
                    this.showNotification('success', Lang.get('save-exported'));
                }).catch(() => {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = saveData;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    this.showNotification('success', Lang.get('save-exported'));
                });
            }
        } catch (error) {
            console.error('Failed to export save:', error);
            this.showNotification('error', 'Failed to export save data!');
        }
    }

    importSave(encodedData) {
        try {
            const decoded = this.decompressSave(encodedData);
            const saveData = JSON.parse(decoded);

            // Validate save data structure
            if (!saveData.state || !saveData.timestamp) {
                throw new Error('Invalid save data structure');
            }

            // Backup current save
            const currentSave = localStorage.getItem('corporateRatIdle_save');
            if (currentSave) {
                localStorage.setItem('corporateRatIdle_save_backup', currentSave);
            }

            // Import new save
            localStorage.setItem('corporateRatIdle_save', encodedData);
            
            // Reload the game state
            this.initializeState();
            this.loadGame();
            
            this.showNotification('success', Lang.get('save-imported'));
            
            // Refresh the UI
            if (window.UIManager) {
                window.UIManager.forceFullRefresh();
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            this.showNotification('error', Lang.get('invalid-save'));
            return false;
        }
    }

    resetGame() {
        localStorage.removeItem('corporateRatIdle_save');
        localStorage.removeItem('corporateRatIdle_save_backup');
        this.showNotification('success', Lang.get('game-reset'));
        
        // Reload the page after a short delay
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    setTheme(theme) {
        this.state.settings.theme = theme;
        const root = document.documentElement;
        
        if (theme === 'auto') {
            root.removeAttribute('data-color-scheme');
        } else {
            root.setAttribute('data-color-scheme', theme);
        }
    }

    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    // Getters for easy access
    get officePoints() { return this.state.officePoints; }
    get infinityPoints() { return this.state.infinityPoints; }
    get infinities() { return this.state.infinities; }
    get tasks() { return this.state.tasks; }
    get achievements() { return this.state.achievements; }
    get deskUpgrades() { return this.state.deskUpgrades; }
    get stats() { return this.state.stats; }
    get automation() { return this.state.automation; }
}

// Initialize global game state
window.GameState = new GameStateManager();