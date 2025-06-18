const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const notification = document.getElementById('notification');

// Show notification helper
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = '';
  notification.classList.add(type, 'show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

// Handle signup
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = signupForm.querySelector('input[type="text"]').value.trim();
  const email = signupForm.querySelector('input[type="email"]').value.trim();
  const password = signupForm.querySelector('input[type="password"]').value.trim();

  if (!username || !email || !password) {
    showNotification('Please fill in all signup fields.', 'error');
    return;
  }

  // Load existing users or empty array
  const usersJSON = localStorage.getItem('users');
  const users = usersJSON ? JSON.parse(usersJSON) : [];

  // Check if username or email already exists (case insensitive)
  const usernameExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
  const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

  if (usernameExists) {
    showNotification('Username already taken.', 'error');
    return;
  }

  if (emailExists) {
    showNotification('Email already registered.', 'error');
    return;
  }

  // Add new user and save
  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  showNotification('Signup successful! You can now log in.', 'success');
  signupForm.reset();

  // Switch to login form
  document.getElementById('toggle').checked = false;
});

// Handle login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const usersJSON = localStorage.getItem('users');
  if (!usersJSON) {
    showNotification('No users found. Please sign up first.', 'error');
    return;
  }

  const users = JSON.parse(usersJSON);

  const matchedUser = users.find(user => user.username === username && user.password === password);

  if (matchedUser) {
    showNotification('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html'; // Change to your actual dashboard page
    }, 2000);
  } else {
    showNotification('Invalid username or password.', 'error');
  }

  loginForm.reset();
});
