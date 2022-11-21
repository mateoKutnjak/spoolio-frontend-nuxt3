<template>

  <div class="m-auto align-middle">
    <FormKit
      type="form"
      id="register-form"
      :form-class="submitted ? 'hide' : 'show'"
      submit-label="Sign In"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="double">
        <FormKit
          type="text"
          name="first_name"
          label="First name"
          v-model="firstName"
          :validation="required"
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
      <FormKit
        type="email"
        name="email"
        label="Email"
        v-model="email"
        validation="required|email"
        validation-visibility="blur"
      />
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
      <FormKit
        type="submit"
        label="Request"
      />
    </FormKit>
  </div>
</template>

<script setup>
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();

const getUser = computed(() => {
  return authStore.getUser;
});
</script>

<style>
</style>