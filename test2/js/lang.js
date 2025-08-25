// Language Support System
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                // UI Elements
                'office-points': 'Office Points',
                'infinity-points': 'Infinity Points',
                'soft-skills': 'Soft Skills',
                'office-tasks': 'Office Tasks',
                'desk-upgrades': 'Desk Upgrades',
                'challenges': 'Challenges',
                'achievements': 'Achievements',
                'settings': 'Settings',
                'tasks': 'Tasks',
                'desk': 'Desk',
                
                // Task related
                'progress-info': 'Click tasks to earn points and unlock automation!',
                'go-infinite': 'Go Infinite',
                'infinity-desc': 'Reset everything for Infinity Points',
                'level': 'Level',
                'idle-rate': 'Idle Rate',
                'per-second': '/s',
                'upgrade': 'Upgrade',
                'cost': 'Cost',
                'unlock-cost': 'Unlock Cost',
                'locked': 'Locked',
                'auto': 'Auto',
                'manual': 'Manual',
                'progress': 'Progress',
                
                // Desk related
                'desk-info': 'Upgrade your workspace for permanent bonuses!',
                'owned': 'Owned',
                'buy': 'Buy',
                'effect': 'Effect',
                
                // Challenges
                'challenges-info': 'Complete challenges for powerful rewards!',
                'challenge-details': 'Challenge Details',
                'reward': 'Reward',
                'requirement': 'Requirement',
                'completed': 'Completed',
                'available': 'Available',
                'start-challenge': 'Start Challenge',
                'exit-challenge': 'Exit Challenge',
                'in-challenge': 'In Challenge',
                
                // Achievements
                'achievements-info': 'Complete goals to earn permanent bonuses!',
                'unlocked': 'Unlocked',
                
                // Settings
                'language': 'Language',
                'auto-save': 'Auto Save',
                'every-30s': 'Every 30s',
                'every-60s': 'Every 60s',
                'every-2m': 'Every 2m',
                'export-save': 'Export Save',
                'import-save': 'Import Save',
                'import-save-title': 'Import Save Data',
                'import': 'Import',
                'cancel': 'Cancel',
                'reset-game': 'Reset Game',
                'confirm-reset': 'Are you sure you want to reset all progress?',
                
                // Notifications
                'achievement-unlocked': 'Achievement Unlocked!',
                'challenge-completed': 'Challenge Completed!',
                'infinity-reached': 'Infinity Reached!',
                'save-exported': 'Save data copied to clipboard!',
                'save-imported': 'Save data imported successfully!',
                'invalid-save': 'Invalid save data!',
                'game-reset': 'Game has been reset!',
                
                // Tasks
                'making-coffee': 'Making Coffee for Boss',
                'making-coffee-desc': 'The essential corporate skill - keeping the boss caffeinated.',
                'copying-files': 'Operating Copy Machine',
                'copying-files-desc': 'The ancient art of making paper copies in the digital age.',
                'sorting-emails': 'Sorting Emails',
                'sorting-emails-desc': 'Moving emails to folders - the modern filing system.',
                'small-talk': 'Small Talk in Kitchen',
                'small-talk-desc': 'Building workplace relationships one coffee conversation at a time.',
                'bug-reports': 'Reporting Bugs to IT',
                'bug-reports-desc': 'Have you tried turning it off and on again?',
                'excel-work': 'Excel Spreadsheet Work',
                'excel-work-desc': 'Making numbers dance in endless cells of productivity.',
                'powerpoint': 'Creating PowerPoint Presentations',
                'powerpoint-desc': 'Death by bullet points - the corporate way.',
                'teams-training': 'Microsoft Teams Training',
                'teams-training-desc': 'Learning to mute yourself in the digital workplace.',
                'google-docs': 'Google Docs Collaboration',
                'google-docs-desc': 'Real-time document editing and confusion.',
                'meetings': 'Attending Meetings',
                'meetings-desc': 'This meeting could have been an email.',
                'presentations': 'Executive Presentations',
                'presentations-desc': 'Impressing the suits with charts and graphs.',
                'monday-calls': 'Monday Morning Calls',
                'monday-calls-desc': 'Starting the week with mandatory enthusiasm.',
                'lunch-break': 'Extended Lunch Break',
                'lunch-break-desc': 'Strategic nutrition and networking time.',
                'sending-gifs': 'Sending GIFs in Chat',
                'sending-gifs-desc': 'Corporate communication through animated images.',
                'linkedin': 'LinkedIn Networking',
                'linkedin-desc': 'Professional social media masquerading as work.',
                'office-king': 'Office Space Domination',
                'office-king-desc': 'Becoming the unofficial ruler of the workplace.',
                
                // Desk Upgrades
                'coffee-mug': 'Coffee Mug',
                'coffee-mug-desc': 'Your favorite mug! All tasks produce 10% more points.',
                'desk-plant': 'Desk Plant',
                'desk-plant-desc': 'A touch of nature increases productivity by 8%.',
                'desk-lamp': 'RGB Desk Lamp',
                'desk-lamp-desc': 'Gaming lighting for serious work. +15% task speed.',
                'monitor': 'Second Monitor',
                'monitor-desc': 'Double the screens, double the productivity. +20% efficiency.',
                'stress-ball': 'Stress Ball',
                'stress-ball-desc': 'Squeeze away the corporate anxiety. +5% click power.',
                'ergonomic-chair': 'Ergonomic Chair',
                'ergonomic-chair-desc': 'Comfort is productivity. +25% all bonuses.',
                'standing-desk': 'Standing Desk',
                'standing-desk-desc': 'Health is wealth. +30% office points generation.',
                'executive-desk': 'Executive Desk',
                'executive-desk-desc': 'The ultimate workspace upgrade. +50% to everything.',
                
                // Challenges
                'no-coffee': 'No Coffee Challenge',
                'no-coffee-desc': 'Complete 100 tasks without any coffee-related bonuses.',
                'no-coffee-reward': '+25% base task efficiency',
                'speed-demon': 'Speed Demon',
                'speed-demon-desc': 'Reach 1000 office points in under 5 minutes.',
                'speed-demon-reward': '+2x click power',
                'multitasker': 'Corporate Multitasker',
                'multitasker-desc': 'Have 5 tasks running simultaneously.',
                'multitasker-reward': '+15% automation speed',
                'workaholic': 'Workaholic',
                'workaholic-desc': 'Accumulate 1 million office points.',
                'workaholic-reward': '+3x offline progression',
                
                // Achievements
                'first-day': 'First Day on the Job',
                'first-day-desc': 'Earn your first 100 office points.',
                'first-day-reward': '+10% click efficiency',
                'coffee-addict': 'Coffee Addict',
                'coffee-addict-desc': 'Make coffee 50 times.',
                'coffee-addict-reward': '+20% coffee task efficiency',
                'meeting-master': 'Meeting Master',
                'meeting-master-desc': 'Attend 25 meetings.',
                'meeting-master-reward': '+15% meeting task rewards',
                'infinite-worker': 'Infinite Worker',
                'infinite-worker-desc': 'Reach infinity for the first time.',
                'infinite-worker-reward': '+2x infinity point gain',
                
                // Quotes
                'quote-1': 'The first day at the office is 98% safety training',
                'quote-2': '95% of PowerPoint statistics are never fact-checked',
                'quote-3': 'Microsoft Teams consumes 1 day of your life annually',
                'quote-4': 'The office never sleeps... but you should',
                'quote-5': 'Best ideas come during coffee breaks, rarely in meetings',
                'quote-6': 'Ctrl+F is the most important corporate skill',
                'quote-7': 'This meeting could have been an email',
                'quote-8': 'The chance of meeting the CEO increases in elevators',
                'quote-9': 'Reply All is the most dangerous button in email',
                'quote-10': 'Saying "let me circle back on that" buys you 24 hours'
            },
            pl: {
                // UI Elements
                'office-points': 'Punkty Biurowe',
                'infinity-points': 'Punkty Nieskończoności',
                'soft-skills': 'Umiejętności Miękkie',
                'office-tasks': 'Zadania Biurowe',
                'desk-upgrades': 'Ulepszenia Biurka',
                'challenges': 'Wyzwania',
                'achievements': 'Osiągnięcia',
                'settings': 'Ustawienia',
                'tasks': 'Zadania',
                'desk': 'Biurko',
                
                // Task related
                'progress-info': 'Klikaj zadania, aby zdobyć punkty i odblokować automatyzację!',
                'go-infinite': 'Osiągnij Nieskończoność',
                'infinity-desc': 'Zresetuj wszystko za Punkty Nieskończoności',
                'level': 'Poziom',
                'idle-rate': 'Tempo Bezczynności',
                'per-second': '/s',
                'upgrade': 'Ulepsz',
                'cost': 'Koszt',
                'unlock-cost': 'Koszt Odblokowania',
                'locked': 'Zablokowane',
                'auto': 'Automatyczne',
                'manual': 'Ręczne',
                'progress': 'Postęp',
                
                // Desk related
                'desk-info': 'Ulepsz swoje miejsce pracy dla stałych bonusów!',
                'owned': 'Posiadane',
                'buy': 'Kup',
                'effect': 'Efekt',
                
                // Challenges
                'challenges-info': 'Ukończ wyzwania dla potężnych nagród!',
                'challenge-details': 'Szczegóły Wyzwania',
                'reward': 'Nagroda',
                'requirement': 'Wymaganie',
                'completed': 'Ukończone',
                'available': 'Dostępne',
                'start-challenge': 'Rozpocznij Wyzwanie',
                'exit-challenge': 'Opuść Wyzwanie',
                'in-challenge': 'W Wyzwaniu',
                
                // Achievements
                'achievements-info': 'Ukończ cele dla stałych bonusów!',
                'unlocked': 'Odblokowane',
                
                // Settings
                'language': 'Język',
                'auto-save': 'Automatyczny Zapis',
                'every-30s': 'Co 30s',
                'every-60s': 'Co 60s',
                'every-2m': 'Co 2m',
                'export-save': 'Eksportuj Zapis',
                'import-save': 'Importuj Zapis',
                'import-save-title': 'Importuj Dane Zapisu',
                'import': 'Importuj',
                'cancel': 'Anuluj',
                'reset-game': 'Resetuj Grę',
                'confirm-reset': 'Czy na pewno chcesz zresetować cały postęp?',
                
                // Notifications
                'achievement-unlocked': 'Osiągnięcie Odblokowane!',
                'challenge-completed': 'Wyzwanie Ukończone!',
                'infinity-reached': 'Osiągnięto Nieskończoność!',
                'save-exported': 'Dane zapisu skopiowane do schowka!',
                'save-imported': 'Dane zapisu zaimportowane pomyślnie!',
                'invalid-save': 'Nieprawidłowe dane zapisu!',
                'game-reset': 'Gra została zresetowana!',
                
                // Tasks
                'making-coffee': 'Robienie Kawy dla Szefa',
                'making-coffee-desc': 'Podstawowa umiejętność korporacyjna - utrzymywanie szefa w kofeinie.',
                'copying-files': 'Obsługa Kserokopiarki',
                'copying-files-desc': 'Starożytna sztuka kopiowania w erze cyfrowej.',
                'sorting-emails': 'Sortowanie Maili',
                'sorting-emails-desc': 'Przenoszenie maili do folderów - nowoczesny system archiwizacji.',
                'small-talk': 'Small Talk w Kuchni',
                'small-talk-desc': 'Budowanie relacji zawodowych przy kawie.',
                'bug-reports': 'Raportowanie Błędów do IT',
                'bug-reports-desc': 'Czy próbowałeś wyłączyć i włączyć ponownie?',
                'excel-work': 'Praca w Excelu',
                'excel-work-desc': 'Sprawianie, że liczby tańczą w nieskończonych komórkach produktywności.',
                'powerpoint': 'Tworzenie Prezentacji PowerPoint',
                'powerpoint-desc': 'Śmierć przez punktory - korporacyjny sposób.',
                'teams-training': 'Szkolenie Microsoft Teams',
                'teams-training-desc': 'Nauka wyciszania się w cyfrowym miejscu pracy.',
                'google-docs': 'Współpraca Google Docs',
                'google-docs-desc': 'Edycja dokumentów w czasie rzeczywistym i zamieszanie.',
                'meetings': 'Uczestnictwo w Zebraniach',
                'meetings-desc': 'To zebranie mogło być mailem.',
                'presentations': 'Prezentacje dla Zarządu',
                'presentations-desc': 'Imponowanie garniturowym wykresami i grafikami.',
                'monday-calls': 'Poniedziałkowe Rozmowy',
                'monday-calls-desc': 'Rozpoczynanie tygodnia obowiązkowym entuzjazmem.',
                'lunch-break': 'Przedłużona Przerwa Obiadowa',
                'lunch-break-desc': 'Strategiczny czas na odżywianie i networking.',
                'sending-gifs': 'Wysyłanie GIF-ów',
                'sending-gifs-desc': 'Komunikacja korporacyjna przez animowane obrazy.',
                'linkedin': 'Networking na LinkedIn',
                'linkedin-desc': 'Profesjonalne media społecznościowe udające pracę.',
                'office-king': 'Dominacja w Biurze',
                'office-king-desc': 'Zostanie nieoficjalnym władcą miejsca pracy.',
                
                // Desk Upgrades
                'coffee-mug': 'Kubek do Kawy',
                'coffee-mug-desc': 'Twój ulubiony kubek! Wszystkie zadania dają 10% więcej punktów.',
                'desk-plant': 'Roślina na Biurko',
                'desk-plant-desc': 'Dotyk natury zwiększa produktywność o 8%.',
                'desk-lamp': 'Lampka RGB',
                'desk-lamp-desc': 'Gamingowe oświetlenie do poważnej pracy. +15% szybkość zadań.',
                'monitor': 'Drugi Monitor',
                'monitor-desc': 'Podwójne ekrany, podwójna produktywność. +20% efektywność.',
                'stress-ball': 'Piłka Antystresowa',
                'stress-ball-desc': 'Wyciśnij korporacyjny stres. +5% siła kliknięć.',
                'ergonomic-chair': 'Krzesło Ergonomiczne',
                'ergonomic-chair-desc': 'Komfort to produktywność. +25% wszystkie bonusy.',
                'standing-desk': 'Biurko do Stania',
                'standing-desk-desc': 'Zdrowie to bogactwo. +30% generowanie punktów biurowych.',
                'executive-desk': 'Biurko Dyrektorskie',
                'executive-desk-desc': 'Ostateczne ulepszenie miejsca pracy. +50% do wszystkiego.',
                
                // Challenges
                'no-coffee': 'Wyzwanie Bez Kawy',
                'no-coffee-desc': 'Ukończ 100 zadań bez bonusów związanych z kawą.',
                'no-coffee-reward': '+25% podstawowa efektywność zadań',
                'speed-demon': 'Demon Szybkości',
                'speed-demon-desc': 'Osiągnij 1000 punktów biurowych w mniej niż 5 minut.',
                'speed-demon-reward': '+2x siła kliknięć',
                'multitasker': 'Korporacyjny Multitasker',
                'multitasker-desc': 'Miej 5 zadań działających jednocześnie.',
                'multitasker-reward': '+15% szybkość automatyzacji',
                'workaholic': 'Pracoholik',
                'workaholic-desc': 'Zgromadź 1 milion punktów biurowych.',
                'workaholic-reward': '+3x postęp offline',
                
                // Achievements
                'first-day': 'Pierwszy Dzień w Pracy',
                'first-day-desc': 'Zdobądź pierwsze 100 punktów biurowych.',
                'first-day-reward': '+10% efektywność kliknięć',
                'coffee-addict': 'Uzależniony od Kawy',
                'coffee-addict-desc': 'Zrób kawę 50 razy.',
                'coffee-addict-reward': '+20% efektywność zadań kawowych',
                'meeting-master': 'Mistrz Zebrań',
                'meeting-master-desc': 'Weź udział w 25 zebraniach.',
                'meeting-master-reward': '+15% nagrody z zadań zebraniowych',
                'infinite-worker': 'Nieskończony Pracownik',
                'infinite-worker-desc': 'Osiągnij nieskończoność po raz pierwszy.',
                'infinite-worker-reward': '+2x zysk punktów nieskończoności',
                
                // Quotes
                'quote-1': 'Pierwszy dzień w biurze to 98% szkoleń BHP',
                'quote-2': '95% statystyk w PowerPoincie nikt nie sprawdza',
                'quote-3': 'Microsoft Teams zjada rocznie 1 dzień Twojego życia',
                'quote-4': 'Biuro nigdy nie śpi... ale Ty musisz',
                'quote-5': 'Najlepsze pomysły wpadają przy kawie, rzadko na spotkaniach',
                'quote-6': 'Ctrl+F to najważniejsza umiejętność korposzczura',
                'quote-7': 'To spotkanie mogło być mailem',
                'quote-8': 'Szansa na spotkanie CEO rośnie w windach',
                'quote-9': 'Odpowiedz wszystkim to najniebezpieczniejszy przycisk w mailu',
                'quote-10': 'Powiedzenie "wrócę do tego" kupuje Ci 24 godziny'
            }
        };
        
        this.init();
    }
    
    init() {
        this.updateLanguage();
        document.getElementById('language-select').value = this.currentLanguage;
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateLanguage();
    }
    
    updateLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }
    
    get(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations['en'][key] || key;
    }
    
    formatNumber(num) {
        if (typeof num !== 'number') return num;
        
        if (Math.abs(num) < 1000) {
            return num.toFixed(2);
        }
        
        if (Math.abs(num) < 1000000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        
        if (Math.abs(num) < 1000000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        
        if (Math.abs(num) < 1000000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        
        // For very large numbers, use scientific notation
        return num.toExponential(2);
    }
    
    getRandomQuote() {
        const quotes = [];
        for (let i = 1; i <= 10; i++) {
            quotes.push(this.get(`quote-${i}`));
        }
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}

// Initialize global language manager
window.Lang = new LanguageManager();
