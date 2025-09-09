// Function Calculator - Advanced Mathematical Functions
class FunctionCalculator {
    constructor() {
        this.currentFunction = 'sin';
        this.plotPoints = 200;
        this.xMin = -10;
        this.xMax = 10;
        this.initializeEventListeners();
        this.loadTranslations();
    }

    initializeEventListeners() {
        // Function selection
        const functionSelect = document.getElementById('functionSelect');
        if (functionSelect) {
            functionSelect.addEventListener('change', (e) => {
                this.currentFunction = e.target.value;
                this.updateFunctionInfo();
            });
        }

        // Calculate button
        const calculateBtn = document.getElementById('calculateFunctionBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateFunction());
        }

        // Plot button
        const plotBtn = document.getElementById('plotPointBtn');
        if (plotBtn) {
            plotBtn.addEventListener('click', () => this.plotPoint());
        }

        // Clear button
        const clearBtn = document.getElementById('clearFunctionBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearResults());
        }

        // Input validation
        const xInput = document.getElementById('xValue');
        if (xInput) {
            xInput.addEventListener('input', () => this.validateInput());
        }
    }

    loadTranslations() {
        // Update UI based on current language
        this.updateUI();
    }

    updateUI() {
        // Update function names and descriptions
        const functions = {
            sin: { name: 'Sinus', desc: 'Funkcja trygonometryczna sinus' },
            cos: { name: 'Cosinus', desc: 'Funkcja trygonometryczna cosinus' },
            tan: { name: 'Tangens', desc: 'Funkcja trygonometryczna tangens' },
            log: { name: 'Logarytm naturalny', desc: 'Logarytm o podstawie e' },
            log10: { name: 'Logarytm dziesiętny', desc: 'Logarytm o podstawie 10' },
            sqrt: { name: 'Pierwiastek kwadratowy', desc: 'Pierwiastek stopnia drugiego' },
            exp: { name: 'Funkcja wykładnicza', desc: 'e do potęgi x' },
            abs: { name: 'Wartość bezwzględna', desc: 'Moduł liczby' },
            asin: { name: 'Arcus sinus', desc: 'Odwrotność funkcji sinus' },
            acos: { name: 'Arcus cosinus', desc: 'Odwrotność funkcji cosinus' },
            atan: { name: 'Arcus tangens', desc: 'Odwrotność funkcji tangens' }
        };

        // Update function selector
        const functionSelect = document.getElementById('functionSelect');
        if (functionSelect && currentLang) {
            // Clear and rebuild options
            functionSelect.innerHTML = '';
            Object.entries(functions).forEach(([key, func]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = func.name;
                functionSelect.appendChild(option);
            });
        }
    }

    updateFunctionInfo() {
        const infoDiv = document.getElementById('functionInfo');
        if (!infoDiv) return;

        const functionData = {
            sin: { 
                formula: 'sin(x)', 
                domain: 'ℝ (wszystkie liczby rzeczywiste)', 
                range: '[-1, 1]',
                period: '2π'
            },
            cos: { 
                formula: 'cos(x)', 
                domain: 'ℝ (wszystkie liczby rzeczywiste)', 
                range: '[-1, 1]',
                period: '2π'
            },
            tan: { 
                formula: 'tan(x)', 
                domain: 'ℝ \\ {π/2 + nπ, n ∈ ℤ}', 
                range: 'ℝ',
                period: 'π'
            },
            log: { 
                formula: 'ln(x)', 
                domain: '(0, +∞)', 
                range: 'ℝ',
                period: 'Brak'
            },
            log10: { 
                formula: 'log₁₀(x)', 
                domain: '(0, +∞)', 
                range: 'ℝ',
                period: 'Brak'
            },
            sqrt: { 
                formula: '√x', 
                domain: '[0, +∞)', 
                range: '[0, +∞)',
                period: 'Brak'
            },
            exp: { 
                formula: 'eˣ', 
                domain: 'ℝ', 
                range: '(0, +∞)',
                period: 'Brak'
            },
            abs: { 
                formula: '|x|', 
                domain: 'ℝ', 
                range: '[0, +∞)',
                period: 'Brak'
            }
        };

        const data = functionData[this.currentFunction];
        if (data) {
            infoDiv.innerHTML = `
                <div class="function-info-card">
                    <h4>Informacje o funkcji</h4>
                    <div class="info-item">
                        <strong>Wzór:</strong> ${data.formula}
                    </div>
                    <div class="info-item">
                        <strong>Dziedzina:</strong> ${data.domain}
                    </div>
                    <div class="info-item">
                        <strong>Zbiór wartości:</strong> ${data.range}
                    </div>
                    <div class="info-item">
                        <strong>Okres:</strong> ${data.period}
                    </div>
                </div>
            `;
        }
    }

    calculateFunction() {
        const xInput = document.getElementById('xValue');
        const resultDiv = document.getElementById('functionResult');
        
        if (!xInput || !resultDiv) return;

        const x = parseFloat(xInput.value);
        if (isNaN(x)) {
            this.showError('Wprowadź poprawną wartość liczbową');
            return;
        }

        let result;
        let isValid = true;
        let errorMsg = '';

        try {
            switch (this.currentFunction) {
                case 'sin':
                    result = Math.sin(x);
                    break;
                case 'cos':
                    result = Math.cos(x);
                    break;
                case 'tan':
                    result = Math.tan(x);
                    break;
                case 'log':
                    if (x <= 0) {
                        isValid = false;
                        errorMsg = 'Logarytm naturalny jest zdefiniowany tylko dla liczb dodatnich';
                    } else {
                        result = Math.log(x);
                    }
                    break;
                case 'log10':
                    if (x <= 0) {
                        isValid = false;
                        errorMsg = 'Logarytm dziesiętny jest zdefiniowany tylko dla liczb dodatnich';
                    } else {
                        result = Math.log10(x);
                    }
                    break;
                case 'sqrt':
                    if (x < 0) {
                        isValid = false;
                        errorMsg = 'Pierwiastek kwadratowy jest zdefiniowany tylko dla liczb nieujemnych';
                    } else {
                        result = Math.sqrt(x);
                    }
                    break;
                case 'exp':
                    result = Math.exp(x);
                    break;
                case 'abs':
                    result = Math.abs(x);
                    break;
                case 'asin':
                    if (x < -1 || x > 1) {
                        isValid = false;
                        errorMsg = 'Arcus sinus jest zdefiniowany tylko dla wartości z przedziału [-1, 1]';
                    } else {
                        result = Math.asin(x);
                    }
                    break;
                case 'acos':
                    if (x < -1 || x > 1) {
                        isValid = false;
                        errorMsg = 'Arcus cosinus jest zdefiniowany tylko dla wartości z przedziału [-1, 1]';
                    } else {
                        result = Math.acos(x);
                    }
                    break;
                case 'atan':
                    result = Math.atan(x);
                    break;
                default:
                    isValid = false;
                    errorMsg = 'Nieznana funkcja';
            }
        } catch (e) {
            isValid = false;
            errorMsg = 'Błąd podczas obliczania';
        }

        if (isValid) {
            resultDiv.innerHTML = `
                <div class="calculation-result success">
                    <div class="result-header">
                        <i class="fas fa-check-circle"></i>
                        <span>Wynik obliczenia</span>
                    </div>
                    <div class="result-content">
                        <div class="calculation-display">
                            ${this.getFunctionDisplayName()}(${x}) = <span class="result-value">${this.formatResult(result)}</span>
                        </div>
                        <div class="result-details">
                            <small>Dokładność: ${result.toString().length > 10 ? 'przybliżona' : 'dokładna'}</small>
                        </div>
                    </div>
                </div>
            `;
            this.clearError();
        } else {
            this.showError(errorMsg);
        }
    }

    getFunctionDisplayName() {
        const names = {
            sin: 'sin', cos: 'cos', tan: 'tan', tan: 'tg',
            log: 'ln', log10: 'log₁₀', sqrt: '√',
            exp: 'exp', abs: '| |', asin: 'arcsin',
            acos: 'arccos', atan: 'arctg'
        };
        return names[this.currentFunction] || this.currentFunction;
    }

    formatResult(value) {
        if (Math.abs(value) < 0.0001) {
            return value.toExponential(4);
        }
        return Math.round(value * 100000000) / 100000000;
    }

    plotPoint() {
        const xInput = document.getElementById('xValue');
        if (!xInput || !xInput.value) {
            this.showError('Wprowadź wartość x');
            return;
        }

        const xValue = parseFloat(xInput.value);
        if (isNaN(xValue)) {
            this.showError('Nieprawidłowa wartość x');
            return;
        }

        let yValue;
        try {
            yValue = this.evaluateFunction(xValue);
        } catch (error) {
            this.showError('Błąd podczas obliczania funkcji: ' + error.message);
            return;
        }

        if (isNaN(yValue) || !isFinite(yValue)) {
            this.showError('Funkcja nie jest zdefiniowana dla tej wartości x');
            return;
        }

        const canvas = document.getElementById('functionCanvas');
        const ctx = canvas.getContext('2d');
        
        if (!canvas || !ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up coordinate system
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scaleX = width / (this.xMax - this.xMin);
        const scaleY = height / 20; // Adjust based on function range

        // Draw axes
        this.drawAxes(ctx, width, height, centerX, centerY);
        
        // Plot basic function curve (light)
        ctx.strokeStyle = 'rgba(224, 122, 95, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        let firstPoint = true;
        for (let i = 0; i <= this.plotPoints; i++) {
            const x = this.xMin + (this.xMax - this.xMin) * i / this.plotPoints;
            let y;

            try {
                y = this.evaluateFunction(x);
                
                if (isNaN(y) || !isFinite(y)) continue;

                const canvasX = centerX + x * scaleX;
                const canvasY = centerY - y * scaleY;

                if (canvasY >= 0 && canvasY <= height) {
                    if (firstPoint) {
                        ctx.moveTo(canvasX, canvasY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(canvasX, canvasY);
                    }
                }
            } catch (e) {
                continue;
            }
        }

        ctx.stroke();
        
        // Highlight the specific point
        const pointCanvasX = centerX + xValue * scaleX;
        const pointCanvasY = centerY - yValue * scaleY;
        
        if (pointCanvasX >= 0 && pointCanvasX <= width && pointCanvasY >= 0 && pointCanvasY <= height) {
            // Draw point
            ctx.fillStyle = '#e07a5f';
            ctx.beginPath();
            ctx.arc(pointCanvasX, pointCanvasY, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw point label
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            const label = `(${xValue.toFixed(2)}, ${yValue.toFixed(4)})`;
            const labelWidth = ctx.measureText(label).width;
            
            let labelX = pointCanvasX - labelWidth / 2;
            let labelY = pointCanvasY - 15;
            
            // Adjust label position if it goes off screen
            if (labelX < 5) labelX = 5;
            if (labelX + labelWidth > width - 5) labelX = width - labelWidth - 5;
            if (labelY < 15) labelY = pointCanvasY + 25;
            
            // Background for label
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(labelX - 3, labelY - 12, labelWidth + 6, 16);
            
            // Label text
            ctx.fillStyle = 'white';
            ctx.fillText(label, labelX, labelY);
        }
        
        // Add function label
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`y = ${this.getFunctionDisplayName()}(x)`, 10, 25);
        
        // Update result display
        this.displayResult(xValue, yValue);
    }

    drawAxes(ctx, width, height, centerX, centerY) {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Grid lines and labels
        ctx.strokeStyle = '#eee';
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';

        // Vertical grid lines
        for (let x = this.xMin; x <= this.xMax; x++) {
            const canvasX = centerX + x * (width / (this.xMax - this.xMin));
            if (x !== 0) {
                ctx.beginPath();
                ctx.moveTo(canvasX, 0);
                ctx.lineTo(canvasX, height);
                ctx.stroke();
                ctx.fillText(x.toString(), canvasX - 5, centerY + 15);
            }
        }
    }

    evaluateFunction(x) {
        switch (this.currentFunction) {
            case 'sin': return Math.sin(x);
            case 'cos': return Math.cos(x);
            case 'tan': return Math.tan(x);
            case 'log': return x > 0 ? Math.log(x) : NaN;
            case 'log10': return x > 0 ? Math.log10(x) : NaN;
            case 'sqrt': return x >= 0 ? Math.sqrt(x) : NaN;
            case 'exp': return Math.exp(x);
            case 'abs': return Math.abs(x);
            case 'asin': return (x >= -1 && x <= 1) ? Math.asin(x) : NaN;
            case 'acos': return (x >= -1 && x <= 1) ? Math.acos(x) : NaN;
            case 'atan': return Math.atan(x);
            default: return NaN;
        }
    }

    validateInput() {
        const xInput = document.getElementById('xValue');
        const value = xInput.value;
        
        if (value && isNaN(parseFloat(value))) {
            xInput.classList.add('invalid');
        } else {
            xInput.classList.remove('invalid');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('functionError');
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
        const errorDiv = document.getElementById('functionError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    displayResult(xValue, yValue) {
        const resultDiv = document.getElementById('functionResult');
        if (!resultDiv) return;

        const functionName = this.getFunctionDisplayName();
        
        resultDiv.innerHTML = `
            <h3>Wynik obliczeń:</h3>
            <div class="result-content">
                <div class="result-main">
                    <strong>${functionName}(${xValue}) = ${this.formatNumber(yValue)}</strong>
                </div>
                <div class="result-details">
                    <p>Funkcja: ${functionName}</p>
                    <p>Wartość x: ${xValue}</p>
                    <p>Wartość y: ${this.formatNumber(yValue)}</p>
                    <p>Punkt: (${xValue}, ${this.formatNumber(yValue)})</p>
                </div>
            </div>
        `;
    }

    getFunctionDescription() {
        const descriptions = {
            sin: 'Funkcja sinus - okresowa funkcja trygonometryczna',
            cos: 'Funkcja cosinus - okresowa funkcja trygonometryczna', 
            tan: 'Funkcja tangens - okresowa funkcja trygonometryczna',
            log: 'Logarytm naturalny - funkcja odwrotna do funkcji wykładniczej',
            log10: 'Logarytm dziesiętny - logarytm o podstawie 10',
            sqrt: 'Pierwiastek kwadratowy - funkcja potęgowa o wykładniku 1/2',
            exp: 'Funkcja wykładnicza - funkcja o podstawie e',
            abs: 'Wartość bezwzględna - moduł liczby',
            asin: 'Arcus sinus - funkcja odwrotna do sinusa',
            acos: 'Arcus cosinus - funkcja odwrotna do cosinusa',
            atan: 'Arcus tangens - funkcja odwrotna do tangensa'
        };
        return descriptions[this.currentFunction] || 'Nieznana funkcja';
    }

    clearResults() {
        const resultDiv = document.getElementById('functionResult');
        const errorDiv = document.getElementById('functionError');
        const canvas = document.getElementById('functionCanvas');
        const xInput = document.getElementById('xValue');

        if (resultDiv) {
            resultDiv.innerHTML = `
                <h3>Wynik obliczeń:</h3>
                <div class="result-content">Wprowadź wartość x i kliknij "Oblicz wartość" aby zobaczyć wynik</div>
            `;
        }
        if (errorDiv) errorDiv.style.display = 'none';
        if (xInput) xInput.value = '1';
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// Function calculator will be initialized when needed by the main app
