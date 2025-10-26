// js/data-loader.js

const dataCache = new Map();

async function fetchData(url) {
    if (dataCache.has(url)) {
        return dataCache.get(url);
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dataCache.set(url, data);
        return data;
    } catch (error) {
        console.error(`Could not fetch data from ${url}:`, error);
        return null;
    }
}

async function getAllData() {
    const aboutMeCarouselData = await fetchData('data/aboutme-carousel.json');
    const projectsData = await fetchData('data/projects.json');
    const skillsData = await fetchData('data/skills.json');
    const certificationsData = await fetchData('data/certifications.json');

    return {
        aboutMeCarouselData,
        projectsData,
        skillsData,
        certificationsData
    };
}
