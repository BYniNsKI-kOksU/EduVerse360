// Unit Converter - Length, Mass, Time, Temperature
class UnitConverter {
    constructor() {
        this.currentCategory = 'length';
        this.conversions = this.initializeConversions();
        this.initializeEventListeners();
    }

    initializeConversions() {
        return {
            length: {
                name: 'Długość',
                units: {
                    mm: { name: 'Milimetr', factor: 0.001 },
                    cm: { name: 'Centymetr', factor: 0.01 },
                    m: { name: 'Metr', factor: 1 },
                    km: { name: 'Kilometr', factor: 1000 },
                    inch: { name: 'Cal', factor: 0.0254 },
                    ft: { name: 'Stopa', factor: 0.3048 },
                    yard: { name: 'Jard', factor: 0.9144 },
                    mile: { name: 'Mila', factor: 1609.34 }
                }
            },
            mass: {
                name: 'Masa',
                units: {
                    mg: { name: 'Miligram', factor: 0.000001 },
                    g: { name: 'Gram', factor: 0.001 },
                    kg: { name: 'Kilogram', factor: 1 },
                    ton: { name: 'Tona', factor: 1000 },
                    oz: { name: 'Uncja', factor: 0.0283495 },
                    lb: { name: 'Funt', factor: 0.453592 },
                    stone: { name: 'Kamień', factor: 6.35029 }
                }
            },
            time: {
                name: 'Czas',
                units: {
                    ms: { name: 'Milisekunda', factor: 0.001 },
                    s: { name: 'Sekunda', factor: 1 },
                    min: { name: 'Minuta', factor: 60 },
                    h: { name: 'Godzina', factor: 3600 },
                    day: { name: 'Dzień', factor: 86400 },
                    week: { name: 'Tydzień', factor: 604800 },
                    month: { name: 'Miesiąc', factor: 2629746 },
                    year: { name: 'Rok', factor: 31556952 }
                }
            },
            temperature: {
                name: 'Temperatura',
                units: {
                    celsius: { name: 'Celsjusz (°C)', factor: 1 },
                    fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
                    kelvin: { name: 'Kelvin (K)', factor: 1 }
                }
            },
            area: {
                name: 'Powierzchnia',
                units: {
                    mm2: { name: 'Milimetr kwadratowy', factor: 0.000001 },
                    cm2: { name: 'Centymetr kwadratowy', factor: 0.0001 },
                    m2: { name: 'Metr kwadratowy', factor: 1 },
                    km2: { name: 'Kilometr kwadratowy', factor: 1000000 },
                    ha: { name: 'Hektar', factor: 10000 },
                    acre: { name: 'Akr', factor: 4046.86 },
                    ft2: { name: 'Stopa kwadratowa', factor: 0.092903 }
                }
            },
            volume: {
                name: 'Objętość',
                units: {
                    ml: { name: 'Mililitr', factor: 0.000001 },
                    l: { name: 'Litr', factor: 0.001 },
                    m3: { name: 'Metr sześcienny', factor: 1 },
                    gal_us: { name: 'Galon amerykański', factor: 0.00378541 },
                    gal_uk: { name: 'Galon brytyjski', factor: 0.00454609 },
                    fl_oz: { name: 'Uncja płynu', factor: 0.0000295735 },
                    cup: { name: 'Szklanka', factor: 0.000236588 }
                }
            }
        };
    }

    initializeEventListeners() {
        // Category menu button and dropdown
        const categoryBtn = document.getElementById('categoryBtn');
        const categoryMenu = document.getElementById('categoryMenu');
        
        if (categoryBtn && categoryMenu) {
            categoryBtn.addEventListener('click', () => {
                categoryMenu.classList.toggle('open');
            });
            
            // Zamknij menu gdy klikniesz poza nim
            document.addEventListener('click', (e) => {
                if (!categoryBtn.contains(e.target) && !categoryMenu.contains(e.target)) {
                    categoryMenu.classList.remove('open');
                }
            });
            
            // Obsługa wyboru kategorii
            categoryMenu.querySelectorAll('.operation-menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.currentCategory = item.dataset.category;
                    this.currentCategoryName = item.textContent;
                    categoryBtn.textContent = item.textContent;
                    categoryMenu.classList.remove('open');
                    this.updateUnitSelectors();
                });
            });
        }
        
        // Convert button
        const convertBtn = document.getElementById('convertUnitBtn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.performConversion());
        }

        // Swap button
        const swapBtn = document.getElementById('swapUnitsBtn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapUnits());
        }

        // Clear button
        const clearBtn = document.getElementById('clearUnitsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearResults());
        }

        // Input validation
        const valueInput = document.getElementById('inputValue');
        if (valueInput) {
            valueInput.addEventListener('input', () => this.validateInput());
            valueInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performConversion();
                }
            });
        }

        // Initialize UI
        this.updateUnitSelectors();
    }

    updateUnitSelectors() {
        const fromUnitSelect = document.getElementById('fromUnit');
        const toUnitSelect = document.getElementById('toUnit');
        
        if (!fromUnitSelect || !toUnitSelect) return;

        const category = this.conversions[this.currentCategory];
        if (!category) return;

        // Clear existing options
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        // Add new options
        Object.entries(category.units).forEach(([key, unit]) => {
            const option1 = document.createElement('option');
            option1.value = key;
            option1.textContent = unit.name;
            fromUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = key;
            option2.textContent = unit.name;
            toUnitSelect.appendChild(option2);
        });

        // Set default selections
        const units = Object.keys(category.units);
        if (units.length >= 2) {
            fromUnitSelect.value = units[0];
            toUnitSelect.value = units[1];
        }
    }

    performConversion() {
        this.clearError();

        try {
            const inputValue = this.getInputValue();
            const fromUnit = document.getElementById('fromUnit').value;
            const toUnit = document.getElementById('toUnit').value;

            if (fromUnit === toUnit) {
                this.displayResult(inputValue, fromUnit, toUnit, 'Same units selected');
                return;
            }

            let result;
            if (this.currentCategory === 'temperature') {
                result = this.convertTemperature(inputValue, fromUnit, toUnit);
            } else {
                result = this.convertStandardUnits(inputValue, fromUnit, toUnit);
            }

            this.displayResult(inputValue, fromUnit, toUnit, result);
            this.addToHistory(inputValue, fromUnit, result, toUnit);

        } catch (error) {
            this.showError(error.message);
        }
    }

    convertStandardUnits(value, fromUnit, toUnit) {
        const category = this.conversions[this.currentCategory];
        const fromFactor = category.units[fromUnit].factor;
        const toFactor = category.units[toUnit].factor;

        // Convert to base unit, then to target unit
        const baseValue = value * fromFactor;
        const result = baseValue / toFactor;

        return result;
    }

    convertTemperature(value, fromUnit, toUnit) {
        let celsius;

        // Convert to Celsius first
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5 / 9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            default:
                throw new Error('Nieznana jednostka temperatury');
        }

        // Convert from Celsius to target
        switch (toUnit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9 / 5 + 32;
            case 'kelvin':
                return celsius + 273.15;
            default:
                throw new Error('Nieznana docelowa jednostka temperatury');
        }
    }

    getInputValue() {
        const input = document.getElementById('inputValue');
        if (!input || input.value === '') {
            throw new Error('Wprowadź wartość do konwersji');
        }

        const value = parseFloat(input.value);
        if (isNaN(value)) {
            throw new Error('Wprowadź prawidłową wartość liczbową');
        }

        return value;
    }

    displayResult(inputValue, fromUnit, toUnit, result) {
        const resultDiv = document.getElementById('conversionResult');
        if (!resultDiv) return;

        const category = this.conversions[this.currentCategory];
        const fromUnitName = category.units[fromUnit].name;
        const toUnitName = category.units[toUnit].name;

        let resultText;
        if (typeof result === 'string') {
            resultText = result;
        } else {
            resultText = this.formatResult(result);
        }

        resultDiv.innerHTML = `
            <div class="conversion-result">
                <div class="result-header">
                    <i class="fas fa-exchange-alt"></i>
                    <span>Wynik konwersji</span>
                </div>
                <div class="result-content">
                    <div class="conversion-display">
                        <div class="from-value">${inputValue} ${fromUnitName}</div>
                        <div class="conversion-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                        <div class="to-value">${resultText} ${toUnitName}</div>
                    </div>
                    <div class="conversion-formula">
                        ${this.getConversionFormula(inputValue, fromUnit, toUnit)}
                    </div>
                </div>
            </div>
        `;
    }

    formatResult(value) {
        if (Math.abs(value) >= 1000000 || (Math.abs(value) < 0.001 && value !== 0)) {
            return value.toExponential(6);
        }
        return Math.round(value * 1000000) / 1000000;
    }

    getConversionFormula(inputValue, fromUnit, toUnit) {
        if (this.currentCategory === 'temperature') {
            return this.getTemperatureFormula(fromUnit, toUnit);
        }

        const category = this.conversions[this.currentCategory];
        const fromFactor = category.units[fromUnit].factor;
        const toFactor = category.units[toUnit].factor;
        const conversionFactor = fromFactor / toFactor;

        return `1 ${category.units[fromUnit].name} = ${conversionFactor} ${category.units[toUnit].name}`;
    }

    getTemperatureFormula(fromUnit, toUnit) {
        const formulas = {
            'celsius-fahrenheit': '°F = (°C × 9/5) + 32',
            'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
            'celsius-kelvin': 'K = °C + 273.15',
            'kelvin-celsius': '°C = K - 273.15',
            'fahrenheit-kelvin': 'K = (°F - 32) × 5/9 + 273.15',
            'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32'
        };

        const key = `${fromUnit}-${toUnit}`;
        return formulas[key] || 'Formuła konwersji';
    }

    swapUnits() {
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');

        if (fromUnit && toUnit) {
            const temp = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = temp;

            // If there's a result, recalculate
            const resultDiv = document.getElementById('conversionResult');
            if (resultDiv && resultDiv.innerHTML) {
                this.performConversion();
            }
        }
    }

    validateInput() {
        const input = document.getElementById('inputValue');
        const value = input.value;

        if (value && isNaN(parseFloat(value))) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    }

    addToHistory(inputValue, fromUnit, result, toUnit) {
        const historyDiv = document.getElementById('conversionHistory');
        if (!historyDiv) return;

        const category = this.conversions[this.currentCategory];
        const fromUnitName = category.units[fromUnit].name;
        const toUnitName = category.units[toUnit].name;

        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-conversion">
                ${inputValue} ${fromUnitName} → ${this.formatResult(result)} ${toUnitName}
            </div>
            <div class="history-category">${category.name}</div>
        `;

        // Add to top of history
        historyDiv.insertBefore(historyItem, historyDiv.firstChild);

        // Limit history to 10 items
        while (historyDiv.children.length > 10) {
            historyDiv.removeChild(historyDiv.lastChild);
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('conversionError');
        if (errorDiv) {
            errorDiv.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                </div>
            `;
            errorDiv.style.display = 'block';
        }
    }

    clearError() {
        const errorDiv = document.getElementById('conversionError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    clearResults() {
        const resultDiv = document.getElementById('unitResult');
        const errorDiv = document.getElementById('unitError');
        const inputValue = document.getElementById('inputValue');
        const outputValue = document.getElementById('outputValue');

        if (resultDiv) {
            resultDiv.innerHTML = '<div class="default-result-text">Wprowadź wartość i kliknij "Konwertuj"</div>';
        }
        if (errorDiv) errorDiv.style.display = 'none';
        if (inputValue) inputValue.value = '1';
        if (outputValue) outputValue.value = '';
    }

    clearHistory() {
        const historyDiv = document.getElementById('conversionHistory');
        if (historyDiv) {
            historyDiv.innerHTML = '';
        }
    }
}

// Unit converter will be initialized when needed by the main app
