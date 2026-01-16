// Inputs
const addInput = document.querySelector("#add");
const searchInput = document.querySelector("#search");
const editInput = document.querySelector("#edit");

// Botões
const editCompletedBtn = document.querySelector(".edit-completed-btn");
const addBtn = document.querySelector(".add-button");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

// Containers
const editContainer = document.querySelector(".edit-and-filter-container");
const addContainer = document.querySelector(".add-container");
const filterContainer = document.querySelector(".filter-container");
const tasksContainer = document.querySelector(".tasks-container");
const searchContainer = document.querySelector(".search-container");

let oldTaskValue;

const saveTask = (text) => {
  const taskHeader = document.createElement("div");
  taskHeader.classList.add("task-list"); // div principal

  const todoTitle = document.createElement("p");
  todoTitle.classList.add("task");
  todoTitle.innerText = text;
  taskHeader.appendChild(todoTitle);

  const actionBtn = document.createElement("div");
  actionBtn.classList.add("action-button");
  taskHeader.appendChild(actionBtn);

  const conclusedBtn = document.createElement("button");
  conclusedBtn.classList.add("done-button");
  conclusedBtn.innerText = "Concluida";
  actionBtn.appendChild(conclusedBtn);

  const editTask = document.createElement("button");
  editTask.innerText = "Editar";
  editTask.classList.add("edit-button");
  actionBtn.appendChild(editTask);

  const removeTask = document.createElement("button");
  removeTask.innerText = "Remover";
  removeTask.classList.add("remove-button");
  actionBtn.appendChild(removeTask);

  tasksContainer.appendChild(taskHeader);
};

 const toggleForms = (showEdit = false) =>   {

  addContainer.classList.toggle("hide", showEdit);
  tasksContainer.classList.toggle("hide", showEdit);
  filterContainer.classList.toggle("hide", showEdit);
  searchContainer.classList.toggle("hide", showEdit);
  editContainer.classList.toggle("hide", !showEdit);
}

const updatedTodo = (text) => {
  const todos = document.querySelectorAll(".task-list");

  todos.forEach((todo)=> {

    let editInput = todo.querySelector("p")

    if(editInput.innerText === oldTaskValue ) {
        editInput.innerText = text
    }
  })
}

function toggleTaskDone(taskEl) {
  taskEl.classList.toggle("conclused");
}

function removeTask(taskEl) {
  taskEl.remove();
}

function editTask(taskEl) {
  taskBeingEdited = taskEl;
  editInput.value = taskEl.querySelector(".task").innerText;
  toggleForms(true); // mostra só o formulário de edição
}
//eventos

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newTask = addInput.value;

  if (newTask) {
    saveTask(newTask);
  }

  addInput.value = ""
  addInput.focus()
});

document.addEventListener("click", (e) => {
  const target = e.target;
  const taskEl = target.closest(".task-list");

  if (target.classList.contains("done-button") && taskEl) {
    toggleTaskDone(taskEl);
  }

  if (target.classList.contains("remove-button") && taskEl) {
    removeTask(taskEl);
  }

  if (target.classList.contains("edit-button") && taskEl) {
    editTask(taskEl);
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});
editCompletedBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const newText = editInput.value.trim();

  if (newText && taskBeingEdited) {

    taskBeingEdited.querySelector(".task").innerText = newText;

    taskBeingEdited = null;

    toggleForms(false);
  }
});
