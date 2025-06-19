const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `show ${type}`;
  setTimeout(() => {
    notification.className = '';
  }, 3000);
}

function getUsers() {
  const usersJSON = localStorage.getItem('users');
  return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Signup
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (!username || !email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  const users = getUsers();

  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    showNotification('Username already taken', 'error');
    return;
  }

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showNotification('Email already registered', 'error');
    return;
  }

  users.push({ username, email, password });
  saveUsers(users);

  showNotification('Account created successfully!', 'success');
  signupForm.reset();
});

// Login
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const users = getUsers();

  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

  if (!user) {
    showNotification('Invalid username or password', 'error');
    return;
  }

  localStorage.setItem('currentUser', user.username);
  showNotification('Login successful!', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
});
