// Main Game Initialization for Corporate Rat Idle

class CorporateRatIdle {
    constructor() {
        this.version = '2.0.0';
        this.initialized = false;
        this.gameReady = false;
        
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
            
            // Initialize error handling first
            this.initializeErrorHandling();
            
            // Validate that all required components are loaded
            this.validateDependencies();
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize the game with a small delay to show loading screen
            setTimeout(() => {
                this.initializeGame();
            }, 1000);
            
        } catch (error) {
            this.handleCriticalError(error);
        }
    }

    initializeErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error caught:', event.error);
            this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
        });

        // Unhandled promise rejection handler
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
        
        console.log('✓ All dependencies loaded successfully');
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        const errorScreen = document.getElementById('error-screen');
        
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (app) app.classList.add('hidden');
        if (errorScreen) errorScreen.classList.add('hidden');
        
        // Add loading animation
        this.animateLoadingSpinner();
    }

    animateLoadingSpinner() {
        const loadingContent = document.querySelector('.loading-content');
        if (loadingContent) {
            // Create spinner element if it doesn't exist
            let spinner = loadingContent.querySelector('.loading-spinner');
            if (!spinner) {
                spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                loadingContent.appendChild(spinner);
            }
            
            // Add CSS for spinner animation
            const style = document.createElement('style');
            style.textContent = `
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--color-secondary);
                    border-top: 4px solid var(--color-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: var(--space-16) auto;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loading-content {
                    text-align: center;
                    padding: var(--space-32);
                }
                
                .loading-icon {
                    font-size: var(--font-size-4xl);
                    margin-bottom: var(--space-16);
                }
                
                .loading-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--color-background);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                
                .error-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--color-background);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                
                .error-content {
                    text-align: center;
                    padding: var(--space-32);
                    max-width: 500px;
                }
                
                .error-icon {
                    font-size: var(--font-size-4xl);
                    margin-bottom: var(--space-16);
                    color: var(--color-error);
                }
                
                .error-details {
                    background: var(--color-secondary);
                    padding: var(--space-16);
                    border-radius: var(--radius-base);
                    margin: var(--space-16) 0;
                    font-family: var(--font-family-mono);
                    font-size: var(--font-size-sm);
                    text-align: left;
                    word-break: break-all;
                }
            `;
            
            if (!document.getElementById('loading-styles')) {
                style.id = 'loading-styles';
                document.head.appendChild(style);
            }
        }
    }

    async initializeGame() {
        try {
            console.log('🎮 Initializing game systems...');
            
            // Initialize core systems in order
            await this.initializeLanguageSystem();
            await this.initializeThemeSystem();
            await this.initializeGameState();
            await this.initializeGameLogic();
            await this.initializeUISystem();
            
            // Final setup
            this.setupGameReadyState();
            this.hideLoadingScreen();
            
            console.log('🎉 Corporate Rat Idle initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.handleCriticalError(error);
        }
    }

    async initializeLanguageSystem() {
        // Language system is already initialized via Lang global
        if (!window.Lang) {
            throw new Error('Language system failed to initialize');
        }
        
        // Set initial language
        Lang.updateLanguage();
        console.log('✓ Language system initialized');
    }

    async initializeThemeSystem() {
        // Initialize theme system
        const savedTheme = localStorage.getItem('theme') || 'auto';
        this.setTheme(savedTheme);
        console.log('✓ Theme system initialized');
    }

    async initializeGameState() {
        // Game state is already initialized via GameState global
        if (!window.GameState) {
            throw new Error('Game state failed to initialize');
        }
        
        console.log('✓ Game state initialized');
    }

    async initializeGameLogic() {
        // Game logic is already initialized via GameLogic global
        if (!window.GameLogic) {
            throw new Error('Game logic failed to initialize');
        }
        
        console.log('✓ Game logic initialized');
    }

    async initializeUISystem() {
        // UI system is already initialized via UIManager global
        if (!window.UIManager) {
            throw new Error('UI system failed to initialize');
        }
        
        console.log('✓ UI system initialized');
    }

    setupGameReadyState() {
        this.initialized = true;
        this.gameReady = true;
        
        // Enable automation if conditions are met
        if (GameState.officePoints >= GameData.config.automationUnlockThreshold && !GameState.automation.enabled) {
            GameState.automation.enabled = true;
            GameState.showNotification('success', 'Automation unlocked!');
        }
        
        // Check for any immediate unlocks or achievements
        GameState.checkTaskUnlocks();
        GameState.checkAchievements();
        
        // Set up periodic checks
        this.setupPeriodicChecks();
    }

    setupPeriodicChecks() {
        // Check for achievements every 10 seconds
        setInterval(() => {
            if (this.gameReady) {
                GameState.checkAchievements();
            }
        }, 10000);
        
        // Performance monitoring
        setInterval(() => {
            this.monitorPerformance();
        }, 60000); // Every minute
    }

    monitorPerformance() {
        // Simple performance monitoring
        if (performance && performance.memory) {
            const memory = performance.memory;
            const memoryMB = Math.round(memory.usedJSHeapSize / 1048576);
            
            // Log warning if memory usage is high
            if (memoryMB > 100) {
                console.warn(`High memory usage detected: ${memoryMB}MB`);
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (app) {
            app.classList.remove('hidden');
        }
    }

    handleCriticalError(error) {
        console.error('Critical error:', error);
        
        const loadingScreen = document.getElementById('loading-screen');
        const errorScreen = document.getElementById('error-screen');
        const errorDetails = document.getElementById('error-details');
        const app = document.getElementById('app');
        
        // Hide loading screen and app
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (app) app.classList.add('hidden');
        
        // Show error screen
        if (errorScreen) {
            errorScreen.classList.remove('hidden');
            
            // Add error details
            if (errorDetails) {
                errorDetails.innerHTML = `
                    <strong>Error:</strong> ${error.message}<br>
                    <strong>Stack:</strong> ${error.stack ? error.stack.substring(0, 500) + '...' : 'Not available'}
                `;
            }
        }
    }

    showErrorMessage(message) {
        // Show a user-friendly error message
        if (window.GameState && GameState.showNotification) {
            GameState.showNotification('error', message);
        } else {
            alert(message);
        }
    }

    setTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            root.removeAttribute('data-color-scheme');
        } else {
            root.setAttribute('data-color-scheme', theme);
        }
        
        localStorage.setItem('theme', theme);
    }

    // Public API methods
    exportSave() {
        if (GameState) {
            return GameState.exportSave();
        }
        return null;
    }

    importSave(saveData) {
        if (GameState) {
            return GameState.importSave(saveData);
        }
        return false;
    }

    resetGame() {
        if (GameState && confirm('Are you sure you want to reset all progress? This action cannot be undone!')) {
            GameState.resetGame();
        }
    }

    getGameStats() {
        if (!GameState) return null;
        
        return {
            version: this.version,
            officePoints: GameState.officePoints,
            infinityPoints: GameState.infinityPoints,
            infinities: GameState.infinities,
            totalPlayTime: GameState.state.totalPlayTime,
            tasksUnlocked: GameState.stats.tasksUnlocked,
            achievementsUnlocked: Object.values(GameState.achievements).filter(a => a.unlocked).length,
            initialized: this.initialized,
            gameReady: this.gameReady
        };
    }

    // Debug methods (only available in development)
    addOfficePoints(amount) {
        if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            if (GameState) {
                GameState.addOfficePoints(amount);
                console.log(`Added ${amount} office points`);
            }
        }
    }

    addInfinityPoints(amount) {
        if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            if (GameState) {
                GameState.addInfinityPoints(amount);
                console.log(`Added ${amount} infinity points`);
            }
        }
    }

    unlockAllTasks() {
        if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            if (GameState) {
                Object.keys(GameState.tasks).forEach(taskId => {
                    GameState.unlockTask(taskId);
                });
                console.log('All tasks unlocked');
            }
        }
    }

    // Pause/Resume functionality
    pauseGame() {
        if (GameLogic) {
            GameLogic.stopGameLoop();
            console.log('Game paused');
        }
    }

    resumeGame() {
        if (GameLogic) {
            GameLogic.startGameLoop();
            console.log('Game resumed');
        }
    }
}

// Initialize the game when script loads
const game = new CorporateRatIdle();

// Expose game instance to window for debugging and external access
window.CorporateRatIdle = game;

// Also expose main systems for debugging
if (typeof window !== 'undefined') {
    window.game = game;
}