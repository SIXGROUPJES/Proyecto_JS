const particlesContainer = document.getElementById("particles-js");

if (particlesContainer && window.particlesJS) {
    window.particlesJS("particles-js", {
        particles: {
            number: {
                value: 72,
                density: {
                    enable: true,
                    value_area: 900
                }
            },
            color: {
                value: "#38bdf8"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.46,
                random: true,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 2.8,
                random: true,
                anim: {
                    enable: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#6366f1",
                opacity: 0.34,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: false
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 130,
                    line_linked: {
                        opacity: 0.42
                    }
                }
            }
        },
        retina_detect: true
    });
}
