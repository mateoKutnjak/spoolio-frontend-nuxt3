<template>

  <div class="w-full">
    <p>TODO</p>
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