const translations = {
  en: {
    aboutMe: "About Me",
    skills: "Skills",
    projects: "Projects",
    scrollDown: "Scroll Down",
    portfolioTitle: "An Undergraduate Portfolio",
    portfolioSubtitle: "by Alexandre S. Fedala",
    skillsUsedTitle: "Skills Used",
    seeCV: "See CV",
    seeOnMap: "See on Map",
    contactMe: "Contact Me",
    location: "Location",
    heroIntro: "Welcome to my portfolio.",
    jobTitle: "Undergraduate Civil Engineering Student",
    name: "Alexandre S. Fedala"
  },
  fr: {
    aboutMe: "Biographie",
    skills: "Compétences",
    projects: "Projets",
    scrollDown: "Faire défiler",
    portfolioTitle: "Un Portfolio de Licence",
    portfolioSubtitle: "par Alexandre S. Fedala",
    skillsUsedTitle: "Compétences Utilisées",
    seeCV: "Voir CV",
    seeOnMap: "Voir sur la carte",
    contactMe: "Me Contacter",
    location: "Localisation",
    heroIntro: "Bienvenue sur mon portfolio.",
    jobTitle: "Étudiant en Licence de Génie Civil",
    name: "Alexandre S. Fedala"
  }
};

function setLanguage(lang) {
  if (!translations[lang]) return;

  // This function now only updates static text content that is always present on the page.
  // The dynamic content sections are rendered by functions in js/main.js.
  document.querySelector('.column.aboutme h2').textContent = translations[lang].aboutMe;
  document.querySelector('.column.skills h2').textContent = translations[lang].skills;
  document.querySelector('.column.projects h2').textContent = translations[lang].projects;
  document.querySelector('header h1').textContent = translations[lang].portfolioTitle;
  document.querySelector('header p').textContent = translations[lang].portfolioSubtitle;
  document.querySelector('.scroll-text').textContent = translations[lang].scrollDown;
  document.querySelector('.cv-arrow').firstChild.textContent = translations[lang].seeCV + ' ';
}