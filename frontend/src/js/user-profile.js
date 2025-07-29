// User Profile Dynamic Display Script
function updateUserProfile() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  let userEmail = localStorage.getItem("userEmail") || "";
  
  // If userEmail is not set separately, try to get it from userData
  if (!userEmail && userData.email) {
    userEmail = userData.email;
    localStorage.setItem("userEmail", userData.email);
  }
  
  console.log("Updating user profile with data:", {
    userData,
    userEmail,
    hasName: !!userData.name,
    hasUsername: !!userData.username,
    hasAvatar: !!userData.avatar
  });

  if (userData.name || userEmail) {
    // Update profile card
    const profileCard = document.querySelector(".profile-card");
    if (profileCard) {
      const avatar = profileCard.querySelector(".userinfo img");
      const fullname = profileCard.querySelector(".fullname");
      const email = profileCard.querySelector(".email");
      const profileLink = profileCard.querySelector(".links button");

      if (avatar && userData.avatar) {
        avatar.src = userData.avatar;
        avatar.onerror = function () {
          // Fallback to default avatar if image fails to load
          this.src = "./assets/my-av.jpeg";
        };
      }

      if (fullname && userData.name) {
        fullname.textContent = userData.name;
      }

      if (email && userEmail) {
        email.textContent = userEmail;
      }

      if (profileLink && userData.username) {
        const linkText = `https://blogzone.com/@${userData.username}`;
        profileLink.onclick = function (event) {
          copyToClipboard(event, linkText);
        };
        // Update the text content while preserving the icon
        const textNode = profileLink.firstChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.textContent = linkText + " ";
        } else {
          profileLink.innerHTML = `${linkText} <i class="ri-clipboard-fill"></i>`;
        }
      }
    }

    // Update navigation profile image
    const navProfile = document.querySelector(".profile img");
    if (navProfile && userData.avatar) {
      navProfile.src = userData.avatar;
      navProfile.onerror = function () {
        // Fallback to default avatar if image fails to load
        this.src = "./assets/my-av.jpeg";
      };
    }

    // Update any other profile images on the page
    const profileImages = document.querySelectorAll(
      ".author-avatar, .profile-avatar"
    );
    profileImages.forEach((img) => {
      if (userData.avatar) {
        img.src = userData.avatar;
        img.onerror = function () {
          this.src = "./assets/my-av.jpeg";
        };
      }
    });

    // Update author info in blog posts (for user's own posts)
    const authorInfos = document.querySelectorAll(".author-info");
    authorInfos.forEach((authorInfo) => {
      const authorImg = authorInfo.querySelector("img");
      const authorName = authorInfo.querySelector(".author-name, .fullname");
      const authorUsername = authorInfo.querySelector(
        ".author-username, .username"
      );

      if (authorImg && userData.avatar) {
        // Only update if it's the current user's post
        const currentUserEmail = userEmail.toLowerCase();
        const postAuthorEmail = authorImg.getAttribute("data-author-email");

        if (
          postAuthorEmail &&
          postAuthorEmail.toLowerCase() === currentUserEmail
        ) {
          authorImg.src = userData.avatar;
          authorImg.onerror = function () {
            this.src = "./assets/my-av.jpeg";
          };
        }
      }

      if (authorName && userData.name) {
        const currentUserEmail = userEmail.toLowerCase();
        const postAuthorEmail = authorName.getAttribute("data-author-email");

        if (
          postAuthorEmail &&
          postAuthorEmail.toLowerCase() === currentUserEmail
        ) {
          authorName.textContent = userData.name;
        }
      }

      if (authorUsername && userData.username) {
        const currentUserEmail = userEmail.toLowerCase();
        const postAuthorEmail =
          authorUsername.getAttribute("data-author-email");

        if (
          postAuthorEmail &&
          postAuthorEmail.toLowerCase() === currentUserEmail
        ) {
          authorUsername.textContent = `@${userData.username}`;
        }
      }
    });

    // Update page title if on profile page
    if (window.location.pathname.includes("profile") && userData.name) {
      const pageTitle = document.querySelector("h1, .page-title");
      if (pageTitle && pageTitle.textContent.includes("Profile")) {
        pageTitle.textContent = `${userData.name}'s Profile`;
      }
    }

    // Update main profile card on profile page
    const profileUpperLayer = document.querySelector(".profileUpperLayer");
    if (profileUpperLayer) {
      const profileImage = profileUpperLayer.querySelector(".image img");
      const usernameElement = profileUpperLayer.querySelector(".username");
      const userIdElement = profileUpperLayer.querySelector(".userId");

      if (profileImage && userData.avatar) {
        profileImage.src = userData.avatar;
        profileImage.onerror = function () {
          this.src = "./assets/my-av.jpeg";
        };
      }

      if (usernameElement && userData.name) {
        usernameElement.textContent = userData.name;
      }

      if (userIdElement && userData.username) {
        userIdElement.textContent = userData.username;
      }
    }

    // Update any welcome messages
    const welcomeMessages = document.querySelectorAll(
      ".welcome-message, .user-greeting"
    );
    welcomeMessages.forEach((msg) => {
      if (userData.name) {
        msg.textContent = `Welcome back, ${userData.name}!`;
      }
    });

    console.log("User profile updated:", {
      name: userData.name,
      username: userData.username,
      email: userEmail,
      avatar: userData.avatar,
    });
  }
}

// Auto-update profile when page loads
document.addEventListener("DOMContentLoaded", updateUserProfile);

// Export function for manual calls
window.updateUserProfile = updateUserProfile;
