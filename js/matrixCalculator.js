let currentOperation = "add";
let currentMethod = "cramer";

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

const resizeBtn = document.getElementById('resizeBtn');
const resizeDialog = document.getElementById('resizeDialog');
const resizeRowsA = document.getElementById('resizeRowsA');
const resizeColsA = document.getElementById('resizeColsA');
const resizeRowsB = document.getElementById('resizeRowsB');
const resizeColsB = document.getElementById('resizeColsB');
const acceptResize = document.getElementById('acceptResize');

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

            // Obsługa nawigacji strzałkami
            input.addEventListener('keydown', function(e) {
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

                    // Znajdź następne pole do fokusu
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

            gridElement.appendChild(input);
        }
    }
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

function changeOperation(operation) {
    currentOperation = operation;
    if (operationBtn) operationBtn.textContent = translations[currentLang].matrixCalc.operations[operation];
    
    if (solutionBox) {
        solutionBox.classList.toggle('visible', operation === 'solve');
    }

    adjustMatrixB();
    updateUI();
    centerMatrices();
}

function centerMatrices() {
    if (!matricesContainer) return;
    
    const screenWidth = window.innerWidth;
    let gap, scale;
    
    if (screenWidth >= 1200) {
        gap = 30;
        scale = 0.9;
    } else if (screenWidth >= 768) {
        gap = 20;
        scale = 0.85;
    } else {
        gap = 15;
        scale = 0.8;
    }
    
    matricesContainer.style.gap = `${gap}px`;
    
    document.querySelectorAll('.matrix-frame').forEach(frame => {
        frame.style.transform = `scale(${scale})`;
        frame.style.margin = screenWidth >= 1200 ? '0 -15px' : '0 auto';
    });
    
    if (['add', 'sub', 'mul', 'solve'].includes(currentOperation)) {
        matricesContainer.style.justifyContent = 'center';
    } else {
        matricesContainer.style.justifyContent = 'center';
    }
}

function adjustMatrixB() {
    if (!matrixB || !matrixAGrid || !matrixBGrid || !rowsB || !colsB) return;
    
    const colsA = parseInt(matrixAGrid.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] || 2);
    const rowsA = matrixAGrid.children.length / colsA || 2;

    if (currentOperation === 'solve') {
        // Dla operacji solve - macierz B zależna od A
        if (parseInt(rowsB.value) !== rowsA || parseInt(colsB.value) !== 1) {
            createMatrix(matrixBGrid, rowsA, 1);
            rowsB.value = rowsA;
            colsB.value = 1;
        }
        colsB.disabled = true;
        matrixB.style.display = 'block';
    } else if (['add', 'sub', 'mul'].includes(currentOperation)) {
        // Dla innych operacji - niezależne rozmiary
        const currentRowsB = parseInt(rowsB.value) || 2;
        const currentColsB = parseInt(colsB.value) || 2;
        createMatrix(matrixBGrid, currentRowsB, currentColsB);
        colsB.disabled = false;
        matrixB.style.display = 'block';
    } else {
        matrixB.style.display = 'none';
    }
}

function displayResult(result) {
    if (!resultBox) return;
    resultBox.innerHTML = '';
    
    if (Array.isArray(result)) {
        const colWidth = 7;
        const lines = result.map(row => {
            if (Array.isArray(row)) {
                return row.map(val => {
                    const str = Number.isInteger(val) ? val.toString() : val.toFixed(2);
                    return str.padStart(colWidth, ' ');
                }).join(' ');
            } else {
                const str = Number.isInteger(row) ? row.toString() : row.toFixed(2);
                return str.padStart(colWidth, ' ');
            }
        });
        
        lines.forEach(line => {
            const div = document.createElement('div');
            div.textContent = line;
            resultBox.appendChild(div);
        });
    } else if (typeof result === 'number') {
        resultBox.textContent = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    } else {
        resultBox.textContent = result;
    }
}

function displaySolution(solution) {
    if (!solutionBox) return;
    solutionBox.innerHTML = '';
    
    if (Array.isArray(solution)) {
        solution.forEach((val, i) => {
            const div = document.createElement('div');
            div.textContent = `x${i+1} = ${Number.isInteger(val) ? val : val.toFixed(2)}`;
            solutionBox.appendChild(div);
        });
    } else if (typeof solution === 'number') {
        solutionBox.textContent = `x = ${Number.isInteger(solution) ? solution : solution.toFixed(2)}`;
    }
}

function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function calculateDeterminant(matrix) {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < matrix[0].length; i++) {
        const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        det += matrix[0][i] * Math.pow(-1, i) * calculateDeterminant(minor);
    }
    return det;
}

function invertMatrix(matrix) {
    const det = calculateDeterminant(matrix);
    if (Math.abs(det) < 1e-10) return null;
    
    const n = matrix.length;
    const inverse = [];
    
    for (let i = 0; i < n; i++) {
        inverse[i] = [];
        for (let j = 0; j < n; j++) {
            const minor = matrix.filter((_, k) => k !== i).map(row => row.filter((_, k) => k !== j));
            const minorDet = calculateDeterminant(minor);
            inverse[i][j] = Math.pow(-1, i + j) * minorDet / det;
        }
    }
    
    return transposeMatrix(inverse);
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function solveCramer(A, b) {
    const detA = calculateDeterminant(A);
    if (Math.abs(detA) < 1e-10) throw new Error(translations[currentLang].matrixCalc.errors.singular);
    
    const n = A.length;
    const solution = [];
    
    for (let i = 0; i < n; i++) {
        const Ai = A.map(row => [...row]);
        for (let j = 0; j < n; j++) {
            Ai[j][i] = b[j][0];
        }
        solution.push(calculateDeterminant(Ai) / detA);
    }
    
    return solution;
}

function solveGauss(A, b) {
    const n = A.length;
    const Ab = A.map((row, i) => [...row, b[i][0]]);
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(Ab[j][i]) > Math.abs(Ab[maxRow][i])) maxRow = j;
        }
        
        [Ab[i], Ab[maxRow]] = [Ab[maxRow], Ab[i]];
        
        if (Math.abs(Ab[i][i]) < 1e-10) throw new Error(translations[currentLang].matrixCalc.errors.singular);
        
        for (let j = i + 1; j < n; j++) {
            const factor = Ab[j][i] / Ab[i][i];
            for (let k = i; k < n + 1; k++) {
                Ab[j][k] -= factor * Ab[i][k];
            }
        }
    }
    
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = Ab[i][n];
        for (let j = i + 1; j < n; j++) {
            solution[i] -= Ab[i][j] * solution[j];
        }
        solution[i] /= Ab[i][i];
    }
    
    return solution;
}

function gaussJordan(A, b) {
    const n = A.length;
    const Ab = A.map((row, i) => [...row, b[i][0]]);
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(Ab[j][i]) > Math.abs(Ab[maxRow][i])) maxRow = j;
        }
        
        [Ab[i], Ab[maxRow]] = [Ab[maxRow], Ab[i]];
        
        if (Math.abs(Ab[i][i]) < 1e-10) throw new Error(translations[currentLang].matrixCalc.errors.singular);
        
        const pivot = Ab[i][i];
        for (let j = i; j < n + 1; j++) {
            Ab[i][j] /= pivot;
        }
        
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const factor = Ab[j][i];
                for (let k = i; k < n + 1; k++) {
                    Ab[j][k] -= factor * Ab[i][k];
                }
            }
        }
    }
    
    const rref = Ab.map(row => row.slice(0, n));
    const solution = Ab.map(row => row[n]);
    
    return [rref, solution];
}

function solveInverse(A, b) {
    const invA = invertMatrix(A);
    if (!invA) throw new Error(translations[currentLang].matrixCalc.errors.singular);
    
    const solution = multiplyMatrices(invA, b);
    return solution.map(row => row[0]);
}

function clearMatrices() {
    document.querySelectorAll('.matrix-input').forEach(input => {
        input.value = '0';
        input.classList.remove('invalid');
    });
    if (resultBox) resultBox.innerHTML = '';
    if (solutionBox) solutionBox.innerHTML = '';
}

function compute() {
    try {
        const matrixAValues = getMatrixValues(matrixAGrid);
        
        if (['add', 'sub', 'mul', 'solve'].includes(currentOperation)) {
            const matrixBValues = getMatrixValues(matrixBGrid);
            
            if (currentOperation === 'add' || currentOperation === 'sub') {
                if (matrixAValues.length !== matrixBValues.length || 
                    matrixAValues[0].length !== matrixBValues[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim
                        .replace('{op}', translations[currentLang].matrixCalc.operations[currentOperation].toLowerCase()));
                }
                const result = matrixAValues.map((row, i) => 
                    row.map((val, j) => currentOperation === 'add' ? val + matrixBValues[i][j] : val - matrixBValues[i][j])
                );
                displayResult(result);
            } 
            else if (currentOperation === 'mul') {
                if (matrixAValues[0].length !== matrixBValues.length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.mul_dim);
                }
                const result = multiplyMatrices(matrixAValues, matrixBValues);
                displayResult(result);
            } 
            else if (currentOperation === 'solve') {
                if (meter) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                let solution;
                if (currentMethod === 'cramer') {
                    solution = solveCramer(matrixAValues, matrixBValues);
                    displayResult(solution.map(val => [val]));
                } else if (currentMethod === 'gauss') {
                    solution = solveGauss(matrixAValues, matrixBValues);
                    displayResult(solution.map(val => [val]));
                } else if (currentMethod === 'gauss_jordan') {
                    const [rref, sol] = gaussJordan(matrixAValues, matrixBValues);
                    displayResult(rref);
                    solution = sol;
                } else if (currentMethod === 'inverse') {
                    solution = solveInverse(matrixAValues, matrixBValues);
                    displayResult(solution.map(val => [val]));
                }
                displaySolution(solution);
            }
        } 
        else if (currentOperation === 'det') {
            if (matrixAValues.length !== matrixAValues[0].length) {
                throw new Error(translations[currentLang].matrixCalc.errors.square);
            }
            const determinant = calculateDeterminant(matrixAValues);
            displayResult(determinant);
        } 
        else if (currentOperation === 'inv') {
            if (matrixAValues.length !== matrixAValues[0].length) {
                throw new Error(translations[currentLang].matrixCalc.errors.square);
            }
            const inverse = invertMatrix(matrixAValues);
            if (!inverse) throw new Error(translations[currentLang].matrixCalc.errors.singular);
            displayResult(inverse);
        } 
        else if (currentOperation === 'trans') {
            const transposed = transposeMatrix(matrixAValues);
            displayResult(transposed);
        }
    } catch (error) {
        alert(error.message);
    }
}

function handleResize() {
    if (sizeMenuA.style.display === 'block') {
        sizeMenuA.style.display = 'none';
        sizeMenuA.classList.remove('open');
    }
    if (sizeMenuB.style.display === 'block') {
        sizeMenuB.style.display = 'none';
        sizeMenuB.classList.remove('open');
    }
}

document.addEventListener('click', function(e) {
    const isMenuClick = e.target.closest('.size-menu');
    const isMatrixClick = e.target.closest('.matrix-frame');
    
    if (!isMenuClick && !isMatrixClick) {
        [sizeMenuA, sizeMenuB].forEach(menu => {
            menu.style.display = 'none';
            menu.classList.remove('open');
        });
    }
});

function updateMatrixSize(matrixType, rows, cols) {
    if (matrixType === 'A') {
        rowsA.value = rows;
        colsA.value = cols;
        createMatrix(matrixAGrid, rows, cols);
    } else {
        rowsB.value = rows;
        colsB.value = cols;
        createMatrix(matrixBGrid, rows, cols);
    }
    adjustMatrixB(); // Synchronizacja macierzy B
}

function toggleResizeDialog() {
    // Wypełnij bieżącymi wartościami
    resizeRowsA.value = rowsA.value;
    resizeColsA.value = colsA.value;
    resizeRowsB.value = rowsB.value;
    resizeColsB.value = colsB.value;
    
    resizeDialog.classList.toggle('open');

    if (resizeDialog.classList.contains('open')) {
        resizeRowsA.focus();
        resizeRowsA.select();
    }
}

document.addEventListener('click', function(e) {
    const resizeDialog = document.querySelector('.resize-dialog');
    const resizeBtn = document.getElementById('resizeBtn');
    
    if (resizeDialog && resizeBtn) {
        if (!resizeDialog.contains(e.target) && e.target !== resizeBtn) {
            resizeDialog.classList.remove('open');
        }
    } else {
        console.error('Elements not found:', { resizeDialog, resizeBtn });
    }
});

function applyResize() {
    const rowsAValue = parseInt(resizeRowsA.value);
    const colsAValue = parseInt(resizeColsA.value);
    const rowsBValue = parseInt(resizeRowsB.value);
    const colsBValue = parseInt(resizeColsB.value);

    // Walidacja
    if (isNaN(rowsAValue) || isNaN(colsAValue) || rowsAValue < 1 || colsAValue < 1 || 
        rowsAValue > 10 || colsAValue > 10 || isNaN(rowsBValue) || isNaN(colsBValue) || 
        rowsBValue < 1 || colsBValue < 1 || rowsBValue > 10 || colsBValue > 10) {
        alert(translations[currentLang].matrixCalc.errors.size_invalid);
        return;
    }

    // Zastosuj nowe rozmiary
    rowsA.value = rowsAValue;
    colsA.value = colsAValue;
    rowsB.value = rowsBValue;
    colsB.value = colsBValue;

    createMatrix(matrixAGrid, rowsAValue, colsAValue);
    createMatrix(matrixBGrid, rowsBValue, colsBValue);
    adjustMatrixB();
}

function initializeMatrixCalculator() {
    createMatrix(matrixAGrid, 2, 2);
    createMatrix(matrixBGrid, 2, 2);
    centerMatrices();

    const acceptA = document.getElementById('acceptA');
    const acceptB = document.getElementById('acceptB');

    const inputsA = matrixAGrid.querySelectorAll('.matrix-input');
    const inputsB = matrixBGrid.querySelectorAll('.matrix-input');
    console.log(`Utworzono ${inputsA.length} inputów w macierzy A`);
    console.log(`Utworzono ${inputsB.length} inputów w macierzy B`);

    window.addEventListener('resize', handleResize);
    handleResize();

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
        operationMenu.style.display = operationMenu.style.display === 'block' ? 'none' : 'block';
    });

    if (operationMenu) operationMenu.addEventListener('click', e => {
        if (e.target.classList.contains('operation-menu-item')) {
            changeOperation(e.target.dataset.op);
            operationMenu.style.display = 'none';
        }
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        const isOperationMenuClick = e.target.closest('.operation-menu');
        const isOperationBtnClick = e.target === operationBtn || e.target.closest('#operationBtn');
        
        if (!isOperationMenuClick && !isOperationBtnClick && operationMenu) {
            operationMenu.style.display = 'none';
        }
    });

    // Globalna obsługa Entera na poziomie całego dokumentu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // Sprawdź, czy fokus jest na polach rozmiaru lub dialogu zmiany rozmiaru
            const isSizeInput = e.target === rowsA || e.target === colsA || 
                               e.target === rowsB || e.target === colsB ||
                               e.target === resizeRowsA || e.target === resizeColsA ||
                               e.target === resizeRowsB || e.target === resizeColsB;
            if (!isSizeInput) {
                e.preventDefault();
                compute();
            }
        }
    });

    if (computeBtn) {
        // Kliknięcie myszką
        computeBtn.addEventListener('click', compute);
        
        // Naciśnięcie Enter gdy przycisk ma focus
        computeBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                compute();
            }
        });
    }
    if (clearBtn) clearBtn.addEventListener('click', clearMatrices);

    if (acceptResize) {
        acceptResize.addEventListener('click', applyResize);
        
        acceptResize.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyResize();
            }
        });
    }

    if (resizeDialog) {
        resizeDialog.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyResize();
            }
        });
    }

    if (matrixA) {
        matrixA.addEventListener('click', (e) => {
            if (e.target.classList.contains('matrix-title')) {
                sizeMenuA.style.display = sizeMenuA.style.display === 'block' ? 'none' : 'block';
                e.stopPropagation();
            }
        });
    }

    if (matrixB) {
        matrixB.addEventListener('click', (e) => {
            if (e.target.classList.contains('matrix-title') && 
                getComputedStyle(matrixB).display !== 'none') {
                // Ukryj menu A jeśli jest otwarte
                sizeMenuA.style.display = 'none';
                sizeMenuA.classList.remove('open');
            
                // Przełącz menu B
                if (sizeMenuB.style.display === 'block') {
                    sizeMenuB.style.display = 'none';
                    sizeMenuB.classList.remove('open');
                } else {
                    sizeMenuB.style.display = 'block';
                    sizeMenuB.classList.add('open');
                }
                e.stopPropagation();
            }
        });
    }

    acceptA?.addEventListener('click', () => {
        const rows = parseInt(rowsA.value) || 2;
        const cols = parseInt(colsA.value) || 2;
        createMatrix(matrixAGrid, rows, cols);
        document.getElementById('sizeMenuA').style.display = 'none';
    });
    
    // Obsługa przycisku OK dla macierzy B
    acceptB?.addEventListener('click', () => {
        const rows = parseInt(rowsB.value) || 2;
        const cols = parseInt(colsB.value) || 2;
        createMatrix(matrixBGrid, rows, cols);
        document.getElementById('sizeMenuB').style.display = 'none';
    });

    document.getElementById('acceptA')?.addEventListener('click', () => {
    const rows = parseInt(document.getElementById('rowsA').value) || 2;
    const cols = parseInt(document.getElementById('colsA').value) || 2;
    createMatrix(matrixAGrid, rows, cols);
    document.getElementById('sizeMenuA').style.display = 'none';
    });

    document.getElementById('acceptB')?.addEventListener('click', () => {
    const rows = parseInt(document.getElementById('rowsB').value) || 2;
    const cols = parseInt(document.getElementById('colsB').value) || 2;
    createMatrix(matrixBGrid, rows, cols);
    document.getElementById('sizeMenuB').style.display = 'none';
    });
}
resizeBtn
function toggleSizeMenu(matrixId) {
    const menu = document.getElementById(`sizeMenu${matrixId}`);
    if (!menu) return;
    
    // Zamknij wszystkie inne menu
    document.querySelectorAll('.size-menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });
    
    // Przełącz widoczność bieżącego menu
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    
    // Ustaw focus na pierwsze pole input
    if (menu.style.display === 'block') {
        const firstInput = menu.querySelector('input');
        if (firstInput) {
            firstInput.focus();
            firstInput.select();
        }
    }
}