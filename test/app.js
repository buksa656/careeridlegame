// Korposzczur - Corporate Idle Game - v6 Enhanced with Real-time Updates
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
		this.careerStatsInterval = null;
		this.lastAnimatedTaskUpgrade = null;
		this.lastAnimatedTaskAscend = null;
        
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
                { "id": "lunch", "nameKey": "task_lunch", "baseCost": 500000, "baseIdle": 4000, "unlockCost": 1800000, "costMultiplier": 1.18, "idleMultiplier": 1.24, "cycleTime": 700 },
                { "id": "report", "nameKey": "task_report", "baseCost": 1500000, "baseIdle": 9500, "unlockCost": 5250000, "costMultiplier": 1.19, "idleMultiplier": 1.27, "cycleTime": 600 },
                { "id": "motivation", "nameKey": "task_motivation", "baseCost": 10000000, "baseIdle": 30000, "unlockCost": 37500000, "costMultiplier": 1.21, "idleMultiplier": 1.30, "cycleTime": 500 }
            ],
"achievements": [
    // START
	{
	  "id": "first_progress",
	  "nameKey": "ach_first_progress",
	  "descKey": "ach_first_progress_desc",
	  "condition": { "type": "bp_earned", "value": 50 },
	  "reward": { "type": "bp", "value": 50 },
	  "bonusDesc": "bonusDesc_first_progress"
	},
    // ODPROJEKTOWANIE ZADAŃ
    { "id": "coffee_lover", "nameKey": "ach_coffee_lover", "descKey": "ach_coffee_lover_desc",
      "condition": { "type": "task_unlocked", "taskId": "coffee" },
      "reward": { "type": "idle_bonus", "value": 1.10 },
      "bonusDesc": "bonusDesc_idle_10"
    },
    { "id": "kpi_analyst", "nameKey": "ach_kpi_analyst", "descKey": "ach_kpi_analyst_desc",
      "condition": { "type": "task_unlocked", "taskId": "kpi" },
      "reward": { "type": "prestige_bonus", "value": 1.15 },
      "bonusDesc": "bonusDesc_prestige_15"
    },
    { "id": "innovation_guru", "nameKey": "ach_innovation_guru", "descKey": "ach_innovation_guru_desc",
      "condition": { "type": "task_unlocked", "taskId": "brainstorm" },
      "reward": { "type": "ascend_bonus", "value": 1.20 },
      "bonusDesc": "bonusDesc_ascend_20"
    },
    { "id": "optimizer", "nameKey": "ach_optimizer", "descKey": "ach_optimizer_desc",
      "condition": { "type": "task_unlocked", "taskId": "optimize" },
      "reward": { "type": "global_mult", "value": 1.30 },
      "bonusDesc": "bonusDesc_global_30"
    },

    // KLUCZOWE PROGI ROZWOJU ZADAŃ
    { "id": "meeting_master", "nameKey": "ach_meeting_master", "descKey": "ach_meeting_master_desc",
      "condition": { "type": "task_level", "taskId": "meeting", "value": 15 },
      "reward": { "type": "upgrade_discount", "value": 0.95 },
      "bonusDesc": "bonusDesc_upgrade_discount_5"
    },
    { "id": "idle_master", "nameKey": "ach_idle_master", "descKey": "ach_idle_master_desc",
      "condition": { "type": "idle_rate", "value": 1500 },
      "reward": { "type": "idle_bonus", "value": 1.15 },
      "bonusDesc": "bonusDesc_idle_20"
    },
    { "id": "efficiency_expert", "nameKey": "ach_efficiency_expert", "descKey": "ach_efficiency_expert_desc",
      "condition": { "type": "total_task_levels", "value": 200 },
      "reward": { "type": "softcap_reduction", "value": 0.85 },
      "bonusDesc": "bonusDesc_efficiency_15"
    },

    // MULTIBUY, FEATURE UNLOCKI
    { "id": "upgrade_novice", "nameKey": "ach_upgrade_novice", "descKey": "ach_upgrade_novice_desc",
      "condition": { "type": "upgrades_bought", "value": 50 },
      "reward": { "type": "multibuy_unlock", "value": "upgrades" },
      "bonusDesc": "bonusDesc_multibuy_upgrades"
    },
    { "id": "multibuy_expert", "nameKey": "ach_multibuy_expert", "descKey": "ach_multibuy_expert_desc",
      "condition": { "type": "multibuy_used", "value": 25 },
      "reward": { "type": "max_buy_unlock", "value": 1 },
      "bonusDesc": "bonusDesc_max_buy"
    },

    // ASCENSION MILESTONES
    { "id": "first_ascend", "nameKey": "ach_first_ascend", "descKey": "ach_first_ascend_desc",
      "condition": { "type": "ascensions", "value": 1 },
      "reward": { "type": "career_stats_unlock", "value": 1 },
      "bonusDesc": "bonusDesc_career_stats"
    },
    { "id": "corporate_ladder", "nameKey": "ach_corporate_ladder", "descKey": "ach_corporate_ladder_desc",
      "condition": { "type": "total_ascensions", "value": 10 },
      "reward": { "type": "ascend_discount", "value": 0.90 },
      "bonusDesc": "bonusDesc_ascend_discount_10"
    },
    { "id": "ascension_master", "nameKey": "ach_ascension_master", "descKey": "ach_ascension_master_desc",
      "condition": { "type": "ascensions_per_task", "value": 5 },
      "reward": { "type": "ascension_discount", "value": 0.7 },
      "bonusDesc": "bonusDesc_ascension_30"
    },

    // PRESTIŻ, SOFT SKILLS
    { "id": "first_prestige", "nameKey": "ach_first_prestige", "descKey": "ach_first_prestige_desc",
      "condition": { "type": "prestiges", "value": 1 },
      "reward": { "type": "desk_unlock", "value": 1 },
      "bonusDesc": "bonusDesc_desk_unlock"
    },
    { "id": "prestige_veteran", "nameKey": "ach_prestige_veteran", "descKey": "ach_prestige_veteran_desc",
      "condition": { "type": "prestiges", "value": 5 },
      "reward": { "type": "prestige_bonus", "value": 1.30 },
      "bonusDesc": "bonusDesc_prestige_30"
    },
    { "id": "prestige_master", "nameKey": "ach_prestige_master", "descKey": "ach_prestige_master_desc",
      "condition": { "type": "prestiges", "value": 10 },
      "reward": { "type": "prestige_break", "value": 1 },
      "bonusDesc": "bonusDesc_prestige_break"
    },

    // SOFT SKILLS
    { "id": "soft_skills_beginner", "nameKey": "ach_soft_skills_beginner", "descKey": "ach_soft_skills_beginner_desc",
      "condition": { "type": "soft_skills_earned", "value": 1 },
      "reward": { "type": "desk_unlock", "value": 1 },
      "bonusDesc": "bonusDesc_desk_unlock"
    },
    { "id": "soft_skills_expert", "nameKey": "ach_soft_skills_expert", "descKey": "ach_soft_skills_expert_desc",
      "condition": { "type": "soft_skills_earned", "value": 10 },
      "reward": { "type": "prestige_bonus", "value": 1.20 },
      "bonusDesc": "bonusDesc_prestige_20"
    },
    { "id": "soft_skills_master", "nameKey": "ach_soft_skills_master", "descKey": "ach_soft_skills_master_desc",
      "condition": { "type": "soft_skills_earned", "value": 50 },
      "reward": { "type": "soft_skill_bonus", "value": 1.50 },
      "bonusDesc": "bonusDesc_soft_skill_50"
    },

    // DESK – WAŻNE, ALE NIE ZA DUŻO
    { "id": "office_decorator", "nameKey": "ach_office_decorator", "descKey": "ach_office_decorator_desc",
      "condition": { "type": "desk_items_bought", "value": 3 },
      "reward": { "type": "desk_discount", "value": 0.90 },
      "bonusDesc": "bonusDesc_desk_discount_10"
    },
    { "id": "office_complete", "nameKey": "ach_office_complete", "descKey": "ach_office_complete_desc",
      "condition": { "type": "desk_items_bought", "value": 6 },
      "reward": { "type": "global_mult", "value": 1.25 },
      "bonusDesc": "bonusDesc_global_25"
    },

    // MILESTONE KASY
    { "id": "big_spender", "nameKey": "ach_big_spender", "descKey": "ach_big_spender_desc",
      "condition": { "type": "bp_spent", "value": 500000 },
      "reward": { "type": "bp_bonus", "value": 1.10 },
      "bonusDesc": "bonusDesc_bp_10"
    },

    // BALANS i CHALLENGE
{
  "id": "balance_keeper",
  "nameKey": "ach_balance_keeper",
  "descKey": "ach_balance_keeper_desc",
  "condition": { "type": "task_level", "taskId": "motivation", "value": 10 },
  "reward": { "type": "global_mult", "value": 1.4 },
  "bonusDesc": "bonusDesc_balance_40"
},
    { "id": "challenge_master", "nameKey": "ach_challenge_master", "descKey": "ach_challenge_master_desc",
      "condition": { "type": "challenges_completed", "value": 5 },
      "reward": { "type": "global_mult", "value": 1.50 },
      "bonusDesc": "bonusDesc_challenge_master"
    },
{
  "id": "mem_2137",
  "nameKey": "ach_2137",
  "descKey": "ach_2137_desc",
  "condition": { "type": "bp_earned", "value": 2137 },
  "reward": { "type": "none" },
  "bonusDesc": "bonusDesc_2137"
},
	{
  "id": "mem_420",
  "nameKey": "ach_420",
  "descKey": "ach_420_desc",
  "condition": { "type": "bp_earned", "value": 420 },
  "reward": { "type": "none" },
  "bonusDesc": "bonusDesc_420"
},
	{
  "id": "mem_123456",
  "nameKey": "ach_123456",
  "descKey": "ach_123456_desc",
  "condition": { "type": "bp_earned", "value": 123456 },
  "reward": { "type": "none" },
  "bonusDesc": "bonusDesc_123456"
},
	{
  "id": "mem_milioner",
  "nameKey": "ach_milioner",
  "descKey": "ach_milioner_desc",
  "condition": { "type": "bp_earned", "value": 1000000 },
  "reward": { "type": "none" },
  "bonusDesc": "bonusDesc_milioner"
},
    // KONIEC/WIĘCEJ W PRZYSZŁOŚCI
    { "id": "future_update", "nameKey": "ach_future_update", "descKey": "ach_future_update_desc",
      "condition": { "type": "impossible", "value": 1 },
      "reward": { "type": "coming_soon", "value": 1 },
      "bonusDesc": "bonusDesc_coming_soon"
    }
],
            "deskItems": [
                { "id": "mug", "nameKey": "desk_mug", "cost": 1, "bonus": { "type": "single_task_boost", "value": 1.10 }, "bonusDesc": "bonusDesc_single_boost" },
                { "id": "phone", "nameKey": "desk_phone", "cost": 3, "bonus": { "type": "all_active_boost", "value": 1.05 }, "bonusDesc": "bonusDesc_active_boost" },
                { "id": "organizer", "nameKey": "desk_organizer", "cost": 8, "bonus": { "type": "focus_slot", "value": 1 }, "bonusDesc": "bonusDesc_focus_slot" },
                { "id": "lamp", "nameKey": "desk_lamp", "cost": 6, "bonus": { "type": "night_boost", "value": 1.10 }, "bonusDesc": "bonusDesc_night_boost" },
                { "id": "multitool", "nameKey": "desk_multitool", "cost": 12, "bonus": { "type": "focus_switch_discount", "value": 0.5 }, "bonusDesc": "bonusDesc_switch_discount" },
                { "id": "trophy", "nameKey": "desk_trophy", "cost": 20, "bonus": { "type": "focus_slot", "value": 2 }, "prestige": 1, "bonusDesc": "bonusDesc_trophy" },
                {"id": "upgrade_optimizer","nameKey": "desk_upgrade_optimizer", "cost": 15, "bonus": { "type": "free_upgrades", "value": 5 },"bonusDesc": "bonusDesc_free_upgrades"},
                {"id": "ascension_assistant","nameKey": "desk_ascension_assistant","cost": 25,"bonus": { "type": "auto_ascend_unlock", "value": 1 },"bonusDesc": "bonusDesc_auto_ascend"},
                {"id": "cost_calculator","nameKey": "desk_cost_calculator","cost": 20,"bonus": { "type": "cost_reduction_post_ascend", "value": 0.8 },"bonusDesc": "bonusDesc_cost_calculator"}
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
                    "ach_efficiency_expert": "Ekspert efektywności",
					"ach_milioner": "Milioner z przypadku",
					"ach_milioner_desc": "Wpadł milion BP. CZEK ABSURDU!",
					"bonusDesc_milioner": "Możesz już kupić bardzo drogą kawę ☕️",
					"ach_123456": "Hasło: 123456",
					"ach_123456_desc": "Wpadło 123456 BP. To twoje domyślne hasło?",
					"bonusDesc_123456": "Adminie, zmień hasło!",
					"ach_420": "🔥 420 Blaze It",
					"ach_420_desc": "Wbij dokładnie 420 BP. Memy Office/Weed poziom: senior.",
					"bonusDesc_420": "Nice. ( ͡° ͜ʖ ͡°)",
					"ach_2137": "21:37",
					"ach_2137_desc": "Zdobywasz dokładnie 2137 BP! JP na 100%.",
					"bonusDesc_2137": "To nie jest przypadek... 😉",
					"bonusDesc_first_progress": "Otrzymujesz jednorazowo +50 BP za postęp!",
					"bonusDesc_auto_ascend": "Automatycznie awansuje zadania na 25+ poziomie",
  					"bonusDesc_cost_calculator": "Ulepszenia po awansie tańsze o 20%",
					"desk_upgrade_optimizer": "Optymalizator ulepszeń",
					"desk_ascension_assistant": "Asystent awansów",
					"desk_cost_calculator": "Kalkulator kosztów",
					"bonusDesc_auto_ascend": "Automatycznie awansuje zadania na 25+ poziomie",
					"bonusDesc_cost_calculator": "Ulepszenia po awansie tańsze o 20%",
					"ach_efficiency_expert_desc": "Podnieś sumę poziomów wszystkich zadań do 200",
					"bonusDesc_efficiency_15": "Wszystkie softcapy zadań słabsze o 15%",
					"ach_ascension_master": "Mistrz awansów",
					"ach_ascension_master_desc": "Awansuj każde zadanie co najmniej 5 razy",
					"bonusDesc_ascension_30": "Koszt awansów zmniejszony o 30%",
					"ach_balance_keeper": "Wzorcowy menedżer",
					"ach_balance_keeper_desc": "Osiągnij poziom 10 w zadaniu Motywacyjne spotkanie",
					"bonusDesc_balance_40": "+40% do wszystkich przychodów za rozwój zespołu",
					"bonusDesc_free_upgrades": "Pierwsze 5 ulepszeń każdego zadania po prestiżu jest darmowe",
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
					"ach_balance_keeper": "Wzorcowy menedżer",
					"ach_balance_keeper_desc": "Doprowadź wszystkie zadania do co najmniej poziomu 10",
                    "bonusDesc_balance_40": "+40% do wszystkich przychodów za harmonijne rozwijanie zadań",
					"format_number_auto": "K/M/B/T",
                    "format_number_scientific": "Naukowa (1.23e+9)",
                    "format_number_engineering": "Inżynieryjna (1.23E6, 4.5E6)",
                    "format_number_auto_desc": "Skróty tysięcy, milionów, miliardów itd.",
                    "format_number_scientific_desc": "Zapis naukowy, np. 2.54e+15",
                    "format_number_engineering_desc": "Zapis inżynieryjny (wykładnik podzielny przez 3), np. 1.23E6",
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
                    "bonusDesc_trophy": "+2 sloty focus, ale -10% do łącznego BP",
                    "desk_monitor": "Drugi monitor",
                    "desk_plant": "Kwiatek na biurko",
                    "desk_mousepad": "Ergonomiczna podkładka",
                    "desk_laptop": "Laptop służbowy",
                    "desk_challenges": "Konsola wyzwań",
                    "desk_autobuyer": "AI Asystent",
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
                    "ach_first_progress": "Pierwsze postępy",
                    "ach_first_progress_desc": "Twoje pierwsze 50 BP!",
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
                    "ach_dedication": "Oddanie",
                    "ach_dedication_desc": "Graj przez 2 godziny",
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
                    "ach_future_update": "Przyszłe aktualizacje",
                    "ach_future_update_desc": "Czekaj na więcej zawartości",
                    "help_content": "<h2>Pomoc - Poradnik do Korposzczura</h2>\n<h3>[Cel Gry]</h3>\n<p>Rozwijaj karierę, zdobywaj <strong>Biuro-Punkty (BP)</strong> i odblokowuj zadania. Wydawaj <strong>Soft Skills</strong> na ulepszenia.</p>\n<h3>[Sterowanie]</h3>\n<ul>\n<li>Klikaj przyciski, aby odblokować, ulepszyć i awansować zadania.</li>\n<li>Wybierz <em>aktywne zadania</em> (Focus), które generują BP.</li>\n</ul>\n<h3>[Energia]</h3>\n<ul>\n<li>Regeneruje się automatycznie: 1 energia co 10 min (max 100).</li>\n<li>Specjalne umiejętności za energię: \nCoffee Break (25 energii): Podwaja (<strong>x2</strong>) produkcję Biuro-Punktów (BP) ze wszystkich zadań przez <strong>15 minut</strong>, \nFocus Mode (40 energii):+50% (<strong>x1.5</strong>) do produkcji BP ze wszystkich zadań przez <strong>20 minut</strong>, \nOvertime (60 energii):+1 dodatkowy slot Focus (możesz mieć więcej aktywnych zadań) przez <strong>30 minut</strong>\n</li>\n<li>Oglądaj reklamy, aby odzyskać energię (max 5 dziennie, min 10 min między reklamami).</li>\n<li>Energia nie resetuje się przy prestiżu — motywuje do oglądania reklam.</li>\n</ul>\n<h3>[Focus]</h3>\n<ul>\n<li>Tylko zadania aktywne w Focus generują BP.</li>\n<li>Startujesz z 4 slotami, które można zwiększyć (np. Organizer, Trofeum).</li>\n<li>Zmiana Focus może mieć koszt, zależnie od ustawień.</li>\n</ul>\n<h3>[Zadania]</h3>\n<ul>\n<li>Odkrywaj nowe zadania, ulepszaj i awansuj, by maksymalizować produkcję BP.</li>\n<li>Bonusy ze stopni, awansów, dóbr na biurku i umiejętności zwiększają efektywność.</li>\n</ul>\n<h3>[Soft Skills]</h3>\n<ul>\n<li>Zdobądź Soft Skills prestiżując i wykonując wyzwania.</li>\n<li>Wydawaj je, aby kupować przedmioty na biurko z bonusami.</li>\n<li>Przedmioty zwiększają produkcję BP oraz dają dodatkowe sloty Focus.</li>\n</ul>\n<h3>[Prestiż]</h3>\n<ul>\n<li>Reset postępu, zachowuje osiągnięcia i przedmioty.</li>\n<li>Wynagradza Soft Skills, które mają trwały wpływ.</li>\n<li>Daje dostęp do zaawansowanych funkcji i wyzwań.</li>\n</ul>\n<h3>[Wskazówki]</h3>\n<ul>\n<li>Stawiaj w Focus zadania z najlepszym BP.</li>\n<li>Ulepszaj głównie aktywne zadania.</li>\n<li>Rozszerzaj sloty Focus za pomocą biurka i umiejętności.</li>\n<li>Dostosuj grę pod siebie w ustawieniach.</li>\n</ul>\n<p>Miłej gry! 🍀</p>"
              },
                "en": {
                    "ach_efficiency_expert": "Efficiency Expert",
					"ach_milioner": "Accidental Millionaire",
					"ach_milioner_desc": "You hit one million BP. The check of absurdity!",
					"bonusDesc_milioner": "You can finally afford a ridiculously expensive coffee ☕️",
					"ach_123456": "Password: 123456",
					"ach_123456_desc": "123456 BP. Is this your default password?",
					"bonusDesc_123456": "Admin! Change your password!",
					"ach_420": "🔥 420 Blaze It",
					"ach_420_desc": "Get exactly 420 Office Points. Very pro.",
					"bonusDesc_420": "Nice. ( ͡° ͜ʖ ͡°)",
					"ach_2137": "The 2137 Meme",
					"ach_2137_desc": "Reach exactly 2137 Office Points! JP 100%.",
					"bonusDesc_2137": "Not a coincidence... 😉",
					"bonusDesc_first_progress": "You receive a one-time +50 BP for progress!",
					"bonusDesc_auto_ascend": "Automatically ascends tasks at level 25+",
  					"bonusDesc_cost_calculator": "Post-ascension upgrade costs 20% cheaper",
					"desk_upgrade_optimizer": "Upgrade Optimizer",
					"desk_ascension_assistant": "Ascension Assistant",
					"desk_cost_calculator": "Cost Calculator",
					"bonusDesc_auto_ascend": "Automatically ascends tasks at level 25+",
					"bonusDesc_cost_calculator": "Post-ascension upgrade costs 20% cheaper",
					"ach_efficiency_expert_desc": "Raise the total sum of all task levels to 200",
					"bonusDesc_efficiency_15": "All task softcaps 15% weaker",
					"ach_ascension_master": "Ascension Master",
					"ach_ascension_master_desc": "Ascend every task at least 5 times",
					"bonusDesc_ascension_30": "Ascension costs 30% cheaper",
					"ach_balance_keeper": "Balance Keeper",
					"ach_balance_keeper_desc": "Reach level 10 in the Motivation task",
					"bonusDesc_balance_40": "+40% to all income for team development",
					"bonusDesc_free_upgrades": "First 5 upgrades per task are free after prestige",
                    "ach_balance_keeper": "Balance Keeper",
					"ach_balance_keeper_desc": "Level every task up to at least level 10",
					"bonusDesc_balance_40": "+40% to all income for balanced development",
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
                    "help_content": "<h2>Help - Corporate Rat</h2>\n\n<h3>Game Goal</h3>\n<p>Develop your career, earn <strong>Office Points (BP)</strong> and unlock tasks. Spend <strong>Soft Skills</strong> on upgrades.</p>\n\n<h3>Controls</h3>\n<ul>\n<li>Click buttons to unlock, upgrade, and ascend tasks.</li>\n<li>Select <em>active</em> tasks to generate BP (Focus).</li>\n</ul>\n\n<h3>Energy</h3>\n<ul>\n<li>Regenerates automatically at 1 energy every 10 minutes (max 100).</li>\n<li>Special skills cost energy: Coffee Break (25), Focus Mode (40), Overtime (60).</li>\n<li>Watch ads to recover energy (max 5 ads/day, 10 min cooldown).</li>\n<li>Energy does not reset on prestige – incentivizing ad watching.</li>\n</ul>\n\n<h3>Focus</h3>\n<ul>\n<li>Only active tasks in Focus generate BP.</li>\n<li>Start with 4 focus slots, expanded by desk items.</li>\n<li>Switching Focus may cost BP, depending on settings.</li>\n</ul>\n\n<h3>Tasks</h3>\n<ul>\n<li>Unlock new tasks and upgrade/ascend them to increase BP production.</li>\n<li>Bonuses from levels, ascensions, desk items, and skills boost efficiency.</li>\n</ul>\n\n<h3>Soft Skills</h3>\n<ul>\n<li>Earn Soft Skills through prestiges and challenges.</li>\n<li>Spend Soft Skills on desk items that grant bonuses and extra focus slots.</li>\n<li>Desk items significantly boost BP production.</li>\n</ul>\n\n<h3>Prestige</h3>\n<ul>\n<li>Resets most progress, but retains achievements and desk items.</li>\n<li>Grants Soft Skills that provide permanent bonuses.</li>\n<li>Unlocks advanced features and challenges.</li>\n</ul>\n\n<h3>Tips</h3>\n<ul>\n<li>Focus on maximizing BP by prioritizing active tasks.</li>\n<li>Upgrade mainly your active tasks.</li>\n<li>Expand your Focus slots via desk items and skills.</li>\n<li>Use the settings to tailor the game to your preferences.</li>\n</ul>\n\n<p>Enjoy the game! 🍀</p>"
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
                "Najczęściej używane słowo na spotkaniach to „synergia”.",
                "Statystyczny pracownik klika „Wyślij” w mailu służbowym około 30 razy dziennie.",
                "Zjedzenie ciastka z kuchni firmowej podnosi morale zespołu nawet o 5%.",
                "Najczęściej kopiowany skrót w Excelu to Ctrl+C, a zaraz po nim Ctrl+V.",
                "Najpopularniejsza „wymówka” na spóźnienie? Spotkanie z klientem."
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
            // CRITICAL: All tasks start as locked, including first
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
                softSkillsEarned: 0,
				bpEarned: 0,
				bpHistory: [], // <--- historia stanu BP do wykresu
				lastBpLog: Date.now() // znacznik ostatniego wpisu
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
                // Ensure all tasks are properly initialized with locked state
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
                        // Ensure locked state is set for all tasks
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

    init() {
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.renderAll();
        this.startGameLoop();
        this.startFastUIUpdates(); // Critical: Start 50ms UI update loop
        this.startQuoteRotation();
        this.checkFeatureUnlocks();

        // Set up real-time BP change listener
        this.addEventListener('bpChange', () => {
            this.updateTaskButtonStates();
            this.updateUnlockButtonStates();
        });
		if (!localStorage.getItem('korposzczur-welcome-shown')) {
			setTimeout(() => { // by mieć pewność, że DOM jest gotowy
				document.getElementById('welcome-modal').style.display = 'flex';
			}, 250);

			document.getElementById('welcome-close').onclick = () => {
				document.getElementById('welcome-modal').style.display = 'none';
				localStorage.setItem('korposzczur-welcome-shown', '1');
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
            reset: () => {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        };
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
    reset: () => {
        localStorage.removeItem('korposzczur-save');
        location.reload();
    },
    unlockAllDev: () => {
        this.gameData.tasks.forEach(task => {
            this.gameState.tasks[task.id] = { 
                level: 25,
                progress: 0,
                unlocked: true,
                ascensions: 3,
                locked: false
            };
        });
        this.gameData.deskItems.forEach(item => {
            this.gameState.deskItems[item.id] = true;
        });
        this.gameState.stats.deskItemsBought = this.gameData.deskItems.length;
        this.gameState.bp = 1e8;
        this.gameState.totalBPEarned = 1e8;
        this.gameState.softSkills = 99;
        this.gameState.prestigeCount = 10;
        this.gameState.stats.softSkillsEarned = 99;
        this.gameState.stats.totalAscensions = 20;
        this.gameState.stats.totalUpgrades = 90;
        this.gameState.stats.tasksUnlocked = this.gameData.tasks.length;
        this.gameData.achievements.forEach(ach => {
            this.gameState.achievements[ach.id] = true;
        });
        this.gameData.challenges.forEach(chal => {
            this.gameState.challenges[chal.id] = true;
        });
        this.gameState.stats.challengesCompleted = this.gameData.challenges.length;
        Object.keys(this.gameState.features).forEach(key => {
            this.gameState.features[key] = true;
        });
        this.checkFeatureUnlocks();
        this.renderAll();
        this.updateDisplay();
        alert('TRYB DEV: Wszystko odblokowane!');
    }
};

    }
softcap(value, cap1, exp1, cap2, exp2) {
    if (value <= cap1) return value;
    if (value <= cap2) return cap1 + Math.pow(value - cap1, exp1);
    return cap2 + Math.pow(value - cap2, exp2);
}
setupEventListeners() {
    // Tab navigation - Fixed to handle challenges tab properly
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
document.getElementById('secret-code-btn').onclick = () => {
    const code = document.getElementById('secret-code-input').value.trim();
    const feedback = document.getElementById('secret-code-feedback');
    
    // KOD: 123456
    if (code === "123456") {
        feedback.textContent = "Hasło przyjęte! Twoja produkcja BP zmieniła się o... 0%. Ale duma ogromna. 👏";
        // Tu możesz dorzucić np. miganie, shake, czy gifka, ale nie zmieniaj stanu gry!
    }
    // KOD: 2137
    else if (code === "2137") {
        feedback.textContent = "JP na 100%! Papieska moc aktywowana na minutkę!";
        const logo = document.querySelector('.korpo-logo');
        const oldLogo = logo.src;
        logo.src = "jp2.jpg"; // zakładam, że masz taką grafikę!
	    
		const quote = document.getElementById('quote-text');
		const oldQuote = quote.textContent;
		clearInterval(game.quoteInterval);

		const barkaLines = [
		    "Pan kiedyś stanął nad brzegiem... Szukał ludzi gotowych pójść za Nim...By łowić serca...Słów Bożych prawdą...",
		];
        let idx = 0;
        const animBarka = () => {
            if (idx < barkaLines.length) {
                quote.innerHTML =
                  `<span style="color: #bca405; font-size:1.18em; text-shadow: 0 2px 6px #ffe;">
                    ${barkaLines[idx]}
                  </span>`;
                quote.style.animation = "barkaAnim 1.1s";
                idx++;
                setTimeout(animBarka, 2000);
            }
        };
        animBarka();
        setTimeout(() => {
            logo.src = oldLogo;
            quote.textContent = oldQuote;
            quote.style.animation = '';
			
        }, 60000);
    }
    // KOD: cokolwiek innego
    else {
        feedback.textContent = "Niepoprawny kod / Invalid code";
    }
};
    settingsClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSettingsModal();
    });
    settingsBackdrop.addEventListener('click', closeSettingsModal);

    // Energy dropdown - NOWY SYSTEM
    const energyButton = document.getElementById('energy-button');
    const energyMenu = document.getElementById('energy-menu');

    if (energyButton && energyMenu) {
        energyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            energyMenu.classList.toggle('show');
        });

        // Zamknij dropdown po kliknięciu poza nim
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.energy-dropdown')) {
                energyMenu.classList.remove('show');
            }
        });

        // Event listenery dla opcji w dropdown
        document.querySelectorAll('.energy-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const skill = e.target.getAttribute('data-skill');
                
                if (skill) {
                    this.useSkill(skill);
                } else if (e.target.id === 'watch-ad-option') {
                    this.watchAdForEnergy();
                }
                
                // Zamknij dropdown po wyborze
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
            // Immediate update of button states
            this.updateTaskButtonStates();
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
}

    // Fixed tab switching to properly handle all tabs including challenges
switchTab(tabName) {
    // Ukrywamy wszystkie zakładki i zdejmujemy aktywność
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Wyszukujemy docelową zakładkę i przycisk
    const targetTab = document.getElementById(`${tabName}-tab`);
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);

    if (targetTab && targetBtn) {
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
        targetBtn.classList.add('active');
        this.currentTab = tabName;

        // TYLKO dla Statystyk kariery
        if (tabName === 'careerstats') {
            this.renderCareerStats(); // Pierwszy render

            // Start interwału jeśli nie działa
            if (!this.careerStatsInterval) {
                this.careerStatsInterval = setInterval(() => {
                    // Odświeżaj tylko gdy nadal na tej zakładce!
                    if (this.currentTab === "careerstats") {
                        this.renderCareerStats();
                    }
                }, 100); // co 1 sekunda
            }
        } else {
            // Sprzątanie interwału gdy opuszczasz statystyki
            if (this.careerStatsInterval) {
                clearInterval(this.careerStatsInterval);
                this.careerStatsInterval = null;
            }
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
        }, 50); // 50ms = 20 FPS
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
                
                // Update cost display in real-time
                const costText = btn.textContent.match(/\(([^)]+)\)$/);
                const newText = `${this.translations[this.currentLanguage].upgrade} ${amount > 1 ? `(${amount}x)` : ''} (${this.formatNumber(cost)})`;
                if (btn.textContent !== newText) {
                    btn.textContent = newText;
                }
                
                // Visual feedback for affordability
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
                    btn.textContent = isAscendMax
                        ? (this.currentLanguage === "pl" ? "Max. Awans" : "Max Ascend")
                        : this.translations[this.currentLanguage].ascend;
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
            
            // Real-time visual feedback
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
            if (amount === 'max') return; // Max button doesn't need affordability check

            // Check if any task can afford this amount
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
    }

    startAutoBuyer() {
        this.autoBuyerInterval = setInterval(() => {
            this.performAutoBuy();
        }, 1000); // Run every second
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

        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState || !taskState.unlocked) return;

            const cost = this.calculateUpgradeCost(taskId);
            if (cost <= this.gameState.bp && cost < cheapestCost) {
                cheapestCost = cost;
                cheapestUpgrade = taskId;
            }
        });

        if (cheapestUpgrade) {
            this.upgradeTask(cheapestUpgrade);
        }
if (this.gameState.deskItems['ascension_assistant']) {
   Object.keys(this.gameState.tasks).forEach(taskId => {
      const taskState = this.gameState.tasks[taskId];
      if (
        taskState && taskState.unlocked &&
        taskState.level >= 25 && // lub inny próg!
        taskState.ascensions < (maxAscends) // limit rang jak w manualnym awansie
      ) {
          this.ascendTask(taskId);
      }
  });
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
        document.getElementById('number-format-select').value = this.gameState.settings.numberFormat;
    }

    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            this.gameLoop();
        }, 100); // Main game loop at 100ms for resource generation

        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000); // Auto-save every 30 seconds
    }

    startQuoteRotation() {
        const rotateQuote = () => {
            const quotes = this.gameData.quotes[this.currentLanguage];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote-text').textContent = randomQuote;
        };

        rotateQuote(); // Initial quote
        this.quoteInterval = setInterval(rotateQuote, 15000); // Change every 15 seconds
    }

    gameLoop() {
        this.updateEnergy();
        const now = Date.now();
		if (!this.gameState.stats.lastBpLog || now - this.gameState.stats.lastBpLog > 60000) { // co 60s
			this.gameState.stats.lastBpLog = now;
			if (!this.gameState.stats.bpHistory) this.gameState.stats.bpHistory = [];
			this.gameState.stats.bpHistory.push({ time: now, bp: this.gameState.bp });
			// Ogranicz długość historii (np. 1440 -> max 24h jeśli co minutę)
			if (this.gameState.stats.bpHistory.length > 1440) {
				this.gameState.stats.bpHistory.shift();
			}
		}
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
            const cycleTime = taskData.cycleTime / 1000; // Convert to seconds
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
			this.gameState.stats.bpEarned += totalBPGained;
            this.updateDisplay();
        }

        if (!this.gameState.stats.maxBP || this.gameState.bp > this.gameState.stats.maxBP) {
			this.gameState.stats.maxBP = this.gameState.bp;
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
        const energyToAdd = Math.floor(timePassed / (10 * 60 * 1000)); // 1 per 10min
        
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
        this.currentLanguage === 'pl' 
            ? "Reklamy nie są teraz dostępne"
            : "Ads are not available right now"
    );
    return false;
    }
          
    const now = Date.now();
    const daysSinceEpoch = Math.floor(now / (24 * 60 * 60 * 1000));
    
    // Reset dzienny licznik
    if (this.gameState.lastAdDay !== daysSinceEpoch) {
        this.gameState.adsWatchedToday = 0;
        this.gameState.lastAdDay = daysSinceEpoch;
    }
    
    // Sprawdź limity
    if (this.gameState.adsWatchedToday >= 5) {
        this.showNotification("Daily ad limit reached!");
        return false;
    }
    
    if (now - this.gameState.lastAdWatch < 10 * 60 * 1000) {
        this.showNotification("Please wait 10 minutes between ads");
        return false;
    }
    
    // Symulacja SDK reklamy
    this.showRewardedAd(() => {
        this.gameState.energy = Math.min(this.gameState.energy + 20, 100);
        this.gameState.adsWatchedToday++;
        this.gameState.lastAdWatch = now;
        this.showNotification("Energy refilled! (+20)");
        this.updateDisplay();
    });
}

showRewardedAd(onComplete) {
    // Tutaj integracja z rzeczywistym SDK (AdMob, Unity Ads, etc.)
    // Tymczasowo: symulacja
    if (confirm("Watch 30-second ad for 20 energy?")) {
        setTimeout(onComplete, 3000); // Symuluje ad duration
    }
}      
calculateTaskIdleRate(taskId) {
    const SOFTCAP_TIERS = {
      email: [
        { cap: 1000, exp: 1 },
        { cap: 6000, exp: 0.5 },
        { cap: 20000, exp: 0.2 },
        { cap: Infinity, exp: 0.07 }
      ],
      coffee: [
        { cap: 2500, exp: 1 },
        { cap: 12000, exp: 0.55 },
        { cap: 40000, exp: 0.25 },
        { cap: Infinity, exp: 0.09 }
      ],
      meeting: [
        { cap: 5000, exp: 1 },
        { cap: 25000, exp: 0.6 },
        { cap: 80000, exp: 0.28 },
        { cap: Infinity, exp: 0.1 }
      ],
      kpi: [
        { cap: 12000, exp: 1 },
        { cap: 60000, exp: 0.62 },
        { cap: 180000, exp: 0.32 },
        { cap: Infinity, exp: 0.13 }
      ],
      brainstorm: [
        { cap: 35000, exp: 1 },
        { cap: 140000, exp: 0.65 },
        { cap: 400000, exp: 0.33 },
        { cap: Infinity, exp: 0.17 }
      ],
      optimize: [
        { cap: 90000, exp: 1 },
        { cap: 260000, exp: 0.7 },
        { cap: 600000, exp: 0.35 },
        { cap: Infinity, exp: 0.20 }
      ],
      lunch: [
        { cap: 200000, exp: 1 },
        { cap: 500000, exp: 0.72 },
        { cap: 1200000, exp: 0.4 },
        { cap: Infinity, exp: 0.23 }
      ],
      report: [
        { cap: 450000, exp: 1 },
        { cap: 1500000, exp: 0.74 },
        { cap: 3000000, exp: 0.44 },
        { cap: Infinity, exp: 0.26 }
      ],
      motivation: [
        { cap: 1000000, exp: 1 },
        { cap: 3000000, exp: 0.75 },
        { cap: 8000000, exp: 0.5 },
        { cap: Infinity, exp: 0.3 }
      ]
    };

    const taskData = this.gameData.tasks.find(t => t.id === taskId);
    const taskState = this.gameState.tasks[taskId];
    let rate = taskData.baseIdle * Math.pow(taskData.idleMultiplier, taskState.level - 1);

    // Apply ascension multiplier
    rate *= Math.pow(2, taskState.ascensions);

    // Apply global multipliers
    rate *= this.getGlobalMultiplier();
    const segment = Math.floor((taskState.level - 1) / 10);
    if (segment > 0) {
        rate *= Math.pow(1.05, segment);
    }
    const isActive = this.gameState.focus.includes(taskId);

    // all_active_boost
    if (isActive) {
        Object.keys(this.gameState.deskItems).forEach(id => {
            if (!this.gameState.deskItems[id]) return;
            const item = this.gameData.deskItems.find(d => d.id === id);
            if (item && item.bonus.type === 'all_active_boost') {
                rate *= item.bonus.value;
            }
        });
    }
    // KUBEK
    if (
        this.gameState.deskItems['mug'] &&
        this.gameState.focus.length > 0 &&
        this.gameState.focus[0] === taskId
    ) {
        const item = this.gameData.deskItems.find(d => d.id === 'mug');
        if (item) rate *= item.bonus.value;
    }
    // night_boost
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

    // -- MULTITIER SOFTCAP --
    const baseTiers = SOFTCAP_TIERS[taskId] || [
      { cap: 5000, exp: 1 },
      { cap: 50000, exp: 0.6 },
      { cap: 300000, exp: 0.3 },
      { cap: Infinity, exp: 0.1 }
    ];
    // Tu możesz modyfikować progi na podstawie achievementów (opcjonalnie)
    const tiers = baseTiers.map(tier => ({
      ...tier,
      exp: this.gameState.achievements['efficiency_expert'] ? Math.min(1, tier.exp + 0.15) : tier.exp
    }));
    rate = this.softcapMulti(rate, tiers);

    // Czasowe boosty
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
        
        // DODAJ: Overtime skill
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
    // PROGRESYWNY SOFTCAP — od 10 000 mnożymy coraz wolniej (0.7), a od miliona - bardzo wolno (0.5)
    multiplier = this.softcap(multiplier, 10000, 0.7, 1_000_000, 0.5);

    return multiplier;
    }

    // Critical: Manual unlock system - ALL tasks require manual unlocking
    manualUnlockTask(taskId, skipCost = false) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        if (!taskData) return false;

        const taskState = this.gameState.tasks[taskId];
        if (taskState && taskState.unlocked) return false; // Already unlocked

        if (!skipCost && this.gameState.bp < taskData.unlockCost) return false;

        // Deduct cost
        if (!skipCost) {
            this.updateBP(this.gameState.bp - taskData.unlockCost);
            this.gameState.totalBPSpent += taskData.unlockCost;
        }
        
        // Unlock task
        if (!this.gameState.tasks[taskId]) {
            this.gameState.tasks[taskId] = { level: 1, progress: 0, unlocked: true, ascensions: 0, locked: false };
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
        // auto-focus: jeśli jest wolny slot, dodaj świeżo odblokowany task
        if (!this.gameState.focus.includes(taskId) && this.gameState.focus.length < this.getMaxFocusSlots()) {
            this.gameState.focus.push(taskId);
        }
		const unlockBtn = document.querySelector(`.unlock-task-btn[data-task-id="${taskId}"]`);
		if (unlockBtn) {
		  unlockBtn.classList.remove('unlock-anim');
		  void unlockBtn.offsetWidth;
		  unlockBtn.classList.add('unlock-anim');
		  setTimeout(() => unlockBtn.classList.remove('unlock-anim'), 500);
		}
        return true;
    }
earnSecretAchievement(id) {
    if (!this.gameState.achievements[id]) {
        this.gameState.achievements[id] = true;
        this.renderAchievements();
        this.showNotification("🎉 Sekretny achievement odblokowany!");
    }
}
checkAchievements() {
    // Blokada: tylko jedna notyfikacja na achievement na cykl!
    if (!this.justUnlockedAchievements) this.justUnlockedAchievements = new Set();

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
            case 'all_tasks_same_level':
                const allLevels = Object.values(this.gameState.tasks)
                    .filter(task => task.unlocked)
                    .map(task => task.level);
                unlocked = allLevels.length > 0 && allLevels.every(lvl => lvl >= achievement.condition.value);
                break;
            case 'total_task_levels':
                const totalLevels = Object.values(this.gameState.tasks)
                    .reduce((sum, task) => sum + (task.unlocked ? task.level : 0), 0);
                unlocked = totalLevels >= achievement.condition.value;
                break;
            case 'task_balance_score':
                const taskLevels = Object.values(this.gameState.tasks)
                    .filter(task => task.unlocked)
                    .map(task => task.level);
                const avg = taskLevels.reduce((a, b) => a + b, 0) / taskLevels.length;
                const variance = taskLevels.reduce((sum, level) => sum + Math.pow(level - avg, 2), 0) / taskLevels.length;
                const balanceScore = Math.max(0, 100 - Math.sqrt(variance));
                unlocked = balanceScore >= achievement.condition.value;
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
        }
        // BLOKADA TUTAJ:
        if (unlocked && !this.justUnlockedAchievements.has(achievement.id)) {
            this.gameState.achievements[achievement.id] = true;
            this.justUnlockedAchievements.add(achievement.id);
            this.triggerEvent('achievementUnlock', { achievementId: achievement.id });
            this.renderAchievements();
            this.checkFeatureUnlocks();
            this.showNotification(`🏆Achievement: ${this.translations[this.currentLanguage][achievement.nameKey] || achievement.nameKey}`);
        }
    });

    // Czyść listę "już odblokowanych" po cyklu
    setTimeout(() => {
        this.justUnlockedAchievements.clear();
    }, 0);
}

calculateMultiBuyCost(taskId, amount) {
    const taskData = this.gameData.tasks.find(t => t.id === taskId);
    const taskState = this.gameState.tasks[taskId];

    let totalCost = 0;
    let currentLevel = taskState.level;

    // QoL: ile pierwszych za free?
    const hasOptimizer = this.gameState.deskItems['upgrade_optimizer'];
    let freeUpgrades = hasOptimizer ? 5 : 0;

    for (let i = 0; i < amount; i++) {
        // DARMOWE UPGRADE (QoL) – tylko jeśli jeszcze nie wykorzystane (na początku po prestiżu)
        if (freeUpgrades > 0) {
            freeUpgrades--;
            currentLevel++;
            continue; // Pomijaj koszt całkiem
        }
        
        let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);

        const segment = Math.floor(currentLevel / 10);
        if (segment > 0) {
            cost *= Math.pow(1.5, taskState.ascensions);
        }

        // Ulepszenia z desk items (np. upgrade_discount)
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'upgrade_discount') {
                    cost *= item.bonus.value;
                }
                // Tańsze upgrade po ascension (cost_calculator)
                if (
                  item && item.bonus.type === 'cost_reduction_post_ascend' &&
                  taskState.ascensions > 0 // działa tylko jeśli był awans!
                ) {
                    cost *= item.bonus.value;
                }
            }
        });

        // Achievementy (jeśli coś daje zniżkę)
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward.type === 'upgrade_discount') {
                    cost *= achievement.reward.value;
                }
            }
        });

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

    const hasOptimizer = this.gameState.deskItems['upgrade_optimizer'];
    let freeUpgrades = hasOptimizer ? 5 : 0;

    while (totalCost <= this.gameState.bp && amount < 50) {
        if (freeUpgrades > 0) {
            freeUpgrades--;
            amount++;
            currentLevel++;
            continue;
        }
        let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);

        // segment, rabaty jak wyżej z desk items i achievements
        const segment = Math.floor(currentLevel / 10);
        if (segment > 0) {
            cost *= Math.pow(1.5, taskState.ascensions);
        }
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'upgrade_discount') {
                    cost *= item.bonus.value;
                }
                if (
                    item && item.bonus.type === 'cost_reduction_post_ascend'
                    && taskState.ascensions > 0
                ) {
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
        this.updateTaskButtonStates();
        this.updateDisplay();

        // USTAWIAMY *NAJPIERW* flagę animacji!
        this.lastAnimatedTaskUpgrade = taskId;
        // Następnie wykonujemy pojedynczy render
        this.renderTasks();

        // Visual feedback na przycisku (to możesz zostawić)
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
    this.updateTaskButtonStates();

    // Flaga do późniejszego zaznaczenia animacji
    this.lastAnimatedTaskAscend = taskId;

    this.renderTasks(); // po ustawieniu flagi

    this.showNotification(`🏆 ${this.translations[this.currentLanguage][this.gameData.tasks.find(t => t.id === taskId).nameKey]}: ${this.translations[this.currentLanguage].ascend}`);

}

performPrestige() {
    // Nowa logika: 1 SS za każde pełne 50,000 BP
    const SS_BP_PRICE = 50000;
    const earned = Math.floor(this.gameState.totalBPEarned / SS_BP_PRICE);

    // Hard cap przed zdobyciem prestige_master achievementa
    const hasPrestigeMaster = !!this.gameState.achievements["prestige_master"];
    let softSkillsGain;

    // Hard cap: możesz zdobyć tylko 1 SS, nawet jeśli masz więcej BP
    if (!hasPrestigeMaster) {
        softSkillsGain = (earned > 0) ? 1 : 0;
    } else {
        softSkillsGain = earned;
    }

    // Brak BP -> nie możesz zrobić prestiżu (disable button gdy softSkillsGain < 1)
    if (softSkillsGain < 1) return;

    // ZAPISZ elementy, które zostają po prestiżu
    const achievementsToKeep = { ...this.gameState.achievements };
    const deskItemsToKeep = { ...this.gameState.deskItems };
    const settingsToKeep = { ...this.gameState.settings };
    const featuresState = { ...this.gameState.features };
    const challengesState = { ...this.gameState.challenges };

    // RESET wszystkiego poza zachowanymi danymi:
    this.gameState = this.loadGameState();

    // Wszystkie zadania zostają zablokowane po prestiżu
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
    this.gameState.achievements = achievementsToKeep;
    this.gameState.deskItems = deskItemsToKeep;
    this.gameState.settings = settingsToKeep;
    this.gameState.features = featuresState;
    this.gameState.challenges = challengesState;

    // BP = 0 po prestiżu!
    this.gameState.bp = 0;

    // Odśwież UI i powiadom
    this.checkAchievements();
    this.checkFeatureUnlocks();
    this.renderAll();
    this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skill${softSkillsGain !== 1 ? "s" : ""}!`);
}

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId] || this.gameState.softSkills < item.cost) return;

        this.gameState.softSkills -= item.cost;
        this.gameState.deskItems[itemId] = true;
        this.gameState.stats.deskItemsBought++;
        this.checkFeatureUnlocks();
        this.checkAchievements();
        this.renderDeskShop();
        this.renderDesk();
        this.updateDisplay();
    }

    renderAll() {
        this.renderTasks();
        this.renderDeskShop();
        this.renderDesk();
        this.renderAchievements();
        this.renderChallenges();
        this.updateDisplay();
        this.updateUnlockProgress();
        this.updateTaskButtonStates();
    }

renderTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';

    this.gameData.tasks.forEach(taskData => {
        const taskState = this.gameState.tasks[taskData.id];

        // Locked -> przycisk odblokowania
        if (!taskState || !taskState.unlocked || taskState.locked) {
            const unlockBtn = document.createElement('div');
            unlockBtn.className = `unlock-task-btn ${this.gameState.bp >= taskData.unlockCost ? 'affordable' : 'locked'}`;
            unlockBtn.setAttribute('data-task-id', taskData.id);
            unlockBtn.innerHTML = `
                <div style="font-weight: 600;">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                <div>${this.translations[this.currentLanguage].unlock} (${this.formatNumber(taskData.unlockCost)} BP)</div>
            `;
            unlockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.manualUnlockTask(taskData.id);
            });
            container.appendChild(unlockBtn);
            return;
        }

        const isActive = this.gameState.focus.includes(taskData.id);
        const taskCard = this.createTaskCard(taskData, taskState);

        // PODŚWIETLENIE kafelka aktywnego
        if (isActive) {
            taskCard.classList.add('active-task');
        } else {
            taskCard.classList.remove('active-task');
        }

        // Dodanie animacji upgrade/ascend
        if (this.lastAnimatedTaskUpgrade === taskData.id) {
            taskCard.classList.add('tile-anim-pop');
            setTimeout(() => taskCard.classList.remove('tile-anim-pop'), 400);
            this.lastAnimatedTaskUpgrade = null;
        }
        if (this.lastAnimatedTaskAscend === taskData.id) {
            taskCard.classList.add('tile-anim-bounce');
            setTimeout(() => taskCard.classList.remove('tile-anim-bounce'), 500);
            this.lastAnimatedTaskAscend = null;
        }

        // KLIKALNY cały kafelek taska do focusowania/odfocusowania!
        taskCard.style.cursor = 'pointer';
        taskCard.addEventListener('click', (e) => {
            // Blokuj klik gdy user kliknął przyciski
            if (e.target.closest('.btn,.task-actions')) return;

            const taskId = taskData.id;
            if (isActive) {
                // Wyłącz fokus na tym tasku
                this.gameState.focus = this.gameState.focus.filter(id => id !== taskId);
            } else {
                // Limit slotów focus
                if (this.gameState.focus.length >= this.getMaxFocusSlots()) {
                    // Notyfikacja + animacja shake
                    this.showNotification(
                        this.currentLanguage === 'pl'
                            ? 'Osiągnąłeś maksymalną liczbę aktywnych zadań!'
                            : 'You have reached the maximum number of active tasks!'
                    );
                    taskCard.classList.add('shake-card');
                    setTimeout(() => taskCard.classList.remove('shake-card'), 600);
                    return;
                }
                // Koszt przełączania (opcjonalnie)
                if (this.gameState.settings?.focusSwitchCostEnabled) {
                    let switchCost = Math.max(1000, Math.floor(this.gameState.bp * 0.005));
                    if (this.gameState.deskItems['multitool']) {
                        const mt = this.gameData.deskItems.find(d => d.id === 'multitool');
                        if (mt && mt.bonus.type === 'focus_switch_discount') {
                            switchCost = Math.floor(switchCost * mt.bonus.value);
                        }
                    }
                    if (this.gameState.bp < switchCost) {
                        this.showNotification(this.currentLanguage === 'pl'
                            ? 'Za mało BP na zmianę focus!'
                            : 'Not enough BP to switch focus!');
                        return;
                    }
                    this.updateBP(this.gameState.bp - switchCost);
                }
                if (!this.gameState.focus.includes(taskId)) {
                    this.gameState.focus.push(taskId);
                }
            }
            this.saveGameState();
            this.renderTasks();
        });

        container.appendChild(taskCard);
    });

    this.updateTaskButtonStates();
}

createTaskCard(taskData, taskState) {
    const card = document.createElement('div');
    card.className = 'task-card';

    const maxAscends = this.gameData.rankKeys.length;
    const rankKey = this.gameData.rankKeys[Math.min(taskState.ascensions, maxAscends - 1)];
    const rank = this.translations[this.currentLanguage][rankKey] || rankKey;
    const idleRate = this.calculateTaskIdleRate(taskData.id);
    const buyAmount = this.multiBuyAmount === 'max' ? this.calculateMaxBuyAmount(taskData.id) : parseInt(this.multiBuyAmount);
    const upgradeCost = this.calculateMultiBuyCost(taskData.id, buyAmount);
    const canUpgrade = this.gameState.bp >= upgradeCost && buyAmount > 0;
    const canAscend = taskState.level >= 10 && taskState.ascensions < maxAscends;
    const isAscendMax = taskState.ascensions >= maxAscends;
    const ascendText = isAscendMax
        ? (this.currentLanguage === "pl" ? "Max. Awans" : "Max Ascend")
        : this.translations[this.currentLanguage].ascend;

    card.innerHTML = `
        <div class="task-header">
            <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
            <div class="task-rank">${rank}</div>
            <div class="task-focus-slot"></div>
        </div>
            
            <div class="hex-progress">
                <svg viewBox="0 0 60 52">
                    <polygon class="hex-bg" points="30,2 52,15 52,37 30,50 8,37 8,15" stroke-dasharray="140"/>
                    <polygon class="hex-fill" points="30,2 52,15 52,37 30,50 8,37 8,15" 
                             stroke-dasharray="${140 * taskState.progress}, 140"/>
                </svg>
                <div class="hex-text">${Math.floor(taskState.progress * 100)}%</div>
            </div>
            
            <div class="task-stats">
                <div class="task-stat">
                    <div class="stat-label">${this.translations[this.currentLanguage].level}</div>
                    <div class="stat-value">${taskState.level}</div>
                </div>
                <div class="task-stat">
                    <div class="stat-label">BP/s</div>
                    <div class="stat-value">${this.formatNumber(idleRate)}</div>
                </div>
            </div>
            
        <div class="task-actions">
                    <button class="btn btn--sm ${canUpgrade ? 'btn--primary' : 'btn--secondary disabled'}"
                            data-task-id="${taskData.id}" data-action="upgrade" ${!canUpgrade ? 'disabled' : ''}>
                        ${this.translations[this.currentLanguage].upgrade} ${buyAmount > 1 ? `(${buyAmount}x)` : ''} (${this.formatNumber(upgradeCost)})
                    </button>
                    <button class="btn btn--sm ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}"
                            data-task-id="${taskData.id}" data-action="ascend" ${!canAscend ? 'disabled' : ''}
                            ${isAscendMax ? 'title="Osiągnięto maksymalną rangę!"' : ''}>
                        ${ascendText}
                    </button>
                </div>
            `;

        // Add event listeners to task action buttons
        const upgradeBtn = card.querySelector('[data-action="upgrade"]');
        const ascendBtn = card.querySelector('[data-action="ascend"]');
        
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.upgradeTask(taskData.id);
            });
        }
        
        if (ascendBtn) {
            ascendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.ascendTask(taskData.id);
            });
        }

        return card;
    }

 renderDeskShop() {
    const container = document.getElementById('shop-items');
    container.innerHTML = '';

    this.gameData.deskItems.forEach(item => {
        const owned = this.gameState.deskItems[item.id];
        const canBuy = !owned && this.gameState.softSkills >= item.cost;

        const shopItem = document.createElement('div');
        shopItem.className = `shop-item ${owned ? 'owned' : ''} ${canBuy ? 'affordable' : ''}`;
        shopItem.setAttribute('data-item-id', item.id);

        const bonusDescKey = item.bonusDesc;
        let bonusDesc = bonusDescKey 
            ? (this.translations[this.currentLanguage][bonusDescKey] || '')
            : '';

        // Dla kubka wyraźnie podkreśl, że bonus jest do pierwszego aktywnego
        if (item.id === 'mug') {
            bonusDesc = this.currentLanguage === 'pl'
                ? "+10% BP do pierwszego aktywnego zadania"
                : "+10% BP to the first active task";
        }

        shopItem.innerHTML = `
            <div class="shop-item-info">
                <div class="shop-item-name">${this.translations[this.currentLanguage][item.nameKey]}</div>
                <div class="shop-item-bonus"${owned ? '' : ' style="opacity:0.7;"'}>
                    ${bonusDesc}
                </div>
                <div class="shop-item-cost">${owned ? 'Owned' : `${item.cost} SS`}</div>
            </div>
            <button class="btn btn--sm ${canBuy ? 'btn--primary' : 'btn--secondary disabled'}" 
                    data-item-id="${item.id}" ${!canBuy ? 'disabled' : ''}>
                ${owned ? '✓' : this.translations[this.currentLanguage].buy}
            </button>
        `;

        const buyBtn = shopItem.querySelector('button');
        if (buyBtn && !buyBtn.disabled) {
            buyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.buyDeskItem(item.id);
            });
        }

        container.appendChild(shopItem);
    });
}

renderDesk() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const placeholdersList = [
        ["mug",        240, 100, "☕", "Kubek"],
        ["phone",      860, 96,  "📱", "Telefon"],
        ["organizer",  525, 105, "🗂", "Organizer"],
        ["lamp",       390, 90,  "💡", "Lampka"],
        ["multitool",  320, 180, "🛠", "Multitool"],
        ["trophy",     965, 170, "🏆", "Trofeum"],
        ["upgrade_optimizer", 350, 210, "⚡️", "Optymalizator ulepszeń"],
        ["ascension_assistant", 480, 200, "🤖", "Asystent awansów"],
        ["cost_calculator", 1080, 120, "🧮", "Kalkulator kosztów"]
    ];

    // Placeholdery na brakujące itemy
    let phGroup = document.getElementById('desk-placeholders');
    if (!phGroup) {
        phGroup = document.createElementNS(svgNS, 'g');
        phGroup.setAttribute('id', 'desk-placeholders');
        document.getElementById('desk-svg').insertBefore(phGroup, document.getElementById('desk-items'));
    }
    phGroup.innerHTML = '';
    placeholdersList.forEach(([id, cx, cy, icon, label]) => {
        if (this.gameState.deskItems && this.gameState.deskItems[id]) return;
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", 32);
        circle.setAttribute("fill", "#444");
        circle.setAttribute("class", "desk-placeholder");
        circle.setAttribute("opacity", "0.09");
        phGroup.appendChild(circle);
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", cx);
        text.setAttribute("y", cy + 10);
        text.setAttribute("class", "desk-placeholder-text");
        text.textContent = icon;
        phGroup.appendChild(text);
        circle.setAttribute("title", `Kup w sklepie: ${label}`);
        text.setAttribute("title", `Kup w sklepie: ${label}`);
    });

    // Render itemów na biurku
    const itemsGroup = document.getElementById('desk-items');
    if (!itemsGroup) return;
    itemsGroup.innerHTML = '';

    Object.keys(this.gameState.deskItems).forEach(itemId => {
        if (!this.gameState.deskItems[itemId]) return;
        const g = document.createElementNS(svgNS, 'g');
        g.setAttribute('class', 'desk-item');
        g.setAttribute('data-item-id', itemId);

        // Tooltip – wyciągnij dane z gameData
        const itemObj = this.gameData.deskItems.find(d => d.id === itemId);
        const label = itemObj
            ? (this.translations?.[this.currentLanguage]?.[itemObj.nameKey] || itemObj.nameKey)
            : itemId;
        const bonus = itemObj
            ? (this.translations?.[this.currentLanguage]?.[itemObj.bonusDesc] || itemObj.bonusDesc || "")
            : "";

        g.setAttribute('data-tooltip-title', label);
        g.setAttribute('data-tooltip-bonus', bonus);

        // (SVG do każdego przedmiotu – te same jak wcześniej)
        const append = (el) => g.appendChild(el);
        switch (itemId) {
            case 'mug': {
                const cup = document.createElementNS(svgNS, 'circle');
                cup.setAttribute('cx','240'); cup.setAttribute('cy','100'); cup.setAttribute('r','22');
                cup.setAttribute('fill','#8B4513'); append(cup);
                const base = document.createElementNS(svgNS, 'rect');
                base.setAttribute('x','228'); base.setAttribute('y','120');
                base.setAttribute('width','24'); base.setAttribute('height','6');
                base.setAttribute('fill','#654321'); append(base);
                break;
            }
            case 'phone': {
                const body = document.createElementNS(svgNS, 'rect');
                body.setAttribute('x','860'); body.setAttribute('y','80');
                body.setAttribute('width','28'); body.setAttribute('height','42');
                body.setAttribute('rx','5'); body.setAttribute('fill','#444'); append(body);
                const scr = document.createElementNS(svgNS, 'rect');
                scr.setAttribute('x','864'); scr.setAttribute('y','86');
                scr.setAttribute('width','20'); scr.setAttribute('height','29');
                scr.setAttribute('rx','3'); scr.setAttribute('fill','#9ad'); append(scr);
                break;
            }
            case 'organizer': {
                const org = document.createElementNS(svgNS, 'rect');
                org.setAttribute('x','505'); org.setAttribute('y','92');
                org.setAttribute('width','40'); org.setAttribute('height','22');
                org.setAttribute('rx','3'); org.setAttribute('fill','#b5651d'); append(org);
                const docs = document.createElementNS(svgNS, 'rect');
                docs.setAttribute('x','510'); docs.setAttribute('y','97');
                docs.setAttribute('width','10'); docs.setAttribute('height','13');
                docs.setAttribute('fill','#fff'); append(docs);
                break;
            }
            case 'lamp': {
                const arm = document.createElementNS(svgNS, 'line');
                arm.setAttribute('x1','395'); arm.setAttribute('y1','120');
                arm.setAttribute('x2','417'); arm.setAttribute('y2','85');
                arm.setAttribute('stroke','#daaf29'); arm.setAttribute('stroke-width','9'); append(arm);
                const bulb = document.createElementNS(svgNS, 'circle');
                bulb.setAttribute('cx','428'); bulb.setAttribute('cy','75'); bulb.setAttribute('r','16');
                bulb.setAttribute('fill','#ffe066'); bulb.setAttribute('stroke','#fff9b3'); bulb.setAttribute('stroke-width','3'); append(bulb);
                break;
            }
            case 'multitool': {
                const ring = document.createElementNS(svgNS, 'ellipse');
                ring.setAttribute('cx','320'); ring.setAttribute('cy','180');
                ring.setAttribute('rx','17'); ring.setAttribute('ry','10');
                ring.setAttribute('fill','#aaa'); append(ring);
                const blade = document.createElementNS(svgNS, 'rect');
                blade.setAttribute('x','339'); blade.setAttribute('y','167'); blade.setAttribute('width','22'); blade.setAttribute('height','6'); 
                blade.setAttribute('fill','#d5e7ef'); blade.setAttribute('rx','3'); append(blade);
                break;
            }
            case 'trophy': {
                const base = document.createElementNS(svgNS, 'rect');
                base.setAttribute('x','960'); base.setAttribute('y','185');
                base.setAttribute('width','30'); base.setAttribute('height','18');
                base.setAttribute('fill','#996515'); append(base);
                const cup = document.createElementNS(svgNS, 'ellipse');
                cup.setAttribute('cx','975'); cup.setAttribute('cy','177');
                cup.setAttribute('rx','19'); cup.setAttribute('ry','17');
                cup.setAttribute('fill','#FFD700'); append(cup);
                break;
            }
            case 'upgrade_optimizer': {
                const rect1 = document.createElementNS(svgNS, 'rect');
                rect1.setAttribute('x','350'); rect1.setAttribute('y','210');
                rect1.setAttribute('width','44'); rect1.setAttribute('height','16');
                rect1.setAttribute('fill','#97c5ed'); rect1.setAttribute('rx','7'); append(rect1);
                const bolt = document.createElementNS(svgNS, 'polygon');
                bolt.setAttribute('points','372,210 378,217 365,217 380,226 374,218 385,218');
                bolt.setAttribute('fill','#ffd700'); append(bolt);
                break;
            }
            case 'ascension_assistant': {
                const ai = document.createElementNS(svgNS, 'circle');
                ai.setAttribute('cx', '480'); ai.setAttribute('cy', '200'); ai.setAttribute('r', '15');
                ai.setAttribute('fill', '#ede1ff'); ai.setAttribute('stroke',"#ab9aff"); ai.setAttribute('stroke-width','4'); append(ai);
                const smile = document.createElementNS(svgNS, 'path');
                smile.setAttribute('d', "M473 208 Q480 215 487 208");
                smile.setAttribute('stroke','#998ddd'); smile.setAttribute('stroke-width','2'); smile.setAttribute('fill','none');
                append(smile);
                break;
            }
            case 'cost_calculator': {
                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x','1080'); rect.setAttribute('y','120');
                rect.setAttribute('width','25'); rect.setAttribute('height','24');
                rect.setAttribute('rx','4'); rect.setAttribute('fill','#eddc74'); append(rect);
                const scr = document.createElementNS(svgNS, 'rect');
                scr.setAttribute('x','1085'); scr.setAttribute('y','124');
                scr.setAttribute('width','15'); scr.setAttribute('height','6');
                scr.setAttribute('fill','#fff'); append(scr);
                break;
            }
            default: {
                const defC = document.createElementNS(svgNS, 'circle');
                defC.setAttribute('cx','600'); defC.setAttribute('cy','175'); defC.setAttribute('r','12');
                defC.setAttribute('fill','#e86'); defC.setAttribute('opacity','0.14'); append(defC);
                break;
            }
        }
        itemsGroup.appendChild(g);
    });

    // TOOLTIP logic - dodać TYLKO raz!
    if (!window._deskTooltipInit) {
        window._deskTooltipInit = true;
        let tooltip = document.getElementById('desk-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'desk-tooltip';
            tooltip.style.position = 'fixed';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = 99999;
            tooltip.style.background = '#fffbe5';
            tooltip.style.color = '#223a33';
            tooltip.style.fontSize = '1em';
            tooltip.style.borderRadius = '9px';
            tooltip.style.boxShadow = '0 2px 10px #aac8';
            tooltip.style.padding = '12px 18px';
            tooltip.style.border = '1.5px solid #f0eebb';
            tooltip.style.display = 'none';
            tooltip.style.minWidth = '120px';
            tooltip.style.maxWidth = '320px';
            tooltip.style.whiteSpace = 'pre-line';
            document.body.appendChild(tooltip);
        }
        const svg = document.getElementById('desk-svg');
        svg.addEventListener('mousemove', e => {
            let node = e.target;
            let parent = node;
            while (parent && parent !== svg && !parent.classList.contains('desk-item')) {
                parent = parent.parentNode;
            }
            if (parent && parent.classList && parent.classList.contains('desk-item')) {
                const label = parent.getAttribute('data-tooltip-title');
                const bonus = parent.getAttribute('data-tooltip-bonus');
                tooltip.innerHTML = `<b>${label}</b><br><span style="color:#69843b;font-size:0.98em;">${bonus}</span>`;
                tooltip.style.display = 'block';
                tooltip.style.left = (e.clientX+18) + 'px';
                tooltip.style.top = (e.clientY+14) + 'px';
            } else {
                tooltip.style.display = 'none';
            }
        });
        svg.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }
}

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        container.innerHTML = '';

        this.gameData.achievements.forEach(achievement => {
            const unlocked = this.gameState.achievements[achievement.id];
            
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement ${unlocked ? 'unlocked' : ''}`;
            
            // Fixed: Proper translation handling with fallback
            const name = this.translations[this.currentLanguage][achievement.nameKey] || achievement.nameKey;
            const desc = this.translations[this.currentLanguage][achievement.descKey] || achievement.descKey;
            
            achievementEl.innerHTML = `
                <div class="achievement-icon">${unlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${name}</div>
                    <div class="achievement-desc">${desc}</div>
                    <div class="achievement-bonus"${unlocked ? '' : ' style="opacity:0.6;"'}>
                        ${this.translations[this.currentLanguage][achievement.bonusDesc] || ''}
                    </div>
                </div>
            `;

            container.appendChild(achievementEl);
        });
    }

    renderChallenges() {
        if (!this.gameState.features.challengesUnlocked) return;
        
        const container = document.getElementById('challenges-list');
        container.innerHTML = '';

        this.gameData.challenges.forEach(challenge => {
            const completed = this.gameState.challenges[challenge.id];
            
            const challengeEl = document.createElement('div');
            challengeEl.className = `challenge ${completed ? 'completed' : 'in-progress'}`;
            
            // Fixed: Proper translation handling with fallback
            const name = this.translations[this.currentLanguage][challenge.nameKey] || challenge.nameKey;
            const desc = this.translations[this.currentLanguage][challenge.descKey] || challenge.descKey;
            
            challengeEl.innerHTML = `
                <div class="challenge-header">
                    <div class="challenge-name">${name}</div>
                    <div class="challenge-status status ${completed ? 'status--success' : 'status--info'}">${completed ? this.translations[this.currentLanguage].completed : this.translations[this.currentLanguage].in_progress}</div>
                </div>
                <div class="challenge-desc">${desc}</div>
            `;

            container.appendChild(challengeEl);
        });
    }

updateDisplay() {
    // BEZPIECZNE sprawdzanie przed ustawieniem
    const energyDisplay = document.getElementById('energy-display');
    if (energyDisplay) {
        energyDisplay.textContent = this.gameState.energy;
    }
    const bpDisplay = document.getElementById('bp-display');
    if (bpDisplay) {
        bpDisplay.textContent = this.formatNumber(Math.floor(this.gameState.bp));
    }
    const ssDisplay = document.getElementById('ss-display');
    if (ssDisplay) {
        ssDisplay.textContent = Math.floor(this.gameState.softSkills);
    }
    const energyBtn = document.getElementById('energy-button');
    if (energyBtn) {
        energyBtn.innerHTML = `⚡ ${this.gameState.energy}/${this.gameState.maxEnergy} ▼`;
    }
    // Bezpieczne sprawdzenie przed disable/enable przycisków
    document.querySelectorAll('.energy-option[data-skill]').forEach(btn => {
        const skill = btn.getAttribute('data-skill');
        const skillCosts = {
            coffeeBreak: 25,
            focusMode: 40,
            overtime: 60
        };
        if (skillCosts[skill]) {
            btn.disabled = this.gameState.energy < skillCosts[skill];
        }
    });
    // Bezpieczne sprawdzenie ad button
    const adButton = document.getElementById('watch-ad-option');
    if (adButton) {
        if (!this.adsAvailable) {
            adButton.disabled = true;
            adButton.classList.add('disabled');
            adButton.style.opacity = '0.5';
            adButton.title = this.currentLanguage === 'pl'
                ? "Reklamy będą dostępne po weryfikacji konta"
                : "Ads will be available after account verification";
        } else {
            adButton.disabled = false;
            adButton.classList.remove('disabled');
            adButton.style.opacity = '1';
            adButton.title = '';
        }
    }
    // zakladka statystyk
    if (this.gameState.achievements['first_ascend']) {
        document.getElementById('careerstats-tab-btn').style.display = 'inline-block';
    } else {
        document.getElementById('careerstats-tab-btn').style.display = 'none';
        document.getElementById('careerstats-tab').style.display = 'none';
    }
	
	// Ukrywanie/pokazywanie zakładki "Biurko"
	const deskBtn = document.querySelector('[data-tab="desk"]');
	const deskTab = document.getElementById('desk-tab');
	if (deskBtn && deskTab) {
		if (this.gameState.features.deskUnlocked) {
			deskBtn.style.display = 'inline-block';
		} else {
			deskBtn.style.display = 'none';
			deskTab.style.display = 'none';
		}
	}

	// Ukrywanie/pokazywanie zakładki "Wyzwania"
	const challengesBtn = document.querySelector('[data-tab="challenges"]');
	const challengesTab = document.getElementById('challenges-tab');
	if (challengesBtn && challengesTab) {
		if (this.gameState.features.challengesUnlocked) {
			challengesBtn.style.display = 'inline-block';
		} else {
			challengesBtn.style.display = 'none';
			challengesTab.style.display = 'none';
		}
	}
    // PRESTIŻ – nowa logika
    const prestigeBtn = document.getElementById('prestige-btn');
    const prestigeInfo = document.getElementById('prestige-info');
    if (prestigeBtn && prestigeInfo) {
        const SS_BP_PRICE = 50000;
        const earned = Math.floor(this.gameState.totalBPEarned / SS_BP_PRICE);
        const hasPrestigeMaster = !!this.gameState.achievements["prestige_master"];
        let softSkillsGain;

        if (!hasPrestigeMaster) {
            softSkillsGain = earned > 0 ? 1 : 0;
        } else {
            softSkillsGain = earned;
        }

        prestigeBtn.disabled = softSkillsGain < 1;

        if (softSkillsGain >= 1) {
            prestigeInfo.textContent = hasPrestigeMaster
                ? (this.currentLanguage === 'pl'
                    ? `Zdobywasz ${softSkillsGain} Soft Skill${softSkillsGain > 1 ? "s" : ""}`
                    : `Gain ${softSkillsGain} Soft Skill${softSkillsGain > 1 ? "s" : ""}`)
                : (this.currentLanguage === 'pl'
                    ? `Zdobywasz 1 Soft Skill`
                    : `Gain 1 Soft Skill`);
            prestigeBtn.classList.remove('disabled');
            // (opcjonalnie) reset innerHTML jeśli poprzednio był .disabled:
            prestigeBtn.innerHTML = this.translations[this.currentLanguage].prestige_ready;
        } else {
            const earnedBP = this.formatNumber(this.gameState.totalBPEarned);
            const nextReq = this.formatNumber(SS_BP_PRICE);
            prestigeInfo.innerHTML = `<span style="color:#888;">${earnedBP} / ${nextReq} BP</span>
                <span style="margin-left:8px; color:#b44;"><i class="fa fa-lock"></i></span>`;
            prestigeBtn.classList.add('disabled');
            prestigeBtn.innerHTML = `<span style="opacity:.7">${this.translations[this.currentLanguage].prestige_ready}</span> <i class="fa fa-lock"></i>`;
        }
    }
}
renderCareerStats() {
    if (!this.gameState.achievements['first_ascend']) return; // Tylko po odblokowaniu

    const content = document.getElementById('careerstats-content');
    if (!content) return;

    // Formatowanie czasu gry
    const playTimeMs = this.gameState.stats.playTime || 0;
    const playTimeSec = Math.floor(playTimeMs / 1000);
    const hours = Math.floor(playTimeSec / 3600);
    const minutes = Math.floor((playTimeSec % 3600) / 60);
    const seconds = playTimeSec % 60;
    const playTimeStr = `${hours}h ${minutes}m ${seconds}s`;

    // Zbierz statsy
    const achievementsUnlocked = Object.values(this.gameState.achievements).filter(Boolean).length;
    const achievementsTotal = this.gameData.achievements.length;
    const maxScore = this.formatNumber(this.gameState.stats.maxBP || this.gameState.totalBPEarned);

    // Zadania, prestiże, wyzwania itp.
    const stats = [
        { icon: '🏆', label: 'Maksymalny wynik BP', value: maxScore },
        { icon: '⏱️', label: 'Czas w grze', value: playTimeStr },
        { icon: '🔼', label: 'Liczba prestiży', value: this.gameState.prestigeCount || 0 },
        { icon: '🧠', label: 'Liczba Soft Skills', value: this.gameState.stats.softSkillsEarned || 0 },
        { icon: '🚀', label: 'Łączna liczba awansowań', value: this.gameState.stats.totalAscensions || 0 },
        { icon: '⚒️', label: "Łączna liczba ulepszeń", value: this.gameState.stats.totalUpgrades || 0 },
        { icon: '📈', label: "Łączny zdobyty BP", value: this.formatNumber(this.gameState.totalBPEarned || 0) },
        { icon: '🧩', label: "Odblokowane achievementy", value: `${achievementsUnlocked} / ${achievementsTotal}` },
        { icon: '📊', label: "Liczba odblokowanych zadań", value: this.gameState.stats.tasksUnlocked || 0 },
        { icon: '✅', label: "Liczba ukończonych wyzwań", value: this.gameState.stats.challengesCompleted || 0 },
        { icon: '🖥️', label: "Przedmioty na biurku", value: this.gameState.stats.deskItemsBought || 0 },
        { icon: '⭐', label: "Najwyższy poziom zadania", value: this.getHighestTaskLevel() || 0 },
        { icon: '💡', label: "Najwięcej BP na minutę", value: this.getBestBpPerMinute() },
        { icon: '⚡', label: "Śr. BP na minutę", value: this.getAverageBpPerMinute() },
        { icon: '🖱️', label: "Łączna liczba kliknięć upgrade", value: this.gameState.stats.upgradeClicks || 0 }
    ];

    // Stwórz dashboard
    content.innerHTML = `<div class="career-dashboard"></div>`;
    const dash = content.firstChild;
    stats.forEach(stat => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.innerHTML = `
            <div class="kpi-icon">${stat.icon}</div>
            <div class="kpi-label">${stat.label}</div>
            <div class="kpi-value">${stat.value}</div>
        `;
        dash.appendChild(card);
    });

    // Wykres BP
    this.renderBpHistoryChart();
}

renderBpHistoryChart() {
    const content = document.getElementById('bp-history-chart');
    if (!content || !this.gameState.stats.bpHistory) return;
    const points = this.gameState.stats.bpHistory.slice(-100); // Ostatnie 100 punktów do czytelności
    if (points.length < 2) {
        content.textContent = this.currentLanguage === 'pl' ? "Za mało danych do wykresu" : "Not enough data";
        return;
    }
    const maxBP = Math.max(...points.map(p => p.bp));
    const minBP = Math.min(...points.map(p => p.bp));
    const width = 340, height = 90, margin = 10;
    const path = points.map((p, i) => {
        const x = margin + (i / (points.length - 1)) * (width - 2 * margin);
        const y = height - margin - ((p.bp - minBP) / Math.max(1, maxBP - minBP)) * (height - 2 * margin);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    content.innerHTML = `
      <svg width="${width}" height="${height}" style="background:#fafcee;border-radius:8px">
        <polyline fill="none" stroke="#019b78" stroke-width="2" points="${points.map((p, i) => {
            const x = margin + (i / (points.length - 1)) * (width - 2 * margin);
            const y = height - margin - ((p.bp - minBP) / Math.max(1, maxBP - minBP)) * (height - 2 * margin);
            return `${x},${y}`;
        }).join(' ')}"/>
        <path d="${path}" fill="none" stroke="#029e89" stroke-width="2"/>
        <circle cx="${margin}" cy="${height - margin - ((points[0].bp - minBP) / Math.max(1, maxBP - minBP)) * (height - 2 * margin)}" r="3" fill="#029e89"/>
        <circle cx="${width - margin}" cy="${height - margin - ((points[points.length-1].bp - minBP) / Math.max(1, maxBP - minBP)) * (height - 2 * margin)}" r="3" fill="#b770f2"/>
      </svg>
      <div style="font-size:.91em;color:#666;padding-top:4px">
        ${this.currentLanguage === "pl" ? "Twój postęp BP (ostatnie godziny)" : "Your BP trend (last hours)"}
      </div>
    `;
}
getBestBpPerMinute() {
    const history = this.gameState.stats.bpHistory || [];
    if (history.length < 2) return 0;
    let max = 0;
    for (let i = 1; i < history.length; i++) {
        const deltaBp = history[i].bp - history[i-1].bp;
        const deltaTime = (history[i].time - history[i-1].time) / 60000; // minuty
        const rate = deltaTime > 0 ? deltaBp / deltaTime : 0;
        if (rate > max) max = rate;
    }
    return this.formatNumber(max);
}
getAverageBpPerMinute() {
    const history = this.gameState.stats.bpHistory || [];
    if (history.length < 2) return 0;
    const totalBp = history[history.length-1].bp - history[0].bp;
    const totalMin = (history[history.length-1].time - history[0].time) / 60000;
    return this.formatNumber(totalMin > 0 ? totalBp / totalMin : 0);
}
getHighestTaskLevel() {
    return Math.max(...Object.values(this.gameState.tasks).map(t=>t.level||0));
}
    updateTaskProgress() {
        document.querySelectorAll('.hex-fill').forEach((fill, index) => {
            const tasks = Object.keys(this.gameState.tasks).filter(taskId => 
                this.gameState.tasks[taskId] && this.gameState.tasks[taskId].unlocked
            );
            const taskId = tasks[index];
            if (taskId && this.gameState.tasks[taskId]) {
                const taskState = this.gameState.tasks[taskId];
                const progress = taskState.progress * 140;
                fill.setAttribute('stroke-dasharray', `${progress}, 140`);
                
                const textEl = fill.parentElement.nextElementSibling;
                if (textEl && textEl.classList.contains('hex-text')) {
                    textEl.textContent = `${Math.floor(taskState.progress * 100)}%`;
                }
            }
        });
    }

    updateUnlockProgress() {
        const nextTask = this.gameData.tasks.find(task => {
            const taskState = this.gameState.tasks[task.id];
            return !taskState || !taskState.unlocked || taskState.locked;
        });

        if (nextTask) {
            const progress = Math.min(this.gameState.bp / nextTask.unlockCost, 1);
            const progressBar = document.getElementById('unlock-progress');
            if (progressBar) {
                progressBar.style.width = `${progress * 100}%`;
            }
        } else {
            const progressBar = document.getElementById('unlock-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }
    }

    formatNumber(num) {
        const fmt = this.gameState.settings?.numberFormat || "auto";
        if (fmt === "scientific") {
            // np. 1.23e+9
            if (num < 1000) return Math.floor(num).toString();
            return num.toExponential(2);
        }
        if (fmt === "engineering") {
            // przesuń wykładnik do najbliższej liczby podzielnej przez 3: x.xxE6, x.xxE9
            if (num < 1000) return Math.floor(num).toString();
            const exp = Math.floor(Math.log10(num) / 3) * 3;
            const value = num / Math.pow(10, exp);
            return value.toFixed(2) + "E" + exp;
        }
        // klasycznie: K, M, B, T, aa, ab, ac, ..., az, ba, ...
        const SUFFIXES = [
            '', 'K', 'M', 'B', 'T',
            'aa','ab','ac','ad','ae','af','ag','ah','ai','aj','ak','al','am','an','ao','ap','aq','ar','as','at','au','av','aw','ax','ay','az',
            'ba','bb','bc','bd','be','bf','bg','bh','bi','bj','bk','bl','bm','bn','bo','bp','bq','br','bs','bt','bu','bv','bw','bx','by','bz',
            // ...dodasz więcej jeśli kiedyś będzie potrzebne :)
        ];
        if (num < 1000) return Math.floor(num).toString();
        let tier = Math.floor(Math.log10(num) / 3);
        if (tier < SUFFIXES.length) {
            return (num / Math.pow(1000, tier)).toFixed(2) + SUFFIXES[tier];
        } else {
            return num.toExponential(2); // fallback na notację naukową jeśli za daleko
        }
    }
softcapMulti(value, tiers) {
    /*
    tiers: tablica progów [{cap, exp}]
    Przykład:
      [
        { cap: 5000, exp: 1 },     // do 5k BP/s liniowo
        { cap: 50000, exp: 0.6 },  // do 50k BP/s, 60% tempa
        { cap: 500000, exp: 0.3 }, // do 500k BP/s, 30%
        { cap: Infinity, exp: 0.1 } // powyżej 500k BP/s tylko 10% tempa
      ]
    */
    let result = value;
    let prevCap = 0;
    for (let i = 0; i < tiers.length; i++) {
        const { cap, exp } = tiers[i];
        if (result <= cap) {
            return prevCap + Math.pow(result - prevCap, exp);
        } else {
            result = cap + Math.pow(result - cap, exp);
            prevCap = cap;
        }
    }
    return result;
}

    showNotification(message) {
        // Simple notification system
		const notification = document.createElement('div');
		notification.textContent = message;
		notification.className = 'achievement-pop';
		const stack = document.getElementById('notification-stack');
		if (stack) {
		    stack.appendChild(notification);
		} else {
		    document.body.appendChild(notification); // fallback, gdyby stack nie istniał
		}
		setTimeout(() => {
		    notification.style.animation = 'slideOut 0.3s ease-in forwards';
		    setTimeout(() => notification.remove(), 300);
		}, 3000);
    }

    destroy() {
        if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
        if (this.fastUIUpdateInterval) clearInterval(this.fastUIUpdateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.quoteInterval) clearInterval(this.quoteInterval);
        if (this.autoBuyerInterval) clearInterval(this.autoBuyerInterval);
    }
}

// Initialize game when DOM is loaded
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new KorposzczurGame();
});

// Save on page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.saveGameState();
    }
});

// Add CSS animations for notifications
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
`;
document.head.appendChild(style);
