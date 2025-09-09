// Form validation and error handling utilities
class FormValidator {
    constructor() {
        this.errorMessages = {
            required: 'To pole jest wymagane',
            number: 'Podaj prawidłową liczbę',
            min: 'Wartość jest zbyt mała',
            max: 'Wartość jest zbyt duża',
            email: 'Podaj prawidłowy adres email',
            year: 'Podaj prawidłowy rok (np. 2024)'
        };
    }

    // Show error message for a specific field
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorId = fieldId + 'Error';
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            // Create error element if it doesn't exist
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorId);
        
        // Focus the field with error
        field.focus();
    }

    // Clear error message for a specific field
    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorId = fieldId + 'Error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
        
        if (field) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        }
    }

    // Validate a single field
    validateField(fieldId, rules = {}) {
        const field = document.getElementById(fieldId);
        if (!field) return false;

        const value = field.value.trim();
        
        // Clear previous errors
        this.clearError(fieldId);

        // Required validation
        if (rules.required && !value) {
            this.showError(fieldId, this.errorMessages.required);
            return false;
        }

        // Number validation
        if (rules.type === 'number' && value && isNaN(value)) {
            this.showError(fieldId, this.errorMessages.number);
            return false;
        }

        // Min/Max validation for numbers
        if (rules.type === 'number' && value) {
            const numValue = parseFloat(value);
            if (rules.min !== undefined && numValue < rules.min) {
                this.showError(fieldId, `${this.errorMessages.min} (minimum: ${rules.min})`);
                return false;
            }
            if (rules.max !== undefined && numValue > rules.max) {
                this.showError(fieldId, `${this.errorMessages.max} (maksimum: ${rules.max})`);
                return false;
            }
        }

        // Year validation
        if (rules.type === 'year' && value) {
            const year = parseInt(value);
            if (year < 1 || year > 9999) {
                this.showError(fieldId, this.errorMessages.year);
                return false;
            }
        }

        // Success state
        field.classList.add('success');
        return true;
    }

    // Validate multiple fields
    validateForm(fieldRules) {
        let isValid = true;
        for (const [fieldId, rules] of Object.entries(fieldRules)) {
            if (!this.validateField(fieldId, rules)) {
                isValid = false;
            }
        }
        return isValid;
    }
}

// Button loading state manager
class ButtonManager {
    constructor() {
        this.loadingButtons = new Set();
    }

    setLoading(buttonId, isLoading = true) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const spinner = button.querySelector('.btn-spinner');
        const text = button.querySelector('.btn-text');

        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            this.loadingButtons.add(buttonId);
            
            if (spinner) spinner.style.display = 'inline-block';
            if (text) text.style.opacity = '0.5';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            this.loadingButtons.delete(buttonId);
            
            if (spinner) spinner.style.display = 'none';
            if (text) text.style.opacity = '1';
        }
    }

    isLoading(buttonId) {
        return this.loadingButtons.has(buttonId);
    }

    clearAllLoading() {
        for (const buttonId of this.loadingButtons) {
            this.setLoading(buttonId, false);
        }
    }
}

// Keyboard shortcuts manager
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.enabled = true;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (!this.enabled) return;
            
            const key = this.getKeyString(e);
            const handler = this.shortcuts.get(key);
            
            if (handler) {
                e.preventDefault();
                handler(e);
            }
        });
    }

    getKeyString(event) {
        const parts = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.altKey) parts.push('Alt');
        if (event.shiftKey) parts.push('Shift');
        if (event.metaKey) parts.push('Meta');
        parts.push(event.key);
        return parts.join('+');
    }

    register(keyString, handler, description = '') {
        this.shortcuts.set(keyString, handler);
        console.log(`Registered shortcut: ${keyString} - ${description}`);
    }

    unregister(keyString) {
        this.shortcuts.delete(keyString);
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    getRegisteredShortcuts() {
        return Array.from(this.shortcuts.keys());
    }
}

// Global instances
const formValidator = new FormValidator();
const buttonManager = new ButtonManager();
const keyboardShortcuts = new KeyboardShortcuts();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.formValidator = formValidator;
    window.buttonManager = buttonManager;
    window.keyboardShortcuts = keyboardShortcuts;
}

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add real-time validation to inputs
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const rules = {
                required: this.hasAttribute('required'),
                type: this.type === 'number' ? 'number' : this.type,
                min: this.min ? parseFloat(this.min) : undefined,
                max: this.max ? parseFloat(this.max) : undefined
            };
            
            if (this.id === 'yearInput') {
                rules.type = 'year';
            }
            
            formValidator.validateField(this.id, rules);
        });

        // Clear errors on input
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                formValidator.clearError(this.id);
            }
        });
    });

    // Register common keyboard shortcuts
    keyboardShortcuts.register('Escape', () => {
        // Close any open modals or menus
        const openMenus = document.querySelectorAll('.operation-menu.open, .lang-menu.open');
        openMenus.forEach(menu => menu.classList.remove('open'));
    }, 'Zamknij otwarte menu');

    // Matrix calculator shortcuts (only when matrix calculator is active)
    keyboardShortcuts.register('Ctrl+m', () => {
        const matrixApp = document.getElementById('matrixCalcApp');
        if (matrixApp && matrixApp.classList.contains('active')) {
            // Switch between matrices logic would go here
            console.log('Switch between matrices');
        }
    }, 'Przełącz między macierzami');

    keyboardShortcuts.register('Ctrl+Enter', () => {
        const matrixApp = document.getElementById('matrixCalcApp');
        if (matrixApp && matrixApp.classList.contains('active')) {
            const computeBtn = document.getElementById('computeBtn');
            if (computeBtn && !computeBtn.disabled) {
                computeBtn.click();
            }
        }
    }, 'Oblicz wynik');

    console.log('Form validation and keyboard shortcuts initialized');
});
