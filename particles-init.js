// particles-init.js - Optimized for Performance
particlesJS('particles-js', {
    particles: {
        number: {
            value: 20, // Reduced from 30
            density: {
                enable: true,
                value_area: 1200 // Increased from 800 to make it less dense
            }
        },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.4, // Reduced from 0.5
            random: true
        },
        size: {
            value: 2.5, // Slightly smaller
            random: true
        },
        line_linked: {
            enable: true,
            distance: 180, // Increased to compensate for fewer particles
            color: '#ffffff',
            opacity: 0.3, // Reduced from 0.4
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5, // Reduced from 2
            out_mode: 'out'
        }
    },
    interactivity: {
        detect_on: 'window',
        events: {
            onhover: {
                enable: false, // Disabled interactivity
                mode: 'grab'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 200,
                line_linked: { opacity: 0.8 }
            },
        }
    },
    retina_detect: false // Disabled for performance
});