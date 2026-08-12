// 1. Data Save Functions
function saveTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('prismTasks')) || [];
    tasks.push(taskText);
    localStorage.setItem('prismTasks', JSON.stringify(tasks));
}

function saveExpense(itemName, amount) {
    let expenses = JSON.parse(localStorage.getItem('prismExpenses')) || [];
    expenses.push({ name: itemName, amount: amount });
    localStorage.setItem('prismExpenses', JSON.stringify(expenses));
}

// Calculator History Save with Date
function saveCalc(input, result) {
    let calcHistory = JSON.parse(localStorage.getItem('prismCalcHistory')) || [];
    
    let today = new Date();
    let dateStr = String(today.getDate()).padStart(2, '0') + '/' + 
                String(today.getMonth() + 1).padStart(2, '0') + '/' + 
                today.getFullYear();

    calcHistory.unshift({ expression: input, answer: result, date: dateStr });
    
    if (calcHistory.length > 20) calcHistory.pop();
    
    localStorage.setItem('prismCalcHistory', JSON.stringify(calcHistory));
}

// 2. Page Load Events
document.addEventListener("DOMContentLoaded", async () => {
    // Database se tasks fetch karke dikhane ka logic
    const taskList = document.getElementById('taskList');
    if (taskList) {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            const tasks = await response.json();
            
            // Saved notes ko localStorage se uthao
            const savedNotes = JSON.parse(localStorage.getItem('prismTaskNotes')) || {};
            
            taskList.innerHTML = "";
            tasks.forEach(task => {
                const userNote = savedNotes[task.title] || ""; // Saved note fetch karna
                
                const li = document.createElement('li');
                li.className = 'task-item-container';
                li.setAttribute('data-id', task.id); // Database ki real ID yahan set ho rahi hai
                li.innerHTML = `
                    <div class="task-header">
                        <span class="task-text">${task.title}</span>
                        <div class="task-actions">
                            <button class="btn-action btn-edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-action btn-note" onclick="toggleNote(this)"><i class="fa-solid fa-note-sticky"></i></button>
                            <button class="btn-action btn-del" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="sticky-note-area"><textarea placeholder="✍️ Write notes...">${userNote}</textarea></div>
                `;
                taskList.appendChild(li);
            });
        } catch (err) {
            console.error("Error loading tasks:", err);
        }
    }

    // Calculator History render
    renderCalcHistory();
});

// Database Connected Delete Task Function
async function deleteTask(button) {
    const taskItem = button.closest('.task-item-container');
    const taskId = taskItem.getAttribute('data-id'); // Task ki database ID nikalna
    
    try {
        if (taskId) {
            await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
        }
        
        taskItem.style.opacity = '0';
        taskItem.style.transform = 'translateY(10px)';
        setTimeout(() => {
            taskItem.remove();
        }, 200);
    } catch (err) {
        console.error("Error deleting task:", err);
        alert("Server error while deleting task!");
    }
}

function toggleNote(button) {
    const taskItem = button.closest('.task-item-container');
    const noteArea = taskItem.querySelector('.sticky-note-area');
    const textarea = noteArea.querySelector('textarea');
    
    // Task ka unique text ya ID pakdo taaki pata chale kis task ka note hai
    const taskTitle = taskItem.querySelector('.task-text').innerText;

    // Pehle se agar koi note saved hai toh wo dikhao
    const savedNotes = JSON.parse(localStorage.getItem('prismTaskNotes')) || {};
    if (savedNotes[taskTitle]) {
        textarea.value = savedNotes[taskTitle];
    }

    // Jab bhi user note mein kuch type kare, wo turant save ho jaye
    textarea.oninput = function() {
        savedNotes[taskTitle] = textarea.value;
        localStorage.setItem('prismTaskNotes', JSON.stringify(savedNotes));
    };

    if (noteArea.style.display === 'block') {
        noteArea.style.display = 'none';
    } else {
        noteArea.style.display = 'block';
        textarea.focus();
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

// History render karne ka function
function renderCalcHistory() {
    const calcHistoryContainer = document.getElementById('calcHistoryList');
    if (calcHistoryContainer) {
        let calcHistory = JSON.parse(localStorage.getItem('prismCalcHistory')) || [];
        calcHistoryContainer.innerHTML = ""; 

        if (calcHistory.length === 0) {
            calcHistoryContainer.innerHTML = `<div style="text-align: center; color: rgba(255,255,255,0.4); margin-top: 80px; font-size: 0.9rem;">No history yet</div>`;
            return;
        }

        calcHistory.forEach((item, index) => {
            const card = document.createElement('div');
            card.style.background = "rgba(255, 255, 255, 0.06)";
            card.style.padding = "12px 16px";
            card.style.borderRadius = "12px";
            card.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            card.style.textAlign = "left";
            card.style.position = "relative";
            card.style.marginBottom = "4px";
            
            card.innerHTML = `
                <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">${item.expression}</div>
                <div style="font-size: 1.2rem; font-weight: 600; color: #ffffff; margin: 3px 0;">${item.answer}</div>
                <div style="font-size: 0.7rem; color: rgba(255,255,255,0.4);">${item.date}</div>
                <button onclick="deleteSingleCalc(${index})" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: rgba(255,107,107,0.7); cursor: pointer; font-size: 0.9rem;" title="Delete this"><i class="fa-solid fa-xmark"></i></button>
            `;
            calcHistoryContainer.appendChild(card);
        });
    }
}

// Ek specific history item ko delete karne ka function
function deleteSingleCalc(index) {
    let calcHistory = JSON.parse(localStorage.getItem('prismCalcHistory')) || [];
    calcHistory.splice(index, 1); 
    localStorage.setItem('prismCalcHistory', JSON.stringify(calcHistory));
    renderCalcHistory(); 
}