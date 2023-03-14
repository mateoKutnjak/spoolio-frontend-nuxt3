<template>
  <div class="container p-12">
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
      <div class="flex flex-col lg:flex-row gap-5">
        <div class="card card-bordered bg-white shadow-md max-w-2xl mx-auto">
          <FormKit
            type="form"
            id="shipping-address-form"
            :form-class="submitted ? 'hide' : 'show'"
            submit-label="Update"
            @submit="submitShippingAddressHandler"
            :actions="false"
          >
            <div class="card-body justify-center gap-6">
              <h2 class="card-title justify-start">Shipping address</h2>
              <div>
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                  <FormKit
                    type="select"
                    name="shipping_address_country"
                    label="Country"
                    v-model="shippingAddressCountry"
                    :options="COUNTRIES"
                    validation="required"
                    validation-visibility="blur"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                  <FormKit
                    type="text"
                    name="shipping_address_first_name"
                    label="First name"
                    v-model="shippingAddressFirstName"
                    validation="required"
                    validation-visibility="blur"
                  />
                  <FormKit
                    type="text"
                    name="shipping_address_last_name"
                    label="Last name"
                    v-model="shippingAddressLastName"
                    validation="required"
                    validation-visibility="blur"
                  />
                </div>
                <FormKit
                  type="text"
                  name="shipping_address_address"
                  label="Street address"
                  v-model="shippingAddressStreetAddress"
                  validation="required"
                  validation-visibility="blur"
                />
                <div class="grid grid-cols-1 md:grid-cols-3 md:gap-5">
                  <FormKit
                    type="text"
                    name="shipping_address_city"
                    label="City/Locality"
                    v-model="shippingAddressCity"
                    validation="required"
                    validation-visibility="blur"
                  />
                  <FormKit
                    type="text"
                    name="shipping_address_state"
                    label="State/Province"
                    v-model="shippingAddressState"
                    validation=""
                    validation-visibility="blur"
                  />
                  <FormKit
                    type="number"
                    name="shipping_address_postal_code"
                    label="ZIP code"
                    v-model="shippingAddressPostalCode"
                    validation="required"
                    validation-visibility="blur"
                  />
                </div>
                <FormKit
                  type="tel"
                  label="Phone number"
                  v-model="shippingAddressPhoneNumber"
                  placeholder="+123456789"
                  :validation="[['matches', /^\+\d{9,15}$/]]"
                  :validation-messages="{
                  matches: 'Phone number must be in the format +xxx...x [max 15]',
                }"
                  validation-visibility="dirty"
                />
              </div>

              <div>
                <FormKit
                  type="submit"
                  label="Save"
                  :classes="{
                input: 'btn btn-primary btn-block text-lg'
              }"
                />
              </div>

            </div>
          </FormKit>

        </div>

        <div class="card bg-white shadow-md max-w-2xl">
          <FormBillingAddress
            :billing_address="billing_address_ref"
            :enable-use-default="false"
            @on-saved="onBillingAddressSaved"
          />
        </div>

      </div>
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

const billing_address_ref =
  user.value?.profile?.billing_address || <IAddressBilling>{};

const generalInfoEmail = ref(user.value?.email || "");

const shippingAddressCountry = ref("");
const shippingAddressFirstName = ref("");
const shippingAddressLastName = ref("");
const shippingAddressStreetAddress = ref("");
const shippingAddressCity = ref("");
const shippingAddressState = ref("");
const shippingAddressPostalCode = ref("");
const shippingAddressPhoneNumber = ref("");

const billingAddressCountry = ref("");
const billingAddressFirstName = ref("");
const billingAddressLastName = ref("");
const billingAddressStreetAddress = ref("");
const billingAddressCity = ref("");
const billingAddressState = ref("");
const billingAddressPostalCode = ref("");
const billingAddressPhoneNumber = ref("");

const submitted = ref(false);

const submittingGeneralInfo = ref(false);

onMounted(() => {
  generalInfoEmail.value = user.value?.profile?.email || "";

  shippingAddressCountry.value =
    user.value?.profile?.shipping_address?.country ?? "";
  shippingAddressFirstName.value =
    user.value?.profile?.shipping_address?.first_name ?? "";
  shippingAddressLastName.value =
    user.value?.profile?.shipping_address?.last_name ?? "";
  shippingAddressStreetAddress.value =
    user.value?.profile?.shipping_address?.address ?? "";
  shippingAddressCity.value =
    user.value?.profile?.shipping_address?.locality ?? "";
  shippingAddressState.value =
    user.value?.profile?.shipping_address?.state ?? "";
  shippingAddressPostalCode.value =
    user.value?.profile?.shipping_address?.postal_code ?? "";
  shippingAddressPhoneNumber.value =
    user.value?.profile?.shipping_address?.phone_number ?? "";

  billingAddressCountry.value =
    user.value?.profile?.billing_address?.country ?? "";
  billingAddressFirstName.value =
    user.value?.profile?.billing_address?.first_name ?? "";
  billingAddressLastName.value =
    user.value?.profile?.billing_address?.last_name ?? "";
  billingAddressStreetAddress.value =
    user.value?.profile?.billing_address?.address ?? "";
  billingAddressCity.value =
    user.value?.profile?.billing_address?.locality ?? "";
  billingAddressState.value = user.value?.profile?.billing_address?.state ?? "";
  billingAddressPostalCode.value =
    user.value?.profile?.billing_address?.postal_code ?? "";
  billingAddressPhoneNumber.value =
    user.value?.profile?.billing_address?.phone_number ?? "";
});

watch(user, (value, oldValue, onInvalidate) => {
  generalInfoEmail.value = value?.profile?.email || "";

  shippingAddressCountry.value =
    value?.profile?.shipping_address?.country ?? "";
  shippingAddressFirstName.value =
    value?.profile?.shipping_address?.first_name ?? "";
  shippingAddressLastName.value =
    value?.profile?.shipping_address?.last_name ?? "";
  shippingAddressStreetAddress.value =
    value?.profile?.shipping_address?.address ?? "";
  shippingAddressCity.value = value?.profile?.shipping_address?.locality ?? "";
  shippingAddressState.value = value?.profile?.shipping_address?.state ?? "";
  shippingAddressPostalCode.value =
    value?.profile?.shipping_address?.postal_code ?? "";
  shippingAddressPhoneNumber.value =
    value?.profile?.shipping_address?.phone_number ?? "";

  billingAddressCountry.value = value?.profile?.billing_address?.country ?? "";
  billingAddressFirstName.value =
    value?.profile?.billing_address?.first_name ?? "";
  billingAddressLastName.value =
    value?.profile?.billing_address?.last_name ?? "";
  billingAddressStreetAddress.value =
    value?.profile?.billing_address?.address ?? "";
  billingAddressCity.value = value?.profile?.billing_address?.locality ?? "";
  billingAddressState.value = value?.profile?.billing_address?.state ?? "";
  billingAddressPostalCode.value =
    value?.profile?.billing_address?.postal_code ?? "";
  billingAddressPhoneNumber.value =
    value?.profile?.billing_address?.phone_number ?? "";
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

const submitShippingAddressHandler = async () => {
  // This delay is here only because of progress indicator button
  //   await new Promise((r) => setTimeout(r, 1000));
  authStore
    .patchUserProfile(<IProfile>{
      shipping_address: <IAddressShipping>{
        country: shippingAddressCountry.value,
        first_name: shippingAddressFirstName.value,
        last_name: shippingAddressLastName.value,
        address: shippingAddressStreetAddress.value,
        locality: shippingAddressCity.value,
        state: shippingAddressState.value,
        postal_code: shippingAddressPostalCode.value,
        phone_number: shippingAddressPhoneNumber.value,
      },
    })
    .then(() => {
      notificationStore.show("Information saved", ToastLevel.success());
    })
    .catch((err) => {
      notificationStore.show(
        "Error while saving. Try again",
        ToastLevel.error()
      );
      console.log(err);
    });
};

function onBillingAddressSaved(billingAddress: IAddressBilling) {
  if (authStore.user?.profile?.billing_address) {
    debugger;
    authStore.user.profile.billing_address = billingAddress;
    notificationStore.show("Billing address updated", ToastLevel.success());
  } else {
    notificationStore.show("Cannot do that", ToastLevel.error());
  }
}

const submitBillingAddressHandler = async () => {
  // This delay is here only because of progress indicator button
  //   await new Promise((r) => setTimeout(r, 1000));

  authStore
    .patchUserProfile(<IProfile>{
      billing_address: <IAddressBilling>{
        country: billingAddressCountry.value,
        first_name: billingAddressFirstName.value,
        last_name: billingAddressLastName.value,
        address: billingAddressStreetAddress.value,
        locality: billingAddressCity.value,
        state: billingAddressState.value,
        postal_code: billingAddressPostalCode.value,
        phone_number: billingAddressPhoneNumber.value,
      },
    })
    .then(() => {
      notificationStore.show("Information saved", ToastLevel.success());
    })
    .catch((err) => notificationStore.showFetchError(err));
};
</script>

<style>
</style>