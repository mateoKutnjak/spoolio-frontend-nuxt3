<template>
  <div class="flex flex-col gap-8">
    <Tabs
      class="self-center"
      :tabs="tabs"
      :selected-tab-index="0"
      @on-tab-clicked="tab => onTabClicked(tab)"
    />
    <FormKit
      v-if="selectedTab === 0"
      type="form"
      id="register-form"
      @submit="submitHandler"
      :submit-label="capitalizeOnlyFirstLetter($t('sign_in'))"
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
    <FormKit
      v-else-if="selectedTab === 1"
      type="form"
      id="login-form"
      @submit="submitHandlerLogin"
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
            v-model="emailLogin"
          />
          <FormKit
            type="password"
            name="password"
            :placeholder="capitalizeOnlyFirstLetter($t('password'))"
            v-model="passwordLogin"
          />
        </div>
        <!-- <FormKit
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('sign_in'))"
          :classes="{
              input: 'btn-block',
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
import { ITab } from "~~/constants/data";

const { t } = useI18n();
const localePath = useLocalePath();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const email = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const password = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const confirmPassword = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const invitationToken = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const loading = ref(false);

let success = false;

const { orderId, orderType, onConfirm, onDismiss } = defineProps<{
  orderId: number | null;
  orderType: string | null;
  onConfirm: Function | null;
  onDismiss: Function | null;
}>();

const tabs = [
  <ITab>{ title: capitalizeOnlyFirstLetter(t("sign_up")) },
  <ITab>{ title: capitalizeOnlyFirstLetter(t("sign_in")) },
];
const selectedTab = ref(0);

async function submitHandler(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  loading.value = true;

  await authStore
    .register(
      email.value,
      password.value,
      confirmPassword.value,
      invitationToken.value,
      orderId ? orderId : undefined,
      orderType ? orderType : undefined
    )
    .then((loginRequestState) => {
      success = true;
      if (onConfirm){
        onConfirm();
      }   
      dialogStore.close();
      
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
const handleRegisterSuccess = (response: CredentialResponse) => {
  const { credential } = response;
  authStore.registerGoogle(credential!); // TODO check null value
  console.log("Access Token", credential);
};

// handle an error event
const handleRegisterError = () => {
  console.error("Login failed");
};

const emailLogin = ref<string>(""); // FormKit - cannot be wuthout args - undefined
const passwordLogin = ref<string>(""); // FormKit - cannot be wuthout args - undefined

const loadingLogin = ref(false);

async function submitHandlerLogin(data: any, node: FormKitNode | undefined) {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));

  loadingLogin.value = true;

  await authStore
    .login(emailLogin.value, passwordLogin.value)
    .then((loginRequestState) => {
      success = true;
      if (onConfirm){
        onConfirm();
      }      
      dialogStore.close();
      
      notificationStore.show(
        `Welcome ${emailLogin.value}`,
        ToastLevelType.info
      );
    })
    .catch((err) => {
      notificationStore.showFetchError(err);
      node?.setErrors(
        err?.data?.non_field_errors || ["Error occurred. Please try again."],
        err?.data
      );
    })
    .finally(() => (loadingLogin.value = false));
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

function onTabClicked(tab: ITab) {
  selectedTab.value = tabs.indexOf(tab);
}

onBeforeUnmount(async () => {
  if(onDismiss && !success){
    onDismiss();
  }
});
</script>

<style>
</style>