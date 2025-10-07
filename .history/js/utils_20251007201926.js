// Side menu handling
let menuBtn = document.getElementById('menuBtn');
let sideMenu = document.getElementById('globalSideMenu');

function setupMenu() {
    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', function(e) {
            e.stopPropagation();
            // Zamknij aktywne strony (About, Instructions, UserProfile)
            closeActivePages();
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

            // Zamknij inne aktywne strony przed otwarciem About
            closeActivePages();

            // Load about resources dynamically
            if (typeof resourceLoader !== 'undefined') {
                await resourceLoader.loadAppResources('about');
            }

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

            // Zamknij inne aktywne strony przed otwarciem Instructions
            closeActivePages();

            // Load instructions resources dynamically
            if (typeof resourceLoader !== 'undefined') {
                await resourceLoader.loadAppResources('instructions');
            }

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
        item.addEventListener('click', async function(e) {
            e.stopPropagation();
            // --- NOWOŚĆ: Zamknij każdą inną aktywną stronę przed uruchomieniem aplikacji ---
            if (typeof closeActivePages === 'function') closeActivePages();
            const app = this.dataset.app;
            if (app) {
                // Zamknij menu po wyborze aplikacji
                closeMenuWithAnimation();
                
                // Load app-specific resources dynamically
                if (typeof resourceLoader !== 'undefined') {
                    await resourceLoader.loadAppResources(app);
                }
                
                currentScreen = "app";
                document.querySelector('.welcome-screen').style.display = 'none';
                document.querySelector('.home-screen').style.display = 'none';
                document.querySelector('.app-container').style.display = 'block';
                
                document.querySelectorAll('.app-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Remove help buttons from previous app
                if (typeof helpSystem !== 'undefined') {
                    helpSystem.removeHelpButtons();
                }
                
                const appElement = document.getElementById(app + 'App');
                if (appElement) {
                    appElement.classList.add('active');
                    
                    // Initialize app-specific features
                    setTimeout(() => {
                        if (app === 'matrixCalc' && typeof helpSystem !== 'undefined') {
                            helpSystem.addMatrixHelpButton();
                        } else if (app === 'leapYear' && typeof helpSystem !== 'undefined') {
                            helpSystem.addLeapYearHelpButton();
                        }
                    }, 100);
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

// Funkcja do zamykania aktywnych stron (About, Instructions, UserProfile)
function closeActivePages() {
    // Zamknij About page jeśli aktywne
    const inlineAbout = document.getElementById('inlineAbout');
    if (inlineAbout && inlineAbout.style.display !== 'none') {
        inlineAbout.style.display = 'none';
        inlineAbout.innerHTML = '';
        document.body.classList.remove('about-active');
        document.body.style.overflow = inlineAbout._previousBodyOverflow || '';
    }
    
    // Zamknij Instructions page jeśli aktywne
    const inlineInstructions = document.getElementById('inlineInstructions');
    if (inlineInstructions && inlineInstructions.style.display !== 'none') {
        inlineInstructions.style.display = 'none';
        inlineInstructions.innerHTML = '';
        document.body.classList.remove('instructions-active');
        document.body.style.overflow = inlineInstructions._previousBodyOverflow || '';
    }
    
    // Zamknij User Profile jeśli aktywne
    if (document.body.classList.contains('user-profile-active')) {
        document.body.classList.remove('user-profile-active');
        const closeBtn = document.getElementById('closeProfileBtn');
        if (closeBtn) {
            closeBtn.remove();
        }
        // Przywróć side-menu bez wyświetlania
        const globalSideMenu = document.getElementById('globalSideMenu');
        if (globalSideMenu) {
            globalSideMenu.style.display = '';
            globalSideMenu.classList.remove('hidden');
            globalSideMenu.classList.remove('open');
        }
        // Ukryj user profile app
        const userProfileApp = document.getElementById('userProfileApp');
        if (userProfileApp) {
            userProfileApp.classList.remove('active');
        }
        // Remove help buttons
        if (typeof helpSystem !== 'undefined') {
            helpSystem.removeHelpButtons();
        }
    }
    // --- NOWOŚĆ: Zamknij stronę ustawień jeśli aktywna ---
    if (document.body.classList.contains('settings-active')) {
        document.body.classList.remove('settings-active');
        document.body.style.overflow = '';
        // Usuń kontener ustawień jeśli istnieje
        const settingsContainer = document.getElementById('settingsContainer');
        if (settingsContainer) {
            settingsContainer.remove();
        }
        // Jeśli jest instancja settingsSystem, wyzeruj settingsContainer
        if (window.settingsSystem && window.settingsSystem.settingsContainer) {
            window.settingsSystem.settingsContainer = null;
        }
    }
}

// Funkcja do dodawania przycisku zamknięcia profilu
function addCloseProfileButton() {
    // Usuń istniejący przycisk jeśli istnieje
    const existingBtn = document.getElementById('closeProfileBtn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Dodaj nowy przycisk do nav-bar
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeProfileBtn';
        closeBtn.className = 'close-profile-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', closeUserProfile);
        
        // Wstaw na początku nav-bar
        navBar.insertBefore(closeBtn, navBar.firstChild);
    }
}

// Funkcja do zamykania profilu użytkownika
function closeUserProfile() {
    // Usuń klasę profilu z body
    document.body.classList.remove('user-profile-active');
    
    // Usuń przycisk zamknięcia
    const closeBtn = document.getElementById('closeProfileBtn');
    if (closeBtn) {
        closeBtn.remove();
    }
    
    // NAPRAWKA: Przywróć side-menu BEZ otwierania i bez migania
    const globalSideMenu = document.getElementById('globalSideMenu');
    if (globalSideMenu) {
        // Najpierw ukryj menu bez animacji
        globalSideMenu.style.transition = 'none';
        globalSideMenu.style.transform = 'translateX(-100%)';
        globalSideMenu.style.opacity = '0';
        globalSideMenu.classList.remove('hidden', 'open', 'closing');
        
        // Następnie przywróć funkcjonalność po krótkiej przerwie
        setTimeout(() => {
            globalSideMenu.style.transition = '';
            globalSideMenu.style.transform = '';
            globalSideMenu.style.opacity = '';
        }, 50);
        // Najpierw ustaw jako ukryte, żeby nie było migania
        globalSideMenu.style.visibility = 'hidden';
        globalSideMenu.classList.remove('hidden');
        globalSideMenu.classList.remove('open'); // Upewnij się, że nie jest otwarte
        // Przywróć widoczność po małym opóźnieniu
        setTimeout(() => {
            globalSideMenu.style.visibility = '';
        }, 50);
    }
    
    // Wróć do home screen
    backToHome();
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
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    const globalSideMenu = document.getElementById('globalSideMenu');
    if (globalSideMenu) {
        globalSideMenu.classList.remove('hidden');
        globalSideMenu.classList.remove('open'); // NAPRAWKA: Zapewnij że menu nie jest otwarte
        globalSideMenu.style.visibility = 'visible';
    }
    
    // NAPRAWKA 3: Przywróć normalny stan przycisku użytkownika po wyjściu z profilu
    const homeUserBtn = document.querySelector('.user-btn');
    if (homeUserBtn) {
        homeUserBtn.style.animation = 'none';
        homeUserBtn.style.transform = 'none';
        homeUserBtn.style.transition = 'all 0.3s ease';
    }
    
    // Update mobile dock active state
    if (typeof modernSidebar !== 'undefined' && modernSidebar.updateDockActiveState) {
        modernSidebar.updateDockActiveState('home');
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

async function showUserProfile() {
    currentScreen = "app";
    
    // NAPRAWKA 2: Nie ukrywaj side-menu w userpage - powinno być dostępne
    const globalSideMenu = document.getElementById('globalSideMenu');
    if (globalSideMenu) {
        // Tylko zamknij menu jeśli jest otwarte, ale nie ukrywaj
        globalSideMenu.classList.remove('open', 'closing');
        globalSideMenu.style.transform = '';
        globalSideMenu.style.opacity = '';
        globalSideMenu.style.visibility = '';
    }
    
    // NAPRAWKA 2: Zatrzymaj animację przycisku użytkownika
    const profileUserBtn = document.querySelector('.user-btn');
    if (profileUserBtn) {
        profileUserBtn.style.animation = 'none';
        profileUserBtn.style.transform = 'none';
        profileUserBtn.style.transition = 'all 0.3s ease';
    }
    
    // Update mobile dock active state
    if (typeof modernSidebar !== 'undefined' && modernSidebar.updateDockActiveState) {
        modernSidebar.updateDockActiveState('profile');
    }
    
    // Load user profile resources dynamically
    if (typeof resourceLoader !== 'undefined') {
        await resourceLoader.loadAppResources('userProfile');
    }
    
    // Zamknij inne aktywne strony (About, Instructions)
    closeActivePages();
    
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
    
    // Dodaj przycisk zamknięcia profilu
    addCloseProfileButton();
    
    // Załaduj zapisane dane użytkownika
    if (typeof userProfileModals !== 'undefined') {
        userProfileModals.loadSavedSettings();
    }
    
    // Aktualizuj profil użytkownika z systemu autoryzacji
    if (typeof authSystem !== 'undefined' && authSystem) {
        authSystem.updateUserProfile();
        authSystem.updateAvatarInitials();
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

    // NAPRAWKA 3: NIE aktywuj animacji w userProfile - ma być zatrzymana
    // Animacja będzie zatrzymana wcześniej w funkcji
    
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



