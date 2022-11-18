<template>
  <form v-on:submit.prevent="submitLoginForm">
    <div class="form-group">
      <input
        type="text"
        name="username"
        id="user"
        v-model="username"
        class="form-control"
        placeholder="Username"
      >
    </div>
    <div class="form-group">
      <input
        type="password"
        name="password"
        id="pass"
        v-model="password"
        class="form-control"
        placeholder="Password"
        autocomplete="on"
      >
    </div>
    <button
      type="submit"
      class="btn btn-lg btn-primary btn-block"
    >Login</button>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from "../stores/auth";

const store = useAuthStore();

const username = ref<string>();
const password = ref<string>();

function submitLoginForm() {
  store.login({ username: username.value, password: password.value });
}
</script>

<style>
</style>

<!-- https://medium.com/@shahriarrahi/create-api-wit -->
<!-- https://github.com/jurassicjs/nuxt3-fullstack-tutorial/tree/main/server/database -->