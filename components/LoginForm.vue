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
const username = ref();
const password = ref();

function submitLoginForm() {
  console.log(username);
  console.log(password);
}
</script>

<style>
</style>

<!-- https://medium.com/@shahriarrahi/create-api-wit -->
<!-- https://github.com/jurassicjs/nuxt3-fullstack-tutorial/tree/main/server/database -->