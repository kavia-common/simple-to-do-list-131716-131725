import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App is the main React component for the To-Do application.
 * It renders a centered card with:
 * - an input to add tasks,
 * - a list of tasks,
 * - actions to mark complete and delete.
 * 
 * State is stored in localStorage to persist between reloads.
 */
function App() {
  // Theme based on requirements: light minimalistic
  const [theme] = useState('light');

  // To-do list state
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [newTask, setNewTask] = useState('');

  // Persist to-dos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch {
      // noop if storage not available
    }
  }, [todos]);

  // Apply theme attribute for CSS variables (kept for extensibility)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Derived counts
  const remainingCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  // PUBLIC_INTERFACE
  const handleAdd = () => {
    /**
     * Add a new to-do item if input is not empty.
     */
    const text = newTask.trim();
    if (!text) return;
    const todo = {
      id: cryptoRandomId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos(prev => [todo, ...prev]);
    setNewTask('');
  };

  // PUBLIC_INTERFACE
  const handleToggleComplete = (id) => {
    /**
     * Toggle completion state of a to-do item.
     */
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // PUBLIC_INTERFACE
  const handleDelete = (id) => {
    /**
     * Delete a to-do item by id.
     */
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // PUBLIC_INTERFACE
  const handleKeyDown = (e) => {
    /**
     * Add item on Enter key press.
     */
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="todo-app">
      <div className="todo-card" role="region" aria-label="To-do list card">
        <h1 className="title">To‑Do List</h1>

        <div className="input-row">
          <input
            type="text"
            className="task-input"
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Task name"
          />
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            aria-label="Add task"
            disabled={!newTask.trim()}
            title="Add task"
          >
            Add
          </button>
        </div>

        <div className="list-section">
          {todos.length === 0 ? (
            <div className="empty-state" aria-live="polite">
              Your list is empty. Add your first task!
            </div>
          ) : (
            <ul className="task-list" aria-live="polite">
              {todos.map(todo => (
                <li key={todo.id} className={`task-item ${todo.completed ? 'completed' : ''}`}>
                  <button
                    className={`complete-toggle ${todo.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleComplete(todo.id)}
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed ? '✓' : ''}
                  </button>
                  <span className="task-text">{todo.text}</span>
                  <button
                    className="btn btn-accent btn-delete"
                    onClick={() => handleDelete(todo.id)}
                    aria-label="Delete task"
                    title="Delete task"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="footer-row">
          <span className="muted">{remainingCount} remaining</span>
          {todos.length > 0 && (
            <button
              className="link-clear"
              onClick={() => setTodos([])}
              aria-label="Clear all tasks"
              title="Clear all tasks"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * cryptoRandomId
 * Generate a short random id using crypto if available, fallback to Math.random.
 */
function cryptoRandomId() {
  try {
    const arr = new Uint8Array(6);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return Math.random().toString(16).slice(2, 10);
  }
}

export default App;
