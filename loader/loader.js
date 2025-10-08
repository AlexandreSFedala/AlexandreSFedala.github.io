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
    const clickPrompt = document.getElementById('click-prompt');
    const mainContent = document.getElementById('main-website-content');
    const loaderSymbols = document.querySelector('.loader-symbols');
    const statusContainer = document.querySelector('.loader-status');
    const promptText = document.querySelector('.prompt-text');

    // This function is called after the loading animation finishes
    const showClickPrompt = () => {
        if (loaderSymbols) loaderSymbols.style.opacity = '0';
        if (statusContainer) statusContainer.style.opacity = '0';
        
        setTimeout(() => {
            if (loaderSymbols) loaderSymbols.style.display = 'none';
            if (statusContainer) statusContainer.style.display = 'none';
            if (clickPrompt) clickPrompt.classList.remove('hidden');
        }, 500);
    };
    
    // Only run the loader if the overlay exists
    if (loaderOverlay) {
        startLoader(showClickPrompt); // Run your animation, then show the prompt
    }

    const languageButtons = document.querySelectorAll('.language-button');

    // Handle 3D hover effect and click for language buttons
    languageButtons.forEach(button => {
        const glint = document.createElement('div');
        glint.className = 'glint';
        button.appendChild(glint);

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // Match the rotation effect of the project cards
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            button.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });

        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            if (typeof setLanguage === 'function') {
                setLanguage(lang);
            }

            // 1. Disable pointer events and identify buttons
            languageButtons.forEach(btn => btn.style.pointerEvents = 'none');
            const selectedButton = button;
            const unselectedButton = Array.from(languageButtons).find(btn => btn !== selectedButton);

            // 2. Apply animation classes
            if (unselectedButton) {
                unselectedButton.classList.add('fading-out');
            }
            selectedButton.classList.add('selected');

            // 3. Calculate the required translation to move the button to the center
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const buttonRect = selectedButton.getBoundingClientRect();

            const currentX = buttonRect.left + buttonRect.width / 2;
            const currentY = buttonRect.top + buttonRect.height / 2;

            const targetX = screenWidth / 2;
            const targetY = screenHeight / 2;

            const translateX = targetX - currentX;
            const translateY = targetY - currentY;

            // Apply the transform to move the button
            selectedButton.style.transform = `translate(${translateX}px, ${translateY}px)`;

            // 4. Listen for the transition to end, then trigger aureoles and fade-in
            selectedButton.addEventListener('transitionend', () => {
                const AUREOLE_COUNT = 5;
                const STAGGER_DELAY = 150; // ms between each aureole animation start
                const { width, height } = buttonRect; // Get dimensions from the captured buttonRect

                // Create and animate aureoles
                for (let i = 0; i < AUREOLE_COUNT; i++) {
                    const aureole = document.createElement('div');
                    aureole.className = 'aureole';

                    // Dynamically set the size of the aureole to match the button
                    aureole.style.width = `${width}px`;
                    aureole.style.height = `${height}px`;

                    aureole.style.animationDelay = `${i * STAGGER_DELAY}ms`;
                    loaderOverlay.appendChild(aureole);
                }

                // Start the audio system
                if (typeof initAudioSystem === 'function') {
                    initAudioSystem();
                }

                // Time the website fade-in to coincide with the aureole animation
                setTimeout(() => {
                    if (mainContent) {
                        mainContent.style.display = 'block';
                        setTimeout(() => {
                            document.body.classList.remove('loading');
                            mainContent.classList.remove('hidden');
                        }, 20);
                    }
                }, STAGGER_DELAY * AUREOLE_COUNT);

                // Fade out the entire loader overlay as the website content fades in
                setTimeout(() => {
                    if (loaderOverlay) {
                        loaderOverlay.style.opacity = '0';
                    }
                }, STAGGER_DELAY * AUREOLE_COUNT + 300);

                // Set a final timeout to remove the loader from the DOM after all animations are complete
                const totalAnimationTime = (AUREOLE_COUNT * STAGGER_DELAY) + 1500; // 1.5s is aureole animation duration
                setTimeout(() => {
                    if (loaderOverlay) {
                        loaderOverlay.remove();
                    }
                }, totalAnimationTime);

            }, { once: true }); // Ensure this only runs once.
        });
    });
});