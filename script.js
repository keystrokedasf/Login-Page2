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

  // Save to localStorage as JSON string
  const userData = { username, email, password };
  localStorage.setItem('user', JSON.stringify(userData));

  showNotification('Signup successful! You can now log in.', 'success');
  signupForm.reset();

  // Automatically switch to login form
  document.getElementById('toggle').checked = false;
});

// Handle login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const storedUserJSON = localStorage.getItem('user');
  if (!storedUserJSON) {
    showNotification('No user found. Please sign up first.', 'error');
    return;
  }

  const storedUser = JSON.parse(storedUserJSON);

  if (username === storedUser.username && password === storedUser.password) {
    showNotification('Login successful! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html'; // Your dashboard page
    }, 2000);

  } else {
    showNotification('Invalid username or password.', 'error');
  }

  loginForm.reset();
});
