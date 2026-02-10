// ============================================
// AUTO LUXE KENYA - MODAL POPUP SYSTEM
// Handles car modal popups with image carousel, specifications, and contact features
// ============================================

// Global variables
let currentModal = null;
let currentCarouselIndex = 0;
let currentCarImages = [];
let carouselInterval = null;
const CAROUSEL_INTERVAL = 5000; // 5 seconds

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add modal close event listeners
    initModalCloseHandlers();
    
    // Add keyboard shortcuts
    initModalKeyboardShortcuts();
    
    // Add swipe support for mobile
    initModalSwipeSupport();
    
    // Check URL for modal parameter
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('car');
    if (carId) {
        setTimeout(() => openCarModal(carId), 500);
    }
});

// Initialize modal close handlers
function initModalCloseHandlers() {
    // Close modal when clicking overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Close modal when clicking close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || 
            e.target.closest('.modal-close')) {
            closeModal();
        }
    });
}

// Initialize modal keyboard shortcuts
function initModalKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (!currentModal) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateCarousel('prev');
                break;
            case 'ArrowRight':
                navigateCarousel('next');
                break;
        }
    });
}

// Initialize modal swipe support for mobile
function initModalSwipeSupport() {
    if (typeof window.addSwipeDetection === 'function') {
        // This will be implemented when modal is opened
    }
}

// Open car modal
function openCarModal(carId) {
    // Get car data
    const car = getCarById(carId);
    if (!car) {
        showToast('Car details not found', 'error');
        return;
    }
    
    // Create modal HTML
    const modalHTML = createCarModalHTML(car);
    
    // Get or create modal container
    let modalOverlay = document.getElementById('carModalOverlay');
    let modalContainer = document.getElementById('carModal');
    
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'carModalOverlay';
        document.body.appendChild(modalOverlay);
    }
    
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.id = 'carModal';
        modalOverlay.appendChild(modalContainer);
    }
    
    // Set modal content
    modalContainer.innerHTML = modalHTML;
    
    // Store current car
    currentModal = {
        type: 'car',
        car: car,
        element: modalContainer
    };
    
    // Initialize car images
    currentCarImages = car.images || ['default-car.jpg'];
    currentCarouselIndex = 0;
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize carousel
    initCarousel();
    
    // Initialize modal functionality
    initCarModalFunctionality(car);
    
    // Add to recently viewed
    addToRecentlyViewed(carId);
    
    // Update URL without reloading
    updateModalURL(carId);
    
    // Send analytics event
    trackModalView('car', carId);
}

// Create car modal HTML
function createCarModalHTML(car) {
    const badges = [];
    if (car.isHotDeal) badges.push('<span class="badge badge-hot">Hot Deal</span>');
    if (car.isCertified) badges.push('<span class="badge badge-certified">Certified</span>');
    if (car.isFinancing) badges.push('<span class="badge badge-financing">Financing Available</span>');
    if (car.year >= 2023) badges.push('<span class="badge badge-new">New Arrival</span>');
    
    return `
        <div class="modal-header">
            <h2>${car.make} ${car.model}</h2>
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="car-modal-content">
            <!-- Car Images Section -->
            <div class="car-images-section">
                <div class="car-main-image" id="carMainImage">
                    <img src="assets/images/cars/${car.images[0]}" 
                         alt="${car.year} ${car.make} ${car.model}" 
                         id="currentCarImage">
                    <div class="image-nav">
                        <button class="image-nav-btn prev-btn" id="prevImageBtn">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="image-nav-btn next-btn" id="nextImageBtn">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="car-thumbnails" id="carThumbnails">
                    ${car.images.map((img, index) => `
                        <div class="car-thumbnail ${index === 0 ? 'active' : ''}" 
                             data-index="${index}"
                             onclick="switchCarouselImage(${index})">
                            <img src="assets/images/cars/${img}" 
                                 alt="${car.make} ${car.model} - Image ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Car Details Section -->
            <div class="car-details-section">
                <div class="car-details-header">
                    <h3>${car.year} ${car.make} ${car.model}</h3>
                    <div class="car-details-price">${formatPrice(car.price)}</div>
                    <div class="car-details-meta">
                        <div class="car-meta-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${car.mileage}</span>
                        </div>
                        <div class="car-meta-item">
                            <i class="fas fa-gas-pump"></i>
                            <span>${car.fuelType}</span>
                        </div>
                        <div class="car-meta-item">
                            <i class="fas fa-cog"></i>
                            <span>${car.transmission}</span>
                        </div>
                        <div class="car-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${car.location}</span>
                        </div>
                    </div>
                    <div class="car-badges-modal">
                        ${badges.join('')}
                    </div>
                </div>
                
                <!-- Specifications -->
                <div class="car-specifications">
                    <h4><i class="fas fa-list-alt"></i> Specifications</h4>
                    <div class="specs-grid">
                        <div class="spec-item-modal">
                            <span class="spec-label">Make</span>
                            <span class="spec-value">${car.make}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Model</span>
                            <span class="spec-value">${car.model}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Year</span>
                            <span class="spec-value">${car.year}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Engine</span>
                            <span class="spec-value">${car.engine}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Power</span>
                            <span class="spec-value">${car.power || 'N/A'}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Torque</span>
                            <span class="spec-value">${car.torque || 'N/A'}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Doors</span>
                            <span class="spec-value">${car.doors || 'N/A'}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Seats</span>
                            <span class="spec-value">${car.seats || 'N/A'}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Color</span>
                            <span class="spec-value">${car.color || 'N/A'}</span>
                        </div>
                        <div class="spec-item-modal">
                            <span class="spec-label">Body Type</span>
                            <span class="spec-value">${car.bodyType}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Features -->
                <div class="car-features-modal">
                    <h4><i class="fas fa-star"></i> Features & Amenities</h4>
                    <div class="features-grid">
                        ${car.features.map(feature => `
                            <div class="feature-item-modal">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Description -->
                <div class="car-description">
                    <h4><i class="fas fa-file-alt"></i> Description</h4>
                    <p>${car.description}</p>
                </div>
                
                <!-- Contact Actions -->
                <div class="car-actions-modal">
                    <div class="contact-actions-modal">
                        <a href="${generateWhatsAppUrl(car.contact, car.whatsappMessage)}" 
                           class="contact-action-modal whatsapp" 
                           target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                        <a href="${generateCallUrl(car.contact)}" 
                           class="contact-action-modal call">
                            <i class="fas fa-phone"></i>
                            <span>Call Now</span>
                        </a>
                        <a href="${generateSmsUrl(car.contact, car.smsMessage)}" 
                           class="contact-action-modal sms">
                            <i class="fas fa-sms"></i>
                            <span>SMS</span>
                        </a>
                    </div>
                    <div class="utility-actions">
                        <button class="print-btn" onclick="printCarDetails('${car.id}')">
                            <i class="fas fa-print"></i>
                            <span>Print</span>
                        </button>
                        <button class="share-btn-modal" onclick="shareCarModal('${car.id}')">
                            <i class="fas fa-share-alt"></i>
                            <span>Share</span>
                        </button>
                        <button class="save-btn" onclick="saveCarForLater('${car.id}')">
                            <i class="fas fa-bookmark"></i>
                            <span>Save</span>
                        </button>
                    </div>
                </div>
                
                <!-- Similar Cars -->
                <div class="similar-cars">
                    <h4><i class="fas fa-car-side"></i> Similar Cars</h4>
                    <div class="similar-cars-grid" id="similarCarsGrid">
                        <!-- Similar cars will be loaded dynamically -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize car modal functionality
function initCarModalFunctionality(car) {
    // Initialize carousel navigation
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateCarousel('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateCarousel('next'));
    }
    
    // Load similar cars
    loadSimilarCars(car);
    
    // Initialize swipe support for mobile
    if (window.innerWidth < 768) {
        const carMainImage = document.getElementById('carMainImage');
        if (carMainImage && typeof window.addSwipeDetection === 'function') {
            window.addSwipeDetection(carMainImage, (direction) => {
                if (direction === 'left') {
                    navigateCarousel('next');
                } else if (direction === 'right') {
                    navigateCarousel('prev');
                }
            });
        }
    }
}

// Initialize carousel
function initCarousel() {
    // Stop any existing interval
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    // Start auto-rotation if more than 1 image
    if (currentCarImages.length > 1) {
        carouselInterval = setInterval(() => {
            navigateCarousel('next');
        }, CAROUSEL_INTERVAL);
    }
    
    // Pause on hover
    const carMainImage = document.getElementById('carMainImage');
    if (carMainImage) {
        carMainImage.addEventListener('mouseenter', () => {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        });
        
        carMainImage.addEventListener('mouseleave', () => {
            if (currentCarImages.length > 1) {
                carouselInterval = setInterval(() => {
                    navigateCarousel('next');
                }, CAROUSEL_INTERVAL);
            }
        });
    }
}

// Navigate carousel
function navigateCarousel(direction) {
    if (!currentCarImages || currentCarImages.length === 0) return;
    
    // Calculate new index
    if (direction === 'next') {
        currentCarouselIndex = (currentCarouselIndex + 1) % currentCarImages.length;
    } else if (direction === 'prev') {
        currentCarouselIndex = (currentCarouselIndex - 1 + currentCarImages.length) % currentCarImages.length;
    }
    
    // Update image
    switchCarouselImage(currentCarouselIndex);
    
    // Restart auto-rotation timer
    if (carouselInterval) {
        clearInterval(carouselInterval);
        if (currentCarImages.length > 1) {
            carouselInterval = setInterval(() => {
                navigateCarousel('next');
            }, CAROUSEL_INTERVAL);
        }
    }
}

// Switch to specific carousel image
function switchCarouselImage(index) {
    if (!currentCarImages || index < 0 || index >= currentCarImages.length) return;
    
    currentCarouselIndex = index;
    
    // Update main image
    const currentCarImage = document.getElementById('currentCarImage');
    if (currentCarImage) {
        currentCarImage.src = `assets/images/cars/${currentCarImages[index]}`;
        currentCarImage.alt = `Car image ${index + 1}`;
    }
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.car-thumbnail');
    thumbnails.forEach((thumbnail, i) => {
        if (i === index) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
}

// Load similar cars
function loadSimilarCars(car) {
    const similarCarsGrid = document.getElementById('similarCarsGrid');
    if (!similarCarsGrid) return;
    
    // Find similar cars (same brand, similar price, same body type)
    const similarCars = carsData
        .filter(c => 
            c.id !== car.id && 
            (c.brand === car.brand || 
             c.bodyType === car.bodyType ||
             Math.abs(c.price - car.price) < car.price * 0.3)
        )
        .slice(0, 3);
    
    if (similarCars.length === 0) {
        similarCarsGrid.innerHTML = `
            <div class="no-similar-cars">
                <p>No similar cars found</p>
            </div>
        `;
        return;
    }
    
    similarCarsGrid.innerHTML = similarCars.map(similarCar => `
        <div class="similar-car-card" onclick="openCarModal('${similarCar.id}')">
            <div class="similar-car-image">
                <img src="assets/images/cars/${similarCar.images[0]}" 
                     alt="${similarCar.year} ${similarCar.make} ${similarCar.model}">
            </div>
            <div class="similar-car-info">
                <h5>${similarCar.make} ${similarCar.model}</h5>
                <div class="similar-car-price">${formatPrice(similarCar.price)}</div>
                <div class="similar-car-meta">
                    <span>${similarCar.year} • ${similarCar.mileage}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Close modal
function closeModal() {
    const modalOverlay = document.getElementById('carModalOverlay');
    if (!modalOverlay) return;
    
    // Stop carousel
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
    
    // Hide modal
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear current modal
    currentModal = null;
    currentCarImages = [];
    currentCarouselIndex = 0;
    
    // Clear modal URL parameter
    clearModalURL();
}

// Print car details
function printCarDetails(carId) {
    const car = getCarById(carId);
    if (!car) return;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${car.make} ${car.model} - AutoLuxe Kenya</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1, h2, h3 { color: #8B4513; }
                .header { text-align: center; border-bottom: 2px solid #C41E3A; padding-bottom: 20px; margin-bottom: 30px; }
                .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
                .spec-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
                .price { font-size: 24px; font-weight: bold; color: #C41E3A; text-align: center; margin: 20px 0; }
                .contact-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .logo { text-align: center; margin-bottom: 20px; }
                .logo h1 { color: #8B4513; }
                @media print {
                    body { font-size: 12pt; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="logo">
                <h1>AutoLuxe Kenya</h1>
                <p>Luxury Vehicle Marketplace</p>
            </div>
            
            <div class="header">
                <h1>${car.year} ${car.make} ${car.model}</h1>
                <div class="price">${formatPrice(car.price)}</div>
            </div>
            
            <div class="specs-grid">
                <div class="spec-item"><strong>Mileage:</strong> ${car.mileage}</div>
                <div class="spec-item"><strong>Fuel Type:</strong> ${car.fuelType}</div>
                <div class="spec-item"><strong>Transmission:</strong> ${car.transmission}</div>
                <div class="spec-item"><strong>Engine:</strong> ${car.engine}</div>
                <div class="spec-item"><strong>Location:</strong> ${car.location}</div>
                <div class="spec-item"><strong>Body Type:</strong> ${car.bodyType}</div>
                <div class="spec-item"><strong>Color:</strong> ${car.color || 'N/A'}</div>
                <div class="spec-item"><strong>Doors:</strong> ${car.doors || 'N/A'}</div>
            </div>
            
            <h2>Features</h2>
            <ul>
                ${car.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            
            <h2>Description</h2>
            <p>${car.description}</p>
            
            <div class="contact-info">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> ${car.contact}</p>
                <p><strong>Reference:</strong> ${car.id}</p>
                <p><strong>Print Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="no-print">
                <p><em>Printed from AutoLuxe Kenya - Luxury Car Marketplace</em></p>
                <button onclick="window.print()">Print</button>
                <button onclick="window.close()">Close</button>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Share car modal
function shareCarModal(carId) {
    const car = getCarById(carId);
    if (!car) return;
    
    const shareData = {
        title: `${car.year} ${car.make} ${car.model} - AutoLuxe Kenya`,
        text: `Check out this ${car.year} ${car.make} ${car.model} for ${formatPrice(car.price)} on AutoLuxe Kenya`,
        url: `${window.location.origin}/cars.html?car=${carId}`
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showToast('Car shared successfully', 'success'))
            .catch(err => {
                console.error('Error sharing:', err);
                copyShareLink(shareData.url);
            });
    } else {
        copyShareLink(shareData.url);
    }
}

// Copy share link
function copyShareLink(url) {
    copyToClipboard(url)
        .then(() => showToast('Link copied to clipboard', 'success'))
        .catch(err => {
            console.error('Error copying:', err);
            showToast('Error copying link', 'error');
        });
}

// Save car for later
function saveCarForLater(carId) {
    let savedCars = JSON.parse(localStorage.getItem('savedCars') || '[]');
    
    if (savedCars.includes(carId)) {
        // Remove if already saved
        savedCars = savedCars.filter(id => id !== carId);
        showToast('Removed from saved cars', 'info');
    } else {
        // Add to saved
        savedCars.push(carId);
        showToast('Added to saved cars', 'success');
    }
    
    localStorage.setItem('savedCars', JSON.stringify(savedCars));
    
    // Update save button icon
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        const icon = saveBtn.querySelector('i');
        const text = saveBtn.querySelector('span');
        
        if (savedCars.includes(carId)) {
            icon.className = 'fas fa-bookmark';
            text.textContent = 'Saved';
        } else {
            icon.className = 'far fa-bookmark';
            text.textContent = 'Save';
        }
    }
}

// Add to recently viewed
function addToRecentlyViewed(carId) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== carId);
    
    // Add to beginning
    recentlyViewed.unshift(carId);
    
    // Keep only last 10
    if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Update modal URL
function updateModalURL(carId) {
    const url = new URL(window.location);
    url.searchParams.set('car', carId);
    window.history.replaceState({}, '', url.toString());
}

// Clear modal URL
function clearModalURL() {
    const url = new URL(window.location);
    url.searchParams.delete('car');
    window.history.replaceState({}, '', url.toString());
}

// Track modal view (for analytics)
function trackModalView(type, id) {
    // This would integrate with analytics service
    console.log(`${type} modal viewed: ${id}`);
    
    // Store in localStorage for simple analytics
    const views = JSON.parse(localStorage.getItem('modalViews') || '[]');
    views.push({
        type: type,
        id: id,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
    
    // Keep only last 100 views
    if (views.length > 100) {
        views.splice(0, views.length - 100);
    }
    
    localStorage.setItem('modalViews', JSON.stringify(views));
}

// Get car by ID (helper function)
function getCarById(carId) {
    return carsData.find(car => car.id === carId);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openCarModal,
        closeModal,
        navigateCarousel,
        switchCarouselImage,
        printCarDetails,
        shareCarModal,
        saveCarForLater
    };
}

// Make functions available globally for use in other files
window.openCarModal = openCarModal;
window.closeModal = closeModal;
window.navigateCarousel = navigateCarousel;
window.switchCarouselImage = switchCarouselImage;
window.printCarDetails = printCarDetails;
window.shareCarModal = shareCarModal;
window.saveCarForLater = saveCarForLater;