// stats.js - For BlogZone stats page

// Fetch and display user stats (posts, total views, total likes, etc.)
document.addEventListener('DOMContentLoaded', async function() {
  const statsContainer = document.getElementById('stats-content');
  if (!statsContainer) return;

  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail') || '';
  if (!userEmail) {
    statsContainer.innerHTML = '<p style="color:red">Please log in to view your stats.</p>';
    return;
  }

  // Fetch all posts
  let posts = [];
  try {
    const res = await fetch('http://localhost:8080/api/product/get');
    if (res.ok) {
      posts = await res.json();
    } else {
      statsContainer.innerHTML = '<p style="color:red">Failed to load posts.</p>';
      return;
    }
  } catch (e) {
    statsContainer.innerHTML = '<p style="color:red">Network error.</p>';
    return;
  }

  // Filter posts by current user
  const userPosts = posts.filter(post => post.author && post.author.email === userEmail);

  // Calculate totals
  const totalViews = userPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

  // Render stats with real theme and banners
  let html = `<h2 style="color:white;">Your Blog Stats</h2>`;
  html += `<div class="stats-summary" style="margin-bottom:2.5rem;">
    <div class="stat-box" style="background:#181a20;color:#fff;">
      <div class="stat-label" style="color:#a1a1aa;">Total Posts</div>
      <div class="stat-value" style="color:#fff;">${userPosts.length}</div>
    </div>
    <div class="stat-box" style="background:#181a20;color:#fff;">
      <div class="stat-label" style="color:#a1a1aa;">Total Views</div>
      <div class="stat-value" style="color:#fff;">${totalViews}</div>
    </div>
    <div class="stat-box" style="background:#181a20;color:#fff;">
      <div class="stat-label" style="color:#a1a1aa;">Total Likes</div>
      <div class="stat-value" style="color:#fff;">${totalLikes}</div>
    </div>
  </div>`;

  if (userPosts.length === 0) {
    html += '<p style="margin-top:2rem;color:#cacfd9;">You have not published any posts yet.</p>';
  } else {
    html += `<div class="stats-post-list">`;
    userPosts.forEach(post => {
      html += `
        <div class="stats-post-card" style="display:flex;align-items:center;justify-content:space-between;background:#181a20;border-radius:14px;padding:1.2rem 1.5rem;margin-bottom:1.2rem;box-shadow:0 2px 8px rgba(59, 130, 246, 0.07);;gap:1.5rem;">
          <div class="stats-post-left" style="display:flex;align-items:center;gap:1.2rem;min-width:0;">
            <img src="${post.banner || './assets/blog-homepage-wireframe.png'}" alt="banner" style="width:90px;height:64px;object-fit:cover;border-radius:8px;background:#23272f;box-shadow:0 2px 8px #0002;flex-shrink:0;">
            <div style="min-width:0;">
              <a href="blog.html?id=${post._id}" target="_blank" style="color:#e5e7eb;font-size:1.1rem;font-weight:600;line-height:1.3;word-break:break-word;">${post.title}</a>
              <div style="color:#a1a1aa;font-size:0.97rem;margin-top:0.2rem;">${new Date(post.createdAt).toLocaleDateString()}</div>
                ${post.tags && post.tags.length ? `<div style='margin-top:0.3rem;display:flex;align-items:center;gap:0.3rem;flex-wrap:wrap;'>${post.tags.map(tag => `<span style='color:#60a5fa;font-size:0.85rem;padding:2px 8px;border-radius:6px;margin-right:4px;display:inline-block;'>#${tag}</span>`).join('')}</div>` : ''}
            </div>
          </div>
          <div class="stats-post-right" style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;">
            <div style="display:flex;gap:1.2rem;align-items:center;">
              <span title="Views" style="display:flex;align-items:center;gap:0.3rem;color:#60a5fa;font-weight:500;"><i class='fa fa-eye'></i> ${post.views || 0}</span>
              <span title="Likes" style="display:flex;align-items:center;gap:0.3rem;color:#f59e42;font-weight:500;"><i class='fa fa-thumbs-up'></i> ${post.likes || 0}</span>
              <span title="Shares" style="display:flex;align-items:center;gap:0.3rem;color:#38bdf8;font-weight:500;"><i class='fa fa-share-nodes'></i> ${post.shares || 0}</span>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }
  statsContainer.innerHTML = html;
});
