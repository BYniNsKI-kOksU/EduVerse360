// Side menu handling
let menuBtn = document.getElementById('menuBtn');
let sideMenu = document.getElementById('globalSideMenu');

function setupMenu() {
    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', function(e) {
            e.stopPropagation();
            backToHome();
            if (sideMenu) {
                closeMenuWithAnimation();
            }
        });
    }

    if (!menuBtn || !sideMenu) return;

    // Resetuj event listenery
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    menuBtn = document.getElementById('menuBtn');
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Close mobile nav-bar if expanded
        const navBar = document.querySelector('.nav-bar');
        const navToggle = document.querySelector('.nav-toggle');
        if (navBar && navBar.classList.contains('mobile-expanded')) {
            navBar.classList.remove('mobile-expanded');
            navBar.classList.add('mobile-collapsing');
            setTimeout(() => {
                navBar.classList.remove('mobile-collapsing');
            }, 300);
        }
        
        sideMenu.classList.remove('hidden');
        sideMenu.classList.toggle('open');
        
        if (sideMenu.classList.contains('open')) {
            menuBtn.classList.add('open'); // Dodano klasę
            menuBtn.style.display = 'none';
        } else {
            menuBtn.classList.remove('open'); // Usunięto klasę
            resetMenuBtnState();
        }
    });

    // Funkcja do zamykania menu z animacją
    const closeMenuWithAnimation = function() {
        // Od razu pokaż przycisk menu
        resetMenuBtnState();

        // Rozpocznij animację zamykania
        sideMenu.classList.add('closing');
        sideMenu.classList.remove('open');
        
        // Po zakończeniu animacji ukryj menu
        const animationEndHandler = function() {
            sideMenu.classList.remove('closing');
            sideMenu.classList.add('hidden');
            sideMenu.removeEventListener('animationend', animationEndHandler);
        };
        sideMenu.addEventListener('animationend', animationEndHandler);
    };

    // Obsługa przycisku zamykania
    const closeSideMenuBtn = document.getElementById("closeSideMenuBtn");
    if (closeSideMenuBtn) {
        closeSideMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeMenuWithAnimation();
        });
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#globalSideMenu') && 
            e.target !== menuBtn &&
            !e.target.closest('.menu-btn')) { // Dodano sprawdzenie dla klasy menu-btn
            if (sideMenu && sideMenu.classList.contains('open')) {
                closeMenuWithAnimation();
            }
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

    // helper to load a script dynamically
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

    // Quick links inside Help submenu: O Aplikacji / Instrukcje
    const aboutMenuItem = document.getElementById('aboutMenuItem');
    const instructionsMenuItem = document.getElementById('instructionsMenuItem');

    if (aboutMenuItem) {
        aboutMenuItem.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (typeof closeMenuWithAnimation === 'function') closeMenuWithAnimation();

            // Try template-based inline first
            if (window.showAboutInlineFromTemplate && window.showAboutInlineFromTemplate()) {
                return;
            }

            // Try loading external JS if template not available
            try {
                await loadScript('js/about.js');
                if (typeof window.showAboutInline === 'function') {
                    window.showAboutInline();
                    return;
                }
            } catch (err) {
                console.warn('Nie udało się załadować about.js:', err);
            }

            console.error('Nie można wyświetlić strony About - brak szablonu i pliku JS');
        });
    }

    if (instructionsMenuItem) {
        instructionsMenuItem.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (typeof closeMenuWithAnimation === 'function') closeMenuWithAnimation();

            // Try template-based inline first
            if (window.showInstructionsInlineFromTemplate && window.showInstructionsInlineFromTemplate()) {
                return;
            }

            // Try loading external JS if template not available
            try {
                await loadScript('js/instructions.js');
                if (typeof window.showInstructionsInline === 'function') {
                    window.showInstructionsInline();
                    return;
                }
            } catch (err) {
                console.warn('Nie udało się załadować instructions.js:', err);
            }

            console.error('Nie można wyświetlić strony Instructions - brak szablonu i pliku JS');
        });
    }

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.closest('.submenu').classList.remove('open');
        });
    });

    // ZMIANA: Zamykaj menu tylko po wyborze konkretnej aplikacji, nie przy rozwijaniu submenu
    document.querySelectorAll('.submenu-item[data-app]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const app = this.dataset.app;
            if (app) {
                // Zamknij menu po wyborze aplikacji
                closeMenuWithAnimation();
                
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
                
                updateUI();
            }
        });
    });

    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.removeEventListener('click', showUserProfile);
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showUserProfile();
            // Zamknij menu po kliknięciu profilu użytkownika
            closeMenuWithAnimation();
            userBtn.style.animation = 'none';
            void userBtn.offsetWidth;
        });
    }
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

function resetMenuBtnState() {
    if (menuBtn) {
        menuBtn.style.display = 'block';
        menuBtn.style.opacity = '1';
        menuBtn.style.pointerEvents = 'auto';
        menuBtn.style.visibility = 'visible'; // Dodano dla pewności
    }
}

function resetMenuState() {
    resetMenuBtnState();
    
    if (sideMenu) {
        sideMenu.classList.remove('open');
        sideMenu.classList.remove('hidden');
    }
    
    // Reset mobile nav-bar state
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        navBar.classList.remove('mobile-expanded', 'mobile-collapsing');
    }
}

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        location.reload();
    }
});

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
        menuBtn.style.opacity = '1';
        menuBtn.style.pointerEvents = 'auto';
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

    // Hide any open lang menus
    const welcomeLangMenu = document.querySelector('.welcome-lang-menu');
    const navLangMenu = document.querySelector('.nav-lang-menu');
    
    if (welcomeLangMenu.classList.contains('open')) {
        welcomeLangMenu.classList.remove('open');
        welcomeLangMenu.classList.add('closing');
        welcomeLangMenu.addEventListener('animationend', () => {
            welcomeLangMenu.style.display = 'none';
            welcomeLangMenu.classList.remove('closing');
        }, { once: true });
    }
    
    if (navLangMenu.classList.contains('open')) {
        navLangMenu.classList.remove('open');
        navLangMenu.classList.add('closing');
        navLangMenu.addEventListener('animationend', () => {
            navLangMenu.style.display = 'none';
            navLangMenu.classList.remove('closing');
        }, { once: true });
    }

    updateUI();
    updateHomeUI();
    initializeUI();
}

function showUserProfile() {
    currentScreen = "app";
    
    // Dodaj klasę dla profilu użytkownika do body
    document.body.classList.add('user-profile-active');
    
    // Ukryj inne ekrany
    document.querySelector('.welcome-screen').style.display = 'none';
    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
    
    // Usuń aktywność z innych aplikacji
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Aktywuj profil użytkownika
    document.getElementById('userProfileApp').classList.add('active');
    
    // Załaduj zapisane dane użytkownika
    if (typeof userProfileModals !== 'undefined') {
        userProfileModals.loadSavedSettings();
    }
    
    // Aktualizuj tłumaczenia profilu użytkownika
    if (typeof updateUserProfileTranslations === 'function') {
        updateUserProfileTranslations();
    }
    
    // Inicjalizuj tło matematyczne
    if (typeof initMathBackground === 'function') {
        initMathBackground();
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

    // Aktywuj animację przycisku użytkownika
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.style.animation = 'rotateAndScale 2s infinite alternate';
        userBtn.style.animationTimingFunction = 'linear';
    }
    
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

// Funkcje pomocnicze do przełączania między macierzami
function switchToOtherMatrix() {
    const matrixAGrid = document.getElementById('matrixAGrid');
    const matrixBGrid = document.getElementById('matrixBGrid');
    const matrixB = document.getElementById('matrixB');
    
    // Sprawdź czy jesteśmy w kalkulatorze macierzy
    if (!matrixAGrid || !matrixBGrid) return;
    
    // Sprawdź czy macierz B jest widoczna
    const isBVisible = matrixB && matrixB.style.display !== 'none';
    
    if (currentActiveMatrix === 'A' && isBVisible) {
        // Przełącz na macierz B
        const firstInputB = matrixBGrid.querySelector('.matrix-input');
        if (firstInputB) {
            firstInputB.focus();
            firstInputB.select();
            currentActiveMatrix = 'B';
            highlightActiveMatrix('B');
        }
    } else if (currentActiveMatrix === 'B' || !isBVisible) {
        // Przełącz na macierz A
        const firstInputA = matrixAGrid.querySelector('.matrix-input');
        if (firstInputA) {
            firstInputA.focus();
            firstInputA.select();
            currentActiveMatrix = 'A';
            highlightActiveMatrix('A');
        }
    }
}

function highlightActiveMatrix(matrixId) {
    const matrixAFrame = document.getElementById('matrixA');
    const matrixBFrame = document.getElementById('matrixB');
    
    // Usuń podświetlenie z obu macierzy
    if (matrixAFrame) matrixAFrame.classList.remove('active-matrix');
    if (matrixBFrame) matrixBFrame.classList.remove('active-matrix');
    
    // Dodaj podświetlenie do aktywnej macierzy
    if (matrixId === 'A' && matrixAFrame) {
        matrixAFrame.classList.add('active-matrix');
    } else if (matrixId === 'B' && matrixBFrame && matrixBFrame.style.display !== 'none') {
        matrixBFrame.classList.add('active-matrix');
    }
}

// Globalny skrót klawiszowy do przełączania macierzy
document.addEventListener('keydown', (e) => {
    if ((e.altKey || e.metaKey) && e.key === 'Tab') {
        e.preventDefault();
        switchToOtherMatrix();
    }
});

// Modyfikacja event listenerów dla inputów macierzy
document.querySelectorAll('.matrix-input').forEach(input => {
    input.addEventListener('focus', function() {
        const matrixId = this.closest('.matrix-grid').id === 'matrixAGrid' ? 'A' : 'B';
        highlightActiveMatrix(matrixId);
    });
});

// Expose helpers to show inline templates directly from the index (useful when templates are embedded)
window.showAboutInlineFromTemplate = function() {
    const tpl = document.getElementById('tpl-about');
    if (!tpl) return false;
    let container = document.getElementById('inlineAbout');
    if (!container) {
        container = document.createElement('div');
        container.id = 'inlineAbout';
        container.className = 'about-inline-container';
        document.body.appendChild(container);
    }
    container.innerHTML = '';
    
    // Create only the back button (no surrounding nav bar)
    const backButton = document.createElement('button');
    backButton.className = 'back-to-home';
    backButton.id = 'inlineAboutBack';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Powrót';
    container.appendChild(backButton);
    
    const content = tpl.content.cloneNode(true);
    container.appendChild(content);
    container.style.display = 'block';
    
    // Add body class for styling
    document.body.classList.add('about-active');
    document.body.style.overflow = 'hidden';
    
    document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => { 
        if (el) el.style.display = 'none'; 
    });
    
    document.getElementById('inlineAboutBack').addEventListener('click', (e) => { 
        e.stopPropagation(); 
        container.style.display = 'none';
        document.body.classList.remove('about-active');
        document.body.style.overflow = '';
        backToHome(); 
    });
    return true;
};

window.showInstructionsInlineFromTemplate = function() {
    const tpl = document.getElementById('tpl-instructions');
    if (!tpl) return false;
    let container = document.getElementById('inlineInstructions');
    if (!container) {
        container = document.createElement('div');
        container.id = 'inlineInstructions';
        container.className = 'instructions-inline-container';
        document.body.appendChild(container);
    }
    container.innerHTML = '';
    
    // Create only the back button (no surrounding nav bar)
    const backButton = document.createElement('button');
    backButton.className = 'back-to-home';
    backButton.id = 'inlineInstructionsBack';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Powrót';
    container.appendChild(backButton);
    
    const content = tpl.content.cloneNode(true);
    container.appendChild(content);
    container.style.display = 'block';
    
    // Add body class for styling
    document.body.classList.add('instructions-active');
    document.body.style.overflow = 'hidden';
    
    // init FAQ toggles
    container.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            if (item) item.classList.toggle('active');
        });
    });
    
    document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => { 
        if (el) el.style.display = 'none'; 
    });
    
    document.getElementById('inlineInstructionsBack').addEventListener('click', (e) => { 
        e.stopPropagation(); 
        container.style.display = 'none';
        document.body.classList.remove('instructions-active');
        document.body.style.overflow = '';
        backToHome(); 
    });
    return true;
};



