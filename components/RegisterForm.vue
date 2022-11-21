<template>

  <FormKit
    type="form"
    id="register-form"
    :form-class="submitted ? 'hide' : 'show'"
    submit-label="Sign In"
    @submit="submitHandler"
    :actions="false"
  >
    <FormKit
      type="text"
      name="username"
      label="Username"
      v-model="username"
    />
    <FormKit
      type="email"
      name="email"
      label="Email"
      v-model="email"
    />
    <FormKit
      type="password"
      name="password"
      label="Password"
      v-model="password"
    />
    <FormKit
      type="password"
      name="confirmPassword"
      label="Confirm password"
      v-model="confirmPassword"
    />
    <FormKit
      type="submit"
      label="Sign Up"
    />
  </FormKit>
</template>

<script lang="ts" setup>
import { useAuthStore } from "../stores/auth";

const store = useAuthStore();

const username = ref<string>(''); // FormKit - cannot be wuthout args - undefined
const email = ref<string>(''); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(''); // FormKit - cannot be wuthout args - undefined
const confirmPassword = ref<string>(''); // FormKit - cannot be wuthout args - undefined

const submitted = ref(false);

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;

  store
    .register(
      username.value,
      email.value,
      password.value,
      confirmPassword.value
    )
    .then((loginRequestState) => {});
};
</script>

<style>
</style>