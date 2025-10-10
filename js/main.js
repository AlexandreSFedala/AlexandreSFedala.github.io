function renderAboutMe(lang) {
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
            contentHtml += '<h4>Education</h4>';
            contentHtml += slideData.content.education.map(edu => `<div class="education-item">${edu}</div>`).join('');
            contentHtml += '</div>';

            contentHtml += '<div class="languages-container">';
            contentHtml += '<h4>Languages</h4>';
            contentHtml += '<ul class="languages-list">';
            contentHtml += slideData.content.languages.map(lang => `
                <li class="language-item">
                    <img src="${lang.flag}" alt="${lang.name} flag" class="language-flag">
                    <span class="language-name">${lang.name}</span>
                    <span class="language-level">${lang.level}</span>
                </li>
            `).join('');
            contentHtml += '</ul>';
            contentHtml += '</div>';
        } else if (slideData.type === 'certifications') {
            contentHtml += '<div class="carousel-certifications-list">';
            contentHtml += slideData.content.map(cert => `
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
    let prevButton = carouselContainer.querySelector('.carousel-arrow.prev');
    let nextButton = carouselContainer.querySelector('.carousel-arrow.next');
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    // By cloning and replacing the buttons, we remove any previously attached event listeners.
    // This prevents multiple event handlers from being attached if renderAboutMe is called more than once.
    const newPrev = prevButton.cloneNode(true);
    prevButton.parentNode.replaceChild(newPrev, prevButton);
    prevButton = newPrev;

    const newNext = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(newNext, nextButton);
    nextButton = newNext;

    function setContainerHeight() {
        let maxHeight = 0;
        // The slides are rendered, but inactive ones have opacity: 0.
        // Their scrollHeight should still be measurable.
        slides.forEach(slide => {
            if (slide.scrollHeight > maxHeight) {
                maxHeight = slide.scrollHeight;
            }
        });

        if (maxHeight > 0) {
            slidesContainer.style.minHeight = `${maxHeight}px`;
        }
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
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

    // Set height on initial load and recalculate on resize
    setContainerHeight();
    window.addEventListener('resize', setContainerHeight);

    // Initialize the first slide
    showSlide(currentSlide);
}

function renderProjects(lang) {
    const projectsContainer = document.querySelector('.column.projects');
    if (!projectsContainer) return;

    const subpagesContainer = projectsContainer.querySelector('.subpages');

    // Clear existing project details to prevent duplication
    const existingDetails = projectsContainer.querySelectorAll('.project-detail');
    existingDetails.forEach(detail => detail.remove());

    if (subpagesContainer) {
        subpagesContainer.innerHTML = '';
    }

    projectsData[lang].forEach(project => {
        // Create subpage entry
        const subpage = document.createElement('div');
        subpage.className = 'subpage';
        subpage.dataset.target = project.id;
        subpage.innerHTML = `
            <div class="subpage-title">${project.title}</div>
            <img src="${project.image}" alt="${project.alt}" loading="lazy">
        `;
        if (subpagesContainer) {
            subpagesContainer.appendChild(subpage);
        }

        // Create project detail view
        const detail = document.createElement('div');
        detail.className = 'project-detail';
        detail.id = project.id;

        let descriptionHtml = project.description.map(p => `<p>${p}</p>`).join('');

        let buttonsHtml = '';
        if (project.pdf && project.downloadFile) {
            buttonsHtml = `
                <div class="pdf-buttons-container">
                    <a href="pdf-viewer/pdf-viewer.html?file=../${project.pdf}" class="download-button" target="_blank">${project.pdfButtonText}</a>
                    <a href="${project.downloadFile}" class="download-button" download>${project.downloadText}</a>
                </div>`;
        } else if (project.pdf) {
             buttonsHtml = `
                <div class="pdf-buttons-container">
                    <a href="pdf-viewer/pdf-viewer.html?file=../${project.pdf}" class="download-button" target="_blank">${project.pdfButtonText}</a>
                    <a href="${project.pdf}" class="download-button" download>${project.downloadText}</a>
                </div>`;
        } else if (project.downloadFile) {
            buttonsHtml = `<a href="${project.downloadFile}" class="download-button" download>${project.downloadText}</a>`;
        }

        let detailImageHtml = '';
        if (project.detailImage) {
            detailImageHtml = `<img src="${project.detailImage}" alt="${project.detailImageAlt}">`;
        }

        let skillsHtml = '';
        if (project.skills && project.skills.length > 0) {
            skillsHtml = `
                <div class="project-skills">
                    <h4>${translations[lang].skillsUsedTitle}</h4>
                    <ul>
                        ${project.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        detail.innerHTML = `
            <div class="project-description">
                <div class="project-text-content">${descriptionHtml}</div>
                ${buttonsHtml}
                ${detailImageHtml}
            </div>
            ${skillsHtml}
        `;
        projectsContainer.appendChild(detail);
    });

    // Re-initialize any dynamic elements like back arrows or 3D effects
    if (window.createBackArrows) window.createBackArrows();
    if (window.init3dCards) window.init3dCards();
    if (window.applyInteractiveEffects) {
        document.querySelectorAll('.download-button').forEach(button => window.applyInteractiveEffects(button));
    }
}

function renderSkills(lang) {
    const skillsContent = document.querySelector('.column.skills .column-content');
    if (!skillsContent) return;

    const data = skillsData[lang];
    const skillLevelMap = { 'Basic': '25%', 'Intermediate': '50%', 'Proficient': '75%' };

    skillsContent.innerHTML = `
        <div class="skills-category">
            <h3 class="skills-subtitle">${data.technicalTitle}</h3>
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
            <h3 class="skills-subtitle">${data.softTitle}</h3>
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
window.renderAllContent = function(lang) {
    // First, set the static text using the function from texts.js
    if (window.setLanguage) {
        window.setLanguage(lang);
    }

    // Then, render the dynamic sections
    renderAboutMe(lang);
    renderProjects(lang);
    renderSkills(lang);
}