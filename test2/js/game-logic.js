// Game Logic and Mechanics
class GameLogic {
    constructor() {
        this.gameLoop = null;
        this.tickInterval = 100; // 10 FPS
        this.lastTick = Date.now();
        this.activeTimers = new Map();
        
        this.init();
    }
    
    init() {
        this.startGameLoop();
        this.initializeAutomation();
        this.bindEvents();
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.tick();
        }, this.tickInterval);
    }
    
    tick() {
        const now = Date.now();
        const deltaTime = now - this.lastTick;
        this.lastTick = now;
        
        this.updateTaskProgress(deltaTime);
        this.updateAutomation(deltaTime);
        this.checkTaskUnlocks();
        this.updateDisplay();
    }
    
    updateTaskProgress(deltaTime) {
        Object.keys(GameState.tasks).forEach(taskId => {
            const task = GameState.tasks[taskId];
            const gameTask = GameData.getTaskById(taskId);
            
            if (task.unlocked && task.isActive && gameTask) {
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
        this.showFloatingNumber(production, taskId);
    }
    
    updateAutomation(deltaTime) {
        if (GameState.state.automation.enabled) {
            GameState.state.stats.automationTime += deltaTime;
            
            // Auto-clicker
            if (GameState.state.automation.autoClicker) {
                this.handleAutoClicker(deltaTime);
            }
            
            // Auto-upgrade
            if (GameState.state.automation.autoUpgrade) {
                this.handleAutoUpgrade(deltaTime);
            }
            
            // Auto-infinity
            if (GameState.state.automation.autoInfinity) {
                this.handleAutoInfinity(deltaTime);
            }
        }
    }
    
    handleAutoClicker(deltaTime) {
        // Auto-click available tasks every second
        const clickInterval = 1000;
        const timeSinceLastClick = this.autoClickTimer || 0;
        
        if (timeSinceLastClick >= clickInterval) {
            Object.keys(GameState.tasks).forEach(taskId => {
                const task = GameState.tasks[taskId];
                if (task.unlocked && !task.isActive) {
                    this.clickTask(taskId, false); // Don't show manual click effects
                }
            });
            this.autoClickTimer = 0;
        } else {
            this.autoClickTimer = timeSinceLastClick + deltaTime;
        }
    }
    
    handleAutoUpgrade(deltaTime) {
        // Auto-upgrade tasks when beneficial
        const upgradeInterval = 5000; // Check every 5 seconds
        const timeSinceLastUpgrade = this.autoUpgradeTimer || 0;
        
        if (timeSinceLastUpgrade >= upgradeInterval) {
            Object.keys(GameState.tasks).forEach(taskId => {
                const task = GameState.tasks[taskId];
                if (task.unlocked && this.shouldAutoUpgrade(taskId)) {
                    this.upgradeTask(taskId);
                }
            });
            this.autoUpgradeTimer = 0;
        } else {
            this.autoUpgradeTimer = timeSinceLastUpgrade + deltaTime;
        }
    }
    
    shouldAutoUpgrade(taskId) {
        const task = GameState.tasks[taskId];
        const gameTask = GameData.getTaskById(taskId);
        
        if (!task || !gameTask || task.level >= gameTask.maxLevel) return false;
        
        const upgradeCost = GameData.calculateTaskCost(taskId, task.level);
        const currentProduction = GameData.calculateTaskProduction(taskId, task.level, GameState.getMultipliers());
        const upgradeProduction = GameData.calculateTaskProduction(taskId, task.level + 1, GameState.getMultipliers());
        
        // Only upgrade if we have enough points and the upgrade is cost-effective
        const costEfficiency = (upgradeProduction - currentProduction) / upgradeCost;
        const pointsRatio = GameState.officePoints / upgradeCost;
        
        return pointsRatio >= 2 && costEfficiency > 0.1;
    }
    
    handleAutoInfinity(deltaTime) {
        if (GameState.canPerformInfinity()) {
            const currentGain = GameData.calculateInfinityPoints(GameState.officePoints);
            const futureGain = GameData.calculateInfinityPoints(GameState.officePoints * 2);
            
            // Perform infinity if the gain is reasonable
            if (currentGain > 0 && (futureGain - currentGain) / currentGain < 0.1) {
                this.performInfinity();
            }
        }
    }
    
    checkTaskUnlocks() {
        GameData.tasks.forEach(gameTask => {
            const task = GameState.tasks[gameTask.id];
            if (!task.unlocked && GameData.isTaskUnlocked(gameTask.id, GameState.state)) {
                GameState.unlockTask(gameTask.id);
            }
        });
    }
    
    // User actions
    clickTask(taskId, manual = true) {
        const task = GameState.tasks[taskId];
        const gameTask = GameData.getTaskById(taskId);
        
        if (!task || !gameTask) return;
        
        if (!task.unlocked) {
            // Try to unlock the task
            if (GameData.isTaskUnlocked(taskId, GameState.state)) {
                GameState.unlockTask(taskId);
                this.showNotification('success', `${Lang.get(taskId)} unlocked!`);
            }
            return;
        }
        
        if (manual) {
            GameState.state.stats.clicksMade++;
            
            // Manual click gives immediate reward
            const multipliers = GameState.getMultipliers();
            const production = GameData.calculateTaskProduction(taskId, task.level, multipliers);
            const clickMultiplier = this.getClickMultiplier();
            const clickReward = production * clickMultiplier;
            
            GameState.addOfficePoints(clickReward);
            this.showFloatingNumber(clickReward, taskId, true);
            this.addClickAnimation(taskId);
        }
        
        // Start automation if not already active
        if (!task.isActive) {
            task.isActive = true;
        }
    }
    
    upgradeTask(taskId) {
        return GameState.upgradeTask(taskId);
    }
    
    purchaseDeskUpgrade(upgradeId) {
        return GameState.purchaseDeskUpgrade(upgradeId);
    }
    
    performInfinity() {
        return GameState.performInfinity();
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
    
    // UI Feedback
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
        
        document.body.appendChild(floatingElement);
        
        // Animate
        let opacity = 1;
        let y = 0;
        const animate = () => {
            opacity -= 0.02;
            y -= 2;
            
            floatingElement.style.opacity = opacity;
            floatingElement.style.transform = `translateY(${y}px)`;
            
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
    
    showNotification(type, message) {
        GameState.showNotification(type, message);
    }
    
    updateDisplay() {
        // Update main currencies
        this.updateElement('office-points', Lang.formatNumber(GameState.officePoints));
        this.updateElement('infinity-points', Lang.formatNumber(GameState.infinityPoints));
        this.updateElement('soft-skills', Lang.formatNumber(GameState.softSkills));
        
        // Update infinity button
        GameState.checkInfinityAvailability();
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== value) {
            element.textContent = value;
        }
    }
    
    // Automation controls
    initializeAutomation() {
        // Enable basic automation when threshold is reached
        if (GameState.officePoints >= GameData.config.firstAutomationAt && !GameState.state.automation.enabled) {
            GameState.state.automation.enabled = true;
            this.showNotification('success', 'Automation unlocked! Tasks will now progress automatically.');
        }
    }
    
    toggleAutomation(type) {
        if (GameState.state.automation[type] !== undefined) {
            GameState.state.automation[type] = !GameState.state.automation[type];
            this.showNotification('info', `${type} automation ${GameState.state.automation[type] ? 'enabled' : 'disabled'}`);
        }
    }
    
    // Challenge system
    startChallenge(challengeId) {
        const challenge = GameData.getChallengeById(challengeId);
        if (!challenge) return false;
        
        // Check unlock requirements
        if (!this.isChallengeUnlocked(challengeId)) return false;
        
        // Save current state
        GameState.state.preChallengeState = JSON.parse(JSON.stringify(GameState.state));
        
        // Reset progress for challenge
        GameState.state.officePoints = 0;
        Object.keys(GameState.tasks).forEach(taskId => {
            const task = GameState.tasks[taskId];
            task.level = 0;
            task.progress = 0;
            task.isActive = false;
            task.unlocked = GameData.getTaskById(taskId).unlockCost === 0;
        });
        
        // Set challenge state
        GameState.state.currentChallenge = challengeId;
        GameState.state.inChallenge = true;
        GameState.state.challengeStartTime = Date.now();
        
        this.showNotification('info', `Challenge "${Lang.get(challengeId)}" started!`);
        return true;
    }
    
    exitChallenge() {
        if (!GameState.state.inChallenge) return;
        
        // Restore pre-challenge state
        if (GameState.state.preChallengeState) {
            const challengeId = GameState.state.currentChallenge;
            const challengeStartTime = GameState.state.challengeStartTime;
            
            GameState.state = { ...GameState.state.preChallengeState };
            GameState.state.currentChallenge = null;
            GameState.state.inChallenge = false;
            
            delete GameState.state.preChallengeState;
            delete GameState.state.challengeStartTime;
        }
        
        this.showNotification('info', 'Challenge exited. Progress restored.');
    }
    
    checkChallengeCompletion() {
        if (!GameState.state.inChallenge) return;
        
        const challengeId = GameState.state.currentChallenge;
        const challenge = GameData.getChallengeById(challengeId);
        
        if (!challenge) return;
        
        if (this.isChallengeGoalMet(challenge)) {
            this.completeChallenenge(challengeId);
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
                    return GameState.state.taskCompletions[goal.target] >= goal.value;
                }
            case 'simultaneousTasks':
                return Object.values(GameState.tasks).filter(task => task.isActive).length >= goal.value;
            default:
                return false;
        }
    }
    
    completeChallenenge(challengeId) {
        const challenge = GameData.getChallengeById(challengeId);
        const completionTime = Date.now() - GameState.state.challengeStartTime;
        
        // Mark as completed
        GameState.state.challengeProgress[challengeId].completed = true;
        GameState.state.challengeProgress[challengeId].bestTime = completionTime;
        GameState.state.stats.challengesCompleted++;
        
        // Apply reward
        this.applyChallengeReward(challenge.reward);
        
        // Exit challenge
        this.exitChallenge();
        
        this.showNotification('success', `${Lang.get('challenge-completed')} ${Lang.get(challengeId)}!`);
    }
    
    applyChallengeReward(reward) {
        // Challenge rewards are applied permanently
        // This would need to be tracked in a separate permanent bonuses system
        console.log('Challenge reward applied:', reward);
    }
    
    isChallengeUnlocked(challengeId) {
        const challenge = GameData.getChallengeById(challengeId);
        if (!challenge) return false;
        
        const req = challenge.unlockRequirement;
        switch (req.type) {
            case 'infinities':
                return GameState.infinities >= req.value;
            default:
                return true;
        }
    }
    
    bindEvents() {
        // Infinity button
        const infinityBtn = document.getElementById('infinity-btn');
        if (infinityBtn) {
            infinityBtn.addEventListener('click', () => {
                this.performInfinity();
            });
        }
        
        // Settings buttons
        const exportBtn = document.getElementById('export-save');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                GameState.exportSave();
            });
        }
        
        const importBtn = document.getElementById('import-save');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                document.getElementById('import-modal').classList.remove('hidden');
            });
        }
        
        const confirmImport = document.getElementById('confirm-import');
        if (confirmImport) {
            confirmImport.addEventListener('click', () => {
                const textarea = document.getElementById('import-textarea');
                if (textarea.value.trim()) {
                    GameState.importSave(textarea.value.trim());
                    document.getElementById('import-modal').classList.add('hidden');
                    textarea.value = '';
                }
            });
        }
        
        const resetBtn = document.getElementById('reset-game');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                GameState.resetGame();
            });
        }
        
        // Modal close buttons
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
}

// Initialize global game logic
window.GameLogic = new GameLogic();
