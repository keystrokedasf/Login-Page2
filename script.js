const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const notification = document.getElementById('notification');

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = '';
  notification.classList.add(type, 'show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Grab signup inputs and normalize
  const username = signupForm.querySelector('input[type="text"]').value.trim().toLowerCase();
  const email = signupForm.querySelector('input[type="email"]').value.trim().toLowerCase();
  const password = signupForm.querySelector('input[type="password"]').value.trim();

  if (!username || !email || !password) {
    showNotification('Please fill in all signup fields.', 'error');
    return;
  }

  // Get users array or empty
  const usersJSON = localStorage.getItem('users');
  const users = usersJSON ? JSON.parse(usersJSON) : [];

  // Check if username/email exists (case-insensitive)
  const usernameExists = users.some(user => user.username.toLowerCase() === username);
  const emailExists = users.some(user => user.email.toLowerCase() === email);

  if (usernameExists) {
    showNotification('Username already taken.', 'error');
    return;
  }

  if (emailExists) {
    showNotification('Email already registered.', 'error');
    return;
  }

  // Save new user with original casing but stored keys normalized for checking
  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  showNotification('Signup successful! You can now log in.', 'success');
  signupForm.reset();

  // Switch back to login form
  document.getElementById('toggle').checked = false;
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    showNotification('Please fill in all login fields.', 'error');
    return;
  }

  const usersJSON = localStorage.getItem('users');
  if (!usersJSON) {
    showNotification('No users found. Please sign up first.', 'error');
    return;
  }

  const users = JSON.parse(usersJSON);

  // Find user by username (case-insensitive) and matching password
  const matchedUser = users.find(user => user.username.toLowerCase() === username && user.password === password);

  if (matchedUser) {
    showNotification('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html'; // Change to your target page
    }, 2000);
  } else {
    showNotification('Invalid username or password.', 'error');
  }

  loginForm.reset();
});
