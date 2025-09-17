// CorpoClicker v4.3.1 Game Logic
class CorpoClicker {
    constructor() {
        this.gameState = {
            resources: {
                budget: 0,
                documents: 0,
                coffee: 0,
                prestige: 0,
                usd: 0,
                eur: 0,
                jpy: 0,
                cny: 0
            },
            departments: {
                hr: { level: 0, unlocked: true },
                it: { level: 0, unlocked: false },
                marketing: { level: 0, unlocked: false },
                accounting: { level: 0, unlocked: false },
                management: { level: 0, unlocked: false },
                rd: { level: 0, unlocked: false },
                callcenter: { level: 0, unlocked: false }
            },
            markets: {
                europe: { unlocked: true },
                americas: { unlocked: false },
                asia: { unlocked: false },
                africa: { unlocked: false },
                middleeast: { unlocked: false }
            },
            stats: {
                motivation: 100,
                stress: 0,
                totalProduction: 1
            },
            workIncome: 1,
            currencyExpanded: false
        };

        this.departmentData = {
            hr: {
                name: "Dział HR",
                icon: "⚖️",
                baseCost: 10,
                production: { documents: 1 },
                sideEffects: { stress: 0.1 },
                description: "Produkuje dokumenty korporacyjne. Zwiększa stres przez biurokrację.",
                unlockConditions: [],
                hiringEffects: {
                    positive: ["+1 production dokumentów na pracownika", "+0.05 globalna efektywność na poziom"],
                    negative: ["+0.1 stress na pracownika", "Wzrost kosztów administracyjnych"]
                }
            },
            it: {
                name: "Dział IT",
                icon: "💻",
                baseCost: 20,
                production: { coffee: 1 },
                sideEffects: { motivation: -0.05 },
                description: "Zapewnia kawę premium i wsparcie techniczne.",
                unlockConditions: [{ type: "resource", resource: "documents", amount: 5 }],
                hiringEffects: {
                    positive: ["+1 produkcja kawy na pracownika", "+0.02 automatyzacja procesów na poziom"],
                    negative: ["-0.05 motywacja zespołu na pracownika", "Zwiększone koszty sprzętu"]
                }
            },
            marketing: {
                name: "Marketing",
                icon: "📈",
                baseCost: 35,
                production: { budget: 1, prestige: 0.02 },
                description: "Generuje przychody i buduje prestiż marki.",
                unlockConditions: [{ type: "resource", resource: "documents", amount: 15 }],
                hiringEffects: {
                    positive: ["+1 przychód budżetu na pracownika", "+0.02 prestiż na pracownika", "+0.1 globalny zasięg na poziom"],
                    negative: ["Zwiększone koszty kampanii", "Ryzyko negatywnej reklamy"]
                }
            },
            accounting: {
                name: "Księgowość",
                icon: "📊",
                baseCost: 55,
                production: { budget: 0.8 },
                sideEffects: { stress: 0.15 },
                description: "Optymalizuje finanse, ale zwiększa stres przez kontrole.",
                unlockConditions: [{ type: "resource", resource: "documents", amount: 35 }],
                hiringEffects: {
                    positive: ["+0.8 optymalizacja budżetu na pracownika", "+0.03 redukcja kosztów na poziom"],
                    negative: ["+0.15 stress na pracownika", "Zwiększone procedury kontrolne"]
                }
            },
            management: {
                name: "Zarząd",
                icon: "👔",
                baseCost: 90,
                production: { motivation: 0.3 },
                description: "Motywuje pracowników i poprawia efektywność organizacyjną.",
                unlockConditions: [{ type: "resource", resource: "prestige", amount: 5 }],
                hiringEffects: {
                    positive: ["+0.3 motywacja zespołu na pracownika", "+0.05 efektywność wszystkich działów na poziom"],
                    negative: ["Wysokie koszty wynagrodzeń", "Ryzyko konfliktów organizacyjnych"]
                }
            },
            rd: {
                name: "R&D",
                icon: "🔬",
                baseCost: 150,
                production: { prestige: 0.1 },
                sideEffects: { stress: 0.2 },
                description: "Innowacje zwiększają prestiż, ale wymagają intensywnej pracy.",
                unlockConditions: [{ type: "resource", resource: "prestige", amount: 15 }],
                hiringEffects: {
                    positive: ["+0.1 prestiż z innowacji na pracownika", "+0.02 szansa na przełom technologiczny na poziom"],
                    negative: ["+0.2 stress na pracownika", "Wysokie koszty badań"]
                }
            },
            callcenter: {
                name: "Call Center",
                icon: "📞",
                baseCost: 300,
                production: { budget: 4 },
                sideEffects: { motivation: -0.3, stress: 0.5 },
                description: "Wysokie przychody kosztem dobrostanu pracowników.",
                unlockConditions: [{ type: "resource", resource: "documents", amount: 100 }],
                hiringEffects: {
                    positive: ["+4 przychód budżetu na pracownika", "+0.1 obsługa klientów na poziom"],
                    negative: ["-0.3 motywacja na pracownika", "+0.5 stress na pracownika", "Wysokie ryzyko wypalenia zawodowego"]
                }
            }
        };

        this.marketData = {
            europe: { name: "Europa", unlocked: true, unlockCost: 0 },
            americas: { name: "Ameryki", unlocked: false, unlockCost: 1000 },
            asia: { name: "Azja-Pacyfik", unlocked: false, unlockCost: 5000 },
            africa: { name: "Afryka", unlocked: false, unlockCost: 10000 },
            middleeast: { name: "Bliski Wschód", unlocked: false, unlockCost: 25000 }
        };

        this.shoppingItems = [
            {
                name: "Maszyna do kawy",
                cost: { budget: 500 },
                effect: { coffeeProduction: 1.2 },
                description: "Zwiększa produkcję kawy o 20%",
                owned: false
            },
            {
                name: "System automatyzacji",
                cost: { budget: 1500, prestige: 5 },
                effect: { allProduction: 1.1 },
                description: "Zwiększa całkowitą produkcję o 10%",
                owned: false
            },
            {
                name: "Program motywacyjny",
                cost: { budget: 800, documents: 50 },
                effect: { motivation: 10 },
                description: "Zwiększa motywację zespołu o 10 punktów",
                owned: false
            },
            {
                name: "Konsultacje zarządcze",
                cost: { budget: 2000, prestige: 10 },
                effect: { stressReduction: 0.8 },
                description: "Redukuje stres korporacyjny o 20%",
                owned: false
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startGameLoop();
        this.updateUI();
        this.renderDepartments();
        this.renderMarkets();
        this.renderShoppingCenter();
        this.updateAutomationTab();
    }

    setupEventListeners() {
        // Work button
        document.getElementById('workButton').addEventListener('click', () => this.work());

        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Currency expansion
        document.getElementById('currencyExpandBtn').addEventListener('click', () => this.toggleCurrency());
    }

    work() {
        this.gameState.resources.budget += this.gameState.workIncome;
        this.addCurrencyUpdateEffect('budget');
        this.updateUI();
    }

    addCurrencyUpdateEffect(currency) {
        const element = document.getElementById(currency);
        if (element) {
            element.classList.add('currency-update');
            setTimeout(() => element.classList.remove('currency-update'), 300);
        }
    }

    toggleCurrency() {
        this.gameState.currencyExpanded = !this.gameState.currencyExpanded;
        const secondary = document.getElementById('currencySecondary');
        const icon = document.getElementById('expandIcon');
        
        if (this.gameState.currencyExpanded) {
            secondary.classList.remove('hidden');
            secondary.style.display = 'flex';
            icon.textContent = '▲';
        } else {
            secondary.classList.add('hidden');
            secondary.style.display = 'none';
            icon.textContent = '▼';
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Update content based on tab
        if (tabName === 'departments') {
            this.renderDepartmentsList();
        }
    }

    canAfford(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            if (this.gameState.resources[resource] < amount) {
                return false;
            }
        }
        return true;
    }

    spendResources(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            this.gameState.resources[resource] -= amount;
        }
    }

    hireDepartment(deptId) {
        const dept = this.departmentData[deptId];
        const level = this.gameState.departments[deptId].level;
        const cost = { budget: dept.baseCost * Math.pow(1.5, level) };

        if (this.canAfford(cost)) {
            this.spendResources(cost);
            this.gameState.departments[deptId].level++;
            this.updateUI();
            this.renderDepartments();
            this.renderDepartmentsList();
        }
    }

    unlockMarket(marketId) {
        const market = this.marketData[marketId];
        const cost = { budget: market.unlockCost };

        if (this.canAfford(cost)) {
            this.spendResources(cost);
            this.gameState.markets[marketId].unlocked = true;
            
            // Check if Americas market was unlocked to enable AI automation
            if (marketId === 'americas') {
                this.updateAutomationTab();
            }
            
            this.updateUI();
            this.renderMarkets();
        }
    }

    buyShopItem(index) {
        const item = this.shoppingItems[index];
        if (!item.owned && this.canAfford(item.cost)) {
            this.spendResources(item.cost);
            item.owned = true;
            this.applyShopEffect(item.effect);
            this.renderShoppingCenter();
            this.updateUI();
        }
    }

    applyShopEffect(effect) {
        if (effect.motivation) {
            this.gameState.stats.motivation += effect.motivation;
        }
        if (effect.stressReduction) {
            this.gameState.stats.stress = Math.max(0, this.gameState.stats.stress * effect.stressReduction);
        }
        // Other effects would be applied during production calculations
    }

    checkUnlockConditions() {
        for (const [deptId, dept] of Object.entries(this.departmentData)) {
            if (!this.gameState.departments[deptId].unlocked) {
                let canUnlock = true;
                for (const condition of dept.unlockConditions) {
                    if (condition.type === 'resource') {
                        if (this.gameState.resources[condition.resource] < condition.amount) {
                            canUnlock = false;
                            break;
                        }
                    }
                }
                if (canUnlock) {
                    this.gameState.departments[deptId].unlocked = true;
                }
            }
        }
    }

    calculateProduction() {
        let totalProduction = 0;
        
        // Calculate department production
        for (const [deptId, deptState] of Object.entries(this.gameState.departments)) {
            if (deptState.level > 0) {
                const dept = this.departmentData[deptId];
                for (const [resource, amount] of Object.entries(dept.production || {})) {
                    if (resource !== 'motivation') {
                        this.gameState.resources[resource] += amount * deptState.level;
                        totalProduction += amount * deptState.level;
                    }
                }
                
                // Apply side effects
                if (dept.sideEffects) {
                    for (const [effect, amount] of Object.entries(dept.sideEffects)) {
                        if (effect === 'stress') {
                            this.gameState.stats.stress += amount * deptState.level;
                        } else if (effect === 'motivation') {
                            this.gameState.stats.motivation += amount * deptState.level;
                        }
                    }
                }
            }
        }

        this.gameState.stats.totalProduction = Math.max(1, totalProduction);
        
        // Apply market bonuses
        if (this.gameState.markets.americas.unlocked) {
            this.gameState.resources.usd += 0.1;
        }
        if (this.gameState.markets.europe.unlocked) {
            this.gameState.resources.eur += 0.05;
        }
        if (this.gameState.markets.asia.unlocked) {
            this.gameState.resources.jpy += 1;
            this.gameState.resources.cny += 0.2;
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num * 100) / 100;
    }

    updateUI() {
        // Update currency displays
        for (const [resource, amount] of Object.entries(this.gameState.resources)) {
            const element = document.getElementById(resource);
            if (element) {
                element.textContent = this.formatNumber(amount);
            }
        }

        // Update stats
        document.getElementById('motivation').textContent = Math.floor(this.gameState.stats.motivation);
        document.getElementById('stress').textContent = Math.floor(this.gameState.stats.stress);
        document.getElementById('totalProduction').textContent = this.formatNumber(this.gameState.stats.totalProduction);
        document.getElementById('workIncome').textContent = this.gameState.workIncome;
    }

    renderDepartments() {
        const container = document.getElementById('departmentsOverview');
        container.innerHTML = '';

        for (const [deptId, dept] of Object.entries(this.departmentData)) {
            const deptState = this.gameState.departments[deptId];
            const card = document.createElement('div');
            card.className = `department-card ${!deptState.unlocked ? 'locked' : ''}`;

            let unlockRequirementsHtml = '';
            let hiringEffectsHtml = '';

            if (!deptState.unlocked) {
                // Show unlock requirements
                if (dept.unlockConditions.length > 0) {
                    unlockRequirementsHtml = `
                        <div class="unlock-requirements">
                            <h5>Wymagania do odblokowania:</h5>
                            ${dept.unlockConditions.map(req => 
                                `<div class="requirement-item">• ${req.amount} ${this.getResourceName(req.resource)}</div>`
                            ).join('')}
                        </div>
                    `;
                }

                // Show hiring effects for locked departments
                hiringEffectsHtml = `
                    <div class="hiring-effects">
                        <h5>Efekty zatrudniania:</h5>
                        <div class="effects-list">
                            <strong>Pozytywne:</strong>
                            ${dept.hiringEffects.positive.map(effect => 
                                `<div class="positive-effect">• ${effect}</div>`
                            ).join('')}
                        </div>
                        <div class="effects-list">
                            <strong>Negatywne:</strong>
                            ${dept.hiringEffects.negative.map(effect => 
                                `<div class="negative-effect">• ${effect}</div>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="department-header">
                    <span class="department-icon">${dept.icon}</span>
                    <div class="department-info">
                        <h4>${dept.name}</h4>
                        <div class="department-level">Poziom: ${deptState.level}</div>
                    </div>
                </div>
                <div class="department-description">${dept.description}</div>
                ${unlockRequirementsHtml}
                ${hiringEffectsHtml}
            `;

            container.appendChild(card);
        }
    }

    renderDepartmentsList() {
        const container = document.getElementById('departmentsList');
        container.innerHTML = '';

        for (const [deptId, dept] of Object.entries(this.departmentData)) {
            const deptState = this.gameState.departments[deptId];
            const card = document.createElement('div');
            card.className = `department-card ${!deptState.unlocked ? 'locked' : ''}`;

            let contentHtml = '';
            let actionsHtml = '';

            if (deptState.unlocked) {
                // Unlocked department - show hiring button
                const hireCost = dept.baseCost * Math.pow(1.5, deptState.level);
                const canAfford = this.gameState.resources.budget >= hireCost;

                actionsHtml = `
                    <div class="department-actions">
                        <button class="btn ${canAfford ? 'btn--primary' : 'btn--secondary'}" 
                                onclick="game.hireDepartment('${deptId}')" 
                                ${!canAfford ? 'disabled' : ''}>
                            Zatrudnij (${this.formatNumber(hireCost)} Budżet)
                        </button>
                    </div>
                `;
            } else {
                // Locked department - show unlock requirements and hiring effects
                let unlockRequirementsHtml = '';
                if (dept.unlockConditions.length > 0) {
                    unlockRequirementsHtml = `
                        <div class="unlock-requirements">
                            <h5>Wymagania do odblokowania:</h5>
                            ${dept.unlockConditions.map(req => 
                                `<div class="requirement-item">• ${req.amount} ${this.getResourceName(req.resource)}</div>`
                            ).join('')}
                        </div>
                    `;
                }

                const hiringEffectsHtml = `
                    <div class="hiring-effects">
                        <h5>Efekty zatrudniania:</h5>
                        <div class="effects-list">
                            <strong>Pozytywne:</strong>
                            ${dept.hiringEffects.positive.map(effect => 
                                `<div class="positive-effect">• ${effect}</div>`
                            ).join('')}
                        </div>
                        <div class="effects-list">
                            <strong>Negatywne:</strong>
                            ${dept.hiringEffects.negative.map(effect => 
                                `<div class="negative-effect">• ${effect}</div>`
                            ).join('')}
                        </div>
                    </div>
                `;

                contentHtml = unlockRequirementsHtml + hiringEffectsHtml;
            }

            card.innerHTML = `
                <div class="department-header">
                    <span class="department-icon">${dept.icon}</span>
                    <div class="department-info">
                        <h4>${dept.name}</h4>
                        <div class="department-level">Poziom: ${deptState.level}</div>
                    </div>
                </div>
                <div class="department-description">${dept.description}</div>
                ${contentHtml}
                ${actionsHtml}
            `;

            container.appendChild(card);
        }
    }

    renderMarkets() {
        const container = document.getElementById('marketsList');
        container.innerHTML = '';

        for (const [marketId, market] of Object.entries(this.marketData)) {
            const marketState = this.gameState.markets[marketId];
            const card = document.createElement('div');
            card.className = `market-card ${!marketState.unlocked ? 'locked' : ''}`;

            const canAfford = market.unlockCost === 0 || this.gameState.resources.budget >= market.unlockCost;

            card.innerHTML = `
                <div class="market-header">
                    <h3 class="market-name">${market.name}</h3>
                    <span class="market-status ${marketState.unlocked ? 'unlocked' : 'locked'}">
                        ${marketState.unlocked ? 'Odblokowany' : 'Zablokowany'}
                    </span>
                </div>
                ${!marketState.unlocked ? `
                    <div class="market-actions">
                        <button class="btn ${canAfford ? 'btn--primary' : 'btn--secondary'}" 
                                onclick="game.unlockMarket('${marketId}')" 
                                ${!canAfford ? 'disabled' : ''}>
                            Odblokuj (${this.formatNumber(market.unlockCost)} Budżet)
                        </button>
                    </div>
                ` : `
                    <div class="market-benefits">
                        <p>✓ Dostęp do lokalnych walut</p>
                        <p>✓ Zwiększone możliwości handlowe</p>
                    </div>
                `}
            `;

            container.appendChild(card);
        }
    }

    renderShoppingCenter() {
        const container = document.getElementById('shoppingCenter');
        container.innerHTML = '';

        this.shoppingItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'shop-item';

            const canAfford = !item.owned && this.canAfford(item.cost);
            const costHtml = Object.entries(item.cost).map(([resource, amount]) => 
                `<span class="cost-item">${this.formatNumber(amount)} ${this.getResourceName(resource)}</span>`
            ).join('');

            card.innerHTML = `
                <h4>${item.name}</h4>
                <p class="shop-description">${item.description}</p>
                <div class="shop-cost">${costHtml}</div>
                <button class="btn ${item.owned ? 'btn--secondary' : canAfford ? 'btn--primary' : 'btn--secondary'}" 
                        onclick="game.buyShopItem(${index})" 
                        ${item.owned || !canAfford ? 'disabled' : ''}>
                    ${item.owned ? 'Zakupiono' : 'Kup'}
                </button>
            `;

            container.appendChild(card);
        });
    }

    updateAutomationTab() {
        const container = document.getElementById('automationContent');
        
        if (this.gameState.markets.americas.unlocked) {
            container.innerHTML = `
                <div class="automation-unlocked">
                    <h3>🤖 Centrum Automatyzacji AI</h3>
                    <p>Zaawansowane systemy AI do automatyzacji procesów korporacyjnych.</p>
                    <div class="automation-options">
                        <div class="card">
                            <div class="card__body">
                                <h4>Auto-HR</h4>
                                <p>Automatyczne zarządzanie zasobami ludzkimi.</p>
                                <button class="btn btn--primary">Aktywuj (1000 Budżet)</button>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card__body">
                                <h4>Smart Analytics</h4>
                                <p>AI-driven analiza danych biznesowych.</p>
                                <button class="btn btn--primary">Aktywuj (1500 Budżet)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="locked-feature">
                    <h3>🤖 System Automatyzacji AI</h3>
                    <p>Odblokuj nowe rynki aby uzyskać dostęp do zaawansowanej automatyzacji!</p>
                    <div class="unlock-requirement">
                        <span>Wymaga: Odblokowanie rynku Ameryk</span>
                    </div>
                </div>
            `;
        }
    }

    getResourceName(resource) {
        const names = {
            budget: 'Budżet',
            documents: 'Dokumenty',
            coffee: 'Kawa',
            prestige: 'Prestiż'
        };
        return names[resource] || resource;
    }

    startGameLoop() {
        setInterval(() => {
            this.checkUnlockConditions();
            this.calculateProduction();
            this.updateUI();
        }, 1000);
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new CorpoClicker();
});