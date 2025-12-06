// js/main.js - Adapted for "Structural Minimalist" Theme

// Helper to clear container
const clearContainer = (container) => {
    if (container) container.innerHTML = '';
};

// --- About Me Renderer ---
function renderAboutMe(lang, aboutMeCarouselData, certificationsData) {
    const carouselContainer = document.getElementById('about-me-carousel');
    if (!carouselContainer) return;

    const slidesContainer = carouselContainer.querySelector('.carousel-slides');
    clearContainer(slidesContainer);

    const slidesData = aboutMeCarouselData[lang];
    if (!slidesData) return;

    slidesData.forEach((slideData, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;

        let contentHtml = `<h3>${slideData.title}</h3>`;

        if (slideData.type === 'text') {
            contentHtml += slideData.content.map(p => `<p>${p}</p>`).join('');
        } else if (slideData.type === 'education_languages') {
            contentHtml += '<div class="education-container">';

            // Education
            contentHtml += `<div class="edu-section"><h4>${lang === 'fr' ? 'Éducation' : 'Education'}</h4>`;
            contentHtml += slideData.content.education.map(edu => `
                <div class="education-item">
                    <b>${edu.school}</b>
                    <i>${edu.years}</i>
                    <p>${edu.degree} - ${edu.grade}</p>
                </div>
            `).join('');
            contentHtml += '</div>';

            // Languages
            contentHtml += `<div class="lang-section"><h4>${lang === 'fr' ? 'Langues' : 'Languages'}</h4>`;
            contentHtml += '<div class="languages-list">';
            contentHtml += slideData.content.languages.map(langItem => `
                <div class="language-item">
                    <img src="${langItem.flag}" alt="${langItem.name}" class="language-flag">
                    <span class="language-name">${langItem.name}</span>
                    <span class="language-level">(${langItem.level})</span>
                </div>
            `).join('');
            contentHtml += '</div></div>';
            contentHtml += '</div>';

        } else if (slideData.type === 'certifications') {
            contentHtml += '<div class="certifications-list" style="display:flex; gap:1rem; flex-wrap:wrap; justify-content:center;">';
            contentHtml += certificationsData[lang].map(cert => `
                <div class="cert-item" style="text-align:center; max-width:150px;">
                    <img src="${cert.img}" alt="${cert.title}" style="width:100px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1); margin-bottom:0.5rem;">
                    <p style="font-size:0.9rem; font-weight:600;">${cert.title}</p>
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

    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const prevBtn = carouselContainer.querySelector('.carousel-arrow.prev');
    const nextBtn = carouselContainer.querySelector('.carousel-arrow.next');
    let currentIndex = 0;

    const updateSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    };

    // Remove old listeners by cloning
    const newPrev = prevBtn.cloneNode(true);
    const newNext = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);

    newPrev.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateSlide(currentIndex);
    });

    newNext.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateSlide(currentIndex);
    });
}

// --- Skills Renderer ---
function renderSkills(lang, skillsData) {
    const skillsContainer = document.querySelector('.skills-grid-container');
    if (!skillsContainer) return;

    clearContainer(skillsContainer);
    const data = skillsData[lang];
    const skillLevelMap = { 'Basic': '25%', 'Intermediate': '50%', 'Proficient': '75%', 'Expert': '100%' };

    const renderCategory = (title, skills) => `
        <div class="skills-category">
            <h3>${title}</h3>
            ${skills.map(skill => `
                <div class="skill">
                    <div class="skill-name">
                        <span>${skill.name}</span>
                        <span class="skill-level-text">${data.levels[skill.level]}</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-bar-fill" style="width: ${skillLevelMap[skill.level] || '0%'}"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    skillsContainer.innerHTML = renderCategory(data.technicalTitle, data.technical) +
                                renderCategory(data.softTitle, data.soft);
}

// --- Projects Renderer ---
function renderProjects(lang, projectsData) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    clearContainer(projectsGrid);

    projectsData[lang].forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-img-container">
                <img src="${project.image}" alt="${project.alt}" loading="lazy">
            </div>
            <div class="project-card-content">
                <div class="project-title">${project.title}</div>
                <div class="project-snippet">${project.description[0]}</div>
                <span class="read-more-btn">${lang === 'fr' ? 'Voir détails' : 'View Details'} &rarr;</span>
            </div>
        `;

        card.addEventListener('click', () => openProjectModal(project, lang));
        projectsGrid.appendChild(card);
    });
}

// --- Project Modal Logic ---
function openProjectModal(project, lang) {
    const modalOverlay = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-content-body');
    const closeBtn = document.getElementById('close-modal-btn');

    if (!modalOverlay || !modalBody) return;

    // Build Content
    let descriptionHtml = project.description.map(p => `<p>${p}</p>`).join('');

    let buttonsHtml = '';
    const pdfBtnText = project.pdfButtonText || (lang === 'fr' ? 'Voir PDF' : 'View PDF');
    const downloadBtnText = project.downloadText || (lang === 'fr' ? 'Télécharger' : 'Download');

    if (project.pdf) {
        buttonsHtml += `<a href="pdf-viewer/pdf-viewer.html?file=../${project.pdf}" target="_blank" class="download-btn">📄 ${pdfBtnText}</a>`;
    }
    if (project.downloadFile) {
        buttonsHtml += `<a href="${project.downloadFile}" download class="download-btn">💾 ${downloadBtnText}</a>`;
    }

    let skillsHtml = '';
    if (project.skills && project.skills.length > 0) {
        skillsHtml = `<div class="modal-skills-list">
            ${project.skills.map(s => `<span class="modal-skill-tag">${s}</span>`).join('')}
        </div>`;
    }

    modalBody.innerHTML = `
        <h2 class="modal-project-title">${project.title}</h2>
        <div class="modal-project-body">
            ${project.detailImage ? `<img src="${project.detailImage}" alt="${project.detailImageAlt}">` : ''}
            <div class="modal-project-text">${descriptionHtml}</div>
            ${skillsHtml ? `<div><strong>${lang === 'fr' ? 'Compétences' : 'Skills Used'}:</strong>${skillsHtml}</div>` : ''}
            <div class="modal-actions">${buttonsHtml}</div>
        </div>
    `;

    modalOverlay.classList.remove('hidden');
    requestAnimationFrame(() => modalOverlay.classList.add('visible'));
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        setTimeout(() => modalOverlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModal;
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };
}


// --- Global Render Function ---
window.renderAllContent = async function(lang) {
    if (window.setLanguage) window.setLanguage(lang);

    const { aboutMeCarouselData, projectsData, skillsData, certificationsData } = await getAllData();
    renderAboutMe(lang, aboutMeCarouselData, certificationsData);
    renderSkills(lang, skillsData);
    renderProjects(lang, projectsData);

    // Dispatch event to signal content is ready (for map markers etc)
    const event = new CustomEvent('contentLoaded', { detail: { lang } });
    window.dispatchEvent(event);
}
