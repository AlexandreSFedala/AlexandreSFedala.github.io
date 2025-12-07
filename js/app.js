// Imports and Setup
const state = {
    lang: 'en',
    theme: localStorage.getItem('theme') || 'light',
    view: localStorage.getItem('view') || 'blueprint', // 'blueprint' or 'gallery'
    data: {
        projects: {}, // { en: [], fr: [] }
        skills: {},   // { en: {}, fr: {} }
        about: {}     // { en: [], fr: [] }
    }
};

// --- View Switcher Logic ---
function initView() {
    const body = document.body;
    const blueprintBtn = document.getElementById('view-btn-blueprint');
    const galleryBtn = document.getElementById('view-btn-gallery');

    // Set initial class
    setView(state.view);

    blueprintBtn.onclick = () => setView('blueprint');
    galleryBtn.onclick = () => setView('gallery');
}

function setView(viewName) {
    state.view = viewName;
    localStorage.setItem('view', viewName);

    document.body.className = `view-${viewName}`;

    // Update buttons
    document.getElementById('view-btn-blueprint').classList.toggle('active', viewName === 'blueprint');
    document.getElementById('view-btn-gallery').classList.toggle('active', viewName === 'gallery');

    // Handle specific logic (like horizontal scroll for gallery)
    if (viewName === 'gallery') {
        enableHorizontalScroll();
    } else {
        disableHorizontalScroll();
    }
}

// Horizontal Scroll Hijack for Gallery Mode
function enableHorizontalScroll() {
    const container = document.getElementById('app-container');
    container.addEventListener('wheel', handleHorizontalWheel, { passive: false });
}

function disableHorizontalScroll() {
    const container = document.getElementById('app-container');
    container.removeEventListener('wheel', handleHorizontalWheel);
}

function handleHorizontalWheel(e) {
    // Only hijack if we are in gallery mode
    if (document.body.classList.contains('view-gallery')) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            document.getElementById('app-container').scrollLeft += e.deltaY;
        }
    }
}


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
    renderAboutAndTimeline();

    document.getElementById('year').textContent = new Date().getFullYear();
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    const projects = state.data.projects[state.lang] || [];

    projects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'project-card';

        // Same content structure for both views, CSS handles layout
        const description = Array.isArray(project.description) ? project.description[0] : project.description;
        const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;

        div.innerHTML = `
            <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}" loading="lazy">
            <div class="project-info">
                <h4>${project.title}</h4>
                <p class="project-desc">${shortDesc}</p>
                <div class="tech-stack">
                    ${(project.skills || []).slice(0,3).map(s => `<span class="tag">${s}</span>`).join(' ')}
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

    // Flatten for simple list in Blueprint / Gallery
    // Or render groups if preferred. Let's do a simple tag cloud for now.
    const technical = skillsData.technical || [];
    const soft = skillsData.soft || [];
    const all = [...technical, ...soft];

    all.forEach(item => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = item.name;
        // Styles are in CSS
        container.appendChild(span);
    });
}

function renderAboutAndTimeline() {
    const aboutContainer = document.getElementById('about-content');
    const timelineContainer = document.getElementById('timeline-content');
    const certsContainer = document.getElementById('certs-content');

    aboutContainer.innerHTML = '';
    timelineContainer.innerHTML = '';
    certsContainer.innerHTML = '';

    const aboutData = state.data.about[state.lang] || [];

    aboutData.forEach(slide => {
        // Bio
        if (slide.type === 'text') {
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
                    `;
                    timelineContainer.appendChild(div);
                });
            }
        }

        // Certs
        else if (slide.type === 'certifications') {
            slide.content.forEach(cert => {
                const div = document.createElement('div');
                div.className = 'cert-item';
                div.textContent = cert.title;
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
        linksHtml += `<a href="${project.pdf}" target="_blank" style="text-decoration:underline; font-weight:bold; margin-right:10px">${project.pdfButtonText || 'View PDF'}</a> `;
    }
    if (project.downloadFile) {
        linksHtml += `<a href="${project.downloadFile}" style="text-decoration:underline; font-weight:bold;">${project.downloadText || 'Download'}</a>`;
    }

    body.innerHTML = `
        <h2>${project.title}</h2>
        <div style="margin-bottom:10px; font-style:italic; color:#666">
            ${(project.skills || []).join(' • ')}
        </div>
        ${project.image ? `<img src="${project.image}" style="width:100%; margin-bottom:20px;" alt="${project.alt}">` : ''}
        <div style="margin-bottom:20px">
            ${descriptionHtml}
        </div>
        <div>
            ${linksHtml}
        </div>
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
    // View Init
    initView();

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
