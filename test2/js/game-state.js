// Game State Management
class GameState {
    constructor() {
        this.initializeState();
        this.loadGame();
        this.setupAutoSave();
    }
    
    initializeState() {
        this.state = {
            // Core currencies
            officePoints: 0,
            infinityPoints: 0,
            softSkills: 0,
            
            // Tasks state
            tasks: {},
            taskCompletions: {},
            
            // Progression tracking
            infinities: 0,
            totalOfficePoints: 0,
            totalInfinityPoints: 0,
            
            // Upgrades and unlocks
            deskUpgrades: {},
            achievements: {},
            challengeProgress: {},
            completedChallenges: {},
            
            // Settings and automation
            automation: {
                enabled: false,
                autoClicker: false,
                autoUpgrade: false,
                autoInfinity: false
            },
            
            // Time tracking
            gameStartTime: Date.now(),
            lastSaveTime: Date.now(),
            totalPlayTime: 0,
            
            // Statistics
            stats: {
                clicksMade: 0,
                upgradesPurchased: 0,
                tasksUnlocked: 0,
                deskUpgradesBought: 0,
                challengesCompleted: 0,
                automationTime: 0
            },
            
            // Current state flags
            currentChallenge: null,
            inChallenge: false,
            
            // Version for save compatibility
            version: '1.0.0'
        };
        
        // Initialize task states
        GameData.tasks.forEach(task => {
            this.state.tasks[task.id] = {
                unlocked: task.unlockCost === 0,
                level: 0,
                progress: 0,
                isActive: false,
                totalCompletions: 0,
                timers: null
            };
            this.state.taskCompletions[task.id] = 0;
        });
        
        // Initialize achievements
        GameData.achievements.forEach(achievement => {
            this.state.achievements[achievement.id] = {
                unlocked: false,
                unlockedAt: null
            };
        });
        
        // Initialize desk upgrades
        GameData.deskUpgrades.forEach(upgrade => {
            this.state.deskUpgrades[upgrade.id] = {
                owned: false,
                purchasedAt: null
            };
        });
        
        // Initialize challenges
        GameData.challenges.forEach(challenge => {
            this.state.challengeProgress[challenge.id] = {
                attempted: false,
                completed: false,
                bestTime: null
            };
        });
    }
    
    saveGame() {
        try {
            this.state.lastSaveTime = Date.now();
            this.state.totalPlayTime += Date.now() - this.state.gameStartTime;
            
            const saveData = {
                state: this.state,
                timestamp: Date.now(),
                version: this.state.version
            };
            
            localStorage.setItem('corporateRatIdle_save', JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }
    
    loadGame() {
        try {
            const saveData = localStorage.getItem('corporateRatIdle_save');
            if (!saveData) return false;
            
            const parsed = JSON.parse(saveData);
            
            // Version compatibility check
            if (!parsed.version || parsed.version !== this.state.version) {
                console.warn('Save version mismatch, applying migration...');
                this.migrateSave(parsed);
                return true;
            }
            
            // Merge loaded state with default state to handle new features
            this.state = this.deepMerge(this.state, parsed.state);
            
            // Handle offline progression
            this.handleOfflineProgression(parsed.timestamp);
            
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }
    
    migrateSave(oldSave) {
        // Handle save migration for different versions
        // For now, just reset to avoid compatibility issues
        console.log('Performing save migration...');
        // Could implement specific migration logic here
    }
    
    handleOfflineProgression(lastSaveTime) {
        const offlineTime = Date.now() - lastSaveTime;
        const maxOfflineTime = GameData.config.maxOfflineHours * 3600 * 1000;
        const effectiveOfflineTime = Math.min(offlineTime, maxOfflineTime);
        
        if (effectiveOfflineTime > 60000 && this.state.automation.enabled) { // Minimum 1 minute offline
            const offlineGain = this.calculateOfflineGain(effectiveOfflineTime);
            
            if (offlineGain > 0) {
                this.state.officePoints += offlineGain;
                this.showNotification('success', `Welcome back! You earned ${Lang.formatNumber(offlineGain)} office points while away.`);
            }
        }
    }
    
    calculateOfflineGain(timeMs) {
        let totalGain = 0;
        
        Object.keys(this.state.tasks).forEach(taskId => {
            const task = this.state.tasks[taskId];
            if (task.unlocked && task.isActive) {
                const gameTask = GameData.getTaskById(taskId);
                const production = GameData.calculateTaskProduction(taskId, task.level, this.getMultipliers());
                const cyclesPerSecond = 1000 / gameTask.cycleTime;
                const totalCycles = (timeMs / 1000) * cyclesPerSecond;
                
                totalGain += production * totalCycles * GameData.config.offlineEfficiency;
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
    }
    
    exportSave() {
        try {
            this.saveGame();
            const saveData = localStorage.getItem('corporateRatIdle_save');
            const encoded = btoa(saveData);
            
            navigator.clipboard.writeText(encoded).then(() => {
                this.showNotification('success', Lang.get('save-exported'));
            }).catch(() => {
                // Fallback for browsers that don't support clipboard API
                const textarea = document.createElement('textarea');
                textarea.value = encoded;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showNotification('success', Lang.get('save-exported'));
            });
            
            return encoded;
        } catch (error) {
            console.error('Failed to export save:', error);
            this.showNotification('error', 'Failed to export save data');
            return null;
        }
    }
    
    importSave(encodedData) {
        try {
            const decoded = atob(encodedData);
            const saveData = JSON.parse(decoded);
            
            // Validate save data structure
            if (!saveData.state || !saveData.timestamp) {
                throw new Error('Invalid save data structure');
            }
            
            // Backup current save
            const currentSave = localStorage.getItem('corporateRatIdle_save');
            localStorage.setItem('corporateRatIdle_save_backup', currentSave);
            
            // Import new save
            localStorage.setItem('corporateRatIdle_save', decoded);
            this.loadGame();
            
            this.showNotification('success', Lang.get('save-imported'));
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            this.showNotification('error', Lang.get('invalid-save'));
            return false;
        }
    }
    
    resetGame() {
        if (confirm(Lang.get('confirm-reset'))) {
            localStorage.removeItem('corporateRatIdle_save');
            location.reload();
        }
    }
    
    // State modification methods
    addOfficePoints(amount) {
        this.state.officePoints += amount;
        this.state.totalOfficePoints += amount;
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
        this.state.infinityPoints += amount;
        this.state.totalInfinityPoints += amount;
    }
    
    spendInfinityPoints(amount) {
        if (this.state.infinityPoints >= amount) {
            this.state.infinityPoints -= amount;
            return true;
        }
        return false;
    }
    
    unlockTask(taskId) {
        if (this.state.tasks[taskId]) {
            this.state.tasks[taskId].unlocked = true;
            this.state.stats.tasksUnlocked++;
            this.checkAchievements();
        }
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
                this.checkAchievements();
                return true;
            }
        }
        return false;
    }
    
    completeTask(taskId) {
        if (this.state.tasks[taskId]) {
            this.state.tasks[taskId].totalCompletions++;
            this.state.taskCompletions[taskId]++;
            this.checkAchievements();
        }
    }
    
    performInfinity() {
        if (this.canPerformInfinity()) {
            const infinityGain = GameData.calculateInfinityPoints(this.state.officePoints);
            
            this.addInfinityPoints(infinityGain);
            this.state.infinities++;
            
            // Reset pre-infinity progress
            this.state.officePoints = 0;
            Object.keys(this.state.tasks).forEach(taskId => {
                const task = this.state.tasks[taskId];
                task.level = 0;
                task.progress = 0;
                task.isActive = false;
                task.unlocked = GameData.getTaskById(taskId).unlockCost === 0;
            });
            
            this.checkAchievements();
            this.showNotification('success', Lang.get('infinity-reached'));
            
            return infinityGain;
        }
        return 0;
    }
    
    canPerformInfinity() {
        return this.state.officePoints >= GameData.config.firstInfinityThreshold;
    }
    
    checkInfinityAvailability() {
        const infinitySection = document.getElementById('infinity-section');
        if (infinitySection) {
            if (this.canPerformInfinity()) {
                infinitySection.classList.remove('hidden');
            } else {
                infinitySection.classList.add('hidden');
            }
        }
    }
    
    getMultipliers() {
        let multipliers = { all: 1 };
        
        // Apply desk upgrade effects
        Object.keys(this.state.deskUpgrades).forEach(upgradeId => {
            const state = this.state.deskUpgrades[upgradeId];
            const upgrade = GameData.getDeskUpgradeById(upgradeId);
            
            if (state.owned && upgrade) {
                switch (upgrade.effect.type) {
                    case 'multiplier':
                        if (upgrade.effect.target === 'all') {
                            multipliers.all *= upgrade.effect.value;
                        } else {
                            multipliers[upgrade.effect.target] = (multipliers[upgrade.effect.target] || 1) * upgrade.effect.value;
                        }
                        break;
                }
            }
        });
        
        // Apply achievement effects
        Object.keys(this.state.achievements).forEach(achievementId => {
            const state = this.state.achievements[achievementId];
            const achievement = GameData.getAchievementById(achievementId);
            
            if (state.unlocked && achievement) {
                switch (achievement.reward.type) {
                    case 'multiplier':
                        if (achievement.reward.target === 'all') {
                            multipliers.all *= achievement.reward.value;
                        } else {
                            multipliers[achievement.reward.target] = (multipliers[achievement.reward.target] || 1) * achievement.reward.value;
                        }
                        break;
                }
            }
        });
        
        return multipliers;
    }
    
    checkAchievements() {
        GameData.achievements.forEach(achievement => {
            const state = this.state.achievements[achievement.id];
            
            if (!state.unlocked && this.isAchievementRequirementMet(achievement)) {
                state.unlocked = true;
                state.unlockedAt = Date.now();
                this.showNotification('success', `${Lang.get('achievement-unlocked')} ${Lang.get(achievement.id)}`);
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
                    return this.state.taskCompletions[req.target] >= req.value;
                }
            case 'infinities':
                return this.state.infinities >= req.value;
            case 'tasksUnlocked':
                return this.state.stats.tasksUnlocked >= req.value;
            case 'upgradesPurchased':
                return this.state.stats.upgradesPurchased >= req.value;
            case 'totalPointsEarned':
                return this.state.totalOfficePoints >= req.value;
            case 'deskUpgradesBought':
                return this.state.stats.deskUpgradesBought >= req.value;
            case 'challengesCompleted':
                return this.state.stats.challengesCompleted >= req.value;
            case 'automationTime':
                return this.state.stats.automationTime >= req.value;
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
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
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
    get softSkills() { return this.state.softSkills; }
    get infinities() { return this.state.infinities; }
    get tasks() { return this.state.tasks; }
    get achievements() { return this.state.achievements; }
    get deskUpgrades() { return this.state.deskUpgrades; }
    get stats() { return this.state.stats; }
}

// Initialize global game state
window.GameState = new GameState();
