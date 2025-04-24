// Import necessary Firebase modules
import { auth } from './firebase-config.js';  // Ensure the path is correct
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Handle login
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();  // Prevent page reload on form submit

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Sign in with Firebase Auth
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User signed in:', user);
      // Redirect or show the dashboard
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      console.error('Error signing in:', error);
      alert('Login failed! Please check your email and password.');
    });
});























