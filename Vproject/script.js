/* script.js - Combined: your site scripts + gallery lightbox
   INSTALL: Replace your current script.js with this file.
   EDIT: Change the IMAGES array below to point to your actual image paths.
*/

(function () {
  /* =========================
     CONFIG: edit these items
     ========================= */
  // array of images for the gallery. Edit paths/captions/categories here.
  // category can be 'archive', 'concept', 'level', 'dialogue', 'combat', 'asset', etc.
  // If the grid for a category doesn't exist, thumbnails go to the first .archive-grid found.
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
    { src: 'assets/images/13.jpeg', caption: 'Valerie\'s weapon concept', category: 'concept' },
    // add more like:
    // { src: 'assets/images/e41cb5a0-d024-401b-bf09-18b060c76360.jpeg', caption: 'Extra sketch', category: 'asset' },
  ];

  /* =========================
     Helper & DOM utilities
     ========================= */
  function createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'dataset') {
        Object.keys(attrs[k]).forEach(dk => el.dataset[dk] = attrs[k][dk]);
      } else if (k.startsWith('aria')) el.setAttribute(k, attrs[k]);
      else el[k] = attrs[k];
    }
    (Array.isArray(children) ? children : [children]).forEach(ch => {
      if (!ch) return;
      el.appendChild(typeof ch === 'string' ? document.createTextNode(ch) : ch);
    });
    return el;
  }

  /* =========================
     Inject lightbox styles (so you don't need to edit CSS)
     ========================= */
  function injectLightboxStyles() {
    if (document.getElementById('vj-lightbox-styles')) return;
    const css = `
/* Lightbox injected styles */
#vj-lightbox { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 99999; }
#vj-lightbox[aria-hidden="false"] { display: flex; }
#vj-lightbox .vj-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
#vj-lightbox .vj-frame { position: relative; max-width: 92vw; max-height: 92vh; width: 92vw; height: 92vh; display:flex; align-items:center; justify-content:center; }
#vj-lightbox .vj-image-wrap { max-width:100%; max-height:100%; display:flex; align-items:center; justify-content:center; }
#vj-lightbox .vj-image-wrap img { max-width:100%; max-height:100%; box-shadow: 0 20px 60px rgba(0,0,0,0.6); border-radius:4px; display:block; }
#vj-lightbox .vj-close, #vj-lightbox .vj-prev, #vj-lightbox .vj-next { position:absolute; background: rgba(255,255,255,0.06); border:0; color: white; padding: .6rem; border-radius:6px; cursor:pointer; backdrop-filter: blur(6px); }
#vj-lightbox .vj-close { top: 12px; right: 12px; font-size:1.2rem; }
#vj-lightbox .vj-prev { left: 12px; height:48px; width:44px; font-size:2rem; display:flex; align-items:center; justify-content:center; }
#vj-lightbox .vj-next { right: 12px; height:48px; width:44px; font-size:2rem; display:flex; align-items:center; justify-content:center; }
#vj-lightbox .vj-caption { position:absolute; left:50%; transform:translateX(-50%); bottom:12px; color: rgba(255,255,255,0.85); font-size: .95rem; background: rgba(0,0,0,0.25); padding:6px 10px; border-radius:6px; }
body.vj-lightbox-open > *:not(#vj-lightbox) { filter: blur(8px) !important; pointer-events: none !important; user-select: none !important; }
@media (max-width:640px){ #vj-lightbox .vj-prev, #vj-lightbox .vj-next { display:none } }
`;
    const s = createEl('style', { id: 'vj-lightbox-styles' }, css);
    document.head.appendChild(s);
  }

  /* =========================
     Build / insert lightbox DOM
     ========================= */
  function buildLightbox() {
    if (document.getElementById('vj-lightbox')) return;
    const lb = createEl('div', { id: 'vj-lightbox', 'aria-hidden': 'true' });
    const overlay = createEl('div', { class: 'vj-overlay', id: 'vjOverlay' });
    const frame = createEl('div', { class: 'vj-frame', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Image viewer' });
    const closeBtn = createEl('button', { class: 'vj-close', id: 'vjClose', ariaLabel: 'Close (Esc)' }, '✕');
    const prevBtn = createEl('button', { class: 'vj-prev', id: 'vjPrev', ariaLabel: 'Previous image' }, '‹');
    const nextBtn = createEl('button', { class: 'vj-next', id: 'vjNext', ariaLabel: 'Next image' }, '›');
    const imgWrap = createEl('div', { class: 'vj-image-wrap' });
    const imgEl = createEl('img', { id: 'vjImage', src: '', alt: '' });
    imgWrap.appendChild(imgEl);
    const caption = createEl('div', { class: 'vj-caption', id: 'vjCaption' });
    frame.appendChild(closeBtn);
    frame.appendChild(prevBtn);
    frame.appendChild(imgWrap);
    frame.appendChild(nextBtn);
    frame.appendChild(caption);
    lb.appendChild(overlay);
    lb.appendChild(frame);
    document.body.appendChild(lb);
  }

  /* =========================
     Concept circles and category handling
     ========================= */
  function makeConceptCircle(imgObj, index) {
    const circle = createEl('div', { 
      class: 'concept-circle', 
      dataset: { index: index },
      style: `background-image: url('${imgObj.src}')`
    });
    
    // click handler: open lightbox to this image
    circle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent category click
      openLightbox(index);
    });
    
    return circle;
  }

  function populateConceptCircles() {
    const conceptCirclesContainer = document.querySelector('.concept-circles');
    if (!conceptCirclesContainer) return;
    
    // Clear existing circles
    conceptCirclesContainer.innerHTML = '';
    
    // Add circles for concept images (max 6 to fit nicely)
    const conceptImages = IMAGES.filter(img => img.category === 'concept');
    const maxCircles = Math.min(conceptImages.length, 6);
    
    for (let i = 0; i < maxCircles; i++) {
      const circle = makeConceptCircle(conceptImages[i], IMAGES.indexOf(conceptImages[i]));
      conceptCirclesContainer.appendChild(circle);
    }
    
    // Update count
    const countElement = document.querySelector('[data-category="concept"] .preview-count');
    if (countElement) {
      countElement.textContent = `${conceptImages.length} items`;
    }
  }

  function setupCategoryClicks() {
    document.querySelectorAll('.archive-category').forEach(category => {
      const categoryType = category.dataset.category;
      
      category.addEventListener('click', () => {
        if (categoryType === 'concept') {
          // For concept category, open first image directly
          const conceptImages = IMAGES.filter(img => img.category === 'concept');
          if (conceptImages.length > 0) {
            const firstIndex = IMAGES.indexOf(conceptImages[0]);
            openLightbox(firstIndex);
          }
        } else {
          // For other categories, could show "Coming Soon" or do nothing
          console.log(`${categoryType} category clicked - no content yet`);
        }
      });
    });
  }

  /* =========================
     Lightbox behavior
     ========================= */
  let currentIndex = 0;
  function openLightbox(idx) {
    currentIndex = idx;
    const lb = document.getElementById('vj-lightbox');
    const img = document.getElementById('vjImage');
    const caption = document.getElementById('vjCaption');
    img.src = IMAGES[idx].src;
    img.alt = IMAGES[idx].caption || '';
    caption.textContent = IMAGES[idx].caption || '';
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('vj-lightbox-open');
    document.body.style.overflow = 'hidden';
    // focus close for keyboard accessibility
    document.getElementById('vjClose').focus();
  }
  function closeLightbox() {
    const lb = document.getElementById('vj-lightbox');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('vj-lightbox-open');
    document.body.style.overflow = '';
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + IMAGES.length) % IMAGES.length;
    const img = document.getElementById('vjImage');
    const caption = document.getElementById('vjCaption');
    img.src = IMAGES[currentIndex].src;
    caption.textContent = IMAGES[currentIndex].caption || '';
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % IMAGES.length;
    const img = document.getElementById('vjImage');
    const caption = document.getElementById('vjCaption');
    img.src = IMAGES[currentIndex].src;
    caption.textContent = IMAGES[currentIndex].caption || '';
  }

  /* =========================
     Integration with page events + original scripts
     ========================= */
  document.addEventListener('DOMContentLoaded', () => {
    /* ---------- your original smooth scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* ---------- fade-in intersection observer (keeps original) ---------- */
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ---------- active nav highlighting (original) ---------- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 100)) current = section.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').slice(1) === current) link.style.color = 'var(--accent)';
      });
    });

    /* ---------- glitch hover (original) ---------- */
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      heroTitle.addEventListener('mouseenter', () => heroTitle.style.animation = 'glitch 0.3s infinite');
      heroTitle.addEventListener('mouseleave', () => heroTitle.style.animation = 'glitch 6s infinite');
    }

    /* ---------- build gallery (styles + DOM) ---------- */
    injectLightboxStyles();
    buildLightbox();
    populateConceptCircles();
    setupCategoryClicks();

    /* ---------- lightbox event wiring ---------- */
    document.getElementById('vjClose').addEventListener('click', closeLightbox);
    document.getElementById('vjPrev').addEventListener('click', showPrev);
    document.getElementById('vjNext').addEventListener('click', showNext);
    document.getElementById('vjOverlay').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('vj-lightbox');
      if (lb && lb.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  });

  /* expose a small API to add images dynamically if needed */
  window.VJGallery = {
    addImage(imgObj) {
      IMAGES.push(imgObj);
      // create thumb and append to archive by default (not best for large galleries)
      const idx = IMAGES.length - 1;
      const grid = getGridForCategory(imgObj.category) || document.querySelector('.archive-grid');
      if (grid) grid.appendChild(makeThumbnail(imgObj, idx));
    },
    openAt(index) { if (index >= 0 && index < IMAGES.length) openLightbox(index); }
  };

})();