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
       NEOCLASSICAL MINIMALISM HERO INTERACTION
       ========================================================================== */
    const heroSec = document.getElementById('hero');
    const openBtn = document.getElementById('open-scroll-btn');
    const closeBtn = document.getElementById('close-scroll-btn');
    const authorName = document.querySelector('.hero-author-name');

    // 1. Open / Close actions
    if (openBtn && heroSec) {
        openBtn.addEventListener('click', () => {
            heroSec.classList.add('opened');
        });
    }

    if (authorName && heroSec) {
        authorName.addEventListener('click', () => {
            heroSec.classList.add('opened');
        });
    }

    if (closeBtn && heroSec) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            heroSec.classList.remove('opened');
        });
    }

    // 2. Dynamic Petal/Flower Spawning
    const petalsContainer = document.getElementById('hero-petals-container');
    if (petalsContainer) {
        const petalCount = 20;
        const petalPaths = [
            "M15 0 C25 15 25 30 15 40 C5 30 5 15 15 0", // Classic Petal
            "M15 0 C30 10 30 25 20 35 C10 25 0 10 15 0", // Curved Petal
            "M20 10 C22 5 28 5 30 10 C35 12 35 18 30 20 C28 25 22 25 20 20 C15 18 15 12 20 10 Z" // Small flower
        ];
        
        for (let i = 0; i < petalCount; i++) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 40 40");
            svg.classList.add("floating-petal");
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const randomPath = petalPaths[Math.floor(Math.random() * petalPaths.length)];
            path.setAttribute("d", randomPath);
            path.setAttribute("fill", "currentColor");
            svg.appendChild(path);
            
            // Random size, starting coordinates, wind speeds
            const size = Math.random() * 20 + 15; // 15px to 35px
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * -20; // Spread initially
            const duration = Math.random() * 15 + 15; // 15s to 30s
            const swayDuration = Math.random() * 4 + 4; // 4s to 8s
            
            svg.style.width = `${size}px`;
            svg.style.height = `${size}px`;
            svg.style.left = `${left}%`;
            svg.style.top = `${top}%`;
            
            svg.style.animation = `
                floatDown ${duration}s linear infinite,
                sway ${swayDuration}s ease-in-out infinite alternate
            `;
            svg.style.animationDelay = `${delay}s, ${Math.random() * 5}s`;
            
            petalsContainer.appendChild(svg);
        }
    }

    // 3. Mouse wind-push on petals
    if (heroSec && petalsContainer) {
        heroSec.addEventListener('mousemove', (e) => {
            const rect = heroSec.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const petals = document.querySelectorAll('.floating-petal');
            
            petals.forEach(petal => {
                const petalRect = petal.getBoundingClientRect();
                const petalX = petalRect.left + petalRect.width / 2 - rect.left;
                const petalY = petalRect.top + petalRect.height / 2 - rect.top;
                
                const diffX = petalX - mouseX;
                const diffY = petalY - mouseY;
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);
                
                // Wind push radius 200px
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    const pushX = (diffX / distance) * 50 * force;
                    const pushY = (diffY / distance) * 50 * force;
                    
                    petal.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${force * 45}deg)`;
                } else {
                    petal.style.transform = 'translate(0px, 0px) rotate(0deg)';
                }
            });
        });

        heroSec.addEventListener('mouseleave', () => {
            const petals = document.querySelectorAll('.floating-petal');
            petals.forEach(petal => {
                petal.style.transform = 'translate(0px, 0px) rotate(0deg)';
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
