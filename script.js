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

    const li = document.createElement('li');
    li.className = 'task-item-container';
    
    li.innerHTML = `
        <div class="task-header">
            <span class="task-text">${taskText}</span>
            <div class="task-actions">
                <button class="btn-action btn-edit" onclick="editTask(this)" title="Edit Task Name">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-action btn-note" onclick="toggleNote(this)" title="Toggle Notes">
                    <i class="fa-solid fa-note-sticky"></i>
                </button>
                <button class="btn-action btn-del" onclick="deleteTask(this)" title="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="sticky-note-area">
            <textarea placeholder="✍️ Write notes, links, or quick steps for this task here..."></textarea>
        </div>
    `;

    taskList.appendChild(li);
    saveTask(taskText);
    taskInput.value = "";
}

function deleteTask(button) {
    const taskItem = button.closest('.task-item-container');
    const taskText = taskItem.querySelector('.task-text').innerText;
    
    let savedTasks = JSON.parse(localStorage.getItem('prismTasks')) || [];
    savedTasks = savedTasks.filter(t => t !== taskText);
    localStorage.setItem('prismTasks', JSON.stringify(savedTasks));

    taskItem.style.opacity = '0';
    taskItem.style.transform = 'translateY(10px)';
    setTimeout(() => {
        taskItem.remove();
    }, 200);
}

function toggleNote(button) {
    const taskItem = button.closest('.task-item-container');
    const noteArea = taskItem.querySelector('.sticky-note-area');
    
    if (noteArea.style.display === 'block') {
        noteArea.style.display = 'none';
    } else {
        noteArea.style.display = 'block';
        noteArea.querySelector('textarea').focus();
    }
}

function editTask(button) {
    const taskItem = button.closest('.task-item-container');
    const taskTextSpan = taskItem.querySelector('.task-text');
    
    const currentText = taskTextSpan.innerText;
    const newText = prompt("Update your task name, Astha:", currentText);
    
    if (newText !== null && newText.trim() !== "") {
        taskTextSpan.innerText = newText.trim();
    }
}


// DROPDOWN & MODAL AUTH LOGIC
let generatedOTP = null; 
document.addEventListener("DOMContentLoaded", () => {
    checkUserSession();
    renderExpenses(); // Page load hote hi expenses dikhane ke liye
});

function toggleProfileDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown) {
        dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
    }
}

window.addEventListener("click", () => {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown && dropdown.style.display === "block") {
        dropdown.style.display = "none";
    }
});

function handleProfileAuthAction(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        if (confirm("Hi Astha, do you really want to Logout?")) {
            localStorage.removeItem("currentUser");
            alert("Logged out successfully!");
            checkUserSession();
        }
    } else {
        document.getElementById("customAuthModal").style.display = "flex";
        backToLoginFromForgot(event);
    }
    
    document.getElementById("dropdownMenu").style.display = "none";
}

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

function closeAuthModal() {
    document.getElementById("customAuthModal").style.display = "none";
}

function submitModalSignup(event) {
    event.preventDefault();
    const user = document.getElementById("mSignUser").value.trim();
    const pass = document.getElementById("mSignPass").value;

    let users = JSON.parse(localStorage.getItem("prismUsers")) || {};

    if (users[user]) {
        alert("This username already exists! Choose another name.");
        return;
    }

    users[user] = pass;
    localStorage.setItem("prismUsers", JSON.stringify(users));

    alert("Account registered successfully! Automatic signing in...");
    localStorage.setItem("currentUser", user);
    
    closeAuthModal();
    document.getElementById("modalSignupForm").reset();
    checkUserSession();
}

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

function backToLoginFromForgot(event) {
    if (event) event.preventDefault();
    document.getElementById("modalForgotForm").style.display = "none";
    document.getElementById("modalTabsHeader").style.display = "flex";
    switchModalForm('login');
}

function sendMockOTP() {
    const phone = document.getElementById("fPhone").value.trim();
    if (phone.length < 10) {
        alert("Please enter a valid 10-digit mobile number!");
        return;
    }

    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    alert(`🔑 PRISM SECURITY Verification Token:\nYour OTP verification code is: ${generatedOTP}`);
    
    document.getElementById("otpStep").style.display = "block";
    document.getElementById("newPassStep").style.display = "block";
    document.getElementById("resetSubmitBtn").style.display = "block";
}

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
    
    users[searchUser] = newPassword;
    localStorage.setItem("prismUsers", JSON.stringify(users));

    alert(`Success! Password for "${searchUser}" has been updated. Please login now.`);
    backToLoginFromForgot(event);
}

function checkUserSession() {
    const currentUser = localStorage.getItem("currentUser");
    const authButtons = document.getElementById("authButtonsContainer");
    const profileContainer = document.getElementById("userProfileContainer");
    const nameLabel = document.getElementById("userDisplayName");
    const emailLabel = document.getElementById("userDisplayEmail");
    const avatarLetter = document.getElementById("navAvatarLetter");
    const welcomeHeading = document.getElementById("welcomeHeading");

    if (currentUser) {
        if (authButtons) authButtons.style.display = "none";
        if (profileContainer) profileContainer.style.display = "flex";
        if (nameLabel) nameLabel.innerText = currentUser;
        if (emailLabel) emailLabel.innerText = `${currentUser.toLowerCase()}@gmail.com`;
        if (avatarLetter) avatarLetter.innerText = currentUser.charAt(0).toUpperCase();
        if (welcomeHeading) welcomeHeading.innerText = `🚀 Active Workspace: ${currentUser}`;
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (profileContainer) profileContainer.style.display = "none";
        if (nameLabel) nameLabel.innerText = "Guest User";
        if (emailLabel) emailLabel.innerText = "Please login to sync workspace";
        if (avatarLetter) avatarLetter.innerText = "?";
        if (welcomeHeading) welcomeHeading.innerText = "🌈 Welcome to Prism";
    }
}

function openProfileSettings(event) { 
    event.preventDefault(); 
    document.getElementById("profileModal").style.display = "flex"; 
}

function closeProfileModal() {
    document.getElementById("profileModal").style.display = "none";
}

function openGeneralSettings(event) { event.preventDefault(); alert("General space loading..."); }


// ---------------------------------------------Expenses Page Logic (Fixed & Perfect)---------------------------------------------
function addExpense() {
    const nameInput = document.getElementById("expenseName");
    const amountInput = document.getElementById("expenseAmount");
    
    if (!nameInput || !amountInput) return;

    const itemName = nameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (itemName === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid item name and amount, Astha!");
        return;
    }

    let expenses = JSON.parse(localStorage.getItem('prismExpenses')) || [];
    expenses.push({ name: itemName, amount: amount });
    localStorage.setItem('prismExpenses', JSON.stringify(expenses));

    nameInput.value = "";
    amountInput.value = "";
    renderExpenses();
}

function renderExpenses() {
    const listContainer = document.getElementById("expenseList");
    const totalDisplay = document.getElementById("totalSpentDisplay");
    
    if (!listContainer) return;

    let expenses = JSON.parse(localStorage.getItem('prismExpenses')) || [];
    let total = 0;
    listContainer.innerHTML = "";
    
    // Scrollable container styling taaki bohot saare items hone par scroll ho sake
    listContainer.style.maxHeight = "220px";
    listContainer.style.overflowY = "auto";
    listContainer.style.paddingRight = "4px";

    expenses.forEach((exp, index) => {
        total += Number(exp.amount);
        
        const row = document.createElement("div");
        // Sabhi styling inline kar di hai taaki text aur card bilkul clear dikhein
        row.style.marginBottom = "8px";
        row.style.padding = "12px 16px";
        row.style.background = "rgba(255, 255, 255, 0.08)";
        row.style.border = "1px solid rgba(255, 255, 255, 0.15)";
        row.style.borderRadius = "12px";
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        
        row.innerHTML = `
            <span style="color: #ffffff; font-weight: 500; font-size: 1rem;">${exp.name}</span>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-weight: 600; color: #bca5ff; font-size: 1.05rem;">₹${exp.amount}</span>
                <button onclick="deleteExpense(${index})" title="Delete Expense" style="background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-trash" style="color: #ffffff !important; font-size: 14px;"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(row);
    });
    
    if (totalDisplay) {
        totalDisplay.innerText = `₹${total}`;
    }
}

function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('prismExpenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('prismExpenses', JSON.stringify(expenses));
    renderExpenses();
}


// Calculator Page Logic
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("calculator.html")) {
        const display = document.getElementById("display");
        const calcButtonsContainer = document.querySelector(".calc-buttons");
        let calcInputString = "";

        if (calcButtonsContainer && display) {
            calcButtonsContainer.addEventListener("click", (e) => {
                if (e.target.tagName !== "BUTTON") return;
                
                const val = e.target.innerText.trim();

                if (val === 'C') {
                    calcInputString = "";
                    display.innerText = "0";
                } else if (val === '=') {
                    try {
                        if (calcInputString !== "") {
                            let result = eval(calcInputString.replace(/[^0-9+\-*/.]/g, ''));
                            display.innerText = result;
                            saveCalc(calcInputString, result);
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


// Search bar functionality
const searchInput = document.querySelector('#search-input'); 
const searchResultsContainer = document.querySelector('#search-results'); 

if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        
        if (!query) {
            if (searchResultsContainer) searchResultsContainer.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/search?q=${query}`);
            const data = await response.json();

            if (searchResultsContainer) {
                searchResultsContainer.innerHTML = data.map(item => `
                    <div class="search-item">
                        <span>${item.title}</span>
                        <small>(${item.type})</small>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error("Search error:", err);
        }
    });
}

function toggleCalcHistory() {
    const overlay = document.getElementById('calcHistoryOverlay');
    if (overlay) {
        if (overlay.style.display === 'flex') {
            overlay.style.display = 'none';
        } else {
            overlay.style.display = 'flex';
            renderCalcHistory();
        }
    }
}

function clearCalcHistory() {
    if (confirm("Clear all history, Astha?")) {
        localStorage.removeItem('prismCalcHistory');
        renderCalcHistory();
    }
}