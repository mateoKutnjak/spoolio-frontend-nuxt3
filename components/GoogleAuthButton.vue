<!-- <template>
  <div
    class="btn btn-outline btn-info border-gray-400 gap-3"
    :class="!isReady ? 'btn-disabled' : ''"
    @click="() => login()"
  >
    <div class="text-gray-700">Sign in with Gmail</div>
    <Icon
      name="logos:google-gmail"
      size="25"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "../stores/auth";
import {
  useTokenClient,
  AuthCodeFlowSuccessResponse,
  AuthCodeFlowErrorResponse,
} from "vue3-google-signin";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const handleOnSuccess = (response: AuthCodeFlowSuccessResponse) => {
  console.log("Access Token: ", response.access_token);

  debugger;

  authStore.registerGoogle(response.access_token).catch((err) => {
    notificationStore.show("Login failed: " + err, ToastLevel.error());
    console.error(err);
  });
};

const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
  notificationStore.show("Login failed: " + errorResponse, ToastLevel.error());
  console.error("Google login failed" + errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});
</script>

<style>
</style>
 -->











<script setup lang="ts">
import {
  useCodeClient,
  ImplicitFlowSuccessResponse,
  ImplicitFlowErrorResponse,
} from "vue3-google-signin";
import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const handleOnSuccess = async (response: ImplicitFlowSuccessResponse) => {
  // send code to a backend server to verify it.
  console.log("Code: ", response.code);

  authStore.registerGoogle(response.code).catch((err) => {
    notificationStore.show("Login failed: " + err, ToastLevelType.error);
    console.error(err);
  });

  // use axios or something to reach backend server
  // const result = await fetch("https://YOUR_BACKEND/code/verify", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     code: response.code,
  //   }),
  // });
};

const handleOnError = (errorResponse: ImplicitFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  // other options
});
</script>

<template>
  <button
    :disabled="!isReady"
    @click="() => login()"
  >Login with Google</button>
</template>