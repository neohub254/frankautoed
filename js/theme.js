// ============================================
// AUTO LUXE KENYA - THEME MANAGEMENT
// Handles dark/light mode switching and theme persistence
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initThemeToggleButtons();
});

// Initialize theme
function initTheme() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('autoLuxeTheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine which theme to use
    let theme = 'light'; // Default theme
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
        theme = savedTheme;
    } else if (systemPrefersDark) {
        theme = 'dark';
    }
    
    // Apply theme
    applyTheme(theme);
    
    // Update toggle button icons
    updateThemeToggleIcons(theme);
}

// Initialize theme toggle buttons
function initThemeToggleButtons() {
    // Desktop theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile theme toggle
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Sync both toggle buttons
    document.addEventListener('themeChanged', function(e) {
        updateThemeToggleIcons(e.detail.theme);
    });
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    saveThemePreference(newTheme);
    
    // Dispatch custom event
    const event = new CustomEvent('themeChanged', {
        detail: { theme: newTheme }
    });
    document.dispatchEvent(event);
    
    return newTheme;
}

// Apply theme
function applyTheme(theme) {
    // Set data-theme attribute on document element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    updateThemeColorMeta(theme);
    
    // Update iframe content if any
    updateIframeThemes(theme);
    
    // Update chart colors if any
    updateChartColors(theme);
    
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);
}

// Update theme-color meta tag
function updateThemeColorMeta(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    
    // Set color based on theme
    if (theme === 'dark') {
        metaThemeColor.content = '#1A1A1A'; // Dark background color
    } else {
        metaThemeColor.content = '#F5F5F5'; // Light background color
    }
}

// Update theme toggle icons
function updateThemeToggleIcons(theme) {
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    
    toggleButtons.forEach(button => {
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (theme === 'dark') {
            if (icon) icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Light Mode';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Dark Mode';
        }
    });
}

// Save theme preference to localStorage
function saveThemePreference(theme) {
    try {
        localStorage.setItem('autoLuxeTheme', theme);
    } catch (e) {
        console.error('Error saving theme preference:', e);
    }
}

// Update iframe themes (for embedded content)
function updateIframeThemes(theme) {
    // This would update any embedded content that supports theme switching
    // For example, Google Maps or embedded videos
    
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            // Send theme message to iframe if it supports it
            iframe.contentWindow.postMessage({
                type: 'themeChange',
                theme: theme
            }, '*');
        } catch (e) {
            // Silently fail if iframe doesn't support messaging
        }
    });
}

// Update chart colors (if using charts)
function updateChartColors(theme) {
    // This function would update chart colors if the site uses charts
    // For now, it's a placeholder
    
    const charts = document.querySelectorAll('[data-chart]');
    if (charts.length > 0) {
        // In a real implementation, you would update chart options here
        console.log(`Updating ${charts.length} chart(s) for ${theme} theme`);
    }
}

// Add theme transition styles
function addThemeTransitionStyles() {
    if (!document.querySelector('#theme-transition-styles')) {
        const style = document.createElement('style');
        style.id = 'theme-transition-styles';
        style.textContent = `
            .theme-transition *,
            .theme-transition *::before,
            .theme-transition *::after {
                transition: background-color 0.3s ease,
                            border-color 0.3s ease,
                            color 0.3s ease,
                            fill 0.3s ease,
                            stroke 0.3s ease;
            }
            
            /* Disable transitions for performance-critical elements */
            .theme-transition .car-image img,
            .theme-transition .video-thumbnail img,
            .theme-transition .hero {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Get current theme
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

// Check if dark mode is active
function isDarkMode() {
    return getCurrentTheme() === 'dark';
}

// Check if light mode is active
function isLightMode() {
    return getCurrentTheme() === 'light';
}

// Listen for system theme changes
function initSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't set a preference
        const savedTheme = localStorage.getItem('autoLuxeTheme');
        if (!savedTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateThemeToggleIcons(newTheme);
        }
    });
}

// Add theme-specific CSS variables
function addThemeCSSVariables() {
    if (!document.querySelector('#theme-variables')) {
        const style = document.createElement('style');
        style.id = 'theme-variables';
        style.textContent = `
            :root {
                /* Base colors that will be overridden by theme */
                --primary-color: #8B4513;
                --secondary-color: #C41E3A;
                --accent-color: #F5F5F5;
                --dark-color: #1A1A1A;
                --light-color: #FFFFFF;
                --gray-light: #F8F9FA;
                --gray-medium: #E9ECEF;
                --gray-dark: #6C757D;
            }
            
            [data-theme="dark"] {
                --primary-color: #A0522D;
                --secondary-color: #D22D4A;
                --accent-color: #2D2D2D;
                --dark-color: #F5F5F5;
                --light-color: #1A1A1A;
                --gray-light: #2D2D2D;
                --gray-medium: #3D3D3D;
                --gray-dark: #B0B0B0;
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                :root {
                    --primary-color: #8B0000;
                    --secondary-color: #FF0000;
                }
                
                [data-theme="dark"] {
                    --primary-color: #FF4500;
                    --secondary-color: #FF6347;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all theme functionality
function initThemeSystem() {
    addThemeCSSVariables();
    addThemeTransitionStyles();
    initTheme();
    initSystemThemeListener();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTheme,
        toggleTheme,
        getCurrentTheme,
        isDarkMode,
        isLightMode,
        initThemeSystem
    };
} else {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initThemeSystem);
}

// Make functions available globally
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;