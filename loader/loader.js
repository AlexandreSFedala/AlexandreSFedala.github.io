// loader/loader.js - Refined Minimalist Loader

document.addEventListener('DOMContentLoaded', () => {
    const loaderOverlay = document.getElementById('loader-overlay');
    const clickPrompt = document.getElementById('click-prompt');
    const mainContent = document.getElementById('main-website-content');
    const loaderContent = document.querySelector('.loader-content');

    // Simulate loading delay
    setTimeout(() => {
        if (loaderContent) {
            // Fade out the initial text
            loaderContent.style.opacity = '0';
            loaderContent.style.transition = 'opacity 0.5s ease';
        }
        
        // Show the language selection
        setTimeout(() => {
             if (loaderContent) loaderContent.classList.add('hidden');
             if (clickPrompt) clickPrompt.classList.remove('hidden');
             // Animate buttons in
             const btns = document.querySelectorAll('.language-button');
             btns.forEach((btn, index) => {
                 btn.style.opacity = '0';
                 btn.style.transform = 'translateY(10px)';
                 btn.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
                 setTimeout(() => {
                     btn.style.opacity = '1';
                     btn.style.transform = 'translateY(0)';
                 }, 50);
             });
        }, 500);

    }, 2000); // 2 second fake load

    // Language Selection Handling
    const languageButtons = document.querySelectorAll('.language-button');
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;

            // 1. Initialize Content
            if (typeof window.renderAllContent === 'function') {
                window.renderAllContent(lang);
            }

            // 2. Transition Effect
            clickPrompt.style.opacity = '0';
            clickPrompt.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                 // Reveal Main Content
                 if (mainContent) {
                    mainContent.classList.remove('hidden');
                    document.body.classList.remove('loading');
                 }

                 // Remove Loader
                 if (loaderOverlay) {
                     loaderOverlay.style.opacity = '0';
                     loaderOverlay.style.transition = 'opacity 0.8s ease';
                     setTimeout(() => {
                         loaderOverlay.remove();
                     }, 800);
                 }
            }, 500);
        });
    });
});
