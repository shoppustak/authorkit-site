/**
 * AuthorKit Footer Loader
 * Loads the centralized footer component
 */

(function() {
    'use strict';

    // Load and insert footer
    async function loadFooter() {
        try {
            const response = await fetch('/includes/footer.html');
            if (!response.ok) {
                throw new Error(`Failed to load footer: ${response.status}`);
            }

            const footerHTML = await response.text();

            // Find the footer placeholder and insert the footer
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = footerHTML;

                // Initialize footer subscription form after footer is loaded
                initFooterSubscription();
            } else {
                console.warn('Footer placeholder not found. Add <div id="footer-placeholder"></div> to your page.');
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    // Initialize footer subscription form
    function initFooterSubscription() {
        const form = document.querySelector('.footer-signup-form');
        if (!form) {
            console.warn('Footer subscription form not found');
            return;
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            // Validate email
            if (!email || !isValidEmail(email)) {
                showFooterMessage('error', 'Please enter a valid email address');
                return;
            }

            // Disable form during submission
            emailInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';

            try {
                // Call the email capture API
                const response = await fetch('/api/email-capture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        site_url: window.location.origin,
                        site_name: 'AuthorKit Website',
                        type: 'free'
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    if (data.already_subscribed) {
                        showFooterMessage('info', 'You are already subscribed!');
                    } else {
                        showFooterMessage('success', 'Thank you for subscribing!');
                        form.reset();
                    }
                } else {
                    const errorMessage = data.error || 'Something went wrong. Please try again.';
                    showFooterMessage('error', errorMessage);
                }
            } catch (error) {
                console.error('Subscription error:', error);
                showFooterMessage('error', 'Network error. Please check your connection and try again.');
            } finally {
                // Re-enable form
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show feedback message in footer
    function showFooterMessage(type, text) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.footer-signup-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `footer-signup-message footer-signup-message-${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.4;
        `;

        // Style based on message type
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d1fae5';
            messageDiv.style.color = '#065f46';
            messageDiv.style.border = '1px solid #10b981';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#fee2e2';
            messageDiv.style.color = '#991b1b';
            messageDiv.style.border = '1px solid #ef4444';
        } else if (type === 'info') {
            messageDiv.style.backgroundColor = '#dbeafe';
            messageDiv.style.color = '#1e40af';
            messageDiv.style.border = '1px solid #3b82f6';
        }

        // Insert message after the form
        const signupDiv = document.querySelector('.footer-signup');
        if (signupDiv) {
            signupDiv.appendChild(messageDiv);

            // Auto-remove message after 5 seconds
            setTimeout(() => {
                messageDiv.style.transition = 'opacity 0.3s ease';
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }
    }

    // Load footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
