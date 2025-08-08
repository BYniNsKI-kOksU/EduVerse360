// Animated background
const canvas = document.getElementById('mathBg');
const ctx = canvas.getContext('2d');
const symbols = ['π', '√', '∑', '∆', '∫', '∂', '∇', '+', '×', '[aᵢⱼ]', '-'];
const particles = [];
const maxParticles = 550;
const particlesPerPixel = maxParticles / 1920;
const particleCount = Math.floor(window.innerWidth * particlesPerPixel);
const maxEffectDist = 150;
const maxWaveRadius = 255;
const waveDuration = 1000;
let mouse = { x: -9999, y: -9999 };
let waves = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    adjustParticlesDensity();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < particleCount; i++) {
    const baseSize = 16 + Math.random() * 8;
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        baseSize,
        size: baseSize,
        color: '#444'
    });
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('click', e => {
    waves.push({
        x: e.clientX,
        y: e.clientY,
        startTime: performance.now()
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.querySelector('.welcome-lang-btn');
    if (langBtn) {
        langBtn.style.animation = 'none';
        void langBtn.offsetWidth;
        langBtn.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s';
    }
});

function adjustParticlesDensity() {
    const maxParticles = 550;
    const particlesPerPixel = maxParticles / 1920;
    const newDensity = Math.floor(window.innerWidth * particlesPerPixel);

    while (particles.length > newDensity) {
        particles.pop();
    }
    while (particles.length < newDensity) {
        const baseSize = 16 + Math.random() * 8;
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 0.8,
            dy: (Math.random() - 0.5) * 0.8,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            baseSize,
            size: baseSize,
            color: '#444'
        });
    }
}

function animate(now = performance.now()) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    waves = waves.filter(wave => now - wave.startTime < waveDuration);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let p of particles) {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;
        const effectMouse = Math.max(0, 1 - distSqMouse / (maxEffectDist * maxEffectDist));

        let effectWave = 0;
        for (const wave of waves) {
            const progress = (now - wave.startTime) / waveDuration;
            const radius = progress * maxWaveRadius;
            const dx = p.x - wave.x;
            const dy = p.y - wave.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = Math.abs(dist - radius);
            const thickness = 40;

            if (diff < thickness) {
                const strength = 1 - diff / thickness;
                if (strength > effectWave) effectWave = strength;
            }
        }

        const maxSizeMultiplier = window.innerWidth < 480 ? 0.6 : 
                         window.innerWidth < 768 ? 0.8 : 1.2;
        const effect = Math.max(effectMouse, effectWave);
        p.size = p.baseSize + effect * p.baseSize * maxSizeMultiplier;
        p.color = effectWave > effectMouse ? '#E07A5F' : `rgb(${Math.floor(100 + (1 - effect) * 100)},${Math.floor(100 + (1 - effect) * 100)},${Math.floor(100 + (1 - effect) * 100)})`;

        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.symbol, Math.round(p.x), Math.round(p.y));
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Global cursor tracking for result-wrapper
document.addEventListener('mousemove', e => {
    const wrappers = document.querySelectorAll('.result-wrapper');
    if (wrappers.length === 0) return;

    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const x = (e.clientX / winWidth) * 100;
    const y = (e.clientY / winHeight) * 100;

    wrappers.forEach(wrapper => {
        wrapper.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 0, 0, 0.15) 0%, transparent 60%)`;
    });
});

// Welcome screen navigation
document.querySelector('.start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 500); // Match original delay
    }
    navigateTo('home');
});

// Navigation functions
function backToHome() {
    navigateTo('home');
}

// Tile navigation
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const app = tile.dataset.app;
        navigateTo('app', app);
    });
});

// Language switch and UI updates
function switchLanguage(code) {
    currentLang = code;
    document.title = translations[code].title;
    updateWelcomeScreen();
    updateUI();
    updateHomeUI();
}

function updateWelcomeScreen() {
    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    const startBtn = document.querySelector('.start-btn');
    const langContainer = document.querySelector('.welcome-screen .lang-btn-container');

    if (welcomeTitle) {
        welcomeTitle.innerHTML = `<span>${translations[currentLang].welcome.title}</span>`;
        welcomeTitle.style.animation = 'none';
        welcomeTitle.offsetHeight;
        welcomeTitle.style.animation = 'fadeInScale 1s ease-out forwards 0.5s';
    }
    
    if (welcomeSubtitle) {
        welcomeSubtitle.innerHTML = `<span>${translations[currentLang].welcome.subtitle}</span>`;
        welcomeSubtitle.style.animation = 'none';
        welcomeSubtitle.offsetHeight;
        welcomeSubtitle.style.animation = 'fadeInUp 1s ease-out forwards 1s';
    }
    
    if (startBtn) {
        startBtn.textContent = currentLang === 'pl' ? 'Rozpocznij' : 'Start';
        startBtn.style.animation = 'none';
        startBtn.offsetHeight;
        startBtn.style.animation = 'fadeInScale 0.8s ease-out forwards 1.5s';
    }
    
    if (langContainer) {
        langContainer.style.animation = 'none';
        langContainer.offsetHeight;
        langContainer.style.animation = 'fadeIn 0.8s ease-out forwards 2s';
    }
}

function updateUI() {
    const title = document.getElementById('title');
    if (title) title.textContent = translations[currentLang].title;

    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) homeMenuItem.textContent = translations[currentLang].home;
    
    const leapYearTitle = document.getElementById('leapYearTitle');
    const yearLabel = document.getElementById('yearLabel');
    const checkBtn = document.getElementById('checkBtn');
    const historyLabel = document.getElementById('historyLabel');
    if (leapYearTitle) leapYearTitle.textContent = translations[currentLang].leapYear.title;
    if (yearLabel) yearLabel.textContent = translations[currentLang].leapYear.prompt;
    if (checkBtn) checkBtn.textContent = translations[currentLang].leapYear.button;
    if (historyLabel) historyLabel.textContent = translations[currentLang].leapYear.history;
    translateHistory();

    const matrixCalcTitle = document.getElementById('matrixCalcTitle');
    const operationLabel = document.getElementById('operationLabel');
    const operationBtn = document.getElementById('operationBtn');
    const computeBtn = document.getElementById('computeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const matrixATitle = document.getElementById('matrixATitle');
    const matrixBTitle = document.getElementById('matrixBTitle');
    const rowsALabel = document.getElementById('rowsALabel');
    const colsALabel = document.getElementById('colsALabel');
    const rowsBLabel = document.getElementById('rowsBLabel');
    const colsBLabel = document.getElementById('colsBLabel');
    const acceptA = document.getElementById('acceptA');
    const acceptB = document.getElementById('acceptB');
    
    if (matrixCalcTitle) matrixCalcTitle.textContent = translations[currentLang].matrixCalc.title;
    if (operationLabel) operationLabel.textContent = translations[currentLang].matrixCalc.operation;
    if (operationBtn) operationBtn.textContent = translations[currentLang].matrixCalc.operations[currentOperation];
    if (computeBtn) computeBtn.textContent = translations[currentLang].matrixCalc.compute;
    if (clearBtn) clearBtn.textContent = translations[currentLang].matrixCalc.clear;
    if (matrixATitle) matrixATitle.textContent = translations[currentLang].matrixCalc.matrix_a;
    if (matrixBTitle) matrixBTitle.textContent = translations[currentLang].matrixCalc.matrix_b;
    if (rowsALabel) rowsALabel.textContent = translations[currentLang].matrixCalc.rows;
    if (colsALabel) colsALabel.textContent = translations[currentLang].matrixCalc.cols;
    if (rowsBLabel) rowsBLabel.textContent = translations[currentLang].matrixCalc.rows;
    if (colsBLabel) colsBLabel.textContent = translations[currentLang].matrixCalc.cols;
    if (acceptA) acceptA.textContent = translations[currentLang].matrixCalc.accept;
    if (acceptB) acceptB.textContent = translations[currentLang].matrixCalc.accept;
    if (resizeBtn) resizeBtn.textContent = translations[currentLang].matrixCalc.buttons.resize;

    const appMenuItem = document.getElementById('appMenuItem');
    const appSubmenuItems = document.querySelectorAll('#appSubmenu .submenu-item');
    if (appMenuItem) appMenuItem.textContent = currentLang === 'pl' ? 'Aplikacje' : 'Applications';
    appSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].leapYear.title;
        if (index === 1) item.textContent = translations[currentLang].matrixCalc.title;
    });
    
    const helpMenuItem = document.getElementById('helpMenuItem');
    const helpSubmenuItems = document.querySelectorAll('#helpSubmenu .submenu-item');
    if (helpMenuItem) helpMenuItem.textContent = currentLang === 'pl' ? 'Pomoc' : 'Help';
    helpSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'O aplikacji' : 'About';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'Instrukcja' : 'Instructions';
    });
    
    const operationMenu = document.getElementById('operationMenu');
    if (operationMenu) {
        operationMenu.innerHTML = '';
        for (const [key, value] of Object.entries(translations[currentLang].matrixCalc.operations)) {
            const item = document.createElement('div');
            item.className = 'operation-menu-item';
            item.textContent = value;
            item.dataset.op = key;
            operationMenu.appendChild(item);
        }
    }
    
    const methodSelector = document.getElementById('methodSelector');
    if (methodSelector) {
        methodSelector.innerHTML = '';
        if (currentOperation === 'solve') {
            for (const [key, value] of Object.entries(translations[currentLang].matrixCalc.methods)) {
                const btn = document.createElement('button');
                btn.className = `method-btn ${key === currentMethod ? 'active' : ''}`;
                btn.textContent = value;
                btn.dataset.method = key;
                btn.addEventListener('click', () => {
                    currentMethod = key;
                    updateMethodButtons();
                });
                methodSelector.appendChild(btn);
            }
            methodSelector.style.display = 'flex';
        } else {
            methodSelector.style.display = 'none';
        }
    }

    const resizeTitle = document.querySelector('.resize-dialog h2');
    if (resizeTitle) resizeTitle.textContent = translations[currentLang].matrixCalc.resize_dialog.title;
    
    const matrixALabel = document.querySelector('.resize-column:nth-child(1) h3');
    if (matrixALabel) matrixALabel.textContent = translations[currentLang].matrixCalc.resize_dialog.matrix_a;
    
    const matrixBLabel = document.querySelector('.resize-column:nth-child(2) h3');
    if (matrixBLabel) matrixBLabel.textContent = translations[currentLang].matrixCalc.resize_dialog.matrix_b;
    
    const rowsLabels = document.querySelectorAll('.size-label');
    rowsLabels.forEach(label => {
        if (label.textContent.includes('Wiersze') || label.textContent.includes('Rows')) {
            label.textContent = translations[currentLang].matrixCalc.resize_dialog.rows;
        } else {
            label.textContent = translations[currentLang].matrixCalc.resize_dialog.cols;
        }
    });
    
    if (acceptResize) acceptResize.textContent = translations[currentLang].matrixCalc.resize_dialog.accept;
    
    if (acceptA) acceptA.textContent = translations[currentLang].matrixCalc.resize_dialog.accept;
    if (acceptB) acceptB.textContent = translations[currentLang].matrixCalc.resize_dialog.accept;
}

function updateHomeUI() {
    const homeMenuItem = document.getElementById('homeMenuItem');
    if (homeMenuItem) homeMenuItem.textContent = translations[currentLang].home;

    const homeTitle = document.querySelector('.home-title');
    const tileLabels = document.querySelectorAll('.tile-label');
    
    if (homeTitle) homeTitle.textContent = translations[currentLang].choose_app;
    
    tileLabels.forEach((label, index) => {
        if (index === 0) label.textContent = translations[currentLang].leapYear.title;
        if (index === 1) label.textContent = translations[currentLang].matrixCalc.title;
    });

    const homeAppMenuItem = document.getElementById('homeAppMenuItem');
    const homeAppSubmenuItems = document.querySelectorAll('#homeAppSubmenu .submenu-item');
    const homeHelpMenuItem = document.getElementById('homeHelpMenuItem');
    const homeHelpSubmenuItems = document.querySelectorAll('#homeHelpSubmenu .submenu-item');

    if (homeAppMenuItem) homeAppMenuItem.textContent = currentLang === 'pl' ? 'Aplikacje' : 'Applications';
    homeAppSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].leapYear.title;
        if (index === 1) item.textContent = translations[currentLang].matrixCalc.title;
    });
    
    if (homeHelpMenuItem) homeHelpMenuItem.textContent = currentLang === 'pl' ? 'Pomoc' : 'Help';
    homeHelpSubmenuItems.forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'O aplikacji' : 'About';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'Instrukcja' : 'Instructions';
    });
}

document.addEventListener('click', (e) => {
    const langMenu = document.querySelector('.lang-menu');
    const langBtn = document.querySelector('.welcome-lang-btn');
    if (langMenu && !langMenu.contains(e.target) && langBtn && !langBtn.contains(e.target)) {
        langMenu.style.display = 'none';
    }
});

document.querySelector('.lang-menu').addEventListener('click', (e) => {
    e.stopPropagation();
});

function initializeUI() {
    // No longer needed here as handled by navigateTo
}