class CombinatoricsCalculator {
    constructor() {
        this.results = [];
        this.init();
    }

    init() {
        this.selectedOperation = 'permutations';
        this.bindEvents();
        this.updateFormulaDisplay();
    }

    createHTML() {
        // HTML is now created in index.html, no need to recreate
        return;
    }

    bindEvents() {
        // Operation menu toggle
        const operationBtn = document.getElementById('combinatoricsOperationBtn');
        const operationMenu = document.getElementById('combinatoricsOperationMenu');
        
        if (operationBtn && operationMenu) {
            operationBtn.addEventListener('click', () => {
                operationMenu.classList.toggle('open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!operationBtn.contains(e.target) && !operationMenu.contains(e.target)) {
                    operationMenu.classList.remove('open');
                }
            });

            // Operation menu items
            operationMenu.querySelectorAll('.operation-menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    const operation = item.dataset.op;
                    this.selectedOperation = operation;
                    operationBtn.textContent = item.textContent;
                    operationMenu.classList.remove('open');
                    this.updateFormulaDisplay();
                    this.updateKInputVisibility();
                });
            });
        }

        // Calculate button
        const calculateBtn = document.getElementById('calculateCombinatoricsBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }

        // Show formula button
        const showFormulaBtn = document.getElementById('showFormulaBtn');
        if (showFormulaBtn) {
            showFormulaBtn.addEventListener('click', () => this.toggleFormulaDetails());
        }

        // Clear button
        const clearBtn = document.getElementById('clearCombinatoricsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearInputs());
        }

        // Input change events
        const nInput = document.getElementById('nValue');
        const kInput = document.getElementById('kValue');
        
        if (nInput) {
            nInput.addEventListener('input', () => this.updateKInputVisibility());
        }
        
        if (kInput) {
            kInput.addEventListener('input', () => this.validateInputs());
        }

        // Calculate button
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.performCalculation();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearInputs();
        });

        // Clear history
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // Input validation
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('combinatorics-input')) {
                this.validateInputs();
            }
        });
    }

    setupCalculation(operation) {
        const title = document.getElementById('operationTitle');
        const inputSection = document.getElementById('inputSection');
        const formulaExplanation = document.getElementById('formulaExplanation');
        const calculateBtn = document.getElementById('calculateBtn');
        
        calculateBtn.disabled = false;
        
        switch (operation) {
            case 'permutations':
                title.textContent = 'Permutacje P(n,r)';
                inputSection.innerHTML = this.getPermutationsInputs();
                formulaExplanation.innerHTML = this.getPermutationsExplanation();
                break;
                
            case 'combinations':
                title.textContent = 'Kombinacje C(n,r)';
                inputSection.innerHTML = this.getCombinationsInputs();
                formulaExplanation.innerHTML = this.getCombinationsExplanation();
                break;
                
            case 'factorial':
                title.textContent = 'Silnia n!';
                inputSection.innerHTML = this.getFactorialInputs();
                formulaExplanation.innerHTML = this.getFactorialExplanation();
                break;
                
            case 'variations':
                title.textContent = 'Wariacje z powtórzeniami V(n,r)';
                inputSection.innerHTML = this.getVariationsInputs();
                formulaExplanation.innerHTML = this.getVariationsExplanation();
                break;
                
            case 'derangements':
                title.textContent = 'Dezorganizacje !n';
                inputSection.innerHTML = this.getDerangementsInputs();
                formulaExplanation.innerHTML = this.getDerangementsExplanation();
                break;
                
            case 'stirling':
                title.textContent = 'Liczby Stirlinga II S(n,k)';
                inputSection.innerHTML = this.getStirlingInputs();
                formulaExplanation.innerHTML = this.getStirlingExplanation();
                break;
        }
        
        this.currentOperation = operation;
        this.validateInputs();
    }

    getPermutationsInputs() {
        return `
            <div class="input-group">
                <label for="permN">n (całkowita liczba elementów):</label>
                <input type="number" id="permN" class="combinatorics-input" min="0" max="20" step="1">
            </div>
            <div class="input-group">
                <label for="permR">r (liczba wybieranych elementów):</label>
                <input type="number" id="permR" class="combinatorics-input" min="0" max="20" step="1">
            </div>
            <div class="constraint-info">
                <i class="fas fa-info-circle"></i>
                Warunek: 0 ≤ r ≤ n ≤ 20
            </div>
        `;
    }

    getCombinationsInputs() {
        return `
            <div class="input-group">
                <label for="combN">n (całkowita liczba elementów):</label>
                <input type="number" id="combN" class="combinatorics-input" min="0" max="20" step="1">
            </div>
            <div class="input-group">
                <label for="combR">r (liczba wybieranych elementów):</label>
                <input type="number" id="combR" class="combinatorics-input" min="0" max="20" step="1">
            </div>
            <div class="constraint-info">
                <i class="fas fa-info-circle"></i>
                Warunek: 0 ≤ r ≤ n ≤ 20
            </div>
        `;
    }

    getFactorialInputs() {
        return `
            <div class="input-group">
                <label for="factN">n (liczba nieujemna):</label>
                <input type="number" id="factN" class="combinatorics-input" min="0" max="20" step="1">
            </div>
            <div class="constraint-info">
                <i class="fas fa-info-circle"></i>
                Warunek: 0 ≤ n ≤ 20
            </div>
        `;
    }

    getVariationsInputs() {
        return `
            <div class="input-group">
                <label for="varN">n (liczba różnych elementów):</label>
                <input type="number" id="varN" class="combinatorics-input" min="1" max="10" step="1">
            </div>
            <div class="input-group">
                <label for="varR">r (długość sekwencji):</label>
                <input type="number" id="varR" class="combinatorics-input" min="1" max="10" step="1">
            </div>
            <div class="constraint-info">
                <i class="fas fa-info-circle"></i>
                Warunek: n ≥ 1, r ≥ 1 (max 10 dla każdego)
            </div>
        `;
    }

    getDerangementsInputs() {
        return `
            <div class="input-group">
                <label for="derangN">n (liczba elementów):</label>
                <input type="number" id="derangN" class="combinatorics-input" min="0" max="15" step="1">
            </div>
            <div class="constraint-info">
                <i class="fas fa-info-circle"></i>
                Warunek: 0 ≤ n ≤ 15
            </div>
        `;
    }

    getStirlingInputs() {
        return `
            <div class="input-group">
                <label for="stirlingN">n (liczba elementów):</label>
                <input type="number" id="stirlingN" class="combinatorics-input" min="0" max="15" step="1">
            </div>
            <div class="input-group">
                <label for="stirlingK">k (liczba niepustych części):</label>
                <input type="number" id="stirlingK" class="combinatorics-input" min="0" max="15" step="1">
            </div>
            <div class="constraint-info">
                <i class="fas fa-info-circle"></i>
                Warunek: 0 ≤ k ≤ n ≤ 15
            </div>
        `;
    }

    getPermutationsExplanation() {
        return `
            <div class="formula-box">
                <h4>Wzór: P(n,r) = n! / (n-r)!</h4>
                <p>Permutacje to uporządkowane sposoby wyboru r elementów z n elementów, gdzie kolejność ma znaczenie.</p>
                <p><strong>Przykład:</strong> Ile sposobów wyboru i ustawienia 3 osób z grupy 5 na podium? P(5,3) = 5!/(5-3)! = 5!/2! = 60</p>
            </div>
        `;
    }

    getCombinationsExplanation() {
        return `
            <div class="formula-box">
                <h4>Wzór: C(n,r) = n! / (r!(n-r)!)</h4>
                <p>Kombinacje to sposoby wyboru r elementów z n elementów, gdzie kolejność nie ma znaczenia.</p>
                <p><strong>Przykład:</strong> Ile sposobów wyboru 3 osób z grupy 5 do komisji? C(5,3) = 5!/(3!×2!) = 10</p>
            </div>
        `;
    }

    getFactorialExplanation() {
        return `
            <div class="formula-box">
                <h4>Wzór: n! = n × (n-1) × (n-2) × ... × 2 × 1</h4>
                <p>Silnia to iloczyn wszystkich liczb naturalnych od 1 do n. Przez definicję 0! = 1.</p>
                <p><strong>Przykład:</strong> 5! = 5 × 4 × 3 × 2 × 1 = 120</p>
            </div>
        `;
    }

    getVariationsExplanation() {
        return `
            <div class="formula-box">
                <h4>Wzór: V(n,r) = n^r</h4>
                <p>Wariacje z powtórzeniami to liczba r-elementowych sekwencji z n różnych elementów, gdzie elementy mogą się powtarzać.</p>
                <p><strong>Przykład:</strong> Ile 4-cyfrowych kodów PIN można utworzyć? V(10,4) = 10^4 = 10000</p>
            </div>
        `;
    }

    getDerangementsExplanation() {
        return `
            <div class="formula-box">
                <h4>Wzór: !n = n! × Σ(k=0 do n) (-1)^k / k!</h4>
                <p>Dezorganizacje to permutacje n elementów, gdzie żaden element nie znajduje się na swojej pierwotnej pozycji.</p>
                <p><strong>Przykład:</strong> Problem kapeluszy - na ile sposobów n osób może odzyskać swoje kapelusze tak, aby nikt nie dostał swojego?</p>
            </div>
        `;
    }

    getStirlingExplanation() {
        return `
            <div class="formula-box">
                <h4>Wzór: S(n,k) = (1/k!) × Σ(j=0 do k) (-1)^(k-j) × C(k,j) × j^n</h4>
                <p>Liczby Stirlinga drugiego rodzaju określają liczbę sposobów podziału n-elementowego zbioru na k niepustych części.</p>
                <p><strong>Przykład:</strong> Na ile sposobów można podzielić 4 osoby na 2 niepuste grupy? S(4,2) = 7</p>
            </div>
        `;
    }

    validateInputs() {
        const calculateBtn = document.getElementById('calculateBtn');
        let isValid = false;
        
        if (!this.currentOperation) {
            calculateBtn.disabled = true;
            return;
        }
        
        switch (this.currentOperation) {
            case 'permutations':
            case 'combinations':
                const n = document.getElementById(this.currentOperation === 'permutations' ? 'permN' : 'combN');
                const r = document.getElementById(this.currentOperation === 'permutations' ? 'permR' : 'combR');
                isValid = this.validateNR(n, r);
                break;
                
            case 'factorial':
                const factN = document.getElementById('factN');
                isValid = this.validateSingleInput(factN, 0, 20);
                break;
                
            case 'variations':
                const varN = document.getElementById('varN');
                const varR = document.getElementById('varR');
                isValid = this.validateSingleInput(varN, 1, 10) && this.validateSingleInput(varR, 1, 10);
                break;
                
            case 'derangements':
                const derangN = document.getElementById('derangN');
                isValid = this.validateSingleInput(derangN, 0, 15);
                break;
                
            case 'stirling':
                const stirlingN = document.getElementById('stirlingN');
                const stirlingK = document.getElementById('stirlingK');
                isValid = this.validateNK(stirlingN, stirlingK);
                break;
        }
        
        calculateBtn.disabled = !isValid;
    }

    validateNR(nInput, rInput) {
        const n = parseInt(nInput.value);
        const r = parseInt(rInput.value);
        
        const nValid = !isNaN(n) && n >= 0 && n <= 20;
        const rValid = !isNaN(r) && r >= 0 && r <= n;
        
        this.setInputValidation(nInput, nValid);
        this.setInputValidation(rInput, rValid);
        
        return nValid && rValid;
    }

    validateNK(nInput, kInput) {
        const n = parseInt(nInput.value);
        const k = parseInt(kInput.value);
        
        const nValid = !isNaN(n) && n >= 0 && n <= 15;
        const kValid = !isNaN(k) && k >= 0 && k <= n;
        
        this.setInputValidation(nInput, nValid);
        this.setInputValidation(kInput, kValid);
        
        return nValid && kValid;
    }

    validateSingleInput(input, min, max) {
        const value = parseInt(input.value);
        const valid = !isNaN(value) && value >= min && value <= max;
        
        this.setInputValidation(input, valid);
        return valid;
    }

    setInputValidation(input, isValid) {
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
    }

    performCalculation() {
        if (!this.currentOperation) return;
        
        let result;
        let calculation;
        
        try {
            switch (this.currentOperation) {
                case 'permutations':
                    result = this.calculatePermutations();
                    break;
                case 'combinations':
                    result = this.calculateCombinations();
                    break;
                case 'factorial':
                    result = this.calculateFactorial();
                    break;
                case 'variations':
                    result = this.calculateVariations();
                    break;
                case 'derangements':
                    result = this.calculateDerangements();
                    break;
                case 'stirling':
                    result = this.calculateStirling();
                    break;
            }
            
            if (result) {
                this.displayResult(result);
                this.addToHistory(result);
            }
        } catch (error) {
            this.showError('Błąd w obliczeniach: ' + error.message);
        }
    }

    calculatePermutations() {
        const n = parseInt(document.getElementById('permN').value);
        const r = parseInt(document.getElementById('permR').value);
        
        const result = this.factorial(n) / this.factorial(n - r);
        const steps = this.getPermutationSteps(n, r);
        
        return {
            operation: 'Permutacje',
            formula: `P(${n},${r})`,
            calculation: `${n}! / (${n}-${r})! = ${this.factorial(n)} / ${this.factorial(n - r)}`,
            result: result,
            steps: steps,
            inputs: { n, r }
        };
    }

    calculateCombinations() {
        const n = parseInt(document.getElementById('combN').value);
        const r = parseInt(document.getElementById('combR').value);
        
        const result = this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
        const steps = this.getCombinationSteps(n, r);
        
        return {
            operation: 'Kombinacje',
            formula: `C(${n},${r})`,
            calculation: `${n}! / (${r}! × (${n}-${r})!) = ${this.factorial(n)} / (${this.factorial(r)} × ${this.factorial(n - r)})`,
            result: result,
            steps: steps,
            inputs: { n, r }
        };
    }

    calculateFactorial() {
        const n = parseInt(document.getElementById('factN').value);
        
        const result = this.factorial(n);
        const steps = this.getFactorialSteps(n);
        
        return {
            operation: 'Silnia',
            formula: `${n}!`,
            calculation: steps.calculation,
            result: result,
            steps: steps.steps,
            inputs: { n }
        };
    }

    calculateVariations() {
        const n = parseInt(document.getElementById('varN').value);
        const r = parseInt(document.getElementById('varR').value);
        
        const result = Math.pow(n, r);
        
        return {
            operation: 'Wariacje z powtórzeniami',
            formula: `V(${n},${r})`,
            calculation: `${n}^${r}`,
            result: result,
            steps: [`Każda z ${r} pozycji może być wypełniona na ${n} sposobów`, `Wynik: ${n}^${r} = ${result}`],
            inputs: { n, r }
        };
    }

    calculateDerangements() {
        const n = parseInt(document.getElementById('derangN').value);
        
        if (n === 0) return { operation: 'Dezorganizacje', formula: '!0', result: 1, steps: ['!0 = 1 (przez definicję)'], inputs: { n } };
        
        const result = this.derangements(n);
        const steps = this.getDerangementSteps(n);
        
        return {
            operation: 'Dezorganizacje',
            formula: `!${n}`,
            calculation: `${n}! × Σ(k=0 do ${n}) (-1)^k / k!`,
            result: result,
            steps: steps,
            inputs: { n }
        };
    }

    calculateStirling() {
        const n = parseInt(document.getElementById('stirlingN').value);
        const k = parseInt(document.getElementById('stirlingK').value);
        
        const result = this.stirlingSecond(n, k);
        
        return {
            operation: 'Liczby Stirlinga II',
            formula: `S(${n},${k})`,
            calculation: `Podział ${n} elementów na ${k} niepustych części`,
            result: result,
            steps: this.getStirlingSteps(n, k),
            inputs: { n, k }
        };
    }

    factorial(n) {
        if (n < 0) return undefined;
        if (n === 0 || n === 1) return 1;
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    derangements(n) {
        if (n === 0) return 1;
        if (n === 1) return 0;
        
        let sum = 0;
        for (let k = 0; k <= n; k++) {
            sum += Math.pow(-1, k) / this.factorial(k);
        }
        
        return Math.round(this.factorial(n) * sum);
    }

    stirlingSecond(n, k) {
        if (n === 0 && k === 0) return 1;
        if (n === 0 || k === 0) return 0;
        if (k > n) return 0;
        if (k === 1) return 1;
        if (k === n) return 1;
        
        // Use recurrence relation: S(n,k) = k*S(n-1,k) + S(n-1,k-1)
        const memo = {};
        
        function s(n, k) {
            if (n === 0 && k === 0) return 1;
            if (n === 0 || k === 0) return 0;
            if (k > n) return 0;
            if (k === 1 || k === n) return 1;
            
            const key = `${n},${k}`;
            if (memo[key] !== undefined) return memo[key];
            
            memo[key] = k * s(n - 1, k) + s(n - 1, k - 1);
            return memo[key];
        }
        
        return s(n, k);
    }

    getPermutationSteps(n, r) {
        return [
            `P(${n},${r}) = ${n}! / (${n}-${r})!`,
            `P(${n},${r}) = ${n}! / ${n-r}!`,
            `${n}! = ${this.factorial(n)}`,
            `${n-r}! = ${this.factorial(n-r)}`,
            `P(${n},${r}) = ${this.factorial(n)} / ${this.factorial(n-r)} = ${this.factorial(n) / this.factorial(n-r)}`
        ];
    }

    getCombinationSteps(n, r) {
        return [
            `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)`,
            `${n}! = ${this.factorial(n)}`,
            `${r}! = ${this.factorial(r)}`,
            `${n-r}! = ${this.factorial(n-r)}`,
            `C(${n},${r}) = ${this.factorial(n)} / (${this.factorial(r)} × ${this.factorial(n-r)}) = ${this.factorial(n) / (this.factorial(r) * this.factorial(n-r))}`
        ];
    }

    getFactorialSteps(n) {
        if (n === 0) return { calculation: '0! = 1 (przez definicję)', steps: ['0! = 1'] };
        
        const steps = [];
        let calculation = '';
        
        if (n <= 10) {
            const sequence = [];
            for (let i = n; i >= 1; i--) {
                sequence.push(i);
            }
            calculation = `${n}! = ${sequence.join(' × ')}`;
            steps.push(calculation);
            steps.push(`${n}! = ${this.factorial(n)}`);
        } else {
            steps.push(`${n}! = ${n} × ${n-1} × ... × 2 × 1`);
            steps.push(`${n}! = ${this.factorial(n)}`);
        }
        
        return { calculation, steps };
    }

    getDerangementSteps(n) {
        const steps = [];
        steps.push(`!${n} = ${n}! × Σ(k=0 do ${n}) (-1)^k / k!`);
        
        let sum = 0;
        let sumStr = [];
        for (let k = 0; k <= Math.min(n, 6); k++) {
            const term = Math.pow(-1, k) / this.factorial(k);
            sum += term;
            sumStr.push(`(-1)^${k}/${k}! = ${term.toFixed(6)}`);
        }
        
        if (n > 6) sumStr.push('...');
        
        steps.push(`Suma = ${sumStr.join(' + ')}`);
        steps.push(`!${n} = ${this.factorial(n)} × ${sum.toFixed(6)} = ${this.derangements(n)}`);
        
        return steps;
    }

    getStirlingSteps(n, k) {
        const steps = [];
        
        if (k === 0 || k > n) {
            steps.push(`S(${n},${k}) = 0 (niemożliwe)`);
        } else if (k === 1) {
            steps.push(`S(${n},1) = 1 (jeden sposób: wszystkie elementy w jednej części)`);
        } else if (k === n) {
            steps.push(`S(${n},${n}) = 1 (jeden sposób: każdy element w osobnej części)`);
        } else {
            steps.push(`S(${n},${k}) obliczane rekurencyjnie:`);
            steps.push(`S(n,k) = k × S(n-1,k) + S(n-1,k-1)`);
            steps.push(`Wynik: S(${n},${k}) = ${this.stirlingSecond(n, k)}`);
        }
        
        return steps;
    }

    displayResult(result) {
        const container = document.getElementById('resultsContainer');
        
        container.innerHTML = `
            <div class="calculation-result">
                <div class="result-header">
                    <i class="fas fa-check-circle"></i>
                    <h3>${result.operation}</h3>
                </div>
                
                <div class="result-main">
                    <div class="formula-display">
                        <span class="formula">${result.formula}</span>
                        <span class="equals">=</span>
                        <span class="result-value">${result.result.toLocaleString()}</span>
                    </div>
                    
                    <div class="calculation-display">
                        ${result.calculation}
                    </div>
                </div>
                
                <div class="result-steps">
                    <h4>Kroki obliczeń:</h4>
                    <ol>
                        ${result.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="result-interpretation">
                    ${this.getResultInterpretation(result)}
                </div>
            </div>
        `;
    }

    getResultInterpretation(result) {
        const { operation, inputs } = result;
        
        switch (operation) {
            case 'Permutacje':
                return `<p><strong>Interpretacja:</strong> Istnieje ${result.result.toLocaleString()} sposobów wyboru i uporządkowania ${inputs.r} elementów z ${inputs.n} dostępnych elementów.</p>`;
                
            case 'Kombinacje':
                return `<p><strong>Interpretacja:</strong> Istnieje ${result.result.toLocaleString()} sposobów wyboru ${inputs.r} elementów z ${inputs.n} dostępnych elementów (kolejność nie ma znaczenia).</p>`;
                
            case 'Silnia':
                return `<p><strong>Interpretacja:</strong> Liczba ${inputs.n} elementów może być uporządkowana na ${result.result.toLocaleString()} różnych sposobów.</p>`;
                
            case 'Wariacje z powtórzeniami':
                return `<p><strong>Interpretacja:</strong> Można utworzyć ${result.result.toLocaleString()} różnych ${inputs.r}-elementowych sekwencji z ${inputs.n} różnych symboli (z powtórzeniami).</p>`;
                
            case 'Dezorganizacje':
                return `<p><strong>Interpretacja:</strong> Istnieje ${result.result.toLocaleString()} sposobów permutacji ${inputs.n} elementów tak, aby żaden nie znalazł się na swojej pierwotnej pozycji.</p>`;
                
            case 'Liczby Stirlinga II':
                return `<p><strong>Interpretacja:</strong> Zbiór ${inputs.n}-elementowy można podzielić na ${inputs.k} niepustych części na ${result.result.toLocaleString()} sposobów.</p>`;
                
            default:
                return '';
        }
    }

    addToHistory(result) {
        this.results.unshift(result);
        if (this.results.length > 10) {
            this.results.pop();
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('calculationHistory');
        
        if (this.results.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">Brak poprzednich obliczeń</div>';
            return;
        }
        
        historyContainer.innerHTML = this.results.map(result => `
            <div class="history-item">
                <div class="history-formula">${result.formula} = ${result.result.toLocaleString()}</div>
                <div class="history-operation">${result.operation}</div>
            </div>
        `).join('');
    }

    clearInputs() {
        document.querySelectorAll('.combinatorics-input').forEach(input => {
            input.value = '';
            input.classList.remove('valid', 'invalid');
        });
        
        this.validateInputs();
    }

    clearHistory() {
        this.results = [];
        this.updateHistoryDisplay();
    }

    showError(message) {
        const errorDiv = document.getElementById('combinatoricsError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }

    updateFormulaDisplay() {
        const formulaDisplay = document.getElementById('formulaDisplay');
        if (!formulaDisplay) return;

        const formulas = {
            'permutations': {
                title: 'Permutacje P(n,k)',
                formula: 'P(n,k) = n!/(n-k)!',
                description: 'Liczba sposobów ustawienia k elementów z n elementów (kolejność ma znaczenie)'
            },
            'combinations': {
                title: 'Kombinacje C(n,k)', 
                formula: 'C(n,k) = n!/(k!×(n-k)!)',
                description: 'Liczba sposobów wyboru k elementów z n elementów (kolejność nie ma znaczenia)'
            },
            'factorial': {
                title: 'Silnia n!',
                formula: 'n! = n×(n-1)×...×2×1',
                description: 'Iloczyn wszystkich liczb naturalnych od 1 do n'
            },
            'derangements': {
                title: 'Derrangements D(n)',
                formula: 'D(n) = n! × Σ(-1)^k/k!',
                description: 'Liczba permutacji bez punktów stałych'
            },
            'stirling2': {
                title: 'Liczby Stirlinga II rodzaju',
                formula: 'S(n,k) - rekurencyjna formula',
                description: 'Liczba sposobów podziału n elementów na k niepustych grup'
            },
            'catalan': {
                title: 'Liczby Catalana C(n)',
                formula: 'C(n) = (2n)!/(n+1)!×n!',
                description: 'Liczba różnych drzew binarnych z n+1 liśćmi'
            }
        };

        const info = formulas[this.selectedOperation];
        if (info) {
            formulaDisplay.innerHTML = `
                <strong>${info.title}</strong><br>
                Wzór: ${info.formula}<br>
                ${info.description}
            `;
        }
    }

    updateKInputVisibility() {
        const kInputGroup = document.getElementById('kInputGroup');
        const singleParamOperations = ['factorial', 'derangements', 'catalan'];
        
        if (kInputGroup) {
            if (singleParamOperations.includes(this.selectedOperation)) {
                kInputGroup.style.display = 'none';
            } else {
                kInputGroup.style.display = 'block';
            }
        }
    }

    validateInputs() {
        const nInput = document.getElementById('nValue');
        const kInput = document.getElementById('kValue');
        
        if (!nInput) return;
        
        const n = parseInt(nInput.value);
        const k = parseInt(kInput.value);
        
        // Clear previous errors
        nInput.style.borderColor = '';
        if (kInput) kInput.style.borderColor = '';
        
        // Validate based on operation
        let valid = true;
        
        if (isNaN(n) || n < 0) {
            valid = false;
            nInput.style.borderColor = '#ff6b6b';
        }
        
        if (!['factorial', 'derangements', 'catalan'].includes(this.selectedOperation)) {
            if (kInput && (isNaN(k) || k < 0 || k > n)) {
                valid = false;
                if (kInput) kInput.style.borderColor = '#ff6b6b';
            }
        }
        
        return valid;
    }

    calculate() {
        if (!this.validateInputs()) {
            this.showError('Proszę wprowadzić poprawne wartości');
            return;
        }

        const nInput = document.getElementById('nValue');
        const kInput = document.getElementById('kValue');
        const resultContainer = document.getElementById('combinatoricsResult');
        
        const n = parseInt(nInput.value);
        const k = kInput ? parseInt(kInput.value) : 0;
        
        let result, explanation;
        
        try {
            switch (this.selectedOperation) {
                case 'permutations':
                    result = this.calculatePermutations(n, k);
                    explanation = `P(${n},${k}) = ${n}!/(${n}-${k})! = ${result}`;
                    break;
                case 'combinations':
                    result = this.calculateCombinations(n, k);
                    explanation = `C(${n},${k}) = ${n}!/(${k}!×(${n}-${k})!) = ${result}`;
                    break;
                case 'factorial':
                    result = this.calculateFactorial(n);
                    explanation = `${n}! = ${result}`;
                    break;
                case 'derangements':
                    result = this.calculateDerangements(n);
                    explanation = `D(${n}) = ${result}`;
                    break;
                case 'stirling2':
                    result = this.calculateStirling2(n, k);
                    explanation = `S(${n},${k}) = ${result}`;
                    break;
                case 'catalan':
                    result = this.calculateCatalan(n);
                    explanation = `C(${n}) = ${result}`;
                    break;
            }
            
            resultContainer.innerHTML = `
                <div class="result-value">${result}</div>
                <div class="result-explanation">${explanation}</div>
            `;
            
        } catch (error) {
            this.showError('Błąd podczas obliczania: ' + error.message);
        }
    }

    calculatePermutations(n, k) {
        if (n < 0 || k < 0 || k > n) throw new Error('Nieprawidłowe parametry');
        return this.calculateFactorial(n) / this.calculateFactorial(n - k);
    }

    calculateCombinations(n, k) {
        if (n < 0 || k < 0 || k > n) throw new Error('Nieprawidłowe parametry');
        return this.calculateFactorial(n) / (this.calculateFactorial(k) * this.calculateFactorial(n - k));
    }

    calculateFactorial(n) {
        if (n < 0) throw new Error('Silnia nie jest zdefiniowana dla liczb ujemnych');
        if (n > 170) throw new Error('Liczba zbyt duża do obliczenia');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    calculateDerangements(n) {
        if (n < 0) throw new Error('n musi być nieujemne');
        if (n === 0) return 1;
        if (n === 1) return 0;
        
        let result = 0;
        const factorial = this.calculateFactorial(n);
        
        for (let i = 0; i <= n; i++) {
            result += Math.pow(-1, i) / this.calculateFactorial(i);
        }
        
        return Math.round(factorial * result);
    }

    calculateStirling2(n, k) {
        if (n < 0 || k < 0) throw new Error('n i k muszą być nieujemne');
        if (k > n) return 0;
        if (k === 0) return n === 0 ? 1 : 0;
        if (k === 1 || k === n) return 1;
        
        // Rekurencyjna formuła: S(n,k) = k*S(n-1,k) + S(n-1,k-1)
        const dp = Array(n + 1).fill().map(() => Array(k + 1).fill(0));
        
        dp[0][0] = 1;
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= Math.min(i, k); j++) {
                dp[i][j] = j * dp[i-1][j] + dp[i-1][j-1];
            }
        }
        
        return dp[n][k];
    }

    calculateCatalan(n) {
        if (n < 0) throw new Error('n musi być nieujemne');
        if (n > 30) throw new Error('Liczba zbyt duża do obliczenia');
        
        // C(n) = (2n)! / ((n+1)! * n!)
        const factorial2n = this.calculateFactorial(2 * n);
        const factorialN = this.calculateFactorial(n);
        const factorialNPlus1 = this.calculateFactorial(n + 1);
        
        return factorial2n / (factorialNPlus1 * factorialN);
    }

    toggleFormulaDetails() {
        const formulaDisplay = document.getElementById('formulaDisplay');
        if (formulaDisplay) {
            // Add detailed formula explanation
            this.showDetailedFormula();
        }
    }

    showDetailedFormula() {
        const formulas = {
            'permutations': 'Permutacje to uporządkowane wybory. Gdy wybieramy k elementów z n dostępnych i kolejność ma znaczenie, używamy wzoru P(n,k) = n!/(n-k)!',
            'combinations': 'Kombinacje to nieuporządkowane wybory. Gdy kolejność nie ma znaczenia, używamy wzoru C(n,k) = n!/(k!×(n-k)!)',
            'factorial': 'Silnia to iloczyn wszystkich liczb naturalnych od 1 do n. 0! = 1 z definicji.',
            'derangements': 'Derrangements to permutacje gdzie żaden element nie jest na swojej pierwotnej pozycji.',
            'stirling2': 'Liczby Stirlinga II rodzaju liczą sposoby podziału n różnych obiektów na k niepustych grup.',
            'catalan': 'Liczby Catalana występują w wielu problemach kombinatorycznych, np. liczba różnych drzew binarnych.'
        };

        alert(formulas[this.selectedOperation] || 'Szczegółowe informacje niedostępne');
    }

    clearInputs() {
        const nInput = document.getElementById('nValue');
        const kInput = document.getElementById('kValue');
        const resultContainer = document.getElementById('combinatoricsResult');
        
        if (nInput) nInput.value = '';
        if (kInput) kInput.value = '';
        
        resultContainer.innerHTML = '<div class="default-result-text">Wprowadź wartości i kliknij "Oblicz"</div>';
        
        // Clear any error styling
        if (nInput) nInput.style.borderColor = '';
        if (kInput) kInput.style.borderColor = '';
    }
}

// Combinatorics calculator will be initialized when needed by the main app
