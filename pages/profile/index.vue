<template>
  <div class="card card-bordered bg-base-100 shadow-md">
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
          <FormKit
            type="text"
            name="address"
            label="Address"
            v-model="address"
            validation=""
            validation-visibility="blur"
          />
          <FormKit
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
        <div class="card-actions justify-end">
          <FormKit
            type="submit"
            label="Save"
          />
        </div>

      </div>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const firstName = ref("");
const lastName = ref("");
const address = ref("");
const phoneNumber = ref("");

const submitted = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

watch(getUser, () => {
  console.log("bere");

  console.log(getUser);

  firstName.value = getUser?.value?.profile?.first_name ?? "";
  lastName.value = getUser?.value?.profile?.last_name ?? "";
  phoneNumber.value = getUser?.value?.profile?.phone_number ?? "";
  address.value = getUser?.value?.profile?.address ?? "";
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