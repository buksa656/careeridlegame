// Korposzczur - Corporate Idle Game - v6 Enhanced with Soft Skill Cap System
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
        this.fastUIUpdateInterval = null; // 50ms updates for buttons
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
            "achievements": [
                {"id": "first_unlock", "nameKey": "ach_first_unlock", "descKey": "ach_first_unlock_desc", "condition": {"type": "tasks_unlocked", "value": 1}, "reward": {"type": "bp_bonus", "value": 1.05}, "bonusDesc": "bonusDesc_bp_5"},
                {"id": "upgrade_novice", "nameKey": "ach_upgrade_novice", "descKey": "ach_upgrade_novice_desc", "condition": {"type": "upgrades_bought", "value": 50}, "reward": {"type": "multibuy_unlock", "value": "upgrades"}, "bonusDesc": "bonusDesc_multibuy_upgrades"},
                {"id": "coffee_lover", "nameKey": "ach_coffee_lover", "descKey": "ach_coffee_lover_desc", "condition": {"type": "task_unlocked", "taskId": "coffee"}, "reward": {"type": "idle_bonus", "value": 1.10}, "bonusDesc": "bonusDesc_idle_10"},
                {"id": "meeting_master", "nameKey": "ach_meeting_master", "descKey": "ach_meeting_master_desc", "condition": {"type": "task_level", "taskId": "meeting", "value": 15}, "reward": {"type": "upgrade_discount", "value": 0.95}, "bonusDesc": "bonusDesc_upgrade_discount_5"},
                {"id": "first_ascend", "nameKey": "ach_first_ascend", "descKey": "ach_first_ascend_desc", "condition": {"type": "ascensions", "value": 1}, "reward": {"type": "career_stats_unlock", "value": 1}, "bonusDesc": "bonusDesc_career_stats"},
                {"id": "kpi_analyst", "nameKey": "ach_kpi_analyst", "descKey": "ach_kpi_analyst_desc", "condition": {"type": "task_unlocked", "taskId": "kpi"}, "reward": {"type": "prestige_bonus", "value": 1.15}, "bonusDesc": "bonusDesc_prestige_15"},
                {"id": "big_spender", "nameKey": "ach_big_spender", "descKey": "ach_big_spender_desc", "condition": {"type": "bp_spent", "value": 25000}, "reward": {"type": "bp_bonus", "value": 1.10}, "bonusDesc": "bonusDesc_bp_10"},
                {"id": "innovation_guru", "nameKey": "ach_innovation_guru", "descKey": "ach_innovation_guru_desc", "condition": {"type": "task_unlocked", "taskId": "brainstorm"}, "reward": {"type": "ascend_bonus", "value": 1.20}, "bonusDesc": "bonusDesc_ascend_20"},
                {"id": "first_prestige", "nameKey": "ach_first_prestige", "descKey": "ach_first_prestige_desc", "condition": {"type": "prestiges", "value": 1}, "reward": {"type": "desk_unlock", "value": 1}, "bonusDesc": "bonusDesc_desk_unlock"},
                {"id": "optimizer", "nameKey": "ach_optimizer", "descKey": "ach_optimizer_desc", "condition": {"type": "task_unlocked", "taskId": "optimize"}, "reward": {"type": "global_mult", "value": 1.30}, "bonusDesc": "bonusDesc_global_30"},
                {"id": "multibuy_expert", "nameKey": "ach_multibuy_expert", "descKey": "ach_multibuy_expert_desc", "condition": {"type": "multibuy_used", "value": 25}, "reward": {"type": "max_buy_unlock", "value": 1}, "bonusDesc": "bonusDesc_max_buy"},
                {"id": "corporate_ladder", "nameKey": "ach_corporate_ladder", "descKey": "ach_corporate_ladder_desc", "condition": {"type": "total_ascensions", "value": 10}, "reward": {"type": "ascend_discount", "value": 0.90}, "bonusDesc": "bonusDesc_ascend_discount_10"},
                {"id": "idle_master", "nameKey": "ach_idle_master", "descKey": "ach_idle_master_desc", "condition": {"type": "idle_rate", "value": 1500}, "reward": {"type": "idle_bonus", "value": 1.15}, "bonusDesc": "bonusDesc_idle_20"},
                {"id": "soft_skills_beginner", "nameKey": "ach_soft_skills_beginner", "descKey": "ach_soft_skills_beginner_desc", "condition": {"type": "soft_skills_earned", "value": 1}, "reward": {"type": "desk_unlock", "value": 1}, "bonusDesc": "bonusDesc_desk_unlock"},
                {"id": "soft_skills_expert", "nameKey": "ach_soft_skills_expert", "descKey": "ach_soft_skills_expert_desc", "condition": {"type": "soft_skills_earned", "value": 10}, "reward": {"type": "prestige_bonus", "value": 1.20}, "bonusDesc": "bonusDesc_prestige_20"},
                {"id": "soft_skills_master", "nameKey": "ach_soft_skills_master", "descKey": "ach_soft_skills_master_desc", "condition": {"type": "soft_skills_earned", "value": 50}, "reward": {"type": "soft_skill_bonus", "value": 1.50}, "bonusDesc": "bonusDesc_soft_skill_50"},
                {"id": "first_desk_item", "nameKey": "ach_first_desk_item", "descKey": "ach_first_desk_item_desc", "condition": {"type": "desk_items_bought", "value": 1}, "reward": {"type": "soft_skill_bonus", "value": 1.10}, "bonusDesc": "bonusDesc_soft_skill_10"},
                {"id": "office_decorator", "nameKey": "ach_office_decorator", "descKey": "ach_office_decorator_desc", "condition": {"type": "desk_items_bought", "value": 3}, "reward": {"type": "desk_discount", "value": 0.90}, "bonusDesc": "bonusDesc_desk_discount_10"},
                {"id": "office_complete", "nameKey": "ach_office_complete", "descKey": "ach_office_complete_desc", "condition": {"type": "desk_items_bought", "value": 6}, "reward": {"type": "global_mult", "value": 1.25}, "bonusDesc": "bonusDesc_global_25"},
                {"id": "prestige_veteran", "nameKey": "ach_prestige_veteran", "descKey": "ach_prestige_veteran_desc", "condition": {"type": "prestiges", "value": 5}, "reward": {"type": "prestige_bonus", "value": 1.30}, "bonusDesc": "bonusDesc_prestige_30"},
                {"id": "prestige_master", "nameKey": "ach_prestige_master", "descKey": "ach_prestige_master_desc", "condition": {"type": "prestiges", "value": 10}, "reward": {"type": "prestige_break", "value": 1}, "bonusDesc": "bonusDesc_prestige_break"},
                {"id": "challenge_master", "nameKey": "ach_challenge_master", "descKey": "ach_challenge_master_desc", "condition": {"type": "challenges_completed", "value": 5}, "reward": {"type": "global_mult", "value": 1.50}, "bonusDesc": "bonusDesc_challenge_master"},
                {"id": "future_update", "nameKey": "ach_future_update", "descKey": "ach_future_update_desc", "condition": {"type": "impossible", "value": 1}, "reward": {"type": "coming_soon", "value": 1}, "bonusDesc": "bonusDesc_coming_soon"}
            ],
            "deskItems": [
                {"id": "mug", "nameKey": "desk_mug", "cost": 1, "bonus": {"type": "single_task_boost", "value": 1.10}, "bonusDesc": "bonusDesc_single_boost"},
                {"id": "phone", "nameKey": "desk_phone", "cost": 3, "bonus": {"type": "all_active_boost", "value": 1.05}, "bonusDesc": "bonusDesc_active_boost"},
                {"id": "organizer", "nameKey": "desk_organizer", "cost": 8, "bonus": {"type": "focus_slot", "value": 1}, "bonusDesc": "bonusDesc_focus_slot"},
                {"id": "lamp", "nameKey": "desk_lamp", "cost": 6, "bonus": {"type": "night_boost", "value": 1.10}, "bonusDesc": "bonusDesc_night_boost"},
                {"id": "multitool", "nameKey": "desk_multitool", "cost": 12, "bonus": {"type": "focus_switch_discount", "value": 0.5}, "bonusDesc": "bonusDesc_switch_discount"},
                {"id": "trophy", "nameKey": "desk_trophy", "cost": 20, "bonus": {"type": "focus_slot", "value": 2}, "prestige": 1, "bonusDesc": "bonusDesc_trophy"},
                {"id": "desk_skill_cap_breaker", "nameKey": "desk_skill_cap_breaker", "cost": 12, "bonus": {"type": "soft_skill_cap_unlock", "value": 1}, "bonusDesc": "bonusDesc_skill_cap_breaker"}
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
                    "format_number_auto_desc": "Skróty tysięcy, milionów, miliardów itd.",
                    "format_number_scientific_desc": "Zapis naukowy, np. 2.54e+15",
                    "format_number_engineering_desc": "Zapis inżynieryjny (wykładnik podzielny przez 3), np. 1.23E6",
                    // NOWE TŁUMACZENIA - SOFT SKILL CAP SYSTEM
                    "desk_skill_cap_breaker": "Przełomowy kurs",
                    "bonusDesc_skill_cap_breaker": "Odblokowuje zdobywanie wielu Soft Skills przy prestiżu",
                    "prestige_limit_warning": "Obecnie możesz zdobyć maksymalnie 1 Soft Skill za prestiż. Odblokuj achievement 'Mistrz prestiżu' lub kup 'Przełomowy kurs' na biurku, by zwiększyć limit.",
                    "prestige_limit_unlocked": "Limit Soft Skills za prestiż został odblokowany!",
                    "prestige_gain_capped": "Zdobędziesz 1 Soft Skill (limit aktywny)",
                    "prestige_gain_unlimited": "Zdobędziesz {0} Soft Skill(s)",
                    // Reszta istniejących tłumaczeń
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
                    "bonusDesc_idle_20": "+20% do BP/s",
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
                    "bonusDesc_single_boost": "+10% BP do wybranego aktywnego zadania",
                    "bonusDesc_active_boost": "+5% BP do wszystkich aktywnych zadań",
                    "bonusDesc_focus_slot": "+1 slot focus (więcej aktywnych tasków)",
                    "bonusDesc_night_boost": "+10% BP nocą",
                    "bonusDesc_switch_discount": "Zmiana aktywnego tasku kosztuje 50% mniej BP",
                    "bonusDesc_trophy": "+2 sloty focus, ale -10% do łącznego BP"
                },
                "en": {
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
                    // NOWE TŁUMACZENIA - SOFT SKILL CAP SYSTEM
                    "desk_skill_cap_breaker": "Breakthrough Course",
                    "bonusDesc_skill_cap_breaker": "Unlocks earning multiple Soft Skills per prestige",
                    "prestige_limit_warning": "You can currently earn at most 1 Soft Skill per prestige. Unlock the 'Prestige Master' achievement or buy the 'Breakthrough Course' desk item to increase the cap.",
                    "prestige_limit_unlocked": "Soft Skill cap per prestige has been unlocked!",
                    "prestige_gain_capped": "You will earn 1 Soft Skill (cap active)",
                    "prestige_gain_unlimited": "You will earn {0} Soft Skill(s)",
                    // Reszta istniejących tłumaczeń
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
                    "bonusDesc_career_stats": "Unlocks career stats (ascensions, rankings)"
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
                    "Najczęściej używane słowo na spotkaniach to „synergia".",
                    "Statystyczny pracownik klika „Wyślij" w mailu służbowym około 30 razy dziennie.",
                    "Zjedzenie ciastka z kuchni firmowej podnosi morale zespołu nawet o 5%.",
                    "Najczęściej kopiowany skrót w Excelu to Ctrl+C, a zaraz po nim Ctrl+V.",
                    "Najpopularniejsza „wymówka" na spóźnienie? Spotkanie z klientem."
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
                "rank_intern", "rank_assistant", "rank_junior_specialist", "rank_specialist",
                "rank_senior_specialist", "rank_expert", "rank_team_leader", "rank_manager",
                "rank_director", "rank_board_member"
            ]
        };
    }

    // Nowa metoda: Sprawdza czy soft skill cap jest odblokowany
    isSoftSkillCapUnlocked() {
        const hasPrestigeAchievement = !!this.gameState.achievements["prestige_master"];
        const hasDeskItem = !!this.gameState.deskItems["desk_skill_cap_breaker"];
        return hasPrestigeAchievement || hasDeskItem;
    }

    // Nowa metoda: Oblicza ile soft skills gracz otrzyma przy prestiżu
    calculatePrestigeSoftSkillGain(totalBPEarned, threshold) {
        if (!this.isSoftSkillCapUnlocked()) {
            return 1; // Ograniczenie do 1 soft skill
        }
        
        // Pełna formula jeśli cap jest odblokowany
        return Math.floor(Math.sqrt(totalBPEarned / threshold));
    }

    // Zmodyfikowana metoda performPrestige z implementacją soft skill cap
    performPrestige() {
        // Ustal threshold zależnie od trybu prestige break
        const threshold = this.gameState.features.prestigeBreakUnlocked ? 
            this.gameData.prestigeBreakThreshold : this.gameData.prestigeThreshold;
            
        if (this.gameState.totalBPEarned < threshold) return;

        // NOWA LOGIKA SOFT SKILL CAP
        const hasPrestigeAchievement = !!this.gameState.achievements["prestige_master"];
        const hasDeskItem = !!this.gameState.deskItems["desk_skill_cap_breaker"];
        
        let softSkillsGain;
        if (!hasPrestigeAchievement && !hasDeskItem) {
            // Ograniczenie do 1 soft skill jeśli żaden warunek nie jest spełniony
            softSkillsGain = 1;
            console.log("[PRESTIGE] Soft Skill cap active - awarding 1 SS only");
        } else {
            // Pełna formula jeśli spełniono przynajmniej jeden warunek
            softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / threshold));
            console.log(`[PRESTIGE] Soft Skill cap unlocked - awarding ${softSkillsGain} SS (achievement: ${hasPrestigeAchievement}, desk item: ${hasDeskItem})`);
        }

        // ZAPISZ elementy, które zostają
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const featuresState = { ...this.gameState.features };
        const challengesState = { ...this.gameState.challenges };

        // TOTAL RESET: wszystko z wyjątkiem achievements, desk items, settings, features, challenges
        this.gameState = this.loadGameState();
        
        // Wszystkie zadania zostają zablokowane po prestige
        this.gameData.tasks.forEach(task => {
            this.gameState.tasks[task.id] = {
                level: 1,
                progress: 0,
                unlocked: false,
                ascensions: 0,
                locked: true
            };
        });

        // Dodaj SS oraz licz do statystyk
        this.gameState.softSkills += softSkillsGain;
        this.gameState.stats.softSkillsEarned += softSkillsGain;
        this.gameState.prestigeCount++;

        // Przywróć zachowane elementy
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.features = featuresState;
        this.gameState.challenges = challengesState;

        // BP = 0 po prestiżu!
        this.gameState.bp = 0;

        // Odśwież UI itd.
        this.checkAchievements();
        this.checkFeatureUnlocks();
        this.renderAll();
        
        // Komunikat z informacją o soft skill cap
        const capMessage = !this.isSoftSkillCapUnlocked() ? 
            ` (${this.translations[this.currentLanguage].prestige_limit_warning.split('.')[0]})` : "";
        this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skill${softSkillsGain > 1 ? "s" : ""}!${capMessage}`);
    }

    // Zmodyfikowana metoda renderowania prestiżu z komunikatami o limitach
    renderPrestigeSection() {
        const threshold = this.gameState.features.prestigeBreakUnlocked ? 
            this.gameData.prestigeBreakThreshold : this.gameData.prestigeThreshold;
        const canPrestige = this.gameState.totalBPEarned >= threshold;
        
        const prestigeBtn = document.getElementById('prestige-btn');
        const prestigeInfo = document.querySelector('.prestige-info');
        
        if (canPrestige) {
            prestigeBtn.disabled = false;
            prestigeBtn.classList.remove('disabled');
            
            // Oblicz ile soft skills gracz otrzyma
            const potentialGain = this.calculatePrestigeSoftSkillGain(this.gameState.totalBPEarned, threshold);
            const isCapActive = !this.isSoftSkillCapUnlocked();
            
            // Komunikat o potencjalnym zysku
            let gainMessage;
            if (isCapActive) {
                gainMessage = this.translations[this.currentLanguage].prestige_gain_capped || "You will earn 1 Soft Skill (cap active)";
            } else {
                gainMessage = (this.translations[this.currentLanguage].prestige_gain_unlimited || "You will earn {0} Soft Skill(s)")
                    .replace("{0}", potentialGain);
            }
            
            prestigeInfo.innerHTML = `
                <div class="prestige-gain">${gainMessage}</div>
                ${isCapActive ? `<div class="prestige-warning" style="color: #f39c12; margin-top: 8px; font-size: 0.9em;">
                    ${this.translations[this.currentLanguage].prestige_limit_warning}
                </div>` : ''}
            `;
        } else {
            prestigeBtn.disabled = true;
            prestigeBtn.classList.add('disabled');
            
            const progress = (this.gameState.totalBPEarned / threshold * 100).toFixed(1);
            prestigeInfo.innerHTML = `
                <div class="prestige-progress">Progress: ${progress}%</div>
                <div class="prestige-requirement">Requires ${this.formatNumber(threshold)} BP earned</div>
            `;
        }
    }

    // Reszta metod pozostaje bez zmian - kontynuuję z oryginalnego kodu...
    
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
                reducedMotion: false
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
                softSkillsEarned: 0
            },
            features: {
                multiBuyUnlocked: false,
                autoBuyerUnlocked: false,
                maxBuyUnlocked: false,
                deskUnlocked: false,
                challengesUnlocked: false,
                prestigeBreakUnlocked: false
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

                return mergedState;
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }

        return defaultState;
    }

    // Dodaj formatNumber i pozostałe metody utility
    formatNumber(num) {
        const format = this.gameState.settings.numberFormat || "auto";
        
        if (format === "scientific") {
            return num >= 1000 ? num.toExponential(2) : num.toString();
        } else if (format === "engineering") {
            if (num >= 1000) {
                const exp = Math.floor(Math.log10(num));
                const engExp = Math.floor(exp / 3) * 3;
                const coefficient = num / Math.pow(10, engExp);
                return `${coefficient.toFixed(2)}E${engExp}`;
            }
            return num.toString();
        } else { // auto format
            if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
            if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
            if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
            if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
            return Math.floor(num).toString();
        }
    }

    // Placeholder methods - należałoby skopiować pozostałe metody z oryginalnego pliku
    saveGameState() {
        try {
            localStorage.setItem('korposzczur-save', JSON.stringify(this.gameState));
            this.lastSave = Date.now();
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    showNotification(message) {
        console.log('[NOTIFICATION]', message);
        // Implementacja powiadomień
    }

    renderAll() {
        // Implementacja renderowania wszystkich elementów UI
        this.renderPrestigeSection();
    }

    checkAchievements() {
        // Implementacja sprawdzania achievements
    }

    checkFeatureUnlocks() {
        // Implementacja sprawdzania odblokowanych funkcji
    }

    init() {
        // Implementacja inicjalizacji gry
        console.log('[GAME] Korposzczur initialized with Soft Skill Cap System');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KorposzczurGame();
});