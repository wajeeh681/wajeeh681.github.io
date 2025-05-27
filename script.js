
function initMobileMenu() {
    // Check if we have the menu elements before proceeding
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('nav ul');
    
    if (!menuToggle || !mainNav) return;
    
    // Add click event to toggle menu visibility
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Toggle aria-expanded attribute for accessibility
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !expanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-toggle') && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
               
                const offset = 100;  
              const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                
                // Perform the smooth scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form Validation
 * Validates the contact form fields before submission
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Get form fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        
        // Clear previous error messages
        clearErrors();
        
        // Validate name
        if (!nameField.value.trim()) {
            displayError(nameField, 'Please enter your name');
            isValid = false;
        }
        
        // Validate email with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailField.value.trim() || !emailRegex.test(emailField.value)) {
            displayError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!messageField.value.trim()) {
            displayError(messageField, 'Please enter your message');
            isValid = false;
        } else if (messageField.value.trim().length < 10) {
            displayError(messageField, 'Message must be at least 10 characters');
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            alert('Form submitted successfully! In a real website, this would be sent to the server.');
            contactForm.reset();
        }
    });
    

    function displayError(field, message) {
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        
        // Add error class to the field
        field.classList.add('error-field');
    }
    
    // Helper function to clear all errors
    function clearErrors() {
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // Remove error class from all fields
        const errorFields = document.querySelectorAll('.error-field');
        errorFields.forEach(field => field.classList.remove('error-field'));
    }
}

function initProductFilters() {
    const productsGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');
    
    if (!productsGrid || productCards.length === 0) return;
    
    // First, let's create a filter UI if it doesn't exist
    if (!document.querySelector('.product-filters')) {
        createProductFilters();
    }
    
    // Handle filter click events
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter the products
            if (filter === 'all') {
                // Show all products
                productCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                // Show only products with the specified category
                productCards.forEach(card => {
                    if (card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Helper function to create filter UI
    function createProductFilters() {
        // Get unique categories
        const categories = ['all'];
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (category && !categories.includes(category)) {
                categories.push(category);
            }
        });
        
        // If there are no additional categories, don't create filters
        if (categories.length <= 1) return;
        
        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'product-filters';
        
        // Add filter title
        const filterTitle = document.createElement('h3');
        filterTitle.textContent = 'Filter Products:';
        filterContainer.appendChild(filterTitle);
        
        // Create filter buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'filter-buttons';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn' + (category === 'all' ? ' active' : '');
            button.setAttribute('data-filter', category);
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            buttonContainer.appendChild(button);
        });
        
        filterContainer.appendChild(buttonContainer);
        
        // Add filters before the products grid
        productsGrid.parentNode.insertBefore(filterContainer, productsGrid);
    }
}

/**
 * Blog Search
 * Enables search functionality on the blog page
 */
function initBlogSearch() {
    const searchForm = document.querySelector('.search-widget form');
    const searchInput = document.querySelector('.search-widget input');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (!searchForm || !searchInput || blogPosts.length === 0) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            // If search is empty, show all posts
            blogPosts.forEach(post => {
                post.style.display = 'block';
            });
            return;
        }
        
        // Filter posts based on search term
        blogPosts.forEach(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
        
        // Display message if no results
        const noResults = document.querySelector('.no-results');
        let visiblePosts = 0;
        
        blogPosts.forEach(post => {
            if (post.style.display !== 'none') {
                visiblePosts++;
            }
        });
        
        if (visiblePosts === 0) {
            if (!noResults) {
                const message = document.createElement('div');
                message.className = 'no-results';
                message.textContent = 'No posts found matching your search.';
                const blogContainer = blogPosts[0].parentNode;
                blogContainer.appendChild(message);
            }
        } else if (noResults) {
            noResults.remove();
        }
    });
}

/**
 * Team Member Modal
 * Creates modal popups for team member details
 */
function initTeamMemberModals() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    if (teamMembers.length === 0) return;
    
    teamMembers.forEach(member => {
        // Add click event to open modal
        member.addEventListener('click', function() {
            // Get member details
            const name = this.querySelector('h3').textContent;
            const position = this.querySelector('.position').textContent;
            const bio = this.querySelector('.bio').textContent;
            const imgSrc = this.querySelector('img').getAttribute('src');
            
            // Create modal with member details
            createModal(name, position, bio, imgSrc);
        });
    });
    
    // Helper function to create modal
    function createModal(name, position, bio, imgSrc) {
        // Create modal elements
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        
        // Create member content
        const memberImg = document.createElement('img');
        memberImg.src = imgSrc;
        memberImg.alt = name;
        
        const memberName = document.createElement('h2');
        memberName.textContent = name;
        
        const memberPosition = document.createElement('p');
        memberPosition.className = 'modal-position';
        memberPosition.textContent = position;
        
        const memberBio = document.createElement('p');
        memberBio.className = 'modal-bio';
        memberBio.textContent = bio;
        
        // Assemble modal
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(memberImg);
        modalContent.appendChild(memberName);
        modalContent.appendChild(memberPosition);
        modalContent.appendChild(memberBio);
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Add close events
        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        // Add classes to activate animation after a small delay
        setTimeout(() => {
            modalOverlay.classList.add('active');
            modalContent.classList.add('active');
        }, 10);
        
        function closeModal() {
            modalOverlay.classList.remove('active');
            modalContent.classList.remove('active');
            
            // Remove modal after animation
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        }
    }
}

function initSliders() {
   
    console.log('Slider functionality would be initialized here');
    
    // Example implementation for a simple manual slider
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev-slide');
        const nextBtn = slider.querySelector('.next-slide');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        
        // Show the first slide
        updateSlider();
        
        // Add event listeners for buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            });
        }
        
        function updateSlider() {
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.style.display = 'block';
                } else {
                    slide.style.display = 'none';
                }
            });
        }
    });
}
// Hero Slider JavaScript for technhub
class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.slider-dot');
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        // Initialize slider
        this.showSlide(0);
        this.bindEvents();
        this.startAutoSlide();
        
        // Pause auto-slide on hover
        const sliderSection = document.querySelector('.slider');
        if (sliderSection) {
            sliderSection.addEventListener('mouseenter', () => this.stopAutoSlide());
            sliderSection.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }
    
    bindEvents() {
        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Add touch/swipe support
        this.addTouchSupport();
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
        });
        
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide with animation
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            this.slides[index].style.opacity = '1';
            this.slides[index].style.transform = 'translateX(0)';
        }
        
        // Activate current dot
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
            this.resetAutoSlide();
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    }
    
    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const sliderSection = document.querySelector('.slider');
        
        if (!sliderSection) return;
        
        sliderSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        sliderSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // Mouse drag support
        let mouseDown = false;
        sliderSection.addEventListener('mousedown', (e) => {
            mouseDown = true;
            startX = e.clientX;
        });
        
        sliderSection.addEventListener('mouseup', (e) => {
            if (mouseDown) {
                endX = e.clientX;
                this.handleSwipe();
                mouseDown = false;
            }
        });
        
        sliderSection.addEventListener('mouseleave', () => {
            mouseDown = false;
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left - next slide
            } else {
                this.previousSlide(); // Swipe right - previous slide
            }
            this.resetAutoSlide();
        }
    }
}

// Utility function to create slider dots dynamically
function createSliderDots(containerSelector, slideCount) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        
        if (i === 0) {
            dot.classList.add('active');
        }
        
        container.appendChild(dot);
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if slider exists
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) {
        // Initialize the slider
        const heroSlider = new HeroSlider();
        
        // Make slider globally available for external control
        window.heroSlider = heroSlider;
    }
});

// Additional utility functions
const SliderUtils = {
    // Manually control slider from external code
    goTo: (index) => {
        if (window.heroSlider) {
            window.heroSlider.goToSlide(index);
        }
    },
    
    // Play/pause auto-slide
    play: () => {
        if (window.heroSlider) {
            window.heroSlider.startAutoSlide();
        }
    },
    
    pause: () => {
        if (window.heroSlider) {
            window.heroSlider.stopAutoSlide();
        }
    },
    
    // Update slide timing
    setDelay: (delay) => {
        if (window.heroSlider) {
            window.heroSlider.autoSlideDelay = delay;
            window.heroSlider.resetAutoSlide();
        }
    }
};