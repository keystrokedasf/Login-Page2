import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from "firebase/database";

// Your Firebase config
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

registerForm.addEventListener('submit', async e => {
  e.preventDefault();

  const email = registerForm['reg-email'].value.trim();
  const password = registerForm['reg-password'].value.trim();
  const username = registerForm['reg-username'].value.trim();

  try {
    // Check if username exists
    let usernameQuery = query(ref(database, 'users'), orderByChild('username'), equalTo(username));
    let usernameSnap = await get(usernameQuery);
    if (usernameSnap.exists()) {
      alert('Username already taken!');
      return;
    }

    // Check if email exists
    let emailQuery = query(ref(database, 'users'), orderByChild('email'), equalTo(email));
    let emailSnap = await get(emailQuery);
    if (emailSnap.exists()) {
      alert('Email already registered!');
      return;
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Save user data
    await set(ref(database, 'users/' + userCredential.user.uid), {
      username,
      email
    });

    alert('Account created successfully! Please log in.');
    registerForm.reset();

  } catch (err) {
    alert(err.message);
  }
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  const email = loginForm['login-email'].value.trim();
  const password = loginForm['login-password'].value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Get username from DB
    const userSnap = await get(ref(database, 'users/' + userCredential.user.uid));
    if (!userSnap.exists()) throw new Error('User data not found.');

    localStorage.setItem('currentUser', userSnap.val().username);

    // Redirect after successful login
    window.location.href = 'dashboard.html';

  } catch {
    alert('Invalid email or password.');
  }
});
