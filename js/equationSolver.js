// Equation Solver - Algebraic and Polynomial Equations
class EquationSolver {
    constructor() {
        this.currentEquationType = 'linear';
        this.initializeEventListeners();
        this.solutions = [];
    }

    initializeEventListeners() {
        // Equation type selection
        const typeSelect = document.getElementById('equationType');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.currentEquationType = e.target.value;
                this.updateInputs();
                this.updateEquationPreview();
            });
        }

        // Solve button
        const solveBtn = document.getElementById('solveEquationBtn');
        if (solveBtn) {
            solveBtn.addEventListener('click', () => this.solveEquation());
        }

        // Clear button
        const clearBtn = document.getElementById('clearEquationBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearResults());
        }

        // Show steps button
        const stepsBtn = document.getElementById('showStepsBtn');
        if (stepsBtn) {
            stepsBtn.addEventListener('click', () => this.showDetailedSteps());
        }

        // Add input listeners for live preview
        this.addInputListeners();
        
        // Initialize form
        this.updateInputs();
        this.updateEquationPreview();
    }

    addInputListeners() {
        // Add event listeners to all coefficient inputs for live preview
        const inputIds = ['coeff_a', 'coeff_b', 'coeff_c', 'quad_a', 'quad_b', 'quad_c'];
        
        inputIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.updateEquationPreview());
            }
        });
    }

    updateInputs() {
        const linearInputs = document.querySelector('.linear-inputs');
        const quadraticInputs = document.querySelector('.quadratic-inputs');
        const cubicInputs = document.querySelector('.cubic-inputs');

        if (this.currentEquationType === 'linear') {
            if (linearInputs) linearInputs.style.display = 'block';
            if (quadraticInputs) quadraticInputs.style.display = 'none';
            if (cubicInputs) cubicInputs.style.display = 'none';
        } else if (this.currentEquationType === 'quadratic') {
            if (linearInputs) linearInputs.style.display = 'none';
            if (quadraticInputs) quadraticInputs.style.display = 'block';
            if (cubicInputs) cubicInputs.style.display = 'none';
        } else if (this.currentEquationType === 'cubic') {
            if (linearInputs) linearInputs.style.display = 'none';
            if (quadraticInputs) quadraticInputs.style.display = 'none';
            if (cubicInputs) cubicInputs.style.display = 'block';
        }
    }

    updateEquationPreview() {
        const preview = document.getElementById('equationPreview');
        if (!preview) return;

        let equation = '';
        
        if (this.currentEquationType === 'linear') {
            const a = document.getElementById('coeff_a')?.value || '2';
            const b = document.getElementById('coeff_b')?.value || '-6';
            
            const aNum = parseFloat(a) || 2;
            const bNum = parseFloat(b) || -6;
            
            equation = `${aNum}x ${bNum >= 0 ? '+' : ''}${bNum} = 0`;
        } else if (this.currentEquationType === 'quadratic') {
            const a = document.getElementById('quad_a')?.value || '1';
            const b = document.getElementById('quad_b')?.value || '-5';
            const c = document.getElementById('quad_c')?.value || '6';
            
            const aNum = parseFloat(a) || 1;
            const bNum = parseFloat(b) || -5;
            const cNum = parseFloat(c) || 6;
            
            equation = `${aNum}x² ${bNum >= 0 ? '+' : ''}${bNum}x ${cNum >= 0 ? '+' : ''}${cNum} = 0`;
        }
        
        preview.textContent = equation;
    }

    validateInputs() {
        const requiredInputs = this.currentEquationType === 'linear' ? ['coeff_a', 'coeff_b'] :
                               this.currentEquationType === 'quadratic' ? ['quad_a', 'quad_b', 'quad_c'] :
                               ['coeff_a', 'coeff_b', 'coeff_c', 'coeff_d'];

        for (const id of requiredInputs) {
            const input = document.getElementById(id);
            if (!input || isNaN(parseFloat(input.value))) {
                throw new Error(`Nieprawidłowa wartość dla pola: ${id}`);
            }
        }
    }

    solveEquation() {
        this.clearError();

        try {
            this.validateInputs(); // Validate inputs before solving

            let solutions;
            let steps = [];

            switch (this.currentEquationType) {
                case 'linear':
                    solutions = this.solveLinear();
                    break;
                case 'quadratic':
                    solutions = this.solveQuadratic();
                    break;
                case 'cubic':
                    solutions = this.solveCubic();
                    break;
                case 'system2x2':
                    solutions = this.solveSystem2x2();
                    break;
                default:
                    throw new Error('Nieznany typ równania');
            }

            this.displaySolution(solutions);
        } catch (error) {
            this.showError(error.message);
        }
    }

    solveLinear() {
        const a = this.getCoefficient('coeff_a');
        const b = this.getCoefficient('coeff_b', 0);

        if (a === 0) {
            if (b === 0) {
                return { type: 'infinite', message: 'Równanie ma nieskończenie wiele rozwiązań (0 = 0)' };
            } else {
                return { type: 'none', message: 'Równanie nie ma rozwiązań' };
            }
        }

        const x = -b / a;
        return {
            type: 'single',
            solutions: [x],
            steps: [
                `Dane równanie: ${a}x + ${b} = 0`,
                `Przenosimy ${b} na prawą stronę: ${a}x = ${-b}`,
                `Dzielimy przez ${a}: x = ${-b}/${a}`,
                `Rozwiązanie: x = ${x}`
            ]
        };
    }

    solveQuadratic() {
        const a = this.getCoefficient('quad_a');
        const b = this.getCoefficient('quad_b', 0);
        const c = this.getCoefficient('quad_c', 0);

        if (a === 0) {
            throw new Error('Współczynnik a nie może być zero dla równania kwadratowego');
        }

        const discriminant = b * b - 4 * a * c;
        const steps = [
            `Dane równanie: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
            `Obliczamy dyskryminantę: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`
        ];

        if (discriminant > 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            steps.push(`Δ > 0, więc równanie ma dwa różne pierwiastki rzeczywiste:`);
            steps.push(`x₁ = (-b + √Δ) / 2a = (${-b} + √${discriminant}) / ${2 * a} = ${x1}`);
            steps.push(`x₂ = (-b - √Δ) / 2a = (${-b} - √${discriminant}) / ${2 * a} = ${x2}`);
            
            return {
                type: 'double',
                solutions: [x1, x2],
                discriminant: discriminant,
                steps: steps
            };
        } else if (discriminant === 0) {
            const x = -b / (2 * a);
            steps.push(`Δ = 0, więc równanie ma jeden pierwiastek podwójny:`);
            steps.push(`x = -b / 2a = ${-b} / ${2 * a} = ${x}`);
            
            return {
                type: 'double_root',
                solutions: [x],
                discriminant: discriminant,
                steps: steps
            };
        } else {
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            steps.push(`Δ < 0, więc równanie ma dwa pierwiastki zespolone:`);
            steps.push(`x₁ = ${realPart} + ${imaginaryPart}i`);
            steps.push(`x₂ = ${realPart} - ${imaginaryPart}i`);
            
            return {
                type: 'complex',
                solutions: [
                    { real: realPart, imag: imaginaryPart },
                    { real: realPart, imag: -imaginaryPart }
                ],
                discriminant: discriminant,
                steps: steps
            };
        }
    }

    solveCubic() {
        // Simplified cubic solver - for real roots only
        const a = this.getCoefficient('coeff_a');
        const b = this.getCoefficient('coeff_b', 0);
        const c = this.getCoefficient('coeff_c', 0);
        const d = this.getCoefficient('coeff_d', 0);

        if (a === 0) {
            throw new Error('Współczynnik a nie może być zero dla równania trzeciego stopnia');
        }

        // Normalize coefficients
        const p = b / a;
        const q = c / a;
        const r = d / a;

        // Use numerical method to find roots
        const roots = this.findCubicRoots(1, p, q, r);
        
        return {
            type: 'cubic',
            solutions: roots,
            steps: [
                `Dane równanie: ${a}x³ ${b >= 0 ? '+' : ''}${b}x² ${c >= 0 ? '+' : ''}${c}x ${d >= 0 ? '+' : ''}${d} = 0`,
                `Normalizacja: x³ ${p >= 0 ? '+' : ''}${p}x² ${q >= 0 ? '+' : ''}${q}x ${r >= 0 ? '+' : ''}${r} = 0`,
                `Używamy metody numerycznej do znajdowania pierwiastków...`,
                `Znalezione pierwiastki: ${roots.map(r => r.toFixed(6)).join(', ')}`
            ]
        };
    }

    findCubicRoots(a, b, c, d) {
        const roots = [];
        const tolerance = 1e-7;
        const maxIter = 100;

        // Helper function for Newton's method
        const newtonMethod = (f, df, x0) => {
            let x = x0;
            for (let i = 0; i < maxIter; i++) {
                const fx = f(x);
                const dfx = df(x);
                if (Math.abs(fx) < tolerance) return x;
                if (Math.abs(dfx) < tolerance) break; // Avoid division by zero
                x -= fx / dfx;
            }
            return null; // No root found within tolerance
        };

        // Polynomial function and its derivative
        const f = (x) => a * x ** 3 + b * x ** 2 + c * x + d;
        const df = (x) => 3 * a * x ** 2 + 2 * b * x + c;

        // Search for roots in a range
        for (let start = -10; start <= 10; start += 0.5) {
            const root = newtonMethod(f, df, start);
            if (root !== null) {
                const roundedRoot = parseFloat(root.toFixed(6));
                if (!roots.some(r => Math.abs(r - roundedRoot) < tolerance)) {
                    roots.push(roundedRoot);
                }
            }
        }

        return roots;
    }

    solveSystem2x2() {
        const a1 = this.getCoefficient('a1');
        const b1 = this.getCoefficient('b1');
        const c1 = this.getCoefficient('c1');
        const a2 = this.getCoefficient('a2');
        const b2 = this.getCoefficient('b2');
        const c2 = this.getCoefficient('c2');

        const det = a1 * b2 - a2 * b1;
        const steps = [
            `Układ równań:`,
            `${a1}x ${b1 >= 0 ? '+' : ''}${b1}y = ${c1}`,
            `${a2}x ${b2 >= 0 ? '+' : ''}${b2}y = ${c2}`,
            ``,
            `Obliczamy wyznacznik główny: det = ${a1}×${b2} - ${a2}×${b1} = ${det}`
        ];

        if (Math.abs(det) < 1e-10) {
            // Check if system has solutions
            const ratio1 = a2 !== 0 ? a1 / a2 : (a1 === 0 ? 1 : Infinity);
            const ratio2 = b2 !== 0 ? b1 / b2 : (b1 === 0 ? 1 : Infinity);
            const ratio3 = c2 !== 0 ? c1 / c2 : (c1 === 0 ? 1 : Infinity);

            if (Math.abs(ratio1 - ratio2) < 1e-10 && Math.abs(ratio1 - ratio3) < 1e-10) {
                steps.push(`det = 0 i równania są proporcjonalne - nieskończenie wiele rozwiązań`);
                return { type: 'infinite', steps: steps };
            } else {
                steps.push(`det = 0 i równania są sprzeczne - brak rozwiązań`);
                return { type: 'none', steps: steps };
            }
        }

        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        steps.push(`Używamy wzorów Cramera:`);
        steps.push(`x = (${c1}×${b2} - ${c2}×${b1}) / ${det} = ${x}`);
        steps.push(`y = (${a1}×${c2} - ${a2}×${c1}) / ${det} = ${y}`);

        return {
            type: 'system',
            solutions: { x: x, y: y },
            steps: steps
        };
    }

    getCoefficient(id, defaultValue = null) {
        const input = document.getElementById(id);
        if (!input || input.value === '') {
            if (defaultValue !== null) return defaultValue;
            throw new Error(`Wprowadź wartość dla ${id}`);
        }
        const value = parseFloat(input.value);
        if (isNaN(value)) {
            throw new Error(`Nieprawidłowa wartość dla ${id}`);
        }
        return value;
    }

    displaySolution(result) {
        const resultDiv = document.getElementById('equationResult');
        if (!resultDiv) return;

        let html = '<div class="solution-container">';

        // Display steps
        if (result.steps) {
            html += '<div class="solution-steps"><h4>Kroki rozwiązania:</h4><ol>';
            result.steps.forEach(step => {
                if (step.trim()) {
                    html += `<li>${step}</li>`;
                } else {
                    html += '<br>';
                }
            });
            html += '</ol></div>';
        }

        // Display solutions
        html += '<div class="solution-result"><h4>Rozwiązanie:</h4>';

        switch (result.type) {
            case 'single':
                html += `<div class="solution-value">x = ${result.solutions[0]}</div>`;
                break;
            case 'double':
                html += `<div class="solution-value">x₁ = ${result.solutions[0]}</div>`;
                html += `<div class="solution-value">x₂ = ${result.solutions[1]}</div>`;
                break;
            case 'double_root':
                html += `<div class="solution-value">x = ${result.solutions[0]} (pierwiastek podwójny)</div>`;
                break;
            case 'complex':
                html += `<div class="solution-value">x₁ = ${result.solutions[0].real} + ${result.solutions[0].imag}i</div>`;
                html += `<div class="solution-value">x₂ = ${result.solutions[1].real} + ${result.solutions[1].imag}i</div>`;
                break;
            case 'cubic':
                result.solutions.forEach((sol, i) => {
                    html += `<div class="solution-value">x${i+1} = ${sol}</div>`;
                });
                break;
            case 'system':
                html += `<div class="solution-value">x = ${result.solutions.x}</div>`;
                html += `<div class="solution-value">y = ${result.solutions.y}</div>`;
                break;
            case 'infinite':
                html += `<div class="solution-message infinite">${result.message}</div>`;
                break;
            case 'none':
                html += `<div class="solution-message none">${result.message}</div>`;
                break;
        }

        html += '</div></div>';
        resultDiv.innerHTML = html;
    }

    showError(message) {
        const errorDiv = document.getElementById('equationError');
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
        const errorDiv = document.getElementById('equationError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    showDetailedSteps() {
        const stepsDiv = document.getElementById('equationSteps');
        if (!stepsDiv) return;

        try {
            let solutions = this.solveEquation();
            if (solutions && solutions.steps) {
                let stepsHTML = '<h3>Kroki rozwiązania:</h3><div class="steps-content"><ol>';
                solutions.steps.forEach(step => {
                    stepsHTML += `<li>${step}</li>`;
                });
                stepsHTML += '</ol></div>';
                stepsDiv.innerHTML = stepsHTML;
            } else {
                stepsDiv.innerHTML = '<h3>Kroki rozwiązania:</h3><div class="steps-content">Najpierw rozwiąż równanie aby zobaczyć kroki</div>';
            }
        } catch (error) {
            stepsDiv.innerHTML = '<h3>Kroki rozwiązania:</h3><div class="steps-content">Błąd podczas generowania kroków</div>';
        }
    }

    clearResults() {
        const resultDiv = document.getElementById('equationResult');
        const stepsDiv = document.getElementById('equationSteps');
        const errorDiv = document.getElementById('equationError');

        if (resultDiv) {
            resultDiv.innerHTML = `
                <h3>Rozwiązanie równania:</h3>
                <div class="result-content">Wprowadź współczynniki i kliknij "Rozwiąż równanie"</div>
            `;
        }
        if (stepsDiv) {
            stepsDiv.innerHTML = `
                <h3>Kroki rozwiązania:</h3>
                <div class="steps-content">Rozwiąż równanie aby zobaczyć kroki</div>
            `;
        }
        if (errorDiv) errorDiv.style.display = 'none';

        // Reset inputs to default values
        const linearInputs = {
            'coeff_a': '2',
            'coeff_b': '-6'
        };
        const quadraticInputs = {
            'quad_a': '1',
            'quad_b': '-5', 
            'quad_c': '6'
        };

        Object.entries(linearInputs).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });

        Object.entries(quadraticInputs).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });

        this.updateEquationPreview();
    }
}

// Equation solver will be initialized when needed by the main app
