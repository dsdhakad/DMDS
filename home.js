// DM DS Home Page Scripts

document.addEventListener('DOMContentLoaded', () => {
  initHeroWaveAnimation();
  initHeroAnimations();
  init3DScrollRotations();
  initStatsCounters();
  initTestimonialCarousel();
  initHomeScrollButtons();
});


// 2. KINETIC TYPOGRAPHY SPLIT & INTRO REVEALS
function initHeroAnimations() {
  const headline = document.getElementById('hero-headline');
  if (!headline) return;
  
  const text = "WE BUILD LEGACIES.";
  
  headline.innerHTML = text.split("").map(char => {
    if (char === " ") {
      return `<span style="width: 0.28em;">&nbsp;</span>`;
    }
    return `<span class="hero-char">${char}</span>`;
  }).join("");
  
  const tl = gsap.timeline();
  
  tl.to('.hero-char', {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    stagger: 0.04,
    duration: 1.4,
    ease: "power4.out"
  })
  .to('#hero-subheadline', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8")
  .to('#hero-button-wrap', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.6")
  .to('.scroll-down', {
    opacity: 0.7,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.4");
}

// 3. ENHANCED 3D SCROLL CYLINDER ROTATIONS & DEPTH PARALLAX
function init3DScrollRotations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero fade and zoom out on scroll
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero-container',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    scale: 0.8,
    opacity: 0,
    y: -50
  });


  
  // Apply a 3D rolling drum/cylinder rotation tilt to all sections on scroll (desktop only)
  if (window.innerWidth > 768) {
    const sections = gsap.utils.toArray('.scroll-rotate-section');
    
    sections.forEach((sec) => {
      // Determine target rotations depending on class
      gsap.fromTo(sec, 
        {
          rotationX: 12,
          z: -80,
          transformOrigin: "top center"
        },
        {
          rotationX: -12,
          z: -80,
          scrollTrigger: {
            trigger: sec,
            start: "top bottom", // Starts rotating when section top hits viewport bottom
            end: "bottom top",   // Finishes when section bottom leaves viewport top
            scrub: 1.2
          }
        }
      );
    });
  }
  
  // Custom depth scale trigger for Services grid wrapper
  gsap.fromTo('.services-grid-wrapper', 
    {
      scale: 0.9,
      opacity: 0.8
    },
    {
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        trigger: '#services-matrix',
        start: 'top bottom',
        end: 'top center',
        scrub: 1
      }
    }
  );
}

// 4. STATS COUNTING ANIMATION
function initStatsCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  ScrollTrigger.create({
    trigger: "#impact-stats",
    start: "top 85%", // Trigger when stats section enters viewport
    onEnter: () => {
      document.querySelectorAll('.stat-number').forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        const parentCard = num.closest('.stat-card');
        
        // Pick proper formats based on card labels
        const isSpend = parentCard.classList.contains('gold-glow-hover') && target === 40;
        const isLeads = parentCard.classList.contains('indigo-glow-hover') && target === 9;
        const isSpeed = parentCard.classList.contains('gold-glow-hover') && target === 99;
        
        let prefix = isSpend ? '₹' : '';
        let suffix = isSpend ? 'Cr+' :
                     isLeads ? 'M+' :
                     isSpeed ? '' : '+';
                     
        let counter = { val: 0 };
        
        gsap.to(counter, {
          val: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            num.textContent = prefix + Math.floor(counter.val) + suffix;
          }
        });
      });
    }
  });
}

// 5. TESTIMONIALS CAROUSEL SCROLLER
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.getElementById('prev-review');
  const nextBtn = document.getElementById('next-review');
  
  if (cards.length === 0) return;
  
  let currentIdx = 0;
  let autoTimer;
  
  function showReview(targetIdx) {
    // Deactivate current active review
    cards[currentIdx].classList.remove('active');
    
    // Manage bounds
    if (targetIdx >= cards.length) {
      currentIdx = 0;
    } else if (targetIdx < 0) {
      currentIdx = cards.length - 1;
    } else {
      currentIdx = targetIdx;
    }
    
    // Activate target review
    cards[currentIdx].classList.add('active');
    
    // Reset timer
    resetAutoCycle();
  }
  
  function nextReview() {
    showReview(currentIdx + 1);
  }
  
  function prevReview() {
    showReview(currentIdx - 1);
  }
  
  if (nextBtn) nextBtn.addEventListener('click', nextReview);
  if (prevBtn) prevBtn.addEventListener('click', prevReview);
  
  function resetAutoCycle() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextReview, 6000); // Cycle reviews every 6s
  }
  
  resetAutoCycle();
}

// 6. HOME PAGE SCROLL LINK HOOKS
function initHomeScrollButtons() {
  const scrollBtn = document.getElementById('scroll-btn');
  const exploreBtn = document.querySelector('.scroll-trigger-btn');
  const target = document.getElementById('philosophy');
  
  const handler = (e) => {
    e.preventDefault();
    if (!target) return;
    
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (scrollBtn) scrollBtn.addEventListener('click', handler);
  if (exploreBtn) exploreBtn.addEventListener('click', handler);
}

// 7. HERO 3D DIGITAL WAVE BACKGROUND ANIMATION
function initHeroWaveAnimation() {
  const canvas = document.getElementById('hero-animation-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Safe measurement function
  function getDimensions() {
    const parent = canvas.parentElement;
    let w = parent ? parent.offsetWidth : 0;
    let h = parent ? parent.offsetHeight : 0;
    
    // Fallback to window dimensions if parent is 0
    if (w === 0) w = window.innerWidth;
    if (h === 0) h = window.innerHeight;
    
    return { w, h };
  }
  
  let dims = getDimensions();
  let width = canvas.width = dims.w;
  let height = canvas.height = dims.h;
  
  window.addEventListener('resize', () => {
    if (!canvas) return;
    dims = getDimensions();
    width = canvas.width = dims.w;
    height = canvas.height = dims.h;
  });
  
  // Grid parameters
  const cols = 35;
  const rows = 25;
  
  let points = [];
  
  // Initialize points in a grid using normalized (0-1) coordinates
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push({
        u: c / (cols - 1),
        v: r / (rows - 1),
        x: 0,
        y: 0,
        baseX: 0,
        baseY: 0,
        z: 0,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  
  let time = 0;
  let mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
  
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - rect.left;
    mouse.ty = e.clientY - rect.top;
  });
  
  function draw() {
    if (!canvas) return;
    ctx.clearRect(0, 0, width, height);
    
    // Smooth mouse coordinates
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    
    time += 0.015;
    
    // Update point heights (Z) based on sine/cosine wave equations
    points.forEach(p => {
      // Calculate dynamic base position based on current width/height
      p.baseX = p.u * width;
      p.baseY = p.v * height;
      
      // Distance from mouse
      const dx = p.baseX - mouse.x;
      const dy = p.baseY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = Math.max(0, 1 - dist / 300);
      
      // Calculate Wave height (Z)
      const wave1 = Math.sin(p.baseX * 0.005 + time) * 30;
      const wave2 = Math.cos(p.baseY * 0.006 + time * 1.5) * 25;
      const wave3 = Math.sin((p.baseX + p.baseY) * 0.003 - time) * 20;
      
      p.z = wave1 + wave2 + wave3 + mouseInfluence * 60;
      
      // Shift point slightly in 2D space based on Z and mouse distance
      p.x = p.baseX + (dx / (dist || 1)) * mouseInfluence * -30;
      p.y = p.baseY + (dy / (dist || 1)) * mouseInfluence * -30;
    });
    
    // Draw grid mesh lines
    ctx.lineWidth = 0.6;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const p = points[idx];
        
        // Project height (Z) as vertical offset
        const screenX = p.x;
        const screenY = p.y - p.z;
        
        // Draw line to right neighbor
        if (c < cols - 1) {
          const pRight = points[idx + 1];
          const rightX = pRight.x;
          const rightY = pRight.y - pRight.z;
          
          // Calculate gradient/color based on average height/depth
          const avgZ = (p.z + pRight.z) / 2;
          const alpha = 0.05 + Math.min(0.2, (avgZ + 40) / 150);
          
          // Mix Indigo and Gold
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          if (avgZ > 20) {
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          }
          
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(rightX, rightY);
          ctx.stroke();
        }
        
        // Draw line to bottom neighbor
        if (r < rows - 1) {
          const pBottom = points[idx + cols];
          const bottomX = pBottom.x;
          const bottomY = pBottom.y - pBottom.z;
          
          const avgZ = (p.z + pBottom.z) / 2;
          const alpha = 0.05 + Math.min(0.2, (avgZ + 40) / 150);
          
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          if (avgZ > 20) {
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
          }
          
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(bottomX, bottomY);
          ctx.stroke();
        }
      }
    }
    
    // Draw small dust/particle nodes on grid intersections
    ctx.fillStyle = 'rgba(243, 244, 246, 0.25)';
    points.forEach((p, idx) => {
      if (idx % 3 === 0 && p.z > 5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y - p.z, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}
