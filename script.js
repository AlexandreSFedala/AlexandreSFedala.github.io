// -----------------------------
// 1. Shrinking Navbar on Scroll
// -----------------------------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});

const bubbleContainer = document.getElementById('bubbleContainer');
const NUM_BUBBLES = 20;

// Create bubbles
for (let i = 0; i < NUM_BUBBLES; i++) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.style.left = `${Math.random() * 90}%`;
  bubble.style.top = `${Math.random() * 90 + 50}%`; // start below visible area
  bubble.style.width = '50px';
  bubble.style.height = '50px';
  bubble.style.background = 'rgba(255,255,255,0.35)'; // 35% opacity
  bubble.style.borderRadius = '50%';
  bubble.style.position = 'absolute';
  bubble.style.cursor = 'grab';
  bubbleContainer.appendChild(bubble);

  // Scale on click
  bubble.addEventListener('mousedown', () => {
    bubble.style.transform = 'scale(1.5)';
  });
  bubble.addEventListener('mouseup', () => {
    bubble.style.transform = 'scale(1)';
  });

  // Drag functionality
  bubble.addEventListener('mousedown', (e) => {
    e.preventDefault();
    let shiftX = e.clientX - bubble.getBoundingClientRect().left;
    let shiftY = e.clientY - bubble.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      bubble.style.left = pageX - shiftX + 'px';
      bubble.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    bubble.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      bubble.onmouseup = null;
    };
  });

  bubble.ondragstart = () => false; // disable default drag
}

// Animate bubbles moving upwards continuously
function animateBubbles() {
  const bubbles = document.querySelectorAll('.bubble');
  bubbles.forEach(bubble => {
    let top = parseFloat(bubble.style.top);
    top -= 0.2; // speed upward
    if (top < -10) top = 100; // reset to bottom
    bubble.style.top = top + '%';
  });
  requestAnimationFrame(animateBubbles);
}
animateBubbles();


// -----------------------------
// 3. Subpage Click Behavior
// -----------------------------
const subpages = document.querySelectorAll('.subpage');
const projectDetails = document.querySelectorAll('.project-detail');

subpages.forEach(subpage => {
  subpage.addEventListener('click', () => {
    const targetId = subpage.dataset.target;

    // Hide all projects first
    projectDetails.forEach(p => p.style.display = 'none');

    // Show the selected project
    const targetProject = document.getElementById(targetId);
    if (targetProject) targetProject.style.display = 'block';

    // Scroll to the project smoothly
    targetProject.scrollIntoView({behavior: 'smooth'});
  });
});

// Initialize all projects hidden except first
projectDetails.forEach((p, i) => {
  p.style.display = i === 0 ? 'block' : 'none';
});

