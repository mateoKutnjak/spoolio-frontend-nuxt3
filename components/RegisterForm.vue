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
      type="email"
      name="email"
      label="Email"
      v-model="email"
      validation="required|email"
      validation-visibility="blur"
    />
    <FormKit
      type="password"
      name="password"
      label="Password"
      v-model="password"
      validation="required|length:5,15|matches:/[0-9]/"
      validation-visibility="blur"
    />
    <FormKit
      type="password"
      name="password_confirm"
      label="Confirm password"
      v-model="confirmPassword"
      validation="required|confirm"
      validation-label="Password confirmation"
      validation-visibility="blur"
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

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const confirmPassword = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const submitted = ref(false);

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;

  store
    .register(email.value, password.value, confirmPassword.value)
    .then((loginRequestState) => {});
};
</script>

<style>
</style>