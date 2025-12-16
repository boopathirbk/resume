import { resumeData } from './data.js';

/**
 * Main application initialization.
 * Uses strict mode automatically (ES Module).
 */
const App = {
    init() {
        this.renderContent();
        this.setupTheme();
        this.setupAnimations();
        this.setupAccessibility();
        this.updateYear();

        console.log('App Initialized successfully.');
    },

    /**
     * Renders all dynamic content from data.js
     */
    renderContent() {
        // Safe DOM query helper
        const $ = (id) => document.getElementById(id);

        if (!resumeData || !resumeData.personalInfo) {
            console.error('Resume data or personal info not found.');
            return;
        }

        // Hero Section
        if (resumeData.personalInfo.avatar && $('avatar')) {
            const avatarEl = $('avatar');
            avatarEl.src = resumeData.personalInfo.avatar;
            avatarEl.style.display = 'inline-block';
        }

        if ($('tagline')) $('tagline').textContent = resumeData.personalInfo.tagline || '';
        if ($('heroName')) $('heroName').innerHTML = `Hi, I'm <br>${resumeData.personalInfo.name || 'Developer'}`;
        if ($('heroBio')) $('heroBio').textContent = resumeData.personalInfo.bio || '';

        // Social Links
        const linksContainer = document.querySelector('.links-container');
        if (linksContainer && resumeData.personalInfo.social) {
            linksContainer.innerHTML = ''; // Clear existing

            const createLink = (url, text, iconClass, isPrimary = false) => {
                const a = document.createElement('a');
                a.href = url;
                a.className = `btn ${isPrimary ? 'primary' : ''}`;
                a.innerHTML = `<i class="${iconClass}"></i> ${text}`;
                a.target = "_blank";
                a.rel = "noopener noreferrer"; // Security best practice
                return a;
            };

            linksContainer.appendChild(createLink(resumeData.personalInfo.social.github, 'GitHub', 'fab fa-github', true));
            linksContainer.appendChild(createLink(resumeData.personalInfo.social.linkedin, 'LinkedIn', 'fab fa-linkedin'));
        }

        // Story with "Read More"
        const storyContainer = $('storyContent');
        if (storyContainer && resumeData.story?.content) {
            // Split by double newline to find paragraphs
            const paragraphs = resumeData.story.content.split(/\n\s*\n/);

            if (paragraphs.length > 1) {
                const firstPara = paragraphs[0];
                const cleanRest = paragraphs.slice(1).join('\n\n'); // Rejoin the rest

                storyContainer.innerHTML = `
                    <p>${firstPara}</p>
                    <div id="storyHidden" style="display: none; margin-top: 1rem;">
                        <p style="white-space: pre-line">${cleanRest}</p>
                    </div>
                    <button id="readMoreBtn" class="read-more-btn">Read More <i class="fas fa-chevron-down"></i></button>
                `;

                // Add Toggle Logic
                const btn = document.getElementById('readMoreBtn');
                const hiddenDiv = document.getElementById('storyHidden');

                btn.addEventListener('click', () => {
                    console.log('Read More Clicked');
                    const isHidden = hiddenDiv.style.display === 'none';
                    hiddenDiv.style.display = isHidden ? 'block' : 'none';
                    btn.innerHTML = isHidden
                        ? 'Show Less <i class="fas fa-chevron-up"></i>'
                        : 'Read More <i class="fas fa-chevron-down"></i>';
                });

            } else {
                // Short story, just show it
                storyContainer.textContent = resumeData.story.content;
            }
        }

        // Experience
        const expList = $('experienceList');
        if (expList && resumeData.experience) {
            resumeData.experience.forEach(exp => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                item.innerHTML = `
                    <div class="role">${exp.role}</div>
                    <div class="company">${exp.company}</div>
                    <span class="period text-secondary text-sm" style="margin-bottom: 1rem; display: block;">${exp.period}</span>
                    <ul class="text-secondary" style="list-style-position: inside; font-size: 0.95rem;">
                        ${exp.description.map(d => `<li style="margin-bottom:0.25rem">${d}</li>`).join('')}
                    </ul>
                `;
                expList.appendChild(item);
            });
        }

        // Projects
        const projGrid = $('projectsGrid');
        if (projGrid && resumeData.projects) {
            resumeData.projects.forEach(proj => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="text-secondary text-sm">${proj.description}</p>
                    <div class="tags">
                        ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    ${proj.link ? `
                    <a href="${proj.link}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:1.5rem; font-size:0.9rem;">
                        View Project <i class="fas fa-arrow-right" style="font-size:0.8em; margin-left:5px;"></i>
                    </a>` : ''}
                `;
                projGrid.appendChild(card);
            });
        }

        // List Renderer Helper
        const renderList = (elementId, items) => {
            const container = $(elementId);
            if (container) {
                items.forEach(item => {
                    const span = document.createElement('span');
                    span.className = 'skill-pill';
                    span.textContent = item;
                    container.appendChild(span);
                });
            }
        };

        renderList('skillsList', resumeData.skills || []);
        renderList('certsList', resumeData.certifications || []);
        renderList('interestsList', resumeData.interests || []);

        // Footer
        if ($('footerLocation')) {
            $('footerLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${resumeData.personalInfo.location}`;
        }

        const footerSocial = $('footerSocial');
        if (footerSocial) {
            footerSocial.innerHTML = `
                <h2 style="margin-bottom: 3rem;">Get in Touch</h2>
                <div class="contact-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 800px; margin: 0 auto 3rem;">
                    
                    <a href="mailto:${resumeData.personalInfo.email}" class="contact-card">
                        <div class="icon-box"><i class="fas fa-envelope"></i></div>
                        <div>
                            <span class="label">Email</span>
                            <span class="value">${resumeData.personalInfo.email}</span>
                        </div>
                    </a>

                    <a href="tel:${resumeData.personalInfo.phone}" class="contact-card">
                        <div class="icon-box"><i class="fas fa-phone"></i></div>
                        <div>
                            <span class="label">Phone</span>
                            <span class="value">${resumeData.personalInfo.phone}</span>
                        </div>
                    </a>

                    <a href="${resumeData.personalInfo.social.github}" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div class="icon-box"><i class="fab fa-github"></i></div>
                        <div>
                            <span class="label">GitHub</span>
                            <span class="value">/boopathirbk</span>
                        </div>
                    </a>

                    <a href="${resumeData.personalInfo.social.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div class="icon-box"><i class="fab fa-linkedin"></i></div>
                        <div>
                            <span class="label">LinkedIn</span>
                            <span class="value">/boopathirb</span>
                        </div>
                    </a>
                </div>
            `;
        }
    },

    /**
     * Handles Dark/Light mode toggling with persistence.
     */
    setupTheme() {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        const root = document.documentElement;

        // 1. Check persistence
        const savedTheme = localStorage.getItem('app-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Respect saved theme first, otherwise fall back to system preference
        let currentTheme;
        if (savedTheme) {
            currentTheme = savedTheme;
        } else {
            currentTheme = systemPrefersDark ? 'dark' : 'light';
        }

        // Apply initial
        root.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(icon, currentTheme);

        // 2. Event Listener
        toggleBtn.addEventListener('click', () => {
            // Toggle
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Apply
            root.setAttribute('data-theme', currentTheme);
            localStorage.setItem('app-theme', currentTheme);
            this.updateThemeIcon(icon, currentTheme);
        });
    },

    updateThemeIcon(iconElement, theme) {
        if (!iconElement) return;
        iconElement.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    },

    updateYear() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const shouldReduceMotion = document.body.getAttribute('data-a11y-motion') === 'reduce';

                if (shouldReduceMotion) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    return;
                }

                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(section);
        });
    },

    setupAccessibility() {
        const trigger = document.getElementById('a11yTrigger');
        const menu = document.getElementById('a11yMenu');
        const close = document.getElementById('closeA11y');

        if (!trigger || !menu) return;

        // State
        const state = {
            textSize: 100,
            grayscale: false,
            highContrast: false,
            readableFont: false,
            links: false,
            motion: false
        };

        // Helper: Toggle Class & Aria
        const toggleFeature = (btnId, stateKey, className, target = document.body) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;

            btn.addEventListener('click', () => {
                state[stateKey] = !state[stateKey];

                // Visual
                if (state[stateKey]) target.classList.add(className);
                else target.classList.remove(className);

                // ARIA
                btn.setAttribute('aria-pressed', state[stateKey]);

                // Special handling for special attributes
                if (stateKey === 'motion') {
                    if (state.motion) document.body.setAttribute('data-a11y-motion', 'reduce');
                    else document.body.removeAttribute('data-a11y-motion');
                }
                if (stateKey === 'highContrast') {
                    if (state.highContrast) document.body.setAttribute('data-a11y-contrast', 'high');
                    else document.body.removeAttribute('data-a11y-contrast');
                }
            });
        };

        // Initialize Toggles
        toggleFeature('grayscaleToggle', 'grayscale', 'grayscale-mode', document.documentElement);
        toggleFeature('readableFontToggle', 'readableFont', 'readable-font-mode');
        toggleFeature('underlineLinksToggle', 'links', 'link-highlight-mode');
        toggleFeature('reduceMotionToggle', 'motion', 'reduce-motion'); // Class unused but good for state, attribute used in logic
        toggleFeature('highContrastToggle', 'highContrast', 'high-contrast');

        // Text Sizing Logic
        const updateTextSize = () => {
            document.documentElement.style.fontSize = `${state.textSize}%`;
            document.getElementById('textSizeDisplay').textContent = `${state.textSize}%`;
        };

        document.getElementById('increaseText')?.addEventListener('click', () => {
            if (state.textSize < 150) {
                state.textSize += 10;
                updateTextSize();
            }
        });

        document.getElementById('decreaseText')?.addEventListener('click', () => {
            if (state.textSize > 80) {
                state.textSize -= 10;
                updateTextSize();
            }
        });

        // Reset
        document.getElementById('resetA11y')?.addEventListener('click', () => {
            // Reset State objects
            Object.keys(state).forEach(k => state[k] = (k === 'textSize' ? 100 : false));

            // Remove Classes
            document.documentElement.classList.remove('grayscale-mode');
            document.body.classList.remove('readable-font-mode', 'link-highlight-mode');
            document.body.removeAttribute('data-a11y-contrast');
            document.body.removeAttribute('data-a11y-motion');

            // Reset ARIA
            menu.querySelectorAll('[aria-pressed]').forEach(b => b.setAttribute('aria-pressed', 'false'));

            updateTextSize();
        });

        // Menu Open/Close & Focus Management
        const toggleMenu = (isOpen) => {
            if (isOpen) {
                menu.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                // Focus first interactive element
                setTimeout(() => document.getElementById('closeA11y')?.focus(), 100);
            } else {
                menu.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        };

        trigger.addEventListener('click', () => toggleMenu(!menu.classList.contains('active')));
        close?.addEventListener('click', () => toggleMenu(false));

        // Close on Escape
        menu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleMenu(false);
        });
    }
};

// Initialize app immediately (Module execution is deferred by default)
App.init();
