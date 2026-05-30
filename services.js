// DM DS Services Deep Dive Scripts

document.addEventListener('DOMContentLoaded', () => {
  initServicesScroll();
  initServicesCanvas();
});

let currentActiveIndex = 0;

// 1. SCROLL Snapping & Side Navigation Tracker
function initServicesScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Observer Fallback if GSAP is unavailable
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = ['web', 'marketing', 'seo', 'branding'].indexOf(sectionId);
          if (index !== -1) {
            updateActiveService(index);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.service-section').forEach(sec => {
      observer.observe(sec);
    });
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  const sections = ['web', 'marketing', 'seo', 'branding'];
  
  sections.forEach((id, index) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: "top center",
      end: "bottom center",
      onToggle: self => {
        if (self.isActive) {
          updateActiveService(index);
        }
      }
    });
  });
  
  // Bind Nav Ticks click actions
  const ticks = document.querySelectorAll('.srv-nav-tick');
  ticks.forEach(tick => {
    tick.addEventListener('click', () => {
      const idx = parseInt(tick.getAttribute('data-index'));
      const targetId = sections[idx];
      const targetSec = document.getElementById(targetId);
      
      if (targetSec) {
        if (lenis) {
          lenis.scrollTo(targetSec);
        } else {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function updateActiveService(index) {
  currentActiveIndex = index;
  
  // 1. Toggle active nav ticks
  const ticks = document.querySelectorAll('.srv-nav-tick');
  ticks.forEach((tick, i) => {
    if (i === index) {
      tick.classList.add('active');
    } else {
      tick.classList.remove('active');
    }
  });
  
  // 2. Toggle active class on text blocks
  const contents = document.querySelectorAll('.service-content');
  contents.forEach((content, i) => {
    if (i === index) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}


// 2. INTERACTIVE SERVICES BACKGROUND RENDERING (Canvas 2D)
function initServicesCanvas() {
  const canvas = document.getElementById('services-gl-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // Dynamic floating element pools
  const elements = [];
  let prevIndex = -1;
  let transitionProgress = 1.0; // 0 to 1 fade transition
  
  // Data pools for canvas rendering
  const codeSnippets = [
    '<html>', 'const dmds = async () => {}', 'return <WebGLCanvas />', 
    'import { GSAP } from "gsap";', 'document.createElement("canvas")', 
    'Request: GET /api/v2/dominance', 'Response: 200 OK', 'margin: 0 auto;', 
    'display: flex;', 'position: absolute;', 'transform: translateZ(50px)'
  ];
  
  const marketingData = [
    '+420% ROI', 'CTR: 12.4%', 'CPC: ₹1.24', 'LTV/CAC: 4.8x', 
    'Managed Spend: ₹40Cr', 'Conversions: +89K', 'Scale factor: 2.5x', 
    'Meta Pixel: ACTIVE', 'CPA: -24%'
  ];
  
  const seoData = [
    'Rank #1', 'Crawl rate: 10k/sec', 'Schema: Loaded', 'Sitemap.xml', 
    'Semantic Index', 'Search Console', 'Keyword: Dominate', 'Core Vitals: 99', 
    'Backlink Map: OK', 'Index latency: 20ms'
  ];
  
  class FloatingObject {
    constructor(type) {
      this.type = type;
      this.reset();
      this.y = Math.random() * height; // Distribute initially
    }
    
    reset() {
      this.x = Math.random() * (width - 200) + 100;
      this.y = height + Math.random() * 100;
      this.speed = Math.random() * 0.8 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() * 0.02) - 0.01;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.28 + 0.05;
      
      // Determine what to display based on the active index
      if (this.type === 0) { // Code
        this.content = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        this.color = '#d4af37'; // Olive glow
        this.fontSize = Math.floor(Math.random() * 6) + 14;
        this.isText = true;
      } else if (this.type === 1) { // Ads & Marketing
        this.content = marketingData[Math.floor(Math.random() * marketingData.length)];
        this.color = '#6366f1'; // Rust glow
        this.fontSize = Math.floor(Math.random() * 8) + 14;
        this.isText = Math.random() > 0.4;
        // If not text, render a chart block
        this.chartWidth = Math.random() * 80 + 40;
        this.chartHeight = Math.random() * 50 + 20;
      } else if (this.type === 2) { // SEO
        this.content = seoData[Math.floor(Math.random() * seoData.length)];
        this.color = '#d4af37'; // Olive glow
        this.fontSize = Math.floor(Math.random() * 6) + 14;
        this.isText = Math.random() > 0.3;
        // Node connections map
        this.nodeCount = Math.floor(Math.random() * 3) + 3;
      } else { // Branding
        this.color = Math.random() > 0.5 ? '#f4f1ea' : '#6366f1'; // Cream or Rust
        this.isText = false;
        // Golden ratio elements or geometry grids
        this.geomType = Math.floor(Math.random() * 3); // 0: Circle, 1: Square, 2: Coordinate grid
        this.geomSize = Math.random() * 60 + 30;
      }
    }
    
    update() {
      this.y -= this.speed;
      this.rotation += this.rotSpeed;
      
      // Fade in at bottom, fade out at top
      if (this.y > height - 100) {
        this.opacity += 0.01;
      } else if (this.y < 100) {
        this.opacity -= 0.01;
      } else {
        if (this.opacity < this.maxOpacity) this.opacity += 0.005;
      }
      
      if (this.opacity < 0) this.opacity = 0;
      
      // Reset if it floats off top screen
      if (this.y < -100) {
        this.reset();
      }
    }
    
    draw(activeType, transitionVal) {
      // Calculate opacity factoring global transition fade
      let currentOpacity = this.opacity;
      if (this.type !== activeType) {
        currentOpacity *= (1 - transitionVal); // Fade out old items
      } else {
        currentOpacity *= transitionVal; // Fade in new items
      }
      
      if (currentOpacity <= 0) return;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = currentOpacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      
      // DRAW CODE SNIPPETS
      if (this.type === 0 && this.isText) {
        ctx.font = `300 ${this.fontSize}px monospace`;
        ctx.fillText(this.content, 0, 0);
      }
      
      // DRAW AD METRICS & GRAPHICS
      else if (this.type === 1) {
        if (this.isText) {
          ctx.font = `600 ${this.fontSize}px var(--font-primary)`;
          ctx.fillText(this.content, 0, 0);
        } else {
          // Draw a stylized vector bar graph
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(0, 0, this.chartWidth, -this.chartHeight);
          ctx.stroke();
          // Diagonal arrow
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(this.chartWidth, -this.chartHeight);
          ctx.moveTo(this.chartWidth - 8, -this.chartHeight);
          ctx.lineTo(this.chartWidth, -this.chartHeight);
          ctx.lineTo(this.chartWidth, -this.chartHeight + 8);
          ctx.stroke();
        }
      }
      
      // DRAW SEO NETWORK CRAWLS
      else if (this.type === 2) {
        if (this.isText) {
          ctx.font = `400 ${this.fontSize}px monospace`;
          ctx.fillText(this.content, 0, 0);
        } else {
          // Draw connecting radar node map
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.stroke();
          // Radar lines
          for (let i = 0; i < this.nodeCount; i++) {
            let angle = (i / this.nodeCount) * Math.PI * 2;
            let nx = Math.cos(angle) * 40;
            let ny = Math.sin(angle) * 40;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(nx, ny);
            ctx.arc(nx, ny, 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      
      // DRAW GEOMETRIC AND WIREFRAME OUTLINES
      else {
        ctx.lineWidth = 0.5;
        if (this.geomType === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, this.geomSize, 0, Math.PI * 2);
          ctx.stroke();
          // Inner grid
          ctx.beginPath();
          ctx.moveTo(-this.geomSize, 0);
          ctx.lineTo(this.geomSize, 0);
          ctx.moveTo(0, -this.geomSize);
          ctx.lineTo(0, this.geomSize);
          ctx.stroke();
        } else if (this.geomType === 1) {
          ctx.beginPath();
          ctx.rect(-this.geomSize/2, -this.geomSize/2, this.geomSize, this.geomSize);
          ctx.stroke();
          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, this.geomSize/2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Coordinate grids
          ctx.beginPath();
          ctx.moveTo(-30, 0);
          ctx.lineTo(30, 0);
          ctx.moveTo(0, -30);
          ctx.lineTo(0, 30);
          ctx.stroke();
          // Cross hair values
          ctx.font = '8px monospace';
          ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), 10, -10);
        }
      }
      
      ctx.restore();
    }
  }
  
  // Allocate particles per index pool
  function populateElements() {
    elements.length = 0;
    // Create pools for all 4 services
    for (let type = 0; type < 4; type++) {
      for (let i = 0; i < 20; i++) {
        elements.push(new FloatingObject(type));
      }
    }
  }
  
  populateElements();
  
  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    
    // Manage section transition fades
    if (prevIndex !== currentActiveIndex) {
      transitionProgress = 0;
      prevIndex = currentActiveIndex;
    }
    
    if (transitionProgress < 1.0) {
      transitionProgress += 0.02; // Transition speed
    } else {
      transitionProgress = 1.0;
    }
    
    // Draw all objects
    elements.forEach(obj => {
      obj.update();
      // Draw if active type or if fading out
      obj.draw(currentActiveIndex, transitionProgress);
    });
    
    requestAnimationFrame(renderLoop);
  }
  
  renderLoop();
}
