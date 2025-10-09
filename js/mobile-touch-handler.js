// Mobile Touch Handler
// Obsługa zdarzeń dotykowych dla urządzeń mobilnych

class MobileTouchHandler {
    constructor() {
        this.activeElement = null;
        this.touchStartTime = 0;
        this.touchMoved = false;
        this.init();
    }

    init() {
        // Poczekaj na załadowanie DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTouchHandlers());
        } else {
            this.setupTouchHandlers();
        }
    }

    setupTouchHandlers() {
        this.setupTileHandlers();
        this.setupButtonHandlers();
        this.setupNavigationHandlers();
    }

    // Obsługa kafelków (tiles) na ekranie głównym
    setupTileHandlers() {
        const tiles = document.querySelectorAll('.tile');
        
        tiles.forEach(tile => {
            // Usuń poprzednie event listenery jeśli istnieją
            tile.removeEventListener('click', this.handleTileClick);
            
            // Dodaj obsługę touch events
            tile.addEventListener('touchstart', (e) => this.handleTouchStart(e, tile), { passive: false });
            tile.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            tile.addEventListener('touchend', (e) => this.handleTouchEnd(e, tile, 'tile'), { passive: false });
            tile.addEventListener('touchcancel', (e) => this.handleTouchCancel(e, tile), { passive: false });
            
            // Zachowaj obsługę click dla komputerów
            tile.addEventListener('click', (e) => this.handleTileClick(e, tile));
        });
    }

    // Obsługa przycisków
    setupButtonHandlers() {
        const buttons = document.querySelectorAll(
            '.check-btn, .clear-btn, .calculate-btn, ' +
            '.operation-btn, .method-btn, .help-button, ' +
            '.back-btn, .menu-btn, .auth-btn, .dashboard-btn, ' +
            '.profile-hero-btn, .action-btn, .modal-btn, ' +
            '.dock-btn, .dashboard-back-btn, .dashboard-close-btn'
        );
        
        buttons.forEach(button => {
            // Pomiń przyciski z nav-bar - niech działają normalnie
            if (button.classList.contains('nav-btn') || 
                button.classList.contains('user-btn') ||
                button.classList.contains('theme-toggle-btn') ||
                button.classList.contains('lang-btn')) {
                return;
            }
            
            button.addEventListener('touchstart', (e) => this.handleTouchStart(e, button), { passive: false });
            button.addEventListener('touchend', (e) => this.handleTouchEnd(e, button, 'button'), { passive: false });
            button.addEventListener('touchcancel', (e) => this.handleTouchCancel(e, button), { passive: false });
        });
    }

    // Obsługa elementów nawigacyjnych
    setupNavigationHandlers() {
        const navItems = document.querySelectorAll(
            '.sidebar-nav-item, .menu-item, .submenu-item, ' +
            '.lang-menu div, .operation-menu-item'
        );
        
        navItems.forEach(item => {
            item.addEventListener('touchstart', (e) => this.handleTouchStart(e, item), { passive: false });
            item.addEventListener('touchend', (e) => this.handleTouchEnd(e, item, 'nav'), { passive: false });
            item.addEventListener('touchcancel', (e) => this.handleTouchCancel(e, item), { passive: false });
        });
    }

    handleTouchStart(e, element) {
        this.activeElement = element;
        this.touchStartTime = Date.now();
        this.touchMoved = false;
        
        // Dodaj klasę active dla wizualnego feedbacku
        element.classList.add('touch-active');
        
        // Zapobiegaj wielokrotnemu kliknięciu
        e.stopPropagation();
    }

    handleTouchMove(e) {
        this.touchMoved = true;
        
        // Usuń klasę active jeśli użytkownik przesuwa palec
        if (this.activeElement) {
            this.activeElement.classList.remove('touch-active');
        }
    }

    handleTouchEnd(e, element, elementType) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        // Usuń klasę active
        element.classList.remove('touch-active');
        
        // Sprawdź czy to było kliknięcie (nie przesunięcie i krótki czas)
        if (!this.touchMoved && touchDuration < 500) {
            // Zapobiegaj domyślnemu zachowaniu i propagacji
            e.preventDefault();
            e.stopPropagation();
            
            // Dla przycisków nav-bar (user, theme, lang) nie rób nic - pozwól na normalne działanie
            if (element.classList.contains('user-btn') || 
                element.classList.contains('theme-toggle-btn') ||
                element.classList.contains('lang-btn')) {
                // Pozwól normalnym handlerom obsłużyć to
                this.activeElement = null;
                this.touchMoved = false;
                return;
            }
            
            // Wykonaj akcję odpowiednią dla typu elementu
            switch (elementType) {
                case 'tile':
                    this.executeTileAction(element);
                    break;
                case 'button':
                    this.executeButtonAction(element, e);
                    break;
                case 'nav':
                    this.executeNavAction(element, e);
                    break;
            }
        }
        
        this.activeElement = null;
        this.touchMoved = false;
    }

    handleTouchCancel(e, element) {
        element.classList.remove('touch-active');
        this.activeElement = null;
        this.touchMoved = false;
    }

    executeTileAction(tile) {
        const app = tile.dataset.app;
        if (!app) return;
        
        // Dodaj efekt wizualny
        this.addTapEffect(tile);
        
        // Wykonaj akcję po krótkiej chwili (dla lepszego UX)
        setTimeout(() => {
            currentScreen = "app";
            document.querySelector('.home-screen').style.display = 'none';
            document.querySelector('.app-container').style.display = 'block';
            
            document.querySelectorAll('.app-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const appElement = document.getElementById(app + 'App');
            if (appElement) {
                appElement.classList.add('active');
            }

            // Zresetuj stan menu i przycisku
            const globalSideMenu = document.getElementById('globalSideMenu');
            const menuBtn = document.getElementById('menuBtn');
            
            if (globalSideMenu) {
                globalSideMenu.classList.remove('open');
                globalSideMenu.classList.remove('hidden');
            }
            
            if (menuBtn) {
                menuBtn.style.display = 'block';
                menuBtn.style.opacity = '1';
                menuBtn.style.pointerEvents = 'auto';
            }
            
            // Dodaj/odśwież przycisk pomocy
            if (window.helpSystem) {
                window.helpSystem.removeHelpButtons();
                if (app === 'matrixCalc') {
                    window.helpSystem.addMatrixHelpButton();
                } else if (app === 'leapYear') {
                    window.helpSystem.addLeapYearHelpButton();
                }
            }
            
            if (typeof updateUI === 'function') updateUI();
            if (typeof initializeUI === 'function') initializeUI();
        }, 100);
    }

    executeButtonAction(button, event) {
        // Dodaj efekt wizualny
        this.addTapEffect(button);
        
        // Sprawdź czy to przycisk dark mode z głównego navbar
        if (button.id === 'themeToggleBtn' || button.classList.contains('theme-toggle-btn')) {
            setTimeout(() => {
                if (typeof toggleDarkMode === 'function') {
                    toggleDarkMode();
                }
            }, 100);
            return;
        }
        
        // Sprawdź czy to przycisk w dashboard
        if (button.classList.contains('dashboard-btn')) {
            const action = button.dataset.action;
            
            // Dla przycisku theme w dashboard
            if (action === 'theme') {
                setTimeout(() => {
                    if (typeof toggleDarkMode === 'function') {
                        toggleDarkMode();
                    }
                    if (typeof updateDashboardThemeBtn === 'function') {
                        updateDashboardThemeBtn();
                    }
                }, 100);
                return;
            }
            
            // Dla innych przycisków dashboard - pozwól na normalny click
            setTimeout(() => {
                button.click();
            }, 100);
            return;
        }
        
        // Dla innych przycisków - symuluj click
        setTimeout(() => {
            button.click();
        }, 100);
    }

    executeNavAction(navItem, event) {
        // Dodaj efekt wizualny
        this.addTapEffect(navItem);
        
        // Symuluj kliknięcie
        setTimeout(() => {
            navItem.click();
        }, 100);
    }

    addTapEffect(element) {
        // Dodaj subtelny efekt pulsowania
        element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    // Metoda do odświeżenia handlerów (wywołaj po dynamicznym dodaniu elementów)
    refresh() {
        this.setupTouchHandlers();
    }
}

// Inicjalizuj handler gdy DOM jest gotowy
let mobileTouchHandler;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mobileTouchHandler = new MobileTouchHandler();
        window.mobileTouchHandler = mobileTouchHandler;
    });
} else {
    mobileTouchHandler = new MobileTouchHandler();
    window.mobileTouchHandler = mobileTouchHandler;
}

// Eksportuj dla innych modułów
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileTouchHandler;
}
