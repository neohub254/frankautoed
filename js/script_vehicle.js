// NEXUS VEHICULAR - Vehicle Page Script
class NexusVehicle {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.vehicle = null;
        this.currentImageIndex = 0;
        this.isAutoRotating = false;
        this.rotationAngle = 0;
        this.isXray = false;
        
        this.selectedColor = null;
        this.selectedOptions = {};
        
        this.galleryImages = [];
        this.currentGalleryIndex = 0;
        
        this.init();
    }
    
    init() {
        this.setupThreeJS();
        this.loadVehicleData();
        this.setupEventListeners();
        this.setupCustomCursor();
        
        // Initial animations
        this.animateDataStream();
    }
    
    setupThreeJS() {
        // Setup scene for vehicle page (simpler background)
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            60,
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
        
        // Create energy field background
        this.createEnergyField();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createEnergyField() {
        // Create a focused energy field for the holodeck
        const geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                mouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    // Gentle wave motion
                    float wave = sin(position.x * 0.1 + time) * cos(position.y * 0.1 + time) * 2.0;
                    vec3 pos = vec3(position.x, position.y, position.z + wave);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    // Create concentric energy rings
                    float dist = distance(vUv, vec2(0.5));
                    float rings = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
                    
                    // Radial gradient
                    float gradient = 1.0 - smoothstep(0.3, 0.7, dist);
                    
                    // Combine effects
                    vec3 color = vec3(0.0, 0.3, 0.5) * gradient;
                    color += vec3(0.5, 0.0, 0.8) * rings * 0.3;
                    
                    // Add center glow
                    float centerGlow = 1.0 - smoothstep(0.0, 0.2, dist);
                    color += vec3(0.0, 1.0, 1.0) * centerGlow * 0.2;
                    
                    gl_FragColor = vec4(color, 0.15);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false
        });
        
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -20;
        this.scene.add(plane);
        
        this.energyField = plane;
        
        // Add floating particles
        this.createHolodeckParticles();
    }
    
    createHolodeckParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position in a sphere around center
            const radius = 30 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i] = Math.sin(phi) * Math.cos(theta) * radius;
            positions[i + 1] = Math.cos(phi) * radius - 20;
            positions[i + 2] = Math.sin(phi) * Math.sin(theta) * radius;
            
            // Blue to purple colors
            colors[i] = Math.random() * 0.2;
            colors[i + 1] = 0.5 + Math.random() * 0.5;
            colors[i + 2] = 0.7 + Math.random() * 0.3;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.holodeckParticles = new THREE.Points(geometry, material);
        this.scene.add(this.holodeckParticles);
    }
    
    loadVehicleData() {
        // Get vehicle ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleId = urlParams.get('id');
        
        // Find the vehicle in the database
        this.vehicle = nexusInventory.find(v => v.id === vehicleId);
        
        if (!this.vehicle) {
            // Redirect to inventory if vehicle not found
            window.location.href = 'inventory.html';
            return;
        }
        
        // Populate vehicle data
        this.populateVehicleInfo();
        this.setup360Viewer();
        this.setupColorCustomizer();
        this.setupSpecifications();
        this.setupGallery();
        
        // Hide loading indicator
        setTimeout(() => {
            document.getElementById('viewerLoading').style.display = 'none';
        }, 1500);
    }
    
    populateVehicleInfo() {
        // Update vehicle name and category
        document.getElementById('vehicleName').textContent = this.vehicle.name;
        document.getElementById('vehicleCategory').textContent = this.vehicle.category;
        
        // Update price
        const price = this.formatPrice(this.vehicle.price);
        document.getElementById('vehiclePrice').textContent = price;
        
        // Update vehicle summary for inquiry modal
        const summary = document.getElementById('vehicleSummary');
        summary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">VEHICLE:</span>
                <span class="summary-value">${this.vehicle.name}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">CATEGORY:</span>
                <span class="summary-value">${this.vehicle.category}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">PRICE:</span>
                <span class="summary-value">${price}</span>
            </div>
        `;
    }
    
    setup360Viewer() {
        const viewer = document.getElementById('viewerImage');
        const slider = document.getElementById('rotationSlider');
        
        // Load first image
        if (this.vehicle.imageSet && this.vehicle.imageSet.length > 0) {
            const img = document.createElement('img');
            img.src = `assets/images/${this.vehicle.imageSet[0]}`;
            img.alt = `${this.vehicle.name} - Front View`;
            img.loading = 'eager';
            
            img.onload = () => {
                viewer.appendChild(img);
                
                // Add X-ray overlay
                const xrayOverlay = document.createElement('div');
                xrayOverlay.className = 'xray-effect';
                viewer.appendChild(xrayOverlay);
                
                // Add color wave overlay
                const colorWave = document.createElement('div');
                colorWave.className = 'color-wave';
                viewer.appendChild(colorWave);
            };
            
            // Store images for rotation
            this.viewerImages = this.vehicle.imageSet;
            this.currentImageIndex = 0;
        }
        
        // Setup rotation slider
        slider.addEventListener('input', (e) => {
            this.rotateVehicle(e.target.value);
        });
        
        // Setup auto-rotate
        const autoRotateBtn = document.getElementById('autoRotate');
        autoRotateBtn.addEventListener('click', () => {
            this.toggleAutoRotate();
        });
        
        // Setup manual rotation buttons
        document.getElementById('rotateLeft').addEventListener('click', () => {
            this.rotateLeft();
        });
        
        document.getElementById('rotateRight').addEventListener('click', () => {
            this.rotateRight();
        });
        
        // Setup X-ray toggle
        document.getElementById('toggleXray').addEventListener('click', () => {
            this.toggleXray();
        });
        
        // Add drag rotation for desktop
        let isDragging = false;
        let startX = 0;
        
        viewer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            viewer.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const rotation = (deltaX / viewer.clientWidth) * 360;
            
            this.rotateVehicle(rotation);
            slider.value = (rotation + 360) % 360;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            viewer.style.cursor = 'grab';
        });
        
        // Touch support for mobile
        viewer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const rotation = (deltaX / viewer.clientWidth) * 360;
            
            this.rotateVehicle(rotation);
            slider.value = (rotation + 360) % 360;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
    
    rotateVehicle(angle) {
        const viewer = document.getElementById('viewerImage');
        const sliderFill = document.querySelector('.slider-fill');
        const normalizedAngle = (parseFloat(angle) + 360) % 360;
        
        // Update rotation
        this.rotationAngle = normalizedAngle;
        viewer.style.transform = `rotateY(${normalizedAngle}deg)`;
        
        // Update slider fill
        sliderFill.style.width = `${(normalizedAngle / 360) * 100}%`;
        
        // Update image based on angle (simulating 360° view)
        if (this.viewerImages && this.viewerImages.length > 1) {
            const segment = 360 / this.viewerImages.length;
            const newIndex = Math.floor(normalizedAngle / segment) % this.viewerImages.length;
            
            if (newIndex !== this.currentImageIndex) {
                this.currentImageIndex = newIndex;
                this.updateViewerImage();
            }
        }
        
        // Play rotation sound
        this.playSound('rotateSound');
    }
    
    updateViewerImage() {
        const viewer = document.getElementById('viewerImage');
        const img = viewer.querySelector('img');
        
        if (img && this.viewerImages[this.currentImageIndex]) {
            // Fade out
            gsap.to(img, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    // Change image
                    img.src = `assets/images/${this.viewerImages[this.currentImageIndex]}`;
                    
                    // Fade in
                    gsap.to(img, {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });
        }
    }
    
    rotateLeft() {
        const newAngle = (this.rotationAngle - 45 + 360) % 360;
        this.rotateVehicle(newAngle);
        document.getElementById('rotationSlider').value = newAngle;
    }
    
    rotateRight() {
        const newAngle = (this.rotationAngle + 45) % 360;
        this.rotateVehicle(newAngle);
        document.getElementById('rotationSlider').value = newAngle;
    }
    
    toggleAutoRotate() {
        const btn = document.getElementById('autoRotate');
        
        this.isAutoRotating = !this.isAutoRotating;
        btn.classList.toggle('active', this.isAutoRotating);
        
        if (this.isAutoRotating) {
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            this.startAutoRotation();
        } else {
            btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            this.stopAutoRotation();
        }
    }
    
    startAutoRotation() {
        this.autoRotateInterval = setInterval(() => {
            const newAngle = (this.rotationAngle + 1) % 360;
            this.rotateVehicle(newAngle);
            document.getElementById('rotationSlider').value = newAngle;
        }, 50);
    }
    
    stopAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    toggleXray() {
        const btn = document.getElementById('toggleXray');
        const xrayOverlay = document.querySelector('.xray-effect');
        
        this.isXray = !this.isXray;
        btn.classList.toggle('active', this.isXray);
        
        if (this.isXray) {
            btn.innerHTML = '<i class="fas fa-eye-slash"></i> X-RAY';
            gsap.to(xrayOverlay, {
                opacity: 1,
                duration: 0.5
            });
        } else {
            btn.innerHTML = '<i class="fas fa-eye"></i> X-RAY';
            gsap.to(xrayOverlay, {
                opacity: 0,
                duration: 0.5
            });
        }
    }
    
    setupColorCustomizer() {
        const container = document.getElementById('colorOptions');
        
        if (this.vehicle.colors && this.vehicle.colors.length > 0) {
            this.vehicle.colors.forEach((color, index) => {
                const colorOption = document.createElement('div');
                colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
                colorOption.dataset.color = color;
                colorOption.dataset.index = index;
                
                colorOption.innerHTML = `
                    <div class="color-swatch" style="background: ${color};"></div>
                    <div class="color-name">COLOR ${index + 1}</div>
                `;
                
                colorOption.addEventListener('click', () => {
                    this.selectColor(color, index);
                });
                
                container.appendChild(colorOption);
            });
            
            // Set first color as default
            this.selectedColor = this.vehicle.colors[0];
        }
        
        // Custom color picker
        const colorPicker = document.getElementById('customColorPicker');
        colorPicker.addEventListener('input', (e) => {
            this.selectColor(e.target.value, 'custom');
        });
    }
    
    selectColor(color, index) {
        this.playSound('colorSound');
        
        // Update active class
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        
        if (index !== 'custom') {
            document.querySelector(`.color-option[data-index="${index}"]`).classList.add('active');
        }
        
        // Update selected color
        this.selectedColor = color;
        
        // Create color wave effect
        this.applyColorWave(color);
        
        // Update inquiry selections
        this.updateInquirySelections('Color', this.getColorName(color));
        
        // Update custom color picker
        if (index !== 'custom') {
            document.getElementById('customColorPicker').value = color;
        }
    }
    
    applyColorWave(color) {
        const viewer = document.getElementById('viewerImage');
        const colorWave = viewer.querySelector('.color-wave');
        const img = viewer.querySelector('img');
        
        if (!colorWave || !img) return;
        
        // Set wave color
        colorWave.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
        colorWave.style.setProperty('--wave-color', color);
        
        // Animate wave
        gsap.fromTo(colorWave,
            {
                opacity: 0,
                x: '-100%'
            },
            {
                opacity: 0.8,
                x: '100%',
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(colorWave, {
                        opacity: 0,
                        duration: 0.3
                    });
                }
            }
        );
        
        // Apply color filter to image
        const rgb = this.hexToRgb(color);
        const filter = `sepia(100%) saturate(1000%) hue-rotate(${this.getHueRotation(rgb)}deg) brightness(0.9)`;
        
        gsap.to(img, {
            filter: filter,
            duration: 1,
            ease: "power2.out"
        });
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 243, b: 255 };
    }
    
    getHueRotation(rgb) {
        // Convert RGB to HSV and get hue
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        
        if (max === min) {
            h = 0;
        } else if (max === r) {
            h = ((g - b) / (max - min)) % 6;
        } else if (max === g) {
            h = (b - r) / (max - min) + 2;
        } else {
            h = (r - g) / (max - min) + 4;
        }
        
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        return h;
    }
    
    getColorName(hex) {
        // Simple color name mapping
        const colors = {
            '#0a0a0f': 'Void Black',
            '#00f3ff': 'Quantum Blue',
            '#9d4edd': 'Nebula Purple',
            '#ff006e': 'Solar Pink',
            '#1a1a2e': 'Dark Void',
            '#00ff88': 'Neon Green',
            '#4cc9f0': 'Sky Blue',
            '#7209b7': 'Royal Purple'
        };
        
        return colors[hex] || `Custom Color (${hex})`;
    }
    
    setupSpecifications() {
        const terminal = document.getElementById('specsTerminal');
        const interactiveSpecs = document.getElementById('interactiveSpecs');
        
        // Clear containers
        terminal.innerHTML = '';
        interactiveSpecs.innerHTML = '';
        
        // Type out specifications
        let delay = 0;
        
        Object.entries(this.vehicle.specs).forEach(([key, value], index) => {
            // Create terminal line
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.style.animationDelay = `${delay}s`;
            
            const specLine = document.createElement('div');
            specLine.className = 'spec-line';
            specLine.innerHTML = `
                <span class="spec-label">${key.toUpperCase()}</span>
                <span class="spec-value">${value}</span>
            `;
            
            line.appendChild(specLine);
            terminal.appendChild(line);
            
            // Create interactive spec element
            const interactiveSpec = document.createElement('div');
            interactiveSpec.className = 'interactive-spec';
            interactiveSpec.dataset.spec = key;
            interactiveSpec.dataset.value = value;
            
            // Calculate percentage for visualization (for numerical specs)
            let percentage = 50;
            if (typeof value === 'string') {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    if (key.toLowerCase().includes('acceleration')) {
                        // Lower acceleration is better
                        percentage = 100 - (numValue * 10);
                    } else if (key.toLowerCase().includes('power')) {
                        // Higher power is better
                        percentage = Math.min(100, numValue / 20);
                    } else if (key.toLowerCase().includes('range')) {
                        // Higher range is better
                        percentage = Math.min(100, numValue / 10);
                    }
                }
            }
            
            interactiveSpec.innerHTML = `
                <div class="spec-header">
                    <div class="spec-title">${key.toUpperCase()}</div>
                    <div class="spec-graph-btn">
                        <i class="fas fa-chart-line"></i>
                        ANALYZE
                    </div>
                </div>
                <div class="spec-visual">
                    <div class="spec-progress" style="width: ${percentage}%"></div>
                </div>
            `;
            
            interactiveSpec.addEventListener('click', () => {
                this.showSpecAnalysis(key, value);
            });
            
            interactiveSpecs.appendChild(interactiveSpec);
            
            // Animate progress bar after typing
            setTimeout(() => {
                const progressBar = interactiveSpec.querySelector('.spec-progress');
                gsap.fromTo(progressBar,
                    { width: '0%' },
                    { width: `${percentage}%`, duration: 1, ease: "power2.out" }
                );
            }, delay * 1000 + 500);
            
            delay += 0.3;
        });
        
        // Populate features
        const featuresGrid = document.getElementById('featuresGrid');
        if (this.vehicle.features) {
            this.vehicle.features.forEach(feature => {
                const featureItem = document.createElement('div');
                featureItem.className = 'feature-item';
                featureItem.innerHTML = `
                    <div class="feature-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="feature-text">${feature}</div>
                `;
                featuresGrid.appendChild(featureItem);
            });
        }
    }
    
    showSpecAnalysis(spec, value) {
        this.playSound('specSound');
        
        const modal = document.getElementById('specModal');
        const title = document.getElementById('specModalTitle');
        const analysis = document.getElementById('specAnalysis');
        
        // Update modal content
        title.textContent = `${spec.toUpperCase()} ANALYSIS`;
        
        // Create analysis text based on spec type
        let analysisText = '';
        let chartData = [];
        let chartLabels = [];
        
        if (spec.toLowerCase().includes('acceleration')) {
            analysisText = `Acceleration of ${value} places this vehicle in the top tier of performance. This rapid acceleration is achieved through advanced electric motor technology and optimized power delivery.`;
            chartData = [2.5, 2.0, parseFloat(value), 1.8, 2.2];
            chartLabels = ['Average', 'Good', 'This Vehicle', 'Excellent', 'Premium'];
        } else if (spec.toLowerCase().includes('power')) {
            analysisText = `With ${value} of power, this vehicle delivers exceptional performance. The power-to-weight ratio ensures responsive acceleration and high-speed capability.`;
            chartData = [400, 600, parseInt(value), 1200, 800];
            chartLabels = ['Entry', 'Mid', 'This Vehicle', 'Hyper', 'Premium'];
        } else if (spec.toLowerCase().includes('range')) {
            analysisText = `A range of ${value} provides excellent usability for daily commuting and long-distance travel. Advanced battery technology ensures efficient energy usage.`;
            chartData = [250, 350, parseInt(value), 500, 400];
            chartLabels = ['City', 'Standard', 'This Vehicle', 'Max', 'Premium'];
        } else {
            analysisText = `Specification analysis shows optimal performance characteristics for this category.`;
            chartData = [60, 75, 90, 100, 85];
            chartLabels = ['Basic', 'Standard', 'Good', 'This Vehicle', 'Premium'];
        }
        
        analysis.innerHTML = `
            <h4>PERFORMANCE ANALYSIS</h4>
            <p>${analysisText}</p>
            <div class="analysis-details">
                <div class="detail-item">
                    <span>Category Benchmark:</span>
                    <strong>TOP 10%</strong>
                </div>
                <div class="detail-item">
                    <span>Energy Efficiency:</span>
                    <strong>EXCELLENT</strong>
                </div>
                <div class="detail-item">
                    <span>Performance Ratio:</span>
                    <strong>9.2/10</strong>
                </div>
            </div>
        `;
        
        // Create chart
        this.createSpecChart(chartData, chartLabels, spec);
        
        // Show modal
        modal.style.display = 'block';
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
    
    createSpecChart(data, labels, spec) {
        const ctx = document.getElementById('specChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.specChart) {
            this.specChart.destroy();
        }
        
        // Determine chart type based on spec
        const isAcceleration = spec.toLowerCase().includes('acceleration');
        
        this.specChart = new Chart(ctx, {
            type: isAcceleration ? 'line' : 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: spec.toUpperCase(),
                    data: data,
                    backgroundColor: isAcceleration ? 'transparent' : 'rgba(0, 243, 255, 0.6)',
                    borderColor: 'rgba(0, 243, 255, 1)',
                    borderWidth: isAcceleration ? 3 : 2,
                    pointBackgroundColor: 'rgba(0, 243, 255, 1)',
                    pointBorderColor: 'rgba(0, 243, 255, 1)',
                    pointRadius: 6,
                    fill: isAcceleration ? {
                        target: 'origin',
                        above: 'rgba(0, 243, 255, 0.1)'
                    } : false
                }]
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
    
    setupGallery() {
        if (!this.vehicle.imageSet || this.vehicle.imageSet.length <= 1) {
            document.querySelector('.gallery-section').style.display = 'none';
            return;
        }
        
        const track = document.getElementById('galleryTrack');
        const dots = document.getElementById('galleryDots');
        
        // Populate gallery
        this.vehicle.imageSet.forEach((image, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            slide.dataset.index = index;
            
            const img = document.createElement('img');
            img.src = `assets/images/${image}`;
            img.alt = `${this.vehicle.name} - View ${index + 1}`;
            img.loading = 'lazy';
            
            slide.appendChild(img);
            track.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            
            dot.addEventListener('click', () => {
                this.goToGallerySlide(index);
            });
            
            dots.appendChild(dot);
        });
        
        // Setup navigation
        document.getElementById('galleryPrev').addEventListener('click', () => {
            this.prevGallerySlide();
        });
        
        document.getElementById('galleryNext').addEventListener('click', () => {
            this.nextGallerySlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevGallerySlide();
            } else if (e.key === 'ArrowRight') {
                this.nextGallerySlide();
            }
        });
        
        // Store gallery state
        this.galleryImages = this.vehicle.imageSet;
        this.currentGalleryIndex = 0;
        this.updateGalleryPosition();
    }
    
    prevGallerySlide() {
        if (this.currentGalleryIndex > 0) {
            this.currentGalleryIndex--;
        } else {
            this.currentGalleryIndex = this.galleryImages.length - 1;
        }
        this.updateGalleryPosition();
    }
    
    nextGallerySlide() {
        if (this.currentGalleryIndex < this.galleryImages.length - 1) {
            this.currentGalleryIndex++;
        } else {
            this.currentGalleryIndex = 0;
        }
        this.updateGalleryPosition();
    }
    
    goToGallerySlide(index) {
        this.currentGalleryIndex = index;
        this.updateGalleryPosition();
    }
    
    updateGalleryPosition() {
        const track = document.getElementById('galleryTrack');
        const dots = document.querySelectorAll('.gallery-dot');
        
        // Update track position
        track.style.transform = `translateX(-${this.currentGalleryIndex * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentGalleryIndex);
        });
    }
    
    setupEventListeners() {
        // Inquiry options
        document.querySelectorAll('.inquiry-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectInquiryMethod(option);
            });
        });
        
        // Initiate inquiry button
        document.getElementById('initiateInquiry').addEventListener('click', () => {
            this.openInquiryModal();
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn);
            });
        });
        
        // Submit inquiry
        document.getElementById('submitInquiry').addEventListener('click', () => {
            this.submitInquiry();
        });
        
        // Form inputs
        document.getElementById('inquiryName').addEventListener('input', () => {
            this.updateInquiryMessage();
        });
        
        document.getElementById('inquiryContact').addEventListener('input', () => {
            this.updateInquiryMessage();
        });
    }
    
    setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        const interactiveElements = document.querySelectorAll('a, button, .color-option, .interactive-spec, .inquiry-option, .gallery-slide');
        
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
    
    selectInquiryMethod(option) {
        // Update active class
        document.querySelectorAll('.inquiry-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        this.selectedOptions.method = option.dataset.method;
        
        // Update inquiry selections
        let methodName = '';
        switch(option.dataset.method) {
            case 'whatsapp':
                methodName = 'WhatsApp Conduit';
                break;
            case 'sms':
                methodName = 'Encrypted SMS';
                break;
            case 'call':
                methodName = 'Neural Interface Call';
                break;
        }
        
        this.updateInquirySelections('Contact Method', methodName);
    }
    
    updateInquirySelections(key, value) {
        const container = document.getElementById('inquirySelections');
        
        // Check if selection already exists
        let existing = Array.from(container.children).find(child => 
            child.textContent.includes(key)
        );
        
        if (existing) {
            existing.querySelector('.selection-value').textContent = value;
        } else {
            const selection = document.createElement('div');
            selection.className = 'selection-item';
            selection.innerHTML = `
                <span class="selection-key">${key}:</span>
                <span class="selection-value">${value}</span>
            `;
            container.appendChild(selection);
        }
    }
    
    openInquiryModal() {
        // Check if contact method is selected
        if (!this.selectedOptions.method) {
            this.showNotification('Please select a contact method', 'error');
            return;
        }
        
        const modal = document.getElementById('inquiryModal');
        modal.style.display = 'block';
        
        // Update inquiry message
        this.updateInquiryMessage();
        
        // Animate modal in
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
    
    updateInquiryMessage() {
        const name = document.getElementById('inquiryName').value || '[Your Name]';
        const contact = document.getElementById('inquiryContact').value || '[Your Contact]';
        const messageArea = document.getElementById('inquiryMessage');
        
        const message = `Hello Nexus Vehicular,

I'm interested in the ${this.vehicle.name} (${this.vehicle.id}) with the following configuration:
${this.selectedColor ? `- Color: ${this.getColorName(this.selectedColor)}` : ''}

Please contact me at ${contact} to discuss availability and arrange a holographic demonstration.

Best regards,
${name}`;
        
        messageArea.value = message;
    }
    
    submitInquiry() {
        const name = document.getElementById('inquiryName').value;
        const contact = document.getElementById('inquiryContact').value;
        
        if (!name || !contact) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!this.selectedOptions.method) {
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
            
            // Generate final message
            const message = this.generateInquiryMessage(name, contact);
            
            // Open selected contact method
            this.openContactApp(message, contact);
            
            // Close modal
            this.closeModal(submitBtn.closest('.modal'));
            
            // Show success notification
            this.showNotification('Conduit established successfully', 'success');
        }, 2000);
    }
    
    generateInquiryMessage(name, contact) {
        return `Hello Nexus Vehicular,

I'm interested in the ${this.vehicle.name} (${this.vehicle.id}).

Vehicle Details:
- Category: ${this.vehicle.category}
- Price: ${this.formatPrice(this.vehicle.price)}
- Key Specs: ${Object.entries(this.vehicle.specs).map(([k, v]) => `${k}: ${v}`).join(', ')}
${this.selectedColor ? `- Selected Color: ${this.getColorName(this.selectedColor)}` : ''}

Please contact me at ${contact} to discuss further.

Best regards,
${name}`;
    }
    
    openContactApp(message, contact) {
        const encodedMessage = encodeURIComponent(message);
        
        switch(this.selectedOptions.method) {
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
    
    closeModal(btn) {
        const modal = btn.closest('.modal');
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
    
    animateDataStream() {
        const visualizer = document.getElementById('streamVisualizer');
        if (!visualizer) return;
        
        // Create data stream animation
        setInterval(() => {
            const bar = document.createElement('div');
            bar.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 2px;
                height: 100%;
                background: linear-gradient(180deg, var(--primary-color), transparent);
                animation: streamFlow 1s linear forwards;
            `;
            
            visualizer.appendChild(bar);
            
            // Remove after animation
            setTimeout(() => {
                if (bar.parentElement === visualizer) {
                    visualizer.removeChild(bar);
                }
            }, 1000);
        }, 200);
    }
    
    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound play failed:", e));
        }
    }
    
    showNotification(message, type) {
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
        
        gsap.to(notification, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animate energy field
        if (this.energyField && this.energyField.material.uniforms) {
            this.energyField.material.uniforms.time.value = time;
        }
        
        // Animate particles
        if (this.holodeckParticles && this.holodeckParticles.geometry.attributes.position) {
            const positions = this.holodeckParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Gentle orbiting motion
                const angle = time * 0.5 + i * 0.01;
                const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
                
                positions[i] = Math.cos(angle) * radius;
                positions[i + 2] = Math.sin(angle) * radius;
                
                // Bobbing motion
                positions[i + 1] += Math.sin(time + i) * 0.01;
            }
            
            this.holodeckParticles.geometry.attributes.position.needsUpdate = true;
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
        // Redirect to inventory
        setTimeout(() => {
            window.location.href = 'inventory.html';
        }, 2000);
        return;
    }
    
    // Initialize the vehicle application
    window.vehicleApp = new NexusVehicle();
    
    // Add initial animations
    gsap.from('.viewer-panel', {
        opacity: 0,
        x: -40,
        duration: 1,
        delay: 0.2,
        ease: "power2.out"
    });
    
    gsap.from('.specs-panel', {
        opacity: 0,
        x: 40,
        duration: 1,
        delay: 0.4,
        ease: "power2.out"
    });
    
    gsap.from('.action-panel > div', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    });
});