document.addEventListener('DOMContentLoaded', () => {
    const mapModal = document.getElementById('map-modal');
    const openMapBtn = document.getElementById('map-cta-btn');
    const closeMapBtn = document.getElementById('close-map-btn');
    let map;

    openMapBtn.addEventListener('click', () => {
        mapModal.classList.remove('hidden');
        if (!map) {
            initializeMap();
        }
    });

    closeMapBtn.addEventListener('click', () => {
        mapModal.classList.add('hidden');
    });

    function initializeMap() {
        map = L.map('map').setView([54.5, -2.5], 6);

        fetch('https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/gb/lad.json')
            .then(response => response.json())
            .then(geojson => {
                const geoJsonLayer = L.geoJson(geojson, {
                    style: function(feature) {
                        return {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                            weight: 1,
                            fillColor: getComputedStyle(document.documentElement).getPropertyValue('--card-background').trim(),
                            fillOpacity: 1
                        };
                    }
                }).addTo(map);

                // Note: markerClusterGroup was removed as it was preventing markers from appearing.
                // For a small number of markers, adding them directly to the map is acceptable.
                // If the number of projects increases significantly, this may need to be revisited.
                const currentLang = document.documentElement.lang || 'en';
                const projects = projectsData[currentLang];

                projects.forEach(project => {
                    if (project.coordinates) {
                        const marker = L.marker(project.coordinates);
                        marker.bindPopup(`<b>${project.title}</b><br>${project.description[0]}`);
                        marker.addTo(map);
                    }
                });
            });
    }
});