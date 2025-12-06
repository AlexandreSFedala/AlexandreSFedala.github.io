// script.js - Main Application Logic for New Layout

// Audio System
function initAudioSystem() {
    const audio = document.getElementById('background-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    if (!audio) return;

    // Fade in
    audio.volume = 0;
    const targetVolume = 0.05;
    const fadeAudioIn = setInterval(() => {
        if (audio.paused) { clearInterval(fadeAudioIn); return; }
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(targetVolume, audio.volume + 0.01);
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeAudioIn);
        }
    }, 80);

    const playAudio = () => {
        audio.play().then(() => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }).catch(err => console.error("Audio playback failed:", err));
    };

    // User interaction required to play audio usually, handled by initial click in loader
    playAudio();

    if (playPauseBtn) {
        // Clone to remove old listeners
        const newBtn = playPauseBtn.cloneNode(true);
        playPauseBtn.parentNode.replaceChild(newBtn, playPauseBtn);

        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.paused) {
                playAudio();
            } else {
                audio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        });
    }
}

// Scroll Spy & Sidebar Interaction
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link:not(.cv-link)');
    const sidebar = document.getElementById('sidebar');
    const mobileTrigger = document.getElementById('mobile-menu-trigger');
    const mobileHeader = document.getElementById('mobile-header');

    // Scroll Spy
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // -100 offset for better triggering
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
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
                // Close mobile sidebar if open
                sidebar.classList.remove('active');

                // Account for mobile header height if on mobile
                const headerOffset = window.innerWidth <= 900 ? 60 : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileTrigger) {
        mobileTrigger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 &&
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !mobileTrigger.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    
    // Map CTA button listener (needs to be attached dynamically or delegated)
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'map-cta-btn') {
            const mapModal = document.getElementById('map-modal');
            if (mapModal) {
                mapModal.classList.remove('hidden');
                // Trigger map resize event to ensure it renders correctly after being hidden
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    // Dispatch custom event to tell map.js to re-center if needed
                }, 100);
            }
        }
    });
});

// Expose initAudioSystem for loader
window.initAudioSystem = initAudioSystem;
