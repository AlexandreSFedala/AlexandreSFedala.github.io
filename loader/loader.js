// loader/loader.js - Final revision with random timing between messages
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

// Status messages to display
const STATUS_MESSAGES = [
  "Loading Header",
  "Loading Content", 
  "Loading Languages",
  "Loading Interactive Elements",
  "Loading Animations",
  "Generating Flashcards",
  "Loading PDFs",
  "Done !"
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

// Create status text element
function createStatusText() {
  const statusContainer = document.createElement('div');
  statusContainer.className = 'loader-status';
  statusContainer.innerHTML = '<div class="status-text"></div>';
  document.getElementById('loader-overlay').appendChild(statusContainer);
}

// Update status text
function updateStatus(message) {
  const statusText = document.querySelector('.status-text');
  if (statusText) {
    statusText.textContent = message;
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
  createStatusText();
  animateSymbols();

  // Random duration between 700ms and 2000ms
  const duration = 700 + Math.random() * 1300;
  console.log("Loader duration: " + duration + "ms");
  
  // Calculate random timing for each message with max 100ms between messages
  const messageCount = STATUS_MESSAGES.length;
  let totalTimeUsed = 0;
  const messageTimings = [];
  
  // Generate random intervals (max 100ms) for all but the last message
  for (let i = 0; i < messageCount - 1; i++) {
    const randomInterval = 50 + Math.random() * 50; // 50-100ms
    messageTimings.push(randomInterval);
    totalTimeUsed += randomInterval;
  }
  
  // Calculate time for the last message (Done !)
  const timeForDone = Math.max(250, duration - totalTimeUsed);
  messageTimings.push(timeForDone);
  
  console.log("Message timings:", messageTimings);
  
  // Show status messages with random timing
  let cumulativeTime = 0;
  
  for (let i = 0; i < messageCount; i++) {
    setTimeout(() => {
      updateStatus(STATUS_MESSAGES[i]);
      
      // If this is the last message, set the final timeout
      if (i === messageCount - 1) {
        setTimeout(() => {
          // Fade out loader
          const overlay = document.getElementById('loader-overlay');
          overlay.style.opacity = 0;
          setTimeout(() => {
            overlay.style.display = 'none';
            // Fade in header
            const header = document.querySelector('header');
            if (header) {
              header.style.opacity = 0;
              header.style.transition = "opacity 1s";
              setTimeout(() => { header.style.opacity = 1; }, 100);
            }
            // Show rest of site
            document.body.classList.remove('loading');
          }, 700);
        }, 250); // Ensure "Done !" is displayed for at least 250ms
      }
    }, cumulativeTime);
    
    cumulativeTime += messageTimings[i];
  }
}

// Only run loader if overlay exists
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loader-overlay')) {
    // Hide rest of site while loading
    document.body.classList.add('loading');
    startLoader();
  }
});
