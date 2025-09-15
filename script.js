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

document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll for header arrow
  const scrollArrow = document.querySelector('.scroll-arrow');
  scrollArrow.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector('#main-columns');
    target.scrollIntoView({ behavior: 'smooth' });
  });

  // Projects interactivity
  const subpagesContainer = document.querySelector('.projects .subpages');
  const projectDetails = document.querySelectorAll('.projects .project-detail');
  const subpages = document.querySelectorAll('.projects .subpage');

  subpages.forEach(subpage => {
    subpage.addEventListener('click', () => {
      const targetId = subpage.dataset.target;

      // Hide subpages container
      subpagesContainer.style.display = 'none';

      // Hide all project details
      projectDetails.forEach(p => p.style.display = 'none');

      // Show target project
      const targetProject = document.getElementById(targetId);
      if (targetProject) targetProject.style.display = 'block';

      // Scroll projects column to top
      const projectsColumn = document.querySelector('.projects');
      projectsColumn.scrollTop = 0;
    });
  });

  // Add back button dynamically
  projectDetails.forEach(detail => {
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back to Projects';
    backBtn.addEventListener('click', () => {
      detail.style.display = 'none';
      subpagesContainer.style.display = 'flex';
    });
    detail.prepend(backBtn);
  });

});




