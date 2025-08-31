// Korposzczur - Enhanced Corporate Idle Game - Version 7
// Buildings & Departments Update
// Main game logic and state management with event-driven system

class KorposzczurGame {
    constructor() {
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.translations = this.gameData.translations;
        this.currentLanguage = this.gameState.settings.language;
        this.currentTab = 'career';
        this.multiBuyAmount = 1;
        this.autoBuyerEnabled = false;
        this.lastSave = Date.now();
        this.lastUpdate = Date.now();
        this.lastBPValue = 0;
        this.adsAvailable = false;

        // Intervals for different update loops
        this.gameLoopInterval = null;
        this.fastUIUpdateInterval = null;
        this.saveInterval = null;
        this.quoteInterval = null;
        this.autoBuyerInterval = null;

        // Event system for real-time updates
        this.eventListeners = {
            bpChange: [],
            taskUnlock: [],
            achievementUnlock: []
        };

        this.init();
    }

    initializeGameData() {
        return {
            "tasks": [
                {"id": "email", "nameKey": "task_email", "baseCost": 5, "baseIdle": 1, "unlockCost": 0, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 2000},
                {"id": "coffee", "nameKey": "task_coffee", "baseCost": 25, "baseIdle": 3, "unlockCost": 75, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1800},
                {"id": "meeting", "nameKey": "task_meeting", "baseCost": 150, "baseIdle": 12, "unlockCost": 500, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1500},
                {"id": "kpi", "nameKey": "task_kpi", "baseCost": 1500, "baseIdle": 70, "unlockCost": 3500, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1200},
                {"id": "brainstorm", "nameKey": "task_brainstorm", "baseCost": 15000, "baseIdle": 400, "unlockCost": 35000, "costMultiplier": 1.16, "idleMultiplier": 1.22, "cycleTime": 1000},
                {"id": "optimize", "nameKey": "task_optimize", "baseCost": 180000, "baseIdle": 2200, "unlockCost": 350000, "costMultiplier": 1.17, "idleMultiplier": 1.22, "cycleTime": 800},
                {"id": "lunch", "nameKey": "task_lunch", "baseCost": 500000, "baseIdle": 4000, "unlockCost": 1800000, "costMultiplier": 1.18, "idleMultiplier": 1.24, "cycleTime": 700},
                {"id": "report", "nameKey": "task_report", "baseCost": 1500000, "baseIdle": 9500, "unlockCost": 5250000, "costMultiplier": 1.19, "idleMultiplier": 1.27, "cycleTime": 600},
                {"id": "motivation", "nameKey": "task_motivation", "baseCost": 10000000, "baseIdle": 30000, "unlockCost": 37500000, "costMultiplier": 1.21, "idleMultiplier": 1.30, "cycleTime": 500}
            ],
            
            // NEW: Buildings System
            "buildings": [
                {
                    "id": "office_space",
                    "nameKey": "building_office_space", 
                    "baseCost": 1000,
                    "costMultiplier": 1.25,
                    "unlockCost": 5000,
                    "effects": {
                        "taskBoost": {"email": 1.15, "meeting": 1.10},
                        "maxFocus": 1
                    }
                },
                {
                    "id": "conference_room",
                    "nameKey": "building_conference_room",
                    "baseCost": 5000, 
                    "costMultiplier": 1.3,
                    "unlockCost": 25000,
                    "effects": {
                        "taskBoost": {"meeting": 1.25, "brainstorm": 1.20},
                        "globalMultiplier": 1.05
                    }
                },
                {
                    "id": "coffee_corner",
                    "nameKey": "building_coffee_corner",
                    "baseCost": 15000,
                    "costMultiplier": 1.28,
                    "unlockCost": 75000, 
                    "effects": {
                        "taskBoost": {"coffee": 1.30},
                        "energyRegen": 1.2,
                        "idleBonus": 1.10
                    }
                },
                {
                    "id": "analytics_lab",
                    "nameKey": "building_analytics_lab",
                    "baseCost": 100000,
                    "costMultiplier": 1.35,
                    "unlockCost": 500000,
                    "effects": {
                        "taskBoost": {"kpi": 1.40, "optimize": 1.25},
                        "upgradeDiscount": 0.95
                    }
                },
                {
                    "id": "innovation_hub",
                    "nameKey": "building_innovation_hub", 
                    "baseCost": 750000,
                    "costMultiplier": 1.4,
                    "unlockCost": 3000000,
                    "effects": {
                        "taskBoost": {"brainstorm": 1.50, "optimize": 1.35},
                        "globalMultiplier": 1.15,
                        "softSkillBonus": 1.10
                    }
                },
                {
                    "id": "executive_suite",
                    "nameKey": "building_executive_suite",
                    "baseCost": 5000000,
                    "costMultiplier": 1.45,
                    "unlockCost": 15000000,
                    "effects": {
                        "globalMultiplier": 1.25,
                        "maxFocus": 2,
                        "prestigeBonus": 1.20
                    }
                }
            ],

            // NEW: Departments System
            "departments": [
                {
                    "id": "administration", 
                    "nameKey": "dept_administration",
                    "tasks": ["email", "meeting"],
                    "synergy": {
                        "threshold": 20,
                        "bonus": 1.25
                    },
                    "unlockCost": 10000
                },
                {
                    "id": "operations",
                    "nameKey": "dept_operations", 
                    "tasks": ["coffee", "lunch", "optimize"],
                    "synergy": {
                        "threshold": 35,
                        "bonus": 1.30
                    },
                    "unlockCost": 50000
                },
                {
                    "id": "analytics",
                    "nameKey": "dept_analytics",
                    "tasks": ["kpi", "report"],
                    "synergy": {
                        "threshold": 25, 
                        "bonus": 1.35
                    },
                    "unlockCost": 100000
                },
                {
                    "id": "innovation",
                    "nameKey": "dept_innovation",
                    "tasks": ["brainstorm", "motivation"],
                    "synergy": {
                        "threshold": 30,
                        "bonus": 1.40
                    }, 
                    "unlockCost": 250000
                }
            ],

            // NEW: Enhanced Prestige Levels
            "prestigeLevels": [
                {
                    "level": 1,
                    "threshold": 50000,
                    "softSkillsBase": 1,
                    "bonus": {"type": "global_mult", "value": 1.1}
                },
                {
                    "level": 2, 
                    "threshold": 150000,
                    "softSkillsBase": 2,
                    "bonus": {"type": "task_boost", "tasks": ["email", "meeting"], "value": 1.15}
                },
                {
                    "level": 3,
                    "threshold": 400000,
                    "softSkillsBase": 3, 
                    "bonus": {"type": "building_discount", "value": 0.95}
                },
                {
                    "level": 4,
                    "threshold": 1000000,
                    "softSkillsBase": 5,
                    "bonus": {"type": "department_unlock", "value": 1}
                },
                {
                    "level": 5,
                    "threshold": 2500000,
                    "softSkillsBase": 8,
                    "bonus": {"type": "max_focus", "value": 1}
                }
            ],

            "achievements": [
                {
                    "id": "first_unlock",
                    "nameKey": "ach_first_unlock",
                    "descKey": "ach_first_unlock_desc",
                    "condition": {"type": "tasks_unlocked", "value": 1},
                    "reward": {"type": "bp_bonus", "value": 1.05},
                    "bonusDesc": "bonusDesc_bp_5"
                },
                {
                    "id": "upgrade_novice",
                    "nameKey": "ach_upgrade_novice",
                    "descKey": "ach_upgrade_novice_desc",
                    "condition": {"type": "upgrades_bought", "value": 50},
                    "reward": {"type": "multibuy_unlock", "value": "upgrades"},
                    "bonusDesc": "bonusDesc_multibuy_upgrades"
                },
                {
                    "id": "coffee_lover",
                    "nameKey": "ach_coffee_lover",
                    "descKey": "ach_coffee_lover_desc",
                    "condition": {"type": "task_unlocked", "taskId": "coffee"},
                    "reward": {"type": "idle_bonus", "value": 1.10},
                    "bonusDesc": "bonusDesc_idle_10"
                },
                {
                    "id": "meeting_master",
                    "nameKey": "ach_meeting_master",
                    "descKey": "ach_meeting_master_desc",
                    "condition": {"type": "task_level", "taskId": "meeting", "value": 15},
                    "reward": {"type": "upgrade_discount", "value": 0.95},
                    "bonusDesc": "bonusDesc_upgrade_discount_5"
                },
                {
                    "id": "first_ascend",
                    "nameKey": "ach_first_ascend",
                    "descKey": "ach_first_ascend_desc",
                    "condition": {"type": "ascensions", "value": 1},
                    "reward": {"type": "career_stats_unlock", "value": 1},
                    "bonusDesc": "bonusDesc_career_stats"
                },
                {
                    "id": "kpi_analyst",
                    "nameKey": "ach_kpi_analyst",
                    "descKey": "ach_kpi_analyst_desc",
                    "condition": {"type": "task_unlocked", "taskId": "kpi"},
                    "reward": {"type": "prestige_bonus", "value": 1.15},
                    "bonusDesc": "bonusDesc_prestige_15"
                },
                {
                    "id": "big_spender",
                    "nameKey": "ach_big_spender",
                    "descKey": "ach_big_spender_desc",
                    "condition": {"type": "bp_spent", "value": 25000},
                    "reward": {"type": "bp_bonus", "value": 1.10},
                    "bonusDesc": "bonusDesc_bp_10"
                },
                {
                    "id": "innovation_guru",
                    "nameKey": "ach_innovation_guru",
                    "descKey": "ach_innovation_guru_desc",
                    "condition": {"type": "task_unlocked", "taskId": "brainstorm"},
                    "reward": {"type": "ascend_bonus", "value": 1.20},
                    "bonusDesc": "bonusDesc_ascend_20"
                },
                {
                    "id": "first_prestige",
                    "nameKey": "ach_first_prestige",
                    "descKey": "ach_first_prestige_desc",
                    "condition": {"type": "prestiges", "value": 1},
                    "reward": {"type": "desk_unlock", "value": 1},
                    "bonusDesc": "bonusDesc_desk_unlock"
                },
                {
                    "id": "optimizer",
                    "nameKey": "ach_optimizer",
                    "descKey": "ach_optimizer_desc",
                    "condition": {"type": "task_unlocked", "taskId": "optimize"},
                    "reward": {"type": "global_mult", "value": 1.30},
                    "bonusDesc": "bonusDesc_global_30"
                },
                {
                    "id": "multibuy_expert",
                    "nameKey": "ach_multibuy_expert",
                    "descKey": "ach_multibuy_expert_desc",
                    "condition": {"type": "multibuy_used", "value": 25},
                    "reward": {"type": "max_buy_unlock", "value": 1},
                    "bonusDesc": "bonusDesc_max_buy"
                },
                {
                    "id": "corporate_ladder",
                    "nameKey": "ach_corporate_ladder",
                    "descKey": "ach_corporate_ladder_desc",
                    "condition": {"type": "total_ascensions", "value": 10},
                    "reward": {"type": "ascend_discount", "value": 0.90},
                    "bonusDesc": "bonusDesc_ascend_discount_10"
                },
                {
                    "id": "idle_master",
                    "nameKey": "ach_idle_master",
                    "descKey": "ach_idle_master_desc",
                    "condition": {"type": "idle_rate", "value": 1500},
                    "reward": {"type": "idle_bonus", "value": 1.15},
                    "bonusDesc": "bonusDesc_idle_20"
                },
                {
                    "id": "soft_skills_beginner",
                    "nameKey": "ach_soft_skills_beginner",
                    "descKey": "ach_soft_skills_beginner_desc",
                    "condition": {"type": "soft_skills_earned", "value": 1},
                    "reward": {"type": "desk_unlock", "value": 1},
                    "bonusDesc": "bonusDesc_desk_unlock"
                },
                {
                    "id": "soft_skills_expert",
                    "nameKey": "ach_soft_skills_expert",
                    "descKey": "ach_soft_skills_expert_desc",
                    "condition": {"type": "soft_skills_earned", "value": 10},
                    "reward": {"type": "prestige_bonus", "value": 1.20},
                    "bonusDesc": "bonusDesc_prestige_20"
                },
                {
                    "id": "soft_skills_master",
                    "nameKey": "ach_soft_skills_master",
                    "descKey": "ach_soft_skills_master_desc",
                    "condition": {"type": "soft_skills_earned", "value": 50},
                    "reward": {"type": "soft_skill_bonus", "value": 1.50},
                    "bonusDesc": "bonusDesc_soft_skill_50"
                },
                {
                    "id": "first_desk_item",
                    "nameKey": "ach_first_desk_item",
                    "descKey": "ach_first_desk_item_desc",
                    "condition": {"type": "desk_items_bought", "value": 1},
                    "reward": {"type": "soft_skill_bonus", "value": 1.10},
                    "bonusDesc": "bonusDesc_soft_skill_10"
                },
                {
                    "id": "office_decorator",
                    "nameKey": "ach_office_decorator",
                    "descKey": "ach_office_decorator_desc",
                    "condition": {"type": "desk_items_bought", "value": 3},
                    "reward": {"type": "desk_discount", "value": 0.90},
                    "bonusDesc": "bonusDesc_desk_discount_10"
                },
                {
                    "id": "office_complete",
                    "nameKey": "ach_office_complete",
                    "descKey": "ach_office_complete_desc",
                    "condition": {"type": "desk_items_bought", "value": 6},
                    "reward": {"type": "global_mult", "value": 1.25},
                    "bonusDesc": "bonusDesc_global_25"
                },
                {
                    "id": "prestige_veteran",
                    "nameKey": "ach_prestige_veteran",
                    "descKey": "ach_prestige_veteran_desc",
                    "condition": {"type": "prestiges", "value": 5},
                    "reward": {"type": "prestige_bonus", "value": 1.30},
                    "bonusDesc": "bonusDesc_prestige_30"
                },
                {
                    "id": "prestige_master",
                    "nameKey": "ach_prestige_master",
                    "descKey": "ach_prestige_master_desc",
                    "condition": {"type": "prestiges", "value": 10},
                    "reward": {"type": "prestige_break", "value": 1},
                    "bonusDesc": "bonusDesc_prestige_break"
                },
                {
                    "id": "challenge_master",
                    "nameKey": "ach_challenge_master",
                    "descKey": "ach_challenge_master_desc",
                    "condition": {"type": "challenges_completed", "value": 5},
                    "reward": {"type": "global_mult", "value": 1.50},
                    "bonusDesc": "bonusDesc_challenge_master"
                },
                // NEW: Buildings & Departments Achievements
                {
                    "id": "first_building",
                    "nameKey": "ach_first_building",
                    "descKey": "ach_first_building_desc", 
                    "condition": {"type": "buildings_unlocked", "value": 1},
                    "reward": {"type": "building_discount", "value": 0.95},
                    "bonusDesc": "bonusDesc_building_discount_5"
                },
                {
                    "id": "building_empire", 
                    "nameKey": "ach_building_empire",
                    "descKey": "ach_building_empire_desc",
                    "condition": {"type": "total_building_levels", "value": 50},
                    "reward": {"type": "global_mult", "value": 1.20},
                    "bonusDesc": "bonusDesc_building_empire"
                },
                {
                    "id": "department_synergy",
                    "nameKey": "ach_department_synergy", 
                    "descKey": "ach_department_synergy_desc",
                    "condition": {"type": "departments_synergy", "value": 2},
                    "reward": {"type": "department_bonus", "value": 1.15},
                    "bonusDesc": "bonusDesc_department_synergy"
                },
                {
                    "id": "prestige_master_v2",
                    "nameKey": "ach_prestige_master_v2",
                    "descKey": "ach_prestige_master_v2_desc",
                    "condition": {"type": "prestige_level", "value": 5}, 
                    "reward": {"type": "prestige_break_v2", "value": 1},
                    "bonusDesc": "bonusDesc_prestige_break_v2"
                }
            ],

            "deskItems": [
                {
                    "id": "mug",
                    "nameKey": "desk_mug",
                    "cost": 1,
                    "bonus": {"type": "single_task_boost", "value": 1.10},
                    "bonusDesc": "bonusDesc_single_boost"
                },
                {
                    "id": "phone",
                    "nameKey": "desk_phone",
                    "cost": 3,
                    "bonus": {"type": "all_active_boost", "value": 1.05},
                    "bonusDesc": "bonusDesc_active_boost"
                },
                {
                    "id": "organizer",
                    "nameKey": "desk_organizer",
                    "cost": 8,
                    "bonus": {"type": "focus_slot", "value": 1},
                    "bonusDesc": "bonusDesc_focus_slot"
                },
                {
                    "id": "lamp",
                    "nameKey": "desk_lamp",
                    "cost": 6,
                    "bonus": {"type": "night_boost", "value": 1.10},
                    "bonusDesc": "bonusDesc_night_boost"
                },
                {
                    "id": "multitool",
                    "nameKey": "desk_multitool",
                    "cost": 12,
                    "bonus": {"type": "focus_switch_discount", "value": 0.5},
                    "bonusDesc": "bonusDesc_switch_discount"
                },
                {
                    "id": "trophy",
                    "nameKey": "desk_trophy",
                    "cost": 20,
                    "bonus": {"type": "focus_slot", "value": 2},
                    "prestige": 1,
                    "bonusDesc": "bonusDesc_trophy"
                },
                {
                    "id": "desk_skill_cap_breaker",
                    "nameKey": "desk_skill_cap_breaker",
                    "cost": 12,
                    "bonus": {"type": "prestige_soft_skill_multiplier", "value": 99},
                    "bonusDesc": "bonusDesc_skill_cap_breaker"
                },
                {
                    "id": "autobuyer",
                    "nameKey": "desk_autobuyer",
                    "cost": 25,
                    "bonus": {"type": "autobuyer_unlock", "value": 1},
                    "bonusDesc": "bonusDesc_autobuyer"
                },
                {
                    "id": "challenges",
                    "nameKey": "desk_challenges",
                    "cost": 30,
                    "bonus": {"type": "challenges_unlock", "value": 1},
                    "bonusDesc": "bonusDesc_challenges_unlock"
                }
            ],

            "challenges": [
                {"id": "speed_run", "nameKey": "challenge_speed_run", "descKey": "challenge_speed_run_desc", "condition": {"type": "bp_in_time", "value": 10000, "time": 300000}, "reward": {"type": "idle_bonus", "value": 1.25}, "bonusDesc": "bonusDesc_speed_bonus"},
                {"id": "efficiency", "nameKey": "challenge_efficiency", "descKey": "challenge_efficiency_desc", "condition": {"type": "bp_per_second", "value": 100, "max_upgrades": 20}, "reward": {"type": "upgrade_discount", "value": 0.9}, "bonusDesc": "bonusDesc_efficiency_bonus"},
                {"id": "minimalist", "nameKey": "challenge_minimalist", "descKey": "challenge_minimalist_desc", "condition": {"type": "bp_target", "value": 50000, "max_tasks": 3}, "reward": {"type": "ascend_bonus", "value": 1.3}, "bonusDesc": "bonusDesc_minimalist_bonus"},
                {"id": "prestige_rush", "nameKey": "challenge_prestige_rush", "descKey": "challenge_prestige_rush_desc", "condition": {"type": "prestige_in_time", "value": 1, "time": 600000}, "reward": {"type": "prestige_bonus", "value": 1.4}, "bonusDesc": "bonusDesc_prestige_rush_bonus"},
                {"id": "marathon", "nameKey": "challenge_marathon", "descKey": "challenge_marathon_desc", "condition": {"type": "continuous_play", "value": 3600000}, "reward": {"type": "global_mult", "value": 1.2}, "bonusDesc": "bonusDesc_marathon_bonus"}
            ],

            "multiBuyOptions": [1, 2, 5, 10, 20, 50, "max"],
            "prestigeThreshold": 40000,
            "prestigeBreakThreshold": 50000,

            "translations": {
                "pl": {
                    "onboarding_title": "Witaj w Korposzczur!",
                    "onboarding_body": "Zostałeś właśnie zatrudniony na pozycję szeregowego pracownika w korporacji.\n\nRozwijaj karierę, zdobywaj **Biuro-Punkty (BP)** i odblokowuj zadania. Od Ciebie zależy jak potoczy się gra. Powodzenia!",
                    "onboarding_close": "Zaczynam!",

                    // NEW: Buildings translations
                    "tab_buildings": "Budynki",
                    "building_office_space": "Przestrzeń Biurowa",
                    "building_conference_room": "Sala Konferencyjna",
                    "building_coffee_corner": "Kącik Kawowy", 
                    "building_analytics_lab": "Laboratorium Analityczne",
                    "building_innovation_hub": "Centrum Innowacji",
                    "building_executive_suite": "Apartament Zarządu",
                    "building_effects": "Efekty Budynków",

                    // NEW: Departments translations
                    "tab_departments": "Działy", 
                    "dept_administration": "Administracja",
                    "dept_operations": "Operacje",
                    "dept_analytics": "Analityka", 
                    "dept_innovation": "Innowacje",
                    "synergy_active": "Synergia aktywna!",
                    "synergy_progress": "Progres synergii",

                    // NEW: Prestige levels
                    "prestige_level": "Poziom Prestiżu",

                    // NEW: Achievement descriptions
                    "ach_first_building": "Pierwszy budynek",
                    "ach_first_building_desc": "Odblokuj pierwszy budynek",
                    "ach_building_empire": "Imperium budynków",
                    "ach_building_empire_desc": "Osiągnij 50 poziomów budynków łącznie",
                    "ach_department_synergy": "Synergia działów",
                    "ach_department_synergy_desc": "Aktywuj synergię w 2 działach jednocześnie",
                    "ach_prestige_master_v2": "Mistrz prestiżu v2",
                    "ach_prestige_master_v2_desc": "Osiągnij 5. poziom prestiżu",

                    // NEW: Bonus descriptions
                    "bonusDesc_building_discount_5": "Budynki tańsze o 5%",
                    "bonusDesc_building_empire": "+20% do wszystkich przychodów z budynków",
                    "bonusDesc_department_synergy": "+15% do bonusu synergii działów",
                    "bonusDesc_prestige_break_v2": "Odblokuje zaawansowany system prestiżu",

                    // Existing translations continue...
                    "task_lunch": "Lunch firmowy",
                    "task_report": "Tworzenie raportów",
                    "task_motivation": "Motywacyjne spotkanie",
                    
                    "rank_intern": "Stażysta",
                    "rank_assistant": "Asystent",
                    "rank_junior_specialist": "Młodszy specjalista",
                    "rank_specialist": "Specjalista",
                    "rank_senior_specialist": "Starszy specjalista",
                    "rank_expert": "Ekspert",
                    "rank_team_leader": "Kierownik",
                    "rank_manager": "Manager",
                    "rank_director": "Dyrektor",
                    "rank_board_member": "Członek Zarządu",

                    "number_format": "Format liczb",
                    "format_number_auto": "K/M/B/T",
                    "format_number_scientific": "Naukowa (1.23e+9)",
                    "format_number_engineering": "Inżynieryjna (1.23E6, 4.5E6)",

                    "desk_skill_cap_breaker": "Przełomowy kurs",
                    "bonusDesc_skill_cap_breaker": "Odblokowuje zdobywanie wielu Soft Skills przy prestiżu",
                    "prestige_limit_warning": "Obecnie możesz zdobyć maksymalnie 1 Soft Skill za prestiż. Odblokuj achievement 'Mistrz prestiżu' lub kup 'Przełomowy kurs' na biurku, by zwiększyć limit.",
                    "prestige_limit_unlocked": "Limit Soft Skills za prestiż został odblokowany!",
                    "prestige_gain_capped": "Zdobędziesz 1 Soft Skill (limit aktywny)",
                    "prestige_gain_unlimited": "Zdobędziesz {0} Soft Skill(s)",

                    "bonusDesc_global_10": "+10% do wszystkich przychodów",
                    "bonusDesc_idle_20": "+20% do BP/s",
                    "bonusDesc_upgrade_discount_5": "Ulepszenia tańsze o 5%",
                    "bonusDesc_career_stats": "Odblokuj statystyki kariery i śledzenie postępu awansów",
                    "bonusDesc_prestige_mult_15": "+15% do mnożnika Prestiżu",
                    "bonusDesc_ascend_10": "+10% do bonusu awansu",
                    "bonusDesc_challenges_unlock": "Odblokowuje wyzwania",
                    "bonusDesc_autobuyer": "Odblokowuje auto-kupowanie (AI Asystent)",
                    "bonusDesc_bp_5": "+5% do przychodu Biuro-Punktów",
                    "bonusDesc_multibuy_upgrades": "Odblokowuje Multi-buy",
                    "bonusDesc_idle_10": "+10% do BP/s zadań",
                    "bonusDesc_multibuy_ascend": "Odblokowuje Multi-buy dla awansów",
                    "bonusDesc_prestige_15": "+15% do mnożnika Prestiżu",
                    "bonusDesc_bp_10": "+10% do przychodu Biuro-Punktów",
                    "bonusDesc_ascend_20": "+20% do bonusu awansu",
                    "bonusDesc_soft_skill_25": "+25% do produkcji Soft Skills",
                    "bonusDesc_global_30": "+30% do wszystkich przychodów",
                    "bonusDesc_max_buy": "Odblokowuje Kup Max",
                    "bonusDesc_ascend_discount_10": "Awans tańszy o 10%",
                    "bonusDesc_idle_15": "+15% do BP/s",
                    "bonusDesc_global_15": "+15% do wszystkich przychodów",
                    "bonusDesc_desk_unlock": "Odblokowuje Biurko",
                    "bonusDesc_prestige_20": "+20% do mnożnika Prestiżu",
                    "bonusDesc_soft_skill_50": "+50% do Soft Skills",
                    "bonusDesc_soft_skill_10": "+10% do Soft Skills",
                    "bonusDesc_desk_discount_10": "Przedmioty na biurko tańsze o 10%",
                    "bonusDesc_global_25": "+25% do wszystkich przychodów",
                    "bonusDesc_prestige_30": "+30% do mnożnika Prestiżu",
                    "bonusDesc_prestige_break": "Odblokowuje Prestiż Break",
                    "bonusDesc_challenge_master": "+50% do wszystkich przychodów",
                    "bonusDesc_coming_soon": "Wkrótce nowe nagrody!",

                    "game_title": "Korposzczur",
                    "tab_career": "Kariera",
                    "tab_desk": "Biurko",
                    "tab_achievements": "Achievementy",
                    "tab_challenges": "Wyzwania",
                    "help": "Pomoc",
                    "biuro_punkty": "Biuro-Punkty",
                    "soft_skills": "Soft Skills",
                    "settings": "Ustawienia",
                    "prestige": "Prestiż",
                    "prestige_ready": "Wykonaj prestiż",
                    "prestige_warning": "Uwaga. Prestiż resetuje grę",
                    "prestige_reward": "Zdobądź",
                    "prestige_break": "Prestiż Break!",
                    "upgrade": "Ulepsz",
                    "ascend": "Awansuj",
                    "unlock": "Odblokuj",
                    "buy": "Kup",
                    "level": "Poziom",
                    "rank": "Ranga",
                    "locked": "Zablokowane",
                    "auto_buyer": "Auto-Kupowanie",
                    "multibuy": "Multi-buy",
                    "buy_max": "Kup max",
                    "next_unlock": "Następne Odblokowanie",
                    "prestige_progress": "Progres do Prestiżu",
                    "cost": "Koszt",
                    "total_cost": "Łączny koszt",
                    "per_second": "/s",
                    "complete": "Ukończ",
                    "completed": "Ukończone",
                    "in_progress": "W trakcie",
                    "locked_feature": "Zablokowane - kup odpowiedni przedmiot",

                    "task_email": "Pisanie maili",
                    "task_coffee": "Robienie kawki",
                    "task_meeting": "Spotkania Teams",
                    "task_kpi": "Analiza KPI",
                    "task_brainstorm": "Burza mózgów",
                    "task_optimize": "Optymalizacja procesów",

                    "desk_mug": "Kubek z logo",
                    "desk_phone": "Telefon służbowy",
                    "desk_organizer": "Biurkowy organizer",
                    "desk_lamp": "Lampka biurowa",
                    "desk_multitool": "Multitool",
                    "desk_trophy": "Trofeum zespołowe",
                    "desk_autobuyer": "AI Asystent",
                    "desk_challenges": "Konsola wyzwań",

                    "bonusDesc_single_boost": "+10% BP do wybranego aktywnego zadania",
                    "bonusDesc_active_boost": "+5% BP do wszystkich aktywnych zadań",
                    "bonusDesc_focus_slot": "+1 slot focus (więcej aktywnych tasków)",
                    "bonusDesc_night_boost": "+10% BP nocą",
                    "bonusDesc_switch_discount": "Zmiana aktywnego tasku kosztuje 50% mniej BP",
                    "bonusDesc_trophy": "+2 sloty focus, ale -10% do łącznego BP",

                    "challenge_speed_run": "Sprint biurowy",
                    "challenge_speed_run_desc": "Zdobądź 10,000 BP w 5 minut",
                    "challenge_efficiency": "Mistrz efektywności",
                    "challenge_efficiency_desc": "Osiągnij 100 BP/s z max 20 ulepszeniami",
                    "challenge_minimalist": "Minimalistyczny menedżer",
                    "challenge_minimalist_desc": "Zdobądź 50,000 BP używając max 3 zadań",
                    "challenge_prestige_rush": "Błyskawiczny prestiż",
                    "challenge_prestige_rush_desc": "Wykonaj prestiż w 10 minut",
                    "challenge_marathon": "Maraton korporacyjny",
                    "challenge_marathon_desc": "Graj nieprzerwanie przez godzinę",

                    "ach_first_unlock": "Pierwszy odblokuj",
                    "ach_first_unlock_desc": "Odblokuj pierwsze zadanie",
                    "ach_upgrade_novice": "Początkujący ulepszacz",
                    "ach_upgrade_novice_desc": "Kup 50 ulepszeń",
                    "ach_coffee_lover": "Miłośnik kawy",
                    "ach_coffee_lover_desc": "Odblokuj zadanie robienia kawy",
                    "ach_meeting_master": "Mistrz spotkań",
                    "ach_meeting_master_desc": "Ulepsz spotkania do poziomu 15",
                    "ach_first_ascend": "Pierwszy awans",
                    "ach_first_ascend_desc": "Wykonaj pierwszy awans zadania",
                    "ach_kpi_analyst": "Analityk KPI",
                    "ach_kpi_analyst_desc": "Odblokuj analizę KPI",
                    "ach_big_spender": "Wielki wydawca",
                    "ach_big_spender_desc": "Wydaj 25,000 BP łącznie",
                    "ach_innovation_guru": "Guru innowacji",
                    "ach_innovation_guru_desc": "Odblokuj burzę mózgów",
                    "ach_first_prestige": "Pierwszy prestiż",
                    "ach_first_prestige_desc": "Wykonaj pierwszy prestiż",
                    "ach_optimizer": "Optymalizator",
                    "ach_optimizer_desc": "Odblokuj optymalizację procesów",
                    "ach_multibuy_expert": "Ekspert multi-buy",
                    "ach_multibuy_expert_desc": "Użyj multi-buy 25 razy",
                    "ach_corporate_ladder": "Drabina korporacyjna",
                    "ach_corporate_ladder_desc": "Wykonaj 10 awansów łącznie",
                    "ach_idle_master": "Mistrz idle",
                    "ach_idle_master_desc": "Osiągnij 1500 BP/s przychodu",
                    "ach_soft_skills_beginner": "Początkujący soft skills",
                    "ach_soft_skills_beginner_desc": "Zdobądź pierwszy soft skill",
                    "ach_soft_skills_expert": "Ekspert soft skills",
                    "ach_soft_skills_expert_desc": "Zdobądź 10 soft skills",
                    "ach_soft_skills_master": "Mistrz soft skills",
                    "ach_soft_skills_master_desc": "Zdobądź 50 soft skills",
                    "ach_first_desk_item": "Pierwszy przedmiot",
                    "ach_first_desk_item_desc": "Kup pierwszy przedmiot na biurko",
                    "ach_office_decorator": "Dekorator biura",
                    "ach_office_decorator_desc": "Kup 3 przedmioty na biurko",
                    "ach_office_complete": "Kompletne biuro",
                    "ach_office_complete_desc": "Kup wszystkie 6 przedmiotów",
                    "ach_prestige_veteran": "Weteran prestiżu",
                    "ach_prestige_veteran_desc": "Wykonaj 5 prestiży",
                    "ach_prestige_master": "Mistrz prestiżu",
                    "ach_prestige_master_desc": "Wykonaj 10 prestiży",
                    "ach_challenge_master": "Mistrz wyzwań",
                    "ach_challenge_master_desc": "Ukończ 5 wyzwań",

                    "help_content": "**Korposzczur** - Gra idle/clicker o korporacyjnej tematyce\n\nRozwijaj karierę, zdobywaj **Biuro-Punkty (BP)** i odblokowuj zadania. Wydawaj **Soft Skills** na ulepszenia.\n\n**NOWA FUNKCJA - Soft Skill Cap:**\n\n• Początkowo prestiż daje maksymalnie 1 Soft Skill\n\n• Odblokuj achievement \"Mistrz prestiżu\" (10 prestiży) ALBO\n\n• Kup \"Przełomowy kurs\" na biurku (12 SS)\n\n• Po odblokowaniu: otrzymasz pełną liczbę SS za prestiż!\n\nMiłej gry! 🍀"
                },

                // English translations (abbreviated for space)
                "en": {
                    "tab_buildings": "Buildings",
                    "tab_departments": "Departments", 
                    "building_office_space": "Office Space",
                    "building_conference_room": "Conference Room",
                    "building_coffee_corner": "Coffee Corner", 
                    "building_analytics_lab": "Analytics Lab",
                    "building_innovation_hub": "Innovation Hub",
                    "building_executive_suite": "Executive Suite",
                    "building_effects": "Building Effects",
                    "dept_administration": "Administration",
                    "dept_operations": "Operations",
                    "dept_analytics": "Analytics", 
                    "dept_innovation": "Innovation",
                    "synergy_active": "Synergy Active!",
                    "synergy_progress": "Synergy Progress",
                    "prestige_level": "Prestige Level",
                    "ach_first_building": "First Building",
                    "ach_first_building_desc": "Unlock your first building",
                    "ach_building_empire": "Building Empire",
                    "ach_building_empire_desc": "Reach 50 total building levels",
                    "ach_department_synergy": "Department Synergy",
                    "ach_department_synergy_desc": "Activate synergy in 2 departments simultaneously",
                    "ach_prestige_master_v2": "Prestige Master v2",
                    "ach_prestige_master_v2_desc": "Reach Prestige Level 5",
                    "bonusDesc_building_discount_5": "Buildings 5% cheaper",
                    "bonusDesc_building_empire": "+20% to all building income",
                    "bonusDesc_department_synergy": "+15% to department synergy bonus",
                    "bonusDesc_prestige_break_v2": "Unlocks advanced prestige system",
					"task_lunch": "Office lunch",
                    "task_report": "Report creation",
                    "task_motivation": "Motivational meet",
                    "rank_intern": "Intern",
                    "rank_assistant": "Assistant",
                    "rank_junior_specialist": "Junior Specialist",
                    "rank_specialist": "Specialist",
                    "rank_senior_specialist": "Senior Specialist",
                    "rank_expert": "Expert",
                    "rank_team_leader": "Team Leader",
                    "rank_manager": "Manager",
                    "rank_director": "Director",
                    "rank_board_member": "Board Member",
                    "number_format": "Number format",
                    "format_number_auto": "K/M/B/T",
                    "format_number_scientific": "Scientific (1.23e+9)",
                    "format_number_engineering": "Engineering (1.23E6, 4.5E6)",
                    "format_number_auto_desc": "Shortcuts for thousand, million, billion etc.",
                    "format_number_scientific_desc": "Scientific notation, e.g. 2.54e+15",
                    "format_number_engineering_desc": "Engineering notation (exponent divisible by 3), e.g. 1.23E6",
					 "desk_skill_cap_breaker": "Breakthrough Course",
                    "bonusDesc_skill_cap_breaker": "Unlocks earning multiple Soft Skills per prestige",
                    "prestige_limit_warning": "You can currently earn at most 1 Soft Skill per prestige. Unlock the 'Prestige Master' achievement or buy the 'Breakthrough Course' desk item to increase the cap.",
                    "prestige_limit_unlocked": "Soft Skill cap per prestige has been unlocked!",
                    "prestige_gain_capped": "You will earn 1 Soft Skill (cap active)",
                    "prestige_gain_unlimited": "You will earn {0} Soft Skill(s)",
					"bonusDesc_global_10": "+10% to all income",
                    "bonusDesc_idle_20": "+20% to BP/s",
                    "bonusDesc_upgrade_discount_5": "Upgrades 5% cheaper",
                    "bonusDesc_prestige_mult_15": "+15% to Prestige multiplier",
                    "bonusDesc_ascend_10": "+10% to ascend bonus",
                    "bonusDesc_challenges_unlock": "Unlocks challenges",
                    "bonusDesc_autobuyer": "Unlocks auto-buyer (AI Assistant)",
                    "bonusDesc_bp_5": "+5% to Office Points income",
                    "bonusDesc_multibuy_upgrades": "Unlocks Multi-buy",
                    "bonusDesc_idle_10": "+10% to task BP/s",
                    "bonusDesc_idle_15": "+15% to BP/s",
                    "bonusDesc_multibuy_ascend": "Unlocks Multi-buy for ascensions",
                    "bonusDesc_prestige_15": "+15% to Prestige multiplier",
                    "bonusDesc_bp_10": "+10% to Office Points income",
                    "bonusDesc_ascend_20": "+20% to ascension bonus",
                    "bonusDesc_soft_skill_25": "+25% to Soft Skills production",
                    "bonusDesc_global_30": "+30% to all income",
                    "bonusDesc_max_buy": "Unlocks Buy Max",
                    "bonusDesc_ascend_discount_10": "Ascension 10% cheaper",
                    "bonusDesc_idle_20": "+20% to BP/s",
                    "bonusDesc_global_15": "+15% to all income",
                    "bonusDesc_desk_unlock": "Unlocks Desk",
                    "bonusDesc_prestige_20": "+20% to Prestige multiplier",
                    "bonusDesc_soft_skill_50": "+50% to Soft Skills",
                    "bonusDesc_soft_skill_10": "+10% to Soft Skills",
                    "bonusDesc_desk_discount_10": "Desk items 10% cheaper",
                    "bonusDesc_global_25": "+25% to all income",
                    "bonusDesc_prestige_30": "+30% to Prestige multiplier",
                    "bonusDesc_prestige_break": "Unlocks Prestige Break",
                    "bonusDesc_challenge_master": "+50% to all income",
                    "bonusDesc_coming_soon": "More rewards coming soon!",
                    "game_title": "Corporate Rat",
                    "tab_career": "Career",
                    "tab_desk": "Desk",
                    "tab_achievements": "Achievements",
                    "tab_challenges": "Challenges",
                    "help": "Help",
                    "biuro_punkty": "Office Points",
                    "soft_skills": "Soft Skills",
                    "settings": "Settings",
                    "prestige": "Prestige",
                    "prestige_ready": "Perform prestige",
                    "prestige_warning": "Warning. Prestige resets the game",
                    "prestige_reward": "Get",
                    "prestige_break": "Prestige Break!",
                    "upgrade": "Upgrade",
                    "ascend": "Promote",
                    "unlock": "Unlock",
                    "buy": "Buy",
                    "level": "Level",
                    "rank": "Rank",
                    "locked": "Locked",
                    "auto_buyer": "Auto-Buyer",
                    "multibuy": "Multi-buy",
                    "buy_max": "Buy max",
                    "next_unlock": "Next Unlock",
                    "prestige_progress": "Prestige Progress",
                    "cost": "Cost",
                    "total_cost": "Total cost",
                    "per_second": "/s",
                    "complete": "Complete",
                    "completed": "Completed",
                    "in_progress": "In Progress",
                    "locked_feature": "Locked - buy appropriate item",
                    "task_email": "Writing emails",
                    "task_coffee": "Making coffee",
                    "task_meeting": "Teams meetings",
                    "task_kpi": "KPI analysis",
                    "task_brainstorm": "Brainstorming",
                    "task_optimize": "Process optimization",
                    "desk_mug": "Logo Mug",
                    "desk_phone": "Work Phone",
                    "desk_organizer": "Desk Organizer",
                    "desk_lamp": "Desk Lamp",
                    "desk_multitool": "Multitool",
                    "desk_trophy": "Team Trophy",
                    "bonusDesc_single_boost": "+10% BP to selected active task",
                    "bonusDesc_active_boost": "+5% BP to all active tasks",
                    "bonusDesc_focus_slot": "+1 focus slot (more active tasks)",
                    "bonusDesc_night_boost": "+10% BP at night",
                    "bonusDesc_switch_discount": "Changing active task costs 50% less BP",
                    "bonusDesc_trophy": "+2 focus slots, but -10% to total BP",
                    "desk_monitor": "Second monitor",
                    "desk_plant": "Desk plant",
                    "desk_mousepad": "Ergonomic mousepad",
                    "desk_laptop": "Company laptop",
                    "desk_challenges": "Challenge console",
                    "desk_autobuyer": "AI Assistant",
                    "challenge_speed_run": "Office sprint",
                    "challenge_speed_run_desc": "Earn 10,000 BP in 5 minutes",
                    "challenge_efficiency": "Efficiency master",
                    "challenge_efficiency_desc": "Reach 100 BP/s with max 20 upgrades",
                    "challenge_minimalist": "Minimalist manager",
                    "challenge_minimalist_desc": "Earn 50,000 BP using max 3 tasks",
                    "challenge_prestige_rush": "Lightning prestige",
                    "challenge_prestige_rush_desc": "Perform prestige in 10 minutes",
                    "challenge_marathon": "Corporate marathon",
                    "challenge_marathon_desc": "Play continuously for 1 hour",
                    "ach_first_unlock": "First unlock",
                    "ach_first_unlock_desc": "Unlock your first task",
                    "ach_upgrade_novice": "Upgrade novice",
                    "ach_upgrade_novice_desc": "Buy 50 upgrades",
                    "ach_coffee_lover": "Coffee lover",
                    "ach_coffee_lover_desc": "Unlock coffee making task",
                    "ach_meeting_master": "Meeting master",
                    "ach_meeting_master_desc": "Upgrade meetings to level 15",
                    "ach_first_ascend": "First ascension",
                    "ach_first_ascend_desc": "Perform your first task ascension",
                    "ach_kpi_analyst": "KPI analyst",
                    "ach_kpi_analyst_desc": "Unlock KPI analysis",
                    "ach_big_spender": "Big spender",
                    "ach_big_spender_desc": "Spend 25,000 BP total",
                    "ach_innovation_guru": "Innovation guru",
                    "ach_innovation_guru_desc": "Unlock brainstorming",
                    "ach_first_prestige": "First prestige",
                    "ach_first_prestige_desc": "Perform your first prestige",
                    "ach_optimizer": "Optimizer",
                    "ach_optimizer_desc": "Unlock process optimization",
                    "ach_multibuy_expert": "Multi-buy expert",
                    "ach_multibuy_expert_desc": "Use multi-buy 25 times",
                    "ach_corporate_ladder": "Corporate ladder",
                    "ach_corporate_ladder_desc": "Perform 10 total ascensions",
                    "ach_idle_master": "Idle master",
                    "ach_idle_master_desc": "Reach 1500 BP/s income",
                    "ach_dedication": "Dedication",
                    "ach_dedication_desc": "Play for 2 hours",
                    "ach_soft_skills_beginner": "Soft skills beginner",
                    "ach_soft_skills_beginner_desc": "Earn your first soft skill",
                    "ach_soft_skills_expert": "Soft skills expert",
                    "ach_soft_skills_expert_desc": "Earn 10 soft skills",
                    "ach_soft_skills_master": "Soft skills master",
                    "ach_soft_skills_master_desc": "Earn 50 soft skills",
                    "ach_first_desk_item": "First desk item",
                    "ach_first_desk_item_desc": "Buy your first desk item",
                    "ach_office_decorator": "Office decorator",
                    "ach_office_decorator_desc": "Buy 3 desk items",
                    "ach_office_complete": "Complete office",
                    "ach_office_complete_desc": "Buy all 6 desk items",
                    "ach_prestige_veteran": "Prestige veteran",
                    "ach_prestige_veteran_desc": "Perform 5 prestiges",
                    "ach_prestige_master": "Prestige master",
                    "ach_prestige_master_desc": "Perform 10 prestiges",
                    "ach_challenge_master": "Challenge master",
                    "ach_challenge_master_desc": "Complete 5 challenges",
                    "ach_future_update": "Future updates",
                    "ach_future_update_desc": "Wait for more content",
                    "bonusDesc_career_stats": "Unlocks career stats (ascensions, rankings)",
                    "game_title": "Corporate Rat",
                    "help_content": "**Corporate Rat** - Corporate idle/clicker game\n\nDevelop your career, earn **Office Points (BP)** and unlock tasks. Spend **Soft Skills** on upgrades.\n\n**NEW FEATURE - Soft Skill Cap:**\n\n• Initially prestige gives maximum 1 Soft Skill\n\n• Unlock the 'Prestige Master' achievement (10 prestiges) OR\n\n• Buy 'Breakthrough Course' desk item (12 SS)\n\n• After unlocking: receive full number of SS per prestige!\n\nEnjoy the game! 🍀"
                }
            },

            "quotes": {
                "pl": [
                    "Przeciętny email w pracy jest czytany w mniej niż 15 sekund.",
                    "Najwięcej kawy w roku pija się w poniedziałki po godzinie 9:00.",
                    "Open space powstał już w latach 60. i pierwotnie miał promować kreatywność.",
                    "65% spotkań można by zastąpić jednym mailem.",
                    "Badania pokazują, że praca zdalna zwiększa produktywność o średnio 13%.",
                    "Prawie 40% pracowników korporacji twierdzi, że nigdy nie korzysta z firmowego chill roomu.",
                    "Najczęściej używane słowo na spotkaniach to synergia.",
                    "Statystyczny pracownik klika Wyślij w mailu służbowym około 30 razy dziennie",
                    "Zjedzenie ciastka z kuchni firmowej podnosi morale zespołu nawet o 5%.",
                    "Najczęściej kopiowany skrót w Excelu to Ctrl+C, a zaraz po nim Ctrl+V.",
                    "Najpopularniejsza wymówka na spóźnienie? Spotkanie z klientem."
                ],
                "en": [
                    "The average work email is read in less than 15 seconds.",
                    "Most office coffee is consumed on Mondays after 9 AM.",
                    "Open space offices were invented in the 1960s to promote creativity.",
                    "65% of meetings could be replaced by a single email.",
                    "Studies show remote work increases productivity by an average of 13%.",
                    "Nearly 40% of corporate employees say they never use the company chill-out room.",
                    "The most used word in office meetings is \"synergy\".",
                    "The average office worker clicks \"Send\" on an email about 30 times a day.",
                    "Eating a company kitchen cookie can raise team morale by up to 5%.",
                    "The most copied shortcut in Excel is Ctrl+C, closely followed by Ctrl+V.",
                    "The most popular excuse for being late? \"Client meeting.\""
                ]
            },

            "rankKeys": [
                "rank_intern",
                "rank_assistant", 
                "rank_junior_specialist",
                "rank_specialist",
                "rank_senior_specialist",
                "rank_expert",
                "rank_team_leader",
                "rank_manager",
                "rank_director",
                "rank_board_member"
            ]
        };
    }

    loadGameState() {
        const defaultState = {
            energy: 100,
            maxEnergy: 100,
            lastEnergyUpdate: Date.now(),
            activeSkills: {},
            adsWatchedToday: 0,
            lastAdWatch: 0,
            lastAdDay: Math.floor(Date.now() / (24 * 60 * 60 * 1000)),
            bp: 0,
            softSkills: 0,
            totalBPEarned: 0,
            totalBPSpent: 0,
            prestigeCount: 0,
            prestigeLevel: 0, // NEW: Prestige levels
            
            // NEW: Buildings state
            buildings: {},
            
            // NEW: Departments state  
            departments: {},
            
            tasks: {
                email: { level: 1, progress: 0, unlocked: false, ascensions: 0, locked: true }
            },
            achievements: {},
            deskItems: {},
            challenges: {},
            focus: [],
            settings: {
                language: 'pl',
                theme: 'light',
                reducedMotion: false,
                numberFormat: 'auto'
            },
            stats: {
                totalUpgrades: 0,
                totalAscensions: 0,
                totalUnlocks: 0,
                totalMultiBuys: 0,
                playTime: 0,
                tasksUnlocked: 0,
                upgradesBought: 0,
                challengesCompleted: 0,
                deskItemsBought: 0,
                softSkillsEarned: 0,
                buildingsUnlocked: 0, // NEW
                totalBuildingLevels: 0, // NEW
                departmentsSynergized: 0 // NEW
            },
            features: {
                multiBuyUnlocked: false,
                autoBuyerUnlocked: false,
                maxBuyUnlocked: false,
                deskUnlocked: false,
                challengesUnlocked: false,
                prestigeBreakUnlocked: false,
                buildingsUnlocked: false, // NEW
                departmentsUnlocked: false // NEW
            }
        };

        try {
            const saved = localStorage.getItem('korposzczur-save');
            if (saved) {
                const parsed = JSON.parse(saved);
                const mergedState = { ...defaultState, ...parsed };

                // Initialize missing tasks with locked state
                this.gameData.tasks.forEach(task => {
                    if (!mergedState.tasks[task.id]) {
                        mergedState.tasks[task.id] = {
                            level: 1,
                            progress: 0,
                            unlocked: false,
                            ascensions: 0,
                            locked: true
                        };
                    } else {
                        if (mergedState.tasks[task.id].unlocked === false) {
                            mergedState.tasks[task.id].locked = true;
                        }
                    }
                });

                // NEW: Initialize buildings state
                if (!parsed.buildings) {
                    mergedState.buildings = {};
                    this.gameData.buildings.forEach(building => {
                        mergedState.buildings[building.id] = {
                            level: 0, 
                            unlocked: false
                        };
                    });
                } else {
                    // Ensure all buildings exist
                    this.gameData.buildings.forEach(building => {
                        if (!mergedState.buildings[building.id]) {
                            mergedState.buildings[building.id] = {
                                level: 0, 
                                unlocked: false
                            };
                        }
                    });
                }

                // NEW: Initialize departments state
                if (!parsed.departments) {
                    mergedState.departments = {};
                    this.gameData.departments.forEach(dept => {
                        mergedState.departments[dept.id] = {
                            unlocked: false
                        };
                    });
                } else {
                    this.gameData.departments.forEach(dept => {
                        if (!mergedState.departments[dept.id]) {
                            mergedState.departments[dept.id] = {
                                unlocked: false
                            };
                        }
                    });
                }

                // NEW: Initialize prestige level
                if (!parsed.prestigeLevel) {
                    mergedState.prestigeLevel = 0;
                }

                return mergedState;
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }

        // Initialize default buildings and departments
        defaultState.buildings = {};
        this.gameData.buildings.forEach(building => {
            defaultState.buildings[building.id] = {
                level: 0, 
                unlocked: false
            };
        });

        defaultState.departments = {};
        this.gameData.departments.forEach(dept => {
            defaultState.departments[dept.id] = {
                unlocked: false
            };
        });

        return defaultState;
    }

    saveGameState() {
        try {
            localStorage.setItem('korposzczur-save', JSON.stringify(this.gameState));
            this.lastSave = Date.now();
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    // Event system for real-time updates
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

    // BP change detection and event triggering
    updateBP(newValue) {
        const oldValue = this.gameState.bp;
        this.gameState.bp = newValue;
        if (oldValue !== newValue) {
            this.triggerEvent('bpChange', { oldValue, newValue });
        }
    }

    // NEW: Calculate building cost
    calculateBuildingCost(buildingId, amount = 1) {
        const building = this.gameData.buildings.find(b => b.id === buildingId);
        const buildingState = this.gameState.buildings[buildingId];
        if (!building || !buildingState) return 0;

        let totalCost = 0;
        let currentLevel = buildingState.level;

        for (let i = 0; i < amount; i++) {
            let cost = building.baseCost * Math.pow(building.costMultiplier, currentLevel);
            
            // Apply building discount from achievements
            Object.keys(this.gameState.achievements).forEach(achId => {
                if (this.gameState.achievements[achId]) {
                    const achievement = this.gameData.achievements.find(a => a.id === achId);
                    if (achievement && achievement.reward.type === 'building_discount') {
                        cost *= achievement.reward.value;
                    }
                }
            });

            totalCost += cost;
            currentLevel++;
        }

        return Math.floor(totalCost);
    }

    // NEW: Upgrade building level
    upgradeBuildingLevel(buildingId, amount = 1) {
        const building = this.gameData.buildings.find(b => b.id === buildingId);
        const buildingState = this.gameState.buildings[buildingId];
        if (!building || !buildingState || !buildingState.unlocked) return false;

        const cost = this.calculateBuildingCost(buildingId, amount);
        if (this.gameState.bp < cost) return false;

        this.updateBP(this.gameState.bp - cost);
        this.gameState.totalBPSpent += cost;
        buildingState.level += amount;
        this.gameState.stats.totalBuildingLevels += amount;

        this.checkAchievements();
        this.updateDisplay();
        return true;
    }

    // NEW: Unlock building
    unlockBuilding(buildingId) {
        const building = this.gameData.buildings.find(b => b.id === buildingId);
        const buildingState = this.gameState.buildings[buildingId];
        if (!building || !buildingState || buildingState.unlocked) return false;

        if (this.gameState.bp < building.unlockCost) return false;

        this.updateBP(this.gameState.bp - building.unlockCost);
        this.gameState.totalBPSpent += building.unlockCost;
        buildingState.unlocked = true;
        this.gameState.stats.buildingsUnlocked++;

        this.checkAchievements();
        this.renderBuildings();
        this.updateDisplay();
        
        this.showNotification(`Building unlocked: ${this.translations[this.currentLanguage][building.nameKey]}`);
        return true;
    }

    // NEW: Get building effects
    getBuildingEffects() {
        let effects = {
            taskBoosts: {},
            globalMultiplier: 1,
            maxFocus: 0,
            energyRegen: 1,
            idleBonus: 1,
            upgradeDiscount: 1,
            softSkillBonus: 1,
            prestigeBonus: 1
        };

        Object.keys(this.gameState.buildings).forEach(buildingId => {
            const building = this.gameData.buildings.find(b => b.id === buildingId);
            const buildingState = this.gameState.buildings[buildingId];
            
            if (building && buildingState.unlocked && buildingState.level > 0) {
                const buildingEffects = building.effects;
                const level = buildingState.level;

                // Task boosts
                if (buildingEffects.taskBoost) {
                    Object.keys(buildingEffects.taskBoost).forEach(taskId => {
                        if (!effects.taskBoosts[taskId]) effects.taskBoosts[taskId] = 1;
                        effects.taskBoosts[taskId] *= Math.pow(buildingEffects.taskBoost[taskId], level);
                    });
                }

                // Global multiplier
                if (buildingEffects.globalMultiplier) {
                    effects.globalMultiplier *= Math.pow(buildingEffects.globalMultiplier, level);
                }

                // Max focus slots
                if (buildingEffects.maxFocus) {
                    effects.maxFocus += buildingEffects.maxFocus * level;
                }

                // Energy regeneration
                if (buildingEffects.energyRegen) {
                    effects.energyRegen *= Math.pow(buildingEffects.energyRegen, level);
                }

                // Idle bonus
                if (buildingEffects.idleBonus) {
                    effects.idleBonus *= Math.pow(buildingEffects.idleBonus, level);
                }

                // Upgrade discount
                if (buildingEffects.upgradeDiscount) {
                    effects.upgradeDiscount *= Math.pow(buildingEffects.upgradeDiscount, level);
                }

                // Soft skill bonus
                if (buildingEffects.softSkillBonus) {
                    effects.softSkillBonus *= Math.pow(buildingEffects.softSkillBonus, level);
                }

                // Prestige bonus
                if (buildingEffects.prestigeBonus) {
                    effects.prestigeBonus *= Math.pow(buildingEffects.prestigeBonus, level);
                }
            }
        });

        return effects;
    }

    // NEW: Calculate department synergy
    calculateDepartmentSynergy(deptId) {
        const dept = this.gameData.departments.find(d => d.id === deptId);
        if (!dept || !this.gameState.departments[deptId].unlocked) return 1.0;

        const totalLevel = this.getDepartmentTotalLevel(deptId);
        if (totalLevel >= dept.synergy.threshold) {
            return dept.synergy.bonus;
        }
        return 1.0;
    }

    // NEW: Get department total level
    getDepartmentTotalLevel(deptId) {
        const dept = this.gameData.departments.find(d => d.id === deptId);
        if (!dept) return 0;

        return dept.tasks.reduce((total, taskId) => {
            const taskState = this.gameState.tasks[taskId];
            return total + (taskState ? taskState.level : 1);
        }, 0);
    }

    // NEW: Check if soft skill cap is unlocked
    isSoftSkillCapUnlocked() {
        const hasPrestigeAchievement = !!this.gameState.achievements["prestige_master"];
        const hasDeskItem = !!this.gameState.deskItems["desk_skill_cap_breaker"];
        return hasPrestigeAchievement || hasDeskItem;
    }

    // NEW: Calculate prestige soft skill gain
    calculatePrestigeSoftSkillGain(totalBPEarned, threshold) {
        if (!this.isSoftSkillCapUnlocked()) {
            return 1; // Cap at 1 soft skill
        }
        
        // Find the highest prestige level achievable
        let highestLevel = 0;
        let totalSoftSkills = 0;
        
        for (let level of this.gameData.prestigeLevels) {
            if (totalBPEarned >= level.threshold) {
                highestLevel = level.level;
                totalSoftSkills = level.softSkillsBase;
            }
        }
        
        return Math.max(1, totalSoftSkills);
    }

    init() {
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.renderAll();
        this.startGameLoop();
        this.startFastUIUpdates();
        this.startQuoteRotation();
        this.checkFeatureUnlocks();

        this.addEventListener('bpChange', () => {
            this.updateTaskButtonStates();
            this.updateUnlockButtonStates();
            this.updateBuildingButtonStates(); // NEW
        });

        if (!localStorage.getItem('korposzczur-onboarded')) {
            document.getElementById('onboarding-modal').classList.remove('hidden');
            document.getElementById('onboarding-close').onclick = () => {
                document.getElementById('onboarding-modal').classList.add('hidden');
                localStorage.setItem('korposzczur-onboarded', '1');
            };
        }

        // Initialize debug commands
        window.debug = {
            addBP: (amount) => {
                this.updateBP(this.gameState.bp + amount);
                this.updateDisplay();
            },
            addSS: (amount) => {
                this.gameState.softSkills += amount;
                this.updateDisplay();
            },
            unlockAll: () => {
                this.gameData.tasks.forEach(task => {
                    this.manualUnlockTask(task.id, true);
                });
                this.renderTasks();
                this.updateTaskButtonStates();
            },
            unlockBuildings: () => {
                this.gameData.buildings.forEach(building => {
                    this.gameState.buildings[building.id].unlocked = true;
                    this.gameState.buildings[building.id].level = 10;
                });
                this.renderBuildings();
            },
            reset: () => {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        };
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tab = e.target.getAttribute('data-tab');
                if (!e.target.classList.contains('disabled')) {
                    this.switchTab(tab);
                }
            });
        });

        // Settings modal
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');
        const settingsBackdrop = settingsModal.querySelector('.modal-backdrop');

        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            settingsModal.classList.remove('hidden');
        });

        const closeSettingsModal = () => {
            settingsModal.classList.add('hidden');
        };

        settingsClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettingsModal();
        });

        settingsBackdrop.addEventListener('click', closeSettingsModal);

        // Energy dropdown
        const energyButton = document.getElementById('energy-button');
        const energyMenu = document.getElementById('energy-menu');
        
        if (energyButton && energyMenu) {
            energyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                energyMenu.classList.toggle('show');
            });

            window.addEventListener('click', (e) => {
                if (!e.target.closest('.energy-dropdown')) {
                    energyMenu.classList.remove('show');
                }
            });

            document.querySelectorAll('.energy-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const skill = e.target.getAttribute('data-skill');
                    if (skill) {
                        this.useSkill(skill);
                    } else if (e.target.id === 'watch-ad-option') {
                        this.watchAdForEnergy();
                    }
                    energyMenu.classList.remove('show');
                });
            });
        }

        // Help modal
        const helpToggle = document.getElementById('help-toggle');
        const helpModal = document.getElementById('help-modal');
        const helpClose = document.getElementById('help-close');
        const helpBackdrop = helpModal.querySelector('.modal-backdrop');

        helpToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            helpModal.classList.remove('hidden');
        });

        const closeHelpModal = () => {
            helpModal.classList.add('hidden');
        };

        helpClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeHelpModal();
        });

        helpBackdrop.addEventListener('click', closeHelpModal);

        // Multi-buy buttons
        document.querySelectorAll('.multibuy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.multibuy-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.multiBuyAmount = e.target.getAttribute('data-amount');
                this.updateTaskButtonStates();
                this.updateBuildingButtonStates(); // NEW
            });
        });

        // Auto-buyer toggle
        const autoBuyerCheckbox = document.getElementById('autobuyer-checkbox');
        autoBuyerCheckbox.addEventListener('change', (e) => {
            e.stopPropagation();
            this.autoBuyerEnabled = e.target.checked;
            if (this.autoBuyerEnabled && !this.autoBuyerInterval) {
                this.startAutoBuyer();
            } else if (!this.autoBuyerEnabled && this.autoBuyerInterval) {
                this.stopAutoBuyer();
            }
        });

        // Language and theme selectors
        document.getElementById('language-select').addEventListener('change', (e) => {
            e.stopPropagation();
            this.gameState.settings.language = e.target.value;
            this.currentLanguage = e.target.value;
            this.updateLanguage();
            this.renderAll();
            this.saveGameState();
        });

        document.getElementById('theme-select').addEventListener('change', (e) => {
            e.stopPropagation();
            this.gameState.settings.theme = e.target.value;
            this.updateTheme();
            this.saveGameState();
        });

        const numberFormatSelect = document.getElementById('number-format-select');
        numberFormatSelect.value = this.gameState.settings.numberFormat || "auto";
        numberFormatSelect.addEventListener('change', (e) => {
            this.gameState.settings.numberFormat = e.target.value;
            this.saveGameState();
            this.renderAll();
        });

        // Reset save
        document.getElementById('reset-save').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to reset your save? This cannot be undone!')) {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        });

        // Prestige button
        document.getElementById('prestige-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.performPrestige();
        });

        // NEW: Building actions (delegated event listeners)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('unlock-building-btn')) {
                const buildingId = e.target.getAttribute('data-building-id');
                if (buildingId) {
                    this.unlockBuilding(buildingId);
                }
            }
            
            if (e.target.classList.contains('upgrade-building-btn')) {
                const buildingId = e.target.getAttribute('data-building-id');
                if (buildingId) {
                    const amount = this.multiBuyAmount === 'max' ? 10 : parseInt(this.multiBuyAmount); // Simplified max
                    this.upgradeBuildingLevel(buildingId, amount);
                }
            }
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(`${tabName}-tab`);
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (targetTab && targetBtn) {
            targetTab.classList.add('active');
            targetBtn.classList.add('active');
            this.currentTab = tabName;
            
            // Render content for the active tab
            if (tabName === 'buildings') {
                this.renderBuildings();
            } else if (tabName === 'departments') {
                this.renderDepartments();
            }
        }
    }

    // Critical: Fast UI update loop at 50ms (20 FPS)
    startFastUIUpdates() {
        this.fastUIUpdateInterval = setInterval(() => {
            this.updateTaskButtonStates();
            this.updateUnlockButtonStates();
            this.updateMultiBuyButtonStates();
            this.updateShopItemStates();
            this.updateBuildingButtonStates(); // NEW
        }, 50);
    }

    // NEW: Update building button states
    updateBuildingButtonStates() {
        document.querySelectorAll('.unlock-building-btn').forEach(btn => {
            const buildingId = btn.getAttribute('data-building-id');
            if (!buildingId) return;

            const building = this.gameData.buildings.find(b => b.id === buildingId);
            if (!building) return;

            const canAfford = this.gameState.bp >= building.unlockCost;
            btn.disabled = !canAfford;
            btn.className = `unlock-building-btn btn btn--sm ${canAfford ? 'btn--primary affordable' : 'btn--secondary locked'}`;
        });

        document.querySelectorAll('.upgrade-building-btn').forEach(btn => {
            const buildingId = btn.getAttribute('data-building-id');
            if (!buildingId) return;

            const buildingState = this.gameState.buildings[buildingId];
            if (!buildingState || !buildingState.unlocked) {
                btn.disabled = true;
                btn.className = 'upgrade-building-btn btn btn--sm btn--secondary disabled';
                return;
            }

            const amount = this.multiBuyAmount === 'max' ? 10 : parseInt(this.multiBuyAmount);
            const cost = this.calculateBuildingCost(buildingId, amount);
            const canAfford = this.gameState.bp >= cost && amount > 0;
            
            btn.disabled = !canAfford;
            btn.className = `upgrade-building-btn btn btn--sm ${canAfford ? 'btn--primary affordable' : 'btn--secondary locked'}`;
            
            // Update cost display
            const newText = `${this.translations[this.currentLanguage].upgrade} ${amount > 1 ? `(${amount}x)` : ''} (${this.formatNumber(cost)})`;
            if (btn.textContent !== newText) {
                btn.textContent = newText;
            }
        });
    }

    // Instant button state updates
    updateTaskButtonStates() {
        document.querySelectorAll('.task-actions .btn').forEach(btn => {
            const taskId = btn.getAttribute('data-task-id');
            const action = btn.getAttribute('data-action');
            if (!taskId || !action) return;

            const taskState = this.gameState.tasks[taskId];
            if (!taskState || !taskState.unlocked) {
                btn.disabled = true;
                btn.className = `btn btn--sm btn--secondary disabled`;
                btn.classList.remove('cost-affordable');
                btn.classList.add('cost-unaffordable');
                return;
            }

            if (action === 'upgrade') {
                const amount = this.multiBuyAmount === 'max' ? this.calculateMaxBuyAmount(taskId) : parseInt(this.multiBuyAmount);
                const cost = this.calculateMultiBuyCost(taskId, amount);
                const canAfford = this.gameState.bp >= cost && amount > 0;

                btn.disabled = !canAfford;
                btn.className = `btn btn--sm ${canAfford ? 'btn--primary' : 'btn--secondary disabled'}`;

                const newText = `${this.translations[this.currentLanguage].upgrade} ${amount > 1 ? `(${amount}x)` : ''} (${this.formatNumber(cost)})`;
                if (btn.textContent !== newText) {
                    btn.textContent = newText;
                }

                if (canAfford) {
                    btn.classList.add('cost-affordable');
                    btn.classList.remove('cost-unaffordable');
                } else {
                    btn.classList.add('cost-unaffordable');
                    btn.classList.remove('cost-affordable');
                }
            } else if (action === 'ascend') {
                const maxAscends = this.gameData.rankKeys.length;
                const isAscendMax = taskState.ascensions >= maxAscends;
                btn.textContent = isAscendMax ? (this.currentLanguage === "pl" ? "Max. Awans" : "Max Ascend") : this.translations[this.currentLanguage].ascend;
                
                const canAscend = taskState.level >= 10 && taskState.ascensions < maxAscends;
                btn.disabled = !canAscend;
                btn.className = `btn btn--sm ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}`;
                
                if (!canAscend) btn.setAttribute('title', 'Osiągnięto najwyższą rangę');
                else btn.removeAttribute('title');
            }
        });
    }

    updateUnlockButtonStates() {
        document.querySelectorAll('.unlock-task-btn').forEach(btn => {
            const taskId = btn.getAttribute('data-task-id');
            if (!taskId) return;

            const taskData = this.gameData.tasks.find(t => t.id === taskId);
            if (!taskData) return;

            const canAfford = this.gameState.bp >= taskData.unlockCost;
            btn.disabled = !canAfford;
            btn.className = `unlock-task-btn ${canAfford ? 'affordable' : 'locked'}`;

            if (canAfford && !btn.classList.contains('affordable')) {
                btn.classList.add('affordable');
                btn.classList.remove('locked');
            } else if (!canAfford && !btn.classList.contains('locked')) {
                btn.classList.add('locked');
                btn.classList.remove('affordable');
            }
        });
    }

    updateMultiBuyButtonStates() {
        document.querySelectorAll('.multibuy-btn').forEach(btn => {
            const amount = btn.getAttribute('data-amount');
            if (amount === 'max') return;

            let anyAffordable = false;
            Object.keys(this.gameState.tasks).forEach(taskId => {
                const taskState = this.gameState.tasks[taskId];
                if (taskState && taskState.unlocked) {
                    const cost = this.calculateMultiBuyCost(taskId, parseInt(amount));
                    if (this.gameState.bp >= cost) {
                        anyAffordable = true;
                    }
                }
            });

            // NEW: Check buildings affordability too
            Object.keys(this.gameState.buildings).forEach(buildingId => {
                const buildingState = this.gameState.buildings[buildingId];
                if (buildingState && buildingState.unlocked) {
                    const cost = this.calculateBuildingCost(buildingId, parseInt(amount));
                    if (this.gameState.bp >= cost) {
                        anyAffordable = true;
                    }
                }
            });

            if (anyAffordable) {
                btn.classList.add('affordable');
                btn.classList.remove('unaffordable');
            } else {
                btn.classList.add('unaffordable');
                btn.classList.remove('affordable');
            }
        });
    }

    updateShopItemStates() {
        document.querySelectorAll('.shop-item').forEach(item => {
            const itemId = item.getAttribute('data-item-id');
            if (!itemId) return;

            const deskItem = this.gameData.deskItems.find(d => d.id === itemId);
            if (!deskItem) return;

            const owned = this.gameState.deskItems[itemId];
            const canAfford = !owned && this.gameState.softSkills >= deskItem.cost;

            if (canAfford) {
                item.classList.add('affordable');
            } else {
                item.classList.remove('affordable');
            }
        });
    }

    checkFeatureUnlocks() {
        // Unlock desk tab after earning first soft skill
        if (this.gameState.softSkills > 0 && !this.gameState.features.deskUnlocked) {
            this.gameState.features.deskUnlocked = true;
            document.querySelector('[data-tab="desk"]').classList.remove('disabled');
        }

        // NEW: Unlock buildings tab after first prestige
        if (this.gameState.prestigeCount > 0 && !this.gameState.features.buildingsUnlocked) {
            this.gameState.features.buildingsUnlocked = true;
            document.querySelector('[data-tab="buildings"]').classList.remove('disabled');
        }

        // NEW: Unlock departments tab after prestige level 4
        if (this.gameState.prestigeLevel >= 4 && !this.gameState.features.departmentsUnlocked) {
            this.gameState.features.departmentsUnlocked = true;
            document.querySelector('[data-tab="departments"]').classList.remove('disabled');
        }

        // Unlock multi-buy after 50 upgrades
        if (this.gameState.stats.upgradesBought >= 50 && !this.gameState.features.multiBuyUnlocked) {
            this.gameState.features.multiBuyUnlocked = true;
            document.getElementById('multibuy-controls').classList.remove('hidden');
        }

        // Unlock max buy after multibuy expert achievement
        if (this.gameState.achievements.multibuy_expert && !this.gameState.features.maxBuyUnlocked) {
            this.gameState.features.maxBuyUnlocked = true;
            document.querySelector('[data-amount="max"]').classList.remove('hidden');
        }

        // Unlock auto-buyer after buying autobuyer desk item
        if (this.gameState.deskItems.autobuyer && !this.gameState.features.autoBuyerUnlocked) {
            this.gameState.features.autoBuyerUnlocked = true;
            document.getElementById('autobuyer-controls').classList.remove('hidden');
        }

        // Unlock challenges after buying challenges desk item
        if (this.gameState.deskItems.challenges && !this.gameState.features.challengesUnlocked) {
            this.gameState.features.challengesUnlocked = true;
            document.querySelector('[data-tab="challenges"]').classList.remove('disabled');
        }

        // Unlock prestige break after 10 prestiges
        if (this.gameState.prestigeCount >= 10 && !this.gameState.features.prestigeBreakUnlocked) {
            this.gameState.features.prestigeBreakUnlocked = true;
            document.getElementById('prestige-break-info').classList.remove('hidden');
        }

        // NEW: Auto-unlock buildings based on BP thresholds
        this.gameData.buildings.forEach(building => {
            const buildingState = this.gameState.buildings[building.id];
            if (!buildingState.unlocked && this.gameState.totalBPEarned >= building.unlockCost) {
                buildingState.unlocked = true;
                this.showNotification(`Building unlocked: ${this.translations[this.currentLanguage][building.nameKey]}`);
            }
        });

        // NEW: Auto-unlock departments based on total BP earned
        this.gameData.departments.forEach(dept => {
            const deptState = this.gameState.departments[dept.id];
            if (!deptState.unlocked && this.gameState.totalBPEarned >= dept.unlockCost) {
                deptState.unlocked = true;
                this.showNotification(`Department unlocked: ${this.translations[this.currentLanguage][dept.nameKey]}`);
            }
        });
    }

    startAutoBuyer() {
        this.autoBuyerInterval = setInterval(() => {
            this.performAutoBuy();
        }, 1000);
    }

    stopAutoBuyer() {
        if (this.autoBuyerInterval) {
            clearInterval(this.autoBuyerInterval);
            this.autoBuyerInterval = null;
        }
    }

    performAutoBuy() {
        if (!this.autoBuyerEnabled) return;

        // Find cheapest affordable upgrade
        let cheapestUpgrade = null;
        let cheapestCost = Infinity;
        let upgradeType = null;

        // Check tasks
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState || !taskState.unlocked) return;

            const cost = this.calculateUpgradeCost(taskId);
            if (cost <= this.gameState.bp && cost < cheapestCost) {
                cheapestCost = cost;
                cheapestUpgrade = taskId;
                upgradeType = 'task';
            }
        });

        // NEW: Check buildings
        Object.keys(this.gameState.buildings).forEach(buildingId => {
            const buildingState = this.gameState.buildings[buildingId];
            if (!buildingState || !buildingState.unlocked) return;

            const cost = this.calculateBuildingCost(buildingId, 1);
            if (cost <= this.gameState.bp && cost < cheapestCost) {
                cheapestCost = cost;
                cheapestUpgrade = buildingId;
                upgradeType = 'building';
            }
        });

        if (cheapestUpgrade) {
            if (upgradeType === 'task') {
                this.upgradeTask(cheapestUpgrade);
            } else if (upgradeType === 'building') {
                this.upgradeBuildingLevel(cheapestUpgrade, 1);
            }
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                if (key === 'help_content') {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        document.getElementById('language-select').value = this.currentLanguage;
        document.documentElement.lang = this.currentLanguage;
    }

    updateTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.gameState.settings.theme);
        document.getElementById('theme-select').value = this.gameState.settings.theme;
        document.getElementById('number-format-select').value = this.gameState.settings.numberFormat || 'auto';
    }

    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            this.gameLoop();
        }, 100);

        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000);
    }

    startQuoteRotation() {
        const rotateQuote = () => {
            const quotes = this.gameData.quotes[this.currentLanguage];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote-text').textContent = randomQuote;
        };

        rotateQuote();
        this.quoteInterval = setInterval(rotateQuote, 15000);
    }

    gameLoop() {
        this.updateEnergy();
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // Update task progress and generate BP
        let totalBPGained = 0;
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState || !taskState.unlocked) return;
            if (!this.gameState.focus.includes(taskId)) return;

            const taskData = this.gameData.tasks.find(t => t.id === taskId);
            if (!taskData) return;

            const idleRate = this.calculateTaskIdleRate(taskId);
            const cycleTime = taskData.cycleTime / 1000;
            const progressIncrement = deltaTime / 1000 / cycleTime;
            
            taskState.progress += progressIncrement;

            if (taskState.progress >= 1) {
                const cycles = Math.floor(taskState.progress);
                taskState.progress = taskState.progress % 1;
                totalBPGained += idleRate * cycles;
            }
        });

        if (totalBPGained > 0) {
            const oldBP = this.gameState.bp;
            this.updateBP(this.gameState.bp + totalBPGained);
            this.gameState.totalBPEarned += totalBPGained;
            this.updateDisplay();
        }

        // Update play time
        this.gameState.stats.playTime += deltaTime;

        // Check achievements
        this.checkAchievements();
        this.checkFeatureUnlocks();

        // Update task progress display
        this.updateTaskProgress();
        this.updateUnlockProgress();
    }

    updateEnergy() {
        const now = Date.now();
        const timePassed = now - this.gameState.lastEnergyUpdate;
        const energyToAdd = Math.floor(timePassed / (10 * 60 * 1000));

        if (energyToAdd > 0) {
            this.gameState.energy = Math.min(
                this.gameState.energy + energyToAdd,
                this.gameState.maxEnergy
            );
            this.gameState.lastEnergyUpdate = now;
        }
    }

    useSkill(skillName) {
        const skills = {
            coffeeBreak: { cost: 25, duration: 15 * 60 * 1000, multiplier: 2 },
            focusMode: { cost: 40, duration: 20 * 60 * 1000, bonus: 1.5 },
            overtime: { cost: 60, duration: 30 * 60 * 1000, extraSlot: 1 }
        };

        const skill = skills[skillName];
        if (!skill || this.gameState.energy < skill.cost) return false;

        this.gameState.energy -= skill.cost;
        this.gameState.activeSkills[skillName] = Date.now() + skill.duration;
        this.saveGameState();
        return true;
    }

    watchAdForEnergy() {
        if (!this.adsAvailable) {
            this.showNotification(
                this.currentLanguage === 'pl' ? "Reklamy nie są teraz dostępne" : "Ads are not available right now"
            );
            return false;
        }

        const now = Date.now();
        const daysSinceEpoch = Math.floor(now / (24 * 60 * 60 * 1000));

        if (this.gameState.lastAdDay !== daysSinceEpoch) {
            this.gameState.adsWatchedToday = 0;
            this.gameState.lastAdDay = daysSinceEpoch;
        }

        if (this.gameState.adsWatchedToday >= 5) {
            this.showNotification("Daily ad limit reached!");
            return false;
        }

        if (now - this.gameState.lastAdWatch < 10 * 60 * 1000) {
            this.showNotification("Please wait 10 minutes between ads");
            return false;
        }

        this.showRewardedAd(() => {
            this.gameState.energy = Math.min(this.gameState.energy + 20, 100);
            this.gameState.adsWatchedToday++;
            this.gameState.lastAdWatch = now;
            this.showNotification("Energy refilled! (+20)");
            this.updateDisplay();
        });
    }

    showRewardedAd(onComplete) {
        // Integration with real SDK (AdMob, Unity Ads, etc.)
        // Temporarily: simulation
        if (confirm("Watch 30-second ad for 20 energy?")) {
            setTimeout(onComplete, 3000);
        }
    }

    calculateTaskIdleRate(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        let rate = taskData.baseIdle * Math.pow(taskData.idleMultiplier, taskState.level - 1);

        // Apply ascension multiplier
        rate *= Math.pow(2, taskState.ascensions);

        // Apply global multipliers
        rate *= this.getGlobalMultiplier();

        // Segment bonus
        const segment = Math.floor((taskState.level - 1) / 10);
        if (segment > 0) {
            rate *= Math.pow(1.05, segment);
        }

        // Active task bonuses
        const isActive = this.gameState.focus.includes(taskId);
        if (isActive) {
            Object.keys(this.gameState.deskItems).forEach(id => {
                if (!this.gameState.deskItems[id]) return;
                const item = this.gameData.deskItems.find(d => d.id === id);
                if (item && item.bonus.type === 'all_active_boost') {
                    rate *= item.bonus.value;
                }
            });
        }

        // Mug bonus (first active task only)
        if (this.gameState.deskItems['mug'] && 
            this.gameState.focus.length > 0 && 
            this.gameState.focus[0] === taskId) {
            const item = this.gameData.deskItems.find(d => d.id === 'mug');
            if (item) rate *= item.bonus.value;
        }

        // Night boost (22:00-6:00)
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 6) {
            Object.keys(this.gameState.deskItems).forEach(id => {
                if (!this.gameState.deskItems[id]) return;
                const item = this.gameData.deskItems.find(d => d.id === id);
                if (item && item.bonus.type === 'night_boost') {
                    rate *= item.bonus.value;
                }
            });
        }

        // NEW: Building bonuses for specific tasks
        const buildingEffects = this.getBuildingEffects();
        if (buildingEffects.taskBoosts[taskId]) {
            rate *= buildingEffects.taskBoosts[taskId];
        }

        // NEW: Department synergy bonuses
        this.gameData.departments.forEach(dept => {
            if (dept.tasks.includes(taskId) && this.gameState.departments[dept.id].unlocked) {
                const synergyBonus = this.calculateDepartmentSynergy(dept.id);
                rate *= synergyBonus;
            }
        });

        // Softcap
        rate = this.softcap(rate, 30000, 0.7, 800000, 0.55);

        // Active skills
        const now = Date.now();
        if (this.gameState.activeSkills.coffeeBreak && now < this.gameState.activeSkills.coffeeBreak) {
            rate *= 2;
        }
        if (this.gameState.activeSkills.focusMode && now < this.gameState.activeSkills.focusMode) {
            rate *= 1.5;
        }

        return rate;
    }

    getMaxFocusSlots() {
        let base = 4;

        // Desk items
        Object.keys(this.gameState.deskItems).forEach(id => {
            if (this.gameState.deskItems[id]) {
                const item = this.gameData.deskItems.find(d => d.id === id);
                if (item && item.bonus.type === "focus_slot") {
                    base += item.bonus.value;
                }
            }
        });

        // NEW: Building bonuses
        const buildingEffects = this.getBuildingEffects();
        base += buildingEffects.maxFocus;

        // Overtime skill
        const now = Date.now();
        if (this.gameState.activeSkills.overtime && now < this.gameState.activeSkills.overtime) {
            base += 1;
        }

        return base;
    }

    getGlobalMultiplier() {
        let multiplier = 1;

        // Prestige multiplier
        multiplier *= Math.pow(1.1, this.gameState.prestigeCount);

        // Desk item bonuses
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && (item.bonus.type === 'global_mult' || item.bonus.type === 'idle_mult')) {
                    multiplier *= item.bonus.value;
                }
            }
        });

        // Achievement bonuses
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward.type === 'bp_bonus') {
                    multiplier *= achievement.reward.value;
                }
            }
        });

        // NEW: Building global multiplier
        const buildingEffects = this.getBuildingEffects();
        multiplier *= buildingEffects.globalMultiplier;

        // Progressive softcap
        multiplier = this.softcap(multiplier, 10000, 0.7, 1_000_000, 0.5);

        return multiplier;
    }

    // Softcap implementation
    softcap(value, threshold1, exponent1, threshold2, exponent2) {
        if (value <= threshold1) return value;
        
        if (value <= threshold2) {
            const excess = value - threshold1;
            return threshold1 + Math.pow(excess, exponent1);
        }
        
        const firstSoftcap = threshold1 + Math.pow(threshold2 - threshold1, exponent1);
        const excess = value - threshold2;
        return firstSoftcap + Math.pow(excess, exponent2);
    }

    // Critical: Manual unlock system - ALL tasks require manual unlocking
    manualUnlockTask(taskId, skipCost = false) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        if (!taskData) return false;

        const taskState = this.gameState.tasks[taskId];
        if (taskState && taskState.unlocked) return false;

        if (!skipCost && this.gameState.bp < taskData.unlockCost) return false;

        // Deduct cost
        if (!skipCost) {
            this.updateBP(this.gameState.bp - taskData.unlockCost);
            this.gameState.totalBPSpent += taskData.unlockCost;
        }

        // Unlock task
        if (!this.gameState.tasks[taskId]) {
            this.gameState.tasks[taskId] = {
                level: 1,
                progress: 0,
                unlocked: true,
                ascensions: 0,
                locked: false
            };
        } else {
            this.gameState.tasks[taskId].unlocked = true;
            this.gameState.tasks[taskId].locked = false;
        }

        this.gameState.stats.totalUnlocks++;
        this.gameState.stats.tasksUnlocked++;

        // Trigger events
        this.triggerEvent('taskUnlock', { taskId });
        this.checkAchievements();
        this.renderTasks();
        this.updateTaskButtonStates();
        this.updateDisplay();

        // Auto-focus: if there's a free slot, add the newly unlocked task
        if (!this.gameState.focus.includes(taskId) && this.gameState.focus.length < this.getMaxFocusSlots()) {
            this.gameState.focus.push(taskId);
        }

        return true;
    }

    checkAchievements() {
        this.gameData.achievements.forEach(achievement => {
            if (this.gameState.achievements[achievement.id]) return;

            let unlocked = false;
            switch (achievement.condition.type) {
                case 'tasks_unlocked':
                    unlocked = this.gameState.stats.tasksUnlocked >= achievement.condition.value;
                    break;
                case 'upgrades_bought':
                    unlocked = this.gameState.stats.upgradesBought >= achievement.condition.value;
                    break;
                case 'task_unlocked':
                    const taskState = this.gameState.tasks[achievement.condition.taskId];
                    unlocked = taskState && taskState.unlocked;
                    break;
                case 'task_level':
                    const taskLevel = this.gameState.tasks[achievement.condition.taskId];
                    unlocked = taskLevel && taskLevel.level >= achievement.condition.value;
                    break;
                case 'ascensions':
                    unlocked = this.gameState.stats.totalAscensions >= achievement.condition.value;
                    break;
                case 'bp_spent':
                    unlocked = this.gameState.totalBPSpent >= achievement.condition.value;
                    break;
                case 'prestiges':
                    unlocked = this.gameState.prestigeCount >= achievement.condition.value;
                    break;
                case 'multibuy_used':
                    unlocked = this.gameState.stats.totalMultiBuys >= achievement.condition.value;
                    break;
                case 'total_ascensions':
                    unlocked = this.gameState.stats.totalAscensions >= achievement.condition.value;
                    break;
                case 'idle_rate':
                    const totalIdleRate = Object.keys(this.gameState.tasks).reduce((sum, taskId) => {
                        const taskState = this.gameState.tasks[taskId];
                        if (taskState && taskState.unlocked) {
                            return sum + this.calculateTaskIdleRate(taskId);
                        }
                        return sum;
                    }, 0);
                    unlocked = totalIdleRate >= achievement.condition.value;
                    break;
                case 'play_time':
                    unlocked = this.gameState.stats.playTime >= achievement.condition.value;
                    break;
                case 'soft_skills_earned':
                    unlocked = this.gameState.stats.softSkillsEarned >= achievement.condition.value;
                    break;
                case 'desk_items_bought':
                    unlocked = this.gameState.stats.deskItemsBought >= achievement.condition.value;
                    break;
                case 'challenges_completed':
                    unlocked = this.gameState.stats.challengesCompleted >= achievement.condition.value;
                    break;
                // NEW: Building & Department achievements
                case 'buildings_unlocked':
                    unlocked = this.gameState.stats.buildingsUnlocked >= achievement.condition.value;
                    break;
                case 'total_building_levels':
                    unlocked = this.gameState.stats.totalBuildingLevels >= achievement.condition.value;
                    break;
                case 'departments_synergy':
                    let activeSynergies = 0;
                    this.gameData.departments.forEach(dept => {
                        if (this.calculateDepartmentSynergy(dept.id) > 1.0) {
                            activeSynergies++;
                        }
                    });
                    unlocked = activeSynergies >= achievement.condition.value;
                    break;
                case 'prestige_level':
                    unlocked = this.gameState.prestigeLevel >= achievement.condition.value;
                    break;
            }

            if (unlocked) {
                this.gameState.achievements[achievement.id] = true;
                this.triggerEvent('achievementUnlock', { achievementId: achievement.id });
                this.renderAchievements();
                this.checkFeatureUnlocks();
                this.showNotification(`Achievement: ${this.translations[this.currentLanguage][achievement.nameKey] || achievement.nameKey}`);
            }
        });
    }

    calculateMultiBuyCost(taskId, amount) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        let totalCost = 0;
        let currentLevel = taskState.level;

        for (let i = 0; i < amount; i++) {
            let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);
            
            const segment = Math.floor(currentLevel / 10);
            if (segment > 0) {
                cost *= (1 + 0.10 * segment);
            }

            // Apply upgrade discount from desk items and achievements
            Object.keys(this.gameState.deskItems).forEach(itemId => {
                if (this.gameState.deskItems[itemId]) {
                    const item = this.gameData.deskItems.find(d => d.id === itemId);
                    if (item && item.bonus.type === 'upgrade_discount') {
                        cost *= item.bonus.value;
                    }
                }
            });

            Object.keys(this.gameState.achievements).forEach(achId => {
                if (this.gameState.achievements[achId]) {
                    const achievement = this.gameData.achievements.find(a => a.id === achId);
                    if (achievement && achievement.reward.type === 'upgrade_discount') {
                        cost *= achievement.reward.value;
                    }
                }
            });

            // NEW: Apply building upgrade discount
            const buildingEffects = this.getBuildingEffects();
            cost *= buildingEffects.upgradeDiscount;

            totalCost += cost;
            currentLevel++;
        }

        return Math.floor(totalCost);
    }

    calculateMaxBuyAmount(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        let amount = 0;
        let totalCost = 0;
        let currentLevel = taskState.level;

        while (totalCost <= this.gameState.bp && amount < 50) {
            let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);

            // Apply upgrade discount
            Object.keys(this.gameState.deskItems).forEach(itemId => {
                if (this.gameState.deskItems[itemId]) {
                    const item = this.gameData.deskItems.find(d => d.id === itemId);
                    if (item && item.bonus.type === 'upgrade_discount') {
                        cost *= item.bonus.value;
                    }
                }
            });

            if (totalCost + cost <= this.gameState.bp) {
                totalCost += cost;
                amount++;
                currentLevel++;
            } else {
                break;
            }
        }

        return amount;
    }

    upgradeTask(taskId) {
        const amount = this.multiBuyAmount === 'max' ? this.calculateMaxBuyAmount(taskId) : parseInt(this.multiBuyAmount);
        if (amount === 0) return;

        const cost = this.calculateMultiBuyCost(taskId, amount);
        if (this.gameState.bp >= cost) {
            this.updateBP(this.gameState.bp - cost);
            this.gameState.totalBPSpent += cost;
            this.gameState.tasks[taskId].level += amount;
            this.gameState.stats.totalUpgrades += amount;
            this.gameState.stats.upgradesBought += amount;

            if (amount >= 25) {
                this.gameState.stats.totalMultiBuys += amount;
            }

            this.checkAchievements();
            this.renderTasks();
            this.updateTaskButtonStates();
            this.updateDisplay();

            // Visual feedback
            const btn = document.querySelector(`[data-task-id="${taskId}"][data-action="upgrade"]`);
            if (btn) {
                btn.classList.add('btn-flash');
                setTimeout(() => btn.classList.remove('btn-flash'), 300);
            }
        }
    }

    calculateUpgradeCost(taskId) {
        return this.calculateMultiBuyCost(taskId, 1);
    }

    ascendTask(taskId) {
        const taskState = this.gameState.tasks[taskId];
        const maxAscends = this.gameData.rankKeys.length;
        
        if (taskState.level < 10) return;
        if (taskState.ascensions >= maxAscends) return;

        taskState.level = 1;
        taskState.ascensions++;
        taskState.progress = 0;
        this.gameState.stats.totalAscensions++;

        this.checkAchievements();
        this.renderTasks();
        this.updateTaskButtonStates();
        this.showNotification(`Task ascended: ${this.translations[this.currentLanguage][this.gameData.tasks.find(t => t.id === taskId).nameKey]}`);
    }

    // NEW: Enhanced prestige system with levels
    performPrestige() {
        const threshold = this.gameState.features.prestigeBreakUnlocked ? this.gameData.prestigeBreakThreshold : this.gameData.prestigeThreshold;
        
        if (this.gameState.totalBPEarned < threshold) return;

        // Calculate prestige level and soft skills gain
        let prestigeLevel = 0;
        let softSkillsGain = 1; // Default

        // Find highest achievable prestige level
        for (let level of this.gameData.prestigeLevels) {
            if (this.gameState.totalBPEarned >= level.threshold) {
                prestigeLevel = level.level;
                if (this.isSoftSkillCapUnlocked()) {
                    softSkillsGain = level.softSkillsBase;
                }
            }
        }

        // Apply prestige level bonuses
        this.gameState.prestigeLevel = Math.max(this.gameState.prestigeLevel, prestigeLevel);

        // SAVE elements that persist through prestige
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const featuresState = { ...this.gameState.features };
        const challengesState = { ...this.gameState.challenges };
        const buildingsToKeep = { ...this.gameState.buildings }; // NEW: Buildings persist
        const departmentsToKeep = { ...this.gameState.departments }; // NEW: Departments persist
        const prestigeLevelToKeep = this.gameState.prestigeLevel; // NEW: Prestige level persists

        // TOTAL RESET: everything except achievements, desk items, settings, features, challenges, buildings, departments
        this.gameState = this.loadGameState();

        // All tasks become locked after prestige
        this.gameData.tasks.forEach(task => {
            this.gameState.tasks[task.id] = {
                level: 1,
                progress: 0,
                unlocked: false,
                ascensions: 0,
                locked: true
            };
        });

        // Add SS and count to statistics
        this.gameState.softSkills += softSkillsGain;
        this.gameState.stats.softSkillsEarned += softSkillsGain;
        this.gameState.prestigeCount++;
        this.gameState.prestigeLevel = prestigeLevelToKeep; // NEW: Restore prestige level

        // Restore saved elements
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.features = featuresState;
        this.gameState.challenges = challengesState;
        this.gameState.buildings = buildingsToKeep; // NEW: Restore buildings
        this.gameState.departments = departmentsToKeep; // NEW: Restore departments

        // BP = 0 after prestige!
        this.gameState.bp = 0;

        // Refresh UI etc.
        this.checkAchievements();
        this.checkFeatureUnlocks();
        this.renderAll();

        // Create cap message
        let capMessage = "";
        if (!this.isSoftSkillCapUnlocked()) {
            const warningText = this.translations[this.currentLanguage]?.prestige_limit_warning;
            if (warningText) {
                const firstPart = warningText.split('.')[0];
                capMessage = ` (${firstPart})`;
            } else {
                capMessage = " (Soft Skill cap active)";
            }
        }

        this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skill${softSkillsGain > 1 ? "s" : ""}!${capMessage} Prestige Level: ${prestigeLevel}`);
    }

    // NEW: Render buildings
    renderBuildings() {
        const container = document.getElementById('buildings-container');
        const effectsContainer = document.getElementById('building-effects-summary');
        if (!container) return;

        container.innerHTML = '';

        this.gameData.buildings.forEach(building => {
            const buildingState = this.gameState.buildings[building.id];
            const card = document.createElement('div');
            card.className = `building-card ${buildingState.unlocked ? 'unlocked' : 'locked'}`;
            
            const canUnlock = !buildingState.unlocked && this.gameState.bp >= building.unlockCost;
            const canUpgrade = buildingState.unlocked && this.gameState.bp >= this.calculateBuildingCost(building.id, 1);

            card.innerHTML = `
                <div class="building-header">
                    <h4>${this.translations[this.currentLanguage][building.nameKey] || building.nameKey}</h4>
                    <div class="building-level">Lv. ${buildingState.level}</div>
                </div>
                
                <div class="building-effects">
                    <h5>Effects:</h5>
                    <ul>
                        ${Object.entries(building.effects).map(([effect, value]) => {
                            if (effect === 'taskBoost') {
                                return Object.entries(value).map(([taskId, boost]) => 
                                    `<li>+${((boost - 1) * 100).toFixed(0)}% ${this.translations[this.currentLanguage][`task_${taskId}`] || taskId}</li>`
                                ).join('');
                            } else if (effect === 'globalMultiplier') {
                                return `<li>+${((value - 1) * 100).toFixed(0)}% Global Income</li>`;
                            } else if (effect === 'maxFocus') {
                                return `<li>+${value} Focus Slot${value > 1 ? 's' : ''}</li>`;
                            } else if (effect === 'upgradeDiscount') {
                                return `<li>${((1 - value) * 100).toFixed(0)}% Upgrade Discount</li>`;
                            } else {
                                return `<li>${effect}: ${value}</li>`;
                            }
                        }).join('')}
                    </ul>
                </div>
                
                <div class="building-actions">
                    ${!buildingState.unlocked ? `
                        <button class="unlock-building-btn btn btn--sm ${canUnlock ? 'btn--primary' : 'btn--secondary'}" 
                                data-building-id="${building.id}">
                            ${this.translations[this.currentLanguage].unlock} (${this.formatNumber(building.unlockCost)})
                        </button>
                    ` : `
                        <button class="upgrade-building-btn btn btn--sm ${canUpgrade ? 'btn--primary' : 'btn--secondary'}" 
                                data-building-id="${building.id}">
                            ${this.translations[this.currentLanguage].upgrade} (${this.formatNumber(this.calculateBuildingCost(building.id, 1))})
                        </button>
                    `}
                </div>
            `;

            container.appendChild(card);
        });

        // Render building effects summary
        if (effectsContainer) {
            const effects = this.getBuildingEffects();
            effectsContainer.innerHTML = `
                <div class="effects-summary">
                    <p><strong>Active Effects:</strong></p>
                    <ul>
                        <li>Global Multiplier: ${(effects.globalMultiplier * 100).toFixed(0)}%</li>
                        <li>Max Focus Bonus: +${effects.maxFocus}</li>
                        <li>Upgrade Discount: ${((1 - effects.upgradeDiscount) * 100).toFixed(1)}%</li>
                        <li>Idle Bonus: ${(effects.idleBonus * 100).toFixed(0)}%</li>
                    </ul>
                </div>
            `;
        }
    }

    // NEW: Render departments
    renderDepartments() {
        const container = document.getElementById('departments-container');
        if (!container) return;

        container.innerHTML = '';

        this.gameData.departments.forEach(dept => {
            const deptState = this.gameState.departments[dept.id];
            const totalLevel = this.getDepartmentTotalLevel(dept.id);
            const synergyBonus = this.calculateDepartmentSynergy(dept.id);
            const synergyActive = synergyBonus > 1.0;
            
            if (!deptState.unlocked) return; // Only show unlocked departments

            const card = document.createElement('div');
            card.className = `department-card ${synergyActive ? 'synergy-active' : ''}`;
            
            card.innerHTML = `
                <div class="department-header">
                    <h4>${this.translations[this.currentLanguage][dept.nameKey] || dept.nameKey}</h4>
                    ${synergyActive ? '<div class="synergy-badge">Synergy Active!</div>' : ''}
                </div>
                
                <div class="department-tasks">
                    <h5>Tasks in Department:</h5>
                    <ul>
                        ${dept.tasks.map(taskId => {
                            const taskState = this.gameState.tasks[taskId];
                            const taskName = this.translations[this.currentLanguage][`task_${taskId}`] || taskId;
                            return `<li><span>${taskName}</span> <span>Lv. ${taskState ? taskState.level : 1}</span></li>`;
                        }).join('')}
                    </ul>
                </div>
                
                <div class="synergy-section">
                    <h5>Synergy Progress:</h5>
                    <div class="synergy-progress">
                        <div class="synergy-fill" style="width: ${Math.min(100, (totalLevel / dept.synergy.threshold) * 100)}%"></div>
                    </div>
                    <div class="synergy-info">
                        ${totalLevel}/${dept.synergy.threshold} levels 
                        ${synergyActive ? `(+${((synergyBonus - 1) * 100).toFixed(0)}% bonus active!)` : ''}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        if (container.children.length === 0) {
            container.innerHTML = '<div class="no-departments">No departments unlocked yet. Keep playing to unlock departments!</div>';
        }
    }

    renderAll() {
        this.renderTasks();
        this.renderAchievements();
        this.renderDeskItems();
        this.renderChallenges();
        this.renderPrestigeSection();
        this.renderBuildings(); // NEW
        this.renderDepartments(); // NEW
        this.updateDisplay();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        if (!container) return;

        container.innerHTML = '';

        this.gameData.tasks.forEach(task => {
            const taskState = this.gameState.tasks[task.id];
            
            if (!taskState || !taskState.unlocked) {
                // Show unlock button for locked tasks
                if (this.gameState.bp >= task.unlockCost * 0.5 || taskState) { // Show when close to unlocking
                    const unlockCard = document.createElement('div');
                    unlockCard.className = 'task-card locked';
                    unlockCard.innerHTML = `
                        <button class="unlock-task-btn" data-task-id="${task.id}">
                            <div style="font-size: 2em;">🔒</div>
                            <div><strong>${this.translations[this.currentLanguage][task.nameKey]}</strong></div>
                            <div>${this.translations[this.currentLanguage].unlock} (${this.formatNumber(task.unlockCost)} BP)</div>
                        </button>
                    `;
                    container.appendChild(unlockCard);
                }
                return;
            }

            // Render unlocked task
            const card = document.createElement('div');
            card.className = 'task-card';
            
            const isActive = this.gameState.focus.includes(task.id);
            const idleRate = this.calculateTaskIdleRate(task.id);
            const upgradeCost = this.calculateUpgradeCost(task.id);
            const rank = this.gameData.rankKeys[Math.min(taskState.ascensions, this.gameData.rankKeys.length - 1)];
            
            card.innerHTML = `
                <div class="task-header">
                    <div class="task-name">${this.translations[this.currentLanguage][task.nameKey]}</div>
                    <div class="task-rank">${this.translations[this.currentLanguage][rank]}</div>
                </div>
                
                <div class="task-stats">
                    <div class="task-stat">
                        <div class="stat-label">${this.translations[this.currentLanguage].level}</div>
                        <div class="stat-value">${taskState.level}</div>
                    </div>
                    <div class="task-stat">
                        <div class="stat-label">BP${this.translations[this.currentLanguage].per_second}</div>
                        <div class="stat-value">${this.formatNumber(idleRate)}</div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="btn btn--sm btn--primary" data-task-id="${task.id}" data-action="upgrade">
                        ${this.translations[this.currentLanguage].upgrade} (${this.formatNumber(upgradeCost)})
                    </button>
                    <button class="btn btn--sm btn--outline" data-task-id="${task.id}" data-action="ascend">
                        ${this.translations[this.currentLanguage].ascend}
                    </button>
                </div>
            `;

            // Add focus toggle functionality
            card.addEventListener('click', (e) => {
                if (e.target.closest('.task-actions')) return; // Don't toggle on button clicks
                
                const maxSlots = this.getMaxFocusSlots();
                const focusIndex = this.gameState.focus.indexOf(task.id);
                
                if (focusIndex >= 0) {
                    // Remove from focus
                    this.gameState.focus.splice(focusIndex, 1);
                    card.classList.remove('focused');
                } else if (this.gameState.focus.length < maxSlots) {
                    // Add to focus
                    this.gameState.focus.push(task.id);
                    card.classList.add('focused');
                } else {
                    this.showNotification(`Maximum ${maxSlots} focus slots reached!`);
                }
                
                this.updateTaskDisplay();
            });

            if (isActive) {
                card.classList.add('focused');
            }

            // Task upgrade button
            const upgradeBtn = card.querySelector('[data-action="upgrade"]');
            upgradeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.upgradeTask(task.id);
            });

            // Task ascend button
            const ascendBtn = card.querySelector('[data-action="ascend"]');
            ascendBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.ascendTask(task.id);
            });

            container.appendChild(card);
        });

        // Add unlock task button event listeners
        document.querySelectorAll('.unlock-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.unlock-task-btn').getAttribute('data-task-id');
                this.manualUnlockTask(taskId);
            });
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        container.innerHTML = '';

        this.gameData.achievements.forEach(achievement => {
            const unlocked = this.gameState.achievements[achievement.id] || false;
            
            const card = document.createElement('div');
            card.className = `achievement ${unlocked ? 'unlocked' : ''}`;
            
            card.innerHTML = `
                <div class="achievement-icon">${unlocked ? '✅' : '❓'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${this.translations[this.currentLanguage][achievement.nameKey]}</div>
                    <div class="achievement-desc">${this.translations[this.currentLanguage][achievement.descKey]}</div>
                    <div class="achievement-bonus">${this.translations[this.currentLanguage][achievement.bonusDesc] || achievement.bonusDesc}</div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    renderDeskItems() {
        const container = document.getElementById('shop-items');
        if (!container) return;

        container.innerHTML = '';

        this.gameData.deskItems.forEach(item => {
            const owned = this.gameState.deskItems[item.id] || false;
            const canAfford = !owned && this.gameState.softSkills >= item.cost;
            
            const shopItem = document.createElement('div');
            shopItem.className = `shop-item ${owned ? 'owned' : ''} ${canAfford ? 'affordable' : ''}`;
            shopItem.setAttribute('data-item-id', item.id);
            
            shopItem.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${this.translations[this.currentLanguage][item.nameKey]}</div>
                    <div class="shop-item-bonus">${this.translations[this.currentLanguage][item.bonusDesc]}</div>
                    <div class="shop-item-cost">${owned ? 'Owned' : `${item.cost} SS`}</div>
                </div>
                ${!owned ? `<button class="btn btn--sm btn--primary shop-buy-btn">${this.translations[this.currentLanguage].buy}</button>` : ''}
            `;

            if (!owned) {
                const buyBtn = shopItem.querySelector('.shop-buy-btn');
                buyBtn.addEventListener('click', () => {
                    this.buyDeskItem(item.id);
                });
            }

            container.appendChild(shopItem);
        });
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId]) return;

        if (this.gameState.softSkills >= item.cost) {
            this.gameState.softSkills -= item.cost;
            this.gameState.deskItems[itemId] = true;
            this.gameState.stats.deskItemsBought++;
            
            this.checkAchievements();
            this.checkFeatureUnlocks();
            this.renderDeskItems();
            this.updateDisplay();
            
            this.showNotification(`Purchased: ${this.translations[this.currentLanguage][item.nameKey]}`);
        }
    }

    renderChallenges() {
        const container = document.getElementById('challenges-list');
        if (!container) return;

        container.innerHTML = '';

        this.gameData.challenges.forEach(challenge => {
            const completed = this.gameState.challenges[challenge.id] || false;
            
            const card = document.createElement('div');
            card.className = `challenge ${completed ? 'completed' : 'in-progress'}`;
            
            card.innerHTML = `
                <div class="challenge-header">
                    <div class="challenge-name">${this.translations[this.currentLanguage][challenge.nameKey]}</div>
                    <div class="challenge-status status ${completed ? 'status--success' : 'status--info'}">
                        ${completed ? this.translations[this.currentLanguage].completed : this.translations[this.currentLanguage].in_progress}
                    </div>
                </div>
                <div class="challenge-desc">${this.translations[this.currentLanguage][challenge.descKey]}</div>
                ${!completed ? `
                    <div class="challenge-progress">
                        <div class="challenge-progress-bar">
                            <div class="challenge-progress-fill" style="width: 30%"></div>
                        </div>
                    </div>
                ` : ''}
            `;

            container.appendChild(card);
        });
    }

    renderPrestigeSection() {
        const threshold = this.gameState.features.prestigeBreakUnlocked ? this.gameData.prestigeBreakThreshold : this.gameData.prestigeThreshold;
        const canPrestige = this.gameState.totalBPEarned >= threshold;
        const prestigeBtn = document.getElementById('prestige-btn');
        const prestigeInfo = document.querySelector('.prestige-info');

        if (canPrestige) {
            prestigeBtn.disabled = false;
            prestigeBtn.classList.remove('disabled');

            // Soft Skill Gain Calculation & Cap
            const potentialGain = this.calculatePrestigeSoftSkillGain(this.gameState.totalBPEarned, threshold);
            const isCapActive = !this.isSoftSkillCapUnlocked();

            // Button style (gradient badges)
            prestigeBtn.classList.toggle('cap-limited', isCapActive);
            prestigeBtn.classList.toggle('cap-unlimited', !isCapActive);

            // Gain message
            let gainMessage;
            if (isCapActive) {
                gainMessage = this.translations[this.currentLanguage].prestige_gain_capped || "You will earn 1 Soft Skill (cap active)";
            } else {
                gainMessage = (this.translations[this.currentLanguage].prestige_gain_unlimited || "You will earn {0} Soft Skill(s)")
                    .replace("{0}", potentialGain);
            }

            prestigeInfo.innerHTML = `
                <div class="prestige-gain-info">
                    <div class="prestige-potential-gain">${gainMessage}</div>
                </div>
                <div>${this.translations[this.currentLanguage].prestige_warning}</div>
                ${isCapActive ? `
                    <div class="prestige-cap-warning">
                        <div class="warning-icon">⚠️</div>
                        <div class="warning-text">${this.translations[this.currentLanguage].prestige_limit_warning}</div>
                    </div>
                ` : `
                    <div class="prestige-cap-unlocked">
                        <div class="success-icon">✨</div>
                        <div class="success-text">${this.translations[this.currentLanguage].prestige_limit_unlocked || "Soft Skill cap has been unlocked!"}</div>
                    </div>
                `}
            `;
        } else {
            prestigeBtn.disabled = true;
            prestigeBtn.classList.add('disabled');
            
            const progress = (this.gameState.totalBPEarned / threshold * 100).toFixed(1);
            prestigeInfo.innerHTML = `
                <div>${this.translations[this.currentLanguage].prestige_progress}: ${progress}%</div>
                <div>Need ${this.formatNumber(threshold - this.gameState.totalBPEarned)} more BP</div>
            `;
        }
    }

    updateDisplay() {
        // Update currency displays
        document.getElementById('bp-display').textContent = this.formatNumber(this.gameState.bp);
        document.getElementById('ss-display').textContent = this.formatNumber(this.gameState.softSkills);
        
        // Update energy display
        const energyDisplay = document.getElementById('energy-display');
        if (energyDisplay) {
            energyDisplay.textContent = `${this.gameState.energy}/${this.gameState.maxEnergy}`;
        }
    }

    updateTaskProgress() {
        // Update task progress bars
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (taskState && taskState.unlocked && this.gameState.focus.includes(taskId)) {
                // Update progress visualization if needed
            }
        });
    }

    updateTaskDisplay() {
        // Update focused task indicators
        document.querySelectorAll('.task-card').forEach(card => {
            const taskId = card.querySelector('[data-task-id]')?.getAttribute('data-task-id');
            if (taskId && this.gameState.focus.includes(taskId)) {
                card.classList.add('focused');
            } else {
                card.classList.remove('focused');
            }
        });
    }

    updateUnlockProgress() {
        const nextTask = this.gameData.tasks.find(task => {
            const taskState = this.gameState.tasks[task.id];
            return !taskState || !taskState.unlocked;
        });

        if (nextTask) {
            const progress = Math.min(100, (this.gameState.bp / nextTask.unlockCost) * 100);
            const progressBar = document.getElementById('unlock-progress-bar');
            const progressLabel = document.getElementById('unlock-progress-label');
            
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressLabel) {
                progressLabel.textContent = `${this.translations[this.currentLanguage].next_unlock}: ${this.translations[this.currentLanguage][nextTask.nameKey]} (${this.formatNumber(nextTask.unlockCost)} BP)`;
            }
        }
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatNumber(num) {
        if (num === 0) return "0";
        
        const format = this.gameState.settings.numberFormat || "auto";
        
        if (format === "scientific") {
            return num.toExponential(2);
        } else if (format === "engineering") {
            const exp = Math.floor(Math.log10(Math.abs(num)) / 3) * 3;
            const mantissa = num / Math.pow(10, exp);
            return `${mantissa.toFixed(2)}E${exp}`;
        } else {
            // Auto format with K/M/B/T
            if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
            if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
            if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
            if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
            return Math.floor(num).toLocaleString();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KorposzczurGame();

    // Add slide animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .task-card.focused {
            border: 2px solid var(--color-success);
            box-shadow: 0 0 20px rgba(var(--color-success-rgb), 0.3);
        }
        .task-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .task-card:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
});