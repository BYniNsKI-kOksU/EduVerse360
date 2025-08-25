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
                if (menuBtn) {
                    menuBtn.style.display = 'block';
                    menuBtn.style.opacity = '1';
                    menuBtn.style.pointerEvents = 'auto';
                }
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
            newMenuBtn.style.opacity = '1';
            newMenuBtn.style.pointerEvents = 'auto';
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#globalSideMenu') && e.target !== newMenuBtn) {
        if (sideMenu && sideMenu.classList.contains('open')) {
            // Dodajemy klasę closing i usuwamy open po zakończeniu animacji
            sideMenu.classList.add('closing');
            sideMenu.classList.remove('open');
            
            // Obsługa zakończenia animacji
            sideMenu.addEventListener('animationend', function handler() {
                sideMenu.classList.remove('closing');
                sideMenu.removeEventListener('animationend', handler);
            });
            
            if (newMenuBtn) {
                newMenuBtn.style.display = 'block';
                newMenuBtn.style.opacity = '1';
                newMenuBtn.style.pointerEvents = 'auto';
            }
            }
        
            // POPRAWIONE: Dokładniejsze sprawdzanie czy profil jest widoczny
            if (isUserProfileVisible && !e.target.closest('.user-profile-container') && 
                !e.target.closest('.user-btn') && e.target !== userBtn) {
                document.getElementById('userProfileApp').classList.remove('active');
                isUserProfileVisible = false;
                backToHome();
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
        userBtn.removeEventListener('click', showUserProfile); // Remove any existing listener to prevent duplicates
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showUserProfile();
            userBtn.style.animation = 'none'; // Reset animation after click to prevent looping
            void userBtn.offsetWidth; // Trigger reflow
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