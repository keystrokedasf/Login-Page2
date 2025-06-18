// Notification helper
const notification = document.getElementById('notification');
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = '';
  notification.classList.add(type, 'show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

// Signup form
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value.trim().toLowerCase();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value.trim();

    if (!username || !email || !password) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check duplicates
    if (users.some(u => u.username === username)) {
      showNotification('Username already taken.', 'error');
      return;
    }
    if (users.some(u => u.email === email)) {
      showNotification('Email already registered.', 'error');
      return;
    }

    // Add user
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showNotification('Signup successful! You can now log in.', 'success');
    signupForm.reset();
  });
}

// Login form
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('login-password').value.trim();

    if (!usernameInput || !passwordInput) {
      showNotification('Please enter username and password.', 'error');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const matchedUser = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (matchedUser) {
      localStorage.setItem('currentUser', matchedUser.username);
      showNotification('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      showNotification('Invalid username or password.', 'error');
    }
  });
}
