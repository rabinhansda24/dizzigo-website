// DizziGo Website Interactive Scripts
class DizziGoWebsite {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isScrolling = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initThreeJS();
        this.setupScrollAnimations();
        this.setupInteractiveElements();
        this.setupTypingAnimations();
        this.startRenderLoop();
    }
    
    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            this.updateFloatingElements(e.clientX, e.clientY);
        });
        
        // Scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            this.updateNavbar();
            this.createScrollParticles();
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    initThreeJS() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create background particles
        this.createBackgroundParticles();
        
        // Create floating geometric shapes
        this.createFloatingShapes();
        
        // Position camera
        this.camera.position.z = 5;
    }
    
    createBackgroundParticles() {
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const colorPalette = [
            new THREE.Color(0x00ff88), // Terminal green
            new THREE.Color(0x00d4ff), // Terminal blue
            new THREE.Color(0xff6b35), // Terminal orange
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform vec2 mouse;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Mouse interaction
                    float mouseDistance = distance(pos.xy, mouse * 10.0);
                    pos.z += sin(mouseDistance * 0.1 + time) * 0.5;
                    
                    // Floating animation
                    pos.y += sin(time * 0.5 + position.x * 0.1) * 0.2;
                    pos.x += cos(time * 0.3 + position.y * 0.1) * 0.1;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createFloatingShapes() {
        const shapes = [];
        
        // Create various geometric shapes
        for (let i = 0; i < 5; i++) {
            let geometry;
            const shapeType = Math.floor(Math.random() * 3);
            
            switch (shapeType) {
                case 0:
                    geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                    break;
                case 1:
                    geometry = new THREE.OctahedronGeometry(0.3);
                    break;
                case 2:
                    geometry = new THREE.TetrahedronGeometry(0.4);
                    break;
            }
            
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff88,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            );
            
            // Random rotation speed
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            };
            
            shapes.push(mesh);
            this.scene.add(mesh);
        }
        
        this.floatingShapes = shapes;
    }
    
    startRenderLoop() {
        const animate = (time) => {
            requestAnimationFrame(animate);
            
            if (this.particles && this.particles.material.uniforms) {
                this.particles.material.uniforms.time.value = time * 0.001;
                this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
            }
            
            // Animate floating shapes
            if (this.floatingShapes) {
                this.floatingShapes.forEach(shape => {
                    shape.rotation.x += shape.userData.rotationSpeed.x;
                    shape.rotation.y += shape.userData.rotationSpeed.y;
                    shape.rotation.z += shape.userData.rotationSpeed.z;
                    
                    shape.position.y += Math.sin(time * shape.userData.floatSpeed) * 0.001;
                });
            }
            
            // Camera movement based on mouse
            if (this.camera) {
                this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
                this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
                this.camera.lookAt(this.scene.position);
            }
            
            if (this.renderer) {
                this.renderer.render(this.scene, this.camera);
            }
        };
        
        animate(0);
    }
    
    setupScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.timeline()
            .from('.terminal-window', { 
                duration: 1, 
                y: 50, 
                opacity: 0, 
                ease: 'power3.out' 
            })
            .from('.hero-title', { 
                duration: 1, 
                y: 30, 
                opacity: 0, 
                ease: 'power3.out' 
            }, '-=0.5')
            .from('.hero-description', { 
                duration: 1, 
                y: 30, 
                opacity: 0, 
                ease: 'power3.out' 
            }, '-=0.7')
            .from('.hero-buttons', { 
                duration: 1, 
                y: 30, 
                opacity: 0, 
                ease: 'power3.out' 
            }, '-=0.7')
            .from('.hero-stats .stat', { 
                duration: 0.8, 
                y: 30, 
                opacity: 0, 
                stagger: 0.2, 
                ease: 'power3.out' 
            }, '-=0.5');
        
        // Feature cards animation
        gsap.fromTo('.feature-card', 
            { 
                y: 100, 
                opacity: 0, 
                rotationY: -15 
            },
            {
                y: 0,
                opacity: 1,
                rotationY: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.features',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Steps animation
        gsap.fromTo('.step',
            {
                x: -100,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.how-it-works',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Tech stack animation
        gsap.fromTo('.tech-category',
            {
                scale: 0.8,
                opacity: 0,
                rotationX: -45
            },
            {
                scale: 1,
                opacity: 1,
                rotationX: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.tech-stack',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Architecture diagram animation
        gsap.fromTo('.layer',
            {
                y: 50,
                opacity: 0,
                scale: 0.9
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.architecture-diagram',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Parallax effect for floating terminal
        gsap.to('.floating-terminal', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
        
        // Section titles animation
        gsap.fromTo('.section-title',
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.section-title',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
    
    setupInteractiveElements() {
        // Feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1.02,
                    rotationY: 5,
                    z: 20,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1,
                    rotationY: 0,
                    z: 0,
                    ease: 'power2.out'
                });
            });
        });
        
        // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    scale: 1.05,
                    ease: 'power2.out'
                });
                
                // Create ripple effect
                this.createRippleEffect(btn);
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });
        
        // Copy button functionality
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const textToCopy = btn.dataset.copy;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = '✅ Copied!';
                    btn.style.background = 'var(--terminal-green)';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                });
            });
        });
        
        // OS selection for installation
        document.querySelectorAll('.install-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                document.querySelectorAll('.install-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Show corresponding command block
                const osType = option.dataset.os;
                document.querySelectorAll('.command-block').forEach(block => {
                    block.classList.remove('active');
                });
                document.querySelector(`[data-for="${osType}"]`).classList.add('active');
            });
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupTypingAnimations() {
        // Terminal typing effect
        const terminalOutput = document.querySelector('.typing-animation');
        if (terminalOutput) {
            const text = terminalOutput.textContent;
            terminalOutput.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    terminalOutput.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            // Start typing animation after a delay
            setTimeout(typeWriter, 1000);
        }
        
        // Code snippet syntax highlighting effect
        this.highlightCodeSnippets();
    }
    
    highlightCodeSnippets() {
        document.querySelectorAll('pre code').forEach(block => {
            const text = block.textContent;
            
            // Simple syntax highlighting for Go code
            let highlightedText = text
                .replace(/\b(package|import|func|var|const|if|else|for|range|return|type|struct|interface)\b/g, '<span style="color: var(--terminal-purple)">$1</span>')
                .replace(/\b(main|fmt|tea|smart|NewProviderManager|NewChatModel)\b/g, '<span style="color: var(--terminal-blue)">$1</span>')
                .replace(/"([^"]*)"/g, '<span style="color: var(--terminal-green)">"$1"</span>')
                .replace(/\/\/.*$/gm, '<span style="color: var(--text-tertiary)">$&</span>')
                .replace(/\b(\d+)\b/g, '<span style="color: var(--terminal-yellow)">$1</span>');
            
            block.innerHTML = highlightedText;
        });
    }
    
    updateNavbar() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    updateFloatingElements(mouseX, mouseY) {
        const floatingTerminal = document.getElementById('floating-terminal');
        if (floatingTerminal) {
            const rect = floatingTerminal.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX - centerX) * 0.01;
            const deltaY = (mouseY - centerY) * 0.01;
            
            gsap.to(floatingTerminal, {
                duration: 1,
                rotationY: deltaX,
                rotationX: -deltaY,
                ease: 'power2.out'
            });
        }
        
        // Update feature cards based on mouse position
        document.querySelectorAll('.feature-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX - cardCenterX) * 0.005;
            const deltaY = (mouseY - cardCenterY) * 0.005;
            
            gsap.to(card, {
                duration: 0.5,
                rotationY: deltaX,
                rotationX: -deltaY,
                ease: 'power2.out'
            });
        });
    }
    
    createScrollParticles() {
        if (!this.isScrolling) return;
        
        const particlesContainer = document.body;
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
            particle.style.animationDuration = Math.random() * 2 + 1 + 's';
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = rect.width / 2 - size / 2 + 'px';
        ripple.style.top = rect.height / 2 - size / 2 + 'px';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    handleResize() {
        if (this.renderer && this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.monitor();
    }
    
    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adjust quality based on performance
            this.adjustQuality();
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    adjustQuality() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        
        // Reduce particle count on low-end devices
        if (this.fps < 30) {
            canvas.style.opacity = '0.05';
        } else if (this.fps < 45) {
            canvas.style.opacity = '0.08';
        } else {
            canvas.style.opacity = '0.1';
        }
    }
}

// Accessibility enhancements
class AccessibilityHelper {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupMotionPreferences();
    }
    
    setupKeyboardNavigation() {
        // Focus management for interactive elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: var(--bg-primary);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupScreenReaderSupport() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `feature-title-${index}`);
            
            const title = card.querySelector('.feature-title');
            if (title) {
                title.id = `feature-title-${index}`;
            }
        });
        
        // Add live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }
    
    setupMotionPreferences() {
        // Respect user's motion preferences
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                // Disable heavy animations
                gsap.globalTimeline.timeScale(0.1);
            } else {
                document.body.classList.remove('reduced-motion');
                gsap.globalTimeline.timeScale(1);
            }
        };
        
        mediaQuery.addListener(handleMotionPreference);
        handleMotionPreference(mediaQuery);
    }
    
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Error handling and fallbacks
class ErrorHandler {
    constructor() {
        this.setupErrorHandling();
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.warn('DizziGo Website Error:', e.error);
            this.showFallbackContent();
        });
        
        // Check for WebGL support
        if (!this.checkWebGLSupport()) {
            this.disableWebGLFeatures();
        }
        
        // Check for modern browser features
        if (!this.checkModernBrowserSupport()) {
            this.enableLegacyMode();
        }
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }
    
    checkModernBrowserSupport() {
        return !!(
            window.fetch &&
            window.Promise &&
            window.requestAnimationFrame &&
            document.querySelector &&
            Array.prototype.forEach
        );
    }
    
    disableWebGLFeatures() {
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        // Add fallback background
        document.body.style.background = `
            linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%),
            radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
        `;
    }
    
    enableLegacyMode() {
        document.body.classList.add('legacy-mode');
        
        // Disable advanced animations
        const style = document.createElement('style');
        style.textContent = `
            .legacy-mode * {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    showFallbackContent() {
        // Ensure basic functionality works even if advanced features fail
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && !heroContent.style.opacity) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'none';
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main website functionality
    const website = new DizziGoWebsite();
    
    // Initialize performance monitoring
    const perfMonitor = new PerformanceMonitor();
    
    // Initialize accessibility features
    const a11y = new AccessibilityHelper();
    
    // Initialize error handling
    const errorHandler = new ErrorHandler();
    
    // Add loading completion class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
    
    // Console message for developers
    console.log(`
    ███████╗██╗███████╗███████╗██╗ ██████╗  ██████╗ 
    ██╔══██║██║╚══███╔╝╚══███╔╝██║██╔════╝ ██╔═══██╗
    ██║  ██║██║  ███╔╝   ███╔╝ ██║██║  ███╗██║   ██║
    ██║  ██║██║ ███╔╝   ███╔╝  ██║██║   ██║██║   ██║
    ███████╔╝██║███████╗███████╗██║╚██████╔╝╚██████╔╝
    ╚══════╝ ╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝  ╚═════╝ 
    
    🤖 Welcome to DizziGo's source code!
    🚀 Interested in contributing? Check out our GitHub repo!
    💼 Looking for developers? We're hiring!
    
    Built with: Three.js, GSAP, Vanilla JS, and lots of ❤️
    `);
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
window.DizziGoWebsite = DizziGoWebsite;