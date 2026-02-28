/**
 * AuthorKit Footer Loader
 * Loads the centralized footer component and adjusts paths based on page location
 */

(function() {
    'use strict';

    // Determine base path based on current page location
    function getBasePath() {
        const path = window.location.pathname;
        // If we're in the /pages/ subdirectory, go up one level
        if (path.includes('/pages/')) {
            return '../';
        }
        // If we're at root level (index.html, blog.html), no prefix needed
        return '';
    }

    // Load and insert footer
    async function loadFooter() {
        try {
            const basePath = getBasePath();
            const footerPath = basePath + 'includes/footer.html';

            const response = await fetch(footerPath);
            if (!response.ok) {
                throw new Error(`Failed to load footer: ${response.status}`);
            }

            let footerHTML = await response.text();

            // Replace {{BASE_PATH}} placeholder with actual base path
            footerHTML = footerHTML.replace(/\{\{BASE_PATH\}\}/g, basePath);

            // Find the footer placeholder and insert the footer
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = footerHTML;
            } else {
                console.warn('Footer placeholder not found. Add <div id="footer-placeholder"></div> to your page.');
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    // Load footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
