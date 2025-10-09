function renderAboutMe(lang) {
    const aboutMeTextContainer = document.getElementById('about-me-text');
    if (!aboutMeTextContainer) return;

    const aboutMeData = translations[lang].aboutMeText;
    aboutMeTextContainer.innerHTML = '';
    aboutMeData.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        aboutMeTextContainer.appendChild(p);
    });
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
            <img src="${project.image}" alt="${project.alt}">
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

function renderCertifications(lang) {
    const certList = document.querySelector('.certifications-list');
    if (!certList) return;

    certList.innerHTML = certificationsData[lang].map(cert => `
        <div class="certification-item">
            <img src="${cert.img}" alt="${cert.title}">
            <span class="cert-title">${cert.title}</span>
        </div>
    `).join('');
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
    renderCertifications(lang);
}