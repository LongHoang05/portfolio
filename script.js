document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksList = document.querySelector('.nav-links');

    // Tab switching logic
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Find target tab and make it active
            const targetTabId = btn.getAttribute('data-tab');
            const targetTab = document.getElementById(targetTabId);
            
            if (targetTab) {
                targetTab.classList.add('active');
                
                // Add a small fade-in animation by resetting the animation
                targetTab.style.animation = 'none';
                targetTab.offsetHeight; /* trigger reflow */
                targetTab.style.animation = null; 
            }

            // On mobile, close menu after clicking
            if (window.innerWidth <= 768 && navLinksList.classList.contains('show')) {
                navLinksList.classList.remove('show');
            }
        });
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('show');
        });
    }

    // Contact form dummy submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sent Successfully! <i class="ph ph-check"></i>';
            btn.style.backgroundColor = '#a8e6cf'; // Success color
            btn.style.color = '#0a0a0a';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                contactForm.reset();
            }, 3000);
        });
    }
});
