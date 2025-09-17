// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Active nav highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--accent)';
        }
    });
});

// Glitch effect on hover for hero title
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
        heroTitle.style.animation = 'glitch 0.3s infinite';
    });
    heroTitle.addEventListener('mouseleave', () => {
        heroTitle.style.animation = 'glitch 3s infinite';
    });
}

// Archive items click animation
document.querySelectorAll('.archive-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
});