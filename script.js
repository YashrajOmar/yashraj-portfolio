// Elements
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

const introScreen = document.getElementById('intro-screen');
const portfolioContent = document.getElementById('portfolio-content');
const aiTextNode = document.getElementById('ai-text');
const typingIndicator = document.getElementById('typing-indicator');
const enterBtn = document.getElementById('enter-btn');

// --- PARTICLES BACKGROUND --- //
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particlesArray = [];
const numParticles = window.innerWidth < 768 ? 40 : 80;
let particleSpeedModifier = 3; // Faster during intro

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5);
        this.speedY = (Math.random() - 0.5);
    }
    update() {
        this.x += this.speedX * particleSpeedModifier;
        this.y += this.speedY * particleSpeedModifier;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 210, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < numParticles; i++) particlesArray.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {
                ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 - distance / 1000})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// --- VOICE AI INTRO SIMULATION --- //
const introLines = [
    "Establishing secure connection to server...",
    "Authentication verified: Guest User.",
    "Loading Yashraj Omar's Engineering Profile...",
    "System Ready."
];

let currentLine = 0;

function typeLine(text, callback) {
    aiTextNode.innerHTML = "";
    typingIndicator.style.display = 'none';
    let i = 0;
    const interval = setInterval(() => {
        aiTextNode.innerHTML += text.charAt(i);
        i++;
        if (i > text.length - 1) {
            clearInterval(interval);
            setTimeout(callback, 600); // pause after line
        }
    }, 40); // typing speed
}

function runIntroSequence() {
    if (currentLine < introLines.length - 1) {
        typingIndicator.style.display = 'block'; // 'thinking'
        aiTextNode.innerHTML = "";
        
        setTimeout(() => {
            typeLine(introLines[currentLine], () => {
                currentLine++;
                runIntroSequence();
            });
        }, 1000); // thinking delay
    } else {
        // Last line "System Ready."
        typingIndicator.style.display = 'none';
        typeLine(introLines[currentLine], () => {
            enterBtn.classList.remove('hidden');
        });
    }
}

// Start simulation on load
document.addEventListener('DOMContentLoaded', () => {
    runIntroSequence();
});

// User enters portfolio
enterBtn.addEventListener('click', () => {
    // Start music on first interaction
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
        isPlaying = true;
    }).catch(e => console.log("Audio play failed:", e));

    musicToggle.style.display = 'flex';

    // Transition UI
    introScreen.style.opacity = '0';
    introScreen.style.transform = 'scale(1.1)';
    
    // Slow down particles
    particleSpeedModifier = 0.5;

    setTimeout(() => {
        introScreen.classList.add('hidden');
        portfolioContent.classList.remove('hidden');
    }, 1000);
});

// --- MUSIC TOGGLE --- //
let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    } else {
        bgMusic.play();
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
});
