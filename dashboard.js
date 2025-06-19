// Redirect to login if no user logged in
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  window.location.href = 'index.html';
}

const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const postsContainer = document.getElementById('posts-container');

usernameDisplay.textContent = currentUser;

// Logout handler
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

// Load posts from storage or empty array
function loadPosts() {
  const postsJSON = localStorage.getItem('posts');
  return postsJSON ? JSON.parse(postsJSON) : [];
}

// Save posts array to storage
function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Render posts on page
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

  // Auto scroll to top
  const wrapper = document.getElementById('posts-scroll-wrapper');
  if (wrapper) wrapper.scrollTop = 0;
}

// Escape to prevent XSS
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handle new post submission
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

  posts.unshift(newPost); // Newest on top
  savePosts(posts);

  postContent.value = '';
  renderPosts();
});

// Initial render
renderPosts();

// Listen for post updates in real-time across tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'posts') {
    renderPosts();
  }
});
