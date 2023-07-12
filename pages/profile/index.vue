<template>
  <div class="container mx-auto max-w-3xl px-0 md:px-12 py-12">
    <div class="mb-4 text-3xl font-bold">{{ $t('order_settings').toUpperCase() }}</div>
    <div class="flex flex-col">
      <FormKit
        :type="contactEmailInput"
        name="Contact email"
        v-model="contact_email_ref"
        dialogComponent="FormContactEmail"
        validation="email"
        validation-visibility="submit"
        @input="value => onGeneralInfoSaved(value)"
      />
    </div>
    <div class="bg-white p-5 flex flex-col gap-2 border border-stone-400/80 rounded-md">
      <div class="mb-2 flex gap-3 items-center text-stone-500">
        <Icon
          name="ph:house"
          size="30"
        />
        <div class="font-bold"> {{ capitalizeOnlyFirstLetter($t('addresses')) }}</div>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 grid-cols-1">
        <FormKit
          :type="shippingAddressInput"
          name="Shipping address"
          v-model="shipping_address_ref"
          dialogComponent="FormShippingAddress"
          validation-visibility="submit"
          @input="value => onShippingAddressSaved(value)"
        />
        <FormKit
          type="form"
          id="profile-contact-email-form3"
          @submit="onBillingAddressSaved"
          :actions="false"
          :incomplete-message="false"
        >
          <FormKit
            :type="billingAddressInput"
            name="Billing address"
            v-model="billing_address_ref"
            dialogComponent="FormBillingAddress"
            validation-visibility="submit"
            @input="value => onBillingAddressSaved(value)"
          />
        </FormKit>
      </div>
    </div>
    <div class="mt-8 mb-4 text-3xl font-bold">{{ $t('profile_settings').toUpperCase() }}</div>
    <div class="flex flex-col">
      <FormKit
        :type="passwordChangeInput"
        name="Password change"
        dialogComponent="FormPasswordChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { createInput } from "@formkit/vue";

import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";
import { IAddressBilling, IAddressShipping, IProfile } from "~~/constants/data";

import ShippingAddress from "~~/components/form/input/ShippingAddress.vue";
import BillingAddress from "~~/components/form/input/BillingAddress.vue";
import ContactEmail from "~~/components/form/input/ContactEmail.vue";
import PasswordChange from "~~/components/form/input/PasswordChange.vue";

const contactEmailInput = createInput(ContactEmail, {
  props: ["dialogComponent"],
});
const shippingAddressInput = createInput(ShippingAddress, {
  props: ["dialogComponent"],
});
const billingAddressInput = createInput(BillingAddress, {
  props: ["dialogComponent"],
});
const passwordChangeInput = createInput(PasswordChange, {
  props: ["dialogComponent"],
});

const { t } = useI18n();

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const contact_email_ref = user.value?.profile?.email || user.value?.email || "";

const shipping_address_ref = Object.keys(
  user.value?.profile?.shipping_address || {}
).length
  ? user.value?.profile?.shipping_address
  : <IAddressShipping>{};

const billing_address_ref = Object.keys(
  user.value?.profile?.billing_address || {}
).length
  ? user.value?.profile?.billing_address
  : <IAddressBilling>{};

function onShippingAddressSaved(shipping_address: IAddressShipping) {
  if (shipping_address === shipping_address_ref) {
    return;
  }

  authStore
    .patchUserProfile(<IProfile>{
      shipping_address: shipping_address,
    })
    .then(() => {
      notificationStore.show(
        capitalizeOnlyFirstLetter(t("saved")),
        ToastLevelType.success
      );
    })
    .catch((err) => notificationStore.showFetchError(err));
}

function onBillingAddressSaved(billing_address: IAddressBilling) {
  if (billing_address === billing_address_ref) {
    return;
  }

  authStore
    .patchUserProfile(<IProfile>{
      billing_address: billing_address,
    })
    .then(() => {
      notificationStore.show(
        capitalizeOnlyFirstLetter(t("saved")),
        ToastLevelType.success
      );
    })
    .catch((err) => notificationStore.showFetchError(err));
}

function onGeneralInfoSaved(contact_email: string) {
  if (contact_email === contact_email_ref) {
    return;
  }

  authStore
    .patchUserProfile(<IProfile>{
      email: contact_email,
    })
    .then(() => {
      notificationStore.show(
        capitalizeOnlyFirstLetter(t("saved")),
        ToastLevelType.success
      );
    })
    .catch((err) => notificationStore.showFetchError(err));
}
</script>

<style>
</style>