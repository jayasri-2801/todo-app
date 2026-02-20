const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");

const API_URL = "https://todo-backend-f69b.onrender.com/todolist";

// Load tasks when page loads
window.addEventListener("DOMContentLoaded", () => {
    fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
        tasks.forEach(task => {
            createTask(task._id, task.userTask, task.status);
        });
    });
});

// Add Task
add_btn.addEventListener("click", () => {
    const input_value = task_input.value;

    if(input_value === ""){
        alert("Please enter a task!");
        return;
    }

    fetch(API_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ userTask: input_value })
    })
    .then(res => res.json())
    .then(newTask => {
        createTask(newTask._id, newTask.userTask, newTask.status);
        task_input.value = "";
    });
});

function createTask(id, text, status){

    const li = document.createElement("li");

    const comp_btn = document.createElement("button");
    comp_btn.className = "comp-btn";

    const span = document.createElement("span");
    span.className = "tasktext";
    span.textContent = text;

    const del_btn = document.createElement("button");
    del_btn.className = "dlt-btn";
    del_btn.textContent = "Delete";

    if(status){
        comp_btn.classList.add("marked");
        comp_btn.textContent = "✔";
        span.classList.add("taskcomp");
    }

    comp_btn.addEventListener("click", () => {
        fetch(API_URL + "/" + id, {
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ status: !status })
        })
        .then(() => {
            comp_btn.classList.toggle("marked");
            span.classList.toggle("taskcomp");
            comp_btn.textContent = comp_btn.textContent === "✔" ? "" : "✔";
        });
    });

    del_btn.addEventListener("click", () => {
        fetch(API_URL + "/" + id, { method:"DELETE" })
        .then(() => {
            task_list.removeChild(li);
        });
    });

    li.appendChild(comp_btn);
    li.appendChild(span);
    li.appendChild(del_btn);
    task_list.appendChild(li);
}

