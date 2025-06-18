// Check for logged-in user
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  window.location.href = 'index.html';
}

const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const postsContainer = document.getElementById('posts-container');
const notification = document.getElementById('notification');

usernameDisplay.textContent = currentUser;

// Show notification
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `show ${type}`;
  setTimeout(() => {
    notification.className = '';
  }, 3000);
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  showNotification('Logged out');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

// Load posts
function loadPosts() {
  return JSON.parse(localStorage.getItem('posts')) || [];
}

// Save posts
function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Escape HTML
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render all posts
function renderPosts() {
  const posts = loadPosts();

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
    return;
  }

  postsContainer.innerHTML = posts
    .map(post => {
      const date = new Date(post.timestamp);
      return `
        <div class="post">
          <div class="post-header">
            <strong>${escapeHTML(post.username)}</strong>
            <span class="post-date">${date.toLocaleString()}</span>
          </div>
          <p class="post-content">${escapeHTML(post.content)}</p>
        </div>
      `;
    })
    .join('');
}

// Post submission
postForm.addEventListener('submit', e => {
  e.preventDefault();
  const content = postContent.value.trim();
  if (!content) return;

  const posts = loadPosts();
  const newPost = {
    username: currentUser,
    content,
    timestamp: new Date().toISOString(),
  };

  posts.unshift(newPost);
  savePosts(posts);
  postContent.value = '';
  renderPosts();
  showNotification('Post added!', 'success');
});

// Initial render
renderPosts();
