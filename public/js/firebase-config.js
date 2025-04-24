// firebase-config.js

// Import the necessary Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-kg0GXTcvhFr72lXIdME_wFvXCg1PPKQ",
  authDomain: "gym-management-system-9671d.firebaseapp.com",
  databaseURL: "https://gym-management-system-9671d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gym-management-system-9671d",
  storageBucket: "gym-management-system-9671d.appspot.com",
  messagingSenderId: "1063272581828",
  appId: "1:1063272581828:web:5aff013609214ca22e5791",
  measurementId: "G-F6S4C9N25B"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firestore and Auth to use them in other files
export { db, auth };
























  