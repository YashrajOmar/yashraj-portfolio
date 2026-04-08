const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

const introScreen = document.getElementById('intro-screen');
const portfolioContent = document.getElementById('portfolio-content');
const enterBtn = document.getElementById('enter-btn');
const bubblesContainer = document.getElementById('bubbles-container');

// --- PARTICLES --- //
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let particlesArray = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 210, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 100; i++) particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// --- INTRO SEQUENCE --- //
setTimeout(() => {
    enterBtn.classList.remove('hidden');
}, 3000);

enterBtn.addEventListener('click', () => {
    bgMusic.play().catch(() => {});
    musicToggle.style.display = 'block';
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.classList.add('hidden');
        portfolioContent.classList.remove('hidden');
    }, 1000);
});

// --- BUBBLE ON SCROLL --- //
const icons = ['fa-code', 'fa-terminal', 'fa-database', 'fa-microchip', 'fa-brain'];
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && Math.random() > 0.8) {
        createBubble();
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

function createBubble() {
    const bubble = document.createElement('div');
    const icon = icons[Math.floor(Math.random() * icons.length)];
    bubble.className = `bubble fas ${icon}`;
    
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight; // start from bottom of viewport
    
    bubble.style.left = `${x}px`;
    bubble.style.bottom = `0px`;
    bubble.style.fontSize = `${Math.random() * 20 + 10}px`;
    
    bubblesContainer.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 1500);
}

// Music toggle
let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.className = 'fas fa-play';
    } else {
        bgMusic.play();
        musicIcon.className = 'fas fa-pause';
    }
    isPlaying = !isPlaying;
});
