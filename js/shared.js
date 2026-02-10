// ============================================
// AUTO LUXE KENYA - SHARED FUNCTIONS
// Common functionality used across all pages
// ============================================

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const themeToggle = document.getElementById('themeToggle');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            toggleTheme();
            // Close mobile menu after theme change on mobile
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking outside
    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Sync theme toggle buttons
    if (themeToggle && mobileThemeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = toggleTheme();
            updateThemeToggleIcons(theme);
        });
    }
}

// Format currency (KES)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format price with K/M suffixes
function formatPrice(price) {
    if (price >= 1000000) {
        return `KES ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
        return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price}`;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Show notification toast
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to body
    document.body.appendChild(toast);

    // Add styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--light-color);
                border-radius: var(--radius-md);
                padding: var(--spacing-md) var(--spacing-lg);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--spacing-md);
                z-index: 9999;
                animation: slideIn 0.3s ease;
                max-width: 400px;
                border-left: 4px solid;
            }
            .toast-success {
                border-left-color: var(--success-color);
            }
            .toast-error {
                border-left-color: var(--danger-color);
            }
            .toast-warning {
                border-left-color: var(--warning-color);
            }
            .toast-info {
                border-left-color: var(--info-color);
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                flex: 1;
            }
            .toast-content i {
                font-size: 1.25rem;
            }
            .toast-success .toast-content i {
                color: var(--success-color);
            }
            .toast-error .toast-content i {
                color: var(--danger-color);
            }
            .toast-warning .toast-content i {
                color: var(--warning-color);
            }
            .toast-info .toast-content i {
                color: var(--info-color);
            }
            .toast-close {
                background: none;
                border: none;
                color: var(--gray-dark);
                cursor: pointer;
                padding: var(--spacing-xs);
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);

    // Add slideOut animation
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number (Kenya format)
function validatePhone(phone) {
    const re = /^(\+?254|0)?[7]\d{8}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// Format phone number for display
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9 && cleaned.startsWith('7')) {
        return `0${cleaned}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('254')) {
        return `0${cleaned.slice(3)}`;
    }
    return phone;
}

// Generate WhatsApp message URL
function generateWhatsAppUrl(phone, message) {
    const formattedPhone = phone.replace(/\D/g, '');
    const phoneWithCountryCode = formattedPhone.startsWith('254') ? formattedPhone : `254${formattedPhone.slice(1)}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`;
}

// Generate SMS URL
function generateSmsUrl(phone, message) {
    const formattedPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `sms:${formattedPhone}&body=${encodedMessage}`;
}

// Generate call URL
function generateCallUrl(phone) {
    const formattedPhone = phone.replace(/\D/g, '');
    return `tel:${formattedPhone}`;
}

// Generate mail URL
function generateMailUrl(email, subject = '', body = '') {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

// Load image with fallback
function loadImageWithFallback(imgElement, src, fallbackSrc) {
    imgElement.src = src;
    imgElement.onerror = () => {
        imgElement.src = fallbackSrc;
    };
}

// Lazy load images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Add loading state to button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
    } else {
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
        button.disabled = false;
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(resolve).catch(reject);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('Copy failed'));
                }
            } catch (err) {
                document.body.removeChild(textArea);
                reject(err);
            }
        }
    });
}

// Get URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    
    return params;
}

// Set URL parameter
function setUrlParam(key, value) {
    const url = new URL(window.location);
    if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key);
    } else {
        url.searchParams.set(key, value);
    }
    window.history.replaceState({}, '', url);
}

// Remove URL parameter
function removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
}

// Get browser location (with permission)
function getLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
}

// Calculate distance between two coordinates (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Format distance
function formatDistance(distanceKm) {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
}

// Detect mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detect touch device
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Prevent pull-to-refresh on mobile
function preventPullToRefresh() {
    if (isTouchDevice()) {
        let lastTouchY = 0;
        const touchStartHandler = (e) => {
            if (e.touches.length === 1) {
                lastTouchY = e.touches[0].clientY;
            }
        };
        
        const touchMoveHandler = (e) => {
            const touchY = e.touches[0].clientY;
            const touchYDelta = touchY - lastTouchY;
            lastTouchY = touchY;
            
            // If the user is scrolling up at the top of the page, prevent default
            if (touchYDelta > 0 && window.scrollY === 0) {
                e.preventDefault();
            }
        };
        
        document.addEventListener('touchstart', touchStartHandler, { passive: false });
        document.addEventListener('touchmove', touchMoveHandler, { passive: false });
        
        return () => {
            document.removeEventListener('touchstart', touchStartHandler);
            document.removeEventListener('touchmove', touchMoveHandler);
        };
    }
}

// Add swipe detection
function addSwipeDetection(element, callback) {
    let startX, startY, endX, endY;
    const minSwipeDistance = 50;
    
    element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    element.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only consider horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left
                callback('left');
            } else {
                // Swipe right
                callback('right');
            }
        }
    }, { passive: true });
}

// Initialize all shared functionality
function initShared() {
    initMobileMenu();
    initLazyLoading();
    preventPullToRefresh();
    
    // Add escape key handler for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-overlay.active');
            openModals.forEach(modal => {
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.click();
            });
        }
    });
    
    // Add click outside to close modals
    document.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal-overlay.active');
        modals.forEach(modal => {
            if (e.target === modal) {
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.click();
            }
        });
    });
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        formatCurrency,
        formatPrice,
        debounce,
        throttle,
        showToast,
        validateEmail,
        validatePhone,
        formatPhone,
        generateWhatsAppUrl,
        generateSmsUrl,
        generateCallUrl,
        generateMailUrl,
        loadImageWithFallback,
        initLazyLoading,
        setButtonLoading,
        copyToClipboard,
        getUrlParams,
        setUrlParam,
        removeUrlParam,
        getLocation,
        calculateDistance,
        formatDistance,
        isMobile,
        isTouchDevice,
        preventPullToRefresh,
        addSwipeDetection,
        initShared
    };
} else {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initShared);
}