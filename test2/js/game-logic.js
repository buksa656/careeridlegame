// Enhanced Game Logic for Corporate Rat Idle

class GameLogicManager {
    constructor() {
        this.gameLoop = null;
        this.tickInterval = GameData.config.gameTickRate;
        this.lastTick = Date.now();
        this.autoTimers = {
            autoClick: 0,
            autoUpgrade: 0,
            autoInfinity: 0
        };
        
        this.init();
    }

    init() {
        this.startGameLoop();
        this.bindInfinityButton();
    }

    startGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            this.tick();
        }, this.tickInterval);
    }

    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    tick() {
        const now = Date.now();
        const deltaTime = now - this.lastTick;
        this.lastTick = now;

        // Update task progress
        this.updateTaskProgress(deltaTime);
        
        // Handle automation
        if (GameState.automation.enabled) {
            this.updateAutomation(deltaTime);
        }
        
        // Update UI elements that need frequent updates
        this.updateMainDisplay();
        
        // Check for unlocks
        GameState.checkTaskUnlocks();
        GameState.checkInfinityAvailability();
    }

    updateTaskProgress(deltaTime) {
        Object.keys(GameState.tasks).forEach(taskId => {
            const task = GameState.tasks[taskId];
            const gameTask = GameData.getTaskById(taskId);
            
            if (task.unlocked && (task.isActive || task.automated) && task.level > 0 && gameTask) {
                // Update progress
                const progressPerMs = 1000 / gameTask.cycleTime;
                task.progress += (deltaTime * progressPerMs) / 1000;
                
                // Complete cycles
                while (task.progress >= 1) {
                    task.progress -= 1;
                    this.completeTaskCycle(taskId);
                }
            }
        });
    }

    completeTaskCycle(taskId) {
        const task = GameState.tasks[taskId];
        const gameTask = GameData.getTaskById(taskId);
        if (!task || !gameTask) return;

        // Calculate production
        const multipliers = GameState.getMultipliers();
        const production = GameData.calculateTaskProduction(taskId, task.level, multipliers);
        
        // Add points
        GameState.addOfficePoints(production);
        GameState.completeTask(taskId);
        
        // Visual feedback
        if (GameState.state.settings.showFloatingNumbers) {
            this.showFloatingNumber(production, taskId, false);
        }
    }

    updateAutomation(deltaTime) {
        GameState.state.stats.automationTime += deltaTime;
        
        // Auto-clicker
        if (GameState.automation.autoClicker) {
            this.autoTimers.autoClick += deltaTime;
            if (this.autoTimers.autoClick >= GameState.automation.autoClickInterval) {
                this.handleAutoClick();
                this.autoTimers.autoClick = 0;
            }
        }
        
        // Auto-upgrade
        if (GameState.automation.autoUpgrade) {
            this.autoTimers.autoUpgrade += deltaTime;
            if (this.autoTimers.autoUpgrade >= GameState.automation.autoUpgradeInterval) {
                this.handleAutoUpgrade();
                this.autoTimers.autoUpgrade = 0;
            }
        }
        
        // Auto-infinity
        if (GameState.automation.autoInfinity) {
            this.autoTimers.autoInfinity += deltaTime;
            if (this.autoTimers.autoInfinity >= GameState.automation.autoInfinityMinTime) {
                this.handleAutoInfinity();
                this.autoTimers.autoInfinity = 0;
            }
        }
    }

    handleAutoClick() {
        // Automatically activate available tasks
        Object.keys(GameState.tasks).forEach(taskId => {
            const task = GameState.tasks[taskId];
            if (task.unlocked && task.level > 0 && !task.automated) {
                task.isActive = true;
                task.automated = true;
            }
        });
    }

    handleAutoUpgrade() {
        // Find the most efficient upgrade to purchase
        let bestUpgrade = null;
        let bestEfficiency = 0;
        
        Object.keys(GameState.tasks).forEach(taskId => {
            const task = GameState.tasks[taskId];
            const gameTask = GameData.getTaskById(taskId);
            
            if (task.unlocked && task.level < gameTask.maxLevel) {
                if (GameData.shouldAutoUpgrade(taskId, GameState.officePoints)) {
                    const cost = GameData.calculateTaskCost(taskId, task.level);
                    const currentProduction = GameData.calculateTaskProduction(taskId, task.level, GameState.getMultipliers());
                    const upgradeProduction = GameData.calculateTaskProduction(taskId, task.level + 1, GameState.getMultipliers());
                    const efficiency = (upgradeProduction - currentProduction) / cost;
                    
                    if (efficiency > bestEfficiency && GameState.officePoints >= cost) {
                        bestEfficiency = efficiency;
                        bestUpgrade = taskId;
                    }
                }
            }
        });
        
        if (bestUpgrade) {
            GameState.upgradeTask(bestUpgrade);
        }
    }

    handleAutoInfinity() {
        if (GameState.canPerformInfinity()) {
            const timeSinceInfinityStart = Date.now() - GameState.state.currentInfinityStartTime;
            
            // Only perform infinity if it's been at least the minimum time and it's beneficial
            if (timeSinceInfinityStart >= GameState.automation.autoInfinityMinTime) {
                const currentIP = GameData.calculateInfinityPoints(GameState.officePoints);
                const currentRate = GameData.calculateTotalProduction(GameState.getMultipliers());
                
                // Simple heuristic: perform infinity if IP gain is decent relative to current progress
                if (currentIP > 0 && (currentIP >= 1 || currentRate < GameState.officePoints / 60)) {
                    GameState.performInfinity();
                }
            }
        }
    }

    // User action handlers
    clickTask(taskId) {
        console.log('WYWOŁANO clickTask!', taskId, GameState.tasks[taskId]);
        const task = GameState.tasks[taskId];
        const gameTask = GameData.getTaskById(taskId);
        
        if (!task || !gameTask) return false;

        // Unlock task if possible
        if (!task.unlocked) {
            if (GameState.officePoints >= gameTask.unlockCost) {
                if (GameState.spendOfficePoints(gameTask.unlockCost)) {
                    GameState.unlockTask(taskId);
                    return true;
                }
            }
            return false;
        }

        // Upgrade task if it has levels
        if (task.level < gameTask.maxLevel) {
            const cost = GameData.calculateTaskCost(taskId, task.level);
            if (GameState.officePoints >= cost) {
                if (GameState.upgradeTask(taskId)) {
                    // Activate task automation if we have it unlocked
                    if (GameState.automation.enabled) {
                        task.automated = true;
                    }
                    return true;
                }
            }
            return false;
        }

        // Manual click reward for max level tasks
        if (task.level > 0) {
            GameState.state.stats.clicksMade++;
            
            const multipliers = GameState.getMultipliers();
            const production = GameData.calculateTaskProduction(taskId, task.level, multipliers);
            const clickMultiplier = this.getClickMultiplier();
            const clickReward = production * clickMultiplier;
            
            GameState.addOfficePoints(clickReward);
            
            if (GameState.state.settings.showFloatingNumbers) {
                this.showFloatingNumber(clickReward, taskId, true);
            }
            
            this.addClickAnimation(taskId);
            
            // Activate the task
            if (!task.isActive) {
                task.isActive = true;
                
                // Auto-activate if automation is enabled
                if (GameState.automation.enabled) {
                    task.automated = true;
                }
            }
            
            return true;
        }

        return false;
    }

    getClickMultiplier() {
        let multiplier = 1;
        
        // Apply achievement bonuses
        Object.keys(GameState.achievements).forEach(achievementId => {
            const state = GameState.achievements[achievementId];
            const achievement = GameData.getAchievementById(achievementId);
            
            if (state.unlocked && achievement && achievement.reward.type === 'click') {
                multiplier *= achievement.reward.value;
            }
        });
        
        return multiplier;
    }

    purchaseDeskUpgrade(upgradeId) {
        return GameState.purchaseDeskUpgrade(upgradeId);
    }

    performInfinity() {
        return GameState.performInfinity();
    }

    // Visual feedback methods
    showFloatingNumber(amount, taskId, isClick = false) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (!taskElement) return;

        const floatingElement = document.createElement('div');
        floatingElement.className = `floating-number ${isClick ? 'click' : 'auto'}`;
        floatingElement.textContent = `+${Lang.formatNumber(amount)}`;
        
        const rect = taskElement.getBoundingClientRect();
        floatingElement.style.position = 'fixed';
        floatingElement.style.left = `${rect.left + rect.width / 2}px`;
        floatingElement.style.top = `${rect.top}px`;
        floatingElement.style.pointerEvents = 'none';
        floatingElement.style.zIndex = '1000';
        floatingElement.style.color = isClick ? '#27ae60' : '#3498db';
        floatingElement.style.fontWeight = 'bold';
        floatingElement.style.fontSize = '0.9em';
        floatingElement.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';
        
        document.body.appendChild(floatingElement);

        // Animate
        let opacity = 1;
        let y = 0;
        let scale = 1;
        
        const animate = () => {
            opacity -= 0.015;
            y -= 1.5;
            scale += 0.005;
            
            floatingElement.style.opacity = opacity;
            floatingElement.style.transform = `translateY(${y}px) scale(${scale})`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                floatingElement.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }

    addClickAnimation(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (!taskElement) return;

        taskElement.classList.add('clicked');
        setTimeout(() => {
            taskElement.classList.remove('clicked');
        }, 200);
    }

    updateMainDisplay() {
        // Update main currency displays
        this.updateElement('office-points', Lang.formatNumber(GameState.officePoints));
        this.updateElement('infinity-points', Lang.formatNumber(GameState.infinityPoints));
        this.updateElement('desk-level', this.calculateDeskLevel());
    }

    calculateDeskLevel() {
        let level = 0;
        Object.values(GameState.deskUpgrades).forEach(upgrade => {
            if (upgrade.owned) level++;
        });
        return level;
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== value) {
            element.textContent = value;
        }
    }

    bindInfinityButton() {
        const infinityBtn = document.getElementById('infinity-btn');
        if (infinityBtn) {
            infinityBtn.addEventListener('click', () => {
                this.performInfinity();
            });
        }
    }

    // Challenge system methods
    startChallenge(challengeId) {
        const challenge = GameData.getChallengeById(challengeId);
        if (!challenge || !this.isChallengeUnlocked(challengeId)) {
            return false;
        }

        // Save current state
        GameState.state.preChallengeState = JSON.parse(JSON.stringify(GameState.state));

        // Reset for challenge
        GameState.resetForInfinity();
        
        // Set challenge state
        GameState.state.currentChallenge = challengeId;
        GameState.state.inChallenge = true;
        GameState.state.challengeStartTime = Date.now();
        
        // Apply challenge restrictions
        this.applyChallengeRestrictions(challenge);
        
        GameState.showNotification('info', `Challenge "${Lang.get(challengeId)}" started!`);
        return true;
    }

    exitChallenge() {
        if (!GameState.state.inChallenge) return;

        // Restore pre-challenge state
        if (GameState.state.preChallengeState) {
            const challengeId = GameState.state.currentChallenge;
            GameState.state = { ...GameState.state.preChallengeState };
            GameState.state.currentChallenge = null;
            GameState.state.inChallenge = false;
            delete GameState.state.preChallengeState;
            delete GameState.state.challengeStartTime;
        }

        GameState.showNotification('info', 'Challenge exited. Progress restored.');
    }

    applyChallengeRestrictions(challenge) {
        // Apply challenge restrictions based on type
        if (challenge.restriction) {
            switch (challenge.restriction.type) {
                case 'disableTask':
                    const task = GameState.tasks[challenge.restriction.target];
                    if (task) {
                        task.unlocked = false;
                        task.isActive = false;
                        task.automated = false;
                    }
                    break;
                
                case 'maxTaskTypes':
                    // This would be enforced in the upgrade logic
                    break;
                
                case 'noManualClicks':
                    // This would be enforced in the click handlers
                    break;
            }
        }
    }

    checkChallengeCompletion() {
        if (!GameState.state.inChallenge) return;

        const challengeId = GameState.state.currentChallenge;
        const challenge = GameData.getChallengeById(challengeId);
        if (!challenge) return;

        if (this.isChallengeGoalMet(challenge)) {
            this.completeChallenge(challengeId);
        }
    }

    isChallengeGoalMet(challenge) {
        const goal = challenge.goal;
        
        switch (goal.type) {
            case 'officePoints':
                return GameState.officePoints >= goal.value;
            
            case 'taskCompletions':
                if (goal.target === 'all') {
                    return Object.values(GameState.state.taskCompletions).reduce((sum, count) => sum + count, 0) >= goal.value;
                } else {
                    return (GameState.state.taskCompletions[goal.target] || 0) >= goal.value;
                }
            
            case 'simultaneousTasks':
                return Object.values(GameState.tasks).filter(task => task.isActive || task.automated).length >= goal.value;
            
            case 'infinity':
                return GameState.canPerformInfinity();
            
            default:
                return false;
        }
    }

    completeChallenge(challengeId) {
        const challenge = GameData.getChallengeById(challengeId);
        const completionTime = Date.now() - GameState.state.challengeStartTime;

        // Mark as completed
        GameState.state.challengeProgress[challengeId].completed = true;
        GameState.state.challengeProgress[challengeId].bestTime = completionTime;
        GameState.state.stats.challengesCompleted++;

        // Apply reward (this would need to be implemented based on reward type)
        this.applyChallengeReward(challenge.reward);

        // Exit challenge
        this.exitChallenge();

        GameState.showNotification('success', `${Lang.get('challenge-completed')} ${Lang.get(challengeId)}!`);
    }

    applyChallengeReward(reward) {
        // Challenge rewards would be applied as permanent bonuses
        console.log('Challenge reward applied:', reward);
        // This would need to be implemented based on the specific reward system
    }

    isChallengeUnlocked(challengeId) {
        const challenge = GameData.getChallengeById(challengeId);
        if (!challenge) return false;

        const req = challenge.unlockRequirement;
        if (req.infinities) {
            return GameState.infinities >= req.infinities;
        }
        
        return true;
    }

    // Automation control methods
    toggleAutomation(type) {
        if (GameState.automation.hasOwnProperty(type)) {
            GameState.automation[type] = !GameState.automation[type];
            GameState.showNotification('info', `${type} automation ${GameState.automation[type] ? 'enabled' : 'disabled'}`);
        }
    }

    // Utility methods
    formatNumber(num) {
        return Lang.formatNumber(num);
    }
}

// Initialize global game logic
window.GameLogic = new GameLogicManager();
