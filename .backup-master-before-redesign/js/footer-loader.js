/**
 * AuthorKit Footer Loader
 * Loads the centralized footer component
 */

(function() {
    'use strict';

    // Load and insert footer
    async function loadFooter() {
        try {
            const response = await fetch('includes/footer.html');
            if (!response.ok) {
                throw new Error(`Failed to load footer: ${response.status}`);
            }

            const footerHTML = await response.text();

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
