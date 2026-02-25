const API_URL = "https://todo-app-back-2awt.onrender.com/todolist";
const COUNT_URL = "https://todo-app-back-2awt.onrender.com/counts";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

window.addEventListener("DOMContentLoaded", () => {

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            taskList.innerHTML = "";
            data.forEach(task => {
                createTask(task._id, task.userTask, task.status);
            });
            loadCounts();
        })
        .catch(err => console.log(err));

});


function loadCounts() {
    fetch(COUNT_URL)
        .then(res => res.json())
        .then(data => {
            taskCount.innerText =
                `Total: ${data.total} | Completed: ${data.completed}`;
        })
        .catch(err => console.log(err));
}

function createTask(id, text, status) {

    const li = document.createElement("li");

    const leftDiv = document.createElement("div");
    leftDiv.style.display = "flex";
    leftDiv.style.alignItems = "center";

    const checkBtn = document.createElement("div");
    checkBtn.classList.add("checkBtn");

    const span = document.createElement("span");
    span.innerText = text;
    span.style.marginLeft = "10px";

    if (status) {
        checkBtn.classList.add("completedCircle");
        span.classList.add("completed");
    }

    checkBtn.addEventListener("click", () => {

        const newStatus = !span.classList.contains("completed");

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        })
        .then(() => loadCounts());

        checkBtn.classList.toggle("completedCircle");
        span.classList.toggle("completed");
    });

    leftDiv.appendChild(checkBtn);
    leftDiv.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("deleteBtn");

    deleteBtn.addEventListener("click", () => {

        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => loadCounts());

        li.remove();
    });

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userTask: text })
    })
    .then(res => res.json())
    .then(newTask => {
        createTask(newTask._id, newTask.userTask, newTask.status);
        taskInput.value = "";
        loadCounts();
    })
    .catch(err => console.log(err));

});


taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addBtn.click();
});