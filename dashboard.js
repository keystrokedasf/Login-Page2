const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "login-page2-e097f.firebaseapp.com",
  databaseURL: "https://login-page2-e097f-default-rtdb.firebaseio.com",
  projectId: "login-page2-e097f",
  storageBucket: "login-page2-e097f.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const postsContainer = document.getElementById('posts-container');

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html'; // Redirect if not logged in
  } else {
    // Show username on dashboard
    database.ref('users/' + user.uid).once('value').then(snapshot => {
      usernameDisplay.textContent = snapshot.val().username;
      localStorage.setItem('currentUser', snapshot.val().username);
    });

    // Load posts and listen for updates in real-time
    const postsRef = database.ref('posts');
    postsRef.on('value', snapshot => {
      const posts = snapshot.val();
      if (!posts) {
        postsContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        return;
      }

      const postsArray = Object.values(posts).sort((a, b) => b.timestamp - a.timestamp);
      postsContainer.innerHTML = postsArray.map(post => {
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
      }).join('');
    });
  }
});

postForm.addEventListener('submit', e => {
  e.preventDefault();
  const content = postContent.value.trim();
  if (!content) return;

  const username = localStorage.getItem('currentUser');
  if (!username) {
    alert('User not found, please log in again.');
    window.location.href = 'index.html';
    return;
  }

  const postsRef = database.ref('posts');
  postsRef.push({
    username,
    content,
    timestamp: Date.now()
  });

  postContent.value = '';
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
});

// Simple escape to avoid XSS
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
