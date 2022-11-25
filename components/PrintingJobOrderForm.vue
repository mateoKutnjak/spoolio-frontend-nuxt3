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
      <div class="p-5 border-4 mb-10">
        <div class="flex items-end gap-2 pb-3">
          <Icon
            name="material-symbols:person"
            class="block h-10 w-10"
            aria-hidden="true"
          />
          <p class="text-lg">Profile information</p>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <FormKit
            type="text"
            name="first_name"
            label="First name"
            :disabled="! isEmptyOrNull(getUser?.profile?.first_name)"
            v-model="firstName"
            validation="required"
            validation-visibility="blur"
          />
          <FormKit
            type="text"
            name="last_name"
            label="Last name"
            :disabled="! isEmptyOrNull(getUser?.profile?.last_name)"
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
            :disabled="! isEmptyOrNull(getUser?.profile?.phone_number)"
            v-model="phoneNumber"
            placeholder="+123456789"
            :validation="[['matches', /^\+\d{9,15}$/]]"
            :validation-messages="{
    matches: 'Phone number must be in the format +xxx...x [max 15]',
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
      </div>
      <div class="grid grid-cols-2 gap-2">
        <FormKit
          type="textarea"
          label="Additional information"
          v-model="comment"
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
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const printOrderStore = usePrintOrderStore();

const firstName = ref("");
const lastName = ref("");
const address = ref("");
const phoneNumber = ref("");
const email = ref("");
const comment = ref("");
const submitted = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

watch(getUser, (value, oldValue, onInvalidate) => {
  firstName.value = value?.profile?.first_name ?? "";
  lastName.value = value?.profile?.last_name ?? "";
  phoneNumber.value = value?.profile?.phone_number ?? "";
  address.value = value?.profile?.address ?? ""
  email.value = value?.email ?? "";
});

const submitHandler = async () => {
  submitted.value = true;

  printOrderStore.createPrintOrder(
    email.value,
    firstName.value,
    lastName.value,
    address.value,
    phoneNumber.value,
    comment.value
  );
};

function isEmptyOrNull(str?: string) {
  if (str === undefined) return true;
  if (str === null) return true;
  if (str === "") return true;
  return false;
}
</script>

<style></style>;
