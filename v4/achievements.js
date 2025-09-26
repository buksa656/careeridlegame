// achievements.js
window.ACHIEVEMENTS = {
		  // Bronze, klikalne
		  first_clicks: {id: "first_clicks", unlocked: false, progress: 0.5, name: "Pierwszy klikacz", description: "Wykonaj 10 kliknięć w główny przycisk", icon: "👶", tier: "bronze", requirement: {type: "click_count", value: 10}, reward: {type: "synergy_coin", amount: 1}, },
		  hundred_clicks: {id: "hundred_clicks", unlocked: false, progress: 0, name: "Klikacz-amator", description: "Wykonaj 100 kliknięć", icon: "👆", tier: "bronze", requirement: {type: "click_count", value: 100}, reward: {type: "main_click_bonus", multiplier: 1.03}, },
		  thousand_clicks: {id: "thousand_clicks", unlocked: false, progress: 0, name: "Klikacz-weteran", description: "Wykonaj 1 000 kliknięć", icon: "🖱️", tier: "silver", requirement: {type: "click_count", value: 1000}, reward: {type: "main_click_bonus", multiplier: 1.08, synergy_coin: 2}, },

		  // Budżet
		  budget_rookie: {id: "budget_rookie", unlocked: false, progress: 0, name: "Debiutant budżetowy", description: "Osiągnij 100 budżetu", icon: "💸", tier: "bronze", requirement: {type: "resource_max", resource: "budget", value: 100}, reward: {type: "softcap_up", resource: "budget", value: 0.1}, },
		  budget_builder: {id: "budget_builder", unlocked: false, progress: 0, name: "Budowniczy budżetu", description: "Osiągnij 1000 budżetu", icon: "💰", tier: "bronze", requirement: {type: "resource_max", resource: "budget", value: 1000}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.05}, },
		  budget_pro: {id: "budget_pro", unlocked: false, progress: 0, name: "Profesjonalista budżetowy", description: "Osiągnij 10 000 budżetu", icon: "💷", tier: "silver", requirement: {type: "resource_max", resource: "budget", value: 10000}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.08, synergy_coin: 2}, },
		  budget_millionaire: {id: "budget_millionaire", unlocked: false, progress: 0, name: "Milioner", description: "Osiągnij 1 000 000 budżetu", icon: "💎", tier: "gold", requirement: {type: "resource_max", resource: "budget", value: 1000000}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.2, synergy_coin: 4}, },

		  // Dokumenty
		  doc_worker: {id: "doc_worker", unlocked: false, progress: 0, name: "Nowicjusz dokumentów", description: "Wyprodukuj 500 dokumentów", icon: "📄", tier: "bronze", requirement: {type: "resource_max", resource: "documents", value: 500}, reward: {type: "production_bonus", resource: "documents", multiplier: 1.05}, },
		  doc_specialist: {id: "doc_specialist", unlocked: false, progress: 0, name: "Specjalista ds. dokumentów", description: "Wyprodukuj 2 500 dokumentów", icon: "🗂️", tier: "bronze", requirement: {type: "resource_max", resource: "documents", value: 2500}, reward: {type: "production_bonus", resource: "documents", multiplier: 1.12}, },
		  doc_master: {id: "doc_master", unlocked: false, progress: 0, name: "Mistrz dokumentów", description: "Wyprodukuj 25 000 dokumentów", icon: "👔", tier: "silver", requirement: {type: "resource_max", resource: "documents", value: 25000}, reward: {type: "production_bonus", resource: "documents", multiplier: 1.2, synergy_coin: 2}, },

		  // Kawa/motywacja
		  coffee_addict: {id: "coffee_addict", unlocked: false, progress: 0, name: "Kofeinowy uzależniony", description: "Użyj funkcji kawy 25 razy", icon: "☕", tier: "bronze", requirement: {type: "coffee_breaks", value: 25}, reward: {type: "coffee_efficiency", multiplier: 1.1}, },
		  coffee_enthusiast: {id: "coffee_enthusiast", unlocked: false, progress: 0, name: "Entuzjasta kawy", description: "Użyj funkcji kawy 100 razy", icon: "🥤", tier: "silver", requirement: {type: "coffee_breaks", value: 100}, reward: {type: "production_bonus", resource: "motivation", multiplier: 1.08}, },

		  // Prestiż
		  prestige_novice: {id: "prestige_novice", unlocked: false, progress: 0, name: "Początkujący prestiżowy", description: "Osiągnij 10 prestiżu", icon: "🎗️", tier: "bronze", requirement: {type: "resource_max", resource: "prestige", value: 10}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.01}, },
		  prestige_adept: {id: "prestige_adept", unlocked: false, progress: 0, name: "Adept prestiżu", description: "Osiągnij 100 prestiżu", icon: "🎖️", tier: "silver", requirement: {type: "resource_max", resource: "prestige", value: 100}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.04}, },
		  prestige_master: {id: "prestige_master", unlocked: false, progress: 0, name: "Mistrz prestiżu", description: "Osiągnij 500 prestiżu", icon: "🏅", tier: "gold", requirement: {type: "resource_max", resource: "prestige", value: 500}, reward: {type: "production_bonus", resource: "documents", multiplier: 1.13, synergy_coin: 4}, },

		  // HR
		  hr_novice: {id: "hr_novice", unlocked: false, progress: 0, name: "HR Nowicjusz", description: "Zatrudnij 1 dział HR", icon: "👥", tier: "bronze", requirement: {type: "department_hired", department: "hr", value: 1}, reward: {type: "department_efficiency", department: "hr", multiplier: 1.04}},
		  hr_specialist: {id: "hr_specialist", unlocked: false, progress: 0, name: "HR Specjalista", description: "Zatrudnij 5 osób w HR", icon: "🧑‍💼", tier: "silver", requirement: {type: "department_hired", department: "hr", value: 5}, reward: {type: "department_efficiency", department: "hr", multiplier: 1.12, synergy_coin: 2}},
		  hr_director: {id: "hr_director", unlocked: false, progress: 0, name: "Dyrektor HR", description: "Zatrudnij 15 osób w HR", icon: "🏢", tier: "gold", requirement: {type: "department_hired", department: "hr", value: 15}, reward: {type: "department_efficiency", department: "hr", multiplier: 1.25, synergy_coin: 3}},

		  // Departamenty
		  unlock_it: {id: "unlock_it", unlocked: false, progress: 0, name: "Tech Wizard", description: "Odblokuj dział IT", icon: "💻", tier: "bronze", requirement: {type: "department_unlocked", department: "it"}, reward: {type: "department_efficiency", department: "it", multiplier: 1.08}},
		  unlock_marketing: {id: "unlock_marketing", unlocked: false, progress: 0, name: "Marketingowy geniusz", description: "Odblokuj dział marketingu", icon: "📈", tier: "bronze", requirement: {type: "department_unlocked", department: "marketing"}, reward: {type: "department_efficiency", department: "marketing", multiplier: 1.08}},
		  unlock_accounting: {id: "unlock_accounting", unlocked: false, progress: 0, name: "Księgowość w akcji", description: "Odblokuj księgowość", icon: "🧮", tier: "bronze", requirement: {type: "department_unlocked", department: "accounting"}, reward: {type: "cost_reduction", department: "all", multiplier: 0.97}},
		  unlock_rd: {id: "unlock_rd", unlocked: false, progress: 0, name: "Innowator R&D", description: "Zatrudnij 5 osób w R&D", icon: "🔬", tier: "silver", requirement: {type: "department_hired", department: "rd", value: 5}, reward: {type: "department_efficiency", department: "rd", multiplier: 1.12}},
		  unlock_callcenter: {id: "unlock_callcenter", unlocked: false, progress: 0, name: "Król call center", description: "Odblokuj call center", icon: "📞", tier: "silver", requirement: {type: "department_unlocked", department: "callcenter"}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.09, synergy_coin: 2}},

		  // Stres/motywacja
		  stress_survivor: {id: "stress_survivor", unlocked: false, progress: 0, name: "Przetrwaj stres", description: "Osiągnij 150 stresu", icon: "😱", tier: "silver", requirement: {type: "stress_peak", value: 150}, reward: {type: "stress_resistance", multiplier: 0.92}, },
		  stress_zen: {id: "stress_zen", unlocked: false, progress: 0, name: "Zen stresu", description: "Utrzymaj stres poniżej 20 przez 2 minuty", icon: "🧘", tier: "silver", requirement: {type: "stress_low", value: 20, duration: 120000}, reward: {type: "stress_generation", multiplier: 0.82, synergy_coin: 2}, },

		  // Waluty
		  forex_trader: {id: "forex_trader", unlocked: false, progress: 0, name: "Trader forex", description: "Wykonaj pierwszą wymianę walut", icon: "💱", tier: "bronze", requirement: {type: "currency_trade", value: 1}, reward: {type: "fx_fee_reduction", multiplier: 0.97}},
		  multicurrency_master: {id: "multicurrency_master", unlocked: false, progress: 0, name: "Mistrz walutowy", description: "Posiadaj 4 waluty obce jednocześnie", icon: "🏦", tier: "silver", requirement: {type: "all_currencies", currencies: ["usd", "eur", "jpy", "cny"]}, reward: {type: "currency_bonus", multiplier: 1.09, synergy_coin: 2}},

		  // Automatyzacje
		  automation_pioneer: {id: "automation_pioneer", unlocked: false, progress: 0, name: "Pionier AI", description: "Włącz automatyzację AI", icon: "🤖", tier: "gold", requirement: {type: "automation_enabled"}, reward: {type: "automation_efficiency", multiplier: 1.1, synergy_coin: 3}},
		  department_emperor: {id: "department_emperor", unlocked: false, progress: 0, name: "Cesarz działów", description: "Odblokuj wszystkie działy", icon: "👑", tier: "platinum", requirement: {type: "all_departments_unlocked"}, reward: {type: "department_synergy", multiplier: 1.2, synergy_coin: 5}},
		  global_tycoon: {id: "global_tycoon", unlocked: false, progress: 0, name: "Globalny potentat", description: "Odblokuj wszystkie regiony", icon: "🌍", tier: "platinum", requirement: {type: "all_regions_unlocked"}, reward: {type: "global_dominance", multiplier: 1.5, synergy_coin: 5}},

		  // Regiony/ekspansja
		  americas_expansion: {id: "americas_expansion", unlocked: false, progress: 0, name: "Ekspansja Ameryk", description: "Odblokuj region Ameryki", icon: "🌎", tier: "silver", requirement: {type: "region_unlocked", region: "americas"}, reward: {type: "global_expansion_bonus", multiplier: 1.06}},
		  asia_expansion: {id: "asia_expansion", unlocked: false, progress: 0, name: "Ekspansja Azji", description: "Odblokuj region Azja-Pacyfik", icon: "🌏", tier: "gold", requirement: {type: "region_unlocked", region: "asia"}, reward: {type: "global_market_bonus", multiplier: 1.13, synergy_coin: 3}},
		  african_explorer: {id: "african_explorer", unlocked: false, progress: 0, name: "Odkrywca Afryki", description: "Odblokuj region Afryka", icon: "🌍", tier: "gold", requirement: {type: "region_unlocked", region: "africa"}, reward: {type: "exploration_bonus", multiplier: 1.17}},
		  middle_east_mogul: {id: "middle_east_mogul", unlocked: false, progress: 0, name: "Potentat Bliskiego Wschodu", description: "Odblokuj region Bliski Wschód", icon: "🕌", tier: "gold", requirement: {type: "region_unlocked", region: "middleeast"}, reward: {type: "premium_markets", multiplier: 1.14}},
		  globalist: {id: "globalist", unlocked: false, progress: 0, name: "Globalista", description: "Odblokuj 3 regiony", icon: "🗺️", tier: "silver", requirement: {type: "region_unlocked_count", value: 3}, reward: {type: "global_expansion_bonus", multiplier: 1.11, synergy_coin: 2}},

		  // Minigry/bonusy
		  minigame_master: {id: "minigame_master", unlocked: false, progress: 0, name: "Mistrz minigier", description: "Wygraj 3 prezentacje kwartalne", icon: "🎯", tier: "gold", requirement: {type: "minigame_wins", game: "quarterlypresentation", value: 3}, reward: {type: "minigame_bonus", multiplier: 1.2}},
		  call_center_king: {id: "call_center_king", unlocked: false, progress: 0, name: "Król call center", description: "Odblokuj call center", icon: "📞", tier: "gold", requirement: {type: "department_unlocked", department: "callcenter"}, reward: {type: "production_bonus", resource: "budget", multiplier: 1.11}},
		  rd_innovator: {id: "rd_innovator", unlocked: false, progress: 0, name: "Innowator R&D", description: "Zatrudnij 3 osoby w R&D", icon: "🎩", tier: "gold", requirement: {type: "department_hired", department: "rd", value: 3}, reward: {type: "innovation_bonus", multiplier: 1.18, synergy_coin: 3}},

		  // Click power/speed
		  speed_demon: {id: "speed_demon", unlocked: false, progress: 0, name: "Demon prędkości", description: "Wykonaj 50 kliknięć w 10 sekund", icon: "💨", tier: "silver", requirement: {type: "click_speed", clicks: 50, time: 10000}, reward: {type: "click_speed_bonus", multiplier: 1.06}},
		  clicker_champion: {id: "clicker_champion", unlocked: false, progress: 0, name: "Champ klików", description: "Wykonaj 10 000 kliknięć", icon: "🎮", tier: "platinum", requirement: {type: "click_count", value: 10000}, reward: {type: "main_click_bonus", multiplier: 1.2, synergy_coin: 6}},

		  // Softcapy, zaawansowana producja
		  softcap_master_budget: {id: "softcap_master_budget", unlocked: false, progress: 0, name: "Softcapowy producent", description: "Zwiększ softcap budżetu o 30%", icon: "🧮", tier: "gold", requirement: {type: "softcap_bonus", resource: "budget", value: 0.3}, reward: {type: "softcap_up", resource: "budget", value: 0.3}},
		  softcap_master_documents: {id: "softcap_master_documents", unlocked: false, progress: 0, name: "Softcap dokumentalny", description: "Zwiększ softcap dokumentów o 25%", icon: "📚", tier: "gold", requirement: {type: "softcap_bonus", resource: "documents", value: 0.25}, reward: {type: "softcap_up", resource: "documents", value: 0.25}},

		  // Ultimate
		  ultimate_corporate: {id: "ultimate_corporate", unlocked: false, progress: 0, name: "Korposzczur ostateczny", description: "Osiągnij 5 prestiżu i odblokuj wszystkie regiony", icon: "🏆", tier: "platinum", requirement: {type: "combined", requirements: [{type: "resource_max", resource: "prestige", value: 5}, {type: "all_regions_unlocked"}]}, reward: {type: "ultimate_bonus", multiplier: 2, synergy_coin: 10}},
		};
