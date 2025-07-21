// Seleciona os principais elementos do HTML (formulários, inputs, botões e container de tarefas)
const todoForm = document.querySelector(".form-control"); // formulário de adicionar tarefas
const todoInput = document.querySelector("#to-do-input"); // input onde o usuário digita a nova tarefa
const todoEdit = document.querySelector("#edit-form"); // formulário para editar uma tarefa
const btnCancel = document.querySelector("#cancelBtn"); // botão para cancelar a edição
const editInput = document.querySelector("#edit-input"); // input onde se edita o texto da tarefa
const todoList = document.querySelector(".task-container"); // container onde todas as tarefas são exibidas
const containerEdit = document.querySelector(".edit-container"); // container da área de edição
const searchInput = document.querySelector("#search-input"); // input de busca
const eraseBtn = document.querySelector("#erase-btn"); // botão para apagar a busca
const filterBtn = document.querySelector("#filter-select"); // botão de filtro (todos, feitos, a fazer)

// Variável auxiliar para armazenar o texto antigo da tarefa que será editada
let oldInputValue;


// Funções principais


// Cria uma nova tarefa na tela (e salva no localStorage, se necessário)
function saveTodo(text, done = 0, save = 1) {
  // Cria a div principal da tarefa
  const divTodo = document.createElement("div");
  divTodo.classList.add("task");

  // Cria o título da tarefa (elemento <h4>) com o texto digitado
  const todoTitle = document.createElement("h4");
  todoTitle.innerText = text;
  divTodo.appendChild(todoTitle);

  // Cria o botão de marcar como finalizado
  const finishBtn = document.createElement("button");
  finishBtn.classList.add("finish-to-do");
  finishBtn.innerText = "Finnish";
  divTodo.appendChild(finishBtn);

  // Cria o botão de editar
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-to-do");
  editBtn.innerText = "Edit";
  divTodo.appendChild(editBtn);

  // Cria o botão de remover
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-to-do");
  deleteBtn.innerText = "Remove";
  divTodo.appendChild(deleteBtn);

  // Se a tarefa estiver marcada como concluída, adiciona a classe CSS
  if (done) divTodo.classList.add("done");

  // Se a tarefa deve ser salva no localStorage, chama a função
  if (save) saveTodoLocalStorage({ text, done });

  // Adiciona a tarefa na lista (na interface)
  todoList.appendChild(divTodo);

  // Limpa o input e coloca o foco novamente para digitar outra tarefa
  todoInput.value = "";
  todoInput.focus();
}

// Alterna entre o modo de edição e o modo de adicionar tarefa
function toggleTodo() {
  containerEdit.classList.toggle("hide");
  todoList.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoInput.focus();
}

// Atualiza o texto da tarefa editada na tela e no localStorage
const updatedTodo = (text) => {
  const todos = document.querySelectorAll(".task");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h4");

    if (todoTitle.innerText.trim() === oldInputValue.trim()) {
      todoTitle.innerText = text;
      updateTodoTextLocalStorage(oldInputValue, text);
    }
  });
};

// Filtra as tarefas na tela com base no texto digitado no campo de busca
const getSearchInput = (search) => {
  const todos = document.querySelectorAll(".task");
  const normalizedSearch = search.toLowerCase();

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h4").innerText.toLowerCase();

    if (todoTitle.includes(normalizedSearch)) {
      todo.style.display = "flex"; // mostra a tarefa
    } else {
      todo.style.display = "none"; // esconde a tarefa
    }
  });
};

// Filtra as tarefas com base no status selecionado (todas, feitas ou a fazer)
const filterInput = (filterValue) => {
  const todos = document.querySelectorAll(".task");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;
    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    case "to-do":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    default:
      break;
  }
};


// Eventos


// Evento ao adicionar uma nova tarefa pelo formulário
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value.trim(); // remove espaços extras

  if (inputValue) {
    saveTodo(inputValue);
  }
});

// Evento para todos os botões: finalizar, editar e remover
document.addEventListener("click", (e) => {
  const targetEl = e.target; // botão clicado
  const parentEl = targetEl.closest("div"); // div da tarefa
  let todoTitle;

  if (parentEl && parentEl.querySelector("h4")) {
    todoTitle = parentEl.querySelector("h4").innerText;
  }

  // Marcar como feito/não feito
  if (targetEl.classList.contains("finish-to-do")) {
    parentEl.classList.toggle("done");
    updatedTodoLocalStorage(todoTitle);
  }

  // Remover tarefa
  if (targetEl.classList.contains("delete-to-do")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }

  // Editar tarefa
  if (targetEl.classList.contains("edit-to-do")) {
    toggleTodo();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }

  todoEdit.focus();
});

// Evento para cancelar a edição
btnCancel.addEventListener("click", (e) => {
  e.preventDefault();
  toggleTodo();
});

// Evento para salvar a edição da tarefa
todoEdit.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;

  if (editInputValue) {
    updatedTodo(editInputValue);
  }

  toggleTodo();
});

// Evento para fazer a busca enquanto digita
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchInput(search);
});

// Botão de apagar a busca
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup")); // força a atualização da lista
});

// Evento ao trocar o filtro (todos, feitos, a fazer)
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterInput(filterValue);
});


// Funções com localStorage


// Busca todas as tarefas salvas no localStorage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

// Carrega todas as tarefas salvas assim que a página é carregada
const loadTodo = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0); // não salva de novo
  });
};

// Salva uma nova tarefa no localStorage
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Remove uma tarefa do localStorage
const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter(
    (todo) => todo.text.trim() !== todoText.trim()
  );

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

// Marca tarefa como feita/não feita no localStorage
const updatedTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.text.trim() === todoText.trim()) {
      todo.done = !todo.done;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

// Atualiza o texto de uma tarefa editada no localStorage
const updateTodoTextLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.text.trim() === todoOldText.trim()) {
      todo.text = todoNewText;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

// Remove tarefas inválidas (vazias, duplicadas ou com erro)
const cleanInvalidTodos = () => {
  let todos = getTodosLocalStorage();

  // Remove tarefas com texto vazio ou inválido
  todos = todos.filter((todo) => {
    const text = (todo.text || "").trim();
    return text !== "" && text.toLowerCase() !== "undefined";
  });

  // Remove tarefas duplicadas (mesmo texto)
  const uniqueTexts = new Set();
  const validTodos = todos.filter((todo) => {
    const text = todo.text.trim();
    if (uniqueTexts.has(text)) return false;
    uniqueTexts.add(text);
    return true;
  });

  localStorage.setItem("todos", JSON.stringify(validTodos));
};


// Inicialização


// Limpa tarefas inválidas ao iniciar
cleanInvalidTodos();

// Carrega todas as tarefas ao abrir a página
loadTodo();
