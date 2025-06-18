const loginForm = document.getElementById('login-form');
const notification = document.getElementById('notification');

// Demo hardcoded credentials
const DEMO_USERNAME = 'user';
const DEMO_PASSWORD = 'password123';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    showNotification('Login successful! Redirecting...', 'success');

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = 'dashboard.html'; // Change to your actual page
    }, 2000);

  } else {
    showNotification('Invalid username or password.', 'error');
  }

  loginForm.reset();
});

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = ''; // Reset classes
  notification.classList.add(type);
  notification.classList.add('show');

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
