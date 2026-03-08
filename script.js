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

    const toggleTheme = () => {
        htmlElement.classList.toggle('dark');
        // Update feather icons if they changed based on class (we are hiding/showing via CSS)
        
        // Save preference
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
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

    // 6. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 50;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

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

        // Filter and display specific or recent repos
        // E.g. filtering out empty repos or specific ones we want to highlight
        const reposToDisplay = data.filter(repo => !repo.fork && repo.name !== username).slice(0, 6);

        reposToDisplay.forEach((repo, index) => {
            const techColor = getLanguageColor(repo.language);
            
            const card = document.createElement('div');
            card.className = `bg-white dark:bg-darkCard rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col h-full reveal opacity-0`;
            // Add a small stagger delay
            card.style.transitionDelay = `${(index % 3) * 100}ms`;
            
            // Trigger animation slightly after DOM insertion
            setTimeout(() => card.classList.add('active'), 50);

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
