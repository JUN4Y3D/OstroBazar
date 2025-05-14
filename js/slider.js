// Banner Slider functionality

// Variables
let currentSlide = 0;
let slideshowInterval;

// Initialize banner slider
export function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevButton = document.getElementById('prev-slide');
  const nextButton = document.getElementById('next-slide');
  
  if (slides.length === 0) return;
  
  // Set up event listeners
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetSlideshow();
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetSlideshow();
    });
  }
  
  // Add click event to indicators
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const slideIndex = parseInt(indicator.dataset.index);
      goToSlide(slideIndex);
      resetSlideshow();
    });
  });
  
  // Set up automatic slideshow
  startSlideshow();
  
  // Pause slideshow on hover
  const sliderContainer = document.querySelector('.banner-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', pauseSlideshow);
    sliderContainer.addEventListener('mouseleave', startSlideshow);
  }
}

// Go to specific slide
function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  
  if (slides.length === 0) return;
  
  // Handle index bounds
  if (index < 0) {
    index = slides.length - 1;
  } else if (index >= slides.length) {
    index = 0;
  }
  
  // Update current slide
  currentSlide = index;
  
  // Update slide classes
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
  
  // Update indicators
  indicators.forEach((indicator, i) => {
    indicator.classList.remove('active');
    if (i === index) {
      indicator.classList.add('active');
    }
  });
}

// Start automatic slideshow
function startSlideshow() {
  // Clear any existing interval
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
  }
  
  // Set new interval
  slideshowInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000); // Change slide every 5 seconds
}

// Pause slideshow
function pauseSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
}

// Reset slideshow timer
function resetSlideshow() {
  pauseSlideshow();
  startSlideshow();
}