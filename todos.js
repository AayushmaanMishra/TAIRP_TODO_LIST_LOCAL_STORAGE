'use strict';

const todos = JSON.parse(localStorage.getItem('todos')) || [];
const form = document.getElementById('todos-form');
const ul = document.getElementById('todos-ul');

form.addEventListener('submit', submitForm);
ul.addEventListener('change', checkTodo);
ul.addEventListener('click', removeTodo);

function addTodo(text, completed = false) {
  const id = todos.length;
  todos.push({ id, text, completed });
  createTodoListItem(id, text, completed, true);
  saveTodos();
}

function createTodoListItem(id, text, completed, isNew = false) {
  const li = document.createElement('li');
  if (isNew) {
    li.classList.add('new-todo');
  }
  li.innerHTML = `
    <label>
      <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
      <span class="todo-text" data-id="${id}">${text}</span>
      <button type="button" class="remove-todo-btn"></button>
    </label>`;
  ul.appendChild(li);
  li.addEventListener('animationend', () => li.removeAttribute('class'));
}

function displayTodos() {
  todos.forEach((todo) => createTodoListItem(todo.id, todo.text, todo.completed));
  updateTodosCount();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  updateTodosCount();
}

function submitForm(event) {
  event.preventDefault();
  const todoInput = document.getElementById('add-todo-input');
  const todoText = todoInput.value.trim();
  if (todoText) {
    addTodo(todoText);
    todoInput.value = '';
  }
}

function checkTodo(event) {
  if (event.target.classList.contains('checkbox')) {
    const itemId = event.target.nextElementSibling.dataset.id;
    const todo = todos.find((t) => t.id == itemId);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
    }
  }
}

function removeTodo(event) {
  if (event.target.classList.contains('remove-todo-btn')) {
    const itemId = event.target.previousElementSibling.dataset.id;
    const todoIndex = todos.findIndex((t) => t.id == itemId);
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      saveTodos();
      const li = event.target.parentElement.parentElement;
      li.classList.add('remove-todo');
      li.addEventListener('animationend', () => li.parentElement.removeChild(li));
    }
  }
}

function updateTodosCount() {
  document.querySelector('#todos-count').textContent = todos.length;
}

displayTodos();
