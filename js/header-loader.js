(function() {
    'use strict';

    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return '../';
        }
        return '';
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);

        // Map filenames to page identifiers
        if (filename === 'index.html' || filename === '') return 'home';
        if (filename === 'features.html') return 'features';
        if (filename === 'pricing.html') return 'pricing';
        if (filename === 'blog.html') return 'blog';
        if (filename === 'about.html') return 'about';
        if (filename === 'docs.html') return 'docs';

        return null;
    }

    async function loadHeader() {
        try {
            const basePath = getBasePath();
            const headerPath = basePath + 'includes/header.html';
            const response = await fetch(headerPath);
            let headerHTML = await response.text();

            // Replace all {{BASE_PATH}} placeholders
            headerHTML = headerHTML.replace(/\{\{BASE_PATH\}\}/g, basePath);

            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = headerHTML;

                // Set active page
                const currentPage = getCurrentPage();
                if (currentPage) {
                    // Desktop navigation
                    const navLinks = document.querySelectorAll('.nav-link[data-page="' + currentPage + '"]');
                    navLinks.forEach(link => {
                        link.classList.remove('text-gray-600');
                        link.classList.add('text-gray-900', 'font-semibold');
                    });

                    // Mobile navigation
                    const mobileLinks = document.querySelectorAll('.nav-link-mobile[data-page="' + currentPage + '"]');
                    mobileLinks.forEach(link => {
                        link.classList.remove('text-gray-700');
                        link.classList.add('text-blue-600', 'font-semibold', 'bg-blue-50');
                    });
                }

                // Initialize mobile menu toggle
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenuButton && mobileMenu) {
                    mobileMenuButton.addEventListener('click', function() {
                        mobileMenu.classList.toggle('hidden');
                    });
                }
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
