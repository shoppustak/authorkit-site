/**
 * AuthorKit Website JavaScript
 * Handles mobile menu, smooth scrolling, and interactive elements
 */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');

            // Update aria-expanded for accessibility
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = mobileMenuButton.contains(event.target) || mobileMenu.contains(event.target);

            if (!isClickInside && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for links that just have # (like toggle buttons)
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add fade-in animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards for fade-in animation
document.querySelectorAll('section, .card-hover').forEach(element => {
    observer.observe(element);
});

// Handle form submissions (if you add contact forms later)
function handleFormSubmit(formId) {
    const form = document.getElementById(formId);

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Add loading state
            form.classList.add('loading');

            // Get form data
            const formData = new FormData(form);

            try {
                // Send form data to your backend
                // This is a placeholder - replace with your actual endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showMessage('success', 'Thank you! Your message has been sent.');
                    form.reset();
                } else {
                    showMessage('error', 'Something went wrong. Please try again.');
                }
            } catch (error) {
                showMessage('error', 'Network error. Please try again.');
            } finally {
                form.classList.remove('loading');
            }
        });
    }
}

// Show message helper
function showMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;

    // Insert message after form
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Add active state to current page in navigation
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;

        if (currentPath === linkPath ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('text-blue-600', 'font-medium');
            link.classList.remove('text-gray-600');
        }
    });
}

// Run on page load
setActiveNavLink();

// Track button clicks for analytics (optional)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    // Replace with your analytics service (Google Analytics, Plausible, etc.)
    console.log('Event:', category, action, label);

    // Example for Google Analytics:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Add click tracking to download buttons
document.querySelectorAll('a[href*="download"]').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('Download', 'Click', this.textContent.trim());
    });
});

// Add click tracking to CTA buttons
document.querySelectorAll('.bg-blue-600').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('CTA', 'Click', this.textContent.trim());
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.getElementById('mobile-menu-button').setAttribute('aria-expanded', 'false');
        }
    }
});

// Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console message for developers
console.log('%cAuthorKit Website', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cBuilt with ❤️ for authors', 'font-size: 14px; color: #6b7280;');
console.log('Interested in contributing? Visit https://github.com/authorkit');
