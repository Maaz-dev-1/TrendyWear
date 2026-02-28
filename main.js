/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate required field
 * @param {string} value - Value to check
 * @returns {boolean} - True if not empty
 */
function isFieldValid(value) {
    return value.trim().length > 0;
}

/**
 * Show error message for field
 * @param {string} fieldId - Field ID
 * @param {string} message - Error message
 */
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear error message for field
 * @param {string} fieldId - Field ID
 */
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/* ============================================
   NAVIGATION HANDLER
   ============================================ */

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    // Toggle menu on button click
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        const isExpanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   CONTACT FORM HANDLER
   ============================================ */

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Add real-time validation
    const fields = {
        name: { element: document.getElementById('name'), validate: isFieldValid, errorMsg: 'Please enter your full name' },
        email: { element: document.getElementById('email'), validate: isValidEmail, errorMsg: 'Please enter a valid email address' },
        subject: { element: document.getElementById('subject'), validate: isFieldValid, errorMsg: 'Please enter a subject' },
        category: { element: document.getElementById('category'), validate: isFieldValid, errorMsg: 'Please select a category' },
        message: { element: document.getElementById('message'), validate: isFieldValid, errorMsg: 'Please enter a message' },
        consent: { element: document.getElementById('consent'), validate: (val) => document.getElementById('consent').checked, errorMsg: 'You must agree to the Privacy Policy' }
    };

    // Add blur validation
    Object.entries(fields).forEach(([fieldId, fieldData]) => {
        if (fieldData.element) {
            fieldData.element.addEventListener('blur', () => {
                const value = fieldData.element.value || (fieldData.element.type === 'checkbox' ? fieldData.element.checked : '');
                if (!fieldData.validate(value)) {
                    showFieldError(fieldId, fieldData.errorMsg);
                } else {
                    clearFieldError(fieldId);
                }
            });

            // Clear error on input
            fieldData.element.addEventListener('input', () => {
                clearFieldError(fieldId);
            });

            fieldData.element.addEventListener('change', () => {
                clearFieldError(fieldId);
            });
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Validate all fields
        Object.entries(fields).forEach(([fieldId, fieldData]) => {
            const value = fieldData.element.value || (fieldData.element.type === 'checkbox' ? fieldData.element.checked : '');
            if (!fieldData.validate(value)) {
                showFieldError(fieldId, fieldData.errorMsg);
                isFormValid = false;
            } else {
                clearFieldError(fieldId);
            }
        });

        if (isFormValid) {
            // Form is valid - show success message
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'block';
            }

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            }, 5000);

            // In production, you would send the form data to a server here
            console.log('Form submitted successfully');
            console.log({
                name: fields.name.element.value,
                email: fields.email.element.value,
                subject: fields.subject.element.value,
                category: fields.category.element.value,
                message: fields.message.element.value
            });
        }
    });
}

/* ============================================
   SMOOTH SCROLL BEHAVIOR
   ============================================ */

function initializeSmoothScroll() {
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

function initializeAnimations() {
    // Add animation class to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card, .compliance-card, .support-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

/* ============================================
   LAZY LOADING PLACEHOLDER IMAGES
   ============================================ */

function initializeLazyLoading() {
    // If you add real images, use native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */

function initializeAccessibility() {
    // Improve focus visible styles for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // Add aria-current for current page
    const currentPath = window.location.pathname;
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.setAttribute('aria-current', 'page');
        }
    });

    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        border-radius: 4px;
        z-index: 1000;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('main').focus();
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */

function initializePerformanceMonitoring() {
    // Log when page is fully loaded
    window.addEventListener('load', () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');
        }
    });

    // Monitor Core Web Vitals if available
    if ('web-vital' in window) {
        console.log('Web Vitals monitoring available');
    }
}

/* ============================================
   DARK MODE DETECTION
   ============================================ */

function initializeDarkModeDetection() {
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    });
}

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initializeNavigation();
    initializeContactForm();
    initializeSmoothScroll();
    initializeAnimations();
    initializeLazyLoading();
    initializeAccessibility();
    initializeDarkModeDetection();

    // Log initialization complete
    console.log('TrendyWear Finds website initialized');
});

// Monitor when page becomes visible/hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

/* ============================================
   UTILITY: SCROLL TO TOP
   ============================================ */

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Optional: Add scroll-to-top button functionality
window.addEventListener('scroll', () => {
    const scrollTopButton = document.getElementById('scrollTop');
    if (scrollTopButton) {
        if (window.scrollY > 300) {
            scrollTopButton.style.display = 'flex';
        } else {
            scrollTopButton.style.display = 'none';
        }
    }
});