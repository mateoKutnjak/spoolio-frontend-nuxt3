<template>
  <div class="card-body gap-8 px-6 py-2">
    <div class="card-title justify-center">Sign Up</div>
    <FormKit
      type="form"
      id="register-form"
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
            validation="required|email"
            validation-visibility="blur"
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
            validation="required|length:5,15|matches:/[0-9]/"
            validation-visibility="blur"
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
            name="password_confirm"
            placeholder="Confirm password"
            v-model="confirmPassword"
            validation="required|confirm"
            validation-label="Password confirmation"
            validation-visibility="blur"
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
          label="Sign Up"
          :classes="{
              input: 'btn-block'
            }"
          :input-class="{
            'loading': loading
          }"
        />
      </div>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { FormKitNode } from "@formkit/core";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const confirmPassword = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const loading = ref(false);

async function submitHandler(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  loading.value = true;

  authStore
    .register(email.value, password.value, confirmPassword.value)
    .then((loginRequestState) => {
      dialogStore.close();
      navigateTo("/");
    })
    .catch((err) => {
      notificationStore.showFetchError(err)
      node?.setErrors(
        err?.data?.non_field_errors || ["Error occurred. Please try again."],
        err?.data
      );
    })
    .finally(() => (loading.value = false));
}
</script>

<style>
</style>