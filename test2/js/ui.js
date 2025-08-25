// Enhanced UI Management for Corporate Rat Idle

class UIManager {
    constructor() {
        this.currentTab = 'tasks';
        this.updateInterval = null;
        this.quotesArray = [];
        this.currentQuoteIndex = 0;
        this.lastFullRefresh = 0;
        
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

        // Clear existing content
        tasksGrid.innerHTML = '';

        // Create task cards
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

    // Determine if task is affordable
    let isAffordable = false;
    let actionCost = 0;
    let actionText = '';

    if (!task.unlocked) {
        isAffordable = GameState.officePoints >= gameTask.unlockCost;
        actionCost = gameTask.unlockCost;
        actionText = Lang.get('unlock-cost');
    } else if (task.level < gameTask.maxLevel) {
        actionCost = GameData.calculateTaskCost(gameTask.id, task.level);
        isAffordable = GameState.officePoints >= actionCost;
        actionText = Lang.get('upgrade');
    } else {
        actionText = Lang.get('max-level');
    }

    if (isAffordable && !task.unlocked) {
        card.classList.add('can-unlock');
    }

    // Calculate current production
    const multipliers = GameState.getMultipliers();
    const production = task.level > 0 ? GameData.calculateTaskProduction(gameTask.id, task.level, multipliers) : 0;
    const productionPerSecond = production > 0 ? production / (gameTask.cycleTime / 1000) : 0;

    // Progress bar width
    const progressWidth = (task.isActive || task.automated) ? (task.progress * 100) : 0;

    card.innerHTML = `
        <div class="task-header">
            <div class="task-icon">${gameTask.icon}</div>
            <div class="task-info">
                <div class="task-title" data-i18n="${gameTask.id}">${Lang.get(gameTask.id)}</div>
                <div class="task-level">${Lang.get('level')} ${task.level}</div>
            </div>
            <div class="task-status">
                ${task.automated ? `<span class="status status--success">${Lang.get('auto')}</span>` : 
                  task.isActive ? `<span class="status status--info">${Lang.get('manual')}</span>` : 
                  task.unlocked ? '' : `<span class="status status--error">${Lang.get('locked')}</span>`}
            </div>
        </div>

        <div class="task-description" data-i18n="${gameTask.id}-desc">${Lang.get(gameTask.id + '-desc')}</div>

        <div class="task-stats">
            ${production > 0 ? `
                <div class="task-stat">
                    <span class="task-stat-label" data-i18n="production">${Lang.get('production')}</span>
                    <span class="task-stat-value">${Lang.formatNumber(productionPerSecond)}${Lang.get('per-second')}</span>
                </div>
            ` : ''}
            
            <div class="task-stat">
                <span class="task-stat-label" data-i18n="completions">Completions</span>
                <span class="task-stat-value">${Lang.formatNumber(task.totalCompletions)}</span>
            </div>
        </div>

        ${task.unlocked && (task.isActive || task.automated) ? `
            <div class="task-progress">
                <div class="task-progress-fill" style="width: ${progressWidth}%"></div>
            </div>
        ` : ''}

        <div class="task-buttons">
            ${!task.unlocked || task.level < gameTask.maxLevel ? `
                <button class="task-btn ${isAffordable ? 'primary' : 'secondary'}" 
                        ${!isAffordable ? 'disabled' : ''}>
                    ${actionText}: ${Lang.formatNumber(actionCost)}
                </button>
            ` : `
                <button class="task-btn secondary" disabled>
                    ${Lang.get('max-level')}
                </button>
            `}
        </div>
    `;

    // --- POPRAWIONE: przycisk: odblokowanie/ulepszenie
    const button = card.querySelector('.task-btn');
    if (button && !button.disabled) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!task.unlocked) {
                // Odblokuj zadanie
                GameState.unlockTask(gameTask.id);
            } else if (task.unlocked && task.level < gameTask.maxLevel) {
                // Ulepsz zadanie
                GameLogic.upgradeTask(gameTask.id);
            }
            this.renderTasks(); // Odśwież widok po akcji
        });
    }

    // --- POPRAWIONE: klik w kartę: manualne kliknięcie na zadaniu
    if (task.unlocked && task.level > 0) {
        card.addEventListener('click', (e) => {
            if (e.target === button || e.target.closest('.task-btn')) return;
            GameLogic.clickTask(gameTask.id, true); // manual click
            // Efekt wizualny
            GameLogic.addClickAnimation(gameTask.id);
        });
        card.style.cursor = 'pointer';
    }

    return card;
}

    renderDeskUpgrades() {
        const deskGrid = document.getElementById('desk-grid');
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
        const isUnlocked = this.isDeskUpgradeUnlocked(upgrade);
        const canAfford = GameState.infinityPoints >= upgrade.cost;
        
        card.className = `desk-upgrade ${state.owned ? 'owned' : ''} ${!isUnlocked ? 'locked' : ''}`;

        card.innerHTML = `
            <div class="desk-upgrade-header">
                <div class="desk-upgrade-icon">${upgrade.icon}</div>
                <div class="desk-upgrade-info">
                    <h3 data-i18n="${upgrade.id}">${Lang.get(upgrade.id)}</h3>
                    <div class="desk-upgrade-cost">
                        ${Lang.get('cost')}: ${Lang.formatNumber(upgrade.cost)} ${Lang.get('infinity-points')}
                    </div>
                </div>
            </div>

            <div class="desk-upgrade-desc" data-i18n="${upgrade.id}-desc">${Lang.get(upgrade.id + '-desc')}</div>

            <div class="desk-upgrade-effect">
                <strong>${Lang.get('effect')}:</strong> 
                ${this.formatDeskUpgradeEffect(upgrade.effect)}
            </div>

            ${!isUnlocked ? `
                <div class="desk-upgrade-requirement">
                    <strong>${Lang.get('requires')}:</strong> 
                    ${upgrade.unlockRequirement.infinities} ${Lang.get('infinities')}
                </div>
            ` : ''}

            <button class="desk-upgrade-btn ${state.owned ? 'owned' : canAfford && isUnlocked ? 'buy' : 'disabled'}" 
                    ${state.owned || !canAfford || !isUnlocked ? 'disabled' : ''}>
                ${state.owned ? Lang.get('owned') : Lang.get('buy')}
            </button>
        `;

        // Add click handler
        const button = card.querySelector('.desk-upgrade-btn');
        if (button && !button.disabled) {
            button.addEventListener('click', () => {
                if (GameLogic.purchaseDeskUpgrade(upgrade.id)) {
                    this.renderDeskUpgrades(); // Refresh after purchase
                }
            });
        }

        return card;
    }

    formatDeskUpgradeEffect(effect) {
        switch (effect.type) {
            case 'multiplier':
                return `${effect.value}x ${effect.target === 'all' ? 'all production' : effect.target}`;
            case 'speed':
                return `${effect.value}x ${effect.target === 'all' ? 'all speed' : effect.target}`;
            default:
                return `${effect.value}x ${effect.target}`;
        }
    }

    isDeskUpgradeUnlocked(upgrade) {
        const req = upgrade.unlockRequirement;
        if (req.infinities) {
            return GameState.infinities >= req.infinities;
        }
        return true;
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
        const isUnlocked = GameLogic.isChallengeUnlocked(challenge.id);
        const isActive = GameState.state.currentChallenge === challenge.id;
        
        card.className = `challenge-card ${progress.completed ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;

        let statusClass = 'locked';
        let statusText = Lang.get('locked');
        
        if (isUnlocked) {
            if (progress.completed) {
                statusClass = 'completed';
                statusText = Lang.get('completed');
            } else if (isActive) {
                statusClass = 'in-progress';
                statusText = Lang.get('in-progress');
            } else {
                statusClass = 'available';
                statusText = Lang.get('available');
            }
        }

        card.innerHTML = `
            <div class="challenge-header">
                <h3 class="challenge-title" data-i18n="${challenge.id}">${Lang.get(challenge.id)}</h3>
                <span class="challenge-status ${statusClass}">${statusText}</span>
            </div>

            <div class="challenge-desc" data-i18n="${challenge.id}-desc">${Lang.get(challenge.id + '-desc')}</div>

            <div class="challenge-goal">
                <strong>${Lang.get('goal')}:</strong> ${this.formatChallengeGoal(challenge.goal)}
            </div>

            ${challenge.restriction ? `
                <div class="challenge-restriction">
                    <strong>${Lang.get('restriction')}:</strong> ${this.formatChallengeRestriction(challenge.restriction)}
                </div>
            ` : ''}

            <div class="challenge-reward">
                <div class="challenge-reward-title">${Lang.get('reward')}</div>
                ${this.formatChallengeReward(challenge.reward)}
            </div>

            ${progress.bestTime ? `
                <div class="challenge-best-time">
                    <strong>${Lang.get('best-time')}:</strong> ${Lang.formatTime(progress.bestTime)}
                </div>
            ` : ''}

            <div class="challenge-buttons">
                ${isUnlocked && !progress.completed ? `
                    <button class="btn btn--${isActive ? 'secondary' : 'primary'}" 
                            onclick="GameLogic.${isActive ? 'exitChallenge' : 'startChallenge'}('${challenge.id}')">
                        ${isActive ? Lang.get('exit-challenge') : Lang.get('start-challenge')}
                    </button>
                ` : ''}
            </div>
        `;

        return card;
    }

    formatChallengeGoal(goal) {
        switch (goal.type) {
            case 'officePoints':
                return `Reach ${Lang.formatNumber(goal.value)} office points`;
            case 'taskCompletions':
                return `Complete ${goal.value} ${goal.target === 'all' ? 'total tasks' : goal.target}`;
            case 'simultaneousTasks':
                return `Have ${goal.value} tasks running simultaneously`;
            case 'infinity':
                return `Reach infinity`;
            default:
                return `Complete ${goal.type}`;
        }
    }

    formatChallengeRestriction(restriction) {
        switch (restriction.type) {
            case 'disableTask':
                return `${Lang.get(restriction.target)} is disabled`;
            case 'maxTaskTypes':
                return `Maximum ${restriction.value} different task types`;
            case 'noManualClicks':
                return `No manual task clicking allowed`;
            default:
                return restriction.type;
        }
    }

    formatChallengeReward(reward) {
        switch (reward.type) {
            case 'efficiency':
                return `${reward.value}x task efficiency`;
            case 'click':
                return `${reward.value}x click power`;
            case 'automation':
                return `${reward.value}x automation speed`;
            default:
                return `${reward.value}x ${reward.target}`;
        }
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

        // Get a simple icon based on achievement type or use a default
        const icon = this.getAchievementIcon(achievement.id);

        card.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-info">
                <h3 data-i18n="${achievement.id}">${Lang.get(achievement.id)}</h3>
                <div class="achievement-desc" data-i18n="${achievement.id}-desc">${Lang.get(achievement.id + '-desc')}</div>
                <div class="achievement-progress">
                    <strong>${Lang.get('requirement')}:</strong> ${this.formatAchievementRequirement(achievement.requirement)}
                </div>
                ${achievement.reward ? `
                    <div class="achievement-reward">
                        <strong>${Lang.get('reward')}:</strong> ${Lang.get(achievement.id + '-reward')}
                    </div>
                ` : ''}
                ${state.unlocked && state.unlockedAt ? `
                    <div class="achievement-unlock-time">
                        ${Lang.get('unlocked')}: ${new Date(state.unlockedAt).toLocaleString()}
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    getAchievementIcon(achievementId) {
        const icons = {
            'first-day': '🎯',
            'coffee-addict': '☕',
            'meeting-master': '👥',
            'infinite-worker': '∞',
            'automation-enthusiast': '⚙️',
            'desk-collector': '🏢',
            'challenge-accepted': '🏆',
            'point-millionaire': '💰'
        };
        return icons[achievementId] || '🏅';
    }

    formatAchievementRequirement(requirement) {
        switch (requirement.type) {
            case 'officePoints':
                return `Earn ${Lang.formatNumber(requirement.value)} office points`;
            case 'taskCompletions':
                if (requirement.target === 'all') {
                    return `Complete ${requirement.value} total tasks`;
                } else {
                    return `Complete ${Lang.get(requirement.target)} ${requirement.value} times`;
                }
            case 'infinities':
                return `Reach infinity ${requirement.value} time${requirement.value !== 1 ? 's' : ''}`;
            case 'totalPointsEarned':
                return `Earn ${Lang.formatNumber(requirement.value)} total office points`;
            case 'deskUpgradesBought':
                return `Purchase ${requirement.value} desk upgrades`;
            case 'challengesCompleted':
                return `Complete ${requirement.value} challenges`;
            case 'allTasksAutomated':
                return `Have all tasks automated`;
            default:
                return requirement.type;
        }
    }

    renderSettings() {
        // Settings are mostly handled by the HTML and event listeners
        // Update any dynamic settings here if needed
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = GameState.state.settings.theme;
        }
    }

    initializeQuoteSystem() {
        // Populate quotes array
        for (let i = 1; i <= 10; i++) {
            this.quotesArray.push(`quote-${i}`);
        }
        
        // Start quote rotation
        this.rotateQuote();
        setInterval(() => {
            this.rotateQuote();
        }, 8000); // Change quote every 8 seconds
    }

    rotateQuote() {
        const quoteElement = document.getElementById('rotating-quote');
        if (!quoteElement) return;

        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotesArray.length;
        const quoteKey = this.quotesArray[this.currentQuoteIndex];
        quoteElement.textContent = Lang.get(quoteKey);
        quoteElement.setAttribute('data-i18n', quoteKey);
    }

    startUIUpdateLoop() {
        // Update UI elements that need frequent updates
        this.updateInterval = setInterval(() => {
            this.updateDynamicElements();
        }, 100); // 10 FPS for UI updates
    }

    updateDynamicElements() {
        // Only update the current tab's dynamic elements
        switch (this.currentTab) {
            case 'tasks':
                this.updateTaskProgressBars();
                break;
            case 'desk':
                // Desk upgrades are mostly static
                break;
            case 'challenges':
                // Update challenge progress if in a challenge
                if (GameState.state.inChallenge) {
                    GameLogic.checkChallengeCompletion();
                }
                break;
            case 'achievements':
                // Achievements are mostly static
                break;
        }

        // Force full refresh periodically to catch any missed updates
        const now = Date.now();
        if (now - this.lastFullRefresh > 5000) { // Every 5 seconds
            this.refreshCurrentTab();
            this.lastFullRefresh = now;
        }
    }

    updateTaskProgressBars() {
        document.querySelectorAll('[data-task-id]').forEach(taskElement => {
            const taskId = taskElement.getAttribute('data-task-id');
            const task = GameState.tasks[taskId];
            const progressBar = taskElement.querySelector('.task-progress-fill');
            
            if (task && progressBar && (task.isActive || task.automated)) {
                const progressWidth = task.progress * 100;
                progressBar.style.width = `${progressWidth}%`;
            }
        });
    }

    refreshCurrentTab() {
        this.renderTabContent(this.currentTab);
    }

    forceFullRefresh() {
        // Refresh all tabs
        this.renderTasks();
        this.renderDeskUpgrades();
        this.renderChallenges();
        this.renderAchievements();
        this.renderSettings();
        
        // Update language
        Lang.updateLanguage();
        
        this.lastFullRefresh = Date.now();
    }

    bindUIEvents() {
        // Handle window resize for responsive layout
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change (tab switching, minimize, etc.)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Refresh UI when tab becomes visible again
                this.forceFullRefresh();
            }
        });

        // Handle language change
        document.addEventListener('languageChanged', () => {
            this.forceFullRefresh();
        });
    }

    handleResize() {
        // Handle any responsive UI adjustments
        // This could include adjusting grid layouts, font sizes, etc.
    }

    renderInitialUI() {
        // Render all tabs initially
        this.renderTasks();
        this.renderDeskUpgrades();
        this.renderChallenges();
        this.renderAchievements();
        this.renderSettings();
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

// Initialize global UI manager
window.UIManager = new UIManager();
