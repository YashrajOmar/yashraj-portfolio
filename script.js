const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');

// Resize canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Particle System for Fireworks
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.95;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += 0.05; // gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

let particles = [];

function createFirework(x, y) {
    const particleCount = 50 + Math.random() * 50;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Automatic fireworks
function autoFireworks() {
    if (Math.random() < 0.03) {
        createFirework(
            Math.random() * canvas.width,
            Math.random() * (canvas.height * 0.7)
        );
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(15, 12, 41, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    autoFireworks();

    particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
            particle.update();
            particle.draw();
        } else {
            particles.splice(index, 1);
        }
    });
}

// Interactive fireworks
window.addEventListener('mousedown', (e) => {
    createFirework(e.clientX, e.clientY);
});

// Music Toggle
let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Play Music';
        musicToggle.classList.remove('active');
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        musicIcon.textContent = '⏸️';
        musicText.textContent = 'Pause Music';
        musicToggle.classList.add('active');
    }
    isPlaying = !isPlaying;
});

// Start animation
animate();

// Initial Fade-in effect
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.profile-card').style.opacity = '0';
    document.querySelector('.profile-card').style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.querySelector('.profile-card').style.transition = 'all 1s ease-out';
        document.querySelector('.profile-card').style.opacity = '1';
        document.querySelector('.profile-card').style.transform = 'translateY(0)';
    }, 500);
});
