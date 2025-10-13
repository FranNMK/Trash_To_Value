// --- Configuration & Constants ---

// NOTE: This API URL is a PLACEHOLDER for your backend server endpoint.
const MOCK_API_ENDPOINT = '/api/contact'; 

/**
 * Initializes the application: attaches event listeners for navigation and form submission.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        // Attach the submit handler to the form for MongoDB simulation
        form.addEventListener('submit', submitContactForm);
    }
    
    // Initialize navigation to set the correct active link on page load
    handleNavigation();
    
    // Set up smooth scrolling for all internal links
    setupSmoothScrolling();
    
    // Add a scroll listener to dynamically update the 'active' navigation link
    window.addEventListener('scroll', handleNavigation);

    const sendBtn = document.querySelector('#contact-form button[type="submit"]');
    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            this.classList.add('btn-grow');
            setTimeout(() => this.classList.remove('btn-grow'), 600);
        });
    }
});

/**
 * Sets up custom event listeners for smooth scrolling on internal anchor links.
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Determine the scroll offset to position the target section correctly 
                // beneath the two fixed/sticky header bars.
                const mainHeaderHeight = document.getElementById('main-header').offsetHeight;
                const secondaryNavHeight = document.getElementById('secondary-nav').offsetHeight;
                
                // Add a small buffer (e.g., 24px) for visual padding below the sticky bar
                const offset = mainHeaderHeight + secondaryNavHeight + 24; 
                
                // Update the URL hash without triggering a jump
                history.pushState(null, null, '#' + targetId);
                handleNavigation();

                // Perform the smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Tracks the user's scroll position and applies the 'active' class to the 
 * corresponding link in the secondary navigation bar.
 */
function handleNavigation() {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = 'home'; // Default to home
    const scrollPosition = window.scrollY;

    // Recalculate offset dynamically in case of screen resize
    const mainHeaderHeight = document.getElementById('main-header').offsetHeight;
    const secondaryNavHeight = document.getElementById('secondary-nav').offsetHeight;
    const offset = mainHeaderHeight + secondaryNavHeight + 30; // 30px buffer

    // Iterate through sections to find the one currently in the viewport
    sections.forEach(section => {
        // If the top of the section is visible just below the navigation bar
        if (section.offsetTop <= scrollPosition + offset) {
            current = section.getAttribute('id');
        }
    });

    // Update the active class on the navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}


/**
 * Handles the contact form submission, simulating an asynchronous API call 
 * to save data to a conceptual MongoDB backend.
 * @param {Event} event The form submission event.
 */
async function submitContactForm(event) {
    event.preventDefault(); 
    
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message');
    const formContainer = document.getElementById('contact-form-container');

    // Get form data
    const formData = {
        name: form['contact-name'].value.trim(),
        email: form['contact-email'].value.trim(),
        message: form['contact-message'].value.trim(),
        timestamp: new Date().toISOString()
    };

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.message) {
        console.error("Validation Error: All fields must be filled out.");
        return; 
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...'; 
    submitButton.classList.add('flex', 'items-center', 'justify-center');


    try {
        // --- START MOCK API CALL TO MONGODB BACKEND ---
        // In a real hackathon deployment, you would replace this block with a fetch call
        // to your running Node/Express server (as defined in mock_api_server.js).
        
        console.log('--- MOCK BACKEND CALL ---');
        console.log(`Simulating POST to ${MOCK_API_ENDPOINT} with data:`, formData);

        // Simulate network latency (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // Simulate successful response from the server (e.g., status 201)
        const mockResponse = { status: 'success', message: 'Data saved to MongoDB mock collection.' };
        
        console.log('Mock Response Received:', mockResponse);
        // --- END MOCK API CALL ---

        // Display success message and hide the form
        formContainer.classList.add('hidden'); 
        successMessage.classList.remove('hidden'); 

        // Reset the form state after a delay
        setTimeout(() => {
            successMessage.classList.add('hidden');
            formContainer.classList.remove('hidden');
            form.reset(); 
            
            // Restore button state
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
            submitButton.classList.remove('flex', 'items-center', 'justify-center');

        }, 8000); // Success message visible for 8 seconds

    } catch (error) {
        console.error("Form Submission Failed (Simulated Error):", error);
        
        // Restore button state on error
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
        submitButton.classList.remove('flex', 'items-center', 'justify-center');

        // Optional: Show a custom error message to the user here
        alert("We encountered an issue. Please try again later.");
    }
}

// --- Carousel Functionality ---
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('#carousel .carousel-slide');
    const prevBtn = document.querySelector('#carousel .prev');
    const nextBtn = document.querySelector('#carousel .next');
    const indicatorsContainer = document.querySelector('#carousel .carousel-indicators');
    let current = 0;
    let interval;

    // Create indicators
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => showSlide(idx));
        indicatorsContainer.appendChild(dot);
    });

    function showSlide(idx) {
        slides[current].classList.remove('active');
        indicatorsContainer.children[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        indicatorsContainer.children[current].classList.add('active');
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }
    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play
    function startAuto() {
        interval = setInterval(nextSlide, 4000);
    }
    function stopAuto() {
        clearInterval(interval);
    }
    indicatorsContainer.addEventListener('mouseenter', stopAuto);
    indicatorsContainer.addEventListener('mouseleave', startAuto);
    prevBtn.addEventListener('mouseenter', stopAuto);
    nextBtn.addEventListener('mouseenter', stopAuto);
    prevBtn.addEventListener('mouseleave', startAuto);
    nextBtn.addEventListener('mouseleave', startAuto);

    // Init
    showSlide(0);
    startAuto();
});

// --- Carousel Functionality for background ---
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('#carousel-bg .carousel-slide');
    const prevBtn = document.querySelector('#carousel-bg .prev');
    const nextBtn = document.querySelector('#carousel-bg .next');
    const indicatorsContainer = document.querySelector('#carousel-bg .carousel-indicators');
    let current = 0;
    let interval;

    // Create indicators
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => showSlide(idx));
        indicatorsContainer.appendChild(dot);
    });

    function showSlide(idx) {
        slides[current].classList.remove('active');
        indicatorsContainer.children[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        indicatorsContainer.children[current].classList.add('active');
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }
    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play
    function startAuto() {
        interval = setInterval(nextSlide, 4000);
    }
    function stopAuto() {
        clearInterval(interval);
    }
    indicatorsContainer.addEventListener('mouseenter', stopAuto);
    indicatorsContainer.addEventListener('mouseleave', startAuto);
    prevBtn.addEventListener('mouseenter', stopAuto);
    nextBtn.addEventListener('mouseenter', stopAuto);
    prevBtn.addEventListener('mouseleave', startAuto);
    nextBtn.addEventListener('mouseleave', startAuto);

    // Init
    showSlide(0);
    startAuto();
});
