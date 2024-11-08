import type { Todo, TodoForm, TodoUpdateForm } from '../interfaces/index';

const BASE_URL = '/api/todo';

// create todo
export async function createTodo(todoForm: TodoForm) {
  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    body: JSON.stringify(todoForm),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    throw await response.json();
  }
}

// update todo
export async function updateTodo(id: string, todoForm: TodoUpdateForm) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(todoForm),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    throw await response.json();
  }
}

// delete todo
export async function deleteTodo(id: string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    throw await response.json();
  }
}

// get all todos
export async function fetchAllTodo(): Promise<Todo[] | null> {
  const response = await fetch(BASE_URL);
  if (response.ok) {
    return response.json();
  } else {
    throw await response.json();
  }
}
