// Imports and Setup
const state = {
    lang: 'en',
    theme: localStorage.getItem('theme') || 'light',
    data: {
        projects: {}, // { en: [], fr: [] }
        skills: {},   // { en: {}, fr: {} }
        about: {}     // { en: [], fr: [] }
    }
};

// --- Localization ---
function t(key) {
    if (typeof translations !== 'undefined' && translations[state.lang] && translations[state.lang][key]) {
        return translations[state.lang][key];
    }
    return key;
}

function updateLanguage() {
    // 1. Static Text
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (typeof translations !== 'undefined' && translations[state.lang] && translations[state.lang][key]) {
             el.textContent = translations[state.lang][key];
        }
    });

    // 2. Active Button State
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === state.lang);
    });

    // 3. Re-render Dynamic Content
    if (state.data.projects.en) { // Check if data is loaded
        renderAll();
    }
}

// --- Theming ---
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
}

// --- Data Loading ---
async function loadData() {
    try {
        const [projectsRes, skillsRes, aboutRes] = await Promise.all([
            fetch('data/projects.json'),
            fetch('data/skills.json'),
            fetch('data/aboutme-carousel.json')
        ]);

        state.data.projects = await projectsRes.json();
        state.data.skills = await skillsRes.json();
        state.data.about = await aboutRes.json();

        renderAll();
    } catch (e) {
        console.error("Failed to load data", e);
    }
}

// --- Rendering ---
function renderAll() {
    renderProjects();
    renderSkills();
    renderAbout();

    // Trigger scroll reveal observer after rendering
    setupScrollReveal();

    // Update Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    const projects = state.data.projects[state.lang] || [];

    projects.forEach((project, index) => {
        const row = document.createElement('div');
        row.className = 'project-row';

        // Pad number with zero
        const num = (index + 1).toString().padStart(2, '0');

        const description = Array.isArray(project.description) ? project.description[0] : project.description;
        // Truncate description for the list view
        const shortDesc = description.length > 150 ? description.substring(0, 150) + '...' : description;

        const infoHtml = `
            <div class="project-info">
                <div class="project-number">${num}</div>
                <h3 class="project-title" onclick="window.openProjectModal('${project.id}')">${project.title}</h3>
                <p class="project-desc">${shortDesc}</p>
                <button class="btn-outline" onclick="window.openProjectModal('${project.id}')">View Project</button>
            </div>
        `;

        const imageHtml = `
            <div class="project-image-container" onclick="window.openProjectModal('${project.id}')">
                <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.alt || 'Project Image'}" class="project-image" loading="lazy">
            </div>
        `;

        // Order is handled by CSS (flex/grid order or direction: rtl for even rows)
        // But in grid, we just dump them. CSS grid-template-columns handles 1fr 1fr.
        // We will just append them in standard order (Info, Image) and let CSS swap them visually using direction:rtl or order.
        // Actually, CSS :nth-child(even) { direction: rtl } works best if we keep DOM order consistent.

        row.innerHTML = infoHtml + imageHtml;
        container.appendChild(row);
    });
}

// Global helper for onclick
window.openProjectModal = (projectId) => {
    const project = (state.data.projects[state.lang] || []).find(p => p.id === projectId);
    if (project) openProjectModal(project);
};

function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    const skillsData = state.data.skills[state.lang];
    if (!skillsData) return;

    // We can render categories separately
    const categories = [
        { key: 'technical', title: skillsData.technicalTitle || 'Technical' },
        { key: 'soft', title: skillsData.softTitle || 'Soft Skills' }
    ];

    categories.forEach(cat => {
        const items = skillsData[cat.key];
        if (items && items.length > 0) {
            const div = document.createElement('div');
            div.className = 'skill-category';
            div.innerHTML = `
                <h4>${cat.title}</h4>
                <ul class="skill-list">
                    ${items.map(item => `<li class="skill-item">${item.name} <small style="opacity:0.6">(${item.level})</small></li>`).join('')}
                </ul>
            `;
            container.appendChild(div);
        }
    });
}

function renderAbout() {
    const container = document.getElementById('about-content');
    container.innerHTML = '';

    const aboutData = state.data.about[state.lang] || [];

    aboutData.forEach(slide => {
        // Create a wrapper for each section
        const sectionWrapper = document.createElement('div');
        sectionWrapper.className = 'about-subsection';

        // Add Title if exists
        if (slide.title) {
            const h3 = document.createElement('h3');
            h3.textContent = slide.title;
            h3.style.marginTop = "40px";
            h3.style.marginBottom = "20px";
            sectionWrapper.appendChild(h3);
        }

        if (slide.type === 'text') {
            const content = Array.isArray(slide.content) ? slide.content : [slide.content];
            content.forEach(p => {
                const pEl = document.createElement('p');
                pEl.textContent = p;
                sectionWrapper.appendChild(pEl);
            });
        }
        else if (slide.type === 'education_languages') {
            // Render Education
            if (slide.content.education) {
                const eduList = document.createElement('div');
                eduList.className = 'education-list';
                slide.content.education.forEach(edu => {
                    const div = document.createElement('div');
                    div.className = 'education-item';
                    div.innerHTML = `
                        <strong>${edu.school}</strong> <span style="opacity:0.7">(${edu.years})</span><br>
                        <em>${edu.degree}</em><br>
                        <small>${edu.grade}</small>
                    `;
                    eduList.appendChild(div);
                });
                sectionWrapper.appendChild(eduList);
            }
            // Render Languages
            if (slide.content.languages) {
                const langTitle = document.createElement('h4');
                langTitle.textContent = t('languages') || "Languages";
                langTitle.style.marginTop = "20px";
                sectionWrapper.appendChild(langTitle);

                const langList = document.createElement('div');
                langList.className = 'languages-list';
                slide.content.languages.forEach(lang => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.style.display = 'inline-flex';
                    span.style.alignItems = 'center';
                    span.style.gap = '8px';
                    span.style.marginRight = '10px';
                    span.style.marginBottom = '10px';
                    span.innerHTML = `<img src="${lang.flag}" alt="${lang.name}" width="20"> ${lang.name} (${lang.level})`;
                    langList.appendChild(span);
                });
                sectionWrapper.appendChild(langList);
            }
        }
        else if (slide.type === 'certifications') {
            const certGrid = document.createElement('div');
            certGrid.className = 'cert-grid';
            slide.content.forEach(cert => {
                const div = document.createElement('div');
                div.className = 'cert-item';
                div.innerHTML = `
                    <img src="${cert.img}" alt="${cert.title}" style="width: 100%; max-width: 300px; border-radius: 8px; margin-bottom: 10px;">
                    <p><strong>${cert.title}</strong></p>
                `;
                certGrid.appendChild(div);
            });
            sectionWrapper.appendChild(certGrid);
        }

        container.appendChild(sectionWrapper);
    });
}

// --- Modals ---
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('project-modal-body');

    let descriptionHtml = '';
    if (Array.isArray(project.description)) {
        descriptionHtml = project.description.map(p => `<p style="margin-bottom:1em">${p}</p>`).join('');
    } else {
        descriptionHtml = `<p>${project.description}</p>`;
    }

    let linksHtml = '';
    if (project.pdf) {
        linksHtml += `<a href="${project.pdf}" target="_blank" class="btn-outline" style="margin-right:10px">${project.pdfButtonText || 'View PDF'}</a> `;
    }
    if (project.downloadFile) {
        linksHtml += `<a href="${project.downloadFile}" class="btn-outline">${project.downloadText || 'Download'}</a>`;
    }

    body.innerHTML = `
        <h2 style="margin-bottom:10px">${project.title}</h2>
        <div class="tech-stack" style="margin-bottom:20px; font-family:var(--font-sans); font-size:0.9rem; color:var(--text-secondary)">
            ${(project.skills || []).join(' • ')}
        </div>
        ${project.image ? `<img src="${project.image}" style="width:100%; margin-bottom:20px; border-radius:4px" alt="${project.alt}">` : ''}
        <div class="project-description" style="line-height:1.8; margin-bottom:30px">
            ${descriptionHtml}
        </div>
        <div class="modal-actions">
            ${linksHtml}
        </div>
        ${project.detailImage ? `<br><img src="${project.detailImage}" style="width:100%; margin-top:20px" alt="${project.detailImageAlt}">` : ''}
    `;

    modal.showModal();

    modal.querySelector('.close-modal').onclick = () => modal.close();
    modal.onclick = (e) => { if(e.target === modal) modal.close(); };
}

// --- Map Logic ---
let mapInstance = null;

function initMap() {
    if (mapInstance) return;

    mapInstance = L.map('map-container').setView([51.505, -0.09], 3);

    // Use a cleaner tile layer (e.g., CartoDB Positron for Light, Dark Matter for Dark)
    // For simplicity, sticking to OSM but we could switch based on theme.
    // Let's use a standard OSM for now.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance);

    const markers = L.markerClusterGroup();

    const projects = state.data.projects['en'] || [];

    projects.forEach(p => {
        if (p.coordinates) {
             const marker = L.marker(p.coordinates);
             const currentLangProject = (state.data.projects[state.lang] || []).find(proj => proj.id === p.id) || p;
             marker.bindPopup(`<b>${currentLangProject.title}</b><br><small>${currentLangProject.skills ? currentLangProject.skills[0] : ''}</small>`);
             markers.addLayer(marker);
        }
    });

    mapInstance.addLayer(markers);

    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 100);
}

function openMap() {
    const modal = document.getElementById('map-modal');
    modal.showModal();
    initMap();
    setTimeout(() => mapInstance.invalidateSize(), 200);

    modal.querySelector('.close-modal').onclick = () => modal.close();
}

// --- Scroll Reveal ---
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-row').forEach(row => {
        observer.observe(row);
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Theme Init
    document.documentElement.setAttribute('data-theme', state.theme);
    document.getElementById('theme-toggle').onclick = toggleTheme;

    // Lang Init
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.onclick = (e) => {
            state.lang = e.target.dataset.lang;
            updateLanguage();
        };
    });

    // Map Click
    document.getElementById('open-map-btn').onclick = openMap;

    // Load Content
    loadData().then(() => {
        updateLanguage();
    });
});
