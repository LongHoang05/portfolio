document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksList = document.querySelector('.nav-links');

    // Smooth scrolling and scroll spy logic
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const targetTabId = btn.getAttribute('data-tab');
            const targetElement = document.getElementById(targetTabId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }

            // On mobile, close menu after clicking
            if (window.innerWidth <= 768 && navLinksList.classList.contains('show')) {
                navLinksList.classList.remove('show');
            }
        });
    });

    // Scroll spy: update active nav link based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        tabContents.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === current) {
                btn.classList.add('active');
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
