// CorpoClicker Enhanced v3.0 - FIXED VERSION - No Errors
class CorpoClickerGame {
    constructor() {
        this.version = "3.0.0-fixed";
        
        // Initialize audio system first to prevent errors
        this.initializeAudioSystem();
        
        // Game Resources
        this.resources = {
            budget: 100,
            documents: 0,
            coffee: 0,
            stress: 0,
            motivation: 50,
            prestige: 0
        };
        
        // Statistics tracking
        this.statistics = {
            totalDocumentsProduced: 0,
            totalCoffeeConsumed: 0,
            maxStressReached: 0,
            totalPlayTime: 0,
            totalClicks: 0,
            eventsTriggered: 0,
            minigamesCompleted: 0,
            tutorialCompleted: false
        };
        
        // Departments system
        this.departments = {
            hr: { owned: 0, unlocked: true },
            it: { owned: 0, unlocked: false },
            marketing: { owned: 0, unlocked: false },
            accounting: { owned: 0, unlocked: false },
            management: { owned: 0, unlocked: false },
            rd: { owned: 0, unlocked: false },
            callcenter: { owned: 0, unlocked: false }
        };
        
        // Achievement system
        this.achievements = {
            tutorial_master: { completed: false, progress: 0 },
            first_department: { completed: false, progress: 0 },
            stress_master: { completed: false, progress: 0 },
            coffee_addict: { completed: false, progress: 0 },
            document_master: { completed: false, progress: 0 },
            minigame_champion: { completed: false, progress: 0 }
        };
        
        // Game state management
        this.gameState = {
            workTime: 9 * 60,
            isWorkHours: true,
            eventCooldown: 0,
            minigameCooldowns: {},
            activeEffects: {},
            startTime: Date.now(),
            paused: false,
            tutorialActive: false,
            tutorialStep: 0
        };
        
        // Tutorial system
        this.tutorial = {
            active: false,
            currentStep: 0,
            completed: false,
            steps: [
                {
                    id: 'welcome',
                    title: 'Witaj w CorpoClicker Enhanced v3.0!',
                    description: 'Kliknij główny przycisk, aby zdobyć budżet na rozwój swojej korporacji',
                    target: '#main-click-button',
                    goal: () => this.resources.budget >= 110
                },
                {
                    id: 'hire_hr', 
                    title: 'Zatrudnij Pierwszy Dział',
                    description: 'Kup Dział HR, aby rozpocząć automatyczną produkcję dokumentów',
                    target: '.department-card[data-dept="hr"] button',
                    goal: () => this.departments.hr.owned >= 1
                },
                {
                    id: 'watch_growth',
                    title: 'Obserwuj Wzrost Zasobów', 
                    description: 'Twój dział HR automatycznie produkuje dokumenty!',
                    target: '#documents',
                    goal: () => this.resources.documents >= 5
                },
                {
                    id: 'play_minigame',
                    title: 'Wypróbuj Mini-grę',
                    description: 'Zagraj w Quarterly Report po dodatkowe zasoby!',
                    target: '.minigame-card[data-game="quarterly_report"] .minigame-play-btn',
                    goal: () => this.tutorial.minigameCompleted
                },
                {
                    id: 'complete',
                    title: 'Tutorial Ukończony!',
                    description: 'Teraz możesz swobodnie rozwijać swoją korporację!',
                    target: 'body',
                    goal: () => true
                }
            ]
        };
        
        // Department data
        this.departmentData = {
            hr: { name: "Dział HR", icon: "👥", baseCost: 10, production: {documents: 1}, sideEffects: {stress: 0.075} },
            it: { name: "Dział IT", icon: "💻", baseCost: 20, production: {coffee: 1}, sideEffects: {motivation: -0.15} },
            marketing: { name: "Marketing", icon: "📈", baseCost: 35, production: {budget: 1, prestige: 0.02} },
            accounting: { name: "Księgowość", icon: "🧮", baseCost: 55, production: {budget: 0.5}, consumption: {budget: 0.1}, sideEffects: {stress: 0.15} },
            management: { name: "Zarząd", icon: "👔", baseCost: 90, production: {motivation: 0.2}, consumption: {documents: 0.5} },
            rd: { name: "R&D", icon: "🔬", baseCost: 150, special: "research_bonuses", sideEffects: {stress: 0.3} },
            callcenter: { name: "Call Center", icon: "📞", baseCost: 300, production: {budget: 5}, sideEffects: {motivation: -0.45, stress: 0.75} }
        };
        
        // Minigame data
        this.minigameData = {
            quarterly_report: {
                name: "Quarterly Report",
                icon: "📊",
                description: "Szybko klikaj, aby ukończyć kwartalny raport!",
                reward: {documents: 42, prestige: 3},
                cooldown: 90000,
                unlocked: () => true
            },
            coffee_shop: {
                name: "Corporate Coffee Shop", 
                icon: "☕",
                description: "Obsługuj zamówienia kawy z perfekcyjnym timingiem!",
                reward: {coffee: 21, stress: -4},
                cooldown: 150000,
                unlocked: () => this.departments.it.owned > 0
            },
            meeting_dodge: {
                name: "Meeting Dodge",
                icon: "🏃",
                description: "Unikaj nudnych spotkań i zachowaj produktywność!",
                reward: {motivation_boost: 14},
                cooldown: 240000,
                unlocked: () => this.resources.stress > 60
            },
            government_contract: {
                name: "Government Contract",
                icon: "🏛️", 
                description: "Wylicytuj lukratywne kontrakty rządowe!",
                reward: {budget: 210},
                cooldown: 360000,
                unlocked: () => this.resources.prestige > 150
            }
        };
        
        // Balance configuration
        this.config = {
            departmentCostScaling: 1.25,
            minigameRewardScaling: 0.7,
            stressSideEffects: 1.5,
            motivationDecay: 1.2,
            workHoursMultiplier: 0.4,
            baseClickValue: 2,
            softcapThresholds: {
                budget: [5000, 25000],
                documents: [500, 2500],
                coffee: [200, 1000]
            }
        };
        
        // Mobile detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.touchSupport = 'ontouchstart' in window;
        
        // Settings
        this.settings = {
            audioEnabled: true,
            musicVolume: 0.3,
            sfxVolume: 0.7,
            tutorialCompleted: false,
            language: 'pl'
        };
        
        // Event log
        this.eventLog = [];
        this.currentTab = 'overview';
        this.currentMinigame = null;
        this.particles = [];
        
        this.init();
    }

    // FIXED: Initialize Audio System
    initializeAudioSystem() {
        try {
            // Initialize Web Audio API
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            
            this.audio = {
                context: null,
                masterGainNode: null,
                musicGainNode: null,
                sfxGainNode: null,
                buffers: {},
                activeSources: [],
                backgroundMusic: null,
                initialized: false
            };
            
            // Create audio context on first user interaction
            this.setupAudioOnUserInteraction();
            
        } catch (error) {
            console.warn('Audio system initialization failed:', error);
            this.settings.audioEnabled = false;
        }
    }
    
    setupAudioOnUserInteraction() {
        const initAudio = () => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audio.context = new AudioContext();
                
                // Create gain nodes
                this.audio.masterGainNode = this.audio.context.createGain();
                this.audio.musicGainNode = this.audio.context.createGain();
                this.audio.sfxGainNode = this.audio.context.createGain();
                
                // Connect nodes
                this.audio.masterGainNode.connect(this.audio.context.destination);
                this.audio.musicGainNode.connect(this.audio.masterGainNode);
                this.audio.sfxGainNode.connect(this.audio.masterGainNode);
                
                // Set volumes
                this.audio.masterGainNode.gain.value = 1;
                this.audio.musicGainNode.gain.value = this.settings.musicVolume;
                this.audio.sfxGainNode.gain.value = this.settings.sfxVolume;
                
                // Generate audio buffers
                this.generateAudioBuffers();
                
                this.audio.initialized = true;
                console.log('Audio system initialized successfully');
                
            } catch (error) {
                console.warn('Audio initialization failed:', error);
                this.settings.audioEnabled = false;
            }
        };
        
        // Initialize on first user interaction
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('touchstart', initAudio, { once: true });
    }
    
    generateAudioBuffers() {
        if (!this.audio.context) return;
        
        // Generate simple tones for different actions
        this.audio.buffers.click = this.generateTone(800, 0.1, 0.3, 'square');
        this.audio.buffers.purchase = this.generateTone(600, 0.3, 0.4, 'triangle');
        this.audio.buffers.success = this.generateTone(1200, 0.5, 0.3, 'sine');
        this.audio.buffers.error = this.generateTone(200, 0.3, 0.4, 'sawtooth');
        this.audio.buffers.achievement = this.generateTone(1000, 0.8, 0.3, 'triangle');
    }
    
    generateTone(frequency, duration, volume = 0.3, waveType = 'sine') {
        if (!this.audio.context) return null;
        
        const sampleRate = this.audio.context.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audio.context.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            switch (waveType) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
                    break;
                case 'sawtooth':
                    sample = 2 * (frequency * t - Math.floor(frequency * t + 0.5));
                    break;
                case 'triangle':
                    sample = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1;
                    break;
            }
            
            // Apply envelope
            const envelope = Math.min(1, Math.min(t * 10, (duration - t) * 10));
            data[i] = sample * volume * envelope;
        }
        
        return buffer;
    }
    
    playSound(soundName, volume = 1.0) {
        if (!this.settings.audioEnabled || !this.audio.initialized || !this.audio.buffers[soundName]) {
            return;
        }
        
        try {
            const source = this.audio.context.createBufferSource();
            const gainNode = this.audio.context.createGain();
            
            source.buffer = this.audio.buffers[soundName];
            source.connect(gainNode);
            gainNode.connect(this.audio.sfxGainNode);
            gainNode.gain.value = volume;
            
            source.start();
            source.onended = () => {
                const index = this.audio.activeSources.indexOf(source);
                if (index > -1) {
                    this.audio.activeSources.splice(index, 1);
                }
            };
            
            this.audio.activeSources.push(source);
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    // Resource management
    addResource(resource, amount) {
        if (amount === 0) return;
        
        const oldValue = this.resources[resource] || 0;
        
        if (resource === 'stress') {
            this.resources[resource] = Math.max(0, Math.min(200, oldValue + amount));
        } else if (resource === 'motivation') {
            this.resources[resource] = Math.max(-50, Math.min(100, oldValue + amount));
        } else {
            this.resources[resource] = Math.max(0, oldValue + amount);
        }
        
        // Apply softcaps
        this.applySoftcaps();
        
        // Update statistics
        if (amount > 0) {
            this.statistics[`total${resource.charAt(0).toUpperCase() + resource.slice(1)}Produced`] = 
                (this.statistics[`total${resource.charAt(0).toUpperCase() + resource.slice(1)}Produced`] || 0) + amount;
        }
        
        // Visual feedback
        this.showResourceChange(resource, amount);
    }
    
    applySoftcaps() {
        Object.entries(this.config.softcapThresholds).forEach(([resource, thresholds]) => {
            if (this.resources[resource] !== undefined) {
                let value = this.resources[resource];
                
                thresholds.forEach(([threshold, reduction]) => {
                    if (value > threshold) {
                        const excess = value - threshold;
                        value = threshold + (excess * reduction);
                    }
                });
                
                this.resources[resource] = value;
            }
        });
    }
    
    showResourceChange(resource, amount) {
        // Simple console log for now - can be enhanced with visual effects
        console.log(`${resource}: ${amount > 0 ? '+' : ''}${amount.toFixed(1)}`);
    }
    
    // Department system
    getDepartmentCost(deptId) {
        const baseData = this.departmentData[deptId];
        if (!baseData) return Infinity;
        
        const owned = this.departments[deptId].owned;
        return Math.floor(baseData.baseCost * Math.pow(this.config.departmentCostScaling, owned));
    }
    
    canAffordDepartment(deptId) {
        return this.resources.budget >= this.getDepartmentCost(deptId);
    }
    
    purchaseDepartment(deptId) {
        const cost = this.getDepartmentCost(deptId);
        
        if (this.canAffordDepartment(deptId)) {
            this.addResource('budget', -cost);
            this.departments[deptId].owned++;
            
            // Play purchase sound
            this.playSound('purchase');
            
            // Check for unlocks
            this.checkDepartmentUnlocks();
            
            // Update achievements
            this.checkAchievements();
            
            return true;
        }
        
        this.playSound('error');
        return false;
    }
    
    checkDepartmentUnlocks() {
        // IT unlocks when documents >= 5
        if (this.resources.documents >= 5) {
            this.departments.it.unlocked = true;
        }
        
        // Marketing unlocks when documents >= 10
        if (this.resources.documents >= 10) {
            this.departments.marketing.unlocked = true;
        }
        
        // Accounting unlocks when documents >= 15
        if (this.resources.documents >= 15) {
            this.departments.accounting.unlocked = true;
        }
        
        // Management unlocks when prestige >= 20
        if (this.resources.prestige >= 20) {
            this.departments.management.unlocked = true;
        }
        
        // R&D unlocks when prestige >= 30
        if (this.resources.prestige >= 30) {
            this.departments.rd.unlocked = true;
        }
        
        // Call Center unlocks when documents >= 50
        if (this.resources.documents >= 50) {
            this.departments.callcenter.unlocked = true;
        }
    }
    
    // Main click action
    performMainClick() {
        this.addResource('budget', this.config.baseClickValue);
        this.statistics.totalClicks++;
        this.playSound('click');
        
        // Tutorial progress
        if (this.tutorial.active && this.tutorial.currentStep === 0) {
            this.checkTutorialProgress();
        }
    }
    
    // Tutorial system
    startTutorial() {
        if (this.settings.tutorialCompleted) return;
        
        this.tutorial.active = true;
        this.tutorial.currentStep = 0;
        this.gameState.tutorialActive = true;
        
        this.showTutorialStep(0);
    }
    
    showTutorialStep(stepIndex) {
        if (stepIndex >= this.tutorial.steps.length) {
            this.completeTutorial();
            return;
        }
        
        const step = this.tutorial.steps[stepIndex];
        this.tutorial.currentStep = stepIndex;
        
        // Show tutorial overlay
        this.createTutorialOverlay(step);
        
        console.log(`Tutorial Step ${stepIndex + 1}: ${step.title}`);
    }
    
    createTutorialOverlay(step) {
        // Remove existing overlay
        const existingOverlay = document.getElementById('tutorialOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Create new overlay
        const overlay = document.createElement('div');
        overlay.id = 'tutorialOverlay';
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-content">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                <div class="tutorial-progress">Krok ${this.tutorial.currentStep + 1} z ${this.tutorial.steps.length}</div>
                <button onclick="game.skipTutorial()" class="tutorial-skip">Pomiń tutorial</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Start checking goal
        this.checkTutorialProgress();
    }
    
    checkTutorialProgress() {
        if (!this.tutorial.active) return;
        
        const currentStep = this.tutorial.steps[this.tutorial.currentStep];
        if (currentStep && currentStep.goal()) {
            setTimeout(() => {
                this.nextTutorialStep();
            }, 1000);
        } else {
            setTimeout(() => this.checkTutorialProgress(), 500);
        }
    }
    
    nextTutorialStep() {
        if (this.tutorial.currentStep < this.tutorial.steps.length - 1) {
            this.showTutorialStep(this.tutorial.currentStep + 1);
        } else {
            this.completeTutorial();
        }
    }
    
    completeTutorial() {
        this.tutorial.active = false;
        this.tutorial.completed = true;
        this.settings.tutorialCompleted = true;
        this.gameState.tutorialActive = false;
        
        // Remove overlay
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Give completion rewards
        this.addResource('budget', 100);
        this.addResource('documents', 50);
        this.addResource('prestige', 10);
        
        // Unlock achievement
        this.unlockAchievement('tutorial_master');
        
        this.playSound('achievement');
        
        console.log('Tutorial completed! Rewards given.');
    }
    
    skipTutorial() {
        if (confirm('Czy na pewno chcesz pominąć tutorial?')) {
            this.completeTutorial();
        }
    }
    
    // Achievement system
    unlockAchievement(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].completed) {
            this.achievements[achievementId].completed = true;
            this.achievements[achievementId].progress = 100;
            
            this.playSound('achievement');
            console.log(`Achievement unlocked: ${achievementId}`);
            
            return true;
        }
        return false;
    }
    
    checkAchievements() {
        // First department
        if (this.getTotalDepartments() >= 1) {
            this.unlockAchievement('first_department');
        }
        
        // Document master
        if (this.resources.documents >= 1000) {
            this.unlockAchievement('document_master');
        }
        
        // Coffee addict
        if (this.resources.coffee >= 100) {
            this.unlockAchievement('coffee_addict');
        }
        
        // Stress master
        if (this.resources.stress >= 150) {
            this.unlockAchievement('stress_master');
        }
        
        // Minigame champion
        if (this.statistics.minigamesCompleted >= 10) {
            this.unlockAchievement('minigame_champion');
        }
    }
    
    getTotalDepartments() {
        return Object.values(this.departments).reduce((sum, dept) => sum + dept.owned, 0);
    }
    
    // Minigame system
    openMinigame(gameId) {
        const gameData = this.minigameData[gameId];
        if (!gameData) return;
        
        // Check if unlocked
        if (!gameData.unlocked()) {
            this.playSound('error');
            console.log('Minigame not unlocked yet');
            return;
        }
        
        // Check cooldown
        const lastPlayed = this.gameState.minigameCooldowns[gameId] || 0;
        const now = Date.now();
        const cooldownRemaining = gameData.cooldown - (now - lastPlayed);
        
        if (cooldownRemaining > 0) {
            this.playSound('error');
            console.log(`Cooldown remaining: ${Math.ceil(cooldownRemaining / 1000)}s`);
            return;
        }
        
        // Start minigame
        this.currentMinigame = gameId;
        this.startMinigame(gameId);
    }
    
    startMinigame(gameId) {
        // Simple minigame implementation for demo
        console.log(`Starting minigame: ${gameId}`);
        
        // For tutorial check
        if (gameId === 'quarterly_report' && this.tutorial.active && this.tutorial.currentStep === 3) {
            this.tutorial.minigameCompleted = true;
        }
        
        // Simulate completion after 2 seconds
        setTimeout(() => {
            this.completeMinigame(gameId, true);
        }, 2000);
    }
    
    completeMinigame(gameId, success) {
        const gameData = this.minigameData[gameId];
        if (!gameData) return;
        
        if (success) {
            // Apply rewards
            Object.entries(gameData.reward).forEach(([resource, amount]) => {
                if (resource === 'motivation_boost') {
                    this.gameState.activeEffects.motivationBoost = Date.now() + (amount * 1000);
                } else {
                    this.addResource(resource, amount);
                }
            });
            
            this.playSound('success');
            this.statistics.minigamesCompleted++;
        } else {
            this.playSound('error');
        }
        
        // Set cooldown
        this.gameState.minigameCooldowns[gameId] = Date.now();
        this.currentMinigame = null;
        
        this.checkTutorialProgress();
        this.checkAchievements();
    }
    
    // Game loop
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - (this.gameState.lastUpdate || now);
        this.gameState.lastUpdate = now;
        const deltaSeconds = deltaTime / 1000;
        
        if (this.gameState.paused) return;
        
        // Update work time
        this.updateWorkTime(deltaSeconds);
        
        // Department production
        this.updateProduction(deltaSeconds);
        
        // Apply side effects
        this.applySideEffects(deltaSeconds);
        
        // Check active effects
        this.updateActiveEffects(now);
        
        // Update display
        this.updateDisplay();
        
        // Check achievements
        this.checkAchievements();
    }
    
    updateWorkTime(deltaSeconds) {
        this.gameState.workTime += deltaSeconds / 60; // Convert to minutes
        
        // Work day is 8 hours (9 AM to 5 PM)
        const workMinutes = this.gameState.workTime % (24 * 60);
        this.gameState.isWorkHours = workMinutes >= (9 * 60) && workMinutes < (17 * 60);
    }
    
    updateProduction(deltaSeconds) {
        let productionMultiplier = 1.0;
        
        // Work hours effect
        if (!this.gameState.isWorkHours) {
            productionMultiplier *= this.config.workHoursMultiplier;
        }
        
        // Stress penalty
        if (this.resources.stress > 50) {
            const stressPenalty = (this.resources.stress - 50) * 0.02;
            productionMultiplier *= Math.max(0.1, 1 - stressPenalty);
        }
        
        // Motivation bonus
        if (this.resources.motivation > 50) {
            const motivationBonus = (this.resources.motivation - 50) * 0.015;
            productionMultiplier *= (1 + motivationBonus);
        }
        
        // Motivation boost effect
        if (this.gameState.activeEffects.motivationBoost > Date.now()) {
            productionMultiplier *= 1.5;
        }
        
        // Apply production from departments
        Object.entries(this.departments).forEach(([deptId, dept]) => {
            if (dept.owned === 0) return;
            
            const deptData = this.departmentData[deptId];
            if (!deptData || !deptData.production) return;
            
            Object.entries(deptData.production).forEach(([resource, rate]) => {
                const production = rate * dept.owned * productionMultiplier * deltaSeconds;
                this.addResource(resource, production);
            });
        });
    }
    
    applySideEffects(deltaSeconds) {
        Object.entries(this.departments).forEach(([deptId, dept]) => {
            if (dept.owned === 0) return;
            
            const deptData = this.departmentData[deptId];
            if (!deptData || !deptData.sideEffects) return;
            
            Object.entries(deptData.sideEffects).forEach(([resource, rate]) => {
                const effect = rate * dept.owned * this.config.stressSideEffects * deltaSeconds;
                this.addResource(resource, effect);
            });
        });
        
        // Natural motivation recovery
        if (this.resources.motivation < 50) {
            this.addResource('motivation', 0.1 * deltaSeconds);
        } else if (this.resources.motivation > 50) {
            this.addResource('motivation', -0.3 * this.config.motivationDecay * deltaSeconds);
        }
        
        // Stress natural decay
        this.addResource('stress', -0.5 * deltaSeconds);
    }
    
    updateActiveEffects(now) {
        // Clean up expired effects
        Object.keys(this.gameState.activeEffects).forEach(effectId => {
            if (this.gameState.activeEffects[effectId] < now) {
                delete this.gameState.activeEffects[effectId];
            }
        });
    }
    
    // Display updates
    updateDisplay() {
        // Update resource displays
        Object.keys(this.resources).forEach(resource => {
            const element = document.getElementById(resource);
            if (element) {
                element.textContent = this.formatNumber(this.resources[resource]);
            }
        });
        
        // Update work time
        const workTimeElement = document.getElementById('workTime');
        if (workTimeElement) {
            const hours = Math.floor(this.gameState.workTime / 60) % 24;
            const minutes = Math.floor(this.gameState.workTime % 60);
            workTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        
        // Update department displays
        this.updateDepartmentDisplay();
        
        // Update minigame displays
        this.updateMinigameDisplay();
        
        // Update progress bars
        this.updateProgressBars();
    }
    
    updateDepartmentDisplay() {
        Object.keys(this.departments).forEach(deptId => {
            const dept = this.departments[deptId];
            const deptData = this.departmentData[deptId];
            
            const card = document.querySelector(`[data-dept="${deptId}"]`);
            if (!card) return;
            
            const button = card.querySelector('button');
            const countElement = card.querySelector('.department-count');
            const costElement = card.querySelector('.department-cost');
            
            if (countElement) {
                countElement.textContent = dept.owned;
            }
            
            if (costElement) {
                costElement.textContent = this.formatNumber(this.getDepartmentCost(deptId));
            }
            
            if (button) {
                button.disabled = !this.canAffordDepartment(deptId);
                button.style.display = dept.unlocked ? 'block' : 'none';
            }
            
            card.style.display = dept.unlocked ? 'block' : 'none';
        });
    }
    
    updateMinigameDisplay() {
        Object.keys(this.minigameData).forEach(gameId => {
            const gameData = this.minigameData[gameId];
            const card = document.querySelector(`[data-game="${gameId}"]`);
            if (!card) return;
            
            const button = card.querySelector('.minigame-play-btn');
            const isUnlocked = gameData.unlocked();
            const lastPlayed = this.gameState.minigameCooldowns[gameId] || 0;
            const cooldownRemaining = gameData.cooldown - (Date.now() - lastPlayed);
            const onCooldown = cooldownRemaining > 0;
            
            if (button) {
                button.disabled = !isUnlocked || onCooldown;
                
                if (onCooldown) {
                    button.textContent = `${Math.ceil(cooldownRemaining / 1000)}s`;
                } else if (isUnlocked) {
                    button.textContent = 'Graj';
                } else {
                    button.textContent = 'Zablokowane';
                }
            }
            
            card.style.display = isUnlocked ? 'block' : 'none';
        });
    }
    
    updateProgressBars() {
        // Stress bar
        const stressBar = document.getElementById('stress-progress');
        if (stressBar) {
            const stressPercent = (this.resources.stress / 200) * 100;
            stressBar.style.width = `${Math.min(stressPercent, 100)}%`;
        }
        
        // Motivation bar
        const motivationBar = document.getElementById('motivation-progress');
        if (motivationBar) {
            const motivationPercent = ((this.resources.motivation + 50) / 150) * 100;
            motivationBar.style.width = `${Math.max(0, Math.min(motivationPercent, 100))}%`;
        }
    }
    
    // Utility functions
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }
    
    // Save/Load system
    saveGame() {
        const saveData = {
            version: this.version,
            resources: this.resources,
            departments: this.departments,
            achievements: this.achievements,
            statistics: this.statistics,
            gameState: {
                ...this.gameState,
                startTime: Date.now() - (Date.now() - this.gameState.startTime) // Preserve session time
            },
            settings: this.settings,
            timestamp: Date.now()
        };
        
        localStorage.setItem('corpoclicker_save', JSON.stringify(saveData));
    }
    
    loadGame() {
        try {
            const saved = localStorage.getItem('corpoclicker_save');
            if (saved) {
                const saveData = JSON.parse(saved);
                
                this.resources = { ...this.resources, ...saveData.resources };
                this.departments = { ...this.departments, ...saveData.departments };
                this.achievements = { ...this.achievements, ...saveData.achievements };
                this.statistics = { ...this.statistics, ...saveData.statistics };
                this.gameState = { ...this.gameState, ...saveData.gameState };
                this.settings = { ...this.settings, ...saveData.settings };
                
                return true;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
        return false;
    }
    
    resetGame() {
        if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone!')) {
            localStorage.removeItem('corpoclicker_save');
            window.location.reload();
        }
    }
    
    // Event handlers
    setupEventHandlers() {
        // Main click button
        const mainButton = document.getElementById('main-click-button');
        if (mainButton) {
            mainButton.addEventListener('click', () => this.performMainClick());
        }
        
        // Department buttons
        document.querySelectorAll('[data-dept]').forEach(card => {
            const deptId = card.dataset.dept;
            const button = card.querySelector('button');
            if (button) {
                button.addEventListener('click', () => this.purchaseDepartment(deptId));
            }
        });
        
        // Minigame buttons
        document.querySelectorAll('[data-game]').forEach(card => {
            const gameId = card.dataset.game;
            const button = card.querySelector('.minigame-play-btn');
            if (button) {
                button.addEventListener('click', () => this.openMinigame(gameId));
            }
        });
        
        // Tab switching
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // Settings button
        const settingsBtn = document.getElementById('settings-button');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update tab buttons
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
    }
    
    showSettings() {
        // Simple settings dialog for now
        const audioEnabled = confirm('Czy chcesz włączyć dźwięki?');
        this.settings.audioEnabled = audioEnabled;
        this.saveGame();
    }
    
    // Initialization
    init() {
        // Load saved game
        this.loadGame();
        
        // Setup event handlers
        this.setupEventHandlers();
        
        // Start game loop
        setInterval(() => this.gameLoop(), 100);
        
        // Auto-save every 30 seconds
        setInterval(() => this.saveGame(), 30000);
        
        // Start tutorial for new players
        if (!this.settings.tutorialCompleted) {
            setTimeout(() => this.startTutorial(), 1000);
        }
        
        console.log('CorpoClicker Enhanced v3.0 initialized successfully!');
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CorpoClickerGame();
});