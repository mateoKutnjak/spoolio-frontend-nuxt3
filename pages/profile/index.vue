<template>
  <div class="container p-12 max-w-4xl mx-auto">
    <div class="flex flex-col gap-5">
      <FormProfileGeneralInfo
        :contact_email="contact_email_ref"
        :enable-use-default="false"
        @on-saved="onGeneralInfoSaved"
      />

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
import { storeToRefs } from "pinia";

import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";
import { IAddressBilling, IAddressShipping, IProfile } from "~~/constants/data";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const contact_email_ref = user.value?.profile?.email || user.value?.email || "";
const shipping_address_ref =
  user.value?.profile?.shipping_address || <IAddressShipping>{};
const billing_address_ref =
  user.value?.profile?.billing_address || <IAddressBilling>{};

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

function onGeneralInfoSaved(contact_email: string) {
  authStore
    .patchUserProfile(<IProfile>{
      email: contact_email,
    })
    .then(() => {
      notificationStore.show("Information saved", ToastLevel.success());
    })
    .catch((err) => notificationStore.showFetchError(err));
}
</script>

<style>
</style>