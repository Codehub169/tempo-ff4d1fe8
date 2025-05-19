// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const taskCounter = document.getElementById('task-counter');

    // Application state: array to store todo items
    let todos = [];

    // Load todos from local storage when the page loads
    loadTodos();

    // Event Listeners
    // Add new todo when form is submitted
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        const todoText = todoInput.value.trim(); // Get text from input, remove whitespace
        if (todoText !== '') {
            addTodo(todoText);
            todoInput.value = ''; // Clear input field
            todoInput.focus(); // Set focus back to input field
        }
    });

    // Clear all todos
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            todos = [];
            saveAndRender();
        }
    });

    // Function to add a new todo item
    function addTodo(text) {
        const newTodo = {
            id: Date.now().toString(), // Unique ID based on timestamp
            text: text,
            completed: false
        };
        todos.push(newTodo);
        saveAndRender();
    }

    // Function to toggle the 'completed' status of a todo item
    function toggleComplete(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }

    // Function to delete a todo item
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }

    // Function to update the task counter
    function updateTaskCounter() {
        const incompleteTasks = todos.filter(todo => !todo.completed).length;
        taskCounter.textContent = `${incompleteTasks} task${incompleteTasks !== 1 ? 's' : ''} remaining`;
    }

    // Function to render todo items to the DOM
    function renderTodos() {
        todoList.innerHTML = ''; // Clear existing list items

        if (todos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No tasks yet. Add one above!';
            todoList.appendChild(emptyMessage);
            // Add a style for .empty-message in css if needed for better appearance
            // e.g., .empty-message { text-align: center; color: #7f8c8d; padding: 20px 0; }
        }

        todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.className = 'todo-item';
            if (todo.completed) {
                listItem.classList.add('completed');
            }
            listItem.setAttribute('data-id', todo.id);

            // Task text span
            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = todo.text;
            taskTextSpan.addEventListener('click', () => toggleComplete(todo.id)); // Toggle complete on text click

            // Actions div (for buttons)
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            // Complete button
            const completeButton = document.createElement('button');
            completeButton.className = 'complete-btn';
            completeButton.innerHTML = `<i class="material-icons">${todo.completed ? 'undo' : 'check_circle_outline'}</i>`;
            completeButton.setAttribute('aria-label', todo.completed ? 'Mark as incomplete' : 'Mark as complete');
            completeButton.addEventListener('click', () => toggleComplete(todo.id));

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '<i class="material-icons">delete_outline</i>';
            deleteButton.setAttribute('aria-label', 'Delete task');
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));

            actionsDiv.appendChild(completeButton);
            actionsDiv.appendChild(deleteButton);

            listItem.appendChild(taskTextSpan);
            listItem.appendChild(actionsDiv);

            todoList.appendChild(listItem);
        });
        updateTaskCounter();
    }

    // Function to save todos to local storage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Function to load todos from local storage
    function loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
        }
        renderTodos(); // Initial render after loading
    }

    // Helper function to save and then re-render
    function saveAndRender() {
        saveTodos();
        renderTodos();
    }
});
