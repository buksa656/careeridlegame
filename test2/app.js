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
                {"id": "email", "nameKey": "task_email", "baseCost": 10, "baseIdle": 1, "unlockCost": 0, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 2000},
                {"id": "coffee", "nameKey": "task_coffee", "baseCost": 25, "baseIdle": 3, "unlockCost": 75, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1800},
                {"id": "meeting", "nameKey": "task_meeting", "baseCost": 150, "baseIdle": 12, "unlockCost": 500, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1500},
                {"id": "kpi", "nameKey": "task_kpi", "baseCost": 1500, "baseIdle": 70, "unlockCost": 3500, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1200},
                {"id": "brainstorm", "nameKey": "task_brainstorm", "baseCost": 15000, "baseIdle": 400, "unlockCost": 35000, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 1000},
                {"id": "optimize", "nameKey": "task_optimize", "baseCost": 180000, "baseIdle": 2200, "unlockCost": 350000, "costMultiplier": 1.15, "idleMultiplier": 1.2, "cycleTime": 800}
            ],
            "achievements": [
                {"id": "first_unlock", "nameKey": "ach_first_unlock", "descKey": "ach_first_unlock_desc", "condition": {"type": "tasks_unlocked", "value": 1}, "reward": {"type": "bp_bonus", "value": 1.05}, "bonusDesc": "bonusDesc_bp_5"},
                {"id": "upgrade_novice", "nameKey": "ach_upgrade_novice", "descKey": "ach_upgrade_novice_desc", "condition": {"type": "upgrades_bought", "value": 50}, "reward": {"type": "multibuy_unlock", "value": "upgrades"}, "bonusDesc": "bonusDesc_multibuy_upgrades"},
                {"id": "coffee_lover", "nameKey": "ach_coffee_lover", "descKey": "ach_coffee_lover_desc", "condition": {"type": "task_unlocked", "taskId": "coffee"}, "reward": {"type": "idle_bonus", "value": 1.1}, "bonusDesc": "bonusDesc_idle_10"},
                {"id": "meeting_master", "nameKey": "ach_meeting_master", "descKey": "ach_meeting_master_desc", "condition": {"type": "task_level", "taskId": "meeting", "value": 15}, "reward": {"type": "upgrade_discount", "value": 0.95}, "bonusDesc": "bonusDesc_upgrade_discount_5"},
                {"id": "first_ascend", "nameKey": "ach_first_ascend", "descKey": "ach_first_ascend_desc", "condition": {"type": "ascensions", "value": 1}, "reward": {"type": "multibuy_unlock", "value": "ascend"}, "bonusDesc": "bonusDesc_multibuy_ascend"},
                {"id": "kpi_analyst", "nameKey": "ach_kpi_analyst", "descKey": "ach_kpi_analyst_desc", "condition": {"type": "task_unlocked", "taskId": "kpi"}, "reward": {"type": "prestige_bonus", "value": 1.15}, "bonusDesc": "bonusDesc_prestige_15"},
                {"id": "big_spender", "nameKey": "ach_big_spender", "descKey": "ach_big_spender_desc", "condition": {"type": "bp_spent", "value": 25000}, "reward": {"type": "bp_bonus", "value": 1.1}, "bonusDesc": "bonusDesc_bp_10"},
                {"id": "innovation_guru", "nameKey": "ach_innovation_guru", "descKey": "ach_innovation_guru_desc", "condition": {"type": "task_unlocked", "taskId": "brainstorm"}, "reward": {"type": "ascend_bonus", "value": 1.2}, "bonusDesc": "bonusDesc_ascend_20"},
                {"id": "first_prestige", "nameKey": "ach_first_prestige", "descKey": "ach_first_prestige_desc", "condition": {"type": "prestiges", "value": 1}, "reward": {"type": "soft_skill_bonus", "value": 1.25}, "bonusDesc": "bonusDesc_soft_skill_25"},
                {"id": "optimizer", "nameKey": "ach_optimizer", "descKey": "ach_optimizer_desc", "condition": {"type": "task_unlocked", "taskId": "optimize"}, "reward": {"type": "global_mult", "value": 1.3}, "bonusDesc": "bonusDesc_global_30"},
                {"id": "multibuy_expert", "nameKey": "ach_multibuy_expert", "descKey": "ach_multibuy_expert_desc", "condition": {"type": "multibuy_used", "value": 25}, "reward": {"type": "max_buy_unlock", "value": 1}, "bonusDesc": "bonusDesc_max_buy"},
                {"id": "corporate_ladder", "nameKey": "ach_corporate_ladder", "descKey": "ach_corporate_ladder_desc", "condition": {"type": "total_ascensions", "value": 10}, "reward": {"type": "ascend_discount", "value": 0.9}, "bonusDesc": "bonusDesc_ascend_discount_10"},
                {"id": "idle_master", "nameKey": "ach_idle_master", "descKey": "ach_idle_master_desc", "condition": {"type": "idle_rate", "value": 1000}, "reward": {"type": "idle_bonus", "value": 1.2}, "bonusDesc": "bonusDesc_idle_20"},
                {"id": "dedication", "nameKey": "ach_dedication", "descKey": "ach_dedication_desc", "condition": {"type": "play_time", "value": 7200000}, "reward": {"type": "global_mult", "value": 1.15}, "bonusDesc": "bonusDesc_global_15"},
                {"id": "soft_skills_beginner", "nameKey": "ach_soft_skills_beginner", "descKey": "ach_soft_skills_beginner_desc", "condition": {"type": "soft_skills_earned", "value": 1}, "reward": {"type": "desk_unlock", "value": 1}, "bonusDesc": "bonusDesc_desk_unlock"},
                {"id": "soft_skills_expert", "nameKey": "ach_soft_skills_expert", "descKey": "ach_soft_skills_expert_desc", "condition": {"type": "soft_skills_earned", "value": 10}, "reward": {"type": "prestige_bonus", "value": 1.2}, "bonusDesc": "bonusDesc_prestige_20"},
                {"id": "soft_skills_master", "nameKey": "ach_soft_skills_master", "descKey": "ach_soft_skills_master_desc", "condition": {"type": "soft_skills_earned", "value": 50}, "reward": {"type": "soft_skill_bonus", "value": 1.5}, "bonusDesc": "bonusDesc_soft_skill_50"},
                {"id": "first_desk_item", "nameKey": "ach_first_desk_item", "descKey": "ach_first_desk_item_desc", "condition": {"type": "desk_items_bought", "value": 1}, "reward": {"type": "soft_skill_bonus", "value": 1.1}, "bonusDesc": "bonusDesc_soft_skill_10"},
                {"id": "office_decorator", "nameKey": "ach_office_decorator", "descKey": "ach_office_decorator_desc", "condition": {"type": "desk_items_bought", "value": 3}, "reward": {"type": "desk_discount", "value": 0.9}, "bonusDesc": "bonusDesc_desk_discount_10"},
                {"id": "office_complete", "nameKey": "ach_office_complete", "descKey": "ach_office_complete_desc", "condition": {"type": "desk_items_bought", "value": 6}, "reward": {"type": "global_mult", "value": 1.25}, "bonusDesc": "bonusDesc_global_25"},
                {"id": "prestige_veteran", "nameKey": "ach_prestige_veteran", "descKey": "ach_prestige_veteran_desc", "condition": {"type": "prestiges", "value": 5}, "reward": {"type": "prestige_bonus", "value": 1.3}, "bonusDesc": "bonusDesc_prestige_30"},
                {"id": "prestige_master", "nameKey": "ach_prestige_master", "descKey": "ach_prestige_master_desc", "condition": {"type": "prestiges", "value": 10}, "reward": {"type": "prestige_break", "value": 1}, "bonusDesc": "bonusDesc_prestige_break"},
                {"id": "challenge_master", "nameKey": "ach_challenge_master", "descKey": "ach_challenge_master_desc", "condition": {"type": "challenges_completed", "value": 5}, "reward": {"type": "global_mult", "value": 1.5}, "bonusDesc": "bonusDesc_challenge_master"},
                {"id": "future_update", "nameKey": "ach_future_update", "descKey": "ach_future_update_desc", "condition": {"type": "impossible", "value": 1}, "reward": {"type": "coming_soon", "value": 1}, "bonusDesc": "bonusDesc_coming_soon"}
            ],
            "deskItems": [
                {"id": "mug", "nameKey": "desk_mug", "cost": 1, "bonus": {"type": "global_mult", "value": 1.1}},
                {"id": "monitor", "nameKey": "desk_monitor", "cost": 5, "bonus": {"type": "idle_mult", "value": 1.2}},
                {"id": "plant", "nameKey": "desk_plant", "cost": 10, "bonus": {"type": "upgrade_discount", "value": 0.95}},
                {"id": "mousepad", "nameKey": "desk_mousepad", "cost": 25, "bonus": {"type": "prestige_mult", "value": 1.15}},
                {"id": "laptop", "nameKey": "desk_laptop", "cost": 50, "bonus": {"type": "ascend_bonus", "value": 1.1}},
                {"id": "challenges", "nameKey": "desk_challenges", "cost": 75, "bonus": {"type": "challenges_unlock", "value": 1}},
                {"id": "autobuyer", "nameKey": "desk_autobuyer", "cost": 100, "bonus": {"type": "auto_buyer", "value": 1}}
            ],
            "challenges": [
                {"id": "speed_run", "nameKey": "challenge_speed_run", "descKey": "challenge_speed_run_desc", "condition": {"type": "bp_in_time", "value": 10000, "time": 300000}, "reward": {"type": "idle_bonus", "value": 1.25}, "bonusDesc": "bonusDesc_speed_bonus"},
                {"id": "efficiency", "nameKey": "challenge_efficiency", "descKey": "challenge_efficiency_desc", "condition": {"type": "bp_per_second", "value": 100, "max_upgrades": 20}, "reward": {"type": "upgrade_discount", "value": 0.9}, "bonusDesc": "bonusDesc_efficiency_bonus"},
                {"id": "minimalist", "nameKey": "challenge_minimalist", "descKey": "challenge_minimalist_desc", "condition": {"type": "bp_target", "value": 50000, "max_tasks": 3}, "reward": {"type": "ascend_bonus", "value": 1.3}, "bonusDesc": "bonusDesc_minimalist_bonus"},
                {"id": "prestige_rush", "nameKey": "challenge_prestige_rush", "descKey": "challenge_prestige_rush_desc", "condition": {"type": "prestige_in_time", "value": 1, "time": 600000}, "reward": {"type": "prestige_bonus", "value": 1.4}, "bonusDesc": "bonusDesc_prestige_rush_bonus"},
                {"id": "marathon", "nameKey": "challenge_marathon", "descKey": "challenge_marathon_desc", "condition": {"type": "continuous_play", "value": 3600000}, "reward": {"type": "global_mult", "value": 1.2}, "bonusDesc": "bonusDesc_marathon_bonus"}
            ],
            "multiBuyOptions": [1, 2, 5, 10, 20, 50, "max"],
            "prestigeThreshold": 50000,
            "prestigeBreakThreshold": 50000,
            "translations": {
                "pl": {
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
                    "ach_idle_master_desc": "Osiągnij 1000 BP/s przychodu",
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
                    "help_content": "Witaj w Korposzczur!\\n\\nCel: Rozwijaj karierę korporacyjną wykonując zadania i zdobywając Biuro-Punkty (BP).\\n\\nMechaniki:\\n• Ręcznie odblokuj każde zadanie za BP (nawet pierwsze!)\\n• Ulepszaj zadania za BP aby zwiększyć przychód\\n• Awansuj zadania do wyższych rang\\n• Użyj Prestiżu aby zresetować grę za Soft Skills\\n• Kup przedmioty biurkowe za Soft Skills\\n• Zdobywaj achievementy aby odblokować nowe funkcje\\n• Ukończ wyzwania dla dodatkowych bonusów\\n• Prestiż Break pozwala zdobyć wiele Soft Skills na raz\\n\\nWskazówki:\\n• WSZYSTKIE zadania wymagają ręcznego odblokowania\\n• Multi-buy odblokuje się po 50 ulepszeniach\\n• Zablokowane kafelki zmieniają kolor gdy stać Cię na nie\\n• Wyzwania odblokują się przez przedmiot na biurku\\n• Prestiż Break odblokuje się po 10 prestiżach"
                },
                "en": {
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
                    "desk_mug": "Company mug",
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
                    "ach_idle_master_desc": "Reach 1000 BP/s income",
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
                    "help_content": "Welcome to Corporate Rat!\\n\\nGoal: Develop your corporate career by completing tasks and earning Office Points (BP).\\n\\nMechanics:\\n• Manually unlock each task with BP (even the first one!)\\n• Upgrade tasks with BP to increase income\\n• Ascend tasks to higher ranks\\n• Use Prestige to reset game for Soft Skills\\n• Buy desk items with Soft Skills\\n• Earn achievements to unlock new features\\n• Complete challenges for additional bonuses\\n• Prestige Break allows earning multiple Soft Skills at once\\n\\nTips:\\n• ALL tasks require manual unlocking\\n• Multi-buy unlocks after 50 upgrades\\n• Locked tiles change color when affordable\\n• Challenges unlock through desk item\\n• Prestige Break unlocks after 10 prestiges"
                }
            },
            "quotes": {
                "pl": [
                    "Zrobimy szybki catch-up po daily standup-ie",
                    "Musimy to deep-dive'ować na najbliższym sprint planning'u",
                    "Poczekajmy na feedback od stakeholderów",
                    "To jest bardzo low-hanging fruit",
                    "Potrzebujemy więcej synergii w teamie",
                    "Zorganizujemy brainstorming na ten temat",
                    "Trzeba to jeszcze raz przeanalizować",
                    "Prześlij mi ten deck po meetingu",
                    "Wdrożymy to w następnym release'ie",
                    "Potrzebujemy alignment z business'em",
                    "Let's touch base offline na ten temat",
                    "To jest bardzo scalable solution",
                    "Musimy być bardziej agile w approach'u",
                    "Ten task jest high-priority na backlog'u"
                ],
                "en": [
                    "Let's do a quick catch-up after the daily standup",
                    "We need to deep-dive this in the next sprint planning",
                    "Let's wait for stakeholder feedback",
                    "This is very low-hanging fruit",
                    "We need more synergy in the team",
                    "Let's organize a brainstorming session",
                    "We need to analyze this once more",
                    "Send me that deck after the meeting",
                    "We'll implement this in the next release",
                    "We need alignment with business",
                    "Let's touch base offline about this",
                    "This is a very scalable solution",
                    "We need to be more agile in our approach",
                    "This task is high-priority on the backlog"
                ]
            },
            "ranks": ["Junior", "Mid", "Senior", "Lead", "Manager", "Director"]
        };
    }

    loadGameState() {
        const defaultState = {
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

        settingsClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSettingsModal();
        });
        settingsBackdrop.addEventListener('click', closeSettingsModal);

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
                const canAscend = taskState.level >= 10;
                btn.disabled = !canAscend;
                btn.className = `btn btn--sm ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}`;
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
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                if (key === 'help_content') {
                    el.textContent = translation.replace(/\\n/g, '\n');
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
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // Update task progress and generate BP
        let totalBPGained = 0;
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState || !taskState.unlocked) return;

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

    calculateTaskIdleRate(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let rate = taskData.baseIdle * Math.pow(taskData.idleMultiplier, taskState.level - 1);
        
        // Apply ascension multiplier
        rate *= Math.pow(2, taskState.ascensions);
        
        // Apply global multipliers
        rate *= this.getGlobalMultiplier();
        
        return rate;
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
        
        while (totalCost <= this.gameState.bp && amount < 1000) {
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
        if (taskState.level < 10) return;

        taskState.level = 1;
        taskState.ascensions++;
        taskState.progress = 0;
        this.gameState.stats.totalAscensions++;
        this.checkAchievements();
        this.renderTasks();
        this.updateTaskButtonStates();
        this.showNotification(`Task ascended: ${this.translations[this.currentLanguage][this.gameData.tasks.find(t => t.id === taskId).nameKey]}`);
    }

    performPrestige() {
        const threshold = this.gameState.features.prestigeBreakUnlocked ? this.gameData.prestigeBreakThreshold : this.gameData.prestigeThreshold;
        if (this.gameState.totalBPEarned < threshold) return;

        const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / threshold));
        
        // Reset game state but keep achievements, desk items, and features
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const featuresState = { ...this.gameState.features };
        const challengesState = { ...this.gameState.challenges };

        this.gameState = this.loadGameState();
        
        // ALL tasks start locked again after prestige
        this.gameData.tasks.forEach(task => {
            this.gameState.tasks[task.id] = { 
                level: 1, 
                progress: 0, 
                unlocked: false, 
                ascensions: 0, 
                locked: true 
            };
        });
        
        this.gameState.softSkills += softSkillsGain;
        this.gameState.stats.softSkillsEarned += softSkillsGain;
        this.gameState.prestigeCount++;
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.features = featuresState;
        this.gameState.challenges = challengesState;

        this.checkAchievements();
        this.checkFeatureUnlocks();
        this.renderAll();
        this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skills!`);
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
            
            // Show unlock button for locked tasks
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

            const taskCard = this.createTaskCard(taskData, taskState);
            container.appendChild(taskCard);
        });
        this.updateTaskButtonStates();
    }

    createTaskCard(taskData, taskState) {
        const card = document.createElement('div');
        card.className = 'task-card';
        
        const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
        const idleRate = this.calculateTaskIdleRate(taskData.id);
        const buyAmount = this.multiBuyAmount === 'max' ? this.calculateMaxBuyAmount(taskData.id) : parseInt(this.multiBuyAmount);
        const upgradeCost = this.calculateMultiBuyCost(taskData.id, buyAmount);
        const canUpgrade = this.gameState.bp >= upgradeCost && buyAmount > 0;
        const canAscend = taskState.level >= 10;

        card.innerHTML = `
            <div class="task-header">
                <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                <div class="task-rank">${rank}</div>
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
                        data-task-id="${taskData.id}" data-action="ascend" ${!canAscend ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].ascend}
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
            
            shopItem.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${this.translations[this.currentLanguage][item.nameKey]}</div>
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
        const itemsGroup = document.getElementById('desk-items');
        itemsGroup.innerHTML = '';

        // Add visual representations of owned desk items
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (!this.gameState.deskItems[itemId]) return;

            const item = document.createElement('g');
            item.className = 'desk-item';
            
            switch (itemId) {
                case 'mug':
                    item.innerHTML = `<circle cx="120" cy="160" r="12" fill="#8B4513"/>
                                     <rect x="115" y="165" width="10" height="3" fill="#654321"/>`;
                    break;
                case 'monitor':
                    item.innerHTML = `<rect x="210" y="125" width="50" height="35" fill="#2c3e50" rx="3"/>
                                     <rect x="213" y="128" width="44" height="29" fill="#3498db" rx="2"/>`;
                    break;
                case 'plant':
                    item.innerHTML = `<circle cx="320" cy="168" r="8" fill="#8B4513"/>
                                     <circle cx="320" cy="155" r="12" fill="#228B22"/>`;
                    break;
                case 'mousepad':
                    item.innerHTML = `<ellipse cx="200" cy="240" rx="40" ry="15" fill="#1a1a1a"/>`;
                    break;
                case 'laptop':
                    item.innerHTML = `<rect x="70" y="130" width="20" height="15" fill="#2c3e50" rx="2"/>
                                     <rect x="72" y="132" width="16" height="11" fill="#3498db" rx="1"/>`;
                    break;
                case 'challenges':
                    item.innerHTML = `<rect x="340" y="130" width="20" height="15" fill="#FFD700" rx="2"/>
                                     <text x="350" y="142" text-anchor="middle" font-size="8" fill="#000">!</text>`;
                    break;
                case 'autobuyer':
                    item.innerHTML = `<circle cx="350" cy="180" r="10" fill="#FFD700"/>
                                     <circle cx="350" cy="180" r="6" fill="#FFA500"/>`;
                    break;
            }
            
            itemsGroup.appendChild(item);
        });
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
        document.getElementById('bp-display').textContent = this.formatNumber(Math.floor(this.gameState.bp));
        document.getElementById('ss-display').textContent = Math.floor(this.gameState.softSkills);

        // Update prestige button
        const threshold = this.gameState.features.prestigeBreakUnlocked ? this.gameData.prestigeBreakThreshold : this.gameData.prestigeThreshold;
        const canPrestige = this.gameState.totalBPEarned >= threshold;
        const prestigeBtn = document.getElementById('prestige-btn');
        const prestigeInfo = document.getElementById('prestige-info');
        
        prestigeBtn.disabled = !canPrestige;
        if (canPrestige) {
            const softSkillsGain = Math.floor(Math.sqrt(this.gameState.totalBPEarned / threshold));
            prestigeInfo.textContent = `Gain ${softSkillsGain} Soft Skills`;
            prestigeBtn.classList.remove('disabled');
        } else {
            prestigeInfo.textContent = `Requires ${this.formatNumber(threshold)} total BP earned`;
            prestigeBtn.classList.add('disabled');
        }
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
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        return (num / 1000000000000).toFixed(1) + 'T';
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-surface);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            font-size: var(--font-size-sm);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
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
