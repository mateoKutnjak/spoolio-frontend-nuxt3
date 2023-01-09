<template>
  <div class="card-body gap-8">
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
              input: 'btn-block'
            }"
        />
      </div>
    </FormKit>
  </div>
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