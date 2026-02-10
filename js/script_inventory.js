// NEXUS VEHICULAR - Inventory Page Script
class NexusInventory {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.grid = null;
        this.lasers = [];
        
        this.vehicles = nexusInventory || [];
        this.filteredVehicles = [];
        this.selectedVehicles = new Set(); // For comparison mode
        this.activeFilters = {
            category: 'all',
            maxPrice: 1000000,
            minAcceleration: 0,
            minPower: 0,
            minRange: 0
        };
        
        this.sortBy = 'name';
        this.viewMode = 'grid';
        
        this.isComparing = false;
        
        this.init();
    }
    
    init() {
        this.setupThreeJS();
        this.setupEventListeners();
        this.populateFilters();
        this.renderVehicleGrid();
        this.setupCustomCursor();
        this.animateIndicators();
        
        // Initial animations
        this.animateScanningBeam();
        this.createVerticalLasers();
    }
    
    setupThreeJS() {
        // Setup scene with more interactive grid
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 60;
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('backgroundCanvas'),
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create interactive grid
        this.createInteractiveGrid();
        this.createParticleField();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createInteractiveGrid() {
        const gridGroup = new THREE.Group();
        
        // Create a more dynamic grid for inventory page
        const gridSize = 120;
        const spacing = 8;
        const hexGeometry = new THREE.CircleGeometry(0.8, 6);
        
        for (let x = -gridSize; x <= gridSize; x += spacing) {
            for (let z = -gridSize; z <= gridSize; z += spacing) {
                const hexMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00f3ff,
                    transparent: true,
                    opacity: 0.03,
                    side: THREE.DoubleSide
                });
                
                const hex = new THREE.Mesh(hexGeometry, hexMaterial);
                hex.position.set(x, 0, z);
                
                // Store original position for animation
                hex.userData = {
                    originalX: x,
                    originalY: 0,
                    originalZ: z,
                    hovered: false,
                    pulseOffset: Math.random() * Math.PI * 2
                };
                
                gridGroup.add(hex);
                
                // Add connecting lines with pulse effect
                this.createGridLines(x, z, spacing, gridGroup);
            }
        }
        
        this.grid = gridGroup;
        this.scene.add(this.grid);
        
        // Add floating nodes at intersections
        this.createGridNodes();
    }
    
    createGridLines(x, z, spacing, group) {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.02
        });
        
        // Connect to neighbors
        const neighbors = [
            [x + spacing, z],
            [x, z + spacing],
            [x + spacing/2, z + spacing]
        ];
        
        neighbors.forEach(([nx, nz]) => {
            const points = [
                new THREE.Vector3(x, 0, z),
                new THREE.Vector3(nx, 0, nz)
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            
            // Store for animation
            line.userData = {
                originalPoints: [...points],
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            group.add(line);
        });
    }
    
    createGridNodes() {
        const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.2
        });
        
        // Create nodes at strategic positions
        const nodeCount = 50;
        for (let i = 0; i < nodeCount; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position nodes in interesting patterns
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = 40 + Math.sin(angle * 3) * 20;
            
            node.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 10,
                Math.sin(angle) * radius
            );
            
            node.userData = {
                originalY: node.position.y,
                speed: 0.5 + Math.random() * 1,
                phase: Math.random() * Math.PI * 2
            };
            
            this.grid.add(node);
        }
    }
    
    createParticleField() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 300;
            positions[i + 1] = (Math.random() - 0.5) * 300;
            positions[i + 2] = (Math.random() - 0.5) * 300;
            
            // Cyan to purple gradient
            colors[i] = Math.random() * 0.2; // R
            colors[i + 1] = 0.5 + Math.random() * 0.5; // G
            colors[i + 2] = 0.7 + Math.random() * 0.3; // B
            
            sizes[i / 3] = Math.random() * 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createVerticalLasers() {
        // Create vertical scanning lasers that sweep across
        for (let i = 0; i < 4; i++) {
            const laserGeometry = new THREE.BoxGeometry(0.5, 200, 0.5);
            const laserMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                transparent: true,
                opacity: 0
            });
            
            const laser = new THREE.Mesh(laserGeometry, laserMaterial);
            laser.position.x = (Math.random() - 0.5) * 200;
            laser.position.z = (Math.random() - 0.5) * 200;
            
            laser.userData = {
                speed: 0.5 + Math.random(),
                direction: Math.random() > 0.5 ? 1 : -1,
                timer: Math.random() * 100,
                active: false
            };
            
            this.scene.add(laser);
            this.lasers.push(laser);
        }
    }
    
    setupEventListeners() {
        // Filter tag clicks
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.handleFilterClick(e, tag));
        });
        
        // Price slider
        const priceSlider = document.getElementById('priceSlider');
        priceSlider.addEventListener('input', (e) => this.handlePriceFilter(e));
        priceSlider.addEventListener('change', (e) => this.applyFilters());
        
        // Performance sliders
        document.getElementById('accelSlider').addEventListener('input', (e) => this.updateSliderValue(e, 'accelValue', 's'));
        document.getElementById('powerSlider').addEventListener('input', (e) => this.updateSliderValue(e, 'powerValue', 'HP'));
        document.getElementById('rangeSlider').addEventListener('input', (e) => this.updateSliderValue(e, 'rangeValue', 'mi'));
        
        document.getElementById('accelSlider').addEventListener('change', () => this.applyFilters());
        document.getElementById('powerSlider').addEventListener('change', () => this.applyFilters());
        document.getElementById('rangeSlider').addEventListener('change', () => this.applyFilters());
        
        // Sort and view controls
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleViewMode(e, btn));
        });
        
        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => this.clearAllFilters());
        
        // Vehicle card interactions
        document.addEventListener('click', (e) => this.handleCardClick(e));
        
        // Comparison controls
        document.getElementById('executeCompare').addEventListener('click', () => this.executeComparison());
        document.getElementById('clearCompare').addEventListener('click', () => this.clearComparison());
        
        // Modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(btn));
        });
        
        // Inquiry trigger
        document.getElementById('inquiryTrigger').addEventListener('click', () => this.openInquiryModal());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Mouse move for grid interaction
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        const interactiveElements = document.querySelectorAll('a, button, .filter-tag, .vehicle-card, .action-btn');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Update mouse position for grid interaction
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
    }
    
    populateFilters() {
        const container = document.getElementById('categoryFilters');
        
        // Extract unique categories from vehicles
        const categories = ['all', ...new Set(this.vehicles.map(v => v.category.toLowerCase()))];
        
        categories.forEach(category => {
            if (category === 'all') return; // Already have all button
            
            const count = this.vehicles.filter(v => v.category.toLowerCase() === category).length;
            const displayName = category.charAt(0).toUpperCase() + category.slice(1);
            
            const button = document.createElement('button');
            button.className = 'filter-tag';
            button.dataset.filter = category;
            button.innerHTML = `
                <span class="tag-glow"></span>
                <span class="tag-text">${displayName}</span>
                <span class="tag-count">${count}</span>
            `;
            
            button.addEventListener('click', (e) => this.handleFilterClick(e, button));
            container.appendChild(button);
        });
        
        // Update vehicle count
        document.getElementById('vehicleCount').textContent = this.vehicles.length;
    }
    
    handleFilterClick(e, button) {
        e.preventDefault();
        this.playSound('filterSound');
        
        const filter = button.dataset.filter;
        
        // Update active class
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        button.classList.add('active');
        
        // Store active filter
        this.activeFilters.category = filter;
        
        // Create EMP wave effect
        this.createEMPWave(button);
        
        // Create light pillar effect
        this.createLightPillar(button);
        
        // Apply filters after a delay for animation
        setTimeout(() => {
            this.applyFilters();
        }, 600);
    }
    
    createEMPWave(element) {
        const rect = element.getBoundingClientRect();
        const wave = document.createElement('div');
        wave.className = 'emp-wave';
        
        const size = Math.max(rect.width, rect.height) * 2;
        wave.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid var(--primary-color);
            pointer-events: none;
            z-index: 2000;
            transform: translate(-50%, -50%);
            opacity: 0;
        `;
        
        document.body.appendChild(wave);
        
        // Animate wave
        gsap.to(wave, {
            width: size * 10,
            height: size * 10,
            opacity: 0.8,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => wave.remove()
        });
        
        gsap.to(wave, {
            opacity: 0,
            duration: 0.3,
            delay: 0.3
        });
    }
    
    createLightPillar(element) {
        const rect = element.getBoundingClientRect();
        const pillar = document.createElement('div');
        pillar.className = 'light-pillar';
        
        pillar.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top}px;
            width: 4px;
            height: 0;
            background: linear-gradient(180deg, var(--primary-color), transparent);
            pointer-events: none;
            z-index: 1999;
            opacity: 0;
        `;
        
        document.body.appendChild(pillar);
        
        // Animate pillar
        gsap.to(pillar, {
            height: '100vh',
            opacity: 0.6,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(pillar, {
                    opacity: 0,
                    duration: 0.3,
                    delay: 0.2,
                    onComplete: () => pillar.remove()
                });
            }
        });
    }
    
    handlePriceFilter(e) {
        const value = parseInt(e.target.value);
        const display = document.getElementById('priceDisplay');
        
        // Update display with odometer effect
        const maxPrice = this.formatPrice(value);
        display.querySelector('.price-max').textContent = maxPrice;
        
        // Update active filters
        this.activeFilters.maxPrice = value;
        
        // Create particle stream effect
        this.createParticleStream(e.target);
    }
    
    createParticleStream(slider) {
        const rect = slider.getBoundingClientRect();
        const handle = slider.parentElement.querySelector('.slider-handle');
        
        // Create particles flowing from handle
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                border-radius: 50%;
                background: var(--primary-color);
                pointer-events: none;
                left: ${rect.left + (slider.value / 1000000) * rect.width}px;
                top: ${rect.top}px;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                y: -100,
                x: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    }
    
    updateSliderValue(e, displayId, unit) {
        const value = parseFloat(e.target.value);
        const display = document.getElementById(displayId);
        
        if (unit === 's') {
            display.textContent = `${value.toFixed(1)}${unit}`;
            this.activeFilters.minAcceleration = 10 - value; // Convert to minimum acceleration
        } else {
            display.textContent = `${value}${unit}`;
            
            if (unit === 'HP') this.activeFilters.minPower = value;
            if (unit === 'mi') this.activeFilters.minRange = value;
        }
    }
    
    applyFilters() {
        // Filter vehicles based on active filters
        this.filteredVehicles = this.vehicles.filter(vehicle => {
            // Category filter
            if (this.activeFilters.category !== 'all' && 
                vehicle.category.toLowerCase() !== this.activeFilters.category) {
                return false;
            }
            
            // Price filter
            if (vehicle.price > this.activeFilters.maxPrice) {
                return false;
            }
            
            // Acceleration filter (convert from 0-60 time)
            const accelTime = parseFloat(vehicle.specs.acceleration);
            if (accelTime > this.activeFilters.minAcceleration) {
                return false;
            }
            
            // Power filter
            const power = parseInt(vehicle.specs.power);
            if (power < this.activeFilters.minPower) {
                return false;
            }
            
            // Range filter
            const range = parseInt(vehicle.specs.range);
            if (range < this.activeFilters.minRange) {
                return false;
            }
            
            return true;
        });
        
        // Sort vehicles
        this.sortVehicles();
        
        // Update active filters display
        this.updateActiveFiltersDisplay();
        
        // Update vehicle count
        document.getElementById('vehicleCount').textContent = this.filteredVehicles.length;
        document.getElementById('filterCount').textContent = this.countActiveFilters();
        
        // Render filtered vehicles
        this.renderVehicleGrid();
        
        // Play filter sound
        this.playSound('filterSound');
    }
    
    sortVehicles() {
        switch(this.sortBy) {
            case 'name':
                this.filteredVehicles.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.filteredVehicles.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredVehicles.sort((a, b) => b.price - a.price);
                break;
            case 'acceleration':
                this.filteredVehicles.sort((a, b) => 
                    parseFloat(a.specs.acceleration) - parseFloat(b.specs.acceleration)
                );
                break;
            case 'power':
                this.filteredVehicles.sort((a, b) => 
                    parseInt(b.specs.power) - parseInt(a.specs.power)
                );
                break;
        }
    }
    
    countActiveFilters() {
        let count = 0;
        if (this.activeFilters.category !== 'all') count++;
        if (this.activeFilters.maxPrice < 1000000) count++;
        if (this.activeFilters.minAcceleration > 0) count++;
        if (this.activeFilters.minPower > 0) count++;
        if (this.activeFilters.minRange > 0) count++;
        return count;
    }
    
    updateActiveFiltersDisplay() {
        const container = document.querySelector('.filters-list');
        container.innerHTML = '';
        
        // Add category filter
        if (this.activeFilters.category !== 'all') {
            this.addActiveFilter('Category', this.activeFilters.category.toUpperCase(), 'category');
        }
        
        // Add price filter
        if (this.activeFilters.maxPrice < 1000000) {
            this.addActiveFilter('Max Price', this.formatPrice(this.activeFilters.maxPrice), 'price');
        }
        
        // Add performance filters
        if (this.activeFilters.minAcceleration > 0) {
            this.addActiveFilter('Min Accel', `${(10 - this.activeFilters.minAcceleration).toFixed(1)}s`, 'accel');
        }
        
        if (this.activeFilters.minPower > 0) {
            this.addActiveFilter('Min Power', `${this.activeFilters.minPower}HP`, 'power');
        }
        
        if (this.activeFilters.minRange > 0) {
            this.addActiveFilter('Min Range', `${this.activeFilters.minRange}mi`, 'range');
        }
    }
    
    addActiveFilter(label, value, type) {
        const filter = document.createElement('div');
        filter.className = 'active-filter';
        filter.dataset.type = type;
        filter.innerHTML = `
            <span>${label}: ${value}</span>
            <i class="fas fa-times" data-type="${type}"></i>
        `;
        
        filter.querySelector('i').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFilter(type);
        });
        
        document.querySelector('.filters-list').appendChild(filter);
    }
    
    removeFilter(type) {
        switch(type) {
            case 'category':
                this.activeFilters.category = 'all';
                document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');
                document.querySelectorAll('.filter-tag:not([data-filter="all"])').forEach(tag => {
                    tag.classList.remove('active');
                });
                break;
            case 'price':
                this.activeFilters.maxPrice = 1000000;
                document.getElementById('priceSlider').value = 1000000;
                document.getElementById('priceDisplay').querySelector('.price-max').textContent = '$1,000,000';
                break;
            case 'accel':
                this.activeFilters.minAcceleration = 0;
                document.getElementById('accelSlider').value = 10;
                document.getElementById('accelValue').textContent = '10.0s';
                break;
            case 'power':
                this.activeFilters.minPower = 0;
                document.getElementById('powerSlider').value = 2000;
                document.getElementById('powerValue').textContent = '2000 HP';
                break;
            case 'range':
                this.activeFilters.minRange = 0;
                document.getElementById('rangeSlider').value = 1000;
                document.getElementById('rangeValue').textContent = '1000 mi';
                break;
        }
        
        this.applyFilters();
        this.playSound('filterSound');
    }
    
    clearAllFilters() {
        // Reset all filters
        this.activeFilters = {
            category: 'all',
            maxPrice: 1000000,
            minAcceleration: 0,
            minPower: 0,
            minRange: 0
        };
        
        // Reset UI
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');
        
        document.getElementById('priceSlider').value = 1000000;
        document.getElementById('priceDisplay').querySelector('.price-max').textContent = '$1,000,000';
        
        document.getElementById('accelSlider').value = 10;
        document.getElementById('accelValue').textContent = '10.0s';
        
        document.getElementById('powerSlider').value = 2000;
        document.getElementById('powerValue').textContent = '2000 HP';
        
        document.getElementById('rangeSlider').value = 1000;
        document.getElementById('rangeValue').textContent = '1000 mi';
        
        // Apply filters
        this.applyFilters();
        
        // Play sound
        this.playSound('filterSound');
    }
    
    toggleViewMode(e, button) {
        e.preventDefault();
        this.viewMode = button.dataset.view;
        
        // Update active class
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Update grid display
        const grid = document.getElementById('vehicleGrid');
        grid.className = this.viewMode === 'grid' ? 'vehicle-grid' : 'vehicle-list';
        
        // Re-render vehicles
        this.renderVehicleGrid();
    }
    
    renderVehicleGrid() {
        const container = document.getElementById('vehicleGrid');
        const noResults = document.getElementById('noResults');
        


            // TEST: Show raw data first
    container.innerHTML = `<div style="color: white; padding: 20px;">
        <h3>Debug Info</h3>
        <p>Total vehicles: ${this.vehicles.length}</p>
        <p>Filtered vehicles: ${this.filteredVehicles.length}</p>
        <p>First vehicle name: ${this.vehicles[0]?.name || 'No vehicles found'}</p>
    </div>`;

    
        // Show/hide no results message
        if (this.filteredVehicles.length === 0) {
            container.style.display = 'none';
            noResults.style.display = 'block';
            return;
        } else {
            container.style.display = 'grid';
            noResults.style.display = 'none';
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Create vehicle cards
        this.filteredVehicles.forEach((vehicle, index) => {
            const card = this.createVehicleCard(vehicle, index);
            container.appendChild(card);
            
            // Add animation for newly filtered cards
            if (this.filteredVehicles.length !== this.vehicles.length) {
                gsap.from(card, {
                    opacity: 0,
                    scale: 0.8,
                    rotateY: -180,
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: "back.out(1.7)"
                });
            }
        });
    }
    
    createVehicleCard(vehicle, index) {
        const card = document.createElement('div');
        card.className = `vehicle-card ${this.selectedVehicles.has(vehicle.id) ? 'selected' : ''}`;
        card.dataset.id = vehicle.id;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-glow"></div>
            <div class="card-image">
                <img src="assets/images/${vehicle.imageSet[0]}" alt="${vehicle.name}" loading="lazy">
                <div class="card-badge">${vehicle.category}</div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${vehicle.name}</h3>
                    <div class="card-price">
                        <div class="price-amount">${this.formatPrice(vehicle.price)}</div>
                        <div class="price-label">CREDITS</div>
                    </div>
                </div>
                <p class="card-description">${vehicle.description}</p>
                <div class="card-specs">
                    <div class="spec-item">
                        <span class="spec-value">${vehicle.specs.acceleration}</span>
                        <span class="spec-label">0-60</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-value">${vehicle.specs.power}</span>
                        <span class="spec-label">POWER</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-value">${vehicle.specs.range}</span>
                        <span class="spec-label">RANGE</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn view-btn" data-action="view">
                        <i class="fas fa-eye"></i>
                        VIEW
                    </button>
                    <button class="action-btn inquiry" data-action="inquiry">
                        <i class="fas fa-satellite-dish"></i>
                        INQUIRY
                    </button>
                </div>
            </div>
        `;
        
        // Add hover effect
        card.addEventListener('mouseenter', () => this.enhanceCardHover(card));
        card.addEventListener('mouseleave', () => this.resetCardHover(card));
        
        return card;
    }
    
    enhanceCardHover(card) {
        // Add tilt effect
        card.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
        
        // Enhance glow
        const glow = card.querySelector('.card-glow');
        gsap.to(glow, {
            opacity: 0.6,
            duration: 0.3
        });
        
        // Attract particles to card
        this.attractParticlesToCard(card);
    }
    
    resetCardHover(card) {
        card.style.transform = '';
        
        const glow = card.querySelector('.card-glow');
        gsap.to(glow, {
            opacity: 0,
            duration: 0.3
        });
    }
    
    attractParticlesToCard(card) {
        // Store card position for particle attraction
        this.hoveredCard = card;
        
        // Create particle halo
        const rect = card.getBoundingClientRect();
        const halo = document.createElement('div');
        halo.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            border-radius: 20px;
            border: 2px solid rgba(0, 243, 255, 0.3);
            pointer-events: none;
            z-index: 2;
            opacity: 0;
        `;
        
        document.body.appendChild(halo);
        
        gsap.to(halo, {
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
                gsap.to(halo, {
                    opacity: 0,
                    duration: 0.3,
                    delay: 0.2,
                    onComplete: () => halo.remove()
                });
            }
        });
    }
    
    handleCardClick(e) {
        const card = e.target.closest('.vehicle-card');
        if (!card) return;
        
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            const vehicleId = card.dataset.id;
            const vehicle = this.filteredVehicles.find(v => v.id === vehicleId);
            
            if (action === 'view') {
                this.viewVehicle(vehicle);
            } else if (action === 'inquiry') {
                this.initiateInquiry(vehicle);
            }
            return;
        }
        
        // Check for Ctrl/Cmd click for comparison
        if (e.ctrlKey || e.metaKey) {
            this.toggleVehicleForComparison(card);
        } else {
            this.isolateVehicle(card);
        }
    }
    
    toggleVehicleForComparison(card) {
        const vehicleId = card.dataset.id;
        
        if (this.selectedVehicles.has(vehicleId)) {
            this.selectedVehicles.delete(vehicleId);
            card.classList.remove('selected');
        } else {
            if (this.selectedVehicles.size >= 3) {
                this.showNotification('Maximum 3 vehicles for comparison', 'error');
                return;
            }
            this.selectedVehicles.add(vehicleId);
            card.classList.add('selected');
            this.playSound('selectSound');
        }
        
        // Update comparison mode UI
        this.updateComparisonMode();
    }
    
    updateComparisonMode() {
        const comparisonMode = document.getElementById('comparisonMode');
        const compareCount = document.getElementById('compareCount');
        const comparisonVehicles = document.getElementById('comparisonVehicles');
        
        compareCount.textContent = this.selectedVehicles.size;
        
        if (this.selectedVehicles.size >= 2) {
            comparisonMode.classList.add('active');
            
            // Update comparison vehicles list
            comparisonVehicles.innerHTML = '';
            this.selectedVehicles.forEach(id => {
                const vehicle = this.vehicles.find(v => v.id === id);
                if (vehicle) {
                    const compact = this.createCompactVehicle(vehicle);
                    comparisonVehicles.appendChild(compact);
                }
            });
        } else {
            comparisonMode.classList.remove('active');
        }
    }
    
    createCompactVehicle(vehicle) {
        const div = document.createElement('div');
        div.className = 'compact-vehicle';
        div.dataset.id = vehicle.id;
        
        div.innerHTML = `
            <img src="assets/images/${vehicle.imageSet[0]}" alt="${vehicle.name}" class="compact-image">
            <div class="compact-name">${vehicle.name}</div>
            <div class="compact-price">${this.formatPrice(vehicle.price)}</div>
            <button class="remove-compare">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        div.querySelector('.remove-compare').addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectedVehicles.delete(vehicle.id);
            document.querySelector(`.vehicle-card[data-id="${vehicle.id}"]`).classList.remove('selected');
            this.updateComparisonMode();
        });
        
        return div;
    }
    
    isolateVehicle(card) {
        const vehicleId = card.dataset.id;
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) return;
        
        // Show isolation overlay
        const overlay = document.getElementById('isolationOverlay');
        const isolatedDiv = document.getElementById('isolatedVehicle');
        
        // Populate isolated vehicle details
        isolatedDiv.innerHTML = `
            <button class="close-isolation">
                <i class="fas fa-times"></i>
            </button>
            <div class="isolated-content">
                <div class="isolated-image">
                    <img src="assets/images/${vehicle.imageSet[0]}" alt="${vehicle.name}">
                </div>
                <div class="isolated-details">
                    <h2>${vehicle.name}</h2>
                    <div class="isolated-category">${vehicle.category}</div>
                    <div class="isolated-price">${this.formatPrice(vehicle.price)} CREDITS</div>
                    <p class="isolated-description">${vehicle.description}</p>
                    <div class="isolated-specs">
                        ${Object.entries(vehicle.specs).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-key">${key.toUpperCase()}</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="isolated-action" data-id="${vehicle.id}">
                        <i class="fas fa-satellite-dish"></i>
                        INITIATE INQUIRY
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        isolatedDiv.querySelector('.close-isolation').addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        
        isolatedDiv.querySelector('.isolated-action').addEventListener('click', () => {
            this.initiateInquiry(vehicle);
        });
        
        // Show overlay with animation
        overlay.style.display = 'block';
        gsap.fromTo(isolatedDiv,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
        // Dim other content
        document.querySelectorAll('.vehicle-card').forEach(c => {
            if (c !== card) {
                gsap.to(c, {
                    opacity: 0.3,
                    filter: 'blur(5px)',
                    duration: 0.3
                });
            }
        });
        
        // Create holographic spec projection
        this.createHolographicProjection(card, vehicle);
    }
    
    createHolographicProjection(card, vehicle) {
        const rect = card.getBoundingClientRect();
        const projection = document.createElement('div');
        projection.className = 'holographic-projection';
        
        projection.style.cssText = `
            position: fixed;
            left: ${rect.right + 20}px;
            top: ${rect.top}px;
            background: rgba(0, 243, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(0, 243, 255, 0.3);
            border-radius: 15px;
            padding: 20px;
            z-index: 1500;
            transform: translateX(20px);
            opacity: 0;
        `;
        
        projection.innerHTML = `
            <h4>${vehicle.name}</h4>
            <div class="projection-specs">
                ${Object.entries(vehicle.specs).map(([key, value]) => `
                    <div class="projection-spec">
                        <span>${key}:</span>
                        <strong>${value}</strong>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(projection);
        
        // Animate projection
        gsap.to(projection, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Remove on isolation close
        const overlay = document.getElementById('isolationOverlay');
        const observer = new MutationObserver(() => {
            if (overlay.style.display === 'none') {
                gsap.to(projection, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => projection.remove()
                });
                observer.disconnect();
            }
        });
        
        observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });
    }
    
    executeComparison() {
        if (this.selectedVehicles.size < 2) {
            this.showNotification('Select at least 2 vehicles to compare', 'error');
            return;
        }
        
        this.playSound('compareSound');
        
        // Get selected vehicles
        const selectedVehicles = Array.from(this.selectedVehicles).map(id => 
            this.vehicles.find(v => v.id === id)
        );
        
        // Show comparison modal
        const modal = document.getElementById('comparisonModal');
        modal.style.display = 'block';
        
        // Generate comparison table
        this.generateComparisonTable(selectedVehicles);
        
        // Generate charts
        this.generateComparisonCharts(selectedVehicles);
        
        // Animate modal in
        gsap.fromTo('.comparison-modal .modal-container',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
    
    generateComparisonTable(vehicles) {
        const table = document.getElementById('comparisonTable');
        table.innerHTML = '';
        
        // Define comparison fields
        const fields = [
            { label: 'VEHICLE', key: 'name', type: 'text' },
            { label: 'CATEGORY', key: 'category', type: 'text' },
            { label: 'PRICE', key: 'price', type: 'price' },
            { label: 'ACCELERATION', key: 'specs.acceleration', type: 'spec' },
            { label: 'POWER', key: 'specs.power', type: 'spec' },
            { label: 'RANGE', key: 'specs.range', type: 'spec' },
            { label: 'TOP SPEED', key: 'specs.topSpeed', type: 'spec' },
            { label: 'TORQUE', key: 'specs.torque', type: 'spec' }
        ];
        
        // Create header row
        const headerRow = document.createElement('div');
        headerRow.className = 'comparison-row';
        headerRow.innerHTML = `
            <div class="comparison-cell header">SPECIFICATION</div>
            ${vehicles.map(v => `<div class="comparison-cell header">${v.name}</div>`).join('')}
        `;
        table.appendChild(headerRow);
        
        // Create data rows
        fields.forEach(field => {
            const row = document.createElement('div');
            row.className = 'comparison-row';
            
            let cells = `<div class="comparison-cell spec-name">${field.label}</div>`;
            
            vehicles.forEach(vehicle => {
                let value = this.getNestedValue(vehicle, field.key);
                
                if (field.type === 'price') {
                    value = this.formatPrice(value);
                }
                
                cells += `<div class="comparison-cell spec-value">${value || 'N/A'}</div>`;
            });
            
            row.innerHTML = cells;
            table.appendChild(row);
        });
    }
    
    generateComparisonCharts(vehicles) {
        // Performance Chart
        const perfCtx = document.getElementById('performanceChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }
        
        this.performanceChart = new Chart(perfCtx, {
            type: 'radar',
            data: {
                labels: ['Acceleration', 'Power', 'Range', 'Price Value', 'Technology'],
                datasets: vehicles.map((vehicle, index) => ({
                    label: vehicle.name,
                    data: [
                        10 - parseFloat(vehicle.specs.acceleration), // Lower is better
                        parseInt(vehicle.specs.power) / 200, // Scale down
                        parseInt(vehicle.specs.range) / 100, // Scale down
                        1000000 / vehicle.price, // Higher price = lower value
                        0.7 + Math.random() * 0.3 // Simulated tech score
                    ],
                    backgroundColor: `rgba(${index * 80}, 243, 255, 0.2)`,
                    borderColor: `rgba(${index * 80}, 243, 255, 1)`,
                    borderWidth: 2,
                    pointBackgroundColor: `rgba(${index * 80}, 243, 255, 1)`
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#00f3ff',
                            font: {
                                family: 'Courier New'
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: 'rgba(0, 243, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 243, 255, 0.2)'
                        },
                        pointLabels: {
                            color: '#00f3ff'
                        },
                        ticks: {
                            color: '#00f3ff',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
        
        // Value Chart
        const valueCtx = document.getElementById('valueChart').getContext('2d');
        
        if (this.valueChart) {
            this.valueChart.destroy();
        }
        
        this.valueChart = new Chart(valueCtx, {
            type: 'bar',
            data: {
                labels: vehicles.map(v => v.name),
                datasets: [
                    {
                        label: 'Price (in $100K)',
                        data: vehicles.map(v => v.price / 100000),
                        backgroundColor: 'rgba(0, 243, 255, 0.6)',
                        borderColor: 'rgba(0, 243, 255, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Power/Price Ratio',
                        data: vehicles.map(v => parseInt(v.specs.power) / (v.price / 1000)),
                        backgroundColor: 'rgba(157, 78, 221, 0.6)',
                        borderColor: 'rgba(157, 78, 221, 1)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#00f3ff',
                            font: {
                                family: 'Courier New'
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#00f3ff'
                        },
                        grid: {
                            color: 'rgba(0, 243, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#00f3ff'
                        },
                        grid: {
                            color: 'rgba(0, 243, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    clearComparison() {
        this.selectedVehicles.clear();
        document.querySelectorAll('.vehicle-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
        this.updateComparisonMode();
        this.playSound('filterSound');
    }
    
    viewVehicle(vehicle) {
        // Redirect to vehicle detail page
        window.location.href = `vehicle.html?id=${vehicle.id}`;
    }
    
    initiateInquiry(vehicle) {
        // Open inquiry modal with vehicle info
        this.openInquiryModal(vehicle);
    }
    
    openInquiryModal(vehicle = null) {
        const modal = document.getElementById('inquiryModal');
        modal.style.display = 'block';
        
        // Populate vehicle info if provided
        if (vehicle) {
            // This would populate the inquiry form with vehicle details
            console.log('Initiating inquiry for:', vehicle.name);
        }
        
        // Animate modal in
        gsap.fromTo('.inquiry-modal .modal-container',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
    
    closeModal(button) {
        const modal = button.closest('.modal');
        if (modal) {
            gsap.to(modal.querySelector('.modal-container'), {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    handleMouseMove(e) {
        // Update mouse position for grid interaction
        this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    
    handleKeyboardShortcuts(e) {
        // Escape key closes modals/isolation
        if (e.key === 'Escape') {
            const overlay = document.getElementById('isolationOverlay');
            if (overlay.style.display === 'block') {
                overlay.style.display = 'none';
            }
            
            const modal = document.querySelector('.modal[style*="display: block"]');
            if (modal) {
                modal.style.display = 'none';
            }
        }
        
        // Ctrl+A selects all vehicles for comparison (for demo)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            this.selectedVehicles = new Set(this.vehicles.map(v => v.id));
            this.updateComparisonMode();
            document.querySelectorAll('.vehicle-card').forEach(card => {
                card.classList.add('selected');
            });
        }
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((o, p) => o && o[p], obj);
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound play failed:", e));
        }
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(255, 0, 110, 0.1)' : 'rgba(0, 243, 255, 0.1)'};
            border: 1px solid ${type === 'error' ? 'var(--accent-color)' : 'var(--primary-color)'};
            color: ${type === 'error' ? 'var(--accent-color)' : 'var(--primary-color)'};
            padding: 15px 25px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            z-index: 3000;
            transform: translateX(100%);
            opacity: 0;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        gsap.to(notification, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        
        // Remove after delay
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }
    
    animateScanningBeam() {
        const beam = document.querySelector('.scanning-beam');
        if (beam) {
            gsap.to(beam, {
                backgroundPosition: '400px 0',
                duration: 3,
                repeat: -1,
                ease: "none"
            });
        }
    }
    
    animateIndicators() {
        // Animate the indicator bars
        setInterval(() => {
            const particleFlow = document.getElementById('particleFlow');
            const dataStream = document.getElementById('dataStream');
            
            if (particleFlow) {
                particleFlow.style.width = `${70 + Math.random() * 30}%`;
            }
            
            if (dataStream) {
                dataStream.style.width = `${80 + Math.random() * 20}%`;
            }
        }, 2000);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate grid elements
        if (this.grid) {
            const time = Date.now() * 0.001;
            
            this.grid.children.forEach(child => {
                if (child instanceof THREE.Mesh && child.userData.originalY !== undefined) {
                    // Float nodes
                    child.position.y = child.userData.originalY + 
                        Math.sin(time * child.userData.speed + child.userData.phase) * 5;
                    
                    // Pulse opacity
                    child.material.opacity = 0.1 + 
                        Math.sin(time * 2 + child.userData.phase) * 0.1;
                }
                
                // Grid distortion based on mouse position
                if (this.mouseX !== undefined && this.mouseY !== undefined) {
                    const distX = child.position.x - (this.mouseX * 50);
                    const distZ = child.position.z - (this.mouseY * 50);
                    const distance = Math.sqrt(distX * distX + distZ * distZ);
                    
                    if (distance < 30) {
                        const force = (30 - distance) / 30;
                        child.position.y = Math.sin(time * 3) * force * 5;
                        child.material.opacity = 0.05 + force * 0.1;
                    }
                }
            });
        }
        
        // Animate particles
        if (this.particles && this.particles.geometry.attributes.position) {
            const positions = this.particles.geometry.attributes.position.array;
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Gentle floating motion
                positions[i] += Math.sin(time + i) * 0.01;
                positions[i + 1] += Math.cos(time + i) * 0.01;
                positions[i + 2] += Math.sin(time * 0.5 + i) * 0.005;
                
                // Attract to hovered card
                if (this.hoveredCard) {
                    const rect = this.hoveredCard.getBoundingClientRect();
                    const centerX = (rect.left + rect.width / 2) / window.innerWidth * 300 - 150;
                    const centerY = -(rect.top + rect.height / 2) / window.innerHeight * 300 + 150;
                    
                    const dx = centerX - positions[i];
                    const dy = centerY - positions[i + 1];
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 50) {
                        positions[i] += dx * 0.02;
                        positions[i + 1] += dy * 0.02;
                    }
                }
                
                // Wrap around
                if (positions[i] > 150) positions[i] = -150;
                if (positions[i] < -150) positions[i] = 150;
                if (positions[i + 1] > 150) positions[i + 1] = -150;
                if (positions[i + 1] < -150) positions[i + 1] = 150;
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate scanning lasers
        this.lasers.forEach(laser => {
            laser.userData.timer++;
            
            if (laser.userData.timer > 200) {
                laser.userData.active = true;
                laser.userData.timer = 0;
                
                // Animate laser on
                gsap.to(laser.material, {
                    opacity: 0.6,
                    duration: 0.3,
                    onComplete: () => {
                        // Animate laser off
                        gsap.to(laser.material, {
                            opacity: 0,
                            duration: 0.3,
                            delay: 0.5,
                            onComplete: () => {
                                laser.userData.active = false;
                            }
                        });
                    }
                });
            }
            
            // Move laser
            if (laser.userData.active) {
                laser.position.x += laser.userData.direction * 0.5;
                
                // Reverse direction at bounds
                if (laser.position.x > 100 || laser.position.x < -100) {
                    laser.userData.direction *= -1;
                }
            }
        });
        
        // Rotate grid slowly
        if (this.grid) {
            this.grid.rotation.y += 0.0002;
            this.grid.rotation.x = Math.sin(time * 0.1) * 0.05;
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load car data if not already loaded
    if (typeof nexusInventory === 'undefined') {
        console.error('cars_data.js not loaded');
        return;
    }
    
    // Initialize the inventory application
    window.inventoryApp = new NexusInventory();
    
    // Add initial animations
    gsap.from('.filter-matrix', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.2,
        ease: "power2.out"
    });
    
    gsap.from('.vehicle-matrix', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.4,
        ease: "power2.out"
    });
});