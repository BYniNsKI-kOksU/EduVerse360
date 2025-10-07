// Global variables
let currentLang = "pl";
let currentScreen = "welcome";
let isUserProfileVisible = false;
let darkMode = false;

// Dynamic Resource Loader
class ResourceLoader {
    constructor() {
        this.loadedCSS = new Set();
        this.loadedJS = new Set();
        this.loadingPromises = new Map();
    }

    // Load CSS file dynamically
    loadCSS(filename) {
        if (this.loadedCSS.has(filename)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(filename)) {
            return this.loadingPromises.get(filename);
        }

        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = filename;
            link.onload = () => {
                this.loadedCSS.add(filename);
                this.loadingPromises.delete(filename);
                resolve();
            };
            link.onerror = () => {
                this.loadingPromises.delete(filename);
                reject(new Error(`Failed to load CSS: ${filename}`));
            };
            document.head.appendChild(link);
        });

        this.loadingPromises.set(filename, promise);
        return promise;
    }

    // Load JS file dynamically
    loadJS(filename) {
        if (this.loadedJS.has(filename)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(filename)) {
            return this.loadingPromises.get(filename);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = filename;
            script.async = true;
            script.onload = () => {
                this.loadedJS.add(filename);
                this.loadingPromises.delete(filename);
                resolve();
            };
            script.onerror = () => {
                this.loadingPromises.delete(filename);
                reject(new Error(`Failed to load JS: ${filename}`));
            };
            document.body.appendChild(script);
        });

        this.loadingPromises.set(filename, promise);
        return promise;
    }

    // Load multiple resources
    loadMultiple(resources) {
        const promises = resources.map(resource => {
            if (resource.endsWith('.css')) {
                return this.loadCSS(resource);
            } else if (resource.endsWith('.js')) {
                return this.loadJS(resource);
            }
            return Promise.resolve();
        });

        return Promise.all(promises);
    }

    // Load resources for specific app
    async loadAppResources(appName) {
        const appResources = {
            matrix: [
                'css/matrix-calculator.css',
                'css/help-modals.css',
                'js/help-system.js'
            ],
            leapYear: [
                'css/leap-year.css',
                'css/help-modals.css',
                'js/help-system.js'
            ],
            userProfile: [
                'css/user-profile.css',
                'css/user-profile-modals.css',
                'css/new-user-profile.css',
                'css/settings.css',
                'js/user-profile-modals.js',
                'js/settings-system.js'
            ],
            about: [
                'css/about.css',
                'js/about.js'
            ],
            instructions: [
                'css/instructions.css',
                'js/instructions.js'
            ]
        };

        const resources = appResources[appName] || [];
        try {
            await this.loadMultiple(resources);
            console.log(`Resources loaded for ${appName}:`, resources);
        } catch (error) {
            console.error(`Error loading resources for ${appName}:`, error);
        }
    }

    // Preload essential resources
    async preloadEssentials() {
        const essentialResources = [
            'css/home-screen.css',
            'css/welcome-screen.css',
            'css/dark-mode.css',
            'css/responsiveness.css',
            'css/enhanced-responsiveness.css'
        ];

        try {
            await this.loadMultiple(essentialResources);
            console.log('Essential resources preloaded');
        } catch (error) {
            console.error('Error preloading essential resources:', error);
        }
    }
}

// Initialize resource loader
const resourceLoader = new ResourceLoader();

function switchLanguage(lang) {
    currentLang = lang;
    document.title = translations[lang].title;
    
    // Zaktualizuj UI w zależności od aktualnego ekranu
    if (currentScreen === "welcome") {
        updateWelcomeScreen();
    } else if (currentScreen === "home") {
        updateHomeUI();
    } else if (currentScreen === "app") {
        updateUI();
    }
    
    // Aktualizuj tłumaczenia profilu użytkownika
    updateUserProfileTranslations();
    
    // Aktualizuj otwarte modały profilu użytkownika
    if (typeof userProfileModals !== 'undefined' && userProfileModals.currentModal) {
        userProfileModals.updateModalTranslations();
    }
    
    // Aktualizuj system pomocy
    if (typeof helpSystem !== 'undefined') {
        helpSystem.updateModalTranslations();
    }
    
    // Aktualizuj system ustawień
    if (typeof settingsSystem !== 'undefined') {
        settingsSystem.updateSettingsUI();
    }

    // Aktualizuj tooltips mobilnego docka
    if (typeof modernSidebar !== 'undefined') {
        modernSidebar.updateMobileDockTooltips();
    }

    const flags = {
        pl: "https://flagcdn.com/w40/pl.png",
        en: "https://flagcdn.com/w40/gb.png",
        de: "https://flagcdn.com/w40/de.png"
    };

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.style.backgroundImage = `url(${flags[lang]})`;
    });
    
    // Zaktualizuj dashboard UI jeśli jest na mobile
    if (window.innerWidth <= 768) {
        updateDashboardUI();
        updateLanguageSubmenuTexts();
    }
    
    // Dispatch language change event
    window.dispatchEvent(new Event('languageChanged'));
}

// Funkcja do aktualizacji tłumaczeń profilu użytkownika
function updateUserProfileTranslations() {
    const translateElements = document.querySelectorAll('[data-translate-key]');
    
    translateElements.forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (key) {
            const keys = key.split('.');
            let translation = translations[currentLang] || translations['pl'];
            
            for (const k of keys) {
                translation = translation[k];
                if (!translation) {
                    // Fallback to Polish if translation not found
                    translation = translations['pl'];
                    for (const fallbackKey of keys) {
                        translation = translation[fallbackKey];
                        if (!translation) break;
                    }
                    break;
                }
            }
            
            if (translation) {
                element.textContent = translation;
            }
        }
    });
}

function updateHomeUI() {
    updateUserProfileTranslations();
}

function updateDashboardUI() {
    updateUserProfileTranslations();
}

function updateUI() {
    updateUserProfileTranslations();
}

function updateWelcomeScreen() {
    updateUserProfileTranslations();
}

// Funkcja do powrotu na ekran główny
function backToHome() {
    currentScreen = "home";
    
    // Ukryj wszystkie ekrany
    const welcomeScreen = document.querySelector('.welcome-screen');
    const homeScreen = document.querySelector('.home-screen');
    const appContainer = document.querySelector('.app-container');
    
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'none';
    
    // Ukryj wszystkie aplikacje i strony
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Pokaż ekran główny
    if (homeScreen) {
        homeScreen.style.display = 'flex';
    }
    
    updateUI();
}

// Funkcja do pokazania profilu użytkownika
function showUserProfile() {
    // Sprawdź czy użytkownik jest zalogowany
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Jeśli nie zalogowany, otwórz modal logowania
        if (typeof auth !== 'undefined' && typeof auth.openModal === 'function') {
            auth.openModal('login');
        }
        return;
    }
    
    currentScreen = "app";
    
    // Ukryj welcome i home
    const welcomeScreen = document.querySelector('.welcome-screen');
    const homeScreen = document.querySelector('.home-screen');
    const appContainer = document.querySelector('.app-container');
    
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (homeScreen) homeScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    
    // Ukryj wszystkie inne aplikacje
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Pokaż profil użytkownika
    const userProfileApp = document.getElementById('userProfileApp');
    if (userProfileApp) {
        userProfileApp.classList.add('active');
    }
    
    // Pokaż przycisk menu
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.style.display = 'block';
        menuBtn.style.opacity = '1';
        menuBtn.style.pointerEvents = 'auto';
    }
    
    updateUI();
}

function syncThemeToggleState() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    // If body has dark-mode class, show moon state
    if (document.body.classList.contains('dark-mode')) {
        btn.classList.remove('light');
        btn.classList.add('dark');
    } else {
        btn.classList.remove('dark');
        btn.classList.add('light');
    }
}

// Call sync on load and expose for other modules
document.addEventListener('DOMContentLoaded', () => {
    try { syncThemeToggleState(); } catch (e) {}
});

// Update toggleDarkMode to sync button state after change
function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // save preference
    try { 
        localStorage.setItem('darkMode', darkMode ? '1' : '0'); 
    } catch (e) {
        console.error('Error saving dark mode:', e);
    }
    
    syncThemeToggleState();
    
    // Update mobile dashboard theme button
    if (typeof updateDashboardThemeBtn === 'function') {
        updateDashboardThemeBtn();
    }
}

function initializeTheme() {
    const savedDarkMode = localStorage.getItem('darkMode');
    // Support both old and new formats
    if (savedDarkMode === 'enabled' || savedDarkMode === '1' || savedDarkMode === 'true') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.classList.remove('light');
            themeToggleBtn.classList.add('dark');
        }
    } else {
        darkMode = false;
        document.body.classList.remove('dark-mode');
        
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.classList.remove('dark');
            themeToggleBtn.classList.add('light');
        }
    }
}

// Load saved dark mode preference
function loadSavedDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    // Support both old ('enabled'/'disabled') and new ('1'/'0') formats
    if (savedDarkMode === 'enabled' || savedDarkMode === '1' || savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkMode = true;
    } else if (savedDarkMode === 'disabled' || savedDarkMode === '0' || savedDarkMode === 'false') {
        document.body.classList.remove('dark-mode');
        darkMode = false;
    }
    // If no preference saved, use system default or keep current state
}

// Funkcja globalna do aktualizacji tekstów w submenu językowym
function updateLanguageSubmenuTexts() {
    const langBtns = document.querySelectorAll('#languageSubmenu .dashboard-btn[data-action="language"]');
    langBtns.forEach(btn => {
        const lang = btn.dataset.lang;
        const span = btn.querySelector('span');
        const langNames = {
            pl: 'Polski',
            en: 'English',
            de: 'Deutsch'
        };
        if (span && langNames[lang]) {
            span.textContent = langNames[lang];
        }
    });
    
    // Zaktualizuj przycisk powrotu
    const backBtn = document.querySelector('#languageSubmenu .dashboard-back-btn span');
    if (backBtn && translations[currentLang] && translations[currentLang].dashboard) {
        backBtn.textContent = translations[currentLang].dashboard.back || 'Wstecz';
    }
}

// Mobile navigation toggle functionality
function setupMobileNav() {
    const dashboardToggle = document.querySelector('.mobile-dashboard-toggle');
    const mobileDashboard = document.getElementById('mobileDashboard');
    const dashboardCloseBtn = document.querySelector('.dashboard-close-btn');
    const sideMenu = document.getElementById('globalSideMenu');
    const menuBtn = document.getElementById('menuBtn');
    
    if (!dashboardToggle || !mobileDashboard) return;
    
    let isDashboardOpen = false;
    
    dashboardToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (isDashboardOpen) {
            closeDashboard();
        } else {
            openDashboard();
        }
    });
    
    dashboardCloseBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        closeDashboard();
    });
    
    function openDashboard() {
        // Close side-menu if open
        if (sideMenu && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
            sideMenu.classList.add('closing');
            
            if (menuBtn) {
                menuBtn.style.display = 'block';
                menuBtn.style.opacity = '1';
                menuBtn.style.pointerEvents = 'auto';
            }
            
            setTimeout(() => {
                sideMenu.classList.remove('closing');
                sideMenu.classList.add('hidden');
            }, 300);
        }
        
        mobileDashboard.classList.remove('hidden');
        mobileDashboard.classList.add('open');
        dashboardToggle.classList.add('active');
        isDashboardOpen = true;
    }
    
    function closeDashboard() {
        mobileDashboard.classList.remove('open');
        mobileDashboard.classList.add('closing');
        dashboardToggle.classList.remove('active');
        
        setTimeout(() => {
            mobileDashboard.classList.remove('closing');
            mobileDashboard.classList.add('hidden');
            isDashboardOpen = false;
        }, 300);
    }
    
    // Dashboard button actions
    const dashboardBtns = document.querySelectorAll('.dashboard-btn');
    dashboardBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Zapobiega propagacji zdarzenia
            const action = this.dataset.action;
            const lang = this.dataset.lang;
            
            switch(action) {
                case 'home':
                    backToHome();
                    break;
                case 'profile':
                    showUserProfile();
                    break;
                case 'theme':
                    toggleDarkMode();
                    updateDashboardThemeBtn();
                    break;
                case 'language-menu':
                    toggleLanguageSubmenu();
                    return; // Nie zamykaj dashboardu
                case 'language':
                    if (lang) {
                        switchLanguage(lang);
                        updateDashboardLanguageBtn();
                        // Zamknij TYLKO submenu językowe, NIE zamykaj dashboardu
                        closeLanguageSubmenu();
                    }
                    return; // NIE zamykaj dashboardu
                case 'leapYear':
                    // Navigate to leap year app
                    document.querySelector('.tile[data-app="leapYear"]')?.click();
                    break;
                case 'matrixCalculator':
                    // Navigate to matrix calculator app
                    const matrixTile = document.querySelector('.tile[data-app="matrixCalc"]');
                    if (matrixTile) {
                        matrixTile.click();
                    } else {
                        // Bezpośrednie przejście do aplikacji
                        currentScreen = "app";
                        document.querySelector('.welcome-screen').style.display = 'none';
                        document.querySelector('.home-screen').style.display = 'none';
                        document.querySelector('.app-container').style.display = 'block';
                        
                        document.querySelectorAll('.app-content').forEach(content => {
                            content.classList.remove('active');
                        });
                        
                        document.getElementById('matrixCalcApp').classList.add('active');
                        
                        const menuBtn = document.getElementById('menuBtn');
                        if (menuBtn) {
                            menuBtn.style.display = 'block';
                            menuBtn.style.opacity = '1';
                            menuBtn.style.pointerEvents = 'auto';
                        }
                        
                        updateUI();
                    }
                    break;
                case 'about':
                    showAboutFromDashboard();
                    break;
                case 'instructions':
                    showInstructionsFromDashboard();
                    break;
            }
            
            // Zamknij główny dashboard TYLKO dla akcji innych niż language-menu i language
            if (action !== 'language-menu' && action !== 'language') {
                closeDashboard();
            }
        });
    });
    
    // Obsługa przycisku powrotu w submenu językowym
    const dashboardBackBtn = document.querySelector('.dashboard-back-btn');
    dashboardBackBtn?.addEventListener('click', function(e) {
        e.stopPropagation(); // Zapobiega propagacji zdarzenia
        closeLanguageSubmenu();
    });
    
    function toggleLanguageSubmenu() {
        const languageSubmenu = document.getElementById('languageSubmenu');
        const languageBtn = document.querySelector('[data-action="language-menu"]');
        
        if (languageSubmenu && languageBtn) {
            // Zaktualizuj teksty w submenu przed pokazaniem
            updateLanguageSubmenuTexts();
            languageSubmenu.classList.toggle('active');
            languageBtn.classList.toggle('active');
        }
    }
    
    function closeLanguageSubmenu() {
        const languageSubmenu = document.getElementById('languageSubmenu');
        const languageBtn = document.querySelector('[data-action="language-menu"]');
        
        if (languageSubmenu && languageBtn) {
            languageSubmenu.classList.remove('active');
            languageBtn.classList.remove('active');
        }
    }
    
    // Close dashboard when clicking outside
    document.addEventListener('click', function(e) {
        if (isDashboardOpen && 
            !mobileDashboard.contains(e.target) && 
            !dashboardToggle.contains(e.target)) {
            closeDashboard();
        }
    });
    
    // Close dashboard on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDashboardOpen) {
            closeDashboard();
        }
    });
    
    // Hide dashboard on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isDashboardOpen) {
            closeDashboard();
        }
    });
}

function updateDashboardThemeBtn() {
    console.log('updateDashboardThemeBtn called, darkMode:', darkMode);
    
    if (!translations[currentLang] || !translations[currentLang].dashboard) {
        console.warn('Translations not available');
        return;
    }
    
    const themeBtn = document.querySelector('.dashboard-btn[data-action="theme"]');
    console.log('Theme button found:', themeBtn);
    
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const span = themeBtn.querySelector('span');
        if (darkMode) {
            icon.className = 'fas fa-sun';
            span.textContent = translations[currentLang].dashboard.lightMode || 'Tryb jasny';
            console.log('Set to light mode icon/text');
        } else {
            icon.className = 'fas fa-moon';  
            span.textContent = translations[currentLang].dashboard.darkMode || 'Tryb ciemny';
            console.log('Set to dark mode icon/text');
        }
    }
}

// Make function globally available
window.updateDashboardThemeBtn = updateDashboardThemeBtn;

function updateDashboardLanguageBtn() {
    const langBtn = document.querySelector('.dashboard-btn[data-action="language"]');
    if (langBtn) {
        const span = langBtn.querySelector('span');
        const langNames = {
            pl: 'Polski',
            en: 'English',
            de: 'Deutsch'
        };
        span.textContent = langNames[currentLang] || 'Język';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Preload essential resources
    await resourceLoader.preloadEssentials();
    
    // Load saved dark mode preference
    loadSavedDarkMode();
    
    setupMenu();
    setupMobileNav();
    initializeUI();
    initializeTheme();
    initializeLeapYear();
    updateWelcomeScreen();
    initializeMatrixCalculator();
    
    // Update mobile dashboard theme button on load - with delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof updateDashboardThemeBtn === 'function') {
            updateDashboardThemeBtn();
            console.log('Initial dashboard theme button update');
        }
    }, 100);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }

    const showUserProfileBtn = document.getElementById('showUserProfileBtn');
    if (showUserProfileBtn) {
        showUserProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showUserProfile();
        });
    }

    // === WELCOME SCREEN LANG MENU ===
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn .lang-btn');
    const welcomeLangMenu = document.querySelector('.welcome-lang-menu');

    if (welcomeLangBtn && welcomeLangMenu) {
        welcomeLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Hide nav lang menu if open
            const navLangMenu = document.querySelector('.nav-lang-menu');
            if (navLangMenu.classList.contains('open')) {
                navLangMenu.classList.remove('open');
                navLangMenu.classList.add('closing');
                navLangMenu.addEventListener('animationend', () => {
                    navLangMenu.style.display = 'none';
                    navLangMenu.classList.remove('closing');
                }, { once: true });
            }

            if (!welcomeLangMenu.classList.contains('open')) {
                welcomeLangMenu.classList.remove('closing');
                welcomeLangMenu.style.display = 'block';
                welcomeLangMenu.classList.add('open');
            } else {
                welcomeLangMenu.classList.remove('open');
                welcomeLangMenu.classList.add('closing');
                welcomeLangMenu.addEventListener('animationend', () => {
                    if (welcomeLangMenu.classList.contains('closing')) {
                        welcomeLangMenu.style.display = 'none';
                        welcomeLangMenu.classList.remove('closing');
                    }
                }, { once: true });
            }
        });

        welcomeLangMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
                welcomeLangMenu.classList.remove('open');
                welcomeLangMenu.classList.add('closing');
                welcomeLangMenu.addEventListener('animationend', () => {
                    welcomeLangMenu.style.display = 'none';
                    welcomeLangMenu.classList.remove('closing');
                }, { once: true });
            }
            e.stopPropagation();
        });
    }

    // === NAV-BAR LANG MENU ===
    const langBtn = document.querySelector('.nav-bar .lang-btn');
    const navLangMenu = document.querySelector('.nav-lang-menu');

    if (langBtn && navLangMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Hide welcome lang menu if open
            const welcomeLangMenu = document.querySelector('.welcome-lang-menu');
            if (welcomeLangMenu.classList.contains('open')) {
                welcomeLangMenu.classList.remove('open');
                welcomeLangMenu.classList.add('closing');
                welcomeLangMenu.addEventListener('animationend', () => {
                    welcomeLangMenu.style.display = 'none';
                    welcomeLangMenu.classList.remove('closing');
                }, { once: true });
            }

            if (!navLangMenu.classList.contains('open')) {
                navLangMenu.classList.remove('closing');
                navLangMenu.style.display = 'block';
                navLangMenu.classList.add('open');
            } else {
                navLangMenu.classList.remove('open');
                navLangMenu.classList.add('closing');
                navLangMenu.addEventListener('animationend', () => {
                    if (navLangMenu.classList.contains('closing')) {
                        navLangMenu.style.display = 'none';
                        navLangMenu.classList.remove('closing');
                    }
                }, { once: true });
            }
        });

        navLangMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
                navLangMenu.classList.remove('open');
                navLangMenu.classList.add('closing');
                navLangMenu.addEventListener('animationend', () => {
                    navLangMenu.style.display = 'none';
                    navLangMenu.classList.remove('closing');
                }, { once: true });
            }
            e.stopPropagation();
        });
    }

    const defaultLang = "pl";
    const flags = {
        pl: "https://flagcdn.com/w40/pl.png",
        en: "https://flagcdn.com/w40/gb.png",
        de: "https://flagcdn.com/w40/de.png"
    };
    // Initialize all lang-btn elements with the default flag
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.style.backgroundImage = `url(${flags[defaultLang]})`;
        btn.classList.add('show'); // Dodaj animację pojawiania się
    });
});

// Side Menu Setup Function
function setupMenu() {
    // Menu button functionality
    const menuBtn = document.getElementById('menuBtn');
    const globalSideMenu = document.getElementById('globalSideMenu');
    const closeSideMenuBtn = document.getElementById('closeSideMenuBtn');

    if (menuBtn && globalSideMenu) {
        menuBtn.addEventListener('click', () => {
            if (globalSideMenu.classList.contains('open')) {
                globalSideMenu.classList.remove('open');
                globalSideMenu.classList.add('closing');
                setTimeout(() => {
                    globalSideMenu.classList.remove('closing');
                    globalSideMenu.classList.add('hidden');
                }, 600);
            } else {
                globalSideMenu.classList.remove('hidden');
                globalSideMenu.classList.remove('closing');
                globalSideMenu.classList.add('open');
            }
        });
    }

    if (closeSideMenuBtn && globalSideMenu) {
        closeSideMenuBtn.addEventListener('click', () => {
            globalSideMenu.classList.remove('open');
            globalSideMenu.classList.add('closing');
            setTimeout(() => {
                globalSideMenu.classList.remove('closing');
                globalSideMenu.classList.add('hidden');
            }, 600);
        });
    }

    // Menu items functionality
    const homeMenuItem = document.getElementById('homeMenuItem');
    const appMenuItem = document.getElementById('appMenuItem');
    const helpMenuItem = document.getElementById('helpMenuItem');
    const appSubmenu = document.getElementById('appSubmenu');
    const helpSubmenu = document.getElementById('helpSubmenu');

    // Home menu item
    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', () => {
            window.location.href = 'index.html';
            closeSideMenu();
        });
    }

    // App menu item
    if (appMenuItem && appSubmenu) {
        appMenuItem.addEventListener('click', () => {
            toggleSubmenu(appSubmenu, appMenuItem);
        });
    }

    // Help menu item
    if (helpMenuItem && helpSubmenu) {
        helpMenuItem.addEventListener('click', () => {
            toggleSubmenu(helpSubmenu, helpMenuItem);
        });
    }

    // App submenu items
    const appSubmenuItems = document.querySelectorAll('#appSubmenu .submenu-item');
    appSubmenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const appType = item.dataset.app;
            if (appType) {
                const tile = document.querySelector(`.tile[data-app="${appType}"]`);
                if (tile) {
                    tile.click();
                }
            }
            closeSideMenu();
        });
    });

    // Help submenu items
    const aboutMenuItem = document.getElementById('aboutMenuItem');
    const instructionsMenuItem = document.getElementById('instructionsMenuItem');

    if (aboutMenuItem) {
        aboutMenuItem.addEventListener('click', () => {
            window.location.href = 'about.html';
            closeSideMenu();
        });
    }

    if (instructionsMenuItem) {
        instructionsMenuItem.addEventListener('click', () => {
            window.location.href = 'instructions.html';
            closeSideMenu();
        });
    }

    // Back buttons in submenus
    const backBtns = document.querySelectorAll('.submenu .back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const submenu = e.target.closest('.submenu');
            if (submenu) {
                submenu.classList.remove('open');
                submenu.classList.add('closing');
                setTimeout(() => {
                    submenu.classList.remove('closing');
                }, 600);
            }
        });
    });

    function toggleSubmenu(submenu, menuItem) {
        if (submenu.classList.contains('open')) {
            submenu.classList.remove('open');
            submenu.classList.add('closing');
            menuItem.classList.remove('active');
            setTimeout(() => {
                submenu.classList.remove('closing');
            }, 600);
        } else {
            submenu.classList.add('open');
            menuItem.classList.add('active');
        }
    }

    function closeSideMenu() {
        if (globalSideMenu) {
            globalSideMenu.classList.remove('open');
            globalSideMenu.classList.add('closing');
            setTimeout(() => {
                globalSideMenu.classList.remove('closing');
                globalSideMenu.classList.add('hidden');
            }, 600);
        }
    }
}
function initializeUI() {
    if (typeof optimizeProfilePage === 'function') optimizeProfilePage();
    if (typeof createWaterDrops === 'function') createWaterDrops();
    
    const menuBtn = document.getElementById('menuBtn');
    const globalSideMenu = document.getElementById('globalSideMenu');
    const mobileDashboard = document.getElementById('mobileDashboard');
    const dashboardToggle = document.querySelector('.mobile-dashboard-toggle');

    if (currentScreen === "welcome") {
        // Ukryj wszystkie elementy nawigacji na welcome screen
        if (menuBtn) {
            menuBtn.style.display = 'none';
            menuBtn.style.opacity = '0';
            menuBtn.style.pointerEvents = 'none';
        }
        if (globalSideMenu) {
            globalSideMenu.classList.add('hidden');
            globalSideMenu.classList.remove('open');
        }
        if (mobileDashboard) {
            mobileDashboard.classList.add('hidden');
            mobileDashboard.style.display = 'none';
        }
        if (dashboardToggle) {
            dashboardToggle.style.display = 'none';
            dashboardToggle.style.visibility = 'hidden';
        }
    } else {
        // Pokaż wszystkie elementy nawigacji po welcome screen
        if (menuBtn) {
            menuBtn.style.display = 'block';
            menuBtn.style.opacity = '1';
            menuBtn.style.pointerEvents = 'auto';
        }
        if (globalSideMenu) {
            globalSideMenu.classList.remove('hidden');
        }
        if (mobileDashboard) {
            mobileDashboard.classList.remove('hidden');
            mobileDashboard.style.display = '';
        }
        if (dashboardToggle && window.innerWidth <= 768) {
            dashboardToggle.style.display = 'flex';
            dashboardToggle.style.visibility = 'visible';
        }
    }
}

// About and Instructions handlers
async function showAboutFromDashboard() {
    // Try template-based inline first
    if (window.showAboutInlineFromTemplate && window.showAboutInlineFromTemplate()) {
        return;
    }

    // Try loading external JS if template not available
    try {
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) return resolve();
                const s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.onload = resolve;
                s.onerror = reject;
                document.body.appendChild(s);
            });
        };
        
        await loadScript('js/about.js');
        if (typeof window.showAboutInline === 'function') {
            window.showAboutInline();
            return;
        }
    } catch (err) {
        console.warn('Nie udało się załadować about.js:', err);
    }

    console.error('Nie można wyświetlić strony About - brak szablonu i pliku JS');
}

async function showInstructionsFromDashboard() {
    // Try template-based inline first
    if (window.showInstructionsInlineFromTemplate && window.showInstructionsInlineFromTemplate()) {
        return;
    }

    // Try loading external JS if template not available
    try {
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) return resolve();
                const s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.onload = resolve;
                s.onerror = reject;
                document.body.appendChild(s);
            });
        };
        
        await loadScript('js/instructions.js');
        if (typeof window.showInstructionsInline === 'function') {
            window.showInstructionsInline();
            return;
        }
    } catch (err) {
        console.warn('Nie udało się załadować instructions.js:', err);
    }

    console.error('Nie można wyświetlić strony Instructions - brak szablonu i pliku JS');
}

// Funkcje do wyświetlania About i Instructions jako inline overlay
window.showAboutInlineFromTemplate = function() {
    // Ukryj wszystkie inne widoki
    hideAllScreens();
    
    // Stwórz lub pokaż kontener About
    let aboutContainer = document.getElementById('about-inline-container');
    if (!aboutContainer) {
        aboutContainer = createAboutContainer();
        document.body.appendChild(aboutContainer);
    }
    
    aboutContainer.style.display = 'flex';
    return true;
};

window.showInstructionsInlineFromTemplate = function() {
    // Ukryj wszystkie inne widoki
    hideAllScreens();
    
    // Stwórz lub pokaż kontener Instructions
    let instructionsContainer = document.getElementById('instructions-inline-container');
    if (!instructionsContainer) {
        instructionsContainer = createInstructionsContainer();
        document.body.appendChild(instructionsContainer);
    }
    
    instructionsContainer.style.display = 'flex';
    return true;
};

function hideAllScreens() {
    // Ukryj welcome, home, app-container
    const welcomeScreen = document.querySelector('.welcome-screen');
    const homeScreen = document.querySelector('.home-screen');
    const appContainer = document.querySelector('.app-container');
    
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (homeScreen) homeScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'none';
    
    // Ukryj wszystkie aplikacje
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ukryj inne inline kontenery
    const aboutContainer = document.getElementById('about-inline-container');
    const instructionsContainer = document.getElementById('instructions-inline-container');
    
    if (aboutContainer) aboutContainer.style.display = 'none';
    if (instructionsContainer) instructionsContainer.style.display = 'none';
}

function createAboutContainer() {
    const container = document.createElement('div');
    container.id = 'about-inline-container';
    container.className = 'inline-page-container';
    container.innerHTML = `
        <div class="inline-page-content">
            <button class="inline-page-close" onclick="closeInlinePage()">
                <i class="fas fa-times"></i>
            </button>
            <div class="inline-page-body">
                <h1 data-translate-key="about.title">O aplikacji</h1>
                <p data-translate-key="about.description">
                    Advanced Math to interaktywna aplikacja edukacyjna stworzona, 
                    aby ułatwić naukę matematyki poprzez praktyczne narzędzia i kalkulatory.
                </p>
                <h2>Funkcje</h2>
                <ul>
                    <li>Kalkulator macierzy z obsługą różnych operacji</li>
                    <li>Sprawdzanie lat przestępnych</li>
                    <li>Wsparcie wielu języków (PL, EN, DE)</li>
                    <li>Tryb ciemny</li>
                    <li>System profili użytkownika</li>
                </ul>
                <p class="version">Wersja 2.0.0</p>
            </div>
        </div>
    `;
    return container;
}

function createInstructionsContainer() {
    const container = document.createElement('div');
    container.id = 'instructions-inline-container';
    container.className = 'inline-page-container';
    container.innerHTML = `
        <div class="inline-page-content">
            <button class="inline-page-close" onclick="closeInlinePage()">
                <i class="fas fa-times"></i>
            </button>
            <div class="inline-page-body">
                <h1 data-translate-key="instructions.title">Instrukcje</h1>
                <h2>Jak korzystać z aplikacji</h2>
                <ol>
                    <li>Wybierz aplikację z menu bocznego lub z ekranu głównego</li>
                    <li>Korzystaj z dostępnych narzędzi i kalkulatorów</li>
                    <li>Zmień język aplikacji w prawym górnym rogu</li>
                    <li>Przełącz tryb ciemny/jasny według preferencji</li>
                    <li>Zaloguj się aby zapisać swoje wyniki i ustawienia</li>
                </ol>
                <h2>Kalkulator Macierzy</h2>
                <p>Wprowadź wymiary macierzy, wypełnij wartości i wybierz operację do wykonania.</p>
                <h2>Rok Przestępny</h2>
                <p>Wprowadź rok, aby sprawdzić czy jest przestępny.</p>
            </div>
        </div>
    `;
    return container;
}

function closeInlinePage() {
    hideAllScreens();
    
    // Pokaż ekran główny
    const homeScreen = document.querySelector('.home-screen');
    if (homeScreen) {
        homeScreen.style.display = 'flex';
    }
    
    updateUI();
}

// Eksportuj jako globalna funkcja dla onclick
window.closeInlinePage = closeInlinePage;

// Fallback dla selektora :has() — Safari starsze wersje nie wspierają :has()
(function() {
    function updateWelcomeActive() {
        const welcome = document.querySelector('.welcome-screen');
        if (!welcome) return;
        const hasVisible = !welcome.classList.contains('hidden') && getComputedStyle(welcome).display !== 'none' && getComputedStyle(welcome).visibility !== 'hidden';
        if (hasVisible) document.body.classList.add('welcome-active'); else document.body.classList.remove('welcome-active');
    }

    // If browser supports :has(), do nothing — CSS handles it
    try {
        if (!CSS.supports('selector(:has(*))')) {
            // initial
            document.addEventListener('DOMContentLoaded', updateWelcomeActive);
            // observe changes to welcome-screen class list/attributes
            const welcome = document.querySelector('.welcome-screen');
            if (welcome) {
                const mo = new MutationObserver(updateWelcomeActive);
                mo.observe(welcome, { attributes: true, attributeFilter: ['class', 'style'] });
            }
            // also in case welcome element is added later
            const observerBody = new MutationObserver(() => {
                const w = document.querySelector('.welcome-screen');
                if (w) {
                    updateWelcomeActive();
                }
            });
            observerBody.observe(document.documentElement || document.body, { childList: true, subtree: true });
        }
    } catch (e) {
        // Fail gracefully
        document.addEventListener('DOMContentLoaded', updateWelcomeActive);
    }
})();