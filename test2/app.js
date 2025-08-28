// Korposzczur - Enhanced Corporate Idle Game
// Main game logic and state management

class KorposzczurGame {
    constructor() {
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.translations = this.gameData.translations;
        this.currentLanguage = this.gameState.settings.language;
        this.currentMultibuy = 1;
        this.lastSave = Date.now();
        this.lastUpdate = Date.now();
        this.updateInterval = null;
        this.saveInterval = null;
        this.quoteInterval = null;
        
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
                {"id": "future_update", "nameKey": "ach_future_update", "descKey": "ach_future_update_desc", "condition": {"type": "impossible", "value": 1}, "reward": {"type": "coming_soon", "value": 1}, "bonusDesc": "bonusDesc_coming_soon"}
            ],
            "deskItems": [
                {"id": "mug", "nameKey": "desk_mug", "cost": 1, "bonus": {"type": "global_mult", "value": 1.1}},
                {"id": "monitor", "nameKey": "desk_monitor", "cost": 5, "bonus": {"type": "idle_mult", "value": 1.2}},
                {"id": "plant", "nameKey": "desk_plant", "cost": 10, "bonus": {"type": "upgrade_discount", "value": 0.95}},
                {"id": "mousepad", "nameKey": "desk_mousepad", "cost": 25, "bonus": {"type": "prestige_mult", "value": 1.15}},
                {"id": "laptop", "nameKey": "desk_laptop", "cost": 50, "bonus": {"type": "ascend_bonus", "value": 1.1}},
                {"id": "autobuyer", "nameKey": "desk_autobuyer", "cost": 100, "bonus": {"type": "auto_buyer", "value": 1}}
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
                    "help": "Pomoc",
                    "biuro_punkty": "Biuro-Punkty",
                    "soft_skills": "Soft Skills",
                    "settings": "Ustawienia",
                    "prestige": "Prestiż",
                    "prestige_ready": "Prestiż Dostępny!",
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
                    "desk_autobuyer": "AI Asystent",
                    "ach_first_unlock": "Pierwszy krok",
                    "ach_first_unlock_desc": "Odblokuj pierwsze zadanie",
                    "ach_upgrade_novice": "Nowicjusz ulepszeń",
                    "ach_upgrade_novice_desc": "Kup 50 ulepszeń",
                    "ach_first_upgrade": "Pierwsze ulepszenie",
                    "ach_first_upgrade_desc": "Kup pierwsze ulepszenie zadania",
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
                    "bonusDesc_coming_soon": "Wkrótce w następnej aktualizacji!",
                    "help_content": "Witaj w Korposzczur!\\n\\nCel: Rozwijaj karierę korporacyjną wykonując zadania i zdobywając Biuro-Punkty (BP).\\n\\nMechaniki:\\n• Ręcznie odblokuj każde zadanie za BP\\n• Ulepszaj zadania za BP aby zwiększyć przychód\\n• Awansuj zadania do wyższych rang\\n• Użyj Prestiżu aby zresetować grę za Soft Skills\\n• Kup przedmioty biurkowe za Soft Skills\\n• Zdobywaj achievementy aby odblokować nowe funkcje\\n• Prestiż Break pozwala zdobyć wiele Soft Skills na raz\\n\\nWskazówki:\\n• Każde zadanie musi być najpierw ręcznie odblokowane\\n• Multi-buy pokazuje łączny koszt wszystkich ulepszeń\\n• Biurko staje się dostępne po pierwszym Soft Skills\\n• Prestiż Break odblokowuje się po 10 prestiżach"
                },
                "en": {
                    "game_title": "Corporate Rat",
                    "tab_career": "Career",
                    "tab_desk": "Desk",
                    "tab_achievements": "Achievements",
                    "help": "Help",
                    "biuro_punkty": "Office Points",
                    "soft_skills": "Soft Skills",
                    "settings": "Settings",
                    "prestige": "Prestige",
                    "prestige_ready": "Prestige Ready!",
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
                    "desk_autobuyer": "AI Assistant",
                    "ach_first_unlock": "First step",
                    "ach_first_unlock_desc": "Unlock first task",
                    "ach_upgrade_novice": "Upgrade novice",
                    "ach_upgrade_novice_desc": "Buy 50 upgrades",
                    "ach_first_upgrade": "First upgrade",
                    "ach_first_upgrade_desc": "Buy first task upgrade",
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
                    "bonusDesc_coming_soon": "Coming soon in next update!",
                    "help_content": "Welcome to Corporate Rat!\\n\\nGoal: Develop your corporate career by completing tasks and earning Office Points (BP).\\n\\nMechanics:\\n• Manually unlock each task with BP\\n• Upgrade tasks with BP to increase income\\n• Ascend tasks to higher ranks\\n• Use Prestige to reset game for Soft Skills\\n• Buy desk items with Soft Skills\\n• Earn achievements to unlock new features\\n• Prestige Break allows earning multiple Soft Skills at once\\n\\nTips:\\n• Each task must be manually unlocked first\\n• Multi-buy shows total cost for all upgrades\\n• Desk becomes available after first Soft Skills\\n• Prestige Break unlocks after 10 prestiges"
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
                    "To jest bardzo scalable solution"
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
                    "This is a very scalable solution"
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
            totalSoftSkillsEarned: 0,
            totalBPSpent: 0,
            prestigeCount: 0,
            playTimeStart: Date.now(),
            tasks: {
                email: { level: 1, progress: 0, unlocked: true, ascensions: 0 }
            },
            achievements: {},
            deskItems: {},
            settings: {
                language: 'pl',
                theme: 'light',
                reducedMotion: false
            },
            stats: {
                totalUpgrades: 0,
                totalAscensions: 0,
                multibuyUsed: 0,
                deskItemsBought: 0,
                playTime: 0
            },
            flags: {
                prestigeBreakUnlocked: false
            }
        };

        try {
            const saved = localStorage.getItem('korposzczur-save');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Migrate old saves
                if (!parsed.totalSoftSkillsEarned) parsed.totalSoftSkillsEarned = parsed.softSkills || 0;
                if (!parsed.stats) parsed.stats = defaultState.stats;
                if (!parsed.flags) parsed.flags = defaultState.flags;
                if (!parsed.playTimeStart) parsed.playTimeStart = Date.now();
                return { ...defaultState, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }

        return defaultState;
    }

    saveGameState() {
        try {
            this.gameState.stats.playTime = Date.now() - this.gameState.playTimeStart;
            localStorage.setItem('korposzczur-save', JSON.stringify(this.gameState));
            this.lastSave = Date.now();
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    init() {
        // Wait for DOM to be fully loaded
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.setupTabs();
        this.setupMultibuy();
        this.renderAll();
        this.startGameLoop();
        this.startQuoteRotation();

        // Initialize debug commands
        window.debug = {
            addBP: (amount) => {
                this.gameState.bp += amount;
                this.updateDisplay();
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
            unlockAchievement: (id) => {
                this.gameState.achievements[id] = true;
                this.renderAchievements();
            },
            reset: () => {
                localStorage.removeItem('korposzczur-save');
                location.reload();
            }
        };
    }

    setupEventListeners() {
        // Settings modal
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');

        if (settingsToggle && settingsModal && settingsClose) {
            settingsToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                settingsModal.classList.remove('hidden');
            });

            const closeModal = (e) => {
                e.preventDefault();
                e.stopPropagation();
                settingsModal.classList.add('hidden');
            };

            settingsClose.addEventListener('click', closeModal);
            
            const modalBackdrop = settingsModal.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.addEventListener('click', closeModal);
            }
        }

        // Help modal
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const helpClose = document.getElementById('help-close');

        if (helpBtn && helpModal && helpClose) {
            helpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const helpContent = document.getElementById('help-content');
                if (helpContent) {
                    helpContent.textContent = this.translations[this.currentLanguage].help_content;
                }
                helpModal.classList.remove('hidden');
            });

            const closeHelpModal = (e) => {
                e.preventDefault();
                e.stopPropagation();
                helpModal.classList.add('hidden');
            };

            helpClose.addEventListener('click', closeHelpModal);
            
            const helpBackdrop = helpModal.querySelector('.modal-backdrop');
            if (helpBackdrop) {
                helpBackdrop.addEventListener('click', closeHelpModal);
            }
        }

        // Language and theme selectors
        const languageSelect = document.getElementById('language-select');
        const themeSelect = document.getElementById('theme-select');

        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.gameState.settings.language = e.target.value;
                this.currentLanguage = e.target.value;
                this.updateLanguage();
                this.renderAll();
                this.saveGameState();
            });
        }

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.gameState.settings.theme = e.target.value;
                this.updateTheme();
                this.saveGameState();
            });
        }

        // Reset save
        const resetSaveBtn = document.getElementById('reset-save');
        if (resetSaveBtn) {
            resetSaveBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset your save? This cannot be undone!')) {
                    localStorage.removeItem('korposzczur-save');
                    location.reload();
                }
            });
        }

        // Prestige button
        const prestigeBtn = document.getElementById('prestige-btn');
        if (prestigeBtn) {
            prestigeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.performPrestige();
            });
        }
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                const targetContent = document.getElementById(targetTab + '-tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Special handling for different tabs
                if (targetTab === 'achievements') {
                    this.renderAchievements();
                } else if (targetTab === 'desk') {
                    this.renderDeskShop();
                    this.renderDesk();
                }
            });
        });
    }

    setupMultibuy() {
        const multibuySelect = document.getElementById('multibuy-select');
        
        if (multibuySelect) {
            // Initially hide multibuy until unlocked
            const multibuyControls = document.querySelector('.multibuy-controls');
            if (!this.gameState.achievements.upgrade_novice && multibuyControls) {
                multibuyControls.style.display = 'none';
            }

            multibuySelect.addEventListener('change', (e) => {
                this.currentMultibuy = e.target.value === 'max' ? 'max' : parseInt(e.target.value);
                this.renderTasks(); // Re-render to update costs
            });
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[this.currentLanguage][key];
            if (translation) {
                el.textContent = translation;
            }
        });

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
        document.documentElement.lang = this.currentLanguage;
    }

    updateTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.gameState.settings.theme);
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.gameState.settings.theme;
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
            const quoteElement = document.getElementById('quote-text');
            if (quoteElement) {
                quoteElement.textContent = randomQuote;
            }
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
        let totalIdleRate = 0;

        Object.keys(this.gameState.tasks).forEach(taskId => {
            const taskState = this.gameState.tasks[taskId];
            if (!taskState.unlocked) return;

            const taskData = this.gameData.tasks.find(t => t.id === taskId);
            if (!taskData) return;

            const idleRate = this.calculateTaskIdleRate(taskId);
            totalIdleRate += idleRate;
            
            const cycleTime = taskData.cycleTime || 2000;
            const progressIncrement = deltaTime / cycleTime;

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
        }

        // Auto-buyer logic
        if (this.gameState.deskItems.autobuyer && totalIdleRate > 0) {
            this.runAutoBuyer();
        }

        // Check for new unlocks and achievements
        this.checkUnlocks();
        this.checkAllAchievements();
        
        // Update UI periodically
        if (now - this.lastSave > 200) { // Update UI every 200ms
            this.updateDisplay();
            this.updateTaskProgress();
            this.updateUnlockProgress();
            this.lastSave = now;
        }
    }

    runAutoBuyer() {
        // Simple auto-buyer: upgrade cheapest available task
        const availableTasks = Object.keys(this.gameState.tasks)
            .filter(taskId => {
                const taskState = this.gameState.tasks[taskId];
                return taskState.unlocked;
            })
            .map(taskId => ({
                id: taskId,
                cost: this.calculateUpgradeCost(taskId, 1)
            }))
            .sort((a, b) => a.cost - b.cost);

        if (availableTasks.length > 0) {
            const cheapest = availableTasks[0];
            if (this.gameState.bp >= cheapest.cost) {
                this.upgradeTask(cheapest.id, 1);
            }
        }
    }

    calculateTaskIdleRate(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let rate = taskData.baseIdle * Math.pow(taskData.idleMultiplier || 1.2, taskState.level - 1);
        
        // Apply ascension multiplier
        rate *= Math.pow(2, taskState.ascensions);
        
        // Apply global multipliers
        rate *= this.getGlobalMultiplier();
        
        return rate;
    }

    getGlobalMultiplier() {
        let multiplier = 1;
        
        // Soft Skills multiplier
        multiplier *= Math.pow(1.1, this.gameState.softSkills);
        
        // Achievement bonuses
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (!this.gameState.achievements[achId]) return;
            const achievement = this.gameData.achievements.find(a => a.id === achId);
            if (achievement && achievement.reward) {
                switch (achievement.reward.type) {
                    case 'bp_bonus':
                        multiplier *= achievement.reward.value;
                        break;
                    case 'global_mult':
                        multiplier *= achievement.reward.value;
                        break;
                    case 'idle_bonus':
                        multiplier *= achievement.reward.value;
                        break;
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
        
        return multiplier;
    }

    checkUnlocks() {
        let unlocked = false;
        this.gameData.tasks.forEach(task => {
            if (!this.gameState.tasks[task.id] || !this.gameState.tasks[task.id].unlocked) {
                if (this.gameState.bp >= task.unlockCost) {
                    if (!this.gameState.tasks[task.id]) {
                        this.gameState.tasks[task.id] = { level: 1, progress: 0, unlocked: false, ascensions: 0 };
                    }
                    // Don't auto-unlock, show unlock button instead
                }
            }
        });
        if (unlocked) {
            this.renderTasks();
        }
    }

    checkAllAchievements() {
        this.gameData.achievements.forEach(achievement => {
            if (!this.gameState.achievements[achievement.id] && achievement.condition.type !== 'impossible') {
                this.checkAchievement(achievement.id);
            }
        });
    }

    checkAchievement(achievementId) {
        if (this.gameState.achievements[achievementId]) return;

        const achievement = this.gameData.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

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
                let totalRate = 0;
                Object.keys(this.gameState.tasks).forEach(taskId => {
                    if (this.gameState.tasks[taskId].unlocked) {
                        totalRate += this.calculateTaskIdleRate(taskId);
                    }
                });
                unlocked = totalRate >= condition.value;
                break;
            case 'play_time':
                const playTime = Date.now() - this.gameState.playTimeStart;
                unlocked = playTime >= condition.value;
                break;
            case 'soft_skills_earned':
                unlocked = this.gameState.totalSoftSkillsEarned >= condition.value;
                break;
            case 'desk_items_bought':
                unlocked = this.gameState.stats.deskItemsBought >= condition.value;
                break;
        }

        if (unlocked) {
            this.gameState.achievements[achievementId] = true;
            this.applyAchievementReward(achievement);
            this.showNotification(`Achievement Unlocked: ${this.translations[this.currentLanguage][achievement.nameKey]}`);
            
            // Special handling for prestige break unlock
            if (achievement.reward.type === 'prestige_break') {
                this.gameState.flags.prestigeBreakUnlocked = true;
            }
            
            // Update UI elements that may have been unlocked
            if (achievement.reward.type === 'multibuy_unlock') {
                this.updateMultibuyOptions();
            }
            
            if (achievement.reward.type === 'desk_unlock') {
                this.showDeskTab();
            }
        }
    }

    applyAchievementReward(achievement) {
        // Rewards are passive and applied in calculations
        // Some rewards need immediate UI updates
        if (achievement.reward.type === 'multibuy_unlock') {
            this.updateMultibuyOptions();
        }
    }

    updateMultibuyOptions() {
        const multibuySelect = document.getElementById('multibuy-select');
        const multibuyControls = document.querySelector('.multibuy-controls');
        
        if (!multibuySelect || !multibuyControls) return;
        
        // Show multibuy controls
        multibuyControls.style.display = 'block';
        
        // Clear and repopulate options
        multibuySelect.innerHTML = '';
        
        this.gameData.multiBuyOptions.forEach(option => {
            if (option === 'max' && !this.gameState.achievements.multibuy_expert) {
                return; // Don't show max until expert achievement
            }
            
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option === 'max' ? this.translations[this.currentLanguage].buy_max : `${option}x`;
            multibuySelect.appendChild(optionEl);
        });
    }

    showDeskTab() {
        const deskTab = document.getElementById('desk-tab');
        if (deskTab) {
            deskTab.classList.remove('hidden');
        }
    }

    unlockTask(taskId) {
        const task = this.gameData.tasks.find(t => t.id === taskId);
        if (!task || this.gameState.bp < task.unlockCost) return;

        this.gameState.bp -= task.unlockCost;
        this.gameState.totalBPSpent += task.unlockCost;
        
        if (!this.gameState.tasks[taskId]) {
            this.gameState.tasks[taskId] = { level: 1, progress: 0, unlocked: false, ascensions: 0 };
        }
        this.gameState.tasks[taskId].unlocked = true;
        
        this.renderTasks();
        this.updateDisplay();
    }

    upgradeTask(taskId, amount = null) {
        const actualAmount = amount || this.currentMultibuy;
        const upgradesToBuy = actualAmount === 'max' ? this.calculateMaxUpgrades(taskId) : actualAmount;
        
        if (upgradesToBuy === 0) return;
        
        const totalCost = this.calculateUpgradeCost(taskId, upgradesToBuy);
        if (this.gameState.bp < totalCost) return;

        this.gameState.bp -= totalCost;
        this.gameState.totalBPSpent += totalCost;
        this.gameState.tasks[taskId].level += upgradesToBuy;
        this.gameState.stats.totalUpgrades += upgradesToBuy;
        
        if (actualAmount !== 1) {
            this.gameState.stats.multibuyUsed++;
        }
        
        this.renderTasks();
        this.updateDisplay();
    }

    calculateMaxUpgrades(taskId) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let maxUpgrades = 0;
        let totalCost = 0;
        let currentLevel = taskState.level;
        
        while (totalCost <= this.gameState.bp) {
            const nextCost = this.calculateSingleUpgradeCost(taskData, currentLevel + maxUpgrades);
            if (totalCost + nextCost > this.gameState.bp) break;
            
            totalCost += nextCost;
            maxUpgrades++;
            
            // Prevent infinite loops
            if (maxUpgrades > 1000) break;
        }
        
        return maxUpgrades;
    }

    calculateUpgradeCost(taskId, amount = 1) {
        const taskData = this.gameData.tasks.find(t => t.id === taskId);
        const taskState = this.gameState.tasks[taskId];
        
        let totalCost = 0;
        for (let i = 0; i < amount; i++) {
            totalCost += this.calculateSingleUpgradeCost(taskData, taskState.level + i);
        }
        
        // Apply upgrade discount from achievements/desk items
        let discountMultiplier = 1;
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward.type === 'upgrade_discount') {
                    discountMultiplier *= achievement.reward.value;
                }
            }
        });
        
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'upgrade_discount') {
                    discountMultiplier *= item.bonus.value;
                }
            }
        });
        
        return Math.floor(totalCost * discountMultiplier);
    }

    calculateSingleUpgradeCost(taskData, level) {
        return Math.floor(taskData.baseCost * Math.pow(taskData.costMultiplier, level));
    }

    ascendTask(taskId) {
        const taskState = this.gameState.tasks[taskId];
        if (taskState.level < 25) return;

        taskState.level = 1;
        taskState.ascensions++;
        taskState.progress = 0;
        this.gameState.stats.totalAscensions++;
        
        this.renderTasks();
    }

    performPrestige() {
        const threshold = this.gameData.prestigeThreshold;
        if (this.gameState.totalBPEarned < threshold) return;

        let softSkillsGain;
        
        if (this.gameState.flags.prestigeBreakUnlocked) {
            // Prestige Break: Multiple soft skills based on threshold multiples
            softSkillsGain = Math.floor(this.gameState.totalBPEarned / threshold);
        } else {
            // Normal prestige: 1 soft skill per threshold
            softSkillsGain = 1;
        }

        // Apply prestige bonuses
        let prestigeMultiplier = 1;
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward.type === 'prestige_bonus') {
                    prestigeMultiplier *= achievement.reward.value;
                }
            }
        });
        
        Object.keys(this.gameState.deskItems).forEach(itemId => {
            if (this.gameState.deskItems[itemId]) {
                const item = this.gameData.deskItems.find(d => d.id === itemId);
                if (item && item.bonus.type === 'prestige_mult') {
                    prestigeMultiplier *= item.bonus.value;
                }
            }
        });

        softSkillsGain = Math.floor(softSkillsGain * prestigeMultiplier);
        
        // Reset game state but keep achievements, desk items, and settings
        const achievementsToKeep = { ...this.gameState.achievements };
        const deskItemsToKeep = { ...this.gameState.deskItems };
        const settingsToKeep = { ...this.gameState.settings };
        const flagsToKeep = { ...this.gameState.flags };
        const playTimeStart = this.gameState.playTimeStart;
        const totalSoftSkillsEarned = this.gameState.totalSoftSkillsEarned + softSkillsGain;

        this.gameState = this.loadGameState();
        this.gameState.softSkills += softSkillsGain;
        this.gameState.totalSoftSkillsEarned = totalSoftSkillsEarned;
        this.gameState.prestigeCount++;
        this.gameState.achievements = achievementsToKeep;
        this.gameState.deskItems = deskItemsToKeep;
        this.gameState.settings = settingsToKeep;
        this.gameState.flags = flagsToKeep;
        this.gameState.playTimeStart = playTimeStart;

        this.renderAll();
        
        const statusText = this.gameState.flags.prestigeBreakUnlocked ? 'prestige_break' : 'prestige_ready';
        this.showNotification(`${this.translations[this.currentLanguage][statusText]} Gained ${softSkillsGain} Soft Skills!`);
    }

    buyDeskItem(itemId) {
        const item = this.gameData.deskItems.find(d => d.id === itemId);
        if (!item || this.gameState.deskItems[itemId]) return;

        let cost = item.cost;
        
        // Apply desk discount
        let discountMultiplier = 1;
        Object.keys(this.gameState.achievements).forEach(achId => {
            if (this.gameState.achievements[achId]) {
                const achievement = this.gameData.achievements.find(a => a.id === achId);
                if (achievement && achievement.reward.type === 'desk_discount') {
                    discountMultiplier *= achievement.reward.value;
                }
            }
        });
        
        cost = Math.floor(cost * discountMultiplier);
        
        if (this.gameState.softSkills < cost) return;

        this.gameState.softSkills -= cost;
        this.gameState.deskItems[itemId] = true;
        this.gameState.stats.deskItemsBought++;
        
        this.renderDeskShop();
        this.renderDesk();
        this.updateDisplay();
    }

    renderAll() {
        this.renderTasks();
        if (this.gameState.totalSoftSkillsEarned > 0) {
            this.showDeskTab();
            this.renderDeskShop();
            this.renderDesk();
        }
        this.renderAchievements();
        this.updateMultibuyOptions();
        this.updateDisplay();
        this.updateUnlockProgress();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        if (!container) return;
        
        container.innerHTML = '';

        this.gameData.tasks.forEach(taskData => {
            const taskState = this.gameState.tasks[taskData.id];
            const isUnlocked = taskState && taskState.unlocked;
            const canUnlock = !isUnlocked && this.gameState.bp >= taskData.unlockCost;
            
            if (!isUnlocked && !canUnlock) return; // Don't show locked tasks that can't be unlocked

            const taskCard = this.createTaskCard(taskData, taskState, isUnlocked);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(taskData, taskState, isUnlocked) {
        const card = document.createElement('div');
        card.className = `task-card ${!isUnlocked ? 'locked' : ''}`;
        
        if (!isUnlocked) {
            // Show unlock button
            card.innerHTML = `
                <div class="task-header">
                    <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                    <div class="task-rank">${this.translations[this.currentLanguage].locked}</div>
                </div>
                <div class="task-actions">
                    <button class="btn btn--primary btn--full-width" onclick="game.unlockTask('${taskData.id}')">
                        ${this.translations[this.currentLanguage].unlock} (${this.formatNumber(taskData.unlockCost)} BP)
                    </button>
                </div>
            `;
            return card;
        }
        
        const rank = this.gameData.ranks[Math.min(taskState.ascensions, this.gameData.ranks.length - 1)];
        const idleRate = this.calculateTaskIdleRate(taskData.id);
        
        const upgradeAmount = this.currentMultibuy === 'max' ? this.calculateMaxUpgrades(taskData.id) : this.currentMultibuy;
        const upgradeCost = this.calculateUpgradeCost(taskData.id, upgradeAmount);
        const canUpgrade = this.gameState.bp >= upgradeCost && upgradeAmount > 0;
        const canAscend = taskState.level >= 25;

        card.innerHTML = `
            <div class="task-header">
                <div class="task-name">${this.translations[this.currentLanguage][taskData.nameKey]}</div>
                <div class="task-rank">${rank}</div>
            </div>
            
            <div class="hex-progress">
                <svg viewBox="0 0 60 52">
                    <polygon class="hex-bg" points="30,2 52,15 52,37 30,50 8,37 8,15" stroke-dasharray="140"/>
                    <polygon class="hex-fill" points="30,2 52,15 52,37 30,50 8,37 8,15" 
                             stroke-dasharray="${140 * (taskState.progress || 0)}, 140"/>
                </svg>
                <div class="hex-text">${Math.floor((taskState.progress || 0) * 100)}%</div>
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
                <button class="btn ${canUpgrade ? 'btn--primary' : 'btn--secondary disabled'}" 
                        onclick="game.upgradeTask('${taskData.id}')" ${!canUpgrade ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].upgrade}
                    ${upgradeAmount > 1 ? ` (${upgradeAmount}x)` : ''}
                    <span class="upgrade-cost">${this.formatNumber(upgradeCost)} BP</span>
                </button>
                <button class="btn ${canAscend ? 'btn--outline' : 'btn--secondary disabled'}" 
                        onclick="game.ascendTask('${taskData.id}')" ${!canAscend ? 'disabled' : ''}>
                    ${this.translations[this.currentLanguage].ascend}
                </button>
            </div>
        `;

        return card;
    }

    renderDeskShop() {
        const container = document.getElementById('shop-items');
        if (!container) return;
        
        container.innerHTML = '';

        this.gameData.deskItems.forEach(item => {
            const owned = this.gameState.deskItems[item.id];
            
            let cost = item.cost;
            let discountMultiplier = 1;
            Object.keys(this.gameState.achievements).forEach(achId => {
                if (this.gameState.achievements[achId]) {
                    const achievement = this.gameData.achievements.find(a => a.id === achId);
                    if (achievement && achievement.reward.type === 'desk_discount') {
                        discountMultiplier *= achievement.reward.value;
                    }
                }
            });
            cost = Math.floor(cost * discountMultiplier);
            
            const canBuy = !owned && this.gameState.softSkills >= cost;

            const shopItem = document.createElement('div');
            shopItem.className = `shop-item ${owned ? 'owned' : ''}`;
            
            const bonusText = this.getBonusDescription(item.bonus);
            
            shopItem.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${this.translations[this.currentLanguage][item.nameKey]}</div>
                    <div class="shop-item-cost">${owned ? 'Owned' : `${cost} SS`}</div>
                    <div class="shop-item-bonus">${bonusText}</div>
                </div>
                <button class="btn btn--sm ${canBuy ? 'btn--primary' : 'btn--secondary disabled'}" 
                        onclick="game.buyDeskItem('${item.id}')" ${!canBuy ? 'disabled' : ''}>
                    ${owned ? '✓' : this.translations[this.currentLanguage].buy}
                </button>
            `;

            container.appendChild(shopItem);
        });
    }

    getBonusDescription(bonus) {
        switch (bonus.type) {
            case 'global_mult':
                return `+${Math.round((bonus.value - 1) * 100)}% Global`;
            case 'idle_mult':
                return `+${Math.round((bonus.value - 1) * 100)}% Idle`;
            case 'upgrade_discount':
                return `-${Math.round((1 - bonus.value) * 100)}% Upgrade Cost`;
            case 'prestige_mult':
                return `+${Math.round((bonus.value - 1) * 100)}% Prestige`;
            case 'ascend_bonus':
                return `+${Math.round((bonus.value - 1) * 100)}% Ascend`;
            case 'auto_buyer':
                return 'Auto-Buyer';
            default:
                return 'Special Bonus';
        }
    }

    renderDesk() {
        const itemsGroup = document.getElementById('desk-items');
        if (!itemsGroup) return;
        
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
                    item.innerHTML = `<rect x="270" y="130" width="20" height="15" fill="#333" rx="2"/>
                                     <rect x="272" y="132" width="16" height="11" fill="#4CAF50" rx="1"/>`;
                    break;
                case 'autobuyer':
                    item.innerHTML = `<circle cx="80" cy="140" r="10" fill="#FFD700"/>
                                     <text x="80" y="145" text-anchor="middle" font-size="8" fill="#333">🤖</text>`;
                    break;
            }
            
            itemsGroup.appendChild(item);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;
        
        container.innerHTML = '';

        this.gameData.achievements.forEach(achievement => {
            const unlocked = this.gameState.achievements[achievement.id];
            const isImpossible = achievement.condition.type === 'impossible';
            
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement ${unlocked ? 'unlocked' : ''} ${isImpossible ? 'impossible' : ''}`;
            
            const progress = this.getAchievementProgress(achievement);
            const bonusText = this.translations[this.currentLanguage][achievement.bonusDesc] || '';
            
            achievementEl.innerHTML = `
                <div class="achievement-icon">${unlocked ? '🏆' : isImpossible ? '❓' : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${this.translations[this.currentLanguage][achievement.nameKey]}</div>
                    <div class="achievement-desc">${this.translations[this.currentLanguage][achievement.descKey]}</div>
                    ${bonusText ? `<div class="achievement-bonus">${bonusText}</div>` : ''}
                    ${!unlocked && !isImpossible && progress ? `
                        <div class="achievement-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                            </div>
                            <div class="progress-text">${progress.current} / ${progress.target}</div>
                        </div>
                    ` : ''}
                </div>
            `;

            container.appendChild(achievementEl);
        });
    }

    getAchievementProgress(achievement) {
        if (this.gameState.achievements[achievement.id] || achievement.condition.type === 'impossible') {
            return null;
        }

        const condition = achievement.condition;
        let current = 0;
        let target = condition.value;

        switch (condition.type) {
            case 'tasks_unlocked':
                current = Object.values(this.gameState.tasks).filter(t => t.unlocked).length;
                break;
            case 'upgrades_bought':
                current = this.gameState.stats.totalUpgrades;
                break;
            case 'task_level':
                const taskState = this.gameState.tasks[condition.taskId];
                current = taskState ? taskState.level : 0;
                break;
            case 'ascensions':
            case 'total_ascensions':
                current = this.gameState.stats.totalAscensions;
                break;
            case 'bp_spent':
                current = this.gameState.totalBPSpent;
                break;
            case 'prestiges':
                current = this.gameState.prestigeCount;
                break;
            case 'multibuy_used':
                current = this.gameState.stats.multibuyUsed;
                break;
            case 'soft_skills_earned':
                current = this.gameState.totalSoftSkillsEarned;
                break;
            case 'desk_items_bought':
                current = this.gameState.stats.deskItemsBought;
                break;
            case 'play_time':
                current = Date.now() - this.gameState.playTimeStart;
                break;
            default:
                return null;
        }

        return {
            current: condition.type === 'play_time' ? Math.floor(current / 1000 / 60) + 'm' : this.formatNumber(current),
            target: condition.type === 'play_time' ? Math.floor(target / 1000 / 60) + 'm' : this.formatNumber(target),
            percentage: Math.min((current / target) * 100, 100)
        };
    }

    updateDisplay() {
        const bpDisplay = document.getElementById('bp-display');
        const ssDisplay = document.getElementById('ss-display');
        const bpRate = document.getElementById('bp-rate');

        if (bpDisplay) bpDisplay.textContent = this.formatNumber(Math.floor(this.gameState.bp));
        if (ssDisplay) ssDisplay.textContent = Math.floor(this.gameState.softSkills);

        // Update BP rate
        let totalRate = 0;
        Object.keys(this.gameState.tasks).forEach(taskId => {
            if (this.gameState.tasks[taskId].unlocked) {
                totalRate += this.calculateTaskIdleRate(taskId);
            }
        });
        if (bpRate) bpRate.textContent = `${this.formatNumber(totalRate)}${this.translations[this.currentLanguage].per_second}`;

        // Update prestige button
        const threshold = this.gameData.prestigeThreshold;
        const canPrestige = this.gameState.totalBPEarned >= threshold;
        const prestigeBtn = document.getElementById('prestige-btn');
        
        if (prestigeBtn) {
            prestigeBtn.disabled = !canPrestige;
            if (canPrestige) {
                let softSkillsGain = this.gameState.flags.prestigeBreakUnlocked ? 
                    Math.floor(this.gameState.totalBPEarned / threshold) : 1;
                
                // Apply prestige bonuses for display
                let prestigeMultiplier = 1;
                Object.keys(this.gameState.achievements).forEach(achId => {
                    if (this.gameState.achievements[achId]) {
                        const achievement = this.gameData.achievements.find(a => a.id === achId);
                        if (achievement && achievement.reward.type === 'prestige_bonus') {
                            prestigeMultiplier *= achievement.reward.value;
                        }
                    }
                });
                
                Object.keys(this.gameState.deskItems).forEach(itemId => {
                    if (this.gameState.deskItems[itemId]) {
                        const item = this.gameData.deskItems.find(d => d.id === itemId);
                        if (item && item.bonus.type === 'prestige_mult') {
                            prestigeMultiplier *= item.bonus.value;
                        }
                    }
                });

                softSkillsGain = Math.floor(softSkillsGain * prestigeMultiplier);
                
                const statusText = this.gameState.flags.prestigeBreakUnlocked ? 'prestige_break' : 'prestige_ready';
                prestigeBtn.textContent = `${this.translations[this.currentLanguage][statusText]} (+${softSkillsGain} SS)`;
                prestigeBtn.classList.remove('disabled');
                
                if (this.gameState.flags.prestigeBreakUnlocked) {
                    prestigeBtn.classList.add('status-break');
                } else {
                    prestigeBtn.classList.add('status-ready');
                }
            } else {
                prestigeBtn.textContent = this.translations[this.currentLanguage].prestige;
                prestigeBtn.classList.add('disabled');
                prestigeBtn.classList.remove('status-ready', 'status-break');
            }
        }

        // Update prestige progress bar
        const progressBar = document.getElementById('prestige-progress-bar');
        const progressText = document.getElementById('prestige-progress-text');
        if (progressBar && progressText) {
            const progress = Math.min(this.gameState.totalBPEarned / threshold, 1);
            progressBar.style.width = `${progress * 100}%`;
            progressText.textContent = `${this.formatNumber(this.gameState.totalBPEarned)} / ${this.formatNumber(threshold)} BP`;
        }
    }

    updateTaskProgress() {
        document.querySelectorAll('.hex-fill').forEach((fill, index) => {
            const taskIds = Object.keys(this.gameState.tasks);
            if (index < taskIds.length) {
                const taskId = taskIds[index];
                const taskState = this.gameState.tasks[taskId];
                if (taskState && taskState.unlocked) {
                    const progress = taskState.progress * 140;
                    fill.setAttribute('stroke-dasharray', `${progress}, 140`);
                    
                    const textEl = fill.closest('.hex-progress').querySelector('.hex-text');
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

        const progressBar = document.getElementById('unlock-progress');
        const progressInfo = document.getElementById('progress-info');
        
        if (progressBar && progressInfo) {
            if (nextTask) {
                const progress = Math.min(this.gameState.bp / nextTask.unlockCost, 1);
                progressBar.style.width = `${progress * 100}%`;
                progressInfo.textContent = `${this.translations[this.currentLanguage][nextTask.nameKey]}: ${this.formatNumber(this.gameState.bp)} / ${this.formatNumber(nextTask.unlockCost)} BP`;
            } else {
                progressBar.style.width = '100%';
                progressInfo.textContent = 'All tasks unlocked!';
            }
        }
    }

    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + 'T';
        return (num / 1000000000000000).toFixed(1) + 'Q';
    }

    showNotification(message) {
        // Create notification element
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
            z-index: 1001;
            max-width: 300px;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);
        if (this.quoteInterval) clearInterval(this.quoteInterval);
    }
}

// Make functions globally accessible
window.game = null;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KorposzczurGame();
});

// Save on page unload
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.saveGameState();
    }
});