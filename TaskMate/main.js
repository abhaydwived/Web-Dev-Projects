document.addEventListener("DOMContentLoaded", () => {
    const categories = ["food", "water", "workout", "study"];
    loadMode();
    
    categories.forEach(category => {
        loadTasks(category);
        document.getElementById(`${category}-clear`).addEventListener("click", () => clearAll(category));
        document.getElementById(`${category}-add`).addEventListener("click", () => addTask(category));
    });
});
document.addEventListener("DOMContentLoaded", () => {
    loadMode(); 
    document.getElementById("theme").addEventListener("click", toggleMode);
});


function loadTasks(category) {
    let list = document.getElementById(`${category}-list`);
    list.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks.forEach(task => addTaskToUI(category, task));
}

function addTask(category) {
    let input = document.getElementById(`${category}-input`);
    let taskText = input.value.trim();
    if (!taskText) return;

    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem(category, JSON.stringify(tasks));

    addTaskToUI(category, { text: taskText, completed: false });
    input.value = "";
}

function addTaskToUI(category, task) {
    let list = document.getElementById(`${category}-list`);
    let li = document.createElement("li");
    li.textContent = task.text;

    if (task.completed) {
        let completedText = document.createElement("span");
        completedText.textContent = " ✅ Completed";
        completedText.style.color = "green";
        li.appendChild(completedText);
    } else {
        addTaskButtons(li, category, task.text);
    }

    list.appendChild(li);
}

function addTaskButtons(li, category, taskText) {
    let completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.onclick = () => toggleComplete(category, taskText);

    let editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.onclick = () => editTask(category, taskText);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => deleteTask(category, taskText);

    li.append(completeBtn, editBtn, deleteBtn);
}

function toggleComplete(category, taskText) {
    let tasks = JSON.parse(localStorage.getItem(category)) || [];
    tasks = tasks.map(task => task.text === taskText ? { ...task, completed: true } : task);
    localStorage.setItem(category, JSON.stringify(tasks));
    loadTasks(category);
}

function editTask(category, oldText) {
    let listItems = document.querySelectorAll(`#${category}-list li`);

    listItems.forEach(li => {
        if (li.childNodes[0].nodeValue.trim() === oldText) {
            let input = document.createElement("input");
            input.type = "text";
            input.value = oldText;
            input.classList.add("edit-input");

            li.replaceChild(input, li.childNodes[0]);
            input.focus();

            input.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    let newText = input.value.trim();
                    if (!newText) return;

                    let tasks = JSON.parse(localStorage.getItem(category)) || [];
                    tasks = tasks.map(task => task.text === oldText ? { ...task, text: newText } : task);
                    localStorage.setItem(category, JSON.stringify(tasks));

                    li.innerHTML = `${newText} `;
                    addTaskButtons(li, category, newText);
                }
            });

            input.addEventListener("blur", function () {
                li.innerHTML = `${oldText} `;
                addTaskButtons(li, category, oldText);
            });
        }
    });
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
    localStorage.setItem("mode", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function loadMode() {
    if (localStorage.getItem("mode") === "dark") {
        document.body.classList.add("dark-mode");
    }
}
