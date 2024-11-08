import { defineStore } from 'pinia';
import type { LoginForm, User } from '../interfaces';

import router from '@/router';
import {
  createUser,
  fetchCurrentUser,
  updateCurrentUser,
  login,
  logout,
  deleteUser
} from '../services';

interface UserState {
  currentUser: User | null;
  loaded: boolean;
}

export const useUser = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    loaded: false
  }),
  getters: {
    isAuthenticated(state): boolean | null {
      if (state.currentUser) {
        return true;
      } else if (!state.currentUser && state.loaded) {
        return false;
      } else {
        return null;
      }
    }
  },
  actions: {
    async login(loginForm: LoginForm) {
      await login(loginForm).then((user) => {
        this.currentUser = user;
        this.loaded = false;
        router.push({ path: '/' });
      });
    },
    async logout() {
      logout();
      this.currentUser = null;
      router.push({ path: '/login' });
    },
    async createUser(userForm: LoginForm) {
      if (!this.currentUser) {
        await createUser(userForm);
        this.loaded = false;
      }
    },
    async deleteUser() {
      await deleteUser().then(() => {
        document.cookie = 'token=; Max-Age=0';
        router.push({ path: '/login' });
        this.currentUser = null;
        this.loaded = false;
      });
    },
    async updateCurrentUser(userForm: User) {
      if (this.currentUser) {
        this.currentUser = await updateCurrentUser(userForm);
        this.loaded = true;
      }
    },
    async fetchCurrentUser() {
      this.currentUser = await fetchCurrentUser();
      this.loaded = true;
      return this.currentUser;
    }
  },
  persist: {
    storage: sessionStorage,
    pick: ['isAuthenticated', 'currentUser']
  }
});
