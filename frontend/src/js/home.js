import { data } from "../api/api.js";

// Detect if we're on the profile page
const isProfilePage =
  document.title === "profile" || window.location.pathname.includes("profile");
const isBookmarkPage =
  document.title === "bookmark" ||
  window.location.pathname.includes("bookmark");
const blogPage =
  document.title === "blog" || window.location.pathname.includes("blog");

function renderCard(data) {
  // Different template for profile page
  if (isProfilePage || isBookmarkPage) {
    return `
        <div class="card" style="margin-top: 20px">
          <a class="heading" href="blog.html?id=${data.id}">
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
            <a href="blog.html?id=${data.id}">
              <div class="desc">
                ${data.desc}
              </div>
            </a>
            <a href="blog.html?id=${data.id}">
              <img src="${data.banner}" alt="" />
            </a>
          </div>
             <div class="footer">
            <div class="fcard ml-20" onclick="likePost()">
              <i class="fa-solid fa-thumbs-up"></i> Like
            </div>
            <div class="fcard" onclick="bookmarkPost(this)">
              <i class="fa-solid fa-bookmark"></i> Bookmark
            </div>
            <div class="fcard" onclick="sharePost(this)">
              <i class="fa-solid fa-share-from-square"></i> Share
            </div>
            <div class="fcard mr-20"  >
              <i class="fa-regular fa-clock"></i> ${data.timestamp}
            </div>
          </div>
        </div>
        `;
  } else if (blogPage) {
    loadPosts();
    //   return `
    //       <div class="card">
    //         <a href="blog.html?id=${data.id}">
    //           <h2>
    //             ${data.title}
    //           </h2>
    //         </a>
    //         <div class="profile-section">
    //           <img src="${data.avatar}" alt="" />
    //           <div class="userinfo">
    //             <div class="fullname">
    //               ${data.fullname}
    //               ${
    //                 data.isVerified
    //                   ? '<i class="ri-verified-badge-fill" style="color: #0254f7"></i>'
    //                   : ""
    //               }
    //             </div>
    //             <div class="username">${data.username}</div>
    //           </div>
    //         </div>
    //         <div class="desc-img">
    //           <a href="blog.html?id=${data.id}">
    //             <div class="desc">
    //               ${data.desc}
    //             </div>
    //           </a>
    //           <a href="blog.html?id=${data.id}">
    //             <img src="${data.banner}" alt="" />
    //           </a>
    //         </div>`;
    // } else {
    //   // console.log('Rendering default card template');
    //   // Default template for home page
    //   return `
    //       <div class="card">
    //         <a href="blog.html?id=${data.id}">
    //           <h2>
    //             ${data.title}
    //           </h2>
    //         </a>
    //         <div class="profile-section">
    //           <img src="${data.avatar}" alt="" />
    //           <div class="userinfo">
    //             <div class="fullname">
    //               ${data.fullname}
    //               ${
    //                 data.isVerified
    //                   ? '<i class="ri-verified-badge-fill" style="color: #0254f7"></i>'
    //                   : ""
    //               }
    //             </div>
    //             <div class="username">${data.username}</div>
    //           </div>
    //         </div>
    //         <div class="desc-img">
    //           <a href="blog.html?id=${data.id}">
    //             <div class="desc">
    //               ${data.desc}
    //             </div>
    //           </a>
    //           <a href="blog.html?id=${data.id}">
    //             <img src="${data.banner}" alt="" />
    //           </a>
    //         </div>
    //         <div class="footer">
    //           <div class="fcard ml-20" onclick="likePost()">
    //             <i class="fa-solid fa-thumbs-up"></i> Like
    //           </div>
    //           <div class="fcard" onclick="bookmarkPost(this)">
    //             <i class="fa-solid fa-bookmark"></i> Bookmark
    //           </div>
    //           <div class="fcard" onclick="sharePost(this)">
    //             <i class="fa-solid fa-share-from-square"></i> Share
    //           </div>
    //           <div class="fcard mr-20"  >
    //             <i class="fa-regular fa-clock"></i> ${data.timestamp}
    //           </div>
    //         </div>
    //       </div>
    //       `;
  }
}

document.getElementById("cards").innerHTML = data.map(renderCard).join("");

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

function deletePost(element) {
  const card = element.closest(".card");
  if (confirm("Are you sure you want to delete this post?")) {
    card.remove();
    alert("Post deleted!");
  }
  document
    .querySelectorAll(".more-dropdown")
    .forEach((dropdown) => dropdown.remove());
}

function sharePost(element) {
  const card = element.closest(".card");
  const title = card.querySelector("h2").textContent;
  if (navigator.share) {
    navigator.share({
      title: title,
      url: window.location.href,
    });
  } else {
    // Fallback for browsers without Web Share API
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  }
  document
    .querySelectorAll(".more-dropdown")
    .forEach((dropdown) => dropdown.remove());
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
window.likePost = likePost;
window.bookmarkPost = bookmarkPost;

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

function likePost() {
  // Get the clicked like button element using event.target
  const likeButton = event.target.closest(".fcard");

  // Check current background color
  const currentBg = likeButton.style.backgroundColor;

  if (currentBg === "red" || currentBg === "rgb(255, 0, 0)") {
    // If it's red (liked), make it normal (unlike)
    likeButton.style.backgroundColor = "#191919";
    console.log("Post unliked");
  } else {
    // If it's normal, make it red (like)
    likeButton.style.backgroundColor = "red";
    console.log("Post liked");
  }
}

function bookmarkPost(element) {
  // console.log('Post bookmarked/unbookmarked');
  const bookmarkIcon = element.querySelector("i");

  // Toggle bookmark state
  if (bookmarkIcon.classList.contains("fa-solid")) {
    bookmarkIcon.classList.remove("fa-solid");
    bookmarkIcon.classList.add("fa-regular");
    console.log("Post removed from bookmarks");
  } else {
    bookmarkIcon.classList.remove("fa-regular");
    bookmarkIcon.classList.add("fa-solid");
    console.log("Post added to bookmarks");
  }
}

// here is my code

// Load and display all posts
async function loadPosts() {
  try {
    const response = await fetch("http://localhost:8080/api/product/get");
    if (response.ok) {
      const posts = await response.json();
      displayPosts(posts);
    }
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

// Display posts in the posts section
function displayPosts(posts) {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts yet. Create your first post!</p>";
    return;
  }

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    const postHeader = document.createElement("div");
    postHeader.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const date = document.createElement("small");
    date.style.cssText = "color: #718096; font-size: 14px;";
    date.textContent = new Date(post.createdAt).toLocaleDateString();

    postHeader.appendChild(title);
    postHeader.appendChild(date);

    const contentDiv = document.createElement("div");

    try {
      const contentElements = JSON.parse(post.content);
      contentElements.forEach((element) => {
        const elementDiv = document.createElement("div");
        elementDiv.style.cssText = "margin-bottom: 12px;";

        if (element.type === "heading") {
          const heading = document.createElement("h3");
          heading.textContent = element.text;
          const customization = element.customization || {};
          heading.style.cssText = `
                  font-family: ${customization.fontFamily || "inherit"};
                  font-size: ${customization.fontSize || "20px"};
                  color: ${customization.fontColor || "#ffffff"};
                  text-align: ${customization.textAlign || "left"};
                  font-weight: ${customization.fontWeight || "600"};
                  font-style: ${customization.fontStyle || "normal"};
                  margin: 0;
                `;
          elementDiv.appendChild(heading);
        } else if (element.type === "paragraph") {
          const paragraph = document.createElement("p");
          paragraph.textContent = element.text;
          const customization = element.customization || {};
          paragraph.style.cssText = `
                  font-family: ${customization.fontFamily || "inherit"};
                  font-size: ${customization.fontSize || "16px"};
                  color: ${customization.fontColor || "#cbd5e0"};
                  text-align: ${customization.textAlign || "left"};
                  font-weight: ${customization.fontWeight || "normal"};
                  font-style: ${customization.fontStyle || "normal"};
                  margin: 0; line-height: 1.6;
                `;
          elementDiv.appendChild(paragraph);
        } else if (element.type === "link") {
          const linkContainer = document.createElement("div");
          const customization = element.customization || {};
          linkContainer.style.textAlign = customization.textAlign || "left";

          const link = document.createElement("a");
          link.href = element.url || "#";
          link.textContent = element.text || "Link";
          link.style.cssText = `
                  color: ${customization.fontColor || "#63b3ed"};
                  font-size: ${customization.fontSize || "16px"};
                  text-decoration: ${
                    customization.textDecoration || "underline"
                  };
                `;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          linkContainer.appendChild(link);
          elementDiv.appendChild(linkContainer);
        } else if (element.type === "button") {
          const buttonContainer = document.createElement("div");
          const customization = element.customization || {};
          buttonContainer.style.textAlign = customization.textAlign || "left";

          const buttonLink = document.createElement("a");
          buttonLink.href = element.url || "#";
          buttonLink.target = "_blank";
          buttonLink.rel = "noopener noreferrer";
          buttonLink.style.cssText = "text-decoration: none;";

          const button = document.createElement("button");
          button.textContent = element.text || "Button";

          let padding = "8px 16px";
          let fontSize = "14px";
          switch (customization.buttonSize) {
            case "small":
              padding = "6px 12px";
              fontSize = "12px";
              break;
            case "medium":
              padding = "8px 16px";
              fontSize = "14px";
              break;
            case "large":
              padding = "12px 24px";
              fontSize = "16px";
              break;
            default:
              padding = "8px 16px";
              fontSize = "14px";
          }

          button.style.cssText = `
                  background: ${customization.backgroundColor || "#4299e1"};
                  color: ${customization.fontColor || "#ffffff"};
                  padding: ${padding};
                  font-size: ${fontSize};
                  border: none;
                  border-radius: ${customization.borderRadius || "4px"};
                  cursor: pointer;
                `;

          buttonLink.appendChild(button);
          buttonContainer.appendChild(buttonLink);
          elementDiv.appendChild(buttonContainer);
        } else if (element.type === "image") {
          if (element.text && element.text.trim()) {
            const img = document.createElement("img");
            img.src = element.text;
            const customization = element.customization || {};

            let maxWidth = "100%";
            switch (customization.imageSize) {
              case "small":
                maxWidth = "200px";
                break;
              case "medium":
                maxWidth = "400px";
                break;
              case "large":
                maxWidth = "600px";
                break;
              case "full":
                maxWidth = "100%";
                break;
              default:
                maxWidth = "400px";
            }

            img.style.cssText = `
                    max-width: ${maxWidth}; 
                    height: auto; 
                    border-radius: 6px;
                    display: block;
                    margin: ${
                      customization.textAlign === "center"
                        ? "0 auto"
                        : customization.textAlign === "right"
                        ? "0 0 0 auto"
                        : "0 auto 0 0"
                    };
                  `;
            img.alt = "Blog image";
            img.onerror = function () {
              this.style.display = "none";
              const errorMsg = document.createElement("p");
              errorMsg.textContent = "Image failed to load: " + element.text;
              errorMsg.style.cssText = "color: #e53e3e; font-style: italic;";
              elementDiv.appendChild(errorMsg);
            };
            elementDiv.appendChild(img);
          } else {
            const placeholder = document.createElement("p");
            placeholder.textContent = "No image URL provided";
            placeholder.style.cssText = "color: #718096; font-style: italic;";
            elementDiv.appendChild(placeholder);
          }
        } else if (element.type === "blockquote") {
          const quote = document.createElement("blockquote");
          quote.textContent = element.text;
          const customization = element.customization || {};
          quote.style.cssText = `
                  font-family: ${customization.fontFamily || "inherit"};
                  font-size: ${customization.fontSize || "16px"};
                  color: ${customization.fontColor || "#cbd5e0"};
                  text-align: ${customization.textAlign || "left"};
                  font-weight: ${customization.fontWeight || "normal"};
                  font-style: ${customization.fontStyle || "italic"};
                  border-left: 4px solid #4299e1; 
                  padding-left: 16px; 
                  margin: 0;
                `;
          elementDiv.appendChild(quote);
        } else if (element.type === "list") {
          const customization = element.customization || {};
          const listStyle = customization.listStyle || "disc";

          // Determine if it should be ordered or unordered
          const isOrdered = [
            "decimal",
            "decimal-leading-zero",
            "lower-alpha",
            "upper-alpha",
            "lower-roman",
            "upper-roman",
          ].includes(listStyle);

          const list = document.createElement(isOrdered ? "ol" : "ul");
          list.style.cssText = `
                  list-style-type: ${listStyle};
                  padding-left: 24px;
                  color: ${customization.fontColor || "#cbd5e0"};
                  font-size: ${customization.fontSize || "14px"};
                  font-family: ${customization.fontFamily || "inherit"};
                  text-align: ${customization.textAlign || "left"};
                  margin: 0;
                `;

          const items = element.text
            ? element.text.split("\n").filter((item) => item.trim())
            : [];
          items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
          });
          elementDiv.appendChild(list);
        } else if (element.type === "code") {
          const code = document.createElement("pre");
          code.textContent = element.text;
          code.style.cssText =
            "background: #1a202c; color: #68d391; padding: 12px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 14px; margin: 0;";
          elementDiv.appendChild(code);
        }

        contentDiv.appendChild(elementDiv);
      });
    } catch (error) {
      console.error("Error parsing post content:", error);
      const errorP = document.createElement("p");
      errorP.textContent = "Error displaying post content.";
      errorP.style.cssText = "color: #e53e3e;";
      contentDiv.appendChild(errorP);
    }

    postDiv.appendChild(postHeader);
    postDiv.appendChild(contentDiv);
    postsContainer.appendChild(postDiv);
  });
}
