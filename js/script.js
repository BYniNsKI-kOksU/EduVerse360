// Global variables
let currentLang = "pl";
let currentScreen = "welcome";
let isUserProfileVisible = false;
let darkMode = false;

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
    
    updateWelcomeScreen();
    updateHomeUI();
    updateUI();

    const flags = {
        pl: "https://flagcdn.com/w40/pl.png",
        en: "https://flagcdn.com/w40/gb.png",
        de: "https://flagcdn.com/w40/de.png"
    };

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.style.backgroundImage = `url(${flags[lang]})`;
    });
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

// Mobile navigation toggle functionality
function setupMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navBar = document.querySelector('.nav-bar');
    const sideMenu = document.getElementById('globalSideMenu');
    const menuBtn = document.getElementById('menuBtn');
    
    if (!navToggle || !navBar) return;
    
    let isNavExpanded = false;
    
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (isNavExpanded) {
            // Collapse nav-bar
            navBar.classList.remove('mobile-expanded');
            navBar.classList.add('mobile-collapsing');
            
            setTimeout(() => {
                navBar.classList.remove('mobile-collapsing');
                isNavExpanded = false;
            }, 300);
            
        } else {
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
            
            // Expand nav-bar
            navBar.classList.add('mobile-expanded');
            isNavExpanded = true;
        }
    });
    
    // Close nav-bar when clicking outside
    document.addEventListener('click', function(e) {
        if (isNavExpanded && 
            !navBar.contains(e.target) && 
            !navToggle.contains(e.target)) {
            
            navBar.classList.remove('mobile-expanded');
            navBar.classList.add('mobile-collapsing');
            
            setTimeout(() => {
                navBar.classList.remove('mobile-collapsing');
                isNavExpanded = false;
            }, 300);
        }
    });
    
    // Close nav-bar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isNavExpanded) {
            navBar.classList.remove('mobile-expanded');
            navBar.classList.add('mobile-collapsing');
            
            setTimeout(() => {
                navBar.classList.remove('mobile-collapsing');
                isNavExpanded = false;
            }, 300);
        }
    });
    
    // Ensure nav-bar is hidden on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isNavExpanded) {
            navBar.classList.remove('mobile-expanded', 'mobile-collapsing');
            isNavExpanded = false;
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllCSS();

    setupMenu();
    setupMobileNav(); // Add mobile nav setup
    initializeUI();
    initializeTheme();
    initializeLeapYear();
    updateWelcomeScreen();
    initializeMatrixCalculator();

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