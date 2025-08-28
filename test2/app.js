// Korposzczur v5 - Corporate Idle Game
// Enhanced with multi-buy mechanics, challenges, and advanced systems

class KorposzczurGame {
    constructor() {
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.translations = this.gameData.translations;
        this.currentLanguage = this.gameState.settings.language;
        this.lastSave = Date.now();
        this.lastUpdate = Date.now();
        this.updateInterval = null;
        this.saveInterval = null;
        this.quoteInterval = null;
        this.multiBuyAmount = 1;
        
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
                    "ach_first_unlock": "Pierwszy krok",
                    "ach_first_unlock_desc": "Odblokuj pierwsze zadanie",
                    "ach_upgrade_novice": "Nowicjusz ulepszeń",
                    "ach_upgrade_novice_desc": "Kup 50 ulepszeń",
                    "ach_coffee_lover": "Miłośnik kawy",
                    "ach_coffee_lover_desc": "Odblokuj zadanie kawowe",
                    "ach_meeting_master": "Mistrz spotkań",
                    "ach_meeting_master_desc": "Osiągnij 15 poziom spotkań",
                    "ach_first_ascend": "Pierwszy awans",
                    "ach_first_ascend_desc": "Awansuj pierwsze zadanie",
                    "ach_kpi_analyst": "Analityk KPI",
                    "ach_kpi_analyst_desc": "Odblokuj analizę KPI",
                    "ach_big_spender": "Wielki wydawca",
                    "ach_big_spender_desc": "Wydaj 25,000 BP na ulepszenia",
                    "ach_innovation_guru": "Guru innowacji",
                    "ach_innovation_guru_desc": "Odblokuj burzę mózgów",
                    "ach_first_prestige": "Soft Skills mistrz",
                    "ach_first_prestige_desc": "Wykonaj pierwszy prestiż",
                    "ach_optimizer": "Optymalizator",
                    "ach_optimizer_desc": "Odblokuj optymalizację procesów",
                    "ach_multibuy_expert": "Expert multi-buy",
                    "ach_multibuy_expert_desc": "Użyj multi-buy 25 razy",
                    "ach_corporate_ladder": "Drabina korporacyjna",
                    "ach_corporate_ladder_desc": "Wykonaj 10 awansów",
                    "ach_idle_master": "Mistrz idle",
                    "ach_idle_master_desc": "Osiągnij 1000 BP/s",
                    "ach_dedication": "Oddanie",
                    "ach_dedication_desc": "Graj przez 2 godziny",
                    "ach_soft_skills_beginner": "Soft Skills początkujący",
                    "ach_soft_skills_beginner_desc": "Zdobądź pierwszy Soft Skills",
                    "ach_soft_skills_expert": "Soft Skills ekspert",
                    "ach_soft_skills_expert_desc": "Zdobądź 10 Soft Skills",
                    "ach_soft_skills_master": "Soft Skills mistrz",
                    "ach_soft_skills_master_desc": "Zdobądź 50 Soft Skills",
                    "ach_first_desk_item": "Pierwszy gadżet",
                    "ach_first_desk_item_desc": "Kup pierwszy przedmiot na biurko",
                    "ach_office_decorator": "Dekorator biura",
                    "ach_office_decorator_desc": "Kup 3 przedmioty na biurko",
                    "ach_office_complete": "Kompletne biuro",
                    "ach_office_complete_desc": "Kup wszystkie przedmioty na biurko",
                    "ach_prestige_veteran": "Weteran prestiżu",
                    "ach_prestige_veteran_desc": "Wykonaj 5 prestiży",
                    "ach_prestige_master": "Mistrz prestiżu",
                    "ach_prestige_master_desc": "Wykonaj 10 prestiży - odblokuje Prestiż Break",
                    "ach_challenge_master": "Mistrz wyzwań",
                    "ach_challenge_master_desc": "Ukończ 5 wyzwań",
                    "ach_future_update": "W następnej wersji",
                    "ach_future_update_desc": "Do zobaczenia w kolejnym update gry",
                    "bonusDesc_bp_5": "+5% do generowania BP",
                    "bonusDesc_bp_10": "+10% do generowania BP",
                    "bonusDesc_idle_10": "+10% do idle wszystkich zadań",
                    "bonusDesc_idle_20": "+20% do idle wszystkich zadań",
                    "bonusDesc_global_15": "+15% do wszystkich bonusów",
                    "bonusDesc_global_25": "+25% do wszystkich bonusów",
                    "bonusDesc_global_30": "+30% do wszystkich bonusów",
                    "bonusDesc_upgrade_discount_5": "-5% koszt ulepszeń",
                    "bonusDesc_ascend_20": "+20% bonusu z awansów",
                    "bonusDesc_ascend_discount_10": "-10% koszt awansów",
                    "bonusDesc_prestige_15": "+15% Soft Skills z prestiżu",
                    "bonusDesc_prestige_20": "+20% Soft Skills z prestiżu",
                    "bonusDesc_prestige_30": "+30% Soft Skills z prestiżu",
                    "bonusDesc_soft_skill_10": "+10% efektywność Soft Skills",
                    "bonusDesc_soft_skill_25": "+25% efektywność Soft Skills",
                    "bonusDesc_soft_skill_50": "+50% efektywność Soft Skills",
                    "bonusDesc_desk_unlock": "Odblokowanie karty Biurko",
                    "bonusDesc_desk_discount_10": "-10% koszt przedmiotów biurka",
                    "bonusDesc_multibuy_upgrades": "Odblokowanie multi-buy dla ulepszeń",
                    "bonusDesc_multibuy_ascend": "Odblokowanie multi-buy dla awansów",
                    "bonusDesc_max_buy": "Odblokowanie opcji 'Kup max'",
                    "bonusDesc_prestige_break": "Odblokowanie Prestiż Break - wielokrotne Soft Skills",
                    "bonusDesc_speed_bonus": "+25% do szybkości idle",
                    "bonusDesc_efficiency_bonus": "-10% koszt ulepszeń",
                    "bonusDesc_minimalist_bonus": "+30% bonusu z awansów",
                    "bonusDesc_prestige_rush_bonus": "+40% Soft Skills z prestiżu",
                    "bonusDesc_marathon_bonus": "+20% do wszystkich bonusów",
                    "bonusDesc_challenge_master": "+50% do wszystkich bonusów",
                    "bonusDesc_coming_soon": "Wkrótce w następnej aktualizacji!",
                    "help_content": "Witaj w Korposzczur!\\n\\nCel: Rozwijaj karierę korporacyjną wykonując zadania i zdobywając Biuro-Punkty (BP).\\n\\nMechaniki:\\n• Ręcznie odblokuj każde zadanie za BP\\n• Ulepszaj zadania za BP aby zwiększyć przychód\\n• Awansuj zadania do wyższych rang\\n• Użyj Prestiżu aby zresetować grę za Soft Skills\\n• Kup przedmioty biurkowe za Soft Skills\\n• Zdobywaj achievementy aby odblokować nowe funkcje\\n• Ukończ wyzwania dla dodatkowych bonusów\\n• Prestiż Break pozwala zdobyć wiele Soft Skills na raz\\n\\nWskazówki:\\n• Multi-buy odblokuje się po 50 ulepszeniach\\n• Zablokowane kafelki zmieniają kolor gdy stać Cię na nie\\n• Wyzwania odblokują się przez przedmiot na biurku\\n• Prestiż Break odblokuje się po 10 prestiżach"
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
                    "ach_first_unlock": "First step",
                    "ach_first_unlock_desc": "Unlock first task",
                    "ach_upgrade_novice": "Upgrade novice",
                    "ach_upgrade_novice_desc": "Buy 50 upgrades",
                    "ach_coffee_lover": "Coffee lover",
                    "ach_coffee_lover_desc": "Unlock coffee task",
                    "ach_meeting_master": "Meeting master",
                    "ach_meeting_master_desc": "Reach level 15 in meetings",
                    "ach_first_ascend": "First promotion",
                    "ach_first_ascend_desc": "Ascend first task",
                    "ach_kpi_analyst": "KPI analyst",
                    "ach_kpi_analyst_desc": "Unlock KPI analysis",
                    "ach_big_spender": "Big spender",
                    "ach_big_spender_desc": "Spend 25,000 BP on upgrades",
                    "ach_innovation_guru": "Innovation guru",
                    "ach_innovation_guru_desc": "Unlock brainstorming",
                    "ach_first_prestige": "Soft Skills master",
                    "ach_first_prestige_desc": "Perform first prestige",
                    "ach_optimizer": "Optimizer",
                    "ach_optimizer_desc": "Unlock process optimization",
                    "ach_multibuy_expert": "Multi-buy expert",
                    "ach_multibuy_expert_desc": "Use multi-buy 25 times",
                    "ach_corporate_ladder": "Corporate ladder",
                    "ach_corporate_ladder_desc": "Perform 10 ascensions",
                    "ach_idle_master": "Idle master",
                    "ach_idle_master_desc": "Reach 1000 BP/s",
                    "ach_dedication": "Dedication",
                    "ach_dedication_desc": "Play for 2 hours",
                    "ach_soft_skills_beginner": "Soft Skills beginner",
                    "ach_soft_skills_beginner_desc": "Earn first Soft Skills",
                    "ach_soft_skills_expert": "Soft Skills expert",
                    "ach_soft_skills_expert_desc": "Earn 10 Soft Skills",
                    "ach_soft_skills_master": "Soft Skills master",
                    "ach_soft_skills_master_desc": "Earn 50 Soft Skills",
                    "ach_first_desk_item": "First gadget",
                    "ach_first_desk_item_desc": "Buy first desk item",
                    "ach_office_decorator": "Office decorator",
                    "ach_office_decorator_desc": "Buy 3 desk items",
                    "ach_office_complete": "Complete office",
                    "ach_office_complete_desc": "Buy all desk items",
                    "ach_prestige_veteran": "Prestige veteran",
                    "ach_prestige_veteran_desc": "Perform 5 prestiges",
                    "ach_prestige_master": "Prestige master",
                    "ach_prestige_master_desc": "Perform 10 prestiges - unlocks Prestige Break",
                    "ach_challenge_master": "Challenge master",
                    "ach_challenge_master_desc": "Complete 5 challenges",
                    "ach_future_update": "Next update",
                    "ach_future_update_desc": "Coming in the next game update",
                    "bonusDesc_bp_5": "+5% BP generation",
                    "bonusDesc_bp_10": "+10% BP generation",
                    "bonusDesc_idle_10": "+10% idle for all tasks",
                    "bonusDesc_idle_20": "+20% idle for all tasks",
                    "bonusDesc_global_15": "+15% to all bonuses",
                    "bonusDesc_global_25": "+25% to all bonuses",
                    "bonusDesc_global_30": "+30% to all bonuses",
                    "bonusDesc_upgrade_discount_5": "-5% upgrade costs",
                    "bonusDesc_ascend_20": "+20% ascension bonuses",
                    "bonusDesc_ascend_discount_10": "-10% ascension costs",
                    "bonusDesc_prestige_15": "+15% Soft Skills from prestige",
                    "bonusDesc_prestige_20": "+20% Soft Skills from prestige",
                    "bonusDesc_prestige_30": "+30% Soft Skills from prestige",
                    "bonusDesc_soft_skill_10": "+10% Soft Skills effectiveness",
                    "bonusDesc_soft_skill_25": "+25% Soft Skills effectiveness",
                    "bonusDesc_soft_skill_50": "+50% Soft Skills effectiveness",
                    "bonusDesc_desk_unlock": "Unlocks Desk tab",
                    "bonusDesc_desk_discount_10": "-10% desk item costs",
                    "bonusDesc_multibuy_upgrades": "Unlocks multi-buy for upgrades",
                    "bonusDesc_multibuy_ascend": "Unlocks multi-buy for ascensions",
                    "bonusDesc_max_buy": "Unlocks 'Buy max' option",
                    "bonusDesc_prestige_break": "Unlocks Prestige Break - multiple Soft Skills",
                    "bonusDesc_speed_bonus": "+25% idle speed",
                    "bonusDesc_efficiency_bonus": "-10% upgrade costs",
                    "bonusDesc_minimalist_bonus": "+30% ascension bonuses",
                    "bonusDesc_prestige_rush_bonus": "+40% Soft Skills from prestige",
                    "bonusDesc_marathon_bonus": "+20% to all bonuses",
                    "bonusDesc_challenge_master": "+50% to all bonuses",
                    "bonusDesc_coming_soon": "Coming soon in next update!",
                    "help_content": "Welcome to Corporate Rat!\\n\\nGoal: Develop your corporate career by completing tasks and earning Office Points (BP).\\n\\nMechanics:\\n• Manually unlock each task with BP\\n• Upgrade tasks with BP to increase income\\n• Ascend tasks to higher ranks\\n• Use Prestige to reset game for Soft Skills\\n• Buy desk items with Soft Skills\\n• Earn achievements to unlock new features\\n• Complete challenges for additional bonuses\\n• Prestige Break allows earning multiple Soft Skills at once\\n\\nTips:\\n• Multi-buy unlocks after 50 upgrades\\n• Locked tiles change color when affordable\\n• Challenges unlock through desk item\\n• Prestige Break unlocks after 10 prestiges"
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
            tasks: {
                email: { level: 1, progress: 0, unlocked: true, ascensions: 0 }
            },
            achievements: {},
            deskItems: {},
            challenges: {},
            settings: {
                language: 'pl',
                theme: 'light'
            },
            stats: {
                totalUpgrades: 0,
                totalAscensions: 0,
                playTime: 0,
                multibuyUsed: 0,
                challengesCompleted: 0,
                softSkillsEarned: 0,
                deskItemsBought: 0
            },
            features: {
                multibuyUnlocked: false,
                deskUnlocked: false,
                challengesUnlocked: false,
                prestigeBreak: false,
                maxBuyUnlocked: false
            }
        };

        try {
            const saved = localStorage.getItem('korposzczur-save');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...defaultState, ...parsed, 
                    features: { ...defaultState.features, ...parsed.features },
                    stats: { ...defaultState.stats, ...parsed.stats }
                };
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

    init() {
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.renderAll();
        this.startGameLoop();
        this.startQuoteRotation();
        this.updateMultiBuyUI();
        this.updateTabVisibility();

        // Initialize debug commands
        window.debug = {
            addBP: (amount) => {
                this.gameState.bp += amount;
                this.updateDisplay();
                this.updateAffordabilityStates();
            },
            addSS: (amount) => {
                this.gameState.softSkills += amount;
                this.updateDisplay();
            },
            unlockAll: () => {
                this.gameData.tasks.forEach(task => {
                    if (!this.gameState.tasks[task.id]) {
                        this.gameState.tasks[task.id] = { level: 1, progress: 0, unlocked: true, ascensions: 0 };
                    } else {
                        this.gameState.tasks[task.id].unlocked = true;
                    }
                });
                this.renderTasks();
            },
            unlockMultiBuy: () => {
                this.gameState.features.multibuyUnlocked = true;
                this.updateMultiBuyUI();
            },
            reset: () => {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        };
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Multi-buy buttons
        document.querySelectorAll('.multibuy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = e.target.getAttribute('data-amount');
                this.setMultiBuyAmount(amount === 'max' ? 'max' : parseInt(amount));
            });
        });

        // Settings modal
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');
        const modalBackdrop = settingsModal.querySelector('.modal-backdrop');

        settingsToggle.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });

        const closeSettingsModal = () => {
            settingsModal.classList.add('hidden');
        };

        settingsClose.addEventListener('click', closeSettingsModal);
        modalBackdrop.addEventListener('click', closeSettingsModal);

        // Help modal
        const helpToggle = document.getElementById('help-toggle');
        const helpModal = document.getElementById('help-modal');
        const helpClose = document.getElementById('help-close');
        const helpBackdrop = helpModal.querySelector('.modal-backdrop');

        helpToggle.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
        });

        const closeHelpModal = () => {
            helpModal.classList.add('hidden');
        };

        helpClose.addEventListener('click', closeHelpModal);
        helpBackdrop.addEventListener('click', closeHelpModal);

        // Language and theme selectors
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.gameState.settings.language = e.target.value;
            this.currentLanguage = e.target.value;
            this.updateLanguage();
            this.renderAll();
            this.saveGameState();
        });

        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.gameState.settings.theme = e.target.value;
            this.updateTheme();
            this.saveGameState();
        });

        // Reset save
        document.getElementById('reset-save').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your save? This cannot be undone!')) {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        });

        // Prestige button
        document.getElementById('prestige-btn').addEventListener('click', () => {
            this.performPrestige();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Handle special case for challenges tab
        const targetId = tabName === 'challenges' ? 'challenges-tab-content' : `${tabName}-tab`;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.classList.add('active');
        }
    }

    setMultiBuyAmount(amount) {
        this.multiBuyAmount = amount;
        
        // Update button states
        document.querySelectorAll('.multibuy-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-amount="${amount}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update all task buttons
        this.renderTasks();
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                if (key === 'help_content') {
                    el.innerHTML = translation.replace(/\\n/g, '<br>');
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

    updateTabVisibility() {
        // Show/hide challenges tab
        const challengesTab = document.getElementById('challenges-tab');
        if (this.gameState.features.challengesUnlocked) {
            challengesTab.classList.remove('hidden');
        } else {
            challengesTab.classList.add('hidden');
        }
    }

    updateMultiBuyUI() {
        const lockOverlay = document.getElementById('multibuy-lock');
        if (this.gameState.features.multibuyUnlocked) {
            lockOverlay.classList.add('unlocked');
        } else {
            lockOverlay.classList.remove('unlocked');
        }
    }

    startGameLoop() {
        this.updateInterval = setInterval(() => {
            this.gameLoop();
        }, 50); // 20 FPS for smooth idle progress

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

        // Update play time
        this.gameState.stats.playTime += deltaTime;

        // Update task progress and generate BP
        let totalBPGained = 0;
        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState.unlocked) return;

            const idleRate = this.calculateTaskIdleRate(taskId);
            const progressIncrement = (deltaTime / 1000) * (idleRate / 10); // Normalize to cycles per second

            taskState.progress += progressIncrement;
            if (taskState.progress >= 1) {
                const cycles = Math.floor(taskState.progress);
                taskState.progress = taskState.progress % 1;
                totalBPGained += idleRate * cycles;
            }
        });

        if (totalBPGained > 0) {
            this.gameState.bp += totalBPGained;
            this.gameState.totalBPEarned += totalBPGained;
            this.updateDisplay();
            this.updateAffordabilityStates();
        }

        // Check for new unlocks and achievements
        this.checkUnlocks();
        this.checkAchievements();
        this.updateChallengeProgress();
        
        // Update UI periodically
        if (now - this.lastSave > 1000) { // Update UI every second
            this.updateTaskProgress();
            this.updateUnlockProgress();
            this.updatePrestigeProgress();
            this.lastSave = now;
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
        
        return rate;
    }

    getGlobalMultiplier() {
        let multiplier = 1;
        
        // Soft skills multiplier
        multiplier *= Math.pow(1.1, this.gameState.softSkills);
        
        // Achievement bonuses
        Object.keys(this.gameState.achievements).forEach(achievementId => {
            if (this.gameState.achievements[achievementId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achievementId);
                if (achievement && achievement.reward.type === 'bp_bonus') {
                    multiplier *= achievement.reward.value;
                } else if (achievement && achievement.reward.type === 'global_mult') {
                    multiplier *= achievement.reward.value;
                } else if (achievement && achievement.reward.type === 'idle_bonus') {
                    multiplier *= achievement.reward.value;
                }
            }
        });
        
        // Desk item bonuses
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && (item.bonus.type === 'global_mult' || item.bonus.type === 'idle_mult')) {
                    multiplier *= item.bonus.value;
                }
            }
        });

        // Challenge bonuses
        Object.keys(this.gameState.challenges).forEach(challengeId => {
            if (this.gameState.challenges[challengeId] && this.gameState.challenges[challengeId].completed) {
                const challenge = this.gameData.challenges.find(c => c.id === challengeId);
                if (challenge && (challenge.reward.type === 'global_mult' || challenge.reward.type === 'idle_bonus')) {
                    multiplier *= challenge.reward.value;
                }
            }
        });
        
        return multiplier;
    }

    updateAffordabilityStates() {
        // Update task affordability colors
        this.gameData.tasks.forEach(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            const taskCard = document.querySelector(`[data-task-id="${taskData.id}"]`);
            
            if (!taskState || !taskState.unlocked) {
                // Check if locked task is affordable
                if (this.gameState.bp >= taskData.unlockCost && taskCard) {
                    taskCard.classList.add('affordable');
                    taskCard.classList.remove('locked');
                } else if (taskCard) {
                    taskCard.classList.remove('affordable');
                    taskCard.classList.add('locked');
                }
            }
        });

        // Update multi-buy button states
        if (this.gameState.features.multibuyUnlocked) {
            document.querySelectorAll('.multibuy-btn').forEach(btn => {
                const amount = btn.getAttribute('data-amount');
                // Enable/disable based on affordability
                btn.disabled = false; // For now, always enable multibuy buttons
            });
        }
    }

    checkUnlocks() {
        this.gameData.tasks.forEach(task => {
            if (!this.gameState.tasks[task.id] || !this.gameState.tasks[task.id].unlocked) {
                if (this.gameState.bp >= task.unlockCost) {
                    // Auto-unlock task when affordable
                    if (!this.gameState.tasks[task.id]) {
                        this.gameState.tasks[task.id] = { level: 1, progress: 0, unlocked: false, ascensions: 0 };
                    }
                    // Don't auto-unlock, just mark as affordable
                }
            }
        });
    }

    checkAchievements() {
        this.gameData.achievements.forEach(achievement => {
            if (this.gameState.achievements[achievement.id]) return;

            let unlocked = false;
            const condition = achievement.condition;

            switch (condition.type) {
                case 'tasks_unlocked':
                    const unlockedTasks = Object.values(this.gameState.tasks).filter(t => t.unlocked).length;
                    unlocked = unlockedTasks >= condition.value;
                    break;
                case 'upgrades_bought':
                    unlocked = this.gameState.stats.totalUpgrades >= condition.value;
                    break;
                case 'task_unlocked':
                    const taskState = this.gameState.tasks[condition.taskId];
                    unlocked = taskState && taskState.unlocked;
                    break;
                case 'task_level':
                    const taskLevelState = this.gameState.tasks[condition.taskId];
                    unlocked = taskLevelState && taskLevelState.level >= condition.value;
                    break;
                case 'ascensions':
                    unlocked = this.gameState.stats.totalAscensions >= condition.value;
                    break;
                case 'bp_spent':
                    unlocked = this.gameState.totalBPSpent >= condition.value;
                    break;
                case 'prestiges':
                    unlocked = this.gameState.prestigeCount >= condition.value;
                    break;
                case 'multibuy_used':
                    unlocked = this.gameState.stats.multibuyUsed >= condition.value;
                    break;
                case 'total_ascensions':
                    unlocked = this.gameState.stats.totalAscensions >= condition.value;
                    break;
                case 'idle_rate':
                    const totalIdleRate = Object.keys(this.gameState.tasks)
                        .filter(taskId => this.gameState.tasks[taskId].unlocked)
                        .reduce((sum, taskId) => sum + this.calculateTaskIdleRate(taskId), 0);
                    unlocked = totalIdleRate >= condition.value;
                    break;
                case 'play_time':
                    unlocked = this.gameState.stats.playTime >= condition.value;
                    break;
                case 'soft_skills_earned':
                    unlocked = this.gameState.stats.softSkillsEarned >= condition.value;
                    break;
                case 'desk_items_bought':
                    unlocked = this.gameState.stats.deskItemsBought >= condition.value;
                    break;
                case 'challenges_completed':
                    unlocked = this.gameState.stats.challengesCompleted >= condition.value;
                    break;
            }

            if (unlocked) {
                this.gameState.achievements[achievement.id] = true;
                this.applyAchievementReward(achievement);
                this.showNotification(`Achievement: ${this.translations[this.currentLanguage][achievement.nameKey]}`);
                this.renderAchievements();
            }
        });
    }

    applyAchievementReward(achievement) {
        const reward = achievement.reward;
        
        switch (reward.type) {
            case 'multibuy_unlock':
                if (reward.value === 'upgrades') {
                    this.gameState.features.multibuyUnlocked = true;
                    this.updateMultiBuyUI();
                }
                break;
            case 'desk_unlock':
                this.gameState.features.deskUnlocked = true;
                break;
            case 'max_buy_unlock':
                this.gameState.features.maxBuyUnlocked = true;
                break;
            case 'prestige_break':
                this.gameState.features.prestigeBreak = true;
                break;
        }
    }

    updateChallengeProgress() {
        if (!this.gameState.features.challengesUnlocked) return;

        this.gameData.challenges.forEach(challenge => {
            if (!this.gameState.challenges[challenge.id]) {
                this.gameState.challenges[challenge.id] = {
                    started: false,
                    completed: false,
                    progress: 0,
                    startTime: null
                };
            }

            const challengeState = this.gameState.challenges[challenge.id];
            if (challengeState.completed) return;

            const condition = challenge.condition;
            let progress = 0;

            switch (condition.type) {
                case 'bp_in_time':
                    if (!challengeState.started && this.gameState.bp > 0) {
                        challengeState.started = true;
                        challengeState.startTime = Date.now();
                    }
                    if (challengeState.started) {
                        const timeLeft = condition.time - (Date.now() - challengeState.startTime);
                        if (timeLeft > 0) {
                            progress = Math.min(this.gameState.bp / condition.value, 1);
                            if (progress >= 1) {
                                this.completeChallenge(challenge.id);
                            }
                        } else if (progress < 1) {
                            // Failed - reset
                            challengeState.started = false;
                            challengeState.startTime = null;
                        }
                    }
                    break;
                    
                case 'bp_per_second':
                    const upgradeCount = this.gameState.stats.totalUpgrades;
                    if (upgradeCount <= condition.max_upgrades) {
                        const totalIdleRate = Object.keys(this.gameState.tasks)
                            .filter(taskId => this.gameState.tasks[taskId].unlocked)
                            .reduce((sum, taskId) => sum + this.calculateTaskIdleRate(taskId), 0);
                        progress = Math.min(totalIdleRate / condition.value, 1);
                        if (progress >= 1) {
                            this.completeChallenge(challenge.id);
                        }
                    }
                    break;
                    
                case 'continuous_play':
                    progress = Math.min(this.gameState.stats.playTime / condition.value, 1);
                    if (progress >= 1) {
                        this.completeChallenge(challenge.id);
                    }
                    break;
            }

            challengeState.progress = progress;
        });
    }

    completeChallenge(challengeId) {
        const challengeState = this.gameState.challenges[challengeId];
        const challenge = this.gameData.challenges.find(c => c.id === challengeId);
        
        if (challengeState.completed) return;
        
        challengeState.completed = true;
        this.gameState.stats.challengesCompleted++;
        
        this.showNotification(`Challenge Complete: ${this.translations[this.currentLanguage][challenge.nameKey]}`);
        this.renderChallenges();
    }

    unlockTask(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        if (this.gameState.bp >= taskData.unlockCost) {
            this.gameState.bp -= taskData.unlockCost;
            this.gameState.totalBPSpent += taskData.unlockCost;
            
            if (!this.gameState.tasks[taskId]) {
                this.gameState.tasks[taskId] = { level: 1, progress: 0, unlocked: true, ascensions: 0 };
            } else {
                this.gameState.tasks[taskId].unlocked = true;
            }
            
            this.renderTasks();
            this.updateDisplay();
            this.updateAffordabilityStates();
        }
    }

    upgradeTask(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        const amount = this.multiBuyAmount === 'max' ? this.calculateMaxUpgrades(taskId) : this.multiBuyAmount;
        const totalCost = this.calculateMultiUpgradeCost(taskId, amount);
        
        if (this.gameState.bp >= totalCost) {
            this.gameState.bp -= totalCost;
            this.gameState.totalBPSpent += totalCost;
            taskState.level += amount;
            this.gameState.stats.totalUpgrades += amount;
            
            if (this.multiBuyAmount > 1) {
                this.gameState.stats.multibuyUsed++;
            }
            
            this.renderTasks();
            this.updateDisplay();
            this.updateAffordabilityStates();
        }
    }

    calculateMaxUpgrades(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let maxUpgrades = 0;
        let totalCost = 0;
        let currentLevel = taskState.level;
        
        while (totalCost <= this.gameState.bp && maxUpgrades < 100) { // Cap at 100 for performance
            const nextCost = this.calculateUpgradeCost(taskId, currentLevel);
            if (totalCost + nextCost > this.gameState.bp) break;
            
            totalCost += nextCost;
            currentLevel++;
            maxUpgrades++;
        }
        
        return maxUpgrades;
    }

    calculateMultiUpgradeCost(taskId, amount) {
        const taskState = this.gameState.tasks[taskId];
        let totalCost = 0;
        
        for (let i = 0; i < amount; i++) {
            totalCost += this.calculateUpgradeCost(taskId, taskState.level + i);
        }
        
        return totalCost;
    }

    calculateUpgradeCost(taskId, level = null) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        const currentLevel = level !== null ? level : taskState.level;
        let cost = taskData.baseCost * Math.pow(taskData.costMultiplier, currentLevel);
        
        // Apply upgrade discount from achievements/desk items
        Object.keys(this.gameState.achievements).forEach(achievementId => {
            if (this.gameState.achievements[achievementId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achievementId);
                if (achievement && achievement.reward.type === 'upgrade_discount') {
                    cost *= achievement.reward.value;
                }
            }
        });

        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'upgrade_discount') {
                    cost *= item.bonus.value;
                }
            }
        });

        // Challenge bonuses
        Object.keys(this.gameState.challenges).forEach(challengeId => {
            if (this.gameState.challenges[challengeId] && this.gameState.challenges[challengeId].completed) {
                const challenge = this.gameData.challenges.find(c => c.id === challengeId);
                if (challenge && challenge.reward.type === 'upgrade_discount') {
                    cost *= challenge.reward.value;
                }
            }
        });
        
        return Math.floor(cost);
    }

    ascendTask(taskId) {
        const taskState = this.gameState.tasks[taskId];
        if (taskState.level < 10) return;

        taskState.level = 1;
        taskState.ascensions++;
        taskState.progress = 0;
        this.gameState.stats.totalAscensions++;
        this.renderTasks();
    }

    updatePrestigeProgress() {
        const progress = Math.min(this.gameState.totalBPEarned / this.gameData.prestigeThreshold, 1);
        const progressBar = document.getElementById('prestige-progress-fill');
        const progressContainer = document.getElementById('prestige-progress-container');
        const readyContainer = document.getElementById('prestige-ready-container');
        
        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }
        
        if (progress >= 1) {
            // Switch to prestige ready state
            if (progressContainer) progressContainer.classList.add('hidden');
            if (readyContainer) readyContainer.classList.remove('hidden');
            
            // Calculate prestige reward
            const baseReward = Math.floor(Math.sqrt(this.gameState.totalBPEarned / this.gameData.prestigeThreshold));
            const multiplier = this.gameState.features.prestigeBreak ? 
                Math.floor(this.gameState.totalBPEarned / this.gameData.prestigeBreakThreshold) : 1;
            const totalReward = baseReward * multiplier;
            
            const rewardAmountEl = document.getElementById('prestige-reward-amount');
            if (rewardAmountEl) {
                rewardAmountEl.textContent = totalReward;
            }
        } else {
            if (progressContainer) progressContainer.classList.remove('hidden');
            if (readyContainer) readyContainer.classList.add('hidden');
        }
    }

    performPrestige() {
        if (this.gameState.totalBPEarned < this.gameData.prestigeThreshold) return;

        const baseReward = Math.floor(Math.sqrt(this.gameState.totalBPEarned / this.gameData.prestigeThreshold));
        const multiplier = this.gameState.features.prestigeBreak ? 
            Math.floor(this.gameState.totalBPEarned / this.gameData.prestigeBreakThreshold) : 1;
        const softSkillsGain = baseReward * multiplier;
        
        // Keep persistent data
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const challengesToKeep = { ...this.gameState.challenges };
        const settingsToKeep = { ...this.gameState.settings };
        const featuresToKeep = { ...this.gameState.features };
        const softSkillsToKeep = this.gameState.softSkills;
        const prestigeCountToKeep = this.gameState.prestigeCount;
        const statsToKeep = { ...this.gameState.stats };

        // Reset game state
        this.gameState = this.loadGameState();
        
        // Restore persistent data
        this.gameState.softSkills = softSkillsToKeep + softSkillsGain;
        this.gameState.prestigeCount = prestigeCountToKeep + 1;
        this.gameState.stats.softSkillsEarned = statsToKeep.softSkillsEarned + softSkillsGain;
        this.gameState.stats.totalAscensions = statsToKeep.totalAscensions;
        this.gameState.stats.multibuyUsed = statsToKeep.multibuyUsed;
        this.gameState.stats.challengesCompleted = statsToKeep.challengesCompleted;
        this.gameState.stats.deskItemsBought = statsToKeep.deskItemsBought;
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.challenges = challengesToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.features = featuresToKeep;

        this.renderAll();
        this.updateMultiBuyUI();
        this.updateTabVisibility();
        this.showNotification(`Prestige! Gained ${softSkillsGain} Soft Skills!`);
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId] || this.gameState.softSkills < item.cost) return;

        this.gameState.softSkills -= item.cost;
        this.gameState.deskItems[itemId] = true;
        this.gameState.stats.deskItemsBought++;
        
        // Handle special item effects
        if (item.bonus.type === 'challenges_unlock') {
            this.gameState.features.challengesUnlocked = true;
            this.updateTabVisibility();
        }
        
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
        this.updateAffordabilityStates();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        // Render unlocked tasks
        this.gameData.tasks.forEach(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            if (taskState && taskState.unlocked) {
                const taskCard = this.createTaskCard(taskData, taskState);
                container.appendChild(taskCard);
            }
        });

        // Render next locked task if affordable
        const nextLockedTask = this.gameData.tasks.find(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            return !taskState || !taskState.unlocked;
        });

        if (nextLockedTask) {
            const lockedCard = this.createLockedTaskCard(nextLockedTask);
            container.appendChild(lockedCard);
        }
    }

    createTaskCard(taskData, taskState) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('data-task-id', taskData.id);
        
        const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
        const idleRate = this.calculateTaskIdleRate(taskData.id);
        const upgradeCost = this.multiBuyAmount === 'max' ? 
            this.calculateMultiUpgradeCost(taskData.id, this.calculateMaxUpgrades(taskData.id)) :
            this.calculateMultiUpgradeCost(taskData.id, this.multiBuyAmount);
        const canUpgrade = this.gameState.bp >= upgradeCost;
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
                <button class="btn ${canUpgrade ? 'btn--primary' : 'btn--secondary disabled'}" 
                        onclick="game.upgradeTask('${taskData.id}')" ${!canUpgrade ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].upgrade} ${this.multiBuyAmount === 'max' ? 'Max' : 'x' + this.multiBuyAmount} (${this.formatNumber(upgradeCost)})
                </button>
                <button class="btn ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}" 
                        onclick="game.ascendTask('${taskData.id}')" ${!canAscend ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].ascend}
                </button>
            </div>
        `;

        return card;
    }

    createLockedTaskCard(taskData) {
        const card = document.createElement('div');
        const canAfford = this.gameState.bp >= taskData.unlockCost;
        card.className = `task-card locked ${canAfford ? 'affordable' : ''}`;
        card.setAttribute('data-task-id', taskData.id);
        
        card.innerHTML = `
            <div class="task-header">
                <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                <div class="task-rank">${this.translations[this.currentLanguage].locked}</div>
            </div>
            
            <div class="task-stats">
                <div class="task-stat">
                    <div class="stat-label">${this.translations[this.currentLanguage].cost}</div>
                    <div class="stat-value">${this.formatNumber(taskData.unlockCost)}</div>
                </div>
                <div class="task-stat">
                    <div class="stat-label">Base BP/s</div>
                    <div class="stat-value">${this.formatNumber(taskData.baseIdle)}</div>
                </div>
            </div>
            
            <div class="task-actions">
                <button class="btn ${canAfford ? 'btn--primary' : 'btn--secondary disabled'}" 
                        onclick="game.unlockTask('${taskData.id}')" ${!canAfford ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].unlock} (${this.formatNumber(taskData.unlockCost)})
                </button>
            </div>
        `;

        return card;
    }

    renderDeskShop() {
        const container = document.getElementById('shop-items');
        container.innerHTML = '';

        this.gameData.deskItems.forEach(item => {
            const owned = this.gameState.deskItems[item.id];
            const canBuy = !owned && this.gameState.softSkills >= item.cost;

            const shopItem = document.createElement('div');
            shopItem.className = `shop-item ${owned ? 'owned' : ''}`;
            
            shopItem.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${this.translations[this.currentLanguage][item.nameKey]}</div>
                    <div class="shop-item-cost">${owned ? 'Owned' : `${item.cost} SS`}</div>
                </div>
                <button class="btn btn--sm ${canBuy ? 'btn--primary' : 'btn--secondary disabled'}" 
                        onclick="game.buyDeskItem('${item.id}')" ${!canBuy ? 'disabled' : ''}>
                    ${owned ? '✓' : this.translations[this.currentLanguage].buy}
                </button>
            `;

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
                    item.innerHTML = `<rect x="270" y="135" width="20" height="15" fill="#2c3e50" rx="2"/>
                                     <rect x="272" y="137" width="16" height="11" fill="#3498db" rx="1"/>`;
                    break;
                case 'challenges':
                    item.innerHTML = `<rect x="85" y="105" width="20" height="15" fill="#2c3e50" rx="2"/>
                                     <circle cx="95" cy="112" r="3" fill="#e74c3c"/>`;
                    break;
                case 'autobuyer':
                    item.innerHTML = `<circle cx="350" cy="120" r="15" fill="#9b59b6"/>
                                     <circle cx="350" cy="120" r="8" fill="#fff"/>
                                     <circle cx="350" cy="120" r="4" fill="#9b59b6"/>`;
                    break;
            }
            
            itemsGroup.appendChild(item);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        container.innerHTML = '';

        this.gameData.achievements.forEach(achievement => {
            const unlocked = this.gameState.achievements[achievement.id];
            
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement ${unlocked ? 'unlocked' : ''}`;
            
            achievementEl.innerHTML = `
                <div class="achievement-icon">${unlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${this.translations[this.currentLanguage][achievement.nameKey]}</div>
                    <div class="achievement-desc">${this.translations[this.currentLanguage][achievement.descKey]}</div>
                    <div class="achievement-bonus">${this.translations[this.currentLanguage][achievement.bonusDesc]}</div>
                </div>
            `;

            container.appendChild(achievementEl);
        });
    }

    renderChallenges() {
        if (!this.gameState.features.challengesUnlocked) return;
        
        const container = document.getElementById('challenges-grid');
        container.innerHTML = '';

        this.gameData.challenges.forEach(challenge => {
            const challengeState = this.gameState.challenges[challenge.id];
            const completed = challengeState && challengeState.completed;
            const inProgress = challengeState && challengeState.started && !completed;
            
            const challengeEl = document.createElement('div');
            challengeEl.className = `challenge ${completed ? 'completed' : inProgress ? 'in-progress' : ''}`;
            
            const progress = challengeState ? challengeState.progress : 0;
            const statusText = completed ? 
                this.translations[this.currentLanguage].completed :
                inProgress ?
                this.translations[this.currentLanguage].in_progress :
                this.translations[this.currentLanguage].locked;
            
            challengeEl.innerHTML = `
                <div class="challenge-header">
                    <div class="challenge-name">${this.translations[this.currentLanguage][challenge.nameKey]}</div>
                    <div class="challenge-status ${completed ? 'completed' : inProgress ? 'in-progress' : 'locked'}">${statusText}</div>
                </div>
                <div class="challenge-desc">${this.translations[this.currentLanguage][challenge.descKey]}</div>
                <div class="challenge-reward">${this.translations[this.currentLanguage][challenge.bonusDesc]}</div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress * 100}%"></div>
                    </div>
                    <div class="challenge-progress-text">${Math.floor(progress * 100)}%</div>
                </div>
            `;

            container.appendChild(challengeEl);
        });
    }

    updateDisplay() {
        document.getElementById('bp-display').textContent = this.formatNumber(Math.floor(this.gameState.bp));
        document.getElementById('ss-display').textContent = Math.floor(this.gameState.softSkills);
    }

    updateTaskProgress() {
        document.querySelectorAll('.hex-fill').forEach((fill, index) => {
            const taskCards = document.querySelectorAll('.task-card:not(.locked)');
            if (taskCards[index]) {
                const taskId = taskCards[index].getAttribute('data-task-id');
                const taskState = this.gameState.tasks[taskId];
                if (taskState && taskState.unlocked) {
                    const progress = taskState.progress * 140;
                    fill.setAttribute('stroke-dasharray', `${progress}, 140`);
                    
                    const textEl = fill.parentElement.nextElementSibling;
                    if (textEl) {
                        textEl.textContent = `${Math.floor(taskState.progress * 100)}%`;
                    }
                }
            }
        });
    }

    updateUnlockProgress() {
        const nextTask = this.gameData.tasks.find(task => {
            const taskState = this.gameState.tasks[task.id];
            return !taskState || !taskState.unlocked;
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
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-btn-primary-text);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.quoteInterval) clearInterval(this.quoteInterval);
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
`;
document.head.appendChild(style);