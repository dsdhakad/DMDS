// DM DS Portfolio Page Scripts

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioHoverEffect();
  initPortfolioParallax();
});

// 1. DYNAMIC BACKGROUND DARKEN & TILT HOVER EFFECTS
function initPortfolioHoverEffect() {
  const cards = document.querySelectorAll('.portfolio-card');
  const body = document.body;
  
  cards.forEach(card => {
    const wrapper = card.querySelector('.portfolio-img-wrapper');
    const info = card.querySelector('.portfolio-info');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation ratios
      const rotateX = -(y - centerY) / 18;
      const rotateY = (x - centerX) / 18;
      
      // Apply 3D matrix offsets
      if (wrapper) {
        wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
      }
      if (info) {
        info.style.transform = `perspective(1000px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) translateZ(25px)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      // Return smoothly to flat default state
      if (wrapper) {
        wrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)';
      }
      if (info) {
        info.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }
      
      body.classList.remove('project-hovered');
    });
    
    card.addEventListener('mouseenter', () => {
      body.classList.add('project-hovered');
    });
  });
}

// 2. PARALLAX FLOATING SCROLL EFFECT FOR CARDS
function initPortfolioParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  const cards = gsap.utils.toArray('.portfolio-card');
  
  cards.forEach((card, index) => {
    // Left vs Right column speed variation
    const isLeftColumn = index % 2 === 0;
    const speed = isLeftColumn ? -60 : 60;
    
    gsap.fromTo(card,
      {
        y: isLeftColumn ? 30 : 130
      },
      {
        y: isLeftColumn ? -30 : 30,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      }
    );
  });
}
