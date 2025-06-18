const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const notification = document.getElementById('notification');

// Load users from localStorage
function loadUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Show animated notification
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `show ${type}`;
  setTimeout(() => {
    notification.className = '';
  }, 3000);
}

// Signup form handler
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  let users = loadUsers();

  if (users.some(u => u.username === username)) {
    showNotification('Username already taken!', 'error');
    return;
  }

  if (users.some(u => u.email === email)) {
    showNotification('Email already registered!', 'error');
    return;
  }

  users.push({ username, email, password });
  saveUsers(users);
  showNotification('Signup successful!', 'success');

  signupForm.reset();
});

// Login form handler
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    showNotification('Invalid username or password!', 'error');
    return;
  }

  localStorage.setItem('currentUser', username);
  showNotification('Login successful!', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
});
