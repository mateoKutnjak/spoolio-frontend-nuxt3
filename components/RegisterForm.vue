<template>

  <div class="w-full">
    <form
      v-on:submit.prevent="submitLoginForm"
      class="bg-white rounded px-8 pt-6 pb-6"
    >
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="user"
          v-model="username"
          placeholder="Username"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="email"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="user"
          v-model="email"
          placeholder="E-mail"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>
      <div class="mb-2">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Password
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          name="password"
          v-model="password"
          autocomplete="on"
        >
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="confirmPassword"
        >
          Confirm password
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="confirmPassword"
          type="confirmPassword"
          placeholder="******************"
          name="confirmPassword"
          v-model="confirmPassword"
          autocomplete="on"
        >
      </div>
      <div class="flex items-center justify-between">
        <button
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>

  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "../stores/auth";

const store = useAuthStore();

const username = ref<string>();
const email = ref<string>();
const password = ref<string>();
const confirmPassword = ref<string>();

function submitLoginForm() {
  store
    .register(
      username.value,
      email.value,
      password.value,
      confirmPassword.value
    )
    .then((loginRequestState) => {
      console.log(loginRequestState);
    });
}
</script>

<style>
</style>