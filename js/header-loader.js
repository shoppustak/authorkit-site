(function() {
    'use strict';

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
            const response = await fetch('includes/header.html');
            const headerHTML = await response.text();

            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = headerHTML;

                // Set active page
                const currentPage = getCurrentPage();
                if (currentPage) {
                    // Desktop navigation
                    const navLinks = document.querySelectorAll('.nav-link[data-page="' + currentPage + '"]');
                    navLinks.forEach(link => {
                        link.classList.add('nav-link-active');
                    });

                    // Mobile navigation
                    const mobileLinks = document.querySelectorAll('.mobile-nav-link[data-page="' + currentPage + '"]');
                    mobileLinks.forEach(link => {
                        link.classList.add('nav-link-active');
                    });
                }

                // Dispatch event to notify that header is loaded
                console.log('[header-loader] Header loaded, dispatching headerLoaded event');
                document.dispatchEvent(new CustomEvent('headerLoaded'));

                // Debug: check if menu elements exist
                const menuCheck = document.getElementById('mobile-menu');
                const buttonCheck = document.getElementById('mobile-menu-button');
                console.log('[header-loader] Menu exists:', !!menuCheck, 'Button exists:', !!buttonCheck);
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
