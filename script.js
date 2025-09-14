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

// -----------------------------
// 2. Interactive Header Bubbles
// -----------------------------
const bubbleContainer = document.getElementById('bubbleContainer');
const NUM_BUBBLES = 15;

// Create bubbles
for (let i = 0; i < NUM_BUBBLES; i++) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.style.left = `${Math.random() * 90}%`;
  bubble.style.top = `${Math.random() * 90}%`;
  bubbleContainer.appendChild(bubble);

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

