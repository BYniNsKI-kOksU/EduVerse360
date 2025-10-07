// Modern Sidebar Management System
// Handles sidebar navigation, user interactions, and integration with nav-bar

class ModernSidebar {
    constructor() {
        this.sidebar = null;
        this.toggle = null;
        this.userSection = null;
        this.navItems = [];
        this.isCollapsed = false;
        this.activeItem = null;
        this.currentUser = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createSidebar();
        this.setupEventListeners();
        this.syncWithAuth();
        this.updateTranslations();
    }

    createSidebar() {
        // Check if sidebar already exists
        if (document.querySelector('.modern-sidebar')) {
            this.sidebar = document.querySelector('.modern-sidebar');
            this.initializeExistingElements();
            return;
        }

        // Create sidebar structure
        const sidebar = document.createElement('div');
        sidebar.className = 'modern-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-brand">
                    <i class="fas fa-graduation-cap"></i>
                    <span>EduVerse 360</span>
                </div>
                <button class="sidebar-toggle" aria-label="Toggle Sidebar">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section">
                    <div class="nav-section-title" data-translate="sidebar.main">Główne</div>
                    <a href="#" class="nav-item" data-action="home">
                        <i class="fas fa-home"></i>
                        <span class="nav-item-text" data-translate="sidebar.home">Strona główna</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title" data-translate="sidebar.apps">Aplikacje</div>
                    <a href="#" class="nav-item" data-action="leapYear">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="nav-item-text" data-translate="sidebar.leapYear">Rok przestępny</span>
                    </a>
                    <a href="#" class="nav-item" data-action="matrixCalc">
                        <i class="fas fa-calculator"></i>
                        <span class="nav-item-text" data-translate="sidebar.matrix">Kalkulator macierzy</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title" data-translate="sidebar.help">Pomoc</div>
                    <a href="#" class="nav-item" data-action="about">
                        <i class="fas fa-info-circle"></i>
                        <span class="nav-item-text" data-translate="sidebar.about">O aplikacji</span>
                    </a>
                    <a href="#" class="nav-item" data-action="instructions">
                        <i class="fas fa-question-circle"></i>
                        <span class="nav-item-text" data-translate="sidebar.instructions">Instrukcja</span>
                    </a>
                    <a href="#" class="nav-item" data-action="settings">
                        <i class="fas fa-cog"></i>
                        <span class="nav-item-text" data-translate="sidebar.settings">Ustawienia</span>
                    </a>
                </div>
            </nav>

            <div class="sidebar-user-bottom">
                <div class="user-avatar" title="Profil użytkownika">
                    <div class="avatar-initials">G</div>
                </div>
                <div class="user-info">
                    <div class="user-name" data-translate="sidebar.guest">Gość</div>
                    <div class="user-status">
                        <span class="status-dot logged-out"></span>
                        <span data-translate="sidebar.offline">Offline</span>
                    </div>
                </div>
                <button class="sidebar-auth-inline" data-action="auth" title="Zaloguj">
                    <i class="fas fa-sign-in-alt"></i>
                </button>
            </div>
        `;

        document.body.appendChild(sidebar);
        this.sidebar = sidebar;
        
        // Set collapsed state but keep visible (will be hidden by CSS initially)
        this.sidebar.classList.add('collapsed');
        this.isCollapsed = true;
        
        this.initializeExistingElements();
    }

    initializeExistingElements() {
        this.toggle = this.sidebar.querySelector('.sidebar-toggle');
        this.userSection = this.sidebar.querySelector('.sidebar-user-bottom');
        this.userAvatar = this.sidebar.querySelector('.user-avatar');
        this.authBtn = this.sidebar.querySelector('.sidebar-auth-inline');
        this.navItems = Array.from(this.sidebar.querySelectorAll('.nav-item'));
        
        // Check saved collapsed state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'false') {
            this.sidebar.classList.remove('collapsed');
            this.isCollapsed = false;
        }
    }

    setupEventListeners() {
        // Toggle button
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Navigation items
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Auth button
        if (this.authBtn) {
            this.authBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAuth();
            });
        }

        // User avatar click - navigate to profile
        if (this.userAvatar) {
            this.userAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigateToProfile();
            });
        }

        // User section hover effect
        if (this.userSection) {
            this.userSection.addEventListener('click', (e) => {
                // Only if not clicking on avatar or auth button
                if (!e.target.closest('.user-avatar') && !e.target.closest('.sidebar-auth-inline')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.navigateToProfile();
                }
            });
        }

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && !e.target.closest('.menu-btn')) {
                    this.closeSidebarOnMobile();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Listen for auth state changes
        window.addEventListener('authStateChanged', (e) => {
            console.log('ModernSidebar received authStateChanged event:', e.detail);
            this.updateUserDisplay(e.detail);
        });

        // Listen for auth system ready (initial state)
        window.addEventListener('authSystemReady', (e) => {
            console.log('ModernSidebar received authSystemReady event:', e.detail);
            this.updateUserDisplay(e.detail);
        });

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateTranslations();
        });
    }

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        this.sidebar.classList.toggle('collapsed');
        
        // Save state
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
        
        // Trigger event for other components
        window.dispatchEvent(new CustomEvent('sidebarToggled', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    handleNavigation(e) {
        e.preventDefault();
        const item = e.currentTarget;
        const action = item.dataset.action;

        // Update active state
        this.setActiveItem(item);

        // Handle different actions
        switch (action) {
            case 'home':
                this.navigateToHome();
                break;
            case 'profile':
                this.navigateToProfile();
                break;
            case 'leapYear':
                this.navigateToApp('leapYear');
                break;
            case 'matrixCalc':
                this.navigateToApp('matrixCalc');
                break;
            case 'about':
                this.showAbout();
                break;
            case 'instructions':
                this.showInstructions();
                break;
            case 'settings':
                this.showSettings();
                break;
            default:
                console.log('Unknown action:', action);
        }

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebarOnMobile();
        }
    }

    setActiveItem(item) {
        // Remove active from all items
        this.navItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active to clicked item
        item.classList.add('active');
        this.activeItem = item;
    }

    navigateToHome() {
        // Hide all screens
        const welcomeScreen = document.querySelector('.welcome-screen');
        const homeScreen = document.querySelector('.home-screen');
        const appContainer = document.querySelector('.app-container');

        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (homeScreen) {
            homeScreen.style.display = 'flex';
            currentScreen = 'home';
        }
        if (appContainer) appContainer.style.display = 'none';

        // Close any active pages
        if (typeof closeActivePages === 'function') {
            closeActivePages();
        }

        // Update UI
        if (typeof updateHomeUI === 'function') {
            updateHomeUI();
        }
    }

    navigateToProfile() {
        console.log('Navigating to profile...');
        if (typeof showUserProfile === 'function') {
            showUserProfile();
        } else {
            console.warn('showUserProfile function not found');
        }
    }

    navigateToApp(appName) {
        const appContainer = document.querySelector('.app-container');
        const homeScreen = document.querySelector('.home-screen');
        const welcomeScreen = document.querySelector('.welcome-screen');

        // Hide other screens
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (homeScreen) homeScreen.style.display = 'none';

        // Show app container
        if (appContainer) {
            appContainer.style.display = 'block';
        }

        // Hide all app contents
        document.querySelectorAll('.app-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Show selected app
        const appMap = {
            'leapYear': 'leapYearApp',
            'matrixCalc': 'matrixCalcApp'
        };

        const appId = appMap[appName];
        if (appId) {
            const appElement = document.getElementById(appId);
            if (appElement) {
                appElement.classList.add('active');
                appElement.style.display = 'flex';
                currentScreen = appName;

                // Initialize app if needed
                if (appName === 'leapYear' && typeof initializeLeapYear === 'function') {
                    initializeLeapYear();
                }
            }
        }

        // Close any active pages
        if (typeof closeActivePages === 'function') {
            closeActivePages();
        }
    }

    showAbout() {
        if (typeof showAboutInlineFromTemplate === 'function') {
            showAboutInlineFromTemplate();
        } else if (typeof showAboutFromDashboard === 'function') {
            showAboutFromDashboard();
        }
    }

    showInstructions() {
        if (typeof showInstructionsInlineFromTemplate === 'function') {
            showInstructionsInlineFromTemplate();
        } else if (typeof showInstructionsFromDashboard === 'function') {
            showInstructionsFromDashboard();
        } else if (typeof showInstructionsInline === 'function') {
            showInstructionsInline();
        }
    }

    showSettings() {
        if (typeof settingsSystem !== 'undefined' && settingsSystem.showSettings) {
            settingsSystem.showSettings();
        }
    }

    handleUserClick() {
        // Navigate to profile when user section is clicked
        this.navigateToProfile();
    }

    handleAuth() {
        console.log('Auth button clicked, current user:', this.currentUser);
        // Handle auth button click
        if (this.currentUser && this.currentUser.isLoggedIn) {
            // Logout
            console.log('Logging out...');
            if (typeof authSystem !== 'undefined' && authSystem.logout) {
                authSystem.logout();
            } else {
                console.warn('authSystem.logout not found');
            }
        } else {
            // Show login modal
            console.log('Showing login modal...');
            if (typeof authSystem !== 'undefined' && authSystem.openAuthModal) {
                authSystem.openAuthModal();
            } else {
                console.warn('authSystem.openAuthModal not found');
            }
        }
    }

    loadUserData() {
        // Load user data from localStorage or auth system
        const userData = localStorage.getItem('currentUser');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (userData && isLoggedIn) {
            try {
                const user = JSON.parse(userData);
                this.currentUser = { ...user, isLoggedIn: true };
                this.updateUserDisplay(this.currentUser);
            } catch (e) {
                console.error('Error loading user data:', e);
                this.updateUserDisplay(null);
            }
        } else {
            this.updateUserDisplay(null);
        }
    }

    updateUserDisplay(user) {
        console.log('ModernSidebar.updateUserDisplay called with user:', user);
        this.currentUser = user;
        
        const avatarElement = this.sidebar.querySelector('.user-avatar');
        const nameElement = this.sidebar.querySelector('.user-name');
        const statusElement = this.sidebar.querySelector('.user-status');
        const statusDot = this.sidebar.querySelector('.status-dot');
        const authButton = this.sidebar.querySelector('.sidebar-auth-inline');
        
        console.log('Auth button element:', authButton);

        if (!avatarElement || !nameElement || !statusElement) return;

        if (user && user.isLoggedIn) {
            // Update avatar
            const initialsElement = avatarElement.querySelector('.avatar-initials');
            if (user.avatar) {
                avatarElement.innerHTML = `<img src="${user.avatar}" alt="${user.name}">`;
            } else {
                const initials = this.generateInitials(user.name || 'User');
                if (initialsElement) {
                    initialsElement.textContent = initials;
                } else {
                    avatarElement.innerHTML = `<div class="avatar-initials">${initials}</div>`;
                }
            }

            // Update name
            nameElement.textContent = user.name || 'Użytkownik';
            
            // Update status
            statusDot.classList.remove('logged-out');
            statusDot.classList.add('logged-in');
            const statusText = statusElement.querySelector('span:last-child');
            if (statusText) {
                statusText.textContent = this.getTranslation('sidebar.online') || 'Online';
            }

            // Update auth button to logout
            if (authButton) {
                authButton.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
                authButton.classList.add('logout');
                authButton.setAttribute('aria-label', 'Logout');
                const logoutText = this.getTranslation('auth.logout') || 'Wyloguj';
                authButton.title = logoutText;
            }
        } else {
            // Guest mode
            avatarElement.innerHTML = '<div class="avatar-initials">G</div>';
            nameElement.textContent = this.getTranslation('sidebar.guest') || 'Gość';
            
            statusDot.classList.remove('logged-in');
            statusDot.classList.add('logged-out');
            const statusText = statusElement.querySelector('span:last-child');
            if (statusText) {
                statusText.textContent = this.getTranslation('sidebar.offline') || 'Offline';
            }

            // Update auth button to login
            if (authButton) {
                authButton.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
                authButton.classList.remove('logout');
                authButton.setAttribute('aria-label', 'Login');
                const loginText = this.getTranslation('auth.login') || 'Zaloguj';
                authButton.title = loginText;
            }
        }
    }

    generateInitials(name) {
        if (!name) return 'U';
        
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    syncWithAuth() {
        console.log('syncWithAuth called');
        // Sync with auth system if available
        if (typeof authSystem !== 'undefined' && authSystem.currentUser) {
            console.log('Found authSystem with user:', authSystem.currentUser);
            this.updateUserDisplay({ ...authSystem.currentUser, isLoggedIn: true });
        } else {
            // Check localStorage for logged in user
            const savedUser = localStorage.getItem('currentUser');
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            console.log('Checking localStorage - savedUser:', savedUser, 'isLoggedIn:', isLoggedIn);
            
            if (savedUser && isLoggedIn) {
                try {
                    const user = JSON.parse(savedUser);
                    console.log('Loaded user from localStorage:', user);
                    this.updateUserDisplay({ ...user, isLoggedIn: true });
                } catch (e) {
                    console.error('Error parsing saved user:', e);
                    this.updateUserDisplay(null);
                }
            } else {
                console.log('No user found, showing guest mode');
                this.updateUserDisplay(null);
            }
        }
    }

    closeSidebarOnMobile() {
        if (window.innerWidth <= 768 && !this.isCollapsed) {
            this.toggleSidebar();
        }
    }

    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth > 768 && this.isCollapsed) {
            // Optionally expand on larger screens
            // Uncomment if you want this behavior:
            // this.toggleSidebar();
        }
    }

    updateTranslations() {
        // Update all translatable elements
        const translatableElements = this.sidebar.querySelectorAll('[data-translate]');
        
        translatableElements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Update auth button title based on current state
        const authButton = this.sidebar.querySelector('.sidebar-auth-inline');
        if (authButton) {
            if (this.currentUser && this.currentUser.isLoggedIn) {
                const logoutText = this.getTranslation('auth.logout') || 'Wyloguj';
                authButton.title = logoutText;
            } else {
                const loginText = this.getTranslation('auth.login') || 'Zaloguj';
                authButton.title = loginText;
            }
        }

        // Update mobile dock tooltips
        this.updateMobileDockTooltips();
    }

    updateMobileDockTooltips() {
        const dockButtons = document.querySelectorAll('.mobile-dock .dock-btn');
        const tooltips = {
            'profile': this.getTranslation('dashboard.profile') || 'Profil',
            'matrixCalculator': this.getTranslation('sidebar.matrix') || 'Kalkulator',
            'home': this.getTranslation('sidebar.home') || 'Strona główna',
            'leapYear': this.getTranslation('sidebar.leapYear') || 'Rok przestępny',
            'menu': this.getTranslation('dashboard.menu') || 'Menu'
        };

        dockButtons.forEach(button => {
            const action = button.dataset.action;
            if (tooltips[action]) {
                button.setAttribute('data-tooltip', tooltips[action]);
            }
        });
    }

    getTranslation(key) {
        // Get translation from global translations object
        if (typeof translations === 'undefined' || typeof currentLang === 'undefined') {
            return null;
        }

        const keys = key.split('.');
        let translation = translations[currentLang];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return null;
            }
        }
        
        return typeof translation === 'string' ? translation : null;
    }

    // Public methods for external control
    show() {
        this.sidebar.style.display = 'flex';
        // Animate in
        setTimeout(() => {
            this.sidebar.style.opacity = '1';
        }, 10);
    }

    hide() {
        this.sidebar.style.opacity = '0';
        setTimeout(() => {
            this.sidebar.style.display = 'none';
        }, 300);
    }

    setActive(action) {
        const item = this.navItems.find(nav => nav.dataset.action === action);
        if (item) {
            this.setActiveItem(item);
        }
    }

    // Show sidebar when leaving welcome screen
    showOnAppStart() {
        if (this.sidebar) {
            this.sidebar.style.opacity = '1';
            this.sidebar.style.transform = 'translateX(0)';
            this.sidebar.style.pointerEvents = 'auto';
        }
    }
}

// Navbar Integration
class NavbarManager {
    constructor() {
        this.navbar = null;
        this.themeToggle = null;
        this.langButton = null;
        this.userButton = null;
        this.mobileDashboard = null;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.navbar = document.querySelector('.nav-bar');
        if (!this.navbar) return;
        
        this.setupElements();
        this.setupEventListeners();
        this.setupMobileDashboard();
    }

    setupElements() {
        this.themeToggle = document.getElementById('themeToggleBtn');
        this.langButton = document.querySelector('.lang-btn');
        this.userButton = document.getElementById('showUserProfileBtn');
    }

    // Show navbar when app starts (leaving welcome screen)
    showOnAppStart() {
        if (this.navbar) {
            this.navbar.style.opacity = '1';
            this.navbar.style.transform = 'translateX(0)';
            this.navbar.style.pointerEvents = 'auto';
        }
    }

    // Hide navbar
    hide() {
        if (this.navbar) {
            this.navbar.style.opacity = '0';
            this.navbar.style.transform = 'translateX(100px)';
            this.navbar.style.pointerEvents = 'none';
        }
    }

    setupEventListeners() {
        // Theme toggle - już obsługiwane w script.js, nie dodawaj duplikatu
        // Language button - już obsługiwane w script.js, nie dodawaj duplikatu
        // User button - już obsługiwane w script.js, nie dodawaj duplikatu
        
        // Tylko logowanie do debugowania jeśli przyciski istnieją
        if (this.themeToggle) {
            console.log('Theme toggle button found:', this.themeToggle);
        }
        if (this.langButton) {
            console.log('Language button found:', this.langButton);
        }
        if (this.userButton) {
            console.log('User button found:', this.userButton);
        }

        // Language menu items
        const langMenuItems = document.querySelectorAll('.nav-lang-menu [data-lang]');
        langMenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang && typeof switchLanguage === 'function') {
                    switchLanguage(lang);
                    this.closeLanguageMenu();
                }
            });
        });

        // Close menus on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-container') && !e.target.closest('.nav-lang-menu')) {
                this.closeLanguageMenu();
            }
        });
    }

    toggleLanguageMenu() {
        const langMenu = document.querySelector('.nav-lang-menu');
        if (!langMenu) return;

        const isOpen = langMenu.classList.contains('open');
        
        if (isOpen) {
            langMenu.classList.add('closing');
            langMenu.classList.remove('open');
            setTimeout(() => {
                langMenu.classList.remove('closing');
            }, 300);
        } else {
            langMenu.classList.add('open');
        }
    }

    closeLanguageMenu() {
        const langMenu = document.querySelector('.nav-lang-menu');
        if (langMenu && langMenu.classList.contains('open')) {
            langMenu.classList.add('closing');
            langMenu.classList.remove('open');
            setTimeout(() => {
                langMenu.classList.remove('closing');
            }, 300);
        }
    }

    setupMobileDashboard() {
        this.mobileDashboard = document.getElementById('mobileDashboard');
        const toggleButton = document.querySelector('.mobile-dashboard-toggle');
        const closeButton = document.querySelector('.dashboard-close-btn');

        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleMobileDashboard());
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeMobileDashboard());
        }

        // Dashboard action buttons
        const dashboardButtons = document.querySelectorAll('.dashboard-btn');
        dashboardButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleDashboardAction(e));
        });

        // Language submenu
        this.setupLanguageSubmenu();

        // Setup Mobile Dock
        this.setupMobileDock();
    }

    setupMobileDock() {
        const mobileDock = document.querySelector('.mobile-dock');
        if (!mobileDock) return;

        const dockButtons = mobileDock.querySelectorAll('.dock-btn');
        dockButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                this.handleDockAction(action, e);
            });
        });
    }

    handleDockAction(action, event) {
        // Remove active class from all dock buttons
        const dockButtons = document.querySelectorAll('.mobile-dock .dock-btn');
        dockButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }

        switch (action) {
            case 'home':
                if (typeof backToHome === 'function') {
                    backToHome();
                }
                break;
            case 'profile':
                if (typeof showUserProfile === 'function') {
                    showUserProfile();
                }
                break;
            case 'matrixCalculator':
                this.navigateToApp('matrixCalc');
                break;
            case 'leapYear':
                this.navigateToApp('leapYear');
                break;
            case 'menu':
                this.toggleMobileDashboard();
                break;
        }
    }

    toggleMobileDashboard() {
        if (!this.mobileDashboard) return;

        const isOpen = this.mobileDashboard.classList.contains('open');
        const toggleButton = document.querySelector('.mobile-dashboard-toggle');
        const mobileDock = document.querySelector('.mobile-dock');

        if (isOpen) {
            this.closeMobileDashboard();
        } else {
            this.mobileDashboard.classList.remove('hidden', 'closing');
            this.mobileDashboard.classList.add('open');
            if (toggleButton) toggleButton.classList.add('active');
            
            // Hide mobile dock when dashboard opens
            if (mobileDock) {
                mobileDock.classList.add('hidden');
            }
        }
    }

    closeMobileDashboard() {
        if (!this.mobileDashboard) return;

        const toggleButton = document.querySelector('.mobile-dashboard-toggle');
        const mobileDock = document.querySelector('.mobile-dock');
        
        this.mobileDashboard.classList.add('closing');
        this.mobileDashboard.classList.remove('open');
        if (toggleButton) toggleButton.classList.remove('active');

        setTimeout(() => {
            this.mobileDashboard.classList.add('hidden');
            this.mobileDashboard.classList.remove('closing');
            
            // Show mobile dock when dashboard closes
            if (mobileDock) {
                mobileDock.classList.remove('hidden');
            }
        }, 300);
    }

    handleDashboardAction(e) {
        const button = e.currentTarget;
        const action = button.dataset.action;

        switch (action) {
            case 'home':
                if (typeof backToHome === 'function') {
                    backToHome();
                }
                break;
            case 'profile':
                if (typeof showUserProfile === 'function') {
                    showUserProfile();
                }
                break;
            case 'auth':
                if (typeof authSystem !== 'undefined') {
                    authSystem.openAuthModal();
                }
                break;
            case 'theme':
                if (typeof toggleDarkMode === 'function') {
                    toggleDarkMode();
                    this.updateDashboardThemeButton();
                }
                break;
            case 'language-menu':
                this.showLanguageSubmenu();
                return; // Don't close dashboard
            case 'language':
                const lang = button.dataset.lang;
                if (lang && typeof switchLanguage === 'function') {
                    switchLanguage(lang);
                }
                this.hideLanguageSubmenu();
                break;
            case 'leapYear':
            case 'matrixCalculator':
                const appName = action === 'leapYear' ? 'leapYear' : 'matrixCalc';
                this.navigateToApp(appName);
                break;
            case 'about':
                if (typeof showAboutFromDashboard === 'function') {
                    showAboutFromDashboard();
                }
                break;
            case 'instructions':
                if (typeof showInstructionsFromDashboard === 'function') {
                    showInstructionsFromDashboard();
                }
                break;
        }

        this.closeMobileDashboard();
    }

    navigateToApp(appName) {
        const homeScreen = document.querySelector('.home-screen');
        const welcomeScreen = document.querySelector('.welcome-screen');
        const appContainer = document.querySelector('.app-container');

        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (homeScreen) homeScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';

        document.querySelectorAll('.app-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        const appMap = {
            'leapYear': 'leapYearApp',
            'matrixCalc': 'matrixCalcApp'
        };

        const appId = appMap[appName];
        if (appId) {
            const appElement = document.getElementById(appId);
            if (appElement) {
                appElement.classList.add('active');
                appElement.style.display = 'flex';
                
                if (appName === 'leapYear' && typeof initializeLeapYear === 'function') {
                    initializeLeapYear();
                }
            }
        }
    }

    setupLanguageSubmenu() {
        const submenu = document.getElementById('languageSubmenu');
        const backButton = submenu?.querySelector('.dashboard-back-btn');

        if (backButton) {
            backButton.addEventListener('click', () => this.hideLanguageSubmenu());
        }
    }

    showLanguageSubmenu() {
        const submenu = document.getElementById('languageSubmenu');
        const mainContent = this.mobileDashboard?.querySelector('.dashboard-content');

        if (submenu && mainContent) {
            mainContent.style.display = 'none';
            submenu.style.display = 'flex';
        }
    }

    hideLanguageSubmenu() {
        const submenu = document.getElementById('languageSubmenu');
        const mainContent = this.mobileDashboard?.querySelector('.dashboard-content');

        if (submenu && mainContent) {
            submenu.style.display = 'none';
            mainContent.style.display = 'block';
        }
    }

    updateDashboardThemeButton() {
        const themeBtn = document.querySelector('.dashboard-btn[data-action="theme"]');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            const text = themeBtn.querySelector('span');
            
            if (document.body.classList.contains('dark-mode')) {
                if (icon) icon.className = 'fas fa-sun';
                if (text) text.textContent = 'Tryb jasny';
            } else {
                if (icon) icon.className = 'fas fa-moon';
                if (text) text.textContent = 'Tryb ciemny';
            }
        }
    }
}

// Initialize both systems
let modernSidebar;
let navbarManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        modernSidebar = new ModernSidebar();
        navbarManager = new NavbarManager();
        
        // Make globally available
        window.modernSidebar = modernSidebar;
        window.navbarManager = navbarManager;
    });
} else {
    modernSidebar = new ModernSidebar();
    navbarManager = new NavbarManager();
    
    window.modernSidebar = modernSidebar;
    window.navbarManager = navbarManager;
}

// Global function to show sidebar and navbar when app starts
window.showNavigationElements = function() {
    if (window.modernSidebar) {
        window.modernSidebar.showOnAppStart();
    }
    if (window.navbarManager) {
        window.navbarManager.showOnAppStart();
    }
};

// Global function to hide sidebar and navbar
window.hideNavigationElements = function() {
    if (window.modernSidebar) {
        window.modernSidebar.hide();
    }
    if (window.navbarManager) {
        window.navbarManager.hide();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernSidebar, NavbarManager };
}
