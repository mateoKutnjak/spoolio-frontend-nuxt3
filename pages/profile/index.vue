<template>
  <div class="container p-12">
    <div class="flex flex-col lg:flex-row gap-5">
      <div class="card card-bordered bg-base-100 shadow-md max-w-2xl mx-auto">
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

      <div class="card card-bordered bg-base-100 shadow-md max-w-2xl mx-auto">
        <FormKit
          type="form"
          id="billing-address-form"
          :form-class="submitted ? 'hide' : 'show'"
          submit-label="Update"
          @submit="submitBillingAddressHandler"
          :actions="false"
        >
          <div class="card-body justify-center gap-6">
            <h2 class="card-title justify-start">Billing address</h2>
            <div>

              <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <FormKit
                  type="select"
                  name="shipping_address_country"
                  label="Country"
                  v-model="shippingAddressCountry"
                  :options="COUNTRIES"
                  validation=""
                  validation-visibility="blur"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <FormKit
                  type="text"
                  name="shipping_address_first_name"
                  label="First name"
                  v-model="shippingAddressFirstName"
                  validation=""
                  validation-visibility="blur"
                />
                <FormKit
                  type="text"
                  name="shipping_address_last_name"
                  label="Last name"
                  v-model="shippingAddressLastName"
                  validation=""
                  validation-visibility="blur"
                />
              </div>
              <FormKit
                type="text"
                name="shipping_address_address"
                label="Street address"
                v-model="shippingAddressStreetAddress"
                validation=""
                validation-visibility="blur"
              />
              <div class="grid grid-cols-1 md:grid-cols-3 md:gap-5">
                <FormKit
                  type="text"
                  name="shipping_address_city"
                  label="City/Locality"
                  v-model="shippingAddressCity"
                  validation=""
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
                  validation=""
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
    </div>

  </div>
</template>

<script lang="ts" setup>
import { COUNTRIES } from "~~/constants/countries";

import { storeToRefs } from "pinia";

import {
  IAddressResponse,
  IProfileResponse,
  useAuthStore,
} from "~~/stores/auth";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const shippingAddressCountry = ref("");
const shippingAddressFirstName = ref("");
const shippingAddressLastName = ref("");
const shippingAddressStreetAddress = ref("");
const shippingAddressCity = ref("");
const shippingAddressState = ref("");
const shippingAddressPostalCode = ref("");
const shippingAddressPhoneNumber = ref("");

const submitted = ref(false);

onMounted(() => {
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
});

watch(user, (value, oldValue, onInvalidate) => {
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
});

const submitShippingAddressHandler = async () => {
  // This delay is here only because of progress indicator button
  //   await new Promise((r) => setTimeout(r, 1000));
  debugger;

  authStore
    .patchUserProfile(<IProfileResponse>{
      shipping_address: <IAddressResponse>{
        address: shippingAddressStreetAddress.value,
      },
    })
    .then(() => {})
    .catch((err) => {});

  authStore
    .patchProfile(
      shippingAddressFirstName.value,
      shippingAddressLastName.value,
      shippingAddressStreetAddress.value,
      shippingAddressPhoneNumber.value
    )
    .then(() => {})
    .catch((err) => {});
};

const submitBillingAddressHandler = async () => {
  // This delay is here only because of progress indicator button
  //   await new Promise((r) => setTimeout(r, 1000));

  authStore
    .patchProfile(
      shippingAddressFirstName.value,
      shippingAddressLastName.value,
      shippingAddressStreetAddress.value,
      shippingAddressPhoneNumber.value
    )
    .then(() => {})
    .catch((err) => {});
};
</script>

<style>
</style>