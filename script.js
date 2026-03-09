// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 700); // 700ms matches Tailwind duration-700
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Feather Icons
    feather.replace();

    // 2. Set Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 3. Theme Toggling Logic (Light/Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    // Check for saved user preference or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    let vantaEffect;

    const toggleTheme = () => {
        htmlElement.classList.toggle('dark');
        
        // Save preference
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            if (vantaEffect) vantaEffect.setOptions({ backgroundColor: 0x0f172a, color: 0x3b82f6 });
        } else {
            localStorage.setItem('theme', 'light');
            if (vantaEffect) vantaEffect.setOptions({ backgroundColor: 0xf8fafc, color: 0xbfdbfe }); // Subtle light blue for light mode
        }
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 5. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 6. Init AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // Custom Cursor Logic
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    
    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move inner cursor instantly
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });
        
        // Use requestAnimationFrame for smooth follower
        const animateFollower = () => {
            // Spring configuration for easing
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Add hover effect to links and buttons
        const hoverElements = document.querySelectorAll('a, button, input, textarea, .hover-trigger');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('scale-150', 'border-primary', 'bg-primary/10');
                cursor.classList.add('scale-50');
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('scale-150', 'border-primary', 'bg-primary/10');
                cursor.classList.remove('scale-50');
            });
        });
    }

    // Swiper Carousel Init
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-slider', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'slide',
            grabCursor: true,
        });
    }

    // Vanta.js WebGL Background Init
    if (typeof VANTA !== 'undefined') {
        const isDark = htmlElement.classList.contains('dark');
        vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: isDark ? 0x3b82f6 : 0xbfdbfe, // Tailwind primary blue or subtle light blue
            backgroundColor: isDark ? 0x0f172a : 0xf8fafc,
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00
        });
    }

    // Typewriter Effect for Hero
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        const words = ["Modern Websites", "AI Automations", "Intelligent Systems"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentWord = words[wordIndex];
            const displayStr = currentWord.substring(0, charIndex);
            
            dynamicText.textContent = displayStr;
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before start
            } else {
                charIndex += isDeleting ? -1 : 1;
            }
            
            setTimeout(typeEffect, typeSpeed);
        };
        
        setTimeout(typeEffect, 1000);
    }

    // Interactive Terminal Logic
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    const terminalInputRow = document.getElementById('terminal-input-row');

    if (terminalInput && terminalOutput && terminalBody) {
        const commands = {
            'help': 'Available commands: whoami, education, clear, skills, contact, socials, projects, about, resume, hire',
            'whoami': 'Muhammad Shamoil\nSoftware Engineering Student at Air University Islamabad\nAI Enthusiast | Web Developer | Systems Architect',
            'education': 'Air University Islamabad (2023 - 2027)\nBS Software Engineering',
            'skills': 'Languages: C++, Python, JavaScript, TypeScript, SQL\nFrontend: HTML, CSS, React, Tailwind CSS\nBackend/DB: Firebase, Supabase\nTools: n8n, Custom GPTs, Vercel, Git, Figma',
            'contact': 'Email: shamoil004@gmail.com',
            'socials': 'LinkedIn: linkedin.com/in/m-shamoil\nGitHub: github.com/SE-Muhammad-Shamoil',
            'projects': 'Featured Collections:\n- Agent-Bassed-Smart-Architect\n- FlightNavigator\n- Netflix-front-end-clone\n(View the full list in the Projects section below)',
            'about': 'I am a 6th-semester Software Engineering student focusing on creating accessible web applications and implementing generative AI workflows.',
            'resume': 'Currently fetching the most up-to-date resume... Please check my LinkedIn for now!',
            'hire': 'Open to remote internships and junior roles. Please run "contact" to get my email.'
        };

        // Boot-up Sequence Simulation
        const bootSequence = [
            "Initializing Shamoil OS v2.0...",
            "Loading Core Modules   [OK]",
            "Mounting UI Assets     [OK]",
            "Establishing Uplink    [OK]",
            "System Ready.",
            " ",
            "type 'help' for command"
        ];
        
        let bootI = 0;
        const deployBoot = () => {
            if (bootI < bootSequence.length) {
                const line = document.createElement('div');
                line.className = bootSequence[bootI].includes("type 'help'") ? 'text-blue-400 font-bold mb-4 animate-pulse' : 'text-green-400 font-bold mb-1';
                line.textContent = bootSequence[bootI];
                terminalOutput.appendChild(line);
                bootI++;
                terminalBody.scrollTop = terminalBody.scrollHeight;
                setTimeout(deployBoot, bootI === bootSequence.length ? 100 : Math.random() * 150 + 50);
            } else {
                if(terminalInputRow) {
                    terminalInputRow.style.transition = "opacity 0.5s ease";
                    terminalInputRow.style.opacity = "1";
                    terminalInput.placeholder = "type 'help' for command";
                    terminalInput.value = "help";
                }
                terminalInput.focus();
            }
        };
        setTimeout(deployBoot, 1000);

        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const val = this.value.trim().toLowerCase();
                if (!val) return;
                
                // Echo command
                const cmdLine = document.createElement('div');
                cmdLine.innerHTML = `<span class="text-primary mr-2 font-bold">➜</span><span class="text-blue-400 mr-2 font-bold">~</span><span class="text-gray-200">${this.value}</span>`;
                terminalOutput.appendChild(cmdLine);

                // Handle command
                if (val === 'clear') {
                    terminalOutput.innerHTML = '';
                } else {
                    const response = document.createElement('div');
                    response.className = 'text-gray-400 mb-2 mt-1 whitespace-pre-wrap';
                    
                    if (commands[val]) {
                        response.textContent = commands[val];
                    } else if (val === 'sudo') {
                        response.innerHTML = `<span class="text-red-400">nice try... but you don't have root privileges.</span>`;
                    } else {
                        response.innerHTML = `<span class="text-red-400">zsh: command not found: ${val}</span>`;
                    }
                    terminalOutput.appendChild(response);
                }

                this.value = '';
                // Auto-scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
        
        // Ensure clicking the terminal focuses input
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // 7. Fetch External Data
    fetchGithubProfile();
    fetchGitHubProjects();
});

// Function to fetch GitHub Profile Data for dynamic avatar
async function fetchGithubProfile() {
    const username = 'SE-Muhammad-Shamoil';
    const profileImg = document.getElementById('profile-img');

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if(response.ok) {
            const data = await response.json();
            if (profileImg) {
                profileImg.src = data.avatar_url;
                // Add a small fade-in animation to the image
                profileImg.classList.add('animate-fade-in-up');
            }
        }
    } catch(err) {
        console.error("Failed to load GitHub avatar.", err);
    }
}

// Function to fetch and display GitHub projects
async function fetchGitHubProjects() {
    const username = 'SE-Muhammad-Shamoil';
    const loader = document.getElementById('projects-loader');
    const grid = document.getElementById('projects-grid');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Hide loader
        if (loader) loader.classList.add('hidden');
        if (grid) grid.classList.remove('hidden');

        // Curated list of impressive projects to showcase
        const allowedRepos = [
            'Agent-Bassed-Smart-Architect',
            'FlightNavigator',
            'LA-Project-Hill-Cypher',
            'Ibadify-Ibadat-Tracker',
            'Netflix-front-end-clone',
            'SFML-Based-ALien-Shooter-Game',
            'Metro-Companion-APP',
            'Pacman_with_menu_c_plusplus'
        ];

        // Filter and display specific curated repos
        const reposToDisplay = data.filter(repo => allowedRepos.includes(repo.name)).slice(0, 9);

        reposToDisplay.forEach((repo, index) => {
            const techColor = getLanguageColor(repo.language);
            
            const card = document.createElement('div');
            card.className = `bg-white dark:bg-darkCard rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col h-full`;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index % 3) * 100);
            
            // Add tilt
            card.setAttribute('data-tilt', '');
            card.setAttribute('data-tilt-max', '5');
            card.setAttribute('data-tilt-speed', '400');
            card.setAttribute('data-tilt-glare', 'true');
            card.setAttribute('data-tilt-max-glare', '0.1');

            let topicsHtml = '';
            if (repo.topics && repo.topics.length > 0) {
                topicsHtml = `<div class="flex flex-wrap gap-2 mt-4">
                    ${repo.topics.slice(0, 3).map(topic => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">#${topic}</span>`).join('')}
                </div>`;
            }

            card.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <i data-feather="folder"></i>
                    </div>
                    ${repo.homepage ? 
                        `<a href="${repo.homepage}" target="_blank" class="text-gray-400 hover:text-primary transition-colors" title="Live Demo">
                            <i data-feather="external-link" class="w-5 h-5"></i>
                        </a>` : ''
                    }
                </div>
                <a href="${repo.html_url}" target="_blank" class="group block flex-grow">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">${repo.name.replace(/-/g, ' ')}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">${repo.description || 'A web development project focusing on clean code and user experience.'}</p>
                </a>
                
                ${topicsHtml}

                <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center">
                        <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${techColor}"></span>
                        ${repo.language || 'Code'}
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center"><i data-feather="star" class="w-4 h-4 mr-1"></i> ${repo.stargazers_count}</span>
                        <a href="${repo.html_url}" target="_blank" class="hover:text-primary transition-colors"><i data-feather="github" class="w-4 h-4"></i></a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Re-init feather icons for the new elements
        feather.replace();

        // Init Vanilla Tilt for dynamically added cards
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
        }

    } catch (error) {
        console.error('Error fetching projects:', error);
        if (loader) loader.innerHTML = `<p class="text-red-500">Failed to load projects from GitHub.</p>`;
    }
}

function getLanguageColor(lang) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'React': '#61dafb',
        'C++': '#f34b7d',
    };
    return colors[lang] || '#8b5cf6'; // Default secondary color
}
