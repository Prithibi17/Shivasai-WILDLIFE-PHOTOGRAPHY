/**
 * Google Drive Image Gallery Integration
 * This script fetches image data from your deployed Google Apps Script Web App 
 * and injects the images into the portfolio masonry grid.
 */

// ============================================================================
// IMPORTANT: REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
// ============================================================================
const GAS_URL = 'YOUR_WEB_APP_URL_HERE'; 
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const masonryGrid = document.getElementById('masonryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (!masonryGrid) return;

  // Render a loading state
  masonryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">Loading images from Google Drive...</div>';

  if (GAS_URL === 'YOUR_WEB_APP_URL_HERE') {
    masonryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--accent-gold);">Please replace the GAS_URL in drive-gallery.js with your Web App URL.</div>';
    return;
  }

  // Fetch the data from the Google Apps Script endpoint
  fetch(GAS_URL)
    .then(response => response.json())
    .then(data => {
      // Clear the loading message
      masonryGrid.innerHTML = '';
      
      if (!data || data.length === 0) {
        masonryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No images found in your Google Drive folders.</div>';
        return;
      }

      // Generate HTML for each image
      data.forEach((image, index) => {
        // Randomly assign sizes for the masonry layout to keep it visually interesting
        const sizes = ['masonry-small', 'masonry-medium', 'masonry-large', 'masonry-wide', 'masonry-tall'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        
        // Ensure first item is large for hero impact
        const sizeClass = index === 0 ? 'masonry-large' : randomSize;

        // Build the HTML element
        const itemHtml = `
          <div class="masonry-item ${sizeClass}" data-category="${image.category}" data-img="${image.url}" data-title="${image.title}" data-location="From Google Drive">
            <img src="${image.url}" alt="${image.title}" loading="lazy"/>
            <div class="masonry-overlay">
              <div class="masonry-info">
                <span class="masonry-cat" style="text-transform: capitalize;">${image.category}</span>
                <h3>${image.title}</h3>
                <p>Explore →</p>
              </div>
            </div>
          </div>
        `;
        masonryGrid.insertAdjacentHTML('beforeend', itemHtml);
      });

      // Re-initialize filtering logic for the newly added dynamic items
      initializeDynamicFiltering();
    })
    .catch(error => {
      console.error('Error fetching Drive images:', error);
      masonryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ff5555;">Error loading images. Please make sure your Apps Script is deployed as "Anyone".</div>';
    });

  // Setup filtering for dynamic elements
  function initializeDynamicFiltering() {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('.masonry-item');
        
        items.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 400); // Matches CSS transition duration
          }
        });
      });
    });
    
    // Trigger initial filter animation to show elements
    setTimeout(() => {
      const activeBtn = document.querySelector('.filter-btn.active');
      if(activeBtn) activeBtn.click();
    }, 100);
  }
});
