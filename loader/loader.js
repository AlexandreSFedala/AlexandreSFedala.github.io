// loader/loader.js - Merged with "Click to Begin" functionality

// Vibrant color palette from your original code
const COLORS = [ "#FF5252", "#FFB300", "#00E676", "#40C4FF", "#7C4DFF", "#FF4081", "#FFD600", "#69F0AE", "#536DFE", "#FF6E40" ];
// Symbols to use from your original code
const SYMBOLS = [ "⏾", "⏏", "⏻", "⎌", "⎈", "⎇", "⎙", "⎋", "⇦", "⇨", "⇧", "⇩", "⌫", "⌦", "⎉", "⎆", "⎄", "⎗", "⎘", "⎚", "•", "∙", "§", "¤", "⌁" ];
// Status messages to display from your original code
const STATUS_MESSAGES = [ "Loading Header", "Loading Content", "Loading Languages", "Loading Interactive Elements", "Loading Animations", "Generating Flashcards", "Loading PDFs", "Done !" ];

function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
function randomSymbol() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]; }

function createLoaderSymbols(count = 12) {
    const container = document.querySelector('.loader-symbols');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'loader-symbol';
        span.textContent = randomSymbol();
        span.style.color = randomColor();
        container.appendChild(span);
    }
}

function createStatusText() {
    const overlay = document.getElementById('loader-overlay');
    if (!overlay || overlay.querySelector('.loader-status')) return;
    const statusContainer = document.createElement('div');
    statusContainer.className = 'loader-status';
    statusContainer.innerHTML = '<div class="status-text"></div>';
    overlay.appendChild(statusContainer);
}

function updateStatus(message) {
    const statusText = document.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = message;
        if (message === "Done !") {
            statusText.classList.add('done-animation');
        } else {
            statusText.classList.remove('done-animation');
        }
    }
}

function animateSymbols() {
    const symbols = document.querySelectorAll('.loader-symbol');
    if (symbols.length === 0) return;
    let idx = 0;
    // Set an interval that can be cleared later if needed
    const animationInterval = setInterval(() => {
        if (document.body.classList.contains('loading')) {
            symbols.forEach(s => s.classList.remove('jumping'));
            if (symbols[idx]) {
                symbols[idx].classList.add('jumping');
            }
            idx = (idx + 1) % symbols.length;
        } else {
            clearInterval(animationInterval);
        }
    }, 120);
}

// This is your original loader logic, now it calls a function when it's done.
function startLoader(onLoaderFinished) {
    createLoaderSymbols();
    createStatusText();
    animateSymbols();

    const duration = 2500;
    const messageCount = STATUS_MESSAGES.length;
    
    STATUS_MESSAGES.forEach((message, i) => {
        const messageTime = (duration / messageCount) * (i);
        setTimeout(() => {
            updateStatus(message);
            
            if (i === messageCount - 1) { // When "Done !" is shown
                setTimeout(onLoaderFinished, 750); // Wait a bit after "Done !" then call the next step
            }
        }, messageTime);
    });
}

// Main logic execution
document.addEventListener('DOMContentLoaded', () => {
    const loaderOverlay = document.getElementById('loader-overlay');

    // Preload the aureole animation by briefly adding and removing a hidden aureole element.
    if (loaderOverlay) {
        const preloadAureole = document.createElement('div');
        preloadAureole.className = 'aureole';
        preloadAureole.style.position = 'absolute';
        preloadAureole.style.opacity = '0';
        preloadAureole.style.pointerEvents = 'none';
        loaderOverlay.appendChild(preloadAureole);
        setTimeout(() => {
            preloadAureole.remove();
        }, 50);
    }

    const clickPrompt = document.getElementById('click-prompt');
    const mainContent = document.getElementById('main-website-content');
    const loaderSymbols = document.querySelector('.loader-symbols');
    const statusContainer = document.querySelector('.loader-status');

    const showClickPrompt = () => {
        if (loaderSymbols) loaderSymbols.style.opacity = '0';
        if (statusContainer) statusContainer.style.opacity = '0';
        
        setTimeout(() => {
            if (loaderSymbols) loaderSymbols.style.display = 'none';
            if (statusContainer) statusContainer.style.display = 'none';
            if (clickPrompt) clickPrompt.classList.remove('hidden');
        }, 500);
    };
    
    if (loaderOverlay) {
        startLoader(showClickPrompt);
    }

    const languageButtons = document.querySelectorAll('.language-button');
    const buttonListeners = new Map();

    languageButtons.forEach(button => {
        const glint = document.createElement('div');
        glint.className = 'glint';
        button.appendChild(glint);

        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            button.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        };

        const handleMouseLeave = () => {
            button.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        };

        buttonListeners.set(button, { handleMouseMove, handleMouseLeave });

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            // MODIFIED: Call the new global render function
            if (typeof window.renderAllContent === 'function') {
                window.renderAllContent(lang);
            }

            languageButtons.forEach(btn => {
                btn.style.pointerEvents = 'none';
                const listeners = buttonListeners.get(btn);
                if (listeners) {
                    btn.removeEventListener('mousemove', listeners.handleMouseMove);
                    btn.removeEventListener('mouseleave', listeners.handleMouseLeave);
                }
            });

            const selectedButton = button;
            const unselectedButton = Array.from(languageButtons).find(btn => btn !== selectedButton);

            if (unselectedButton) {
                unselectedButton.classList.add('fading-out');
            }
            selectedButton.classList.add('selected');

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const buttonRect = selectedButton.getBoundingClientRect();

            const currentX = buttonRect.left + buttonRect.width / 2;
            const currentY = buttonRect.top + buttonRect.height / 2;

            const targetX = screenWidth / 2;
            const targetY = screenHeight / 2;

            const translateX = targetX - currentX;
            const translateY = targetY - currentY;

            selectedButton.style.transform = '';
            void selectedButton.offsetHeight;
            selectedButton.style.transform = `translate(${translateX}px, ${translateY}px)`;

            selectedButton.addEventListener('transitionend', () => {
                const AUREOLE_COUNT = 5;
                const STAGGER_DELAY = 150;
                const { width, height } = buttonRect;

                for (let i = 0; i < AUREOLE_COUNT; i++) {
                    const aureole = document.createElement('div');
                    aureole.className = 'aureole';
                    aureole.style.width = `${width}px`;
                    aureole.style.height = `${height}px`;
                    aureole.style.animationDelay = `${i * STAGGER_DELAY}ms`;
                    loaderOverlay.appendChild(aureole);
                }

                if (typeof initAudioSystem === 'function') {
                    initAudioSystem();
                }

                setTimeout(() => {
                    if (mainContent) {
                        mainContent.style.display = 'block';
                        setTimeout(() => {
                            document.body.classList.remove('loading');
                            mainContent.classList.remove('hidden');
                        }, 20);
                    }
                }, STAGGER_DELAY * AUREOLE_COUNT);

                setTimeout(() => {
                    if (loaderOverlay) {
                        loaderOverlay.style.opacity = '0';
                    }
                }, STAGGER_DELAY * AUREOLE_COUNT + 300);

                const totalAnimationTime = (AUREOLE_COUNT * STAGGER_DELAY) + 1500;
                setTimeout(() => {
                    if (loaderOverlay) {
                        loaderOverlay.remove();
                    }
                }, totalAnimationTime);

            }, { once: true });
        });
    });
});