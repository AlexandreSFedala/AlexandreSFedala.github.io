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
    renderAboutAndTimeline(); // Combined Logic

    document.getElementById('year').textContent = new Date().getFullYear();
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    const projects = state.data.projects[state.lang] || [];

    projects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'project-card';

        const description = Array.isArray(project.description) ? project.description[0] : project.description;
        const shortDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;

        div.innerHTML = `
            <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}" class="project-thumb" loading="lazy">
            <div class="project-info">
                <h4>${project.title}</h4>
                <p style="color:var(--text-secondary); margin-bottom:16px">${shortDesc}</p>
                <div class="tech-stack" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px">
                    ${(project.skills || []).slice(0,3).map(s => `<span style="font-size:0.8rem; background:var(--bg-left); padding:2px 8px; border-radius:4px">${s}</span>`).join('')}
                </div>
            </div>
        `;
        div.onclick = () => openProjectModal(project);
        container.appendChild(div);
    });
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    const skillsData = state.data.skills[state.lang];
    if (!skillsData) return;

    const categories = [
        { key: 'technical', title: skillsData.technicalTitle || 'Technical' },
        { key: 'soft', title: skillsData.softTitle || 'Soft Skills' }
    ];

    categories.forEach(cat => {
        const items = skillsData[cat.key];
        if (items && items.length > 0) {
            const group = document.createElement('div');
            group.className = 'skill-group';
            group.innerHTML = `<h4>${cat.title}</h4>`;

            const tags = document.createElement('div');
            tags.className = 'skill-tags';

            items.forEach(item => {
                const span = document.createElement('span');
                span.className = 'skill-pill';
                span.textContent = item.name;
                tags.appendChild(span);
            });

            group.appendChild(tags);
            container.appendChild(group);
        }
    });
}

function renderAboutAndTimeline() {
    const aboutContainer = document.getElementById('about-content');
    const timelineContainer = document.getElementById('timeline-content');
    const certsContainer = document.getElementById('certs-container');

    aboutContainer.innerHTML = '';
    timelineContainer.innerHTML = '';
    certsContainer.innerHTML = '';

    const aboutData = state.data.about[state.lang] || [];

    aboutData.forEach(slide => {
        // Bio Text
        if (slide.type === 'text' && slide.title.includes('Bio')) {
             const content = Array.isArray(slide.content) ? slide.content : [slide.content];
             content.forEach(p => {
                 aboutContainer.innerHTML += `<p>${p}</p>`;
             });
        }
        // Fallback for bio if title check fails (take first text)
        else if (slide.type === 'text' && aboutContainer.innerHTML === '') {
             const content = Array.isArray(slide.content) ? slide.content : [slide.content];
             content.forEach(p => {
                 aboutContainer.innerHTML += `<p>${p}</p>`;
             });
        }

        // Education Timeline
        else if (slide.type === 'education_languages') {
            if (slide.content.education) {
                slide.content.education.forEach(edu => {
                    const div = document.createElement('div');
                    div.className = 'timeline-item';
                    div.innerHTML = `
                        <span class="timeline-date">${edu.years}</span>
                        <div class="timeline-role">${edu.degree}</div>
                        <div class="timeline-place">${edu.school}</div>
                        <div style="font-size:0.9rem; margin-top:4px">${edu.grade}</div>
                    `;
                    timelineContainer.appendChild(div);
                });
            }
        }

        // Certifications
        else if (slide.type === 'certifications') {
            slide.content.forEach(cert => {
                const div = document.createElement('div');
                div.className = 'cert-item';
                div.innerHTML = `
                    <img src="${cert.img}" alt="${cert.title}">
                    <p style="font-size:0.9rem; font-weight:600">${cert.title}</p>
                `;
                certsContainer.appendChild(div);
            });
        }
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
        linksHtml += `<a href="${project.pdf}" target="_blank" class="primary-btn" style="margin-right:10px">${project.pdfButtonText || 'View PDF'}</a> `;
    }
    if (project.downloadFile) {
        linksHtml += `<a href="${project.downloadFile}" class="secondary-btn">${project.downloadText || 'Download'}</a>`;
    }

    body.innerHTML = `
        <h2 style="font-family:var(--font-heading); margin-bottom:10px">${project.title}</h2>
        <div class="tech-stack" style="margin-bottom:20px; color:var(--text-secondary)">
            ${(project.skills || []).join(' • ')}
        </div>
        ${project.image ? `<img src="${project.image}" style="width:100%; margin-bottom:20px; border-radius:12px" alt="${project.alt}">` : ''}
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance);

    const markers = L.markerClusterGroup();

    const projects = state.data.projects['en'] || [];

    projects.forEach(p => {
        if (p.coordinates) {
             const marker = L.marker(p.coordinates);
             const currentLangProject = (state.data.projects[state.lang] || []).find(proj => proj.id === p.id) || p;
             marker.bindPopup(`<b>${currentLangProject.title}</b>`);
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
