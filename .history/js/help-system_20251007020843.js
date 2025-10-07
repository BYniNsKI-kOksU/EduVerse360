// Help Modals System
class HelpSystem {
    constructor() {
        this.currentModal = null;
        this.initializeEventListeners();
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

    initializeEventListeners() {
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('help-modal-overlay')) {
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }

    // Open help modal for specific app
    openModal(appType) {
        this.closeModal(); // Close any existing modal

        const overlay = document.createElement('div');
        overlay.className = 'help-modal-overlay';
        overlay.id = 'helpModalOverlay';

        const modal = document.createElement('div');
        modal.className = 'help-modal';

        // Create modal content based on app type
        modal.innerHTML = this.createModalContent(appType);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Setup event listeners
        this.setupModalEventListeners(overlay, appType);

        // Show modal with animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        this.currentModal = overlay;

        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            
            setTimeout(() => {
                if (this.currentModal && this.currentModal.parentNode) {
                    this.currentModal.parentNode.removeChild(this.currentModal);
                }
                this.currentModal = null;
                document.body.style.overflow = '';
            }, 300);
        }
    }

    createModalContent(appType) {
        let helpContent = this.getHelpContent(appType);
        // Fallback na wypadek błędnej implementacji
        if (!helpContent || typeof helpContent !== 'object' || !('title' in helpContent) || !('content' in helpContent)) {
            helpContent = this.getDefaultHelpContent();
        }
        return `
            <div class="help-modal-header">
                <h2 class="help-modal-title">
                    <i class="fas fa-question-circle"></i>
                    ${helpContent.title}
                </h2>
                <button class="help-modal-close" onclick="helpSystem.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="help-modal-content">
                ${helpContent.content}
            </div>
        `;
    }

    getHelpContent(appType) {
        switch (appType) {
            case 'matrix':
                return this.getMatrixHelpContent();
            case 'leapYear':
                return this.getLeapYearHelpContent();
            default:
                return this.getDefaultHelpContent();
        }
    }

    getMatrixHelpContent() {
        const isAdvanced = (typeof window.isAdvancedMode !== 'undefined' ? window.isAdvancedMode : (document.getElementById('matrixModeSwitch')?.checked));
        if (isAdvanced) {
            return {
                title: 'Kalkulator macierzy – Tryb rozszerzony',
                content: `
                <div class="help-section">
                    <h3><i class="fas fa-info-circle"></i> Opis</h3>
                    <p>Tryb rozszerzony kalkulatora macierzy umożliwia wykonywanie zaawansowanych operacji na macierzach, takich jak ślad, rząd, wartości własne i potęgowanie. Pozwala to na głębszą analizę struktur macierzowych i rozwiązywanie bardziej złożonych problemów matematycznych.</p>
                </div>
                <div class="help-section">
                    <h3><i class="fas fa-list-ol"></i> Dostępne funkcje</h3>
                    <ul class="help-list">
                        <li><b>Operacje podstawowe:</b> Dodawanie, odejmowanie, mnożenie macierzy</li>
                        <li><b>Wyznacznik</b> – obliczanie wyznacznika macierzy kwadratowej</li>
                        <li><b>Macierz odwrotna</b> – znajdowanie macierzy odwrotnej</li>
                        <li><b>Transpozycja</b> – zamiana wierszy i kolumn</li>
                        <li><b>Układ równań</b> – rozwiązywanie układów równań liniowych</li>
                        <li><b>Ślad macierzy</b> – suma elementów na głównej przekątnej</li>
                        <li><b>Rząd macierzy</b> – liczba liniowo niezależnych wierszy/kolumn</li>
                        <li><b>Wartości własne</b> – obliczanie wartości własnych (dla macierzy 2x2)</li>
                        <li><b>Potęga macierzy</b> – podnoszenie macierzy do potęgi całkowitej</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3><i class="fas fa-lightbulb"></i> Przykłady użycia</h3>
                    <ul class="help-list">
                        <li><b>Ślad macierzy:</b> Wybierz "Ślad macierzy", wprowadź macierz kwadratową i kliknij Oblicz.</li>
                        <li><b>Rząd macierzy:</b> Wybierz "Rząd macierzy", podaj macierz dowolnych wymiarów.</li>
                        <li><b>Wartości własne:</b> Wybierz "Wartości własne" dla macierzy 2x2.</li>
                        <li><b>Potęga macierzy:</b> Wybierz "Potęga macierzy", wprowadź macierz kwadratową, kliknij Oblicz i podaj wykładnik.</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3><i class="fas fa-keyboard"></i> Skróty klawiszowe</h3>
                    <div class="shortcuts-grid">
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + M</span><span class="shortcut-description">Przełącz między macierzami</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + A</span><span class="shortcut-description">Przejdź do macierzy A</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + B</span><span class="shortcut-description">Przejdź do macierzy B</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + Enter</span><span class="shortcut-description">Oblicz wynik</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">F1</span><span class="shortcut-description">Otwórz okno pomocy</span></div>
                    </div>
                </div>
                `
            };
        } else {
            return {
                title: 'Kalkulator macierzy – tryb podstawowy',
                content: `
                <div class="help-section">
                    <h3><i class="fas fa-info-circle"></i> Opis</h3>
                    <p>Tryb podstawowy kalkulatora macierzy pozwala na wykonywanie najczęściej spotykanych operacji na macierzach: dodawanie, odejmowanie, mnożenie, wyznacznik, macierz odwrotna, transpozycja oraz rozwiązywanie układów równań liniowych.</p>
                </div>
                <div class="help-section">
                    <h3><i class="fas fa-list-ol"></i> Dostępne funkcje</h3>
                    <ul class="help-list">
                        <li>Dodawanie, odejmowanie, mnożenie macierzy</li>
                        <li>Wyznacznik, macierz odwrotna, transpozycja</li>
                        <li>Układ równań liniowych</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3><i class="fas fa-lightbulb"></i> Przykłady użycia</h3>
                    <ul class="help-list">
                        <li>Dodaj dwie macierze 2x2: wybierz "Dodawanie", wprowadź dane i kliknij Oblicz.</li>
                        <li>Oblicz wyznacznik macierzy 3x3: wybierz "Wyznacznik", podaj dane i kliknij Oblicz.</li>
                        <li>Rozwiąż układ równań: wybierz "Układ równań", podaj macierz współczynników i wyrazów wolnych.</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3><i class="fas fa-keyboard"></i> Skróty klawiszowe</h3>
                    <div class="shortcuts-grid">
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + M</span><span class="shortcut-description">Przełącz między macierzami</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + A</span><span class="shortcut-description">Przejdź do macierzy A</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + B</span><span class="shortcut-description">Przejdź do macierzy B</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">Ctrl + Enter</span><span class="shortcut-description">Oblicz wynik</span></div>
                        <div class="shortcut-item"><span class="shortcut-key">F1</span><span class="shortcut-description">Otwórz okno pomocy</span></div>
                    </div>
                </div>
                `
            };
        }
    }

    getLeapYearHelpContent() {
        const help = this.t('leapYear.help');
        const shortcuts = this.t('leapYear.shortcuts');

        return {
            title: help.title,
            content: `
                <div class="help-section">
                    <h3><i class="fas fa-info-circle"></i> ${help.description}</h3>
                    <p>${help.description}</p>
                </div>

                <div class="help-section">
                    <h3><i class="fas fa-list-ol"></i> ${help.rules}</h3>
                    <ul class="help-list">
                        <li>${help.rule1}</li>
                        <li>${help.rule2}</li>
                        <li>${help.rule3}</li>
                    </ul>
                </div>

                <div class="help-section">
                    <h3><i class="fas fa-lightbulb"></i> ${help.examples}</h3>
                    <ul class="help-list">
                        <li>${help.example1}</li>
                        <li>${help.example2}</li>
                        <li>${help.example3}</li>
                    </ul>
                </div>

                <div class="help-section">
                    <h3><i class="fas fa-keyboard"></i> ${shortcuts.title}</h3>
                    <div class="shortcuts-grid">
                        <div class="shortcut-item">
                            <span class="shortcut-description">${shortcuts.enter}</span>
                            <kbd class="shortcut-key">Enter</kbd>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">${shortcuts.escape}</span>
                            <kbd class="shortcut-key">Esc</kbd>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">${shortcuts.tab}</span>
                            <kbd class="shortcut-key">Tab</kbd>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-description">${shortcuts.upDown}</span>
                            <kbd class="shortcut-key">↑/↓</kbd>
                        </div>
                    </div>
                </div>
            `
        };
    }

    getDefaultHelpContent() {
        return {
            title: 'Pomoc',
            content: `
                <div class="help-section">
                    <h3><i class="fas fa-info-circle"></i> Informacje</h3>
                    <p>Treść pomocy nie została zdefiniowana dla tej aplikacji.</p>
                </div>
            `
        };
    }

    setupModalEventListeners(overlay, appType) {
        // Close button
        const closeBtn = overlay.querySelector('.help-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    // Update all help button labels after language change
    updateHelpButtonLabels() {
        // Usuń stare przyciski pomocy
        this.removeHelpButtons();
        // Dodaj ponownie przyciski dla aktywnej aplikacji
        const activeApp = document.querySelector('.app-content.active');
        if (activeApp) {
            const appId = activeApp.id;
            if (appId.includes('matrix')) {
                this.addMatrixHelpButton();
            } else if (appId.includes('leapYear')) {
                this.addLeapYearHelpButton();
            }
        }
    }

    // Update modal translations when language changes
    updateModalTranslations() {
        if (this.currentModal) {
            const appType = this.currentModal.getAttribute('data-app-type');
            if (appType) {
                const modal = this.currentModal.querySelector('.help-modal');
                modal.innerHTML = this.createModalContent(appType);
                this.setupModalEventListeners(this.currentModal, appType);
            }
        }
        // Aktualizuj napisy na przyciskach pomocy
        this.updateHelpButtonLabels();
    }

    // Add help buttons to applications
    addHelpButtons() {
        // Add help button to matrix calculator
        this.addMatrixHelpButton();
        
        // Add help button to leap year calculator
        this.addLeapYearHelpButton();
    }

    addHelpButton(type, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Usuń istniejące przyciski pomocy
        container.querySelectorAll('.help-button, .mobile-help-button, .desktop-tablet-help').forEach(btn => btn.remove());

        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isDesktop = window.innerWidth > 1024;

        if (isMobile) {
            this.addMobileHelpButton(type, container);
        } else if (isTablet || isDesktop) {
            this.addDesktopTabletHelpButtons(type, container);
        }
    }

    addMobileHelpButton(type, container) {
        // Dla urządzeń mobilnych - przycisk w prawym górnym rogu jak w desktop
        // ale mniejszy i bardziej dyskretny
        const helpButtonsContainer = document.createElement('div');
        helpButtonsContainer.className = 'help-buttons-container mobile-help-container';
        
        // Stylowanie kontenera dla mobile
        helpButtonsContainer.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            display: flex;
            gap: 5px;
            z-index: 100;
        `;
        
        // Przycisk "?" dla mobile
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button mobile-help-button';
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpButton.setAttribute('aria-label', 'Pomoc');
        helpButton.onclick = () => this.openModal(type);
        
        // Stylowanie przycisku dla mobile
        helpButton.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            padding: 6px 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            min-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        helpButtonsContainer.appendChild(helpButton);
        
        // Ustaw relative positioning dla kontenera aplikacji
        container.style.position = 'relative';
        container.appendChild(helpButtonsContainer);
    }

    addDesktopTabletHelpButtons(type, container) {
        // Dla desktop/tablet - przyciski w prawym górnym rogu aplikacji
        const helpButtonsContainer = document.createElement('div');
        helpButtonsContainer.className = 'help-buttons-container desktop-tablet-help';
        helpButtonsContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 10px;
            z-index: 100;
        `;
        // Pobierz tłumaczenie napisu na przycisku
        let label = '';
        if (translations && translations[currentLang] && translations[currentLang].help && translations[currentLang].help.button_label) {
            label = translations[currentLang].help.button_label;
        } else {
            label = 'Pomoc';
        }
        // Przycisk "Pomoc" z tłumaczeniem
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button help-main-button';
        helpButton.innerHTML = `<i class="fas fa-question-circle"></i> ${label}`;
        helpButton.onclick = () => this.openModal(type);
        helpButton.style.cssText = `
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        `;
        helpButtonsContainer.appendChild(helpButton);
        container.style.position = 'relative';
        container.appendChild(helpButtonsContainer);
    }

    addMatrixHelpButton() {
        this.addHelpButton('matrix', 'matrixCalcApp');
    }

    addLeapYearHelpButton() {
        this.addHelpButton('leapYear', 'leapYearApp');
    }



    // Remove help buttons when switching apps
    removeHelpButtons() {
        const helpButtons = document.querySelectorAll(
            '.help-button, .mobile-help-button, .tablet-help-button, ' +
            '.desktop-tablet-help, .help-buttons-container, .mobile-help-floating'
        );
        helpButtons.forEach(btn => btn.remove());
    }
}

// Initialize help system
const helpSystem = new HelpSystem();

// Handle window resize to adjust help buttons
window.addEventListener('resize', () => {
    // Re-add help buttons with proper responsive behavior
    const activeApp = document.querySelector('.app-content.active');
    if (activeApp) {
        const appId = activeApp.id;
        if (appId.includes('matrix')) {
            helpSystem.removeHelpButtons();
            setTimeout(() => helpSystem.addMatrixHelpButton(), 100);
        } else if (appId.includes('leapYear')) {
            helpSystem.removeHelpButtons();
            setTimeout(() => helpSystem.addLeapYearHelpButton(), 100);
        }
    }
});

// Export for use in other files
window.helpSystem = helpSystem;
