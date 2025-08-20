// Global variables
let currentLang = "pl";
let currentScreen = "welcome";
let isUserProfileVisible = false;

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
            'css/user-profile.css'
        ];

        for (const file of cssFiles) {
            await loadCSS(file);
        }
        console.log('All CSS files loaded successfully');
    } catch (error) {
        console.error('Error loading CSS files:', error);
    }
}

// Side menu handling
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('globalSideMenu');

function setupMenu() {
    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', function(e) {
            e.stopPropagation();
            backToHome();
            if (sideMenu) {
                sideMenu.classList.remove('open');
                menuBtn.style.display = 'block';
            }
        });
    }

    if (!menuBtn || !sideMenu) return;

    menuBtn.replaceWith(menuBtn.cloneNode(true));
    const newMenuBtn = document.getElementById('menuBtn');
    
    newMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sideMenu.classList.toggle('open');
        if (sideMenu.classList.contains('open')) {
            newMenuBtn.style.display = 'none';
        } else {
            newMenuBtn.style.display = 'block';
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#globalSideMenu') && e.target !== newMenuBtn) {
            sideMenu.classList.remove('open');
            newMenuBtn.style.display = 'block';
        }
    });

    const setupSubmenu = (trigger, submenu) => {
        if (!trigger || !submenu) return;
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            submenu.classList.toggle('open');
        });
    };

    setupSubmenu(document.getElementById('appMenuItem'), document.getElementById('appSubmenu'));
    setupSubmenu(document.getElementById('helpMenuItem'), document.getElementById('helpSubmenu'));
    setupSubmenu(document.getElementById('homeAppMenuItem'), document.getElementById('homeAppSubmenu'));
    setupSubmenu(document.getElementById('homeHelpMenuItem'), document.getElementById('homeHelpSubmenu'));

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.closest('.submenu').classList.remove('open');
        });
    });

    document.querySelectorAll('.submenu-item[data-app]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const app = this.dataset.app;
            if (app) {
                currentScreen = "app";
                document.querySelector('.welcome-screen').style.display = 'none';
                document.querySelector('.home-screen').style.display = 'none';
                document.querySelector('.app-container').style.display = 'block';
                
                document.querySelectorAll('.app-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const appElement = document.getElementById(app + 'App');
                if (appElement) {
                    appElement.classList.add('active');
                }
                
                const menuBtn = document.getElementById('menuBtn');
                if (menuBtn) {
                    menuBtn.style.display = 'block';
                    menuBtn.style.opacity = '1';
                    menuBtn.style.pointerEvents = 'auto';
                }
                
                if (sideMenu) {
                    sideMenu.classList.remove('open');
                }
                
                updateUI();
            }
        });
    });

    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showUserProfile();
        });
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#globalSideMenu') && e.target !== menuBtn) {
            if (sideMenu) sideMenu.classList.remove('open');
            if (menuBtn) menuBtn.style.display = 'block';
            
            if (isUserProfileVisible && !e.target.closest('.user-profile-container') && e.target !== userBtn) {
                document.getElementById('userProfileApp').classList.remove('active');
                isUserProfileVisible = false;
                backToHome();
            }
        }
    });
}

function resetMenuState() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('globalSideMenu');
    
    if (menuBtn) {
        menuBtn.style.display = 'block';
        menuBtn.style.opacity = '1';
        menuBtn.style.pointerEvents = 'auto';
    }
    
    if (sideMenu) {
        sideMenu.classList.remove('open');
        sideMenu.classList.remove('hidden');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllCSS();
    updateWelcomeScreen();
    setupMenu();
    initializeUI();
    initializeLeapYear();
    initializeMatrixCalculator();

    // === WELCOME SCREEN LANG MENU ===
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn .lang-btn');
    const welcomeLangMenu = document.querySelector('.welcome-lang-btn .lang-menu');

    if (welcomeLangBtn && welcomeLangMenu) {
        welcomeLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();

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
                welcomeLangMenu.style.display = 'none';
            }
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.welcome-lang-btn')) {
                if (welcomeLangMenu.classList.contains('open')) {
                    welcomeLangMenu.classList.remove('open');
                    welcomeLangMenu.classList.add('closing');
                    welcomeLangMenu.addEventListener('animationend', () => {
                        welcomeLangMenu.style.display = 'none';
                        welcomeLangMenu.classList.remove('closing');
                    }, { once: true });
                }
            }
        });
    }

    // === NAV-BAR LANG MENU ===
    const langContainer = document.querySelector('.nav-bar .lang-container');
    const langBtn = langContainer?.querySelector('.lang-btn');
    const langMenu = langContainer?.querySelector('.lang-menu');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!langMenu.classList.contains('open')) {
                langMenu.classList.remove('closing');
                langMenu.style.display = 'block';
                langMenu.classList.add('open');
            } else {
                langMenu.classList.remove('open');
                langMenu.classList.add('closing');
                langMenu.addEventListener('animationend', () => {
                    if (langMenu.classList.contains('closing')) {
                        langMenu.style.display = 'none';
                        langMenu.classList.remove('closing');
                    }
                }, { once: true });
            }
        });

        langMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
                langMenu.classList.remove('open');
                langMenu.classList.add('closing');
                langMenu.addEventListener('animationend', () => {
                    langMenu.style.display = 'none';
                    langMenu.classList.remove('closing');
                }, { once: true });
            }
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-container')) {
                if (langMenu.classList.contains('open')) {
                    langMenu.classList.remove('open');
                    langMenu.classList.add('closing');
                    langMenu.addEventListener('animationend', () => {
                        langMenu.style.display = 'none';
                        langMenu.classList.remove('closing');
                    }, { once: true });
                }
            }
        });
    }

    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            showUserProfile();
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
    });
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        location.reload();
    }
});

function updateUI() {
    const title = document.getElementById('title');
    if (title) title.textContent = translations[currentLang].title;

    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) homeMenuItem.textContent = translations[currentLang].home;
    
    const leapYearTitle = document.getElementById('leapYearTitle');
    const yearLabel = document.getElementById('yearLabel');
    const checkBtn = document.getElementById('checkBtn');
    const historyLabel = document.getElementById('historyLabel');
    if (leapYearTitle) leapYearTitle.textContent = translations[currentLang].leapYear.title;
    if (yearLabel) yearLabel.textContent = translations[currentLang].leapYear.prompt;
    if (checkBtn) checkBtn.textContent = translations[currentLang].leapYear.button;
    if (historyLabel) historyLabel.textContent = translations[currentLang].leapYear.history;
    translateHistory();

    const matrixCalcTitle = document.getElementById('matrixCalcTitle');
    const operationLabel = document.getElementById('operationLabel');
    const operationBtn = document.getElementById('operationBtn');
    const computeBtn = document.getElementById('computeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const matrixATitle = document.getElementById('matrixATitle');
    const matrixBTitle = document.getElementById('matrixBTitle');
    const rowsALabel = document.getElementById('rowsALabel');
    const colsALabel = document.getElementById('colsALabel');
    const rowsBLabel = document.getElementById('rowsBLabel');
    const colsBLabel = document.getElementById('colsBLabel');
    const acceptA = document.getElementById('acceptA');
    const acceptB = document.getElementById('acceptB');
    
    if (matrixCalcTitle) matrixCalcTitle.textContent = translations[currentLang].matrixCalc.title;
    if (operationLabel) operationLabel.textContent = translations[currentLang].matrixCalc.operation;
    if (operationBtn) operationBtn.textContent = translations[currentLang].matrixCalc.operations[currentOperation];
    if (computeBtn) computeBtn.textContent = translations[currentLang].matrixCalc.compute;
    if (clearBtn) clearBtn.textContent = translations[currentLang].matrixCalc.clear;
    if (matrixATitle) matrixATitle.textContent = translations[currentLang].matrixCalc.matrix_a;
    if (matrixBTitle) matrixBTitle.textContent = translations[currentLang].matrixCalc.matrix_b;
    if (rowsALabel) rowsALabel.textContent = translations[currentLang].matrixCalc.rows;
    if (colsALabel) colsALabel.textContent = translations[currentLang].matrixCalc.cols;
    if (rowsBLabel) rowsBLabel.textContent = translations[currentLang].matrixCalc.rows;
    if (colsBLabel) colsBLabel.textContent = translations[currentLang].matrixCalc.cols;
    if (acceptA) acceptA.textContent = translations[currentLang].matrixCalc.accept;
    if (acceptB) acceptB.textContent = translations[currentLang].matrixCalc.accept;
    if (resizeBtn) resizeBtn.textContent = translations[currentLang].matrixCalc.buttons.resize;

    const appMenuItem = document.getElementById('appMenuItem');
    const appSubmenuItems = document.querySelectorAll('#appSubmenu .submenu-item');
    if (appMenuItem) appMenuItem.textContent = translations[currentLang].applications;
    appSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].leapYear.title;
        if (index === 1) item.textContent = translations[currentLang].matrixCalc.title;
    });
    
    const helpMenuItem = document.getElementById('helpMenuItem');
    if (helpMenuItem) helpMenuItem.textContent = translations[currentLang].help;

    const helpSubmenuItems = document.querySelectorAll('#helpSubmenu .submenu-item');
    helpSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].about;
        if (index === 1) item.textContent = translations[currentLang].instructions;
    });
    
    const operationMenu = document.getElementById('operationMenu');
    if (operationMenu) {
        operationMenu.innerHTML = '';
        for (const [key, value] of Object.entries(translations[currentLang].matrixCalc.operations)) {
            const item = document.createElement('div');
            item.className = 'operation-menu-item';
            item.textContent = value;
            item.dataset.op = key;
            operationMenu.appendChild(item);
        }
    }
    
    const methodSelector = document.getElementById('methodSelector');
    if (methodSelector) {
        methodSelector.innerHTML = '';
        if (currentOperation === 'solve') {
            for (const [key, value] of Object.entries(translations[currentLang].matrixCalc.methods)) {
                const btn = document.createElement('button');
                btn.className = `method-btn ${key === currentMethod ? 'active' : ''}`;
                btn.textContent = value;
                btn.dataset.method = key;
                btn.addEventListener('click', () => {
                    currentMethod = key;
                    updateMethodButtons();
                });
                methodSelector.appendChild(btn);
            }
            methodSelector.style.display = 'flex';
        } else {
            methodSelector.style.display = 'none';
        }
    }

    const resizeTitle = document.querySelector('.resize-dialog h2');
    if (resizeTitle) resizeTitle.textContent = translations[currentLang].matrixCalc.resize_dialog.title;
    
    const matrixALabel = document.querySelector('.resize-column:nth-child(1) h3');
    if (matrixALabel) matrixALabel.textContent = translations[currentLang].matrixCalc.resize_dialog.matrix_a;
    
    const matrixBLabel = document.querySelector('.resize-column:nth-child(2) h3');
    if (matrixBLabel) matrixBLabel.textContent = translations[currentLang].matrixCalc.resize_dialog.matrix_b;
    
    const rowsLabels = document.querySelectorAll('.size-label');
    rowsLabels.forEach(label => {
        if (label.textContent.includes('Wiersze') || label.textContent.includes('Rows')) {
            label.textContent = translations[currentLang].matrixCalc.resize_dialog.rows;
        } else {
            label.textContent = translations[currentLang].matrixCalc.resize_dialog.cols;
        }
    });
    
    if (acceptResize) acceptResize.textContent = translations[currentLang].matrixCalc.resize_dialog.accept;
    
    if (acceptA) acceptA.textContent = translations[currentLang].matrixCalc.resize_dialog.accept;
    if (acceptB) acceptB.textContent = translations[currentLang].matrixCalc.resize_dialog.accept;

    const navBarLangBtn = document.querySelector('.nav-bar .lang-btn');
    if (navBarLangBtn && (currentScreen === 'home' || currentScreen === 'app')) {
        navBarLangBtn.style.display = 'inline-block';
    }
}

function updateHomeUI() {
    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) homeMenuItem.textContent = translations[currentLang].home;

    const homeTitle = document.querySelector('.home-title');
    const tileLabels = document.querySelectorAll('.tile-label');
    
    if (homeTitle) homeTitle.textContent = translations[currentLang].choose_app;
    
    tileLabels.forEach((label, index) => {
        if (index === 0) label.textContent = translations[currentLang].leapYear.title;
        if (index === 1) label.textContent = translations[currentLang].matrixCalc.title;
    });

    const homeAppMenuItem = document.getElementById('homeAppMenuItem');
    const homeAppSubmenuItems = document.querySelectorAll('#homeAppSubmenu .submenu-item');
    const homeHelpMenuItem = document.getElementById('homeHelpMenuItem');
    const homeHelpSubmenuItems = document.querySelectorAll('#homeHelpSubmenu .submenu-item');

    if (homeAppMenuItem) homeAppMenuItem.textContent = currentLang === 'pl' ? 'Aplikacje' : 'Applications';
    homeAppSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].leapYear.title;
        if (index === 1) item.textContent = translations[currentLang].matrixCalc.title;
    });
    
    if (homeHelpMenuItem) homeHelpMenuItem.textContent = currentLang === 'pl' ? 'Pomoc' : 'Help';
    homeHelpSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'O aplikacji' : 'About';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'Instrukcja' : 'Instructions';
    });
}

function updateWelcomeScreen() {
    if (!ensureTranslationsLoaded()) return;

    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    const startBtn = document.querySelector('.start-btn');
    const startHint = document.querySelector('.start-hint');

    if (welcomeTitle) {
        welcomeTitle.innerHTML = `<span>${translations[currentLang].welcome.title}</span>`;
        welcomeTitle.style.animation = 'none';
        void welcomeTitle.offsetWidth;
        welcomeTitle.style.animation = 'fadeInScale 1s ease-out forwards 0.5s';
    }
    
    if (welcomeSubtitle) {
        welcomeSubtitle.innerHTML = `<span>${translations[currentLang].welcome.subtitle}</span>`;
        welcomeSubtitle.style.animation = 'none';
        void welcomeSubtitle.offsetWidth;
        welcomeSubtitle.style.animation = 'fadeInUp 1s ease-out forwards 1s';
    }
    
    if (startHint) {
        startHint.textContent = translations[currentLang].welcome.start_hint;
        startHint.style.animation = 'none';
        void startHint.offsetWidth;
        startHint.style.animation = 'fadeIn 0.8s ease-out forwards 1.2s';
    }
    
    if (startBtn) {
        startBtn.textContent = currentLang === 'pl' ? 'Rozpocznij' : 'Start';
        startBtn.style.animation = 'none';
        void startBtn.offsetWidth;
        startBtn.style.animation = 'fadeInScale 0.8s ease-out forwards 1.5s';
    }
    
    const langContainer = document.querySelector('.welcome-screen .lang-btn-container');
    if (langContainer) {
        langContainer.style.animation = 'none';
        void langContainer.offsetWidth;
        langContainer.style.animation = 'fadeIn 0.8s ease-out forwards 2s';
    }
}

function ensureTranslationsLoaded() {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded!');
        return false;
    }
    return true;
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

function backToHome() {
    currentScreen = "home";
    document.querySelector('.home-screen').style.display = 'flex';
    document.querySelector('.app-container').style.display = 'none';
    document.getElementById('globalSideMenu').classList.remove('hidden');
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    const globalSideMenu = document.getElementById('globalSideMenu');
    if (globalSideMenu) {
        globalSideMenu.classList.remove('hidden');
        globalSideMenu.classList.remove('open');
    }
    
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.style.display = 'block';
    }

    const navBarLangBtn = document.querySelector('.nav-bar .lang-btn');
    if (navBarLangBtn) {
        navBarLangBtn.style.display = 'inline-block';
        const flags = {
            pl: "https://flagcdn.com/w40/pl.png",
            en: "https://flagcdn.com/w40/gb.png",
            de: "https://flagcdn.com/w40/de.png"
        };
        navBarLangBtn.style.backgroundImage = `url(${flags[currentLang]})`;
    }

    updateUI();
    updateHomeUI();
    initializeUI();
}

function showUserProfile() {
    currentScreen = "app";
    document.body.classList.add('user-profile-active');
    document.querySelector('.welcome-screen').style.display = 'none';
    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
    
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById('userProfileApp').classList.add('active');
    
    const navBarLangBtn = document.querySelector('.nav-bar .lang-btn');
    if (navBarLangBtn) {
        navBarLangBtn.style.display = 'inline-block';
        const flags = {
            pl: "https://flagcdn.com/w40/pl.png",
            en: "https://flagcdn.com/w40/gb.png",
            de: "https://flagcdn.com/w40/de.png"
        };
        navBarLangBtn.style.backgroundImage = `url(${flags[currentLang]})`;
    }

    createWaterDrops();
    resetMenuState();
    updateUI();
}

function optimizeProfilePage() {
    const profileContainer = document.querySelector('.user-profile-container');
    if (!profileContainer) return;

    profileContainer.style.position = 'fixed';
    profileContainer.style.top = '0';
    profileContainer.style.left = '0';
    profileContainer.style.width = '100%';
    profileContainer.style.height = '100%';
    profileContainer.style.overflowY = 'auto';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(profileContainer);
    observer.observe(document.querySelector('.user-avatar'));
}

function createWaterDrops() {
    const container = document.querySelector('.user-profile-container');
    if (!container) return;
    
    const waterEffect = document.createElement('div');
    waterEffect.className = 'water-effect';
    container.appendChild(waterEffect);
}

function initializeUI() {
    optimizeProfilePage();
    createWaterDrops();
    
    if (currentScreen === "welcome") {
        const menuBtn = document.getElementById('menuBtn');
        const globalSideMenu = document.getElementById('globalSideMenu');
        
        if (menuBtn) {
            menuBtn.style.display = 'none';
            menuBtn.style.opacity = '0';
            menuBtn.style.pointerEvents = 'none';
        }
        
        if (globalSideMenu) {
            globalSideMenu.classList.add('hidden');
            globalSideMenu.classList.remove('open');
        }
    } else {
        resetMenuState();
    }
}