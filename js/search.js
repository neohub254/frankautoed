// ============================================
// AUTO LUXE KENYA - SEARCH FUNCTIONALITY
// Handles real-time search with autocomplete and suggestions
// ============================================

// Global variables
let searchHistory = [];
let currentSearchQuery = '';
let searchTimeout = null;
const MAX_HISTORY_ITEMS = 10;
const SEARCH_DELAY = 300;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    loadSearchHistory();
    
    // Initialize quick search on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initHomepageSearch();
    }
});

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('carSearch');
    const searchClear = document.getElementById('searchClear');
    const searchBtn = document.querySelector('.search-btn');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchInput) return;
    
    // Load search history from localStorage
    loadSearchHistory();
    
    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
        if (this.value.trim()) {
            searchClear.classList.add('active');
            performSearch(this.value);
        } else {
            searchClear.classList.remove('active');
            clearSearch();
        }
    });
    
    // Handle Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value, true);
        }
    });
    
    // Clear search
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchClear.classList.remove('active');
            clearSearch();
            searchInput.focus();
        });
    }
    
    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value, true);
        });
    }
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (suggestionsContainer && !searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.remove('active');
        }
    });
    
    // Handle search input focus
    searchInput.addEventListener('focus', function() {
        if (this.value.trim() || searchHistory.length > 0) {
            showSearchSuggestions(this.value);
        }
    });
    
    // Handle search input blur
    searchInput.addEventListener('blur', function() {
        // Delay hiding suggestions to allow click on suggestions
        setTimeout(() => {
            if (suggestionsContainer && suggestionsContainer.classList.contains('active')) {
                suggestionsContainer.classList.remove('active');
            }
        }, 200);
    });
    
    // Initialize search from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchInput.value = decodeURIComponent(searchParam);
        performSearch(decodeURIComponent(searchParam), false);
    }
}

// Initialize homepage search
function initHomepageSearch() {
    const quickSearchInput = document.getElementById('quickSearch');
    const quickSearchBtn = document.querySelector('.quick-search .btn-primary');
    
    if (!quickSearchInput || !quickSearchBtn) return;
    
    // Redirect to cars page with search query
    quickSearchBtn.addEventListener('click', function() {
        const query = quickSearchInput.value.trim();
        if (query) {
            addToSearchHistory(query);
            window.location.href = `cars.html?search=${encodeURIComponent(query)}`;
        } else {
            window.location.href = 'cars.html';
        }
    });
    
    // Allow Enter key to trigger search
    quickSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            quickSearchBtn.click();
        }
    });
    
    // Add autocomplete suggestions
    quickSearchInput.addEventListener('input', debounce(function() {
        showHomepageSearchSuggestions(this.value);
    }, SEARCH_DELAY));
}

// Perform search with debouncing
function performSearch(query, immediate = false) {
    currentSearchQuery = query.trim();
    
    // Clear existing timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    if (!immediate) {
        // Debounced search for real-time suggestions
        searchTimeout = setTimeout(() => {
            executeSearch(query);
        }, SEARCH_DELAY);
    } else {
        // Immediate search (on Enter or button click)
        executeSearch(query, true);
    }
}

// Execute the search
function executeSearch(query, saveToHistory = false) {
    if (!query.trim()) {
        clearSearch();
        return;
    }
    
    // Update search input value
    const searchInput = document.getElementById('carSearch');
    if (searchInput && searchInput.value !== query) {
        searchInput.value = query;
    }
    
    // Update current filters with search query
    if (typeof window.currentFilters !== 'undefined') {
        window.currentFilters.searchQuery = query;
        
        // Apply filters (which will trigger re-display of cars)
        if (typeof window.applyFilters === 'function') {
            window.applyFilters(window.currentFilters);
        }
    }
    
    // Save to history if requested
    if (saveToHistory) {
        addToSearchHistory(query);
    }
    
    // Update URL with search parameter
    updateSearchURL(query);
    
    // Show loading indicator
    showSearchLoading();
}

// Clear search
function clearSearch() {
    currentSearchQuery = '';
    
    // Clear search input
    const searchInput = document.getElementById('carSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Hide suggestions
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('active');
    }
    
    // Hide clear button
    const searchClear = document.getElementById('searchClear');
    if (searchClear) {
        searchClear.classList.remove('active');
    }
    
    // Update filters
    if (typeof window.currentFilters !== 'undefined') {
        window.currentFilters.searchQuery = '';
        
        // Apply filters
        if (typeof window.applyFilters === 'function') {
            window.applyFilters(window.currentFilters);
        }
    }
    
    // Update URL
    updateSearchURL('');
}

// Show search suggestions
function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    // Clear existing suggestions
    suggestionsContainer.innerHTML = '';
    
    // Get suggestions
    const suggestions = getSearchSuggestions(query);
    
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = `
            <div class="suggestion-item no-results">
                <i class="fas fa-search"></i>
                <span>No matches found</span>
            </div>
        `;
    } else {
        // Add suggestions to container
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.innerHTML = `
                <i class="fas ${suggestion.icon}"></i>
                <span>${suggestion.text}</span>
                ${suggestion.type ? `<span class="suggestion-type">${suggestion.type}</span>` : ''}
            `;
            
            suggestionItem.addEventListener('click', () => {
                selectSearchSuggestion(suggestion);
            });
            
            suggestionsContainer.appendChild(suggestionItem);
        });
        
        // Add search history if available
        if (query === '' && searchHistory.length > 0) {
            const historyHeader = document.createElement('div');
            historyHeader.className = 'suggestion-header';
            historyHeader.innerHTML = `
                <span>Recent Searches</span>
                <button class="clear-history-btn">Clear</button>
            `;
            suggestionsContainer.insertBefore(historyHeader, suggestionsContainer.firstChild);
            
            // Add clear history event
            historyHeader.querySelector('.clear-history-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                clearSearchHistory();
                showSearchSuggestions(query);
            });
            
            searchHistory.forEach(historyItem => {
                const historySuggestion = document.createElement('div');
                historySuggestion.className = 'suggestion-item history-item';
                historySuggestion.innerHTML = `
                    <i class="fas fa-history"></i>
                    <span>${historyItem}</span>
                    <button class="remove-history-btn">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                historySuggestion.addEventListener('click', (e) => {
                    if (!e.target.closest('.remove-history-btn')) {
                        selectSearchHistory(historyItem);
                    }
                });
                
                // Remove history item
                const removeBtn = historySuggestion.querySelector('.remove-history-btn');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromSearchHistory(historyItem);
                    showSearchSuggestions(query);
                });
                
                suggestionsContainer.appendChild(historySuggestion);
            });
        }
    }
    
    // Show suggestions container
    suggestionsContainer.classList.add('active');
}

// Show homepage search suggestions
function showHomepageSearchSuggestions(query) {
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
            car.year.toString().includes(query) ||
            car.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(car => ({
            text: `${car.year} ${car.make} ${car.model}`,
            value: car.id,
            price: car.price,
            location: car.location
        }));
    
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div class="suggestion-item">No matches found</div>';
    } else {
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-car-id="${suggestion.value}">
                <i class="fas fa-car"></i>
                <div class="suggestion-details">
                    <span class="suggestion-title">${suggestion.text}</span>
                    <span class="suggestion-meta">${formatPrice(suggestion.price)} • ${suggestion.location}</span>
                </div>
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

// Get search suggestions based on query
function getSearchSuggestions(query) {
    const suggestions = [];
    
    if (!query.trim()) {
        // Return popular searches if no query
        return [
            { text: 'BMW', type: 'Brand', icon: 'fa-car', action: 'filter' },
            { text: 'Mercedes', type: 'Brand', icon: 'fa-car', action: 'filter' },
            { text: 'Toyota Land Cruiser', type: 'Model', icon: 'fa-car', action: 'search' },
            { text: '2022', type: 'Year', icon: 'fa-calendar', action: 'filter' },
            { text: 'Automatic', type: 'Transmission', icon: 'fa-cog', action: 'filter' },
            { text: 'Nairobi', type: 'Location', icon: 'fa-map-marker', action: 'filter' }
        ];
    }
    
    const queryLower = query.toLowerCase();
    
    // Brand suggestions
    const brandSuggestions = allBrands.filter(brand => 
        brand.toLowerCase().includes(queryLower) && brand !== 'All Brands'
    ).slice(0, 3);
    
    brandSuggestions.forEach(brand => {
        suggestions.push({
            text: brand,
            type: 'Brand',
            icon: 'fa-car',
            action: 'filter',
            filterType: 'brand',
            filterValue: brand
        });
    });
    
    // Car model suggestions
    const modelSuggestions = carsData
        .filter(car => 
            car.model.toLowerCase().includes(queryLower) ||
            `${car.make} ${car.model}`.toLowerCase().includes(queryLower)
        )
        .slice(0, 3)
        .map(car => ({
            text: `${car.make} ${car.model}`,
            type: 'Model',
            icon: 'fa-car',
            action: 'search',
            searchValue: `${car.make} ${car.model}`
        }));
    
    suggestions.push(...modelSuggestions);
    
    // Year suggestions
    if (/^\d{4}$/.test(query)) {
        suggestions.push({
            text: `Cars from ${query}`,
            type: 'Year',
            icon: 'fa-calendar',
            action: 'filter',
            filterType: 'year',
            filterValue: query
        });
    }
    
    // Feature suggestions
    const featureSuggestions = allFeatures.filter(feature => 
        feature.toLowerCase().includes(queryLower)
    ).slice(0, 2);
    
    featureSuggestions.forEach(feature => {
        suggestions.push({
            text: feature,
            type: 'Feature',
            icon: 'fa-star',
            action: 'filter',
            filterType: 'feature',
            filterValue: feature
        });
    });
    
    // Location suggestions
    const locationSuggestions = allLocations.filter(location => 
        location.toLowerCase().includes(queryLower)
    ).slice(0, 2);
    
    locationSuggestions.forEach(location => {
        suggestions.push({
            text: location,
            type: 'Location',
            icon: 'fa-map-marker',
            action: 'filter',
            filterType: 'location',
            filterValue: location
        });
    });
    
    // If no specific suggestions, add general search
    if (suggestions.length === 0) {
        suggestions.push({
            text: `Search for "${query}"`,
            type: 'Search',
            icon: 'fa-search',
            action: 'search',
            searchValue: query
        });
    }
    
    return suggestions;
}

// Handle search suggestion selection
function selectSearchSuggestion(suggestion) {
    switch (suggestion.action) {
        case 'search':
            // Perform search
            performSearch(suggestion.searchValue || suggestion.text, true);
            break;
            
        case 'filter':
            // Apply specific filter
            applySearchFilter(suggestion.filterType, suggestion.filterValue);
            break;
            
        case 'history':
            // Select from history
            performSearch(suggestion.text, true);
            break;
    }
    
    // Hide suggestions
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('active');
    }
}

// Handle search history selection
function selectSearchHistory(query) {
    const searchInput = document.getElementById('carSearch');
    if (searchInput) {
        searchInput.value = query;
        performSearch(query, true);
    }
}

// Apply search filter
function applySearchFilter(filterType, filterValue) {
    if (typeof window.currentFilters === 'undefined') return;
    
    switch (filterType) {
        case 'brand':
            // Toggle brand filter
            const brandIndex = window.currentFilters.brands.indexOf(filterValue);
            if (brandIndex === -1) {
                window.currentFilters.brands.push(filterValue);
            } else {
                window.currentFilters.brands.splice(brandIndex, 1);
            }
            break;
            
        case 'year':
            // Set year filter
            const year = parseInt(filterValue);
            window.currentFilters.minYear = year;
            window.currentFilters.maxYear = year;
            break;
            
        case 'feature':
            // Toggle feature filter
            const featureIndex = window.currentFilters.features.indexOf(filterValue);
            if (featureIndex === -1) {
                window.currentFilters.features.push(filterValue);
            } else {
                window.currentFilters.features.splice(featureIndex, 1);
            }
            break;
            
        case 'location':
            // Set location filter
            window.currentFilters.location = filterValue;
            break;
    }
    
    // Apply filters
    if (typeof window.applyFilters === 'function') {
        window.applyFilters(window.currentFilters);
    }
    
    // Show toast notification
    showToast(`Filtered by ${filterType}: ${filterValue}`, 'success');
}

// Update URL with search parameter
function updateSearchURL(query) {
    const url = new URL(window.location);
    
    if (query.trim()) {
        url.searchParams.set('search', query);
    } else {
        url.searchParams.delete('search');
    }
    
    window.history.replaceState({}, '', url.toString());
}

// Show search loading indicator
function showSearchLoading() {
    const searchContainer = document.querySelector('.search-input-group');
    if (!searchContainer) return;
    
    // Remove existing loader
    const existingLoader = searchContainer.querySelector('.search-loader');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    // Create loader
    const loader = document.createElement('div');
    loader.className = 'search-loader';
    loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Insert after search input
    const searchInput = document.getElementById('carSearch');
    if (searchInput) {
        searchInput.parentNode.insertBefore(loader, searchInput.nextSibling);
    }
    
    // Remove loader after 1 second
    setTimeout(() => {
        if (loader.parentNode) {
            loader.remove();
        }
    }, 1000);
}

// Load search history from localStorage
function loadSearchHistory() {
    try {
        const savedHistory = localStorage.getItem('autoLuxeSearchHistory');
        if (savedHistory) {
            searchHistory = JSON.parse(savedHistory);
        }
    } catch (e) {
        console.error('Error loading search history:', e);
        searchHistory = [];
    }
}

// Save search history to localStorage
function saveSearchHistory() {
    try {
        localStorage.setItem('autoLuxeSearchHistory', JSON.stringify(searchHistory));
    } catch (e) {
        console.error('Error saving search history:', e);
    }
}

// Add query to search history
function addToSearchHistory(query) {
    if (!query.trim()) return;
    
    // Remove duplicates
    const index = searchHistory.indexOf(query);
    if (index !== -1) {
        searchHistory.splice(index, 1);
    }
    
    // Add to beginning
    searchHistory.unshift(query);
    
    // Limit history size
    if (searchHistory.length > MAX_HISTORY_ITEMS) {
        searchHistory.pop();
    }
    
    // Save to localStorage
    saveSearchHistory();
}

// Remove query from search history
function removeFromSearchHistory(query) {
    const index = searchHistory.indexOf(query);
    if (index !== -1) {
        searchHistory.splice(index, 1);
        saveSearchHistory();
    }
}

// Clear all search history
function clearSearchHistory() {
    searchHistory = [];
    saveSearchHistory();
    showToast('Search history cleared', 'info');
}

// Advanced search across multiple fields
function advancedSearch(query, fields = ['make', 'model', 'year', 'description', 'features']) {
    if (!query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    const results = [];
    
    carsData.forEach(car => {
        let score = 0;
        
        fields.forEach(field => {
            if (field === 'make' && car.make.toLowerCase().includes(queryLower)) {
                score += 3;
            }
            if (field === 'model' && car.model.toLowerCase().includes(queryLower)) {
                score += 2;
            }
            if (field === 'year' && car.year.toString().includes(query)) {
                score += 2;
            }
            if (field === 'description' && car.description.toLowerCase().includes(queryLower)) {
                score += 1;
            }
            if (field === 'features') {
                const featureMatch = car.features.some(feature => 
                    feature.toLowerCase().includes(queryLower)
                );
                if (featureMatch) score += 1;
            }
        });
        
        if (score > 0) {
            results.push({
                car: car,
                score: score,
                matches: {
                    make: car.make.toLowerCase().includes(queryLower),
                    model: car.model.toLowerCase().includes(queryLower),
                    year: car.year.toString().includes(query),
                    description: car.description.toLowerCase().includes(queryLower)
                }
            });
        }
    });
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    return results.map(result => result.car);
}

// Search across multiple terms
function multiTermSearch(terms) {
    if (!terms || terms.length === 0) return [];
    
    const results = carsData.filter(car => {
        return terms.every(term => {
            const termLower = term.toLowerCase();
            return (
                car.make.toLowerCase().includes(termLower) ||
                car.model.toLowerCase().includes(termLower) ||
                car.year.toString().includes(term) ||
                car.description.toLowerCase().includes(termLower) ||
                car.features.some(feature => feature.toLowerCase().includes(termLower))
            );
        });
    });
    
    return results;
}

// Parse search query into terms
function parseSearchQuery(query) {
    const terms = query
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 0)
        .map(term => term.replace(/[^a-z0-9]/g, ''));
    
    return terms;
}

// Smart search with query parsing
function smartSearch(query) {
    const terms = parseSearchQuery(query);
    
    if (terms.length === 0) return [];
    
    // Try exact match first
    const exactMatch = carsData.find(car => 
        `${car.make} ${car.model} ${car.year}`.toLowerCase() === query.toLowerCase()
    );
    
    if (exactMatch) {
        return [exactMatch];
    }
    
    // Try multi-term search
    const multiTermResults = multiTermSearch(terms);
    if (multiTermResults.length > 0) {
        return multiTermResults;
    }
    
    // Fall back to advanced search
    return advancedSearch(query);
}

// Update search results count
function updateSearchResultsCount(results) {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    const totalCars = carsData.length;
    const showingCars = results.length;
    
    if (showingCars === totalCars) {
        resultsCount.textContent = `Showing ${showingCars} luxury cars`;
    } else {
        resultsCount.textContent = `Showing ${showingCars} of ${totalCars} cars`;
        
        // Add search term to results count if available
        if (currentSearchQuery) {
            resultsCount.innerHTML += ` for "<strong>${currentSearchQuery}</strong>"`;
        }
    }
}

// Add search-specific styles
function addSearchStyles() {
    if (!document.querySelector('#search-styles')) {
        const style = document.createElement('style');
        style.id = 'search-styles';
        style.textContent = `
            .search-loader {
                position: absolute;
                right: 80px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--secondary-color);
                font-size: 1rem;
            }
            
            .suggestion-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-md);
                cursor: pointer;
                border-bottom: 1px solid var(--accent-color);
                transition: background-color var(--transition-fast);
            }
            
            .suggestion-item:hover {
                background-color: var(--accent-color);
            }
            
            .suggestion-item i {
                color: var(--gray-dark);
                width: 20px;
                text-align: center;
            }
            
            .suggestion-item .suggestion-details {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            
            .suggestion-title {
                font-weight: 500;
                color: var(--dark-color);
            }
            
            .suggestion-meta {
                font-size: 0.75rem;
                color: var(--gray-dark);
            }
            
            .suggestion-type {
                background: var(--primary-color);
                color: var(--light-color);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                font-weight: 600;
            }
            
            .suggestion-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md);
                border-bottom: 1px solid var(--accent-color);
                background: var(--gray-light);
            }
            
            .suggestion-header span {
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--gray-dark);
            }
            
            .clear-history-btn {
                background: none;
                border: none;
                color: var(--secondary-color);
                font-size: 0.75rem;
                cursor: pointer;
                padding: var(--spacing-xs) var(--spacing-sm);
            }
            
            .history-item {
                position: relative;
            }
            
            .remove-history-btn {
                position: absolute;
                right: var(--spacing-md);
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--gray-dark);
                cursor: pointer;
                padding: var(--spacing-xs);
                opacity: 0;
                transition: opacity var(--transition-fast);
            }
            
            .history-item:hover .remove-history-btn {
                opacity: 1;
            }
            
            .no-results {
                color: var(--gray-dark);
                font-style: italic;
            }
            
            /* Quick search suggestions */
            .quick-search .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--light-color);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                max-height: 300px;
                overflow-y: auto;
                margin-top: var(--spacing-xs);
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSearch,
        performSearch,
        clearSearch,
        advancedSearch,
        smartSearch,
        addToSearchHistory,
        clearSearchHistory,
        updateSearchResultsCount
    };
} else {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        addSearchStyles();
    });
}

// Make functions available globally for use in other files
window.performSearch = performSearch;
window.clearSearch = clearSearch;
window.smartSearch = smartSearch;