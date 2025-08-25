// Enhanced Game Data for Corporate Rat Idle

window.GameData = {
    version: '2.0.0',
    
    // Core Configuration
    config: {
        // Save settings
        autoSaveInterval: 30000, // 30 seconds
        maxOfflineHours: 24,
        offlineEfficiency: 0.75, // 75% efficiency when offline
        
        // Infinity thresholds
        firstInfinityThreshold: 100000, // 100K for first infinity
        infinityScaling: 1.2, // Each infinity requirement increases by 20%
        
        // Automation unlock thresholds  
        automationUnlockThreshold: 1000, // Basic automation at 1K points
        
        // Balance multipliers
        taskCostMultiplier: 1.15, // Each upgrade costs 15% more
        taskProductionBase: 1.08, // Each level increases production by 8%
        
        // Tick rate
        gameTickRate: 50, // 20 FPS (50ms per tick)
        
        // Prestige scaling
        infinityPointFormula: (officePoints) => {
            if (officePoints < GameData.config.firstInfinityThreshold) return 0;
            const log = Math.log10(officePoints / GameData.config.firstInfinityThreshold);
            return Math.floor(Math.pow(log + 1, 2.5) * 10);
        }
    },

    // Office Tasks (Pre-Infinity Layer)
    tasks: [
        {
            id: 'making-coffee',
            icon: '☕',
            unlockCost: 0,
            baseCost: 10,
            costMultiplier: 1.15,
            baseProduction: 1,
            cycleTime: 2000, // 2 seconds
            maxLevel: 200,
            category: 'basic'
        },
        {
            id: 'answering-emails',
            icon: '📧',
            unlockCost: 100,
            baseCost: 25,
            costMultiplier: 1.16,
            baseProduction: 2.5,
            cycleTime: 2500,
            maxLevel: 200,
            category: 'basic'
        },
        {
            id: 'filing-reports',
            icon: '📄',
            unlockCost: 500,
            baseCost: 100,
            costMultiplier: 1.17,
            baseProduction: 6,
            cycleTime: 3000,
            maxLevel: 200,
            category: 'basic'
        },
        {
            id: 'small-talk',
            icon: '💬',
            unlockCost: 2000,
            baseCost: 300,
            costMultiplier: 1.18,
            baseProduction: 15,
            cycleTime: 3500,
            maxLevel: 200,
            category: 'social'
        },
        {
            id: 'fixing-printer',
            icon: '🖨️',
            unlockCost: 8000,
            baseCost: 800,
            costMultiplier: 1.19,
            baseProduction: 35,
            cycleTime: 4000,
            maxLevel: 200,
            category: 'technical'
        },
        {
            id: 'excel-sheets',
            icon: '📊',
            unlockCost: 25000,
            baseCost: 2000,
            costMultiplier: 1.20,
            baseProduction: 80,
            cycleTime: 4500,
            maxLevel: 200,
            category: 'technical'
        },
        {
            id: 'powerpoint-slides',
            icon: '📈',
            unlockCost: 75000,
            baseCost: 5000,
            costMultiplier: 1.21,
            baseProduction: 180,
            cycleTime: 5000,
            maxLevel: 200,
            category: 'presentations'
        },
        {
            id: 'team-meetings',
            icon: '👥',
            unlockCost: 200000,
            baseCost: 12000,
            costMultiplier: 1.22,
            baseProduction: 400,
            cycleTime: 6000,
            maxLevel: 200,
            category: 'meetings'
        },
        {
            id: 'client-calls',
            icon: '📞',
            unlockCost: 500000,
            baseCost: 30000,
            costMultiplier: 1.23,
            baseProduction: 900,
            cycleTime: 7000,
            maxLevel: 200,
            category: 'communication'
        },
        {
            id: 'lunch-networking',
            icon: '🍱',
            unlockCost: 1200000,
            baseCost: 70000,
            costMultiplier: 1.24,
            baseProduction: 2000,
            cycleTime: 8000,
            maxLevel: 200,
            category: 'networking'
        },
        {
            id: 'project-planning',
            icon: '📋',
            unlockCost: 3000000,
            baseCost: 160000,
            costMultiplier: 1.25,
            baseProduction: 4500,
            cycleTime: 9000,
            maxLevel: 200,
            category: 'planning'
        },
        {
            id: 'budget-reviews',
            icon: '💰',
            unlockCost: 7000000,
            baseCost: 350000,
            costMultiplier: 1.26,
            baseProduction: 10000,
            cycleTime: 10000,
            maxLevel: 200,
            category: 'financial'
        },
        {
            id: 'performance-reviews',
            icon: '📝',
            unlockCost: 15000000,
            baseCost: 750000,
            costMultiplier: 1.27,
            baseProduction: 22000,
            cycleTime: 12000,
            maxLevel: 200,
            category: 'hr'
        },
        {
            id: 'strategic-planning',
            icon: '🎯',
            unlockCost: 35000000,
            baseCost: 1600000,
            costMultiplier: 1.28,
            baseProduction: 48000,
            cycleTime: 15000,
            maxLevel: 200,
            category: 'strategy'
        },
        {
            id: 'executive-briefings',
            icon: '👔',
            unlockCost: 80000000,
            baseCost: 3500000,
            costMultiplier: 1.29,
            baseProduction: 105000,
            cycleTime: 18000,
            maxLevel: 200,
            category: 'executive'
        },
        {
            id: 'corporate-training',
            icon: '🎓',
            unlockCost: 180000000,
            baseCost: 7500000,
            costMultiplier: 1.30,
            baseProduction: 230000,
            cycleTime: 22000,
            maxLevel: 200,
            category: 'training'
        }
    ],

    // Desk Upgrades (Infinity Layer)
    deskUpgrades: [
        {
            id: 'coffee-mug',
            icon: '☕',
            cost: 1, // Infinity Points
            effect: { type: 'multiplier', target: 'all', value: 1.15 },
            unlockRequirement: { infinities: 1 }
        },
        {
            id: 'desk-plant',
            icon: '🌱',
            cost: 2,
            effect: { type: 'multiplier', target: 'all', value: 1.12 },
            unlockRequirement: { infinities: 1 }
        },
        {
            id: 'second-monitor',
            icon: '🖥️',
            cost: 5,
            effect: { type: 'multiplier', target: 'all', value: 1.25 },
            unlockRequirement: { infinities: 2 }
        },
        {
            id: 'ergonomic-chair',
            icon: '🪑',
            cost: 12,
            effect: { type: 'multiplier', target: 'all', value: 1.20 },
            unlockRequirement: { infinities: 3 }
        },
        {
            id: 'standing-desk',
            icon: '📐',
            cost: 25,
            effect: { type: 'multiplier', target: 'all', value: 1.30 },
            unlockRequirement: { infinities: 5 }
        },
        {
            id: 'noise-canceling-headphones',
            icon: '🎧',
            cost: 50,
            effect: { type: 'multiplier', target: 'all', value: 1.18 },
            unlockRequirement: { infinities: 8 }
        },
        {
            id: 'mechanical-keyboard',
            icon: '⌨️',
            cost: 100,
            effect: { type: 'multiplier', target: 'all', value: 1.22 },
            unlockRequirement: { infinities: 12 }
        },
        {
            id: 'executive-nameplate',
            icon: '📛',
            cost: 200,
            effect: { type: 'multiplier', target: 'all', value: 1.35 },
            unlockRequirement: { infinities: 18 }
        },
        {
            id: 'mini-fridge',
            icon: '🧊',
            cost: 400,
            effect: { type: 'multiplier', target: 'all', value: 1.40 },
            unlockRequirement: { infinities: 25 }
        },
        {
            id: 'corner-office',
            icon: '🏢',
            cost: 1000,
            effect: { type: 'multiplier', target: 'all', value: 2.00 },
            unlockRequirement: { infinities: 40 }
        }
    ],

    // Challenges
    challenges: [
        {
            id: 'no-coffee-challenge',
            unlockRequirement: { infinities: 1 },
            goal: { type: 'taskCompletions', target: 'all', value: 100 },
            restriction: { type: 'disableTask', target: 'making-coffee' },
            reward: { type: 'efficiency', target: 'all', value: 1.25 },
            timeLimit: null
        },
        {
            id: 'speed-demon',
            unlockRequirement: { infinities: 2 },
            goal: { type: 'officePoints', value: 10000 },
            restriction: null,
            reward: { type: 'click', target: 'all', value: 2.0 },
            timeLimit: 600000 // 10 minutes
        },
        {
            id: 'multitasker',
            unlockRequirement: { infinities: 3 },
            goal: { type: 'simultaneousTasks', value: 8 },
            restriction: null,
            reward: { type: 'automation', target: 'all', value: 1.15 },
            timeLimit: null
        },
        {
            id: 'minimalist',
            unlockRequirement: { infinities: 5 },
            goal: { type: 'infinity', value: 1 },
            restriction: { type: 'maxTaskTypes', value: 3 },
            reward: { type: 'taskEfficiency', target: 'all', value: 1.50 },
            timeLimit: null
        },
        {
            id: 'efficiency-expert',
            unlockRequirement: { infinities: 8 },
            goal: { type: 'taskCompletions', target: 'all', value: 1000 },
            restriction: { type: 'noManualClicks' },
            reward: { type: 'automationSpeed', target: 'all', value: 1.30 },
            timeLimit: null
        }
    ],

    // Achievements
    achievements: [
        {
            id: 'first-day',
            requirement: { type: 'officePoints', value: 100 },
            reward: { type: 'click', target: 'all', value: 1.10 }
        },
        {
            id: 'coffee-addict',
            requirement: { type: 'taskCompletions', target: 'making-coffee', value: 100 },
            reward: { type: 'efficiency', target: 'making-coffee', value: 1.25 }
        },
        {
            id: 'meeting-master',
            requirement: { type: 'taskCompletions', target: 'team-meetings', value: 50 },
            reward: { type: 'rewards', target: 'team-meetings', value: 1.20 }
        },
        {
            id: 'infinite-worker',
            requirement: { type: 'infinities', value: 1 },
            reward: { type: 'infinityGain', target: 'all', value: 1.50 }
        },
        {
            id: 'automation-enthusiast',
            requirement: { type: 'allTasksAutomated' },
            reward: { type: 'automationSpeed', target: 'all', value: 1.15 }
        },
        {
            id: 'desk-collector',
            requirement: { type: 'deskUpgradesBought', value: 5 },
            reward: { type: 'deskEfficiency', target: 'all', value: 1.10 }
        },
        {
            id: 'challenge-accepted',
            requirement: { type: 'challengesCompleted', value: 1 },
            reward: { type: 'challengeRewards', target: 'all', value: 1.05 }
        },
        {
            id: 'point-millionaire',
            requirement: { type: 'totalPointsEarned', value: 1000000 },
            reward: { type: 'multiplier', target: 'all', value: 1.30 }
        }
    ],

    // Automation Configuration
    automation: [
        {
            id: 'basic-automation',
            unlockAt: { officePoints: 1000 },
            description: 'Tasks automatically progress when clicked'
        },
        {
            id: 'auto-clicker',
            unlockAt: { officePoints: 10000 },
            description: 'Automatically clicks available tasks'
        },
        {
            id: 'auto-upgrade',
            unlockAt: { infinities: 1 },
            description: 'Automatically purchases upgrades when beneficial'
        },
        {
            id: 'auto-infinity',
            unlockAt: { infinities: 5 },
            description: 'Automatically performs infinity when optimal'
        }
    ],

    // Helper functions
    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    },

    getDeskUpgradeById(id) {
        return this.deskUpgrades.find(upgrade => upgrade.id === id);
    },

    getChallengeById(id) {
        return this.challenges.find(challenge => challenge.id === id);
    },

    getAchievementById(id) {
        return this.achievements.find(achievement => achievement.id === id);
    },

    calculateTaskCost(taskId, currentLevel) {
        const task = this.getTaskById(taskId);
        if (!task) return 0;
        return Math.floor(task.baseCost * Math.pow(task.costMultiplier, currentLevel));
    },

    calculateTaskProduction(taskId, level, multipliers = {}) {
        const task = this.getTaskById(taskId);
        if (!task || level === 0) return 0;
        
        const baseProduction = task.baseProduction * Math.pow(this.config.taskProductionBase, level - 1);
        const allMultiplier = multipliers.all || 1;
        const taskMultiplier = multipliers[taskId] || 1;
        const categoryMultiplier = multipliers[task.category] || 1;
        
        return baseProduction * allMultiplier * taskMultiplier * categoryMultiplier;
    },

    isTaskUnlocked(taskId, gameState) {
        const task = this.getTaskById(taskId);
        if (!task) return false;
        return gameState.officePoints >= task.unlockCost;
    },

    calculateInfinityPoints(officePoints) {
        return this.config.infinityPointFormula(officePoints);
    },

    canPerformInfinity(officePoints) {
        return officePoints >= this.config.firstInfinityThreshold;
    },

    getNextInfinityThreshold(currentInfinities) {
        return Math.floor(this.config.firstInfinityThreshold * Math.pow(this.config.infinityScaling, currentInfinities));
    },

    // Balance and progression calculations
    getOptimalInfinityTime(currentIP, currentOP, multipliers) {
        // Calculate if infinity is worthwhile based on IP gain vs time investment
        const potentialIP = this.calculateInfinityPoints(currentOP);
        const currentRate = this.calculateTotalProduction(multipliers);
        const timeToDouble = currentOP / currentRate;
        const timeToNextIP = Math.max(1, potentialIP) / currentRate;
        
        return timeToNextIP < timeToDouble * 2; // Perform infinity if next IP is less than 2x time to double current points
    },

    calculateTotalProduction(multipliers) {
        // Calculate total passive production per second
        let total = 0;
        this.tasks.forEach(task => {
            const taskState = window.GameState?.tasks[task.id];
            if (taskState && taskState.unlocked && taskState.level > 0) {
                const production = this.calculateTaskProduction(task.id, taskState.level, multipliers);
                const cyclesPerSecond = 1000 / task.cycleTime;
                total += production * cyclesPerSecond;
            }
        });
        return total;
    },

    // Balanced automation logic
    shouldAutoUpgrade(taskId, currentPoints) {
        const task = this.getTaskById(taskId);
        const taskState = window.GameState?.tasks[taskId];
        if (!task || !taskState || taskState.level >= task.maxLevel) return false;
        
        const upgradeCost = this.calculateTaskCost(taskId, taskState.level);
        const currentProduction = this.calculateTaskProduction(taskId, taskState.level, window.GameState?.getMultipliers() || {});
        const upgradeProduction = this.calculateTaskProduction(taskId, taskState.level + 1, window.GameState?.getMultipliers() || {});
        
        // Only upgrade if we have enough points and the efficiency gain is reasonable
        const pointsRatio = currentPoints / upgradeCost;
        const efficiencyGain = (upgradeProduction - currentProduction) / upgradeCost;
        
        return pointsRatio >= 3 && efficiencyGain > 0.05; // Conservative auto-upgrade strategy
    }
};