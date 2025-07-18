import {data} from "../api/api.js"

// Detect if we're on the profile page
const isProfilePage = document.title === 'profile' || window.location.pathname.includes('profile');

function renderCard(data) {
      // Different template for profile page
      if (isProfilePage) {
        return `
        <div class="card" style="margin-top: 20px">
          <a class="heading" href="">
            <h2>
              ${data.title}
            </h2>
            <span class="moreIcon"><i class="ri-more-line"></i></span>
          </a>
          <div class="profile-section">
            <img src="${data.avatar}" alt="" />
            <div class="userinfo">
              <div class="fullname">
                ${data.fullname}
                ${
                  data.isVerified
                    ? '<i class="ri-verified-badge-fill" style="color: #0254f7"></i>'
                    : ""
                }
              </div>
              <div class="username">${data.username}</div>
            </div>
          </div>
          <div class="desc-img">
            <a href="">
              <div class="desc">
                ${data.desc}
              </div>
            </a>
            <a href="">
              <img src="${data.banner}" alt="" />
            </a>
          </div>
          <div class="footer">
            <div class="fcard ml-20">
              <i class="fa-solid fa-thumbs-up"></i> Like
            </div>
            <div class="fcard">
              <i class="fa-solid fa-bookmark"></i> Bookmark
            </div>
            <div class="fcard">
              <i class="fa-solid fa-share-from-square"></i> Share
            </div>
            <div class="fcard mr-20">
              <i class="fa-regular fa-clock"></i> ${data.timestamp}
            </div>
          </div>
        </div>
        `;
      } else {
        // Default template for home page
        return `
        <div class="card">
          <a href="">
            <h2>
              ${data.title}
            </h2>
          </a>
          <div class="profile-section">
            <img src="${data.avatar}" alt="" />
            <div class="userinfo">
              <div class="fullname">
                ${data.fullname}
                ${
                  data.isVerified
                    ? '<i class="ri-verified-badge-fill" style="color: #0254f7"></i>'
                    : ""
                }
              </div>
              <div class="username">${data.username}</div>
            </div>
          </div>
          <div class="desc-img">
            <a href="">
              <div class="desc">
                ${data.desc}
              </div>
            </a>
            <a href="">
              <img src="${data.banner}" alt="" />
            </a>
          </div>
          <div class="footer">
            <div class="fcard ml-20">
              <i class="fa-solid fa-thumbs-up"></i> Like
            </div>
            <div class="fcard">
              <i class="fa-solid fa-bookmark"></i> Bookmark
            </div>
            <div class="fcard">
              <i class="fa-solid fa-share-from-square"></i> Share
            </div>
            <div class="fcard mr-20">
              <i class="fa-regular fa-clock"></i> ${data.timestamp}
            </div>
          </div>
        </div>
        `;
      }
    }

    document.getElementById("cards").innerHTML = data.map(renderCard).join("");

    // Add more-icon functionality for profile page
    if (isProfilePage) {
      // Add click handlers for more icons after cards are rendered
      document.addEventListener('click', function(e) {
        if (e.target.closest('.moreIcon')) {
          e.preventDefault();
          const moreIcon = e.target.closest('.moreIcon');
          const card = moreIcon.closest('.card');
          
          // Remove any existing dropdown
          document.querySelectorAll('.more-dropdown').forEach(dropdown => dropdown.remove());
          
          // Create dropdown menu
          const dropdown = document.createElement('div');
          dropdown.className = 'more-dropdown';
          dropdown.innerHTML = `
            <div class="dropdown-item" onclick="editPost(this)">
              <i class="ri-edit-line"></i> Edit
            </div>
            <div class="dropdown-item" onclick="deletePost(this)">
              <i class="ri-delete-bin-line"></i> Delete
            </div>
          `;
          
          // Position dropdown
          dropdown.style.position = 'absolute';
          dropdown.style.top = '100%';
          dropdown.style.right = '0';
          dropdown.style.background = '#2a2a2a';
          dropdown.style.border = '1px solid #3d3838';
          dropdown.style.borderRadius = '8px';
          dropdown.style.zIndex = '1000';
          dropdown.style.minWidth = '120px';
          dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          
          // Style dropdown items
          dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.style.padding = '10px 15px';
            item.style.cursor = 'pointer';
            item.style.color = '#cacfd9';
            item.style.borderBottom = '1px solid #3d3838';
            item.style.transition = 'background 0.2s';
            
            item.addEventListener('mouseenter', () => {
              item.style.background = '#3d3838';
            });
            
            item.addEventListener('mouseleave', () => {
              item.style.background = 'transparent';
            });
          });
          
          // Remove border from last item
          const lastItem = dropdown.querySelector('.dropdown-item:last-child');
          if (lastItem) lastItem.style.borderBottom = 'none';
          
          // Position relative to more icon
          moreIcon.style.position = 'relative';
          moreIcon.appendChild(dropdown);
        } else {
          // Close dropdown if clicking outside
          document.querySelectorAll('.more-dropdown').forEach(dropdown => dropdown.remove());
        }
      });
    }

    // More-icon action functions
    function editPost(element) {
      const card = element.closest('.card');
      alert('Edit post functionality - to be implemented');
      document.querySelectorAll('.more-dropdown').forEach(dropdown => dropdown.remove());
    }

    function deletePost(element) {
      const card = element.closest('.card');
      if (confirm('Are you sure you want to delete this post?')) {
        card.remove();
        alert('Post deleted!');
      }
      document.querySelectorAll('.more-dropdown').forEach(dropdown => dropdown.remove());
    }

    function sharePost(element) {
      const card = element.closest('.card');
      const title = card.querySelector('h2').textContent;
      if (navigator.share) {
        navigator.share({
          title: title,
          url: window.location.href
        });
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(window.location.href);
        alert('Post link copied to clipboard!');
      }
      document.querySelectorAll('.more-dropdown').forEach(dropdown => dropdown.remove());
    }

    // Make more-icon functions globally available
    window.editPost = editPost;
    window.deletePost = deletePost;
    window.sharePost = sharePost;

    // Show/hide profile card
    function showCard() {
      const card = document.querySelector(".profile-card");
      card.classList.toggle("hidden");
    }

    // Show/hide help card
    function showHelpCard() {
      const card = document.querySelector(".help-card");
      card.classList.toggle("hidden");
    }

    // Copy to clipboard function
    function copyToClipboard(event, text) {
      event.preventDefault();
      navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
      });
    }

    // Make functions available globally for onclick handlers
    window.showCard = showCard;
    window.showHelpCard = showHelpCard;
    window.copyToClipboard = copyToClipboard;

    // Hide cards when clicking outside
    document.addEventListener("click", function (e) {
      const profileCard = document.querySelector(".profile-card");
      const helpCard = document.querySelector(".help-card");
      const profileBtn = document.querySelector(".profile");
      const helpBtn = document.querySelector(".help");

      // Hide profile card if open and click is outside
      if (
      profileCard && !profileCard.classList.contains("hidden") &&
      !profileCard.contains(e.target) &&
      !profileBtn.contains(e.target)
      ) {
      profileCard.classList.add("hidden");
      }

      // Hide help card if open and click is outside
      if (
      helpCard && !helpCard.classList.contains("hidden") &&
      !helpCard.contains(e.target) &&
      !helpBtn.contains(e.target)
      ) {
      helpCard.classList.add("hidden");
      }
    });