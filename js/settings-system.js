// Settings System
class SettingsSystem {
    constructor() {
        this.currentSettings = this.loadSettings();
        this.settingsContainer = null;
    }

    // Helper function to get translated text
    t(key) {
        const keys = key.split('.');
        let translation = translations[currentLang] || translations['pl'];
        
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                return key;
            }
        }
        
        return translation || key;
    }

    // Load settings from localStorage
    loadSettings() {
        const defaultSettings = {
            language: currentLang || 'pl',
            theme: darkMode ? 'dark' : 'light',
            fontSize: 'medium',
            animations: true,
            emailNotifications: true,
            pushNotifications: false,
            soundNotifications: true
        };

        const saved = localStorage.getItem('eduverse_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('eduverse_settings', JSON.stringify(this.currentSettings));
        this.showNotification(this.t('userProfile.settings.save'), 'success');
    }

    // Apply setting changes
    applySetting(key, value) {
        this.currentSettings[key] = value;

        switch (key) {
            case 'language':
                this.changeLanguage(value);
                break;
            case 'theme':
                this.changeTheme(value);
                break;
            case 'fontSize':
                this.changeFontSize(value);
                break;
            case 'animations':
                this.toggleAnimations(value);
                break;
        }
    }

    // Change application language
    changeLanguage(lang) {
        if (typeof switchLanguage === 'function') {
            switchLanguage(lang);
        }
        this.updateSettingsUI();
    }

    // Change theme
    changeTheme(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            darkMode = true;
        } else if (theme === 'light') {
            body.classList.remove('dark-mode');
            darkMode = false;
        }
        
        localStorage.setItem('darkMode', darkMode);
        
        // Update theme toggle buttons
        if (typeof syncThemeToggleState === 'function') {
            syncThemeToggleState();
        }
    }

    // Change font size
    changeFontSize(size) {
        const root = document.documentElement;
        
        switch (size) {
            case 'small':
                root.style.setProperty('--font-size-base', '14px');
                break;
            case 'medium':
                root.style.setProperty('--font-size-base', '16px');
                break;
            case 'large':
                root.style.setProperty('--font-size-base', '18px');
                break;
        }
    }

    // Toggle animations
    toggleAnimations(enabled) {
        const root = document.documentElement;
        
        if (!enabled) {
            root.style.setProperty('--transition-duration', '0s');
            root.style.setProperty('--animation-duration', '0s');
        } else {
            root.style.removeProperty('--transition-duration');
            root.style.removeProperty('--animation-duration');
        }
    }

    // Show settings page
    showSettings() {
        // Zamknij inne aktywne strony (About, Instructions, UserProfile)
        if (typeof closeActivePages === 'function') {
            closeActivePages();
        }

        // Hide other screens
        document.querySelectorAll('.welcome-screen, .home-screen, .app-container').forEach(el => {
            if (el) el.style.display = 'none';
        });

        // Create settings container
        this.settingsContainer = document.createElement('div');
        this.settingsContainer.id = 'settingsContainer';
        this.settingsContainer.className = 'modern-settings';
        
        // Create settings content
        this.settingsContainer.innerHTML = this.createSettingsHTML();
        
        // Add to page
        document.body.appendChild(this.settingsContainer);
        
        // Add body class
        document.body.classList.add('settings-active');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Block body scrolling
        document.body.style.overflow = 'hidden';
    }

    // Hide settings page
    hideSettings() {
        if (this.settingsContainer) {
            document.body.removeChild(this.settingsContainer);
            this.settingsContainer = null;
        }
        
        document.body.classList.remove('settings-active');
        document.body.style.overflow = '';
        
        // Show home screen
        if (typeof backToHome === 'function') {
            backToHome();
        }
    }

    // Create settings HTML
    createSettingsHTML() {
        const settings = this.t('userProfile.settings');
        
        return `
            <button class="settings-back-btn" onclick="settingsSystem.hideSettings()">
                <i class="fas fa-arrow-left"></i>
                ${this.t('dashboard.back')}
            </button>
            
            <div class="settings-content-wrapper">
                <!-- Settings Hero -->
                <div class="settings-hero">
                    <h1 class="settings-title">${settings.title}</h1>
                    <p class="settings-subtitle">Dostosuj aplikację do swoich potrzeb</p>
                </div>

                <!-- General Settings -->
                <div class="settings-section">
                    <div class="section-header">
                        <i class="fas fa-cog"></i>
                        <h3>${settings.general}</h3>
                    </div>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.language}</div>
                                <div class="setting-description">Wybierz język interfejsu</div>
                            </div>
                            <div class="setting-control">
                                <select class="setting-select" id="languageSelect">
                                    <option value="pl" ${this.currentSettings.language === 'pl' ? 'selected' : ''}>Polski</option>
                                    <option value="en" ${this.currentSettings.language === 'en' ? 'selected' : ''}>English</option>
                                    <option value="de" ${this.currentSettings.language === 'de' ? 'selected' : ''}>Deutsch</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Appearance Settings -->
                <div class="settings-section">
                    <div class="section-header">
                        <i class="fas fa-palette"></i>
                        <h3>${settings.appearance}</h3>
                    </div>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.theme}</div>
                                <div class="setting-description">Wybierz wygląd aplikacji</div>
                            </div>
                            <div class="setting-control">
                                <select class="setting-select" id="themeSelect">
                                    <option value="light" ${this.currentSettings.theme === 'light' ? 'selected' : ''}>${settings.lightMode}</option>
                                    <option value="dark" ${this.currentSettings.theme === 'dark' ? 'selected' : ''}>${settings.darkMode}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.fontSize}</div>
                                <div class="setting-description">Dostosuj rozmiar tekstu</div>
                            </div>
                            <div class="setting-control">
                                <select class="setting-select" id="fontSizeSelect">
                                    <option value="small" ${this.currentSettings.fontSize === 'small' ? 'selected' : ''}>${settings.fontSizes.small}</option>
                                    <option value="medium" ${this.currentSettings.fontSize === 'medium' ? 'selected' : ''}>${settings.fontSizes.medium}</option>
                                    <option value="large" ${this.currentSettings.fontSize === 'large' ? 'selected' : ''}>${settings.fontSizes.large}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.animations}</div>
                                <div class="setting-description">Włącz lub wyłącz animacje</div>
                            </div>
                            <div class="setting-control">
                                <div class="toggle-switch ${this.currentSettings.animations ? 'active' : ''}" id="animationsToggle"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notification Settings -->
                <div class="settings-section">
                    <div class="section-header">
                        <i class="fas fa-bell"></i>
                        <h3>${settings.notifications}</h3>
                    </div>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.emailNotifications}</div>
                                <div class="setting-description">Otrzymuj powiadomienia na email</div>
                            </div>
                            <div class="setting-control">
                                <div class="toggle-switch ${this.currentSettings.emailNotifications ? 'active' : ''}" id="emailNotificationsToggle"></div>
                            </div>
                        </div>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.pushNotifications}</div>
                                <div class="setting-description">Powiadomienia w przeglądarce</div>
                            </div>
                            <div class="setting-control">
                                <div class="toggle-switch ${this.currentSettings.pushNotifications ? 'active' : ''}" id="pushNotificationsToggle"></div>
                            </div>
                        </div>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-title">${settings.soundNotifications}</div>
                                <div class="setting-description">Dźwięki powiadomień</div>
                            </div>
                            <div class="setting-control">
                                <div class="toggle-switch ${this.currentSettings.soundNotifications ? 'active' : ''}" id="soundNotificationsToggle"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="settings-actions">
                    <button class="settings-btn primary" onclick="settingsSystem.saveSettings()">
                        <i class="fas fa-save"></i>
                        ${settings.save}
                    </button>
                    <button class="settings-btn secondary" onclick="settingsSystem.resetSettings()">
                        <i class="fas fa-undo"></i>
                        ${settings.reset}
                    </button>
                    <button class="settings-btn secondary" onclick="settingsSystem.hideSettings()">
                        <i class="fas fa-times"></i>
                        ${settings.cancel}
                    </button>
                </div>
            </div>
        `;
    }

    // Setup event listeners
    setupEventListeners() {
        // Language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.applySetting('language', e.target.value);
            });
        }

        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.applySetting('theme', e.target.value);
            });
        }

        // Font size selector
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                this.applySetting('fontSize', e.target.value);
            });
        }

        // Toggle switches
        this.setupToggleSwitch('animationsToggle', 'animations');
        this.setupToggleSwitch('emailNotificationsToggle', 'emailNotifications');
        this.setupToggleSwitch('pushNotificationsToggle', 'pushNotifications');
        this.setupToggleSwitch('soundNotificationsToggle', 'soundNotifications');

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsContainer) {
                this.hideSettings();
            }
        });
    }

    // Setup toggle switch
    setupToggleSwitch(id, settingKey) {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.contains('active');
                const newValue = !isActive;
                
                if (newValue) {
                    toggle.classList.add('active');
                } else {
                    toggle.classList.remove('active');
                }
                
                this.applySetting(settingKey, newValue);
            });
        }
    }

    // Reset settings to default
    resetSettings() {
        this.currentSettings = {
            language: 'pl',
            theme: 'light',
            fontSize: 'medium',
            animations: true,
            emailNotifications: true,
            pushNotifications: false,
            soundNotifications: true
        };

        // Apply all settings
        Object.keys(this.currentSettings).forEach(key => {
            this.applySetting(key, this.currentSettings[key]);
        });

        // Refresh settings UI
        this.hideSettings();
        setTimeout(() => this.showSettings(), 100);
        
        this.showNotification('Ustawienia zostały przywrócone do domyślnych', 'success');
    }

    // Update settings UI after language change
    updateSettingsUI() {
        if (this.settingsContainer) {
            const content = this.settingsContainer.querySelector('.settings-content-wrapper');
            if (content) {
                // Store current scroll position
                const scrollPos = this.settingsContainer.scrollTop;
                
                // Update content
                this.settingsContainer.innerHTML = this.createSettingsHTML();
                this.setupEventListeners();
                
                // Restore scroll position
                this.settingsContainer.scrollTop = scrollPos;
            }
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Usuń istniejące powiadomienie jeśli jest
        const old = document.querySelector('.auth-notification');
        if (old) old.remove();

        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;

        // Ikona zależna od typu
        let iconClass = 'fas fa-info-circle';
        if (type === 'success') iconClass = 'fas fa-check-circle';
        if (type === 'error') iconClass = 'fas fa-times-circle';

        notification.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Pokaż powiadomienie (CSS transition)
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Ukryj po 3 sekundach
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
}

// Initialize settings system
const settingsSystem = new SettingsSystem();

// Export for use in other files
window.settingsSystem = settingsSystem;
