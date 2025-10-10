// This function must be defined globally to be accessible from loader.js
function initAudioSystem() {
    const audio = document.getElementById('background-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    if (!audio) return;
    let isAudioInitialized = false;
    if (isAudioInitialized) return;

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
    isAudioInitialized = true;

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

// OPTIMIZED: Removed performance-intensive JS animations. This will be replaced by CSS transitions.
window.applyInteractiveEffects = function(element) {
    if (!element) return;
    if (element.querySelector('.glint')) return;
    const glint = document.createElement('div');
    glint.className = 'glint';
    element.appendChild(glint);
};

window.createBackArrows = function() {
    const projectsColumn = document.querySelector('.column.projects');
    if (!projectsColumn) return;
    projectsColumn.querySelectorAll('.project-detail').forEach(detail => {
        if (detail.querySelector('.back-arrow')) return;
        const backBtn = document.createElement('span');
        backBtn.textContent = '←';
        backBtn.classList.add('back-arrow');
        backBtn.setAttribute('aria-label', 'Back to projects');
        detail.querySelector('.project-description').prepend(backBtn);
    });
};

// OPTIMIZED: Removed performance-intensive JS animations. This will be replaced by CSS transitions.
window.init3dCards = function() {
    // The 3D effect is now handled by CSS for better performance.
};

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mainContent = document.getElementById('main-content');
    const scrollArrow = document.querySelector('.scroll-arrow');
    const columns = document.querySelectorAll('.main-columns .column');
    const projectsColumn = document.querySelector('.column.projects');
    let hasScrolledToColumns = false;
    let touchStartY = 0;

    const scrollToElement = (targetElement) => {
        if (!targetElement) return;
        const navbarHeight = navbar.offsetHeight;
        window.scrollTo({ top: targetElement.offsetTop - navbarHeight, behavior: 'smooth' });
    };

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        navbar.classList.toggle('shrink', scrollPosition > 100);
        const scrollIndicator = document.querySelector('.scroll-down-indicator');
        if (scrollIndicator) {
            scrollIndicator.classList.toggle('scrolled', scrollPosition > 20);
        }
        if (!hasScrolledToColumns && scrollPosition > 10 && scrollPosition < 50) {
            hasScrolledToColumns = true;
            scrollToElement(mainContent);
        }
        if (scrollPosition < 5) hasScrolledToColumns = false;
    };
    
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e) => {
        if (hasScrolledToColumns) return;
        if (touchStartY - e.touches[0].clientY > 15 && window.scrollY < 30) {
            hasScrolledToColumns = true;
            scrollToElement(mainContent);
        }
    };

    const handleColumnClick = (event) => {
        const clickedColumn = event.target.closest('.column');
        if (!clickedColumn) return;
        const isAlreadyActive = clickedColumn.classList.contains('active');
        const activeColumn = document.querySelector('.column.active');
        if (activeColumn && !isAlreadyActive) {
            const contentToFade = activeColumn.querySelector('.column-content, .subpages, .project-detail.visible');
            if (contentToFade) {
                contentToFade.classList.add('fade-out');
            }
        }
        setTimeout(() => {
            columns.forEach(col => col.classList.remove('active'));
            if (!isAlreadyActive) {
                clickedColumn.classList.add('active');
                const contentToFadeIn = clickedColumn.querySelector('.column-content, .subpages');
                if (contentToFadeIn) {
                    contentToFadeIn.classList.remove('fade-out');
                    contentToFadeIn.classList.add('fade-in');
                }
                setTimeout(() => scrollToElement(clickedColumn), 50);
                if (clickedColumn.classList.contains('projects')) resetProjectsView();
                if (clickedColumn.classList.contains('skills')) animateSkillBars();
            }
        }, isAlreadyActive ? 0 : 150);
    };

    const animateSkillBars = () => {
        const skillLevelMap = { 'None': '5%', 'Basic': '25%', 'Intermediate': '50%', 'Proficient': '75%', 'Expert': '100%' };
        setTimeout(() => {
            document.querySelectorAll('.skill').forEach(skill => {
                const level = skill.dataset.level;
                const targetWidth = skillLevelMap[level] || '0%';
                const barFill = skill.querySelector('.skill-bar-fill');
                barFill.style.width = '0%';
                setTimeout(() => { barFill.style.width = targetWidth; }, 100);
            });
        }, 300);
    };

    const toggleVisibility = (element, show, useFlex = false) => {
        if (!element) return;
        if (show) {
            element.classList.remove('hidden', 'fade-out');
            element.classList.add(useFlex ? 'flex-visible' : 'visible', 'fade-in');
        } else {
            element.classList.remove('visible', 'flex-visible', 'fade-in');
            element.classList.add('hidden', 'fade-out');
        }
    };

    const resetProjectsView = () => {
        const subpagesContainer = projectsColumn.querySelector('.subpages');
        const projectDetails = projectsColumn.querySelectorAll('.project-detail');
        toggleVisibility(subpagesContainer, true, true);
        projectDetails.forEach(detail => toggleVisibility(detail, false));
    };

    const handleProjectSubpageClick = (event) => {
        const subpage = event.target.closest('.subpage');
        if (!subpage) return;
        event.stopPropagation();
        const targetId = subpage.dataset.target;
        const targetProject = document.getElementById(targetId);
        const subpagesContainer = projectsColumn.querySelector('.subpages');
        toggleVisibility(subpagesContainer, false);
        toggleVisibility(targetProject, true);
    };
    
    const handleProjectBackArrowClick = (event) => {
        const backArrow = event.target.closest('.back-arrow');
        if (!backArrow) return;
        event.stopPropagation();
        const projectDetail = backArrow.closest('.project-detail');
        toggleVisibility(projectDetail, false);
        const subpagesContainer = projectsColumn.querySelector('.subpages');
        toggleVisibility(subpagesContainer, true, true);
    };

    const attachEventListeners = () => {
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        if (scrollArrow) scrollArrow.addEventListener('click', (e) => { e.preventDefault(); scrollToElement(mainContent); });
        if (mainContent) mainContent.addEventListener('click', handleColumnClick);
        if (projectsColumn) {
            projectsColumn.addEventListener('click', handleProjectSubpageClick);
            projectsColumn.addEventListener('click', handleProjectBackArrowClick);
        }

        const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
        if (mobileMenuTrigger) {
            mobileMenuTrigger.addEventListener('click', () => {
                navbar.classList.toggle('dropdown-open');
            });
        }
    };

    attachEventListeners();
});