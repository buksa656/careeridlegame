// CorpoClicker Enhanced - Advanced Incremental Idle Game
// Based on original Korposzczur with extended systems

class CorpoClickerEnhanced {
    constructor() {
        // Enhanced resource system
        this.resources = this.initializeResources();
        this.departments = this.initializeDepartments();
        this.events = this.initializeEvents();
        this.minigames = this.initializeMinigames();
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.currentLanguage = this.gameState.settings.language || 'pl';
        
        // Game loops
        this.gameLoopInterval = null;
        this.eventLoopInterval = null;
        this.autosaveInterval = null;
        
        // Event system
        this.eventListeners = {
            resourceChange: [],
            departmentUnlock: [],
            eventTrigger: [],
            achievementUnlock: []
        };

        this.init();
    }

    initializeResources() {
        return {
            budget: {
                value: 100,
                baseProduction: 0,
                productionMultiplier: 1,
                softcaps: [
                    { threshold: 10000, reduction: 0.8 },
                    { threshold: 100000, reduction: 0.5 }
                ],
                sideEffects: []
            },
            documents: {
                value: 0,
                baseProduction: 0,
                productionMultiplier: 1,
                softcaps: [
                    { threshold: 1000, reduction: 0.9 },
                    { threshold: 10000, reduction: 0.6 }
                ],
                sideEffects: [
                    { type: 'stress', value: 0.01, perUnit: true }
                ]
            },
            coffee: {
                value: 0,
                baseProduction: 0,
                productionMultiplier: 1,
                softcaps: [
                    { threshold: 1000, reduction: 0.9 }
                ],
                sideEffects: [
                    { type: 'stress', value: -0.1, perUnit: true }
                ]
            },
            stress: {
                value: 0,
                baseProduction: 0,
                productionMultiplier: 1,
                max: 200,
                softcaps: [],
                sideEffects: [
                    { type: 'production', value: -0.01, threshold: 50 }
                ]
            },
            motivation: {
                value: 50,
                baseProduction: 0,
                productionMultiplier: 1,
                max: 100,
                min: -50,
                softcaps: [],
                sideEffects: [
                    { type: 'production', value: 0.01, threshold: 50 }
                ]
            },
            prestige: {
                value: 0,
                baseProduction: 0,
                productionMultiplier: 1,
                softcaps: [],
                sideEffects: []
            },
            workTime: {
                value: 9, // 9:00 AM
                max: 17, // 5:00 PM
                productionMultiplier: 1, // Reduced outside hours
                isWorkHours: true
            }
        };
    }

    initializeDepartments() {
        return {
            hr: {
                name: "HR Department",
                nameKey: "dept_hr",
                owned: 0,
                baseCost: { budget: 10 },
                costMultiplier: 1.15,
                production: {
                    documents: 1
                },
                consumption: {},
                sideEffects: {
                    stress: 0.05
                },
                requirements: {},
                unlocked: true
            },
            it: {
                name: "IT Department", 
                nameKey: "dept_it",
                owned: 0,
                baseCost: { budget: 15 },
                costMultiplier: 1.15,
                production: {
                    coffee: 1
                },
                consumption: {},
                sideEffects: {
                    motivation: -0.1
                },
                requirements: {
                    documents: 5
                },
                unlocked: false
            },
            marketing: {
                name: "Marketing Department",
                nameKey: "dept_marketing", 
                owned: 0,
                baseCost: { budget: 20 },
                costMultiplier: 1.15,
                production: {
                    budget: 1,
                    prestige: 0.02
                },
                consumption: {},
                sideEffects: {},
                requirements: {
                    documents: 10
                },
                unlocked: false
            },
            accounting: {
                name: "Accounting Department",
                nameKey: "dept_accounting",
                owned: 0,
                baseCost: { budget: 30 },
                costMultiplier: 1.15,
                production: {
                    budget: 0.5
                },
                consumption: {
                    budget: 0.1 // Embezzlement
                },
                sideEffects: {
                    stress: 0.1
                },
                requirements: {
                    documents: 15
                },
                unlocked: false
            },
            management: {
                name: "Management",
                nameKey: "dept_management",
                owned: 0,
                baseCost: { budget: 50 },
                costMultiplier: 1.15,
                production: {
                    motivation: 0.2
                },
                consumption: {
                    documents: 0.5
                },
                sideEffects: {},
                requirements: {
                    prestige: 20
                },
                unlocked: false
            },
            rd: {
                name: "R&D Department",
                nameKey: "dept_rd",
                owned: 0,
                baseCost: { budget: 100 },
                costMultiplier: 1.15,
                production: {},
                consumption: {},
                sideEffects: {
                    stress: 0.2
                },
                requirements: {
                    prestige: 30
                },
                unlocked: false,
                specialEffect: "unlocks_random_upgrades"
            },
            callcenter: {
                name: "Call Center",
                nameKey: "dept_callcenter",
                owned: 0,
                baseCost: { budget: 200 },
                costMultiplier: 1.15,
                production: {
                    budget: 5
                },
                consumption: {},
                sideEffects: {
                    motivation: -0.3,
                    stress: 0.5
                },
                requirements: {
                    documents: 50
                },
                unlocked: false
            }
        };
    }

    initializeEvents() {
        return [
            {
                id: "boss_meeting",
                name: "Meeting with Boss",
                nameKey: "event_boss_meeting",
                condition: () => this.resources.stress.value > 30,
                effect: () => {
                    this.addResource('stress', 20);
                    this.addResource('budget', 50);
                    this.showNotification("Boss meeting: +20 stress, +50 budget (bonus for endurance)");
                },
                duration: 0,
                weight: 0.3
            },
            {
                id: "server_crash",
                name: "Server Crash",
                nameKey: "event_server_crash",
                condition: () => this.departments.it.owned > 3,
                effect: () => {
                    this.gameState.tempEffects.itShutdown = Date.now() + 30000;
                    this.addResource('motivation', -10);
                    this.showNotification("Server crash! IT production stopped for 30 seconds");
                },
                duration: 30000,
                weight: 0.2
            },
            {
                id: "team_building",
                name: "Team Building",
                nameKey: "event_team_building",
                condition: () => this.resources.motivation.value < 30,
                effect: () => {
                    this.addResource('motivation', 15);
                    this.addResource('budget', -50);
                    this.showNotification("Team building: +15 motivation, -50 budget");
                },
                duration: 0,
                weight: 0.4
            },
            {
                id: "tax_audit",
                name: "Tax Audit",
                nameKey: "event_tax_audit",
                condition: () => this.departments.accounting.owned > 2,
                effect: () => {
                    this.multiplyResource('budget', 0.7);
                    this.addResource('stress', 10);
                    this.showNotification("Tax audit: -30% budget, +10 stress");
                },
                duration: 0,
                weight: 0.15
            },
            {
                id: "virus_attack",
                name: "Virus Attack",
                nameKey: "event_virus_attack",
                condition: () => this.departments.it.owned > 5,
                effect: () => {
                    this.gameState.tempEffects.itReduced = Date.now() + 60000;
                    this.showNotification("Virus attack! IT production reduced by 80% for 60 seconds");
                },
                duration: 60000,
                weight: 0.1
            },
            {
                id: "company_party",
                name: "Company Party",
                nameKey: "event_company_party",
                condition: () => this.resources.prestige.value > 50,
                effect: () => {
                    this.addResource('motivation', 20);
                    this.addResource('budget', -100);
                    this.addResource('stress', 5);
                    this.showNotification("Company party: +20 motivation, -100 budget, +5 stress");
                },
                duration: 0,
                weight: 0.25
            },
            {
                id: "employee_month",
                name: "Employee of the Month",
                nameKey: "event_employee_month",
                condition: () => this.resources.motivation.value > 80,
                effect: () => {
                    this.gameState.tempEffects.productionBoost = Date.now() + 120000;
                    this.showNotification("Employee of the month: +10% production for 2 minutes");
                },
                duration: 120000,
                weight: 0.2
            },
            {
                id: "strike",
                name: "Strike",
                nameKey: "event_strike",
                condition: () => this.resources.stress.value > 80,
                effect: () => {
                    if (this.resources.motivation.value <= 70) {
                        this.gameState.tempEffects.strike = Date.now() + 60000;
                        this.showNotification("Strike! All production stopped for 60 seconds");
                    } else {
                        this.showNotification("Strike averted thanks to high motivation!");
                    }
                },
                duration: 60000,
                weight: 0.1
            }
        ];
    }

    initializeMinigames() {
        return {
            quarterly_report: {
                name: "Quarterly Report",
                nameKey: "minigame_report",
                type: "clicking",
                target: 50,
                timeLimit: 10000,
                reward: {
                    documents: 100,
                    prestige: 5
                },
                unlocked: true
            },
            meeting_dodge: {
                name: "Meeting Dodge",
                nameKey: "minigame_dodge",
                type: "dodge",
                difficulty: 1,
                timeLimit: 30000,
                reward: {
                    motivation: 60 // +1/sec for 60 seconds
                },
                unlocked: () => this.resources.stress.value > 50
            },
            coffee_shop: {
                name: "Corporate Coffee Shop",
                nameKey: "minigame_coffee",
                type: "timing",
                orders: 5,
                timeLimit: 15000,
                reward: {
                    coffee: 50,
                    stress: -10
                },
                unlocked: () => this.departments.it.owned > 0
            },
            government_contract: {
                name: "Government Contract",
                nameKey: "minigame_contract",
                type: "auction",
                competitors: 3,
                timeLimit: 20000,
                reward: {
                    budget: 500
                },
                unlocks: "government_contracts_upgrade",
                unlocked: () => this.resources.prestige.value > 100
            }
        };
    }

    initializeGameData() {
        // Existing game data structure expanded
        return {
            achievements: [
                // Existing achievements...
                {
                    id: "first_department",
                    nameKey: "ach_first_department",
                    descKey: "ach_first_department_desc",
                    condition: { type: "departments_owned", value: 1 },
                    reward: { type: "budget_bonus", value: 1.1 },
                    bonusDesc: "bonusDesc_budget_10"
                },
                {
                    id: "stress_master",
                    nameKey: "ach_stress_master",
                    descKey: "ach_stress_master_desc", 
                    condition: { type: "stress_survived", value: 100 },
                    reward: { type: "stress_resistance", value: 0.9 },
                    bonusDesc: "bonusDesc_stress_resist"
                },
                {
                    id: "coffee_addict",
                    nameKey: "ach_coffee_addict",
                    descKey: "ach_coffee_addict_desc",
                    condition: { type: "coffee_consumed", value: 100 },
                    reward: { type: "coffee_effectiveness", value: 1.15 },
                    bonusDesc: "bonusDesc_coffee_boost"
                },
                {
                    id: "document_master",
                    nameKey: "ach_document_master", 
                    descKey: "ach_document_master_desc",
                    condition: { type: "documents_produced", value: 1000 },
                    reward: { type: "document_generation", value: 1.1 },
                    bonusDesc: "bonusDesc_document_boost"
                }
            ],
            translations: {
                pl: {
                    // Department names
                    dept_hr: "Dział HR",
                    dept_it: "Dział IT", 
                    dept_marketing: "Marketing",
                    dept_accounting: "Księgowość",
                    dept_management: "Kadra zarządzająca",
                    dept_rd: "Dział R&D",
                    dept_callcenter: "Call Center",

                    // Resources
                    resource_budget: "Budżet",
                    resource_documents: "Dokumenty",
                    resource_coffee: "Kawa",
                    resource_stress: "Stres",
                    resource_motivation: "Motywacja",
                    resource_prestige: "Prestiż",
                    resource_worktime: "Czas pracy",

                    // Events
                    event_boss_meeting: "Spotkanie z szefem",
                    event_server_crash: "Awaria serwerów",
                    event_team_building: "Team building",
                    event_tax_audit: "Kontrola skarbowa",
                    event_virus_attack: "Atak wirusa",
                    event_company_party: "Impreza firmowa",
                    event_employee_month: "Pracownik miesiąca",
                    event_strike: "Strajk",

                    // Minigames
                    minigame_report: "Raport kwartalny",
                    minigame_dodge: "Unikanie spotkań",
                    minigame_coffee: "Kawiarnia korporacyjna", 
                    minigame_contract: "Przetarg publiczny",

                    // UI Elements
                    departments: "Działy",
                    events_log: "Wydarzenia",
                    minigames: "Mini-gry",
                    current_time: "Aktualny czas",
                    work_hours: "Godziny pracy",
                    buy_department: "Kup dział",
                    upgrade_department: "Ulepsz dział",
                    play_minigame: "Zagraj",

                    // Achievements
                    ach_first_department: "Pierwszy dział",
                    ach_first_department_desc: "Zatrudnij pierwszy dział",
                    ach_stress_master: "Mistrz stresu", 
                    ach_stress_master_desc: "Przeżyj 100 punktów stresu",
                    ach_coffee_addict: "Kawowy nałóg",
                    ach_coffee_addict_desc: "Wypij 100 kaw",
                    ach_document_master: "Mistrz dokumentacji",
                    ach_document_master_desc: "Wyprodukuj 1000 dokumentów",

                    bonusDesc_budget_10: "+10% do budżetu",
                    bonusDesc_stress_resist: "Stres oddziałuje 10% słabiej",
                    bonusDesc_coffee_boost: "Kawa 15% skuteczniejsza",
                    bonusDesc_document_boost: "+10% produkcji dokumentów"
                },
                en: {
                    // English translations...
                    dept_hr: "HR Department",
                    dept_it: "IT Department",
                    dept_marketing: "Marketing",
                    dept_accounting: "Accounting",
                    dept_management: "Management",
                    dept_rd: "R&D Department",
                    dept_callcenter: "Call Center",

                    resource_budget: "Budget",
                    resource_documents: "Documents", 
                    resource_coffee: "Coffee",
                    resource_stress: "Stress",
                    resource_motivation: "Motivation",
                    resource_prestige: "Prestige",
                    resource_worktime: "Work Time"
                    // ... more translations
                }
            }
        };
    }

    loadGameState() {
        const defaultState = {
            resources: this.resources,
            departments: {},
            achievements: {},
            stats: {
                totalClicks: 0,
                totalBudgetEarned: 0,
                totalStressEndured: 0,
                eventsTriggered: 0,
                minigamesPlayed: 0,
                departmentsOwned: 0
            },
            settings: {
                language: 'pl',
                theme: 'light',
                autoSave: true,
                soundEnabled: true
            },
            tempEffects: {},
            eventHistory: [],
            lastUpdate: Date.now()
        };

        try {
            const saved = localStorage.getItem('corpoclicker-enhanced-save');
            if (saved) {
                return { ...defaultState, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }
        
        return defaultState;
    }

    saveGameState() {
        try {
            localStorage.setItem('corpoclicker-enhanced-save', JSON.stringify(this.gameState));
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    // Resource management with softcap
    applySoftcap(resource, value) {
        const resourceData = this.resources[resource];
        if (!resourceData.softcaps) return value;

        let adjustedValue = value;
        for (const cap of resourceData.softcaps) {
            if (adjustedValue > cap.threshold) {
                const excess = adjustedValue - cap.threshold;
                adjustedValue = cap.threshold + (excess * cap.reduction);
            }
        }
        return adjustedValue;
    }

    addResource(resourceName, amount) {
        if (!this.resources[resourceName]) return;
        
        const oldValue = this.resources[resourceName].value;
        let newValue = oldValue + amount;
        
        // Apply constraints
        const resource = this.resources[resourceName];
        if (resource.min !== undefined) {
            newValue = Math.max(newValue, resource.min);
        }
        if (resource.max !== undefined) {
            newValue = Math.min(newValue, resource.max);
        }
        
        // Apply softcap
        newValue = this.applySoftcap(resourceName, newValue);
        
        this.resources[resourceName].value = newValue;
        this.triggerEvent('resourceChange', { resource: resourceName, oldValue, newValue });
    }

    multiplyResource(resourceName, multiplier) {
        if (!this.resources[resourceName]) return;
        
        const oldValue = this.resources[resourceName].value;
        const newValue = this.applySoftcap(resourceName, oldValue * multiplier);
        
        this.resources[resourceName].value = newValue;
        this.triggerEvent('resourceChange', { resource: resourceName, oldValue, newValue });
    }

    // Department management
    canAffordDepartment(deptId) {
        const dept = this.departments[deptId];
        if (!dept || !dept.unlocked) return false;

        const cost = this.calculateDepartmentCost(deptId);
        for (const [resource, amount] of Object.entries(cost)) {
            if (this.resources[resource].value < amount) {
                return false;
            }
        }
        return true;
    }

    calculateDepartmentCost(deptId) {
        const dept = this.departments[deptId];
        const cost = {};
        
        for (const [resource, baseAmount] of Object.entries(dept.baseCost)) {
            cost[resource] = Math.floor(baseAmount * Math.pow(dept.costMultiplier, dept.owned));
        }
        
        return cost;
    }

    buyDepartment(deptId) {
        if (!this.canAffordDepartment(deptId)) return false;

        const cost = this.calculateDepartmentCost(deptId);
        
        // Deduct resources
        for (const [resource, amount] of Object.entries(cost)) {
            this.addResource(resource, -amount);
        }
        
        // Add department
        this.departments[deptId].owned++;
        this.gameState.stats.departmentsOwned++;
        
        this.checkDepartmentUnlocks();
        this.checkAchievements();
        this.updateDisplay();
        
        return true;
    }

    checkDepartmentUnlocks() {
        for (const [deptId, dept] of Object.entries(this.departments)) {
            if (dept.unlocked) continue;
            
            let canUnlock = true;
            for (const [resource, required] of Object.entries(dept.requirements)) {
                if (this.resources[resource].value < required) {
                    canUnlock = false;
                    break;
                }
            }
            
            if (canUnlock) {
                dept.unlocked = true;
                this.triggerEvent('departmentUnlock', { deptId });
                this.showNotification(`New department unlocked: ${this.translate(dept.nameKey)}`);
            }
        }
    }

    // Game loop with enhanced mechanics
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - (this.gameState.lastUpdate || now);
        this.gameState.lastUpdate = now;
        
        // Update work time (simulate 8-hour work day)
        this.updateWorkTime();
        
        // Calculate department production
        this.updateDepartmentProduction(deltaTime);
        
        // Apply side effects
        this.applySideEffects(deltaTime);
        
        // Apply temporary effects
        this.updateTempEffects(now);
        
        // Check for random events
        this.checkRandomEvents();
        
        // Update achievements
        this.checkAchievements();
        
        // Update display
        this.updateDisplay();
    }

    updateWorkTime() {
        // Simulate 8-hour work day (9 AM to 5 PM)
        const gameHour = ((Date.now() / 60000) % (8 * 60)) / 60; // 8 hours compressed into real time
        const workHour = 9 + gameHour;
        
        this.resources.workTime.value = workHour;
        this.resources.workTime.isWorkHours = workHour >= 9 && workHour < 17;
        
        // Reduce production outside work hours
        const productionMultiplier = this.resources.workTime.isWorkHours ? 1 : 0.5;
        this.resources.workTime.productionMultiplier = productionMultiplier;
    }

    updateDepartmentProduction(deltaTime) {
        const deltaSeconds = deltaTime / 1000;
        
        for (const [deptId, dept] of Object.entries(this.departments)) {
            if (dept.owned === 0) continue;
            
            // Check for temporary shutdowns
            if (this.gameState.tempEffects.itShutdown && deptId === 'it') continue;
            
            // Apply production reduction if affected
            let productionMultiplier = 1;
            if (this.gameState.tempEffects.itReduced && deptId === 'it') {
                productionMultiplier = 0.2;
            }
            if (this.gameState.tempEffects.strike) {
                productionMultiplier = 0;
            }
            if (this.gameState.tempEffects.productionBoost) {
                productionMultiplier *= 1.1;
            }
            
            // Apply work hours multiplier
            productionMultiplier *= this.resources.workTime.productionMultiplier;
            
            // Apply motivation/stress effects
            if (this.resources.motivation.value > 50) {
                productionMultiplier *= 1 + (this.resources.motivation.value - 50) * 0.01;
            }
            if (this.resources.stress.value > 50) {
                productionMultiplier *= 1 - (this.resources.stress.value - 50) * 0.01;
            }
            
            // Generate resources
            for (const [resource, amount] of Object.entries(dept.production)) {
                const totalProduction = amount * dept.owned * deltaSeconds * productionMultiplier;
                this.addResource(resource, totalProduction);
            }
            
            // Consume resources
            for (const [resource, amount] of Object.entries(dept.consumption)) {
                const totalConsumption = amount * dept.owned * deltaSeconds * productionMultiplier;
                this.addResource(resource, -totalConsumption);
            }
            
            // Apply side effects
            for (const [resource, amount] of Object.entries(dept.sideEffects)) {
                const totalEffect = amount * dept.owned * deltaSeconds;
                this.addResource(resource, totalEffect);
            }
        }
    }

    applySideEffects(deltaTime) {
        const deltaSeconds = deltaTime / 1000;
        
        for (const [resourceName, resource] of Object.entries(this.resources)) {
            for (const effect of resource.sideEffects) {
                if (effect.perUnit) {
                    const totalEffect = effect.value * resource.value * deltaSeconds;
                    this.addResource(effect.type, totalEffect);
                } else if (effect.threshold && resource.value > effect.threshold) {
                    // Effect already applied in production calculation
                }
            }
        }
    }

    updateTempEffects(now) {
        // Clean up expired effects
        for (const [effectName, expireTime] of Object.entries(this.gameState.tempEffects)) {
            if (now > expireTime) {
                delete this.gameState.tempEffects[effectName];
            }
        }
    }

    checkRandomEvents() {
        if (Math.random() < 0.001) { // 0.1% chance per game loop iteration
            const availableEvents = this.events.filter(event => {
                return event.condition();
            });
            
            if (availableEvents.length > 0) {
                // Weighted selection
                const totalWeight = availableEvents.reduce((sum, event) => sum + event.weight, 0);
                let random = Math.random() * totalWeight;
                
                for (const event of availableEvents) {
                    random -= event.weight;
                    if (random <= 0) {
                        this.triggerRandomEvent(event);
                        break;
                    }
                }
            }
        }
    }

    triggerRandomEvent(event) {
        this.gameState.eventHistory.unshift({
            id: event.id,
            name: this.translate(event.nameKey),
            timestamp: Date.now()
        });
        
        // Keep only last 10 events
        if (this.gameState.eventHistory.length > 10) {
            this.gameState.eventHistory = this.gameState.eventHistory.slice(0, 10);
        }
        
        event.effect();
        this.gameState.stats.eventsTriggered++;
        this.triggerEvent('eventTrigger', { eventId: event.id });
    }

    // Main click action
    mainClick() {
        this.addResource('budget', 1);
        this.gameState.stats.totalClicks++;
        this.gameState.stats.totalBudgetEarned++;
        this.checkAchievements();
    }

    // Utility methods
    translate(key) {
        const translations = this.gameData.translations[this.currentLanguage];
        return translations[key] || key;
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Event system
    addEventListener(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    triggerEvent(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }

    // Achievement system
    checkAchievements() {
        for (const achievement of this.gameData.achievements) {
            if (this.gameState.achievements[achievement.id]) continue;
            
            let unlocked = false;
            const condition = achievement.condition;
            
            switch (condition.type) {
                case 'departments_owned':
                    unlocked = this.gameState.stats.departmentsOwned >= condition.value;
                    break;
                case 'stress_survived':
                    unlocked = this.gameState.stats.totalStressEndured >= condition.value;
                    break;
                case 'coffee_consumed':
                    unlocked = this.gameState.stats.totalCoffeeConsumed >= condition.value;
                    break;
                case 'documents_produced':
                    unlocked = this.gameState.stats.totalDocumentsProduced >= condition.value;
                    break;
            }
            
            if (unlocked) {
                this.gameState.achievements[achievement.id] = true;
                this.applyAchievementReward(achievement);
                this.showNotification(`Achievement unlocked: ${this.translate(achievement.nameKey)}`);
                this.triggerEvent('achievementUnlock', { achievementId: achievement.id });
            }
        }
    }

    applyAchievementReward(achievement) {
        const reward = achievement.reward;
        switch (reward.type) {
            case 'budget_bonus':
                this.resources.budget.productionMultiplier *= reward.value;
                break;
            case 'stress_resistance':
                // Apply permanent stress resistance
                break;
            case 'coffee_effectiveness':
                // Apply coffee effectiveness boost
                break;
            case 'document_generation':
                this.resources.documents.productionMultiplier *= reward.value;
                break;
        }
    }

    // Display updates
    updateDisplay() {
        // Update resource displays
        for (const [resourceName, resource] of Object.entries(this.resources)) {
            const element = document.getElementById(`resource-${resourceName}`);
            if (element) {
                element.textContent = this.formatNumber(resource.value);
            }
        }
        
        // Update department displays
        this.updateDepartmentDisplay();
        
        // Update events log
        this.updateEventsLog();
        
        // Update work time display
        const workTimeElement = document.getElementById('work-time');
        if (workTimeElement) {
            const time = this.resources.workTime.value;
            const hours = Math.floor(time);
            const minutes = Math.floor((time % 1) * 60);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            workTimeElement.textContent = timeString;
            
            const workHoursElement = document.getElementById('work-hours-indicator');
            if (workHoursElement) {
                workHoursElement.textContent = this.resources.workTime.isWorkHours ? '✓ Work Hours' : '✗ After Hours';
                workHoursElement.className = this.resources.workTime.isWorkHours ? 'work-hours active' : 'work-hours inactive';
            }
        }
    }

    updateDepartmentDisplay() {
        const container = document.getElementById('departments-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (const [deptId, dept] of Object.entries(this.departments)) {
            if (!dept.unlocked) continue;
            
            const deptElement = document.createElement('div');
            deptElement.className = 'department-card';
            deptElement.innerHTML = `
                <div class="dept-header">
                    <h3>${this.translate(dept.nameKey)}</h3>
                    <span class="dept-owned">Owned: ${dept.owned}</span>
                </div>
                <div class="dept-cost">
                    ${Object.entries(this.calculateDepartmentCost(deptId))
                        .map(([resource, cost]) => `${this.translate(`resource_${resource}`)}: ${this.formatNumber(cost)}`)
                        .join(', ')}
                </div>
                <div class="dept-production">
                    ${Object.entries(dept.production).length > 0 ? 
                        'Produces: ' + Object.entries(dept.production)
                            .map(([resource, amount]) => `${amount * dept.owned}/s ${this.translate(`resource_${resource}`)}`)
                            .join(', ') : 
                        'Special Effect'}
                </div>
                <button class="btn btn-primary dept-buy-btn" 
                        onclick="game.buyDepartment('${deptId}')"
                        ${!this.canAffordDepartment(deptId) ? 'disabled' : ''}>
                    Buy Department
                </button>
            `;
            
            container.appendChild(deptElement);
        }
    }

    updateEventsLog() {
        const container = document.getElementById('events-log');
        if (!container) return;
        
        container.innerHTML = '<h3>Recent Events</h3>';
        
        for (const event of this.gameState.eventHistory.slice(0, 5)) {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-log-item';
            eventElement.innerHTML = `
                <span class="event-name">${event.name}</span>
                <span class="event-time">${new Date(event.timestamp).toLocaleTimeString()}</span>
            `;
            container.appendChild(eventElement);
        }
    }

    // Initialization
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.startGameLoop();
        this.startAutoSave();
    }

    setupEventListeners() {
        // Main click button
        const mainButton = document.getElementById('main-click-btn');
        if (mainButton) {
            mainButton.addEventListener('click', () => this.mainClick());
        }
        
        // Save/Load buttons
        const saveButton = document.getElementById('save-btn');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveGameState());
        }
    }

    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            this.gameLoop();
        }, 100); // 10 FPS
    }

    startAutoSave() {
        this.autosaveInterval = setInterval(() => {
            if (this.gameState.settings.autoSave) {
                this.saveGameState();
            }
        }, 30000); // Every 30 seconds
    }

    // Cleanup
    destroy() {
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
        if (this.autosaveInterval) clearInterval(this.autosaveInterval);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CorpoClickerEnhanced();
});

// Debug commands
window.debug = {
    addResource: (resource, amount) => {
        window.game.addResource(resource, amount);
    },
    addDepartment: (deptId, count = 1) => {
        for (let i = 0; i < count; i++) {
            window.game.buyDepartment(deptId);
        }
    },
    triggerEvent: (eventId) => {
        const event = window.game.events.find(e => e.id === eventId);
        if (event) {
            window.game.triggerRandomEvent(event);
        }
    },
    unlockAll: () => {
        for (const dept of Object.values(window.game.departments)) {
            dept.unlocked = true;
        }
        window.game.updateDisplay();
    },
    reset: () => {
        localStorage.removeItem('corpoclicker-enhanced-save');
        location.reload();
    }
};