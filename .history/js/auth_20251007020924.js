// Authentication System
class AuthSystem {
    constructor() {
        this.users = [];
        this.currentUser = null;
        // Załaduj użytkowników asynchronicznie, a następnie zainicjalizuj UI.
        // Dzięki temu `initializeAuthUI` wykona się dopiero po odczycie localStorage
        // i nie będzie nadpisywać stanu logowania z powodu wyścigu (race condition).
        this.loadUsers().then(() => {
            this.initializeAuthUI();
        }).catch(err => {
            console.error('Błąd podczas ładowania użytkowników:', err);
            // Nawet gdy błąd - zainicjalizuj UI żeby strona się nie zablokowała
            this.initializeAuthUI();
        });

        let tabToastTimeout = null;
        let tabToastShown = false;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.getElementById('authModal');
                if (modal && modal.classList.contains('active')) {
                    // Kropka tylko przy aktywnym polu hasła
                    setTimeout(() => {
                        const activeInput = document.activeElement;
                        if (activeInput && activeInput.type === 'password' && activeInput.closest('.password-input-wrapper')) {
                            const wrapper = activeInput.closest('.password-input-wrapper');
                            if (!wrapper.querySelector('.tab-indicator')) {
                                const dot = document.createElement('div');
                                dot.className = 'tab-indicator';
                                wrapper.appendChild(dot);
                            }
                            wrapper.classList.add('tab-active');
                        }
                    }, 0);
                    // Toast informacyjny tylko raz na otwarcie modala
                    if (!tabToastShown) {
                        tabToastShown = true;
                        if (!document.querySelector('.tab-info-toast')) {
                            const toast = document.createElement('div');
                            toast.className = 'tab-info-toast';
                            toast.textContent = 'Używasz klawisza TAB do nawigacji';
                            document.body.appendChild(toast);
                            setTimeout(() => {
                                toast.classList.add('show');
                            }, 10);
                            tabToastTimeout = setTimeout(() => {
                                toast.classList.remove('show');
                                setTimeout(() => toast.remove(), 400);
                            }, 2000);
                        }
                    }
                }
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') {
                // Ukryj kropkę po opuszczeniu pola hasła
                document.querySelectorAll('.password-input-wrapper.tab-active').forEach(el => {
                    el.classList.remove('tab-active');
                });
            }
        });
        // Ukryj kropkę, gdy focus opuści pole hasła
        document.addEventListener('focusin', (e) => {
            document.querySelectorAll('.password-input-wrapper.tab-active').forEach(el => {
                if (!el.contains(e.target)) {
                    el.classList.remove('tab-active');
                }
            });
        });
        // Resetuj flagę toastu przy każdym otwarciu modala
        const origOpenAuthModal = this.openAuthModal.bind(this);
        this.openAuthModal = function() {
            tabToastShown = false;
            origOpenAuthModal();
        }
    }

    // Symulacja ładowania użytkowników (w prawdziwej aplikacji to byłby request do API)
    async loadUsers() {
        try {
            // Najpierw spróbuj załadować listę użytkowników z localStorage (persistencja po stronie klienta)
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                try {
                    this.users = JSON.parse(savedUsers);
                    console.log('Załadowano listę użytkowników z localStorage:', this.users);
                } catch (err) {
                    console.error('Błąd parsowania savedUsers:', err);
                    localStorage.removeItem('users');
                }
            } else {
                // Brak zapisanych użytkowników — użyj domyślnych danych w kodzie
                this.users = [
                    {
                        id: 1,
                        username: "admin",
                        email: "admin@eduverse360.pl",
                        password: "admin123",
                        firstName: "Jan",
                        lastName: "Kowalski",
                        registeredAt: "2024-01-01T10:00:00Z",
                        lastLogin: "2024-12-10T09:30:00Z",
                        isActive: true,
                        level: 12,
                        xp: 750,
                        maxXp: 1000,
                        role: "Matematyk • Student",
                        avatar: null
                    }
                ];
                // Zapisz domyślne do localStorage, żeby przyszłe zmiany były trwałe
                this.saveUsers();
            }

            // Sprawdź czy użytkownik jest zalogowany w localStorage
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    this.currentUser = JSON.parse(savedUser);
                    console.log('Załadowano użytkownika z localStorage:', this.currentUser);
                } catch (error) {
                    console.error('Błąd parsowania savedUser:', error);
                    localStorage.removeItem('currentUser');
                }
            }
        } catch (error) {
            console.error('Błąd podczas ładowania użytkowników:', error);
        }
    }

    // Zapisz listę użytkowników do localStorage (klient nie może zapisać pliku .json na serwerze)
    saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Błąd podczas zapisywania użytkowników do localStorage:', error);
        }
    }

    // Inicjalizacja UI autoryzacji
    initializeAuthUI() {
        this.createAuthModal();
        // Ustaw domyślną ikonę użytkownika
        this.updateAvatarInitials();
        // Aktualizuj interfejs na podstawie stanu logowania
        this.updateUserInterface();
    }

    // Stwórz przycisk autoryzacji w nav-bar
    createAuthButton() {
        const navBar = document.querySelector('.nav-bar');
        if (!navBar || document.getElementById('authBtn')) return;

        const authBtn = document.createElement('button');
        authBtn.id = 'authBtn';
        authBtn.className = 'auth-btn login-btn';
        authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
        authBtn.title = 'Zaloguj się / Zarejestruj';
        authBtn.addEventListener('click', () => this.openAuthModal());

        // Wstaw przed user-btn
        const userBtn = navBar.querySelector('.user-btn');
        if (userBtn) {
            navBar.insertBefore(authBtn, userBtn);
        } else {
            navBar.appendChild(authBtn);
        }
    }
    
    // Stwórz przycisk wylogowania w nav-bar
    createLogoutButton() {
        const navBar = document.querySelector('.nav-bar');
        if (!navBar || document.getElementById('logoutBtn')) return;

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.className = 'auth-btn logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = 'Wyloguj się';
        logoutBtn.addEventListener('click', () => this.logout());

        // Wstaw przed user-btn
        const userBtn = navBar.querySelector('.user-btn');
        if (userBtn) {
            navBar.insertBefore(logoutBtn, userBtn);
        } else {
            navBar.appendChild(logoutBtn);
        }
    }

    // Stwórz modal autoryzacji
    createAuthModal() {
        const modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'auth-modal-overlay';
        modal.innerHTML = `
            <div class="auth-modal">
                <div class="auth-modal-header">
                    <div class="auth-modal-title">
                        <span id="authModalTitle">Witaj ponownie!</span>
                        <span class="auth-modal-subtitle">Zaloguj się lub utwórz nowe konto</span>
                    </div>
                    <button class="auth-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="auth-modal-content">
                    <div class="auth-forms-container">
                    <!-- Login Form -->
                        <form id="loginForm" class="auth-form login-form">
                        <div class="form-group">
                            <label for="loginEmail">Email:</label>
                                <input type="email" id="loginEmail" placeholder="twoj@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Hasło:</label>
                            <div class="password-input-wrapper">
                                    <input type="password" id="loginPassword" placeholder="••••••••" required>
                                <button type="button" class="password-toggle" onclick="authSystem.togglePassword('loginPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-sign-in-alt"></i>
                                <span>Zaloguj się</span>
                        </button>
                            <div class="auth-switch-link">
                                <span>Nie masz konta? </span>
                                <a href="#" onclick="authSystem.switchAuthTab('register'); return false;">Zarejestruj się</a>
                            </div>
                    </form>
                    
                    <!-- Register Form -->
                        <form id="registerForm" class="auth-form register-form">
                        <div class="form-group">
                                <label for="registerUsername">Nazwa użytkownika:</label>
                                <input type="text" id="registerUsername" placeholder="Twoja nazwa" required>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email:</label>
                                <input type="email" id="registerEmail" placeholder="twoj@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Hasło:</label>
                            <div class="password-input-wrapper">
                                    <input type="password" id="registerPassword" placeholder="Min. 6 znaków" required minlength="6">
                                <button type="button" class="password-toggle" onclick="authSystem.togglePassword('registerPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerConfirmPassword">Potwierdź hasło:</label>
                            <div class="password-input-wrapper">
                                    <input type="password" id="registerConfirmPassword" placeholder="Powtórz hasło" required minlength="6">
                                <button type="button" class="password-toggle" onclick="authSystem.togglePassword('registerConfirmPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-user-plus"></i>
                                <span>Zarejestruj się</span>
                        </button>
                            <div class="auth-switch-link">
                                <span>Masz już konto? </span>
                                <a href="#" onclick="authSystem.switchAuthTab('login'); return false;">Zaloguj się</a>
                            </div>
                    </form>
                    </div>
                    
                    <div class="auth-message" id="authMessage"></div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupAuthModalEvents();
    }

    // Konfiguracja event listenerów dla modalu
    setupAuthModalEvents() {
        const modal = document.getElementById('authModal');
        const closeBtn = modal.querySelector('.auth-modal-close');
        const tabs = modal.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        // Zamknij modal
        closeBtn.addEventListener('click', () => this.closeAuthModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeAuthModal();
        });

        // Obsługa formularzy
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Otwórz modal autoryzacji
    openModal(type = 'login') {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Switch to requested tab
        this.switchAuthTab(type);
        
        // Dodaj kropkę sygnalizującą TAB jeśli nie istnieje
        const authModal = modal.querySelector('.auth-modal');
        if (authModal && !authModal.querySelector('.tab-indicator')) {
            const dot = document.createElement('div');
            dot.className = 'tab-indicator';
            authModal.appendChild(dot);
        }
        
        // Sprawdź czy można przewijać i dodaj odpowiednią klasę
        setTimeout(() => {
            this.checkScrollability();
        }, 100);
    }
    
    // Sprawdź czy modal content można przewijać
    checkScrollability() {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        
        const content = modal.querySelector('.auth-modal-content');
        if (!content) return;
        
        if (content.scrollHeight > content.clientHeight) {
            content.classList.add('has-scroll');
        } else {
            content.classList.remove('has-scroll');
        }
    }
    
    // Backward compatibility
    openAuthModal() {
        this.openModal('login');
    }

    // Zamknij modal autoryzacji
    closeAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        this.clearAuthMessage();
    }

    // Przełącz tab autoryzacji
    switchAuthTab(tabType) {
        const modal = document.getElementById('authModal');
        const container = modal.querySelector('.auth-forms-container');
        const title = modal.querySelector('#authModalTitle');
        const subtitle = modal.querySelector('.auth-modal-subtitle');
        const header = modal.querySelector('.auth-modal-header');

        console.log('switchAuthTab called with:', tabType);

        // Animacja tytułu i headera
        title.classList.add('title-changing');
        header.classList.add('switching');
        setTimeout(() => {
            title.classList.remove('title-changing');
            header.classList.remove('switching');
        }, 500);

        // Przesuń kontener
        if (tabType === 'register') {
            container.classList.add('show-register');
        } else {
            container.classList.remove('show-register');
        }

        // Update title and subtitle
        if (tabType === 'login') {
            title.textContent = 'Witaj ponownie!';
            subtitle.textContent = 'Zaloguj się do swojego konta';
        } else {
            title.textContent = 'Dołącz do nas!';
            subtitle.textContent = 'Utwórz nowe konto';
        }
        
        this.clearAuthMessage();
    }

    // Obsługa logowania
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            this.showAuthMessage('Logowanie udane!', 'success');
            setTimeout(() => {
                this.closeAuthModal();
                this.updateUserInterface();
            }, 1000);
        } else {
            this.showAuthMessage('Nieprawidłowy email lub hasło!', 'error');
        }
    }

    // Obsługa rejestracji
    async handleRegister(e) {
        e.preventDefault();
        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Walidacja
        if (password !== confirmPassword) {
            this.showAuthMessage('Hasła nie są identyczne!', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showAuthMessage('Użytkownik z tym emailem już istnieje!', 'error');
            return;
        }

        // Stwórz nowego użytkownika
        const newUser = {
            id: this.users.length + 1,
            username: email.split('@')[0],
            email: email,
            password: password, // W prawdziwej aplikacji hasło byłoby zahashowane
            firstName: firstName,
            lastName: lastName,
            registeredAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true,
            level: 1,
            xp: 0,
            maxXp: 100,
            role: "Nowy użytkownik",
            avatar: null
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.saveUsers(); // Zapisz zmiany użytkowników

        this.showAuthMessage('Rejestracja udana! Witamy w EduVerse 360!', 'success');
        setTimeout(() => {
            this.closeAuthModal();
            this.updateUserInterface();
        }, 1500);
    }

    // Wylogowanie
    logout() {
        // Pokaż modal potwierdzenia
        this.showLogoutConfirmation();
    }
    
    // Pokaż modal potwierdzenia wylogowania
    showLogoutConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'logout-modal-overlay';
        modal.innerHTML = `
            <div class="logout-modal">
                <div class="logout-modal-header">
                    <i class="fas fa-sign-out-alt"></i>
                    <h3>Potwierdzenie wylogowania</h3>
                </div>
                <div class="logout-modal-content">
                    <p>Czy na pewno chcesz się wylogować?</p>
                    <div class="logout-modal-buttons">
                        <button class="logout-cancel-btn">
                            <i class="fas fa-times"></i>
                            Anuluj
                        </button>
                        <button class="logout-confirm-btn">
                            <i class="fas fa-check"></i>
                            Wyloguj się
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Animacja pojawiania
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Event listenery
        const cancelBtn = modal.querySelector('.logout-cancel-btn');
        const confirmBtn = modal.querySelector('.logout-confirm-btn');
        
        cancelBtn.addEventListener('click', () => {
            this.closeLogoutModal(modal);
        });
        
        confirmBtn.addEventListener('click', () => {
            this.performLogout();
            this.closeLogoutModal(modal);
        });
        
        // Zamknij po kliknięciu w tło
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeLogoutModal(modal);
            }
        });
    }
    
    // Zamknij modal wylogowania
    closeLogoutModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.classList.remove('modal-open');
            document.body.removeChild(modal);
        }, 300);
    }
    
    // Wykonaj faktyczne wylogowanie
    performLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUserInterface();
        
        // Jeśli jesteśmy na profilu użytkownika, wróć do home
        if (document.body.classList.contains('user-profile-active')) {
            if (typeof closeUserProfile === 'function') {
                closeUserProfile();
            }
        }
        
        // Pokaż powiadomienie
        this.showNotification('Wylogowano pomyślnie!', 'success');
    }
    
    // Pokaż powiadomienie
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Aktualizuj interfejs użytkownika
    updateUserInterface() {
        const authBtn = document.getElementById('authBtn');
        const mobileAuthBtn = document.getElementById('mobileDashboardAuthBtn');
        
        if (this.currentUser) {
            // Użytkownik zalogowany - ukryj przycisk logowania, pokaż wylogowanie
            if (authBtn) {
                authBtn.remove(); // Usuń przycisk logowania
            }
            
            // Stwórz przycisk wylogowania jeśli nie istnieje
            this.createLogoutButton();
            
            // Aktualizuj mobilny przycisk
            if (mobileAuthBtn) {
                mobileAuthBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Wyloguj się</span>';
                mobileAuthBtn.onclick = () => this.logout();
                mobileAuthBtn.className = 'dashboard-btn logout-mobile-btn';
            }
            
            // Aktualizuj profil użytkownika
            this.updateUserProfile();
        } else {
            // Użytkownik niezalogowany - usuń przycisk wylogowania, stwórz logowanie
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.remove();
            }
            
            // Stwórz przycisk logowania jeśli nie istnieje
            this.createAuthButton();
            
            // Aktualizuj mobilny przycisk
            if (mobileAuthBtn) {
                mobileAuthBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Zaloguj się</span>';
                mobileAuthBtn.onclick = () => this.openAuthModal();
                mobileAuthBtn.className = 'dashboard-btn login-mobile-btn';
            }
            
            // Resetuj profil do domyślnych wartości
            this.resetUserProfile();
        }
    }

    // Aktualizuj dane profilu użytkownika
    updateUserProfile() {
        if (!this.currentUser) return;

        const user = this.currentUser;
        
        // Aktualizuj nazwę
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.textContent = `${user.firstName} ${user.lastName}`;
        }

        // Aktualizuj email
        const profileEmail = document.querySelector('.profile-email');
        if (profileEmail) {
            profileEmail.textContent = user.email;
        }

        // Aktualizuj rolę
        const profileRole = document.querySelector('.profile-role');
        if (profileRole) {
            profileRole.textContent = user.role;
        }

        // Aktualizuj level i XP
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.textContent = `Poziom ${user.level}`;
        }

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressFill && progressText) {
            const progressPercent = (user.xp / user.maxXp) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressText.textContent = `${user.xp}/${user.maxXp} XP`;
        }

        // Aktualizuj avatar/inicjały
        this.updateAvatarInitials();
    }

    // Resetuj profil do domyślnych wartości
    resetUserProfile() {
        // Resetuj nazwę
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.textContent = 'Gość';
        }

        // Resetuj email
        const profileEmail = document.querySelector('.profile-email');
        if (profileEmail) {
            profileEmail.textContent = 'Zaloguj się, aby zobaczyć profil';
        }

        // Resetuj rolę
        const profileRole = document.querySelector('.profile-role');
        if (profileRole) {
            profileRole.textContent = 'Niezalogowany użytkownik';
        }

        // Resetuj level i XP
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.textContent = 'Poziom 0';
        }

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = '0%';
            progressText.textContent = '0/100 XP';
        }

        // Resetuj avatar na ikonę
        this.updateAvatarInitials();
    }

    // Aktualizuj inicjały w awatarze
    updateAvatarInitials() {
        if (!this.currentUser) {
            // Jeśli niezalogowany, pokaż ikonę użytkownika
            const avatarPlaceholder = document.querySelector('.avatar-placeholder');
            if (avatarPlaceholder) {
                avatarPlaceholder.innerHTML = '<i class="fas fa-user"></i>';
            }
            return;
        }

        const user = this.currentUser;
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.textContent = initials;
        }
    }

    // Pokaż wiadomość w modalu autoryzacji
    showAuthMessage(message, type) {
        const messageDiv = document.getElementById('authMessage');
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        // Dodaj klasę do .auth-modal dla efektu globalnego
        const modal = document.getElementById('authModal');
        const authModal = modal ? modal.querySelector('.auth-modal') : null;
        if (authModal) {
            authModal.classList.remove('auth-success', 'auth-error');
            if (type === 'success') {
                authModal.classList.add('auth-success');
            } else if (type === 'error') {
                authModal.classList.add('auth-error');
            }
        }
    }

    // Wyczyść wiadomość
    clearAuthMessage() {
        const messageDiv = document.getElementById('authMessage');
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
        messageDiv.className = 'auth-message';
        // Usuń klasy efektów z .auth-modal
        const modal = document.getElementById('authModal');
        const authModal = modal ? modal.querySelector('.auth-modal') : null;
        if (authModal) {
            authModal.classList.remove('auth-success', 'auth-error');
        }
    }

    // Pobierz aktualnego użytkownika
    getCurrentUser() {
        return this.currentUser;
    }

    // Sprawdź czy użytkownik jest zalogowany
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Przełącz widoczność hasła
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input.parentElement.querySelector('.password-toggle');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

// Inicjalizuj system autoryzacji
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
    // Eksportuj dla dostępu globalnego
    window.authSystem = authSystem;
});

// Ensure avatar is initialized when page loads
window.addEventListener('load', () => {
    if (authSystem) {
        authSystem.updateAvatarInitials();
    }
});
