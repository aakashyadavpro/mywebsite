// ==========================================================================
// SKYWARD HR - INTERACTIVE ENGINE & UI ENHANCEMENTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- DARK / LIGHT MODE ENGINE ----------
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('skyward_theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('skyward_theme', newTheme);
            updateThemeIcon(newTheme);
            showToast(`Switched to ${newTheme.toUpperCase()} mode`);
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

    // ---------- MOBILE NAVIGATION MENU ----------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile nav on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // ---------- STICKY HEADER SCROLL SHADOW ----------
    const mainHeader = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (mainHeader) {
            if (window.scrollY > 20) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }
    });

    // ---------- ACTIVE NAVIGATION SCROLL SPY ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 180;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ---------- TESTIMONIAL CAROUSEL ENGINE ----------
    let currentIndex = 0;
    const track = document.getElementById('testimonialTrack');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonials.length;
    const dotsContainer = document.getElementById('carouselDots');
    const nextBtn = document.getElementById('nextTestimonial');
    const prevBtn = document.getElementById('prevTestimonial');

    function createDots() {
        if (!dotsContainer || totalTestimonials === 0) return;
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
    }, 6000);

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            updateCarousel();
        }, 6000);
    }

    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        testimonialContainer.addEventListener('mouseleave', () => resetAutoPlay());
    }

    createDots();

    // ---------- COUNTER NUMERICAL ANIMATION ----------
    const counterElements = document.querySelectorAll('.counter');
    let hasCounted = false;

    function runCounters() {
        counterElements.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (isNaN(target)) return;
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    if (target >= 1000) {
                        counter.innerText = target.toLocaleString('en-US') + '+';
                    } else if (target === 98) {
                        counter.innerText = target + '%';
                    } else if (target === 24) {
                        counter.innerText = '24-48h';
                    } else {
                        counter.innerText = target + '+';
                    }
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(current).toLocaleString('en-US');
                }
            }, stepTime);
        });
    }

    const counterSection = document.querySelector('.metrics-bar');
    if (counterSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    runCounters();
                    hasCounted = true;
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(counterSection);
    }

    // ---------- BACK TO TOP BUTTON ----------
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 400) {
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

    // ---------- FILE UPLOAD ENHANCEMENT ----------
    const dropArea = document.getElementById('dropArea');
    const resumeFileInput = document.getElementById('resumeFile');
    const fileInfo = document.getElementById('fileInfo');

    if (dropArea && resumeFileInput) {
        dropArea.addEventListener('click', () => resumeFileInput.click());

        resumeFileInput.addEventListener('change', () => {
            if (resumeFileInput.files && resumeFileInput.files[0]) {
                fileInfo.textContent = `Attached: ${resumeFileInput.files[0].name} (${(resumeFileInput.files[0].size / 1024).toFixed(1)} KB)`;
                fileInfo.style.color = '#10B981';
                fileInfo.style.fontWeight = '600';
            }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropArea.classList.remove('dragover');
            });
        });

        dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                resumeFileInput.files = files;
                fileInfo.textContent = `Attached: ${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`;
                fileInfo.style.color = '#10B981';
                fileInfo.style.fontWeight = '600';
            }
        });
    }

    // ---------- FORM HANDLING WITH TOAST NOTIFICATIONS ----------
    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toastNotification');
        if (!toast) return;
        toast.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-info-circle'}" style="margin-right: 8px; color: ${isSuccess ? '#10B981' : '#F59E0B'}"></i> ${message}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const candidate = document.getElementById('candidateName').value;
            showToast(`Thank you ${candidate}! Application submitted to Skyward HR.`);
            jobForm.reset();
            if (fileInfo) {
                fileInfo.textContent = 'Supported formats: PDF, DOC, DOCX';
                fileInfo.style.color = '';
                fileInfo.style.fontWeight = '';
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Inquiry sent! Our corporate account manager will contact you within 24h.');
            contactForm.reset();
        });
    }

    // ---------- SCROLL REVEAL OBSERVER ----------
    const revealElements = document.querySelectorAll('.service-box, .industry-card, .testimonial-container, .feature-card, .metric-item, .careers-card, .perk-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

});
