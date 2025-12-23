// Seleciona os principais elementos do HTML
const todoForm = document.querySelector(".form-control");
const todoInput = document.querySelector("#to-do-input");
const todoEdit = document.querySelector("#edit-form");
const btnCancel = document.querySelector("#cancelBtn");
const editInput = document.querySelector("#edit-input");
const todoList = document.querySelector(".task-container");
const containerEdit = document.querySelector(".edit-container");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-btn");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Função para criar tarefa
function saveTodo(text, done = false, save = true) {
  const divTodo = document.createElement("div");
  divTodo.classList.add("task");

  if (done) divTodo.classList.add("done");

  // Título
  const todoTitle = document.createElement("h4");
  todoTitle.innerText = text;
  divTodo.appendChild(todoTitle);

  // Container de botões
  const taskButtons = document.createElement("div");
  taskButtons.classList.add("task-buttons");

  // Botões
  const finishBtn = document.createElement("button");
  finishBtn.classList.add("finish-to-do");
  finishBtn.innerText = "Finish";

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-to-do");
  editBtn.innerText = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-to-do");
  deleteBtn.innerText = "Remove";

  // Adiciona os botões no container
  taskButtons.appendChild(finishBtn);
  taskButtons.appendChild(editBtn);
  taskButtons.appendChild(deleteBtn);

  // Adiciona container de botões na tarefa
  divTodo.appendChild(taskButtons);

  // Adiciona a tarefa na lista
  todoList.appendChild(divTodo);

  // Limpa input
  todoInput.value = "";
  todoInput.focus();

  // Salva no localStorage
  if (save) saveTodoLocalStorage({ text, done });
}

// Alterna entre modo edição e adicionar
function toggleTodo() {
  containerEdit.classList.toggle("hide");
  todoList.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoInput.focus();
}

// Atualiza tarefa editada
function updatedTodo(text) {
  const todos = document.querySelectorAll(".task");
  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h4");
    if (todoTitle.innerText.trim() === oldInputValue.trim()) {
      todoTitle.innerText = text;
      updateTodoTextLocalStorage(oldInputValue, text);
    }
  });
}

// Filtra tarefas por busca
function getSearchInput(search) {
  const todos = document.querySelectorAll(".task");
  const normalizedSearch = search.toLowerCase();
  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h4").innerText.toLowerCase();
    todo.style.display = todoTitle.includes(normalizedSearch) ? "flex" : "none";
  });
}

// Filtra tarefas por status
function filterInput(filterValue) {
  const todos = document.querySelectorAll(".task");
  todos.forEach((todo) => {
    switch (filterValue) {
      case "all":
        todo.style.display = "flex";
        break;
      case "done":
        todo.style.display = todo.classList.contains("done") ? "flex" : "none";
        break;
      case "to-do":
        todo.style.display = !todo.classList.contains("done") ? "flex" : "none";
        break;
    }
  });
}

// Eventos

// Adicionar tarefa
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value.trim();
  if (inputValue) saveTodo(inputValue);
});

// Clique nos botões das tarefas
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest(".task");
  if (!parentEl) return;

  const todoTitle = parentEl.querySelector("h4").innerText;

  // Finish
  if (targetEl.classList.contains("finish-to-do")) {
    parentEl.classList.toggle("done");
    updatedTodoLocalStorage(todoTitle);
  }

  // Delete
  if (targetEl.classList.contains("delete-to-do")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }

  // Edit
  if (targetEl.classList.contains("edit-to-do")) {
    toggleTodo();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

// Cancelar edição
btnCancel.addEventListener("click", (e) => {
  e.preventDefault();
  toggleTodo();
});

// Salvar edição
todoEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value.trim();
  if (editInputValue) updatedTodo(editInputValue);
  toggleTodo();
});

// Busca ao digitar
searchInput.addEventListener("keyup", (e) => getSearchInput(e.target.value));

// Apagar busca
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

// Filtro de tarefas
filterBtn.addEventListener("change", (e) => filterInput(e.target.value));

// LocalStorage

function getTodosLocalStorage() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function loadTodo() {
  const todos = getTodosLocalStorage();
  todos.forEach((todo) => saveTodo(todo.text, todo.done, false));
}

function saveTodoLocalStorage(todo) {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodoLocalStorage(todoText) {
  const todos = getTodosLocalStorage();
  const filtered = todos.filter((t) => t.text.trim() !== todoText.trim());
  localStorage.setItem("todos", JSON.stringify(filtered));
}

function updatedTodoLocalStorage(todoText) {
  const todos = getTodosLocalStorage();
  todos.forEach((t) => {
    if (t.text.trim() === todoText.trim()) t.done = !t.done;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodoTextLocalStorage(oldText, newText) {
  const todos = getTodosLocalStorage();
  todos.forEach((t) => {
    if (t.text.trim() === oldText.trim()) t.text = newText;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Limpa tarefas inválidas
function cleanInvalidTodos() {
  let todos = getTodosLocalStorage();
  todos = todos.filter(
    (t) => t.text?.trim() && t.text.toLowerCase() !== "undefined"
  );
  const uniqueTexts = new Set();
  const validTodos = todos.filter((t) => {
    if (uniqueTexts.has(t.text.trim())) return false;
    uniqueTexts.add(t.text.trim());
    return true;
  });
  localStorage.setItem("todos", JSON.stringify(validTodos));
}

// Inicialização
cleanInvalidTodos();
loadTodo();
