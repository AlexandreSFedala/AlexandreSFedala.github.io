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

  // Make columns "selectable"
  const columns = document.querySelectorAll('.main-columns .column');

  columns.forEach(column => {
    column.addEventListener('click', () => {
      // Remove 'active' from all columns
      columns.forEach(c => c.classList.remove('active'));
      // Add 'active' to clicked column
      column.classList.add('active');
    });
  });

  // Projects subpage click behavior
  const projectsColumn = document.querySelector('.projects');
  const subpagesContainer = projectsColumn.querySelector('.subpages');
  const projectDetails = projectsColumn.querySelectorAll('.project-detail');
  const subpages = projectsColumn.querySelectorAll('.subpage');

  // Initialize display states
  subpagesContainer.style.display = 'none';
  projectDetails.forEach(p => p.style.display = 'none');

  // Show subpages when projects column is active
  projectsColumn.addEventListener('click', (e) => {
    // Only trigger if the column itself was clicked, not a child element
    if (e.target === projectsColumn || e.target === projectsColumn.querySelector('h2')) {
      subpagesContainer.style.display = 'flex';
      projectDetails.forEach(p => p.style.display = 'none');
    }
  });

  subpages.forEach(subpage => {
    subpage.addEventListener('click', e => {
      e.stopPropagation(); // don't toggle active on column
      const targetId = subpage.dataset.target;

      // Hide subpages and other details
      subpagesContainer.style.display = 'none';
      projectDetails.forEach(p => p.style.display = 'none');

      // Show selected project detail
      const targetProject = document.getElementById(targetId);
      if(targetProject) targetProject.style.display = 'block';
    });
  });

  // Back arrow inside project detail
  projectDetails.forEach(detail => {
    const backBtn = document.createElement('span');
    backBtn.textContent = '←';
    backBtn.classList.add('back-arrow');
    backBtn.addEventListener('click', () => {
      detail.style.display = 'none';
      subpagesContainer.style.display = 'flex';
    });
    detail.prepend(backBtn);
  });

});




