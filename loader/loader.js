// loader/loader.js
// Vibrant color palette
const COLORS = [
  "#FF5252", "#FFB300", "#00E676", "#40C4FF", "#7C4DFF",
  "#FF4081", "#FFD600", "#69F0AE", "#536DFE", "#FF6E40"
];
// Symbols to use
const SYMBOLS = [
  "⏾", // Wake
  "⏏", // Eject
  "⏻", // Power
  "⎌", // Clear
  "⎈", // Command
  "⎇", // Alt
  "⎙", // Print
  "⎋", // Escape
  "⇦", // Left Arrow
  "⇨", // Right Arrow
  "⇧", // Up Arrow
  "⇩", // Down Arrow
  "⌫", // Backspace
  "⌦", // Delete
  "⎉", // Tab
  "⎆", // Insert
  "⎄", // Control
  "⎗", // Page Up
  "⎘", // Page Down
  "⎚", // End
  "•",  // Bullet
  "∙",  // Bullet Operator
  "§",  // Section
  "¤",  // Currency Sign
  "⌁"   // Electric Arrow
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Create the loader symbols
function createLoaderSymbols(count = 8) {
  const container = document.querySelector('.loader-symbols');
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'loader-symbol';
    span.textContent = randomSymbol();
    span.style.color = randomColor();
    container.appendChild(span);
  }
}

// Animate the jumping effect
function animateSymbols() {
  const symbols = document.querySelectorAll('.loader-symbol');
  let idx = 0;
  setInterval(() => {
    symbols.forEach(s => s.classList.remove('jumping'));
    symbols[idx].classList.add('jumping');
    idx = (idx + 1) % symbols.length;
  }, 120);
}

// Loader logic
function startLoader() {
  createLoaderSymbols(12);
  animateSymbols();

  // Random duration between 3 and 5 seconds
  const duration = 1000 + Math.random() * 2000;
  setTimeout(() => {
    // Fade out loader
    const overlay = document.getElementById('loader-overlay');
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.style.display = 'none';
      // Fade in header (if you want)
      const header = document.querySelector('header');
      if (header) {
        header.style.opacity = 0;
        header.style.transition = "opacity 1s";
        setTimeout(() => { header.style.opacity = 1; }, 100);
      }
      // Show rest of site if you had hidden it
      document.body.classList.remove('loading');
    }, 700);
  }, duration);
}

// Only run loader if overlay exists
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loader-overlay')) {
    // Optionally hide rest of site while loading
    document.body.classList.add('loading');
    startLoader();
  }
});