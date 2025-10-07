// User Profile Modal Functions
class UserProfileModals {
    constructor() {
        this.currentModal = null;
        this.initializeEventListeners();
        this.loadSavedSettings();
    }

    // Helper function to get translated text
    t(key) {
        const keys = key.split('.');
        let translation = translations[currentLang] || translations['pl'];
        
        for (const k of keys) {
            translation = translation[k];
            if (!translation) {
                // Fallback to Polish if translation not found
                translation = translations['pl'];
                for (const fallbackKey of keys) {
                    translation = translation[fallbackKey];
                    if (!translation) {
                        return key; // Return key as fallback
                    }
                }
                break;
            }
        }
        
        return translation || key;
    }

    initializeEventListeners() {
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('profile-modal-overlay')) {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }

    // Update translations in the currently open modal
    updateModalTranslations() {
        if (!this.currentModal) return;
        
        // Find the type of the current modal (we need to store this)
        const modal = this.currentModal.querySelector('.profile-modal');
        if (!modal) return;
        
        // Re-generate the modal content with new translations
        const modalType = modal.getAttribute('data-modal-type');
        if (modalType) {
            // Store current form data if it's settings modal
            let formData = null;
            if (modalType === 'settings') {
                const form = modal.querySelector('#profileSettingsForm');
                if (form) {
                    formData = new FormData(form);
                }
            }
            
            // Generate new content
            let content = '';
            switch (modalType) {
                case 'stats':
                    content = this.getStatsModalContent();
                    break;
                case 'activity':
                    content = this.getActivityModalContent();
                    break;
                case 'achievements':
                    content = this.getAchievementsModalContent();
                    break;
                case 'settings':
                    content = this.getSettingsModalContent();
                    break;
                default:
                    content = this.getDefaultModalContent();
            }
            
            modal.innerHTML = content;
            
            // Restore form data if it was settings modal
            if (modalType === 'settings' && formData) {
                const newForm = modal.querySelector('#profileSettingsForm');
                if (newForm) {
                    for (let [key, value] of formData) {
                        const input = newForm.querySelector(`[name="${key}"]`);
                        if (input) {
                            if (input.type === 'checkbox') {
                                input.checked = value === 'on';
                            } else {
                                input.value = value;
                            }
                        }
                    }
                }
            }
            
            // Re-add event listeners
            this.setupModalEventListeners(modal, modalType);
        }
    }

    openModal(type) {
        // Remove existing modal if any
        this.closeModal();

        const overlay = document.createElement('div');
        overlay.className = 'profile-modal-overlay';
        
        const modal = this.createModalContent(type);
        overlay.appendChild(modal);
        
        document.body.appendChild(overlay);
        this.currentModal = overlay;

        // Trigger animation
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            setTimeout(() => {
                if (this.currentModal && this.currentModal.parentNode) {
                    this.currentModal.parentNode.removeChild(this.currentModal);
                }
                this.currentModal = null;
            }, 300);
        }
    }

    createModalContent(type) {
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        modal.setAttribute('data-modal-type', type);

        let content = '';
        switch (type) {
            case 'stats':
                content = this.getStatsModalContent();
                break;
            case 'activity':
                content = this.getActivityModalContent();
                break;
            case 'achievements':
                content = this.getAchievementsModalContent();
                break;
            case 'settings':
                content = this.getSettingsModalContent();
                break;
            default:
                content = this.getDefaultModalContent();
        }

        modal.innerHTML = content;
        
        // Setup event listeners for this modal
        this.setupModalEventListeners(modal, type);

        return modal;
    }

    setupModalEventListeners(modal, type) {
        // Add close button event listener
        const closeBtn = modal.querySelector('.profile-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Add form submission handler for settings modal
        if (type === 'settings') {
            const form = modal.querySelector('#profileSettingsForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmission(form);
                });
            }

            // Add dark mode toggle handler
            const darkModeCheckbox = modal.querySelector('#darkMode');
            if (darkModeCheckbox) {
                darkModeCheckbox.addEventListener('change', (e) => {
                    // Preview dark mode change
                    if (e.target.checked) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                });
            }
        }
    }

    getStatsModalContent() {
        return `
            <div class="profile-modal-header">
                <h2 class="profile-modal-title">
                    <i class="fas fa-chart-bar"></i>
                    ${this.t('userProfile.modals.stats.title')}
                </h2>
                <button class="profile-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="profile-modal-content">
                <div class="detailed-stats-grid">
                    <div class="detailed-stat-card">
                        <div class="detailed-stat-header">
                            <div class="detailed-stat-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="detailed-stat-title">Ukończone Kursy</div>
                        </div>
                        <div class="detailed-stat-value">12</div>
                        <div class="detailed-stat-description">
                            Łącznie ukończyłeś 12 kursów w tym miesiącu. To wzrost o 25% w porównaniu do poprzedniego miesiąca.
                        </div>
                    </div>
                    
                    <div class="detailed-stat-card">
                        <div class="detailed-stat-header">
                            <div class="detailed-stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="detailed-stat-title">Czas Nauki</div>
                        </div>
                        <div class="detailed-stat-value">87h</div>
                        <div class="detailed-stat-description">
                            Spędziłeś 87 godzin na nauce w tym miesiącu. Średnio 2.8 godziny dziennie.
                        </div>
                    </div>
                    
                    <div class="detailed-stat-card">
                        <div class="detailed-stat-header">
                            <div class="detailed-stat-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="detailed-stat-title">Osiągnięcia</div>
                        </div>
                        <div class="detailed-stat-value">8</div>
                        <div class="detailed-stat-description">
                            Zdobyłeś 8 nowych osiągnięć. Jesteś w top 15% najaktywniejszych użytkowników.
                        </div>
                    </div>
                    
                    <div class="detailed-stat-card">
                        <div class="detailed-stat-header">
                            <div class="detailed-stat-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="detailed-stat-title">Średnia Ocen</div>
                        </div>
                        <div class="detailed-stat-value">4.8</div>
                        <div class="detailed-stat-description">
                            Twoja średnia ocen z testów i quizów. Świetny wynik!
                        </div>
                    </div>
                </div>
                
                <div class="progress-chart">
                    <div class="chart-title">
                        <i class="fas fa-chart-line"></i> Postęp w Kategoriach
                    </div>
                    <div class="progress-bar-detailed">
                        <div class="progress-label">
                            <span>JavaScript</span>
                            <span>85%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: 85%"></div>
                        </div>
                    </div>
                    <div class="progress-bar-detailed">
                        <div class="progress-label">
                            <span>React</span>
                            <span>72%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: 72%"></div>
                        </div>
                    </div>
                    <div class="progress-bar-detailed">
                        <div class="progress-label">
                            <span>Node.js</span>
                            <span>60%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: 60%"></div>
                        </div>
                    </div>
                    <div class="progress-bar-detailed">
                        <div class="progress-label">
                            <span>Database</span>
                            <span>45%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: 45%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getActivityModalContent() {
        return `
            <div class="profile-modal-header">
                <h2 class="profile-modal-title">
                    <i class="fas fa-history"></i>
                    ${this.t('userProfile.modals.activity.title')}
                </h2>
                <button class="profile-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="profile-modal-content">
                <div class="activity-list">
                    <div class="activity-item-detailed">
                        <div class="activity-item-header">
                            <div class="activity-type-icon course">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="activity-item-title">Ukończono Kurs: React Zaawansowany</div>
                        </div>
                        <div class="activity-item-description">
                            Gratulacje! Ukończyłeś kurs React Zaawansowany z wynikiem 95%. Zdobyłeś certyfikat oraz 250 punktów doświadczenia.
                        </div>
                        <div class="activity-item-meta">
                            <span><i class="fas fa-calendar"></i> 2 godziny temu</span>
                            <span><i class="fas fa-star"></i> +250 XP</span>
                        </div>
                    </div>
                    
                    <div class="activity-item-detailed">
                        <div class="activity-item-header">
                            <div class="activity-type-icon achievement">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="activity-item-title">Nowe Osiągnięcie: Speed Learner</div>
                        </div>
                        <div class="activity-item-description">
                            Zdobyłeś osiągnięcie "Speed Learner" za ukończenie 3 kursów w ciągu jednego tygodnia. Niesamowite tempo!
                        </div>
                        <div class="activity-item-meta">
                            <span><i class="fas fa-calendar"></i> 5 godzin temu</span>
                            <span><i class="fas fa-award"></i> Osiągnięcie</span>
                        </div>
                    </div>
                    
                    <div class="activity-item-detailed">
                        <div class="activity-item-header">
                            <div class="activity-type-icon quiz">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <div class="activity-item-title">Quiz: JavaScript ES6+ - Wynik 88%</div>
                        </div>
                        <div class="activity-item-description">
                            Świetny wynik w quizie z JavaScript ES6+! Odpowiedziałeś poprawnie na 22 z 25 pytań.
                        </div>
                        <div class="activity-item-meta">
                            <span><i class="fas fa-calendar"></i> wczoraj</span>
                            <span><i class="fas fa-percent"></i> 88%</span>
                        </div>
                    </div>
                    
                    <div class="activity-item-detailed">
                        <div class="activity-item-header">
                            <div class="activity-type-icon course">
                                <i class="fas fa-play"></i>
                            </div>
                            <div class="activity-item-title">Rozpoczęto: Node.js Backend Development</div>
                        </div>
                        <div class="activity-item-description">
                            Rozpocząłeś nowy kurs Node.js Backend Development. Kurs składa się z 24 lekcji i 8 projektów praktycznych.
                        </div>
                        <div class="activity-item-meta">
                            <span><i class="fas fa-calendar"></i> 2 dni temu</span>
                            <span><i class="fas fa-clock"></i> 0% ukończono</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAchievementsModalContent() {
        return `
            <div class="profile-modal-header">
                <h2 class="profile-modal-title">
                    <i class="fas fa-trophy"></i>
                    ${this.t('userProfile.modals.achievements.title')}
                </h2>
                <button class="profile-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="profile-modal-content">
                <div class="achievements-detailed-grid">
                    <div class="achievement-detailed-card">
                        <div class="achievement-detailed-header">
                            <div class="achievement-detailed-icon">🏆</div>
                            <div class="achievement-detailed-info">
                                <h3>First Steps</h3>
                                <div class="achievement-category">Początkujący</div>
                            </div>
                        </div>
                        <div class="achievement-detailed-description">
                            Ukończ swój pierwszy kurs na platformie. Gratulacje za rozpoczęcie przygody z nauką!
                        </div>
                        <div class="unlock-date">Odblokowano: 15 stycznia 2024</div>
                    </div>
                    
                    <div class="achievement-detailed-card">
                        <div class="achievement-detailed-header">
                            <div class="achievement-detailed-icon">🚀</div>
                            <div class="achievement-detailed-info">
                                <h3>Speed Learner</h3>
                                <div class="achievement-category">Aktywność</div>
                            </div>
                        </div>
                        <div class="achievement-detailed-description">
                            Ukończ 3 kursy w ciągu jednego tygodnia. Imponujące tempo nauki!
                        </div>
                        <div class="unlock-date">Odblokowano: 5 godzin temu</div>
                    </div>
                    
                    <div class="achievement-detailed-card">
                        <div class="achievement-detailed-header">
                            <div class="achievement-detailed-icon">⭐</div>
                            <div class="achievement-detailed-info">
                                <h3>Perfect Score</h3>
                                <div class="achievement-category">Doskonałość</div>
                            </div>
                        </div>
                        <div class="achievement-detailed-description">
                            Uzyskaj 100% wynik w quizie. Perfekcyjne wykonanie zadania!
                        </div>
                        <div class="unlock-date">Odblokowano: 22 marca 2024</div>
                    </div>
                    
                    <div class="achievement-detailed-card">
                        <div class="achievement-detailed-header">
                            <div class="achievement-detailed-icon">📚</div>
                            <div class="achievement-detailed-info">
                                <h3>Bookworm</h3>
                                <div class="achievement-category">Czytanie</div>
                            </div>
                        </div>
                        <div class="achievement-detailed-description">
                            Przeczytaj 50 artykułów edukacyjnych. Wiedza to potęga!
                        </div>
                        <div class="achievement-progress">
                            <div class="achievement-progress-label">Postęp: 38/50 artykułów</div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: 76%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="achievement-detailed-card locked">
                        <div class="achievement-detailed-header">
                            <div class="achievement-detailed-icon">🔒</div>
                            <div class="achievement-detailed-info">
                                <h3>Master Coder</h3>
                                <div class="achievement-category">Programowanie</div>
                            </div>
                        </div>
                        <div class="achievement-detailed-description">
                            Ukończ wszystkie kursy programowania na poziomie zaawansowanym.
                        </div>
                        <div class="achievement-progress">
                            <div class="achievement-progress-label">Postęp: 7/12 kursów</div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: 58%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="achievement-detailed-card locked">
                        <div class="achievement-detailed-header">
                            <div class="achievement-detailed-icon">🔒</div>
                            <div class="achievement-detailed-info">
                                <h3>Marathon Runner</h3>
                                <div class="achievement-category">Wytrwałość</div>
                            </div>
                        </div>
                        <div class="achievement-detailed-description">
                            Ucz się przez 30 dni z rzędu. Konsekwencja prowadzi do sukcesu!
                        </div>
                        <div class="achievement-progress">
                            <div class="achievement-progress-label">Postęp: 18/30 dni</div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: 60%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsModalContent() {
        const currentData = this.getCurrentUserData();
        return `
            <div class="profile-modal-header">
                <h2 class="profile-modal-title">
                    <i class="fas fa-cog"></i>
                    ${this.t('userProfile.modals.editProfile.title')}
                </h2>
                <button class="profile-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="profile-modal-content">
                <h3 class="section-title">${this.t('userProfile.modals.editProfile.personalInfo')}</h3>
                
                <div class="avatar-section">
                    <label class="avatar-label">${this.t('userProfile.modals.editProfile.avatar')}</label>
                    <div class="modal-avatar-wrapper">
                        <div class="modal-avatar-image">
                            ${currentData.avatar ? 
                                `<img src="${currentData.avatar}" alt="Avatar" class="avatar-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                                `<div class="avatar-placeholder">${this.generateInitials(currentData.name)}</div>`
                            }
                        </div>
                        <button type="button" class="modal-change-avatar-btn" onclick="userProfileModals.handleAvatarUpload()" title="${this.t('userProfile.modals.editProfile.uploadAvatar')}">
                            <i class="fas fa-camera"></i>
                        </button>
                        ${currentData.avatar ? 
                            `<button type="button" class="modal-remove-avatar-btn" onclick="userProfileModals.removeAvatar()" title="${this.t('userProfile.modals.editProfile.removeAvatar')}">
                                <i class="fas fa-trash"></i>
                            </button>` : ''
                        }
                    </div>
                </div>
                
                <form class="settings-form" id="profileSettingsForm">
                    <div class="form-group">
                        <label for="userName">${this.t('userProfile.modals.editProfile.name')}</label>
                        <input type="text" id="userName" name="userName" value="${currentData.name}" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="userEmail">${this.t('userProfile.modals.editProfile.email')}</label>
                        <input type="email" id="userEmail" name="userEmail" value="${currentData.email}" class="form-input" required>
                    </div>
                    
                    <h3 class="section-title">${this.t('userProfile.modals.editProfile.preferences')}</h3>
                    
                    <div class="form-group">
                        <label for="userRole">${this.t('userProfile.modals.editProfile.role')}</label>
                        <select id="userRole" name="userRole" class="form-input">
                            <option value="student" ${currentData.role === 'student' ? 'selected' : ''}>${this.t('userProfile.modals.editProfile.roles.student')}</option>
                            <option value="teacher" ${currentData.role === 'teacher' ? 'selected' : ''}>${this.t('userProfile.modals.editProfile.roles.teacher')}</option>
                            <option value="researcher" ${currentData.role === 'researcher' ? 'selected' : ''}>${this.t('userProfile.modals.editProfile.roles.researcher')}</option>
                            <option value="developer" ${currentData.role === 'developer' ? 'selected' : ''}>${this.t('userProfile.modals.editProfile.roles.developer')}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="darkMode" name="darkMode" ${currentData.darkMode ? 'checked' : ''}> 
                            ${this.t('userProfile.modals.editProfile.darkMode')}
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">${this.t('userProfile.modals.editProfile.save')}</button>
                        <button type="button" class="btn-cancel" onclick="userProfileModals.closeModal()">${this.t('userProfile.modals.editProfile.cancel')}</button>
                    </div>
                </form>
            </div>
        `;
    }

    getDefaultModalContent() {
        return `
            <div class="profile-modal-header">
                <h2 class="profile-modal-title">
                    <i class="fas fa-info-circle"></i>
                    Informacje
                </h2>
                <button class="profile-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="profile-modal-content">
                <p>Brak dostępnych informacji.</p>
            </div>
        `;
    }

    // Get current user data from localStorage or defaults
    getCurrentUserData() {
        // Najpierw sprawdź dane z systemu autoryzacji
        let authData = {};
        if (typeof authSystem !== 'undefined' && authSystem.currentUser) {
            const user = authSystem.currentUser;
            authData = {
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email || '',
                role: user.role || 'Student'
            };
        }

        const defaultData = {
            name: authData.name || 'Użytkownik',
            email: authData.email || 'uzytkownik@example.com',
            role: authData.role || 'Student',
            emailNotifications: true,
            darkMode: document.body.classList.contains('dark-mode'),
            avatar: null
        };

        const savedData = localStorage.getItem('userProfileData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Scalaj z danymi z systemu autoryzacji (priorytet dla auth)
                return { ...defaultData, ...parsed, ...authData };
            } catch (e) {
                console.error('Error parsing user data:', e);
                return { ...defaultData, ...authData };
            }
        }
        return defaultData;
    }

    // Save user data to localStorage
    saveUserData(data) {
        try {
            localStorage.setItem('userProfileData', JSON.stringify(data));
            this.updateProfileDisplay(data);
            return true;
        } catch (e) {
            console.error('Error saving user data:', e);
            return false;
        }
    }

    // Update profile display with new data
    updateProfileDisplay(data) {
        // Update profile name
        const profileNameElements = document.querySelectorAll('.profile-name');
        profileNameElements.forEach(el => el.textContent = data.name);

        // Update profile email
        const profileEmailElements = document.querySelectorAll('.profile-email');
        profileEmailElements.forEach(el => el.textContent = data.email);

        // Update profile role
        const profileRoleElements = document.querySelectorAll('.profile-role');
        profileRoleElements.forEach(el => el.textContent = data.role);

        // Update avatar initials
        this.updateAvatarInitials(data.name);

        // Update avatar image if exists
        if (data.avatar) {
            this.updateAvatarImage(data.avatar);
        }

        // Update dark mode
        if (data.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Save dark mode preference persistently
        localStorage.setItem('darkMode', data.darkMode ? 'enabled' : 'disabled');
    }

    // Update avatar initials based on name
    updateAvatarInitials(name) {
        const initials = this.generateInitials(name);
        const avatarPlaceholders = document.querySelectorAll('.avatar-placeholder');
        avatarPlaceholders.forEach(el => el.textContent = initials);
    }

    // Generate initials from name
    generateInitials(name) {
        if (!name || name.trim() === '') return 'U';
        
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    // Update avatar image
    updateAvatarImage(avatarUrl) {
        const avatarImages = document.querySelectorAll('.avatar-image');
        avatarImages.forEach(avatarContainer => {
            // Remove existing placeholder
            const placeholder = avatarContainer.querySelector('.avatar-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Remove existing image
            const existingImg = avatarContainer.querySelector('.avatar-img');
            if (existingImg) {
                existingImg.remove();
            }

            // Add new image
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = 'Avatar';
            img.className = 'avatar-img';
            img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
            
            img.onerror = () => {
                // If image fails to load, show placeholder again
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
                img.remove();
            };

            avatarContainer.appendChild(img);
        });
    }

    // Handle avatar upload
    handleAvatarUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification(this.t('userProfile.notifications.fileTooLarge'), 'error');
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    this.showNotification(this.t('userProfile.notifications.invalidFile'), 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const avatarUrl = e.target.result;
                    
                    // Update current user data
                    const currentData = this.getCurrentUserData();
                    currentData.avatar = avatarUrl;
                    
                    // Save to localStorage
                    this.saveUserData(currentData);
                    
                    // Update main profile display
                    this.updateAvatarImage(avatarUrl);
                    
                    // Update modal display
                    const modalAvatarContainer = document.querySelector('.modal-avatar-image');
                    if (modalAvatarContainer) {
                        // Hide placeholder
                        const placeholder = modalAvatarContainer.querySelector('.avatar-placeholder');
                        if (placeholder) {
                            placeholder.style.display = 'none';
                        }

                        // Remove existing image
                        const existingImg = modalAvatarContainer.querySelector('.avatar-img');
                        if (existingImg) {
                            existingImg.remove();
                        }

                        // Add new image
                        const img = document.createElement('img');
                        img.src = avatarUrl;
                        img.alt = 'Avatar';
                        img.className = 'avatar-img';
                        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
                        modalAvatarContainer.appendChild(img);

                        // Add remove button if not exists
                        if (!document.querySelector('.modal-remove-avatar-btn')) {
                            const removeBtn = document.createElement('button');
                            removeBtn.type = 'button';
                            removeBtn.className = 'modal-remove-avatar-btn';
                            removeBtn.onclick = () => this.removeAvatar();
                            removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                            document.querySelector('.modal-avatar-wrapper').appendChild(removeBtn);
                        }
                    }
                    
                    this.showNotification(this.t('userProfile.notifications.avatarUpdated'), 'success');
                };
                reader.readAsDataURL(file);
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    // Remove avatar
    removeAvatar() {
        const currentData = this.getCurrentUserData();
        currentData.avatar = null;
        
        // Save to localStorage
        this.saveUserData(currentData);
        
        // Update display - show initials again
        const avatarImages = document.querySelectorAll('.avatar-image');
        avatarImages.forEach(avatarContainer => {
            const existingImg = avatarContainer.querySelector('.avatar-img');
            if (existingImg) {
                existingImg.remove();
            }
            
            const placeholder = avatarContainer.querySelector('.avatar-placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
                placeholder.textContent = this.generateInitials(currentData.name);
            }
        });
        
        // Update modal display
        const modalAvatarImg = document.querySelector('.modal-avatar-image .avatar-img');
        if (modalAvatarImg) {
            modalAvatarImg.remove();
        }
        
        const modalAvatarContainer = document.querySelector('.modal-avatar-image');
        if (modalAvatarContainer && !modalAvatarContainer.querySelector('.avatar-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'avatar-placeholder';
            placeholder.textContent = this.generateInitials(currentData.name);
            modalAvatarContainer.appendChild(placeholder);
        }
        
        // Remove the remove button
        const removeBtn = document.querySelector('.modal-remove-avatar-btn');
        if (removeBtn) {
            removeBtn.remove();
        }
        
        this.showNotification(this.t('userProfile.notifications.avatarRemoved'), 'success');
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.profile-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `profile-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Handle form submission
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const currentData = this.getCurrentUserData();
        const userData = {
            name: formData.get('userName'),
            email: formData.get('userEmail'),
            role: formData.get('userRole'),
            emailNotifications: formData.get('emailNotifications') === 'on',
            darkMode: formData.get('darkMode') === 'on',
            avatar: currentData.avatar // Preserve existing avatar
        };

        // Check if any data actually changed
        const hasChanges = Object.keys(userData).some(key => {
            if (key === 'avatar') return false; // Skip avatar comparison for now
            return userData[key] !== currentData[key];
        });

        if (!hasChanges) {
            this.closeModal();
            return true;
        }

        // Validate data
        if (!userData.name.trim()) {
            this.showNotification(this.t('userProfile.notifications.nameRequired'), 'error'); // Backup text since this key might not exist
            return false;
        }

        if (!userData.email.trim() || !this.isValidEmail(userData.email)) {
            this.showNotification(this.t('userProfile.notifications.emailInvalid'), 'error'); // Backup text since this key might not exist
            return false;
        }

        // Save data
        if (this.saveUserData(userData)) {
            this.closeModal();
            this.showNotification(this.t('userProfile.notifications.profileUpdated'), 'success');
            return true;
        } else {
            this.showNotification(this.t('userProfile.notifications.error'), 'error');
            return false;
        }
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Load saved settings on page load
    loadSavedSettings() {
        const userData = this.getCurrentUserData();
        this.updateProfileDisplay(userData);
    }
}

// Initialize modal system
const userProfileModals = new UserProfileModals();

// Export for use in other files
window.userProfileModals = userProfileModals;
