console.log("AI Generated Content Checker loaded");

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle active class on clicked item
            const isActive = item.classList.contains('active');
            
            // Close all items first
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // If it wasn't active, make it active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Scroll Fade-in Animation Logic
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Responsive Scaling Logic
    let currentScale = 1;

    function scaleContent() {
        const appContainer = document.querySelector('.app-container');
        const mainContainer = document.querySelector('.main-container');
        const fixedNav = document.querySelector('.fixed-nav-container'); // Select the fixed nav
        
        if (!appContainer || !mainContainer) return;

        const windowWidth = window.innerWidth;
        const designWidth = 1920;
        const designHeight = 5522; 

        // Calculate scale to fit width
        currentScale = windowWidth / designWidth;
        
        appContainer.style.transform = `scale(${currentScale})`;
        if (fixedNav) fixedNav.style.transform = `scale(${currentScale})`; // Apply scale to fixed nav
        
        // Adjust container height to match scaled content
        mainContainer.style.height = `${designHeight * currentScale}px`;
        mainContainer.style.overflow = 'hidden';
    }

    // Smooth Scroll Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                let designTop = 0;
                let elem = targetElement;
                
                const rect = targetElement.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;
                
                let baseOffset = 130;
                if (targetElement.id === 'about-tool' || targetElement.id === 'faq-sec') {
                    baseOffset = 230; 
                }
                const headerOffset = baseOffset * currentScale;

                window.scrollTo({
                    top: absoluteTop - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Effect Logic
    function handleScroll() {
        const fixedNav = document.querySelector('.fixed-nav-container');
        if (!fixedNav) return;

        if (window.scrollY > 50) {
            fixedNav.classList.add('scrolled');
        } else {
            fixedNav.classList.remove('scrolled');
        }
    }

    // Run on load, resize, and scroll
    window.addEventListener('resize', scaleContent);
    window.addEventListener('scroll', handleScroll);
    scaleContent();
    handleScroll(); // Initial check

    // Upload Button Logic
    const uploadBtn = document.querySelector('.upload-button');
    const fileInput = document.getElementById('hidden-file-input');

    if (uploadBtn && fileInput) {
        // Make it look interactive
        uploadBtn.style.cursor = 'pointer';

        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const textDisplay = document.querySelector('.file-upload-text');
            
            if (file) {
                // Validate if it is an image
                if (!file.type.startsWith('image/')) {
                    // Visual feedback on the button
                    const pTag = uploadBtn.querySelector('p');
                    if (pTag) {
                        pTag.textContent = "Format Not Supported";
                        
                        // Change button style to red error state
                        uploadBtn.style.background = "linear-gradient(to right, #ff4d4d, #c70039)";
                        uploadBtn.style.boxShadow = "0px 10px 15px -3px rgba(255, 77, 77, 0.5), 0px 4px 6px -4px rgba(255, 77, 77, 0.5)";
                        
                        // Reset after 2 seconds
                        setTimeout(() => {
                            pTag.textContent = "Upload Your Image";
                            uploadBtn.style.background = ""; // Revert to CSS gradient
                            uploadBtn.style.boxShadow = ""; // Revert to CSS shadow
                        }, 2000);
                    }

                    fileInput.value = ''; // Reset the input
                    if (textDisplay) {
                        textDisplay.textContent = 'Supported formats: PNG, JPG, WEBP';
                        textDisplay.style.color = 'rgba(255, 255, 255, 0.6)';
                    }
                    return;
                }

                // Update text to show selected file name INSIDE the button
                const pTag = uploadBtn.querySelector('p');
                if (pTag) {
                    // Truncate name if it's too long to fit in the button
                    const fileName = file.name.length > 25 
                        ? file.name.substring(0, 22) + '...' 
                        : file.name;
                    pTag.textContent = fileName;
                }
                
                // Reset the bottom text to default
                if (textDisplay) {
                     textDisplay.textContent = 'Supported formats: PNG, JPG, WEBP';
                     textDisplay.style.color = 'rgba(255, 255, 255, 0.6)';
                }
            }
        });
    }
});