document.addEventListener('DOMContentLoaded', () => {
    const mapModal = document.getElementById('map-modal');
    // openMapBtn logic is now handled in script.js via delegation/event listener,
    // but we can keep the close logic here.
    const closeMapBtn = document.getElementById('close-map-btn');
    let map;

    // Listen for the modal opening to initialize/resize map
    // We can use a MutationObserver or listen for a custom event.
    // simpler: hook into the same click event or expose an init function.

    // Actually, script.js handles the 'open' click.
    // We just need to ensure initializeMap is called when the modal becomes visible.

    // We can poll or wait for an event.
    // Let's attach to the open button again here, it won't hurt to have double listeners if they do safe things.
    // But since `openMapBtn` (map-cta-btn) exists in the DOM, we can attach.
    const openMapBtn = document.getElementById('map-cta-btn');
    if (openMapBtn) {
        openMapBtn.addEventListener('click', () => {
            // Modal visibility handled in script.js, here we just ensure map init
            setTimeout(() => {
                if (!map) {
                    initializeMap();
                } else {
                    map.invalidateSize();
                }
            }, 100);
        });
    }

    if (closeMapBtn) {
        closeMapBtn.addEventListener('click', () => {
            mapModal.classList.add('hidden');
        });
    }

    async function initializeMap() {
        if (map) return; // Prevent double init

        map = L.map('map').setView([54.5, -2.5], 6);

        // Fetch Data explicitly since it's not global
        const { projectsData } = await getAllData();

        fetch('https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/gb/lad.json')
            .then(response => response.json())
            .then(geojson => {
                const styleMap = function(feature) {
                    // Update CSS variable names to match new style.css
                    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#2c3e50';
                    const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#ffffff';

                    return {
                        color: primaryColor,
                        weight: 1,
                        fillColor: cardBg,
                        fillOpacity: 0.5
                    };
                };

                L.geoJson(geojson, {
                    style: styleMap
                }).addTo(map);

                // Add Markers
                // We need to know the current language.
                // We can check the active language button or default to 'en'.
                // Since this runs after content load, we can infer it or just show 'en' for now.
                // A better way is to look at the DOM state or store lang globally.
                // Let's check a data attribute on body or html if set.
                // script.js / loader.js sets window.setLanguage (in texts.js).
                // But typically it doesn't store state on DOM except maybe inside texts.js closure.

                // Let's assume 'en' if not found, or try to find a selected lang button.
                let currentLang = 'en';
                const selectedLangBtn = document.querySelector('.language-button.selected');
                if (selectedLangBtn) {
                    currentLang = selectedLangBtn.dataset.lang;
                }

                if (projectsData && projectsData[currentLang]) {
                    const projects = projectsData[currentLang];
                    projects.forEach(project => {
                        if (project.coordinates) {
                            const marker = L.marker(project.coordinates);
                            marker.bindPopup(`<b>${project.title}</b><br>${project.description[0]}`);
                            marker.addTo(map);
                        }
                    });
                }
            });
    }
});
