<template>
  <div class="container p-12 max-w-4xl mx-auto">
    <div class="flex flex-col gap-5">
      <div class="card card-bordered bg-white shadow-md max-w-lg">
        <FormKit
          type="form"
          id="profile-form"
          :form-class="submitted ? 'hide' : 'show'"
          submit-label="Update"
          @submit="submitGeneralInfoHandler"
          :actions="false"
        >
          <div class="card-body justify-center gap-6">
            <h2 class="card-title justify-start">General info</h2>
            <div>
              <div class="grid grid-cols-1 xl:grid-cols-2 md:gap-5">
                <FormKit
                  type="email"
                  name="general_email"
                  label="Contact email"
                  v-model="generalInfoEmail"
                  validation="email"
                  validation-visibility="blur"
                />
              </div>
            </div>
            <div>
              <FormKit
                type="submit"
                label="Save"
                :classes="{
                  input: 'btn btn-primary btn-block text-lg'
                }"
                :input-class="{
                  'loading': submittingGeneralInfo
                }"
              />
            </div>

          </div>
        </FormKit>

      </div>
      <div class="divider"></div>
      <FormShippingAddress
        :shipping_address="shipping_address_ref"
        :enable-use-default="false"
        @on-saved="onShippingAddressSaved"
      />

      <div class="divider"></div>

      <FormBillingAddress
        :billing_address="billing_address_ref"
        :enable-use-default="false"
        @on-saved="onBillingAddressSaved"
      />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { COUNTRIES } from "~~/constants/countries";

import { storeToRefs } from "pinia";

import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";
import { IAddressBilling, IAddressShipping, IProfile } from "~~/constants/data";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const shipping_address_ref =
  user.value?.profile?.shipping_address || <IAddressShipping>{};
const billing_address_ref =
  user.value?.profile?.billing_address || <IAddressBilling>{};

const generalInfoEmail = ref(user.value?.email || "");

const submitted = ref(false);

const submittingGeneralInfo = ref(false);

onMounted(() => {
  generalInfoEmail.value = user.value?.profile?.email || "";
});

watch(user, (value, oldValue, onInvalidate) => {
  generalInfoEmail.value = value?.profile?.email || "";
});

const submitGeneralInfoHandler = async () => {
  submittingGeneralInfo.value = true;

  // await new Promise((r) => setTimeout(r, 1000));

  authStore
    .patchUserProfile(<IProfile>{
      email: generalInfoEmail.value,
    })
    .then(() => {
      notificationStore.show("Information saved", ToastLevel.success());
    })
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => (submittingGeneralInfo.value = false));
};

function onShippingAddressSaved(shipping_address: IAddressShipping) {
  authStore
    .patchUserProfile(<IProfile>{
      shipping_address: shipping_address,
    })
    .then(() => {
      notificationStore.show("Information saved", ToastLevel.success());
    })
    .catch((err) => notificationStore.showFetchError(err));
}

function onBillingAddressSaved(billing_address: IAddressBilling) {
  authStore
    .patchUserProfile(<IProfile>{
      billing_address: billing_address,
    })
    .then(() => {
      notificationStore.show("Information saved", ToastLevel.success());
    })
    .catch((err) => notificationStore.showFetchError(err));
}
</script>

<style>
</style>