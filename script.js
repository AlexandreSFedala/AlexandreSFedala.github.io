// -----------------------------
// 1. Shrinking Navbar on Scroll
// -----------------------------
const navbar = document.getElementById('navbar');
// Update your existing scroll handler to this:
window.addEventListener('scroll', () => {
    // Navbar shrink functionality
    if (window.scrollY > 100) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
    
    // Add scrolled class for CSS effects
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
    
    // Auto-scroll to columns (keep this separate)
    if (!hasScrolledToColumns && window.scrollY > 50 && window.scrollY < 100) {
        hasScrolledToColumns = true;
        const target = document.querySelector('#main-columns');
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }
    
    // Reset if user scrolls back to top
    if (window.scrollY < 10) {
        hasScrolledToColumns = false;
    }
});

// -----------------------------
// 2. Auto-scroll to columns on initial scroll
// -----------------------------
let hasScrolledToColumns = false;

window.addEventListener('scroll', () => {
    // Only trigger once and only if not already at columns
    if (!hasScrolledToColumns && window.scrollY > 50 && window.scrollY < 100) {
        hasScrolledToColumns = true;
        
        // Smooth scroll to columns section
        const target = document.querySelector('#main-columns');
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300); // Small delay for better UX
        }
    }
    
    // Reset if user scrolls back to top
    if (window.scrollY < 10) {
        hasScrolledToColumns = false;
    }
});

// Optional: Add touch scroll detection for mobile
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (hasScrolledToColumns) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    // If scrolling down significantly
    if (diff > 50 && window.scrollY < 100) {
        hasScrolledToColumns = true;
        const target = document.querySelector('#main-columns');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for header arrow
    const scrollArrow = document.querySelector('.scroll-arrow');
    scrollArrow.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#main-columns');
        target.scrollIntoView({ behavior: 'smooth' });
    });

    // Make columns "selectable" with toggle functionality
const columns = document.querySelectorAll('.main-columns .column');

columns.forEach(column => {
    column.addEventListener('click', () => {
        // Check if the clicked column is already active
        const isAlreadyActive = column.classList.contains('active');
        
        // Remove 'active' from all columns first
        columns.forEach(c => c.classList.remove('active'));
        
        // If the column wasn't already active, activate it
        // If it was active, it will just shrink back (all are now inactive)
        if (!isAlreadyActive) {
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
        } else {
            // If clicking an already active column, ensure projects content is hidden
            if (column.classList.contains('projects')) {
                const subpagesContainer = column.querySelector('.subpages');
                const projectDetails = column.querySelectorAll('.project-detail');
                
                subpagesContainer.classList.remove('flex-visible');
                subpagesContainer.classList.add('hidden');
                projectDetails.forEach(p => {
                    p.classList.remove('visible');
                    p.classList.add('hidden');
                });
            }
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

