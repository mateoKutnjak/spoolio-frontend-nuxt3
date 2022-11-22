<template>
  <div>
    <FormKit
      type="form"
      id="register-form"
      :form-class="submitted ? 'hide' : 'show'"
      submit-label="Sign In"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="grid grid-cols-2 gap-2">
        <FormKit
          type="text"
          name="first_name"
          label="First name"
          v-model="firstName"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          name="last_name"
          label="Last name"
          v-model="lastName"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div class="grid grid-cols-[80%_20%] gap-2">
        <FormKit
          type="text"
          name="address"
          label="Address"
          v-model="address"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="tel"
          label="Phone number"
          placeholder="xxx-xxx-xxxx"
          validation="matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
          :validation-messages="{
    matches: 'Phone number must be in the format xxx-xxx-xxxx',
  }"
          validation-visibility="dirty"
        />
      </div>
      <FormKit
        type="email"
        name="email"
        label="Email"
        :disabled="! isEmptyOrNull(getUser?.email)"
        v-model="email"
        validation="required|email"
        validation-visibility="blur"
      />
      <div class="grid grid-cols-2 gap-2">
        <FormKit
          type="textarea"
          label="Additional information"
          rows="5"
          placeholder="Tell us more about your"
          help="I'll know if you didn't read the book!"
        />
        <FormKit
          type="file"
          label="Files"
          accept=".pdf,.doc,.docx,.xml,.md,.csv"
          help="Upload files"
          multiple
        />
      </div>
      <FormKit
        type="submit"
        label="Request"
      />
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
const email = ref("");
const submitted = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

watch(getUser, () => {
  email.value = getUser?.value?.email ?? "";
});

const submitHandler = async () => {
  // This delay is here only because of progress indicator button
  // await new Promise((r) => setTimeout(r, 1000));
  // submitted.value = true;
  // store.login(username.value, password.value).then((loginRequestState) => {});
};

function isEmptyOrNull(str?: string) {
  if (str === undefined) return true;
  if (str === null) return true;
  if (str === "") return true;
  return false;
}
</script>

<style></style>;
