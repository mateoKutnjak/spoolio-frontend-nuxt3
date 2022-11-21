<template>

  <FormKit
    type="form"
    id="registration-example"
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
import { useAuthStore } from "../stores/auth";

const store = useAuthStore();

const username = ref<string>("");
const password = ref<string>("");

const submitted = ref(false);

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;

  console.log(username);
  console.log(password);

  store.login(username.value, password.value).then((loginRequestState) => {});
};
</script>

<style>
</style>