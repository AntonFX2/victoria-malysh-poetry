document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       MOOD SELECTION & THEME SWITCHER
       ========================================================================== */
    const moodBtns = document.querySelectorAll('.mood-btn');
    const bodyEl = document.body;
    const currentMoodLabel = document.getElementById('current-mood-label');
    const poemCards = document.querySelectorAll('.poem-card');

    const moodLabelMap = {
        'default': 'Классический стиль',
        'romance': 'Светлая романтика',
        'philosophy': 'Глубокая философия',
        'irony': 'Жизненная ирония'
    };

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.getAttribute('data-mood');
            
            // 1. Update active button state
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Change page body theme data attribute
            bodyEl.setAttribute('data-theme', mood);

            // 3. Update top-nav text label
            if (currentMoodLabel && moodLabelMap[mood]) {
                currentMoodLabel.textContent = moodLabelMap[mood];
            }

            // 4. Filter poems with a smooth scale-in animation
            filterPoems(mood);
        });
    });

    function filterPoems(selectedMood) {
        poemCards.forEach(card => {
            const cardMood = card.getAttribute('data-mood-type');
            
            if (selectedMood === 'default' || cardMood === selectedMood) {
                card.classList.remove('hidden');
                // Mini stagger entry animation
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = 'revealLine 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    /* ==========================================================================
       DYNAMIC INK BLOT GENERATOR
       ========================================================================== */
    const inkCanvas = document.getElementById('ink-canvas');

    document.addEventListener('click', (e) => {
        // Prevent ink stains when clicking interactive controls (buttons, links, inputs, cards)
        const ignoredTags = ['A', 'BUTTON', 'INPUT', 'LABEL', 'I', 'TEXTAREA'];
        const isInteractive = e.target.closest('.poem-card') || 
                              e.target.closest('.main-header') ||
                              e.target.closest('.envelope') ||
                              e.target.closest('.silhouette-box') ||
                              ignoredTags.includes(e.target.tagName);

        if (isInteractive || !inkCanvas) return;

        createInkBlot(e.clientX, e.clientY);
    });

    function createInkBlot(x, y) {
        const blot = document.createElement('div');
        blot.classList.add('ink-blot');
        
        // Randomize size and rotation for natural appearance
        const randomSize = Math.floor(Math.random() * 15) + 10; // 10px to 25px
        const randomRotation = Math.floor(Math.random() * 360);
        
        blot.style.left = `${x}px`;
        blot.style.top = `${y}px`;
        blot.style.width = `${randomSize}px`;
        blot.style.height = `${randomSize}px`;
        blot.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
        
        inkCanvas.appendChild(blot);
        
        // Cleanup after animation completes to avoid bloating DOM
        setTimeout(() => {
            blot.remove();
        }, 1500);
    }

    /* ==========================================================================
       MOBILE TOUCH SUPPORT FOR MARGIN NOTES
       ========================================================================== */
    const marginNotes = document.querySelectorAll('.margin-note');

    marginNotes.forEach(note => {
        note.addEventListener('click', (e) => {
            // Toggles active state of marginalia tooltip for mobile touch viewports
            if (window.innerWidth <= 992) {
                e.stopPropagation();
                // Close other open notes first
                marginNotes.forEach(n => {
                    if (n !== note) n.classList.remove('active-mobile');
                });
                note.classList.toggle('active-mobile');
            }
        });
    });

    // Close mobile marginalia if tapping outside
    document.addEventListener('click', () => {
        marginNotes.forEach(n => n.classList.remove('active-mobile'));
    });

    /* ==========================================================================
       SUBSCRIBE FORM & INTERACTIVE ENVELOPE
       ========================================================================== */
    const emailInput = document.getElementById('subscriber-email');
    const waxSealBtn = document.getElementById('wax-seal-btn');
    const envelope = document.querySelector('.envelope');
    const envelopeSuccess = document.getElementById('envelope-success');
    const resetEnvelopeBtn = document.getElementById('reset-envelope-btn');

    if (waxSealBtn && emailInput && envelope && envelopeSuccess) {
        waxSealBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Validate email syntax
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailValue || !emailRegex.test(emailValue)) {
                // Shake email input to show invalid error state
                emailInput.classList.add('error-shake');
                emailInput.focus();
                
                // Remove class after animation finishes
                setTimeout(() => {
                    emailInput.classList.remove('error-shake');
                }, 500);
                return;
            }

            // Valid! Trigger stamp animation sequence
            envelope.classList.add('sending');

            // 1. Wait for stamp hit animation (800ms)
            setTimeout(() => {
                envelope.classList.remove('sending');
                envelope.classList.add('sent');
                
                // 2. Open success drawer card
                setTimeout(() => {
                    envelopeSuccess.classList.add('active');
                }, 400);

            }, 900);
        });
    }

    if (resetEnvelopeBtn && envelope && envelopeSuccess && emailInput) {
        resetEnvelopeBtn.addEventListener('click', () => {
            // Reset state back to clean envelope input
            emailInput.value = '';
            envelope.classList.remove('sent');
            envelopeSuccess.classList.remove('active');
        });
    }

    /* ==========================================================================
       HERO SCROLL HINT SMOOTH SCROLLING
       ========================================================================== */
    const scrollHint = document.querySelector('.scroll-down-hint');
    if (scrollHint) {
        scrollHint.addEventListener('click', () => {
            const targetSection = document.getElementById('poetry');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ==========================================================================
       CABINET PARALLAX DESK SCENE ANIMATION
       ========================================================================== */
    const deskScene = document.getElementById('desk-scene');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    if (deskScene && parallaxLayers.length > 0) {
        const baseRotations = {
            'desk-art-frame': 5,
            'back-sheet': -12,
            'middle-sheet': -4,
            'main-sheet': 2
        };

        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Simple parallax translations and rotations based on data-depth
            parallaxLayers.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0.5;
                
                let baseRot = 0;
                if (layer.classList.contains('desk-art-frame')) baseRot = baseRotations['desk-art-frame'];
                else if (layer.classList.contains('back-sheet')) baseRot = baseRotations['back-sheet'];
                else if (layer.classList.contains('middle-sheet')) baseRot = baseRotations['middle-sheet'];
                else if (layer.classList.contains('main-sheet')) baseRot = baseRotations['main-sheet'];

                const moveX = mouseX * depth * 0.04;
                const moveY = mouseY * depth * 0.04;
                const tiltX = -mouseY * depth * 0.015;
                const tiltY = mouseX * depth * 0.015;

                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${baseRot}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
        });
    }
});

// Dynamic shaking animation helper stylesheet addition for input validation errors
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes errorShake {
    0%, 100% { transform: translateX(0); border-bottom-color: #8E1C19; }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
}
.error-shake {
    animation: errorShake 0.4s ease;
}
.margin-note.active-mobile::after {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
}
`;
document.head.appendChild(styleSheet);
