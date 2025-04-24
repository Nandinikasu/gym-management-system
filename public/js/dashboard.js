import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Section toggler
function showSection(sectionId) {
  console.log(`Showing section: ${sectionId}`);
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';
}

// Attach button events on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  document.getElementById('btn-users').addEventListener('click', () => {
    console.log('users button clicked');
    showSection('users');
    fetchUsers();
  });

  document.getElementById('btn-Bills').addEventListener('click', () => {
    console.log('Bills button clicked');
    showSection('Bills');
    fetchBills();
  });

  document.getElementById('btn-Members').addEventListener('click', () => {
    console.log('Members button clicked');
    showSection('Members');  // make sure the section id is exactly 'Members'
    fetchMembers();
  });  

  document.getElementById('btn-diet').addEventListener('click', () => {
    console.log('Diet button clicked');
    showSection('diet');
    fetchDiet();
  });

  document.getElementById('btn-Notifications').addEventListener('click', () => {
    console.log('Notifications button clicked');
    showSection('Notifications');
    fetchNotifications();  // Fetch notifications when the button is clicked
  });  

  document.getElementById('btn-Reports').addEventListener('click', () => {
    console.log('Reports button clicked');
    showSection('Reports');
    fetchReports();
  });
});

// === FETCH FUNCTIONS ===

// Fetch all users with safe handling of missing fields
async function fetchUsers() {
  const usersList = document.getElementById('users-list');
  usersList.innerHTML = ''; // Clear the list before adding new data

  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const addedUserIds = new Set(); // Use document ID as unique identifier
    snapshot.forEach(doc => {
      const user = doc.data();
      const userId = doc.id;
      // Prevent duplicates using doc.id
      if (addedUserIds.has(userId)) return;
      addedUserIds.add(userId);
      // Extract necessary fields
      const name = user.name || 'N/A';
      const email = user.email || 'N/A';
      const phone = user.phoneno || 'N/A';
      const role = user.role || 'N/A';
      usersList.innerHTML += `
        <li>
          <strong>Name:</strong> ${name}<br>
          <strong>Email:</strong> ${email}<br>
          <strong>Phone:</strong> ${phone}<br>
          <strong>Role:</strong> ${role}<br>
        </li>
      `;
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    usersList.innerHTML = '<li>Error fetching users.</li>';
  }
}

// Function to Fetch Data for Bills
async function fetchBills() {
  const billsList = document.getElementById("bills-list");

  if (!billsList) {
    console.error("Element with ID 'bills-list' not found in HTML.");
    return;
  }

  billsList.innerHTML = ''; // Reset list

  try {
    const snapshot = await getDocs(collection(db, "Bills"));
    snapshot.forEach((doc) => {
      const bill = doc.data();

      const dueDate = bill.duedate || 'N/A';
      const dateIssued = bill.dateIssued || 'N/A';
      const paymentMethod = bill.paymentMethod || 'N/A';
      const status = bill.status || 'N/A';

      billsList.innerHTML += `
        <li>
          <strong>MemberId:</strong> ${bill.MemberId || 'N/A'} <br>
          <strong>Amount:</strong> ₹${bill.amount || 'N/A'} <br>
          <strong>Date Issued:</strong> ${dateIssued} <br>
          <strong>Due Date:</strong> ${dueDate} <br>
          <strong>Payment Method:</strong> ${paymentMethod} <br>
          <strong>Status:</strong> ${status} <br>
        </li>
      `;
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    billsList.innerHTML = "<li>Error loading bills.</li>";
  }
}

// Fetch all members with full details
async function fetchMembers() {
  const list = document.getElementById('members-list');
  
  if (!list) {
    console.error('Members list element not found');
    return;
  }

  list.innerHTML = ''; // Reset the list

  try {
    const snapshot = await getDocs(collection(db, 'Members'));
    snapshot.forEach(doc => {
      const member = doc.data();
      console.log('Fetched member data:', member);  // Log the whole member object

      // Log the supplements to check its structure
      console.log('Supplements:', member.Supplements);

      // Check if supplements exists and is an array
      let supplementsHtml = 'No supplements'; // Default value if no supplements exist
      if (Array.isArray(member.Supplements) && member.Supplements.length > 0) {
        supplementsHtml = `
          <ul>
            ${member.Supplements.map(s => `<li>Name: ${s.name}, Quantity: ${s.quantity}</li>`).join('')}
          </ul>
        `;
      }

      // Add member details to the list
      list.innerHTML += `
        <li>
          <strong>Name:</strong> ${member.name} <br>
          <strong>Email:</strong> ${member.email} <br>
          <strong>Phone:</strong> ${member.phoneno} <br>
          <strong>Age:</strong> ${member.age} <br>
          <strong>Package:</strong> ${member.package.name} (${member.package.duration}) <br>
          <strong>Fee:</strong> ₹${member.package.fee} <br>
          <strong>Status:</strong> ${member.status} <br>
          <strong>Supplements:</strong> ${supplementsHtml} <br>
          <strong>Joined At:</strong> ${member.joinedAt.toDate().toLocaleString()} <br>
        </li>
      `;
    });
  } catch (error) {
    console.error('Error fetching members:', error);
  }
}
// Fetch all diet Details with full details
async function fetchDiet() {
  const dietList = document.getElementById("diet-list");
  dietList.innerHTML = ''; // Clear existing content
  
  try {
    const dietDetailsRef = collection(db, "Diet Details");
    const dietSnapshot = await getDocs(dietDetailsRef);

    let dataFound = false; // Flag to check if data is found

    dietSnapshot.forEach((doc) => {
      const dietData = doc.data();
      console.log('Fetched diet data:', dietData); // Log the data to check the structure

      const name = dietData.name || "N/A";
      const memberId = dietData.MemberId || "N/A";
      const caloriesPerDay = dietData.calories_per_day || "N/A";
      const duration = dietData.duration || "N/A";
      const description = dietData.description || "N/A";
      const mealPlan = dietData.meal_plan || []; // Default to an empty array if meal_plan is missing

      console.log('Meal Plan:', mealPlan);  // Log meal_plan for debugging

      // Process the meal plan, pairing day with meals
      let mealItems = '';
      for (let i = 0; i < mealPlan.length; i++) {
        if (mealPlan[i].day && mealPlan[i].meals) {
          // If both day and meals are found, display them
          mealItems += `
            <li>
              <strong>Day:</strong> ${mealPlan[i].day}<br>
              <strong>Meals:</strong> ${mealPlan[i].meals}
            </li>
          `;
        } else if (mealPlan[i].day && !mealPlan[i].meals) {
          // If we have day but no meals (skip this object if meals are missing)
          const nextMeal = mealPlan[i + 1] && mealPlan[i + 1].meals;
          if (nextMeal) {
            mealItems += `
              <li>
                <strong>Day:</strong> ${mealPlan[i].day}<br>
                <strong>Meals:</strong> ${nextMeal}
              </li>
            `;
            i++; // Skip the next item since we've paired it with the current day
          }
        } else if (mealPlan[i].meals && !mealPlan[i].day) {
          // If we have meals but no day (skip this object if day is missing)
          const previousDay = mealPlan[i - 1] && mealPlan[i - 1].day;
          if (previousDay) {
            mealItems += `
              <li>
                <strong>Day:</strong> ${previousDay}<br>
                <strong>Meals:</strong> ${mealPlan[i].meals}
              </li>
            `;
          }
        }
      }
      // If meal plan is empty or not structured correctly, display a fallback message
      if (mealItems === '') {
        mealItems = '<li>No meals listed.</li>';
      }
      // Create the list item for each diet
      const dietItem = document.createElement("li");
      dietItem.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Member ID:</strong> ${memberId}<br>
        <strong>Calories/Day:</strong> ${caloriesPerDay}<br>
        <strong>Duration:</strong> ${duration}<br>
        <strong>Description:</strong> ${description}<br>
        <strong>Meal Plan:</strong>
        <ul>
          ${mealItems}
        </ul>
      `; 
      dietList.appendChild(dietItem); // Append the diet item to the list
      dataFound = true; // Mark that data was found
    });
    // If no data was found, show a "No data available" message
    if (!dataFound) {
      dietList.innerHTML = "<li>No diet details available.</li>";
    }
  } catch (error) {
    console.error("Error fetching diet details:", error);
    dietList.innerHTML = "<li>Error fetching data.</li>";
  }
}
// Fetch all Notifications details from Firestore
async function fetchNotifications() {
  const notificationsList = document.getElementById('notifications-list');
  notificationsList.innerHTML = ''; // Reset list

  try {
    const snapshot = await getDocs(collection(db, 'Notifications')); // Firestore collection name 'Notifications'
    snapshot.forEach(doc => {
      const notification = doc.data();
      console.log(notification); // Log the notification data

      // Extract notification info based on your structure
      const memberId = notification.MemberId || 'No Member ID';
      const dateSent = notification.dateSent || 'No Date Sent';
      const message = notification.message || 'No Message';
      const status = notification.status || 'No Status';
      const type = notification.type || 'No Type';

      // Display the notification data in the list
      notificationsList.innerHTML += `
        <li>
          <strong>Member ID:</strong> ${memberId}<br>
          <strong>Date Sent:</strong> ${dateSent}<br>
          <strong>Message:</strong> ${message}<br>
          <strong>Status:</strong> ${status}<br>
          <strong>Type:</strong> ${type}<br>
        </li>
      `;
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
}
// Fetch all reports with full details
async function fetchReports() {
  const list = document.getElementById('Reports-list');
  list.innerHTML = ''; // Reset list
  try {
    const snapshot = await getDocs(collection(db, 'Reports'));
    snapshot.forEach(doc => {
      const report = doc.data();
      console.log(report);  // Check report data in console
      list.innerHTML += `
        <li>
          <strong>Report Name:</strong> ${report.report_name} <br>
          <strong>Report Type:</strong> ${report.report_type} <br>
          <strong>Generated By:</strong> ${report.generated_by} <br>
          <strong>Date Generated:</strong> ${report.date_generated.toDate().toLocaleString()} <br>
          <strong>Export Format:</strong> ${report.export_format} <br>
          <strong>Report Data:</strong> 
          <ul>
            ${report.report_data.map(data => `
              <li>${JSON.stringify(data)}</li>
            `).join('')}
          </ul>
        </li>
      `;
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
  }
}


































  
  

  
  
  