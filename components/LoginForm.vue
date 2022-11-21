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
      outer-class="mb-5"
      label-class="block mb-1 font-bold text-sm"
      inner-class="max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500"
      input-class="w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400"
      help-class="text-xs text-gray-500"
    />
    <FormKit
      type="password"
      label="Password"
      v-model="password"
      outer-class="mb-5"
      label-class="block mb-1 font-bold text-sm"
      inner-class="max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500"
      input-class="w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400"
      help-class="text-xs text-gray-500"
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