<template>
  <div class="card-body gap-8 px-6 py-2">
    <FormKit
      type="form"
      id="login-form"
      submit-label="Sign In"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="flex flex-col gap-5">
        <div>
          <FormKit
            type="email"
            name="email"
            placeholder="E-mail"
            v-model="email"
          />
          <FormKit
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
          />
        </div>
        <FormKit
          type="submit"
          label="Sign In"
          :classes="{
              input: 'btn-block',
            }"
          :input-class="{
            'loading': loading
          }"
        />
      </div>
    </FormKit>
    <!-- <GoogleAuthButton /> -->
    <!-- <GoogleSignInButton
      @success="handleLoginSuccess"
      @error="handleLoginError"
    ></GoogleSignInButton> -->
  </div>
</template>

<script lang="ts" setup>
import { FormKitNode } from "@formkit/core";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "../stores/auth";

import { GoogleSignInButton, CredentialResponse } from "vue3-google-signin";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const loading = ref(false);

async function submitHandler(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  loading.value = true;

  authStore
    .login(email.value, password.value)
    .then((loginRequestState) => {
      dialogStore.close();
      navigateTo("/services");
    })
    .catch((err) => {
      notificationStore.showFetchError(err);
      node?.setErrors(
        err?.data?.non_field_errors || ["Error occurred. Please try again."],
        err?.data
      );
    })
    .finally(() => (loading.value = false));
}

// handle success event
const handleLoginSuccess = (response: CredentialResponse) => {
  const { credential } = response;
  authStore.registerGoogle(credential!); // TODO check null value
  console.log("Access Token", credential);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
</script>

<style>
</style>