// Main Game Initialization
class CorporateRatIdle {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        try {
            console.log(`🐭 Corporate Rat Idle v${this.version} - Starting...`);
            
            // Initialize systems in order
            this.initializeErrorHandling();
            this.validateDependencies();
            this.showLoadingScreen();
            
            // Small delay to show loading screen
            setTimeout(() => {
                this.initializeGame();
            }, 500);
            
        } catch (error) {
            this.handleCriticalError(error);
        }
    }
    
    initializeErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('A promise was rejected. The game might not work correctly.');
        });
    }
    
    validateDependencies() {
        const requiredGlobals = ['GameData', 'GameState', 'GameLogic', 'UIManager', 'Lang'];
        const missing = requiredGlobals.filter(dep => !window[dep]);
        
        if (missing.length > 0) {
            throw new Error(`Missing dependencies: ${missing.join(', ')}`);
        }
    }
    
    showLoadingScreen() {
        const loadingHTML = `
            <div id="loading-screen" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                color: white;
                font-family: 'Inter', sans-serif;
            ">
                <div style="font-size: 3em; margin-bottom: 20px;">🐭</div>
                <h1 style="font-size: 2.5em; margin-bottom: 10px; font-weight: 700;">Corporate Rat Idle</h1>
                <p style="font-size: 1.2em; opacity: 0.9; margin-bottom: 30px;">Climbing the corporate ladder, one click at a time</p>
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }
    
    initializeGame() {
        try {
            console.log('🔧 Initializing game systems...');
            
            // All systems are already initialized through their constructors
            // We just need to ensure everything is connected properly
            
            // Verify game state loaded correctly
            if (!GameState.state) {
                throw new Error('Game state failed to initialize');
            }
            
            // Start the game
            this.startGame();
            
        } catch (error) {
            this.handleCriticalError(error);
        }
    }
    
    startGame() {
        console.log('🎮 Starting game...');
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Mark as initialized
        this.initialized = true;
        
        // Show welcome message for new players
        if (GameState.totalOfficePoints === 0) {
            this.showWelcomeMessage();
        }
        
        // Log successful startup
        console.log('✅ Corporate Rat Idle started successfully!');
        
        // Development helpers
        if (this.isDevelopmentMode()) {
            this.setupDevelopmentHelpers();
        }
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            const message = `Welcome to Corporate Rat Idle! 🐭\n\nClick on tasks to earn office points and start your corporate journey. Your goal is to climb the corporate ladder and eventually reach infinity!\n\nTip: Tasks will automatically progress once you click them for the first time.`;
            
            GameState.showNotification('success', 'Welcome to Corporate Rat Idle! Click tasks to start earning points.');
        }, 1000);
    }
    
    isDevelopmentMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('dev=true');
    }
    
    setupDevelopmentHelpers() {
        console.log('🔧 Development mode enabled');
        
        // Add global helpers for debugging
        window.DevTools = {
            giveOfficePoints: (amount) => {
                GameState.addOfficePoints(amount);
                console.log(`Added ${amount} office points`);
            },
            
            giveInfinityPoints: (amount) => {
                GameState.addInfinityPoints(amount);
                console.log(`Added ${amount} infinity points`);
            },
            
            unlockAllTasks: () => {
                Object.keys(GameState.tasks).forEach(taskId => {
                    GameState.unlockTask(taskId);
                });
                UIManager.refreshCurrentTab();
                console.log('Unlocked all tasks');
            },
            
            completeAllAchievements: () => {
                Object.keys(GameState.achievements).forEach(achievementId => {
                    const state = GameState.achievements[achievementId];
                    if (!state.unlocked) {
                        state.unlocked = true;
                        state.unlockedAt = Date.now();
                    }
                });
                UIManager.refreshCurrentTab();
                console.log('Completed all achievements');
            },
            
            simulateOfflineTime: (hours) => {
                const ms = hours * 3600 * 1000;
                const gain = GameState.calculateOfflineGain(ms);
                GameState.addOfficePoints(gain);
                console.log(`Simulated ${hours} hours offline, gained ${gain} points`);
            },
            
            resetProgress: () => {
                if (confirm('Reset all progress? This cannot be undone.')) {
                    localStorage.removeItem('corporateRatIdle_save');
                    location.reload();
                }
            },
            
            exportState: () => {
                console.log('Current game state:', JSON.stringify(GameState.state, null, 2));
            },
            
            getStats: () => {
                return {
                    officePoints: GameState.officePoints,
                    infinityPoints: GameState.infinityPoints,
                    infinities: GameState.infinities,
                    stats: GameState.stats,
                    tasksUnlocked: Object.values(GameState.tasks).filter(t => t.unlocked).length,
                    achievementsUnlocked: Object.values(GameState.achievements).filter(a => a.unlocked).length
                };
            }
        };
        
        console.log('🛠️ DevTools available! Try window.DevTools.getStats()');
        
        // Add development CSS for debugging
        const devCSS = `
            .dev-info {
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                font-family: monospace;
                z-index: 9999;
                max-width: 300px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = devCSS;
        document.head.appendChild(style);
        
        // Add dev info panel
        this.addDevInfoPanel();
    }
    
    addDevInfoPanel() {
        const devInfo = document.createElement('div');
        devInfo.className = 'dev-info';
        devInfo.innerHTML = `
            <strong>🔧 DEV MODE</strong><br>
            <small>Check console for DevTools</small>
        `;
        
        document.body.appendChild(devInfo);
        
        // Update dev info every second
        setInterval(() => {
            const stats = window.DevTools.getStats();
            devInfo.innerHTML = `
                <strong>🔧 DEV MODE</strong><br>
                Office: ${Lang.formatNumber(stats.officePoints)}<br>
                Infinity: ${Lang.formatNumber(stats.infinityPoints)}<br>
                Tasks: ${stats.tasksUnlocked}/${GameData.tasks.length}<br>
                Achievements: ${stats.achievementsUnlocked}/${GameData.achievements.length}
            `;
        }, 1000);
    }
    
    handleCriticalError(error) {
        console.error('Critical error:', error);
        
        const errorHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #e74c3c;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <h1>⚠️ Game Failed to Load</h1>
                <p>Corporate Rat Idle encountered a critical error and cannot start.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please refresh the page to try again.</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #e74c3c;
                    border: none;
                    padding: 15px 30px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Refresh Page</button>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }
    
    showErrorMessage(message) {
        if (GameState && GameState.showNotification) {
            GameState.showNotification('error', message);
        } else {
            alert(message);
        }
    }
    
    // Public API
    getVersion() {
        return this.version;
    }
    
    isInitialized() {
        return this.initialized;
    }
    
    // Performance monitoring
    startPerformanceMonitoring() {
        if (!this.isDevelopmentMode()) return;
        
        setInterval(() => {
            const memory = performance.memory;
            if (memory) {
                const used = Math.round(memory.usedJSHeapSize / 1048576);
                const total = Math.round(memory.totalJSHeapSize / 1048576);
                
                if (used > 100) { // More than 100MB
                    console.warn(`Memory usage high: ${used}MB / ${total}MB`);
                }
            }
        }, 30000); // Check every 30 seconds
    }
}

// Global game instance
window.Game = new CorporateRatIdle();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CorporateRatIdle;
}