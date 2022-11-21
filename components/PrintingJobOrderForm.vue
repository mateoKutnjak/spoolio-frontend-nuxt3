<template>

  <p>Here you can order a printing job</p>

  <div class="w-full">
    <form
      v-on:submit.prevent="submitLoginForm"
      class="rounded px-8 pt-6 pb-6"
    >
      <p>Below is optional part if user is not logged in</p>
      <br>
      <div
        class="mb-4"
        v-show="!getUser"
      >
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="name"
        >
          Name
        </label>
        <input
          type="text"
          name="username"
          id="user"
          v-model="username"
          placeholder="First and last name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>
      <div
        class="mb-4"
        v-show="!getUser"
      >
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
          class="block bg-white p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
      </div>
      <div
        class="mb-4"
        v-show="!getUser"
      >
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="phone_number"
        >
          Phone number (TODO)
        </label>
        <input
          type=""
          name="phone_number"
          id="phone_number"
          v-model="phoneNumber"
          placeholder="Phone number"
          class="block bg-white p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
      </div>
      <p>Below is REQUIRED part</p>
      <br>
      <div class="mb-4">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Your message</label>
        <textarea
          id="comments"
          rows="4"
          name="comments"
          v-model="comments"
          class="block bg-white p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        ></textarea>

      </div>
      <div class="mb-4">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Files</label>
        <div class="flex items-center justify-center w-full">
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                class="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">STL, GCODE, PNG, JPG (MAX. 800x400px)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
            />
          </label>
        </div>
      </div>

      <div class="flex items-center">
        <button
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          type="submit"
        >
          Request
        </button>
      </div>
    </form>

  </div>
</template>

<script setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const getUser = computed(() => {
  return authStore.getUser;
});
</script>

<style>
</style>