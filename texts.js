const translations = {
  en: {
    home: "Home",
    aboutMe: "About Me",
    skills: "Skills",
    projects: "Projects",
    scrollDown: "Scroll Down",
    portfolioTitle: "An Undergraduate Portfolio",
    portfolioSubtitle: "by Alexandre S. Fedala",
    skillsUsedTitle: "Skills Used",
    seeCV: "Curriculum Vitae",
    seeOnMap: "See on Map"
  },
  fr: {
    home: "Accueil",
    aboutMe: "Biographie",
    skills: "Compétences",
    projects: "Projets",
    scrollDown: "Faire défiler",
    portfolioTitle: "Un Portfolio de Licence",
    portfolioSubtitle: "par Alexandre S. Fedala",
    skillsUsedTitle: "Compétences Utilisées",
    seeCV: "Curriculum Vitae",
    seeOnMap: "Voir sur la carte"
  }
};

window.setLanguage = function(lang) {
  if (!translations[lang]) return;

  // Set the lang attribute on html for CSS specificity if needed
  document.documentElement.lang = lang;

  // Update elements with data-lang-key attribute
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.getAttribute('data-lang-key');
    if (translations[lang][key]) {
        // Handle text nodes specially if element has children
        if (element.children.length > 0 && element.lastChild.nodeType === 3) {
             // If mixed content, replace only text (simple heuristic, might need refinement for complex nodes)
             // For now, most of our keys are simple text.
             // The CV link has a span arrow maybe? In new design it is simple text.
             element.textContent = translations[lang][key];
        } else {
             element.textContent = translations[lang][key];
        }
    }
  });

  // Update header title/subtitle explicitly if needed, but data-lang-key should cover it.
  // The new HTML uses static text initially, so this function updates them.
};
