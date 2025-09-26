
        // ========== ACHIEVEMENT SYSTEM JAVASCRIPT ==========
const ACHIEVEMENTS = {
    first_steps: {
        id: "first_steps",
        name: "Pierwsze kroki",
        description: "Wykonaj 10 kliknięć w główny przycisk",
        icon: "👶",
        tier: "bronze",
        requirement: {type: "click_count", value: 10},
        reward: null,
        unlocked: false,
        progress: 0
    },
    budget_builder: {
        id: "budget_builder",
        name: "Budowniczy budżetu",
        description: "Osiągnij 1000 punktów",
        icon: "💰",
        tier: "bronze",
        requirement: {type: "resource_max", resource: "budget", value: 1000},
        reward: {type: "production_bonus", resource: "budget", multiplier: 1.05},
        unlocked: false,
        progress: 0
    },
    documentation_demon: {
        id: "documentation_demon",
        name: "Demon dokumentacji",
        description: "Wyprodukuj 500 dokumentów łącznie",
        icon: "📋",
        tier: "bronze",
        requirement: {type: "resourcemax", resource: "documents", value: 500},
        reward: {type: "production_bonus", resource: "documents", multiplier: 1.1},
        unlocked: false,
        progress: 0
    },
    coffee_addict: {
        id: "coffee_addict",
        name: "Kofeinowy uzależniony",
        description: "Użyj funkcji kawy 25 razy",
        icon: "☕",
        tier: "bronze",
        requirement: {type: "coffee_breaks", value: 25},
        reward: {type: "coffee_efficiency", multiplier: 1.2},
        unlocked: false,
        progress: 0
    },
    hr_pioneer: {
        id: "hr_pioneer",
        name: "Pionier HR",
        description: "Zatrudnij pierwszy dział HR",
        icon: "👥",
        tier: "bronze",
        requirement: {type: "department_hired", department: "hr", value: 1},
        reward: null,
        unlocked: false,
        progress: 0
    },
    tech_savvy: {
        id: "tech_savvy",
        name: "Techniczny mistrz",
        description: "Odblokuj dział IT",
        icon: "💻",
        tier: "bronze",
        requirement: {type: "department_unlocked", department: "it"},
        reward: {type: "production_bonus", resource: "coffee", multiplier: 1.05},
        unlocked: false,
        progress: 0
    },
    marketing_guru: {
        id: "marketing_guru",
        name: "Guru marketingu",
        description: "Zatrudnij 5 osób w marketingu",
        icon: "📊",
        tier: "silver",
        requirement: {type: "department_hired", department: "marketing", value: 5},
        reward: {type: "production_bonus", resource: "prestige", multiplier: 1.15},
        unlocked: false,
        progress: 0
    },
    numbers_game: {
        id: "numbers_game",
        name: "Gra liczbami",
        description: "Odblokuj księgowość",
        icon: "🧮",
        tier: "silver",
        requirement: {type: "department_unlocked", department: "accounting"},
        reward: {type: "cost_reduction", department: "all", multiplier: 0.95},
        unlocked: false,
        progress: 0
    },
    stress_survivor: {
        id: "stress_survivor",
        name: "Przetrwaniec stresu",
        description: "Osiągnij 150 punktów stresu",
        icon: "😰",
        tier: "silver",
        requirement: {type: "stress_peak", value: 150},
        reward: {type: "stress_resistance", multiplier: 0.9},
        unlocked: false,
        progress: 0
    },
    motivation_master: {
        id: "motivation_master",
        name: "Mistrz motywacji",
        description: "Osiągnij 90 punktów motywacji",
        icon: "🔥",
        tier: "silver",
        requirement: {type: "motivation_peak", value: 90},
        reward: {type: "motivation_bonus", multiplier: 1.1},
        unlocked: false,
        progress: 0
    },
    prestige_player: {
        id: "prestige_player",
        name: "Gracz prestiżu",
        description: "Osiągnij 100 punktów prestiżu",
        icon: "🎖️",
        tier: "silver",
        requirement: {type: "resource_max", resource: "prestige", value: 100},
        reward: {type: "production_bonus", resource: "budget", multiplier: 1.1},
        unlocked: false,
        progress: 0
    },
    globalist: {
        id: "globalist",
        name: "Globalista",
        description: "Odblokuj drugi region (Ameryki)",
        icon: "🌎",
        tier: "silver",
        requirement: {type: "region_unlocked", region: "americas"},
        reward: {type: "global_expansion_bonus", multiplier: 1.05},
        unlocked: false,
        progress: 0
    },
    forex_trader: {
        id: "forex_trader",
        name: "Trader forex",
        description: "Wykonaj pierwszą wymianę walut",
        icon: "💱",
        tier: "bronze",
        requirement: {type: "currency_trade", value: 1},
        reward: {type: "fx_fee_reduction", multiplier: 0.95},
        unlocked: false,
        progress: 0
    },
    call_center_king: {
        id: "call_center_king",
        name: "Król call center",
        description: "Odblokuj call center",
        icon: "📞",
        tier: "gold",
        requirement: {type: "department_unlocked", department: "callcenter"},
        reward: {type: "production_bonus", resource: "budget", multiplier: 1.2},
        unlocked: false,
        progress: 0
    },
    asian_expansion: {
        id: "asian_expansion",
        name: "Ekspansja azjatycka",
        description: "Odblokuj region Azja-Pacyfik",
        icon: "🌏",
        tier: "gold",
        requirement: {type: "region_unlocked", region: "asia"},
        reward: {type: "global_market_bonus", multiplier: 1.15},
        unlocked: false,
        progress: 0
    },
    rd_innovator: {
        id: "rd_innovator",
        name: "Innowator R&D",
        description: "Zatrudnij 3 osoby w R&D",
        icon: "🔬",
        tier: "gold",
        requirement: {type: "department_hired", department: "rd", value: 3},
        reward: {type: "innovation_bonus", multiplier: 1.25},
        unlocked: false,
        progress: 0
    },
    budget_millionaire: {
        id: "budget_millionaire",
        name: "Milioner budżetowy",
        description: "Osiągnij 1,000,000 punktów",
        icon: "💎",
        tier: "gold",
        requirement: {type: "resource_max", resource: "budget", value: 1000000},
        reward: {type: "production_bonus", resource: "budget", multiplier: 1.3},
        unlocked: false,
        progress: 0
    },
    automation_pioneer: {
        id: "automation_pioneer",
        name: "Pionier automatyzacji",
        description: "Włącz system automatyzacji AI",
        icon: "🤖",
        tier: "gold",
        requirement: {type: "automation_enabled"},
        reward: {type: "automation_efficiency", multiplier: 1.1},
        unlocked: false,
        progress: 0
    },
    stress_zen: {
        id: "stress_zen",
        name: "Zen stresu",
        description: "Utrzymaj stres poniżej 20 przez 2 minuty",
        icon: "🧘",
        tier: "silver",
        requirement: {type: "stress_low", value: 20, duration: 120000},
        reward: {type: "stress_generation", multiplier: 0.8},
        unlocked: false,
        progress: 0
    },
    multicurrency_master: {
        id: "multicurrency_master",
        name: "Mistrz wielu walut",
        description: "Posiadaj wszystkie 4 waluty obce jednocześnie",
        icon: "🏦",
        tier: "gold",
        requirement: {type: "all_currencies", currencies: ["usd", "eur", "jpy", "cny"]},
        reward: {type: "currency_bonus", multiplier: 1.1},
        unlocked: false,
        progress: 0
    },
    clicker_veteran: {
        id: "clicker_veteran",
        name: "Weteran klikanek",
        description: "Wykonaj 1,000 kliknięć łącznie",
        icon: "👆",
        tier: "gold",
        requirement: {type: "click_count", value: 1000},
        reward: {type: "click_power", multiplier: 1.05},
        unlocked: false,
        progress: 0
    },
    department_emperor: {
        id: "department_emperor",
        name: "Cesarz działów",
        description: "Odblokuj wszystkie działy",
        icon: "👑",
        tier: "platinum",
        requirement: {type: "all_departments_unlocked"},
        reward: {type: "department_synergy", multiplier: 1.2},
        unlocked: false,
        progress: 0
    },
    global_tycoon: {
        id: "global_tycoon",
        name: "Globalny potentat",
        description: "Odblokuj wszystkie regiony",
        icon: "🌍",
        tier: "platinum",
        requirement: {type: "all_regions_unlocked"},
        reward: {type: "global_dominance", multiplier: 1.5},
        unlocked: false,
        progress: 0
    },
    coffee_connoisseur: {
        id: "coffee_connoisseur",
        name: "Koneser kawy",
        description: "Użyj funkcji kawy 100 razy",
        icon: "☕",
        tier: "gold",
        requirement: {type: "coffee_breaks", value: 100},
        reward: {type: "coffee_power", multiplier: 1.3},
        unlocked: false,
        progress: 0
    },
    efficiency_expert: {
        id: "efficiency_expert",
        name: "Ekspert efektywności",
        description: "Osiągnij 100% efektywność we wszystkich podstawowych zasobach",
        icon: "⚡",
        tier: "gold",
        requirement: {type: "full_efficiency"},
        reward: {type: "efficiency_master", multiplier: 1.1},
        unlocked: false,
        progress: 0
    },
    minigame_master: {
        id: "minigame_master",
        name: "Mistrz minigier",
        description: "Wygraj prezentację kwartalną 3 razy",
        icon: "🎯",
        tier: "gold",
        requirement: {type: "minigame_wins", game: "quarterlypresentation", value: 3},
        reward: {type: "minigame_bonus", multiplier: 1.25},
        unlocked: false,
        progress: 0
    },
    african_explorer: {
        id: "african_explorer",
        name: "Odkrywca Afryki",
        description: "Odblokuj region Afryka",
        icon: "🌍",
        tier: "platinum",
        requirement: {type: "region_unlocked", region: "africa"},
        reward: {type: "exploration_bonus", multiplier: 1.2},
        unlocked: false,
        progress: 0
    },
    middle_east_mogul: {
        id: "middle_east_mogul",
        name: "Potentat Bliskiego Wschodu",
        description: "Odblokuj region Bliskiego Wschodu",
        icon: "🕌",
        tier: "platinum",
        requirement: {type: "region_unlocked", region: "middleeast"},
        reward: {type: "premium_markets", multiplier: 1.4},
        unlocked: false,
        progress: 0
    },
    ultimate_corporate: {
        id: "ultimate_corporate",
        name: "Ostateczny korporacyjny",
        description: "Osiągnij 500 prestiżu i odblokuj wszystkie regiony",
        icon: "🏆",
        tier: "platinum",
        requirement: {type: "combined", requirements: [
            {type: "resource_max", resource: "prestige", value: 500},
            {type: "all_regions_unlocked"}
        ]},
        reward: {type: "ultimate_bonus", multiplier: 2.0},
        unlocked: false,
        progress: 0
    },
    speed_demon: {
        id: "speed_demon",
        name: "Demon prędkości",
        description: "Wykonaj 50 kliknięć w ciągu 10 sekund",
        icon: "💨",
        tier: "silver",
        requirement: {type: "click_speed", clicks: 50, time: 10000},
        reward: {type: "click_speed_bonus", multiplier: 1.05},
        unlocked: false,
        progress: 0
    }
};
        class CorpoClickerPhase43 {
            constructor() {
                this.version = "v.0.4.5";

                console.log('🏦 Ładowanie Korposzczura');

                // Core Resources 
                this.resources = {
                    budget: 100,
                    documents: 0,
                    coffee: 0,
                    stress: 0,
                    motivation: 100,
                    prestige: 0,
                    influence: 0,

                    // International Currencies
                    usd: 0,
                    eur: 0,
                    jpy: 0,
                    cny: 0,
                    freight: 0
                };

                // Enhanced Departments
                this.departments = {
                    hr: { owned: 0, unlocked: true },
                    it: { owned: 0, unlocked: false },
                    marketing: { owned: 0, unlocked: false },
                    wellbeing: { owned: 0, unlocked: false },
					accounting: { owned: 0, unlocked: false },
                    management: { owned: 0, unlocked: false },
                    rd: { owned: 0, unlocked: false },
					legal: { owned: 0, unlocked: false },
                    callcenter: { owned: 0, unlocked: false }
                };

                // NEW: Global Regions System
                this.regions = {
                    europe: {
                        name: "Europa",
                        flag: "🇪🇺",
                        currency: "eur",
                        unlocked: true,
                        unlockCost: 0,
                        level: 1,
						upgradeCost: 1000,
						currencyProduction: 0.05,
                        departments: { ...this.departments },
                        resources: { eur: 0, documents: 0, coffee: 0 },
                        marketModifier: 1.0,
                        culturalCost: 0,
						bonus: "marketing"
                    },
                    americas: {
                        name: "Ameryki",
                        flag: "🌎",
                        currency: "usd",
                        unlocked: false,
                        unlockCost: 10000,
                        level: 0,
						upgradeCost: 10000,
						currencyProduction: 0.05,
                        departments: { ...this.departments },
                        resources: { usd: 0, documents: 0, coffee: 0 },
                        marketModifier: 1.2,
                        culturalCost: 100,
						bonus: "legal"
                    },
                    asia: {
                        name: "Azja-Pacyfik",
                        flag: "🌏",
                        currency: "jpy",
                        unlocked: false,
                        unlockCost: 50000,
                        level: 0,
						upgradeCost: 50000,
						currencyProduction: 0.05,
                        departments: { ...this.departments },
                        resources: { jpy: 0, documents: 0, coffee: 0 },
                        marketModifier: 1.5,
                        culturalCost: 500,
						bonus: "trade"
                    },
                    africa: {
                        name: "Afryka",
                        flag: "🌍",
                        currency: "cny",
                        unlocked: false,
                        unlockCost: 100000,
                        level: 0,
						upgradeCost: 100000,
						currencyProduction: 0.05,
                        departments: { ...this.departments },
                        resources: { cny: 0, documents: 0, coffee: 0 },
                        marketModifier: 0.8,
                        culturalCost: 200,
						bonus: "rnd"
                    },
                };

                // NEW: FX Exchange Rates
                this.fxRates = {
                    'budget_to_usd': { rate: 0.25, trend: 'stable', lastUpdate: Date.now() },
                    'budget_to_eur': { rate: 0.23, trend: 'up', lastUpdate: Date.now() },
                    'budget_to_jpy': { rate: 36.5, trend: 'down', lastUpdate: Date.now() },
                    'budget_to_cny': { rate: 1.78, trend: 'stable', lastUpdate: Date.now() },
                    'usd_to_eur': { rate: 0.92, trend: 'stable', lastUpdate: Date.now() },
                    'eur_to_jpy': { rate: 158.7, trend: 'up', lastUpdate: Date.now() }
                };

                // NEW: AI Automation System
                this.automation = {
                    enabled: false,
                    departmentAI: {
                        active: false,
                        roiThreshold: 1.5, // 150% ROI required
                        lastAction: 0
                    },
                    tradeBot: {
                        active: false,
                        arbitrageThreshold: 0.05, // 5% minimum arbitrage
                        lastAction: 0
                    },
                    expansionAI: {
                        active: false,
                        aggressiveness: 0.5,
                        lastAction: 0
                    }
                };

				this.globalEventTickCounter = 0;

				// Enhanced Game State
                this.gameState = {
                    lastUpdate: Date.now(),
                    totalClicks: 0,
                    sessionStart: Date.now(),
                    gameSpeed: 1.0,
                    paused: false,
                    activeEffects: {},
                    minigameCooldowns: {},
                    currentTab: 'overview',
                    lastDisplayUpdate: {
                        departments: 0,
                        minigames: 0,
                        regions: 0,
                        fx: 0
                    }
                };

                // Department Data
                this.departmentData = {
                    hr: {
                        name: "Dział HR",
                        icon: "👥",
                        baseCost: 10,
                        production: {documents: 1},
                        sideEffects: {stress: 0.04},
                        description: "Produkuje dokumenty korporacyjne. Zwiększa stres przez biurokrację.",
                        unlockConditions: []
                    },
                    it: {
                        name: "Dział IT",
                        icon: "💻",
                        baseCost: 100,
                        production: {coffee: 1},
                        sideEffects: {motivation: -0.05},
                        description: "Zapewnia kawę premium i wsparcie techniczne.",
                        unlockConditions: [
                            {type: 'resource', resource: 'documents', amount: 100},
							{type: 'resource', resource: 'budget', amount: 100}
                        ]
                    },
                    marketing: {
                        name: "Marketing",
                        icon: "📈",
                        baseCost: 600,
                        production: {budget: 1, prestige: 0.04},
                        description: "Generuje przychody i buduje prestiż marki.",
                        unlockConditions: [
                            {type: 'resource', resource: 'documents', amount: 300},
							{type: 'resource', resource: 'budget', amount: 600},
							{type: 'resource', resource: 'eur', amount: 100}
                        ]
                    },
					wellbeing: {
						name: "Zespół Wellbeing",
						icon: "🧘‍♂️",
						baseCost: 1000,
						production: {motivation: 0.04},
						sideEffects: {
						  stress: -0.015,
						  budget: -3
						},
						description: "Każda zatrudniona osoba poprawia morale i atmosferę, ale obniża budżet i dokumentację.",
						unlockConditions: [
							{type: 'resource', resource: 'prestige', amount: 15},
							{type: 'resource', resource: 'budget', amount: 1000},
							{type: 'resource', resource: 'eur', amount: 100},
							{type: 'resource', resource: 'usd', amount: 100}
						]
					},
                    accounting: {
                        name: "Księgowość",
                        icon: "🧮",
                        baseCost: 1000,
                        production: {budget: 0.8},
                        sideEffects: {stress: 0.05},
                        description: "Optymalizuje finanse, ale zwiększa stres przez kontrole.",
                        unlockConditions: [
                            {type: 'resource', resource: 'documents', amount: 350},
							{type: 'resource', resource: 'coffee', amount: 100},
							{type: 'resource', resource: 'budget', amount: 10000}
                        ]
                    },
                    management: {
                        name: "Zarząd",
                        icon: "👔",
                        baseCost: 1000,
                        production: {motivation: 0.3},
                        description: "Motywuje pracowników i poprawia efektywność organizacyjną.",
                        unlockConditions: [
                            {type: 'resource', resource: 'prestige', amount: 150},
							{type: 'resource', resource: 'eur', amount: 1},
							{type: 'resource', resource: 'usd', amount: 1},
							{type: 'resource', resource: 'jpy', amount: 1},
							{type: 'resource', resource: 'cny', amount: 1},
                        ]
                    },
                    rd: {
                        name: "R&D",
                        icon: "🔬",
                        baseCost: 1500,
                        production: {prestige: 0.3},
                        sideEffects: {stress: 0.02},
                        description: "Innowacje zwiększają prestiż, ale wymagają intensywnej pracy.",
                        unlockConditions: [
                            {type: 'resource', resource: 'prestige', amount: 650}
                        ]
                    },
					legal: {
						name: "Dział Prawny",
						icon: "⚖️",
						baseCost: 10000,
						production: {documents: 1.5},
						sideEffects: {budget: -1.2, motivation: -0.01},
						description: "Zabezpiecza firmę przed ryzykiem i kontroluje zgodność z przepisami",
						unlockConditions: [
							{type: 'resource', resource: 'documents', amount: 2000},
							{type: 'resource', resource: 'budget', amount: 30000},
							{type: 'resource', resource: 'prestige', amount: 300}
						]
					},
                    callcenter: {
                        name: "Call Center",
                        icon: "📞",
                        baseCost: 25000,
                        production: {budget: 4},
                        sideEffects: {motivation: -0.03, stress: 0.05},
                        description: "Wysokie przychody kosztem dobrostanu pracowników.",
                        unlockConditions: [
                            {type: 'resource', resource: 'documents', amount: 10000},
							{type: 'resource', resource: 'budget', amount: 100000},
							{type: 'resource', resource: 'cny', amount: 10000}
                        ]
                    }
                };

                // Minigame Data
                this.minigameData = {
                    quarterly_presentation: {
                        name: "Prezentacja Kwartalna",
                        icon: "📊",
                        cost: { documents: 100, coffee: 50 },
                        description: "Wysokopostawowa prezentacja dla zarządu z ryzykiem utraty prestiżu.",
                        rewards: {
                            success: { budget: 500, prestige: 10 },
                            failure: { budget_loss_percent: 0.2, stress: 25 }
                        },
                        cooldown: 300000, // 5 minutes
                        unlocked: () => this.resources.documents >= 50
                    },

                    barista_championship: {
                        name: "Mistrzostwa Baristy",
                        icon: "☕",
                        cost: { coffee: 200, prestige: 25 },
                        description: "Konkurs umiejętności parzenia kawy z możliwością rozwinięcia kawiarni.",
                        rewards: {
                            success: { coffee_shop_level: 1, passive_income: 10 },
                            failure: { coffee_addiction: 1, motivation: -15 }
                        },
                        cooldown: 600000, // 10 minutes
                        unlocked: () => this.departments.it.owned >= 3
                    },

                    corporate_merger: {
                        name: "Fuzja Korporacyjna",
                        icon: "🤝",
                        cost: { budget: 5000, documents: 100 },
                        description: "Ryzykowna fuzja z konkurencją. Ogromne zyski lub katastrofalne straty.",
                        rewards: {
                            success: { subsidiary: 1, all_production: 1.25 },
                            failure: { budget_loss_percent: 0.5, departments_loss: 1 }
                        },
                        cooldown: 1800000, // 30 minutes
                        unlocked: () => this.resources.prestige >= 50
                    },

                    government_lobbying: {
                        name: "Lobbying Rządowy",
                        icon: "🏛️",
                        cost: { prestige: 50, budget: 1000 },
                        description: "Wpływanie na politykę gospodarczą w celu korzystnych regulacji.",
                        rewards: {
                            success: { softcap_increase: 0.25, tax_reduction: 0.1 },
                            failure: { investigation: true, production_penalty: 0.3 }
                        },
                        cooldown: 3600000, // 1 hour
                        unlocked: () => this.resources.prestige >= 100
                    },

                    // NEW: Global expansion minigame
                    global_summit: {
                        name: "Szczyt Globalny",
                        icon: "🌍",
                        cost: { prestige: 100, usd: 1000, eur: 800 },
                        description: "Międzynarodowa konferencja biznesowa. Możliwość ekspansji lub skandalu.",
                        rewards: {
                            success: { global_expansion_bonus: 0.5, freight: 50 },
                            failure: { reputation_loss: 1, region_lock: 30 }
                        },
                        cooldown: 7200000, // 2 hours
                        unlocked: () => Object.values(this.regions).filter(r => r.unlocked).length >= 3
                    }
                };

                // Softcap System (from 4.2.2)
				this.softcapThresholds = {
					budget:    [1000, 5000, 25000, 125000, 800000, 4000000],
					documents: [100, 500, 2500, 12500, 60000, 250000],
					coffee:    [50, 250, 1250, 6250, 30000, 120000],
					prestige:  [10, 50, 250, 1250, 6000, 25000],
					usd:       [100, 500, 2500, 12500, 60000, 250000],
					eur:       [100, 500, 2500, 12500, 60000, 250000],
					jpy:       [10000, 50000, 250000, 1250000, 6000000, 25000000],
					cny:       [500, 2500, 12500, 62500, 300000, 1200000]
				};
                this.achievements = {};
				this.achievementBonuses = {};
				this.gameState.coffeeBreaks = 0;
				this.gameState.maxStress = 0;
				this.gameState.maxMotivation = this.resources.motivation;
				this.gameState.currencyTrades = 0;
				this.gameState.minigameWins = {};
				this.gameState.totalProduced = {
					budget: 0,
					documents: 0,
					coffee: 0,
					prestige: 0
				};
				this.initializeAchievements();
                this.init();
            }

			initializeAchievements() {
    // Initialize all achievements from the ACHIEVEMENTS constant
    Object.keys(ACHIEVEMENTS).forEach(id => {
        this.achievements[id] = {
            ...ACHIEVEMENTS[id],
            unlocked: false,
            progress: 0
        };
    });

    // Update progress indicator
    this.updateAchievementProgress();
}

checkAchievements() {
    let newUnlocks = [];

    Object.keys(this.achievements).forEach(id => {
        const achievement = this.achievements[id];
        if (achievement.unlocked) return;

        if (this.checkAchievementRequirement(achievement)) {
            this.unlockAchievement(id);
            newUnlocks.push(achievement);
        }
    });

    // Show notifications for new unlocks
    newUnlocks.forEach(achievement => {
        setTimeout(() => showAchievementNotification(achievement), 500);
    });

    if (newUnlocks.length > 0) {
        this.updateAchievementProgress();
    }
}

checkAchievementRequirement(achievement) {
    const req = achievement.requirement;

    switch (req.type) {
        case 'click_count':
            return this.gameState.totalClicks >= req.value;

        case 'resource_max':
            return this.resources[req.resource] >= req.value;

        case 'resource_total':
            return (this.gameState.this.resources.documents[req.resource] || 0) >= req.value;

        case 'department_hired':
            return this.departments[req.department]?.owned >= req.value;

        case 'department_unlocked':
            return this.departments[req.department]?.unlocked === true;

        case 'region_unlocked':
            return this.regions[req.region]?.unlocked === true;

        case 'coffee_breaks':
            return this.gameState.coffeeBreaks >= req.value;

        case 'stress_peak':
            return this.gameState.maxStress >= req.value;

        case 'motivation_peak':
            return this.gameState.maxMotivation >= req.value;

        case 'currency_trade':
            return this.gameState.currencyTrades >= req.value;

        case 'automation_enabled':
            return this.automation.enabled === true;

        case 'all_currencies':
            return req.currencies.every(currency => this.resources[currency] > 0);

        case 'all_departments_unlocked':
            return Object.values(this.departments).every(dept => dept.unlocked);

        case 'all_regions_unlocked':
            return Object.values(this.regions).every(region => region.unlocked);

        case 'full_efficiency':
            const basicResources = ['budget', 'documents', 'coffee', 'prestige'];
            return basicResources.every(resource =>
                this.calculateSoftcap(resource, this.resources[resource]) >= 0.99
            );

        case 'minigame_wins':
            return (this.gameState.minigameWins[req.game] || 0) >= req.value;

        case 'combined':
            return req.requirements.every(subReq =>
                this.checkAchievementRequirement({requirement: subReq})
            );

        default:
            return false;
    }
}

unlockAchievement(id) {
    const achievement = this.achievements[id];
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;

    // Apply reward if exists
    if (achievement.reward) {
        this.applyAchievementReward(achievement.reward);
    }

    console.log(`Achievement unlocked: ${achievement.name}`);
	this.updateAchievementProgress();
}

applyAchievementReward(reward) {
    switch (reward.type) {
        case 'production_bonus':
            // Store bonus for use in production calculations
            if (!this.achievementBonuses[reward.resource]) {
                this.achievementBonuses[reward.resource] = 1;
            }
            this.achievementBonuses[reward.resource] *= reward.multiplier;
            break;

        case 'cost_reduction':
            this.achievementBonuses.costReduction = (this.achievementBonuses.costReduction || 1) * reward.multiplier;
            break;

        case 'click_power':
            this.achievementBonuses.clickPower = (this.achievementBonuses.clickPower || 1) * reward.multiplier;
            break;

        case 'coffee_efficiency':
            this.achievementBonuses.coffeeEfficiency = (this.achievementBonuses.coffeeEfficiency || 1) * reward.multiplier;
            break;

        default:
            // Store other bonuses generically
            this.achievementBonuses[reward.type] = (this.achievementBonuses[reward.type] || 1) * reward.multiplier;
    }
}

updateAchievementProgress() {
    const indicator = document.getElementById('achievement-progress-indicator');
    const progressText = document.getElementById('achievement-progress-text');

    if (!indicator || !progressText) return;

    const unlockedCount = Object.values(this.achievements).filter(a => a.unlocked).length;
    const totalCount = Object.keys(this.achievements).length;
    const percentage = Math.round((unlockedCount / totalCount) * 100);

    progressText.textContent = `Osiągnięcia: ${unlockedCount}/${totalCount} (${percentage}%)`;

    // Update indicator color based on progress
    if (percentage >= 100) {
        indicator.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
    } else if (percentage >= 75) {
        indicator.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
    } else if (percentage >= 50) {
        indicator.style.background = 'linear-gradient(135deg, #2196F3, #42A5F5)';
    }
}

            /* =============================================
               CORE SYSTEMS FROM 4.2.2
               ============================================= */

calculateSoftcap(resource, amount) {
    const thresholds = this.softcapThresholds[resource];
    if (!thresholds || amount <= thresholds[0]) {
        return 1.0;
    }

    let efficiency = 1.0;

    if (amount > thresholds[0] && amount <= thresholds[1]) {
        // Pierwszy softcap: min. 75%, max 100%
        const ratio = amount / thresholds[0];
        efficiency = 0.75 + 0.25 * Math.log(thresholds[1]/thresholds[0]) / Math.log(ratio);
        efficiency = Math.max(0.75, Math.min(1.0, efficiency));
    } else if (amount > thresholds[1] && amount <= thresholds[2]) {
        // Drugi softcap: min. 40%, max 74%
        const ratio = (amount - thresholds[1]) / (thresholds[2] - thresholds[1]);
        efficiency = 0.40 + 0.35 * (1 - ratio);
    } else if (amount > thresholds[2]) {
        // Dalej: min. 14%, max. 40%; wolniejsze wygasanie
        const excess = (amount - thresholds[2]) / thresholds[2];
        efficiency = 0.14 + 0.26 * Math.exp(-excess * 0.75); // zwolnione opadanie wykładnicze
    }

    return Math.max(0.09, efficiency);
}

            calculateStressEffects() {
                const stress = this.resources.stress;
                let production = 1.0;
                let quality = 1.0;
                let quitChance = 0.0;

                if (stress <= 25) {
                    production = 1.0; quality = 1.0; quitChance = 0.0;
                } else if (stress <= 50) {
                    production = 0.95; quality = 0.9; quitChance = 0.01;
                } else if (stress <= 75) {
                    production = 0.85; quality = 0.75; quitChance = 0.03;
                } else if (stress <= 100) {
                    production = 0.70; quality = 0.50; quitChance = 0.06;
                } else {
                    production = Math.max(0.05, 1.0 - (stress - 100) * 0.01);
                    quality = Math.max(0.01, 1.0 - (stress - 100) * 0.015);
                    quitChance = Math.min(0.40, (stress - 100) * 0.005);
                }

                return { production, quality, quitChance };
            }

            calculateMotivationEffects() {
                const motivation = this.resources.motivation;
                let productionBonus = 0;
                let speedBonus = 1.0;

                if (motivation <= -25) {
                    productionBonus = -0.75; speedBonus = 0.5;
                } else if (motivation <= 0) {
                    productionBonus = -0.50; speedBonus = 0.7;
                } else if (motivation <= 25) {
                    productionBonus = -0.25; speedBonus = 0.85;
                } else if (motivation <= 50) {
                    productionBonus = 0; speedBonus = 1.0;
                } else if (motivation <= 75) {
                    productionBonus = 0.25; speedBonus = 1.15;
                } else if (motivation <= 90) {
                    productionBonus = 0.50; speedBonus = 1.35;
                } else {
                    productionBonus = 1.0; speedBonus = 1.5;
                }

                return { productionBonus, speedBonus };
            }

convertDocumentsToBudget = function() {
  if (this.resources.documents < 100) {
    document.getElementById('documents-panel-feedback').textContent = "Za mało dokumentów!";
    return;
  }
  this.resources.documents -= 100;
  this.resources.budget += 2000;
  document.getElementById('documents-panel-feedback').textContent =
    "Zrealizowano kontrakt! +2000 punktów 🚀";
  this.updateResourceBar();
};

unlockHrAutomation = function() {
  if (this.resources.documents < 3000) {
    document.getElementById('documents-panel-feedback').textContent = "Za mało dokumentów!";
    return;
  }
  this.resources.documents -= 3000;
  this.hrAutomated = true;
  document.getElementById('documents-panel-feedback').textContent =
    "HR Automatyzowany! Zasoby HR będą zarządzane automatycznie.";
  this.updateResourceBar();
  // Dodaj logikę automatyzacji HR w ticku gry
};
runHrAutomationTick() {
    // Redukcja stresu (przykład)
    if (this.resources.stress > 0) {
        this.resources.stress = Math.max(0, this.resources.stress - 0.5);
    }
    // Boost motywacji przy niskim stresie (przykład)
    if (this.resources.stress < 40) {
        this.resources.motivation = Math.min(100, this.resources.motivation + 0.2);
    }
    // Możesz dodać inne efekty automatyzacji HR!
};
upgradeDocsDepartment = function() {
  if (this.resources.documents < 5000) {
    document.getElementById('documents-panel-feedback').textContent = "Za mało dokumentów!";
    return;
  }
  this.resources.documents -= 5000;
  this.docsDeptLevel = (this.docsDeptLevel || 1) + 1;
  document.getElementById('documents-panel-feedback').textContent =
    `Upgrade działu dokumentów! Poziom: ${this.docsDeptLevel}`;
  this.updateResourceBar();
  // Możesz dodać wyższy multiplikator w produkcji dokumentów!
};

researchDocsProcedure = function() {
  if (this.resources.documents < 7000) {
    document.getElementById('documents-panel-feedback').textContent = "Za mało dokumentów!";
    return;
  }
  this.resources.documents -= 7000;
  // Losowy bonus (np. +10% efficiency na 10 minut, prestiż, premia do punktów)
  const bonus = Math.floor(Math.random() * 4);
  let msg = "";
  switch (bonus) {
    case 0:
      this.resources.budget += 10000;
      msg = "+10 000 punktów 🚀";
      break;
    case 1:
      this.resources.prestige += 15;
      msg = "+15 prestiżu 🏆";
      break;
    case 2:
      this.softcapThresholds.documents = this.softcapThresholds.documents.map(x => x + 1000);
      msg = "Progi softcap dokumentów przesunięte! 🔁";
      break;
    default:
      msg = "Dokumentacja zbadana — bonus efektywności!";
      // Dodaj np. tymczasowy bonus efficiency
  }
  document.getElementById('documents-panel-feedback').textContent =
    `Badania zakończone: ${msg}`;
  this.updateResourceBar();
};


            /* =============================================
               NEW: GLOBAL REGIONS SYSTEM
               ============================================= */

            checkRegionUnlocks() {
                Object.entries(this.regions).forEach(([regionId, region]) => {
                    if (region.unlocked) return;

                    if (this.resources.budget >= region.unlockCost) {
                        // Could unlock, but don't auto-unlock (player choice)
                        this.updateRegionDisplay();
                    }
                });
            }
            updateRegionDisplay() {
			  this.updateGlobalPresenceCard();
			  this.updateGlobalMarketsTab();
			}
            unlockRegion(regionId) {
                const region = this.regions[regionId];

                if (!region || region.unlocked) return false;

                if (this.resources.budget >= region.unlockCost) {
                    this.resources.budget -= region.unlockCost;
                    region.unlocked = true;
                    region.level = 1;

                    this.showNotification(`🌍 Otwarto nowy region: ${region.name}!`, 'success');
                    this.updateResourceBar();
                    return true;
                }

                this.showNotification(`💰 Niewystarczające punkty! Potrzebujesz ${region.unlockCost} 💰`, 'warning');
                return false;
				this.updateResourceBar();
            }

            /* =============================================
               NEW: FX TRADING SYSTEM
               ============================================= */

			updateFXBarDisplay() {
			  Object.entries(this.fxRates).forEach(([pair, data]) => {
				const rateElem = document.getElementById(`fx-rate-${pair}`);
				if (rateElem) rateElem.textContent = data.rate.toFixed(3);

				const trendElem = document.getElementById(`fx-trend-${pair}`);
				if (trendElem) {
				  trendElem.textContent = (data.trend === 'up') ? 'Rośnie' : (data.trend === 'down') ? 'Spada' : 'Stabilny';
				  trendElem.className = 'fx-trend trend-' + data.trend;
				}
			  });
			}

			updateFXRates() {
                const now = Date.now();

                Object.entries(this.fxRates).forEach(([pair, data]) => {
                    if (now - data.lastUpdate < 30000) return; // Update every 30s

                    // Simulate market volatility
                    const volatility = 0.02; // 2% max change
                    const change = (Math.random() - 0.5) * volatility;
                    const newRate = data.rate * (1 + change);

                    // Update trend
                    if (newRate > data.rate * 1.005) {
                        data.trend = 'Rośnie';
                    } else if (newRate < data.rate * 0.995) {
                        data.trend = 'Spada';
                    } else {
                        data.trend = 'Stabilny';
                    }

                    data.rate = Math.max(newRate, data.rate * 0.5); // Prevent extreme drops
                    data.lastUpdate = now;
                });

                this.updateFXBarDisplay();
            }

            executeTrade(fromCurrency, toCurrency, amount) {
                const pair = `${fromCurrency}_to_${toCurrency}`;
                const fxData = this.fxRates[pair];

                if (!fxData || this.resources[fromCurrency] < amount) {
                    this.showNotification('Niewystarczające środki do wymiany!', 'warning');
                    return false;
                }

                const received = amount * fxData.rate;
                const fee = received * 0.01; // 1% transaction fee
                const netReceived = received - fee;

                this.resources[fromCurrency] -= amount;
                this.resources[toCurrency] += netReceived;
                this.resources.freight += Math.floor(amount / 100); // Freight tokens
                this.gameState.currencyTrades = (this.gameState.currencyTrades || 0) + 1;
                this.showNotification(`💱 Wymiana: -${amount} ${fromCurrency} → +${netReceived.toFixed(2)} ${toCurrency}`, 'success');
                this.updateResourceBar();

                return true;
            }

            /* =============================================
               NEW: AI AUTOMATION SYSTEM
               ============================================= */

            toggleMasterAutomation() {
                this.automation.enabled = !this.automation.enabled;

                const button = document.getElementById('master-automation');
                if (this.automation.enabled) {
                    button.textContent = 'Wyłącz Automatyzację';
                    button.classList.add('active');
                    this.showNotification('🤖 Automatyzacja włączona!', 'success');
                } else {
                    button.textContent = 'Włącz Automatyzację';
                    button.classList.remove('active');
                    this.showNotification('⏸️ Automatyzacja wyłączona!', 'info');
                }

                this.updateAutomationDisplay();
            }

            runDepartmentAI() {
                if (!this.automation.enabled || !this.automation.departmentAI.active) return;

                const now = Date.now();
                if (now - this.automation.departmentAI.lastAction < 10000) return; // 10s cooldown

                // Find best ROI department
                let bestROI = 0;
                let bestDept = null;

                Object.entries(this.departmentData).forEach(([deptId, deptData]) => {
                    const dept = this.departments[deptId];
                    if (!dept.unlocked) return;

                    const cost = this.getDepartmentCost(deptId);
                    if (this.resources.budget < cost) return;

                    // Calculate ROI based on production
                    let production = 0;
                    if (deptData.production) {
                        Object.entries(deptData.production).forEach(([resource, rate]) => {
                            const efficiency = this.calculateSoftcap(resource, this.resources[resource]);
                            production += rate * efficiency * 3600; // Hourly production
                        });
                    }

                    const roi = production / cost;
                    if (roi > bestROI) {
                        bestROI = roi;
                        bestDept = deptId;
                    }
                });

                if (bestDept && bestROI >= this.automation.departmentAI.roiThreshold) {
                    this.purchaseDepartment(bestDept);
                    this.automation.departmentAI.lastAction = now;
                    this.showNotification(`🤖 AI zatrudniło: ${this.departmentData[bestDept].name} (ROI: ${(bestROI * 100).toFixed(1)}%)`, 'info');
                }
            }

            runTradeBot() {
                if (!this.automation.enabled || !this.automation.tradeBot.active) return;

                const now = Date.now();
                if (now - this.automation.tradeBot.lastAction < 30000) return; // 30s cooldown

                // Look for arbitrage opportunities
                Object.entries(this.fxRates).forEach(([pair, data]) => {
                    const [from, to] = pair.split('_to_');

                    // Simple arbitrage check (real implementation would be more complex)
                    if (data.trend === 'up' && this.resources[from] > 100) {
                        const amount = Math.min(this.resources[from] * 0.1, 1000); // Trade 10% or max 1000
                        if (this.executeTrade(from, to, amount)) {
                            this.automation.tradeBot.lastAction = now;
                            this.showNotification(`🤖 Bot wykonał arbitraż: ${from} → ${to}`, 'info');
                        }
                    }
                });
            }

            /* =============================================
               TAB SYSTEM
               ============================================= */

            switchTab(tabName) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Remove active class from all tab buttons
                document.querySelectorAll('.tab-button').forEach(button => {
                    button.classList.remove('active');
                });

                // Show selected tab content
                const tabContent = document.getElementById(`${tabName}-content`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }

                // Activate selected tab button
                const tabButton = document.getElementById(`tab-${tabName}`);
                if (tabButton) {
                    tabButton.classList.add('active');
                }

                this.gameState.currentTab = tabName;
                console.log(`Switched to tab: ${tabName}`);

				// Odśwież tylko potrzebny panel
				if (tabName === 'overview') {
					this.updateOverviewTab();
				} else if (tabName === 'human-capital') {
					this.updateHumanCapitalTab();
				} else if (tabName === 'global-markets') {
					this.updateGlobalMarketsTab();
				} else if (tabName === 'trade') {
					this.updateTradeTab();
				} else if (tabName === 'automation') {
					this.updateAutomationTab();
				} else if (tabName === 'minigames') {
					this.updateMinigamesTab();
				}
            }

			produceMarkets() {
				Object.keys(this.regions).forEach(regionKey => {
					const region = this.regions[regionKey];
					if (region.unlocked) {
						const production = this.calculateMarketProduction(regionKey);
						const currencyKey = region.currency.toLowerCase();
						this.resources[currencyKey] = (this.resources[currencyKey] || 0) + production;
					}
				});
			}
			calculateMarketProduction(regionKey) {
				const region = this.regions[regionKey];
				let base = region.level * region.currencyProduction;
				if (this.departments[region.keyDepartment]?.owned > 0) {
					base *= 1.2; // Synergia +20%
				}
				return base;
			}
			upgradeMarket(regionKey) {
			  const region = this.regions[regionKey];
			  if (!region || !region.unlocked) return;

			  if (this.resources.budget >= region.upgradeCost) {
				this.resources.budget -= region.upgradeCost;
				region.level++;
				region.currencyProduction *= 1.2;
				this.updateGlobalMarketsTab();
				this.checkWinCondition();
			  }
			}
			unlockMarket(regionKey) {
			  const region = this.regions[regionKey];
			  if (region.unlocked) return;

			  if (this.resources.budget >= region.upgradeCost) {
				this.resources.budget -= region.upgradeCost;
				region.unlocked = true;
				region.level = 1;
				this.updateGlobalMarketsTab();
				this.checkWinCondition();
			  }
			}

            /* =============================================
               CORE MECHANICS (from 4.2.2)
               ============================================= */

            performMainClick() {
                let clickValue = 2;

                const budgetEfficiency = this.calculateSoftcap('budget', this.resources.budget);
                const stressEffects = this.calculateStressEffects();
                const motivationEffects = this.calculateMotivationEffects();

                const finalValue = clickValue * budgetEfficiency * stressEffects.production * (1 + motivationEffects.productionBonus) * (this.achievementBonuses?.clickPower || 1);

                this.resources.budget += finalValue;
                this.gameState.totalClicks++;

                this.updateClickValueDisplay(finalValue, budgetEfficiency);
                this.animateResourceValue('budget');

                if (Math.random() < 0.1) {
                    this.resources.influence += 0.1;
                }

                this.updateResourceBar();
				this.checkAchievements();
            }

            purchaseDepartment(deptId) {
                const cost = this.getDepartmentCost(deptId);

                if (this.resources.budget >= cost) {
                    this.resources.budget -= cost;
                    this.departments[deptId].owned++;
                    this.updateDepartments();
                    this.updateResourceBar();
                    this.showNotification(`🏢 Zatrudniono ${this.departmentData[deptId].name}!`, 'success');
                    return true;
                }

                this.showNotification(`💰 Niewystarczające punkty! Potrzebujesz ${cost} 💰`, 'warning');
                return false;
				this.updateResourceBar();
            }

            getDepartmentCost(deptId) {
                const baseData = this.departmentData[deptId];
                if (!baseData) return 999999;

                const owned = this.departments[deptId].owned;
                return Math.floor(baseData.baseCost * Math.pow(1.25, owned));
				// Apply cost reduction from achievements
				if (this.achievementBonuses && this.achievementBonuses.costReduction) {
					cost *= this.achievementBonuses.costReduction;
				}
            }

            checkDepartmentUnlocks() {
                Object.keys(this.departments).forEach(deptId => {
                    const deptData = this.departmentData[deptId];
                    const dept = this.departments[deptId];

                    if (dept.unlocked) return;

                    let allConditionsMet = true;

                    if (deptData.unlockConditions) {
                        for (const condition of deptData.unlockConditions) {
                            if (condition.type === 'resource') {
                                if (this.resources[condition.resource] < condition.amount) {
                                    allConditionsMet = false;
                                    break;
                                }
                            }
                        }
                    }

                    if (allConditionsMet) {
                        dept.unlocked = true;
                        this.showNotification(`🆕 Odblokowano ${deptData.name}!`, 'success');
                    }
                });
            }

            /* =============================================
               GAME LOOP - Enhanced for Global Operations
               ============================================= */

            triggerRandomEvent() {
				const roll = Math.random();
				if (roll < 0.1) { // 10% szansy na event co tick
					// Przykład - event ekonomiczny
					const regions = Object.keys(this.regions);
					const target = regions[Math.floor(Math.random() * regions.length)];
					const change = (Math.random() < 0.5) ? 0.7 : 1.3; // -30% lub +30%
					this.regions[target].currencyProduction *= change;
					setTimeout(() => { // Powrót do normy po 60 sekundach
						this.regions[target].currencyProduction /= change;
					}, 60000);
					showCustomModal(`Wydarzenie globalne: ${getRegionName(target)} ${change < 1 ? "– kryzys (-30%)" : "– wzrost (+30%)"} produkcji!`);
				}
			}
			checkForBurnout() {
				if (this.resources.stress >= 180) {
					// Burnout! % szansy na zwolnienie departamentu
					if (Math.random() < 0.12) {
						const depts = Object.keys(this.departments).filter(d=>this.departments[d].owned>0);
						if (!depts.length) return;
						const victim = depts[Math.floor(Math.random() * depts.length)];
						this.departments[victim].owned = Math.max(0, this.departments[victim].owned - 1);
						showCustomModal(`Burnout! Zwolniono 1 osobę z działu ${getDepartmentName(victim)}.`);
						this.resources.stress -= 30; // Po zwolnieniu spada dramatycznie stres
					}
				}
			}
			aiAutomationEffect() {
				if (Math.random() < 0.35) {
					// 35% szansy przy każdym wywołaniu
					if (Math.random() < 0.5) {
						this.resources.budget += 100 * (this.automation.level || 1);
						this.resources.motivation = Math.min(100, this.resources.motivation + 10);
						showCustomModal("AI optimizuje koszty! +100 punktów, +10 motywacji");
					} else {
						this.resources.stress += 18;
						showCustomModal("AI bug – rośnie stres o 18!");
					}
				}
			}
			gameLoop() {
                if (this.gameState.paused) return;

                const now = Date.now();
                const deltaTime = now - this.gameState.lastUpdate;
                this.gameState.lastUpdate = now;
                const deltaSeconds = deltaTime / 1000;

                // Apply game speed
                const motivationEffects = this.calculateMotivationEffects();
                const adjustedDelta = deltaSeconds * motivationEffects.speedBonus * this.gameState.gameSpeed;
                this.updateProduction(adjustedDelta);
                this.applySideEffects(adjustedDelta);
                this.updateFXRates();
                this.runDepartmentAI();
                this.runTradeBot();
				this.checkForBurnout();
				this.produceMarkets();
                this.checkDepartmentUnlocks();
                this.checkRegionUnlocks();
					if (this.automation?.enabled) {
						// Tylko co 500 ticków losowy efekt AI
						this.aiTickCounter = (this.aiTickCounter || 0) + 1;
						if (this.aiTickCounter >= 500) {
							this.aiAutomationEffect();
							this.aiTickCounter = 0;
						}
					}
				this.globalEventTickCounter++;
					if (this.globalEventTickCounter >= 500) {
						this.triggerRandomEvent();
						this.globalEventTickCounter = 0;
					}
				this.hrTickCounter = (this.hrTickCounter || 0) + 1;
				if (this.hrAutomated && this.hrTickCounter >= 60) { // raz na sekundę, jeśli automatyzacja HR włączona
					this.runHrAutomationTick(); // funkcja z logiką HR
					this.hrTickCounter = 0;
				}
				this.globalEventTickCounter = (this.globalEventTickCounter || 0) + 1;
				if (this.globalEventTickCounter >= 500) { // co ok. 1 minutę przy 120Hz ticku
					this.triggerRandomEvent();
					this.globalEventTickCounter = 0;
				}
				// Burnout - nie częściej niż co 300 ticków (ok. 30s)
				this.burnoutTickCounter = (this.burnoutTickCounter || 0) + 1;
				if (this.burnoutTickCounter >= 300) {
					this.checkForBurnout();
					this.burnoutTickCounter = 0;
				}
                Object.keys(this.resources).forEach(key => {
					if (isNaN(this.resources[key]) || this.resources[key] < 0) {
						this.resources[key] = 0;
					}
				});
				const clickValue = 2; // oblicz ponownie wartość kliknięcia (jak w performMainClick)
const budgetEfficiency = this.calculateSoftcap("budget", this.resources.budget);
const stressEffects = this.calculateStressEffects();
const finalValue = 2 * budgetEfficiency * stressEffects.production * (1 + motivationEffects.productionBonus) * (this.achievementBonuses?.clickPower || 1); // analogicznie jak w performMainClick

this.updateClickValueDisplay(finalValue, budgetEfficiency);
            }

            updateProduction(deltaSeconds) {
                const stressEffects = this.calculateStressEffects();
                const motivationEffects = this.calculateMotivationEffects();

                let totalProductionMultiplier = stressEffects.production * (1 + motivationEffects.productionBonus);

                Object.entries(this.departments).forEach(([deptId, dept]) => {
                    if (dept.owned === 0) return;

                    const deptData = this.departmentData[deptId];
                    if (!deptData || !deptData.production) return;

                    Object.entries(deptData.production).forEach(([resource, rate]) => {
                        const softcapEfficiency = this.calculateSoftcap(resource, this.resources[resource]);
                        const production = rate * dept.owned * totalProductionMultiplier * softcapEfficiency * deltaSeconds;

                        this.resources[resource] = (this.resources[resource] || 0) + production;

                    });
                });
				    const unlockedBefore = Object.values(this.departments).filter(d => d.unlocked).length;
					this.checkDepartmentUnlocks();
					const unlockedAfter = Object.values(this.departments).filter(d => d.unlocked).length;

					// Odśwież panel tylko jeśli unlock rzeczywiście nastąpił
					if (unlockedAfter > unlockedBefore) {
						this.updateOverviewTab();
					}
					this.updateResourceBar();
				}

updateGlobalPresenceCard() {
    const globalCard = document.getElementById('global-presence-card');
    if (!globalCard) return;

    // Aktywne regiony
    const activeRegions = Object.values(this.regions).filter(r => r.unlocked).length;
    const activeRegionsElem = document.getElementById('active-regions');
    if (activeRegionsElem) activeRegionsElem.textContent = activeRegions;

    // Całkowita produkcja globalna
    let totalRevenue = Object.values(this.regions).reduce((acc, region) => {
        return acc + (region.unlocked ? region.level * region.currencyProduction : 0);
    }, 0);
    const totalRevenueElem = document.getElementById('total-revenue');
    if (totalRevenueElem) totalRevenueElem.textContent = totalRevenue.toFixed(2);

    // Globalny poziom
    let globalLevel = 1;
    if (activeRegions > 0) {
        globalLevel = Math.floor(
            Object.values(this.regions)
                .filter(r => r.unlocked)
                .reduce((acc, region) => acc + (region.level || 1), 0) / activeRegions
        );
    }
    const globalLevelElem = document.getElementById('global-level');
    if (globalLevelElem) globalLevelElem.textContent = globalLevel;

    // Lista regionów
    let regionListHTML = '';
    Object.entries(this.regions).forEach(([key, region]) => {
        if(region.unlocked) {
            regionListHTML += `<span style="margin-right:10px">${getRegionFlag(key)} <b>${getRegionName(key)}</b> (lv.${region.level || 1})</span>`;
        }
    });
    const regionsListElem = document.getElementById('regions-list');
    if (regionsListElem) regionsListElem.innerHTML = regionListHTML || '<i>Brak aktywnych regionów</i>';

    // Progress bar
    const progressBarElem = document.getElementById('global-progress-bar');
    const progressValueElem = document.getElementById('global-progress-value');
    if (progressBarElem && progressValueElem) {
      progressBarElem.max = Object.keys(this.regions).length;
      progressBarElem.value = activeRegions;
      progressValueElem.textContent = `${activeRegions}/${Object.keys(this.regions).length}`;
    }

    // SVG "mapa"
    Object.entries(this.regions).forEach(([key, region]) => {
        const svgRegion = document.getElementById('map-' + key.replace('-', ''));
        if (svgRegion) svgRegion.setAttribute('opacity', region.unlocked ? '1' : '0.2');
    });
}
            applySideEffects(deltaSeconds) {
                // Department side effects
                Object.entries(this.departments).forEach(([deptId, dept]) => {
                    if (dept.owned === 0) return;

                    const deptData = this.departmentData[deptId];
                    if (!deptData || !deptData.sideEffects) return;

                    Object.entries(deptData.sideEffects).forEach(([resource, rate]) => {
                        const effect = rate * dept.owned * deltaSeconds;
                        this.resources[resource] = (this.resources[resource] || 0) + effect;
                    });
                });

                // Natural stress/motivation changes
                this.resources.stress = Math.max(0, this.resources.stress - 0.2 * deltaSeconds);

                if (this.resources.motivation > 50) {
                    this.resources.motivation -= 0.15 * deltaSeconds;
                } else if (this.resources.motivation < 50) {
                    this.resources.motivation += 0.05 * deltaSeconds;
                }

                // Constrain values
                this.resources.stress = Math.max(0, Math.min(200, this.resources.stress));
                this.resources.motivation = Math.max(-50, Math.min(100, this.resources.motivation));
				this.updateResourceBar();
            }

            /* =============================================
               DISPLAY UPDATES - Modern UI System
               ============================================= */


            updateDisplay() {
                this.updateResourceBar();
                this.updateOverviewTab();
                this.updateHumanCapitalTab();
                this.updateGlobalMarketsTab();
                this.updateTradeTab();
                this.updateAutomationTab();
                this.updateMinigamesTab();
            }

            updateResourceBar() {
                const resources = ['budget', 'documents', 'coffee', 'prestige', 'usd', 'eur', 'jpy', 'cny', 'freight'];

                resources.forEach(resource => {
                    const element = document.getElementById(resource);
                    if (element) {
                        const value = Math.floor(this.resources[resource] || 0);
                        element.textContent = this.formatNumber(value);
                    }

                    // Update efficiency indicators
                    const efficiencyElement = document.getElementById(`${resource}-efficiency`);
                    if (efficiencyElement && this.softcapThresholds[resource]) {
                        const efficiency = this.calculateSoftcap(resource, this.resources[resource]);
                        const efficiencyPercent = Math.round(efficiency * 100);

                        efficiencyElement.textContent = `${efficiencyPercent}%`;

                        // Update efficiency class
                        efficiencyElement.className = 'resource-efficiency ';
                        if (efficiency >= 0.9) {
                            efficiencyElement.className += 'efficiency-optimal';
                        } else if (efficiency >= 0.6) {
                            efficiencyElement.className += 'efficiency-moderate';
                        } else {
                            efficiencyElement.className += 'efficiency-poor';
                        }
                    }
                });
				const productionGains = {
				  budget: 0,
				  documents: 0,
				  coffee: 0,
				  prestige: 0,
				};
				this.gameState.maxStress = Math.max(this.gameState.maxStress || 0, this.resources.stress);
				this.gameState.maxMotivation = Math.max(this.gameState.maxMotivation || 0, this.resources.motivation);
			Object.keys(productionGains).forEach(resource => {
				this.gameState.totalProduced[resource] = (this.gameState.totalProduced[resource] || 0) + productionGains[resource];
			});
			}

 updateOverviewTab() {

	// Update departments overview
    const container = document.getElementById('departments-overview');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(this.departmentData).forEach(([deptId, deptData]) => {
        const dept = this.departments[deptId];

        const card = document.createElement('div');
        card.className = `department-card card ${dept.unlocked ? 'unlocked' : 'locked'}`;

        card.innerHTML = `
            <div class="department-top">
			<div class="department-header">
                <div class="department-title">
                    <span>${deptData.icon}</span>
                    ${deptData.name}
                </div>
            </div>
			<div class="department-description">${deptData.description}</div>
			</div>
			<div class="department-bottom">
            <div class="department-body">
                <div class="department-effects"></div>
                <div class="department-unlock-conditions"></div>
                <div class="department-stats">
                    <div class="stat-item">
                        <div class="stat-label">
						  Zatrudnienie
						  <span class="tooltip-icon" tabindex="0">?
							<span class="tooltip-text">
							  <b>Co oznacza 'Zatrudnienie'?</b><br>
							  Liczba aktualnie zatrudnionych jednostek tego działu.<br>
							  Każda zatrudniona jednostka zwiększa efekty działania.<br>
							  Im więcej zatrudnionych, tym większy poziom oraz wzrost efektów, ale rośnie też koszt kolejnych zatrudnień!
							</span>
						  </span>
						</div>
                        <div class="stat-value">${dept.owned}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">
                            Koszt (Budżet)
                            <span class="tooltip-icon" tabindex="0">?
                              <span class="tooltip-text">
                                <b>Co oznacza Koszt?</b><br>
                                Musisz posiadać wystarczająco duzo <b>punktów</b>, aby zatrudnić kolejną jednostkę tego działu.<br>
                                Koszt rośnie ze wzrostem liczby zatrudnionych!
                              </span>
                            </span>
                        </div>
                        <div class="stat-value">${this.formatNumber(this.getDepartmentCost(deptId))}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">
                            Poziom
                            <span class="tooltip-icon" tabindex="0">?
                              <span class="tooltip-text">
                                <b>Jak liczony jest poziom?</b><br>
                                Poziom danego działu zwiększa się coraz wolniej:<br>
                                <code>poziom = 1 + ⌊log₂(liczba zatrudnionych + 1)⌋</code>.<br>
                                Wyższy poziom umożliwia większą produkcję i dodatkowe efekty!
                              </span>
                            </span>
                        </div>
                        <div class="stat-value">${dept.owned > 0 ? Math.floor(Math.log2(dept.owned + 1)) + 1 : 1}</div>
                    </div>
                </div>
                <button class="department-button" ${dept.unlocked && this.resources.budget >= this.getDepartmentCost(deptId) ? '' : 'disabled'}>
                    ${dept.unlocked ? 'Zatrudnij' : 'Zablokowane'}
                </button>
            </div>
			</div>
        `;

        // --- SEKRETNE EFEKTY DZIAŁU: PRODUKCJA I EFEKTY UBOCZNE ---
        let effectHtml = '<div><span class="effects-title">Efekty zatrudniania:</span>';
        if (deptData.production) {
            Object.entries(deptData.production).forEach(([res, val]) => {
                effectHtml += `<div class="effect-item effect-positive">+${val} ${this.formatResourceName(res)} / poziom</div>`;
            });
        }
        if (deptData.sideEffects) {
            Object.entries(deptData.sideEffects).forEach(([res, val]) => {
                effectHtml += `<div class="effect-item effect-negative">${val > 0 ? '+' : ''}${val} ${this.formatResourceName(res)} / poziom</div>`;
            });
        }
        effectHtml += '</div>';
        card.querySelector('.department-effects').innerHTML = effectHtml;

        // --- WARUNKI ODBLOKOWANIA DLA BLOKOWANEGO DZIAŁU ---
		let unlockHtml = '';
		if (!dept.unlocked && deptData.unlockConditions && deptData.unlockConditions.length) {
			unlockHtml = `<div class="department-overlay">
				<div>
					<span class="unlock-title">Aby odblokować:</span>
					<ul>`;
			deptData.unlockConditions.forEach(cond => {
				if (cond.type === "resource") {
					unlockHtml += `<li>${cond.amount} ${this.formatResourceName(cond.resource)}</li>`;
				}
			});
			unlockHtml += `</ul>
				</div>
			</div>`;
		}
        if (!dept.unlocked && (!deptData.unlockConditions || !deptData.unlockConditions.length)) {
            unlockHtml = '<div class="department-unlock">Dostępny od początku gry</div>';
        }
        card.querySelector('.department-unlock-conditions').innerHTML = unlockHtml;

        if (dept.unlocked) {
            const button = card.querySelector('button');
            button.addEventListener('click', () => this.purchaseDepartment(deptId));
        }

        container.appendChild(card);
    });

    // Update global stats
    const activeRegions = Object.values(this.regions).filter(r => r.unlocked).length;
    const totalRevenue = this.resources.budget + this.resources.usd * 4 + this.resources.eur * 4.3;
    const globalLevel = Math.floor(totalRevenue / 1000) + 1;

    //document.getElementById('active-regions').textContent = activeRegions;
    //document.getElementById('total-revenue').textContent = this.formatNumber(totalRevenue);
    //document.getElementById('global-level').textContent = globalLevel;
}


			hireDepartment(deptId) {
			  const dept = this.departments[deptId];
			  if (!dept) return;
			  const cost = this.calculateDepartmentCost(deptId); // <-- dynamicznie!
			  if (this.resources.budget >= cost) {
				this.resources.budget -= cost;
				dept.owned++;
				dept.level = dept.owned;
				this.updateDepartments();
				this.updateOverviewTab();
				this.updateResourceBar();
				this.checkAchievements();
			  }
			}

			// Funkcja aktualizująca wyświetlanie kart departamentów:
			updateDepartments() {
			  const container = document.getElementById('departments-overview');
			  if(!container) return;
			  container.innerHTML = '';
			  Object.entries(this.departments).forEach(([deptId, deptData]) => {
				// Zakładam, że masz funkcję do wyliczania kosztu zatrudnienia:
				const nextCost = this.calculateDepartmentCost
				  ? this.calculateDepartmentCost(deptId)
				  : (deptData.baseCost || 100) * Math.pow(1.15, deptData.owned || 0); // fallback

				const card = document.createElement('div');
				card.className = 'department-card';
				card.innerHTML = `
				  <div class="dept-title">${deptData.name}</div>
				  <div>Liczba zatrudnionych: ${deptData.owned}</div>
				  <div>Poziom: ${deptData.level || 1}</div>
				  <button onclick="game.hireDepartment('${deptId}')">
					Zatrudnij (koszt: ${Math.floor(nextCost)} 💰)
				  </button>
				`;
				container.appendChild(card);
			  });
			  game.updateOverviewTab();
			}

			updateHumanCapitalTab() {
                // Update stress progress
                const stressBar = document.getElementById('stress-progress');
                const stressPercentage = document.getElementById('stress-percentage');
                const stressEffectsElement = document.getElementById('stress-effects');
                const stressValue = document.getElementById('stress');

                if (stressBar && stressValue) {
                    const stressPercent = (this.resources.stress / 200) * 100;
                    stressBar.style.width = `${Math.min(stressPercent, 100)}%`;
                    stressValue.textContent = Math.floor(this.resources.stress);

                    if (stressPercentage) {
                        stressPercentage.textContent = `${Math.round(stressPercent)}%`;
                    }
                }

                if (stressEffectsElement) {
                    const effects = this.calculateStressEffects();
                    stressEffectsElement.innerHTML = `
                        Produkcja: ${Math.round(effects.production * 100)}% •
                        Jakość: ${Math.round(effects.quality * 100)}% •
                        Ryzyko rezygnacji: ${Math.round(effects.quitChance * 100)}%
                    `;
                }

                // Update motivation progress
                const motivationBar = document.getElementById('motivation-progress');
                const motivationPercentage = document.getElementById('motivation-percentage');
                const motivationEffectsElement = document.getElementById('motivation-effects');
                const motivationValue = document.getElementById('motivation');

                if (motivationBar && motivationValue) {
                    const motivationPercent = ((this.resources.motivation + 50) / 150) * 100;
                    motivationBar.style.width = `${Math.max(0, Math.min(motivationPercent, 100))}%`;
                    motivationValue.textContent = Math.floor(this.resources.motivation);

                    if (motivationPercentage) {
                        motivationPercentage.textContent = `${Math.round(motivationPercent)}%`;
                    }
                }

                if (motivationEffectsElement) {
                    const effects = this.calculateMotivationEffects();
                    const bonus = effects.productionBonus * 100;
                    const speed = effects.speedBonus;

                    motivationEffectsElement.innerHTML = `
                        Bonus produkcji: ${bonus > 0 ? '+' : ''}${Math.round(bonus)}% •
                        Przyspieszenie: ${speed === 1 ? 'Normalne' : `${speed.toFixed(1)}x`}
                    `;
                }
				const coffeeBtn = document.getElementById("coffee-break-btn");
				if (coffeeBtn) {
				  coffeeBtn.onclick = function() {
					if (game.resources.coffee >= 50) {
					  game.resources.coffee -= 50;
					  game.resources.stress = Math.max(0, game.resources.stress - 20);
					  game.resources.motivation = Math.min(100, game.resources.motivation + 10);
					  if (game.gameState) game.gameState.coffeeBreaks = (game.gameState.coffeeBreaks || 0) + 1;
					  game.updateResourceBar();
					  game.updateHumanCapitalTab();
					  game.checkAchievements();
					  // Dodaj POPUP po sukcesie
					  openCoffeePopup("Ekipa się relaksuje: -20 stresu, +10 motywacji!");
					} else {
					  openCoffeePopup("Nie masz wystarczająco kawy! (min. 50)");
					}
				  }
				}
				function openCoffeePopup(msg) {
				  document.getElementById('coffee-popup-msg').textContent = msg;
				  document.getElementById('coffee-popup').classList.remove('hidden');
				}
				function closeCoffeePopup() {
				  document.getElementById('coffee-popup').classList.add('hidden');
				}
            }
coffeeBreakBatch(multiplier=1) {
    const coffeePerUse = 50, stressPerUse = 20, motivationPerUse = 10;
    const maxUses = Math.floor(this.resources.coffee / coffeePerUse);
    multiplier = Math.min(multiplier, maxUses);

    if (multiplier < 1) {
        openCoffeePopup("Nie masz wystarczająco kawy! min. 50");
        return;
    }
    this.resources.coffee -= coffeePerUse * multiplier;
    this.resources.stress = Math.max(0, this.resources.stress - stressPerUse * multiplier);
    this.resources.motivation = Math.min(100, this.resources.motivation + motivationPerUse * multiplier);
    this.updateResourceBar();
    this.updateHumanCapitalTab();
    openCoffeePopup(`Ekipa się relaksuje<br>-${stressPerUse * multiplier} stresu, +${motivationPerUse * multiplier} motywacji!`);
}


			updateGlobalMarketsTab() {
			  const container = document.getElementById('region-cards-container');
			  container.innerHTML = ''; // wyczyść!

			  Object.entries(this.regions).forEach(([regionKey, region]) => {
				// Dynamiczne klasy / napisy
				const locked = !region.unlocked;
				const currencySymbol = getCurrencySymbol(region.currency); // np. "€", "$" itd.
				const regionName = getRegionName(regionKey); // np. "Europa", "Ameryki" itd.

				// Przyciski
				let actionBtn = '';
				if (!region.unlocked && region.upgradeCost) {
				  // Przycisk do odblokowania
				  actionBtn = `<button class="market-upgrade-btn" onclick="game.unlockMarket('${regionKey}')">Otwórz rynek (${region.upgradeCost} 💰)</button>`;
				} else if (region.unlocked) {
				  let tooltip = '';
					if (region.keyDepartment) {
						tooltip = `Synergia – za aktywny dział ${getDepartmentName(region.keyDepartment)}: +20% produkcji na tym rynku.`;
					}
					// Przycisk do rozwoju rynku
				  actionBtn = `<button class="market-upgrade-btn" title="${tooltip}" onclick="game.upgradeMarket('${regionKey}')">Rozwijaj rynek (koszt: ${region.upgradeCost} 💰)</button>`;
				}

				// Aktualna produkcja, poziom, pracownicy itd.
				container.innerHTML += `
				  <div class="region-card card${locked ? ' locked' : ''}" data-region="${regionKey}">
					<div class="region-header">
					  <h3 class="region-title">${getRegionFlag(regionKey)} ${regionName}</h3>
					  <div class="region-status">${locked ? `Wymaga: ${region.upgradeCost} 💰` : 'Odblokowane'}</div>
					</div>
					<div class="card-content">
					  <div class="region-stats">
						<div class="stat-item">
						  <div class="stat-label">Przychody</div>
						  <div class="stat-value">${currencySymbol}${(region.level * region.currencyProduction).toFixed(2)}</div>
						</div>
						<div class="stat-item">
						  <div class="stat-label">Pracownicy</div>
						  <div class="stat-value">${region.employees || 0}</div>
						</div>
						<div class="stat-item">
						  <div class="stat-label">Poziom</div>
						  <div class="stat-value">${region.level || 0}</div>
						</div>
					  </div>
					  ${actionBtn}
					</div>
				  </div>
				`;
			  });
			}


            updateTradeTab() {
                // Update FX rates display
                const fxContainer = document.getElementById('fx-rates');
                if (!fxContainer) return;

                fxContainer.innerHTML = '';

                Object.entries(this.fxRates).forEach(([pair, data]) => {
                    const [from, to] = pair.split('_to_');

                    const pairElement = document.createElement('div');
                    pairElement.className = 'fx-pair';
                    pairElement.onclick = () => this.openTradeDialog(from, to);

                    const trendIcon = data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '⟷';
                    const trendText = data.trend === 'up' ? 'Rośnie' : data.trend === 'down' ? 'Spada' : 'Stabilny';

                    pairElement.innerHTML = `
                        <div class="fx-pair-name">${from.toUpperCase()}/${to.toUpperCase()}</div>
                        <div class="fx-rate">${data.rate.toFixed(3)}</div>
                        <div class="fx-trend trend-${data.trend}">${trendIcon} ${trendText}</div>
                    `;

                    fxContainer.appendChild(pairElement);
                });
            }

updateAutomationTab() {
    // BLOKADA: Sprawdź, czy przynajmniej 1 region poza Europą jest odblokowany
    const otherRegions = Object.entries(this.regions).filter(([regionId, region]) =>
        regionId !== "europe" && region.unlocked
    );
    const canShowAutomation = otherRegions.length > 0;

    const automationContent = document.getElementById('automation-content');
    if (automationContent && !canShowAutomation) {
        automationContent.innerHTML =
            '<div class="automation-locked" style="padding: 2rem; color: #ff9800; font-weight: 600">Odblokuj przynajmniej jeden nowy rynek poza Europą, by uzyskać dostęp do automatyzacji AI.</div>';
        return;
    }

    // Update AI agent statuses
    const deptStatus = document.getElementById('dept-ai-status');
    const tradeStatus = document.getElementById('trade-ai-status');
    const expansionStatus = document.getElementById('expansion-ai-status');

    if (deptStatus) {
        deptStatus.className = `agent-status ${this.automation.departmentAI.active ? '' : 'inactive'}`;
    }
    if (tradeStatus) {
        tradeStatus.className = `agent-status ${this.automation.tradeBot.active ? '' : 'inactive'}`;
    }
    if (expansionStatus) {
        expansionStatus.className = `agent-status ${this.automation.expansionAI.active ? '' : 'inactive'}`;
    }

    // Update threshold displays
    const deptROIDisplay = document.getElementById('dept-roi-display');
    const tradeArbitrageDisplay = document.getElementById('trade-arbitrage-display');

    if (deptROIDisplay) {
        const threshold = document.getElementById('dept-roi-threshold');
        if (threshold) {
            this.automation.departmentAI.roiThreshold = parseFloat(threshold.value) / 100;
            deptROIDisplay.textContent = `${threshold.value}%`;
        }
    }

    if (tradeArbitrageDisplay) {
        const threshold = document.getElementById('trade-arbitrage-threshold');
        if (threshold) {
            this.automation.tradeBot.arbitrageThreshold = parseFloat(threshold.value) / 100;
            tradeArbitrageDisplay.textContent = `${threshold.value}%`;
        }
    }
}

            updateMinigamesTab() {
                const container = document.getElementById('minigames-grid');
                if (!container) return;

                container.innerHTML = '';

                Object.entries(this.minigameData).forEach(([gameId, gameData]) => {
                    const isUnlocked = gameData.unlocked();
                    const lastPlayed = this.gameState.minigameCooldowns[gameId] || 0;
                    const cooldownRemaining = gameData.cooldown - (Date.now() - lastPlayed);
                    const onCooldown = cooldownRemaining > 0;

                    const card = document.createElement('div');
                    card.className = `card ${isUnlocked ? 'unlocked' : 'locked'}`;

                    const costText = Object.entries(gameData.cost)
                        .map(([resource, amount]) => `${amount} ${this.formatResourceName(resource)}`)
                        .join(', ');

                    const successRewards = Object.entries(gameData.rewards.success)
                        .map(([reward, value]) => `${reward}: +${value}`)
                        .join(', ');

                    let buttonText, buttonClass = '';

                    if (!isUnlocked) {
                        buttonText = 'Zablokowane';
                        buttonClass = 'disabled';
                    } else if (onCooldown) {
                        buttonText = `Cooldown: ${Math.ceil(cooldownRemaining / 60000)}min`;
                        buttonClass = 'disabled';
                    } else {
                        buttonText = 'Zagraj Teraz';
                    }

					card.innerHTML = `
						<div class="card-header">
							<h3 class="card-title">
								<span>${gameData.icon}</span>
								${gameData.name}
							</h3>
						</div>
						<div class="card-content">
							<div class="card-cost-box">
								💸 Koszt: ${costText}
							</div>
							<div class="card-description">
								${gameData.description}
							</div>
							<div class="card-reward-box">
							  🎁 <b>Nagrody za sukces:</b><br>
							  ${this.formatMinigameReward(gameData.rewards.success)}
							</div>
							<div class="card-reward-box failure">
							  ❌ <b>Konsekwencje przegranej:</b><br>
							  ${this.formatMinigameReward(gameData.rewards.failure)}
							</div>
							<button class="department-button ${buttonClass}" ${buttonClass.includes('disabled') ? 'disabled' : ''}>
								${buttonText}
							</button>
						</div>
					`;

                    // Add event listener
                    if (isUnlocked && !onCooldown && !buttonClass.includes('disabled')) {
                        const button = card.querySelector('button');
                        button.addEventListener('click', () => this.openMinigame(gameId));
                    }

                    container.appendChild(card);
                });
            }
formatMinigameReward(rewardObj) {
    // pozwól na użycie "this.formatResourceName"
    const special = {
        // Najpierw logika specjalnych
        budget_loss_percent: obj => `💸 <b>Strata budżetu:</b> <span style="color:#f44">-${Math.round(obj*100)}%</span>`,
        softcap_increase:    obj => `⬆️ <b>Zwiększenie softcapów:</b> <span style="color:#2c8b1a">+${Math.round(obj*100)}%</span>`,
        global_expansion_bonus: () => "🌍 <b>Premia do ekspansji globalnej</b>",
        investigation: obj => obj ? "🔎 <b>Dochodzi do śledztwa!</b>" : "",
        all_production: obj => `⚙️ <b>Boost produkcji (wszystko):</b> <span style="color:#1b7a1d">×${obj}</span>`,
        coffee_addiction: obj => `☕ <b>Uzależnienie od kawy:</b> <span style="color:#e8a534">${obj>0?'+':''}${obj}</span>`,
        passive_income: obj => `💵 <b>Pasywny przychód:</b> <span style="color:#1b7a1d">${obj>0?'+':''}${obj}</span>`,
        tax_reduction: obj => `💡 <b>Obniżka podatku:</b> <span style="color:#209294">${obj>0?'+':''}${obj}</span>`,
        region_lock: obj => `🚫 <b>Blokada regionu:</b> <span style="color:#c22;">+${obj}</span>`,
        subsidiaries: obj => `🏢 <b>Nowa spółka zależna:</b> <span style="color:#1b7a1d">+${obj}</span>`,
        departments_loss: obj => `🧑‍💼 <b>Strata działu:</b> <span style="color:#c22;">+${obj}</span>`,
        coffee_shop_level: obj => `🏪 <b>Poziom kawiarni:</b> <span style="color:#1b7a1d">+${obj}</span>`,
        reputation_loss: obj => `🎖️ <b>Utrata reputacji:</b> <span style="color:#f44;">+${obj}</span>`,
    };
    // SF: Kolor plusa/minusa
    function colorFor(val) {
        if (val > 0) return "color:#078902;font-weight:500;";
        if (val < 0) return "color:#c22;font-weight:500;";
        return "";
    }

    return Object.entries(rewardObj).map(([resource, value]) => {
        if (special[resource]) return special[resource](value);

        // Emotka + opis zasobu
        const label = this.formatResourceName ? this.formatResourceName(resource) : resource;
        const sign = value > 0 ? "+" : "";
        return `${label}: <span style="${colorFor(value)}">${sign}${value}</span>`;
    }).filter(Boolean).join("<br>");
}


            /* =============================================
               UTILITY FUNCTIONS
               ============================================= */

			formatNumber(num) {
				switch (this.notation) {
					case "standard": return formatStandard(num);
					case "scientific": return formatScientific(num);
					case "engineering": return formatEngineering(num);
					default: return formatStandard(num);
				}
			}

			formatResourceName(resourceId) {
				const names = {
					budget: '💰 Punkty',
					documents: '📄 Dokumenty',
					coffee: '☕ Kofeina',
					prestige: '🎖️ Reputacja',
					usd: '💵 USD',
					eur: '💶 EUR',
					jpy: '💴 JPY',
					cny: '💷 CNY',
					freight: '📦 Freight',
					subsidiaries: '🏢 Spółka zależna',
					subsidiary: '🏢 Spółka zależna',
					coffee_shop_level: '🏪 Poziom kawiarni',
					passive_income: '💵 Pasywny przychód',
					all_production: '⚙️ Produkcja (wszystko)',
					softcap_increase: '⬆️ Softcap',
					reputation_loss: '🎖️ Utrata reputacji',
					departments_loss: '🧑‍💼 Strata działu',
					region_lock: '🚫 Blokada regionu'
				};
				return names[resourceId] || resourceId;
			}

            animateResourceValue(resource) {
                const element = document.getElementById(resource);
                if (element) {
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = 'pulse 0.6s ease';
                    }, 10);
                }
            }

            showNotification(message, type = 'info', duration = 3000) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;

                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.animation = 'slideInRight 0.4s ease reverse';
                    setTimeout(() => {
                        if (notification.parentElement) {
                            notification.parentElement.removeChild(notification);
                        }
                    }, 400);
                }, duration);
            }

            updateClickValueDisplay(finalValue, efficiency) {
                const clickValueElement = document.getElementById('click-value');
                const clickEfficiencyElement = document.getElementById('click-efficiency');

                if (clickValueElement) {
                    clickValueElement.textContent = finalValue.toFixed(1);
                }

                if (clickEfficiencyElement) {
                    clickEfficiencyElement.textContent = `${Math.round(efficiency * 100)}%`;
                }
            }
			calculateGlobalIncome() {
				return Object.values(this.regions).reduce((acc, region) =>
				  acc + (region.unlocked ? (region.level * region.currencyProduction) : 0), 0);
			}
			calculateGlobalLevel() {
				let unlocked = Object.values(this.regions).filter(r=>r.unlocked);
				if(!unlocked.length) return 1;
				return Math.floor(unlocked.reduce((acc,region) => acc+(region.level||0),0)/unlocked.length);
			}
            /* =============================================
               DIALOG SYSTEMS
               ============================================= */

            openTradeDialog(from, to) {
                const rate = this.fxRates[`${from}_to_${to}`]?.rate || 0.1;
                const amount = prompt(`Ile ${from} chcesz wymienić na ${to}?\nAktualny kurs: 1:${rate.toFixed(3)}\nOpłata transakcyjna: 1%`);

                if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                    this.executeTrade(from, to, parseFloat(amount));
                }
            }
           /* =============================================
               MINIGRY
               ============================================= */
openMinigame(gameId) {
    const gameData = this.minigameData[gameId];
    if (!gameData || !gameData.unlocked()) {
        this.showNotification('Mini-gra jeszcze nie odblokowana!', 'warning');
        return;
    }

    // Check cooldown
    const lastPlayed = this.gameState.minigameCooldowns[gameId] || 0;
    const cooldownRemaining = gameData.cooldown - (Date.now() - lastPlayed);
    if (cooldownRemaining > 0) {
        const minutes = Math.ceil(cooldownRemaining / 60000);
        this.showNotification(`⏱️ Cooldown: ${minutes} minut`, 'warning');
        return;
    }

    // Check costs
    let canAfford = true;
    const costText = [];
    Object.entries(gameData.cost).forEach(([resource, amount]) => {
        if (this.resources[resource] < amount) {
            canAfford = false;
        }
        costText.push(`${amount} ${this.formatResourceName(resource)}`);
    });

    if (!canAfford) {
        this.showNotification(`Niewystarczające zasoby! Potrzebujesz: ${costText.join(', ')}`, 'warning');
        return;
    }

    // START Minigames
    if (gameId === "quarterly_presentation") {
        this.startQuarterlyPresentation(gameId);
    } else if (gameId === "barista_championship") {
        this.startBaristaChampionship(gameId);
    } else if (gameId === "corporate_merger") {
        this.startCorporateMerger(gameId);
    } else if (gameId === "government_lobbying") {
        this.startGovernmentLobbying(gameId);
    } else if (gameId === "global_summit") {
        this.startGlobalSummit(gameId);
    } else {
        // fallback, np. losowa minigra lub powiadomienie
        this.showNotification("Nieznana minigra!", "warning");
    }
}

// Mechanika z quick reaction
startQuarterlyPresentation(gameId) {
    const gameData = this.minigameData[gameId];

    // Odejmujemy koszty
    Object.entries(gameData.cost).forEach(([resource, amount]) => {
        this.resources[resource] -= amount;
    });

    console.log(`🎮 Rozpoczynam Prezentację Kwartalną!`);

    const costText = Object.entries(gameData.cost)
        .map(([resource, amount]) => `${amount} ${this.formatResourceName(resource)}`)
        .join(', ');

    // Powiadomienie: przygotuj się!
    showCustomModal(`🔔 ${gameData.name} - Koszt: ${costText}. Przygotuj się...`, 'OK!', 3500);

    // Mechanika quick reaction
    let completed = false, canWin = false;
    let reactionTimeoutId = null;

    const completeGame = (result) => {
        if (completed) return;
        completed = true;
        document.removeEventListener('keydown', keyHandler);
        if(reactionTimeoutId) clearTimeout(reactionTimeoutId);
        this.completeMinigame(gameId, result);
    };

    const keyHandler = (e) => {
        if ((e.code === 'Space' || e.key === ' ') && canWin) {
            e.preventDefault();
            completeGame(true);
        } else if ((e.code === 'Space' || e.key === ' ') && !canWin) {
            e.preventDefault();
            completeGame(false);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            completeGame(false);
        }
    };

    document.addEventListener('keydown', keyHandler);

    // Losowy czas na sygnał (2-4 sekundy)
    const reactionTime = 2000 + Math.floor(Math.random() * 2000);
    setTimeout(() => {
        canWin = true;
        showCustomModal(`🔥 Sygnał! Naciśnij SPACE w 1s!`, 'KLIKNIJ SPACJE TERAZ!', 1000);

        // Daj graczowi tylko 1 sekundę na reakcję
        reactionTimeoutId = setTimeout(() => {
            completeGame(false);
        }, 1000);

    }, reactionTime);
}
startBaristaChampionship(gameId) {
    const gameData = this.minigameData[gameId];
    Object.entries(gameData.cost).forEach(([resource, amount]) => {
        this.resources[resource] -= amount;
    });

    // Przykładowe składniki — możesz dodać więcej!
    const possibleIngredients = [
        { key: "espresso",     label: "Espresso ☕" },
        { key: "milk",         label: "Mleko 🥛" },
        { key: "foam",         label: "Pianka 🫧" },
        { key: "syrup",        label: "Syrop 🍯" },
        { key: "chocolate",    label: "Czekolada 🍫" },
        { key: "cream",        label: "Śmietanka 🥥" }
    ];

    // Wybierz losową kombinację (np. 3 składniki)
    const combo = [];
    while (combo.length < 3) {
        const pick = possibleIngredients[Math.floor(Math.random() * possibleIngredients.length)];
        if (!combo.includes(pick)) combo.push(pick);
    }

    // Tworzymy okienko minigry w DOM
    let minigameDiv = document.getElementById("minigame-barista");
    if (minigameDiv) minigameDiv.remove();
    minigameDiv = document.createElement("div");
    minigameDiv.id = "minigame-barista";
    minigameDiv.style.cssText = "position:fixed;top:20%;left:50%;transform:translateX(-50%);background:#fff;padding:32px 24px 16px 24px;border:2px solid #702909;border-radius:22px;z-index:10001;text-align:center;box-shadow:0 8px 32px #3337";

    // Nagłówek
    const header = document.createElement("h2");
    header.innerText = "☕ Mistrzostwa Baristy";
    header.style.marginBottom = "10px";
    minigameDiv.appendChild(header);

    // Instrukcja ze składnikami
    const desc = document.createElement("div");
    desc.innerText = "Kliknij w odpowiedniej kolejności: " 
                   + combo.map(c=>c.label).join(" → ");
    desc.style.marginBottom = "16px";
    desc.style.fontWeight = "bold";
    minigameDiv.appendChild(desc);

    // Kontener na przyciski
    const btns = document.createElement("div");
    btns.style.display = "flex";
    btns.style.justifyContent = "center";
    btns.style.gap = "14px";
    btns.style.marginBottom = "8px";

    // Tylko składniki z combo!
    combo.forEach(c=>{
        const btn = document.createElement("button");
        btn.textContent = c.label;
        btn.style.fontSize = "18px";
        btn.style.padding = "8px 20px";
        btn.style.border = "2px solid #873e23";
        btn.style.background="#faf5f0";
        btn.style.borderRadius = "9px";
        btn.style.cursor = "pointer";
        btn.onclick = ()=>checkSelection(c.key);
        btns.appendChild(btn);
    });
    minigameDiv.appendChild(btns);

    // Pasek czasu
    const timebar = document.createElement("div");
    timebar.style.height = "8px";
    timebar.style.width = "220px";
    timebar.style.background="#eee";
    timebar.style.margin="0 auto 20px auto";
    timebar.style.borderRadius="4px";
    minigameDiv.appendChild(timebar);

    const timerFill = document.createElement("div");
    timerFill.style.height="100%";
    timerFill.style.width="100%";
    timerFill.style.background="#a35e31";
    timerFill.style.borderRadius="4px";
    timebar.appendChild(timerFill);

    // Dodaj okno do body
    document.body.appendChild(minigameDiv);

    // Mechanika gry
    let currentStage = 0;
    let completed = false;
    const timeLimit = 3000; // 3 sekundy

    function checkSelection(selectedKey) {
        if (completed) return;
        if (selectedKey === combo[currentStage].key) {
            currentStage++;
            if (currentStage === combo.length) {
                completed = true;
                closeMinigameBarista();
                setTimeout(()=>this.completeMinigame(gameId, true), 150);
            }
        } else {
            completed = true;
            closeMinigameBarista();
            setTimeout(()=>this.completeMinigame(gameId, false), 150);
        }
    }

    // Pasek czasu animacja
    let start = Date.now();
    const tick = ()=>{
        if (completed) return;
        const elapsed = Date.now() - start;
        const frac = Math.max(0, 1 - elapsed/timeLimit);
        timerFill.style.width=(frac*100).toFixed(1)+"%";
        if (frac > 0) {
            requestAnimationFrame(tick);
        } else if (!completed) {
            completed = true;
            closeMinigameBarista();
            setTimeout(()=>this.completeMinigame(gameId, false), 120);
        }
    };
    tick();

    // Czyszczenie okna po zakończeniu
    function closeMinigameBarista() {
        if (minigameDiv && minigameDiv.parentNode)
            minigameDiv.parentNode.removeChild(minigameDiv);
    }
}
startCorporateMerger(gameId) {
    const gameData = this.minigameData[gameId];
    Object.entries(gameData.cost).forEach(([resource, amount]) => {
        this.resources[resource] -= amount;
    });

    // PYTANIA I ODPOWIEDZI
    const questions = [
        {
            q: "Jaka strategia na starcie?",
            answers: [
                { text: "Agresywna",      score: 2, risk: 2 },
                { text: "Umiarkowana",    score: 1, risk: 1 },
                { text: "Ostrożna",       score: 0, risk: 0 }
            ]
        },
        {
            q: "Jak reagujesz na kontrpropozycję?",
            answers: [
                { text: "Zgoda",            score: 1, risk: 0 },
                { text: "Twardo negocjuję", score: 2, risk: 2 },
                { text: "Ustępuję",         score: 0, risk: 1 }
            ]
        },
        {
            q: "Kogo wybierasz jako głównego prawnika?",
            answers: [
                { text: "Zewnętrzny ekspert",   score: 2, risk: 2 },
                { text: "Dział wewnętrzny",     score: 1, risk: 1 },
                { text: "Kolega z polecenia",   score: 0, risk: 0 }
            ]
        }
    ];

    let current = 0;
    let totalScore = 0;
    let totalRisk = 0;
    let completed = false;
    let timePerQ = 2000; // ms na wybór

    // Utwórz quiz popup
    let div = document.getElementById("minigame-merger");
    if (div) div.remove();
    div = document.createElement("div");
    div.id = "minigame-merger";
    div.style.cssText = "position:fixed;top:24%;left:50%;transform:translateX(-50%);background:#fff;padding:26px 24px 20px 24px;border:2px solid #1c3481;border-radius:24px;z-index:10001;box-shadow:0 8px 32px #333a;text-align:center;min-width:300px;";
    document.body.appendChild(div);

    const headline = document.createElement("h2");
    headline.innerText = "🤝 Negocjacje Fuzji";
    div.appendChild(headline);

    const qBox = document.createElement("div");
    qBox.setAttribute("id","merger-qbox");
    qBox.style.marginBottom = "22px";
    qBox.style.fontSize = "19px";
    qBox.style.fontWeight = "bold";
    div.appendChild(qBox);

    const btnBox = document.createElement("div");
    btnBox.style.display = "flex";
    btnBox.style.justifyContent = "center";
    btnBox.style.gap = "16px";
    div.appendChild(btnBox);

    let timerTimeout = null;

    const showQuestion = () => {
        qBox.innerText = questions[current].q;
        btnBox.innerHTML = "";
        questions[current].answers.forEach((ans, i) => {
            let btn = document.createElement("button");
            btn.innerText = ans.text;
            btn.style.marginBottom = "0";
            btn.style.fontSize = "16px";
            btn.style.padding = "5px 17px";
            btn.style.border = "2px solid #2852b3";
            btn.style.borderRadius = "8px";
            btn.style.background = "#eef2fa";
            btn.style.cursor = "pointer";
            btn.onclick = () => {
                pickAnswer(ans);
            };
            btnBox.appendChild(btn);
        });

        // limit czasu na wybór…
        timerTimeout = setTimeout(()=>{
            if (!completed) pickAnswer({ score: 0, risk: 2 }); // automatycznie najgorszy wynik/brak decyzji
        }, timePerQ);
    };

    const pickAnswer = (ans) => {
        if (completed) return;
        totalScore += ans.score;
        totalRisk += ans.risk;
        current++;
        clearTimeout(timerTimeout);
        if (current < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        completed = true;
        setTimeout(()=> {
            if (div && div.parentNode) div.parentNode.removeChild(div);
            let SUCCESS = (totalScore>=4 && totalRisk<=3);
            this.completeMinigame(gameId, SUCCESS);
        }, 600);
    };

    showQuestion();
}
startGovernmentLobbying(gameId) {
    const gameData = this.minigameData[gameId];
    Object.entries(gameData.cost).forEach(([resource, amount]) => {
        this.resources[resource] -= amount;
    });

    // KONTENER POPUP
    let div = document.getElementById("minigame-lobby");
    if (div) div.remove();
    div = document.createElement("div");
    div.id = "minigame-lobby";
    div.style.cssText = "position:fixed;top:18%;left:50%;transform:translateX(-50%);background:#fcfaf7;padding:28px 22px 26px 22px;border:2px solid #888c28;border-radius:28px;z-index:10001;min-width:420px;text-align:center;box-shadow:0 8px 32px #896c";

    // Nagłówek i instrukcja
    div.innerHTML = `<h2 style="margin-bottom:10px">🕵️‍♂️ Lobby Cleanup</h2><div style="margin-bottom:6px;font-weight:bold;font-size:17px">Kliknij wszystkie dowody zanim nadejdzie inspekcja!</div>`;

    // Plansza dowodów
    const field = document.createElement("div");
    field.style.position = "relative";
    field.style.width = "350px";
    field.style.height = "180px";
    field.style.margin = "20px auto 12px auto";
    field.style.background = "#fafad2";
    field.style.border = "2px solid #bdbd7b";
    field.style.borderRadius = "18px";
    field.style.overflow = "hidden";
    div.appendChild(field);

    // Liczba dowodów i fałszywych tropów
    const N = 7 + Math.floor(Math.random()*3);  // 7-9 dowodów
    const F = 2 + Math.floor(Math.random()*2);  // 2-3 fałszywe tropy
    let leftToClick = N;
    let falseTraps = 0;

    // Wstawianie dowodów (do kliknięcia)
    for(let i=0; i<N; i++){
        const ev = document.createElement("button");
        ev.classList.add("lobby-proof");
        ev.setAttribute("type","button");
        ev.innerText = "📄";
        ev.title = "Dowód";
        ev.style.position="absolute";
        ev.style.top = Math.random()*140+20+"px";
        ev.style.left = Math.random()*260+30+"px";
        ev.style.width = "38px";
        ev.style.height = "38px";
        ev.style.fontSize="24px";
        ev.style.border="2px solid #627616";
        ev.style.background="#fff";
        ev.style.borderRadius="50%";
        ev.style.cursor="pointer";
        ev.onclick = ()=>{
            ev.style.visibility="hidden";
            leftToClick--;
            if (leftToClick===0 && !completed){
                completed = true;
                closeMinigameLobby();
                setTimeout(()=>this.completeMinigame(gameId, true), 140);
            }
        };
        field.appendChild(ev);
    }

    // Fałszywe tropy (nie klikaj w nie!)
    for(let i=0; i<F; i++){
        const fake = document.createElement("button");
        fake.classList.add("lobby-fake");
        fake.setAttribute("type","button");
        fake.innerText = "📁";
        fake.title = "Fałszywy trop";
        fake.style.position="absolute";
        fake.style.top = Math.random()*140+20+"px";
        fake.style.left = Math.random()*260+30+"px";
        fake.style.width = "38px";
        fake.style.height = "38px";
        fake.style.fontSize="24px";
        fake.style.border="2px solid #8e6253";
        fake.style.background="#eee";
        fake.style.borderRadius="50%";
        fake.style.cursor="pointer";
        fake.onclick = ()=>{
            fake.style.background="#fda";
            falseTraps++;
            // Kliknięcie fałszywego tropu podnosi ryzyko - porażka jeśli więcej niż jeden!
            if (falseTraps>=2 && !completed){
                completed = true;
                closeMinigameLobby();
                setTimeout(()=>this.completeMinigame(gameId, false), 120);
            }
        };
        field.appendChild(fake);
    }

    // Pasek czasu (inspekcja nadchodzi!)
    const timebar = document.createElement("div");
    timebar.style.height = "11px";
    timebar.style.width = "300px";
    timebar.style.background="#eee";
    timebar.style.margin="12px auto 0 auto";
    timebar.style.borderRadius="8px";
    div.appendChild(timebar);

    const timerFill = document.createElement("div");
    timerFill.style.height="100%";
    timerFill.style.width="100%";
    timerFill.style.background="#b8ba46";
    timerFill.style.borderRadius="8px";
    timebar.appendChild(timerFill);

    document.body.appendChild(div);

    let completed = false;
    const totalTime = 6000; // 6 sekund na ukończenie

    // Animacja paska czasu
    let start = Date.now();
    const tick = ()=>{
        if (completed) return;
        const elapsed = Date.now() - start;
        const frac = Math.max(0, 1 - elapsed/totalTime);
        timerFill.style.width=(frac*100).toFixed(1)+"%";
        if (frac > 0){
            requestAnimationFrame(tick);
        } else if (!completed){
            completed = true;
            closeMinigameLobby();
            setTimeout(()=>{
                // Jeśli zostały dowody – porażka!
                this.completeMinigame(gameId, false);
            }, 130);
        }
    };
    tick();

    function closeMinigameLobby(){
        if(div && div.parentNode) div.parentNode.removeChild(div);
    }
}
startGlobalSummit(gameId) {
    const gameData = this.minigameData[gameId];
    Object.entries(gameData.cost).forEach(([resource, amount]) => {
        this.resources[resource] -= amount;
    });

    // SYMULACJA IKON KONTAKTÓW (flagi & czarne owce)
    const contacts = [
        {label:"🇺🇸", good:true},
        {label:"🇯🇵", good:true},
        {label:"🇩🇪", good:true},
        {label:"🇨🇭", good:true},
        {label:"🇫🇷", good:true},
        {label:"🇨🇳", good:true},
        {label:"🇬🇧", good:true},
        {label:"🇮🇳", good:true},
        {label:"💼", good:true},
        {label:"👔", good:true},
        {label:"🦹‍♂️", good:false},
        {label:"💣", good:false},
        {label:"👹", good:false},
        {label:"🐀", good:false}
    ];

    let summitDiv = document.getElementById("minigame-summit");
    if (summitDiv) summitDiv.remove();
    summitDiv = document.createElement("div");
    summitDiv.id = "minigame-summit";
    summitDiv.style.cssText = "position:fixed;top:16%;left:50%;transform:translateX(-50%);background:#fafcfe;padding:28px 28px 22px 28px;border:2px solid #3585d1;border-radius:30px;z-index:10001;min-width:460px;text-align:center;box-shadow:0 8px 32px #22447c";

    // Nagłówek
    summitDiv.innerHTML = `<h2 style="margin-bottom:10px">🌏 Globalny Szczyt</h2>
        <div style="margin-bottom:7px;font-weight:bold;font-size:17px">
        Klikaj pojawiających się przedstawicieli, by zdobyć kontakty.<br>
        Unikaj czarnych owiec – groźba skandalu!
        </div>`;

    // Plansza networkingowa
    const netField = document.createElement("div");
    netField.style.position = "relative";
    netField.style.width = "390px";
    netField.style.height = "210px";
    netField.style.margin = "16px auto 8px auto";
    netField.style.background = "#e8f0fa";
    netField.style.border = "2px solid #77b0e7";
    netField.style.borderRadius = "22px";
    netField.style.overflow = "hidden";
    summitDiv.appendChild(netField);

    // Pasek czasu
    const timebar = document.createElement("div");
    timebar.style.height = "13px";
    timebar.style.width = "340px";
    timebar.style.background="#eee";
    timebar.style.margin="10px auto 0 auto";
    timebar.style.borderRadius="8px";
    summitDiv.appendChild(timebar);

    const timerFill = document.createElement("div");
    timerFill.style.height="100%";
    timerFill.style.width="100%";
    timerFill.style.background="#218acc";
    timerFill.style.borderRadius="8px";
    timebar.appendChild(timerFill);

    document.body.appendChild(summitDiv);

    // Rozgrywka
    let score = 0, fails = 0, totalSpawn = 14, activeIcons = [], completed = false;
    const totalTime = 9000; // 9 sekund
    let start = Date.now();

    // Dynamiczne pojawianie kontaktów
    function spawnContact() {
        if (completed) return;
        if (activeIcons.length >= 5) return; // max naraz

        const contact = contacts[Math.floor(Math.random()*contacts.length)];
        const btn = document.createElement("button");
        btn.innerText = contact.label;
        btn.style.position="absolute";
        btn.style.top = Math.random()*160+18+"px";
        btn.style.left = Math.random()*310+25+"px";
        btn.style.width = "44px";
        btn.style.height = "44px";
        btn.style.fontSize="27px";
        btn.style.border = contact.good ? "2px solid #348c55" : "2px solid #c42a2a";
        btn.style.background = "#fff";
        btn.style.borderRadius="50%";
        btn.style.cursor="pointer";
        btn.style.transition="opacity 0.18s";
        btn.onclick = () => {
            btn.style.opacity="0";
            setTimeout(()=>{if(btn.parentNode)btn.parentNode.removeChild(btn);},120);
            if(contact.good){ score++; }
            else { fails++; }
            activeIcons = activeIcons.filter(x=>x!==btn);
        };
        netField.appendChild(btn);
        activeIcons.push(btn);
        setTimeout(()=>{
            if(!completed && btn.parentNode){
                btn.style.opacity="0";
                btn.parentNode.removeChild(btn);
                activeIcons = activeIcons.filter(x=>x!==btn);
            }
        }, 1250+Math.random()*350); // Szybkie znikanie
    }

    // Co 0.5 sekundy próba wstawienia kontaktów
    let spawns = 0;
    let spawnInterval = setInterval(() => {
        if (completed || spawns >= totalSpawn){
            clearInterval(spawnInterval);
            return;
        }
        spawnContact();
        spawns++;
    }, 480);

    // Pasek czasu
    function tick() {
        if (completed) return;
        const elapsed = Date.now() - start;
        const frac = Math.max(0, 1 - elapsed/totalTime);
        timerFill.style.width=(frac*100).toFixed(1)+"%";
        if (frac > 0) {
            requestAnimationFrame(tick);
        } else if (!completed) {
            completed = true;
            closeSummit();
            // Sukces: min. 8 kontaktów, max 2 błędy
            const WIN = (score >= 8 && fails <= 2);
            setTimeout(()=>this.completeMinigame(gameId, WIN), 160);
        }
    }
    tick();

    // Zamknij planszę
    function closeSummit(){
        if(summitDiv && summitDiv.parentNode)
            summitDiv.parentNode.removeChild(summitDiv);
    }
}

            completeMinigame(gameId, success) {
                const gameData = this.minigameData[gameId];
                const rewards = success ? gameData.rewards.success : gameData.rewards.failure;

                if (success) {
                    this.showNotification(`🎉 ${gameData.name} - SUKCES!`, 'success');

                    Object.entries(rewards).forEach(([reward, value]) => {
                        this.applyMinigameReward(reward, value);
                    });

                } else {
                    this.showNotification(`😞 ${gameData.name} - PORAŻKA!`, 'error');

                    Object.entries(rewards).forEach(([penalty, value]) => {
                        this.applyMinigamePenalty(penalty, value);
                    });
                }

                // Set cooldown
                this.gameState.minigameCooldowns[gameId] = Date.now();

                this.updateResourceBar();
            }

            applyMinigameReward(reward, value) {
                switch(reward) {
                    case 'budget':
                    case 'documents':
                    case 'coffee':
                    case 'prestige':
                    case 'usd':
                    case 'eur':
                    case 'jpy':
                    case 'cny':
                    case 'freight':
                        this.resources[reward] += value;
                        break;
                    case 'global_expansion_bonus':
                        this.gameState.activeEffects.globalExpansionBonus = value;
                        break;
                    case 'softcap_increase':
                        Object.keys(this.softcapThresholds).forEach(resource => {
                            this.softcapThresholds[resource] = this.softcapThresholds[resource].map(t => t * (1 + value));
                        });
                        break;
                }
				this.updateResourceBar();
            }

            applyMinigamePenalty(penalty, value) {
                switch(penalty) {
                    case 'budget_loss_percent':
                        this.resources.budget *= (1 - value);
                        break;
                    case 'stress':
                        this.resources.stress += value;
                        break;
                    case 'motivation':
                        this.resources.motivation += value;
                        break;
                    case 'reputation_loss':
                        this.resources.prestige = Math.max(0, this.resources.prestige - value * 10);
                        break;
                }
				this.updateResourceBar();
            }
			/* =============================================
               VICTORY Conditions
               ============================================= */

			checkWinCondition() {
				// Warunek: wszystkie regiony odblokowane i lvl >= 5
				const allRegions = Object.values(this.regions);
				const allUnlocked = allRegions.every(region => region.unlocked);
				const allHighLevel = allRegions.every(region => region.unlocked && region.level >= 5);

				if (allUnlocked && allHighLevel) {
					this.showVictoryModal();
					this.isGameWon = true; // Dodaj w konstruktorze this.isGameWon = false;
				}
			}
			showVictoryModal() {
				showCustomModal("Gratulacje! Zdominowałeś świat globalnego rynku!\n√ Wszystkie regiony 5+ lvl\n√ Pełny sukces!\nSpecjalna minigra odblokowana ✈️🌎");
				// Tu możesz też przełączyć na endgame/minigrę, nagrody prestige itp.
			}
            /* =============================================
               EVENT HANDLERS
               ============================================= */

            setupEventHandlers() {
                // Main click button
                const mainButton = document.getElementById('main-click-button');
                if (mainButton) {
                    mainButton.addEventListener('click', () => this.performMainClick());
                }

                // Control buttons
                const saveButton = document.getElementById('save-game');
                const resetButton = document.getElementById('reset-game');
                const exportButton = document.getElementById('export-data');

                if (saveButton) saveButton.addEventListener('click', () => this.saveGame());
                if (resetButton) resetButton.addEventListener('click', () => this.resetGame());
                if (exportButton) exportButton.addEventListener('click', () => this.exportData());
				
				const importButton = document.getElementById('import-data');
				const importFileInput = document.getElementById('import-file');

				if (importButton) importButton.addEventListener('click', () => {
				  importFileInput.click();
				});

				if (importFileInput) importFileInput.addEventListener('change', (event) => {
				  const file = event.target.files[0];
				  if (!file) return;
				  const reader = new FileReader();
				  reader.onload = (e) => {
					try {
					  const importedData = JSON.parse(e.target.result);
					  this.loadGame(importedData); // lub Twoja metoda ładowania gry
					  this.showNotification('Dane zaimportowane!', 'success');
					} catch (err) {
					  this.showNotification('Błąd importu!', 'error');
					}
				  };
				  reader.readAsText(file);
				});
                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !document.activeElement.tagName.match(/INPUT|TEXTAREA/)) {
                        e.preventDefault();
                        this.performMainClick();
                    }

                    // Tab navigation
                    if (e.key >= '1' && e.key <= '6' && e.ctrlKey) {
                        e.preventDefault();
                        const tabs = ['overview', 'human-capital', 'global-markets', 'trade', 'automation', 'minigames'];
                        const tabIndex = parseInt(e.key) - 1;
                        if (tabs[tabIndex]) {
                            switchTab(tabs[tabIndex]);
                        }
                    }
                });

                console.log('✅ Event handlers attached for Phase 4.3');
            }

            /* =============================================
               SAVE/LOAD SYSTEM - Enhanced for Global Data
               ============================================= */

            saveGame() {
                try {
                    const saveData = {
                        version: this.version,
                        resources: this.resources,
                        departments: this.departments,
                        regions: this.regions,
                        fxRates: this.fxRates,
                        automation: this.automation,
                        gameState: this.gameState,
                        timestamp: Date.now(),
						achievements: this.achievements,
						achievementBonuses: this.achievementBonuses,
						gameState: this.gameState  // Make sure this includes all new properties
                    };

                    localStorage.setItem('corpoclicker_phase43_save', JSON.stringify(saveData));
                    this.showNotification('💾 Gra zapisana pomyślnie!', 'success');
                } catch (error) {
                    this.showNotification('❌ Błąd podczas zapisu!', 'error');
                    console.error('Save failed:', error);
                }
            }

            loadGame() {
                try {
                    let saved = localStorage.getItem('corpoclicker_phase43_save');

                    // Backwards compatibility
                    if (!saved) {
                        saved = localStorage.getItem('corpoclicker_phase422_save') ||
                                localStorage.getItem('corpoclicker_phase421_save') ||
                                localStorage.getItem('corpoclicker_phase42_save');
                    }

                    if (saved) {
                        const saveData = JSON.parse(saved);

                        // Migrate resources
                        this.resources = { ...this.resources, ...saveData.resources };
                        this.departments = { ...this.departments, ...saveData.departments };

                        // New data (might not exist in older saves)
                        if (saveData.regions) {
                            this.regions = { ...this.regions, ...saveData.regions };
                        }
                        if (saveData.fxRates) {
                            this.fxRates = { ...this.fxRates, ...saveData.fxRates };
                        }
                        if (saveData.automation) {
                            this.automation = { ...this.automation, ...saveData.automation };
                        }
                        if (saveData.gameState) {
                            this.gameState = { ...this.gameState, ...saveData.gameState };
                        }

                        console.log('📁 Phase 4.4 game loaded successfully');
                        return true;
                    }

                } catch (error) {
                    console.error('Load failed:', error);
                }
                return false;
				                    if (saveData.achievements) this.achievements = saveData.achievements;
					if (saveData.achievementBonuses) this.achievementBonuses = saveData.achievementBonuses;
            }

            resetGame() {
                if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone!')) {
                    ['corpoclicker_phase43_save', 'corpoclicker_phase422_save', 'corpoclicker_phase421_save', 'corpoclicker_phase42_save'].forEach(key => {
                        localStorage.removeItem(key);
                    });
                    this.showNotification('Gra zostanie zresetowana za 3 sekundy...', 'warning', 3000);
                    setTimeout(() => window.location.reload(), 3000);
                }
            }

            exportData() {
                try {
                    const exportData = {
                        version: this.version,
                        resources: this.resources,
                        departments: this.departments,
                        regions: this.regions,
                        fxRates: this.fxRates,
                        automation: this.automation,
                        gameState: this.gameState,
                        exportTime: new Date().toISOString()
                    };

                    const dataStr = JSON.stringify(exportData, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});

                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(dataBlob);
                    link.download = `corpoclicker_phase43_${Date.now()}.json`;
                    link.click();

                    this.showNotification('📤 Dane wyeksportowane!', 'success');
                } catch (error) {
                    this.showNotification('❌ Błąd podczas eksportu!', 'error');
                }
            }

            /* =============================================
               INITIALIZATION
               ============================================= */

            init() {
                console.log('🔧 Initializing Phase 4.4 systems...');

                // Load saved game
                this.loadGame();

                // Setup event handlers
                this.setupEventHandlers();

                // Start game loop
                setInterval(() => this.gameLoop(), 100);

                // Initialize displays
                this.updateDisplay();

                console.log('✅ CorpoClicker Phase 4.4 - Corporate Empire initialized!');

                // Welcome message
        
                    showCustomModal('🌍 Witaj w grze korposzczur!', 'Zacznijmy grę!');
                
            }
        }

        // Global functions for UI interactions
        const SUFFIXES = [
			"", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
			"De", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod"
		];

		function formatStandard(num) {
			if (Math.abs(num) < 1e3) return Math.floor(num).toString();
			let tier = Math.log10(Math.abs(num)) / 3 | 0;
			if (tier === 0) return Math.floor(num).toString();
			let suffix = SUFFIXES[tier];
			let scale = Math.pow(10, tier * 3);
			return (num / scale).toFixed(2) + " " + suffix;
		}

		function formatScientific(num) {
			if (Math.abs(num) < 1e6) return Math.floor(num).toString();
			let exp = Math.floor(Math.log10(Math.abs(num)));
			let mantissa = num / Math.pow(10, exp);
			if (exp < 100_000) {
				return mantissa.toFixed(3) + "e" + exp;
			}
			if (exp < 1_000_000_000) {
				return "e" + exp;
			}
			// Skróć jeszcze bardziej, np. "e9B"
			let shortExp = formatStandard(exp);
			return "e" + shortExp;
		}

		function formatEngineering(num) {
			if (Math.abs(num) < 1e3) return Math.floor(num).toString();
			let exp = Math.floor(Math.log10(Math.abs(num)) / 3) * 3;
			let mantissa = num / Math.pow(10, exp);
			return mantissa.toFixed(3) + "e" + exp;
		}
		
		
		function switchTab(tabName) {
            if (window.game) {
                window.game.switchTab(tabName);
            }
        }

        function toggleMasterAutomation() {
            if (window.game) {
                window.game.toggleMasterAutomation();
            }
        }

        function toggleDepartmentAI() {
            if (window.game) {
                window.game.automation.departmentAI.active = !window.game.automation.departmentAI.active;
                window.game.updateAutomationTab();
                const button = event.target;
                button.textContent = window.game.automation.departmentAI.active ? 'Aktywny' : 'Nieaktywny';
                button.classList.toggle('active', window.game.automation.departmentAI.active);
            }
        }

        function toggleTradeBot() {
            if (window.game) {
                window.game.automation.tradeBot.active = !window.game.automation.tradeBot.active;
                window.game.updateAutomationTab();
                const button = event.target;
                button.textContent = window.game.automation.tradeBot.active ? 'Aktywny' : 'Nieaktywny';
                button.classList.toggle('active', window.game.automation.tradeBot.active);
            }
        }

        function toggleExpansionAI() {
            if (window.game) {
                window.game.automation.expansionAI.active = !window.game.automation.expansionAI.active;
                window.game.updateAutomationTab();
                const button = event.target;
                button.textContent = window.game.automation.expansionAI.active ? 'Aktywny' : 'Nieaktywny';
                button.classList.toggle('active', window.game.automation.expansionAI.active);
            }
        }

        function openTradeDialog(from, to) {
            if (window.game) {
                window.game.openTradeDialog(from, to);
            }
        }

        function saveGame() {
            if (window.game) {
                window.game.saveGame();
            }
        }

        function resetGame() {
            if (window.game) {
                window.game.resetGame();
            }
        }

        function exportData() {
            if (window.game) {
                window.game.exportData();
            }
        }
        function toggleResourceBarExtra() {
			const extra = document.querySelector('.resource-bar-extra');
			if (!extra) return;
			extra.style.display = (extra.style.display === "none" || !extra.style.display) ? "grid" : "none";
		}
		// UI Functions for Achievement System
            function showCustomModal(message, btnLabel = "OK") {
			  // Tworzy modal HTML jeśli nie istnieje
			  let modal = document.getElementById('custom-modal');
			  if (!modal) {
				modal = document.createElement('div');
				modal.id = 'custom-modal';
				modal.innerHTML = `
				  <div class="modal-overlay"></div>
				  <div class="modal-box">
					<div class="modal-message" id="modal-message"></div>
					<button id="modal-ok" class="modal-btn">${btnLabel}</button>
				  </div>
				`;
				document.body.appendChild(modal);
				document.getElementById('modal-ok').onclick = closeCustomModal;
			  }
			  document.getElementById('modal-message').innerText = message;
			  modal.style.display = "flex";
			}

			function closeCustomModal() {
			  let modal = document.getElementById('custom-modal');
			  if (modal) modal.style.display = "none";
			}

function openAchievementPanel() {
    const panel = document.getElementById('achievement-panel');
    if (panel) {
        panel.classList.add('show');
        updateAchievementDisplay();
    }
}

function closeAchievementPanel() {
    const panel = document.getElementById('achievement-panel');
    if (panel) {
        panel.classList.remove('show');
    }
}

function updateAchievementDisplay() {
    const grid = document.getElementById('achievement-grid');
    const summary = document.getElementById('achievement-summary');
    const progressText = document.getElementById('achievement-progress-text');

    if (!grid || !window.game) return;

    const unlockedCount = Object.values(window.game.achievements || {}).filter(a => a.unlocked).length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;
    const percentage = Math.round((unlockedCount / totalCount) * 100);

    // Update summary text
    if (summary) {
        summary.textContent = `Postęp: ${unlockedCount} z ${totalCount} osiągnięć (${percentage}%)`;
    }

    if (progressText) {
        progressText.textContent = `Osiągnięcia: ${unlockedCount}/${totalCount} (${percentage}%)`;
    }

    // Clear and rebuild grid
    grid.innerHTML = '';

    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

    Object.values(ACHIEVEMENTS).forEach(achievement => {
        const gameAchievement = window.game.achievements?.[achievement.id] || achievement;

        // Apply filter
        if (activeFilter !== 'all') {
            if (activeFilter === 'unlocked' && !gameAchievement.unlocked) return;
            if (activeFilter !== 'unlocked' && achievement.tier !== activeFilter) return;
        }

        const item = createAchievementItem(achievement, gameAchievement);
        grid.appendChild(item);
    });

    // Setup filter buttons
    setupFilterButtons();
}

function createAchievementItem(achievement, gameAchievement) {
    const item = document.createElement('div');
    item.className = `achievement-item ${gameAchievement.unlocked ? 'unlocked' : 'locked'}`;

    const rewardText = achievement.reward
        ? `<div class="achievement-reward">Nagroda: ${getRewardDescription(achievement.reward)}</div>`
        : `<div class="achievement-no-reward">Brak nagrody</div>`;

    const progressBar = getProgressBar(achievement, gameAchievement);

    item.innerHTML = `
        <div class="achievement-unlock-indicator">
            ${gameAchievement.unlocked ? '✓' : '✗'}
        </div>
        <div class="achievement-item-header">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <span class="achievement-tier tier-${achievement.tier}">${achievement.tier}</span>
            </div>
        </div>
        <div class="achievement-description">${achievement.description}</div>
        ${rewardText}
        ${progressBar}
    `;

    return item;
}

function getRewardDescription(reward) {
    switch (reward.type) {
        case 'production_bonus':
            return `+${Math.round((reward.multiplier - 1) * 100)}% produkcji ${reward.resource}`;
        case 'cost_reduction':
            return `${Math.round((1 - reward.multiplier) * 100)}% taniej działy`;
        case 'click_power':
            return `+${Math.round((reward.multiplier - 1) * 100)}% siła kliknięć`;
        case 'coffee_efficiency':
            return `+${Math.round((reward.multiplier - 1) * 100)}% efektywność kawy`;
        case 'global_expansion_bonus':
            return `+${Math.round((reward.multiplier - 1) * 100)}% bonus ekspansji`;
        default:
            return 'Specjalny bonus';
    }
}

function calculateHumanCapitalEffects(stress, motivation) {
  let production = 1.0;
  let quality = 1.0;

  if (stress < 25) {
    production = 1.0;
    quality = 1.0;
  } else if (stress < 50) {
    production = 0.95;
    quality = 0.9;
  } else if (stress < 75) {
    production = 0.85;
    quality = 0.75;
  } else if (stress < 100) {
    production = 0.7;
    quality = 0.5;
  } else {
    production = Math.max(0.05, 1.0 - (stress - 100) * 0.01);
    quality = Math.max(0.01, 1.0 - (stress - 100) * 0.015);
  }

  let productionBonus = 0;
  if (motivation < 25) productionBonus = -0.25;
  else if (motivation < 50) productionBonus = 0;
  else if (motivation < 75) productionBonus = 0.15;
  else productionBonus = 0.3;

  return {
    production: production + productionBonus,
    quality: quality + productionBonus / 2,
  }
}


function getProgressBar(achievement, gameAchievement) {
    if (gameAchievement.unlocked) return '';

    const progress = calculateAchievementProgress(achievement);
    if (progress === null) return '';

    const percentage = Math.min(100, Math.round(progress * 100));

    return `
        <div class="achievement-progress-bar">
            <div class="achievement-progress-fill" style="width: ${percentage}%"></div>
        </div>
    `;
}
function updateRegionListClean() {
  const regionKeys = ['europe', 'americas', 'asia', 'africa'];
  const regionNames = {
    europe: "Europa",
    americas: "Ameryki",
    asia: "Azja",
    africa: "Afryka"
  };
  const regionFlags = {
    europe: "🇪🇺",
    americas: "🌎",
    asia: "🌏",
    africa: "🌍"
  };
  let html = '';
  regionKeys.forEach(key => {
    const region = this.regions[key];
    html += `
      <div class="region-row ${region.unlocked ? 'unlocked' : 'locked'}"
        title="${regionNames[key]} – bonus: +20% za aktywny ${getDepartmentName(region.keyDepartment)}">
        <span class="region-flag">${regionFlags[key]}</span>
        <span class="region-name">${regionNames[key]}</span>
        <span class="region-info">
          lv.${region.unlocked ? region.level : '?'}${region.unlocked ? '' : ' (zablok.)'}
        </span>
      </div>
    `;
  });
  document.querySelector('.region-list-clean').innerHTML = html;
}
function calculateAchievementProgress(achievement) {
    if (!window.game) return null;

    const req = achievement.requirement;
    const game = window.game;

    switch (req.type) {
        case 'click_count':
            return Math.min(1, (game.gameState?.totalClicks || 0) / req.value);
        case 'resource_max':
            return Math.min(1, (game.resources?.[req.resource] || 0) / req.value);
        case 'department_hired':
            return Math.min(1, (game.departments?.[req.department]?.owned || 0) / req.value);
        case 'coffee_breaks':
            return Math.min(1, (game.gameState?.coffeeBreaks || 0) / req.value);
        case 'stress_peak':
            return Math.min(1, (game.gameState?.maxStress || 0) / req.value);
        case 'motivation_peak':
            return Math.min(1, (game.gameState?.maxMotivation || 0) / req.value);
        default:
            return null;
    }
}
let coffeeMultiplier = 1;

// Przywołaj tę funkcję w onclick batch-przycisków
function setCoffeeMultiplier(multi){
    coffeeMultiplier = multi;
    document.getElementById("coffee-multiplier-label").innerText = multi + "x";
    // Aktualizuj tooltip i tekst
    document.getElementById("coffee-amount").innerText = 50 * coffeeMultiplier;
    document.getElementById("stress-amount").innerText = -20 * coffeeMultiplier;
    document.getElementById("motivation-amount").innerText = "+" + (10 * coffeeMultiplier);
    document.getElementById("coffee-amount2").innerText = 50 * coffeeMultiplier;
    document.getElementById("stress-amount2").innerText = -20 * coffeeMultiplier;
    document.getElementById("motivation-amount2").innerText = "+" + (10 * coffeeMultiplier);
}

// Ustaw domyślne wartości przy ładowaniu
setCoffeeMultiplier(1);

document.getElementById("coffee-break-btn").onclick = function(){
    game.coffeeBreakBatch(coffeeMultiplier);
};
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            updateAchievementDisplay();
        });
    });
}
// utility:
function getCurrencySymbol(currency) {
  switch(currency) {
    case 'EUR': return '€';
    case 'USD': return '$';
    case 'JPY': return '¥';
    case 'ZAR': return 'R';
    // inne wg potrzeb
    default: return '';
  }
}
function getRegionFlag(key) {
  switch(key) {
    case 'europe': return '🇪🇺';
    case 'americas': return '🌎';
    case 'asia': return '🌏';
    case 'africa': return '🌍';
    case 'middle-east': return '🕌';
    default: return '';
  }
}
function getRegionName(key) {
  switch(key) {
    case 'europe': return 'Europa';
    case 'americas': return 'Ameryka';
    case 'asia': return 'Azja-Pacyfik';
    case 'africa': return 'Afryka';
    case 'middle-east': return 'Bliski Wschód';
    default: return '';
  }
}
function getRegionFlag(key) {
    switch(key) {
      case 'europe': return '🇪🇺';
      case 'americas': return '🌎';
      case 'asia': return '🌏';
      case 'africa': return '🌍';
      case 'middle-east': return '🕌';
      default: return '';
    }
}
function getDepartmentName(key) {
   switch(key){
    case 'marketing': return 'Marketing';
    case 'legal': return 'Prawny';
    case 'trade': return 'Handlu';
    case 'rnd': return 'R&D';
    default: return key;
  }
}
function closeCoffeePopup() {
  document.getElementById('coffee-popup').classList.add('hidden');
}

function updateCleanGlobalPresenceList() {
  let html = '';
  // powyższy blok możesz generować z pętli po kluczach
  // lub bezpośrednio - jak wyżej, jeśli regionów niewiele i mają stałe bonusy
  document.querySelector('.region-list-clean').innerHTML = html;
}
function showAchievementNotification(achievement) {
    const container = document.getElementById('achievement-notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = 'achievement-notification';

    notification.innerHTML = `
        <div class="achievement-notification-icon">${achievement.icon}</div>
        <div class="achievement-notification-content">
            <div class="achievement-notification-title">Osiągnięcie odblokowane!</div>
            <div class="achievement-notification-desc">${achievement.name}</div>
        </div>
    `;

    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'achievement-notification-in 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}
document.addEventListener('click', (e) => {
    const panel = document.getElementById('achievement-panel');
    const indicator = document.getElementById('achievement-progress-indicator');

    if (panel && panel.classList.contains('show') &&
        !panel.contains(e.target) &&
        !indicator.contains(e.target)) {
        closeAchievementPanel();
    }
});
        // Initialize game when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM loaded, starting Phase 4.3...');

            try {
                window.game = new CorpoClickerPhase43();
                console.log('🎯 Phase 4.4 game instance created successfully');
            } catch (error) {
                console.error('💥 Critical error during Phase 4.4 initialization:', error);
            }
        });