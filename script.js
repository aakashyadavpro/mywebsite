// ========== DARK MODE TOGGLE - FIXED ==========
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on load
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ========== ACTIVE NAVIGATION LINK ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ========== TESTIMONIAL CAROUSEL - FIXED ==========
let currentIndex = 0;
const track = document.getElementById('testimonialTrack');
const testimonials = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonials.length;
const dotsContainer = document.getElementById('carouselDots');

function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateCarousel() {
    if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

const nextBtn = document.getElementById('nextTestimonial');
const prevBtn = document.getElementById('prevTestimonial');

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        updateCarousel();
        resetAutoPlay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
        updateCarousel();
        resetAutoPlay();
    });
}

let autoPlayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalTestimonials;
    updateCarousel();
}, 5000);

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        updateCarousel();
    }, 5000);
}

const testimonialContainer = document.querySelector('.testimonial-container');
if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    testimonialContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            updateCarousel();
        }, 5000);
    });
}

createDots();

// ========== BACK TO TOP BUTTON ==========
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== SCROLL REVEAL ANIMATIONS ==========
const revealElements = document.querySelectorAll('.service-box, .industry-card, .testimonial-card, .careers-form, .contact-container, .about-content');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#" || targetId === "") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, targetId);
        }
    });
});

// ========== FORM HANDLING ==========
const jobForm = document.getElementById('jobForm');
if (jobForm) {
    jobForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ Application received! Our HR team will contact you shortly.');
        jobForm.reset();
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('📩 Thank you for reaching out! We will respond within 24 hours.');
        contactForm.reset();
    });
}