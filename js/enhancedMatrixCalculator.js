class EnhancedMatrixCalculator {
    constructor() {
        this.matrices = {
            A: null,
            B: null
        };
        this.results = [];
        this.init();
    }

    init() {
        console.log('Enhanced Matrix Calculator initializing...');
        this.bindEvents();
        this.initializeMatrix();
        console.log('Enhanced Matrix Calculator initialized.');
    }

    createHTML() {
        // HTML is now created in index.html, no need to recreate
        return;
    }

    initializeMatrix() {
        // Create initial 3x3 matrix
        this.createMatrixGrid('A', 3, 3);
        this.currentMatrix = 'A';
        this.currentOperation = 'eigenvalues';
    }

    bindEvents() {
        console.log('Binding events for Enhanced Matrix Calculator...');
        // Operation menu button and dropdown - synchronized with simple matrix calculator
        const operationBtn = document.getElementById('enhancedOperationBtn');
        const operationMenu = document.getElementById('enhancedOperationMenu');
        
        console.log('Operation button:', operationBtn);
        console.log('Operation menu:', operationMenu);
        
        if (operationBtn && operationMenu) {
            // Clear any existing event listeners
            operationBtn.removeEventListener('click', this.handleOperationClick);
            this.handleOperationClick = (e) => {
                e.stopPropagation();
                console.log('Operation button clicked!');
                
                // Close menu with animation if open
                if (operationMenu.classList.contains('open')) {
                    operationMenu.classList.add('closing');
                    operationMenu.classList.remove('open');
                    
                    setTimeout(() => {
                        operationMenu.classList.remove('closing');
                    }, 300);
                } else {
                    // Open menu
                    operationMenu.classList.add('open');
                }
            };
            
            operationBtn.addEventListener('click', this.handleOperationClick);

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!operationBtn.contains(e.target) && !operationMenu.contains(e.target)) {
                    if (operationMenu.classList.contains('open')) {
                        operationMenu.classList.add('closing');
                        operationMenu.classList.remove('open');
                        
                        setTimeout(() => {
                            operationMenu.classList.remove('closing');
                        }, 300);
                    }
                }
            });

            // Operation menu items
            operationMenu.querySelectorAll('.operation-menu-item').forEach((item, index) => {
                // Set CSS custom property for animation delay
                item.style.setProperty('--i', index);
                
                item.addEventListener('click', () => {
                    const operation = item.dataset.op;
                    operationBtn.textContent = item.textContent;
                    
                    operationMenu.classList.add('closing');
                    operationMenu.classList.remove('open');
                    
                    setTimeout(() => {
                        operationMenu.classList.remove('closing');
                    }, 300);
                    
                    this.currentOperation = operation;
                });
            });
        }

        // Compute button
        const computeBtn = document.getElementById('enhancedComputeBtn');
        if (computeBtn) {
            computeBtn.addEventListener('click', () => this.performOperation());
        }

        // Clear button
        const clearBtn = document.getElementById('enhancedClearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearResults());
        }
        
        // Clear history button (if exists)
        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }

        // Size input change handlers (if they exist)
        const matrixRowsInput = document.getElementById('matrixRows');
        const matrixColsInput = document.getElementById('matrixCols');
        
        if (matrixRowsInput) {
            matrixRowsInput.addEventListener('change', () => this.resizeMatrix());
        }
        
        if (matrixColsInput) {
            matrixColsInput.addEventListener('change', () => this.resizeMatrix());
        }

        // Initialize matrix if size inputs don't exist
        if (!matrixRowsInput || !matrixColsInput) {
            this.currentMatrix = 'A';
            // Use default 3x3 matrix size
        }
    }

    resizeMatrix(defaultRows = 3, defaultCols = 3) {
        const rowsInput = document.getElementById('matrixRows');
        const colsInput = document.getElementById('matrixCols');
        
        let rows = defaultRows;
        let cols = defaultCols;
        
        if (rowsInput && colsInput) {
            rows = parseInt(rowsInput.value) || defaultRows;
            cols = parseInt(colsInput.value) || defaultCols;
        }
        
        if (rows < 1 || rows > 5 || cols < 1 || cols > 5) {
            this.showError('Rozmiar macierzy musi być między 1x1 a 5x5');
            return;
        }

        // Create matrix A
        this.createMatrixInput('A', rows, cols);
        
        this.updateMatrixInfo();
    }

    createMatrixInput(matrixId, rows, cols) {
        const container = document.getElementById(`matrixInput${matrixId}`);
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any';
                input.className = 'matrix-cell';
                input.dataset.matrix = matrixId;
                input.dataset.row = i;
                input.dataset.col = j;
                input.placeholder = `${i+1},${j+1}`;
                input.addEventListener('input', () => this.updateMatrix(matrixId));
                container.appendChild(input);
            }
        }
    }

    updateMatrix(matrixId) {
        const inputs = document.querySelectorAll(`input[data-matrix="${matrixId}"]`);
        const rows = parseInt(document.getElementById('matrixRows').value);
        const cols = parseInt(document.getElementById('matrixCols').value);
        
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                const input = document.querySelector(`input[data-matrix="${matrixId}"][data-row="${i}"][data-col="${j}"]`);
                matrix[i][j] = parseFloat(input.value) || 0;
            }
        }
        
        this.matrices[matrixId] = matrix;
        this.updateMatrixInfo();
    }

    fillMatrix(type) {
        const rows = parseInt(document.getElementById('matrixRows').value);
        const cols = parseInt(document.getElementById('matrixCols').value);
        const matrixId = this.currentMatrix;
        
        const inputs = document.querySelectorAll(`input[data-matrix="${matrixId}"]`);
        
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            
            switch (type) {
                case 'random':
                    input.value = (Math.random() * 20 - 10).toFixed(2);
                    break;
                case 'identity':
                    input.value = (row === col) ? '1' : '0';
                    break;
                case 'zero':
                    input.value = '0';
                    break;
            }
        });
        
        this.updateMatrix(matrixId);
    }

    clearMatrix() {
        const matrixId = this.currentMatrix;
        const inputs = document.querySelectorAll(`input[data-matrix="${matrixId}"]`);
        
        inputs.forEach(input => {
            input.value = '';
        });
        
        this.updateMatrix(matrixId);
    }

    performOperation(operation) {
        try {
            let result;
            
            switch (operation) {
                case 'add':
                    result = this.addMatrices();
                    break;
                case 'subtract':
                    result = this.subtractMatrices();
                    break;
                case 'multiply':
                    result = this.multiplyMatrices();
                    break;
                case 'scalar':
                    this.showScalarInput();
                    return;
                case 'determinant':
                    result = this.calculateDeterminant();
                    break;
                case 'transpose':
                    result = this.transposeMatrix();
                    break;
                case 'trace':
                    result = this.calculateTrace();
                    break;
                case 'rank':
                    result = this.calculateRank();
                    break;
                case 'inverse':
                    result = this.calculateInverse();
                    break;
                case 'eigenvalues':
                    result = this.calculateEigenvalues();
                    break;
                case 'rref':
                    result = this.calculateRREF();
                    break;
                case 'lup':
                    result = this.calculateLUP();
                    break;
            }
            
            if (result) {
                this.displayResult(result);
                this.addToHistory(result);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    addMatrices() {
        if (!this.matrices.A || !this.matrices.B) {
            throw new Error('Obie macierze muszą być wypełnione');
        }
        
        if (!this.matricesHaveSameDimensions()) {
            throw new Error('Macierze muszą mieć te same wymiary');
        }
        
        const result = this.matrices.A.map((row, i) => 
            row.map((val, j) => val + this.matrices.B[i][j])
        );
        
        return {
            operation: 'Dodawanie macierzy',
            formula: 'A + B',
            result: result,
            type: 'matrix'
        };
    }

    subtractMatrices() {
        if (!this.matrices.A || !this.matrices.B) {
            throw new Error('Obie macierze muszą być wypełnione');
        }
        
        if (!this.matricesHaveSameDimensions()) {
            throw new Error('Macierze muszą mieć te same wymiary');
        }
        
        const result = this.matrices.A.map((row, i) => 
            row.map((val, j) => val - this.matrices.B[i][j])
        );
        
        return {
            operation: 'Odejmowanie macierzy',
            formula: 'A - B',
            result: result,
            type: 'matrix'
        };
    }

    multiplyMatrices() {
        if (!this.matrices.A || !this.matrices.B) {
            throw new Error('Obie macierze muszą być wypełnione');
        }
        
        const aRows = this.matrices.A.length;
        const aCols = this.matrices.A[0].length;
        const bRows = this.matrices.B.length;
        const bCols = this.matrices.B[0].length;
        
        if (aCols !== bRows) {
            throw new Error(`Nie można pomnożyć macierzy ${aRows}×${aCols} przez ${bRows}×${bCols}`);
        }
        
        const result = [];
        for (let i = 0; i < aRows; i++) {
            result[i] = [];
            for (let j = 0; j < bCols; j++) {
                let sum = 0;
                for (let k = 0; k < aCols; k++) {
                    sum += this.matrices.A[i][k] * this.matrices.B[k][j];
                }
                result[i][j] = sum;
            }
        }
        
        return {
            operation: 'Mnożenie macierzy',
            formula: 'A × B',
            result: result,
            type: 'matrix'
        };
    }

    showScalarInput() {
        document.getElementById('scalarInput').classList.remove('hidden');
    }

    applyScalarOperation() {
        const scalarValue = parseFloat(document.getElementById('scalarValue').value);
        
        if (isNaN(scalarValue)) {
            this.showError('Wprowadź prawidłową wartość skalara');
            return;
        }
        
        if (!this.matrices.A) {
            this.showError('Macierz A musi być wypełniona');
            return;
        }
        
        const result = this.matrices.A.map(row => 
            row.map(val => val * scalarValue)
        );
        
        const operationResult = {
            operation: 'Mnożenie przez skalar',
            formula: `${scalarValue} × A`,
            result: result,
            type: 'matrix'
        };
        
        this.displayResult(operationResult);
        this.addToHistory(operationResult);
        
        document.getElementById('scalarInput').classList.add('hidden');
        document.getElementById('scalarValue').value = '';
    }

    calculateDeterminant() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        if (matrix.length !== matrix[0].length) {
            throw new Error('Wyznacznik można obliczyć tylko dla macierzy kwadratowych');
        }
        
        const det = this.determinant(matrix);
        
        return {
            operation: 'Wyznacznik macierzy',
            formula: 'det(A)',
            result: det,
            type: 'scalar',
            interpretation: this.interpretDeterminant(det)
        };
    }

    determinant(matrix) {
        const n = matrix.length;
        
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        // For larger matrices, use LU decomposition
        const lu = this.luDecomposition(matrix);
        if (!lu) return 0;
        
        let det = lu.permutationParity;
        for (let i = 0; i < n; i++) {
            det *= lu.L[i][i] * lu.U[i][i];
        }
        
        return det;
    }

    transposeMatrix() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        const result = matrix[0].map((_, colIndex) => 
            matrix.map(row => row[colIndex])
        );
        
        return {
            operation: 'Transpozycja macierzy',
            formula: 'A^T',
            result: result,
            type: 'matrix'
        };
    }

    calculateTrace() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        if (matrix.length !== matrix[0].length) {
            throw new Error('Ślad można obliczyć tylko dla macierzy kwadratowych');
        }
        
        const trace = matrix.reduce((sum, row, i) => sum + row[i], 0);
        
        return {
            operation: 'Ślad macierzy',
            formula: 'tr(A)',
            result: trace,
            type: 'scalar',
            interpretation: `Suma elementów na głównej przekątnej`
        };
    }

    calculateRank() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        const rref = this.rowReducedEchelonForm(this.copyMatrix(matrix));
        let rank = 0;
        
        for (let i = 0; i < rref.length; i++) {
            const hasNonZero = rref[i].some(val => Math.abs(val) > 1e-10);
            if (hasNonZero) rank++;
        }
        
        return {
            operation: 'Rząd macierzy',
            formula: 'rank(A)',
            result: rank,
            type: 'scalar',
            interpretation: `Liczba liniowo niezależnych wierszy/kolumn`
        };
    }

    calculateInverse() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        if (matrix.length !== matrix[0].length) {
            throw new Error('Odwrotność można obliczyć tylko dla macierzy kwadratowych');
        }
        
        const det = this.determinant(matrix);
        if (Math.abs(det) < 1e-10) {
            throw new Error('Macierz jest osobliwa (wyznacznik = 0)');
        }
        
        const inverse = this.matrixInverse(matrix);
        
        return {
            operation: 'Macierz odwrotna',
            formula: 'A^(-1)',
            result: inverse,
            type: 'matrix',
            verification: `A × A^(-1) = I`
        };
    }

    calculateEigenvalues() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        if (matrix.length !== matrix[0].length) {
            throw new Error('Wartości własne można obliczyć tylko dla macierzy kwadratowych');
        }
        
        if (matrix.length > 3) {
            throw new Error('Obliczanie wartości własnych obsługiwane tylko dla macierzy do 3×3');
        }
        
        const eigenvalues = this.eigenvalues(matrix);
        
        return {
            operation: 'Wartości własne',
            formula: 'λ(A)',
            result: eigenvalues,
            type: 'eigenvalues',
            interpretation: 'Wartości λ dla których det(A - λI) = 0'
        };
    }

    calculateRREF() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        const rref = this.rowReducedEchelonForm(this.copyMatrix(matrix));
        
        return {
            operation: 'Postać kanoniczna schodkowa',
            formula: 'RREF(A)',
            result: rref,
            type: 'matrix',
            interpretation: 'Macierz po operacjach elementarnych na wierszach'
        };
    }

    calculateLUP() {
        const matrix = this.matrices.A;
        if (!matrix) {
            throw new Error('Macierz A musi być wypełniona');
        }
        
        if (matrix.length !== matrix[0].length) {
            throw new Error('Rozkład LUP dostępny tylko dla macierzy kwadratowych');
        }
        
        const lup = this.luDecomposition(matrix);
        if (!lup) {
            throw new Error('Nie można przeprowadzić rozkładu LUP');
        }
        
        return {
            operation: 'Rozkład LUP',
            formula: 'PA = LU',
            result: lup,
            type: 'lup',
            interpretation: 'L - dolna trójkątna, U - górna trójkątna, P - permutacyjna'
        };
    }

    // Helper methods for matrix operations
    copyMatrix(matrix) {
        return matrix.map(row => [...row]);
    }

    matricesHaveSameDimensions() {
        return this.matrices.A.length === this.matrices.B.length &&
               this.matrices.A[0].length === this.matrices.B[0].length;
    }

    rowReducedEchelonForm(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        let currentRow = 0;
        
        for (let col = 0; col < cols && currentRow < rows; col++) {
            // Find pivot
            let pivotRow = currentRow;
            for (let row = currentRow + 1; row < rows; row++) {
                if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivotRow][col])) {
                    pivotRow = row;
                }
            }
            
            if (Math.abs(matrix[pivotRow][col]) < 1e-10) continue;
            
            // Swap rows
            if (pivotRow !== currentRow) {
                [matrix[currentRow], matrix[pivotRow]] = [matrix[pivotRow], matrix[currentRow]];
            }
            
            // Scale pivot row
            const pivot = matrix[currentRow][col];
            for (let j = 0; j < cols; j++) {
                matrix[currentRow][j] /= pivot;
            }
            
            // Eliminate column
            for (let i = 0; i < rows; i++) {
                if (i !== currentRow && Math.abs(matrix[i][col]) > 1e-10) {
                    const factor = matrix[i][col];
                    for (let j = 0; j < cols; j++) {
                        matrix[i][j] -= factor * matrix[currentRow][j];
                    }
                }
            }
            
            currentRow++;
        }
        
        return matrix;
    }

    luDecomposition(matrix) {
        const n = matrix.length;
        const L = Array(n).fill().map(() => Array(n).fill(0));
        const U = this.copyMatrix(matrix);
        const P = Array(n).fill().map((_, i) => i);
        let permutationParity = 1;
        
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(U[k][i]) > Math.abs(U[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            if (Math.abs(U[maxRow][i]) < 1e-10) {
                return null; // Singular matrix
            }
            
            // Swap rows
            if (maxRow !== i) {
                [U[i], U[maxRow]] = [U[maxRow], U[i]];
                [P[i], P[maxRow]] = [P[maxRow], P[i]];
                permutationParity *= -1;
            }
            
            // Elimination
            for (let k = i + 1; k < n; k++) {
                L[k][i] = U[k][i] / U[i][i];
                for (let j = i; j < n; j++) {
                    U[k][j] -= L[k][i] * U[i][j];
                }
            }
            
            L[i][i] = 1;
        }
        
        return { L, U, P, permutationParity };
    }

    matrixInverse(matrix) {
        const n = matrix.length;
        const augmented = matrix.map((row, i) => [
            ...row,
            ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
        ]);
        
        const rref = this.rowReducedEchelonForm(augmented);
        
        return rref.map(row => row.slice(n));
    }

    eigenvalues(matrix) {
        const n = matrix.length;
        
        if (n === 1) {
            return [matrix[0][0]];
        }
        
        if (n === 2) {
            const a = matrix[0][0];
            const b = matrix[0][1];
            const c = matrix[1][0];
            const d = matrix[1][1];
            
            const trace = a + d;
            const det = a * d - b * c;
            const discriminant = trace * trace - 4 * det;
            
            if (discriminant >= 0) {
                const sqrt_disc = Math.sqrt(discriminant);
                return [
                    (trace + sqrt_disc) / 2,
                    (trace - sqrt_disc) / 2
                ];
            } else {
                const real = trace / 2;
                const imag = Math.sqrt(-discriminant) / 2;
                return [
                    { real, imag },
                    { real, imag: -imag }
                ];
            }
        }
        
        // For 3x3, use approximate numerical method
        return this.numericalEigenvalues(matrix);
    }

    numericalEigenvalues(matrix) {
        // Simplified power iteration for dominant eigenvalue
        // This is a basic implementation - real applications would use QR algorithm
        const n = matrix.length;
        let v = Array(n).fill(1);
        
        for (let iter = 0; iter < 100; iter++) {
            const Av = this.matrixVectorMultiply(matrix, v);
            const norm = Math.sqrt(Av.reduce((sum, val) => sum + val * val, 0));
            v = Av.map(val => val / norm);
        }
        
        const Av = this.matrixVectorMultiply(matrix, v);
        const eigenvalue = Av.reduce((sum, val, i) => sum + val * v[i], 0);
        
        return [eigenvalue]; // Only dominant eigenvalue
    }

    matrixVectorMultiply(matrix, vector) {
        return matrix.map(row => 
            row.reduce((sum, val, j) => sum + val * vector[j], 0)
        );
    }

    interpretDeterminant(det) {
        if (Math.abs(det) < 1e-10) {
            return 'Macierz jest osobliwa (nie ma odwrotności)';
        } else if (det > 0) {
            return 'Macierz zachowuje orientację';
        } else {
            return 'Macierz zmienia orientację';
        }
    }

    displayResult(result) {
        const container = document.getElementById('resultsSection');
        
        let resultHTML = `
            <div class="matrix-result">
                <div class="result-header">
                    <h3>${result.operation}</h3>
                    <span class="formula">${result.formula}</span>
                </div>
                <div class="result-content">
        `;
        
        switch (result.type) {
            case 'matrix':
                resultHTML += this.formatMatrixResult(result.result);
                break;
            case 'scalar':
                resultHTML += `<div class="scalar-result">${result.result.toFixed(6)}</div>`;
                break;
            case 'eigenvalues':
                resultHTML += this.formatEigenvaluesResult(result.result);
                break;
            case 'lup':
                resultHTML += this.formatLUPResult(result.result);
                break;
        }
        
        if (result.interpretation) {
            resultHTML += `<div class="result-interpretation">${result.interpretation}</div>`;
        }
        
        if (result.verification) {
            resultHTML += `<div class="result-verification">${result.verification}</div>`;
        }
        
        resultHTML += `</div></div>`;
        
        container.innerHTML = resultHTML;
    }

    formatMatrixResult(matrix) {
        return `
            <div class="matrix-display">
                ${matrix.map(row => 
                    `<div class="matrix-row">
                        ${row.map(val => `<span class="matrix-element">${val.toFixed(4)}</span>`).join('')}
                    </div>`
                ).join('')}
            </div>
        `;
    }

    formatEigenvaluesResult(eigenvalues) {
        return `
            <div class="eigenvalues-result">
                ${eigenvalues.map(val => {
                    if (typeof val === 'object') {
                        return `<div class="eigenvalue complex">${val.real.toFixed(4)} ${val.imag >= 0 ? '+' : ''}${val.imag.toFixed(4)}i</div>`;
                    } else {
                        return `<div class="eigenvalue real">${val.toFixed(4)}</div>`;
                    }
                }).join('')}
            </div>
        `;
    }

    formatLUPResult(lup) {
        return `
            <div class="lup-result">
                <div class="lup-matrix">
                    <h4>Macierz L:</h4>
                    ${this.formatMatrixResult(lup.L)}
                </div>
                <div class="lup-matrix">
                    <h4>Macierz U:</h4>
                    ${this.formatMatrixResult(lup.U)}
                </div>
                <div class="lup-info">
                    <p>Permutacja: [${lup.P.join(', ')}]</p>
                </div>
            </div>
        `;
    }

    updateMatrixInfo() {
        const container = document.getElementById('matrixInfo');
        let html = '';
        
        ['A', 'B'].forEach(matrixId => {
            const matrix = this.matrices[matrixId];
            if (matrix) {
                const rows = matrix.length;
                const cols = matrix[0].length;
                const isSquare = rows === cols;
                
                html += `
                    <div class="matrix-info-card">
                        <h4>Macierz ${matrixId}</h4>
                        <div class="info-item">Wymiary: ${rows}×${cols}</div>
                        <div class="info-item">Typ: ${isSquare ? 'Kwadratowa' : 'Prostokątna'}</div>
                        ${isSquare ? `<div class="info-item">Wyznacznik: ${this.determinant(matrix).toFixed(4)}</div>` : ''}
                    </div>
                `;
            }
        });
        
        container.innerHTML = html || '<div class="no-info">Wprowadź dane do macierzy</div>';
    }

    addToHistory(result) {
        this.results.unshift(result);
        if (this.results.length > 5) {
            this.results.pop();
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const container = document.getElementById('historyList');
        
        if (this.results.length === 0) {
            container.innerHTML = '<div class="no-history">Brak poprzednich obliczeń</div>';
            return;
        }
        
        container.innerHTML = this.results.map(result => `
            <div class="history-item">
                <div class="history-operation">${result.operation}</div>
                <div class="history-formula">${result.formula}</div>
            </div>
        `).join('');
    }

    clearHistory() {
        this.results = [];
        this.updateHistoryDisplay();
    }

    createMatrixGrid(matrixId, rows, cols) {
        const container = document.getElementById(`enhancedMatrix${matrixId}Grid`);
        if (!container) return;

        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-cell';
                input.id = `enhanced_cell_${matrixId}_${i}_${j}`;
                input.placeholder = `${i+1},${j+1}`;
                input.step = 'any';
                input.value = (i === j) ? '1' : '0'; // Identity matrix by default
                container.appendChild(input);
            }
        }
        
        this.matrices[matrixId] = { rows, cols };
    }

    performOperation() {
        if (!this.currentOperation) {
            this.showError('Wybierz operację');
            return;
        }

        try {
            const matrixA = this.getMatrixValues('A');
            let result;

            switch (this.currentOperation) {
                case 'eigenvalues':
                    result = this.calculateEigenvalues(matrixA);
                    break;
                case 'eigenvectors':
                    result = this.calculateEigenvectors(matrixA);
                    break;
                case 'lup':
                    result = this.lupDecomposition(matrixA);
                    break;
                case 'qr':
                    result = this.qrDecomposition(matrixA);
                    break;
                case 'svd':
                    result = this.svdDecomposition(matrixA);
                    break;
                case 'rref':
                    result = this.rref(matrixA);
                    break;
                case 'rank':
                    result = this.calculateRank(matrixA);
                    break;
                case 'trace':
                    result = this.calculateTrace(matrixA);
                    break;
                case 'norm':
                    result = this.calculateNorm(matrixA);
                    break;
                default:
                    throw new Error('Nieznana operacja');
            }

            this.displayResult(result);
        } catch (error) {
            this.showError(error.message);
        }
    }

    getMatrixValues(matrixId) {
        const matrix = this.matrices[matrixId];
        if (!matrix) throw new Error(`Macierz ${matrixId} nie istnieje`);

        const values = [];
        for (let i = 0; i < matrix.rows; i++) {
            const row = [];
            for (let j = 0; j < matrix.cols; j++) {
                const input = document.getElementById(`enhanced_cell_${matrixId}_${i}_${j}`);
                const value = parseFloat(input.value) || 0;
                row.push(value);
            }
            values.push(row);
        }
        return values;
    }

    calculateEigenvalues(matrix) {
        // Simplified eigenvalue calculation for 2x2 matrices
        if (matrix.length === 2 && matrix[0].length === 2) {
            const a = matrix[0][0];
            const b = matrix[0][1];
            const c = matrix[1][0];
            const d = matrix[1][1];
            
            const trace = a + d;
            const det = a * d - b * c;
            const discriminant = trace * trace - 4 * det;
            
            if (discriminant >= 0) {
                const sqrt = Math.sqrt(discriminant);
                return {
                    eigenvalues: [
                        (trace + sqrt) / 2,
                        (trace - sqrt) / 2
                    ],
                    type: 'real'
                };
            } else {
                const real = trace / 2;
                const imag = Math.sqrt(-discriminant) / 2;
                return {
                    eigenvalues: [
                        { real, imag },
                        { real, imag: -imag }
                    ],
                    type: 'complex'
                };
            }
        }
        throw new Error('Obliczanie wartości własnych jest dostępne tylko dla macierzy 2x2');
    }

    calculateTrace(matrix) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('Ślad można obliczyć tylko dla macierzy kwadratowych');
        }
        
        let trace = 0;
        for (let i = 0; i < matrix.length; i++) {
            trace += matrix[i][i];
        }
        return { trace, description: 'Suma elementów na głównej przekątnej' };
    }

    calculateRank(matrix) {
        // Simple rank calculation using row reduction
        const m = matrix.map(row => [...row]); // Copy matrix
        let rank = 0;
        const rows = m.length;
        const cols = m[0].length;
        
        for (let col = 0; col < cols && rank < rows; col++) {
            // Find pivot
            let pivot = -1;
            for (let row = rank; row < rows; row++) {
                if (Math.abs(m[row][col]) > 1e-10) {
                    pivot = row;
                    break;
                }
            }
            
            if (pivot === -1) continue;
            
            // Swap rows
            if (pivot !== rank) {
                [m[rank], m[pivot]] = [m[pivot], m[rank]];
            }
            
            // Eliminate
            for (let row = 0; row < rows; row++) {
                if (row !== rank && Math.abs(m[row][col]) > 1e-10) {
                    const factor = m[row][col] / m[rank][col];
                    for (let c = 0; c < cols; c++) {
                        m[row][c] -= factor * m[rank][c];
                    }
                }
            }
            rank++;
        }
        
        return { rank, description: 'Liczba liniowo niezależnych wierszy/kolumn' };
    }

    calculateNorm(matrix) {
        // Frobenius norm
        let sum = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                sum += matrix[i][j] * matrix[i][j];
            }
        }
        return { 
            norm: Math.sqrt(sum), 
            type: 'Frobenius',
            description: 'Norma Frobeniusa (pierwiastek z sumy kwadratów elementów)'
        };
    }

    // RREF (Reduced Row Echelon Form)
    rref(matrix) {
        const result = matrix.map(row => [...row]);
        const rows = result.length;
        const cols = result[0].length;
        
        let pivot = 0;
        
        for (let col = 0; col < cols && pivot < rows; col++) {
            // Find pivot row
            let maxRow = pivot;
            for (let row = pivot + 1; row < rows; row++) {
                if (Math.abs(result[row][col]) > Math.abs(result[maxRow][col])) {
                    maxRow = row;
                }
            }
            
            if (Math.abs(result[maxRow][col]) < 1e-10) {
                continue; // Skip this column
            }
            
            // Swap rows
            if (maxRow !== pivot) {
                [result[pivot], result[maxRow]] = [result[maxRow], result[pivot]];
            }
            
            // Scale pivot row
            const pivotValue = result[pivot][col];
            for (let j = 0; j < cols; j++) {
                result[pivot][j] /= pivotValue;
            }
            
            // Eliminate column
            for (let row = 0; row < rows; row++) {
                if (row !== pivot) {
                    const factor = result[row][col];
                    for (let j = 0; j < cols; j++) {
                        result[row][j] -= factor * result[pivot][j];
                    }
                }
            }
            
            pivot++;
        }
        
        // Clean up near-zero values
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (Math.abs(result[i][j]) < 1e-10) {
                    result[i][j] = 0;
                }
            }
        }
        
        return result;
    }
    
    // QR Decomposition (simplified version)
    qrDecomposition(matrix) {
        const m = matrix.length;
        const n = matrix[0].length;
        
        // Copy input matrix
        const A = matrix.map(row => [...row]);
        const Q = Array(m).fill().map(() => Array(m).fill(0));
        const R = Array(m).fill().map(() => Array(n).fill(0));
        
        // Initialize Q as identity matrix
        for (let i = 0; i < m; i++) {
            Q[i][i] = 1;
        }
        
        // Gram-Schmidt process
        for (let k = 0; k < Math.min(m-1, n); k++) {
            // Calculate Householder vector
            let norm = 0;
            for (let i = k; i < m; i++) {
                norm += A[i][k] * A[i][k];
            }
            norm = Math.sqrt(norm);
            
            if (norm < 1e-10) continue;
            
            const v = Array(m).fill(0);
            v[k] = A[k][k] + (A[k][k] >= 0 ? norm : -norm);
            for (let i = k+1; i < m; i++) {
                v[i] = A[i][k];
            }
            
            // Normalize v
            let vNorm = 0;
            for (let i = k; i < m; i++) {
                vNorm += v[i] * v[i];
            }
            if (vNorm < 1e-10) continue;
            
            for (let i = k; i < m; i++) {
                v[i] /= Math.sqrt(vNorm);
            }
            
            // Apply Householder transformation to A
            for (let j = k; j < n; j++) {
                let dot = 0;
                for (let i = k; i < m; i++) {
                    dot += v[i] * A[i][j];
                }
                for (let i = k; i < m; i++) {
                    A[i][j] -= 2 * dot * v[i];
                }
            }
        }
        
        // Extract R (upper triangular part of A)
        for (let i = 0; i < Math.min(m, n); i++) {
            for (let j = i; j < n; j++) {
                R[i][j] = A[i][j];
            }
        }
        
        return { Q: Q, R: R };
    }
    
    // SVD Decomposition (simplified version)
    svdDecomposition(matrix) {
        // This is a simplified version - full SVD is quite complex
        // We'll compute eigenvalues of A^T * A for singular values
        const m = matrix.length;
        const n = matrix[0].length;
        
        // Compute A^T * A
        const AT = this.transpose(matrix);
        const ATA = this.multiply(AT, matrix);
        
        // Compute eigenvalues (singular values squared)
        const eigenvalues = this.calculateEigenvalues(ATA);
        const singularValues = eigenvalues.map(val => Math.sqrt(Math.abs(val))).sort((a, b) => b - a);
        
        return {
            singularValues: singularValues,
            note: 'Uproszczona wersja SVD - pokazuje tylko wartości osobliwe'
        };
    }
}

// Enhanced matrix calculator will be initialized when needed by the main app

// Size menu functions for enhanced matrix calculator
function toggleSizeMenuEnhanced(matrixId) {
    const sizeMenu = document.getElementById(`enhancedSizeMenu${matrixId}`);
    const resizeIcon = sizeMenu.previousElementSibling;
    
    if (!sizeMenu) return;
    
    // Close any other open size menus
    document.querySelectorAll('#matrixCalculatorApp .size-menu').forEach(menu => {
        if (menu.id !== `enhancedSizeMenu${matrixId}` && menu.classList.contains('open')) {
            menu.classList.add('closing');
            menu.classList.remove('open');
            setTimeout(() => {
                menu.classList.remove('closing');
                menu.style.display = 'none';
            }, 600);
        }
    });
    
    if (sizeMenu.classList.contains('open')) {
        // Close menu
        sizeMenu.classList.add('closing');
        sizeMenu.classList.remove('open');
        
        setTimeout(() => {
            sizeMenu.classList.remove('closing');
            sizeMenu.style.display = 'none';
        }, 600);
    } else {
        // Open menu - position it near the resize icon
        const iconRect = resizeIcon.getBoundingClientRect();
        sizeMenu.style.display = 'flex';
        sizeMenu.style.left = (iconRect.left - 85) + 'px';
        sizeMenu.style.top = (iconRect.bottom + 5) + 'px';
        
        // Add animation delay to size options
        sizeMenu.querySelectorAll('.size-option').forEach((option, index) => {
            option.style.setProperty('--i', index);
        });
        
        requestAnimationFrame(() => {
            sizeMenu.classList.add('open');
        });
    }
}

function setMatrixSizeEnhanced(matrixId, rows, cols) {
    if (window.enhancedMatrixCalculator) {
        window.enhancedMatrixCalculator.createMatrixGrid(matrixId, rows, cols);
    }
    
    // Close the menu
    const sizeMenu = document.getElementById(`enhancedSizeMenu${matrixId}`);
    if (sizeMenu) {
        sizeMenu.classList.add('closing');
        sizeMenu.classList.remove('open');
        
        setTimeout(() => {
            sizeMenu.classList.remove('closing');
            sizeMenu.style.display = 'none';
        }, 600);
    }
}

// Close size menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.size-menu') && !e.target.closest('.resize-icon')) {
        document.querySelectorAll('#matrixCalculatorApp .size-menu.open').forEach(menu => {
            menu.classList.add('closing');
            menu.classList.remove('open');
            setTimeout(() => {
                menu.classList.remove('closing');
                menu.style.display = 'none';
            }, 600);
        });
    }
});
