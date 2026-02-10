// NEXUS VEHICULAR - Index Page Script
class NexusIndex {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.grid = null;
        this.nebula = null;
        
        this.orb = null;
        this.isDragging = false;
        this.orbOffsetX = 0;
        this.orbOffsetY = 0;
        
        this.currentVehicleIndex = 0;
        this.vehicleInterval = null;
        this.isWireframeVisible = false;
        
        this.particleCount = 0;
        this.energyFlow = 100;
        
        this.init();
    }
    
    init() {
        this.setupThreeJS();
        this.setupEventListeners();
        this.loadFeaturedVehicles();
        this.startVehicleRotation();
        this.updateMatrixStatus();
        this.setupCustomCursor();
        
        // Initial animations
        this.animateLogoParticles();
        this.animateNavParticles();
    }
    
    setupThreeJS() {
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('backgroundCanvas'),
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create background elements
        this.createHexagonalGrid();
        this.createNebula();
        this.createParticleStream();
        this.createScanningLasers();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createHexagonalGrid() {
        const gridGroup = new THREE.Group();
        
        // Create hexagonal grid pattern
        const hexGeometry = new THREE.CircleGeometry(0.5, 6);
        const hexMaterial = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide
        });
        
        const gridSize = 100;
        const hexSpacing = 5;
        
        for (let x = -gridSize; x <= gridSize; x += hexSpacing) {
            for (let z = -gridSize; z <= gridSize; z += hexSpacing) {
                const hex = new THREE.Mesh(hexGeometry, hexMaterial);
                hex.position.set(x, 0, z);
                
                // Stagger every other row
                if (Math.abs(z) % (hexSpacing * 2) === hexSpacing) {
                    hex.position.x += hexSpacing / 2;
                }
                
                gridGroup.add(hex);
            }
        }
        
        this.grid = gridGroup;
        this.scene.add(this.grid);
        
        // Add connecting lines
        this.createGridLines();
    }
    
    createGridLines() {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.02
        });
        
        const gridSize = 100;
        const spacing = 5;
        
        // Horizontal lines
        for (let z = -gridSize; z <= gridSize; z += spacing) {
            const points = [];
            points.push(new THREE.Vector3(-gridSize, 0, z));
            points.push(new THREE.Vector3(gridSize, 0, z));
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            this.grid.add(line);
        }
        
        // Diagonal lines (for hexagon effect)
        for (let x = -gridSize; x <= gridSize; x += spacing) {
            const points = [];
            const offset = (Math.abs(x) % (spacing * 2) === spacing) ? spacing / 2 : 0;
            points.push(new THREE.Vector3(x, 0, -gridSize + offset));
            points.push(new THREE.Vector3(x, 0, gridSize + offset));
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            this.grid.add(line);
        }
    }
    
    createNebula() {
        // Create nebula cloud with shader
        const nebulaGeometry = new THREE.SphereGeometry(80, 64, 64);
        
        const nebulaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                color1: { value: new THREE.Color(0x001144) },
                color2: { value: new THREE.Color(0x330066) },
                color3: { value: new THREE.Color(0x6600cc) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    
                    return mix(a, b, u.x) + 
                           (c - a) * u.y * (1.0 - u.x) + 
                           (d - b) * u.x * u.y;
                }
                
                void main() {
                    vec2 st = vUv * 3.0;
                    float n = noise(st + time * 0.1);
                    
                    vec3 color = mix(color1, color2, n);
                    color = mix(color, color3, n * 0.5);
                    
                    // Add some twinkling stars
                    float stars = 0.0;
                    for(int i = 0; i < 5; i++) {
                        vec2 starPos = vec2(
                            random(vec2(float(i), 0.0)),
                            random(vec2(0.0, float(i)))
                        );
                        float starDist = distance(vUv, starPos);
                        stars += smoothstep(0.02, 0.0, starDist) * random(vec2(float(i), 1.0));
                    }
                    
                    color += vec3(stars * 0.3);
                    
                    // Vignette effect
                    float dist = distance(vUv, vec2(0.5));
                    float vignette = 1.0 - smoothstep(0.3, 0.7, dist);
                    
                    gl_FragColor = vec4(color * vignette, 0.15);
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });
        
        this.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        this.scene.add(this.nebula);
    }
    
    createParticleStream() {
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Random positions
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;
            
            // Cyan/white colors
            colors[i] = 0.0;     // R
            colors[i + 1] = 0.8 + Math.random() * 0.2; // G
            colors[i + 2] = 1.0; // B
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);
    }
    
    createScanningLasers() {
        // Create occasional scanning lasers
        this.lasers = [];
        
        for (let i = 0; i < 2; i++) {
            const laserGeometry = new THREE.BoxGeometry(200, 0.5, 0.5);
            const laserMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                transparent: true,
                opacity: 0
            });
            
            const laser = new THREE.Mesh(laserGeometry, laserMaterial);
            laser.rotation.y = Math.PI / 4 * i;
            this.scene.add(laser);
            this.lasers.push({
                mesh: laser,
                active: false,
                timer: 0
            });
        }
    }
    
    setupEventListeners() {
        // Interactive Orb
        const orb = document.getElementById('interactiveOrb');
        orb.addEventListener('mousedown', this.startOrbDrag.bind(this));
        document.addEventListener('mousemove', this.dragOrb.bind(this));
        document.addEventListener('mouseup', this.stopOrbDrag.bind(this));
        
        // Touch events for mobile
        orb.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startOrbDrag(e.touches[0]);
        });
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.dragOrb(e.touches[0]);
        });
        document.addEventListener('touchend', this.stopOrbDrag.bind(this));
        
        // Navigation hover effects
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.attractParticlesToElement(item));
            item.addEventListener('mouseleave', () => this.releaseParticles());
        });
        
        // Featured vehicle controls
        document.querySelector('.prev-btn').addEventListener('click', () => this.previousVehicle());
        document.querySelector('.next-btn').addEventListener('click', () => this.nextVehicle());
        
        // Vehicle cards
        const vehicleContainer = document.getElementById('featuredVehicles');
        vehicleContainer.addEventListener('mouseenter', () => this.pauseVehicleRotation());
        vehicleContainer.addEventListener('mouseleave', () => this.resumeVehicleRotation());
        
        // Inquiry modal
        const inquiryBtn = document.querySelector('.nav-item[data-nav="contact"]');
        const modalClose = document.querySelector('.modal-close');
        const contactOptions = document.querySelectorAll('.contact-option');
        const submitBtn = document.getElementById('submitInquiry');
        
        inquiryBtn.addEventListener('click', () => this.openInquiryModal());
        modalClose.addEventListener('click', () => this.closeInquiryModal());
        
        contactOptions.forEach(option => {
            option.addEventListener('click', () => this.selectContactMethod(option));
        });
        
        submitBtn.addEventListener('click', () => this.submitInquiry());
        
        // Enter button hover
        const enterBtn = document.querySelector('.enter-button');
        enterBtn.addEventListener('mouseenter', () => this.playSound('hover'));
        enterBtn.addEventListener('click', () => this.playSound('click'));
    }
    
    setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        const interactiveElements = document.querySelectorAll('a, button, .nav-item, .vehicle-card, .interactive-orb, .contact-option');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
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
    
    startOrbDrag(e) {
        this.isDragging = true;
        const orb = document.getElementById('interactiveOrb');
        const rect = orb.getBoundingClientRect();
        
        this.orbOffsetX = e.clientX - rect.left - rect.width / 2;
        this.orbOffsetY = e.clientY - rect.top - rect.height / 2;
        
        orb.style.cursor = 'grabbing';
        this.playSound('click');
    }
    
    dragOrb(e) {
        if (!this.isDragging) return;
        
        const orb = document.getElementById('interactiveOrb');
        const container = orb.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate new position
        let x = e.clientX - containerRect.left - this.orbOffsetX;
        let y = e.clientY - containerRect.top - this.orbOffsetY;
        
        // Keep within bounds
        const maxX = containerRect.width / 2;
        const maxY = containerRect.height / 2;
        
        x = Math.max(-maxX, Math.min(maxX, x));
        y = Math.max(-maxY, Math.min(maxY, y));
        
        // Apply transform
        orb.style.transform = `translate(${x}px, ${y}px)`;
        
        // Distort grid based on orb position
        this.distortGrid(x / maxX, y / maxY);
        
        // Create trail effect
        this.createOrbTrail(x, y);
    }
    
    stopOrbDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const orb = document.getElementById('interactiveOrb');
        orb.style.cursor = 'grab';
        
        // Return orb to center with spring animation
        gsap.to(orb, {
            x: 0,
            y: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            onUpdate: () => {
                this.distortGrid(0, 0);
            }
        });
    }
    
    distortGrid(x, y) {
        // Distort the Three.js grid based on orb position
        if (!this.grid) return;
        
        const intensity = Math.sqrt(x * x + y * y);
        
        this.grid.children.forEach((child, index) => {
            if (child instanceof THREE.Mesh) {
                const originalX = child.position.x;
                const originalZ = child.position.z;
                
                const distX = originalX - (x * 50);
                const distZ = originalZ - (y * 50);
                const distance = Math.sqrt(distX * distX + distZ * distZ);
                
                const force = 10 / (distance + 1);
                const displacement = force * intensity;
                
                child.position.y = Math.sin(Date.now() * 0.001 + index) * displacement;
                
                // Adjust opacity based on distance
                const opacity = 0.05 + (force * 0.1);
                child.material.opacity = Math.min(opacity, 0.2);
            }
        });
    }
    
    createOrbTrail(x, y) {
        if (!this.isDragging) return;
        
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: radial-gradient(circle at center, rgba(0, 243, 255, 0.5), transparent 70%);
            pointer-events: none;
            left: 50%;
            top: 50%;
            transform: translate(${x}px, ${y}px);
            z-index: 1;
        `;
        
        document.querySelector('.orb-container').appendChild(trail);
        
        // Animate and remove
        gsap.to(trail, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            onComplete: () => trail.remove()
        });
    }
    
    attractParticlesToElement(element) {
        // Store element position for particle attraction
        this.attractionElement = element;
        this.attractionActive = true;
        
        // Create particle halo
        this.createParticleHalo(element);
        this.playSound('hover');
    }
    
    releaseParticles() {
        this.attractionActive = false;
        this.attractionElement = null;
    }
    
    createParticleHalo(element) {
        const rect = element.getBoundingClientRect();
        const halo = document.createElement('div');
        halo.className = 'particle-halo';
        halo.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            border-radius: 8px;
            border: 1px solid rgba(0, 243, 255, 0.3);
            pointer-events: none;
            z-index: 2;
        `;
        
        document.body.appendChild(halo);
        
        // Animate halo
        gsap.fromTo(halo,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3 }
        );
        
        gsap.to(halo, {
            scale: 1.2,
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            onComplete: () => halo.remove()
        });
    }
    
    animateLogoParticles() {
        const logoParticles = document.querySelector('.logo-particles');
        
        // Create particles around logo
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                border-radius: 50%;
                background: var(--primary-color);
                pointer-events: none;
                left: ${Math.random() * 150}px;
                top: ${Math.random() * 80}px;
            `;
            
            logoParticles.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                opacity: 0,
                duration: 2,
                repeat: -1,
                delay: i * 0.1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
    
    animateNavParticles() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const particleContainer = item.querySelector('.nav-particles');
            
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    pointer-events: none;
                    opacity: 0;
                `;
                
                particleContainer.appendChild(particle);
                
                // Animate on hover
                item.addEventListener('mouseenter', () => {
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    
                    gsap.to(particle, {
                        scale: 2,
                        opacity: 0.5,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                });
            }
        });
    }
    
    loadFeaturedVehicles() {
        const container = document.getElementById('featuredVehicles');
        const dotsContainer = document.getElementById('vehicleDots');
        
        if (!nexusInventory || nexusInventory.length === 0) {
            container.innerHTML = '<div class="no-vehicles">No vehicles available in the database.</div>';
            return;
        }
        
        // Get first 3 vehicles or all if less than 3
        const featuredVehicles = nexusInventory.slice(0, Math.min(3, nexusInventory.length));
        
        // Clear containers
        container.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        // Create vehicle cards
        featuredVehicles.forEach((vehicle, index) => {
            // Create card
            const card = document.createElement('div');
            card.className = `vehicle-card ${index === 0 ? 'active' : ''}`;
            card.dataset.index = index;
            card.dataset.vehicleId = vehicle.id;
            
            card.innerHTML = `
                <img src="assets/images/${vehicle.imageSet[0]}" alt="${vehicle.name}" class="vehicle-image">
                <div class="vehicle-info">
                    <h4 class="vehicle-name">${vehicle.name}</h4>
                    <span class="vehicle-category">${vehicle.category}</span>
                    <p class="vehicle-description">${vehicle.description}</p>
                    <div class="vehicle-specs">
                        <div class="spec-item">
                            <span class="spec-value">${vehicle.specs.power}</span>
                            <span class="spec-label">Power</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-value">${vehicle.specs.acceleration}</span>
                            <span class="spec-label">0-60</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-value">${vehicle.specs.range}</span>
                            <span class="spec-label">Range</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.showVehicleWireframe(vehicle);
                this.pauseVehicleRotation();
            });
            
            card.addEventListener('mouseleave', () => {
                this.hideVehicleWireframe();
                this.resumeVehicleRotation();
            });
            
            container.appendChild(card);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `vehicle-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            
            dot.addEventListener('click', () => {
                this.showVehicle(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Store current vehicles
        this.featuredVehicles = featuredVehicles;
        this.totalVehicles = featuredVehicles.length;
    }
    
    showVehicle(index) {
        // Update active classes
        const cards = document.querySelectorAll('.vehicle-card');
        const dots = document.querySelectorAll('.vehicle-dot');
        
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Scroll to vehicle
        const container = document.getElementById('featuredVehicles');
        const card = cards[index];
        const scrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
        
        gsap.to(container, {
            scrollLeft: scrollLeft,
            duration: 0.5,
            ease: "power2.out"
        });
        
        this.currentVehicleIndex = index;
        
        // Play sound
        this.playSound('click');
    }
    
    previousVehicle() {
        let newIndex = this.currentVehicleIndex - 1;
        if (newIndex < 0) newIndex = this.totalVehicles - 1;
        this.showVehicle(newIndex);
    }
    
    nextVehicle() {
        let newIndex = this.currentVehicleIndex + 1;
        if (newIndex >= this.totalVehicles) newIndex = 0;
        this.showVehicle(newIndex);
    }
    
    startVehicleRotation() {
        this.vehicleInterval = setInterval(() => {
            if (!this.isWireframeVisible) {
                this.nextVehicle();
            }
        }, 5000); // Rotate every 5 seconds
    }
    
    pauseVehicleRotation() {
        if (this.vehicleInterval) {
            clearInterval(this.vehicleInterval);
            this.vehicleInterval = null;
        }
    }
    
    resumeVehicleRotation() {
        if (!this.vehicleInterval) {
            this.startVehicleRotation();
        }
    }
    
    showVehicleWireframe(vehicle) {
        this.isWireframeVisible = true;
        
        const overlay = document.getElementById('wireframeOverlay');
        const specs = overlay.querySelector('.wireframe-specs');
        
        // Update specs
        specs.querySelector('[data-spec="power"] .spec-value').textContent = vehicle.specs.power;
        specs.querySelector('[data-spec="acceleration"] .spec-value').textContent = vehicle.specs.acceleration;
        specs.querySelector('[data-spec="range"] .spec-value').textContent = vehicle.specs.range;
        
        // Show overlay
        gsap.to(overlay, {
            opacity: 1,
            duration: 0.5
        });
        
        // Animate wireframe grid
        const grid = overlay.querySelector('.wireframe-grid');
        gsap.fromTo(grid,
            { backgroundPosition: '0 0' },
            {
                backgroundPosition: '50px 50px',
                duration: 2,
                repeat: -1,
                ease: "none"
            }
        );
    }
    
    hideVehicleWireframe() {
        this.isWireframeVisible = false;
        
        const overlay = document.getElementById('wireframeOverlay');
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.5
        });
    }
    
    updateMatrixStatus() {
        // Update particle count
        this.particleCount = Math.floor(Math.random() * 1000) + 500;
        document.getElementById('particleCount').textContent = this.particleCount;
        
        // Update energy flow (simulated)
        setInterval(() => {
            const change = (Math.random() - 0.5) * 10;
            this.energyFlow = Math.max(50, Math.min(100, this.energyFlow + change));
            document.getElementById('energyFlow').textContent = `${Math.round(this.energyFlow)}%`;
        }, 2000);
    }
    
    openInquiryModal() {
        const modal = document.getElementById('inquiryModal');
        modal.style.display = 'block';
        
        // Animate modal in
        gsap.fromTo('.modal-container',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
        // Animate conduit
        this.animateConduit();
    }
    
    closeInquiryModal() {
        const modal = document.getElementById('inquiryModal');
        
        // Animate modal out
        gsap.to('.modal-container', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modal.style.display = 'none';
            }
        });
        
        this.playSound('click');
    }
    
    animateConduit() {
        const particles = document.querySelector('.conduit-particles');
        particles.innerHTML = '';
        
        // Create conduit particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--primary-color);
                left: ${Math.random() * 100}%;
                top: 50%;
                transform: translateY(-50%);
                opacity: 0;
            `;
            
            particles.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 1,
                duration: 1,
                delay: i * 0.05,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
    
    selectContactMethod(option) {
        // Remove active class from all options
        document.querySelectorAll('.contact-option').forEach(opt => {
            opt.style.borderColor = '';
            opt.querySelector('.option-icon').style.color = '';
        });
        
        // Add active styling to selected option
        option.style.borderColor = 'var(--primary-color)';
        option.querySelector('.option-icon').style.color = 'var(--accent-color)';
        
        this.selectedContactMethod = option.dataset.method;
        this.playSound('click');
    }
    
    submitInquiry() {
        const userName = document.getElementById('userName').value;
        const userContact = document.getElementById('userContact').value;
        
        if (!userName || !userContact) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!this.selectedContactMethod) {
            this.showNotification('Please select a contact method', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submitInquiry');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoader = submitBtn.querySelector('.submit-loader');
        
        submitText.style.opacity = '0.5';
        submitLoader.style.display = 'flex';
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            submitText.style.opacity = '1';
            submitLoader.style.display = 'none';
            
            // Generate message
            const currentVehicle = this.featuredVehicles[this.currentVehicleIndex];
            const message = `Hello Nexus Vehicular,\n\nI'm interested in the ${currentVehicle.name} (${currentVehicle.id}).\n\nPlease contact me at ${userContact}.\n\nBest regards,\n${userName}`;
            
            // Open selected contact method
            this.openContactApp(message, userContact);
            
            // Close modal
            this.closeInquiryModal();
            
            // Show success notification
            this.showNotification('Conduit opened successfully', 'success');
        }, 2000);
    }
    
    openContactApp(message, contact) {
        const encodedMessage = encodeURIComponent(message);
        
        switch(this.selectedContactMethod) {
            case 'whatsapp':
                window.open(`https://wa.me/${contact}?text=${encodedMessage}`, '_blank');
                break;
            case 'sms':
                window.open(`sms:${contact}?body=${encodedMessage}`, '_blank');
                break;
            case 'call':
                window.open(`tel:${contact}`, '_blank');
                break;
        }
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${type === 'success' ? '✓' : '⚠'}
            </div>
            <div class="notification-text">${message}</div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 0, 110, 0.1)'};
            border: 1px solid ${type === 'success' ? 'var(--primary-color)' : 'var(--accent-color)'};
            border-radius: 10px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
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
    
    playSound(type) {
        const sound = document.getElementById(`${type}Sound`);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound play failed:", e));
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update time for shaders
        if (this.nebula && this.nebula.material.uniforms) {
            this.nebula.material.uniforms.time.value += 0.01;
        }
        
        // Rotate nebula slowly
        if (this.nebula) {
            this.nebula.rotation.y += 0.0005;
            this.nebula.rotation.x += 0.0002;
        }
        
        // Animate particles
        if (this.particles && this.particles.geometry.attributes.position) {
            const positions = this.particles.geometry.attributes.position.array;
            const colors = this.particles.geometry.attributes.color.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Make particles flow upward
                positions[i + 1] += 0.05;
                
                // Wrap around when they go too high
                if (positions[i + 1] > 100) {
                    positions[i + 1] = -100;
                    positions[i] = (Math.random() - 0.5) * 200;
                    positions[i + 2] = (Math.random() - 0.5) * 200;
                }
                
                // Attract to hovered elements
                if (this.attractionActive && this.attractionElement) {
                    const rect = this.attractionElement.getBoundingClientRect();
                    const centerX = (rect.left + rect.width / 2) / window.innerWidth * 200 - 100;
                    const centerY = -(rect.top + rect.height / 2) / window.innerHeight * 200 + 100;
                    
                    const dx = centerX - positions[i];
                    const dy = centerY - positions[i + 1];
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 50) {
                        positions[i] += dx * 0.02;
                        positions[i + 1] += dy * 0.02;
                        
                        // Brighten color when attracted
                        colors[i + 1] = 1.0; // Green channel
                    }
                }
                
                // Reset color
                colors[i + 1] = Math.min(1.0, colors[i + 1] + 0.01);
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.geometry.attributes.color.needsUpdate = true;
        }
        
        // Animate grid with parallax
        if (this.grid) {
            this.grid.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
            this.grid.rotation.y = Math.cos(Date.now() * 0.0001) * 0.1;
            this.grid.position.y = Math.sin(Date.now() * 0.0005) * 5;
        }
        
        // Occasional scanning lasers
        this.lasers.forEach((laser, index) => {
            laser.timer++;
            
            if (laser.timer > 300 + index * 150) {
                laser.active = true;
                laser.timer = 0;
                
                // Animate laser
                gsap.to(laser.mesh.material, {
                    opacity: 0.8,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        laser.active = false;
                    }
                });
            }
            
            // Rotate lasers slowly
            laser.mesh.rotation.y += 0.001;
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load car data
    if (typeof nexusInventory === 'undefined') {
        console.error('cars_data.js not loaded or nexusInventory not defined');
        
        // Create minimal fallback data
        window.nexusInventory = [
            {
                id: "DEMO-001",
                category: "Hypercar",
                name: "Demo Vehicle",
                price: 250000,
                imageSet: ["demo.jpg"],
                specs: { power: "800 hp", acceleration: "2.5s", range: "300 mi" },
                description: "Demo vehicle for testing the interface.",
                colors: ["#0a0a0f", "#00f3ff", "#9d4edd"]
            }
        ];
    }
    
    // Initialize the application
    window.nexusApp = new NexusIndex();
    
    // Add fade-in animations to elements
    gsap.from('.hero-content > *', {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    });
    
    gsap.from('.featured-section > *', {
        opacity: 0,
        y: 40,
        stagger: 0.3,
        duration: 1,
        delay: 0.5,
        ease: "power2.out"
    });
    
    // Add scroll animations
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power2.out"
        });
    });
});