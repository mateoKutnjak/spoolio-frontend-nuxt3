<template>
  <div class="card-body gap-8 px-6 py-2">
    <div class="card-title justify-center">Sign In</div>
    <FormKit
      type="form"
      id="login-form"
      :form-class="submitted ? 'hide' : 'show'"
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
            :classes="{
                  input: 'rounded-xl px-2',
                  wrapper: 'shadow-xs rounded-xl',
                  inner: 'rounded-xl',
                  outer: 'rounded-xl mb-3',
                  message: 'px-5 pt-1 mb-0'
                }"
          />
          <FormKit
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
            :classes="{
                  input: 'rounded-xl px-2',
                  wrapper: 'shadow-xs rounded-xl',
                  inner: 'rounded-xl',
                  outer: 'rounded-xl mb-3',
                  message: 'px-5 pt-1 mb-0'
                }"
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
    <div class="divider h-0 p-0 m-0"></div>

    <div
      class="btn btn-outline btn-info border-gray-400 gap-3"
      :class="!isReady ? 'btn-disabled' : ''"
      @click="() => login()"
    >
      <div class="text-gray-700">Log in with Gmail</div>
      <Icon
        name="logos:google-gmail"
        size="25"
      />
    </div>

    <!-- <button :disabled="!isReady" @click="() => login()">Login with Google</button> -->
  </div>
</template>

<script lang="ts" setup>
import { FormKitNode } from "@formkit/core";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "../stores/auth";
import {
  useTokenClient,
  AuthCodeFlowSuccessResponse,
  AuthCodeFlowErrorResponse,
  useOneTap,
  GoogleSignInButton,
  CredentialResponse,
} from "vue3-google-signin";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const submitted = ref(false);
const loading = ref(false);

async function submitHandler(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;
  loading.value = true;

  authStore
    .login(email.value, password.value)
    .then((loginRequestState) => {
      dialogStore.close();
      notificationStore.show("Welcome", ToastLevel.info());
      navigateTo("/");
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

const handleLoginSuccess = (response: CredentialResponse) => {
  const { credential } = response;
  authStore.registerGoogle(credential!); // TODO check null value
};

const handleLoginError = () => {
  console.error("Login failed");
};

const { isReady, login } = useTokenClient({
  onSuccess: handleLoginSuccess,
  onError: handleLoginError,
});
</script>

<style>
</style>