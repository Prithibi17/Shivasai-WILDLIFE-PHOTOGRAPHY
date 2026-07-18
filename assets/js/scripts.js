/* -----------------------------------------
   SHIVASAI PORTFOLIO JAVASCRIPT
----------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Shuffle the gallery images for a fresh random playlist on every load
  if (window.galleryImages && window.galleryImages.length > 0) {
    for (let i = window.galleryImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [window.galleryImages[i], window.galleryImages[j]] = [window.galleryImages[j], window.galleryImages[i]];
    }
  }

  // Select DOM Elements
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  const scrollProgress = document.getElementById('scrollProgress');
  const loader = document.getElementById('pageLoader');
  const loaderFill = document.getElementById('loaderFill');
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const masonryGrid = document.getElementById('masonryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  const heroImg = document.getElementById('heroImg');

  // 1. ACTUAL LOADING EXPERIENCE
  const images = document.querySelectorAll('img');
  const totalImages = images.length;
  let loadedImages = 0;
  let progress = 0;

  function finishLoading() {
    if (loaderFill) loaderFill.style.width = '100%';
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }
      // Start any entrance animations if desired
      animateHero();
    }, 500);
  }

  function updateProgress() {
    loadedImages++;
    progress = totalImages === 0 ? 100 : Math.floor((loadedImages / totalImages) * 100);
    if (loaderFill) loaderFill.style.width = `${progress}%`;
    
    if (loadedImages >= totalImages) {
      finishLoading();
    }
  }

  if (totalImages === 0) {
    finishLoading();
  } else {
    images.forEach(img => {
      if (img.complete) {
        updateProgress();
      } else {
        img.addEventListener('load', updateProgress);
        img.addEventListener('error', updateProgress);
      }
    });
  }


  // 2. HERO PARALLAX & ENTRANCE ANIMATIONS
  function animateHero() {
    const revealTexts = document.querySelectorAll('.hero .reveal-text');
    revealTexts.forEach((el, idx) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, idx * 250);
    });
  }

  // Hero Mouse Reactive / Parallax Effect
  window.addEventListener('mousemove', (e) => {
    if (heroImg) {
      const moveX = (e.clientX - window.innerWidth / 2) * -0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * -0.01;
      heroImg.style.transform = `scale(1.04) translate(${moveX}px, ${moveY}px)`;
    }
  });


  // 3. CUSTOM CURSOR
  document.addEventListener('mousemove', (e) => {
    if (cursor && cursorFollower) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Delay effect for follower
      cursorFollower.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 250, fill: "forwards" });
    }
  });

  // Activate on interactive elements
  const interactiveEls = document.querySelectorAll('a, button, .masonry-item, .story-card');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower && cursorFollower.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorFollower && cursorFollower.classList.remove('active'));
  });


  // 4. SCROLL EVENTS (Navbar & Scroll Progress)
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Scroll Progress
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    // Sticky Navbar
    if (scrollY > 50) {
      navbar && navbar.classList.add('scrolled');
    } else {
      navbar && navbar.classList.remove('scrolled');
    }

    // Scroll Trigger Elements Visibility
    masonryItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        item.classList.add('visible');
      }
    });

    // About Stats Trigger (Counter)
    const statsSection = document.querySelector('.stats-row');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85 && !statsSection.dataset.triggered) {
        statsSection.dataset.triggered = 'true';
        animateCounters();
      }
    }
  });


  // 5. COUNTER ANIMATION FOR ABOUT ME
  function animateCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(numEl => {
      const target = parseInt(numEl.dataset.target, 10);
      let count = 0;
      const speed = Math.max(1, Math.floor(target / 40));
      const counterInterval = setInterval(() => {
        count += speed;
        if (count >= target) {
          numEl.textContent = target;
          clearInterval(counterInterval);
        } else {
          numEl.textContent = count;
        }
      }, 30);
    });
  }


  // 6. HAMBURGER & MOBILE MENU
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu on link click
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }


  // 7. BENTO PORTFOLIO FILTERING
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active filter classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      masonryItems.forEach(item => {
        const itemCat = item.dataset.category;
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1) translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9) translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });


  // 8. LIGHTBOX FUNCTIONALITY
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let activeIndex = 0;
  let currentLightboxImages = [];

  function openLightbox(index, customImages) {
    if (customImages) {
      currentLightboxImages = customImages;
    } else if (!currentLightboxImages || currentLightboxImages.length === 0) {
      currentLightboxImages = window.galleryImages || [];
    }

    activeIndex = index;
    if (currentLightboxImages && currentLightboxImages.length > 0) {
      const currentItem = currentLightboxImages[activeIndex];
      if (lightboxImg) lightboxImg.src = currentItem.url;
    }
    
    if (lightbox) lightbox.classList.add('active');
  }

  // Handle image clicks for masonry gallery
  masonryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.galleryImages && window.galleryImages.length > 0) {
        // By default, open full gallery
        const clickedImg = item.getAttribute('data-img');
        const idx = window.galleryImages.findIndex(img => img.url === clickedImg);
        openLightbox(idx !== -1 ? idx : 0, window.galleryImages);
      }
    });
  });

  // Handle image clicks for category cards
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.galleryImages && window.galleryImages.length > 0) {
        const category = card.getAttribute('data-category');
        const categoryImages = window.galleryImages.filter(img => img.category === category);
        if (categoryImages.length > 0) {
          openLightbox(0, categoryImages);
        }
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox && lightbox.classList.remove('active');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const maxLen = currentLightboxImages.length;
      if (maxLen === 0) return;
      if (activeIndex > 0) {
        openLightbox(activeIndex - 1);
      } else {
        openLightbox(maxLen - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxLen = currentLightboxImages.length;
      if (maxLen === 0) return;
      if (activeIndex < maxLen - 1) {
        openLightbox(activeIndex + 1);
      } else {
        openLightbox(0);
      }
    });
  }

  // Close when clicking background
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }


  const viewFullGalleryBtn = document.getElementById('viewFullGalleryBtn');
  if (viewFullGalleryBtn) {
    viewFullGalleryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Open full gallery starting at a random index
      const imgs = window.galleryImages || [];
      openLightbox(Math.floor(Math.random() * (imgs.length || 1)), imgs);
    });
  }

  // 9. ANIMATE INITIAL ON LOAD VISIBILITY (for viewport initial check)
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 1000);
});
