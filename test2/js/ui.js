// UI Management and Rendering
class UIManager {
    constructor() {
        this.currentTab = 'tasks';
        this.updateInterval = null;
        this.quotesArray = [];
        this.currentQuoteIndex = 0;
        
        this.init();
    }
    
    init() {
        this.initializeTabs();
        this.initializeQuoteSystem();
        this.startUIUpdateLoop();
        this.bindUIEvents();
        this.renderInitialUI();
    }
    
    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
    
    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show target tab
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            this.currentTab = tabName;
            this.renderTabContent(tabName);
        }
    }
    
    renderTabContent(tabName) {
        switch (tabName) {
            case 'tasks':
                this.renderTasks();
                break;
            case 'desk':
                this.renderDeskUpgrades();
                break;
            case 'challenges':
                this.renderChallenges();
                break;
            case 'achievements':
                this.renderAchievements();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }
    
    renderTasks() {
        const tasksGrid = document.getElementById('tasks-grid');
        if (!tasksGrid) return;
        
        tasksGrid.innerHTML = '';
        
        GameData.tasks.forEach(gameTask => {
            const task = GameState.tasks[gameTask.id];
            if (!task) return;
            
            const taskCard = this.createTaskCard(gameTask, task);
            tasksGrid.appendChild(taskCard);
        });
    }
    
    createTaskCard(gameTask, task) {
        const card = document.createElement('div');
        card.className = `task-card ${!task.unlocked ? 'locked' : ''}`;
        card.setAttribute('data-task-id', gameTask.id);
        
        const isAffordable = !task.unlocked ? 
            GameState.officePoints >= gameTask.unlockCost :
            GameState.officePoints >= GameData.calculateTaskCost(gameTask.id, task.level);
        
        if (!task.unlocked && isAffordable) {
            card.classList.add('can-unlock');
        }
        
        const progressWidth = task.isActive ? (task.progress * 100) : 0;
        const multipliers = GameState.getMultipliers();
        const production = GameData.calculateTaskProduction(gameTask.id, task.level, multipliers);
        const upgradeCost = GameData.calculateTaskCost(gameTask.id, task.level);
        
        card.innerHTML = `
            <div class="task-header">
                <div class="task-icon">${gameTask.icon}</div>
                <div class="task-info">
                    <div class="task-title">${Lang.get(gameTask.id)}</div>
                    <div class="task-level">${Lang.get('level')} ${task.level}</div>
                </div>
            </div>
            
            <div class="task-stats">
                <div class="task-stat">
                    <span class="task-stat-label">${Lang.get('idle-rate')}:</span>
                    <span class="task-stat-value">${Lang.formatNumber(production)}${Lang.get('per-second')}</span>
                </div>
                <div class="task-stat">
                    <span class="task-stat-label">${Lang.get('progress')}:</span>
                    <span class="task-stat-value">${task.isActive ? Math.floor(task.progress * 100) + '%' : 'Inactive'}</span>
                </div>
            </div>
            
            <div class="task-progress">
                <div class="task-progress-fill" style="width: ${progressWidth}%"></div>
            </div>
            
            <div class="task-buttons">
                ${this.renderTaskButtons(gameTask, task, upgradeCost, isAffordable)}
            </div>
        `;
        
        // Add click handlers
        this.addTaskCardHandlers(card, gameTask.id, task);
        
        return card;
    }
    
    renderTaskButtons(gameTask, task, upgradeCost, isAffordable) {
        if (!task.unlocked) {
            const unlockCost = gameTask.unlockCost;
            const canUnlock = GameState.officePoints >= unlockCost;
            
            return `
                <button class="task-btn unlock-btn" ${!canUnlock ? 'disabled' : ''}>
                    ${Lang.get('unlock-cost')}: ${Lang.formatNumber(unlockCost)}
                </button>
            `;
        }
        
        const canUpgrade = task.level < gameTask.maxLevel && GameState.officePoints >= upgradeCost;
        
        return `
            <button class="task-btn upgrade-btn" ${!canUpgrade ? 'disabled' : ''}>
                ${Lang.get('upgrade')} (${Lang.formatNumber(upgradeCost)})
            </button>
        `;
    }
    
    addTaskCardHandlers(card, taskId, task) {
        // Main card click - start/click task
        card.addEventListener('click', (e) => {
            if (e.target.closest('.task-btn')) return; // Don't trigger on button clicks
            GameLogic.clickTask(taskId);
        });
        
        // Upgrade button
        const upgradeBtn = card.querySelector('.upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (GameLogic.upgradeTask(taskId)) {
                    this.renderTasks(); // Refresh the display
                }
            });
        }
        
        // Unlock button
        const unlockBtn = card.querySelector('.unlock-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                GameLogic.clickTask(taskId);
            });
        }
    }
    
    renderDeskUpgrades() {
        const deskGrid = document.getElementById('desk-upgrades');
        if (!deskGrid) return;
        
        deskGrid.innerHTML = '';
        
        GameData.deskUpgrades.forEach(upgrade => {
            const state = GameState.deskUpgrades[upgrade.id];
            if (!state) return;
            
            const upgradeCard = this.createDeskUpgradeCard(upgrade, state);
            deskGrid.appendChild(upgradeCard);
        });
    }
    
    createDeskUpgradeCard(upgrade, state) {
        const card = document.createElement('div');
        card.className = `desk-upgrade ${state.owned ? 'owned' : ''}`;
        
        const canAfford = !state.owned && GameState.infinityPoints >= upgrade.cost;
        const isUnlocked = this.isDeskUpgradeUnlocked(upgrade);
        
        card.innerHTML = `
            <div class="desk-upgrade-header">
                <div class="desk-upgrade-icon">${upgrade.icon}</div>
                <div class="desk-upgrade-info">
                    <h3>${Lang.get(upgrade.id)}</h3>
                    <div class="desk-upgrade-cost">
                        ${state.owned ? Lang.get('owned') : `${upgrade.cost} ${Lang.get('infinity-points')}`}
                    </div>
                </div>
            </div>
            
            <div class="desk-upgrade-desc">
                ${Lang.get(upgrade.id + '-desc')}
            </div>
            
            <div class="desk-upgrade-effect">
                <strong>${Lang.get('effect')}:</strong> ${this.formatUpgradeEffect(upgrade.effect)}
            </div>
            
            <button class="desk-upgrade-btn ${state.owned ? 'owned' : (canAfford && isUnlocked ? 'buy' : '')}" 
                    ${!canAfford || !isUnlocked || state.owned ? 'disabled' : ''}>
                ${state.owned ? Lang.get('owned') : 
                  (!isUnlocked ? Lang.get('locked') : Lang.get('buy'))}
            </button>
        `;
        
        // Add click handler
        if (!state.owned && canAfford && isUnlocked) {
            const buyBtn = card.querySelector('.desk-upgrade-btn');
            buyBtn.addEventListener('click', () => {
                if (GameLogic.purchaseDeskUpgrade(upgrade.id)) {
                    this.renderDeskUpgrades(); // Refresh the display
                }
            });
        }
        
        return card;
    }
    
    isDeskUpgradeUnlocked(upgrade) {
        const req = upgrade.unlockRequirement;
        if (!req) return true;
        
        switch (Object.keys(req)[0]) {
            case 'infinities':
                return GameState.infinities >= req.infinities;
            default:
                return true;
        }
    }
    
    formatUpgradeEffect(effect) {
        switch (effect.type) {
            case 'multiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% ${effect.target === 'all' ? 'all tasks' : effect.target}`;
            case 'speed':
                return `+${((effect.value - 1) * 100).toFixed(0)}% task speed`;
            case 'efficiency':
                return `+${((effect.value - 1) * 100).toFixed(0)}% efficiency`;
            case 'click':
                return `+${((effect.value - 1) * 100).toFixed(0)}% click power`;
            case 'generation':
                return `+${((effect.value - 1) * 100).toFixed(0)}% point generation`;
            default:
                return 'Unknown effect';
        }
    }
    
    renderChallenges() {
        const challengesGrid = document.getElementById('challenges-grid');
        if (!challengesGrid) return;
        
        challengesGrid.innerHTML = '';
        
        GameData.challenges.forEach(challenge => {
            const progress = GameState.state.challengeProgress[challenge.id];
            if (!progress) return;
            
            const challengeCard = this.createChallengeCard(challenge, progress);
            challengesGrid.appendChild(challengeCard);
        });
    }
    
    createChallengeCard(challenge, progress) {
        const card = document.createElement('div');
        card.className = `challenge-card ${progress.completed ? 'completed' : ''}`;
        
        const isUnlocked = GameLogic.isChallengeUnlocked(challenge.id);
        const status = progress.completed ? 'completed' : (isUnlocked ? 'available' : 'locked');
        
        card.innerHTML = `
            <div class="challenge-header">
                <div class="challenge-title">${Lang.get(challenge.id)}</div>
                <div class="challenge-status ${status}">${Lang.get(status)}</div>
            </div>
            
            <div class="challenge-desc">
                ${Lang.get(challenge.id + '-desc')}
            </div>
            
            <div class="challenge-reward">
                <div class="challenge-reward-title">${Lang.get('reward')}:</div>
                <div>${Lang.get(challenge.id + '-reward')}</div>
            </div>
            
            <div class="challenge-progress">
                <button class="challenge-btn btn ${isUnlocked && !progress.completed ? 'primary' : 'secondary'}" 
                        ${!isUnlocked ? 'disabled' : ''}>
                    ${progress.completed ? Lang.get('completed') : 
                      (GameState.state.currentChallenge === challenge.id ? Lang.get('exit-challenge') : Lang.get('start-challenge'))}
                </button>
            </div>
        `;
        
        // Add click handler
        const btn = card.querySelector('.challenge-btn');
        if (btn && isUnlocked) {
            btn.addEventListener('click', () => {
                if (GameState.state.currentChallenge === challenge.id) {
                    GameLogic.exitChallenge();
                } else if (!progress.completed) {
                    GameLogic.startChallenge(challenge.id);
                }
                this.renderChallenges(); // Refresh the display
            });
        }
        
        return card;
    }
    
    renderAchievements() {
        const achievementsGrid = document.getElementById('achievements-grid');
        if (!achievementsGrid) return;
        
        achievementsGrid.innerHTML = '';
        
        GameData.achievements.forEach(achievement => {
            const state = GameState.achievements[achievement.id];
            if (!state) return;
            
            const achievementCard = this.createAchievementCard(achievement, state);
            achievementsGrid.appendChild(achievementCard);
        });
    }
    
    createAchievementCard(achievement, state) {
        const card = document.createElement('div');
        card.className = `achievement-card ${state.unlocked ? 'unlocked' : ''}`;
        
        // Choose an appropriate icon or use a default
        const icon = this.getAchievementIcon(achievement.id);
        
        card.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-info">
                <h3>${Lang.get(achievement.id)}</h3>
                <div class="achievement-desc">${Lang.get(achievement.id + '-desc')}</div>
                <div class="achievement-reward">
                    <strong>${Lang.get('reward')}:</strong> ${Lang.get(achievement.id + '-reward')}
                </div>
                ${state.unlocked && state.unlockedAt ? 
                    `<div class="achievement-date">${new Date(state.unlockedAt).toLocaleDateString()}</div>` : 
                    ''}
            </div>
        `;
        
        return card;
    }
    
    getAchievementIcon(achievementId) {
        const iconMap = {
            'first-day': '🎯',
            'coffee-addict': '☕',
            'meeting-master': '🏢',
            'infinite-worker': '♾️',
            'task-master': '📋',
            'upgrade-enthusiast': '⬆️',
            'automation-master': '🤖',
            'point-collector': '💰',
            'desk-decorator': '🎨',
            'challenger': '🏆'
        };
        
        return iconMap[achievementId] || '🎖️';
    }
    
    renderSettings() {
        // Settings are mostly static HTML, just update language selector
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = Lang.currentLanguage;
        }
        
        // Update auto-save selector
        const autoSaveSelect = document.getElementById('autosave-select');
        if (autoSaveSelect) {
            const currentInterval = GameData.config.autoSaveInterval / 1000;
            autoSaveSelect.value = currentInterval.toString();
        }
    }
    
    initializeQuoteSystem() {
        this.setupQuoteRotation();
    }
    
    setupQuoteRotation() {
        const quoteElement = document.getElementById('quote');
        if (!quoteElement) return;
        
        const rotateQuote = () => {
            const quote = Lang.getRandomQuote();
            quoteElement.textContent = quote;
        };
        
        // Initial quote
        rotateQuote();
        
        // Rotate every 15 seconds
        setInterval(rotateQuote, 15000);
    }
    
    startUIUpdateLoop() {
        // Update UI elements that change frequently
        this.updateInterval = setInterval(() => {
            this.updateDynamicElements();
        }, 250); // 4 FPS for UI updates
    }
    
    updateDynamicElements() {
        if (this.currentTab === 'tasks') {
            this.updateTaskProgress();
        }
        
        this.updateCurrencyDisplays();
    }
    
    updateTaskProgress() {
        document.querySelectorAll('.task-card').forEach(card => {
            const taskId = card.getAttribute('data-task-id');
            const task = GameState.tasks[taskId];
            
            if (!task) return;
            
            // Update progress bar
            const progressFill = card.querySelector('.task-progress-fill');
            if (progressFill && task.isActive) {
                const progressWidth = task.progress * 100;
                progressFill.style.width = `${progressWidth}%`;
            }
            
            // Update progress text
            const progressValue = card.querySelector('.task-stat-value');
            if (progressValue) {
                const progressText = task.isActive ? 
                    Math.floor(task.progress * 100) + '%' : 
                    'Inactive';
                
                if (progressValue.textContent !== progressText) {
                    progressValue.textContent = progressText;
                }
            }
        });
    }
    
    updateCurrencyDisplays() {
        // These are handled by GameLogic.updateDisplay()
        // But we can add animations here if needed
    }
    
    bindUIEvents() {
        // Handle auto-save interval changes
        const autoSaveSelect = document.getElementById('autosave-select');
        if (autoSaveSelect) {
            autoSaveSelect.addEventListener('change', (e) => {
                const newInterval = parseInt(e.target.value) * 1000;
                GameData.config.autoSaveInterval = newInterval;
                // Restart auto-save with new interval
                clearInterval(GameState.autoSaveTimer);
                GameState.setupAutoSave();
            });
        }
    }
    
    renderInitialUI() {
        // Render all tabs initially
        this.renderTasks();
        this.renderDeskUpgrades();
        this.renderChallenges();
        this.renderAchievements();
        this.renderSettings();
        
        // Update language
        Lang.updateLanguage();
    }
    
    // Public methods for external updates
    refreshCurrentTab() {
        this.renderTabContent(this.currentTab);
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Add CSS for floating numbers and click effects
const additionalCSS = `
.floating-number {
    position: fixed;
    font-weight: bold;
    font-size: 0.9em;
    pointer-events: none;
    z-index: 1000;
    transition: all 0.5s ease-out;
}

.task-card.clicked {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}

.task-card.can-unlock {
    border-color: var(--success-color) !important;
    box-shadow: 0 0 15px rgba(39, 174, 96, 0.3);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 15px rgba(39, 174, 96, 0.3); }
    50% { box-shadow: 0 0 25px rgba(39, 174, 96, 0.6); }
    100% { box-shadow: 0 0 15px rgba(39, 174, 96, 0.3); }
}

.challenge-card:hover {
    transform: translateY(-2px);
    transition: transform 0.3s ease;
}

.achievement-card.unlocked {
    animation: achievement-unlock 0.5s ease;
}

@keyframes achievement-unlock {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize global UI manager
window.UIManager = new UIManager();
