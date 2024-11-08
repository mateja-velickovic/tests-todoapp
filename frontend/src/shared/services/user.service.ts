import type { LoginForm, User } from '../interfaces/index';

const BASE_URL = '/api/user';

// create new user
export async function createUser(userForm: LoginForm) {
  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    body: JSON.stringify(userForm),
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

// delete current user
export async function deleteUser() {
  const response = await fetch(`${BASE_URL}/delete`, {
    method: 'DELETE',
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

// update current user
export async function updateCurrentUser(userForm: User) {
  const response = await fetch(`${BASE_URL}/edit`, {
    method: 'PATCH',
    body: JSON.stringify(userForm),
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

// get current user
export async function fetchCurrentUser(): Promise<User | null> {
  const response = await fetch(BASE_URL);

  if (response.ok) {
    return response.json();
  } else {
    throw await response.json();
  }
}
