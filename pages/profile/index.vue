<template>
  <div class="container p-12">
    <div class="card card-bordered bg-base-100 shadow-md max-w-2xl mx-auto">
      <!-- <figure><img
        src="https://placeimg.com/400/400/arch"
        alt="Album"
      /></figure> -->
      <FormKit
        type="form"
        id="profile-form"
        :form-class="submitted ? 'hide' : 'show'"
        submit-label="Update"
        @submit="submitHandler"
        :actions="false"
      >
        <div class="card-body justify-center">
          <h2 class="card-title justify-center">Profile information</h2>
          <div>
            <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
              <FormKit
                type="text"
                name="first_name"
                label="First name"
                v-model="firstName"
                validation=""
                validation-visibility="blur"
              />
              <FormKit
                type="text"
                name="last_name"
                label="Last name"
                v-model="lastName"
                validation=""
                validation-visibility="blur"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 md:gap-5">
              <div class="md:col-span-8">
                <FormKit
                  class=""
                  type="text"
                  name="address"
                  label="Address"
                  v-model="address"
                  validation=""
                  validation-visibility="blur"
                />
              </div>
              <div class="md:col-span-4">
                <FormKit
                  class="md:col-span-2"
                  type="tel"
                  label="Phone number"
                  v-model="phoneNumber"
                  placeholder="+123456789"
                  :validation="[['matches', /^\+\d{9,15}$/]]"
                  :validation-messages="{
    matches: 'Phone number must be in the format +xxx...x [max 15]',
  }"
                  validation-visibility="dirty"
                />
              </div>
            </div>
          </div>
          <div class="card-actions justify-end">
            <FormKit
              type="submit"
              label="Save"
            />
          </div>

        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const firstName = ref("");
const lastName = ref("");
const address = ref("");
const phoneNumber = ref("");

const submitted = ref(false);

onMounted(() => {
  firstName.value = user.value?.profile?.first_name ?? "";
  lastName.value = user.value?.profile?.last_name ?? "";
  phoneNumber.value = user.value?.profile?.phone_number ?? "";
  address.value = user.value?.profile?.address ?? "";

  return authStore.getUser;
});

watch(user, (value, oldValue, onInvalidate) => {
  firstName.value = value?.profile?.first_name ?? "";
  lastName.value = value?.profile?.last_name ?? "";
  phoneNumber.value = value?.profile?.phone_number ?? "";
  address.value = value?.profile?.address ?? "";
});

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  //   await new Promise((r) => setTimeout(r, 1000));

  submitted.value = true;

  authStore
    .patchProfile(
      firstName.value,
      lastName.value,
      address.value,
      phoneNumber.value
    )
    .then(() => {})
    .catch((err) => {});
};
</script>

<style>
</style>