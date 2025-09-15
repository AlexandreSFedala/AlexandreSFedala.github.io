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


