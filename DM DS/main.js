// DM DS Global Javascript File

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initCanvasBackground();
  initMobileMenu();
  initScrollAnimations();
  initNavbarScroll();
});

// 1. BUTTERY SMOOTH SCROLLING (Lenis CDN integration check & setup)
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  
  // Connect Lenis to ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
  }
} else {
  document.documentElement.style.scrollBehavior = 'smooth';
}

// 2. PREMIUM INERTIAL CUSTOM CURSOR
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .interactive-card, [role="button"], .carousel-btn');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      if (el.tagName === 'BUTTON' || el.classList.contains('btn-premium') || el.classList.contains('nav-cta') || el.classList.contains('carousel-btn')) {
        cursor.classList.add('active');
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursor.classList.remove('active');
    });
  });
  
  document.body.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    cursorDot.style.opacity = 0;
  });
  document.body.addEventListener('mouseenter', () => {
    cursor.style.opacity = 1;
    cursorDot.style.opacity = 1;
  });
}

// 3. INTERACTIVE CANVAS BACKGROUND
// 3. INTERACTIVE CANVAS BACKGROUND
function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const elements = [];
  const maxElements = Math.min(45, Math.floor((width * height) / 35000));
  let mouse = { x: null, y: null, radius: 180 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  const codeSnippets = [
    '<html>', 'const dmds = async () => {}', 'return <WebGLCanvas />', 
    'import { GSAP } from "gsap";', 'document.createElement("canvas")', 
    'Request: GET /api/v2/dominance', 'display: flex;', 'position: absolute;', 
    'transform: translateZ(50px)'
  ];
  
  const marketingData = [
    '+420% ROI', 'CTR: 12.4%', 'CPC: ₹1.24', 'LTV/CAC: 4.8x', 
    'Managed Spend: ₹40Cr', 'Conversions: +89K', 'Scale factor: 2.5x'
  ];
  
  const seoData = [
    'Rank #1', 'Crawl rate: 10k/sec', 'Schema: Loaded', 'Sitemap.xml', 
    'Semantic Index', 'Keyword: Dominate', 'Core Vitals: 99'
  ];
  
  class FloatingAsset {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute initially
    }
    
    reset() {
      this.x = Math.random() * (width - 200) + 100;
      this.y = height + Math.random() * 100;
      this.speed = Math.random() * 0.35 + 0.15;
      
      // 3D rotation angles and speeds
      this.rotX = Math.random() * Math.PI * 2;
      this.rotY = Math.random() * Math.PI * 2;
      this.rotZ = Math.random() * Math.PI * 2;
      this.rotSpeedX = (Math.random() * 0.015) - 0.0075;
      this.rotSpeedY = (Math.random() * 0.015) - 0.0075;
      this.rotSpeedZ = (Math.random() * 0.015) - 0.0075;
      
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.15 + 0.03;
      this.density = (Math.random() * 20) + 10;
      
      // Determine asset type: 0: Code text, 1: ROI/SEO text, 2: 3D Wireframe Geometry
      this.assetType = Math.floor(Math.random() * 3);
      
      if (this.assetType === 0) {
        this.content = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        this.color = 'rgba(212, 175, 55, '; // Gold glow
        this.fontSize = Math.floor(Math.random() * 4) + 12;
        this.isText = true;
      } else if (this.assetType === 1) {
        const pool = Math.random() > 0.5 ? marketingData : seoData;
        this.content = pool[Math.floor(Math.random() * pool.length)];
        this.color = 'rgba(99, 102, 241, '; // Indigo glow
        this.fontSize = Math.floor(Math.random() * 4) + 12;
        this.isText = true;
      } else {
        this.color = Math.random() > 0.5 ? 'rgba(243, 244, 246, ' : 'rgba(212, 175, 55, '; // Cream or Gold
        this.isText = false;
        this.geomType = Math.floor(Math.random() * 3); // 0: 3D Cube, 1: 3D Gyroscope/Rings, 2: Crosshair
        this.geomSize = Math.random() * 30 + 15;
        
        // Define 3D vertices for Cube
        if (this.geomType === 0) {
          const r = this.geomSize;
          this.vertices = [
            {x: -r, y: -r, z: -r},
            {x: r, y: -r, z: -r},
            {x: r, y: r, z: -r},
            {x: -r, y: r, z: -r},
            {x: -r, y: -r, z: r},
            {x: r, y: -r, z: r},
            {x: r, y: r, z: r},
            {x: -r, y: r, z: r}
          ];
          this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // back
            [4, 5], [5, 6], [6, 7], [7, 4], // front
            [0, 4], [1, 5], [2, 6], [3, 7]  // connectors
          ];
        } 
        // Define 3D vertices for Gyroscope Rings
        else if (this.geomType === 1) {
          const r = this.geomSize;
          this.rings = [];
          // 3 rings rotating on X, Y, Z planes
          const steps = 16;
          for (let ring = 0; ring < 3; ring++) {
            const ringPoints = [];
            for (let i = 0; i < steps; i++) {
              const a = (i / steps) * Math.PI * 2;
              let pt;
              if (ring === 0) pt = {x: r * Math.cos(a), y: r * Math.sin(a), z: 0};
              else if (ring === 1) pt = {x: 0, y: r * Math.cos(a), z: r * Math.sin(a)};
              else pt = {x: r * Math.cos(a), y: 0, z: r * Math.sin(a)};
              ringPoints.push(pt);
            }
            this.rings.push(ringPoints);
          }
        }
      }
    }
    
    update() {
      this.y -= this.speed;
      
      // Update 3D rotation angles
      this.rotX += this.rotSpeedX;
      this.rotY += this.rotSpeedY;
      this.rotZ += this.rotSpeedZ;
      
      // Fade in/out
      if (this.y > height - 120) {
        this.opacity += 0.005;
      } else if (this.y < 120) {
        this.opacity -= 0.005;
      } else {
        if (this.opacity < this.maxOpacity) this.opacity += 0.002;
      }
      
      if (this.opacity < 0) this.opacity = 0;
      if (this.opacity > this.maxOpacity) this.opacity = this.maxOpacity;
      
      // Mouse push/pull physics
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density * 0.15;
          let directionY = forceDirectionY * force * this.density * 0.15;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }
      
      if (this.y < -100) {
        this.reset();
      }
    }
    
    // Rotate a 3D point around X, Y, Z axes
    rotate3D(pt) {
      // Y-axis rotation
      let cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
      let x1 = pt.x * cosY - pt.z * sinY;
      let z1 = pt.x * sinY + pt.z * cosY;
      
      // X-axis rotation
      let cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
      let y2 = pt.y * cosX - z1 * sinX;
      let z2 = pt.y * sinX + z1 * cosX;
      
      // Z-axis rotation
      let cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);
      let x3 = x1 * cosZ - y2 * sinZ;
      let y3 = x1 * sinZ + y2 * cosZ;
      
      return {x: x3, y: y3, z: z2};
    }
    
    // Project 3D point to 2D screen space
    project3D(pt) {
      const fov = 200;
      const scale = fov / (fov + pt.z);
      return {
        x: pt.x * scale,
        y: pt.y * scale
      };
    }
    
    draw() {
      if (this.opacity <= 0) return;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      
      ctx.strokeStyle = this.color + this.opacity + ')';
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.lineWidth = 0.5;
      
      if (this.isText) {
        ctx.font = `300 ${this.fontSize}px monospace`;
        ctx.fillText(this.content, 0, 0);
      } else {
        // DRAW 3D CUBE
        if (this.geomType === 0) {
          const projected = this.vertices.map(v => {
            const rot = this.rotate3D(v);
            return this.project3D(rot);
          });
          
          this.edges.forEach(edge => {
            const p1 = projected[edge[0]];
            const p2 = projected[edge[1]];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          });
        } 
        // DRAW 3D GYROSCOPE RINGS
        else if (this.geomType === 1) {
          this.rings.forEach(ring => {
            ctx.beginPath();
            const projected = ring.map(v => {
              const rot = this.rotate3D(v);
              return this.project3D(rot);
            });
            
            ctx.moveTo(projected[0].x, projected[0].y);
            for (let i = 1; i < projected.length; i++) {
              ctx.lineTo(projected[i].x, projected[i].y);
            }
            ctx.closePath();
            ctx.stroke();
          });
        } 
        // DRAW 2D CROSSHAIR (subtle)
        else {
          ctx.beginPath();
          ctx.moveTo(-15, 0);
          ctx.lineTo(15, 0);
          ctx.moveTo(0, -15);
          ctx.lineTo(0, 15);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    }
  }
  
  function initAssets() {
    elements.length = 0;
    for (let i = 0; i < maxElements; i++) {
      elements.push(new FloatingAsset());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    elements.forEach(el => {
      el.update();
      el.draw();
    });
    
    // Draw subtle connecting background grid lines on mouse hover
    if (mouse.x != null && mouse.y != null) {
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.03)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(mouse.x, 0);
      ctx.lineTo(mouse.x, height);
      ctx.moveTo(0, mouse.y);
      ctx.lineTo(width, mouse.y);
      ctx.stroke();
    }
    
    requestAnimationFrame(animate);
  }
  
  initAssets();
  animate();
}

// 4. MOBILE NAVIGATION TOGGLE
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const links = document.querySelector('.nav-links');
  
  if (!toggle || !links) return;
  
  toggle.addEventListener('click', () => {
    links.classList.toggle('active');
    toggle.classList.toggle('active');
    
    if (toggle.classList.contains('active')) {
      toggle.innerHTML = '&#x2715;';
    } else {
      toggle.innerHTML = '&#x2630;';
    }
  });
  
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      links.classList.remove('active');
      toggle.classList.remove('active');
      toggle.innerHTML = '&#x2630;';
    });
  });
}

// 5. STICKY NAVBAR SCROLLED STATE
function initNavbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initially
}

// 6. SCROLL TRIGGER REVEALS
function initScrollAnimations() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  const revealElements = document.querySelectorAll('.reveal-item');
  revealElements.forEach(el => observer.observe(el));
}
