// ============================================
// AUTO LUXE KENYA - FILTERS JAVASCRIPT
// Handles advanced filtering functionality for cars page
// ============================================

// Global variables
let currentFilters = {
    minPrice: 500000,
    maxPrice: 50000000,
    brands: [],
    minYear: 2010,
    maxYear: 2024,
    transmissions: ['Automatic'],
    fuelTypes: ['Petrol', 'Diesel'],
    bodyTypes: ['SUV', 'Sedan'],
    features: [],
    location: 'all',
    searchQuery: ''
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initFilterControls();
    initPriceSlider();
    initFilterExpansion();
    loadSavedFilters();
    updateFilterCount();
    
    // Apply filters on page load
    setTimeout(() => applyFilters(currentFilters, false), 100);
});

// Initialize filter controls
function initFilterControls() {
    // Brand filter
    initBrandFilter();
    
    // Checkbox filters
    initCheckboxFilters();
    
    // Location filter
    initLocationFilter();
    
    // Sort filter
    initSortFilter();
    
    // Year filter
    initYearFilter();
    
    // Apply filters button
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => applyFilters(getCurrentFilters()));
    }
    
    // Clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
    
    // Mobile filter toggle
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    
    if (filterToggleBtn && filtersSidebar) {
        filterToggleBtn.addEventListener('click', () => {
            filtersSidebar.classList.toggle('active');
            document.body.style.overflow = filtersSidebar.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close sidebar when clicking outside on mobile
        if (window.innerWidth < 1024) {
            document.addEventListener('click', (e) => {
                if (!filtersSidebar.contains(e.target) && 
                    !filterToggleBtn.contains(e.target) && 
                    filtersSidebar.classList.contains('active')) {
                    filtersSidebar.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
}

// Initialize brand filter
function initBrandFilter() {
    const brandFilterGrid = document.getElementById('brandFilterGrid');
    if (!brandFilterGrid) return;
    
    // Get unique brands from carsData
    const uniqueBrands = [...new Set(carsData.map(car => car.brand))].sort();
    
    // Create "All Brands" option
    const allBrandsItem = document.createElement('div');
    allBrandsItem.className = 'brand-filter-item selected';
    allBrandsItem.dataset.brand = 'all';
    allBrandsItem.innerHTML = `
        <i class="fas fa-car"></i>
        <span>All Brands</span>
    `;
    
    allBrandsItem.addEventListener('click', () => {
        // Deselect all other brands
        document.querySelectorAll('.brand-filter-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Select "All Brands"
        allBrandsItem.classList.add('selected');
        
        // Update filters
        currentFilters.brands = [];
        updateFilterCount();
    });
    
    brandFilterGrid.appendChild(allBrandsItem);
    
    // Create brand items
    uniqueBrands.forEach(brand => {
        const brandItem = document.createElement('div');
        brandItem.className = 'brand-filter-item';
        brandItem.dataset.brand = brand.toLowerCase();
        brandItem.innerHTML = `
            <i class="fas fa-car"></i>
            <span>${brand}</span>
        `;
        
        brandItem.addEventListener('click', () => {
            // Toggle selection
            brandItem.classList.toggle('selected');
            
            // Update "All Brands" state
            const selectedBrands = document.querySelectorAll('.brand-filter-item.selected:not([data-brand="all"])');
            const allBrandsItem = document.querySelector('.brand-filter-item[data-brand="all"]');
            
            if (selectedBrands.length === 0) {
                // If no brands selected, select "All Brands"
                allBrandsItem.classList.add('selected');
                currentFilters.brands = [];
            } else {
                // Deselect "All Brands" if specific brands are selected
                allBrandsItem.classList.remove('selected');
                currentFilters.brands = Array.from(selectedBrands).map(item => 
                    item.dataset.brand.charAt(0).toUpperCase() + item.dataset.brand.slice(1)
                );
            }
            
            updateFilterCount();
        });
        
        brandFilterGrid.appendChild(brandItem);
    });
}

// Initialize checkbox filters
function initCheckboxFilters() {
    // Transmission checkboxes
    initCheckboxGroup('transmission', ['Automatic', 'Manual', 'CVT', 'Semi-Auto']);
    
    // Fuel type checkboxes
    initCheckboxGroup('fuelType', ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG']);
    
    // Body type checkboxes
    initCheckboxGroup('bodyType', ['SUV', 'Sedan', 'Hatchback', 'Truck', 'Convertible']);
    
    // Features checkboxes
    initCheckboxGroup('features', [
        'Sunroof', 'Leather Seats', 'Navigation', 'Camera', 
        'Apple CarPlay', 'Android Auto', 'Heated Seats', 'Ventilated Seats'
    ]);
}

// Initialize checkbox group
function initCheckboxGroup(name, options) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    
    checkboxes.forEach(checkbox => {
        // Set initial state based on currentFilters
        if (name === 'transmission' && currentFilters.transmissions.includes(checkbox.value)) {
            checkbox.checked = true;
        }
        if (name === 'fuelType' && currentFilters.fuelTypes.includes(checkbox.value)) {
            checkbox.checked = true;
        }
        if (name === 'bodyType' && currentFilters.bodyTypes.includes(checkbox.value)) {
            checkbox.checked = true;
        }
        
        checkbox.addEventListener('change', () => {
            updateCheckboxFilter(name);
            updateFilterCount();
        });
    });
}

// Update checkbox filter values
function updateCheckboxFilter(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    const values = Array.from(checkboxes).map(cb => cb.value);
    
    switch (name) {
        case 'transmission':
            currentFilters.transmissions = values;
            break;
        case 'fuelType':
            currentFilters.fuelTypes = values;
            break;
        case 'bodyType':
            currentFilters.bodyTypes = values;
            break;
        case 'features':
            currentFilters.features = values;
            break;
    }
}

// Initialize location filter
function initLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    if (!locationFilter) return;
    
    // Set initial value
    locationFilter.value = currentFilters.location;
    
    locationFilter.addEventListener('change', () => {
        currentFilters.location = locationFilter.value;
        updateFilterCount();
    });
}

// Initialize sort filter
function initSortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    if (!sortFilter) return;
    
    // Set initial value
    sortFilter.value = 'featured';
    
    sortFilter.addEventListener('change', () => {
        if (typeof window.currentSort !== 'undefined') {
            window.currentSort = sortFilter.value;
            if (typeof window.displayCars === 'function') {
                window.displayCars();
            }
        }
    });
}

// Initialize year filter
function initYearFilter() {
    const minYearInput = document.getElementById('minYear');
    const maxYearInput = document.getElementById('maxYear');
    
    if (!minYearInput || !maxYearInput) return;
    
    // Set initial values
    minYearInput.value = currentFilters.minYear;
    maxYearInput.value = currentFilters.maxYear;
    
    // Add input validation
    const validateYearRange = () => {
        let minYear = parseInt(minYearInput.value) || 2010;
        let maxYear = parseInt(maxYearInput.value) || 2024;
        
        // Ensure min <= max
        if (minYear > maxYear) {
            [minYear, maxYear] = [maxYear, minYear];
            minYearInput.value = minYear;
            maxYearInput.value = maxYear;
        }
        
        // Ensure within bounds
        minYear = Math.max(2010, Math.min(2024, minYear));
        maxYear = Math.max(2010, Math.min(2024, maxYear));
        
        minYearInput.value = minYear;
        maxYearInput.value = maxYear;
        
        currentFilters.minYear = minYear;
        currentFilters.maxYear = maxYear;
        
        updateFilterCount();
    };
    
    minYearInput.addEventListener('change', validateYearRange);
    maxYearInput.addEventListener('change', validateYearRange);
    minYearInput.addEventListener('input', debounce(validateYearRange, 500));
    maxYearInput.addEventListener('input', debounce(validateYearRange, 500));
}

// Initialize price slider
function initPriceSlider() {
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceRangeValue = document.getElementById('priceRangeValue');
    
    if (!priceSliderMin || !priceSliderMax || !minPriceInput || !maxPriceInput) return;
    
    // Set initial values
    priceSliderMin.value = currentFilters.minPrice;
    priceSliderMax.value = currentFilters.maxPrice;
    minPriceInput.value = currentFilters.minPrice;
    maxPriceInput.value = currentFilters.maxPrice;
    
    // Update price range display
    const updatePriceDisplay = () => {
        const min = parseInt(priceSliderMin.value);
        const max = parseInt(priceSliderMax.value);
        
        // Ensure min <= max
        if (min > max) {
            [priceSliderMin.value, priceSliderMax.value] = [max, min];
            minPriceInput.value = max;
            maxPriceInput.value = min;
        } else {
            minPriceInput.value = min;
            maxPriceInput.value = max;
        }
        
        // Update display
        if (priceRangeValue) {
            priceRangeValue.textContent = `${formatPrice(min)} - ${formatPrice(max)}`;
        }
        
        currentFilters.minPrice = parseInt(minPriceInput.value);
        currentFilters.maxPrice = parseInt(maxPriceInput.value);
        
        updateFilterCount();
    };
    
    // Add event listeners to sliders
    priceSliderMin.addEventListener('input', updatePriceDisplay);
    priceSliderMax.addEventListener('input', updatePriceDisplay);
    
    // Add event listeners to inputs
    minPriceInput.addEventListener('input', debounce(() => {
        let value = parseInt(minPriceInput.value) || 500000;
        value = Math.max(500000, Math.min(50000000, value));
        minPriceInput.value = value;
        priceSliderMin.value = value;
        updatePriceDisplay();
    }, 500));
    
    maxPriceInput.addEventListener('input', debounce(() => {
        let value = parseInt(maxPriceInput.value) || 50000000;
        value = Math.max(500000, Math.min(50000000, value));
        maxPriceInput.value = value;
        priceSliderMax.value = value;
        updatePriceDisplay();
    }, 500));
    
    // Initial display update
    updatePriceDisplay();
}

// Initialize filter expansion (show/hide)
function initFilterExpansion() {
    const expandButtons = document.querySelectorAll('.filter-expand');
    
    expandButtons.forEach(button => {
        const targetId = button.dataset.target;
        const target = document.getElementById(targetId);
        
        if (!target) return;
        
        // Set initial state
        const isExpanded = localStorage.getItem(`filter_${targetId}_expanded`) === 'true';
        if (isExpanded) {
            target.style.maxHeight = target.scrollHeight + 'px';
            button.classList.add('active');
        } else {
            target.style.maxHeight = '0';
        }
        
        button.addEventListener('click', () => {
            const isCurrentlyExpanded = target.style.maxHeight && target.style.maxHeight !== '0px';
            
            if (isCurrentlyExpanded) {
                target.style.maxHeight = '0';
                button.classList.remove('active');
                localStorage.setItem(`filter_${targetId}_expanded`, 'false');
            } else {
                target.style.maxHeight = target.scrollHeight + 'px';
                button.classList.add('active');
                localStorage.setItem(`filter_${targetId}_expanded`, 'true');
            }
        });
    });
}

// Get current filters from UI
function getCurrentFilters() {
    // Update from UI elements
    updateCheckboxFilter('transmission');
    updateCheckboxFilter('fuelType');
    updateCheckboxFilter('bodyType');
    updateCheckboxFilter('features');
    
    // Update location
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        currentFilters.location = locationFilter.value;
    }
    
    // Update search
    const searchInput = document.getElementById('carSearch');
    if (searchInput) {
        currentFilters.searchQuery = searchInput.value.trim();
    }
    
    return currentFilters;
}

// Apply filters
function applyFilters(filters = null, updateURL = true) {
    if (filters) {
        currentFilters = { ...currentFilters, ...filters };
    }
    
    // Filter cars
    if (typeof window.filteredCars !== 'undefined' && typeof window.allCars !== 'undefined') {
        window.filteredCars = filterCarsLogic(window.allCars, currentFilters);
        
        // Reset to first page
        if (typeof window.currentPage !== 'undefined') {
            window.currentPage = 1;
        }
        
        // Update display
        if (typeof window.displayCars === 'function') {
            window.displayCars();
        }
        
        // Update results count
        if (typeof window.updateResultsCount === 'function') {
            window.updateResultsCount();
        }
        
        // Update brand sections
        if (typeof window.createBrandSections === 'function') {
            window.createBrandSections();
        }
        
        // Update URL
        if (updateURL) {
            updateURLParams();
        }
        
        // Save filters
        saveFilters();
        
        // Close mobile sidebar if open
        const filtersSidebar = document.getElementById('filtersSidebar');
        if (filtersSidebar && filtersSidebar.classList.contains('active')) {
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Show toast notification
        showToast(`Found ${window.filteredCars.length} cars matching your filters`, 'success');
    }
}

// Filter cars logic
function filterCarsLogic(cars, filters) {
    return cars.filter(car => {
        // Price filter
        if (car.price < filters.minPrice || car.price > filters.maxPrice) {
            return false;
        }
        
        // Brand filter
        if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) {
            return false;
        }
        
        // Year filter
        if (car.year < filters.minYear || car.year > filters.maxYear) {
            return false;
        }
        
        // Transmission filter
        if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) {
            return false;
        }
        
        // Fuel type filter
        if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
            return false;
        }
        
        // Body type filter
        if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(car.bodyType)) {
            return false;
        }
        
        // Features filter
        if (filters.features.length > 0) {
            const carFeatures = car.features || [];
            if (!filters.features.every(feature => carFeatures.includes(feature))) {
                return false;
            }
        }
        
        // Location filter
        if (filters.location !== 'all' && car.location !== filters.location) {
            return false;
        }
        
        // Search filter
        if (filters.searchQuery) {
            const searchTerm = filters.searchQuery.toLowerCase();
            const searchableText = `
                ${car.make} ${car.model} ${car.year} 
                ${car.description} ${car.features?.join(' ')} ${car.location}
            `.toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

// Clear all filters
function clearAllFilters() {
    // Reset price
    currentFilters.minPrice = 500000;
    currentFilters.maxPrice = 50000000;
    
    // Reset year
    currentFilters.minYear = 2010;
    currentFilters.maxYear = 2024;
    
    // Reset arrays
    currentFilters.brands = [];
    currentFilters.transmissions = ['Automatic'];
    currentFilters.fuelTypes = ['Petrol', 'Diesel'];
    currentFilters.bodyTypes = ['SUV', 'Sedan'];
    currentFilters.features = [];
    currentFilters.location = 'all';
    currentFilters.searchQuery = '';
    
    // Reset UI elements
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minYearInput = document.getElementById('minYear');
    const maxYearInput = document.getElementById('maxYear');
    const locationFilter = document.getElementById('locationFilter');
    const searchInput = document.getElementById('carSearch');
    
    if (priceSliderMin) priceSliderMin.value = 500000;
    if (priceSliderMax) priceSliderMax.value = 50000000;
    if (minPriceInput) minPriceInput.value = 500000;
    if (maxPriceInput) maxPriceInput.value = 50000000;
    if (minYearInput) minYearInput.value = 2010;
    if (maxYearInput) maxYearInput.value = 2024;
    if (locationFilter) locationFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    // Reset checkboxes
    resetCheckboxGroup('transmission', ['Automatic']);
    resetCheckboxGroup('fuelType', ['Petrol', 'Diesel']);
    resetCheckboxGroup('bodyType', ['SUV', 'Sedan']);
    resetCheckboxGroup('features', []);
    
    // Reset brand filter
    document.querySelectorAll('.brand-filter-item').forEach(item => {
        item.classList.remove('selected');
    });
    const allBrandsItem = document.querySelector('.brand-filter-item[data-brand="all"]');
    if (allBrandsItem) {
        allBrandsItem.classList.add('selected');
    }
    
    // Clear URL parameters
    clearURLParams();
    
    // Apply cleared filters
    applyFilters(currentFilters, false);
    
    // Show toast
    showToast('All filters cleared', 'info');
}

// Reset checkbox group
function resetCheckboxGroup(name, defaultValues) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = defaultValues.includes(checkbox.value);
    });
}

// Clear specific filter functions (for active filter tags)
function clearPriceFilter() {
    currentFilters.minPrice = 500000;
    currentFilters.maxPrice = 50000000;
    
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceSliderMin) priceSliderMin.value = 500000;
    if (priceSliderMax) priceSliderMax.value = 50000000;
    if (minPriceInput) minPriceInput.value = 500000;
    if (maxPriceInput) maxPriceInput.value = 50000000;
    
    applyFilters(currentFilters);
}

function clearBrandFilter(brand) {
    const brandItem = document.querySelector(`.brand-filter-item[data-brand="${brand.toLowerCase()}"]`);
    if (brandItem) {
        brandItem.classList.remove('selected');
        
        // Check if any brands are selected
        const selectedBrands = document.querySelectorAll('.brand-filter-item.selected:not([data-brand="all"])');
        if (selectedBrands.length === 0) {
            const allBrandsItem = document.querySelector('.brand-filter-item[data-brand="all"]');
            if (allBrandsItem) {
                allBrandsItem.classList.add('selected');
            }
        }
        
        currentFilters.brands = currentFilters.brands.filter(b => b !== brand);
        applyFilters(currentFilters);
    }
}

function clearTransmissionFilter(transmission) {
    const checkbox = document.querySelector(`input[name="transmission"][value="${transmission}"]`);
    if (checkbox) {
        checkbox.checked = false;
        updateCheckboxFilter('transmission');
        applyFilters(currentFilters);
    }
}

function clearFuelFilter(fuel) {
    const checkbox = document.querySelector(`input[name="fuelType"][value="${fuel}"]`);
    if (checkbox) {
        checkbox.checked = false;
        updateCheckboxFilter('fuelType');
        applyFilters(currentFilters);
    }
}

// Update URL parameters
function updateURLParams() {
    const params = new URLSearchParams();
    
    // Add non-default values
    if (currentFilters.minPrice > 500000) params.set('minPrice', currentFilters.minPrice);
    if (currentFilters.maxPrice < 50000000) params.set('maxPrice', currentFilters.maxPrice);
    if (currentFilters.brands.length > 0) params.set('brands', currentFilters.brands.join(','));
    if (currentFilters.minYear > 2010) params.set('minYear', currentFilters.minYear);
    if (currentFilters.maxYear < 2024) params.set('maxYear', currentFilters.maxYear);
    if (currentFilters.transmissions.length !== 4) params.set('transmissions', currentFilters.transmissions.join(','));
    if (currentFilters.fuelTypes.length !== 5) params.set('fuelTypes', currentFilters.fuelTypes.join(','));
    if (currentFilters.bodyTypes.length !== 5) params.set('bodyTypes', currentFilters.bodyTypes.join(','));
    if (currentFilters.features.length > 0) params.set('features', currentFilters.features.join(','));
    if (currentFilters.location !== 'all') params.set('location', currentFilters.location);
    if (currentFilters.searchQuery) params.set('search', currentFilters.searchQuery);
    
    // Update URL without reloading page
    const newURL = params.toString() ? `cars.html?${params.toString()}` : 'cars.html';
    window.history.replaceState({}, '', newURL);
}

// Clear URL parameters
function clearURLParams() {
    window.history.replaceState({}, '', 'cars.html');
}

// Save filters to localStorage
function saveFilters() {
    try {
        localStorage.setItem('carFilters', JSON.stringify(currentFilters));
    } catch (e) {
        console.error('Error saving filters:', e);
    }
}

// Load saved filters from localStorage
function loadSavedFilters() {
    try {
        const saved = localStorage.getItem('carFilters');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Merge with current filters
            currentFilters = { ...currentFilters, ...parsed };
            
            // Update UI elements
            updateUIFromFilters();
        }
    } catch (e) {
        console.error('Error loading filters:', e);
    }
}

// Update UI from saved filters
function updateUIFromFilters() {
    // Price
    const priceSliderMin = document.getElementById('priceSliderMin');
    const priceSliderMax = document.getElementById('priceSliderMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceSliderMin) priceSliderMin.value = currentFilters.minPrice;
    if (priceSliderMax) priceSliderMax.value = currentFilters.maxPrice;
    if (minPriceInput) minPriceInput.value = currentFilters.minPrice;
    if (maxPriceInput) maxPriceInput.value = currentFilters.maxPrice;
    
    // Year
    const minYearInput = document.getElementById('minYear');
    const maxYearInput = document.getElementById('maxYear');
    if (minYearInput) minYearInput.value = currentFilters.minYear;
    if (maxYearInput) maxYearInput.value = currentFilters.maxYear;
    
    // Location
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) locationFilter.value = currentFilters.location;
    
    // Checkboxes
    updateCheckboxUI('transmission', currentFilters.transmissions);
    updateCheckboxUI('fuelType', currentFilters.fuelTypes);
    updateCheckboxUI('bodyType', currentFilters.bodyTypes);
    updateCheckboxUI('features', currentFilters.features);
    
    // Brand filter
    if (currentFilters.brands.length > 0) {
        // Deselect "All Brands"
        const allBrandsItem = document.querySelector('.brand-filter-item[data-brand="all"]');
        if (allBrandsItem) {
            allBrandsItem.classList.remove('selected');
        }
        
        // Select specific brands
        currentFilters.brands.forEach(brand => {
            const brandItem = document.querySelector(`.brand-filter-item[data-brand="${brand.toLowerCase()}"]`);
            if (brandItem) {
                brandItem.classList.add('selected');
            }
        });
    }
    
    // Update price display
    const priceRangeValue = document.getElementById('priceRangeValue');
    if (priceRangeValue) {
        priceRangeValue.textContent = `${formatPrice(currentFilters.minPrice)} - ${formatPrice(currentFilters.maxPrice)}`;
    }
}

// Update checkbox UI state
function updateCheckboxUI(name, values) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = values.includes(checkbox.value);
    });
}

// Update filter count display
function updateFilterCount() {
    const mobileFilterCount = document.getElementById('mobileFilterCount');
    if (!mobileFilterCount) return;
    
    // Count active filters (excluding defaults)
    let count = 0;
    
    if (currentFilters.minPrice > 500000 || currentFilters.maxPrice < 50000000) count++;
    if (currentFilters.brands.length > 0) count += currentFilters.brands.length;
    if (currentFilters.minYear > 2010 || currentFilters.maxYear < 2024) count++;
    if (currentFilters.transmissions.length !== 4) count += currentFilters.transmissions.length;
    if (currentFilters.fuelTypes.length !== 5) count += currentFilters.fuelTypes.length;
    if (currentFilters.bodyTypes.length !== 5) count += currentFilters.bodyTypes.length;
    if (currentFilters.features.length > 0) count += currentFilters.features.length;
    if (currentFilters.location !== 'all') count++;
    if (currentFilters.searchQuery) count++;
    
    mobileFilterCount.textContent = count;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFilterControls,
        initPriceSlider,
        applyFilters,
        clearAllFilters,
        clearPriceFilter,
        clearBrandFilter,
        clearTransmissionFilter,
        clearFuelFilter,
        getCurrentFilters,
        updateFilterCount
    };
}

// Make functions available globally for use in other files
window.applyFilters = applyFilters;
window.clearAllFilters = clearAllFilters;
window.clearPriceFilter = clearPriceFilter;
window.clearBrandFilter = clearBrandFilter;
window.clearTransmissionFilter = clearTransmissionFilter;
window.clearFuelFilter = clearFuelFilter;
window.getCurrentFilters = getCurrentFilters;