// script.js

// Audio System Initialization
function initAudioSystem() {
    const audio = document.getElementById('background-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    if (!audio) return;

    // Prevent multiple initializations
    if (window.isAudioInitialized) return;

    audio.volume = 0;
    const targetVolume = 0.05; // Music volume reduced to 5%
    
    const fadeAudioIn = setInterval(() => {
        if (audio.paused) { clearInterval(fadeAudioIn); return; }
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(targetVolume, audio.volume + 0.01);
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeAudioIn);
        }
    }, 80);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    audio.muted = false;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            startVisualizer(analyser);
        }).catch(error => console.error("Audio playback failed:", error));
    }
    window.isAudioInitialized = true;

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPlaying = !audio.paused;
            if (isPlaying) {
                audio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            } else {
                audio.play();
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Scroll Logic ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileDropdown = document.getElementById('mobile-dropdown');

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (!mobileDropdown.classList.contains('hidden')) {
                    mobileDropdown.classList.add('hidden');
                }
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', () => {
            mobileDropdown.classList.toggle('hidden');
        });
    }

    // Scroll Spy & Navbar Styling
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + navbar.offsetHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        // Optional: Highlight active link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    

    // --- Responsive Control Relocation (Music/Theme) ---
    const musicPlayer = document.getElementById('music-player-container');
    const themeSwitcher = document.getElementById('theme-switcher');
    const socialLinks = document.querySelector('.nav-right .social-links');

    const musicPlayerMobile = document.getElementById('music-player-container-mobile');
    const themeSwitcherMobile = document.getElementById('theme-switcher-mobile');
    const socialLinksMobile = document.querySelector('.social-links-mobile');

    const desktopControls = document.querySelector('.desktop-controls');
    const navRight = document.querySelector('.nav-right');

    const setupMenuLayout = () => {
        if (window.innerWidth <= 768) {
            // Move controls to mobile dropdown
            if (musicPlayer && musicPlayerMobile && !musicPlayerMobile.contains(musicPlayer)) {
                musicPlayerMobile.appendChild(musicPlayer);
            }
            if (themeSwitcher && themeSwitcherMobile && !themeSwitcherMobile.contains(themeSwitcher)) {
                themeSwitcherMobile.appendChild(themeSwitcher);
            }
            if (socialLinks && socialLinksMobile && !socialLinksMobile.contains(socialLinks)) {
                socialLinksMobile.appendChild(socialLinks);
            }
        } else {
            // Move controls back to desktop view
            if (musicPlayer && desktopControls && !desktopControls.contains(musicPlayer)) {
                desktopControls.insertBefore(musicPlayer, themeSwitcher);
            }
            if (themeSwitcher && desktopControls && !desktopControls.contains(themeSwitcher)) {
                desktopControls.appendChild(themeSwitcher);
            }
            if (socialLinks && navRight && !navRight.contains(socialLinks)) {
                navRight.appendChild(socialLinks);
            }
        }
    };

    setupMenuLayout();
    window.addEventListener('resize', setupMenuLayout);
});
