// Enhanced Language System for Corporate Rat Idle

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                // UI Elements
                'loading-tagline': 'Climbing the corporate ladder, one click at a time',
                'critical-error': 'Critical Error',
                'error-message': 'Corporate Rat Idle encountered a critical error and cannot start.',
                'reload-page': 'Reload Page',
                'office-points': 'Office Points',
                'infinity-points': 'Infinity Points',
                'desk-level': 'Desk Level',
                'tasks': 'Tasks',
                'desk': 'Desk',
                'challenges': 'Challenges',
                'achievements': 'Achievements',
                'settings': 'Settings',
                'office-tasks': 'Office Tasks',
                'desk-upgrades': 'Desk Upgrades',
                'theme': 'Theme',
                'theme-auto': 'Auto',
                'theme-light': 'Light',
                'theme-dark': 'Dark',
                'language': 'Language',
                
                // Progress Info
                'progress-info': 'Click tasks to earn points and unlock automation!',
                'desk-info': 'Upgrade your workspace with Infinity Points for permanent bonuses!',
                'challenges-info': 'Complete challenges for powerful rewards!',
                'achievements-info': 'Complete goals to earn permanent bonuses!',
                
                // Infinity System
                'go-infinite': 'Go Infinite',
                'infinity-desc': 'Reset everything for Infinity Points',
                'infinity-reached': 'Infinity Reached!',
                
                // Task States
                'level': 'Level',
                'production': 'Production',
                'per-second': '/s',
                'upgrade': 'Upgrade',
                'cost': 'Cost',
                'unlock-cost': 'Unlock Cost',
                'locked': 'LOCKED',
                'auto': 'AUTO',
                'manual': 'MANUAL',
                'progress': 'Progress',
                'max-level': 'MAX LEVEL',
                
                // Desk Upgrades
                'owned': 'OWNED',
                'buy': 'BUY',
                'effect': 'Effect',
                'requires': 'Requires',
                'infinities': 'Infinities',
                
                // Challenges
                'available': 'Available',
                'completed': 'Completed',
                'in-progress': 'In Progress',
                'locked': 'Locked',
                'start-challenge': 'Start Challenge',
                'exit-challenge': 'Exit Challenge',
                'goal': 'Goal',
                'reward': 'Reward',
                'restriction': 'Restriction',
                'time-limit': 'Time Limit',
                'best-time': 'Best Time',
                
                // Achievements
                'unlocked': 'Unlocked',
                'requirement': 'Requirement',
                
                // Settings
                'export-save': 'Export Save',
                'import-save': 'Import Save',
                'import-save-title': 'Import Save Data',
                'import': 'Import',
                'cancel': 'Cancel',
                'reset-game': 'Reset Game',
                'confirm-reset': 'Are you sure you want to reset all progress? This action cannot be undone!',
                
                // Notifications
                'achievement-unlocked': 'Achievement Unlocked!',
                'challenge-completed': 'Challenge Completed!',
                'save-exported': 'Save data copied to clipboard!',
                'save-imported': 'Save data imported successfully!',
                'invalid-save': 'Invalid save data format!',
                'game-reset': 'Game has been reset!',
                'task-unlocked': 'Task Unlocked!',
                'automation-unlocked': 'Automation Unlocked!',
                
                // Tasks (Office Theme)
                'making-coffee': 'Making Coffee',
                'making-coffee-desc': 'Essential corporate skill - keeping everyone caffeinated.',
                
                'answering-emails': 'Answering Emails',
                'answering-emails-desc': 'Responding to the endless stream of corporate communication.',
                
                'filing-reports': 'Filing Reports',
                'filing-reports-desc': 'Creating documents that will never be read.',
                
                'small-talk': 'Small Talk',
                'small-talk-desc': 'Building workplace relationships one awkward conversation at a time.',
                
                'fixing-printer': 'Fixing Printer',
                'fixing-printer-desc': 'The eternal struggle against office technology.',
                
                'excel-sheets': 'Excel Spreadsheets',
                'excel-sheets-desc': 'Making numbers dance in endless cells of productivity.',
                
                'powerpoint-slides': 'PowerPoint Presentations',
                'powerpoint-slides-desc': 'Death by bullet points - the corporate way.',
                
                'team-meetings': 'Team Meetings',
                'team-meetings-desc': 'This meeting could have been an email.',
                
                'client-calls': 'Client Calls',
                'client-calls-desc': 'Professional phone acting at its finest.',
                
                'lunch-networking': 'Lunch Networking',
                'lunch-networking-desc': 'Strategic eating with career implications.',
                
                'project-planning': 'Project Planning',
                'project-planning-desc': 'Creating timelines that will immediately become obsolete.',
                
                'budget-reviews': 'Budget Reviews',
                'budget-reviews-desc': 'Finding creative ways to justify expenses.',
                
                'performance-reviews': 'Performance Reviews',
                'performance-reviews-desc': 'Annual corporate theater performance.',
                
                'strategic-planning': 'Strategic Planning',
                'strategic-planning-desc': 'Thinking about thinking about the future.',
                
                'executive-briefings': 'Executive Briefings',
                'executive-briefings-desc': 'Translating reality into executive-friendly language.',
                
                'corporate-training': 'Corporate Training',
                'corporate-training-desc': 'Learning skills you already know in a corporate approved way.',
                
                // Desk Upgrades
                'coffee-mug': 'Personalized Coffee Mug',
                'coffee-mug-desc': 'Your favorite mug boosts all task efficiency by 15%.',
                
                'desk-plant': 'Desk Plant',
                'desk-plant-desc': 'A touch of nature increases productivity by 12%.',
                
                'second-monitor': 'Second Monitor',
                'second-monitor-desc': 'Double the screens, double the productivity. +25% efficiency.',
                
                'ergonomic-chair': 'Ergonomic Chair',
                'ergonomic-chair-desc': 'Comfort is productivity. +20% to all bonuses.',
                
                'standing-desk': 'Standing Desk',
                'standing-desk-desc': 'Health is wealth. +30% office points generation.',
                
                'noise-canceling-headphones': 'Noise-Canceling Headphones',
                'noise-canceling-headphones-desc': 'Block out distractions. +18% focus bonus.',
                
                'mechanical-keyboard': 'Mechanical Keyboard',
                'mechanical-keyboard-desc': 'Clicky keys for maximum productivity. +22% typing speed.',
                
                'executive-nameplate': 'Executive Nameplate',
                'executive-nameplate-desc': 'Shows your importance. +35% authority bonus.',
                
                'mini-fridge': 'Mini Fridge',
                'mini-fridge-desc': 'Never leave your desk. +40% sustained productivity.',
                
                'corner-office': 'Corner Office',
                'corner-office-desc': 'The ultimate status symbol. +100% to everything.',
                
                // Challenges
                'no-coffee-challenge': 'No Coffee Challenge',
                'no-coffee-challenge-desc': 'Complete 100 tasks without coffee-related bonuses.',
                
                'speed-demon': 'Speed Demon',
                'speed-demon-desc': 'Reach 10,000 office points in under 10 minutes.',
                
                'multitasker': 'Master Multitasker',
                'multitasker-desc': 'Have 8 tasks running simultaneously.',
                
                'minimalist': 'Minimalist Challenge',
                'minimalist-desc': 'Reach infinity with only 3 different task types.',
                
                'efficiency-expert': 'Efficiency Expert',
                'efficiency-expert-desc': 'Complete 1000 tasks without manual clicking.',
                
                // Achievements
                'first-day': 'First Day on the Job',
                'first-day-desc': 'Earn your first 100 office points.',
                'first-day-reward': '+10% click efficiency',
                
                'coffee-addict': 'Coffee Addict',
                'coffee-addict-desc': 'Complete the coffee task 100 times.',
                'coffee-addict-reward': '+25% coffee task efficiency',
                
                'meeting-master': 'Meeting Master',
                'meeting-master-desc': 'Complete 50 team meetings.',
                'meeting-master-reward': '+20% meeting task rewards',
                
                'infinite-worker': 'Infinite Worker',
                'infinite-worker-desc': 'Reach infinity for the first time.',
                'infinite-worker-reward': '+50% infinity point gain',
                
                'automation-enthusiast': 'Automation Enthusiast',
                'automation-enthusiast-desc': 'Have all tasks automated.',
                'automation-enthusiast-reward': '+15% automation speed',
                
                'desk-collector': 'Desk Collector',
                'desk-collector-desc': 'Own 5 desk upgrades.',
                'desk-collector-reward': '+10% desk upgrade efficiency',
                
                'challenge-accepted': 'Challenge Accepted',
                'challenge-accepted-desc': 'Complete your first challenge.',
                'challenge-accepted-reward': '+5% challenge rewards',
                
                'point-millionaire': 'Point Millionaire',
                'point-millionaire-desc': 'Accumulate 1 million total office points.',
                'point-millionaire-reward': '+30% base production',
                
                // Quotes
                'quote-1': 'The first day at the office is 98% safety training.',
                'quote-2': '95% of PowerPoint statistics are never fact-checked.',
                'quote-3': 'Microsoft Teams consumes 1 day of your life annually.',
                'quote-4': 'The office never sleeps... but you should.',
                'quote-5': 'Best ideas come during coffee breaks, rarely in meetings.',
                'quote-6': 'Ctrl+F is the most important corporate skill.',
                'quote-7': 'This meeting could have been an email.',
                'quote-8': 'Reply All is the most dangerous button in email.',
                'quote-9': 'Saying "let me circle back on that" buys you 24 hours.',
                'quote-10': 'The printer always knows when you have a deadline.'
            },
            
            pl: {
                // Elementy UI
                'loading-tagline': 'Wspinanie się po korporacyjnej drabinie, klik po kliku',
                'critical-error': 'Błąd Krytyczny',
                'error-message': 'Korposzczur Idle napotkał krytyczny błąd i nie może się uruchomić.',
                'reload-page': 'Przeładuj Stronę',
                'office-points': 'Punkty Biurowe',
                'infinity-points': 'Punkty Nieskończoności',
                'desk-level': 'Poziom Biurka',
                'tasks': 'Zadania',
                'desk': 'Biurko',
                'challenges': 'Wyzwania',
                'achievements': 'Osiągnięcia',
                'settings': 'Ustawienia',
                'office-tasks': 'Zadania Biurowe',
                'desk-upgrades': 'Ulepszenia Biurka',
                'theme': 'Motyw',
                'theme-auto': 'Automatyczny',
                'theme-light': 'Jasny',
                'theme-dark': 'Ciemny',
                'language': 'Język',
                
                // Informacje o postępie
                'progress-info': 'Klikaj zadania, aby zdobyć punkty i odblokować automatyzację!',
                'desk-info': 'Ulepsz swoje miejsce pracy Punktami Nieskończoności dla stałych bonusów!',
                'challenges-info': 'Ukończ wyzwania dla potężnych nagród!',
                'achievements-info': 'Ukończ cele dla stałych bonusów!',
                
                // System Nieskończoności
                'go-infinite': 'Osiągnij Nieskończoność',
                'infinity-desc': 'Zresetuj wszystko za Punkty Nieskończoności',
                'infinity-reached': 'Osiągnięto Nieskończoność!',
                
                // Stany zadań
                'level': 'Poziom',
                'production': 'Produkcja',
                'per-second': '/s',
                'upgrade': 'Ulepsz',
                'cost': 'Koszt',
                'unlock-cost': 'Koszt Odblokowania',
                'locked': 'ZABLOKOWANE',
                'auto': 'AUTO',
                'manual': 'RĘCZNE',
                'progress': 'Postęp',
                'max-level': 'MAKSYMALNY POZIOM',
                
                // Ulepszenia biurka
                'owned': 'POSIADANE',
                'buy': 'KUP',
                'effect': 'Efekt',
                'requires': 'Wymaga',
                'infinities': 'Nieskończoności',
                
                // Wyzwania
                'available': 'Dostępne',
                'completed': 'Ukończone',
                'in-progress': 'W Trakcie',
                'locked': 'Zablokowane',
                'start-challenge': 'Rozpocznij Wyzwanie',
                'exit-challenge': 'Opuść Wyzwanie',
                'goal': 'Cel',
                'reward': 'Nagroda',
                'restriction': 'Ograniczenie',
                'time-limit': 'Limit Czasu',
                'best-time': 'Najlepszy Czas',
                
                // Osiągnięcia
                'unlocked': 'Odblokowane',
                'requirement': 'Wymaganie',
                
                // Ustawienia
                'export-save': 'Eksportuj Zapis',
                'import-save': 'Importuj Zapis',
                'import-save-title': 'Importuj Dane Zapisu',
                'import': 'Importuj',
                'cancel': 'Anuluj',
                'reset-game': 'Resetuj Grę',
                'confirm-reset': 'Czy na pewno chcesz zresetować cały postęp? Tej akcji nie można cofnąć!',
                
                // Powiadomienia
                'achievement-unlocked': 'Osiągnięcie Odblokowane!',
                'challenge-completed': 'Wyzwanie Ukończone!',
                'save-exported': 'Dane zapisu skopiowane do schowka!',
                'save-imported': 'Dane zapisu zaimportowane pomyślnie!',
                'invalid-save': 'Nieprawidłowy format danych zapisu!',
                'game-reset': 'Gra została zresetowana!',
                'task-unlocked': 'Zadanie Odblokowane!',
                'automation-unlocked': 'Automatyzacja Odblokowana!',
                
                // Zadania (Motyw Biurowy)
                'making-coffee': 'Robienie Kawy',
                'making-coffee-desc': 'Podstawowa umiejętność korporacyjna - utrzymywanie wszystkich w kofeinie.',
                
                'answering-emails': 'Odpowiadanie na Maile',
                'answering-emails-desc': 'Odpowiadanie na nieskończony strumień korporacyjnej komunikacji.',
                
                'filing-reports': 'Składanie Raportów',
                'filing-reports-desc': 'Tworzenie dokumentów, które nigdy nie będą przeczytane.',
                
                'small-talk': 'Small Talk',
                'small-talk-desc': 'Budowanie relacji zawodowych jedna niezręczna rozmowa na raz.',
                
                'fixing-printer': 'Naprawa Drukarki',
                'fixing-printer-desc': 'Wieczna walka z technologią biurową.',
                
                'excel-sheets': 'Arkusze Excel',
                'excel-sheets-desc': 'Sprawianie, że liczby tańczą w nieskończonych komórkach produktywności.',
                
                'powerpoint-slides': 'Prezentacje PowerPoint',
                'powerpoint-slides-desc': 'Śmierć przez punktory - korporacyjny sposób.',
                
                'team-meetings': 'Spotkania Zespołu',
                'team-meetings-desc': 'To spotkanie mogło być mailem.',
                
                'client-calls': 'Rozmowy z Klientami',
                'client-calls-desc': 'Profesjonalne udawanie przez telefon w najlepszym wydaniu.',
                
                'lunch-networking': 'Networking Obiadowy',
                'lunch-networking-desc': 'Strategiczne jedzenie z implikacjami kariery.',
                
                'project-planning': 'Planowanie Projektów',
                'project-planning-desc': 'Tworzenie harmonogramów, które natychmiast staną się przestarzałe.',
                
                'budget-reviews': 'Przeglądy Budżetu',
                'budget-reviews-desc': 'Znajdowanie kreatywnych sposobów uzasadnienia wydatków.',
                
                'performance-reviews': 'Oceny Wydajności',
                'performance-reviews-desc': 'Coroczne przedstawienie teatralne korporacyjne.',
                
                'strategic-planning': 'Planowanie Strategiczne',
                'strategic-planning-desc': 'Myślenie o myśleniu o przyszłości.',
                
                'executive-briefings': 'Briefingi Zarządu',
                'executive-briefings-desc': 'Tłumaczenie rzeczywistości na język przyjazny zarządowi.',
                
                'corporate-training': 'Szkolenia Korporacyjne',
                'corporate-training-desc': 'Uczenie się umiejętności, które już znasz w sposób zaakceptowany przez korporację.',
                
                // Ulepszenia biurka
                'coffee-mug': 'Spersonalizowany Kubek',
                'coffee-mug-desc': 'Twój ulubiony kubek zwiększa efektywność wszystkich zadań o 15%.',
                
                'desk-plant': 'Roślina na Biurko',
                'desk-plant-desc': 'Dotyk natury zwiększa produktywność o 12%.',
                
                'second-monitor': 'Drugi Monitor',
                'second-monitor-desc': 'Podwójne ekrany, podwójna produktywność. +25% efektywności.',
                
                'ergonomic-chair': 'Krzesło Ergonomiczne',
                'ergonomic-chair-desc': 'Komfort to produktywność. +20% do wszystkich bonusów.',
                
                'standing-desk': 'Biurko do Stania',
                'standing-desk-desc': 'Zdrowie to bogactwo. +30% generowania punktów biurowych.',
                
                'noise-canceling-headphones': 'Słuchawki z Redukcją Szumów',
                'noise-canceling-headphones-desc': 'Zablokuj rozpraszacze. +18% bonusu koncentracji.',
                
                'mechanical-keyboard': 'Klawiatura Mechaniczna',
                'mechanical-keyboard-desc': 'Kliknące klawisze dla maksymalnej produktywności. +22% szybkości pisania.',
                
                'executive-nameplate': 'Tabliczka Dyrektorska',
                'executive-nameplate-desc': 'Pokazuje twoją ważność. +35% bonusu autorytetu.',
                
                'mini-fridge': 'Mini Lodówka',
                'mini-fridge-desc': 'Nigdy nie opuszczaj biurka. +40% ciągłej produktywności.',
                
                'corner-office': 'Narożne Biuro',
                'corner-office-desc': 'Ostateczny symbol statusu. +100% do wszystkiego.',
                
                // Wyzwania
                'no-coffee-challenge': 'Wyzwanie Bez Kawy',
                'no-coffee-challenge-desc': 'Ukończ 100 zadań bez bonusów związanych z kawą.',
                
                'speed-demon': 'Demon Szybkości',
                'speed-demon-desc': 'Osiągnij 10,000 punktów biurowych w mniej niż 10 minut.',
                
                'multitasker': 'Mistrz Wielozadaniowości',
                'multitasker-desc': 'Miej 8 zadań działających jednocześnie.',
                
                'minimalist': 'Wyzwanie Minimalisty',
                'minimalist-desc': 'Osiągnij nieskończoność używając tylko 3 różnych typów zadań.',
                
                'efficiency-expert': 'Ekspert Wydajności',
                'efficiency-expert-desc': 'Ukończ 1000 zadań bez ręcznego klikania.',
                
                // Osiągnięcia
                'first-day': 'Pierwszy Dzień w Pracy',
                'first-day-desc': 'Zdobądź pierwsze 100 punktów biurowych.',
                'first-day-reward': '+10% efektywności kliknięć',
                
                'coffee-addict': 'Uzależniony od Kawy',
                'coffee-addict-desc': 'Ukończ zadanie kawy 100 razy.',
                'coffee-addict-reward': '+25% efektywności zadania kawy',
                
                'meeting-master': 'Mistrz Spotkań',
                'meeting-master-desc': 'Ukończ 50 spotkań zespołu.',
                'meeting-master-reward': '+20% nagród za zadania spotkaniowe',
                
                'infinite-worker': 'Nieskończony Pracownik',
                'infinite-worker-desc': 'Osiągnij nieskończoność po raz pierwszy.',
                'infinite-worker-reward': '+50% zysku punktów nieskończoności',
                
                'automation-enthusiast': 'Entuzjasta Automatyzacji',
                'automation-enthusiast-desc': 'Zautomatyzuj wszystkie zadania.',
                'automation-enthusiast-reward': '+15% szybkości automatyzacji',
                
                'desk-collector': 'Kolekcjoner Biurek',
                'desk-collector-desc': 'Posiadaj 5 ulepszeń biurka.',
                'desk-collector-reward': '+10% efektywności ulepszeń biurka',
                
                'challenge-accepted': 'Wyzwanie Przyjęte',
                'challenge-accepted-desc': 'Ukończ swoje pierwsze wyzwanie.',
                'challenge-accepted-reward': '+5% nagród za wyzwania',
                
                'point-millionaire': 'Punktowy Milioner',
                'point-millionaire-desc': 'Zgromadź łącznie 1 milion punktów biurowych.',
                'point-millionaire-reward': '+30% podstawowej produkcji',
                
                // Cytaty
                'quote-1': 'Pierwszy dzień w biurze to 98% szkoleń BHP.',
                'quote-2': '95% statystyk w PowerPoincie nikt nie sprawdza.',
                'quote-3': 'Microsoft Teams zjada rocznie 1 dzień twojego życia.',
                'quote-4': 'Biuro nigdy nie śpi... ale ty musisz.',
                'quote-5': 'Najlepsze pomysły przychodzą przy kawie, rzadko na spotkaniach.',
                'quote-6': 'Ctrl+F to najważniejsza umiejętność korposzczura.',
                'quote-7': 'To spotkanie mogło być mailem.',
                'quote-8': 'Odpowiedz wszystkim to najniebezpieczniejszy przycisk w mailu.',
                'quote-9': 'Powiedzenie "wrócę do tego" kupuje ci 24 godziny.',
                'quote-10': 'Drukarka zawsze wie, kiedy masz deadline.'
            }
        };
        
        this.init();
    }

    init() {
        this.updateLanguage();
        const select = document.getElementById('language-select');
        if (select) {
            select.value = this.currentLanguage;
            select.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updateLanguage();
            
            // Update HTML lang attribute
            document.documentElement.lang = lang;
            
            // Trigger custom event for other systems to react
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);
            if (translation && translation !== key) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    get(key) {
        return this.translations[this.currentLanguage]?.[key] || 
               this.translations['en'][key] || 
               key;
    }

    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // Handle very large numbers (scientific notation)
        if (Math.abs(num) >= 1e308) {
            return num.toExponential(2);
        }
        
        // Handle large numbers with suffixes
        if (Math.abs(num) >= 1e33) {
            return num.toExponential(2);
        }
        
        if (Math.abs(num) >= 1e30) return (num / 1e30).toFixed(2) + 'N'; // Nonillion
        if (Math.abs(num) >= 1e27) return (num / 1e27).toFixed(2) + 'O'; // Octillion
        if (Math.abs(num) >= 1e24) return (num / 1e24).toFixed(2) + 'S'; // Septillion
        if (Math.abs(num) >= 1e21) return (num / 1e21).toFixed(2) + 's'; // Sextillion
        if (Math.abs(num) >= 1e18) return (num / 1e18).toFixed(2) + 'Q'; // Quintillion
        if (Math.abs(num) >= 1e15) return (num / 1e15).toFixed(2) + 'q'; // Quadrillion
        if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + 'T'; // Trillion
        if (Math.abs(num) >= 1e9)  return (num / 1e9).toFixed(2) + 'B';  // Billion
        if (Math.abs(num) >= 1e6)  return (num / 1e6).toFixed(2) + 'M';  // Million
        if (Math.abs(num) >= 1e3)  return (num / 1e3).toFixed(2) + 'K';  // Thousand
        
        // Handle smaller numbers
        if (Math.abs(num) >= 100) return num.toFixed(0);
        if (Math.abs(num) >= 10) return num.toFixed(1);
        if (Math.abs(num) >= 1) return num.toFixed(2);
        if (Math.abs(num) >= 0.1) return num.toFixed(3);
        if (Math.abs(num) >= 0.01) return num.toFixed(4);
        
        return num.toFixed(2);
    }

    getRandomQuote() {
        const quoteKeys = [];
        for (let i = 1; i <= 10; i++) {
            quoteKeys.push(`quote-${i}`);
        }
        const randomKey = quoteKeys[Math.floor(Math.random() * quoteKeys.length)];
        return this.get(randomKey);
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / 60000) % 60;
        const hours = Math.floor(milliseconds / 3600000);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${seconds}s`;
        }
    }
}

// Initialize global language manager
window.Lang = new LanguageManager();