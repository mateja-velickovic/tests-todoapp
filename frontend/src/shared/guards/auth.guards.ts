import { useUser } from '../stores';

export function isAuthenticatedGuard() {
  const userStore = useUser();
  if (!userStore.isAuthenticated) {
    return '/login';
  }
}

export function isNotAuthenticatedGuard() {
  const userStore = useUser();
  if (userStore.isAuthenticated) {
    return '/';
  }
}
