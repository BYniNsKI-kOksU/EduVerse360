const translations = {
    "pl": {
        "title": "EduVerse 360",
        "choose_app": "Wybierz aplikacje",
        "home": "Strona główna",
        "welcome": {
            "title": "Witaj w EduVerse 360",
            "subtitle": "Odkryj narzędzia do obliczeń matematycznych"
        },
        "leapYear": {
            "title": "Badacz roku przestępnego",
            "prompt": "Podaj rok:",
            "button": "Oblicz",
            "history": "Historia:",
            "emptyHistory": "Brak historii",
            "error": "Wprowadź poprawny rok (liczbę całkowitą).",
            "yes": "To {verb} rok przestępny",
            "no": "To nie {verb} rok przestępny",
            "verbs": {"past": "był", "present": "jest", "future": "będzie"}
        },
        "matrixCalc": {
            "resizeBtn": "Zmień rozmiar",
            "acceptBtn": "Akceptuj",
            "title": "Kalkulator Macierzy",
            "rows": "Wiersze:",
            "cols": "Kolumny:",
            "operation": "Operacja:",
            "compute": "Oblicz",
            "clear": "Wyczyść",
            "matrix_a": "Macierz A",
            "matrix_b": "Macierz B",
            "result": "Wynik",
            "accept": "Akceptuj",
            "solve": "Układ równań",
            "operations": {
                "add": "Dodawanie",
                "sub": "Odejmowanie",
                "mul": "Mnożenie",
                "det": "Wyznacznik",
                "inv": "Macierz odwrotna",
                "trans": "Transpozycja",
                "solve": "Układ równań"
            },
            "methods": {
                "cramer": "Cramer",
                "gauss": "Eliminacja Gaussa",
                "gauss_jordan": "Gauss-Jordan",
                "inverse": "Macierz odwrotna"
            },
            "errors": {
                "same_dim": "Macierze muszą mieć te same wymiary do {op}.",
                "mul_dim": "Liczba kolumn A musi być równa liczbie wierszy B.",
                "square": "Macierz musi być kwadratowa, aby wykonać tę operację.",
                "singular": "Macierz osobliwa – brak odwrotności.",
                "invalid": "Niepoprawna liczba w (wiersz {r}, kolumna {c}).",
                "solve_dim": "Macierz B musi być wektorem (1 kolumna) dla układu równań.",
                "size_invalid": "Nieprawidłowy rozmiar macierzy. Wprowadź wartości od 1 do 10.",
                "resize_failed": "Nie udało się zmienić rozmiaru macierzy."
            },
            "resize_dialog": {
                "title": "Zmień rozmiar macierzy",
                "matrix_a": "Macierz A",
                "matrix_b": "Macierz B",
                "rows": "Wiersze:",
                "cols":"Kolumny:",
                "accept": "Akceptuj",
                "cancel": "Anuluj"
            },
            "buttons": {
                "resize": "Zmień rozmiar",
                "compute": "Oblicz",
                "clear": "Wyczyść"
            }
        },
        "userProfile": {
            "title": "Profil użytkownika",
            "edit": "Edytuj profil",
            "favorites": "Ulubione obliczenia",
            "settings": "Ustawienia",
            "password": "Zmień hasło",
            "activity": "Ostatnia aktywność",
            "calculations": "Obliczenia",
            "saved": "Zapisane",
            "favoritesCount": "Ulubione"
        }
    },
    "en": {
        "title": "EduVerse 360",
        "choose_app": "Choose application",
        "home": "Home",
        "welcome": {
            "title": "Welcome to EduVerse 360",
            "subtitle": "Discover tools for mathematical calculations"
        },
        "leapYear": {
            "title": "Leap Year Investigator",
            "prompt": "Enter year:",
            "button": "Check",
            "history": "History:",
            "emptyHistory": "No history",
            "error": "Enter a valid integer year.",
            "yes": "It {verb} a leap year",
            "no": "It is not {verb} a leap year",
            "verbs": {"past": "was", "present": "is", "future": "will be"}
        },
        "matrixCalc": {
            "resizeBtn": "Resize",
            "acceptBtn": "Accept",
            "title": "Matrix Calculator",
            "rows": "Rows:",
            "cols": "Columns:",
            "operation": "Operation:",
            "compute": "Compute",
            "clear": "Clear",
            "matrix_a": "Matrix A",
            "matrix_b": "Matrix B",
            "result": "Result",
            "accept": "Accept",
            "solve": "Solve",
            "operations": {
                "add": "Addition",
                "sub": "Subtraction",
                "mul": "Multiplication",
                "det": "Determinant",
                "inv": "Inverse",
                "trans": "Transpose",
                "solve": "Solve"
            },
            "methods": {
                "cramer": "Cramer",
                "gauss": "Gaussian elimination",
                "gauss_jordan": "Gauss-Jordan",
                "inverse": "Inverse matrix"
            },
            "errors": {
                "same_dim": "Matrices must have the same dimensions for {op}.",
                "mul_dim": "Columns of A must equal rows of B.",
                "square": "Matrix must be square for this operation.",
                "singular": "Matrix is singular – cannot invert.",
                "invalid": "Invalid number at (row {r}, col {c}).",
                "solve_dim": "Matrix B must be a vector (1 column) for equation system.",
                "size_invalid": "Invalid matrix size. Please enter values between 1 and 10.",
                "resize_failed": "Failed to resize matrix."
            },
            "resize_dialog": {
                "title": "Resize Matrix",
                "matrix_a": "Matrix A",
                "matrix_b": "Matrix B",
                "rows": "Rows:",
                "cols":"Columns:",
                "accept": "Accept",
                "cancel": "Cancel"
            },
            "buttons": {
                "resize": "Resize",
                "compute": "Compute",
                "clear": "Clear"
            }
        },
        "userProfile": {
            "title": "User Profile",
            "edit": "Edit Profile",
            "favorites": "Favorite Calculations",
            "settings": "Settings",
            "password": "Change Password",
            "activity": "Recent Activity",
            "calculations": "Calculations",
            "saved": "Saved",
            "favoritesCount": "Favorites"
        }
    }
};

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
                menuBtn.style.display = 'block'; // Pokaż przycisk po zamknięciu menu
            }
        });
    }

    if (!menuBtn || !sideMenu) return;

    // Clean any existing event listeners to avoid duplicates
    menuBtn.replaceWith(menuBtn.cloneNode(true));
    const newMenuBtn = document.getElementById('menuBtn');
    
    newMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sideMenu.classList.toggle('open');
        // Ukryj przycisk, gdy menu jest otwarte
        if (sideMenu.classList.contains('open')) {
            newMenuBtn.style.display = 'none';
        } else {
            newMenuBtn.style.display = 'block';
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#globalSideMenu') 
        && !e.target.closest('.lang-container') 
        && e.target !== menuBtn) {
        
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuBtn) menuBtn.style.display = 'block';
        }
    });

    // Reszta kodu pozostaje bez zmian...
    // Submenu handling
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

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.closest('.submenu').classList.remove('open');
        });
    });

    // Fix for application selection
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
                
                // Zawsze pokazuj przycisk menu po zmianie aplikacji
                const menuBtn = document.getElementById('menuBtn');
                if (menuBtn) {
                    menuBtn.style.display = 'block';
                    menuBtn.style.opacity = '1';
                    menuBtn.style.pointerEvents = 'auto';
                }
                
                // Zamknij menu boczne
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

    // Language button handling on welcome screen
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn .lang-btn');
    const welcomeLangMenu = document.querySelector('.welcome-lang-btn .lang-menu');

    if (welcomeLangBtn && welcomeLangMenu) {
        welcomeLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (welcomeLangMenu.classList.contains('open')) {
                welcomeLangMenu.classList.remove('open');
                welcomeLangMenu.classList.add('closing');
                welcomeLangMenu.addEventListener('animationend', () => {
                    welcomeLangMenu.classList.remove('closing');
                }, { once: true });
            } else {
                welcomeLangMenu.classList.add('open');
            }
        });

        welcomeLangMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
                welcomeLangMenu.classList.remove('open');
                welcomeLangMenu.classList.add('closing');
                welcomeLangMenu.addEventListener('animationend', () => {
                    welcomeLangMenu.classList.remove('closing');
                }, { once: true });
            }
            e.stopPropagation();
        });
    } 

    // Language button handling in nav-bar
    const langBtn = document.querySelector('.nav-bar .lang-btn');
    const langMenu = document.querySelector('.nav-bar .lang-menu');
    const userBtn = document.querySelector('.nav-bar .user-btn');

if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (langMenu.classList.contains('open')) {
            langMenu.classList.remove('open');
            langMenu.classList.add('closing');
            langMenu.addEventListener('animationend', () => {
                langMenu.classList.remove('closing');
            }, { once: true });
        } else {
            langMenu.classList.add('open');
        }
    });
}

if (langMenu) {
    langMenu.addEventListener('click', (e) => {
        if (e.target.dataset.lang) {
            switchLanguage(e.target.dataset.lang);
            langMenu.classList.remove('open');
            langMenu.classList.add('closing');
            langMenu.addEventListener('animationend', () => {
                langMenu.classList.remove('closing');
            }, { once: true });
        }
        e.stopPropagation();
    });
}

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            showUserProfile();
        });
    }
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    location.reload();
  }
});

function updateUI() {
    // Update existing UI elements
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

    // User profile translations
    const userProfileTitle = document.querySelector('.user-profile-container .user-name');
    const editBtn = document.querySelector('.action-btn:nth-child(1)');
    const favoritesBtn = document.querySelector('.action-btn:nth-child(2)');
    const settingsBtn = document.querySelector('.action-btn:nth-child(3)');
    const passwordBtn = document.querySelector('.action-btn:nth-child(4)');
    const activityTitle = document.querySelector('.activity-title');

    if (userProfileTitle) userProfileTitle.textContent = translations[currentLang].userProfile.title;
    if (editBtn) editBtn.textContent = translations[currentLang].userProfile.edit;
    if (favoritesBtn) favoritesBtn.textContent = translations[currentLang].userProfile.favorites;
    if (settingsBtn) settingsBtn.textContent = translations[currentLang].userProfile.settings;
    if (passwordBtn) passwordBtn.textContent = translations[currentLang].userProfile.password;
    if (activityTitle) activityTitle.textContent = translations[currentLang].userProfile.activity;

    // Update stat labels
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 3) {
        statLabels[0].textContent = translations[currentLang].userProfile.calculations;
        statLabels[1].textContent = translations[currentLang].userProfile.saved;
        statLabels[2].textContent = translations[currentLang].userProfile.favoritesCount;
    }

    // Update menu items
    const appMenuItem = document.getElementById('appMenuItem');
    const appSubmenuItems = document.querySelectorAll('#appSubmenu .submenu-item');
    if (appMenuItem) appMenuItem.textContent = currentLang === 'pl' ? 'Aplikacje' : 'Applications';
    appSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].leapYear.title;
        if (index === 1) item.textContent = translations[currentLang].matrixCalc.title;
    });

    const helpMenuItem = document.getElementById('helpMenuItem');
    const helpSubmenuItems = document.querySelectorAll('#helpSubmenu .submenu-item');
    if (helpMenuItem) helpMenuItem.textContent = currentLang === 'pl' ? 'Pomoc' : 'Help';
    helpSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'O aplikacji' : 'About';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'Instrukcja' : 'Instructions';
    });
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

function switchLanguage(lang) {
    currentLang = lang;
    updateUI();
    updateHomeUI();
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
    
    // Upewnij się, że przycisk menu jest widoczny
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.style.display = 'block';
    }
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