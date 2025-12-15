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
    seeOnMap: "See on Map"
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
    seeOnMap: "Voir sur la carte"
  }
};

function setLanguage(lang) {
  if (!translations[lang]) return;

  // Update static text elements using data-lang-key attribute
  document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      if (translations[lang][key]) {
          // Special handling for elements that might contain nested HTML (like the arrow in See CV)
          if (key === 'seeCV') {
               element.innerHTML = translations[lang][key] + ' <span>&rarr;</span>';
          } else {
              element.textContent = translations[lang][key];
          }
      }
  });
}
