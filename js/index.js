// ============================================
// AUTO LUXE KENYA - HOMEPAGE JAVASCRIPT
// Handles homepage-specific functionality
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load featured cars
    loadFeaturedCars();
    
    // Load brands showcase
    loadBrandsShowcase();
    
    // Initialize quick search
    initQuickSearch();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Initialize hero stats counter
    initStatsCounter();
});

// Load featured cars from carsData.js
function loadFeaturedCars() {
    const featuredCarsContainer = document.getElementById('featuredCars');
    if (!featuredCarsContainer) return;
    
    try {
        // Get featured cars (first 3 from carsData)
        const featuredCars = carsData.filter(car => car.isFeatured).slice(0, 3);
        
        if (featuredCars.length === 0) {
            featuredCarsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h3>No Featured Cars Available</h3>
                    <p>Check back soon for our latest luxury vehicles</p>
                </div>
            `;
            return;
        }
        
        featuredCarsContainer.innerHTML = featuredCars.map(car => createCarCard(car, true)).join('');
        
        // Add event listeners to view details buttons
        featuredCarsContainer.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const carId = this.dataset.carId;
                openCarModal(carId);
            });
        });
        
    } catch (error) {
        console.error('Error loading featured cars:', error);
        featuredCarsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error Loading Cars</h3>
                <p>Please try refreshing the page</p>
            </div>
        `;
    }
}

// Create car card HTML for homepage
function createCarCard(car, isHomepage = false) {
    const badges = [];
    if (car.isHotDeal) badges.push('<span class="badge badge-hot">Hot Deal</span>');
    if (car.isCertified) badges.push('<span class="badge badge-certified">Certified</span>');
    if (car.isFinancing) badges.push('<span class="badge badge-financing">Financing</span>');
    if (car.year >= 2023) badges.push('<span class="badge badge-new">New</span>');
    
    return `
        <div class="car-card" data-car-id="${car.id}">
            <div class="car-image">
                <img src="assets/images/cars/${car.images[0]}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                <div class="car-badges">
                    ${badges.join('')}
                </div>
            </div>
            <div class="car-content">
                <div class="car-header">
                    <div class="car-title">
                        <h3>${car.make} ${car.model}</h3>
                        <p>${car.year} • ${car.fuelType} • ${car.transmission}</p>
                    </div>
                    <div class="car-price">${formatPrice(car.price)}</div>
                </div>
                <div class="car-specs">
                    <div class="spec-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>${car.mileage}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-cog"></i>
                        <span>${car.engine}</span>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${car.location}</span>
                    </div>
                </div>
                <div class="car-footer">
                    <div class="car-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${car.location}</span>
                    </div>
                    <button class="btn-secondary view-details-btn" data-car-id="${car.id}">
                        <i class="fas fa-eye"></i>
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load brands showcase
function loadBrandsShowcase() {
    const brandsGrid = document.getElementById('brandsGrid');
    if (!brandsGrid) return;
    
    try {
        // Get unique brands from carsData
        const uniqueBrands = [...new Set(carsData.map(car => car.brand))];
        const popularBrands = uniqueBrands.slice(0, 8); // Show first 8 brands
        
        brandsGrid.innerHTML = popularBrands.map(brand => `
            <div class="brand-item" data-brand="${brand.toLowerCase()}">
                <div class="brand-logo">
                    <i class="fas fa-car"></i>
                </div>
                <span>${brand}</span>
            </div>
        `).join('');
        
        // Add click event to brand items
        brandsGrid.querySelectorAll('.brand-item').forEach(item => {
            item.addEventListener('click', function() {
                const brand = this.dataset.brand;
                window.location.href = `cars.html?brand=${brand}`;
            });
        });
        
    } catch (error) {
        console.error('Error loading brands:', error);
        brandsGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading brands</p>
            </div>
        `;
    }
}

// Initialize quick search on homepage
function initQuickSearch() {
    const quickSearchInput = document.getElementById('quickSearch');
    const quickSearchBtn = document.querySelector('.quick-search .btn-primary');
    
    if (quickSearchInput && quickSearchBtn) {
        // Redirect to cars page with search query
        quickSearchBtn.addEventListener('click', function() {
            const query = quickSearchInput.value.trim();
            if (query) {
                window.location.href = `cars.html?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = 'cars.html';
            }
        });
        
        // Allow Enter key to trigger search
        quickSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                quickSearchBtn.click();
            }
        });
        
        // Add autocomplete suggestions
        quickSearchInput.addEventListener('input', debounce(function() {
            showSearchSuggestions(this.value);
        }, 300));
    }
}

// Show search suggestions for quick search
function showSearchSuggestions(query) {
    const quickSearchContainer = document.querySelector('.quick-search');
    let suggestionsContainer = document.getElementById('quickSearchSuggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'quickSearchSuggestions';
        suggestionsContainer.className = 'search-suggestions';
        quickSearchContainer.appendChild(suggestionsContainer);
    }
    
    if (!query.trim()) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    // Get suggestions from carsData
    const suggestions = carsData
        .filter(car => 
            car.make.toLowerCase().includes(query.toLowerCase()) ||
            car.model.toLowerCase().includes(query.toLowerCase()) ||
            car.year.toString().includes(query)
        )
        .slice(0, 5)
        .map(car => ({
            text: `${car.year} ${car.make} ${car.model}`,
            value: car.id
        }));
    
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div class="suggestion-item">No matches found</div>';
    } else {
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-car-id="${suggestion.value}">
                <i class="fas fa-car"></i>
                <span>${suggestion.text}</span>
            </div>
        `).join('');
        
        // Add click event to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const carId = this.dataset.carId;
                openCarModal(carId);
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            });
        });
    }
    
    suggestionsContainer.style.display = 'block';
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function closeSuggestions(e) {
        if (!quickSearchContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
            document.removeEventListener('click', closeSuggestions);
        }
    });
}

// Initialize newsletter form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail');
        const notifyCheckbox = document.getElementById('notifyNewArrivals');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        if (!validateEmail(emailInput.value)) {
            showToast('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        setButtonLoading(submitBtn, true);
        
        // Simulate API call
        setTimeout(() => {
            setButtonLoading(submitBtn, false);
            
            // Save to localStorage
            const subscription = {
                email: emailInput.value,
                notifyNewArrivals: notifyCheckbox.checked,
                subscribedAt: new Date().toISOString()
            };
            
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
            
            // Show success message
            showToast('Successfully subscribed to newsletter!', 'success');
            
            // Reset form
            newsletterForm.reset();
            
        }, 1500);
    });
}

// Initialize statistics counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    // Check if already counted
    if (sessionStorage.getItem('statsCounted')) return;
    
    // Intersection Observer to trigger counting when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.count);
                    const suffix = stat.textContent.includes('+') ? '+' : '';
                    animateCount(stat, 0, target, 2000, suffix);
                });
                
                // Mark as counted
                sessionStorage.setItem('statsCounted', 'true');
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.hero-stats'));
}

// Animate number counting
function animateCount(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize testimonials slider
function initTestimonialsSlider() {
    const sliderContainer = document.getElementById('testimonialsSlider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!sliderContainer || !prevBtn || !nextBtn) return;
    
    const cards = sliderContainer.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(sliderContainer).gap);
    
    // Auto-rotate every 5 seconds
    let autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }, 5000);
    
    // Pause auto-slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }, 5000);
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
        
        // Restart auto-slide
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }, 5000);
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
        
        // Restart auto-slide
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }, 5000);
    });
    
    // Update slider position
    function updateSlider() {
        const translateX = -currentIndex * cardWidth;
        sliderContainer.style.transform = `translateX(${translateX}px)`;
        
        // Update active indicators
        updateSliderIndicators();
    }
    
    // Create slider indicators
    function createSliderIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        
        for (let i = 0; i < cards.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.dataset.index = i;
            indicator.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                currentIndex = i;
                updateSlider();
                
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % cards.length;
                    updateSlider();
                }, 5000);
            });
            indicatorsContainer.appendChild(indicator);
        }
        
        sliderContainer.parentNode.appendChild(indicatorsContainer);
    }
    
    // Update slider indicators
    function updateSliderIndicators() {
        const indicators = document.querySelectorAll('.slider-indicators .indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Create indicators on load
    createSliderIndicators();
    updateSliderIndicators();
    
    // Handle responsive changes
    window.addEventListener('resize', () => {
        const newCardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(sliderContainer).gap);
        if (newCardWidth !== cardWidth) {
            updateSlider();
        }
    });
}

// Open car modal (will be implemented in modal.js)
function openCarModal(carId) {
    // This function will be called from modal.js
    if (typeof window.openCarModal === 'function') {
        window.openCarModal(carId);
    } else {
        // Fallback: redirect to car details
        window.location.href = `cars.html?car=${carId}`;
    }
}

// Add styles for testimonials slider indicators
function addSliderIndicatorStyles() {
    if (!document.querySelector('#slider-indicator-styles')) {
        const style = document.createElement('style');
        style.id = 'slider-indicator-styles';
        style.textContent = `
            .slider-indicators {
                display: flex;
                justify-content: center;
                gap: var(--spacing-sm);
                margin-top: var(--spacing-lg);
            }
            .slider-indicators .indicator {
                width: 10px;
                height: 10px;
                border-radius: var(--radius-round);
                background: var(--gray-medium);
                border: none;
                cursor: pointer;
                padding: 0;
                transition: all var(--transition-fast);
            }
            .slider-indicators .indicator.active {
                background: var(--secondary-color);
                transform: scale(1.2);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all homepage functionality
function initHomepage() {
    loadFeaturedCars();
    loadBrandsShowcase();
    initQuickSearch();
    initNewsletterForm();
    initStatsCounter();
    initTestimonialsSlider();
    addSliderIndicatorStyles();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadFeaturedCars,
        loadBrandsShowcase,
        initQuickSearch,
        initNewsletterForm,
        initStatsCounter,
        initTestimonialsSlider,
        initHomepage
    };
} else {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initHomepage);
}