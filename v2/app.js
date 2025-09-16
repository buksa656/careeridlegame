// CorpoClicker Enhanced v3.0 - WORKING VERSION - Based on Phase 2
// Fixed tutorial system that doesn't break the game

class CorpoClickerGame {
    constructor() {
        this.version = "3.0.1-working";
        
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
            tutorialCompleted: false,
            sessionStartTime: Date.now()
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
            workTime: 9 * 60, // 9:00 AM start
            isWorkHours: true,
            eventCooldown: 0,
            minigameCooldowns: {},
            activeEffects: {},
            startTime: Date.now(),
            paused: false,
            lastUpdate: Date.now()
        };
        
        // Department data with balanced costs
        this.departmentData = {
            hr: { 
                name: "Dział HR", 
                icon: "👥", 
                baseCost: 10, 
                production: {documents: 1}, 
                sideEffects: {stress: 0.075},
                description: "Produkuje dokumenty, ale zwiększa stres"
            },
            it: { 
                name: "Dział IT", 
                icon: "💻", 
                baseCost: 20, 
                production: {coffee: 1}, 
                sideEffects: {motivation: -0.15},
                description: "Produkuje kawę, ale zmniejsza motywację"
            },
            marketing: { 
                name: "Marketing", 
                icon: "📈", 
                baseCost: 35, 
                production: {budget: 1, prestige: 0.02},
                description: "Produkuje budżet i prestiż"
            },
            accounting: { 
                name: "Księgowość", 
                icon: "🧮", 
                baseCost: 55, 
                production: {budget: 0.5}, 
                consumption: {budget: 0.1}, 
                sideEffects: {stress: 0.15},
                description: "Produkuje budżet, ale kosztuje i zwiększa stres"
            },
            management: { 
                name: "Zarząd", 
                icon: "👔", 
                baseCost: 90, 
                production: {motivation: 0.2}, 
                consumption: {documents: 0.5},
                description: "Zwiększa motywację, ale zużywa dokumenty"
            },
            rd: { 
                name: "R&D", 
                icon: "🔬", 
                baseCost: 150, 
                special: "research_bonuses", 
                sideEffects: {stress: 0.3},
                description: "Daje bonusy research, ale zwiększa stres"
            },
            callcenter: { 
                name: "Call Center", 
                icon: "📞", 
                baseCost: 300, 
                production: {budget: 5}, 
                sideEffects: {motivation: -0.45, stress: 0.75},
                description: "Wysoka produkcja budżetu, ale duży stres"
            }
        };
        
        // Minigame data with balanced rewards
        this.minigameData = {
            quarterly_report: {
                name: "Quarterly Report",
                icon: "📊",
                description: "Szybko klikaj aby ukończyć kwartalny raport!",
                reward: {documents: 42, prestige: 3},
                cooldown: 90000, // 90 seconds
                unlocked: () => true
            },
            coffee_shop: {
                name: "Corporate Coffee Shop", 
                icon: "☕",
                description: "Obsługuj zamówienia kawy z perfekcyjnym timingiem!",
                reward: {coffee: 21, stress: -4},
                cooldown: 150000, // 150 seconds
                unlocked: () => this.departments.it.owned > 0
            },
            meeting_dodge: {
                name: "Meeting Dodge",
                icon: "🏃",
                description: "Unikaj nudnych spotkań i zachowaj produktywność!",
                reward: {motivation_boost: 14},
                cooldown: 240000, // 240 seconds
                unlocked: () => this.resources.stress > 60
            },
            government_contract: {
                name: "Government Contract",
                icon: "🏛️", 
                description: "Wylicytuj lukratywne kontrakty rządowe!",
                reward: {budget: 210},
                cooldown: 360000, // 360 seconds
                unlocked: () => this.resources.prestige > 150
            }
        };
        
        // Balance configuration from Phase 2
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
        
        // Tutorial system - SIMPLIFIED to prevent blocking
        this.tutorial = {
            active: false,
            enabled: false, // Disabled by default to prevent blocking
            completed: localStorage.getItem('corpoclicker_tutorial_completed') === 'true',
            currentStep: 0
        };
        
        // Mobile detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Settings
        this.settings = {
            audioEnabled: true,
            musicVolume: 0.3,
            sfxVolume: 0.7,
            tutorialEnabled: false, // Tutorial disabled by default
            language: 'pl'
        };
        
        // Initialize audio system safely
        this.initializeAudioSystem();
        
        // Current minigame
        this.currentMinigame = null;
        this.currentTab = 'overview';
        
        // Particles system
        this.particles = [];
        this.particleCanvas = null;
        this.particleCtx = null;
        
        this.init();
    }

    // SAFE Audio System - won't break if it fails
    initializeAudioSystem() {
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
        
        // Try to initialize, but don't break if it fails
        this.setupAudioOnUserInteraction();
    }
    
    setupAudioOnUserInteraction() {
        const initAudio = () => {
            try {
                if (!this.settings.audioEnabled) return;
                
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                
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
                
                // Generate simple audio buffers
                this.generateAudioBuffers();
                
                this.audio.initialized = true;
                console.log('Audio system initialized successfully');
                
            } catch (error) {
                console.log('Audio initialization failed (non-critical):', error);
                this.settings.audioEnabled = false;
            }
        };
        
        // Initialize on first user interaction
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('touchstart', initAudio, { once: true });
    }
    
    generateAudioBuffers() {
        if (!this.audio.context) return;
        
        try {
            // Generate simple tones
            this.audio.buffers.click = this.generateTone(800, 0.1, 0.3);
            this.audio.buffers.purchase = this.generateTone(600, 0.3, 0.4);
            this.audio.buffers.success = this.generateTone(1200, 0.5, 0.3);
            this.audio.buffers.error = this.generateTone(200, 0.3, 0.4);
            this.audio.buffers.achievement = this.generateTone(1000, 0.8, 0.3);
        } catch (error) {
            console.log('Audio buffer generation failed (non-critical):', error);
        }
    }
    
    generateTone(frequency, duration, volume = 0.3) {
        if (!this.audio.context) return null;
        
        try {
            const sampleRate = this.audio.context.sampleRate;
            const length = sampleRate * duration;
            const buffer = this.audio.context.createBuffer(1, length, sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < length; i++) {
                const t = i / sampleRate;
                const sample = Math.sin(2 * Math.PI * frequency * t);
                const envelope = Math.min(1, Math.min(t * 10, (duration - t) * 10));
                data[i] = sample * volume * envelope;
            }
            
            return buffer;
        } catch (error) {
            console.log('Tone generation failed (non-critical):', error);
            return null;
        }
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
            
            // Clean up after playing
            source.onended = () => {
                const index = this.audio.activeSources.indexOf(source);
                if (index > -1) {
                    this.audio.activeSources.splice(index, 1);
                }
            };
            
            this.audio.activeSources.push(source);
        } catch (error) {
            console.log('Sound playback failed (non-critical):', error);
        }
    }

    // Resource management with softcaps
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
            const statKey = `total${resource.charAt(0).toUpperCase() + resource.slice(1)}Produced`;
            if (this.statistics[statKey] !== undefined) {
                this.statistics[statKey] += amount;
            }
        }
    }
    
    applySoftcaps() {
        Object.entries(this.config.softcapThresholds).forEach(([resource, thresholds]) => {
            if (this.resources[resource] !== undefined) {
                let value = this.resources[resource];
                
                // Apply multiple softcap levels
                if (value > thresholds[0]) {
                    const excess1 = value - thresholds[0];
                    value = thresholds[0] + (excess1 * 0.8);
                    
                    if (value > thresholds[1]) {
                        const excess2 = value - thresholds[1];
                        value = thresholds[1] + (excess2 * 0.5);
                    }
                }
                
                this.resources[resource] = value;
            }
        });
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
            
            // Create particle effect if canvas exists
            this.createPurchaseParticles(deptId);
            
            // Check for unlocks
            this.checkDepartmentUnlocks();
            
            // Update achievements
            this.checkAchievements();
            
            console.log(`Purchased ${deptId} for ${cost} budget`);
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
    
    createPurchaseParticles(deptId) {
        // Simple particle effect - can be enhanced
        console.log(`✨ Purchase particles for ${deptId}`);
        
        // If particle system is available, create visual effect
        if (this.particleCtx) {
            for (let i = 0; i < 10; i++) {
                this.particles.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 60,
                    maxLife: 60,
                    color: '#2196F3'
                });
            }
        }
    }
    
    // Main click action
    performMainClick() {
        this.addResource('budget', this.config.baseClickValue);
        this.statistics.totalClicks++;
        this.playSound('click');
        
        console.log(`Main click: +${this.config.baseClickValue} budget`);
    }
    
    // Achievement system
    unlockAchievement(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].completed) {
            this.achievements[achievementId].completed = true;
            this.achievements[achievementId].progress = 100;
            
            this.playSound('achievement');
            
            console.log(`🏆 Achievement unlocked: ${achievementId}`);
            this.showNotification(`🏆 Achievement: ${achievementId}`);
            
            return true;
        }
        return false;
    }
    
    checkAchievements() {
        // First department
        if (this.getTotalDepartments() >= 1 && !this.achievements.first_department.completed) {
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
    
    // Minigame system - simplified but working
    openMinigame(gameId) {
        const gameData = this.minigameData[gameId];
        if (!gameData) return;
        
        // Check if unlocked
        if (!gameData.unlocked()) {
            this.playSound('error');
            this.showNotification('Mini-gra jeszcze nie odblokowana!');
            return;
        }
        
        // Check cooldown
        const lastPlayed = this.gameState.minigameCooldowns[gameId] || 0;
        const now = Date.now();
        const cooldownRemaining = gameData.cooldown - (now - lastPlayed);
        
        if (cooldownRemaining > 0) {
            this.playSound('error');
            const secondsRemaining = Math.ceil(cooldownRemaining / 1000);
            this.showNotification(`Cooldown: ${secondsRemaining}s`);
            return;
        }
        
        // Start minigame
        this.currentMinigame = gameId;
        this.startMinigame(gameId);
    }
    
    startMinigame(gameId) {
        console.log(`🎮 Starting minigame: ${gameId}`);
        this.showNotification(`🎮 ${this.minigameData[gameId].name} - Naciśnij SPACE!`);
        
        // Simple minigame - just wait for spacebar or auto-complete after 3 seconds
        let completed = false;
        
        const completeGame = (success) => {
            if (completed) return;
            completed = true;
            
            document.removeEventListener('keydown', keyHandler);
            this.completeMinigame(gameId, success);
        };
        
        const keyHandler = (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                completeGame(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                completeGame(false);
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        
        // Auto-complete after 5 seconds if no input
        setTimeout(() => {
            completeGame(Math.random() > 0.3); // 70% success rate
        }, 5000);
    }
    
    completeMinigame(gameId, success) {
        const gameData = this.minigameData[gameId];
        if (!gameData) return;
        
        if (success) {
            // Apply rewards
            Object.entries(gameData.reward).forEach(([resource, amount]) => {
                if (resource === 'motivation_boost') {
                    this.gameState.activeEffects.motivationBoost = Date.now() + (amount * 1000);
                    this.showNotification(`💪 Motivation boost: +${amount}s`);
                } else {
                    this.addResource(resource, amount);
                }
            });
            
            this.playSound('success');
            this.statistics.minigamesCompleted++;
            
            console.log(`✅ Minigame ${gameId} completed successfully!`);
        } else {
            this.playSound('error');
            console.log(`❌ Minigame ${gameId} failed`);
        }
        
        // Set cooldown
        this.gameState.minigameCooldowns[gameId] = Date.now();
        this.currentMinigame = null;
        
        this.checkAchievements();
    }
    
    // Notification system
    showNotification(message) {
        console.log(`📢 ${message}`);
        
        // Create visual notification if possible
        try {
            const notification = document.createElement('div');
            notification.className = 'game-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #21808d;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.parentElement.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        } catch (error) {
            console.log('Visual notification failed (non-critical)');
        }
    }
    
    // Game loop
    gameLoop() {
        if (this.gameState.paused) return;
        
        const now = Date.now();
        const deltaTime = now - this.gameState.lastUpdate;
        this.gameState.lastUpdate = now;
        const deltaSeconds = deltaTime / 1000;
        
        // Update work time
        this.updateWorkTime(deltaSeconds);
        
        // Department production
        this.updateProduction(deltaSeconds);
        
        // Apply side effects
        this.applySideEffects(deltaSeconds);
        
        // Update active effects
        this.updateActiveEffects(now);
        
        // Update display
        this.updateDisplay();
        
        // Check achievements
        this.checkAchievements();
        
        // Update statistics
        this.statistics.totalPlayTime = now - this.statistics.sessionStartTime;
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
        if (this.gameState.activeEffects.motivationBoost && 
            this.gameState.activeEffects.motivationBoost > Date.now()) {
            productionMultiplier *= 1.3;
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
        // Department side effects
        Object.entries(this.departments).forEach(([deptId, dept]) => {
            if (dept.owned === 0) return;
            
            const deptData = this.departmentData[deptId];
            if (!deptData || !deptData.sideEffects) return;
            
            Object.entries(deptData.sideEffects).forEach(([resource, rate]) => {
                const effect = rate * dept.owned * this.config.stressSideEffects * deltaSeconds;
                this.addResource(resource, effect);
            });
        });
        
        // Natural motivation changes
        if (this.resources.motivation < 50) {
            this.addResource('motivation', 0.1 * deltaSeconds);
        } else if (this.resources.motivation > 50) {
            this.addResource('motivation', -0.3 * this.config.motivationDecay * deltaSeconds);
        }
        
        // Stress natural decay
        if (this.resources.stress > 0) {
            this.addResource('stress', -0.5 * deltaSeconds);
        }
        
        // Coffee reduces stress
        if (this.resources.coffee > 0 && this.resources.stress > 0) {
            const stressReduction = Math.min(this.resources.coffee * 0.1 * deltaSeconds, this.resources.stress);
            this.addResource('stress', -stressReduction);
            this.addResource('coffee', -stressReduction / 0.1);
        }
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
        
        // Update work time display
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
                const canAfford = this.canAffordDepartment(deptId);
                button.disabled = !canAfford;
                button.classList.toggle('affordable', canAfford);
                button.classList.toggle('expensive', !canAfford);
            }
            
            // Show/hide based on unlock status
            card.style.display = dept.unlocked ? 'block' : 'none';
        });
    }
    
    updateMinigameDisplay() {
        Object.keys(this.minigameData).forEach(gameId => {
            const gameData = this.minigameData[gameId];
            const card = document.querySelector(`[data-game="${gameId}"]`);
            if (!card) return;
            
            const button = card.querySelector('.minigame-play-btn');
            if (!button) return;
            
            const isUnlocked = gameData.unlocked();
            const lastPlayed = this.gameState.minigameCooldowns[gameId] || 0;
            const cooldownRemaining = gameData.cooldown - (Date.now() - lastPlayed);
            const onCooldown = cooldownRemaining > 0;
            
            button.disabled = !isUnlocked || onCooldown;
            
            if (onCooldown) {
                const secondsRemaining = Math.ceil(cooldownRemaining / 1000);
                button.textContent = `${secondsRemaining}s`;
                button.classList.add('on-cooldown');
            } else if (isUnlocked) {
                button.textContent = 'Graj';
                button.classList.remove('on-cooldown');
                button.classList.add('ready');
            } else {
                button.textContent = 'Zablokowane';
                button.classList.add('locked');
            }
            
            // Show/hide minigame card
            card.style.display = isUnlocked ? 'block' : 'none';
        });
    }
    
    updateProgressBars() {
        // Stress bar (red when high)
        const stressBar = document.getElementById('stress-progress');
        if (stressBar) {
            const stressPercent = Math.min((this.resources.stress / 200) * 100, 100);
            stressBar.style.width = `${stressPercent}%`;
            
            // Color coding
            if (stressPercent < 25) {
                stressBar.className = 'progress-fill progress-low';
            } else if (stressPercent < 50) {
                stressBar.className = 'progress-fill progress-medium';
            } else {
                stressBar.className = 'progress-fill progress-high';
            }
        }
        
        // Motivation bar (green when high)
        const motivationBar = document.getElementById('motivation-progress');
        if (motivationBar) {
            const motivationPercent = Math.max(0, ((this.resources.motivation + 50) / 150) * 100);
            motivationBar.style.width = `${Math.min(motivationPercent, 100)}%`;
            
            // Color coding
            if (motivationPercent > 70) {
                motivationBar.className = 'progress-fill progress-excellent';
            } else if (motivationPercent > 50) {
                motivationBar.className = 'progress-fill progress-good';
            } else {
                motivationBar.className = 'progress-fill progress-poor';
            }
        }
    }
    
    // Utility functions
    formatNumber(num) {
        if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }
    
    // Save/Load system
    saveGame() {
        try {
            const saveData = {
                version: this.version,
                resources: this.resources,
                departments: this.departments,
                achievements: this.achievements,
                statistics: this.statistics,
                gameState: {
                    ...this.gameState,
                    // Preserve session time
                    startTime: Date.now() - (this.statistics.totalPlayTime || 0)
                },
                settings: this.settings,
                timestamp: Date.now()
            };
            
            localStorage.setItem('corpoclicker_save', JSON.stringify(saveData));
            console.log('Game saved successfully');
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }
    
    loadGame() {
        try {
            const saved = localStorage.getItem('corpoclicker_save');
            if (saved) {
                const saveData = JSON.parse(saved);
                
                // Load data with fallbacks
                this.resources = { ...this.resources, ...saveData.resources };
                this.departments = { ...this.departments, ...saveData.departments };
                this.achievements = { ...this.achievements, ...saveData.achievements };
                this.statistics = { ...this.statistics, ...saveData.statistics };
                this.gameState = { ...this.gameState, ...saveData.gameState };
                this.settings = { ...this.settings, ...saveData.settings };
                
                console.log('Game loaded successfully');
                return true;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
        return false;
    }
    
    // SAFE Tutorial System - won't break the game
    showWelcomeMessage() {
        // Simple welcome message that doesn't block the interface
        if (!this.tutorial.completed) {
            setTimeout(() => {
                this.showNotification('🎉 Witaj w CorpoClicker Enhanced v3.0!');
                
                setTimeout(() => {
                    this.showNotification('💡 Tip: Kliknij główny przycisk aby zdobyć budżet');
                }, 2000);
                
                setTimeout(() => {
                    this.showNotification('🏢 Kupuj działy aby automatyzować produkcję');
                }, 4000);
                
                setTimeout(() => {
                    this.showNotification('🎮 Mini-gry dają bonusowe nagrody!');
                }, 6000);
                
                // Mark tutorial as completed to prevent spam
                this.tutorial.completed = true;
                localStorage.setItem('corpoclicker_tutorial_completed', 'true');
            }, 1000);
        }
    }
    
    // Event handlers
    setupEventHandlers() {
        try {
            // Main click button
            const mainButton = document.getElementById('main-click-button');
            if (mainButton) {
                mainButton.addEventListener('click', () => this.performMainClick());
                console.log('Main click button handler attached');
            }
            
            // Department buttons
            document.querySelectorAll('[data-dept]').forEach(card => {
                const deptId = card.dataset.dept;
                const button = card.querySelector('button');
                if (button) {
                    button.addEventListener('click', () => this.purchaseDepartment(deptId));
                }
            });
            console.log('Department button handlers attached');
            
            // Minigame buttons
            document.querySelectorAll('[data-game]').forEach(card => {
                const gameId = card.dataset.game;
                const button = card.querySelector('.minigame-play-btn, button');
                if (button) {
                    button.addEventListener('click', () => this.openMinigame(gameId));
                }
            });
            console.log('Minigame button handlers attached');
            
            // Tab switching
            document.querySelectorAll('[data-tab]').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabId = e.target.dataset.tab;
                    this.switchTab(tabId);
                });
            });
            console.log('Tab handlers attached');
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && !this.currentMinigame) {
                    e.preventDefault();
                    this.performMainClick();
                }
            });
            
        } catch (error) {
            console.error('Error setting up event handlers:', error);
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
        
        console.log(`Switched to tab: ${tabId}`);
    }
    
    // Initialize particle system safely
    initializeParticleSystem() {
        try {
            // Only create if canvas element exists
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            this.particleCanvas = canvas;
            this.particleCtx = canvas.getContext('2d');
            
            // Add to page
            document.body.appendChild(canvas);
            
            // Start particle update loop
            this.updateParticles();
            
            console.log('Particle system initialized');
        } catch (error) {
            console.log('Particle system initialization failed (non-critical)');
        }
    }
    
    updateParticles() {
        if (!this.particleCtx) return;
        
        try {
            // Clear canvas
            this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
            
            // Update and draw particles
            this.particles = this.particles.filter(particle => {
                particle.life--;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravity
                
                // Draw particle
                const alpha = particle.life / particle.maxLife;
                this.particleCtx.save();
                this.particleCtx.globalAlpha = alpha;
                this.particleCtx.fillStyle = particle.color;
                this.particleCtx.beginPath();
                this.particleCtx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                this.particleCtx.fill();
                this.particleCtx.restore();
                
                return particle.life > 0;
            });
            
            // Continue animation loop
            requestAnimationFrame(() => this.updateParticles());
        } catch (error) {
            console.log('Particle update error (non-critical)');
        }
    }
    
    // Reset game
    resetGame() {
        if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone!')) {
            try {
                localStorage.removeItem('corpoclicker_save');
                localStorage.removeItem('corpoclicker_tutorial_completed');
                console.log('Game reset');
                window.location.reload();
            } catch (error) {
                console.error('Reset failed:', error);
            }
        }
    }
    
    // Initialization
    init() {
        console.log('Initializing CorpoClicker Enhanced v3.0.1-working...');
        
        // Load saved game
        this.loadGame();
        
        // Setup event handlers
        this.setupEventHandlers();
        
        // Initialize particle system
        this.initializeParticleSystem();
        
        // Start game loop
        setInterval(() => this.gameLoop(), 100);
        
        // Auto-save every 30 seconds
        setInterval(() => this.saveGame(), 30000);
        
        // Show welcome messages (non-blocking)
        this.showWelcomeMessage();
        
        // Force initial display update
        setTimeout(() => this.updateDisplay(), 100);
        
        console.log('✅ CorpoClicker Enhanced v3.0.1-working initialized successfully!');
        console.log('🎮 Game is ready to play - no tutorial blocking!');
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting game...');
    try {
        window.game = new CorpoClickerGame();
    } catch (error) {
        console.error('Game initialization failed:', error);
        alert('Błąd podczas inicjalizacji gry. Sprawdź konsolę developera.');
    }
});