// ============================================
// GLOBAL VARIABLES & CONSTANTS
// ============================================
const scriptURL = "https://script.google.com/macros/s/AKfycbyZZYKkewdVIDODBkqgi9_B2qbvkKkH5U6YH63ht9BwtGziP9kyJgNLX2YJNI6jqoYG/exec";

// ============================================
// DOM CONTENT LOADED - MAIN INITIALIZATION - loader initialization
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initializeNavigation();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeProjects();
    initializeTestimonials();
    initializeDropdowns();
    initializeFAQs();
    initializeSmoothStickyFilter();
    // initializeScrollButton();
    initializeContactForm();
    initializeHoverEffects();
    initializePageLoader();

    // Set home link as active initially
    updateActiveNavLink('#home');
});

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

/**
 * Initialize smooth navigation with active link indicator
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link-smooth');
    const mainIndicator = document.getElementById('main-indicator');
    let isAnimating = false;

    // Initialize indicator position
    function initIndicator() {
        const activeLink = document.querySelector('.nav-link-smooth.active') || navLinks[0];
        if (activeLink && mainIndicator) {
            updateIndicatorPosition(activeLink, false);
            activeLink.classList.add('active');
        }
    }

    // Update indicator position with smooth animation
    function updateIndicatorPosition(link, animate = true) {
        if (!link || !mainIndicator || isAnimating) return;

        isAnimating = true;

        const linkRect = link.getBoundingClientRect();
        const parentRect = link.parentElement.parentElement.getBoundingClientRect();

        // Calculate position
        const left = linkRect.left - parentRect.left;
        const width = linkRect.width;

        // Apply smooth transition
        if (animate) {
            mainIndicator.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            mainIndicator.style.transition = 'none';
        }

        mainIndicator.style.width = `${width}px`;
        mainIndicator.style.left = `${left}px`;

        // Reset animation lock
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // Set active link
    function setActiveLink(link) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        updateIndicatorPosition(link);
    }

    // Initialize
    initIndicator();

    // Click events
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            setActiveLink(this);

            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });

        // Optional hover preview
        link.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active') && !isAnimating) {
                mainIndicator.style.transition = 'all 0.2s ease';
                updateIndicatorPosition(this);
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active') && !isAnimating) {
                const activeLink = document.querySelector('.nav-link-smooth.active');
                if (activeLink) {
                    updateIndicatorPosition(activeLink);
                }
            }
        });
    });

    // Update on scroll with debounce
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = '#' + section.getAttribute('id');
                }
            });

            if (currentSection) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === currentSection && !link.classList.contains('active')) {
                        setActiveLink(link);
                    }
                });
            }
        }, 100);
    });

    // Handle resize
    window.addEventListener('resize', function () {
        const activeLink = document.querySelector('.nav-link-smooth.active');
        if (activeLink) {
            updateIndicatorPosition(activeLink, false);
        }
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(sectionId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current section link
    const activeNavLink = document.querySelector(`.nav-link[href="${sectionId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
}

// ============================================
// MOBILE MENU FUNCTIONS
// ============================================

/**
 * Initialize mobile menu toggle with smooth animations
 */
function initializeMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', function () {
        const isHidden = mobileMenu.classList.contains('hidden');

        if (isHidden) {
            // Show menu with smooth animation
            mobileMenu.classList.remove('hidden');

            // Force reflow to restart animation
            void mobileMenu.offsetWidth;

            // Add animation class
            mobileMenu.classList.add('animate-fade-in');

            // Change icon to "X" when menu is open
            const icon = menuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        } else {
            // Hide menu with smooth animation
            mobileMenu.classList.remove('animate-fade-in');
            mobileMenu.classList.add('animate-fade-out');

            // Change icon back to hamburger
            const icon = menuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Wait for fade out animation, then hide
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('animate-fade-out');
            }, 300); // Match this with CSS animation duration
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu .nav-link').forEach(link => {
        link.addEventListener('click', function () {
            // Hide menu with animation
            mobileMenu.classList.remove('animate-fade-in');
            mobileMenu.classList.add('animate-fade-out');

            // Change icon back to hamburger
            const icon = menuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Wait for fade out animation, then hide
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('animate-fade-out');
            }, 300);
        });
    });
}

// ============================================
// SMOOTH SCROLLING FUNCTIONS
// ============================================

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }

                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        if (currentSection) {
            updateActiveNavLink(currentSection);
        }
    });
}

// ============================================
// PROJECTS FUNCTIONS
// ============================================

/**
 * Initialize projects - Fetches from Google Sheet dynamically
 */
async function initializeProjects() {
    const projectsGrid = document.getElementById('projects-grid');

    // 1. Show loading spinner while fetching data
    projectsGrid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500"><i class="fas fa-spinner fa-spin text-3xl mb-3"></i><br>Loading projects...</div>';

    try {
        // 2. Fetch data from your Web App
        const response = await fetch(scriptURL + "?action=getProjects");
        const projects = await response.json();

        // 3. Clear loading state
        projectsGrid.innerHTML = '';

        // 4. Define Colors (Matches your categories in the sheet)
        const categoryColors = {
            'finance': 'blue',
            'utility': 'green',
            'ecommerce': 'purple',
            'management': 'yellow',
            'ai': 'pink'
        };

        // 5. Loop through data and create cards
        projects.forEach(project => {
            const color = categoryColors[project.category] || 'gray';
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card animate-fade-in';
            projectCard.setAttribute('data-category', project.category);
            projectCard.setAttribute('data-title', project.title.toLowerCase());

            // Process tags - split by comma and trim whitespace
            let tagsHtml = '';
            if (project.tag) {
                const tags = project.tag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                if (tags.length > 0) {
                    tagsHtml = `
                        <div class="mb-3 flex flex-wrap gap-2">
                            ${tags.map(tag => `
                                <span class="text-[11px] text-gray-600 px-1.5 py-0.5 bg-gray-100 rounded-[4px]">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    `;
                }
            }

            projectCard.innerHTML = `
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center text-${color}-600">
                            <i class="fas ${project.icon || 'fa-code'}"></i>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs bg-${color}-50 text-${color}-700 border border-${color}-200 capitalize">
                            ${project.category || 'general'}
                        </span>
                    </div>
                    <h3 class="font-bold text-lg mb-3">${project.title || 'Untitled Project'}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${project.description || 'No description available'}</p>
                    
                    ${tagsHtml}

                    <div class="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                        <span class="text-xs text-gray-500 flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full ${(project.status === 'Completed' || !project.status) ? 'bg-green-500' : 'bg-yellow-500'}"></span>
                            ${project.status || 'Active'}
                        </span>
                        
                        ${project.link && project.linkStatus !== 'Inactive' ?
                    `<a href="${project.link}" target="_blank" class="text-${color}-600 hover:text-${color}-800 font-medium text-sm">
                                View Details <i class="fas fa-external-link-alt ml-1"></i>
                            </a>`
                    : ''}
                    </div>
                </div>
            `;

            projectsGrid.appendChild(projectCard);
        });

        // 6. Initialize project filtering
        initializeProjectFiltering();

    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<div class="col-span-full text-center py-12 text-red-500">Failed to load projects. Check console.</div>';
    }
}

/**
 * Initialize project filtering and search
 */
function initializeProjectFiltering() {
    // Project filtering
    document.querySelectorAll('.project-filter').forEach(filter => {
        filter.addEventListener('click', function () {
            // Update active filter
            document.querySelectorAll('.project-filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');
            const searchValue = document.getElementById('project-search').value.toLowerCase();

            // Filter projects
            document.querySelectorAll('.project-card').forEach(card => {
                const category = card.getAttribute('data-category');
                const title = card.getAttribute('data-title');

                const categoryMatch = filterValue === 'all' || category === filterValue;
                const searchMatch = title.includes(searchValue) ||
                    card.textContent.toLowerCase().includes(searchValue);

                if (categoryMatch && searchMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Project search
    document.getElementById('project-search').addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const activeFilter = document.querySelector('.project-filter.active');
        const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

        document.querySelectorAll('.project-card').forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title');

            const categoryMatch = filterValue === 'all' || category === filterValue;
            const searchMatch = title.includes(searchValue) ||
                card.textContent.toLowerCase().includes(searchValue);

            if (categoryMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ============================================
// TESTIMONIALS FUNCTIONS
// ============================================

/**
 * Function to generate star rating HTML
 */
function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.min(rating, 5);

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star text-yellow-400 text-xs"></i>';
        } else {
            starsHTML += '<i class="far fa-star text-yellow-400 text-xs"></i>';
        }
    }
    return starsHTML;
}

/**
 * Function to load testimonials
 */
async function initializeTestimonials() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    const testimonialsURL = scriptURL + "?action=getTestimonials";

    try {
        const response = await fetch(testimonialsURL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const testimonials = await response.json();

        // Check if it's an error object
        if (testimonials.error) {
            throw new Error(testimonials.error);
        }

        // Clear loading state
        testimonialsGrid.innerHTML = '';

        if (!testimonials || testimonials.length === 0) {
            testimonialsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-comments text-3xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500">No testimonials available at the moment.</p>
                </div>
            `;
            return;
        }

        // Service type to color mapping
        const serviceColors = {
            'Google Apps Script': 'blue',
            'Web Scraping': 'green',
            'Browser Extension': 'purple',
            'Workflow Automation': 'cyan',
            'API Integration': 'indigo',
            'E-commerce': 'orange'
        };

        // Create testimonials cards
        testimonials.forEach(testimonial => {
            const service = testimonial.service || 'General';
            const color = serviceColors[service] || 'gray';

            // Create card element
            const card = document.createElement('div');
            card.className = 'group relative rounded-xl bg-gradient-to-br from-white to-gray-50/80 p-6 border border-gray-200/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in';

            // Add hover border color based on service
            if (color === 'blue') card.classList.add('hover:border-blue-300/50');
            else if (color === 'green') card.classList.add('hover:border-green-300/50');
            else if (color === 'purple') card.classList.add('hover:border-purple-300/50');
            else if (color === 'cyan') card.classList.add('hover:border-cyan-300/50');
            else if (color === 'indigo') card.classList.add('hover:border-indigo-300/50');
            else if (color === 'orange') card.classList.add('hover:border-orange-300/50');
            else card.classList.add('hover:border-gray-300/50');

            // Avatar background color mapping
            const avatarColors = {
                'blue': 'bg-blue-100 text-blue-600',
                'green': 'bg-green-100 text-green-600',
                'purple': 'bg-purple-100 text-purple-600',
                'cyan': 'bg-cyan-100 text-cyan-600',
                'indigo': 'bg-indigo-100 text-indigo-600',
                'orange': 'bg-orange-100 text-orange-600',
                'gray': 'bg-gray-100 text-gray-600'
            };

            const avatarClass = avatarColors[color] || 'bg-gray-100 text-gray-600';

            card.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-1">
                        ${generateStars(testimonial.stars)}
                    </div>
                    <span class="text-xs font-semibold text-${color}-600 bg-${color}-50 px-2 py-1 rounded border border-${color}-200">
                        ${service}
                    </span>
                </div>

                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    "${testimonial.testimonial}"
                </p>

                <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div class="w-8 h-8 rounded-full ${avatarClass} flex items-center justify-center font-bold text-sm">
                        ${testimonial.initials}
                    </div>
                    <div class="flex-1">
                        <div class="text-gray-800 font-medium text-sm">${testimonial.username}</div>
                        <div class="text-gray-500 text-xs">${testimonial.country}</div>
                    </div>
                </div>
            `;

            testimonialsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading testimonials:', error);

        testimonialsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-3"></i>
                <p class="text-gray-600">Failed to load testimonials. Please try again later.</p>
                <p class="text-xs text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}


// ============================================
// FAQ FUNCTIONS
// ============================================
// Function to load FAQs from Google Sheet
async function initializeFAQs() {
    const faqAccordion = document.getElementById('faq-accordion');

    try {
        const response = await fetch(scriptURL + "?action=getFAQs");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const faqs = await response.json();

        if (faqs.error) {
            throw new Error(faqs.error);
        }

        // Clear loading state
        faqAccordion.innerHTML = '';

        if (!faqs || faqs.length === 0) {
            faqAccordion.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-question-circle text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600">No FAQs available at the moment.</p>
                </div>
            `;
            return;
        }

        // Create FAQ items
        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('details');
            faqItem.className = `faq-accordion-item group bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/60 rounded-2xl hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg overflow-hidden`;

            // Parse answer and handle special formatting
            const answerHTML = formatFAQAnswer(faq.answer);

            faqItem.innerHTML = `
        <summary class="faq-summary flex items-center justify-between p-6 cursor-pointer list-none">
            <h3 class="text-xl font-bold text-gray-800 flex-1 pr-4">${faq.question}</h3>
            <svg class="faq-icon w-6 h-6 text-blue-600 flex-shrink-0" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </summary>
        <div class="faq-content-wrapper">
            <div class="faq-content pt-4 border-t border-gray-100 px-6 pb-6">
                ${answerHTML}
            </div>
        </div>
    `;

            // Add animation delay for staggered entrance
            faqItem.style.animationDelay = `${index * 0.1}s`;
            faqItem.classList.add('animate-fade-in');

            faqAccordion.appendChild(faqItem);
        });


    } catch (error) {
        console.error('Error loading FAQs:', error);

        faqAccordion.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-3"></i>
                <p class="text-gray-600">Failed to load FAQs. Please try again later.</p>
                <p class="text-xs text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

// Function to format FAQ answers with styling
function formatFAQAnswer(answer) {
    // Split by paragraphs or list items
    const lines = answer.split('\n').filter(line => line.trim() !== '');
    let formattedHTML = '';

    lines.forEach(line => {
        const trimmedLine = line.trim();

        // Check for bullet points or numbered lists
        if (trimmedLine.match(/^[•\-\*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
            formattedHTML += `<div class="flex items-start gap-3 mb-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span class="text-blue-600 font-bold text-sm">${trimmedLine.match(/^\d+\./) ? trimmedLine.split('.')[0] : '•'}</span>
                </div>
                <span class="text-gray-700 leading-relaxed">${trimmedLine.replace(/^[•\-\*]\s|^\d+\.\s/, '')}</span>
            </div>`;
        } else if (trimmedLine.match(/^\$/) || trimmedLine.match(/^\d+\$/)) {
            // Budget/price lines
            formattedHTML += `<div class="flex items-center gap-3 mb-2">
                <span class="text-green-600 font-semibold">${trimmedLine}</span>
            </div>`;
        } else if (trimmedLine.match(/^\*\*/) && trimmedLine.match(/\*\*$/)) {
            // Bold text
            const boldText = trimmedLine.replace(/\*\*/g, '');
            formattedHTML += `<p class="font-semibold text-gray-800 mb-3">${boldText}</p>`;
        } else {
            // Regular paragraph
            formattedHTML += `<p class="text-gray-700 leading-relaxed mb-4">${trimmedLine}</p>`;
        }
    });

    return formattedHTML;
}


// ============================================
// DROPDOWN FUNCTIONS
// ============================================

/**
 * Function to load dropdown options from Google Sheet
 */
async function initializeDropdowns() {
    try {
        const response = await fetch(scriptURL + "?action=getRequirements");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const requirements = await response.json();

        if (requirements.error) {
            throw new Error(requirements.error);
        }

        // Populate Project Type dropdown
        const projectTypeOptions = document.getElementById('project-type-options');
        projectTypeOptions.innerHTML = '';

        if (requirements.projectTypes && requirements.projectTypes.length > 0) {
            requirements.projectTypes.forEach(type => {
                const option = document.createElement('div');
                option.className = 'dropdown-option';
                option.setAttribute('data-value', type);
                option.textContent = type;
                projectTypeOptions.appendChild(option);
            });
        } else {
            projectTypeOptions.innerHTML = '<div class="dropdown-option">No options available</div>';
        }

        // Populate Timeline dropdown
        const timelineOptions = document.getElementById('timeline-options');
        timelineOptions.innerHTML = '';

        if (requirements.timelines && requirements.timelines.length > 0) {
            requirements.timelines.forEach(timeline => {
                const option = document.createElement('div');
                option.className = 'dropdown-option';
                option.setAttribute('data-value', timeline);
                option.textContent = timeline;
                timelineOptions.appendChild(option);
            });
        } else {
            timelineOptions.innerHTML = '<div class="dropdown-option">No options available</div>';
        }

        // Populate Budget dropdown
        const budgetOptions = document.getElementById('budget-options');
        budgetOptions.innerHTML = '';

        if (requirements.budgets && requirements.budgets.length > 0) {
            requirements.budgets.forEach(budget => {
                const option = document.createElement('div');
                option.className = 'dropdown-option';
                option.setAttribute('data-value', budget);
                option.textContent = budget;
                budgetOptions.appendChild(option);
            });
        } else {
            budgetOptions.innerHTML = '<div class="dropdown-option">No options available</div>';
        }

        // Reinitialize dropdown functionality for new elements
        initializeDropdownFunctionality();

    } catch (error) {
        console.error('Error loading dropdown options:', error);

        // Set default options as fallback
        setDefaultDropdownOptions();
    }
}

/**
 * Function to set default options if loading fails
 */
function setDefaultDropdownOptions() {
    const defaultProjectTypes = [
        'Google Workspace Automation',
        'Web Scraping & Data Extraction',
        'Browser Extension Development',
        'API Integration',
        'AI/ML Automation',
        'Other Automation Need'
    ];

    const defaultTimelines = [
        'Urgent (1-2 weeks)',
        'Standard (2-4 weeks)',
        'Flexible (1-2 months)'
    ];

    const defaultBudgets = [
        '$500 - $1,000',
        '$1,000 - $2,500',
        '$2,500 - $5,000',
        '$5,000+'
    ];

    // Populate Project Type
    const projectTypeOptions = document.getElementById('project-type-options');
    projectTypeOptions.innerHTML = '';
    defaultProjectTypes.forEach(type => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-value', type);
        option.textContent = type;
        projectTypeOptions.appendChild(option);
    });

    // Populate Timeline
    const timelineOptions = document.getElementById('timeline-options');
    timelineOptions.innerHTML = '';
    defaultTimelines.forEach(timeline => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-value', timeline);
        option.textContent = timeline;
        timelineOptions.appendChild(option);
    });

    // Populate Budget
    const budgetOptions = document.getElementById('budget-options');
    budgetOptions.innerHTML = '';
    defaultBudgets.forEach(budget => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-value', budget);
        option.textContent = budget;
        budgetOptions.appendChild(option);
    });

    // Reinitialize dropdown functionality
    initializeDropdownFunctionality();
}

/**
 * Function to reinitialize dropdown click handlers
 */
function initializeDropdownFunctionality() {
    // Remove existing event listeners first
    document.querySelectorAll('.custom-dropdown .dropdown-select').forEach(select => {
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);
    });

    document.querySelectorAll('.custom-dropdown .dropdown-option').forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
    });

    // Reinitialize dropdown functionality
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const select = dropdown.querySelector('.dropdown-select');
        const options = dropdown.querySelector('.dropdown-options');
        const chevron = dropdown.querySelector('.fa-chevron-down');
        const selectedText = dropdown.querySelector('.selected-text');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');
        const optionItems = dropdown.querySelectorAll('.dropdown-option');

        // Toggle dropdown
        select.addEventListener('click', function (e) {
            e.stopPropagation();
            options.classList.toggle('show');
            chevron.classList.toggle('rotate');

            // Close other dropdowns
            document.querySelectorAll('.custom-dropdown .dropdown-options').forEach(otherOptions => {
                if (otherOptions !== options && otherOptions.classList.contains('show')) {
                    otherOptions.classList.remove('show');
                    otherOptions.parentElement.querySelector('.fa-chevron-down').classList.remove('rotate');
                }
            });
        });

        // Select option
        optionItems.forEach(option => {
            option.addEventListener('click', function () {
                const value = this.getAttribute('data-value');
                const text = this.textContent;

                // Update selected text
                selectedText.textContent = text;

                // Update hidden input
                if (hiddenInput) {
                    hiddenInput.value = value;
                }

                // Mark as selected
                optionItems.forEach(item => item.classList.remove('selected'));
                this.classList.add('selected');

                // Close dropdown
                options.classList.remove('show');
                chevron.classList.remove('rotate');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) {
                options.classList.remove('show');
                chevron.classList.remove('rotate');
            }
        });
    });
}

// ============================================
// SMOOTH STICKY FILTER FUNCTIONS
// ============================================

/**
 * Enhanced smooth sticky filter with animations - NO FLICKER VERSION
 */
function initializeSmoothStickyFilter() { // Changed from initSmoothStickyFilter
    const projectsSection = document.getElementById('projects');
    const filterBar = projectsSection.querySelector('.sticky-filter-bar');
    const projectsGrid = document.getElementById('projects-grid');
    const testimonialsSection = document.getElementById('testimonials');

    if (!filterBar || !projectsGrid) return;

    let isSticky = false;
    let isAtEnd = false;
    let lastScrollTop = 0;
    let filterHeight = filterBar.offsetHeight;
    let isScrollingUp = false;
    let scrollTimeout = null;
    let isTransitioning = false;

    // Create spacer element
    const spacer = document.createElement('div');
    spacer.className = 'filter-spacer';
    filterBar.parentNode.insertBefore(spacer, filterBar.nextSibling);

    function updateStickyState() {
        if (isTransitioning) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const sectionTop = projectsSection.offsetTop;
        const sectionBottom = sectionTop + projectsSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        const testimonialsTop = testimonialsSection ? testimonialsSection.offsetTop : Infinity;

        // Determine scroll direction
        isScrollingUp = scrollTop < lastScrollTop;
        lastScrollTop = scrollTop;

        // Calculate positions
        const stickyStart = sectionTop - 80; // 80px for navbar
        const stickyEnd = sectionBottom - viewportHeight - filterHeight - 100;

        // Calculate how much of testimonials is visible
        const testimonialsVisibility = testimonialsTop - scrollTop;
        const testimonialsThreshold = viewportHeight * 0.3; // 30% of viewport

        // Clear any pending timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // SCENARIO 1: Testimonials section is appearing at top
        if (testimonialsVisibility < testimonialsThreshold && testimonialsVisibility > 0) {
            // Testimonials are coming into view - hide filter smoothly
            if (isSticky) {
                isTransitioning = true;
                isSticky = false;
                isAtEnd = false;
                filterBar.classList.remove('sticky-active');
                filterBar.classList.add('sticky-exit');

                setTimeout(() => {
                    filterBar.classList.add('sticky-hidden');
                    filterBar.classList.remove('sticky-exit');
                    isTransitioning = false;
                }, 300);
            }
            return;
        }

        // SCENARIO 2: When SCROLLING UP within projects section
        if (isScrollingUp && scrollTop > stickyStart && scrollTop < stickyEnd) {
            if (!isSticky) {
                isTransitioning = true;
                isSticky = true;
                isAtEnd = false;
                filterBar.classList.remove('sticky-exit', 'sticky-hidden', 'sticky-return');
                filterBar.classList.add('sticky-active');

                scrollTimeout = setTimeout(() => {
                    isTransitioning = false;
                }, 400);
            }
        }
        // SCENARIO 3: When SCROLLING DOWN within projects section
        else if (!isScrollingUp && scrollTop > stickyStart + 150 && scrollTop < stickyEnd) {
            // Show sticky when scrolling down past threshold
            if (!isSticky) {
                isTransitioning = true;
                isSticky = true;
                isAtEnd = false;
                filterBar.classList.remove('sticky-exit', 'sticky-hidden', 'sticky-return');
                filterBar.classList.add('sticky-active');

                scrollTimeout = setTimeout(() => {
                    isTransitioning = false;
                }, 400);
            }
        }
        // SCENARIO 4: When at the END of projects section (before testimonials)
        else if (scrollTop > stickyEnd && scrollTop < testimonialsTop - viewportHeight * 0.5) {
            if (isSticky && !isAtEnd) {
                isTransitioning = true;
                isAtEnd = true;
                isSticky = false;
                filterBar.classList.remove('sticky-active');
                filterBar.classList.add('sticky-exit');

                scrollTimeout = setTimeout(() => {
                    filterBar.classList.add('sticky-hidden');
                    filterBar.classList.remove('sticky-exit');
                    isTransitioning = false;
                }, 300);
            }
        }
        // SCENARIO 5: When projects are visible at top again (scrolling up from testimonials)
        else if (isScrollingUp && scrollTop < stickyEnd && scrollTop > sectionTop - 100) {
            if (!isSticky && !filterBar.classList.contains('sticky-return')) {
                isTransitioning = true;
                isSticky = false;
                isAtEnd = false;
                filterBar.classList.remove('sticky-hidden', 'sticky-exit');
                filterBar.classList.add('sticky-return');

                scrollTimeout = setTimeout(() => {
                    filterBar.classList.remove('sticky-return');
                    isTransitioning = false;
                }, 400);
            }
        }
        // SCENARIO 6: When at the TOP of projects section
        else if (scrollTop < stickyStart + 50) {
            if (isSticky || filterBar.classList.contains('sticky-active')) {
                isTransitioning = true;
                isSticky = false;
                isAtEnd = false;
                filterBar.classList.remove('sticky-active', 'sticky-exit', 'sticky-hidden', 'sticky-return');

                scrollTimeout = setTimeout(() => {
                    isTransitioning = false;
                }, 300);
            }
        }
        // SCENARIO 7: When BELOW testimonials section
        else if (testimonialsSection && scrollTop > testimonialsTop + viewportHeight) {
            if (isSticky || isAtEnd || filterBar.classList.contains('sticky-active')) {
                isTransitioning = true;
                isSticky = false;
                isAtEnd = false;
                filterBar.classList.remove('sticky-active', 'sticky-exit', 'sticky-hidden', 'sticky-return');

                scrollTimeout = setTimeout(() => {
                    isTransitioning = false;
                }, 300);
            }
        }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking && !isTransitioning) {
            window.requestAnimationFrame(function () {
                updateStickyState();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle resize to update filter height
    window.addEventListener('resize', function () {
        filterHeight = filterBar.offsetHeight;
        // Reset transition flag on resize
        isTransitioning = false;
    });

    // Initial check
    updateStickyState();
}

// ============================================
// SCROLL BUTTON FUNCTIONS
// ============================================

/**
 * Initialize floating scroll button
 */
function initializeScrollButton() {
    const scrollButton = document.getElementById('scrollButton');
    let isAtBottom = false;

    // Show/hide button with smooth transition
    window.addEventListener('scroll', function () {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        const scrollPosition = window.scrollY;

        if (documentHeight > windowHeight + 100) {
            requestAnimationFrame(() => {
                scrollButton.classList.add('visible');

                // Check if at bottom (less than 100px from bottom)
                const bottomThreshold = 100;
                isAtBottom = scrollPosition + windowHeight >= documentHeight - bottomThreshold;

                if (isAtBottom) {
                    // At bottom - arrow should point UP (to go to top)
                    scrollButton.classList.add('at-bottom');
                    scrollButton.setAttribute('title', 'Scroll to top');
                } else {
                    // Not at bottom - arrow should point DOWN (to go to bottom)
                    scrollButton.classList.remove('at-bottom');
                    scrollButton.setAttribute('title', 'Scroll to bottom');
                }
            });
        } else {
            requestAnimationFrame(() => {
                scrollButton.classList.remove('visible');
            });
        }
    });

    // Handle scroll toggle with smooth animation
    window.handleScrollToggle = function () {
        // Add click feedback
        scrollButton.classList.add('clicked');
        setTimeout(() => scrollButton.classList.remove('clicked'), 200);

        if (isAtBottom) {
            // Scroll to top with smooth easing
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
        } else {
            // Scroll to bottom with smooth easing
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
        }
    };

    // Initialize on page load
    window.dispatchEvent(new Event('scroll'));

    // Add smooth hover effect
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.cursor = 'pointer';
    });

    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.cursor = 'default';
    });

    // Add CSS for click effect
    const style = document.createElement('style');
    style.textContent = `
        #scrollButton.clicked .scroll-button-inner {
            animation: clickEffect 0.3s ease-out;
        }
        
        @keyframes clickEffect {
            0% { transform: scale(1); }
            50% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// CONTACT FORM FUNCTIONS
// ============================================

/**
 * Initialize contact form submission with proper validation and feedback
 */
function initializeContactForm() {
    const contactForm = document.getElementById("contact-form");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            projectType: document.getElementById("project-type-input").value,
            timeline: document.getElementById("timeline-input").value,
            budget: document.getElementById("budget-input").value,
            message: document.getElementById("message").value.trim()
        };

        // Validate required fields
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage("Please fill in all required fields.", "error");
            return;
        }

        if (!validateEmail(formData.email)) {
            showFormMessage("Please enter a valid email address.", "error");
            return;
        }

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        submitButton.disabled = true;

        // Send data to Google Apps Script
        fetch(scriptURL, {
            method: "POST",
            mode: "no-cors", // Important for Google Apps Script
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(() => {
                // Success
                showFormMessage("Message sent successfully! I'll get back to you soon.", "success");

                // Reset form
                contactForm.reset();

                // Reset dropdowns
                resetDropdowns();

                // Reset button state after delay
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error("Error:", error);
                showFormMessage("Failed to send message. Please try again.", "error");

                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
    });
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show form message (success or error)
 */
function showFormMessage(message, type) {
    const statusCard = document.getElementById('status-card');
    const statusInner = document.getElementById('status-inner');

    if (statusCard && statusInner) {
        const isSuccess = type === 'success';

        // 1. SMOOTH OUT: Fade out current content
        statusInner.style.opacity = '0';

        setTimeout(() => {
            // 2. UPDATE CONTAINER: Apply exact classes from your snippet
            // Note: I removed 'mt-4' since this is an inline card.
            statusCard.className = `
                sm:w-1/2 sm:order-1 w-full 
                form-message 
                p-2 
                rounded-xl 
                animate-fade-in 
                flex items-center gap-2 
                relative overflow-hidden
                bg-white shadow-xl ring-1 ring-black/5 border-l-4 text-slate-700
                ${isSuccess
                    ? 'border-emerald-500 shadow-[0_10px_40px_-15px_rgba(16,185,129,0.3)]'
                    : 'border-rose-500 shadow-[0_10px_40px_-15px_rgba(244,63,94,0.3)]'}
            `;

            // 3. UPDATE CONTENT: Exact HTML from your snippet
            statusInner.innerHTML = `
                <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }">
                    <i class="fas ${isSuccess ? 'fa-check' : 'fa-xmark'}"></i>
                </div>
                
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-slate-800">
                        ${isSuccess ? 'Success' : 'Error'}
                    </h4>
                    <p class="text-sm text-slate-500 leading-snug mt-0.5">
                        ${message}
                    </p>
                </div>
                
                <button onclick="restoreStatusCard()" class="text-slate-300 hover:text-slate-400 transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // 4. SMOOTH IN
            statusInner.style.opacity = '1';

            // 5. Auto-restore after 5 seconds
            setTimeout(() => {
                restoreStatusCard();
            }, 5000);

        }, 300);

    } else {
        // Fallback: Create element at bottom if card not found
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const messageElement = document.createElement('div');
        messageElement.className = `form-message p-4 rounded-xl mt-4 animate-fade-in flex items-center gap-4 bg-white shadow-xl ring-1 ring-black/5 border-l-4 text-slate-700 ${type === 'success' ? 'border-emerald-500 shadow-[0_10px_40px_-15px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_10px_40px_-15px_rgba(244,63,94,0.3)]'
            }`;

        messageElement.innerHTML = `
            <div class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }">
                <i class="fas ${type === 'success' ? 'fa-check' : 'fa-xmark'}"></i>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-sm text-slate-800">${type === 'success' ? 'Success' : 'Error'}</h4>
                <p class="text-sm text-slate-500 leading-snug mt-0.5">${message}</p>
            </div>
        `;

        const form = document.getElementById("contact-form");
        form.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

/**
 * Helper: Restores the "Response Guaranteed" text to its original state
 */
function restoreStatusCard() {
    const statusCard = document.getElementById('status-card');
    const statusInner = document.getElementById('status-inner');

    if (statusCard && statusInner) {
        // Fade Out First
        statusInner.style.opacity = '0';

        setTimeout(() => {
            // Restore Original Container Styles (Compact Style)
            statusCard.className = "sm:w-1/2 sm:order-1 w-full flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600 hover:border-blue-200 hover:shadow-md transition-all duration-300";

            // Restore Original HTML Content
            statusInner.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <span class="leading-snug text-center sm:text-left">
                    <span class="block font-semibold text-slate-800">Response Guaranteed</span>
                    <span class="block text-xs sm:text-sm text-slate-500">We reply within 24 hours. No spam.</span>
                </span>
            `;

            // Fade In
            statusInner.style.opacity = '1';
        }, 300);
    }
}

// Reset Dropdowns (Unchanged)
function resetDropdowns() {
    console.log("Resetting dropdowns...");
    document.querySelectorAll('.custom-dropdown').forEach((dropdown, index) => {
        let selectedText = dropdown.querySelector('.selected-text');
        if (!selectedText) {
            selectedText = dropdown.querySelector('.dropdown-select span:first-child');
            selectedText = dropdown.querySelector('.dropdown-select > span');
        }
        let hiddenInput = dropdown.querySelector('input[type="hidden"]');
        if (!hiddenInput) {
            const dropdownId = dropdown.id;
            if (dropdownId === 'project-type-dropdown') hiddenInput = document.getElementById('project-type-input');
            else if (dropdownId === 'timeline-dropdown') hiddenInput = document.getElementById('timeline-input');
            else if (dropdownId === 'budget-dropdown') hiddenInput = document.getElementById('budget-input');
        }
        const options = dropdown.querySelectorAll('.dropdown-option');
        if (selectedText) {
            const dropdownText = selectedText.textContent.toLowerCase();
            const parentHtml = dropdown.outerHTML.toLowerCase();
            if (parentHtml.includes('project-type') || dropdownText.includes('service') || index === 0) selectedText.textContent = 'Select a service';
            else if (parentHtml.includes('timeline') || dropdownText.includes('timeline') || index === 1) selectedText.textContent = 'Select timeline';
            else if (parentHtml.includes('budget') || dropdownText.includes('range') || index === 2) selectedText.textContent = 'Select range';
            else selectedText.textContent = 'Select an option';
        }
        if (hiddenInput) hiddenInput.value = '';
        options.forEach(option => option.classList.remove('selected'));
    });
}




// ============================================
// HOVER EFFECTS FUNCTIONS
// ============================================

/**
 * Initialize hover effects for cards
 */
function initializeHoverEffects() {
    // Add hover effects to cards
    document.querySelectorAll('.project-card, .skill-card, .workflow-node').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ============================================
// PAGE LOADER FUNCTIONS
// ============================================

/**
 * Initialize page loader with smooth fade-out animation
 */
// ============================================
// PAGE LOADER FUNCTIONS
// ============================================

/**
 * Initialize page loader with simple "Loading..." text
 */
function initializePageLoader() {
    const loader = document.getElementById('universal-page-loader');
    const loaderText = document.querySelector('.smooth-loader-text');

    if (!loader) return;

    document.body.style.overflow = 'hidden';
    const MIN_DISPLAY_TIME = 1200; // Minimum display time for loader
    const startTime = Date.now();

    let loadedCount = 0;
    const totalComponents = 4; // Changed from 3 to 4: Projects, Testimonials, Dropdowns, FAQs

    function componentLoaded() {
        loadedCount++;

        if (loadedCount >= totalComponents) {
            // Wait minimum time before hiding
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

            setTimeout(() => {
                hideLoader();
            }, remainingTime);
        }
    }

    function hideLoader() {
    console.log('Starting smooth hide sequence');

    // Start fading out the loader with smooth animation
    loader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

    // Small delay before starting animation
    setTimeout(() => {
        // Apply fade out effects
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-20px) scale(0.95)';
        loader.style.backdropFilter = 'blur(2px)';

        // Also fade out the content inside
        const loaderContent = document.querySelector('.smooth-loader-content');
        if (loaderContent) {
            loaderContent.style.transition = 'all 0.6s ease';
            loaderContent.style.opacity = '0';
            loaderContent.style.transform = 'translateY(-10px) scale(0.95)';
        }

        // After fade out completes, hide and clean up
        setTimeout(() => {
            loader.style.display = 'none';
            loader.style.visibility = 'hidden';

            // Enable scrolling
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';

            console.log('Loader removed smoothly');
            
            // Initialize scroll button AFTER loader is completely hidden
            initializeScrollButton();
            
        }, 800); // Wait for fade out animation
    }, 100); // Small delay before starting fade
}

    // Initial text setup
    if (loaderText) {
        loaderText.textContent = "Loading...";
        loaderText.style.opacity = '0';
        loaderText.style.transform = 'translateY(10px)';

        // Fade in the text
        setTimeout(() => {
            loaderText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            loaderText.style.opacity = '1';
            loaderText.style.transform = 'translateY(0)';
        }, 300);
    }

    // Load all 4 components
    initializeProjects().finally(componentLoaded);
    initializeTestimonials().finally(componentLoaded);
    initializeDropdowns().finally(componentLoaded);
    initializeFAQs().finally(componentLoaded); // Add this line for FAQs

    // Fallback after 5 seconds (shorter since no text changes)
    setTimeout(() => {
        if (loader && loader.style.display !== 'none') {
            console.log('Loader timeout - forcing smooth hide');
            hideLoader();
        }
    }, 5000);
}

// ============================================
// TERMINAL PROGRESS ANIMATION
// ============================================

/**
 * Initialize terminal progress animation
 */
document.addEventListener('DOMContentLoaded', function () {
    const counterText = document.querySelector('.counter-text');
    if (!counterText) return;

    const FILL_TIME = 4000; // 4 seconds to fill
    const PAUSE_TIME = 2000; // 2 seconds pause
    const TOTAL_CYCLE = FILL_TIME + PAUSE_TIME; // 6 seconds total

    let animationFrame = null;
    let cycleStart = null;

    function animate(timestamp) {
        if (!cycleStart) cycleStart = timestamp;

        const elapsed = timestamp - cycleStart;
        const cyclePosition = elapsed % TOTAL_CYCLE;

        if (cyclePosition < FILL_TIME) {
            // Filling phase (0-4 seconds)
            const fillProgress = cyclePosition / FILL_TIME;
            const percent = Math.floor(fillProgress * 100);
            counterText.textContent = percent + '%';
        } else {
            // Pause phase at 100% (4-6 seconds)
            counterText.textContent = '100%';

            // If we're at the very end of pause, prepare for reset
            if (cyclePosition > TOTAL_CYCLE - 16) { // 16ms before end
                counterText.textContent = '0%';
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // Start animation
    animationFrame = requestAnimationFrame(animate);
});