<script setup lang="ts">
import * as Yup from 'yup';
import { Form } from 'vee-validate';
import { computed, ref } from 'vue';

import router from '@/router';
import type { User } from '@/shared/interfaces';
import { useUser } from '@/shared/stores';
import FormInput from '@/components/forms/FormInput.vue';

const userStore = useUser();
const { currentUser } = userStore;
const loading = ref(false);

const schema = Yup.object().shape({
  name: Yup.string().required('Vous devez renseigner ce champ')
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (formData: Record<string, any>) => {
  try {
    loading.value = true;
    await userStore.updateCurrentUser(formData as User).then(() => {
      loading.value = false;
    });
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

const onDelete = async () => {
  try {
    await userStore.deleteUser().then(() => {
      router.push('/register');
    });
  } catch (e) {
    console.log(e);
  }
};

const name = computed(() => currentUser?.name);
const address = computed(() => currentUser?.address);
const zip = computed(() => currentUser?.zip);
const location = computed(() => currentUser?.location);
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        Mon Profile
      </h1>
      <p class="text-left mt-2 text-lg text-gray-400">{{ currentUser?.email }}</p>
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        class="space-y-4 md:space-y-6 grid grid-col gap-x-4 sm:grid-cols-4"
      >
        <div class="col-span-4">
          <FormInput name="name" :value="name" type="text" label="Votre nom" />
        </div>
        <div class="col-span-4">
          <FormInput name="address" :value="address" type="text" label="Adresse" />
        </div>
        <div class="col-span col-start-1">
          <FormInput name="zip" :value="zip" type="text" label="NPA" />
        </div>
        <div class="col-span-3">
          <FormInput name="location" :value="location" type="text" label="Lieu" />
        </div>
        <div class="col-span-4">
          <button
            type="submit"
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Modifier
          </button>
          <div class="or"><span>ou</span></div>
          <p class="text-center text-sm text-gray-500">
            <a
              @click="onDelete"
              href="#"
              class="font-semibold leading-6 text-rose-500 hover:text-rose-400"
              >Supprimer votre compte</a
            >
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped></style>
