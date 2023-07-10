<template>
  <div class="flex flex-col gap-8">
    <FormKit
      type="form"
      id="register-form"
      @submit="submitHandler"
      :submit-label="capitalizeOnlyFirstLetter($t('sign_up'))"
      :submit-attrs="{
        inputClass: 'btn-block',
        wrapperClass: 'mt-4',
        ignore: false,
      }"
    >
      <div class="flex flex-col gap-5">
        <div>
          <FormKit
            type="email"
            name="email"
            :placeholder="capitalizeOnlyFirstLetter($t('email'))"
            v-model="email"
            validation="required|email"
            validation-visibility="blur"
          />
          <FormKit
            type="password"
            name="password"
            :placeholder="capitalizeOnlyFirstLetter($t('password'))"
            v-model="password"
            validation="required|length:5,15|matches:/[0-9]/"
            validation-visibility="blur"
          />
          <FormKit
            type="password"
            name="password_confirm"
            :placeholder="capitalizeOnlyFirstLetter($t('confirm_password'))"
            v-model="confirmPassword"
            validation="required|confirm"
            validation-label="Password confirmation"
            validation-visibility="blur"
          />
          <FormKit
            type="text"
            name="invitation_token"
            :placeholder="capitalizeOnlyFirstLetter($t('invitation_token'))"
            v-model="invitationToken"
            validation="required"
            validation-visibility="blur"
            :validation-messages="{
              required: 'Invitation token is required',
            }"
          />
        </div>
        <!-- <FormKit
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('sign_up'))"
          :classes="{
              input: 'btn-block'
            }"
          :input-class="{
            'loading': loading
          }"
        /> -->
      </div>
    </FormKit>

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

const localePath = useLocalePath();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const confirmPassword = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const invitationToken = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const loading = ref(false);

async function submitHandler(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  loading.value = true;

  await authStore
    .register(
      email.value,
      password.value,
      confirmPassword.value,
      invitationToken.value
    )
    .then((loginRequestState) => {
      dialogStore.close();
      navigateTo(localePath("/services/printing"));
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