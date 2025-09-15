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
            
            // Special handling for projects column
            if (column.classList.contains('projects')) {
                // Show subpages when projects column is activated
                const subpagesContainer = column.querySelector('.subpages');
                const projectDetails = column.querySelectorAll('.project-detail');
                
                // Use classes instead of direct style manipulation
                subpagesContainer.classList.remove('hidden');
                subpagesContainer.classList.add('flex-visible');
                projectDetails.forEach(p => {
                    p.classList.remove('visible');
                    p.classList.add('hidden');
                });
            }
        });
    });

    // Projects subpage click behavior
    const projectsColumn = document.querySelector('.projects');
    const subpagesContainer = projectsColumn.querySelector('.subpages');
    const projectDetails = projectsColumn.querySelectorAll('.project-detail');
    const subpages = projectsColumn.querySelectorAll('.subpage');

    // Initialize display states using classes
    subpagesContainer.classList.add('flex-visible');
    projectDetails.forEach(p => p.classList.add('hidden'));

    subpages.forEach(subpage => {
        subpage.addEventListener('click', e => {
            e.stopPropagation(); // don't toggle active on column
            const targetId = subpage.dataset.target;

            // Hide subpages and other details using classes
            subpagesContainer.classList.remove('flex-visible');
            subpagesContainer.classList.add('hidden');
            projectDetails.forEach(p => {
                p.classList.remove('visible');
                p.classList.add('hidden');
            });

            // Show selected project detail
            const targetProject = document.getElementById(targetId);
            if(targetProject) {
                targetProject.classList.remove('hidden');
                targetProject.classList.add('visible');
            }
        });
    });

    // Back arrow inside project detail
    projectDetails.forEach(detail => {
        const backBtn = document.createElement('span');
        backBtn.textContent = '←';
        backBtn.classList.add('back-arrow');
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            detail.classList.remove('visible');
            detail.classList.add('hidden');
            subpagesContainer.classList.remove('hidden');
            subpagesContainer.classList.add('flex-visible');
        });
        detail.prepend(backBtn);
    });

    // Animate skill bars when skills column is activated
    const skillsColumn = document.querySelector('.skills');
    skillsColumn.addEventListener('click', () => {
        setTimeout(() => {
            document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }, 500);
    });
});

