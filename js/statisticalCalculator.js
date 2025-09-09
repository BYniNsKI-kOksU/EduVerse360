class StatisticalCalculator {
    constructor() {
        this.data = [];
        this.results = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeWithSampleData();
    }

    initializeWithSampleData() {
        const dataInput = document.getElementById('dataInput');
        if (dataInput && !dataInput.value) {
            dataInput.value = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10';
            this.parseInputData();
        }
    }

    createHTML() {
        // HTML is now created in index.html, no need to recreate
        return;
    }

    bindEvents() {
        // Calculate statistics button
        const calculateBtn = document.getElementById('calculateStatsBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateStatistics());
        }

        // Generate chart button
        const chartBtn = document.getElementById('generateChartBtn');
        if (chartBtn) {
            chartBtn.addEventListener('click', () => this.generateChart());
        }

        // Clear button
        const clearBtn = document.getElementById('clearStatsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearData());
        }

        // Data input changes
        const dataInput = document.getElementById('dataInput');
        if (dataInput) {
            dataInput.addEventListener('input', () => this.parseInputData());
        }

        // Sort data button
        const sortBtn = document.getElementById('sortDataBtn');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => this.sortData());
        }

        // Add individual data button
        const addDataBtn = document.getElementById('addDataBtn');
        if (addDataBtn) {
            addDataBtn.addEventListener('click', () => this.addSingleData());
        }
    }

    parseInputData() {
        const dataInput = document.getElementById('dataInput');
        if (!dataInput) return;

        const text = dataInput.value.trim();
        if (!text) {
            this.data = [];
            this.updateDataDisplay();
            this.clearResults();
            return;
        }

        // Parse data separated by commas, spaces, or newlines
        const values = text.split(/[,\s\n]+/)
            .map(val => val.trim())
            .filter(val => val !== '')
            .map(val => parseFloat(val));

        const validValues = values.filter(val => !isNaN(val));
        
        if (validValues.length !== values.length) {
            this.showError('Niektóre wartości nie są prawidłowymi liczbami');
        } else {
            this.clearError();
        }

        this.data = validValues;
        this.updateDataDisplay();
    }

    updateDataDisplay() {
        const dataDisplay = document.getElementById('dataDisplay');
        const dataCount = document.getElementById('dataCount');
        
        dataCount.textContent = this.data.length;
        
        if (this.data.length === 0) {
            dataDisplay.textContent = 'Brak danych';
            return;
        }

        // Display data with some formatting
        if (this.data.length <= 20) {
            dataDisplay.innerHTML = this.data.map((value, index) => 
                `<span class="data-item" data-index="${index}">${value}</span>`
            ).join(', ');
        } else {
            const preview = this.data.slice(0, 15);
            dataDisplay.innerHTML = preview.map((value, index) => 
                `<span class="data-item" data-index="${index}">${value}</span>`
            ).join(', ') + `<span class="data-more">... i ${this.data.length - 15} więcej</span>`;
        }

        // Add click to remove functionality
        document.querySelectorAll('.data-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.removeDataPoint(index);
            });
        });
    }

    removeDataPoint(index) {
        this.data.splice(index, 1);
        this.updateDataDisplay();
        this.updateDataInput();
        this.clearResults();
    }

    sortData() {
        this.data.sort((a, b) => a - b);
        this.updateDataDisplay();
        this.updateDataInput();
        this.clearResults();
    }

    calculateStatistics() {
        if (this.data.length === 0) {
            this.showError('Brak danych do analizy');
            return;
        }

        const selectedTypes = Array.from(document.querySelectorAll('input[name="calcType"]:checked'))
            .map(cb => cb.value);

        if (selectedTypes.length === 0) {
            this.showError('Wybierz przynajmniej jeden typ obliczeń');
            return;
        }

        this.results = this.computeStatistics(selectedTypes);
        this.displayResults();
    }

    computeStatistics(types) {
        const sortedData = [...this.data].sort((a, b) => a - b);
        const n = this.data.length;
        const results = {};

        if (types.includes('basic')) {
            // Mean
            const mean = this.data.reduce((sum, val) => sum + val, 0) / n;
            
            // Median
            const median = n % 2 === 0
                ? (sortedData[n/2 - 1] + sortedData[n/2]) / 2
                : sortedData[Math.floor(n/2)];
            
            // Mode
            const frequency = {};
            this.data.forEach(val => {
                frequency[val] = (frequency[val] || 0) + 1;
            });
            const maxFreq = Math.max(...Object.values(frequency));
            const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
            
            results.basic = {
                mean: mean,
                median: median,
                mode: modes.length === n ? 'Brak trybu' : modes.map(Number),
                count: n,
                sum: this.data.reduce((sum, val) => sum + val, 0),
                min: Math.min(...this.data),
                max: Math.max(...this.data),
                range: Math.max(...this.data) - Math.min(...this.data)
            };
        }

        if (types.includes('spread')) {
            const mean = this.data.reduce((sum, val) => sum + val, 0) / n;
            
            // Variance and standard deviation
            const variance = this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
            const populationStdDev = Math.sqrt(variance);
            const sampleVariance = n > 1 ? this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1) : 0;
            const sampleStdDev = Math.sqrt(sampleVariance);
            
            // Mean absolute deviation
            const meanAbsDev = this.data.reduce((sum, val) => sum + Math.abs(val - mean), 0) / n;
            
            results.spread = {
                variance: variance,
                populationStdDev: populationStdDev,
                sampleVariance: sampleVariance,
                sampleStdDev: sampleStdDev,
                meanAbsDev: meanAbsDev,
                coefficientOfVariation: (populationStdDev / mean) * 100
            };
        }

        if (types.includes('position')) {
            // Quartiles
            const q1 = this.percentile(sortedData, 25);
            const q3 = this.percentile(sortedData, 75);
            const iqr = q3 - q1;
            
            results.position = {
                q1: q1,
                q2: this.percentile(sortedData, 50), // median
                q3: q3,
                iqr: iqr,
                p10: this.percentile(sortedData, 10),
                p90: this.percentile(sortedData, 90),
                outlierBounds: {
                    lower: q1 - 1.5 * iqr,
                    upper: q3 + 1.5 * iqr
                }
            };
        }

        if (types.includes('shape') && n >= 3) {
            const mean = this.data.reduce((sum, val) => sum + val, 0) / n;
            const stdDev = Math.sqrt(this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n);
            
            // Skewness
            const skewness = this.data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n;
            
            // Kurtosis
            const kurtosis = this.data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
            
            results.shape = {
                skewness: skewness,
                kurtosis: kurtosis,
                skewnessInterpretation: this.interpretSkewness(skewness),
                kurtosisInterpretation: this.interpretKurtosis(kurtosis)
            };
        }

        return results;
    }

    percentile(sortedData, p) {
        const index = (p / 100) * (sortedData.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        
        if (lower === upper) {
            return sortedData[lower];
        }
        
        return sortedData[lower] * (upper - index) + sortedData[upper] * (index - lower);
    }

    interpretSkewness(skew) {
        if (Math.abs(skew) < 0.5) return 'Rozkład symetryczny';
        if (skew > 0) return 'Rozkład prawoskośny (ogon po prawej)';
        return 'Rozkład lewoskośny (ogon po lewej)';
    }

    interpretKurtosis(kurt) {
        if (Math.abs(kurt) < 0.5) return 'Normalny rozkład (mezokuryczny)';
        if (kurt > 0) return 'Rozkład wysmukły (leptokuryczny)';
        return 'Rozkład spłaszczony (platykuryczny)';
    }

    displayResults() {
        const container = document.getElementById('resultsContainer');
        let html = '<div class="statistical-results"><h3>Wyniki obliczeń</h3>';

        if (this.results.basic) {
            html += this.formatBasicResults(this.results.basic);
        }

        if (this.results.spread) {
            html += this.formatSpreadResults(this.results.spread);
        }

        if (this.results.position) {
            html += this.formatPositionResults(this.results.position);
        }

        if (this.results.shape) {
            html += this.formatShapeResults(this.results.shape);
        }

        html += '</div>';
        container.innerHTML = html;
    }

    formatBasicResults(basic) {
        return `
            <div class="result-section">
                <h4><i class="fas fa-info-circle"></i> Statystyki podstawowe</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Liczba obserwacji:</span>
                        <span class="result-value">${basic.count}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Suma:</span>
                        <span class="result-value">${basic.sum.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Średnia arytmetyczna:</span>
                        <span class="result-value">${basic.mean.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Mediana:</span>
                        <span class="result-value">${basic.median.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Tryb (modalność):</span>
                        <span class="result-value">${Array.isArray(basic.mode) ? basic.mode.join(', ') : basic.mode}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Minimum:</span>
                        <span class="result-value">${basic.min.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Maksimum:</span>
                        <span class="result-value">${basic.max.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Rozstęp:</span>
                        <span class="result-value">${basic.range.toFixed(4)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    formatSpreadResults(spread) {
        return `
            <div class="result-section">
                <h4><i class="fas fa-expand-arrows-alt"></i> Miary rozrzutu</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Wariancja (populacyjna):</span>
                        <span class="result-value">${spread.variance.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Odch. stand. (populacyjne):</span>
                        <span class="result-value">${spread.populationStdDev.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Wariancja (próbkowa):</span>
                        <span class="result-value">${spread.sampleVariance.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Odch. stand. (próbkowe):</span>
                        <span class="result-value">${spread.sampleStdDev.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Śr. odchylenie bezwzględne:</span>
                        <span class="result-value">${spread.meanAbsDev.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Współczynnik zmienności:</span>
                        <span class="result-value">${spread.coefficientOfVariation.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    formatPositionResults(position) {
        return `
            <div class="result-section">
                <h4><i class="fas fa-sort-amount-up"></i> Miary pozycyjne</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Pierwszy kwartyl (Q1):</span>
                        <span class="result-value">${position.q1.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Drugi kwartyl (Q2/Mediana):</span>
                        <span class="result-value">${position.q2.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Trzeci kwartyl (Q3):</span>
                        <span class="result-value">${position.q3.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Rozstęp międzykwartylowy (IQR):</span>
                        <span class="result-value">${position.iqr.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">10. percentyl:</span>
                        <span class="result-value">${position.p10.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">90. percentyl:</span>
                        <span class="result-value">${position.p90.toFixed(4)}</span>
                    </div>
                    <div class="result-item full-width">
                        <span class="result-label">Granice obserwacji odstających:</span>
                        <span class="result-value">[${position.outlierBounds.lower.toFixed(4)}, ${position.outlierBounds.upper.toFixed(4)}]</span>
                    </div>
                </div>
            </div>
        `;
    }

    formatShapeResults(shape) {
        return `
            <div class="result-section">
                <h4><i class="fas fa-wave-square"></i> Miary kształtu rozkładu</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">Skośność:</span>
                        <span class="result-value">${shape.skewness.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Interpretacja skośności:</span>
                        <span class="result-value">${shape.skewnessInterpretation}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Kurtoza:</span>
                        <span class="result-value">${shape.kurtosis.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Interpretacja kurtozy:</span>
                        <span class="result-value">${shape.kurtosisInterpretation}</span>
                    </div>
                </div>
            </div>
        `;
    }

    generateChart() {
        const canvas = document.getElementById('statsCanvas');
        const ctx = canvas.getContext('2d');
        const chartType = document.getElementById('chartType').value;

        if (this.data.length === 0) {
            this.showError('Brak danych do wizualizacji');
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        switch (chartType) {
            case 'histogram':
                this.drawHistogram(ctx, canvas);
                break;
            case 'boxplot':
                this.drawBoxPlot(ctx, canvas);
                break;
            case 'scatter':
                this.drawScatterPlot(ctx, canvas);
                break;
        }
    }

    drawHistogram(ctx, canvas) {
        const sortedData = [...this.data].sort((a, b) => a - b);
        const min = Math.min(...this.data);
        const max = Math.max(...this.data);
        const bins = Math.ceil(Math.sqrt(this.data.length)); // Sturges' rule
        const binWidth = (max - min) / bins;
        
        // Create bins
        const binCounts = new Array(bins).fill(0);
        this.data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            binCounts[binIndex]++;
        });

        const maxCount = Math.max(...binCounts);
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw bars
        const barWidth = chartWidth / bins;
        ctx.fillStyle = 'rgba(224, 122, 95, 0.7)';
        
        binCounts.forEach((count, i) => {
            const barHeight = (count / maxCount) * chartHeight;
            const x = padding + i * barWidth;
            const y = canvas.height - padding - barHeight;
            
            ctx.fillRect(x, y, barWidth - 2, barHeight);
            
            // Add count labels
            if (count > 0) {
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(count.toString(), x + barWidth / 2, y - 5);
                ctx.fillStyle = 'rgba(224, 122, 95, 0.7)';
            }
        });

        // Add title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Histogram', canvas.width / 2, 25);
    }

    drawBoxPlot(ctx, canvas) {
        if (!this.results || !this.results.position) {
            // Calculate quartiles if not already done
            const sortedData = [...this.data].sort((a, b) => a - b);
            const q1 = this.percentile(sortedData, 25);
            const median = this.percentile(sortedData, 50);
            const q3 = this.percentile(sortedData, 75);
            const min = Math.min(...this.data);
            const max = Math.max(...this.data);
            
            this.drawBoxPlotWithValues(ctx, canvas, { min, q1, median, q3, max });
        } else {
            const { q1, q2: median, q3 } = this.results.position;
            const min = Math.min(...this.data);
            const max = Math.max(...this.data);
            
            this.drawBoxPlotWithValues(ctx, canvas, { min, q1, median, q3, max });
        }
    }

    drawBoxPlotWithValues(ctx, canvas, { min, q1, median, q3, max }) {
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const boxHeight = 60;
        const centerY = canvas.height / 2;
        
        const dataRange = max - min;
        const scale = chartWidth / dataRange;
        
        // Convert values to pixel positions
        const minX = padding + (min - min) * scale;
        const q1X = padding + (q1 - min) * scale;
        const medianX = padding + (median - min) * scale;
        const q3X = padding + (q3 - min) * scale;
        const maxX = padding + (max - min) * scale;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        // Draw whiskers
        ctx.beginPath();
        ctx.moveTo(minX, centerY - boxHeight/4);
        ctx.lineTo(minX, centerY + boxHeight/4);
        ctx.moveTo(minX, centerY);
        ctx.lineTo(q1X, centerY);
        
        ctx.moveTo(maxX, centerY - boxHeight/4);
        ctx.lineTo(maxX, centerY + boxHeight/4);
        ctx.moveTo(q3X, centerY);
        ctx.lineTo(maxX, centerY);
        ctx.stroke();
        
        // Draw box
        ctx.fillStyle = 'rgba(224, 122, 95, 0.3)';
        ctx.fillRect(q1X, centerY - boxHeight/2, q3X - q1X, boxHeight);
        ctx.strokeRect(q1X, centerY - boxHeight/2, q3X - q1X, boxHeight);
        
        // Draw median line
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#e07a5f';
        ctx.beginPath();
        ctx.moveTo(medianX, centerY - boxHeight/2);
        ctx.lineTo(medianX, centerY + boxHeight/2);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        const labelY = centerY + boxHeight/2 + 20;
        ctx.fillText(min.toFixed(2), minX, labelY);
        ctx.fillText('Q1', q1X, labelY);
        ctx.fillText('Med', medianX, labelY);
        ctx.fillText('Q3', q3X, labelY);
        ctx.fillText(max.toFixed(2), maxX, labelY);
        
        // Add title
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Wykres pudełkowy', canvas.width / 2, 25);
    }

    drawScatterPlot(ctx, canvas) {
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const min = Math.min(...this.data);
        const max = Math.max(...this.data);
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = 'rgba(224, 122, 95, 0.8)';
        this.data.forEach((value, index) => {
            const x = padding + (index / (this.data.length - 1)) * chartWidth;
            const y = canvas.height - padding - ((value - min) / (max - min)) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Add title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Wykres punktowy (indeks vs wartość)', canvas.width / 2, 25);
    }

    addSingleData() {
        const input = document.getElementById('singleDataInput');
        if (!input) return;

        const value = parseFloat(input.value);
        if (isNaN(value)) {
            this.showError('Wprowadź prawidłową liczbę');
            return;
        }

        this.data.push(value);
        input.value = '';
        this.updateDataDisplay();
        this.updateDataInput();
        this.clearResults();
    }

    updateDataInput() {
        const dataInput = document.getElementById('dataInput');
        if (dataInput) {
            dataInput.value = this.data.join(', ');
        }
    }

    clearResults() {
        const container = document.getElementById('resultsContainer');
        if (container) {
            container.innerHTML = '<div class="default-result-text">Wprowadź dane i wybierz typ obliczeń</div>';
        }
        this.results = null;
        this.clearChart();
    }

    showError(message) {
        const errorDiv = document.getElementById('statsError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }

    clearError() {
        const errorDiv = document.getElementById('statsError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    clearData() {
        const dataInput = document.getElementById('dataInput');
        if (dataInput) {
            dataInput.value = '';
        }
        
        this.data = [];
        this.updateDataDisplay();
        this.clearResults();
    }

    clearChart() {
        const canvas = document.getElementById('statsCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// Statistical calculator will be initialized when needed by the main app
