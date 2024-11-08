import { defineStore } from 'pinia';
import type { Todo, TodoForm, TodoUpdateForm } from '../interfaces';
import { createTodo, deleteTodo, fetchAllTodo, updateTodo } from '../services';

interface TodoState {
  allTodo: Todo[] | null;
  loaded: boolean | false;
}

export const useTodo = defineStore('todo', {
  state: (): TodoState => ({
    allTodo: null,
    loaded: false
  }),
  actions: {
    async createTodo(todoForm: TodoForm) {
      await createTodo(todoForm).then(() => {
        this.fetchAllTodo();
      });
    },
    async updateTodo(id: string, todoForm: TodoUpdateForm) {
      await updateTodo(id, todoForm).then(() => {
        this.fetchAllTodo();
      });
    },
    async deleteTodo(id: string) {
      await deleteTodo(id).then(() => {
        this.fetchAllTodo();
      });
    },
    async fetchAllTodo() {
      this.allTodo = await fetchAllTodo();
      this.loaded = true;
    }
  }
});
