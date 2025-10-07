let currentOperation = "add";
let currentMethod = "cramer";
let isAdvancedMode = false;

const operationBtn = document.getElementById('operationBtn');
const operationMenu = document.getElementById('operationMenu');
const methodSelector = document.getElementById('methodSelector');
const computeBtn = document.getElementById('computeBtn');
const clearBtn = document.getElementById('clearBtn');
const matrixA = document.getElementById('matrixA');
const matrixB = document.getElementById('matrixB');
const matrixAGrid = document.getElementById('matrixAGrid');
const matrixBGrid = document.getElementById('matrixBGrid');
const sizeMenuA = document.getElementById('sizeMenuA');
const sizeMenuB = document.getElementById('sizeMenuB');
const rowsA = document.getElementById('rowsA');
const colsA = document.getElementById('colsA');
const rowsB = document.getElementById('rowsB');
const colsB = document.getElementById('colsB');
const resultBox = document.getElementById('resultBox');
const solutionBox = document.getElementById('solutionBox');
const matricesContainer = document.getElementById('matricesContainer');
const methodBtn = document.getElementById('methodBtn');
const methodSelectorWrapper = document.querySelector('.method-selector-wrapper');
const matrixModeSwitch = document.getElementById('matrixModeSwitch');
const matrixModeSwitchText = document.getElementById('matrixModeSwitchText');

const basicOperations = [
  { op: 'add', label: 'Dodawanie' },
  { op: 'sub', label: 'Odejmowanie' },
  { op: 'mul', label: 'Mnożenie' },
  { op: 'det', label: 'Wyznacznik' },
  { op: 'inv', label: 'Macierz odwrotna' },
  { op: 'trans', label: 'Transpozycja' },
  { op: 'solve', label: 'Układ równań' }
];

const advancedOperations = [
  { op: 'add', label: 'Dodawanie' },
  { op: 'sub', label: 'Odejmowanie' },
  { op: 'mul', label: 'Mnożenie' },
  { op: 'det', label: 'Wyznacznik' },
  { op: 'inv', label: 'Macierz odwrotna' },
  { op: 'trans', label: 'Transpozycja' },
  { op: 'solve', label: 'Układ równań' },
  { op: 'trace', label: 'Ślad macierzy' },
  { op: 'rank', label: 'Rząd macierzy' },
  { op: 'eig', label: 'Wartości własne' },
  { op: 'power', label: 'Potęga macierzy' }
];

const resizeBtn = document.getElementById('resizeBtn');
const resizeDialog = document.getElementById('resizeDialog');
const resizeRowsA = document.getElementById('resizeRowsA');
const resizeColsA = document.getElementById('resizeColsA');
const resizeRowsB = document.getElementById('resizeRowsB');
const resizeColsB = document.getElementById('resizeColsB');
const acceptResize = document.getElementById('acceptResize');

let currentActiveMatrix = 'A'; // Śledzenie aktualnie aktywnej macierzy

function createMatrix(gridElement, rows, cols) {
    if (!gridElement) throw new Error("Element macierzy nie istnieje!");
    gridElement.innerHTML = '';

    rows = parseInt(rows) || 2;
    cols = parseInt(cols) || 2;
    
    const inputSize = window.innerWidth <= 480 ? 30 : 
                     window.innerWidth <= 768 ? 35 : 40;
    const inputHeight = Math.floor(inputSize * 0.7);
    const fontSize = Math.max(12, inputSize * 0.5);
    
    gridElement.style.gridTemplateColumns = `repeat(${cols}, ${inputSize}px)`;
    gridElement.style.justifyItems = 'center';
    gridElement.style.gap = '5px';
    gridElement.style.width = `${cols * inputSize + (cols - 1) * 5}px`;
    gridElement.style.overflowX = 'visible';
    gridElement.style.maxWidth = 'unset';
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.value = '0';
            input.dataset.row = i;
            input.dataset.col = j;
            input.inputmode = 'decimal';
            
            input.style.width = `${inputSize}px`;
            input.style.height = `${inputHeight}px`;
            input.style.fontSize = `${fontSize}px`;
            input.style.textAlign = 'center';
            input.style.margin = '0 auto';
            input.style.padding = '2px';
            input.style.pointerEvents = 'auto';
            input.style.borderRadius = '5px';
            input.style.border = '1px solid rgba(224, 122, 95, 0.3)';
            input.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            input.style.transition = 'all 0.2s ease';
            
            input.addEventListener('focus', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                this.style.boxShadow = '0 0 0 2px rgba(224, 122, 95, 0.2)';
                if (this.value === '0') this.value = '';
            });
            
            input.addEventListener('blur', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                this.style.boxShadow = 'none';
                if (this.value.trim() === '' || isNaN(this.value)) {
                    this.value = '0';
                }
            });

            input.addEventListener('keydown', function(e) {
                // Obsługa przełączania między macierzami (ALT/CMD + Tab)
                if ((e.altKey || e.metaKey) && e.key === 'Tab') {
                    e.preventDefault();
                    switchToOtherMatrix();
                    return;
                }
                
                // Obsługa przełączania między macierzami (ALT/CMD + Shift + M) - zachowujemy dla kompatybilności
                if ((e.altKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
                    e.preventDefault();
                    switchToOtherMatrix();
                    return;
                }
                
                if (e.key.startsWith('Arrow')) {
                    e.preventDefault();
                    const currentRow = parseInt(this.dataset.row);
                    const currentCol = parseInt(this.dataset.col);
                    let nextRow = currentRow;
                    let nextCol = currentCol;

                    switch (e.key) {
                        case 'ArrowUp':
                            nextRow = Math.max(0, currentRow - 1);
                            break;
                        case 'ArrowDown':
                            nextRow = Math.min(rows - 1, currentRow + 1);
                            break;
                        case 'ArrowLeft':
                            nextCol = Math.max(0, currentCol - 1);
                            break;
                        case 'ArrowRight':
                            nextCol = Math.min(cols - 1, currentCol + 1);
                            break;
                    }

                    const nextInput = gridElement.querySelector(
                        `.matrix-input[data-row="${nextRow}"][data-col="${nextCol}"]`
                    );

                    if (nextInput) {
                        nextInput.focus();
                        nextInput.select();
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    compute();
                }
            });

            // Dodaj event listener do śledzenia aktywnej macierzy
            input.addEventListener('focus', function() {
                // Określ która macierz jest aktywna na podstawie rodzica
                if (this.closest('#matrixAGrid')) {
                    currentActiveMatrix = 'A';
                    highlightActiveMatrix('A');
                } else if (this.closest('#matrixBGrid')) {
                    currentActiveMatrix = 'B';
                    highlightActiveMatrix('B');
                }
            });

            gridElement.appendChild(input);
        }
    }

    // Ustaw zmienną --i dla elementów operation-menu-item
    document.querySelectorAll('.operation-menu-item').forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
}

function setupSizeInputBehavior(inputElement, acceptFunction) {
    inputElement.addEventListener('focus', function() {
        if (this.value === '2') {
            this.value = '';
        }
    });
    
    inputElement.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = '2';
        }
        else if (parseInt(this.value) < 1) {
            this.value = '1';
        } else if (parseInt(this.value) > 10) {
            this.value = '10';
        }
    });

    inputElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            acceptFunction();
        }
    });
}

function getMatrixValues(gridElement) {
    const inputs = gridElement.querySelectorAll('.matrix-input');
    if (inputs.length === 0) throw new Error("Brak pól input w macierzy!");
    const cols = parseInt(gridElement.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] || 1);
    const rows = inputs.length / cols;
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const input = inputs[i * cols + j];
            const value = parseFloat(input.value);
            if (isNaN(value)) {
                input.classList.add('invalid');
                throw new Error(translations[currentLang].matrixCalc.errors.invalid
                    .replace('{r}', i + 1)
                    .replace('{c}', j + 1));
            }
            row.push(value);
        }
        matrix.push(row);
    }

    if (currentOperation === 'solve' && gridElement === matrixBGrid && cols !== 1) {
        throw new Error(translations[currentLang].matrixCalc.errors.solve_dim);
    }

    return matrix;
}

function updateMethodButtons() {
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === currentMethod);
    });
}

function updateMatrixOperator() {
    const operator = document.querySelector('.matrix-operator');
    if (operator) {
        if (window.innerWidth >= 992) {
            operator.style.top = '-15px';
            operator.style.left = '-15px';
            operator.style.right = 'auto';
            operator.style.bottom = 'auto';
            operator.style.transform = 'none';
        } else {
            operator.style.top = '-10px';
            operator.style.left = '50%';
            operator.style.right = 'auto';
            operator.style.bottom = 'auto';
            operator.style.transform = 'translateX(-50%)';
        }
    }
}

function changeOperation(operation) {
    currentOperation = operation;
    if (operationBtn) operationBtn.textContent = translations[currentLang].matrixCalc.operations[operation];
    
    if (solutionBox) {
        solutionBox.classList.toggle('visible', operation === 'solve');
    }

    if (operation === 'solve') {
        methodSelectorWrapper.style.display = 'block';
        if (methodBtn) methodBtn.textContent = translations[currentLang].matrixCalc.methods[currentMethod];
    } else {
        methodSelectorWrapper.style.display = 'none';
        if (methodSelector.classList.contains('open')) {
            methodSelector.classList.remove('open');
            methodSelector.classList.add('closing');
            setTimeout(() => {
                methodSelector.style.display = 'none';
                methodSelector.classList.remove('closing');
            }, 300);
        }
    }

    if (operation !== 'solve') {
        currentMethod = 'cramer';
        updateMethodButtons();
    }

    adjustMatrixB();
    updateUI();
}

function centerMatrices() {
    if (!matricesContainer) return;
    
    const screenWidth = window.innerWidth;
    
    // Usuń skalowanie, które powoduje problemy z pozycjonowaniem
    document.querySelectorAll('.matrix-frame').forEach(frame => {
        frame.style.transform = 'none'; // Usuń skalowanie
        frame.style.margin = '0 auto';
    });
    
    // Zachowaj tylko odstępy dla responsywności
    if (screenWidth >= 1200) {
        matricesContainer.style.gap = '60px';
    } else if (screenWidth >= 768) {
        matricesContainer.style.gap = '40px';
    } else {
        matricesContainer.style.gap = '20px';
    }
}

function adjustMatrixB() {
    if (!matrixB || !matrixAGrid || !matrixBGrid || !rowsB || !colsB) return;
    
    const colsA = parseInt(matrixAGrid.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] || 2);
    const rowsA = matrixAGrid.children.length / colsA || 2;

    if (currentOperation === 'solve') {
        if (parseInt(rowsB.value) !== rowsA || parseInt(colsB.value) !== 1) {
            createMatrix(matrixBGrid, rowsA, 1);
            rowsB.value = rowsA;
            colsB.value = 1;
        }
        colsB.disabled = true;
        matrixB.style.display = 'block';
    } else if (['add', 'sub', 'mul'].includes(currentOperation)) {
        // Przywróć domyślny rozmiar 2x2 jeśli wcześniej była operacja solve
        if (colsB.disabled) {
            createMatrix(matrixBGrid, 2, 2);
            rowsB.value = 2;
            colsB.value = 2;
        }
        colsB.disabled = false;
        matrixB.style.display = 'block';
        
        // Ensure matrices are side by side on desktop
        if (window.innerWidth >= 992) {
            matricesContainer.style.flexDirection = 'row';
            matricesContainer.style.alignItems = 'flex-start';
        }
    } else {
        matrixB.style.display = 'none';
    }
    
    // Update operator position
    updateMatrixOperator();
}

function displayResult(result) {
    if (!resultBox || !solutionBox) return;
    // Clear previous results but keep the default text
    const defaultText = resultBox.querySelector('.default-result-text');
    resultBox.innerHTML = '';
    const newDefaultText = document.createElement('div');
    newDefaultText.className = 'default-result-text';
    newDefaultText.textContent = translations[currentLang].matrixCalc.result_label;
    resultBox.appendChild(newDefaultText);
    solutionBox.innerHTML = '';

    if (Array.isArray(result)) {
        // Remove default text when showing actual results
        resultBox.innerHTML = '';
        
        // Display matrix form in result box
        const pre = document.createElement('pre');
        const matrixString = result.map(row => 
            row.map(val => Number.isInteger(val) ? val.toString() : val.toFixed(4)).join('\t')
        ).join('\n');
        pre.textContent = matrixString;
        
        // Dodanie klasy dla animowanego wyniku w trybie light-mode
        if (!document.body.classList.contains('dark-mode')) {
            pre.classList.add('animated-result-light');
        }
        
        resultBox.appendChild(pre);

        // Display equation form in solution box if solving system
        if (currentOperation === 'solve') {
            solutionBox.classList.add('visible');
            result.forEach(([value], index) => {
                const row = document.createElement('div');
                row.className = 'solution-row';
                
                const variable = document.createElement('span');
                variable.className = 'solution-variable';
                variable.textContent = `x${index + 1} =`;
                
                const val = document.createElement('span');
                val.className = 'solution-value';
                val.textContent = Number.isInteger(value) ? value.toString() : value.toFixed(4);
                
                // Dodanie klasy dla animowanego wyniku w trybie light-mode
                if (!document.body.classList.contains('dark-mode')) {
                    val.classList.add('animated-result-light');
                }
                
                row.appendChild(variable);
                row.appendChild(val);
                solutionBox.appendChild(row);
            });
        } else {
            solutionBox.classList.remove('visible');
        }
    } else {
        // Remove default text when showing actual results
        resultBox.innerHTML = '';
        // Single value result (like determinant)
        const span = document.createElement('span');
        if (result === undefined || result === null || (typeof result === 'number' && isNaN(result))) {
            span.textContent = translations[currentLang]?.matrixCalc?.errors?.no_result || 'Brak wyniku';
            span.style.color = '#e07a5f';
        } else {
            span.textContent = result.toString();
        }
        // Dodanie klasy dla animowanego wyniku w trybie light-mode
        if (!document.body.classList.contains('dark-mode')) {
            span.classList.add('animated-result-light');
        }
        resultBox.appendChild(span);
        solutionBox.classList.remove('visible');
    }
}

function compute() {
    try {
        const A = getMatrixValues(matrixAGrid);
        let B;
        if (["add", "sub", "mul", "solve"].includes(currentOperation)) {
            B = getMatrixValues(matrixBGrid);
        }

        let result;
        switch (currentOperation) {
            case "add":
                if (A.length !== B.length || A[0].length !== B[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim.replace("{op}", "dodawania"));
                }
                result = A.map((row, i) => row.map((val, j) => val + B[i][j]));
                break;
            case "sub":
                if (A.length !== B.length || A[0].length !== B[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim.replace("{op}", "odejmowania"));
                }
                result = A.map((row, i) => row.map((val, j) => val - B[i][j]));
                break;
            case "mul":
                if (A[0].length !== B.length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.mul_dim);
                }
                result = Array(A.length).fill().map((_, i) =>
                    Array(B[0].length).fill().map((_, j) =>
                        Array(A[0].length).fill().reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0)
                    )
                );
                break;
            case "det":
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = determinant(A);
                break;
            case "inv":
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = inverse(A);
                break;
            case "trans":
                result = A[0].map((_, j) => A.map(row => row[j]));
                break;
            case "solve":
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = solveSystem(A, B);
                break;
            case "trace":
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = matrixTrace(A);
                break;
            case "rank":
                result = matrixRank(A);
                break;
            case "eig":
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = eigenvalues(A);
                break;
            case "power":
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                const power = prompt("Podaj potęgę macierzy (liczba całkowita):", "2");
                if (power === null) return;
                const n = parseInt(power);
                if (isNaN(n) || n < 0) {
                    throw new Error("Potęga musi być liczbą całkowitą nieujemną");
                }
                result = matrixPower(A, n);
                break;
        }
        displayResult(result);
    } catch (error) {
        alert(error.message);
    }
}

function matrixTrace(matrix) {
    let sum = 0;
    for (let i = 0; i < Math.min(matrix.length, matrix[0].length); i++) {
        sum += matrix[i][i];
    }
    return sum;
}

function matrixRank(matrix) {
    // Prosta implementacja rzędu macierzy przez eliminację Gaussa
    const m = matrix.length;
    const n = matrix[0].length;
    const mat = matrix.map(row => row.slice());
    let rank = 0;
    let row = 0;
    for (let col = 0; col < n && row < m; col++) {
        let pivot = row;
        for (let i = row + 1; i < m; i++) {
            if (Math.abs(mat[i][col]) > Math.abs(mat[pivot][col])) pivot = i;
        }
        if (Math.abs(mat[pivot][col]) > 1e-10) {
            [mat[row], mat[pivot]] = [mat[pivot], mat[row]];
            for (let i = row + 1; i < m; i++) {
                const factor = mat[i][col] / mat[row][col];
                for (let j = col; j < n; j++) {
                    mat[i][j] -= factor * mat[row][j];
                }
            }
            row++;
            rank++;
        }
    }
    return rank;
}

function determinant(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error(translations[currentLang].matrixCalc.errors.square);
    }
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < matrix[0].length; j++) {
        det += matrix[0][j] * cofactor(matrix, 0, j);
    }
    return det;
}

function cofactor(matrix, row, col) {
    const subMatrix = matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));
    return ((-1) ** (row + col)) * determinant(subMatrix);
}

function inverse(matrix) {
    const n = matrix.length;
    if (n !== matrix[0].length) {
        throw new Error(translations[currentLang].matrixCalc.errors.square);
    }
    const det = determinant(matrix);
    if (Math.abs(det) < 1e-10) {
        throw new Error(translations[currentLang].matrixCalc.errors.singular);
    }
    
    const adjugate = Array(n).fill().map((_, i) => 
        Array(n).fill().map((_, j) => cofactor(matrix, j, i))
    );
    return adjugate.map(row => row.map(val => val / det));
}

function solveSystem(A, B) {
    switch (currentMethod) {
        case 'cramer':
            return solveWithCramer(A, B);
        case 'gauss':
            return solveWithGauss(A, B);
        case 'gauss_jordan':
            return solveWithGaussJordan(A, B);
        case 'inverse':
            return solveWithInverse(A, B);
        default:
            throw new Error(translations[currentLang].matrixCalc.errors.method_not_implemented);
    }
}

function solveWithCramer(A, B) {
    const detA = determinant(A);
    if (Math.abs(detA) < 1e-10) {
        throw new Error(translations[currentLang].matrixCalc.errors.singular);
    }
    const result = [];
    for (let i = 0; i < A.length; i++) {
        const Ai = A.map((row, j) => row.map((val, k) => k === i ? B[j][0] : val));
        result.push([determinant(Ai) / detA]);
    }
    return result;
}

function solveWithGauss(A, B) {
    // Implementacja eliminacji Gaussa
    const n = A.length;
    const augmented = A.map((row, i) => [...row, B[i][0]]);
    
    // Eliminacja w przód
    for (let i = 0; i < n; i++) {
        // Znajdź wiersz z maksymalnym elementem w kolumnie
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = j;
            }
        }
        
        // Zamień wiersze
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        
        // Jeśli główny element jest zerowy, macierz jest osobliwa
        if (Math.abs(augmented[i][i]) < 1e-10) {
            throw new Error(translations[currentLang].matrixCalc.errors.singular);
        }
        
        // Eliminacja
        for (let j = i + 1; j < n; j++) {
            const factor = augmented[j][i] / augmented[i][i];
            for (let k = i; k < n + 1; k++) {
                augmented[j][k] -= factor * augmented[i][k];
            }
        }
    }
    
    // Podstawienie wsteczne
    const result = Array(n).fill().map(() => [0]);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += augmented[i][j] * result[j][0];
        }
        result[i][0] = (augmented[i][n] - sum) / augmented[i][i];
    }
    
    return result;
}

function solveWithGaussJordan(A, B) {
    // Implementacja eliminacji Gaussa-Jordana
    const n = A.length;
    const augmented = A.map((row, i) => [...row, B[i][0]]);
    
    for (let i = 0; i < n; i++) {
        // Znajdź wiersz z maksymalnym elementem w kolumnie
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = j;
            }
        }
        
        // Zamień wiersze
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        
        // Jeśli główny element jest zerowy, macierz jest osobliwa
        if (Math.abs(augmented[i][i]) < 1e-10) {
            throw new Error(translations[currentLang].matrixCalc.errors.singular);
        }
        
        // Uczyń element diagonalny równym 1
        const divisor = augmented[i][i];
        for (let j = i; j < n + 1; j++) {
            augmented[i][j] /= divisor;
        }
        
        // Wyzeruj pozostałe elementy w kolumnie
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const factor = augmented[j][i];
                for (let k = i; k < n + 1; k++) {
                    augmented[j][k] -= factor * augmented[i][k];
                }
            }
        }
    }
    
    // Wynik znajduje się w ostatniej kolumnie
    return augmented.map(row => [row[n]]);
}

function solveWithInverse(A, B) {
    // Rozwiązanie poprzez macierz odwrotną
    const invA = inverse(A);
    return multiplyMatrices(invA, B);
}

function multiplyMatrices(A, B) {
    // Pomocnicza funkcja do mnożenia macierzy
    const result = Array(A.length).fill().map(() => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < A[0].length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function clearMatrices() {
    matrixAGrid.querySelectorAll('.matrix-input').forEach(input => input.value = '0');
    matrixBGrid.querySelectorAll('.matrix-input').forEach(input => input.value = '0');
    resultBox.innerHTML = '';
    solutionBox.innerHTML = '';
}

function applyResize() {
    const rowsAValue = parseInt(resizeRowsA.value);
    const colsAValue = parseInt(resizeColsA.value);
    const rowsBValue = parseInt(resizeRowsB.value);
    const colsBValue = parseInt(resizeColsB.value);

    if (isNaN(rowsAValue) || isNaN(colsAValue) || rowsAValue < 1 || colsAValue < 1 || 
        rowsAValue > 10 || colsAValue > 10 || isNaN(rowsBValue) || isNaN(colsBValue) || 
        rowsBValue < 1 || colsBValue < 1 || rowsBValue > 10 || colsBValue > 10) {
        alert(translations[currentLang].matrixCalc.errors.size_invalid);
        return;
    }

    rowsA.value = rowsAValue;
    colsA.value = colsAValue;
    rowsB.value = rowsBValue;
    colsB.value = colsBValue;

    createMatrix(matrixAGrid, rowsAValue, colsAValue);
    createMatrix(matrixBGrid, rowsBValue, colsBValue);
    adjustMatrixB();
}

function initializeMatrixCalculator() {
    document.querySelectorAll('.size-menu').forEach(menu => {
        menu.style.display = 'none';
        menu.classList.remove('open');
    });

    createMatrix(matrixAGrid, 2, 2);
    createMatrix(matrixBGrid, 2, 2);
    updateUI();
    centerMatrices();

    const acceptA = document.getElementById('acceptA');
    const acceptB = document.getElementById('acceptB');

    if (rowsA) setupSizeInputBehavior(rowsA, () => {
        const rows = Math.max(1, Math.min(10, parseInt(rowsA.value) || 2));
        const cols = Math.max(1, Math.min(10, parseInt(colsA.value) || 2));
        rowsA.value = rows;
        colsA.value = cols;
        createMatrix(matrixAGrid, rows, cols);
        adjustMatrixB();
        sizeMenuA.style.display = 'none';
    });

    if (colsA) setupSizeInputBehavior(colsA, () => {
        const rows = Math.max(1, Math.min(10, parseInt(rowsA.value) || 2));
        const cols = Math.max(1, Math.min(10, parseInt(colsA.value) || 2));
        rowsA.value = rows;
        colsA.value = cols;
        createMatrix(matrixAGrid, rows, cols);
        adjustMatrixB();
        sizeMenuA.style.display = 'none';
    });

    if (rowsB) setupSizeInputBehavior(rowsB, () => {
        const rows = parseInt(rowsB.value);
        let cols = parseInt(colsB.value);
        
        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1 || rows > 10 || cols > 10) {
            alert(translations[currentLang].matrixCalc.errors.size_invalid);
            return;
        }
        
        if (currentOperation === 'solve') {
            cols = 1;
            colsB.value = 1;
            colsB.disabled = true;
        } else {
            colsB.disabled = false;
        }
        
        createMatrix(matrixBGrid, rows, cols);
        sizeMenuB.style.display = 'none';
        sizeMenuB.classList.remove('open');
        adjustMatrixB();
    });

    if (colsB) setupSizeInputBehavior(colsB, () => {
        const rows = parseInt(rowsB.value);
        let cols = parseInt(colsB.value);
        
        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1 || rows > 10 || cols > 10) {
            alert(translations[currentLang].matrixCalc.errors.size_invalid);
            return;
        }
        
        if (currentOperation === 'solve') {
            cols = 1;
            colsB.value = 1;
            colsB.disabled = true;
        } else {
            colsB.disabled = false;
        }
        
        createMatrix(matrixBGrid, rows, cols);
        sizeMenuB.style.display = 'none';
        sizeMenuB.classList.remove('open');
        adjustMatrixB();
    });

    document.addEventListener('click', (e) => {
        const isSizeMenuAClick = e.target.closest('#sizeMenuA');
        const isSizeMenuBClick = e.target.closest('#sizeMenuB');
        const isResizeIconClick = e.target.classList.contains('resize-icon');
        
        if (!isSizeMenuAClick && !isSizeMenuBClick && !isResizeIconClick) {
            sizeMenuA.style.display = 'none';
            sizeMenuB.style.display = 'none';
            document.querySelectorAll('.size-menu').forEach(menu => {
                menu.classList.remove('open');
            });
        }
    });

    if (resizeRowsA) resizeRowsA.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') applyResize();
    });
    if (resizeColsA) resizeColsA.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') applyResize();
    });
    if (resizeRowsB) resizeRowsB.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') applyResize();
    });
    if (resizeColsB) resizeColsB.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') applyResize();
    });

    if (operationBtn) operationBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = operationMenu.classList.contains('open');
    
    // Zamknij wszystkie inne otwarte menu
    document.querySelectorAll('.operation-menu.open').forEach(menu => {
        if (menu !== operationMenu) {
            menu.classList.remove('open');
            menu.classList.add('closing');
            setTimeout(() => {
                menu.style.display = 'none';
                menu.classList.remove('closing');
            }, 300);
        }
    });
    
    if (isOpen) {
        operationMenu.classList.remove('open');
        operationMenu.classList.add('closing');
        setTimeout(() => {
            operationMenu.style.display = 'none';
            operationMenu.classList.remove('closing');
        }, 300);
    } else {
        operationMenu.style.display = 'block';
        // Krótkie opóźnienie aby umożliwić przejście CSS
        requestAnimationFrame(() => {
            operationMenu.classList.add('open');
        });
    }
    });

    // Zastąp obsługę kliknięcia w menu operacji:
    if (operationMenu) operationMenu.addEventListener('click', e => {
      if (e.target.classList.contains('operation-menu-item')) {
        const op = e.target.dataset.op;
        changeOperation(op);
        operationBtn.textContent = e.target.textContent; // zawsze aktualizuj napis
        operationMenu.classList.remove('open');
        operationMenu.classList.add('closing');
        setTimeout(() => {
          operationMenu.style.display = 'none';
          operationMenu.classList.remove('closing');
        }, 300);
      }
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
    const isOperationMenuClick = e.target.closest('.operation-menu');
    const isOperationBtnClick = e.target === operationBtn || e.target.closest('#operationBtn');
    
    if (!isOperationMenuClick && !isOperationBtnClick && operationMenu) {
        if (operationMenu.classList.contains('open')) {
            operationMenu.classList.remove('open');
            operationMenu.classList.add('closing');
            setTimeout(() => {
                operationMenu.style.display = 'none';
                operationMenu.classList.remove('closing');
            }, 300);
        }
    }
        });

    document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && operationMenu.classList.contains('open')) {
        operationMenu.classList.remove('open');
        operationMenu.classList.add('closing');
        setTimeout(() => {
            operationMenu.style.display = 'none';
            operationMenu.classList.remove('closing');
        }, 300);
    }
    });

    // Dodaj obsługę przycisku metod
    if (methodBtn) {
    methodBtn.addEventListener('click', e => {
        e.stopPropagation();
        methodBtn.textContent = translations[currentLang].matrixCalc.methods[currentMethod];
        const isOpen = methodSelector.classList.contains('open');
        
        // Zamknij menu operacji jeśli jest otwarte
        if (operationMenu.classList.contains('open')) {
            operationMenu.classList.remove('open');
            operationMenu.classList.add('closing');
            setTimeout(() => {
                operationMenu.style.display = 'none';
                operationMenu.classList.remove('closing');
            }, 300);
        }
        
        if (isOpen) {
            methodSelector.classList.remove('open');
            methodSelector.classList.add('closing');
            setTimeout(() => {
                methodSelector.style.display = 'none';
                methodSelector.classList.remove('closing');
            }, 300);
        } else {
            methodSelector.style.display = 'flex';
            requestAnimationFrame(() => {
                methodSelector.classList.add('open');
            });
        }
    });
    }

    // Dodaj obsługę kliknięcia w elementy menu metod
    if (methodSelector) {
    methodSelector.addEventListener('click', e => {
        if (e.target.classList.contains('method-btn')) {
            currentMethod = e.target.dataset.method;
            updateMethodButtons();
            methodBtn.textContent = translations[currentLang].matrixCalc.methods[currentMethod];
            methodSelector.classList.remove('open');
            methodSelector.classList.add('closing');
            setTimeout(() => {
                methodSelector.style.display = 'none';
                methodSelector.classList.remove('closing');
            }, 300);
        }
        e.stopPropagation();
    });
    }

    // Dodaj zamykanie menu metod przy kliknięciu poza
    document.addEventListener('click', (e) => {
    const isMethodMenuClick = e.target.closest('.method-selector');
    const isMethodBtnClick = e.target === methodBtn || e.target.closest('#methodBtn');
    
    if (!isMethodMenuClick && !isMethodBtnClick && methodSelector) {
        if (methodSelector.classList.contains('open')) {
            methodSelector.classList.remove('open');
            methodSelector.classList.add('closing');
            setTimeout(() => {
                methodSelector.style.display = 'none';
                methodSelector.classList.remove('closing');
            }, 300);
        }
    }
    });

    // Dodaj obsługę klawisza Escape
    document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (methodSelector.classList.contains('open')) {
            methodSelector.classList.remove('open');
            methodSelector.classList.add('closing');
            setTimeout(() => {
                methodSelector.style.display = 'none';
                methodSelector.classList.remove('closing');
            }, 300);
        }
    }
    });

    if (computeBtn) {
        computeBtn.replaceWith(computeBtn.cloneNode(true)); // Remove existing listeners
        const newComputeBtn = document.getElementById('computeBtn');
        newComputeBtn.addEventListener('click', compute);
        newComputeBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                compute();
            }
        });
    }

    if (clearBtn) {
        clearBtn.replaceWith(clearBtn.cloneNode(true)); // Remove existing listeners
        const newClearBtn = document.getElementById('clearBtn');
        newClearBtn.addEventListener('click', clearMatrices);
        newClearBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearMatrices();
            }
        });
    }

    if (acceptResize) {
        acceptResize.addEventListener('click', applyResize);
        acceptResize.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyResize();
            }
        });
    }

    const resizeDialog = document.getElementById('resizeDialog');
    if (resizeDialog) {
        resizeDialog.style.display = 'none';
    }

    acceptA?.addEventListener('click', () => {
        const rows = parseInt(rowsA.value) || 2;
        const cols = parseInt(colsA.value) || 2;
        createMatrix(matrixAGrid, rows, cols);
        document.getElementById('sizeMenuA').style.display = 'none';
    });
    
    acceptB?.addEventListener('click', () => {
        const rows = parseInt(rowsB.value) || 2;
        const cols = parseInt(colsB.value) || 2;
        createMatrix(matrixBGrid, rows, cols);
        document.getElementById('sizeMenuB').style.display = 'none';
    });
    
    document.getElementById('cancelA')?.addEventListener('click', () => {
    const menu = document.getElementById('sizeMenuA');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        menu.classList.add('closing');
        setTimeout(() => {
            menu.style.display = 'none';
            menu.classList.remove('closing');
        }, 300);
    }
    });

    document.getElementById('cancelB')?.addEventListener('click', () => {
    const menu = document.getElementById('sizeMenuB');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        menu.classList.add('closing');
        setTimeout(() => {
            menu.style.display = 'none';
            menu.classList.remove('closing');
        }, 300);
    }
    });

    window.addEventListener('resize', updateUI);
}

// Nasłuchiwacz do zamykania menu przy kliknięciu poza nim
document.addEventListener('click', function(event) {
    // Sprawdź czy kliknięto poza menu i przyciskiem resize
    if (!event.target.closest('.size-menu') && !event.target.classList.contains('resize-icon')) {
        document.querySelectorAll('.size-menu').forEach(menu => {
            menu.classList.remove('open');
            menu.style.display = 'none';
        });
    }
});

// Dodatkowo zamykaj menu przy nacisnięciu Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.size-menu').forEach(menu => {
            menu.classList.remove('open');
            menu.style.display = 'none';
        });
    }
});

function toggleSizeMenu(matrixId) {
    console.log(`toggleSizeMenu called with matrixId: ${matrixId}`); // Debugowanie
    const menu = document.getElementById(`sizeMenu${matrixId}`);
    const matrixFrame = document.getElementById(`matrix${matrixId}`);
    const resizeIcon = matrixFrame?.querySelector('.resize-icon');

    if (!menu || !matrixFrame || !resizeIcon) {
        console.error('Menu, matrix frame, or resize icon not found'); // Debugowanie
        return;
    }

    // Zamknij wszystkie inne menu
    document.querySelectorAll('.size-menu').forEach(m => {
        if (m !== menu && m.classList.contains('open')) {
            m.classList.remove('open');
            m.classList.add('closing');
            setTimeout(() => m.classList.remove('closing'), 300);
        }
    });

    // Toggle obecnego menu
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        menu.classList.add('closing');
        setTimeout(() => menu.classList.remove('closing'), 300);
    } else {
        menu.style.display = 'flex';
        const iconRect = resizeIcon.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${iconRect.bottom + window.scrollY + 5}px`;
        menu.style.left = `${iconRect.left + window.scrollX}px`;

        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            menu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
        }
        if (menuRect.bottom > window.innerHeight) {
            menu.style.top = `${iconRect.top + window.scrollY - menuRect.height - 5}px`;
        }

        requestAnimationFrame(() => menu.classList.add('open'));
        const firstInput = menu.querySelector('input');
        if (firstInput) setTimeout(() => { firstInput.focus(); firstInput.select(); }, 100);
    }
}

// Dodaj nasłuchiwanie na zmianę rozmiaru okna
window.addEventListener('resize', () => {
    document.querySelectorAll('.size-menu').forEach(menu => {
        if (menu.style.display === 'flex') {
            positionSizeMenu(menu);
        }
    });
});

// Dodaj globalny event listener dla skrótów klawiszowych
document.addEventListener('keydown', function(e) {
    // Sprawdź czy jesteśmy w kalkulatorze macierzy
    const isInMatrixCalculator = document.getElementById('matrixCalculatorApp')?.classList.contains('active');
    if (!isInMatrixCalculator) return;
    
    // ALT/CMD + Tab - przełączanie między macierzami
    if ((e.altKey || e.metaKey) && e.key === 'Tab') {
        e.preventDefault();
        switchToOtherMatrix();
        return;
    }
    
    // ALT/CMD + Shift + M - przełączanie między macierzami (alternatywny skrót)
    if ((e.altKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        switchToOtherMatrix();
        return;
    }
    
    // ALT/CMD + Shift + A - przejdź do macierzy A
    if ((e.altKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const matrixAGrid = document.getElementById('matrixAGrid');
        const firstInput = matrixAGrid?.querySelector('.matrix-input');
        if (firstInput) {
            firstInput.focus();
            firstInput.select();
            currentActiveMatrix = 'A';
            highlightActiveMatrix('A');
        }
        return;
    }
    
    // ALT/CMD + Shift + B - przejdź do macierzy B (jeśli widoczna)
    if ((e.altKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const matrixBGrid = document.getElementById('matrixBGrid');
        const isBVisible = matrixBGrid && matrixBGrid.closest('#matrixB').style.display !== 'none';
        
        if (isBVisible) {
            const firstInput = matrixBGrid.querySelector('.matrix-input');
            if (firstInput) {
                firstInput.focus();
                firstInput.select();
                currentActiveMatrix = 'B';
                highlightActiveMatrix('B');
            }
        }
        return;
    }
    
    // CTRL + Enter - szybkie obliczenie (alternatywa)
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        compute();
        return;
    }
});

// Globalny skrót klawiszowy do przełączania macierzy
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        switchToOtherMatrix();
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const matrixAGrid = document.getElementById('matrixAGrid');
        const firstInput = matrixAGrid?.querySelector('.matrix-input');
        if (firstInput) {
            firstInput.focus();
            firstInput.select();
            currentActiveMatrix = 'A';
            highlightActiveMatrix('A');
        }
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const matrixBGrid = document.getElementById('matrixBGrid');
        const isBVisible = matrixBGrid && matrixBGrid.closest('#matrixB').style.display !== 'none';
        if (isBVisible) {
            const firstInput = matrixBGrid.querySelector('.matrix-input');
            if (firstInput) {
                firstInput.focus();
                firstInput.select();
                currentActiveMatrix = 'B';
                highlightActiveMatrix('B');
            }
        }
    }
    
    // F1 key opens help
    if (e.key === 'F1' && document.getElementById('matrixCalcApp')?.classList.contains('active')) {
        e.preventDefault();
        if (typeof helpSystem !== 'undefined') {
            helpSystem.openModal('matrix');
        }
    }
});

// Initialize help system for matrix calculator
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof helpSystem !== 'undefined') {
            helpSystem.addMatrixHelpButton();
        }
    }, 500);
});

function updateOperationMenu() {
  const ops = isAdvancedMode ? advancedOperations : basicOperations;
  operationMenu.innerHTML = '';
  ops.forEach(({ op, label }) => {
    const div = document.createElement('div');
    div.className = 'operation-menu-item';
    div.dataset.op = op;
    div.textContent = label;
    operationMenu.appendChild(div);
  });
  // Ustaw zmienną --i dla animacji
  document.querySelectorAll('.operation-menu-item').forEach((item, index) => {
    item.style.setProperty('--i', index);
  });
}

function updateMatrixVisibility() {
  // Operacje na jednej macierzy
  const singleMatrixOps = ['det', 'inv', 'trans', 'trace', 'rank', 'eig'];
  if (singleMatrixOps.includes(currentOperation)) {
    matrixB.style.display = 'none';
    matrixA.style.margin = '0 auto';
    matricesContainer.style.justifyContent = 'center';
  } else {
    matrixB.style.display = '';
    matrixA.style.margin = '';
    matricesContainer.style.justifyContent = '';
  }
}

if (matrixModeSwitch) {
  matrixModeSwitch.addEventListener('change', function() {
    isAdvancedMode = this.checked;
    window.isAdvancedMode = isAdvancedMode; // <- synchronizacja dla help-system
    matrixModeSwitchText.textContent = isAdvancedMode ? 'Rozszerzony' : 'Podstawowy';
    updateOperationMenu();
    // Resetuj operację na pierwszą z listy
    const ops = isAdvancedMode ? advancedOperations : basicOperations;
    currentOperation = ops[0].op;
    operationBtn.textContent = ops[0].label;
    updateMatrixVisibility();
    if (window.helpSystem && typeof window.helpSystem.updateModalTranslations === 'function') {
      window.helpSystem.updateModalTranslations();
    }
  });
  // Synchronizacja na starcie
  window.isAdvancedMode = matrixModeSwitch.checked;
}

// Inicjalizacja menu operacji i widoczności macierzy na starcie
updateOperationMenu();
updateMatrixVisibility();

