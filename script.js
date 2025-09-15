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
// Subpage Click Behavior
// -----------------------------
const subpagesContainer = document.querySelector('.projects .subpages');
const projectDetails = document.querySelectorAll('.projects .project-detail');

subpages.forEach(subpage => {
  subpage.addEventListener('click', () => {
    const targetId = subpage.dataset.target;

    // Hide the subpages container
    subpagesContainer.style.display = 'none';

    // Hide all project details first
    projectDetails.forEach(p => p.style.display = 'none');

    // Show the selected project detail
    const targetProject = document.getElementById(targetId);
    if (targetProject) targetProject.style.display = 'block';

    // Scroll Projects column to top
    const projectsColumn = document.querySelector('.projects');
    projectsColumn.scrollTop = 0;
  });
});

// Optional: Add a "Back" button inside each project detail
projectDetails.forEach(detail => {
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back to Projects';
  backBtn.style.margin = '1rem 0';
  backBtn.style.padding = '0.5rem 1rem';
  backBtn.style.cursor = 'pointer';
  backBtn.addEventListener('click', () => {
    // Hide this detail
    detail.style.display = 'none';
    // Show the subpages container again
    subpagesContainer.style.display = 'flex';
  });
  detail.prepend(backBtn); // add at the top
});



