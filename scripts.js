/* -----------------------------------------
   SHIVASAI PORTFOLIO JAVASCRIPT
----------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Select DOM Elements
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  const scrollProgress = document.getElementById('scrollProgress');
  const loader = document.getElementById('pageLoader');
  const loaderFill = document.getElementById('loaderFill');
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const bentoGrid = document.getElementById('bentoGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bentoItems = document.querySelectorAll('.bento-item');
  const heroImg = document.getElementById('heroImg');

  // 1. SIMULATE LOADING EXPERIENCE
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Complete fill and hide loader
      if (loaderFill) loaderFill.style.width = '100%';
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
        }
        // Start any entrance animations if desired
        animateHero();
      }, 500);
    } else {
      if (loaderFill) loaderFill.style.width = `${progress}%`;
    }
  }, 80);


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
  const interactiveEls = document.querySelectorAll('a, button, .bento-item, .story-card');
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
    bentoItems.forEach(item => {
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

      bentoItems.forEach(item => {
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
  let visibleItems = [];

  function openLightbox(index) {
    activeIndex = index;
    const currentItem = visibleItems[activeIndex];
    if (currentItem) {
      if (lightboxImg) lightboxImg.src = currentItem.dataset.img || '';
      if (lightboxTitle) lightboxTitle.textContent = currentItem.dataset.title || '';
      if (lightboxLocation) lightboxLocation.textContent = currentItem.dataset.location || '';
      if (lightbox) lightbox.classList.add('active');
    }
  }

  // Handle image clicks for bento gallery
  bentoItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleItems = Array.from(bentoItems).filter(i => i.style.display !== 'none');
      const idx = visibleItems.indexOf(item);
      openLightbox(idx);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox && lightbox.classList.remove('active');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeIndex > 0) {
        openLightbox(activeIndex - 1);
      } else {
        openLightbox(visibleItems.length - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeIndex < visibleItems.length - 1) {
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


  // 9. ANIMATE INITIAL ON LOAD VISIBILITY (for viewport initial check)
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 1000);
});
