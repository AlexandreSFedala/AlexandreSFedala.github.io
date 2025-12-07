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
    renderAboutSections();

    document.getElementById('year').textContent = new Date().getFullYear();

    // Setup Scroll Observer after content is loaded
    setTimeout(setupScrollObserver, 100);
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    const projects = state.data.projects[state.lang] || [];

    projects.forEach(project => {
        const block = document.createElement('div');
        block.className = 'project-block';

        const description = Array.isArray(project.description) ? project.description[0] : project.description;
        const shortDesc = description.length > 150 ? description.substring(0, 150) + '...' : description;

        const tagsHtml = (project.skills || []).slice(0,3).map(s => `<span class="tag">${s}</span>`).join('');

        block.innerHTML = `
            <div class="project-image-wrapper" onclick="openProjectModal('${project.id}')">
                 <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}" class="project-img" loading="lazy">
            </div>
            <div class="project-text reveal-text">
                <div class="project-tags">${tagsHtml}</div>
                <h3 class="project-title" onclick="openProjectModal('${project.id}')">${project.title}</h3>
                <p style="margin-bottom:20px; color:var(--text-secondary)">${shortDesc}</p>
                <button class="btn-link" onclick="openProjectModal('${project.id}')">View Details</button>
            </div>
        `;
        container.appendChild(block);
    });
}

// Global helper
window.openProjectModal = (id) => {
    const project = (state.data.projects[state.lang] || []).find(p => p.id === id);
    if (project) openModal(project);
};


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
            group.className = 'skill-category';
            group.innerHTML = `
                <h4>${cat.title}</h4>
                <div class="skill-list">
                    ${items.map(item => `<span>${item.name}</span>`).join('')}
                </div>
            `;
            container.appendChild(group);
        }
    });
}

function renderAboutSections() {
    const aboutContent = document.getElementById('about-content');
    const timelineContent = document.getElementById('timeline-content');
    const certsContent = document.getElementById('certs-content');

    aboutContent.innerHTML = '';
    timelineContent.innerHTML = '';
    certsContent.innerHTML = '';

    const aboutData = state.data.about[state.lang] || [];

    aboutData.forEach(slide => {
        // Bio
        if (slide.type === 'text') {
             const content = Array.isArray(slide.content) ? slide.content : [slide.content];
             content.forEach(p => {
                 aboutContent.innerHTML += `<p>${p}</p>`;
             });
        }

        // Education
        else if (slide.type === 'education_languages') {
            if (slide.content.education) {
                slide.content.education.forEach(edu => {
                    const div = document.createElement('div');
                    div.className = 'timeline-item reveal-text';
                    div.innerHTML = `
                        <span class="timeline-year">${edu.years}</span>
                        <div class="timeline-role">${edu.degree}</div>
                        <div class="timeline-school">${edu.school}</div>
                    `;
                    timelineContent.appendChild(div);
                });
            }
        }

        // Certs
        else if (slide.type === 'certifications') {
            slide.content.forEach(cert => {
                const div = document.createElement('div');
                div.className = 'cert-item reveal-text';
                div.innerHTML = `
                    <img src="${cert.img}" alt="Cert">
                    <span>${cert.title}</span>
                `;
                certsContent.appendChild(div);
            });
        }
    });
}

// --- Animation Observer ---
function setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve if we only want it once
                 observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal-text, .project-image-wrapper').forEach(el => {
        observer.observe(el);
    });
}

// --- Modals ---
function openModal(project) {
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
        linksHtml += `<a href="${project.pdf}" target="_blank" class="btn-link" style="margin-right:20px">${project.pdfButtonText || 'View PDF'}</a> `;
    }
    if (project.downloadFile) {
        linksHtml += `<a href="${project.downloadFile}" class="btn-link">${project.downloadText || 'Download'}</a>`;
    }

    body.innerHTML = `
        <h2 style="font-size:2rem; margin-bottom:10px">${project.title}</h2>
        <div style="margin-bottom:20px; color:var(--text-secondary)">
            ${(project.skills || []).join(' / ')}
        </div>
        ${project.image ? `<img src="${project.image}" style="width:100%; margin-bottom:30px;" alt="${project.title}">` : ''}
        <div style="font-size:1.1rem; line-height:1.8; margin-bottom:40px; max-width:700px">
            ${descriptionHtml}
        </div>
        <div style="margin-bottom:20px">
            ${linksHtml}
        </div>
        ${project.detailImage ? `<br><img src="${project.detailImage}" style="width:100%;" alt="Detail">` : ''}
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
