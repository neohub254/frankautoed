// NEXUS VEHICULAR - Central Car Database
// Add your vehicles here - copy the block and modify values

const nexusInventory = [
    {
        id: "QNTM-001",
        category: "Hypercar",
        name: "Aetherius RZ-2200",
        price: 245000,
        imageSet: ["rz2200_01.jpg", "rz2200_02.jpg", "rz2200_03.jpg"],
        specs: { 
            power: "1200 hp", 
            acceleration: "1.9s", 
            range: "450 mi",
            topSpeed: "220 mph",
            torque: "1200 lb-ft"
        },
        description: "The apex of electric performance with quantum battery technology.",
        colors: ["#0a0a0f", "#00f3ff", "#9d4edd", "#ff006e"]
    },
    {
        id: "NEB-002",
        category: "SUV",
        name: "Nebula Voyager X",
        price: 185000,
        imageSet: ["voyager_01.jpg", "voyager_02.jpg", "voyager_03.jpg"],
        specs: { 
            power: "800 hp", 
            acceleration: "3.2s", 
            range: "520 mi",
            topSpeed: "155 mph",
            torque: "900 lb-ft"
        },
        description: "Luxury electric SUV with autonomous driving and holographic interface.",
        colors: ["#1a1a2e", "#00ff88", "#4cc9f0", "#7209b7"]
    },
    {
        id: "VOID-003",
        category: "Sedan",
        name: "Void Phantom S",
        price: 165000,
        imageSet: ["phantom_01.jpg", "phantom_02.jpg", "phantom_03.jpg"],
        specs: { 
            power: "650 hp", 
            acceleration: "2.8s", 
            range: "480 mi",
            topSpeed: "180 mph",
            torque: "750 lb-ft"
        },
        description: "Stealth performance sedan with adaptive camouflage technology.",
        colors: ["#000000", "#333333", "#666666", "#00f3ff"]
    },
    {
        id: "SOL-004",
        category: "Sports",
        name: "Solaris Pulse",
        price: 195000,
        imageSet: ["pulse_01.jpg", "pulse_02.jpg", "pulse_03.jpg"],
        specs: { 
            power: "950 hp", 
            acceleration: "2.1s", 
            range: "420 mi",
            topSpeed: "210 mph",
            torque: "1100 lb-ft"
        },
        description: "Solar-powered sports car with kinetic energy recovery system.",
        colors: ["#ff6b00", "#ffd166", "#06d6a0", "#118ab2"]
    },
    {
        id: "CRY-005",
        category: "Coupe",
        name: "Cryo Velocity",
        price: 225000,
        imageSet: ["cryo_01.jpg", "cryo_02.jpg", "cryo_03.jpg"],
        specs: { 
            power: "1100 hp", 
            acceleration: "1.8s", 
            range: "380 mi",
            topSpeed: "240 mph",
            torque: "1300 lb-ft"
        },
        description: "Cryogenically cooled hypercar with active aerodynamics.",
        colors: ["#00b4d8", "#0077b6", "#90e0ef", "#caf0f8"]
    }
    // COPY AND PASTE THIS BLOCK TO ADD MORE VEHICLES
,
    {
        id: "YOUR-ID",
        category: "Category",
        name: "Maserati",
        price: 0,
        imageSet: ["image1.jpg", "image1.jpg", "image1.jpg"],
        specs: { 
            power: "0 hp", 
            acceleration: "0s", 
            range: "0 mi",
            topSpeed: "0 mph",
            torque: "0 lb-ft"
        },
        description: "Description here.",
        colors: ["#hexcode", "#hexcode", "#hexcode"]
    },
    
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = nexusInventory;
}