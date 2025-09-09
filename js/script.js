// Global variables
let currentLang = "pl";
let currentScreen = "welcome";
let isUserProfileVisible = false;
let darkMode = false;

// Function to show/hide close button
function showCloseButton() {
    const closeBtn = document.getElementById('closeUserPageBtn');
    if (closeBtn) {
        closeBtn.style.display = 'block';
    }
}

function hideCloseButton() {
    const closeBtn = document.getElementById('closeUserPageBtn');
    if (closeBtn) {
        closeBtn.style.display = 'none';
    }
}

// Function to dynamically load CSS files
function loadCSS(filename) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = filename;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Function to load all required CSS files
async function loadAllCSS() {
    try {
        const cssFiles = [
            'css/leap-year.css',
            'css/matrix-calculator.css',
            'css/home-screen.css',
            'css/user-profile.css',
            'css/dark-mode.css'
        ];

        for (const file of cssFiles) {
            await loadCSS(file);
        }
        console.log('All CSS files loaded successfully');
    } catch (error) {
        console.error('Error loading CSS files:', error);
    }
}

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
    
    // Hide close button if not in user profile
    const userProfileApp = document.getElementById('userProfileApp');
    if (!userProfileApp || !userProfileApp.classList.contains('active')) {
        hideCloseButton();
    }
}

function updateWelcomeScreen() {
    updateUserProfileTranslations();
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    
    // Zapisz preferencję użytkownika
    localStorage.setItem('darkMode', darkMode);
    
    // Animacja przejścia między ikonami
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        // Usuń istniejące klasy animacji
        themeToggleBtn.classList.remove('light', 'dark');
        
        // Dodaj odpowiednią klasę w zależności od trybu
        if (darkMode) {
            themeToggleBtn.classList.add('dark');
        } else {
            themeToggleBtn.classList.add('light');
        }
    }
}

function initializeTheme() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        darkMode = true;
        document.body.classList.add('dark-mode');
        
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.classList.remove('light');
            themeToggleBtn.classList.add('dark');
        }
    } else {
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
    if (savedDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkMode = true;
    } else if (savedDarkMode === 'disabled') {
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
    const themeBtn = document.querySelector('.dashboard-btn[data-action="theme"]');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const span = themeBtn.querySelector('span');
        if (darkMode) {
            icon.className = 'fas fa-sun';
            span.textContent = translations[currentLang].dashboard.lightMode;
        } else {
            icon.className = 'fas fa-moon';
            span.textContent = translations[currentLang].dashboard.darkMode;
        }
    }
}

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
    await loadAllCSS();
    
    // Load saved dark mode preference
    loadSavedDarkMode();
    
    // Hide close button on startup
    hideCloseButton();
    
    setupMenu();
    setupMobileNav();
    initializeUI();
    initializeTheme();
    initializeLeapYear();
    updateWelcomeScreen();
    initializeMatrixCalculator();
    initializeAppTiles();
    initializeWelcomeTransition();
    ensureAppInitialization();

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
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

// Initialize app tiles functionality
function initializeAppTiles() {
    const tiles = document.querySelectorAll('.tile[data-app]');
    
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const appName = tile.dataset.app;
            showApp(appName);
        });
    });
}

// Show specific app
function showApp(appName) {
    currentScreen = "app";
    
    // Remove user profile class and hide close button when opening any app (not user profile)
    document.body.classList.remove('user-profile-active');
    hideCloseButton();
    
    // Hide welcome and home screens
    document.querySelector('.welcome-screen').style.display = 'none';
    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
    
    // Hide all app contents
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show specific app
    const appMap = {
        'leapYear': 'leapYearApp',
        'matrixCalc': 'matrixCalcApp',
        'functionCalculator': 'functionCalculatorApp',
        'equationSolver': 'equationSolverApp',
        'unitConverter': 'unitConverterApp',
        'statisticalCalculator': 'statisticalCalculatorApp',
        'combinatoricsCalculator': 'combinatoricsCalculatorApp',
        'matrixCalculator': 'matrixCalculatorApp'
    };
    
    const targetAppId = appMap[appName];
    if (targetAppId) {
        const targetApp = document.getElementById(targetAppId);
        if (targetApp) {
            targetApp.classList.add('active');
        }
    }
    
    // Show menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.style.display = 'block';
        menuBtn.style.opacity = '1';
        menuBtn.style.pointerEvents = 'auto';
    }
    
    // Update UI
    updateUI();
    
    // Initialize specific app if needed
    switch (appName) {
        case 'leapYear':
            if (typeof initializeLeapYear === 'function') initializeLeapYear();
            break;
        case 'matrixCalc':
            if (typeof initializeMatrixCalculator === 'function') initializeMatrixCalculator();
            break;
        case 'functionCalculator':
            if (!window.functionCalculator) {
                window.functionCalculator = new FunctionCalculator();
            }
            break;
        case 'equationSolver':
            if (!window.equationSolver) {
                window.equationSolver = new EquationSolver();
            }
            break;
        case 'unitConverter':
            if (!window.unitConverter) {
                window.unitConverter = new UnitConverter();
            }
            break;
        case 'statisticalCalculator':
            if (!window.statisticalCalculator) {
                window.statisticalCalculator = new StatisticalCalculator();
            }
            break;
        case 'combinatoricsCalculator':
            if (!window.combinatoricsCalculator) {
                window.combinatoricsCalculator = new CombinatoricsCalculator();
            }
            break;
        case 'matrixCalculator':
            if (!window.enhancedMatrixCalculator) {
                window.enhancedMatrixCalculator = new EnhancedMatrixCalculator();
            }
            break;
    }
}

// Funkcja do zapewnienia inicjalizacji aplikacji
function ensureAppInitialization() {
    // Inicjalizuj wszystkie aplikacje z opóźnieniem
    setTimeout(() => {
        // Function Calculator
        if (typeof FunctionCalculator !== 'undefined' && !window.functionCalculator) {
            try {
                window.functionCalculator = new FunctionCalculator();
                console.log('Function Calculator initialized');
            } catch (e) {
                console.warn('Function Calculator initialization failed:', e);
            }
        }
        
        // Equation Solver
        if (typeof EquationSolver !== 'undefined' && !window.equationSolver) {
            try {
                window.equationSolver = new EquationSolver();
                console.log('Equation Solver initialized');
            } catch (e) {
                console.warn('Equation Solver initialization failed:', e);
            }
        }
        
        // Unit Converter
        if (typeof UnitConverter !== 'undefined' && !window.unitConverter) {
            try {
                window.unitConverter = new UnitConverter();
                console.log('Unit Converter initialized');
            } catch (e) {
                console.warn('Unit Converter initialization failed:', e);
            }
        }
        
        // Statistical Calculator
        if (typeof StatisticalCalculator !== 'undefined' && !window.statisticalCalculator) {
            try {
                window.statisticalCalculator = new StatisticalCalculator();
                console.log('Statistical Calculator initialized');
            } catch (e) {
                console.warn('Statistical Calculator initialization failed:', e);
            }
        }
        
        // Combinatorics Calculator
        if (typeof CombinatoricsCalculator !== 'undefined' && !window.combinatoricsCalculator) {
            try {
                window.combinatoricsCalculator = new CombinatoricsCalculator();
                console.log('Combinatorics Calculator initialized');
            } catch (e) {
                console.warn('Combinatorics Calculator initialization failed:', e);
            }
        }
        
        // Enhanced Matrix Calculator
        if (typeof EnhancedMatrixCalculator !== 'undefined' && !window.enhancedMatrixCalculator) {
            try {
                window.enhancedMatrixCalculator = new EnhancedMatrixCalculator();
                console.log('Enhanced Matrix Calculator initialized');
            } catch (e) {
                console.warn('Enhanced Matrix Calculator initialization failed:', e);
            }
        }
    }, 1000); // Opóźnienie 1 sekundy aby upewnić się że wszystkie skrypty są załadowane
}

// Welcome screen to home screen transition
function initializeWelcomeTransition() {
    // Handle click anywhere on welcome screen
    document.querySelector('.welcome-screen').addEventListener('click', (e) => {
        // Don't trigger if clicking on language button or menu
        if (!e.target.closest('.welcome-lang-btn') && !e.target.closest('.welcome-lang-menu')) {
            transitionToHomeScreen();
        }
    });
    
    // Handle any key press
    document.addEventListener('keydown', (e) => {
        if (currentScreen === "welcome") {
            // Don't trigger on modifier keys or special keys
            if (!e.ctrlKey && !e.altKey && !e.metaKey && 
                e.key !== 'Tab' && e.key !== 'Shift' && e.key !== 'CapsLock') {
                transitionToHomeScreen();
            }
        }
    });
}

function transitionToHomeScreen() {
    if (currentScreen !== "welcome") return;
    
    currentScreen = "home";
    
    // Start transition animation
    const welcomeScreen = document.querySelector('.welcome-screen');
    const homeScreen = document.querySelector('.home-screen');
    
    welcomeScreen.classList.add('fade-out');
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        homeScreen.style.display = 'flex';
        
        // Show navigation elements
        const navBar = document.querySelector('.nav-bar');
        if (navBar) {
            navBar.style.display = 'flex';
            navBar.style.animation = 'fadeInDown 0.5s ease-out forwards';
        }
        
        const dashboardToggle = document.querySelector('.mobile-dashboard-toggle');
        if (dashboardToggle && window.innerWidth <= 768) {
            dashboardToggle.style.display = 'flex';
            dashboardToggle.style.visibility = 'visible';
        }
        
        // Update UI
        updateHomeUI();
        initializeUI();
    }, 300);
}