/* ===========================================
   VALERIE'S JOURNEY - MAIN JAVASCRIPT
   Portfolio functionality with lightbox gallery
   =========================================== */

(function() {
  'use strict';

  /* ===========================================
     IMAGE GALLERY CONFIGURATION
     =========================================== */
  const IMAGES = [
    { src: 'assets/images/1.jpeg', caption: 'Sketch for Vin\'s human form', category: 'concept' },
    { src: 'assets/images/2.jpeg', caption: 'Sketch for Vincent\'s demonic form', category: 'concept' },
    { src: 'assets/images/3.jpeg', caption: 'Sketch for Valerie\'s demonic form (head)', category: 'concept' },
    { src: 'assets/images/4.jpeg', caption: 'Sketch for Vin\'s demonic form', category: 'concept' },
    { src: 'assets/images/5.jpeg', caption: 'Sketch for Vincent\'s demonic form #2', category: 'concept' },
    { src: 'assets/images/6.jpeg', caption: 'Sketch for Valerie\'s human form', category: 'concept' },
    { src: 'assets/images/7.jpeg', caption: 'Valerie concept (human form)', category: 'concept' },
    { src: 'assets/images/10.jpeg', caption: 'Demonic form concept', category: 'concept' },
    { src: 'assets/images/12.jpeg', caption: 'Final concept for the character trio', category: 'concept' },
    { src: 'assets/images/13.jpeg', caption: 'Valerie\'s weapon concept', category: 'concept' }
  ];

  /* ===========================================
     LIGHTBOX GALLERY SYSTEM
     =========================================== */
  let currentIndex = 0;

  // Create concept art circles for archive section
  function createConceptCircle(imgObj, index) {
    const circle = document.createElement('div');
    circle.className = 'concept-circle';
    circle.style.backgroundImage = `url('${imgObj.src}')`;
    circle.dataset.index = index;
    
    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(index);
    });
    
    return circle;
  }

  // Populate concept circles in archive section
  function populateConceptCircles() {
    const containers = document.querySelectorAll('.concept-circles');
    
    containers.forEach(container => {
      container.innerHTML = '';
      
      const conceptImages = IMAGES.filter(img => img.category === 'concept');
      const maxCircles = Math.min(conceptImages.length, 6);
      
      for (let i = 0; i < maxCircles; i++) {
        const imageIndex = IMAGES.indexOf(conceptImages[i]);
        const circle = createConceptCircle(conceptImages[i], imageIndex);
        container.appendChild(circle);
      }
    });
  }

  // Setup archive category click handlers
  function setupArchiveInteractions() {
    document.querySelectorAll('.archive-category').forEach(category => {
      const categoryType = category.dataset.category;
      
      category.addEventListener('click', () => {
        if (categoryType === 'concept') {
          const conceptImages = IMAGES.filter(img => img.category === 'concept');
          if (conceptImages.length > 0) {
            const firstIndex = IMAGES.indexOf(conceptImages[0]);
            openLightbox(firstIndex);
          }
        }
      });
    });
  }

  // Open lightbox at specific image index
  function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.querySelector('.lightbox-caption');
    
    if (lightbox && img && IMAGES[index]) {
      img.src = IMAGES[index].src;
      img.alt = IMAGES[index].caption || '';
      caption.textContent = IMAGES[index].caption || '';
      
      lightbox.style.display = 'block';
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus close button for accessibility
      lightbox.querySelector('.close').focus();
    }
  }

  // Close lightbox
  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Navigate to previous image
  function showPreviousImage() {
    currentIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
    updateLightboxImage();
  }

  // Navigate to next image  
  function showNextImage() {
    currentIndex = (currentIndex + 1) % IMAGES.length;
    updateLightboxImage();
  }

  // Update lightbox image and caption
  function updateLightboxImage() {
    const img = document.getElementById('lightbox-img');
    const caption = document.querySelector('.lightbox-caption');
    
    if (img && IMAGES[currentIndex]) {
      img.src = IMAGES[currentIndex].src;
      img.alt = IMAGES[currentIndex].caption || '';
      caption.textContent = IMAGES[currentIndex].caption || '';
    }
  }

  /* ===========================================
     NAVIGATION & SCROLL BEHAVIOR
     =========================================== */
  
  // Smooth scroll for navigation links
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Active navigation highlighting
  function setupActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 100)) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').slice(1) === current) {
          link.style.color = 'var(--accent)';
        }
      });
    });
  }

  /* ===========================================
     ANIMATIONS & EFFECTS
     =========================================== */
  
  // Fade-in animation on scroll
  function setupFadeInAnimations() {
    const observerOptions = { 
      threshold: 0.1, 
      rootMargin: '0px 0px -100px 0px' 
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  // Hero title glitch effect
  function setupHeroEffects() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      heroTitle.addEventListener('mouseenter', () => {
        heroTitle.style.animation = 'glitch 0.3s infinite';
      });
      
      heroTitle.addEventListener('mouseleave', () => {
        heroTitle.style.animation = 'glitch 6s infinite';
      });
    }
  }

  /* ===========================================
     EVENT LISTENERS & INITIALIZATION
     =========================================== */
  
  // Setup lightbox event listeners
  function setupLightboxEvents() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    // Close button
    lightbox.querySelector('.close').addEventListener('click', closeLightbox);
    
    // Navigation buttons
    lightbox.querySelector('.prev').addEventListener('click', showPreviousImage);
    lightbox.querySelector('.next').addEventListener('click', showNextImage);
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'block') {
        switch(e.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowLeft':
            showPreviousImage();
            break;
          case 'ArrowRight':
            showNextImage();
            break;
        }
      }
    });
  }

  // Initialize all functionality when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Setup navigation and scrolling
    setupSmoothScrolling();
    setupActiveNavigation();
    
    // Setup animations and effects
    setupFadeInAnimations();
    setupHeroEffects();
    
    // Setup gallery system
    populateConceptCircles();
    setupArchiveInteractions();
    setupLightboxEvents();
  });

})();