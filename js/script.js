const translations = {
    "pl": {
        "title": "Aplikacje Matematyczne",
        "choose_app": "Wybierz aplikacje",
        "home": "Strona główna",
        "welcome": {
            "title": "Witaj w Aplikacjach Matematycznych",
            "subtitle": "Odkryj narzędzia do obliczeń matematycznych"
        },
        "leapYear": {
            "title": "Badacz roku przestępnego",
            "prompt": "Podaj rok:",
            "button": "Oblicz",
            "history": "Historia:",
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
                "cols": "Kolumny:",
                "accept": "Akceptuj",
                "cancel": "Anuluj"
            },
            "buttons": {
                "resize": "Zmień rozmiar",
                "compute": "Oblicz",
                "clear": "Wyczyść"
            }
        },
    },
    "en": {
        "title": "Math Applications",
        "choose_app": "Choose application",
        "home": "Home",
        "welcome": {
            "title": "Welcome to Math Applications",
            "subtitle": "Discover tools for mathematical calculations"
        },
        "leapYear": {
            "title": "Leap Year Investigator",
            "prompt": "Enter year:",
            "button": "Check",
            "history": "History:",
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
                "cols": "Columns:",
                "accept": "Accept",
                "cancel": "Cancel"
            },
            "buttons": {
                "resize": "Resize",
                "compute": "Compute",
                "clear": "Clear"
            }
        },
    }
};

// Global variables
let currentLang = "pl";
let currentScreen = "welcome";

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
            'css/welcome-screen.css' // Ensure welcome-screen.css is included
        ];
        await Promise.all(cssFiles.map(file => loadCSS(file)));
        console.log('All CSS files loaded successfully');
    } catch (error) {
        console.error('Error loading CSS files:', error);
    }
}

// Centralized navigation function
function navigateTo(screen, app = null) {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const homeScreen = document.querySelector('.home-screen');
    const appContainer = document.querySelector('.app-container');
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn');
    const navBar = document.querySelector('.nav-bar');
    const globalSideMenu = document.getElementById('globalSideMenu');
    const menuBtn = document.getElementById('menuBtn');

    // Hide all screens and reset UI elements
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
        welcomeScreen.classList.add('hidden');
    }
    if (homeScreen) homeScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'none';
    if (welcomeLangBtn) welcomeLangBtn.style.display = 'none';
    if (navBar) navBar.style.display = 'none';
    if (globalSideMenu) {
        globalSideMenu.classList.add('hidden');
        globalSideMenu.classList.remove('open');
    }
    if (menuBtn) {
        menuBtn.style.display = 'none';
        menuBtn.style.opacity = '0';
        menuBtn.style.pointerEvents = 'none';
    }
    document.querySelectorAll('.app-content').forEach(content => content.classList.remove('active'));

    // Update current screen and UI based on target screen
    currentScreen = screen;
    if (screen === 'welcome') {
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex'; // Use flex to match CSS
            welcomeScreen.classList.remove('hidden');
        }
        if (welcomeLangBtn) {
            welcomeLangBtn.style.display = 'block';
            welcomeLangBtn.style.animation = 'none';
            welcomeLangBtn.offsetHeight;
            welcomeLangBtn.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s';
        }
        updateWelcomeScreen();
    } else if (screen === 'home') {
        if (homeScreen) homeScreen.style.display = 'flex';
        if (navBar) {
            navBar.style.display = 'flex';
            navBar.style.animation = 'none';
            navBar.offsetHeight;
            navBar.style.animation = 'slideInRight 0.5s ease-out forwards';
            navBar.querySelectorAll('.nav-btn').forEach((btn, index) => {
                btn.style.display = 'flex';
                btn.style.animation = 'none';
                btn.offsetHeight;
                btn.style.animation = `slideInButtons 0.3s ease-out forwards ${index * 0.1}s`;
            });
        }
        if (globalSideMenu) globalSideMenu.classList.remove('hidden');
        if (menuBtn) {
            menuBtn.style.display = 'block';
            menuBtn.style.opacity = '1';
            menuBtn.style.pointerEvents = 'auto';
        }
        updateHomeUI();
    } else if (screen === 'app' && app) {
        if (appContainer) appContainer.style.display = 'block';
        const appElement = document.getElementById(app + 'App');
        if (appElement) appElement.classList.add('active');
        if (navBar) {
            navBar.style.display = 'flex';
            navBar.style.animation = 'none';
            navBar.offsetHeight;
            navBar.style.animation = 'slideInRight 0.5s ease-out forwards';
            navBar.querySelectorAll('.nav-btn').forEach((btn, index) => {
                btn.style.display = 'flex';
                btn.style.animation = 'none';
                btn.offsetHeight;
                btn.style.animation = `slideInButtons 0.3s ease-out forwards ${index * 0.1}s`;
            });
        }
        if (globalSideMenu) globalSideMenu.classList.remove('hidden');
        if (menuBtn) {
            menuBtn.style.display = 'block';
            menuBtn.style.opacity = '1';
            menuBtn.style.pointerEvents = 'auto';
        }
        updateUI();
    }

    // Update history state
    const state = { screen, app };
    const url = screen === 'welcome' ? '#welcome' : screen === 'home' ? '#home' : `#${app}`;
    if (screen === 'welcome' && !window.history.state) {
        window.history.replaceState(state, '', url); // Replace initial state for welcome screen
    } else {
        window.history.pushState(state, '', url); // Push new state for other screens
    }
}

// Side menu handling
function setupMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('globalSideMenu');
    const homeMenuItem = document.getElementById('homeMenuItem');

    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateTo('home');
            if (sideMenu) sideMenu.classList.remove('open');
        });
    }

    if (menuBtn && sideMenu) {
        const newMenuBtn = menuBtn.cloneNode(true);
        menuBtn.replaceWith(newMenuBtn);
        newMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sideMenu.classList.toggle('open');
            newMenuBtn.style.display = sideMenu.classList.contains('open') ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#globalSideMenu') && e.target !== newMenuBtn) {
                sideMenu.classList.remove('open');
                newMenuBtn.style.display = 'block';
            }
        });
    }

    const setupSubmenu = (trigger, submenu) => {
        if (trigger && submenu) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                submenu.classList.toggle('open');
            });
        }
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Set initial history state
    window.history.replaceState({ screen: 'welcome' }, '', '#welcome');

    await loadAllCSS();
    setupMenu();
    navigateTo('welcome');

    // Handle popstate for back/forward navigation
    window.addEventListener('popstate', (event) => {
        const state = event.state || { screen: 'welcome' };
        navigateTo(state.screen, state.app);
    });

    // Welcome screen language button
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn .lang-btn');
    const welcomeLangMenu = document.querySelector('.welcome-lang-btn .lang-menu');
    if (welcomeLangBtn && welcomeLangMenu) {
        welcomeLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeLangMenu.style.display = welcomeLangMenu.style.display === 'block' ? 'none' : 'block';
        });

        welcomeLangMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
                welcomeLangMenu.style.display = 'none';
            }
            e.stopPropagation();
        });
    }

    // Main navigation bar language button
    const langBtn = document.querySelector('.nav-bar .lang-btn');
    const langMenu = document.querySelector('.nav-bar .lang-menu');
    const userBtn = document.querySelector('.nav-bar .user-btn');
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
    if (langMenu) {
        langMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
            }
            e.stopPropagation();
        });
    }
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            console.log('User button clicked');
        });
    }

    // App selection from side menu
    document.querySelectorAll('.submenu-item[data-app]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const app = item.dataset.app;
            if (app) {
                navigateTo('app', app);
                if (sideMenu) sideMenu.classList.remove('open');
            }
        });
    });
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        location.reload();
    }
});