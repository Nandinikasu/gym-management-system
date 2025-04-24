// member.js

import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Function to get member data by UID
export async function getMember(uid) {
  const memberRef = doc(db, 'users', uid);  // Ensure the collection name is 'users'
  const memberSnap = await getDoc(memberRef);
  if (memberSnap.exists()) {
    return memberSnap.data();
  } else {
    console.log('No such member!');
    return null;  // If the document doesn't exist, return null
  }
}







