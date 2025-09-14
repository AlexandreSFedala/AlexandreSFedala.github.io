// particles-init.js
particlesJS('particles-js', {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.9 },
    size: { value: 5, random: true },
    line_linked: {
      enable: true,
      distance: 160,
      color: '#e6a21a',
      opacity: 0.6,
      width: 1
    },
    move: { enable: true, speed: 2, out_mode: 'out' }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    },
    modes: {
      grab: { distance: 200, line_linked: { opacity: 0.8 } },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
