// ============================================
// AUTO LUXE KENYA - VIDEOS DATABASE
// Contains sample video content for the video hub
// Easy to maintain: Add new videos by copying the template
// ============================================

const videosData = [
    {
        id: "video-001",
        title: "2022 BMW X5 Walkaround & Review",
        description: "Complete walkaround and detailed review of the 2022 BMW X5 xDrive40i. We cover all features, performance, and interior luxury.",
        category: "walkaround",
        duration: "12:45",
        views: "45,230",
        likes: "2,450",
        uploadDate: "2024-01-15",
        uploader: "AutoLuxe Kenya",
        thumbnail: "bmw-x5-walkaround.jpg",
        videoUrl: "https://www.youtube.com/embed/example1",
        tags: ["BMW", "X5", "SUV", "Luxury", "Walkaround", "Review"],
        carReference: "BMW-X5-2022-001",
        featured: true
    },
    {
        id: "video-002",
        title: "Mercedes GLE 450 Test Drive - Nairobi Roads",
        description: "Join us for an exciting test drive of the 2022 Mercedes GLE 450 4MATIC on Nairobi roads. Experience the comfort and performance.",
        category: "test-drive",
        duration: "18:30",
        views: "62,890",
        likes: "3,120",
        uploadDate: "2024-01-20",
        uploader: "AutoLuxe Kenya",
        thumbnail: "mercedes-gle-testdrive.jpg",
        videoUrl: "https://www.youtube.com/embed/example2",
        tags: ["Mercedes", "GLE", "Test Drive", "SUV", "Nairobi"],
        carReference: "MERCEDES-GLE-2022-001",
        featured: true
    },
    {
        id: "video-003",
        title: "Toyota Land Cruiser 300: Ultimate Off-Road Test",
        description: "We take the 2023 Toyota Land Cruiser 300 through rigorous off-road conditions. See its capabilities in action.",
        category: "test-drive",
        duration: "22:15",
        views: "89,450",
        likes: "4,850",
        uploadDate: "2024-01-25",
        uploader: "AutoLuxe Kenya",
        thumbnail: "toyota-lc300-offroad.jpg",
        videoUrl: "https://www.youtube.com/embed/example3",
        tags: ["Toyota", "Land Cruiser", "Off-Road", "4x4", "Adventure"],
        carReference: "TOYOTA-LC300-2023-001",
        featured: true
    },
    {
        id: "video-004",
        title: "Range Rover Velar Luxury Features Review",
        description: "Detailed look at the luxury features and technology in the 2022 Range Rover Velar P400.",
        category: "review",
        duration: "15:20",
        views: "38,760",
        likes: "2,100",
        uploadDate: "2024-01-28",
        uploader: "AutoLuxe Kenya",
        thumbnail: "range-velar-review.jpg",
        videoUrl: "https://www.youtube.com/embed/example4",
        tags: ["Range Rover", "Velar", "Luxury", "Review", "Features"],
        carReference: "RANGE-VELAR-2022-001",
        featured: false
    },
    {
        id: "video-005",
        title: "Porsche Cayenne S Performance Review",
        description: "Experience the performance and handling of the 2022 Porsche Cayenne S on both city and highway drives.",
        category: "review",
        duration: "20:45",
        views: "52,340",
        likes: "3,450",
        uploadDate: "2024-02-01",
        uploader: "AutoLuxe Kenya",
        thumbnail: "porsche-cayenne-review.jpg",
        videoUrl: "https://www.youtube.com/embed/example5",
        tags: ["Porsche", "Cayenne", "Performance", "Luxury SUV", "Review"],
        carReference: "PORSCHE-CAYENNE-2022-001",
        featured: true
    },
    {
        id: "video-006",
        title: "How to Maintain Your Luxury Car - Basic Tips",
        description: "Essential maintenance tips for luxury car owners in Kenya. Keep your vehicle in top condition.",
        category: "maintenance",
        duration: "25:30",
        views: "67,890",
        likes: "3,980",
        uploadDate: "2024-02-05",
        uploader: "AutoLuxe Kenya",
        thumbnail: "luxury-car-maintenance.jpg",
        videoUrl: "https://www.youtube.com/embed/example6",
        tags: ["Maintenance", "Tips", "Luxury Cars", "Car Care", "Kenya"],
        carReference: null,
        featured: true
    },
    {
        id: "video-007",
        title: "Audi Q7 vs BMW X5 - Luxury SUV Comparison",
        description: "Head-to-head comparison between the 2022 Audi Q7 and BMW X5. Which luxury SUV is right for you?",
        category: "review",
        duration: "28:15",
        views: "78,450",
        likes: "4,230",
        uploadDate: "2024-02-08",
        uploader: "AutoLuxe Kenya",
        thumbnail: "audi-vs-bmw-comparison.jpg",
        videoUrl: "https://www.youtube.com/embed/example7",
        tags: ["Comparison", "Audi", "BMW", "SUV", "Luxury"],
        carReference: null,
        featured: true
    },
    {
        id: "video-008",
        title: "2023 Mercedes S-Class Interior Tour",
        description: "Exclusive tour of the luxurious interior of the 2023 Mercedes S-Class. See the cutting-edge technology.",
        category: "walkaround",
        duration: "14:20",
        views: "41,230",
        likes: "2,560",
        uploadDate: "2024-02-10",
        uploader: "AutoLuxe Kenya",
        thumbnail: "mercedes-s-class-interior.jpg",
        videoUrl: "https://www.youtube.com/embed/example8",
        tags: ["Mercedes", "S-Class", "Interior", "Luxury", "Technology"],
        carReference: "MERCEDES-S450-2023-001",
        featured: false
    },
    {
        id: "video-009",
        title: "Car Financing Options in Kenya Explained",
        description: "Complete guide to car financing options available for luxury vehicles in Kenya.",
        category: "news",
        duration: "19:45",
        views: "56,780",
        likes: "3,120",
        uploadDate: "2024-02-12",
        uploader: "AutoLuxe Kenya",
        thumbnail: "car-financing-kenya.jpg",
        videoUrl: "https://www.youtube.com/embed/example9",
        tags: ["Financing", "Kenya", "Car Loan", "Leasing", "Guide"],
        carReference: null,
        featured: false
    },
    {
        id: "video-010",
        title: "BMW M3 Competition Track Day",
        description: "Watch the 2023 BMW M3 Competition on a track day. Experience its performance capabilities.",
        category: "test-drive",
        duration: "16:30",
        views: "48,900",
        likes: "3,450",
        uploadDate: "2024-02-15",
        uploader: "AutoLuxe Kenya",
        thumbnail: "bmw-m3-trackday.jpg",
        videoUrl: "https://www.youtube.com/embed/example10",
        tags: ["BMW", "M3", "Track", "Performance", "Sports Car"],
        carReference: "BMW-M3-2023-001",
        featured: true
    },
    {
        id: "video-011",
        title: "Luxury Car Detailing - Complete Process",
        description: "Step-by-step guide to professional detailing for luxury vehicles. Keep your car looking showroom fresh.",
        category: "maintenance",
        duration: "32:15",
        views: "72,340",
        likes: "4,120",
        uploadDate: "2024-02-18",
        uploader: "AutoLuxe Kenya",
        thumbnail: "car-detailing-process.jpg",
        videoUrl: "https://www.youtube.com/embed/example11",
        tags: ["Detailing", "Car Care", "Maintenance", "Luxury", "How To"],
        carReference: null,
        featured: false
    },
    {
        id: "video-012",
        title: "Range Rover Sport Off-Road Capabilities",
        description: "Testing the off-road capabilities of the 2021 Range Rover Sport HST in challenging terrain.",
        category: "test-drive",
        duration: "21:45",
        views: "61,230",
        likes: "3,780",
        uploadDate: "2024-02-20",
        uploader: "AutoLuxe Kenya",
        thumbnail: "range-sport-offroad.jpg",
        videoUrl: "https://www.youtube.com/embed/example12",
        tags: ["Range Rover", "Sport", "Off-Road", "4x4", "Adventure"],
        carReference: "RANGE-SPORT-2021-001",
        featured: true
    }
];

// Get unique categories
const videoCategories = Array.from(new Set(videosData.map(video => video.category)));

// Function to get video by ID
function getVideoById(id) {
    return videosData.find(video => video.id === id);
}

// Function to get videos by category
function getVideosByCategory(category, limit = null) {
    if (category === 'all') return limit ? videosData.slice(0, limit) : videosData;
    const filtered = videosData.filter(video => video.category === category);
    return limit ? filtered.slice(0, limit) : filtered;
}

// Function to get featured videos
function getFeaturedVideos(limit = 6) {
    return videosData.filter(video => video.featured).slice(0, limit);
}

// Function to search videos
function searchVideos(query) {
    if (!query) return videosData;
    
    const searchTerm = query.toLowerCase();
    return videosData.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        video.uploader.toLowerCase().includes(searchTerm)
    );
}

// Function to sort videos
function sortVideos(videos, sortBy) {
    const sortedVideos = [...videos];
    
    switch (sortBy) {
        case 'latest':
            return sortedVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        case 'popular':
            return sortedVideos.sort((a, b) => {
                const viewsA = parseInt(a.views.replace(/[^\d]/g, ''));
                const viewsB = parseInt(b.views.replace(/[^\d]/g, ''));
                return viewsB - viewsA;
            });
        case 'duration':
            return sortedVideos.sort((a, b) => {
                const durationA = parseDuration(a.duration);
                const durationB = parseDuration(b.duration);
                return durationA - durationB;
            });
        default:
            return sortedVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }
}

// Helper function to parse duration string (MM:SS) to seconds
function parseDuration(duration) {
    const parts = duration.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
}

// Function to get related videos
function getRelatedVideos(currentVideoId, limit = 3) {
    const currentVideo = getVideoById(currentVideoId);
    if (!currentVideo) return [];
    
    const related = videosData.filter(video => 
        video.id !== currentVideoId && 
        (video.category === currentVideo.category || 
         video.tags.some(tag => currentVideo.tags.includes(tag)))
    );
    
    return related.slice(0, limit);
}

// Function to get video car details if referenced
function getVideoCarDetails(video) {
    if (!video.carReference) return null;
    
    // This would be connected to carsData.js
    // For now, return mock data based on carReference
    const carMap = {
        'BMW-X5-2022-001': { make: 'BMW', model: 'X5 xDrive40i', year: 2022, price: 18500000 },
        'MERCEDES-GLE-2022-001': { make: 'Mercedes-Benz', model: 'GLE 450 4MATIC', year: 2022, price: 19500000 },
        'TOYOTA-LC300-2023-001': { make: 'Toyota', model: 'Land Cruiser 300 VX', year: 2023, price: 28500000 },
        'RANGE-VELAR-2022-001': { make: 'Range Rover', model: 'Velar P400', year: 2022, price: 22500000 },
        'PORSCHE-CAYENNE-2022-001': { make: 'Porsche', model: 'Cayenne S', year: 2022, price: 32500000 },
        'BMW-M3-2023-001': { make: 'BMW', model: 'M3 Competition', year: 2023, price: 22500000 },
        'MERCEDES-S450-2023-001': { make: 'Mercedes-Benz', model: 'S 450 4MATIC', year: 2023, price: 28500000 },
        'RANGE-SPORT-2021-001': { make: 'Range Rover', model: 'Sport HST', year: 2021, price: 28500000 }
    };
    
    return carMap[video.carReference] || null;
}

// Function to format view count
function formatViewCount(views) {
    const num = parseInt(views.replace(/[^\d]/g, ''));
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Function to format upload date
function formatUploadDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Export everything
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        videosData,
        videoCategories,
        getVideoById,
        getVideosByCategory,
        getFeaturedVideos,
        searchVideos,
        sortVideos,
        getRelatedVideos,
        getVideoCarDetails,
        formatViewCount,
        formatUploadDate
    };
}