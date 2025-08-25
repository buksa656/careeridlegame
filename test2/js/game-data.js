// Game Data Configuration
window.GameData = {
    // Base configuration
    config: {
        // Infinity thresholds
        infinityThreshold: 1e308, // 1.79e308 is JavaScript's max safe number
        firstInfinityThreshold: 1e6, // First infinity at 1M points for testing
        
        // Automation unlock thresholds
        firstAutomationAt: 1000,
        
        // Save interval
        autoSaveInterval: 30000, // 30 seconds
        
        // Offline progression
        maxOfflineHours: 24,
        offlineEfficiency: 0.5, // 50% efficiency when offline
    },
    
    // Office Tasks (Pre-Infinity)
    tasks: [
        {
            id: 'making-coffee',
            icon: '☕',
            unlockCost: 0,
            baseCost: 10,
            costMultiplier: 1.15,
            baseProduction: 0.5,
            baseIdleRate: 0.1,
            cycleTime: 2000, // 2 seconds
            maxLevel: 100,
            category: 'basic'
        },
        {
            id: 'copying-files',
            icon: '📄',
            unlockCost: 50,
            baseCost: 25,
            costMultiplier: 1.18,
            baseProduction: 1.2,
            baseIdleRate: 0.2,
            cycleTime: 3000,
            maxLevel: 100,
            category: 'basic'
        },
        {
            id: 'sorting-emails',
            icon: '📧',
            unlockCost: 200,
            baseCost: 75,
            costMultiplier: 1.2,
            baseProduction: 2.8,
            baseIdleRate: 0.4,
            cycleTime: 4000,
            maxLevel: 100,
            category: 'basic'
        },
        {
            id: 'small-talk',
            icon: '💬',
            unlockCost: 600,
            baseCost: 200,
            costMultiplier: 1.22,
            baseProduction: 6.5,
            baseIdleRate: 0.8,
            cycleTime: 5000,
            maxLevel: 100,
            category: 'social'
        },
        {
            id: 'bug-reports',
            icon: '🐛',
            unlockCost: 1500,
            baseCost: 500,
            costMultiplier: 1.25,
            baseProduction: 15,
            baseIdleRate: 1.5,
            cycleTime: 6000,
            maxLevel: 100,
            category: 'technical'
        },
        {
            id: 'excel-work',
            icon: '📊',
            unlockCost: 4000,
            baseCost: 1200,
            costMultiplier: 1.28,
            baseProduction: 35,
            baseIdleRate: 3.2,
            cycleTime: 8000,
            maxLevel: 100,
            category: 'technical'
        },
        {
            id: 'powerpoint',
            icon: '📈',
            unlockCost: 10000,
            baseCost: 3000,
            costMultiplier: 1.3,
            baseProduction: 80,
            baseIdleRate: 6.8,
            cycleTime: 10000,
            maxLevel: 100,
            category: 'presentations'
        },
        {
            id: 'teams-training',
            icon: '💻',
            unlockCost: 25000,
            baseCost: 7500,
            costMultiplier: 1.32,
            baseProduction: 180,
            baseIdleRate: 14,
            cycleTime: 12000,
            maxLevel: 100,
            category: 'technical'
        },
        {
            id: 'google-docs',
            icon: '📝',
            unlockCost: 60000,
            baseCost: 18000,
            costMultiplier: 1.35,
            baseProduction: 400,
            baseIdleRate: 28,
            cycleTime: 15000,
            maxLevel: 100,
            category: 'technical'
        },
        {
            id: 'meetings',
            icon: '🏢',
            unlockCost: 150000,
            baseCost: 45000,
            costMultiplier: 1.38,
            baseProduction: 900,
            baseIdleRate: 55,
            cycleTime: 18000,
            maxLevel: 100,
            category: 'meetings'
        },
        {
            id: 'presentations',
            icon: '👔',
            unlockCost: 350000,
            baseCost: 100000,
            costMultiplier: 1.4,
            baseProduction: 2000,
            baseIdleRate: 120,
            cycleTime: 22000,
            maxLevel: 100,
            category: 'presentations'
        },
        {
            id: 'monday-calls',
            icon: '📞',
            unlockCost: 800000,
            baseCost: 250000,
            costMultiplier: 1.42,
            baseProduction: 4500,
            baseIdleRate: 250,
            cycleTime: 25000,
            maxLevel: 100,
            category: 'meetings'
        },
        {
            id: 'lunch-break',
            icon: '🍱',
            unlockCost: 2000000,
            baseCost: 600000,
            costMultiplier: 1.45,
            baseProduction: 10000,
            baseIdleRate: 500,
            cycleTime: 30000,
            maxLevel: 100,
            category: 'social'
        },
        {
            id: 'sending-gifs',
            icon: '🎭',
            unlockCost: 5000000,
            baseCost: 1500000,
            costMultiplier: 1.48,
            baseProduction: 22000,
            baseIdleRate: 1100,
            cycleTime: 35000,
            maxLevel: 100,
            category: 'social'
        },
        {
            id: 'linkedin',
            icon: '🔗',
            unlockCost: 12000000,
            baseCost: 4000000,
            costMultiplier: 1.5,
            baseProduction: 50000,
            baseIdleRate: 2400,
            cycleTime: 40000,
            maxLevel: 100,
            category: 'networking'
        },
        {
            id: 'office-king',
            icon: '👑',
            unlockCost: 30000000,
            baseCost: 10000000,
            costMultiplier: 1.52,
            baseProduction: 120000,
            baseIdleRate: 5500,
            cycleTime: 50000,
            maxLevel: 100,
            category: 'leadership'
        }
    ],
    
    // Desk Upgrades (Infinity Layer)
    deskUpgrades: [
        {
            id: 'coffee-mug',
            icon: '☕',
            cost: 1, // Infinity Points
            effect: { type: 'multiplier', target: 'all', value: 1.1 },
            unlockRequirement: { infinities: 1 }
        },
        {
            id: 'desk-plant',
            icon: '🌱',
            cost: 2,
            effect: { type: 'multiplier', target: 'all', value: 1.08 },
            unlockRequirement: { infinities: 1 }
        },
        {
            id: 'desk-lamp',
            icon: '💡',
            cost: 5,
            effect: { type: 'speed', target: 'all', value: 1.15 },
            unlockRequirement: { infinities: 2 }
        },
        {
            id: 'monitor',
            icon: '🖥️',
            cost: 10,
            effect: { type: 'efficiency', target: 'all', value: 1.2 },
            unlockRequirement: { infinities: 3 }
        },
        {
            id: 'stress-ball',
            icon: '⚽',
            cost: 20,
            effect: { type: 'click', target: 'all', value: 1.05 },
            unlockRequirement: { infinities: 5 }
        },
        {
            id: 'ergonomic-chair',
            icon: '🪑',
            cost: 50,
            effect: { type: 'multiplier', target: 'all', value: 1.25 },
            unlockRequirement: { infinities: 8 }
        },
        {
            id: 'standing-desk',
            icon: '📐',
            cost: 100,
            effect: { type: 'generation', target: 'all', value: 1.3 },
            unlockRequirement: { infinities: 12 }
        },
        {
            id: 'executive-desk',
            icon: '💎',
            cost: 500,
            effect: { type: 'multiplier', target: 'all', value: 1.5 },
            unlockRequirement: { infinities: 20 }
        }
    ],
    
    // Challenges
    challenges: [
        {
            id: 'no-coffee',
            unlockRequirement: { infinities: 1 },
            goal: { type: 'taskCompletions', target: 'all', value: 100 },
            restriction: { type: 'disableTask', target: 'making-coffee' },
            reward: { type: 'efficiency', target: 'all', value: 1.25 },
            timeLimit: null
        },
        {
            id: 'speed-demon',
            unlockRequirement: { infinities: 2 },
            goal: { type: 'officePoints', value: 1000 },
            restriction: null,
            reward: { type: 'click', target: 'all', value: 2 },
            timeLimit: 300000 // 5 minutes
        },
        {
            id: 'multitasker',
            unlockRequirement: { infinities: 3 },
            goal: { type: 'simultaneousTasks', value: 5 },
            restriction: null,
            reward: { type: 'automation', target: 'all', value: 1.15 },
            timeLimit: null
        },
        {
            id: 'workaholic',
            unlockRequirement: { infinities: 5 },
            goal: { type: 'officePoints', value: 1000000 },
            restriction: { type: 'noUpgrades' },
            reward: { type: 'offline', target: 'all', value: 3 },
            timeLimit: null
        }
    ],
    
    // Achievements
    achievements: [
        {
            id: 'first-day',
            requirement: { type: 'officePoints', value: 100 },
            reward: { type: 'click', target: 'all', value: 1.1 }
        },
        {
            id: 'coffee-addict',
            requirement: { type: 'taskCompletions', target: 'making-coffee', value: 50 },
            reward: { type: 'efficiency', target: 'making-coffee', value: 1.2 }
        },
        {
            id: 'meeting-master',
            requirement: { type: 'taskCompletions', target: 'meetings', value: 25 },
            reward: { type: 'rewards', target: 'meetings', value: 1.15 }
        },
        {
            id: 'infinite-worker',
            requirement: { type: 'infinities', value: 1 },
            reward: { type: 'infinityGain', target: 'all', value: 2 }
        },
        {
            id: 'task-master',
            requirement: { type: 'tasksUnlocked', value: 10 },
            reward: { type: 'multiplier', target: 'all', value: 1.15 }
        },
        {
            id: 'upgrade-enthusiast',
            requirement: { type: 'upgradesPurchased', value: 50 },
            reward: { type: 'upgradeCost', target: 'all', value: 0.95 }
        },
        {
            id: 'automation-master',
            requirement: { type: 'automationTime', value: 3600000 }, // 1 hour
            reward: { type: 'automationSpeed', target: 'all', value: 1.2 }
        },
        {
            id: 'point-collector',
            requirement: { type: 'totalPointsEarned', value: 10000000 },
            reward: { type: 'multiplier', target: 'all', value: 1.25 }
        },
        {
            id: 'desk-decorator',
            requirement: { type: 'deskUpgradesBought', value: 5 },
            reward: { type: 'deskEfficiency', target: 'all', value: 1.1 }
        },
        {
            id: 'challenger',
            requirement: { type: 'challengesCompleted', value: 3 },
            reward: { type: 'challengeRewards', target: 'all', value: 1.2 }
        }
    ],
    
    // Automation unlocks
    automation: [
        {
            id: 'basic-automation',
            unlockAt: { officePoints: 1000 },
            description: 'Tasks automatically progress when unlocked'
        },
        {
            id: 'auto-clicker',
            unlockAt: { officePoints: 10000 },
            description: 'Automatically clicks tasks every second'
        },
        {
            id: 'auto-upgrade',
            unlockAt: { infinities: 1 },
            description: 'Automatically purchases upgrades'
        },
        {
            id: 'auto-infinity',
            unlockAt: { infinities: 5 },
            description: 'Automatically performs infinity when beneficial'
        }
    ],
    
    // Prestige mechanics
    prestige: {
        infinityPointFormula: (antimatter) => {
            // Based on Antimatter Dimensions formula
            const log = Math.log10(antimatter);
            if (log < 308) return 0;
            return Math.floor(Math.pow(log / 308, 2) * 100);
        },
        
        softSkillFormula: (officePoints) => {
            // Soft skills earned from regular prestige
            if (officePoints < 10000) return 0;
            return Math.floor(Math.log10(officePoints / 10000) + 1);
        }
    },
    
    // Balance multipliers
    balance: {
        // Task progression scaling
        levelCostIncrease: 1.15,
        productionIncrease: 1.05,
        
        // Infinity scaling
        infinityPointMultiplier: 1.0,
        postInfinityScaling: 0.95,
        
        // Automation efficiency
        automationEfficiency: {
            basic: 0.8,
            improved: 0.9,
            advanced: 1.0,
            master: 1.1
        },
        
        // Offline progression
        offlineMultiplier: 0.5,
        maxOfflineGain: 24 * 3600 * 1000 // 24 hours in milliseconds
    }
};

// Helper functions for game data
window.GameData.getTaskById = function(id) {
    return this.tasks.find(task => task.id === id);
};

window.GameData.getDeskUpgradeById = function(id) {
    return this.deskUpgrades.find(upgrade => upgrade.id === id);
};

window.GameData.getChallengeById = function(id) {
    return this.challenges.find(challenge => challenge.id === id);
};

window.GameData.getAchievementById = function(id) {
    return this.achievements.find(achievement => achievement.id === id);
};

window.GameData.calculateTaskCost = function(taskId, currentLevel) {
    const task = this.getTaskById(taskId);
    if (!task) return 0;
    
    return Math.floor(task.baseCost * Math.pow(task.costMultiplier, currentLevel));
};

window.GameData.calculateTaskProduction = function(taskId, level, multipliers = {}) {
    const task = this.getTaskById(taskId);
    if (!task) return 0;
    
    const baseProduction = task.baseProduction * Math.pow(1.05, level);
    const allMultiplier = multipliers.all || 1;
    const taskMultiplier = multipliers[taskId] || 1;
    
    return baseProduction * allMultiplier * taskMultiplier;
};

window.GameData.isTaskUnlocked = function(taskId, gameState) {
    const task = this.getTaskById(taskId);
    if (!task) return false;
    
    return gameState.officePoints >= task.unlockCost;
};

window.GameData.calculateInfinityPoints = function(officePoints) {
    if (officePoints < this.config.firstInfinityThreshold) return 0;
    
    const log = Math.log10(officePoints);
    return Math.floor(Math.pow((log - 6) / 2, 2.5));
};
