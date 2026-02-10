// ============================================
// AUTO LUXE KENYA - VIDEOS PAGE FUNCTIONALITY
// Handles video hub functionality including categories, playback, and submission
// ============================================

// Global variables
let currentVideoCategory = 'all';
let currentVideoSort = 'latest';
let currentVideoPage = 1;
const VIDEOS_PER_PAGE = 12;
let allVideos = [];
let filteredVideos = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadVideosData();
    initVideoCategories();
    initVideoSorting();
    initVideoSubmissionForm();
    initVideoModal();
    
    // Check URL for video parameter
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    if (videoId) {
        setTimeout(() => openVideoModal(videoId), 500);
    }
});

// Load videos data
function loadVideosData() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;
    
    try {
        // Use videosData from videosData.js
        allVideos = videosData;
        filteredVideos = [...allVideos];
        
        // Apply URL parameters if any
        applyVideoURLParams();
        
        // Display videos
        displayVideos();
        
    } catch (error) {
        console.error('Error loading videos:', error);
        videosGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error Loading Videos</h3>
                <p>Please try refreshing the page</p>
                <button class="btn-secondary" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    <span>Refresh Page</span>
                </button>
            </div>
        `;
    }
}

// Initialize video categories
function initVideoCategories() {
    const categoriesTabs = document.getElementById('categoriesTabs');
    if (!categoriesTabs) return;
    
    // Add click events to category tabs
    const categoryTabs = categoriesTabs.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update category
            currentVideoCategory = this.dataset.category;
            currentVideoPage = 1;
            
            // Filter videos
            filterVideosByCategory();
            
            // Update URL
            updateVideoURL();
            
            // Scroll to videos section
            document.querySelector('.videos-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Initialize from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const categoryTab = categoriesTabs.querySelector(`[data-category="${categoryParam}"]`);
        if (categoryTab) {
            categoryTab.click();
        }
    }
}

// Initialize video sorting
function initVideoSorting() {
    const sortSelect = document.getElementById('sortVideos');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        currentVideoSort = this.value;
        sortVideos();
        displayVideos();
    });
    
    // Initialize from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');
    if (sortParam) {
        sortSelect.value = sortParam;
        currentVideoSort = sortParam;
    }
}

// Initialize video submission form
function initVideoSubmissionForm() {
    const openFormBtn = document.getElementById('openVideoForm');
    const closeFormBtn = document.getElementById('closeVideoForm');
    const videoForm = document.getElementById('videoForm');
    const submissionSection = document.getElementById('videoSubmission');
    
    if (!openFormBtn || !videoForm) return;
    
    // Open form
    openFormBtn.addEventListener('click', function() {
        submissionSection.classList.add('active');
        submissionSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
    
    // Close form
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', function() {
            submissionSection.classList.remove('active');
            videoForm.reset();
        });
    }
    
    // Handle form submission
    videoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateVideoForm()) {
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);
        
        // Simulate form submission
        setTimeout(() => {
            setButtonLoading(submitBtn, false);
            
            // Get form data
            const formData = {
                title: document.getElementById('videoTitle').value,
                category: document.getElementById('videoCategory').value,
                description: document.getElementById('videoDescription').value,
                link: document.getElementById('videoLink').value,
                carModel: document.getElementById('carModel').value,
                name: document.getElementById('uploaderName').value,
                email: document.getElementById('uploaderEmail').value,
                tags: document.getElementById('videoTags').value.split(',').map(tag => tag.trim()),
                submittedAt: new Date().toISOString()
            };
            
            // Save submission to localStorage
            saveVideoSubmission(formData);
            
            // Show success message
            showToast('Video submitted successfully! We will review it shortly.', 'success');
            
            // Reset form
            videoForm.reset();
            
            // Close form section
            submissionSection.classList.remove('active');
            
        }, 2000);
    });
}

// Initialize video modal
function initVideoModal() {
    // Close modal when clicking overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeVideoModal();
        }
    });
    
    // Close modal when clicking close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || 
            e.target.closest('.modal-close')) {
            closeVideoModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

// Apply video URL parameters
function applyVideoURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Apply category
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentVideoCategory = categoryParam;
        
        // Update active tab
        const categoryTab = document.querySelector(`[data-category="${categoryParam}"]`);
        if (categoryTab) {
            categoryTab.click();
        }
    }
    
    // Apply sort
    const sortParam = urlParams.get('sort');
    if (sortParam) {
        currentVideoSort = sortParam;
        const sortSelect = document.getElementById('sortVideos');
        if (sortSelect) {
            sortSelect.value = sortParam;
        }
    }
}

// Display videos
function displayVideos() {
    const videosGrid = document.getElementById('videosGrid');
    const loadMoreBtn = document.getElementById('loadMoreVideos');
    
    if (!videosGrid) return;
    
    // Calculate videos to show
    const startIndex = (currentVideoPage - 1) * VIDEOS_PER_PAGE;
    const endIndex = startIndex + VIDEOS_PER_PAGE;
    const videosToShow = filteredVideos.slice(startIndex, endIndex);
    
    // Clear grid
    videosGrid.innerHTML = '';
    
    if (videosToShow.length === 0) {
        videosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video-slash"></i>
                <h3>No Videos Found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
        return;
    }
    
    // Add videos to grid
    videosToShow.forEach(video => {
        const videoCard = createVideoCard(video);
        videosGrid.appendChild(videoCard);
    });
    
    // Show/hide load more button
    if (loadMoreBtn) {
        if (endIndex < filteredVideos.length) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.onclick = loadMoreVideos;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Create video card
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.videoId = video.id;
    
    // Get car details if referenced
    const carDetails = getVideoCarDetails(video);
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="assets/images/videos/${video.thumbnail}" 
                 alt="${video.title}" 
                 loading="lazy">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
            <div class="video-duration">${video.duration}</div>
        </div>
        <div class="video-content">
            <div class="video-header">
                <h3>${video.title}</h3>
                <div class="video-meta">
                    <div class="video-stats">
                        <span class="video-stat">
                            <i class="fas fa-eye"></i>
                            ${formatViewCount(video.views)}
                        </span>
                        <span class="video-stat">
                            <i class="fas fa-calendar"></i>
                            ${formatUploadDate(video.uploadDate)}
                        </span>
                    </div>
                    <div class="video-category">
                        <span class="video-category-badge">${video.category}</span>
                    </div>
                </div>
            </div>
            <p class="video-description">${video.description}</p>
            ${carDetails ? `
                <div class="video-car-info">
                    <i class="fas fa-car"></i>
                    <span>${carDetails.year} ${carDetails.make} ${carDetails.model}</span>
                </div>
            ` : ''}
            <div class="video-tags">
                ${video.tags.map(tag => `<span class="video-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Add click event to open modal
    card.addEventListener('click', () => {
        openVideoModal(video.id);
    });
    
    return card;
}

// Filter videos by category
function filterVideosByCategory() {
    if (currentVideoCategory === 'all') {
        filteredVideos = [...allVideos];
    } else {
        filteredVideos = allVideos.filter(video => video.category === currentVideoCategory);
    }
    
    // Sort videos
    sortVideos();
    
    // Reset to first page
    currentVideoPage = 1;
    
    // Display videos
    displayVideos();
}

// Sort videos
function sortVideos() {
    filteredVideos = sortVideos(filteredVideos, currentVideoSort);
}

// Load more videos
function loadMoreVideos() {
    currentVideoPage++;
    displayVideos();
    
    // Scroll to newly loaded videos
    const videosGrid = document.getElementById('videosGrid');
    const lastVideo = videosGrid.lastElementChild;
    if (lastVideo) {
        lastVideo.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// Open video modal
function openVideoModal(videoId) {
    const video = getVideoById(videoId);
    if (!video) {
        showToast('Video not found', 'error');
        return;
    }
    
    // Get or create modal container
    let modalOverlay = document.getElementById('videoModalOverlay');
    let modalContainer = document.getElementById('videoModal');
    
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'videoModalOverlay';
        document.body.appendChild(modalOverlay);
    }
    
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container video-modal';
        modalContainer.id = 'videoModal';
        modalOverlay.appendChild(modalContainer);
    }
    
    // Create modal HTML
    modalContainer.innerHTML = createVideoModalHTML(video);
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize modal functionality
    initVideoModalFunctionality(video);
    
    // Update URL
    updateVideoModalURL(videoId);
    
    // Track view
    trackVideoView(videoId);
}

// Create video modal HTML
function createVideoModalHTML(video) {
    const carDetails = getVideoCarDetails(video);
    
    return `
        <div class="video-modal-header">
            <h2>${video.title}</h2>
            <div class="video-modal-actions">
                <button class="btn-secondary" onclick="downloadVideo('${video.id}')">
                    <i class="fas fa-download"></i>
                    <span>Download</span>
                </button>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="video-modal-body">
            <!-- Video Player -->
            <div class="video-player-container">
                <iframe src="${video.videoUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
            
            <!-- Video Sidebar -->
            <div class="video-sidebar">
                <!-- Related Videos -->
                <div class="related-videos-section">
                    <h3>Related Videos</h3>
                    <div class="related-videos" id="relatedVideos">
                        <!-- Related videos will be loaded dynamically -->
                    </div>
                </div>
                
                <!-- Video Info -->
                <div class="video-info-sidebar">
                    <h3>Video Details</h3>
                    <ul class="video-details-list">
                        <li>
                            <strong>Category:</strong>
                            <span>${video.category}</span>
                        </li>
                        <li>
                            <strong>Uploader:</strong>
                            <span>${video.uploader}</span>
                        </li>
                        <li>
                            <strong>Upload Date:</strong>
                            <span>${new Date(video.uploadDate).toLocaleDateString()}</span>
                        </li>
                        <li>
                            <strong>Duration:</strong>
                            <span>${video.duration}</span>
                        </li>
                        <li>
                            <strong>Views:</strong>
                            <span>${video.views}</span>
                        </li>
                        <li>
                            <strong>Likes:</strong>
                            <span>${video.likes}</span>
                        </li>
                    </ul>
                    
                    ${carDetails ? `
                        <div class="video-car-details">
                            <h4>Featured Car</h4>
                            <p>${carDetails.year} ${carDetails.make} ${carDetails.model}</p>
                            <a href="cars.html?car=${video.carReference}" class="btn-secondary">
                                <i class="fas fa-car"></i>
                                <span>View Car Details</span>
                            </a>
                        </div>
                    ` : ''}
                    
                    <!-- Share Options -->
                    <div class="video-share-options">
                        <button class="share-btn" onclick="shareVideo('${video.id}')">
                            <i class="fas fa-share-alt"></i>
                            <span>Share</span>
                        </button>
                        <button class="share-btn" onclick="copyVideoLink('${video.id}')">
                            <i class="fas fa-link"></i>
                            <span>Copy Link</span>
                        </button>
                        <button class="share-btn" onclick="reportVideo('${video.id}')">
                            <i class="fas fa-flag"></i>
                            <span>Report</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize video modal functionality
function initVideoModalFunctionality(video) {
    // Load related videos
    loadRelatedVideos(video.id);
    
    // Initialize video player
    initVideoPlayer();
    
    // Add keyboard shortcuts for video control
    document.addEventListener('keydown', function(e) {
        const iframe = document.querySelector('.video-player-container iframe');
        if (!iframe) return;
        
        // Space bar to play/pause
        if (e.key === ' ' && document.activeElement !== iframe) {
            e.preventDefault();
            toggleVideoPlayback(iframe);
        }
        
        // F key for fullscreen
        if (e.key === 'f') {
            toggleFullscreen(iframe);
        }
        
        // M key for mute
        if (e.key === 'm') {
            toggleMute(iframe);
        }
    });
}

// Load related videos
function loadRelatedVideos(videoId) {
    const relatedVideosContainer = document.getElementById('relatedVideos');
    if (!relatedVideosContainer) return;
    
    const relatedVideos = getRelatedVideos(videoId, 3);
    
    if (relatedVideos.length === 0) {
        relatedVideosContainer.innerHTML = `
            <div class="no-related-videos">
                <p>No related videos found</p>
            </div>
        `;
        return;
    }
    
    relatedVideosContainer.innerHTML = relatedVideos.map(video => `
        <div class="related-video" onclick="openVideoModal('${video.id}')">
            <div class="related-video-thumbnail">
                <img src="assets/images/videos/${video.thumbnail}" alt="${video.title}">
                <div class="related-video-duration">${video.duration}</div>
            </div>
            <div class="related-video-info">
                <h4>${video.title}</h4>
                <p>${video.uploader} • ${formatViewCount(video.views)}</p>
            </div>
        </div>
    `).join('');
}

// Initialize video player
function initVideoPlayer() {
    // Add player controls
    const playerContainer = document.querySelector('.video-player-container');
    if (!playerContainer) return;
    
    // Create custom controls
    const controlsHTML = `
        <div class="video-controls">
            <button class="control-btn play-pause-btn">
                <i class="fas fa-play"></i>
            </button>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            <div class="time-display">00:00 / 00:00</div>
            <button class="control-btn volume-btn">
                <i class="fas fa-volume-up"></i>
            </button>
            <button class="control-btn fullscreen-btn">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    `;
    
    // Note: For YouTube/Vimeo iframes, custom controls require their API
    // This is a simplified implementation
}

// Toggle video playback
function toggleVideoPlayback(iframe) {
    // This would use the YouTube/Vimeo API
    // For now, just log
    console.log('Toggle playback');
}

// Toggle fullscreen
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Toggle mute
function toggleMute(iframe) {
    // This would use the YouTube/Vimeo API
    console.log('Toggle mute');
}

// Close video modal
function closeVideoModal() {
    const modalOverlay = document.getElementById('videoModalOverlay');
    if (!modalOverlay) return;
    
    // Hide modal
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear modal URL
    clearVideoModalURL();
}

// Update video URL
function updateVideoURL() {
    const url = new URL(window.location);
    
    if (currentVideoCategory !== 'all') {
        url.searchParams.set('category', currentVideoCategory);
    } else {
        url.searchParams.delete('category');
    }
    
    if (currentVideoSort !== 'latest') {
        url.searchParams.set('sort', currentVideoSort);
    } else {
        url.searchParams.delete('sort');
    }
    
    window.history.replaceState({}, '', url.toString());
}

// Update video modal URL
function updateVideoModalURL(videoId) {
    const url = new URL(window.location);
    url.searchParams.set('video', videoId);
    window.history.replaceState({}, '', url.toString());
}

// Clear video modal URL
function clearVideoModalURL() {
    const url = new URL(window.location);
    url.searchParams.delete('video');
    window.history.replaceState({}, '', url.toString());
}

// Validate video submission form
function validateVideoForm() {
    const title = document.getElementById('videoTitle').value.trim();
    const category = document.getElementById('videoCategory').value;
    const description = document.getElementById('videoDescription').value.trim();
    const link = document.getElementById('videoLink').value.trim();
    const name = document.getElementById('uploaderName').value.trim();
    const email = document.getElementById('uploaderEmail').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate required fields
    if (!title) {
        showToast('Please enter a video title', 'error');
        return false;
    }
    
    if (!category) {
        showToast('Please select a category', 'error');
        return false;
    }
    
    if (!description) {
        showToast('Please enter a description', 'error');
        return false;
    }
    
    if (!link) {
        showToast('Please enter a video link', 'error');
        return false;
    }
    
    // Validate video link (YouTube or Vimeo)
    if (!isValidVideoLink(link)) {
        showToast('Please enter a valid YouTube or Vimeo link', 'error');
        return false;
    }
    
    if (!name) {
        showToast('Please enter your name', 'error');
        return false;
    }
    
    if (!email) {
        showToast('Please enter your email', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the terms and conditions', 'error');
        return false;
    }
    
    return true;
}

// Validate video link
function isValidVideoLink(link) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    
    return youtubeRegex.test(link) || vimeoRegex.test(link);
}

// Save video submission
function saveVideoSubmission(formData) {
    let submissions = JSON.parse(localStorage.getItem('videoSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('videoSubmissions', JSON.stringify(submissions));
}

// Download video (placeholder)
function downloadVideo(videoId) {
    showToast('Download feature coming soon', 'info');
}

// Share video
function shareVideo(videoId) {
    const video = getVideoById(videoId);
    if (!video) return;
    
    const shareData = {
        title: video.title,
        text: `Watch "${video.title}" on AutoLuxe Kenya Video Hub`,
        url: `${window.location.origin}/videos.html?video=${videoId}`
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showToast('Video shared successfully', 'success'))
            .catch(err => {
                console.error('Error sharing:', err);
                copyVideoLink(videoId);
            });
    } else {
        copyVideoLink(videoId);
    }
}

// Copy video link
function copyVideoLink(videoId) {
    const video = getVideoById(videoId);
    if (!video) return;
    
    const videoUrl = `${window.location.origin}/videos.html?video=${videoId}`;
    
    copyToClipboard(videoUrl)
        .then(() => showToast('Video link copied to clipboard', 'success'))
        .catch(err => {
            console.error('Error copying:', err);
            showToast('Error copying link', 'error');
        });
}

// Report video
function reportVideo(videoId) {
    const video = getVideoById(videoId);
    if (!video) return;
    
    // Show report dialog
    const reportReason = prompt('Please enter the reason for reporting this video:');
    if (reportReason) {
        // Save report
        let reports = JSON.parse(localStorage.getItem('videoReports') || '[]');
        reports.push({
            videoId: videoId,
            reason: reportReason,
            reportedAt: new Date().toISOString(),
            reporter: localStorage.getItem('userEmail') || 'anonymous'
        });
        
        localStorage.setItem('videoReports', JSON.stringify(reports));
        
        showToast('Thank you for your report. We will review it shortly.', 'success');
    }
}

// Track video view
function trackVideoView(videoId) {
    // Store in localStorage for simple analytics
    let videoViews = JSON.parse(localStorage.getItem('videoViews') || '[]');
    
    // Check if already viewed today
    const today = new Date().toDateString();
    const existingView = videoViews.find(view => 
        view.videoId === videoId && 
        new Date(view.timestamp).toDateString() === today
    );
    
    if (!existingView) {
        videoViews.push({
            videoId: videoId,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        
        localStorage.setItem('videoViews', JSON.stringify(videoViews));
    }
}

// Get video statistics
function getVideoStatistics() {
    const videoViews = JSON.parse(localStorage.getItem('videoViews') || '[]');
    const videoSubmissions = JSON.parse(localStorage.getItem('videoSubmissions') || '[]');
    
    return {
        totalViews: videoViews.length,
        uniqueVideosViewed: [...new Set(videoViews.map(view => view.videoId))].length,
        totalSubmissions: videoSubmissions.length
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadVideosData,
        initVideoCategories,
        initVideoSorting,
        openVideoModal,
        closeVideoModal,
        filterVideosByCategory,
        validateVideoForm,
        shareVideo,
        getVideoStatistics
    };
}

// Make functions available globally
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.shareVideo = shareVideo;
window.copyVideoLink = copyVideoLink;
window.reportVideo = reportVideo;
window.downloadVideo = downloadVideo;