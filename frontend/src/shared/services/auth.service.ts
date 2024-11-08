import router from '@/router';
import type { LoginForm, User } from '../interfaces/index';

const BASE_URL = '/api/auth';

// login user
export async function login(loginForm: LoginForm): Promise<User> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(loginForm),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw await response.json();
  }
}

// logout user
export function logout() {
  document.cookie = 'token=; Max-Age=0';
  router.push({ path: '/login' });
}
