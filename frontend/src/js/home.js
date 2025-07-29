// Logout Functionality
function logout() {
  // Clear all user data from localStorage
  const keysToRemove = [
    "userData",
    "userEmail",
    "userName",
    "userUsername",
    "userAvatar",
    "token",
    "authToken",
    "userSession",
    "loginTime",
    "isLoggedIn",
  ];

  // Remove all known user-related localStorage items
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Clear sessionStorage as well (if any data is stored there)
  sessionStorage.clear();

  // Optional: Show logout confirmation
  if (typeof Toastify !== "undefined") {
    Toastify({
      text: "Successfully logged out. Redirecting to homepage...",
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
      style: {
        background: "linear-gradient(135deg, #4CAF50, #45a049)",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
      },
    }).showToast();
  }

  // Clear any cookies if they exist
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

// Make logout function globally available
window.logout = logout;

// Detect page type
const isProfilePage =
  document.title === "profile" || window.location.pathname.includes("profile");
const isBookmarkPage =
  document.title === "bookmark" ||
  window.location.pathname.includes("bookmark");
const isBlogPage =
  document.title === "blog" || window.location.pathname.includes("blog");

// Helper function to truncate text to specified character limit
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

// Load posts from API on page load for home and profile pages
window.addEventListener("DOMContentLoaded", () => {
  if (isBlogPage) {
    loadBlogContent();
  } else {
    // Show skeleton loading immediately for better UX
    showLoadingWithSkeleton();
    loadPosts();
  }
});

// Global loading functions
function showGlobalLoading() {
  const overlay = document.getElementById("globalLoadingOverlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

function hideGlobalLoading() {
  const overlay = document.getElementById("globalLoadingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function showInlineLoading() {
  const inlineLoading = document.getElementById("inlineLoading");
  const cardsContainer = document.getElementById("cards");
  if (inlineLoading && cardsContainer) {
    cardsContainer.innerHTML = "";
    inlineLoading.classList.remove("hidden");
    cardsContainer.appendChild(inlineLoading);
  }
}

function hideInlineLoading() {
  const inlineLoading = document.getElementById("inlineLoading");
  if (inlineLoading) {
    inlineLoading.classList.add("hidden");
  }
}

// Load and display posts based on page type
async function loadPosts() {
  try {
    // Show loading screen
    if (window.showDataLoading) {
      if (isBookmarkPage) {
        window.showDataLoading(
          "Loading Bookmarks...",
          "Fetching your saved posts"
        );
      } else if (isProfilePage) {
        window.showDataLoading(
          "Loading Your Posts...",
          "Fetching your published content"
        );
      } else {
        window.showDataLoading(
          "Loading Posts...",
          "Fetching latest blog posts"
        );
      }
    }

    let response;

    if (isBookmarkPage) {
      if (
        localStorage.getItem("authToken") === null ||
        localStorage.getItem("authToken") === undefined ||
        localStorage.getItem("authToken") === ""
      ) {
        showErrorMessage("You need to be logged in to view your profile.");
        return;
      }
      // Get user email from localStorage or session
      const userEmail = localStorage.getItem("userEmail") || "unknown@gmail.com"; // fallback
      response = await fetch(
        `http://localhost:8080/api/product/bookmarks/${userEmail}`
      );
    } else if (isProfilePage) {
      if (
        localStorage.getItem("authToken") === null ||
        localStorage.getItem("authToken") === undefined ||
        localStorage.getItem("authToken") === ""
      ) {
        showErrorMessage("You need to be logged in to view your profile.");
        return;
      }
      // Get all posts and filter by user (we can improve this with a dedicated endpoint later)
      response = await fetch("http://localhost:8080/api/product/get");
    } else {
      response = await fetch("http://localhost:8080/api/product/get");
    }

    if (response.ok) {
      let posts = await response.json();

      // Filter posts for profile page
      if (isProfilePage) {
        const userEmail =
          localStorage.getItem("userEmail") || "unknown@gmail.com";
        console.log("Profile page filtering - User email:", userEmail);
        console.log("Total posts before filtering:", posts.length);
        console.log(
          "Sample post authors:",
          posts.slice(0, 3).map((p) => ({
            title: p.title,
            authorEmail: p.author?.email,
            authorName: p.author?.name,
          }))
        );

        posts = posts.filter((post) => {
          const matches = post.author?.email === userEmail;
          if (matches) {
            console.log(
              "Found matching post:",
              post.title,
              "by",
              post.author?.email
            );
          }
          return matches;
        });

        console.log("Posts after filtering:", posts.length);
      }

      displayPosts(posts);

      // Hide loading screen after posts are displayed
      if (window.hideDataLoading) {
        setTimeout(() => window.hideDataLoading(), 300);
      }
    } else {
      console.error("Failed to load posts:", response.status);
      showErrorMessage("Failed to load posts. Please try again later.");

      // Hide loading on error
      if (window.hideDataLoading) {
        window.hideDataLoading();
      }
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    showErrorMessage("Network error. Please check your connection.");
  } finally {
    // Hide loading animations
    hideInlineLoading();
  }
}

// Display posts in the cards format
function displayPosts(posts) {
  const cardsContainer = document.getElementById("cards");
  if (!cardsContainer) {
    console.error("Cards container not found");
    return;
  }

  cardsContainer.innerHTML = "";

  if (posts.length === 0) {
    let emptyMessage = "";
    if (isBookmarkPage) {
      emptyMessage = `
        <div style="text-align: center; padding: 40px; color: #999;">
          <i class="fa-solid fa-bookmark" style="font-size: 3rem; margin-bottom: 20px; color: #444;"></i>
          <h3>No bookmarks yet</h3>
          <p>Start bookmarking blogs you love to see them here!</p>
        </div>
      `;
    } else if (isProfilePage) {
      emptyMessage = `
        <div style="text-align: center; padding: 40px; color: #999;">
          <i class="fa-solid fa-user-edit" style="font-size: 3rem; margin-bottom: 20px; color: #444;"></i>
          <h3>No blogs yet</h3>
          <p>Create your first blog post to see it here!</p>
        </div>
      `;
    } else {
      emptyMessage = `
        <div style="text-align: center; padding: 40px; color: #999;">
          <h3>No posts yet</h3>
          <p>Be the first to create a blog post!</p>
        </div>
      `;
    }
    cardsContainer.innerHTML = emptyMessage;
    return;
  }

  // Convert backend data to frontend format
  const formattedPosts = posts.map((post) => ({
    id: post._id,
    title: post.title,
    desc: truncateText(post.desc, 234),
    banner: post.banner,
    avatar: post.author?.avatar || "./assets/my-av.jpeg",
    fullname: post.author?.name || "Anonymous",
    username: post.author?.username
      ? `@${post.author.username}`
      : `@${post.author?.email?.split("@")[0] || "anonymous"}`,
    isVerified: post.author?.isVerified || false,
    timestamp: getTimeAgo(post.createdAt),
    publishDate: new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: post.readTime || "5 min read",
    views: post.views || 0,
    likes: post.likes || 0,
    bookmarked: false, // This should come from user's bookmarks
    tags: post.tags || [],
    content: post.content,
  }));

  cardsContainer.innerHTML = formattedPosts.map(renderCard).join("");
}

function renderCard(data) {
  if (isProfilePage || isBookmarkPage) {
    return `
        <div class="card" style="margin-top: 20px" data-blog-id="${data.id}">
          <a class="heading" href="blog.html?id=${data.id}">
            <h2>${data.title}</h2>
            <span class="moreIcon">
              ${
                isProfilePage
                  ? `<i class="ri-delete-bin-line" onclick="deletePost(event, '${data.id}')" style="color: #ef4444; cursor: pointer; margin-left: 10px;" title="Delete Blog"></i>`
                  : ""
              }
              
            </span>
          </a>
          <div class="profile-section">
            <img src="${data.avatar}" alt="Author avatar" />
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
            <a href="blog.html?id=${data.id}">
              <div class="desc">${data.desc}</div>
            </a>
            <a href="blog.html?id=${data.id}">
              <img src="${data.banner}" alt="Blog banner" />
            </a>
          </div>
          <div class="footer">
            <div class="fcard ml-20" onclick="likePost(event)">
              <i class="fa-solid fa-thumbs-up"></i> Like (${data.likes})
            </div>
            <div class="fcard" onclick="bookmarkPost(this)">
              <i class="fa-solid fa-bookmark" ${
                data.bookmarked ? 'style="color: #f59e0b;"' : ""
              }></i> 
              ${data.bookmarked ? "Bookmarked" : "Bookmark"}
            </div>
            <div class="fcard" onclick="sharePost(this)">
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
        <div class="card" data-blog-id="${data.id}">
          <a href="blog.html?id=${data.id}">
            <h2>${data.title}</h2>
          </a>
          <div class="profile-section">
            <img src="${data.avatar}" alt="Author avatar" />
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
            <a href="blog.html?id=${data.id}">
              <div class="desc">${data.desc}</div>
            </a>
            <a href="blog.html?id=${data.id}">
              <img src="${data.banner}" alt="Blog banner" />
            </a>
          </div>
          <div class="footer">
            <div class="fcard ml-20" onclick="likePost(event)">
              <i class="fa-solid fa-thumbs-up"></i> Like (${data.likes})
            </div>
            <div class="fcard" onclick="bookmarkPost(this)">
              <i class="fa-solid fa-bookmark" ${
                data.bookmarked ? 'style="color: #f59e0b;"' : ""
              }></i> 
              ${data.bookmarked ? "Bookmarked" : "Bookmark"}
            </div>
            <div class="fcard" onclick="sharePost(this)">
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

// Utility function to show error messages
function showErrorMessage(message) {
  const cardsContainer = document.getElementById("cards");
  const blogContentContainer = document.getElementById("blogContent");
  const targetContainer = cardsContainer || blogContentContainer;

  if (targetContainer) {
    targetContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e53e3e;">
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="
          background: #6366f1;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
        ">Retry</button>
      </div>
    `;
  }
}

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now - postDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
}

// Add more-icon functionality for profile page
if (isProfilePage) {
  // Add click handlers for more icons after cards are rendered
  document.addEventListener("click", function (e) {
    if (e.target.closest(".moreIcon")) {
      e.preventDefault();
      const moreIcon = e.target.closest(".moreIcon");
      const card = moreIcon.closest(".card");

      // Remove any existing dropdown
      document
        .querySelectorAll(".more-dropdown")
        .forEach((dropdown) => dropdown.remove());

      // Create dropdown menu
      const dropdown = document.createElement("div");
      dropdown.className = "more-dropdown";
      dropdown.innerHTML = `
            <div class="dropdown-item" onclick="editPost(this)">
              <i class="ri-edit-line"></i> Edit
            </div>
            <div class="dropdown-item" onclick="deletePost(this)">
              <i class="ri-delete-bin-line"></i> Delete
            </div>
          `;

      // Position dropdown
      dropdown.style.position = "absolute";
      dropdown.style.top = "100%";
      dropdown.style.right = "0";
      dropdown.style.background = "#2a2a2a";
      dropdown.style.border = "1px solid #3d3838";
      dropdown.style.borderRadius = "8px";
      dropdown.style.zIndex = "1000";
      dropdown.style.minWidth = "120px";
      dropdown.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

      // Style dropdown items
      dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
        item.style.padding = "10px 15px";
        item.style.cursor = "pointer";
        item.style.color = "#cacfd9";
        item.style.borderBottom = "1px solid #3d3838";
        item.style.transition = "background 0.2s";

        item.addEventListener("mouseenter", () => {
          item.style.background = "#3d3838";
        });

        item.addEventListener("mouseleave", () => {
          item.style.background = "transparent";
        });
      });

      // Remove border from last item
      const lastItem = dropdown.querySelector(".dropdown-item:last-child");
      if (lastItem) lastItem.style.borderBottom = "none";

      // Position relative to more icon
      moreIcon.style.position = "relative";
      moreIcon.appendChild(dropdown);
    } else {
      // Close dropdown if clicking outside
      document
        .querySelectorAll(".more-dropdown")
        .forEach((dropdown) => dropdown.remove());
    }
  });
}

// bookmark page specific functionality
if (isBookmarkPage) {
  // Add click handlers for more icons after cards are rendered
  document.addEventListener("click", function (e) {
    if (e.target.closest(".moreIcon")) {
      e.preventDefault();
      const moreIcon = e.target.closest(".moreIcon");
      const card = moreIcon.closest(".card");

      // Remove any existing dropdown
      document
        .querySelectorAll(".more-dropdown")
        .forEach((dropdown) => dropdown.remove());

      // Create dropdown menu
      const dropdown = document.createElement("div");
      dropdown.className = "more-dropdown";
      dropdown.innerHTML = `
           
            <div class="dropdown-item" onclick="deletePost(this)">
              <i class="ri-delete-bin-line"></i> remove
            </div>
          `;

      // Position dropdown
      dropdown.style.position = "absolute";
      dropdown.style.top = "100%";
      dropdown.style.right = "0";
      dropdown.style.background = "#2a2a2a";
      dropdown.style.border = "1px solid #3d3838";
      dropdown.style.borderRadius = "8px";
      dropdown.style.zIndex = "1000";
      dropdown.style.minWidth = "120px";
      dropdown.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

      // Style dropdown items
      dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
        item.style.padding = "10px 15px";
        item.style.cursor = "pointer";
        item.style.color = "#cacfd9";
        item.style.borderBottom = "1px solid #3d3838";
        item.style.transition = "background 0.2s";

        item.addEventListener("mouseenter", () => {
          item.style.background = "#3d3838";
        });

        item.addEventListener("mouseleave", () => {
          item.style.background = "transparent";
        });
      });

      // Remove border from last item
      const lastItem = dropdown.querySelector(".dropdown-item:last-child");
      if (lastItem) lastItem.style.borderBottom = "none";

      // Position relative to more icon
      moreIcon.style.position = "relative";
      moreIcon.appendChild(dropdown);
    } else {
      // Close dropdown if clicking outside
      document
        .querySelectorAll(".more-dropdown")
        .forEach((dropdown) => dropdown.remove());
    }
  });
}

// More-icon action functions
function editPost(element) {
  const card = element.closest(".card");
  alert("Edit post functionality - to be implemented");
  document
    .querySelectorAll(".more-dropdown")
    .forEach((dropdown) => dropdown.remove());
}

// Make more-icon functions globally available
window.editPost = editPost;

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
    profileCard &&
    !profileCard.classList.contains("hidden") &&
    !profileCard.contains(e.target) &&
    !profileBtn.contains(e.target)
  ) {
    profileCard.classList.add("hidden");
  }

  // Hide help card if open and click is outside
  if (
    helpCard &&
    !helpCard.classList.contains("hidden") &&
    !helpCard.contains(e.target) &&
    !helpBtn.contains(e.target)
  ) {
    helpCard.classList.add("hidden");
  }
});

// Blog page specific loading
if (isBlogPage) {
  window.addEventListener("DOMContentLoaded", () => {
    loadBlogContent();
  });
}

// Function to load individual blog content (for blog.html page)
async function loadBlogContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  if (!blogId) {
    console.error("No blog ID provided");
    showErrorMessage("No blog ID provided in URL.");
    return;
  }

  try {
    // Show loading screen for blog content
    if (window.showDataLoading) {
      window.showDataLoading("Loading Blog...", "Fetching blog content");
    }

    const response = await fetch(
      `http://localhost:8080/api/product/get/${blogId}`
    );
    if (response.ok) {
      const blog = await response.json();
      displayBlogContent(blog);

      // Hide loading screen after blog is displayed
      if (window.hideDataLoading) {
        setTimeout(() => window.hideDataLoading(), 200);
      }
    } else {
      console.error("Failed to load blog:", response.status);
      showErrorMessage("Blog not found or failed to load.");

      // Hide loading on error
      if (window.hideDataLoading) {
        window.hideDataLoading();
      }
    }
  } catch (error) {
    console.error("Error loading blog:", error);
    showErrorMessage("Network error while loading blog.");

    // Hide loading on error
    if (window.hideDataLoading) {
      window.hideDataLoading();
    }
  }
}

// Function to display individual blog content
function displayBlogContent(blog) {
  // Store current blog globally for blog page functions
  if (window.setCurrentBlog) {
    window.setCurrentBlog(blog);
  }

  // Update page title
  document.title = `${blog.title} - BlogZone`;

  // Update blog header elements
  const titleElement = document.getElementById("blogTitle");
  const authorAvatar = document.getElementById("authorAvatar");
  const authorName = document.getElementById("authorName");
  const authorUsername = document.getElementById("authorUsername");
  const publishDate = document.getElementById("publishDate");
  const readTime = document.getElementById("readTime");
  const viewCount = document.getElementById("viewCount");
  const blogImage = document.getElementById("blogImage");
  const blogContent = document.getElementById("blogContent");
  const blogTags = document.getElementById("blogTags");

  if (titleElement) titleElement.textContent = blog.title;
  if (authorAvatar)
    authorAvatar.src = blog.author?.avatar || "./assets/my-av.jpeg";
  if (authorName) authorName.textContent = blog.author?.name || "Anonymous";
  if (authorUsername)
    authorUsername.textContent = blog.author?.username
      ? `@${blog.author.username}`
      : `@${blog.author?.email?.split("@")[0] || "anonymous"}`;
  if (publishDate)
    publishDate.textContent = `Published on ${new Date(
      blog.createdAt
    ).toLocaleDateString()}`;
  if (readTime) readTime.textContent = blog.readTime || "5 min read";
  if (viewCount) viewCount.textContent = `${blog.views || 0} views`;
  if (blogImage) {
    blogImage.src = blog.banner;
    blogImage.alt = blog.title;
  }

  // Display blog content
  if (blogContent) {
    if (typeof blog.content === "string") {
      // If content is HTML string, display directly
      blogContent.innerHTML = blog.content;
    } else {
      // If content is JSON array, convert to HTML
      try {
        const contentElements =
          typeof blog.content === "string"
            ? JSON.parse(blog.content)
            : blog.content;
        blogContent.innerHTML = convertJsonToHtml(contentElements);
      } catch (error) {
        console.error("Error parsing blog content:", error);
        blogContent.innerHTML = "<p>Error displaying blog content.</p>";
      }
    }
  }

  // Display tags
  if (blogTags && blog.tags) {
    blogTags.innerHTML = "";
    blog.tags.forEach((tag) => {
      const tagElement = document.createElement("a");
      tagElement.href = "#";
      tagElement.className = "tag";
      tagElement.textContent = tag;
      blogTags.appendChild(tagElement);
    });
  }

  // Update stats
  updateBlogStats(blog);
}

// Convert JSON content to HTML
function convertJsonToHtml(contentElements) {
  if (!Array.isArray(contentElements)) {
    return "<p>Invalid content format.</p>";
  }

  return contentElements
    .map((element) => {
      const customization = element.customization || {};

      switch (element.type) {
        case "heading":
          return `<h3 style="
          font-family: ${customization.fontFamily || "inherit"};
          font-size: ${customization.fontSize || "24px"};
          color: ${customization.fontColor || "#ffffff"};
          text-align: ${customization.textAlign || "left"};
          font-weight: ${customization.fontWeight || "600"};
          margin: 20px 0 10px 0;
        ">${element.text}</h3>`;

        case "paragraph":
          return `<p style="
          font-family: ${customization.fontFamily || "inherit"};
          font-size: ${customization.fontSize || "16px"};
          color: ${customization.fontColor || "#e0e0e0"};
          text-align: ${customization.textAlign || "left"};
          line-height: 1.8;
          margin: 15px 0;
        ">${element.text}</p>`;

        case "image":
          if (!element.text?.trim()) return "";
          return `<div style="text-align: ${
            customization.textAlign || "center"
          }; margin: 20px 0;">
          <img src="${element.text}" alt="Blog image" style="
            max-width: ${
              customization.imageSize === "small"
                ? "300px"
                : customization.imageSize === "large"
                ? "800px"
                : "500px"
            };
            height: auto;
            border-radius: 8px;
          " />
        </div>`;

        case "blockquote":
          return `<blockquote style="
          border-left: 4px solid #6366f1;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: ${customization.fontColor || "#cbd5e0"};
          font-size: ${customization.fontSize || "16px"};
        ">${element.text}</blockquote>`;

        case "list":
          const items = element.text
            ? element.text.split("\n").filter((item) => item.trim())
            : [];
          const listItems = items.map((item) => `<li>${item}</li>`).join("");
          return `<ul style="
          color: ${customization.fontColor || "#e0e0e0"};
          font-size: ${customization.fontSize || "16px"};
          margin: 15px 0;
          padding-left: 20px;
        ">${listItems}</ul>`;

        case "code":
          return `<pre style="
          background: #1a1a1a;
          color: #68d391;
          padding: 15px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          margin: 20px 0;
          overflow-x: auto;
        "><code>${element.text}</code></pre>`;

        case "link":
          return `<p><a href="${element.url || "#"}" target="_blank" style="
          color: ${customization.fontColor || "#6366f1"};
          text-decoration: underline;
        ">${element.text || "Link"}</a></p>`;

        default:
          return `<p>${element.text || ""}</p>`;
      }
    })
    .join("");
}

// Update blog statistics
function updateBlogStats(blog) {
  const likeText = document.getElementById("likeText");
  const blogStats = document.getElementById("blogStats");

  if (likeText) likeText.textContent = `Like (${blog.likes || 0})`;
  if (blogStats)
    blogStats.textContent = `Views: ${blog.views || 0} • Likes: ${
      blog.likes || 0
    }`;
}

// Like post functionality
async function likePost(event) {
  event.preventDefault();
  event.stopPropagation();

  try {
    const userEmail = localStorage.getItem("userEmail") || "unknown@gmail.com";
    const card = event.target.closest(".card");
    if (!card) return;

    // Extract blog ID from the card's link
    const blogLink = card.querySelector('a[href*="blog.html?id="]');
    if (!blogLink) return;

    const blogId = new URL(blogLink.href).searchParams.get("id");
    if (!blogId) return;

    // Show loading state on button
    const likeButton = event.target.closest(".fcard");
    const originalContent = likeButton.innerHTML;
    likeButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Liking...`;

    const response = await fetch("http://localhost:8080/api/product/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blogId: blogId,
        email: userEmail,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      // Update the like button
      likeButton.innerHTML = `<i class="fa-solid fa-thumbs-up" style="color: #6366f1;"></i> Like (${result.likes})`;

      // Show success message
      showSuccessMessage("Blog liked!");
    } else {
      likeButton.innerHTML = originalContent;
      showErrorMessage("Failed to like blog");
    }
  } catch (error) {
    console.error("Error liking post:", error);
    const likeButton = event.target.closest(".fcard");
    likeButton.innerHTML = originalContent;
    showErrorMessage("Error liking blog");
  }
}

// Bookmark post functionality
async function bookmarkPost(element) {
  try {
    const userEmail = localStorage.getItem("userEmail") || "unknown@gmail.com";
    const card = element.closest(".card");
    if (!card) return;

    // Extract blog ID from the card's link
    const blogLink = card.querySelector('a[href*="blog.html?id="]');
    if (!blogLink) return;

    const blogId = new URL(blogLink.href).searchParams.get("id");
    if (!blogId) return;

    // Show loading state on button
    const originalContent = element.innerHTML;
    element.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

    const response = await fetch("http://localhost:8080/api/product/bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blogId: blogId,
        email: userEmail,
      }),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.bookmarked) {
        element.innerHTML = `<i class="fa-solid fa-bookmark" style="color: #f59e0b;"></i> Bookmarked`;
        showSuccessMessage("Blog bookmarked!");
      } else {
        element.innerHTML = `<i class="fa-solid fa-bookmark"></i> Bookmark`;
        showSuccessMessage("Bookmark removed!");

        // If we're on bookmark page, remove the card
        if (isBookmarkPage) {
          card.remove();

          // Check if no more bookmarks
          const cardsContainer = document.getElementById("cards");
          if (cardsContainer && cardsContainer.children.length === 0) {
            cardsContainer.innerHTML = `
              <div style="text-align: center; padding: 40px; color: #999;">
                <i class="fa-solid fa-bookmark" style="font-size: 3rem; margin-bottom: 20px; color: #444;"></i>
                <h3>No bookmarks yet</h3>
                <p>Start bookmarking blogs you love to see them here!</p>
              </div>
            `;
          }
        }
      }
    } else {
      element.innerHTML = originalContent;
      showErrorMessage("Failed to bookmark blog");
    }
  } catch (error) {
    console.error("Error bookmarking post:", error);
    element.innerHTML = originalContent;
    showErrorMessage("Error bookmarking blog");
  }
}

// Share post functionality
async function sharePost(element) {
  try {
    const card = element.closest(".card");
    if (!card) return;

    // Extract blog details
    const blogLink = card.querySelector('a[href*="blog.html?id="]');
    const titleElement = card.querySelector("h2");

    if (!blogLink || !titleElement) return;

    const blogUrl = new URL(blogLink.href, window.location.origin).href;
    const blogTitle = titleElement.textContent;

    if (navigator.share) {
      await navigator.share({
        title: blogTitle,
        text: `Check out this blog: ${blogTitle}`,
        url: blogUrl,
      });
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(blogUrl);
      showSuccessMessage("Blog link copied to clipboard!");
    }
  } catch (error) {
    console.error("Error sharing post:", error);
    showErrorMessage("Error sharing blog");
  }
}

// Success message function
function showSuccessMessage(message) {
  // Add slide-in animation CSS if not already added
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create a simple success toast
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2700);
}

// Make functions global
window.likePost = likePost;
window.bookmarkPost = bookmarkPost;
window.sharePost = sharePost;

// Delete post functionality (only for profile page)
async function deletePost(event, blogId) {
  event.preventDefault();
  event.stopPropagation();

  if (
    !confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const userEmail = localStorage.getItem("userEmail") || "unknown@gmail.com";

    // Show brief loading indicator
    if (window.showDataLoading) {
      window.showDataLoading("Deleting...", "Removing blog post");
    }

    const response = await fetch(
      `http://localhost:8080/api/product/delete/${blogId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      }
    );

    if (response.ok) {
      // Remove the card from the page
      const card = document.querySelector(`[data-blog-id="${blogId}"]`);
      if (card) {
        card.remove();
      }

      showSuccessMessage("Blog deleted successfully!");

      // Check if no more blogs
      const cardsContainer = document.getElementById("cards");
      if (cardsContainer && cardsContainer.children.length === 0) {
        cardsContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #999;">
            <h3>No posts yet</h3>
            <p>Create your first blog post to see it here!</p>
          </div>
        `;
      }

      // Hide loading
      if (window.hideDataLoading) {
        window.hideDataLoading();
      }
    } else {
      const error = await response.json();
      showErrorMessage(error.message || "Failed to delete blog");

      // Hide loading on error
      if (window.hideDataLoading) {
        window.hideDataLoading();
      }
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    showErrorMessage("Error deleting blog");

    // Hide loading on error
    if (window.hideDataLoading) {
      window.hideDataLoading();
    }
  }
}

window.deletePost = deletePost;

// Create skeleton loading cards
function createSkeletonCards(count = 3) {
  let skeletonHTML = "";
  for (let i = 0; i < count; i++) {
    skeletonHTML += `
      <div class="skeleton-card">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div style="display: flex; align-items: center; margin: 15px 0;">
          <div class="skeleton-avatar"></div>
          <div style="flex: 1;">
            <div class="skeleton-line short" style="margin-bottom: 5px;"></div>
            <div class="skeleton-line" style="width: 40%; height: 15px;"></div>
          </div>
        </div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-image"></div>
      </div>
    `;
  }
  return skeletonHTML;
}

function showSkeletonLoading() {
  const cardsContainer = document.getElementById("cards");
  if (cardsContainer) {
    cardsContainer.innerHTML = createSkeletonCards(3);
  }
}

// Refresh posts function
async function refreshPosts() {
  showInlineLoading();
  await loadPosts();
}

// Enhanced loading with skeleton for initial load
function showLoadingWithSkeleton() {
  showSkeletonLoading();
  const inlineLoading = document.getElementById("inlineLoading");
  if (inlineLoading) {
    inlineLoading.classList.add("hidden");
  }
}

// Make refresh function globally available
window.refreshPosts = refreshPosts;
window.showSkeletonLoading = showSkeletonLoading;
