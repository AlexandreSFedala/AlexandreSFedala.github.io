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
// translations is global from texts.js

function t(key) {
    if (typeof translations !== 'undefined' && translations[state.lang] && translations[state.lang][key]) {
        return translations[state.lang][key];
    }
    // Fallback if texts.js isn't loaded yet or key missing
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
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    // Get projects for current language
    const projects = state.data.projects[state.lang] || [];

    // Take first 4 projects for the grid
    const featured = projects.slice(0, 4);

    featured.forEach(project => {
        const div = document.createElement('div');
        div.className = 'mini-project-card';
        div.innerHTML = `<strong>${project.title}</strong>`;
        div.onclick = () => openProjectModal(project);
        container.appendChild(div);
    });
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';

    const skillsData = state.data.skills[state.lang];
    if (!skillsData) return;

    const technical = skillsData.technical || [];
    const soft = skillsData.soft || [];

    // Merge and show
    const allSkills = [...technical, ...soft];

    allSkills.slice(0, 15).forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = skill.name;
        container.appendChild(span);
    });
}

function renderAbout() {
    const container = document.getElementById('about-content');
    container.innerHTML = '';

    const aboutData = state.data.about[state.lang] || [];

    // We want to show a summary in the bento card.
    // Let's grab the first "text" type content.
    const bioSlide = aboutData.find(s => s.type === 'text');

    if (bioSlide) {
        const text = Array.isArray(bioSlide.content) ? bioSlide.content[0] : bioSlide.content;
        container.innerHTML = `<p>${text}</p>`;
    }

    // We could add a "Read More" button that opens a modal with the full Education/Certifications info
    // For now, let's append a small Education summary if available
    const eduSlide = aboutData.find(s => s.type === 'education_languages');
    if (eduSlide && eduSlide.content.education.length > 0) {
        const school = eduSlide.content.education[0].school;
        const degree = eduSlide.content.education[0].degree;
        container.innerHTML += `<hr style="margin: 10px 0; border:0; border-top:1px solid var(--text-secondary); opacity: 0.3"><p><small>🎓 ${degree}<br>${school}</small></p>`;
    }
}

// --- Modals ---
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('project-modal-body');

    let descriptionHtml = '';
    if (Array.isArray(project.description)) {
        descriptionHtml = project.description.map(p => `<p>${p}</p>`).join('');
    } else {
        descriptionHtml = `<p>${project.description}</p>`;
    }

    let linksHtml = '';
    if (project.pdf) {
        linksHtml += `<a href="${project.pdf}" target="_blank" class="btn">${project.pdfButtonText || 'View PDF'}</a> `;
    }
    if (project.downloadFile) {
        linksHtml += `<a href="${project.downloadFile}" class="btn secondary">${project.downloadText || 'Download'}</a>`;
    }

    body.innerHTML = `
        <h2>${project.title}</h2>
        <div class="tech-stack">
            ${(project.skills || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${project.image ? `<img src="${project.image}" class="project-detail-img" alt="${project.alt}">` : ''}
        <div class="project-description">
            ${descriptionHtml}
        </div>
        <br>
        <div class="modal-actions">
            ${linksHtml}
        </div>
        ${project.detailImage ? `<br><img src="${project.detailImage}" class="project-detail-img" alt="${project.detailImageAlt}">` : ''}
    `;

    modal.showModal();

    modal.querySelector('.close-modal').onclick = () => modal.close();
    modal.onclick = (e) => { if(e.target === modal) modal.close(); };
}

// --- Map Logic ---
let mapInstance = null;

function initMap() {
    if (mapInstance) return;

    mapInstance = L.map('map-container').setView([51.505, -0.09], 4); // Zoom level 4 for world view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    const markers = L.markerClusterGroup();

    // Use 'en' projects for coordinates, as coordinates don't change by language
    const projects = state.data.projects['en'] || [];

    projects.forEach(p => {
        if (p.coordinates) {
             const marker = L.marker(p.coordinates);
             // Find localized title
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
    modal.onclick = (e) => { if(e.target === modal) modal.close(); };
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
    document.getElementById('card-map').onclick = openMap;

    // Load Content
    // We need 'texts' variable. If texts.js loads before app.js, it's there.
    loadData().then(() => {
        updateLanguage();
    });
});
