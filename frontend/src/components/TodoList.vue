<script setup lang="ts">
import { onMounted } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';

import { useTodo } from '@/shared/stores';
import AppSpinner from './AppSpinner.vue';

const todoStore = useTodo();
const { allTodo, loaded } = storeToRefs(todoStore);

onMounted(async () => await todoStore.fetchAllTodo());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleTodoCompleted = async (id: any, completed: boolean) => {
  await todoStore.updateTodo(id, { completed: completed });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteTodoItem = async (id: any) => {
  await todoStore.deleteTodo(id);
};
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h2
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        Mes tâches
      </h2>
      <template v-if="!loaded">
        <AppSpinner />
      </template>
      <template v-else>
        <ul role="list" class="mt-2 flex flex-col list-none">
          <li
            v-for="todo in allTodo"
            :key="todo._id"
            :class="todo.completed ? 'bg-rose-500' : 'bg-green-500'"
            class="w-full flex items-center justify-between p-2 text-sm leading-6 rounded-md border border-gray-400 mb-2"
          >
            <div class="flex w-0 flex-1 items-center">
              <input
                type="checkbox"
                :id="todo._id"
                v-model="todo.completed"
                @change="toggleTodoCompleted(todo._id, todo.completed)"
                class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                <label :for="todo._id" class="m-0">{{ todo.text }}</label>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0">
              <TrashIcon
                data-tooltip-target="tooltip-default"
                class="h-5 w-5 stroke-white hover:stroke-black cursor-pointer"
                @click="deleteTodoItem(todo._id)"
              />
              <div
                id="tooltip-default"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                Supprimer
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          </li>
          <li
            class="flex items-center justify-between py-4 pr-5 text-lg text-white leading-6"
            v-if="todoStore.allTodo && todoStore.allTodo.length === 0"
          >
            Aucune tâche ...
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
