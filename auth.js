// Initialize Firebase
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

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = registerForm['reg-email'].value.trim();
  const password = registerForm['reg-password'].value.trim();
  const username = registerForm['reg-username'].value.trim();

  // Check username uniqueness
  database.ref('users').orderByChild('username').equalTo(username).once('value').then(snapshot => {
    if (snapshot.exists()) {
      alert('Username already taken!');
      return Promise.reject('Username taken');
    }
    // Check email uniqueness
    return database.ref('users').orderByChild('email').equalTo(email).once('value');
  }).then(snapshot => {
    if (snapshot.exists()) {
      alert('Email already registered!');
      return Promise.reject('Email registered');
    }

    // Create user with Firebase Auth
    return auth.createUserWithEmailAndPassword(email, password);
  }).then(cred => {
    // Save username/email under user uid
    return database.ref('users/' + cred.user.uid).set({
      username,
      email
    });
  }).then(() => {
    alert('Account created successfully! Please log in.');
    registerForm.reset();
  }).catch(err => {
    if (typeof err === 'string') return; // already alerted
    alert(err.message);
  });
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm['login-email'].value.trim();
  const password = loginForm['login-password'].value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      return database.ref('users/' + cred.user.uid).once('value');
    })
    .then(snapshot => {
      const userData = snapshot.val();
      localStorage.setItem('currentUser', userData.username);
      window.location.href = 'dashboard.html';
    })
    .catch(err => {
      alert('Invalid email or password.');
    });
});
