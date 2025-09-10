// Functions related to updating and initializing UI
function updateUI() {
    const title = document.getElementById('title');
    if (title) title.textContent = translations[currentLang].title;

    const startHint = document.querySelector('.start-hint');
    if (startHint) startHint.textContent = translations[currentLang].welcome.start_hint;

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
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const resizeInputLabels = document.querySelectorAll('.resize-input-group label');
    const methodLabel = document.querySelector('.method-label');
    const defaultResult = document.querySelector('.default-result-text');
    
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
    if (methodLabel) methodLabel.textContent = translations[currentLang].matrixCalc.method_label;
    if (defaultResult) defaultResult.textContent = translations[currentLang].matrixCalc.default_result;

    cancelBtns.forEach(btn => {
        btn.textContent = translations[currentLang].matrixCalc.resize_dialog.cancel;
    });

    resizeInputLabels.forEach(label => {
        if (label.htmlFor.includes('rows')) {
            label.textContent = translations[currentLang].matrixCalc.resize_dialog.rows;
        } else if (label.htmlFor.includes('cols')) {
            label.textContent = translations[currentLang].matrixCalc.resize_dialog.cols;
        }
    });

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

    const methodBtn = document.getElementById('methodBtn');
    if (methodBtn) {
        methodBtn.textContent = translations[currentLang].matrixCalc.methods[currentMethod];
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

    if (typeof centerMatrices === 'function') {
        const matricesContainer = document.getElementById('matricesContainer');
        if (matricesContainer) {
            matricesContainer.style.gap = window.innerWidth >= 768 ? '60px' : '30px';
        }
    }
    
    // Dodaj tooltip z informacjami o skrótach klawiszowych dla kalkulatora macierzy
    const matrixTitle = document.getElementById('matrixCalcTitle');
    if (matrixTitle) {
        // Dodaj atrybut title z informacjami o skrótach
        const shortcutsInfo = currentLang === 'pl' 
            ? 'Skróty klawiszowe:\n• Ctrl + M - Przełącz między macierzami\n• Ctrl + 1 - Macierz A\n• Ctrl + 2 - Macierz B\n• Ctrl + Enter - Oblicz\n• Strzałki - Nawigacja'
            : 'Keyboard shortcuts:\n• Ctrl + M - Switch between matrices\n• Ctrl + 1 - Matrix A\n• Ctrl + 2 - Matrix B\n• Ctrl + Enter - Calculate\n• Arrow keys - Navigation';
        
        matrixTitle.setAttribute('title', shortcutsInfo);
        matrixTitle.style.cursor = 'help';
    }

    updateDashboardUI();
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
    const welcomeLangBtn = document.querySelector('.welcome-lang-btn');

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
    
    // Animacja dla przycisku języka
    if (welcomeLangBtn) {
        setTimeout(() => {
            welcomeLangBtn.classList.add('show');
        }, 2000);
    }
}

function ensureTranslationsLoaded() {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded!');
        return false;
    }
    return true;
}

function initializeUI() {
    if (typeof optimizeProfilePage === 'function') optimizeProfilePage();
    if (typeof createWaterDrops === 'function') createWaterDrops();
    
    const menuBtn = document.getElementById('menuBtn');
    const globalSideMenu = document.getElementById('globalSideMenu');

    if (currentScreen === "welcome") {
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
        if (menuBtn) {
            menuBtn.style.display = 'flex';
            menuBtn.style.opacity = '1';
            menuBtn.style.pointerEvents = 'auto';
        }
        if (typeof resetMenuState === 'function') resetMenuState();
    }
}

function updateDashboardUI() {
    if (!translations[currentLang].dashboard) return;
    
    const dashboardHeader = document.querySelector('.dashboard-header h3');
    if (dashboardHeader) {
        dashboardHeader.textContent = translations[currentLang].dashboard.menu;
    }
    
    const sections = document.querySelectorAll('.dashboard-section');
    if (sections[0]) {
        sections[0].querySelector('h4').textContent = translations[currentLang].dashboard.navigation;
    }
    if (sections[1]) {
        sections[1].querySelector('h4').textContent = translations[currentLang].dashboard.settings;
    }
    if (sections[2]) {
        sections[2].querySelector('h4').textContent = translations[currentLang].dashboard.applications;
    }
    if (sections[3]) {
        sections[3].querySelector('h4').textContent = translations[currentLang].dashboard.help || 'Pomoc';
    }
    
    const dashboardBtns = document.querySelectorAll('.dashboard-btn');
    dashboardBtns.forEach(btn => {
        const action = btn.dataset.action;
        const span = btn.querySelector('span');
        
        switch(action) {
            case 'home':
                span.textContent = translations[currentLang].dashboard.home;
                break;
            case 'profile':
                span.textContent = translations[currentLang].dashboard.profile;
                break;
            case 'theme':
                // Usuń tę część - będzie obsługiwana przez updateDashboardThemeBtn()
                break;
            case 'language-menu':
                span.textContent = translations[currentLang].dashboard.language;
                break;
            case 'language':
                // Nie zmieniaj tekstów przycisków języków - pozostają stałe
                const lang = btn.dataset.lang;
                const langNames = {
                    pl: 'Polski',
                    en: 'English',
                    de: 'Deutsch'
                };
                if (langNames[lang]) {
                    span.textContent = langNames[lang];
                }
                break;
            case 'leapYear':
                span.textContent = translations[currentLang].leapYear.title;
                break;
            case 'matrixCalculator':
                span.textContent = translations[currentLang].matrixCalc.title;
                break;
            case 'about':
                span.textContent = translations[currentLang].about || 'O aplikacji';
                break;
            case 'instructions':
                span.textContent = translations[currentLang].instructions || 'Instrukcja';
                break;
        }
    });
    
    // Zaktualizuj przycisk powrotu w submenu
    const backBtn = document.querySelector('#languageSubmenu .dashboard-back-btn span');
    if (backBtn) {
        backBtn.textContent = translations[currentLang].dashboard.back || 'Wstecz';
    }

    updateDashboardThemeBtn();
}
