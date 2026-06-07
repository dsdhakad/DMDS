// DM DS Contact Onboarding Page Scripts

document.addEventListener('DOMContentLoaded', () => {
  initFormStepper();
  initBudgetSlider();
  initServiceCheckcards();
  initVisualSlideshow();
});

// 1. MULTI-STEP FORM NAVIGATION & VALIDATION
function initFormStepper() {
  const steps = document.querySelectorAll('.form-step');
  const dots = document.querySelectorAll('.step-dot');
  const form = document.getElementById('onboarding-form');
  
  if (!form) return;
  
  let currentStepIdx = 0;
  
  // Get buttons
  const nextBtns = document.querySelectorAll('.next-step-btn');
  const prevBtns = document.querySelectorAll('.prev-step-btn');
  
  // Next step handler
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStepIdx)) {
        goToStep(currentStepIdx + 1);
      }
    });
  });
  
  // Previous step handler
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(currentStepIdx - 1);
    });
  });
  
  // Form submission handler
  const submitBtn = document.getElementById('btn-submit');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect data
    const name = document.getElementById('client-name').value;
    const brand = document.getElementById('client-brand').value;
    const email = document.getElementById('client-email').value;
    const budget = document.getElementById('slider-val').textContent;
    
    const selectedServices = [];
    document.querySelectorAll('.checkbox-card.selected').forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      if (checkbox) {
        selectedServices.push(checkbox.value);
      }
    });
    const servicesString = selectedServices.join(', ');

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    // Web3Forms payload
    const payload = {
      access_key: "d6351ff4-d193-4bda-bc8e-87991455e2b8",
      name: name,
      email: email,
      brand: brand,
      services: servicesString,
      budget: budget,
      subject: `New Onboarding Lead: ${name} (${brand})`,
      from_name: "DM DS Agency Portal"
    };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        goToStep('success');
        form.reset();
        // Remove selected class from checkcards
        document.querySelectorAll('.checkbox-card').forEach(card => card.classList.remove('selected'));
        // Reset budget label
        const budgetVal = document.getElementById('slider-val');
        if (budgetVal) budgetVal.textContent = 'Under ₹5 Lakhs';
      } else {
        console.log(response);
        alert(json.message || "Something went wrong. Please try again.");
      }
    })
    .catch(error => {
      console.log(error);
      alert("Form submission failed. Please check your internet connection.");
    })
    .finally(() => {
      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Project <i class="fa-solid fa-paper-plane"></i>';
      }
    });
  });
  
  function goToStep(targetStep) {
    // Determine active index
    let nextIdx = targetStep;
    
    // If targeted index is success
    if (targetStep === 'success') {
      nextIdx = 3; // Out of steps array bounds
    }
    
    // Deactivate current active step
    steps[currentStepIdx].classList.remove('active');
    
    // Update stepper dot indicator
    dots.forEach((dot, index) => {
      if (index === nextIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Activate target step
    if (targetStep === 'success') {
      const successStep = document.getElementById('step-success');
      successStep.classList.add('active');
      // Hide steps dot tracker on success screen
      document.querySelector('.steps-indicator').style.display = 'none';
    } else {
      steps[targetStep].classList.add('active');
      currentStepIdx = targetStep;
    }
  }
  
  function validateStep(stepIdx) {
    if (stepIdx === 0) {
      const name = document.getElementById('client-name');
      const brand = document.getElementById('client-brand');
      const email = document.getElementById('client-email');
      
      // Simple required verification
      if (!name.value.trim() || !brand.value.trim() || !email.value.trim()) {
        alert('Please fill out all fields to register connection.');
        return false;
      }
      
      // Email format regex verification
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        alert('Please enter a valid email address.');
        return false;
      }
      
      return true;
    }
    
    if (stepIdx === 1) {
      // Make sure at least one service card is checked
      const checkedCards = document.querySelectorAll('.checkbox-card.selected');
      if (checkedCards.length === 0) {
        alert('Please select at least one vertical to continue onboarding.');
        return false;
      }
      return true;
    }
    
    return true;
  }
}

// 2. BUDGET RANGE INTERPOLATOR
function initBudgetSlider() {
  const slider = document.getElementById('client-budget');
  const label = document.getElementById('slider-val');
  
  if (!slider || !label) return;
  
  const budgetLevels = {
    1: 'Under ₹5 Lakhs',
    2: '₹5 Lakhs to ₹10 Lakhs',
    3: '₹10 Lakhs to ₹25 Lakhs',
    4: '₹25 Lakhs to ₹50 Lakhs',
    5: 'Above ₹50 Lakhs'
  };
  
  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    label.textContent = budgetLevels[val] || 'Under ₹5 Lakhs';
  });
}

// 3. SERVICE CHECKBOX CARDS
function initServiceCheckcards() {
  const cards = document.querySelectorAll('.checkbox-card');
  
  cards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    
    card.addEventListener('click', () => {
      if (!checkbox) return;
      
      // Toggle checked state
      checkbox.checked = !checkbox.checked;
      card.classList.toggle('selected');
    });
  });
}

// 4. TESTIMONIAL & SLIDESHOW CAROUSEL ROTATOR
function initVisualSlideshow() {
  const slides = document.querySelectorAll('.slide-item');
  const testimonials = document.querySelectorAll('.testimonial-overlay');
  
  if (slides.length === 0 || testimonials.length === 0) return;
  
  let currentIdx = 0;
  
  function rotateSlideshow() {
    // Fade out current slide & testimonial
    slides[currentIdx].classList.remove('active');
    testimonials[currentIdx % testimonials.length].classList.remove('active');
    
    // Cycle index
    currentIdx = (currentIdx + 1) % slides.length;
    
    // Fade in new slide & testimonial
    slides[currentIdx].classList.add('active');
    // Wrapped index sync for testimonial
    testimonials[currentIdx % testimonials.length].classList.add('active');
  }
  
  // Set rotation timer every 5000ms
  setInterval(rotateSlideshow, 5000);
}
