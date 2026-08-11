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

function saveCalc(input, result) {
    let calcHistory = JSON.parse(localStorage.getItem('prismCalcHistory')) || [];
    calcHistory.push(`${input} = ${result}`);
    localStorage.setItem('prismCalcHistory', JSON.stringify(calcHistory));
}

// 2. Page Load hote hi sab kuch wapas dikhane ka logic
document.addEventListener("DOMContentLoaded", () => {
    // Tasks dikhao
    const taskList = document.getElementById('taskList');
    if (taskList) {
        let tasks = JSON.parse(localStorage.getItem('prismTasks')) || [];
        tasks.forEach(taskText => {
            const li = document.createElement('li');
            li.className = 'task-item-container';
            li.innerHTML = `
                <div class="task-header">
                    <span class="task-text">${taskText}</span>
                    <div class="task-actions">
                        <button class="btn-action btn-edit" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-action btn-note" onclick="toggleNote(this)"><i class="fa-solid fa-note-sticky"></i></button>
                        <button class="btn-action btn-del" onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="sticky-note-area"><textarea placeholder="✍️ Write notes..."></textarea></div>
            `;
            taskList.appendChild(li);
        });
    }

    // For Calculator History 
    const calcHistoryContainer = document.getElementById('calcHistoryList'); // Agar tumne koi list banayi ho
    if (calcHistoryContainer) {
        let calcHistory = JSON.parse(localStorage.getItem('prismCalcHistory')) || [];
        calcHistory.forEach(item => {
            const p = document.createElement('p');
            p.innerText = item;
            calcHistoryContainer.appendChild(p);
        });
    }
});
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

// History render karne ka function (With Stylish Cards + Specific Delete Button )
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
                <!-- Specific item delete karne ke liye chota sa delete button -->
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

// Page load hone par history will get load 
document.addEventListener("DOMContentLoaded", () => {
    renderCalcHistory();
});