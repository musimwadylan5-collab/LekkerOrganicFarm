/**
 * Lekker Organic Farm - Interactive Elements Module
 * Features: Accordions, Tabs, Modals, Animations, DOM Manipulation, Gallery Lightbox
 */

$(document).ready(function() {
    
    // ========== ACCORDION FUNCTIONALITY ==========
    // Handle accordion header clicks to expand/collapse FAQ items
    $('.accordion-header').on('click', function() {
        const $accordion = $(this).closest('.accordion-item');
        const $content = $accordion.find('.accordion-content');
        const $icon = $(this).find('.toggle-icon');
        
        // Close other accordion items for single-open behavior
        $('.accordion-item').not($accordion).find('.accordion-content').slideUp(300);
        $('.accordion-item').not($accordion).find('.accordion-header').removeClass('active');
        $('.accordion-item').not($accordion).find('.toggle-icon').text('+');
        
        // Toggle current item with smooth animation
        $content.slideToggle(300);
        $(this).toggleClass('active');
        $icon.text($content.is(':visible') ? '−' : '+');
    });

    // ========== TABS FUNCTIONALITY ==========
    // Handle tab navigation with fade transitions
    $('.tab-button').on('click', function() {
        const tabName = $(this).data('tab');
        
        // Hide all tab panes with fade effect
        $('.tab-pane').fadeOut(200, function() {
            $(this).removeClass('active');
        });
        
        // Show selected tab pane after brief delay
        setTimeout(() => {
            $('#' + tabName).fadeIn(200).addClass('active');
        }, 200);
        
        // Update button states to show active tab
        $('.tab-button').removeClass('active');
        $(this).addClass('active');
    });

    // ========== MODAL FUNCTIONALITY ==========
    // Initialize modal elements and variables
    const modal = $('#farmModal');
    const openBtn = $('#openModalBtn');
    const closeBtn = $('#closeModalBtn');
    const closeSpan = $('.close');
    
    // Open modal with fade-in and slide-down animation
    openBtn.on('click', function() {
        modal.fadeIn(300);
        modal.find('.modal-content').css({
            'animation': 'slideInDown 0.4s ease-out'
        });
        // Prevent body scrolling when modal is open
        $('body').css('overflow', 'hidden');
    });
    
    // Close modal function with fade-out animation
    function closeModal() {
        modal.fadeOut(300);
        // Restore body scrolling
        $('body').css('overflow', 'auto');
    }
    
    // Close modal via button click
    closeBtn.on('click', closeModal);
    
    // Close modal via X button click
    closeSpan.on('click', closeModal);
    
    // Close modal when clicking outside the modal content
    $(window).on('click', function(event) {
        if (event.target === modal[0]) {
            closeModal();
        }
    });

    // ========== GALLERY LIGHTBOX WITH HOVER EFFECTS ==========
    // Show/hide gallery overlay on hover for interactive feedback
    $('.gallery-item').on('mouseenter', function() {
        $(this).find('.gallery-overlay').stop(true, false).fadeIn(200);
    }).on('mouseleave', function() {
        $(this).find('.gallery-overlay').stop(true, false).fadeOut(200);
    });

    // ========== SMOOTH SCROLL ANIMATIONS ==========
    // Handle smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        if ($(href).length) {
            e.preventDefault();
            // Smooth scroll to target with 100px offset for header
            $('html, body').animate({
                scrollTop: $(href).offset().top - 100
            }, 800, 'swing');
        }
    });

    // ========== SCROLL REVEAL ANIMATIONS ==========
    // Reveal elements as user scrolls down the page
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.about-card, .tab-item, .feature, .gallery-item');
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            // Check if element is in viewport
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    // Trigger scroll reveal on scroll and initial load
    $(window).on('scroll', revealOnScroll);
    revealOnScroll();

    // ========== INTERACTIVE MAP INITIALIZATION ==========
    // Initialize Leaflet map on contact page
    function initializeMap() {
        if ($('#farmMap').length > 0) {
            // Create map centered on Lowa Prairie, Meyerton (exact farm location)
            const farmLat = -26.63502;
            const farmLng = 28.02169;
            const map = L.map('farmMap').setView([farmLat, farmLng], 13);
            
            // Add OpenStreetMap tiles layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Add farm location marker
            const farmMarker = L.marker([farmLat, farmLng], {
                title: 'Lekker Organic Farm'
            }).addTo(map);
            
            // Bind popup to marker with farm information
            farmMarker.bindPopup(
                '<div class="map-popup"><h3>Lekker Organic Farm</h3><p>Lowa Prairie, Meyerton, Gauteng</p><p>Fresh organic produce delivered daily!</p></div>'
            );
            
            // Add 50km delivery radius circle visualization
            L.circle([farmLat, farmLng], {
                color: '#4a7c59',
                fillColor: '#4a7c59',
                fillOpacity: 0.1,
                radius: 50000
            }).addTo(map);
        }
    }

    // Initialize map when document is ready
    initializeMap();

    // ========== DYNAMIC CONTENT MANIPULATION ==========
    // Add entrance animations to product elements
    function animateElements() {
        const elements = $('.feature, .about-card, .product-item, .accordion-item');
        elements.each(function(index) {
            // Set initial state (hidden and offset)
            $(this).css({
                'opacity': '0',
                'transform': 'translateY(20px)'
            });
            
            // Animate in sequence with staggered timing
            setTimeout(() => {
                $(this).transition({
                    'opacity': '1',
                    'transform': 'translateY(0)',
                    'duration': 600,
                    'easing': 'ease-out'
                }, 'swing');
            }, index * 100);
        });
    }

    // ========== INTERSECTION OBSERVER FOR LAZY ANIMATIONS ==========
    // Use IntersectionObserver for better performance with scroll animations
    if ('IntersectionObserver' in window) {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add in-view class when element enters viewport
                    $(entry.target).addClass('in-view');
                    // Stop observing after animation triggered
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all animatable elements
        $('.feature, .about-card, .product-item, .gallery-item, .tab-item').each(function() {
            observer.observe(this);
        });
    }

    // ========== TOUCH SUPPORT FOR MOBILE ==========
    // Variables to track touch swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    // Handle left/right swipe gestures for tab navigation
    function handleGesture() {
        if (touchEndX < touchStartX - 50) {
            // Swiped left - show next tab
            const $nextBtn = $('.tab-button.active').next('.tab-button');
            if ($nextBtn.length) $nextBtn.click();
        }
        if (touchEndX > touchStartX + 50) {
            // Swiped right - show previous tab
            const $prevBtn = $('.tab-button.active').prev('.tab-button');
            if ($prevBtn.length) $prevBtn.click();
        }
    }

    // Detect touch start position
    $('.tabs-nav').on('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    // Detect touch end position and handle swipe
    $('.tabs-nav').on('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });

    // ========== KEYBOARD NAVIGATION ==========
    // Handle keyboard shortcuts for better accessibility
    $(document).on('keydown', function(e) {
        // ESC key to close modal
        if (e.key === 'Escape') {
            modal.fadeOut(300);
            $('body').css('overflow', 'auto');
        }
        
        // Right arrow key to navigate to next tab
        if (e.key === 'ArrowRight') {
            const $nextBtn = $('.tab-button.active').next('.tab-button');
            if ($nextBtn.length) $nextBtn.click();
        }
        
        // Left arrow key to navigate to previous tab
        if (e.key === 'ArrowLeft') {
            const $prevBtn = $('.tab-button.active').prev('.tab-button');
            if ($prevBtn.length) $prevBtn.click();
        }
    });

    // ========== PERFORMANCE OPTIMIZATION ==========
    // Debounce scroll events to improve performance
    let scrollTimeout;
    $(window).on('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            revealOnScroll();
        }, 100);
    });

    // ========== INITIALIZE ANIMATIONS ON PAGE LOAD ==========
    // Start element animations after page fully loads
    $(window).on('load', function() {
        animateElements();
    });

});

// ========== JQUERY TRANSITION POLYFILL ==========
// Polyfill for older jQuery versions that may not have transition method
if (!$.fn.transition) {
    $.fn.transition = function(properties, duration, easing, callback) {
        return this.animate(properties, duration || 400, easing || 'swing', callback);
    };
}

/**
 * =====================================================================
 * SECTION 2.2: DYNAMIC CONTENT LOADING & SEARCH FUNCTIONALITY
 * =====================================================================
 * Features: Dynamic product/service loading, search, filtering, and sorting
 */

// ========== DYNAMIC CONTENT DATA ==========
// This is sample data structure for products that will be dynamically loaded
// In a production environment, this data would come from a backend API
const dynamicProductData = [
    {
        id: 1,
        name: 'Seasonal Veggie Box - Small',
        category: 'vegetables',
        price: 150,
        unit: '5kg',
        description: 'Fresh seasonal vegetables including spinach, kale, tomatoes, carrots, and more.',
        image: 'veggie-box.jpg',
        inStock: true,
        rating: 4.8
    },
    {
        id: 2,
        name: 'Bulk Spinach Bundle',
        category: 'vegetables',
        price: 25,
        unit: 'Per Bunch',
        description: 'Crisp, organically grown spinach bundles perfect for salads and cooking.',
        image: 'spinach-bundle.jpg',
        inStock: true,
        rating: 4.9
    },
    {
        id: 3,
        name: 'Fresh Farm Milk',
        category: 'dairy',
        price: 35,
        unit: '2 Litres',
        description: 'Raw or pasteurized milk from grass-fed cows, available weekly deliveries.',
        image: 'milk.jpg',
        inStock: true,
        rating: 4.7
    },
    {
        id: 4,
        name: 'Hand-Churned Butter',
        category: 'dairy',
        price: 60,
        unit: '250g',
        description: 'Rich, creamy butter with natural flavor. Perfect for cooking and baking.',
        image: 'butter.jpg',
        inStock: true,
        rating: 4.9
    },
    {
        id: 5,
        name: 'Seasonal Kale Bundle',
        category: 'vegetables',
        price: 30,
        unit: 'Per Bunch',
        description: 'Nutrient-dense kale grown without synthetic pesticides.',
        image: 'kale.jpg',
        inStock: true,
        rating: 4.6
    },
    {
        id: 6,
        name: 'Organic Tomato Mix',
        category: 'vegetables',
        price: 45,
        unit: '3kg Box',
        description: 'Selection of heirloom and regular tomatoes in season.',
        image: 'tomatoes.jpg',
        inStock: true,
        rating: 4.8
    },
    {
        id: 7,
        name: 'Root Vegetable Bundle',
        category: 'vegetables',
        price: 50,
        unit: '4kg Box',
        description: 'Carrots, beets, potatoes, and other root vegetables.',
        image: 'root-veggies.jpg',
        inStock: true,
        rating: 4.7
    },
    {
        id: 8,
        name: 'Artisan Cheese Selection',
        category: 'dairy',
        price: 120,
        unit: '500g Mixed',
        description: 'Specialty cheeses made from our farm milk (seasonal availability).',
        image: 'cheese.jpg',
        inStock: true,
        rating: 4.9
    }
];

// Sample events/blog posts data for dynamic loading
const dynamicEventsData = [
    {
        id: 1,
        title: 'Farm Open Day - June 2026',
        category: 'events',
        date: '2026-06-20',
        time: '09:00 AM',
        description: 'Visit our farm to see sustainable practices firsthand. Meet the team!',
        image: 'placeholder-farm-open-day.jpg',
        attendees: 45
    },
    {
        id: 2,
        title: 'Organic Gardening Workshop',
        category: 'workshop',
        date: '2026-06-27',
        time: '10:00 AM',
        description: 'Learn how to start your own organic garden with expert tips.',
        image: 'placeholder-workshop.jpg',
        attendees: 32
    },
    {
        id: 3,
        title: 'Weekly Market - Meyerton',
        category: 'events',
        date: '2026-06-25',
        time: '07:00 AM',
        description: 'Visit us at the Meyerton market every Saturday morning.',
        image: 'placeholder-market.jpg',
        attendees: 200
    },
    {
        id: 4,
        title: 'Sustainable Farming Blog Post',
        category: 'blog',
        date: '2026-06-15',
        time: '09:00 AM',
        description: 'Discover our sustainable farming techniques and their impact.',
        image: 'placeholder-blog.jpg',
        attendees: null
    }
];

// ========== DYNAMIC CONTENT LOADING FUNCTIONALITY ==========
// Initialize dynamic content loader on page ready
$(document).on('ready', function() {
    initializeDynamicContentLoader();
});

// Function to render dynamic products/content on the page
function renderDynamicContent(data, containerId, type = 'product') {
    const container = $(containerId);
    
    if (!container.length) return;
    
    container.empty();
    
    // Check if data is empty
    if (data.length === 0) {
        container.html('<p class="no-results">No results found. Please adjust your filters.</p>');
        return;
    }
    
    // Build HTML for each item and append to container
    data.forEach(item => {
        let html = '';
        
        if (type === 'product') {
            html = buildProductCard(item);
        } else if (type === 'event') {
            html = buildEventCard(item);
        }
        
        container.append(html);
    });
    
    // Animate newly rendered content
    container.find('.dynamic-item').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        });
        
        setTimeout(() => {
            $(this).animate({
                'opacity': '1'
            }, 400);
            $(this).css('transform', 'translateY(0)');
        }, index * 50);
    });
}

// Build individual product card HTML
function buildProductCard(product) {
    const stockStatus = product.inStock ? 'In Stock' : 'Out of Stock';
    const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
    
    return `
        <div class="dynamic-item product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}">
            <div class="product-card-image">
                <img src="images/${product.image}" alt="${product.name}" class="product-img-300">
                <span class="stock-badge ${stockClass}">${stockStatus}</span>
                <span class="rating-badge">★ ${product.rating}</span>
            </div>
            <div class="product-card-content">
                <h4>${product.name}</h4>
                <p class="category-tag">${product.category}</p>
                <p class="description">${product.description}</p>
                <div class="product-footer">
                    <span class="price">R${product.price}</span>
                    <span class="unit">${product.unit}</span>
                </div>
                <button class="product-add-btn" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

// Build individual event card HTML
function buildEventCard(event) {
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString('en-ZA', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    return `
        <div class="dynamic-item event-card" data-id="${event.id}" data-date="${event.date}" data-category="${event.category}">
            <div class="event-card-image">
                <!-- IMAGE INSTRUCTION: Replace with actual event images
                     Place images in: images/events/ folder
                     Supported formats: JPG, PNG, WebP
                     Recommended size: 400x250px (landscape)
                -->
                <img src="https://via.placeholder.com/400x250?text=${event.title.replace(/\s/g, '+')}" alt="${event.title}">
                <span class="event-category">${event.category}</span>
            </div>
            <div class="event-card-content">
                <h4>${event.title}</h4>
                <div class="event-meta">
                    <span class="event-date">📅 ${formattedDate}</span>
                    <span class="event-time">🕐 ${event.time}</span>
                </div>
                <p class="description">${event.description}</p>
                ${event.attendees ? `<p class="attendees">👥 ${event.attendees} attending</p>` : ''}
                <button class="event-register-btn" data-event-id="${event.id}">Learn More</button>
            </div>
        </div>
    `;
}

// ========== SEARCH FUNCTIONALITY ==========
// Initialize search functionality
function initializeDynamicContentLoader() {
    // Search input event listener for products
    $(document).on('keyup', '#productSearch', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        const filterCategory = $('#productFilter').val();
        const sortBy = $('#productSort').val();
        
        // Filter and sort data based on user input
        let filteredData = dynamicProductData.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.description.toLowerCase().includes(searchTerm) ||
                                 product.category.toLowerCase().includes(searchTerm);
            const matchesCategory = !filterCategory || product.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Apply sorting
        filteredData = sortData(filteredData, sortBy);
        
        // Render filtered results
        renderDynamicContent(filteredData, '#dynamicProductContainer', 'product');
    });
    
    // Filter dropdown event listener
    $(document).on('change', '#productFilter', function() {
        const searchTerm = $('#productSearch').val().toLowerCase().trim();
        const filterCategory = $(this).val();
        const sortBy = $('#productSort').val();
        
        // Re-filter with new category
        let filteredData = dynamicProductData.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !filterCategory || product.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Apply sorting
        filteredData = sortData(filteredData, sortBy);
        renderDynamicContent(filteredData, '#dynamicProductContainer', 'product');
    });
    
    // Sort dropdown event listener
    $(document).on('change', '#productSort', function() {
        const searchTerm = $('#productSearch').val().toLowerCase().trim();
        const filterCategory = $('#productFilter').val();
        const sortBy = $(this).val();
        
        // Re-filter data
        let filteredData = dynamicProductData.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !filterCategory || product.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Apply new sorting
        filteredData = sortData(filteredData, sortBy);
        renderDynamicContent(filteredData, '#dynamicProductContainer', 'product');
    });
    
    // Search for events
    $(document).on('keyup', '#eventSearch', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        const filterCategory = $('#eventFilter').val();
        
        // Filter events
        let filteredEvents = dynamicEventsData.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                                 event.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !filterCategory || event.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort by date (upcoming first)
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        renderDynamicContent(filteredEvents, '#dynamicEventContainer', 'event');
    });
    
    // Filter events by category
    $(document).on('change', '#eventFilter', function() {
        const searchTerm = $('#eventSearch').val().toLowerCase().trim();
        const filterCategory = $(this).val();
        
        // Filter events
        let filteredEvents = dynamicEventsData.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                                 event.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !filterCategory || event.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort by date
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        renderDynamicContent(filteredEvents, '#dynamicEventContainer', 'event');
    });
}

// ========== SORTING FUNCTIONALITY ==========
// Sort data based on selected criteria
function sortData(data, sortBy) {
    const dataCopy = [...data];
    
    switch(sortBy) {
        case 'price-low':
            // Sort by price ascending
            return dataCopy.sort((a, b) => a.price - b.price);
        
        case 'price-high':
            // Sort by price descending
            return dataCopy.sort((a, b) => b.price - a.price);
        
        case 'name':
            // Sort alphabetically by name
            return dataCopy.sort((a, b) => a.name.localeCompare(b.name));
        
        case 'rating':
            // Sort by rating descending
            return dataCopy.sort((a, b) => b.rating - a.rating);
        
        case 'newest':
            // Sort by ID descending (newest first)
            return dataCopy.sort((a, b) => b.id - a.id);
        
        default:
            return dataCopy;
    }
}

// ========== LOAD INITIAL CONTENT ==========
// Load dynamic products on page load
$(window).on('load', function() {
    // Check if product container exists on products page
    if ($('#dynamicProductContainer').length) {
        renderDynamicContent(dynamicProductData, '#dynamicProductContainer', 'product');
    }
    
    // Check if event container exists on events page
    if ($('#dynamicEventContainer').length) {
        renderDynamicContent(dynamicEventsData, '#dynamicEventContainer', 'event');
    }
});

// ========== ADD TO CART FUNCTIONALITY ==========
// Handle add to cart button clicks
$(document).on('click', '.product-add-btn', function() {
    const productId = $(this).data('product-id');
    const product = dynamicProductData.find(p => p.id === productId);
    
    if (product) {
        // Add product to cart (you can implement actual cart functionality here)
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Animate button feedback
        const $btn = $(this);
        $btn.text('✓ Added!');
        $btn.addClass('added');
        
        setTimeout(() => {
            $btn.text('Add to Cart');
            $btn.removeClass('added');
        }, 2000);
    }
});

// ========== EVENT REGISTRATION ==========
// Handle event registration button clicks
$(document).on('click', '.event-register-btn', function() {
    const eventId = $(this).data('event-id');
    const event = dynamicEventsData.find(e => e.id === eventId);
    
    if (event) {
        showNotification(`Registered for ${event.title}!`, 'success');
        
        // Animate button feedback
        const $btn = $(this);
        $btn.text('✓ Registered!');
        $btn.addClass('registered');
        
        setTimeout(() => {
            $btn.text('Learn More');
            $btn.removeClass('registered');
        }, 2000);
    }
});

// ========== NOTIFICATION SYSTEM ==========
// Show user-friendly notification messages
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = $(`
        <div class="notification notification-${type}">
            ${message}
            <button class="notification-close">&times;</button>
        </div>
    `);
    
    // Add to page
    $('body').append(notification);
    
    // Animate in
    notification.fadeIn(300);
    
    // Remove notification on close button click
    notification.on('click', '.notification-close', function() {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 4000);
}

// ========== PAGINATION (Optional Enhancement) ==========
// Function to paginate results (for future enhancement)
function paginateResults(data, itemsPerPage) {
    const pages = [];
    for (let i = 0; i < data.length; i += itemsPerPage) {
        pages.push(data.slice(i, i + itemsPerPage));
    }
    return pages;
}

// Handle page number clicks for pagination
$(document).on('click', '.pagination-btn', function() {
    const pageNumber = $(this).data('page');
    const data = $(this).data('data');
    const containerId = $(this).data('container');
    const type = $(this).data('type');
    
    // Render specific page
    renderDynamicContent(data, containerId, type);
    
    // Update active pagination button
    $('.pagination-btn').removeClass('active');
    $(this).addClass('active');
});

// ========== SECTION 3: SEO OPTIMIZATION HELPERS ==========

// Add image optimization with alt text and lazy loading
// Purpose: Improve SEO and page performance by adding proper alt text to images
// and implementing lazy loading for images below the fold
function initializeImageSEO() {
    // Get all images on the page
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add lazy loading for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Ensure all images have alt text (important for SEO and accessibility)
        if (!img.getAttribute('alt')) {
            // Generate descriptive alt text based on image filename or ID
            const altText = img.getAttribute('data-alt') || 
                           img.src.split('/').pop().split('.')[0].replace(/-/g, ' ');
            img.setAttribute('alt', altText);
        }
        
        // Add responsive image srcset if available
        if (!img.hasAttribute('srcset') && img.hasAttribute('data-srcset')) {
            img.setAttribute('srcset', img.getAttribute('data-srcset'));
        }
    });
}

// Generate and update structured data (JSON-LD) for products
// Purpose: Help search engines understand product information for rich snippets
function generateProductSchema(product) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "brand": {
            "@type": "Brand",
            "name": "Lekker Organic Farm"
        },
        "offers": {
            "@type": "Offer",
            "url": "https://www.lekkerorganicfarm.com/products.html",
            "priceCurrency": "ZAR",
            "price": product.price.toString(),
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "ratingCount": "50"
        }
    };
}

// Generate and update structured data (JSON-LD) for events
// Purpose: Help search engines understand event information for event listings
function generateEventSchema(event) {
    return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.title,
        "description": event.description,
        "image": event.image,
        "startDate": event.date,
        "endDate": event.date,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": "Lekker Organic Farm",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Farm Road",
                "addressLocality": "Meyerton",
                "addressRegion": "Gauteng",
                "postalCode": "1960",
                "addressCountry": "ZA"
            }
        },
        "organizer": {
            "@type": "Organization",
            "name": "Lekker Organic Farm",
            "url": "https://www.lekkerorganicfarm.com"
        }
    };
}

// Inject structured data into page head
// Purpose: Make structured data available to search engines
function injectStructuredData(schemaObject, id) {
    // Create script tag for structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id || 'schema-' + Date.now();
    script.textContent = JSON.stringify(schemaObject);
    
    // Add to document head
    document.head.appendChild(script);
}

// Update page meta tags dynamically
// Purpose: Update meta tags when content changes via JavaScript (SPAs, dynamic pages)
function updatePageMeta(title, description, keywords) {
    // Update title tag
    document.title = title;
    
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
    
    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
    
    // Update Open Graph tags for social sharing
    updateOpenGraphTags(title, description);
}

// Update Open Graph tags for social media sharing
// Purpose: Control how pages appear when shared on social media
function updateOpenGraphTags(title, description) {
    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;
    
    // Update og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
    }
    ogDesc.content = description;
    
    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
    }
    ogUrl.content = window.location.href;
}

// Generate breadcrumb schema
// Purpose: Help search engines understand page hierarchy and improve SERP display
function generateBreadcrumbSchema(breadcrumbs) {
    const items = breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
    }));
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    };
}

// Create and inject breadcrumb navigation
// Purpose: Improve user navigation and show breadcrumbs in search results
function createBreadcrumbs(items) {
    const breadcrumbNav = document.createElement('nav');
    breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbNav.className = 'breadcrumb-nav';
    
    const list = document.createElement('ol');
    list.className = 'breadcrumb-list';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        
        if (index < items.length - 1) {
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.name;
            li.appendChild(link);
        } else {
            // Last item should not be a link (current page)
            li.textContent = item.name;
            li.setAttribute('aria-current', 'page');
        }
        
        list.appendChild(li);
        
        // Add separator between items
        if (index < items.length - 1) {
            const separator = document.createElement('li');
            separator.className = 'breadcrumb-separator';
            separator.textContent = '/';
            list.appendChild(separator);
        }
    });
    
    breadcrumbNav.appendChild(list);
    return breadcrumbNav;
}

// Add internal linking helpers
// Purpose: Create internal links to improve site structure and SEO
function createInternalLink(text, href, className = '') {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    if (className) link.className = className;
    
    // Add title attribute for accessibility and SEO
    link.title = text + ' - Lekker Organic Farm';
    
    return link;
}

// Monitor and log page performance for SEO
// Purpose: Track Core Web Vitals (LCP, FID, CLS) which are Google ranking factors
function initializePerformanceMonitoring() {
    // Only run if Web Vitals API is supported
    if ('web-vital' in window) {
        // Log page performance metrics
        window.addEventListener('load', function() {
            // Measure Largest Contentful Paint (LCP)
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            observer.observe({entryTypes: ['largest-contentful-paint']});
            
            // Measure Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({entryTypes: ['layout-shift']});
        });
    }
}

// Generate sitemap data (for dynamic pages)
// Purpose: Create structured data for dynamically-generated product and event pages
function generateSitemapData() {
    const baseUrl = 'https://www.lekkerorganicfarm.com';
    const sitemapEntries = [];
    
    // Add static pages
    const staticPages = [
        { url: '/', priority: 1.0, changefreq: 'weekly' },
        { url: '/products.html', priority: 0.9, changefreq: 'daily' },
        { url: '/about.html', priority: 0.8, changefreq: 'monthly' },
        { url: '/contact.html', priority: 0.8, changefreq: 'monthly' },
        { url: '/enquiry.html', priority: 0.7, changefreq: 'monthly' },
        { url: '/events.html', priority: 0.8, changefreq: 'weekly' }
    ];
    
    staticPages.forEach(page => {
        sitemapEntries.push({
            loc: baseUrl + page.url,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: page.changefreq,
            priority: page.priority
        });
    });
    
    // Add dynamic product pages
    dynamicProductData.forEach(product => {
        sitemapEntries.push({
            loc: baseUrl + '/products.html?id=' + product.id,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: 0.7
        });
    });
    
    // Add dynamic event pages
    dynamicEventsData.forEach(event => {
        sitemapEntries.push({
            loc: baseUrl + '/events.html?id=' + event.id,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: 0.6
        });
    });
    
    return sitemapEntries;
}

// Initialize all SEO features on page load
// Purpose: Run all SEO optimization functions when page loads
$(document).ready(function() {
    // Initialize image SEO optimization
    initializeImageSEO();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Add breadcrumbs to main content area if it exists
    const mainElement = document.querySelector('main') || document.body;
    if (mainElement && !document.querySelector('.breadcrumb-nav')) {
        const breadcrumbItems = [
            { name: 'Home', url: 'index.html' },
            { name: 'Current Page', url: window.location.pathname }
        ];
        const breadcrumb = createBreadcrumbs(breadcrumbItems);
        mainElement.insertBefore(breadcrumb, mainElement.firstChild);
        
        // Inject breadcrumb schema
        injectStructuredData(generateBreadcrumbSchema(breadcrumbItems));
    }
});

