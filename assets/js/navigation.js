document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for on-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            let target = null;
            try {
                target = document.querySelector(href);
            } catch (error) {
                return;
            }

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const body = document.body;
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!nav || !navToggle || !navMenu) {
        console.warn('Navigation elements missing; mobile menu inactive.');
    } else {
        if (!navMenu.id) {
            navMenu.id = 'primary-navigation';
        }

        if (!navToggle.hasAttribute('aria-controls')) {
            navToggle.setAttribute('aria-controls', navMenu.id);
        }

        navMenu.setAttribute('aria-hidden', 'true');

        if (!navMenu.querySelector('.mobile-menu-header')) {
            const headerItem = document.createElement('li');
            headerItem.className = 'mobile-menu-header';
            headerItem.innerHTML = `
                <span class="mobile-menu-title">Navigation</span>
                <button type="button" class="mobile-menu-close" aria-label="Close navigation">
                    <span></span>
                    <span></span>
                </button>
            `;
            navMenu.insertBefore(headerItem, navMenu.firstChild);
        }

        const closeButton = navMenu.querySelector('.mobile-menu-close');
        const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

        const focusElement = (element) => {
            if (!element || typeof element.focus !== 'function') {
                return;
            }
            try {
                element.focus({ preventScroll: true });
            } catch (error) {
                element.focus();
            }
        };

        const isMobileView = () => window.innerWidth <= 768;
        const setDisplayForState = (isOpen) => {
            if (!navMenu) {
                return;
            }
            if (isMobileView()) {
                navMenu.style.display = isOpen ? 'flex' : 'none';
            } else {
                navMenu.style.display = '';
            }
        };
        const updateAccessibilityState = (isOpen) => {
            if (navMenu) {
                const shouldHideMenu = !isOpen && isMobileView();
                navMenu.setAttribute('aria-hidden', String(shouldHideMenu));
            }
            if (overlay) {
                overlay.setAttribute('aria-hidden', String(!isOpen));
            }
        };

        setDisplayForState(false);
        updateAccessibilityState(false);

        const setMenuState = (isOpen) => {
            setDisplayForState(isOpen);

            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');

            navMenu.classList.toggle('is-open', isOpen);

            if (overlay) {
                overlay.classList.toggle('is-visible', isOpen);
            }

            updateAccessibilityState(isOpen);
            body.classList.toggle('nav-open', isOpen);

            if (isOpen) {
                const focusTarget = closeButton || navMenu.querySelector('a') || navToggle;
                focusElement(focusTarget);
            } else {
                focusElement(navToggle);
            }
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!isOpen);
        });

        if (overlay) {
            overlay.addEventListener('click', () => setMenuState(false));
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => setMenuState(false));
        }

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuState(false));
        });

        window.addEventListener('keydown', event => {
            if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
                event.preventDefault();
                setMenuState(false);
            }

            if (event.key === 'Tab' && navMenu.classList.contains('is-open')) {
                const focusableEls = Array.from(navMenu.querySelectorAll(focusableSelector));
                if (!focusableEls.length) {
                    return;
                }

                const firstEl = focusableEls[0];
                const lastEl = focusableEls[focusableEls.length - 1];

                if (event.shiftKey && document.activeElement === firstEl) {
                    event.preventDefault();
                    focusElement(lastEl || navToggle);
                } else if (!event.shiftKey && document.activeElement === lastEl) {
                    event.preventDefault();
                    focusElement(firstEl || navToggle);
                }
            }
        });

        let lastIsMobile = isMobileView();
        window.addEventListener('resize', () => {
            const nowMobile = isMobileView();
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';

            if (!nowMobile && expanded) {
                setMenuState(false);
            } else if (nowMobile) {
                setDisplayForState(expanded);
                updateAccessibilityState(expanded);
            }

            if (nowMobile !== lastIsMobile) {
                setDisplayForState(expanded && nowMobile);
                updateAccessibilityState(expanded && nowMobile);
                lastIsMobile = nowMobile;
            }
        });
    }

    const header = document.querySelector('.header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
});

