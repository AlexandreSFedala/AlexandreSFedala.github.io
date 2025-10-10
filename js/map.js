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

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        const markers = L.markerClusterGroup();
        const currentLang = document.documentElement.lang || 'en';
        const projects = projectsData[currentLang];

        projects.forEach(project => {
            if (project.coordinates) {
                const marker = L.marker(project.coordinates);
                marker.bindPopup(`<b>${project.title}</b><br>${project.description[0]}`);
                markers.addLayer(marker);
            }
        });

        map.addLayer(markers);
    }
});