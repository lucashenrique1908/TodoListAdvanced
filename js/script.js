// Inputs
const addInput = document.querySelector("#add");
const searchInput = document.querySelector("#search");
const editInput = document.querySelector("#edit");

// Botões
const editCompletedBtn = document.querySelector(".edit-completed-btn");
const addBtn = document.querySelector(".add-button");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterBtn = document.querySelector("#filter");

// Containers
const editContainer = document.querySelector(".edit-and-filter-container");
const addContainer = document.querySelector(".add-container");
const filterContainer = document.querySelector(".filter-container");
const tasksContainer = document.querySelector(".tasks-container");
const searchContainer = document.querySelector(".search-container");

let taskBeingEdited = null;

// Função para criar tarefas
const saveTask = (text, conclused = false, save = true, id = null) => {
  const taskHeader = document.createElement("div");
  taskHeader.classList.add("task-list");
  taskHeader.dataset.id = id ?? Date.now();

  if (conclused) taskHeader.classList.add("conclused");

  const todoTitle = document.createElement("p");
  todoTitle.classList.add("task");
  todoTitle.innerText = text;
  taskHeader.appendChild(todoTitle);

  const actionBtn = document.createElement("div");
  actionBtn.classList.add("action-button");
  taskHeader.appendChild(actionBtn);

  const conclusedBtn = document.createElement("button");
  conclusedBtn.classList.add("done-button");
  conclusedBtn.innerText = "Concluída";
  actionBtn.appendChild(conclusedBtn);

  const editTaskBtn = document.createElement("button");
  editTaskBtn.classList.add("edit-button");
  editTaskBtn.innerText = "Editar";
  actionBtn.appendChild(editTaskBtn);

  const removeTaskBtn = document.createElement("button");
  removeTaskBtn.classList.add("remove-button");
  removeTaskBtn.innerText = "Remover";
  actionBtn.appendChild(removeTaskBtn);

  if (save) {
    saveTodoLocalStorage({
      id: Number(taskHeader.dataset.id),
      text,
      conclused: taskHeader.classList.contains("conclused"),
    });
  }

  tasksContainer.appendChild(taskHeader);
};

// Mostrar / esconder formulário de edição
const toggleForms = (showEdit = false) => {
  addContainer.classList.toggle("hide", showEdit);
  tasksContainer.classList.toggle("hide", showEdit);
  filterContainer.classList.toggle("hide", showEdit);
  searchContainer.classList.toggle("hide", showEdit);
  editContainer.classList.toggle("hide", !showEdit);
};

// Marcar tarefa como concluída e atualizar LocalStorage
function toggleTaskDone(taskEl) {
  taskEl.classList.toggle("conclused");

  const id = Number(taskEl.dataset.id);
  const todos = getTodoLocalStorage();

  const updatedTodos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, conclused: taskEl.classList.contains("conclused") };
    }
    return todo;
  });

  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

// Remover tarefa da tela
function removeTask(taskEl) {
  taskEl.remove();
}

// Editar tarefa
function editTask(taskEl) {
  taskBeingEdited = taskEl;
  editInput.value = taskEl.querySelector(".task").innerText;
  toggleForms(true);
}

// Filtrar tarefas
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".task-list");
  todos.forEach((todo) => {
    switch (filterValue) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        todo.style.display = todo.classList.contains("conclused")
          ? "flex"
          : "none";
        break;
      case "in-progress":
        todo.style.display = !todo.classList.contains("conclused")
          ? "flex"
          : "none";
        break;
    }
  });
};

// Eventos
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newTask = addInput.value.trim();
  if (newTask) saveTask(newTask, false, true);
  addInput.value = "";
  addInput.focus();
});

document.addEventListener("click", (e) => {
  const target = e.target;
  const taskEl = target.closest(".task-list");
  if (!taskEl) return;

  if (target.classList.contains("done-button")) toggleTaskDone(taskEl);

  if (target.classList.contains("remove-button")) {
    const id = Number(taskEl.dataset.id);
    removeTask(taskEl);
    removeTaskLocalStorage(id);
  }

  if (target.classList.contains("edit-button")) editTask(taskEl);
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms(false);
});

editCompletedBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const newText = editInput.value.trim();
  if (newText && taskBeingEdited) {
    taskBeingEdited.querySelector(".task").innerText = newText;

    // Atualizar LocalStorage
    const id = Number(taskBeingEdited.dataset.id);
    const todos = getTodoLocalStorage();
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    taskBeingEdited = null;
    toggleForms(false);
  }
});

filterBtn.addEventListener("change", (e) => filterTodos(e.target.value));

// LocalStorage
const getTodoLocalStorage = () =>
  JSON.parse(localStorage.getItem("todos")) || [];

const saveTodoLocalStorage = (todo) => {
  const todos = getTodoLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTaskLocalStorage = (id) => {
  const todos = getTodoLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const loadTodos = () => {
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => saveTask(todo.text, todo.conclused, false, todo.id));
};
  
loadTodos();
