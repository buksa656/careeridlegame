// CorpoClicker Enhanced - COMPLETE with Tutorial System & Mobile Optimization
// Phase 3: Final Polish with Interactive Tutorial and Mobile Support

class CorpoClickerEnhanced {
    constructor() {
        // Initialize all previous systems
        this.audio = this.initializeAudioSystem();
        this.resources = this.initializeResources();
        this.departments = this.initializeDepartments();
        this.events = this.initializeEvents();
        this.minigames = this.initializeMinigames();
        this.gameData = this.initializeGameData();
        this.gameState = this.loadGameState();
        this.currentLanguage = this.gameState.settings.language || 'pl';
        
        // Tutorial system
        this.tutorial = this.initializeTutorial();
        this.tutorialActive = false;
        this.tutorialStep = 0;
        this.tutorialOverlay = null;
        
        // Mobile detection and optimization
        this.isMobile = this.detectMobile();
        this.touchSupport = 'ontouchstart' in window;
        this.hapticSupport = 'vibrate' in navigator;
        
        // Settings system
        this.settings = {
            audioEnabled: true,
            musicVolume: 0.3,
            sfxVolume: 0.7,
            tutorialCompleted: false,
            firstTime: true,
            language: 'pl'
        };
        
        // Statistics tracking
        this.statistics = {
            sessionStartTime: Date.now(),
            totalPlayTime: 0,
            totalClicks: 0,
            totalMinigamesPlayed: 0,
            totalMinigamesWon: 0,
            totalResourcesEarned: {},
            peakDepartments: 0,
            achievementsUnlocked: 0,
            sessionsPlayed: 0
        };
        
        // High scores system
        this.highScores = {
            quarterlyReport: { best: 0, totalPlayed: 0, totalWon: 0 },
            coffeeShop: { best: 0, totalPlayed: 0, totalWon: 0 },
            meetingDodge: { best: 0, totalPlayed: 0, totalWon: 0 },
            governmentContract: { best: 0, totalPlayed: 0, totalWon: 0 }
        };
        
        // Performance monitoring
        this.performance = {
            fpsHistory: [],
            memoryUsage: 0,
            particleCount: 0,
            adaptiveQuality: true
        };
        
        this.init();
    }

    // MOBILE DETECTION AND OPTIMIZATION
    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }

    initializeMobileOptimizations() {
        if (this.isMobile) {
            // Reduce particle count for performance
            this.config.particleReduction = 0.5;
            
            // Enable haptic feedback
            this.settings.hapticEnabled = this.hapticSupport;
            
            // Optimize canvas resolution
            this.config.canvasScale = window.devicePixelRatio > 2 ? 1.5 : window.devicePixelRatio;
            
            // Add touch-friendly styles
            document.body.classList.add('mobile-optimized');
            
            // Prevent zoom on input focus
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }
    }

    // TUTORIAL SYSTEM IMPLEMENTATION
    initializeTutorial() {
        return {
            steps: [
                {
                    id: 'welcome',
                    title: 'Witaj w CorpoClicker!',
                    description: 'Kliknij główny przycisk, aby zdobyć swój pierwszy budżet',
                    target: '#main-click-button',
                    action: 'click',
                    goal: () => this.resources.budget >= 10,
                    reward: null,
                    position: 'bottom'
                },
                {
                    id: 'hire_hr',
                    title: 'Zatrudnij Pierwszy Dział',
                    description: 'Kup Dział HR, aby zacząć produkować dokumenty',
                    target: '.department-card[data-dept="hr"] button',
                    action: 'click', 
                    goal: () => this.departments.hr.owned >= 1,
                    reward: () => this.addResource('documents', 10),
                    position: 'top'
                },
                {
                    id: 'watch_growth',
                    title: 'Obserwuj Wzrost Zasobów',
                    description: 'Twój dział HR teraz automatycznie produkuje dokumenty!',
                    target: '#documents',
                    action: 'wait',
                    goal: () => this.resources.documents >= 5,
                    reward: null,
                    position: 'bottom',
                    duration: 5000
                },
                {
                    id: 'play_minigame',
                    title: 'Wypróbuj Mini-grę',
                    description: 'Zagraj w Quarterly Report po bonus zasoby!',
                    target: '.minigame-card[data-game="quarterly_report"] button',
                    action: 'click',
                    goal: () => this.tutorial.minigameCompleted,
                    reward: () => this.addResource('prestige', 5),
                    position: 'top'
                },
                {
                    id: 'manage_life',
                    title: 'Zarządzaj Życiem Korporacyjnym',
                    description: 'Balansuj stres i motywację dla optymalnej wydajności',
                    target: '.progress-bars',
                    action: 'observe',
                    goal: () => true, // Always complete this step
                    reward: () => this.unlockAchievement('tutorial_master'),
                    position: 'right',
                    duration: 3000
                }
            ],
            currentStep: 0,
            completed: false,
            minigameCompleted: false,
            overlay: null,
            arrow: null
        };
    }

    startTutorial() {
        if (this.settings.tutorialCompleted) {
            return;
        }
        
        this.tutorialActive = true;
        this.tutorial.currentStep = 0;
        this.tutorial.completed = false;
        
        // Create tutorial overlay
        this.createTutorialOverlay();
        
        // Show first step
        this.showTutorialStep(0);
        
        // Play tutorial start sound
        this.playSound('notification');
        
        // Save tutorial start
        this.saveTutorialProgress();
    }

    createTutorialOverlay() {
        // Remove existing overlay
        if (this.tutorial.overlay) {
            this.tutorial.overlay.remove();
        }
        
        // Create dark overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h3 class="tutorial-title" id="tutorial-title"></h3>
                    <button class="tutorial-skip" onclick="game.skipTutorial()">Pomiń</button>
                </div>
                <div class="tutorial-body">
                    <p class="tutorial-description" id="tutorial-description"></p>
                </div>
                <div class="tutorial-footer">
                    <div class="tutorial-progress">
                        <span id="tutorial-step">1</span> / <span id="tutorial-total">5</span>
                    </div>
                    <button class="tutorial-next" id="tutorial-next" onclick="game.nextTutorialStep()" disabled>
                        Dalej
                    </button>
                </div>
            </div>
            <div class="tutorial-spotlight" id="tutorial-spotlight"></div>
            <div class="tutorial-arrow" id="tutorial-arrow"></div>
        `;
        
        document.body.appendChild(overlay);
        this.tutorial.overlay = overlay;
        this.tutorial.arrow = overlay.querySelector('#tutorial-arrow');
    }

    showTutorialStep(stepIndex) {
        if (stepIndex >= this.tutorial.steps.length) {
            this.completeTutorial();
            return;
        }
        
        const step = this.tutorial.steps[stepIndex];
        this.tutorial.currentStep = stepIndex;
        
        // Update tutorial content
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-description').textContent = step.description;
        document.getElementById('tutorial-step').textContent = stepIndex + 1;
        document.getElementById('tutorial-total').textContent = this.tutorial.steps.length;
        
        // Find target element
        const targetElement = document.querySelector(step.target);
        
        if (targetElement) {
            // Create spotlight effect
            this.createTutorialSpotlight(targetElement);
            
            // Position arrow
            this.positionTutorialArrow(targetElement, step.position);
            
            // Set up goal checking
            this.startGoalChecking(step);
            
            // Handle different step actions
            if (step.action === 'wait') {
                // Auto-advance after duration
                setTimeout(() => {
                    if (step.goal()) {
                        this.nextTutorialStep();
                    }
                }, step.duration || 2000);
            }
        }
        
        // Play step sound
        this.playSound('notification', 0.3);
    }

    createTutorialSpotlight(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const spotlight = document.getElementById('tutorial-spotlight');
        
        const padding = 10;
        const spotlightRect = {
            left: rect.left - padding,
            top: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        };
        
        spotlight.style.left = `${spotlightRect.left}px`;
        spotlight.style.top = `${spotlightRect.top}px`;
        spotlight.style.width = `${spotlightRect.width}px`;
        spotlight.style.height = `${spotlightRect.height}px`;
        
        // Add pulsing animation
        spotlight.classList.add('tutorial-spotlight-active');
        
        // Make target element accessible
        targetElement.style.zIndex = '10001';
        targetElement.style.position = 'relative';
    }

    positionTutorialArrow(targetElement, position) {
        const rect = targetElement.getBoundingClientRect();
        const arrow = this.tutorial.arrow;
        
        arrow.className = `tutorial-arrow tutorial-arrow-${position}`;
        
        switch (position) {
            case 'top':
                arrow.style.left = `${rect.left + rect.width / 2}px`;
                arrow.style.top = `${rect.bottom + 10}px`;
                break;
            case 'bottom':
                arrow.style.left = `${rect.left + rect.width / 2}px`;
                arrow.style.top = `${rect.top - 30}px`;
                break;
            case 'left':
                arrow.style.left = `${rect.right + 10}px`;
                arrow.style.top = `${rect.top + rect.height / 2}px`;
                break;
            case 'right':
                arrow.style.left = `${rect.left - 30}px`;
                arrow.style.top = `${rect.top + rect.height / 2}px`;
                break;
        }
    }

    startGoalChecking(step) {
        const checkGoal = () => {
            if (!this.tutorialActive || this.tutorial.currentStep !== this.tutorial.steps.indexOf(step)) {
                return;
            }
            
            if (step.goal()) {
                // Goal achieved
                document.getElementById('tutorial-next').disabled = false;
                
                // Apply reward if any
                if (step.reward) {
                    step.reward();
                }
                
                // Auto-advance for some steps
                if (step.action === 'wait' || step.action === 'observe') {
                    setTimeout(() => this.nextTutorialStep(), 1000);
                }
                
                // Play success sound
                this.playSound('success', 0.4);
            } else {
                // Keep checking
                setTimeout(checkGoal, 100);
            }
        };
        
        checkGoal();
    }

    nextTutorialStep() {
        if (this.tutorial.currentStep < this.tutorial.steps.length - 1) {
            this.showTutorialStep(this.tutorial.currentStep + 1);
        } else {
            this.completeTutorial();
        }
        
        // Reset next button
        document.getElementById('tutorial-next').disabled = true;
        
        // Save progress
        this.saveTutorialProgress();
    }

    completeTutorial() {
        this.tutorialActive = false;
        this.tutorial.completed = true;
        this.settings.tutorialCompleted = true;
        
        // Remove overlay
        if (this.tutorial.overlay) {
            this.tutorial.overlay.remove();
            this.tutorial.overlay = null;
        }
        
        // Clean up element styles
        document.querySelectorAll('[style*="z-index: 10001"]').forEach(el => {
            el.style.zIndex = '';
            el.style.position = '';
        });
        
        // Show completion message
        this.showTutorialCompletionDialog();
        
        // Play achievement sound
        this.playSound('achievement');
        
        // Award completion bonus
        this.addResource('budget', 100);
        this.addResource('documents', 50);
        this.addResource('prestige', 10);
        
        // Unlock achievement
        this.unlockAchievement('tutorial_master');
        
        // Save completion
        this.saveTutorialProgress();
        this.saveGameState();
    }

    showTutorialCompletionDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'tutorial-completion-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-icon">🎉</div>
                <h3>Tutorial Ukończony!</h3>
                <p>Gratulacje! Jesteś gotowy do podboju korporacyjnego świata!</p>
                <div class="completion-rewards">
                    <h4>Nagrody za ukończenie:</h4>
                    <div class="reward-list">
                        <div class="reward-item">💰 +100 Budżet</div>
                        <div class="reward-item">📄 +50 Dokumenty</div>
                        <div class="reward-item">🎖️ +10 Prestiż</div>
                        <div class="reward-item">🏆 Achievement "Tutorial Master"</div>
                    </div>
                </div>
                <button class="dialog-close" onclick="this.parentElement.parentElement.remove()">
                    Rozpocznij Grę!
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (dialog.parentElement) {
                dialog.remove();
            }
        }, 10000);
    }

    skipTutorial() {
        if (confirm('Czy na pewno chcesz pominąć tutorial? Możesz go później uruchomić z ustawień.')) {
            this.tutorialActive = false;
            this.settings.tutorialCompleted = true;
            
            if (this.tutorial.overlay) {
                this.tutorial.overlay.remove();
                this.tutorial.overlay = null;
            }
            
            // Clean up styles
            document.querySelectorAll('[style*="z-index: 10001"]').forEach(el => {
                el.style.zIndex = '';
                el.style.position = '';
            });
            
            // Give small skip bonus
            this.addResource('budget', 25);
            
            this.saveTutorialProgress();
            this.playSound('notification');
        }
    }

    saveTutorialProgress() {
        localStorage.setItem('corpoclicker_tutorial', JSON.stringify({
            completed: this.settings.tutorialCompleted,
            currentStep: this.tutorial.currentStep,
            timestamp: Date.now()
        }));
    }

    loadTutorialProgress() {
        try {
            const saved = localStorage.getItem('corpoclicker_tutorial');
            if (saved) {
                const data = JSON.parse(saved);
                this.settings.tutorialCompleted = data.completed || false;
                this.tutorial.currentStep = data.currentStep || 0;
                return true;
            }
        } catch (error) {
            console.warn('Failed to load tutorial progress:', error);
        }
        return false;
    }

    // MOBILE TOUCH CONTROLS FOR MINI-GAMES
    initializeMobileTouchControls() {
        if (!this.touchSupport) return;
        
        // Add mobile-specific event listeners
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        
        // Prevent default touch behaviors on game elements
        const gameElements = document.querySelectorAll('.game-container, canvas, button');
        gameElements.forEach(element => {
            element.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        });
    }

    handleTouchStart(event) {
        if (!this.currentMinigame) return;
        
        const touch = event.touches[0];
        const minigameType = this.currentMinigame.config.type;
        
        switch (minigameType) {
            case 'clicking':
                // Handle touch for Quarterly Report
                this.handleQuarterlyReportTouch(touch);
                break;
                
            case 'timing':
                // Handle touch for Coffee Shop (long press)
                this.handleCoffeeShopTouchStart(touch);
                break;
                
            case 'dodge':
                // Handle touch for Meeting Dodge (tap to jump)
                this.handleMeetingDodgeTouch(touch);
                break;
                
            case 'auction':
                // Handle touch for Government Contract
                this.handleGovernmentContractTouch(touch);
                break;
        }
        
        // Haptic feedback
        if (this.hapticSupport && this.settings.hapticEnabled) {
            navigator.vibrate(50);
        }
    }

    handleTouchEnd(event) {
        if (!this.currentMinigame) return;
        
        const minigameType = this.currentMinigame.config.type;
        
        if (minigameType === 'timing') {
            // Handle release for Coffee Shop
            this.handleCoffeeShopTouchEnd();
        }
    }

    handleQuarterlyReportTouch(touch) {
        // Convert touch to canvas coordinates
        const canvas = this.minigameCanvas;
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Create fake click event
        const clickEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        
        // Use existing click handler logic
        if (this.currentMinigame.gameState.clickHandler) {
            this.currentMinigame.gameState.clickHandler(clickEvent);
        }
    }

    handleCoffeeShopTouchStart(touch) {
        // Simulate space key down
        const keyEvent = {
            code: 'Space',
            type: 'keydown',
            preventDefault: () => {}
        };
        
        if (this.currentMinigame.gameState.keyboardHandler) {
            this.currentMinigame.gameState.keyboardHandler(keyEvent);
        }
    }

    handleCoffeeShopTouchEnd() {
        // Simulate space key up
        const keyEvent = {
            code: 'Space',
            type: 'keyup',
            preventDefault: () => {}
        };
        
        if (this.currentMinigame.gameState.keyboardHandler) {
            this.currentMinigame.gameState.keyboardHandler(keyEvent);
        }
    }

    handleMeetingDodgeTouch(touch) {
        // Simulate space key press for jump
        const keyEvent = {
            code: 'Space',
            type: 'keydown',
            preventDefault: () => {}
        };
        
        if (this.currentMinigame.gameState.keyboardHandler) {
            this.currentMinigame.gameState.keyboardHandler(keyEvent);
        }
    }

    handleGovernmentContractTouch(touch) {
        // Find bid button and trigger click
        const bidButton = document.getElementById('bid-button');
        if (bidButton && !bidButton.disabled) {
            bidButton.click();
        }
    }

    // SETTINGS SYSTEM
    showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal modal-overlay';
        modal.innerHTML = `
            <div class="modal-content settings-content">
                <div class="modal-header">
                    <h3>Ustawienia</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="audio">Audio</button>
                    <button class="settings-tab" data-tab="game">Gra</button>
                    <button class="settings-tab" data-tab="stats">Statystyki</button>
                    <button class="settings-tab" data-tab="about">O grze</button>
                </div>
                <div class="settings-content-area">
                    <div class="settings-panel active" data-panel="audio">
                        <h4>Ustawienia Audio</h4>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="audio-enabled" ${this.settings.audioEnabled ? 'checked' : ''}>
                                Włącz dźwięki
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>Głośność muzyki: <span id="music-volume-display">${Math.round(this.settings.musicVolume * 100)}%</span></label>
                            <input type="range" id="music-volume" min="0" max="1" step="0.1" value="${this.settings.musicVolume}">
                        </div>
                        <div class="setting-item">
                            <label>Głośność efektów: <span id="sfx-volume-display">${Math.round(this.settings.sfxVolume * 100)}%</span></label>
                            <input type="range" id="sfx-volume" min="0" max="1" step="0.1" value="${this.settings.sfxVolume}">
                        </div>
                        ${this.isMobile ? `
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="haptic-enabled" ${this.settings.hapticEnabled ? 'checked' : ''}>
                                Wibracje (haptic feedback)
                            </label>
                        </div>` : ''}
                    </div>
                    <div class="settings-panel" data-panel="game">
                        <h4>Ustawienia Gry</h4>
                        <div class="setting-item">
                            <button onclick="game.restartTutorial()">Uruchom tutorial ponownie</button>
                        </div>
                        <div class="setting-item">
                            <button onclick="game.exportSaveData()">Eksportuj dane zapisu</button>
                        </div>
                        <div class="setting-item">
                            <button onclick="game.importSaveData()">Importuj dane zapisu</button>
                        </div>
                        <div class="setting-item danger">
                            <button onclick="game.resetGameConfirm()" class="danger-button">Reset gry</button>
                        </div>
                    </div>
                    <div class="settings-panel" data-panel="stats">
                        <h4>Statystyki</h4>
                        <div id="statistics-display"></div>
                    </div>
                    <div class="settings-panel" data-panel="about">
                        <h4>CorpoClicker Enhanced v3.0</h4>
                        <p>Stworzony przez AI Assistant</p>
                        <p>Wersja: 3.0.0 - Final Polish</p>
                        <p>Data: ${new Date().toLocaleDateString()}</p>
                        <div class="credits">
                            <h5>Funkcje:</h5>
                            <ul>
                                <li>✅ 4 różne mini-gry</li>
                                <li>✅ System audio (Web Audio API)</li>
                                <li>✅ Efekty cząsteczkowe</li>
                                <li>✅ Interaktywny tutorial</li>
                                <li>✅ Wsparcie mobile</li>
                                <li>✅ System osiągnięć</li>
                                <li>✅ Balansowanie data-driven</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set up tab switching
        this.setupSettingsTabs(modal);
        
        // Set up audio controls
        this.setupAudioControls(modal);
        
        // Load statistics
        this.loadStatisticsDisplay(modal);
    }

    setupSettingsTabs(modal) {
        const tabs = modal.querySelectorAll('.settings-tab');
        const panels = modal.querySelectorAll('.settings-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                const panelId = tab.dataset.tab;
                modal.querySelector(`[data-panel="${panelId}"]`).classList.add('active');
            });
        });
    }

    setupAudioControls(modal) {
        // Audio enabled toggle
        const audioToggle = modal.querySelector('#audio-enabled');
        audioToggle.addEventListener('change', (e) => {
            this.settings.audioEnabled = e.target.checked;
            if (!this.settings.audioEnabled) {
                this.stopAllAudio();
            }
            this.saveSettings();
        });
        
        // Music volume slider
        const musicSlider = modal.querySelector('#music-volume');
        const musicDisplay = modal.querySelector('#music-volume-display');
        musicSlider.addEventListener('input', (e) => {
            this.settings.musicVolume = parseFloat(e.target.value);
            musicDisplay.textContent = `${Math.round(this.settings.musicVolume * 100)}%`;
            this.setMusicVolume(this.settings.musicVolume);
            this.saveSettings();
        });
        
        // SFX volume slider
        const sfxSlider = modal.querySelector('#sfx-volume');
        const sfxDisplay = modal.querySelector('#sfx-volume-display');
        sfxSlider.addEventListener('input', (e) => {
            this.settings.sfxVolume = parseFloat(e.target.value);
            sfxDisplay.textContent = `${Math.round(this.settings.sfxVolume * 100)}%`;
            this.setSFXVolume(this.settings.sfxVolume);
            // Play test sound
            this.playSound('notification', 0.5);
            this.saveSettings();
        });
        
        // Haptic feedback toggle (mobile only)
        const hapticToggle = modal.querySelector('#haptic-enabled');
        if (hapticToggle) {
            hapticToggle.addEventListener('change', (e) => {
                this.settings.hapticEnabled = e.target.checked;
                this.saveSettings();
            });
        }
    }

    loadStatisticsDisplay(modal) {
        const container = modal.querySelector('#statistics-display');
        const stats = this.calculateGameStatistics();
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${this.formatTime(stats.totalPlayTime)}</div>
                    <div class="stat-label">Całkowity czas gry</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.totalClicks.toLocaleString()}</div>
                    <div class="stat-label">Łączne kliknięcia</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.totalMinigamesPlayed}</div>
                    <div class="stat-label">Mini-gry zagrane</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round(stats.winRate)}%</div>
                    <div class="stat-label">Procent wygranych</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.peakDepartments}</div>
                    <div class="stat-label">Rekord działów</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.achievementsUnlocked}/${stats.totalAchievements}</div>
                    <div class="stat-label">Osiągnięcia</div>
                </div>
            </div>
            <div class="high-scores">
                <h5>Najlepsze wyniki mini-gier:</h5>
                <div class="high-scores-list">
                    <div>📊 Quarterly Report: ${this.highScores.quarterlyReport.best}</div>
                    <div>☕ Coffee Shop: ${this.highScores.coffeeShop.best}</div>
                    <div>🏃 Meeting Dodge: ${this.highScores.meetingDodge.best}</div>
                    <div>🏛️ Gov Contract: $${this.highScores.governmentContract.best.toLocaleString()}</div>
                </div>
            </div>
        `;
    }

    calculateGameStatistics() {
        const currentSession = Date.now() - this.statistics.sessionStartTime;
        const totalPlayTime = this.statistics.totalPlayTime + currentSession;
        
        return {
            totalPlayTime,
            totalClicks: this.statistics.totalClicks,
            totalMinigamesPlayed: this.statistics.totalMinigamesPlayed,
            totalMinigamesWon: this.statistics.totalMinigamesWon,
            winRate: this.statistics.totalMinigamesPlayed > 0 ? 
                (this.statistics.totalMinigamesWon / this.statistics.totalMinigamesPlayed) * 100 : 0,
            peakDepartments: Math.max(this.statistics.peakDepartments, this.getTotalDepartments()),
            achievementsUnlocked: Object.values(this.achievements).filter(a => a.completed).length,
            totalAchievements: Object.keys(this.achievements).length
        };
    }

    // PERFORMANCE MONITORING AND OPTIMIZATION
    initializePerformanceMonitoring() {
        // FPS monitoring
        let lastFrameTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            const now = performance.now();
            frameCount++;
            
            if (now - lastFrameTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (now - lastFrameTime));
                this.performance.fpsHistory.push(fps);
                
                // Keep only last 30 seconds of FPS data
                if (this.performance.fpsHistory.length > 30) {
                    this.performance.fpsHistory.shift();
                }
                
                // Adaptive quality adjustment
                if (this.performance.adaptiveQuality) {
                    this.adjustQualityBasedOnPerformance(fps);
                }
                
                frameCount = 0;
                lastFrameTime = now;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
        
        // Memory monitoring (if available)
        if (performance.memory) {
            setInterval(() => {
                this.performance.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            }, 5000);
        }
    }

    adjustQualityBasedOnPerformance(fps) {
        if (fps < 30) {
            // Reduce particle count
            this.config.particleReduction = Math.max(0.2, this.config.particleReduction - 0.1);
            
            // Reduce canvas resolution on mobile
            if (this.isMobile) {
                this.config.canvasScale = Math.max(1, this.config.canvasScale - 0.2);
            }
            
            console.log(`Performance optimization: FPS ${fps}, particle reduction: ${this.config.particleReduction}`);
        } else if (fps > 50 && this.config.particleReduction < 1) {
            // Restore quality if performance is good
            this.config.particleReduction = Math.min(1, this.config.particleReduction + 0.1);
            
            if (this.isMobile) {
                this.config.canvasScale = Math.min(window.devicePixelRatio, this.config.canvasScale + 0.1);
            }
        }
    }

    // SAVE/LOAD SYSTEM ENHANCEMENTS
    saveSettings() {
        localStorage.setItem('corpoclicker_settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('corpoclicker_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    exportSaveData() {
        const saveData = {
            version: '3.0.0',
            timestamp: Date.now(),
            resources: this.resources,
            departments: this.departments,
            achievements: this.achievements,
            statistics: this.statistics,
            settings: this.settings,
            highScores: this.highScores
        };
        
        const dataStr = JSON.stringify(saveData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `corpoclicker_save_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        this.showNotification('Dane zapisu zostały wyeksportowane!');
    }

    importSaveData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Validate save data
                    if (saveData.version && saveData.resources && saveData.departments) {
                        // Load save data
                        this.resources = saveData.resources;
                        this.departments = saveData.departments;
                        this.achievements = saveData.achievements || this.achievements;
                        this.statistics = saveData.statistics || this.statistics;
                        this.settings = { ...this.settings, ...saveData.settings };
                        this.highScores = saveData.highScores || this.highScores;
                        
                        // Apply loaded settings
                        this.setMusicVolume(this.settings.musicVolume);
                        this.setSFXVolume(this.settings.sfxVolume);
                        
                        // Update display
                        this.updateDisplay();
                        
                        this.showNotification('Dane zapisu zostały zaimportowane!');
                        this.playSound('success');
                    } else {
                        throw new Error('Invalid save file format');
                    }
                } catch (error) {
                    this.showNotification('Błąd podczas importu danych zapisu!');
                    console.error('Import error:', error);
                }
            };
            
            reader.readAsText(file);
        });
        
        input.click();
    }

    resetGameConfirm() {
        if (confirm('Czy na pewno chcesz zresetować całą grę? Ta akcja jest nieodwracalna!')) {
            if (confirm('OSTATNIA SZANSA! Wszystkie postępy zostaną utracone. Czy kontynuować?')) {
                this.resetGame();
            }
        }
    }

    resetGame() {
        // Clear localStorage
        localStorage.removeItem('corpoclicker_save');
        localStorage.removeItem('corpoclicker_settings');
        localStorage.removeItem('corpoclicker_tutorial');
        localStorage.removeItem('corpoclicker_statistics');
        localStorage.removeItem('corpoclicker_highscores');
        
        // Show reset message
        this.showNotification('Gra została zresetowana. Odświeżenie strony...', 3000);
        
        // Reload page after delay
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    restartTutorial() {
        this.settings.tutorialCompleted = false;
        this.tutorial.currentStep = 0;
        this.tutorial.completed = false;
        this.tutorial.minigameCompleted = false;
        
        this.saveTutorialProgress();
        this.saveSettings();
        
        // Close settings modal
        const modal = document.querySelector('.settings-modal');
        if (modal) {
            modal.remove();
        }
        
        // Start tutorial
        setTimeout(() => {
            this.startTutorial();
        }, 500);
    }

    // UTILITY FUNCTIONS
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    getTotalDepartments() {
        return Object.values(this.departments).reduce((sum, dept) => sum + dept.owned, 0);
    }

    // INITIALIZATION WITH PHASE 3 FEATURES
    init() {
        // Load saved data
        this.loadSettings();
        this.loadTutorialProgress();
        this.loadGameState();
        
        // Initialize systems
        this.setupEventListeners();
        this.initializeParticleSystem();
        this.initializeMobileOptimizations();
        this.initializeMobileTouchControls();
        this.initializePerformanceMonitoring();
        
        // Start game systems
        this.updateDisplay();
        this.startGameLoop();
        this.startAutoSave();
        
        // Initialize audio on first user interaction
        document.addEventListener('click', () => {
            if (!this.audio.initialized && this.settings.audioEnabled) {
                this.initializeAudio();
            }
        }, { once: true });
        
        // Start tutorial for new players
        if (!this.settings.tutorialCompleted && this.settings.firstTime) {
            setTimeout(() => {
                this.startTutorial();
            }, 1000);
        } else {
            // Show welcome back message
            setTimeout(() => {
                this.showNotification('🎮 Witaj ponownie w CorpoClicker! Nowa wersja 3.0! 🚀');
            }, 1000);
        }
        
        // Update first time flag
        this.settings.firstTime = false;
        this.saveSettings();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CorpoClickerEnhanced();
});