document.addEventListener("DOMContentLoaded", () => {
    const categories = ["food", "water", "workout", "study"];
    const modeToggle = document.getElementById("mode-toggle");
    
    categories.forEach(category => {
        loadTasks(category);
        document.getElementById(`${category}-clear`).addEventListener("click", () => clearAll(category));
        document.getElementById(`${category}-add`).addEventListener("click", () => addTask(category));
    });
    
    modeToggle.addEventListener("click", toggleMode);
    loadMode();
});

function loadTasks(category) {
    const list = document.getElementById(`${category}-list`);
    list.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks.forEach(task => addTaskToUI(category, task));
}

function addTask(category) {
    const input = document.getElementById(`${category}-input`);
    const taskText = input.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    const tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks.push(task);
    localStorage.setItem(category, JSON.stringify(tasks));
    
    addTaskToUI(category, task);
    input.value = "";
}

function updateProgress() {
    let totalTasks = 0;
    let completedTasks = 0;

    ["food", "water", "study", "workout"].forEach(section => {
        const tasks = getTasks(section);
        totalTasks += tasks.length;
        completedTasks += tasks.filter(task => task.completed).length;
    });

    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    document.getElementById("progress-bar").style.width = `${progressPercentage}%`;
    document.getElementById("progress-text").innerText = `${progressPercentage}% Completed`;
}

function addTaskToUI(category, task) {
    const list = document.getElementById(`${category}-list`);
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");
    
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.onclick = () => toggleComplete(category, task.text);
    
    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.onclick = () => editTask(category, task.text);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => deleteTask(category, task.text);
    
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
}

function toggleComplete(category, taskText) {
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.map(task => 
        task.text === taskText ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem(category, JSON.stringify(tasks));
    loadTasks(category);
}

function editTask(category, oldText) {
    const newText = prompt("Edit task:", oldText);
    if (!newText) return;
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.map(task => task.text === oldText ? { ...task, text: newText } : task);
    localStorage.setItem(category, JSON.stringify(tasks));
    loadTasks(category);
}

function deleteTask(category, taskText) {
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem(category, JSON.stringify(tasks));
    loadTasks(category);
}

function clearAll(category) {
    localStorage.removeItem(category);
    loadTasks(category);
}

function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("mode", mode);
}

function loadMode() {
    const mode = localStorage.getItem("mode") || "light";
    if (mode === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function renderChart() {
    const ctx = document.getElementById("progressChart").getContext("2d");
    const sections = ["food", "water", "study", "workout"];
    const completedCounts = sections.map(section => getTasks(section).filter(task => task.completed).length);

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: sections,
            datasets: [{
                label: "Completed Tasks",
                data: completedCounts,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
