// Animated background
const canvas = document.getElementById('mathBg');
const ctx = canvas.getContext('2d');
const symbols = ['π', '√', '∑', '∆', '∫', '∂', '∇', '+', '×', '[aᵢⱼ]', '-'];
const particles = [];
const maxParticles = 300;
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

function ensureTranslationsLoaded() {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded!');
        return false;
    }
    return true;
}

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

document.querySelector('.welcome-screen').addEventListener('click', function(e) {
    if (!e.target.closest('.welcome-lang-btn')) {
        startApplication();
    }
});

document.addEventListener('keydown', function(e) {
    if (document.querySelector('.welcome-screen') && !document.querySelector('.welcome-screen').classList.contains('hidden')) {
        startApplication();
    }
});

function startApplication() {
    document.querySelector('.welcome-screen').classList.add('hidden');
    currentScreen = "home";
    document.querySelector('.home-screen').style.display = 'flex';
    document.getElementById('globalSideMenu').classList.remove('hidden');
    document.getElementById('globalSideMenu').classList.remove('open');

    initializeUI();
    
    document.querySelector('.welcome-lang-btn').style.display = 'none';
    
    const navBar = document.querySelector('.nav-bar');
    if (navBar) {
        navBar.style.display = 'flex';
        
        navBar.style.animation = 'none';
        navBar.offsetHeight;
        navBar.style.animation = 'slideInRight 0.5s ease-out forwards';
        
        const navButtons = navBar.querySelectorAll('.nav-btn');
        navButtons.forEach((btn, index) => {
            btn.style.display = 'flex';
            btn.style.animation = 'none';
            btn.offsetHeight;
            btn.style.animation = `slideInButtons 0.3s ease-out forwards ${index * 0.1}s`;
        });
    }
    
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.style.display = 'block';
    }

    const langMenu = document.querySelector('.nav-bar .lang-menu');
    langMenu?.addEventListener('click', (e) => {
        if (e.target.dataset.lang) {
            if (!ensureTranslationsLoaded()) return;
            switchLanguage(e.target.dataset.lang);
        }
    });
    
    setTimeout(() => {
        document.querySelector('.welcome-screen').style.display = 'none';
    }, 500);
}

function backToHome() {
    currentScreen = "home";
    document.body.classList.remove('user-profile-active');
    document.querySelector('.home-screen').style.display = 'flex';
    document.querySelector('.app-container').style.display = 'none';
    document.getElementById('globalSideMenu').classList.remove('hidden');
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    const globalSideMenu = document.getElementById('globalSideMenu');
    if (globalSideMenu) {
        globalSideMenu.classList.remove('hidden');
        globalSideMenu.classList.remove('open');
    }
    
    if (menuBtn) menuBtn.style.display = 'block';
    updateHomeUI();
    initializeUI();
}
 
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', function() {
        const app = this.dataset.app;
        currentScreen = "app";
        document.querySelector('.home-screen').style.display = 'none';
        document.querySelector('.app-container').style.display = 'block';
        
        document.querySelectorAll('.app-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(app + 'App').classList.add('active');

        // Zresetuj stan menu i przycisku
        const globalSideMenu = document.getElementById('globalSideMenu');
        const menuBtn = document.getElementById('menuBtn');
        
        if (globalSideMenu) {
            globalSideMenu.classList.remove('open');
            globalSideMenu.classList.remove('hidden');
        }
        
        if (menuBtn) {
            menuBtn.style.display = 'block';
            menuBtn.style.opacity = '1';
            menuBtn.style.pointerEvents = 'auto';
        }
        
        updateUI();
        initializeUI();
    });
});

function showUserProfile() {
    currentScreen = "app";
    document.querySelector('.welcome-screen').style.display = 'none';
    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
    document.querySelectorAll('.app-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('userProfileApp').classList.add('active');
    
    const globalSideMenu = document.getElementById('globalSideMenu');
    if (globalSideMenu) {
        globalSideMenu.classList.remove('open');
    }
    
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.style.display = 'block';
    }
    
    updateUI();
}

function optimizeProfilePage() {
    const profileContainer = document.querySelector('.user-profile-container');
    if (!profileContainer) return;

    profileContainer.style.position = 'fixed';
    profileContainer.style.top = '0';
    profileContainer.style.left = '0';
    profileContainer.style.width = '100%';
    profileContainer.style.height = '100%';
    profileContainer.style.overflowY = 'auto';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(profileContainer);
    observer.observe(document.querySelector('.user-avatar'));
}

function createWaterDrops() {
    const container = document.querySelector('.user-profile-container');
    if (!container) return;
    
    const waterEffect = document.createElement('div');
    waterEffect.className = 'water-effect';
    container.appendChild(waterEffect);
    
    for (let i = 0; i < 8; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-drop';
        
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.width = `${150 + Math.random() * 300}px`;
        drop.style.height = drop.style.width;
        drop.style.animationDelay = `${Math.random() * 5}s`;
        drop.style.animationDuration = `${3 + Math.random() * 7}s`;
        
        waterEffect.appendChild(drop);
    }
}

function updateWelcomeScreen() {
    if (!ensureTranslationsLoaded()) return;

    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    const startBtn = document.querySelector('.start-btn');

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
    
    const langContainer = document.querySelector('.welcome-screen .lang-btn-container');
    if (langContainer) {
        langContainer.style.animation = 'none';
        langContainer.offsetHeight;
        langContainer.style.animation = 'fadeIn 0.8s ease-out forwards 2s';
    }
}

document.addEventListener('click', function(e) {
    const langMenu = document.querySelector('.lang-menu');
    const langBtn = document.querySelector('.welcome-lang-btn');
    
    if (langMenu && !langMenu.contains(e.target) && !langBtn.contains(e.target)) {
        langMenu.style.display = 'none';
    }
});

document.querySelector('.lang-menu').addEventListener('click', function(e) {
    e.stopPropagation();
});

function initializeUI() {
    optimizeProfilePage();
    createWaterDrops();
    const globalSideMenu = document.getElementById('globalSideMenu');
    const menuBtn = document.getElementById('menuBtn');

    if (currentScreen === "welcome") {
        if (menuBtn) {
            menuBtn.style.display = 'none';
            menuBtn.style.opacity = '0';
            menuBtn.style.pointerEvents = 'none';
        }
        if (globalSideMenu) {
            globalSideMenu.classList.add('hidden');
            globalSideMenu.classList.remove('open');
        }
    } else {
        if (menuBtn) {
            menuBtn.style.display = 'block';
            menuBtn.style.opacity = '1';
            menuBtn.style.pointerEvents = 'auto';
        }
        if (globalSideMenu) {
            globalSideMenu.classList.remove('hidden');
            globalSideMenu.classList.remove('open');
        }
    }
}