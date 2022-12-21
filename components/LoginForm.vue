<template>

  <FormKit
    type="form"
    id="login-form"
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
    />
    <FormKit
      type="password"
      name="password"
      label="Password"
      v-model="password"
    />
    <FormKit
      type="submit"
      label="Sign In"
    />
  </FormKit>

</template>

<script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const dialogStore = useDialogStore();

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const submitted = ref(false);

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;

  authStore.login(email.value, password.value).then((loginRequestState) => {
    dialogStore.close();
  });
};
</script>

<style>
</style>