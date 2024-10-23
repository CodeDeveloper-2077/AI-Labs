class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskSection = document.querySelector('.tasks');
        this.searchInput = document.querySelector('.search input');
        this.init();
    }

    // Initialize the event listeners
    init() {
        this.loadTasks();
        this.handleForm();
        this.handleSearch();
        this.handleTaskActions();
    }

    // Load tasks from local storage and render
    loadTasks() {
        this.draw();
    }

    // Render tasks to the DOM
    draw() {
        this.taskSection.innerHTML = ''; // Clear current task view

        this.tasks.forEach((task, index) => {
            const taskElement = document.createElement('article');
            taskElement.innerHTML = `
                <input type="checkbox" data-index="${index}" ${task.completed ? 'checked' : ''} />
                <span contenteditable="true" class="description" data-index="${index}">${task.description}</span>
                <input type="text" value="${task.date}" onfocus="(this.type='date')" onblur="(this.type='text')" class="date" data-index="${index}">
                <button data-index="${index}" class="delete-btn">Delete</button>
            `;
            this.taskSection.appendChild(taskElement);
        });
    }

    // Highlight search term in the task description
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;  // If no search term, return text as is
        const regex = new RegExp(`(${searchTerm})`, 'gi');  // Create regex for search term
        return text.replace(regex, '<mark>$1</mark>');  // Wrap matched term in <mark> tag
    }

    // Handle the add task form submission
    handleForm() {
        const taskForm = document.querySelector('.task-form form');
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const descriptionInput = document.querySelector('#description');
            const dateInput = document.querySelector('#date');

            this.addTask(descriptionInput.value, dateInput.value);
            descriptionInput.value = '';
            dateInput.value = '';
        });
    }

    // Add a task to the tasks array and re-render
    addTask(description, date) {
        const newTask = {
            description,
            date,
            completed: false,
        };
        this.tasks.push(newTask);
        this.saveTasks();
        this.draw();
    }

    // Delete a task by index and re-render
    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    }

    // Update a task description or date
    updateTask(index, field, value) {
        if (field === 'description') {
            this.tasks[index].description = value;
        } else if (field === 'date') {
            this.tasks[index].date = value;
        }
        this.saveTasks();
        this.draw();
    }

    // Toggle task completion status
    toggleTaskCompletion(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
    }

    // Handle search input for filtering tasks
    handleSearch() {
        this.searchInput.addEventListener('input', () => {
            const searchTerm = this.searchInput.value.toLowerCase();
            const filteredTasks = this.tasks.filter(task =>
                task.description.toLowerCase().includes(searchTerm)
            );
            this.renderFilteredTasks(filteredTasks, searchTerm);
        });
    }

    // Render filtered tasks with highlighted search term
    renderFilteredTasks(tasksToRender, searchTerm) {
        this.taskSection.innerHTML = ''; // Clear tasks section

        tasksToRender.forEach((task, index) => {
            const taskElement = document.createElement('article');
            taskElement.innerHTML = `
                <input type="checkbox" data-index="${index}" ${task.completed ? 'checked' : ''} />
                <span contenteditable="true" class="description" data-index="${index}">
                    ${this.highlightText(task.description, searchTerm)}
                </span>
                <input type="text" value="${task.date}" onfocus="(this.type='date')" onblur="(this.type='text')" class="date" data-index="${index}">
                <button data-index="${index}" class="delete-btn">Delete</button>
            `;
            this.taskSection.appendChild(taskElement);
        });
    }

    // Handle task actions like delete, edit, and complete
    handleTaskActions() {
        this.taskSection.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');

            if (event.target.classList.contains('delete-btn')) {
                this.deleteTask(index);
            }
        });

        this.taskSection.addEventListener('change', (event) => {
            const index = event.target.getAttribute('data-index');

            if (event.target.type === 'checkbox') {
                this.toggleTaskCompletion(index);
            }
        });

        this.taskSection.addEventListener('blur', (event) => {
            const index = event.target.getAttribute('data-index');

            if (event.target.classList.contains('description')) {
                this.updateTask(index, 'description', event.target.textContent);
            } else if (event.target.classList.contains('date')) {
                this.updateTask(index, 'date', event.target.value);
            }
        }, true);
    }

    // Save tasks to local storage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const todo = new Todo();
});
