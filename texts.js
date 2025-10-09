const translations = {
  en: {
    aboutMe: "About Me",
    aboutMeText: [
      "I am a second-year undergraduate civil engineering student at University College London with a diverse international background, having completed my secondary education in France through a BFI pathway.",
      "My goal as a civil engineer is to create tangible, positive change in the built environment — developing solutions that serve clients, end-users, and local communities alike. I have a particular interest in vernacular design, ensuring that buildings and infrastructure respond to local needs and integrate seamlessly into their surroundings.",
      "Sustainability is central to my approach. Recognising the construction industry's significant environmental impact, I am committed to delivering projects that meet and exceed current climate regulations, aiming for carbon neutrality — or even a net-negative footprint — throughout my future work.",
      "My experience collaborating in a university environment has strengthened my ability to explain complex ideas clearly, and I am aiming to continue doing so in professional environments via internships."
    ],
    skills: "Skills",
    projects: "Projects",
    scrollDown: "Scroll Down",
    portfolioTitle: "An Undergraduate Portfolio",
    portfolioSubtitle: "by Alexandre S. Fedala",
    certificationsTitle: "Certifications",
    skillsUsedTitle: "Skills Used",
    seeCV: "See CV"
  },
  fr: {
    aboutMe: "Biographie",
    aboutMeText: [
      "Je suis étudiant en deuxième année de génie civil à University College London, avec un parcours international diversifié, ayant effectué ma scolarité secondaire en France via la filière BFI.",
      "Mon objectif en tant qu'ingénieur civil est d'apporter un changement concret et positif à l'environnement bâti — en développant des solutions qui servent les clients, les utilisateurs finaux et les communautés locales. J'ai un intérêt particulier pour l'architecture vernaculaire, afin que les bâtiments et infrastructures répondent aux besoins locaux et s'intègrent harmonieusement à leur environnement.",
      "La durabilité est au cœur de ma démarche. Conscient de l'impact environnemental du secteur de la construction, je m'engage à réaliser des projets qui respectent et dépassent les réglementations climatiques actuelles, visant la neutralité carbone — voire un bilan carbone négatif — tout au long de ma carrière.",
      "Mon expérience de collaboration à l'université a renforcé ma capacité à expliquer clairement des idées complexes, et je souhaite continuer à le faire en milieu professionnel, notamment à travers des stages."
    ],
    skills: "Compétences",
    projects: "Projets",
    scrollDown: "Faire défiler",
    portfolioTitle: "Un Portfolio de Licence",
    portfolioSubtitle: "par Alexandre S. Fedala",
    certificationsTitle: "Certifications",
    skillsUsedTitle: "Compétences Utilisées",
    seeCV: "Voir CV"
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
  document.querySelector('.certifications-title').textContent = translations[lang].certificationsTitle;
}