// === ELEMENTS === //
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
const introScreen = document.getElementById('intro-screen');
const portfolio = document.getElementById('portfolio');
const enterBtn = document.getElementById('enter-btn');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

// === CANVAS RESIZE === //
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// === PARTICLE NETWORK === //
const particles = [];
const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 90;
let speedFactor = 2.5; // fast during intro

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 0.5;
    }
    update() {
        this.x += this.vx * speedFactor;
        this.y += this.vy * speedFactor;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 198, 255, 0.5)';
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.strokeStyle = `rgba(0, 198, 255, ${0.12 - dist / 1200})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// === INTRO -> PORTFOLIO TRANSITION === //
enterBtn.addEventListener('click', () => {
    // Start music
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
        musicIcon.className = 'fas fa-pause';
        isPlaying = true;
    }).catch(() => {});
    musicToggle.style.display = 'flex';

    // Fade out intro
    introScreen.style.opacity = '0';
    introScreen.style.transform = 'scale(1.1)';

    // Slow particles for portfolio browsing
    speedFactor = 0.4;

    setTimeout(() => {
        introScreen.style.display = 'none';
        portfolio.classList.remove('hidden');
    }, 800);
});

// === MUSIC TOGGLE === //
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

// === FLASHCARD POP-OUT ON SCROLL === //
const flashcards = document.querySelectorAll('.flashcard');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // only once
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

flashcards.forEach(card => observer.observe(card));
