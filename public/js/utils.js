// utils.js

// Function to handle errors
export function handleError(error) {
  console.error('Error:', error.message);
  alert('An error occurred: ' + error.message);
}

// Function to redirect to a page
export function redirectTo(page) {
  window.location.href = page;
}





