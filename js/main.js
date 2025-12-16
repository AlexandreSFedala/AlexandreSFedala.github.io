// js/main.js

function renderAboutMe(lang, aboutMeCarouselData, certificationsData) {
    const carouselContainer = document.getElementById('about-me-carousel');
    if (!carouselContainer) return;

    const slidesContainer = carouselContainer.querySelector('.carousel-slides');
    slidesContainer.innerHTML = ''; // Clear existing slides

    const slidesData = aboutMeCarouselData[lang];
    if (!slidesData) return;

    slidesData.forEach((slideData, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) {
            slide.classList.add('active');
        }

        let contentHtml = `<h3>${slideData.title}</h3>`;

        if (slideData.type === 'text') {
            contentHtml += slideData.content.map(p => `<p>${p}</p>`).join('');
        } else if (slideData.type === 'education_languages') {
            contentHtml += '<div class="education-container">';
            contentHtml += '<div><h4>Education</h4>';
            contentHtml += slideData.content.education.map(edu => `
                <div class="education-item">
                    <span class="education-school">${edu.school}</span>
                    <p class="education-degree">${edu.degree}</p>
                    <p class="education-grade"><i>${edu.years}</i> | ${edu.grade}</p>
                </div>
            `).join('');
            contentHtml += '</div>';

            contentHtml += '<div><h4>Languages</h4>';
            contentHtml += '<ul class="languages-list">';
            contentHtml += slideData.content.languages.map(lang => `
                <li class="language-item">
                    <img src="${lang.flag}" alt="${lang.name} flag" class="language-flag">
                    <span class="language-name">${lang.name}</span>
                    <span class="language-level">${lang.level}</span>
                </li>
            `).join('');
            contentHtml += '</ul></div>';
            contentHtml += '</div>';
        } else if (slideData.type === 'certifications') {
            contentHtml += '<div class="carousel-certifications-list">';
            contentHtml += certificationsData[lang].map(cert => `
                <div class="carousel-certification-item">
                    <img src="${cert.img}" alt="${cert.title}" loading="lazy">
                    <span class="cert-title">${cert.title}</span>
                </div>
            `).join('');
            contentHtml += '</div>';
        }

        slide.innerHTML = contentHtml;
        slidesContainer.appendChild(slide);
    });

    setupCarousel();
}

function setupCarousel() {
    const carouselContainer = document.getElementById('about-me-carousel');
    if (!carouselContainer) return;

    const slidesContainer = carouselContainer.querySelector('.carousel-slides');
    let prevButton = carouselContainer.querySelector('.carousel-btn.prev');
    let nextButton = carouselContainer.querySelector('.carousel-btn.next');
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const pagination = carouselContainer.querySelector('.carousel-dots');
    let currentSlide = 0;

    if(!prevButton || !nextButton) return;

    // By cloning and replacing the buttons, we remove any previously attached event listeners.
    const newPrev = prevButton.cloneNode(true);
    prevButton.parentNode.replaceChild(newPrev, prevButton);
    prevButton = newPrev;

    const newNext = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(newNext, nextButton);
    nextButton = newNext;

    // Setup Pagination dots
    if (pagination) {
        pagination.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
            });
            pagination.appendChild(dot);
        });
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        // Update pagination
        if (pagination) {
            const dots = pagination.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                if (i === index) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    }

    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        showSlide(currentSlide);
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        showSlide(currentSlide);
    });

    // Initialize the first slide
    showSlide(currentSlide);
}

function renderProjects(lang, projectsData) {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectDetailsContainer = document.getElementById('project-details-container');

    if (!projectsGrid || !projectDetailsContainer) return;

    projectsGrid.innerHTML = '';
    projectDetailsContainer.innerHTML = '';

    projectsData[lang].forEach(project => {
        // Create grid item
        const subpage = document.createElement('div');
        subpage.className = 'subpage';
        subpage.dataset.target = project.id;
        subpage.innerHTML = `
            <img src="${project.image}" alt="${project.alt}" loading="lazy">
            <div class="subpage-title">${project.title}</div>
        `;

        // Event listener to open details
        subpage.addEventListener('click', () => {
             showProjectDetails(project.id);
        });

        projectsGrid.appendChild(subpage);

        // Create detail view (hidden by default)
        const detail = document.createElement('div');
        detail.className = 'project-detail hidden';
        detail.id = project.id;

        let descriptionHtml = project.description.map(p => `<p>${p}</p>`).join('');

        let buttonsHtml = '';
        if (project.pdf || project.downloadFile) {
            buttonsHtml = `<div class="pdf-buttons-container">`;
            if (project.pdf) {
                buttonsHtml += `<a href="pdf-viewer/pdf-viewer.html?file=../${project.pdf}" class="download-button" target="_blank">${project.pdfButtonText}</a>`;
                buttonsHtml += `<a href="${project.pdf}" class="download-button" download>${project.downloadText}</a>`;
            } else if (project.downloadFile) {
                 buttonsHtml += `<a href="${project.downloadFile}" class="download-button" download>${project.downloadText}</a>`;
            }
            buttonsHtml += `</div>`;
        }

        let detailImageHtml = '';
        if (project.detailImage) {
            detailImageHtml = `<img src="${project.detailImage}" alt="${project.detailImageAlt}" style="width:100%; height:auto; margin-top:2rem; border:1px solid var(--border-color);">`;
        }

        let skillsHtml = '';
        if (project.skills && project.skills.length > 0) {
            skillsHtml = `
                <div class="project-skills" style="margin-top:2rem;">
                    <h4 style="margin-bottom:1rem; font-family:var(--font-heading);">${translations[lang].skillsUsedTitle}</h4>
                    <ul style="list-style:disc; padding-left:1.5rem;">
                        ${project.skills.map(skill => `<li style="margin-bottom:0.5rem;">${skill}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Back Button
        const backButton = `<div class="back-to-projects" onclick="hideProjectDetails()">← Back to Projects</div>`;

        detail.innerHTML = `
            ${backButton}
            <h2>${project.title}</h2>
            <div class="project-description">
                <div class="project-text-content">${descriptionHtml}</div>
                ${buttonsHtml}
                ${detailImageHtml}
            </div>
            ${skillsHtml}
        `;
        projectDetailsContainer.appendChild(detail);
    });
}

// Global functions to handle project view toggling
window.showProjectDetails = function(projectId) {
    document.querySelector('.projects-grid').classList.add('hidden');
    document.getElementById('project-details-container').classList.remove('hidden');

    document.querySelectorAll('.project-detail').forEach(d => d.classList.add('hidden'));
    const target = document.getElementById(projectId);
    if(target) target.classList.remove('hidden');

    // Scroll to top of projects section
    const projectsSection = document.getElementById('projects');
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    window.scrollTo({ top: projectsSection.offsetTop - navbarHeight, behavior: 'smooth' });
};

window.hideProjectDetails = function() {
    document.getElementById('project-details-container').classList.add('hidden');
    document.querySelector('.projects-grid').classList.remove('hidden');

    // Scroll back to projects
    const projectsSection = document.getElementById('projects');
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    window.scrollTo({ top: projectsSection.offsetTop - navbarHeight, behavior: 'smooth' });
};


function renderSkills(lang, skillsData) {
    // Correct selector for the new index.html structure
    const skillsGrid = document.querySelector('#skills .skills-grid');
    if (!skillsGrid) return;

    const data = skillsData[lang];
    const skillLevelMap = { 'Basic': '25%', 'Intermediate': '50%', 'Proficient': '75%', 'Expert': '100%' };

    skillsGrid.innerHTML = `
        <div class="skills-category">
            <h3>${data.technicalTitle}</h3>
            ${data.technical.map(skill => `
                <div class="skill" data-level="${skill.level}">
                    <div class="skill-name">
                        <span>${skill.name}</span>
                        <span class="skill-level-text">${data.levels[skill.level]}</span>
                    </div>
                    <div class="skill-bar"><div class="skill-bar-fill" style="width: ${skillLevelMap[skill.level] || '0%'}"></div></div>
                </div>
            `).join('')}
        </div>
        <div class="skills-category">
            <h3>${data.softTitle}</h3>
            ${data.soft.map(skill => `
                <div class="skill" data-level="${skill.level}">
                    <div class="skill-name">
                        <span>${skill.name}</span>
                        <span class="skill-level-text">${data.levels[skill.level]}</span>
                    </div>
                    <div class="skill-bar"><div class="skill-bar-fill" style="width: ${skillLevelMap[skill.level] || '0%'}"></div></div>
                </div>
            `).join('')}
        </div>
    `;
}

// Make this function globally available so the loader can call it.
window.renderAllContent = async function(lang) {
    // First, set the static text using the function from texts.js
    if (window.setLanguage) {
        window.setLanguage(lang);
    }

    // Then, render the dynamic sections
    try {
        const { aboutMeCarouselData, projectsData, skillsData, certificationsData } = await getAllData();
        renderAboutMe(lang, aboutMeCarouselData, certificationsData);
        renderProjects(lang, projectsData);
        renderSkills(lang, skillsData);

        // --- NEW: Trigger animations for dynamic content ---
        // Since we are adding elements after DOMContentLoaded, we need to manually trigger their visibility
        // or re-attach observers if we want scroll reveals.
        // For simplicity, let's just make them visible immediately or with a small delay.

        const dynamicElements = document.querySelectorAll('.subpage, .skills-category');
        dynamicElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 100)); // Staggered reveal
        });

    } catch (e) {
        console.error("Error rendering content:", e);
    }
}
