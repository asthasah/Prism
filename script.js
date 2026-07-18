// TASK MANAGER LOGIC (For tasks.html)
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    
    if (!taskInput || !taskList) return;

    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task, Astha!");
        return;
    }

    // New <li> element stylish class ke sath banana
    const li = document.createElement('li');
    li.className = 'task-item-container';
    
    // New elements ka complete dynamic setup
    li.innerHTML = `
        <div class="task-header">
            <span class="task-text">${taskText}</span>
            <div class="task-actions">
                <!-- Edit button -->
                <button class="btn-action btn-edit" onclick="editTask(this)" title="Edit Task Name">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <!-- Sticky Note Toggle button -->
                <button class="btn-action btn-note" onclick="toggleNote(this)" title="Toggle Notes">
                    <i class="fa-solid fa-note-sticky"></i>
                </button>
                <!-- Delete button -->
                <button class="btn-action btn-del" onclick="deleteTask(this)" title="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        <!-- Sticky Note Slide Section -->
        <div class="sticky-note-area">
            <textarea placeholder="✍️ Write notes, links, or quick steps for this task here..."></textarea>
        </div>
    `;

    taskList.appendChild(li);
    taskInput.value = "";
}

//For Task 1,2,3
// 1. Smoothly individual task delete karne ke liye
function deleteTask(button) {
    const taskItem = button.closest('.task-item-container');
    taskItem.style.opacity = '0';
    taskItem.style.transform = 'translateY(10px)';
    setTimeout(() => {
        taskItem.remove();
    }, 200);
}

// 2. Sticky Notes toggle karne ke liye
function toggleNote(button) {
    const taskItem = button.closest('.task-item-container');
    const noteArea = taskItem.querySelector('.sticky-note-area');
    
    if (noteArea.style.display === 'block') {
        noteArea.style.display = 'none';
    } else {
        noteArea.style.display = 'block';
        noteArea.querySelector('textarea').focus(); // Auto focus on textarea
    }
}

// 3. Task text edit (update) karne ke liye
function editTask(button) {
    const taskItem = button.closest('.task-item-container');
    const taskTextSpan = taskItem.querySelector('.task-text');
    
    const currentText = taskTextSpan.innerText;
    const newText = prompt("Update your task name, Astha:", currentText);
    
    if (newText !== null && newText.trim() !== "") {
        taskTextSpan.innerText = newText.trim();
    }
}

//DROPDOWN & MODAL AUTH LOGIC
let generatedOTP = null; // OTP temporarily memory me store karne ke liye
document.addEventListener("DOMContentLoaded", () => {
    checkUserSession();
});

// Dropdown Menu Toggler
function toggleProfileDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown) {
        dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
    }
}

// Bahar click karne pe dropdown menu close handle karna
window.addEventListener("click", () => {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown && dropdown.style.display === "block") {
        dropdown.style.display = "none";
    }
});

// "Login / Sign Up" ya Logout option button pe click karne ka flow
function handleProfileAuthAction(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        // Logout verification
        if (confirm("Hi Astha, do you really want to Logout?")) {
            localStorage.removeItem("currentUser");
            alert("Logged out successfully!");
            checkUserSession();
        }
    } else {
        // modal display karna!
        document.getElementById("customAuthModal").style.display = "flex";
        backToLoginFromForgot(event); // Default state login hi rakhega jab open hoga
    }
    
    // Hide dropdown instantly
    document.getElementById("dropdownMenu").style.display = "none";
}


// Modal tab switcher between Login and Signup
function switchModalForm(target) {
    const logForm = document.getElementById("modalLoginForm");
    const signForm = document.getElementById("modalSignupForm");
    const tabLog = document.getElementById("modalTabLogin");
    const tabSign = document.getElementById("modalTabSignup");

    if (target === 'login') {
        logForm.style.display = "block";
        signForm.style.display = "none";
        tabLog.classList.add("active");
        tabSign.classList.remove("active");
    } else {
        logForm.style.display = "none";
        signForm.style.display = "block";
        tabLog.classList.remove("active");
        tabSign.classList.add("active");
    }
}

// Close Modal Action
function closeAuthModal() {
    document.getElementById("customAuthModal").style.display = "none";
}

//SIGN UP TRIGGER
function submitModalSignup(event) {
    event.preventDefault();
    const user = document.getElementById("mSignUser").value.trim();
    const pass = document.getElementById("mSignPass").value;

    let users = JSON.parse(localStorage.getItem("prismUsers")) || {};

    if (users[user]) {
        alert("This username already exists! Choose another name.");
        return;
    }

    // Save database record locally
    users[user] = pass;
    localStorage.setItem("prismUsers", JSON.stringify(users));

    alert("Account registered successfully! Automatic signing in...");
    localStorage.setItem("currentUser", user);
    
    closeAuthModal();
    document.getElementById("modalSignupForm").reset();
    checkUserSession();
}

//LOGIN TRIGGER
function submitModalLogin(event) {
    event.preventDefault();
    const user = document.getElementById("mLogUser").value.trim();
    const pass = document.getElementById("mLogPass").value;

    let users = JSON.parse(localStorage.getItem("prismUsers")) || {};

    if (users[user] && users[user] === pass) {
        localStorage.setItem("currentUser", user);
        closeAuthModal();
        document.getElementById("modalLoginForm").reset();
        checkUserSession();
    } else {
        alert("Oops! Invalid username or password. Check inputs again.");
    }
}

//1.FORGOT PASSWORD VIEW (Login layout ko hide karke reset form dikhayega)
function triggerForgotPasswordView(event) {
    event.preventDefault();
    
    document.getElementById("modalLoginForm").style.display = "none";
    document.getElementById("modalSignupForm").style.display = "none";
    document.getElementById("modalTabsHeader").style.display = "none";
    
    document.getElementById("modalForgotForm").style.display = "block";
    document.getElementById("phoneStep").style.display = "block";
    document.getElementById("otpStep").style.display = "none";
    document.getElementById("newPassStep").style.display = "none";
    document.getElementById("resetSubmitBtn").style.display = "none";
    document.getElementById("modalForgotForm").reset();
}

//2.FORGOT FORM SE WAPAS LOGIN PAR JAANE KE LIYE
function backToLoginFromForgot(event) {
    if (event) event.preventDefault();
    document.getElementById("modalForgotForm").style.display = "none";
    document.getElementById("modalTabsHeader").style.display = "flex";
    switchModalForm('login');
}

//3.DYNAMIC SIMULATED OTP SENDER ENGINE
function sendMockOTP() {
    const phone = document.getElementById("fPhone").value.trim();
    if (phone.length < 10) {
        alert("Please enter a valid 10-digit mobile number!");
        return;
    }

    //4.digit random OTP code generator
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Developer system simulator notification text
    alert(`🔑 PRISM SECURITY Verification Token:\nYour OTP verification code is: ${generatedOTP}`);
    
    // Chhupe hue elements ko seamlessly show kar dena
    document.getElementById("otpStep").style.display = "block";
    document.getElementById("newPassStep").style.display = "block";
    document.getElementById("resetSubmitBtn").style.display = "block";
}

//5.NEW PASSWORD UPDATE ENGINE
function handlePasswordReset(event) {
    event.preventDefault();
    const searchUser = document.getElementById("fUser").value.trim();
    const userOTP = document.getElementById("fOTP").value.trim();
    const newPassword = document.getElementById("fNewPass").value;

    let users = JSON.parse(localStorage.getItem("prismUsers")) || {};

    if (!users[searchUser]) {
        alert("Username not found in local registry!");
        return;
    }

    if (userOTP !== generatedOTP) {
        alert("Incorrect OTP! Verification failed.");
        return;
    }

    if (newPassword.trim() === "") {
        alert("Password field cannot be kept empty.");
        return;
    }
    
    //6.Update data locally
    users[searchUser] = newPassword;
    localStorage.setItem("prismUsers", JSON.stringify(users));

    alert(`Success! Password for "${searchUser}" has been updated. Please login now.`);
    backToLoginFromForgot(event);
}

// Dynamic session compiler interface updates
function checkUserSession() {
    const currentUser = localStorage.getItem("currentUser");
    
    //new elements that we created
    const authButtons = document.getElementById("authButtonsContainer");
    const profileContainer = document.getElementById("userProfileContainer");
    
    // old one
    const nameLabel = document.getElementById("userDisplayName");
    const emailLabel = document.getElementById("userDisplayEmail");
    const avatarLetter = document.getElementById("navAvatarLetter");
    const welcomeHeading = document.getElementById("welcomeHeading");

    if (currentUser) {
        // User Logged In hai
        if (authButtons) authButtons.style.display = "none";
        if (profileContainer) profileContainer.style.display = "flex";

        if (nameLabel) nameLabel.innerText = currentUser;
        if (emailLabel) emailLabel.innerText = `${currentUser.toLowerCase()}@gmail.com`;
        if (avatarLetter) avatarLetter.innerText = currentUser.charAt(0).toUpperCase();
        if (welcomeHeading) welcomeHeading.innerText = `🚀 Active Workspace: ${currentUser}`;
    } else {
        // User is Guest (if not Logged in)
        if (authButtons) authButtons.style.display = "flex";
        if (profileContainer) profileContainer.style.display = "none";

        if (nameLabel) nameLabel.innerText = "Guest User";
        if (emailLabel) emailLabel.innerText = "Please login to sync workspace";
        if (avatarLetter) avatarLetter.innerText = "?";
        if (welcomeHeading) welcomeHeading.innerText = "🌈 Welcome to Prism";
    }
}

//for profile settings modal on
function openProfileSettings(event) {
    event.preventDefault();
    const modal = document.getElementById("profileModal"); 
    if (modal) {
        modal.style.display = "flex"; 
    }
} 
// Modal band karne ke liye off
function closeProfileModal() {
    const modal = document.getElementById("profileModal");
    if (modal) {
        modal.style.display = "none";
    }
}


function openGeneralSettings(event) { event.preventDefault(); alert("General space loading..."); }

// ==========================================
// PRISM PAGES ROUTER ENGINE

let totalSpentAmount = 0;

// 1.Expenses Page Logic
function addExpense() {
    const nameInput = document.getElementById("expenseName");
    const amountInput = document.getElementById("expenseAmount");
    const listContainer = document.getElementById("expenseList");
    const totalDisplay = document.getElementById("totalSpentDisplay");

    if (!nameInput || !amountInput) return;

    const itemName = nameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (itemName === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid item name and amount, Astha!");
        return;
    }

    // Total Update
    totalSpentAmount += amount;
    if (totalDisplay) {
        totalDisplay.innerText = `₹${totalSpentAmount}`;
    }

    // List Row Addition (Niche Name aur Money laane ke liye)
    if (listContainer) {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.justify = "space-between";
        row.style.background = "rgba(255, 255, 255, 0.06)";
        row.style.padding = "10px 14px";
        row.style.borderRadius = "10px";
        row.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        row.style.color = "#ffffff";
        row.style.fontSize = "0.95rem";
        
        row.innerHTML = `<span> ${itemName}</span> <span style="font-weight: 600; color: #bca5ff;">₹${amount}</span>`;
        listContainer.appendChild(row);
    }

    // Input reset
    nameInput.value = "";
    amountInput.value = "";
}

// 2. Calculator Page Logic (Ultra Safe Initializer)
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("calculator.html")) {
        const display = document.getElementById("display");
        const calcButtonsContainer = document.querySelector(".calc-buttons");
        let calcInputString = "";

        if (calcButtonsContainer && display) {
            // Target only actual button elements to avoid layout click override
            calcButtonsContainer.addEventListener("click", (e) => {
                if (e.target.tagName !== "BUTTON") return;
                
                const val = e.target.innerText.trim();

                if (val === 'C') {
                    calcInputString = "";
                    display.innerText = "0";
                } else if (val === '=') {
                    try {
                        if (calcInputString !== "") {
                            // Direct mathematical operations eval bypassing styling blocks
                            let result = eval(calcInputString.replace(/[^0-9+\-*/.]/g, ''));
                            display.innerText = result;
                            calcInputString = result.toString();
                        }
                    } catch (err) {
                        display.innerText = "Error";
                        calcInputString = "";
                    }
                } else {
                    if (calcInputString === "0" || display.innerText === "0") {
                        calcInputString = "";
                    }
                    calcInputString += val;
                    display.innerText = calcInputString;
                }
            });
        }
    }
});

//for profile settings
function openProfileSettings(event) { 
    event.preventDefault(); 
    document.getElementById("profileModal").style.display = "flex"; 
}

function closeProfileModal() {
    document.getElementById("profileModal").style.display = "none";
}