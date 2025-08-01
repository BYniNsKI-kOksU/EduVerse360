const translations = {
    "pl": {
        "title": "Aplikacje Matematyczne",
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
    },
    "en": {
        "title": "Math Applications",
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
        ];

        for (const file of cssFiles) {
            await loadCSS(file);
        }
        console.log('All CSS files loaded successfully');
    } catch (error) {
        console.error('Error loading CSS files:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllCSS();
    updateWelcomeScreen();
    initializeUI();
    initializeLeapYear();
    initializeMatrixCalculator();

    // Obsługa przycisku języka na ekranie startowym
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn .lang-btn');
    const welcomeLangMenu = document.querySelector('.welcome-lang-btn .lang-menu');
    
    if (welcomeLangBtn && welcomeLangMenu) {
        welcomeLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeLangMenu.style.display = welcomeLangMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.welcome-lang-btn') && welcomeLangMenu) {
                welcomeLangMenu.style.display = 'none';
            }
        });

        welcomeLangMenu.addEventListener('click', (e) => {
            if (e.target.dataset.lang) {
                switchLanguage(e.target.dataset.lang);
                welcomeLangMenu.style.display = 'none';
            }
            e.stopPropagation();
        });
    }

    // Obsługa głównego paska nawigacyjnego (poza ekranem startowym)
    const langBtn = document.querySelector('.nav-bar .lang-btn');
    const langMenu = document.querySelector('.nav-bar .lang-menu');
    const userBtn = document.querySelector('.nav-bar .user-btn');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-btn-container') && langMenu) {
            langMenu.style.display = 'none';
        }
    });

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
});