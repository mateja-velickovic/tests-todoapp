<script setup lang="ts">
import * as Yup from 'yup';
import { Form } from 'vee-validate';
import { ref } from 'vue';

import type { TodoForm } from '@/shared/interfaces';
import { useTodo } from '@/shared/stores';
import FormInput from '@/components/forms/FormInput.vue';

const todoStore = useTodo();
const text = ref('');
const errorMsg = ref('');

// form validation rules
const schema = Yup.object().shape({
  text: Yup.string().required('Vous devez renseigner ce champ')
});

const onSubmit = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValue: Record<string, any>,
  { resetForm }: { resetForm: () => void }
) => {
  try {
    await todoStore.createTodo(formValue as TodoForm).then(() => {
      errorMsg.value = '';
      resetForm();
    });
  } catch (e) {
    errorMsg.value = e as string;
  }
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
        Ajouter une tâche
      </h2>
      <p v-if="errorMsg">
        <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span class="inline w-3 h-3 me-3 bg-red-500 rounded-full"></span>
          {{ errorMsg }}</span
        >
      </p>
      <Form class="space-y-4 md:space-y-6" @submit="onSubmit" :validation-schema="schema">
        <div>
          <FormInput name="text" :value="text" type="text" label="" />
        </div>
        <button
          type="submit"
          class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Ajouter
        </button>
      </Form>
    </div>
  </div>
</template>

<style scoped></style>
