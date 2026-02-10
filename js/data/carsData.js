// ============================================
// AUTO LUXE KENYA - CARS DATABASE
// Contains 15+ sample luxury cars with complete details
// Easy to maintain: Add new cars by copying the template
// ============================================

const carsData = [
    {
        id: "Toyota Fielder Hybrid ",
        make: "Toyota",
        model: "YOM",
        year: 2019,
        price: 1685000,
        mileage: "34,500 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "1500 cc",
        power: "335 HP",
        torque: "450 Nm",
        doors: 5,
        seats: 5,
        color: "ORIINAL FACTORY GRAY",
        location: "Nairobi",
        images: ["toyotafielderhybrid2019.jpg", "toyotafielderhybrid12019.jpg", "toyotafielderhybrid22019.jpg"],
        description: "Immaculate 2022 BMW X5 xDrive40i with full service history. This luxury SUV comes with the M Sport package and advanced driver assistance systems. Perfect condition, one owner, never involved in any accident.",
        features: [ "Leather Seats", "Navigation", "Camera", "Apple CarPlay", "Android Auto", "Heated Seats", "Ventilated Seats", "Premium Sound", "LED Headlights"],
        contact: "0705455312",
        brand: "TOYOTA",
        bodyType: "SUV",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2026-01-15",
        updatedAt: "2026-02-10"
    },
    {
        id: "BMW-M3-2023-001",
        make: "BMW",
        model: "M3 Competition",
        year: 2023,
        price: 22500000,
        mileage: "12,800 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3000 cc",
        power: "510 HP",
        torque: "650 Nm",
        doors: 4,
        seats: 5,
        color: "Isle of Man Green",
        location: "Nairobi",
        images: ["bmwm3_2023_1.jpg", "bmw-m3-2.jpg", "bmw-m3-3.jpg"],
        description: "2023 BMW M3 Competition in stunning Isle of Man Green. Full M Performance package including carbon fiber exterior, M Sport exhaust, and competition seats. Low mileage, like new condition.",
        features: ["Sunroof", "Leather Seats", "Navigation", "Camera", "Apple CarPlay", "Premium Sound", "Sport Seats", "Carbon Fiber", "M Sport Package", "Head-up Display"],
        contact: "07605455312",
        brand: "BMW",
        bodyType: "Sedan",
        isFeatured: true,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-20",
        updatedAt: "2024-02-10"
    },
    {
        id: "BMW-730-2021-001",
        make: "BMW",
        model: "730Li",
        year: 2021,
        price: 16500000,
        mileage: "45,200 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "2000 cc",
        power: "258 HP",
        torque: "400 Nm",
        doors: 4,
        seats: 5,
        color: "Mineral White",
        location: "Mombasa",
        images: ["bmw-730-1.jpg", "bmw-730-2.jpg", "bmw-730-3.jpg"],
        description: "Elegant 2021 BMW 730Li luxury sedan. Executive package with rear seat entertainment, premium sound system, and all modern amenities. Full service history from BMW dealership.",
        features: ["Sunroof", "Leather Seats", "Navigation", "Camera", "Apple CarPlay", "Rear Entertainment", "Massage Seats", "Premium Sound", "Ambient Lighting", "Soft Close Doors"],
        contact: "07605455312",
        brand: "BMW",
        bodyType: "Sedan",
        isFeatured: false,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-10",
        updatedAt: "2024-02-10"
    },
    {
        id: "MERCEDES-GLE-2022-001",
        make: "Mercedes-Benz",
        model: "GLE 450 4MATIC",
        year: 2022,
        price: 19500000,
        mileage: "28,400 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3000 cc",
        power: "367 HP",
        torque: "500 Nm",
        doors: 5,
        seats: 5,
        color: "Obsidian Black",
        location: "Nairobi",
        images: ["mercedezgle2022.jpg", "mercedes-gle-2.jpg", "mercedes-gle-3.jpg"],
        description: "2022 Mercedes-Benz GLE 450 4MATIC in pristine condition. AMG Line package, panoramic sunroof, and all the latest technology. One owner, never been in any accident.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Android Auto", "Air Suspension", "Burmester Sound", "LED Headlights", "Keyless Go"],
        contact: "07605455312",
        brand: "Mercedes",
        bodyType: "SUV",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-18",
        updatedAt: "2024-02-10"
    },
    {
        id: "MERCEDES-S450-2023-001",
        make: "Mercedes-Benz",
        model: "S 450 4MATIC",
        year: 2023,
        price: 28500000,
        mileage: "8,900 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3000 cc",
        power: "367 HP",
        torque: "500 Nm",
        doors: 4,
        seats: 5,
        color: "Selenite Grey",
        location: "Nairobi",
        images: ["mercedes-s450-1.jpg", "mercedes-s450-2.jpg", "mercedes-s450-3.jpg"],
        description: "Brand new condition 2023 Mercedes-Benz S 450 4MATIC. The pinnacle of luxury with all executive features including rear seat package, Burmester high-end sound, and advanced safety systems.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Rear Entertainment", "Massage Seats", "Burmester Sound", "Ambient Lighting", "Magic Body Control"],
        contact: "07605455312",
        brand: "Mercedes",
        bodyType: "Sedan",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-25",
        updatedAt: "2024-02-10"
    },
    {
        id: "MERCEDES-G63-2021-001",
        make: "Mercedes-Benz",
        model: "G 63 AMG",
        year: 2021,
        price: 38500000,
        mileage: "32,100 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "4000 cc",
        power: "577 HP",
        torque: "850 Nm",
        doors: 5,
        seats: 5,
        color: "Mojave Silver",
        location: "Kisumu",
        images: ["mercedes-g63-1.jpg", "mercedes-g63-2.jpg", "mercedes-g63-3.jpg"],
        description: "Iconic 2021 Mercedes-AMG G 63. Full AMG package with performance exhaust, carbon fiber trim, and AMG wheels. Luxury and performance in one package.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "AMG Performance", "Carbon Fiber", "Premium Sound", "AMG Exhaust", "Keyless Go"],
        contact: "07605455312",
        brand: "Mercedes",
        bodyType: "SUV",
        isFeatured: false,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-12",
        updatedAt: "2024-02-10"
    },
    {
        id: "TOYOTA-LC300-2023-001",
        make: "Toyota",
        model: "Land Cruiser 300 VX",
        year: 2023,
        price: 28500000,
        mileage: "15,200 km",
        fuelType: "Diesel",
        transmission: "Automatic",
        engine: "3300 cc",
        power: "305 HP",
        torque: "700 Nm",
        doors: 5,
        seats: 7,
        color: "Pearl White",
        location: "Nairobi",
        images: ["toyota-lc300-1.jpg", "toyota-lc300-2.jpg", "toyota-lc300-3.jpg"],
        description: "2023 Toyota Land Cruiser 300 VX in perfect condition. Full options including off-road package, premium sound, and all modern safety features. Low mileage, one owner.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Android Auto", "Premium Sound", "KDSS Suspension", "Multi-Terrain Select", "Cooled Seats"],
        contact: "07605455312",
        brand: "Toyota",
        bodyType: "SUV",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-22",
        updatedAt: "2024-02-10"
    },
    {
        id: "TOYOTA-PRADO-2022-001",
        make: "Toyota",
        model: "Prado TX",
        year: 2022,
        price: 18500000,
        mileage: "42,800 km",
        fuelType: "Diesel",
        transmission: "Automatic",
        engine: "2800 cc",
        power: "204 HP",
        torque: "500 Nm",
        doors: 5,
        seats: 7,
        color: "Graphite Grey",
        location: "Mombasa",
        images: ["toyota-prado-1.jpg", "toyota-prado-2.jpg", "toyota-prado-3.jpg"],
        description: "Reliable 2022 Toyota Prado TX. Well maintained with full service history. Perfect for family and off-road adventures. Excellent condition throughout.",
        features: ["Sunroof", "Leather Seats", "Navigation", "Camera", "Apple CarPlay", "Android Auto", "Premium Sound", "KDSS", "Cooled Seats", "Third Row Seats"],
        contact: "07605455312",
        brand: "Toyota",
        bodyType: "SUV",
        isFeatured: false,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-08",
        updatedAt: "2024-02-10"
    },
    {
        id: "TOYOTA-HILUX-2023-001",
        make: "Toyota",
        model: "Hilux Double Cab",
        year: 2023,
        price: 12500000,
        mileage: "18,900 km",
        fuelType: "Diesel",
        transmission: "Automatic",
        engine: "2800 cc",
        power: "204 HP",
        torque: "500 Nm",
        doors: 4,
        seats: 5,
        color: "Silver Metallic",
        location: "Eldoret",
        images: ["toyota-hilux-1.jpg", "toyota-hilux-2.jpg", "toyota-hilux-3.jpg"],
        description: "2023 Toyota Hilux Double Cab in excellent condition. Perfect for both work and family. Low mileage, well maintained, ready for any task.",
        features: ["Leather Seats", "Navigation", "Camera", "Apple CarPlay", "Android Auto", "Premium Sound", "Tow Package", "Canopy", "Running Boards", "Bed Liner"],
        contact: "07605455312",
        brand: "Toyota",
        bodyType: "Truck",
        isFeatured: false,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-30",
        updatedAt: "2024-02-10"
    },
    {
        id: "AUDI-Q7-2022-001",
        make: "Audi",
        model: "Q7 45 TFSI",
        year: 2022,
        price: 19500000,
        mileage: "31,200 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "2000 cc",
        power: "245 HP",
        torque: "370 Nm",
        doors: 5,
        seats: 7,
        color: "Navarra Blue",
        location: "Nairobi",
        images: ["audi-q7-1.jpg", "audi-q7-2.jpg", "audi-q7-3.jpg"],
        description: "2022 Audi Q7 45 TFSI luxury SUV. S Line package with virtual cockpit, premium sound, and all-wheel drive. Perfect family vehicle with third row seating.",
        features: ["Sunroof", "Leather Seats", "Virtual Cockpit", "360 Camera", "Apple CarPlay", "Android Auto", "Bang & Olufsen Sound", "Matrix LED", "Air Suspension", "Third Row Seats"],
        contact: "07605455312",
        brand: "Audi",
        bodyType: "SUV",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-16",
        updatedAt: "2024-02-10"
    },
    {
        id: "AUDI-A6-2021-001",
        make: "Audi",
        model: "A6 Quattro",
        year: 2021,
        price: 12500000,
        mileage: "45,800 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "2000 cc",
        power: "245 HP",
        torque: "370 Nm",
        doors: 4,
        seats: 5,
        color: "Daytona Grey",
        location: "Nairobi",
        images: ["audi-a6-1.jpg", "audi-a6-2.jpg", "audi-a6-3.jpg"],
        description: "Elegant 2021 Audi A6 Quattro. Premium Plus package with all modern features. Well maintained with full service history from authorized dealer.",
        features: ["Sunroof", "Leather Seats", "Virtual Cockpit", "360 Camera", "Apple CarPlay", "Android Auto", "Premium Sound", "Matrix LED", "Quattro AWD", "Ambient Lighting"],
        contact: "07605455312",
        brand: "Audi",
        bodyType: "Sedan",
        isFeatured: false,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-05",
        updatedAt: "2024-02-10"
    },
    {
        id: "RANGE-VELAR-2022-001",
        make: "Range Roverrrrr",
        model: "Velar P410",
        year: 2022,
        price: 22500000,
        mileage: "22,100 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3000 cc",
        power: "400 HP",
        torque: "550 Nm",
        doors: 5,
        seats: 5,
        color: "Fuji White",
        location: "Nairobi",
        images: ["https://unsplash.com/photos/a-white-race-car-with-purple-wheels-on-a-gray-background-L5kSgvuNcAw", "https://unsplash.com/photos/a-white-race-car-with-purple-wheels-on-a-gray-background-L5kSgvuNcAw", "https://unsplash.com/photos/a-white-race-car-with-purple-wheels-on-a-gray-background-L5kSgvuNcAw"],
        description: "2022 Range Rover Velar P400 in stunning condition. Full specification including Meridian sound, panoramic roof, and advanced off-road capabilities.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Android Auto", "Meridian Sound", "Air Suspension", "Matrix LED", "Keyless Entry"],
        contact: "07605455312",
        brand: "Range Rover",
        bodyType: "SUV",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-28",
        updatedAt: "2024-02-10"
    },
    {
        id: "RANGE-SPORT-2021-001",
        make: "Range Rover",
        model: "Sport HST",
        year: 2021,
        price: 28500000,
        mileage: "38,400 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3000 cc",
        power: "400 HP",
        torque: "550 Nm",
        doors: 5,
        seats: 5,
        color: "Santorini Black",
        location: "Mombasa",
        images: ["range-sport-1.jpg", "range-sport-2.jpg", "range-sport-3.jpg"],
        description: "Powerful 2021 Range Rover Sport HST. Dynamic package with performance enhancements, luxury interior, and all-terrain capability.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Android Auto", "Meridian Sound", "Air Suspension", "Terrain Response", "Head-up Display"],
        contact: "07605455312",
        brand: "Range Rover",
        bodyType: "SUV",
        isFeatured: false,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-14",
        updatedAt: "2024-02-10"
    },
    {
        id: "PORSCHE-CAYENNE-2022-001",
        make: "Porsche",
        model: "Cayenne S",
        year: 2022,
        price: 32500000,
        mileage: "19,800 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "2900 cc",
        power: "440 HP",
        torque: "550 Nm",
        doors: 5,
        seats: 5,
        color: "Carmine Red",
        location: "Nairobi",
        images: ["porsche-cayenne-1.jpg", "porsche-cayenne-2.jpg", "porsche-cayenne-3.jpg"],
        description: "2022 Porsche Cayenne S in stunning Carmine Red. Sport Chrono package, premium interior, and Porsche performance. Low mileage, perfect condition.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Sport Chrono", "Bose Sound", "Air Suspension", "Sport Exhaust", "PDK Transmission"],
        contact: "07605455312",
        brand: "Porsche",
        bodyType: "SUV",
        isFeatured: true,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-24",
        updatedAt: "2024-02-10"
    },
    {
        id: "PORSCHE-911-2020-001",
        make: "Porsche",
        model: "911 Carrera 4S",
        year: 2020,
        price: 28500000,
        mileage: "28,900 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3000 cc",
        power: "450 HP",
        torque: "530 Nm",
        doors: 2,
        seats: 4,
        color: "GT Silver",
        location: "Nairobi",
        images: ["porsche-911-1.jpg", "porsche-911-2.jpg", "porsche-911-3.jpg"],
        description: "Iconic 2020 Porsche 911 Carrera 4S. Sport Design package, premium sound, and Porsche performance. Well maintained with full service history.",
        features: ["Sunroof", "Leather Seats", "Navigation", "Camera", "Apple CarPlay", "Sport Chrono", "Bose Sound", "Sport Exhaust", "PDK Transmission", "Sport Seats"],
        contact: "07605455312",
        brand: "Porsche",
        bodyType: "Convertible",
        isFeatured: false,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-09",
        updatedAt: "2024-02-10"
    },
    {
        id: "FORD-RAPTOR-2023-001",
        make: "Ford",
        model: "Raptor",
        year: 2023,
        price: 18500000,
        mileage: "12,500 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "3500 cc",
        power: "450 HP",
        torque: "690 Nm",
        doors: 4,
        seats: 5,
        color: "Code Orange",
        location: "Nakuru",
        images: ["ford-raptor-1.jpg", "ford-raptor-2.jpg", "ford-raptor-3.jpg"],
        description: "2023 Ford Raptor in iconic Code Orange. Full Raptor package with off-road suspension, performance upgrades, and luxury interior.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Android Auto", "B&O Sound", "Off-road Suspension", "Tow Package", "Bed Liner"],
        contact: "07605455312",
        brand: "Ford",
        bodyType: "Truck",
        isFeatured: false,
        isHotDeal: false,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-31",
        updatedAt: "2024-02-10"
    },
    {
        id: "NISSAN-PATROL-2022-001",
        make: "Nissan",
        model: "Patrol Platinum",
        year: 2022,
        price: 22500000,
        mileage: "25,600 km",
        fuelType: "Petrol",
        transmission: "Automatic",
        engine: "5600 cc",
        power: "400 HP",
        torque: "560 Nm",
        doors: 5,
        seats: 7,
        color: "Magnetic Black",
        location: "Nairobi",
        images: ["nissan-patrol-1.jpg", "nissan-patrol-2.jpg", "nissan-patrol-3.jpg"],
        description: "2022 Nissan Patrol Platinum luxury SUV. Full options including entertainment system, premium sound, and all modern features. Excellent condition.",
        features: ["Sunroof", "Leather Seats", "Navigation", "360 Camera", "Apple CarPlay", "Android Auto", "Bose Sound", "Hydraulic Suspension", "Rear Entertainment", "Cooled Seats"],
        contact: "07605455312",
        brand: "Nissan",
        bodyType: "SUV",
        isFeatured: false,
        isHotDeal: true,
        isCertified: true,
        isFinancing: true,
        createdAt: "2024-01-17",
        updatedAt: "2024-02-10"
    }
];

// Auto-generated WhatsApp and SMS messages
carsData.forEach(car => {
    car.whatsappMessage = `Hello! I'm interested in the ${car.year} ${car.make} ${car.model}.
Price: KES ${car.price.toLocaleString('en-KE')}
Mileage: ${car.mileage}
Location: ${car.location}
Fuel Type: ${car.fuelType}
Transmission: ${car.transmission}
Engine: ${car.engine}
Please share more details and availability. Reference: ${car.id}`;
    
    car.smsMessage = `INQUIRY: ${car.year} ${car.make} ${car.model}. KES ${(car.price/1000000).toFixed(1)}M. ${car.mileage}. ${car.location}. Ref: ${car.id}`;
});

// Get unique brands for filtering
const allBrands = Array.from(new Set(carsData.map(car => car.brand))).sort();
allBrands.unshift("All Brands");

// Get unique locations for filtering
const allLocations = Array.from(new Set(carsData.map(car => car.location))).sort();

// Get unique years for filtering
const allYears = Array.from(new Set(carsData.map(car => car.year))).sort((a, b) => b - a);

// Get unique features for filtering
const allFeatures = Array.from(new Set(carsData.flatMap(car => car.features))).sort();

// Function to format price
function formatPrice(price) {
    if (price >= 1000000) {
        return `KES ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
        return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price}`;
}

// Function to get car by ID
function getCarById(id) {
    return carsData.find(car => car.id === id);
}

// Function to get featured cars (for homepage)
function getFeaturedCars(limit = 3) {
    return carsData.filter(car => car.isFeatured).slice(0, limit);
}

// Function to get cars by brand
function getCarsByBrand(brand) {
    if (brand === "All Brands") return carsData;
    return carsData.filter(car => car.brand === brand);
}

// Function to search cars
function searchCars(query) {
    if (!query) return carsData;
    
    const searchTerm = query.toLowerCase();
    return carsData.filter(car => 
        car.make.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.year.toString().includes(searchTerm) ||
        car.description.toLowerCase().includes(searchTerm) ||
        car.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
}

// Function to filter cars
function filterCars(filters) {
    return carsData.filter(car => {
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
        if (filters.features.length > 0 && !filters.features.every(feature => car.features.includes(feature))) {
            return false;
        }
        
        // Location filter
        if (filters.location !== "all" && car.location !== filters.location) {
            return false;
        }
        
        // Search filter
        if (filters.searchQuery && !searchCars(filters.searchQuery).includes(car)) {
            return false;
        }
        
        return true;
    });
}

// Function to sort cars
function sortCars(cars, sortBy) {
    const sortedCars = [...cars];
    
    switch (sortBy) {
        case 'price-low':
            return sortedCars.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedCars.sort((a, b) => b.price - a.price);
        case 'year-new':
            return sortedCars.sort((a, b) => b.year - a.year);
        case 'year-old':
            return sortedCars.sort((a, b) => a.year - b.year);
        case 'mileage-low':
            return sortedCars.sort((a, b) => {
                const mileageA = parseInt(a.mileage.replace(/[^\d]/g, ''));
                const mileageB = parseInt(b.mileage.replace(/[^\d]/g, ''));
                return mileageA - mileageB;
            });
        default:
            return sortedCars.sort((a, b) => {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }
}

// Export everything
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        carsData,
        allBrands,
        allLocations,
        allYears,
        allFeatures,
        formatPrice,
        getCarById,
        getFeaturedCars,
        getCarsByBrand,
        searchCars,
        filterCars,
        sortCars
    };

}
