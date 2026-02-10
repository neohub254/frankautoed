// ============================================
// AUTO LUXE KENYA - CARS PAGE JAVASCRIPT
// Handles cars page functionality including display, pagination, and brand sections
// ============================================

// Global variables
let currentPage = 1;
let itemsPerPage = 12;
let currentView = 'grid';
let currentSort = 'featured';
let filteredCars = [];
let allCars = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCarsData();
    initViewToggle();
    initPagination();
    initBrandNavigation();
    initURLParams();
    initScrollToBrand();
});

// Load cars data and display
function loadCarsData() {
    const carsGrid = document.getElementById('carsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const emptyState = document.getElementById('emptyState');
    
    if (!carsGrid) return;
    
    try {
        // Show loading state
        carsGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading cars...</span>
            </div>
        `;
        
        // Use carsData from carsData.js
        allCars = carsData;
        filteredCars = [...allCars];
        
        // Apply URL parameters if any
        applyURLParams();
        
        // Update results count
        updateResultsCount();
        
        // Display cars
        displayCars();
        
        // Initialize brand sections
        createBrandSections();
        
    } catch (error) {
        console.error('Error loading cars:', error);
        carsGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error Loading Cars</h3>
                <p>Please try refreshing the page</p>
                <button class="btn-secondary" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    <span>Refresh Page</span>
                </button>
            </div>
        `;
    }
}

// Display cars based on current filters and pagination
function displayCars() {
    const carsGrid = document.getElementById('carsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!carsGrid) return;
    
    // Sort cars
    const sortedCars = sortCars(filteredCars, currentSort);
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCars = sortedCars.slice(startIndex, endIndex);
    
    // Show empty state if no cars
    if (currentCars.length === 0) {
        carsGrid.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Clear grid
    carsGrid.innerHTML = '';
    
    // Add cars to grid
    currentCars.forEach(car => {
        const carCard = createCarCardElement(car);
        carsGrid.appendChild(carCard);
    });
    
    // Update pagination
    updatePagination(totalPages);
    
    // Update active filters display
    updateActiveFilters();
    
    // Show grid
    carsGrid.style.display = 'grid';
    
    // Update view class
    carsGrid.className = `cars-grid ${currentView}-view`;
}

// Create car card element
function createCarCardElement(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.carId = car.id;
    card.dataset.brand = car.brand.toLowerCase();
    
    // Create badges
    const badges = [];
    if (car.isHotDeal) badges.push('<span class="badge badge-hot">Hot Deal</span>');
    if (car.isCertified) badges.push('<span class="badge badge-certified">Certified</span>');
    if (car.isFinancing) badges.push('<span class="badge badge-financing">Financing</span>');
    if (car.year >= 2023) badges.push('<span class="badge badge-new">New</span>');
    
    // Create features tags (first 3)
    const features = car.features.slice(0, 3).map(feature => 
        `<span class="feature-tag">${feature}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="car-image">
            <img src="assets/images/cars/${car.images[0]}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
            <div class="car-badges">
                ${badges.join('')}
            </div>
            <button class="quick-view-btn" data-car-id="${car.id}">
                <i class="fas fa-search"></i>
                <span>Quick View</span>
            </button>
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
            <div class="car-features">
                ${features}
            </div>
            <div class="car-footer">
                <div class="car-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${car.location}</span>
                </div>
                <div class="car-actions">
                    <button class="car-action-btn quick-view-btn-small" data-car-id="${car.id}" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="car-action-btn favorite-btn" data-car-id="${car.id}" title="Save to Favorites">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="car-action-btn share-btn" data-car-id="${car.id}" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const quickViewBtn = card.querySelector('.quick-view-btn');
    const quickViewBtnSmall = card.querySelector('.quick-view-btn-small');
    const favoriteBtn = card.querySelector('.favorite-btn');
    const shareBtn = card.querySelector('.share-btn');
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', () => openCarModal(car.id));
    }
    
    if (quickViewBtnSmall) {
        quickViewBtnSmall.addEventListener('click', () => openCarModal(car.id));
    }
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            toggleFavorite(car.id, this);
        });
        
        // Check if already favorited
        const favorites = JSON.parse(localStorage.getItem('favoriteCars') || '[]');
        if (favorites.includes(car.id)) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.title = 'Remove from Favorites';
        }
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => shareCar(car));
    }
    
    // Make whole card clickable for mobile
    if (window.innerWidth < 768) {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.car-actions')) {
                openCarModal(car.id);
            }
        });
    }
    
    return card;
}

// Initialize view toggle (grid/list)
function initViewToggle() {
    const viewToggle = document.querySelector('.view-toggle');
    if (!viewToggle) return;
    
    const viewBtns = viewToggle.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update view
            currentView = this.dataset.view;
            
            // Update grid class
            const carsGrid = document.getElementById('carsGrid');
            if (carsGrid) {
                carsGrid.className = `cars-grid ${currentView}-view`;
            }
            
            // Save preference to localStorage
            localStorage.setItem('carsViewPreference', currentView);
        });
    });
    
    // Load saved preference
    const savedView = localStorage.getItem('carsViewPreference');
    if (savedView) {
        const savedBtn = viewToggle.querySelector(`[data-view="${savedView}"]`);
        if (savedBtn) {
            savedBtn.click();
        }
    }
}

// Initialize pagination
function initPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    // Clear existing pagination
    paginationContainer.innerHTML = '';
    
    // Create load more button for mobile
    if (window.innerWidth < 768) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>Load More Cars</span>
        `;
        loadMoreBtn.addEventListener('click', loadMoreCars);
        paginationContainer.appendChild(loadMoreBtn);
    }
}

// Update pagination based on total pages
function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || window.innerWidth < 768) return;
    
    // Clear existing pagination
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Create pagination wrapper
    const paginationWrapper = document.createElement('div');
    paginationWrapper.className = 'pagination-wrapper';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCars();
            scrollToTop();
        }
    });
    paginationWrapper.appendChild(prevBtn);
    
    // Page numbers
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'pagination-numbers';
    
    // Always show first page
    addPageNumber(pageNumbers, 1);
    
    // Show ellipsis if needed
    if (currentPage > 3) {
        const ellipsis1 = document.createElement('span');
        ellipsis1.className = 'pagination-ellipsis';
        ellipsis1.textContent = '...';
        pageNumbers.appendChild(ellipsis1);
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
        addPageNumber(pageNumbers, i);
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
        const ellipsis2 = document.createElement('span');
        ellipsis2.className = 'pagination-ellipsis';
        ellipsis2.textContent = '...';
        pageNumbers.appendChild(ellipsis2);
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
        addPageNumber(pageNumbers, totalPages);
    }
    
    paginationWrapper.appendChild(pageNumbers);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayCars();
            scrollToTop();
        }
    });
    paginationWrapper.appendChild(nextBtn);
    
    paginationContainer.appendChild(paginationWrapper);
}

// Add page number to pagination
function addPageNumber(container, pageNumber) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'pagination-btn';
    pageBtn.textContent = pageNumber;
    pageBtn.classList.toggle('active', pageNumber === currentPage);
    
    pageBtn.addEventListener('click', () => {
        currentPage = pageNumber;
        displayCars();
        scrollToTop();
    });
    
    container.appendChild(pageBtn);
}

// Load more cars (for mobile)
function loadMoreCars() {
    itemsPerPage += 12;
    displayCars();
}

// Initialize brand navigation sidebar
function initBrandNavigation() {
    const brandNavList = document.getElementById('brandNavList');
    if (!brandNavList) return;
    
    // Get unique brands from carsData
    const uniqueBrands = [...new Set(carsData.map(car => car.brand))].sort();
    
    // Group brands by first letter
    const brandsByLetter = {};
    uniqueBrands.forEach(brand => {
        const firstLetter = brand.charAt(0).toUpperCase();
        if (!brandsByLetter[firstLetter]) {
            brandsByLetter[firstLetter] = [];
        }
        brandsByLetter[firstLetter].push(brand);
    });
    
    // Create navigation letters
    Object.keys(brandsByLetter).sort().forEach(letter => {
        const letterItem = document.createElement('div');
        letterItem.className = 'brand-nav-letter';
        letterItem.textContent = letter;
        letterItem.title = `Jump to brands starting with ${letter}`;
        
        letterItem.addEventListener('click', () => {
            // Remove active class from all letters
            document.querySelectorAll('.brand-nav-letter').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked letter
            letterItem.classList.add('active');
            
            // Scroll to first brand with this letter
            const firstBrand = brandsByLetter[letter][0];
            const brandSection = document.querySelector(`[data-brand="${firstBrand.toLowerCase()}"]`);
            if (brandSection) {
                brandSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        
        brandNavList.appendChild(letterItem);
    });
}

// Create brand sections for navigation
function createBrandSections() {
    const brandSectionsContainer = document.getElementById('brandSections');
    if (!brandSectionsContainer) return;
    
    // Clear existing sections
    brandSectionsContainer.innerHTML = '';
    
    // Get unique brands from filtered cars
    const uniqueBrands = [...new Set(filteredCars.map(car => car.brand))].sort();
    
    // Create section for each brand
    uniqueBrands.forEach(brand => {
        const brandCars = filteredCars.filter(car => car.brand === brand);
        const brandSection = document.createElement('div');
        brandSection.className = 'brand-section';
        brandSection.id = `brand-${brand.toLowerCase().replace(/\s+/g, '-')}`;
        brandSection.dataset.brand = brand.toLowerCase();
        
        brandSection.innerHTML = `
            <div class="brand-section-header">
                <div class="brand-logo-large">
                    <i class="fas fa-car"></i>
                </div>
                <div>
                    <h2>${brand}</h2>
                    <span class="brand-count">${brandCars.length} car${brandCars.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="brand-cars-grid" id="brand-cars-${brand.toLowerCase()}">
                <!-- Cars will be added by JavaScript -->
            </div>
        `;
        
        brandSectionsContainer.appendChild(brandSection);
        
        // Add cars to this brand section
        const brandCarsGrid = brandSection.querySelector('.brand-cars-grid');
        brandCars.forEach(car => {
            const carCard = createCarCardElement(car);
            brandCarsGrid.appendChild(carCard);
        });
    });
}

// Initialize URL parameters
function initURLParams() {
    const params = getUrlParams();
    
    // Apply brand filter from URL
    if (params.brand) {
        const brandFilter = document.querySelector(`[data-brand="${params.brand}"]`);
        if (brandFilter) {
            brandFilter.click();
        }
    }
    
    // Apply search from URL
    if (params.search) {
        const searchInput = document.getElementById('carSearch');
        if (searchInput) {
            searchInput.value = decodeURIComponent(params.search);
            // Trigger search
            if (typeof window.performSearch === 'function') {
                window.performSearch(decodeURIComponent(params.search));
            }
        }
    }
    
    // Apply car ID from URL (for direct linking)
    if (params.car) {
        openCarModal(params.car);
    }
}

// Apply URL parameters to filters
function applyURLParams() {
    const params = getUrlParams();
    
    // Create filters object from URL
    const filters = {
        minPrice: params.minPrice ? parseInt(params.minPrice) : 500000,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice) : 50000000,
        brands: params.brands ? params.brands.split(',') : [],
        minYear: params.minYear ? parseInt(params.minYear) : 2010,
        maxYear: params.maxYear ? parseInt(params.maxYear) : 2024,
        transmissions: params.transmissions ? params.transmissions.split(',') : [],
        fuelTypes: params.fuelTypes ? params.fuelTypes.split(',') : [],
        bodyTypes: params.bodyTypes ? params.bodyTypes.split(',') : [],
        features: params.features ? params.features.split(',') : [],
        location: params.location || 'all',
        searchQuery: params.search || ''
    };
    
    // Apply filters
    if (typeof window.applyFilters === 'function') {
        window.applyFilters(filters, false); // Don't update URL again
    }
}

// Update results count display
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    const totalCars = allCars.length;
    const showingCars = filteredCars.length;
    
    if (showingCars === totalCars) {
        resultsCount.textContent = `Showing ${showingCars} luxury cars`;
    } else {
        resultsCount.textContent = `Showing ${showingCars} of ${totalCars} cars`;
    }
}

// Update active filters display
function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;
    
    // Clear existing filters
    activeFiltersContainer.innerHTML = '';
    
    // Get current filters from the UI
    const filters = getCurrentFilters();
    let filterCount = 0;
    
    // Add price filter if not default
    if (filters.minPrice > 500000 || filters.maxPrice < 50000000) {
        const priceTag = createFilterTag(
            `Price: ${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`,
            'clearPriceFilter'
        );
        activeFiltersContainer.appendChild(priceTag);
        filterCount++;
    }
    
    // Add brand filters
    if (filters.brands.length > 0) {
        filters.brands.forEach(brand => {
            const brandTag = createFilterTag(brand, 'clearBrandFilter', brand);
            activeFiltersContainer.appendChild(brandTag);
            filterCount++;
        });
    }
    
    // Add transmission filters
    if (filters.transmissions.length > 0 && filters.transmissions.length < 4) {
        filters.transmissions.forEach(trans => {
            const transTag = createFilterTag(trans, 'clearTransmissionFilter', trans);
            activeFiltersContainer.appendChild(transTag);
            filterCount++;
        });
    }
    
    // Add fuel type filters
    if (filters.fuelTypes.length > 0 && filters.fuelTypes.length < 5) {
        filters.fuelTypes.forEach(fuel => {
            const fuelTag = createFilterTag(fuel, 'clearFuelFilter', fuel);
            activeFiltersContainer.appendChild(fuelTag);
            filterCount++;
        });
    }
    
    // Update mobile filter count
    const mobileFilterCount = document.getElementById('mobileFilterCount');
    if (mobileFilterCount) {
        mobileFilterCount.textContent = filterCount;
    }
}

// Create filter tag element
function createFilterTag(text, clearFunction, value = null) {
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    
    tag.innerHTML = `
        <span>${text}</span>
        <button type="button" ${value ? `data-value="${value}"` : ''}>
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const clearBtn = tag.querySelector('button');
    clearBtn.addEventListener('click', function() {
        if (typeof window[clearFunction] === 'function') {
            window[clearFunction](value);
        }
    });
    
    return tag;
}

// Toggle favorite status
function toggleFavorite(carId, button) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCars') || '[]');
    
    if (favorites.includes(carId)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== carId);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.title = 'Save to Favorites';
        showToast('Removed from favorites', 'info');
    } else {
        // Add to favorites
        favorites.push(carId);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.title = 'Remove from Favorites';
        showToast('Added to favorites', 'success');
    }
    
    localStorage.setItem('favoriteCars', JSON.stringify(favorites));
}

// Share car
function shareCar(car) {
    const shareData = {
        title: `${car.year} ${car.make} ${car.model} - AutoLuxe Kenya`,
        text: `Check out this ${car.year} ${car.make} ${car.model} for ${formatPrice(car.price)} on AutoLuxe Kenya`,
        url: `${window.location.origin}/cars.html?car=${car.id}`
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

// Copy share link to clipboard
function copyShareLink(url) {
    copyToClipboard(url)
        .then(() => showToast('Link copied to clipboard', 'success'))
        .catch(err => {
            console.error('Error copying:', err);
            showToast('Error copying link', 'error');
        });
}

// Scroll to top of results
function scrollToTop() {
    const resultsHeader = document.querySelector('.results-header');
    if (resultsHeader) {
        resultsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll to brand section
function initScrollToBrand() {
    // Check URL for brand anchor
    const hash = window.location.hash;
    if (hash && hash.startsWith('#brand-')) {
        const brandSection = document.querySelector(hash);
        if (brandSection) {
            setTimeout(() => {
                brandSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }
}

// Get current filters from UI
function getCurrentFilters() {
    // This function should be coordinated with filters.js
    // For now, return a basic structure
    return {
        minPrice: 500000,
        maxPrice: 50000000,
        brands: [],
        minYear: 2010,
        maxYear: 2024,
        transmissions: [],
        fuelTypes: [],
        bodyTypes: [],
        features: [],
        location: 'all',
        searchQuery: ''
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadCarsData,
        displayCars,
        initViewToggle,
        initPagination,
        initBrandNavigation,
        createBrandSections,
        updateResultsCount,
        updateActiveFilters,
        toggleFavorite,
        shareCar,
        initScrollToBrand
    };
}