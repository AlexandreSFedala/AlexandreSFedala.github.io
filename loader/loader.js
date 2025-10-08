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

    // This handles the 3D button and directional glint
    if (promptText) {
        const glint = document.createElement('div');
        glint.className = 'glint';
        promptText.appendChild(glint);

        promptText.addEventListener('mousemove', (e) => {
            const rect = promptText.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 16;
            promptText.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
            promptText.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
        });

        promptText.addEventListener('mouseenter', (e) => {
            const rect = promptText.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const isTop = y < rect.height / 2;
            const isLeft = x < rect.width / 2;
            
            glint.className = 'glint';
            if (isTop && isLeft) glint.classList.add('glint-from-bottom-right');
            else if (isTop && !isLeft) glint.classList.add('glint-from-bottom-left');
            else if (!isTop && isLeft) glint.classList.add('glint-from-top-right');
            else glint.classList.add('glint-from-top-left');
        });

        promptText.addEventListener('mouseleave', () => {
            promptText.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            promptText.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
            glint.className = 'glint';
        });
    }

    // This handles what happens AFTER the user clicks "Click to Begin"
    if (clickPrompt) {
        clickPrompt.addEventListener('click', () => {
            initAudioSystem();
            if (loaderOverlay) loaderOverlay.style.opacity = '0';
            if (mainContent) {
                mainContent.style.display = 'block';
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    mainContent.classList.remove('hidden');
                }, 20);
            }
            setTimeout(() => {
                if (loaderOverlay) loaderOverlay.remove();
            }, 1000);
        }, { once: true });
    }
});