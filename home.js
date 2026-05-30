// DM DS Home Page Scripts

document.addEventListener('DOMContentLoaded', () => {
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
