// particles-init.js
particlesJS('particles-js', {
  particles: {
    number: { value: 30, density: { enable: true, value_area: 800 } },
    color: { value: '#f0f0f0' },
    shape: { type: 'circle' },
    opacity: { value: 0.9 },
    size: { value: 6, random: true },
    line_linked: {
      enable: true,
      distance: 200,
      color: '#e6a21a',
      opacity: 0.6,
      width: 3
    },
    move: { enable: true, speed: 3, out_mode: 'out' }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: { enable: true, mode: 'grab' },
      resize: true
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
    }
  },
  retina_detect: true
});
