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
        const currentRowsB = parseInt(rowsB.value) || 2;
        const currentColsB = parseInt(colsB.value) || 2;
        createMatrix(matrixBGrid, currentRowsB, currentColsB);
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
    if (!resultBox) return;
    resultBox.innerHTML = '';
    
    if (Array.isArray(result)) {
        const pre = document.createElement('pre');
        // Convert the result matrix to a string representation
        const matrixString = result.map(row => 
            row.map(val => Number.isInteger(val) ? val.toString() : val.toFixed(2)).join('\t')
        ).join('\n');
        pre.textContent = matrixString;
        resultBox.appendChild(pre);
    } else {
        const span = document.createElement('span');
        span.textContent = result.toString();
        resultBox.appendChild(span);
    }
}

function compute() {
    try {
        const A = getMatrixValues(matrixAGrid);
        let B;
        if (['add', 'sub', 'mul', 'solve'].includes(currentOperation)) {
            B = getMatrixValues(matrixBGrid);
        }

        let result;
        switch (currentOperation) {
            case 'add':
                if (A.length !== B.length || A[0].length !== B[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim.replace('{op}', 'dodawania'));
                }
                result = A.map((row, i) => row.map((val, j) => val + B[i][j]));
                break;
            case 'sub':
                if (A.length !== B.length || A[0].length !== B[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim.replace('{op}', 'odejmowania'));
                }
                result = A.map((row, i) => row.map((val, j) => val - B[i][j]));
                break;
            case 'mul':
                if (A[0].length !== B.length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.mul_dim);
                }
                result = Array(A.length).fill().map((_, i) => 
                    Array(B[0].length).fill().map((_, j) => 
                        Array(A[0].length).fill().reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0)
                    )
                );
                break;
            case 'det':
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = determinant(A);
                break;
            case 'inv':
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = inverse(A);
                break;
            case 'trans':
                result = A[0].map((_, j) => A.map(row => row[j]));
                break;
            case 'solve':
                if (A.length !== A[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                result = solveSystem(A, B);
                break;
        }
        displayResult(result);
    } catch (error) {
        alert(error.message);
    }
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
    if (currentMethod === 'cramer') {
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
    } else {
        // Implement other methods (gauss, gauss_jordan, inverse) if needed
        throw new Error("Only Cramer's method is implemented");
    }
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
    createMatrix(matrixAGrid, 2, 2);
    createMatrix(matrixBGrid, 2, 2);
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

    document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && currentScreen === 'app' && document.getElementById('matrixCalcApp').classList.contains('active')) {
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

    if (resizeDialog) {
        resizeDialog.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyResize();
            }
        });
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

    window.addEventListener('resize', updateMatrixOperator);
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
    const menu = document.getElementById(`sizeMenu${matrixId}`);
    if (!menu) return;
    
    document.querySelectorAll('.size-menu').forEach(m => {
        if (m !== menu) {
            m.style.display = 'none';
            m.classList.remove('open');
        }
    });
    
    const isOpen = menu.style.display === 'block';
    menu.style.display = isOpen ? 'none' : 'block';
    menu.classList.toggle('open', !isOpen);
    
    if (!isOpen) {
        const firstInput = menu.querySelector('input');
        if (firstInput) {
            firstInput.focus();
            firstInput.select();
        }
    }
}