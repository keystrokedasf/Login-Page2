// Notification setup
const notification = document.getElementById('notification');
function showNotification(message, type = 'success') {
  if (!notification) return;
  notification.textContent = message;
  notification.className = '';
  notification.classList.add(type, 'show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// --------- SIGNUP ---------
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value.trim();

    if (!username || !email || !password) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check for duplicates
    const usernameTaken = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    const emailTaken = users.some(u => u.email === email);

    if (usernameTaken) {
      showNotification('Username already taken.', 'error');
      return;
    }
    if (emailTaken) {
      showNotification('Email already registered.', 'error');
      return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    showNotification('Signup successful! You can now log in.', 'success');
    signupForm.reset();
  });
}

// --------- LOGIN ---------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value.trim();

    if (!usernameInput || !passwordInput) {
      showNotification('Please enter both fields.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Case-insensitive username match
    const matchedUser = users.find(
      u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput
    );

    if (matchedUser) {
      localStorage.setItem('currentUser', matchedUser.username); // ✅ Correctly store full username
      showNotification('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      showNotification('Invalid username or password.', 'error');
    }
  });
}
