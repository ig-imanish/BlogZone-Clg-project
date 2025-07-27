/**
 * Simple Loading Manager for BlogZone Data Loading
 */

function createLoadingElement() {
  const loadingHTML = `
    <div id="dataLoading" class="data-loading-overlay">
      <div class="data-loading-container">
        <div class="data-loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="data-loading-text">
          <div class="loading-title">Loading...</div>
          <div class="loading-subtitle">Please wait while we fetch your content</div>
        </div>
      </div>
    </div>
  `;
  
  // Add styles
  const styles = `
    <style id="dataLoadingStyles">
      .data-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }

      .data-loading-overlay.fade-out {
        opacity: 0;
        pointer-events: none;
      }

      .data-loading-container {
        background: #1a1a1a;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .data-loading-spinner {
        margin-bottom: 20px;
      }

      .spinner {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        border: 4px solid #333;
        border-top: 4px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loading-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 8px;
        color: #6366f1;
      }

      .loading-subtitle {
        font-size: 0.9rem;
        color: #9ca3af;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .data-loading-container {
          padding: 30px 20px;
          margin: 20px;
        }
        
        .loading-title {
          font-size: 1.2rem;
        }
        
        .loading-subtitle {
          font-size: 0.8rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
        }
      }
    </style>
  `;
  
  // Add styles to head if not already added
  if (!document.getElementById('dataLoadingStyles')) {
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  // Add loading element to body if not already added
  if (!document.getElementById('dataLoading')) {
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
  }
}

function showDataLoading(message = 'Loading...', subtitle = 'Please wait while we fetch your content') {
  createLoadingElement();
  
  const loadingElement = document.getElementById('dataLoading');
  const titleElement = loadingElement.querySelector('.loading-title');
  const subtitleElement = loadingElement.querySelector('.loading-subtitle');
  
  if (titleElement) titleElement.textContent = message;
  if (subtitleElement) subtitleElement.textContent = subtitle;
  
  loadingElement.classList.remove('fade-out');
  loadingElement.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hideDataLoading() {
  const loadingElement = document.getElementById('dataLoading');
  if (loadingElement) {
    loadingElement.classList.add('fade-out');
    document.body.style.overflow = ''; // Restore scrolling
    setTimeout(() => {
      loadingElement.style.display = 'none';
    }, 300);
  }
}

// Make functions globally available
window.showDataLoading = showDataLoading;
window.hideDataLoading = hideDataLoading;
