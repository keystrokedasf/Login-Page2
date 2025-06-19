import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, push, onValue, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBUP9j33SLHMnj-EOSxNUK7uClOBrz38cQ",
  authDomain: "login-page2-e097f.firebaseapp.com",
  databaseURL: "https://login-page2-e097f-default-rtdb.firebaseio.com",
  projectId: "login-page2-e097f",
  storageBucket: "login-page2-e097f.firebasestorage.app",
  messagingSenderId: "1057472162795",
  appId: "1:1057472162795:web:25ba5f6d4c097fca0fc7ae",
  measurementId: "G-YLP94XDJVD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const postForm = document.getElementById('post-form');
const postContent = document.getElementById('post-content');
const postsContainer = document.getElementById('posts-container');

let currentUserName = null;

onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Get username from DB
  const userSnap = await get(ref(database, 'users/' + user.uid));
  currentUserName = userSnap.val().username;
  usernameDisplay.textContent = currentUserName;
  localStorage.setItem('currentUser', currentUserName);

  // Listen to posts realtime
  const postsRef = ref(database, 'posts');
  onValue(postsRef, snapshot => {
    const posts = snapshot.val();
    if (!posts) {
      postsContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
      return;
    }
    const postsArray = Object.values(posts).sort((a,b) => b.timestamp - a.timestamp);
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
});

postForm.addEventListener('submit', e => {
  e.preventDefault();
  const content = postContent.value.trim();
  if (!content) return;

  if (!currentUserName) {
    alert('User info not found. Please log in again.');
    window.location.href = 'index.html';
    return;
  }

  push(ref(database, 'posts'), {
    username: currentUserName,
    content,
    timestamp: Date.now()
  });

  postContent.value = '';
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
});

function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
