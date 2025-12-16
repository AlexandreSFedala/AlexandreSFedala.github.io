// script.js - Refined Interaction Logic

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Scroll Logic ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.content-section'); // Target our new section class
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileMenu = document.getElementById('mobile-menu'); // Updated ID

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Spy
        let current = '';
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight + 1, // Offset slightly
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuTrigger && mobileMenu) {
        mobileMenuTrigger.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Animate hamburger to X? (Optional refinement)
        });
    }

    // --- Intersection Observer for Fade-Up Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.subpage, .skills-category, .carousel-container, .hero-content');

    // Apply initial styles and observe
    animatedElements.forEach(el => {
        // We set initial state in CSS via classes or inline here if needed
        // But our CSS @keyframes handle specific ones. For generic scroll reveal:
        if (!el.classList.contains('carousel-slide')) { // Exclude carousel slides as they handle themselves
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });
});

// Remove audio system completely as requested
window.initAudioSystem = function() {
    // No-op
    console.log("Audio system removed per redesign request.");
};
