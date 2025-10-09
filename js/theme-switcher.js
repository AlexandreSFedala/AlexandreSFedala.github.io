document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const htmlEl = document.documentElement;

    // Function to set the theme
    const setTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Check for a saved theme in localStorage, or use the system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light'); // Default to light theme
    }

    // Add click event listener to the theme switcher button
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});