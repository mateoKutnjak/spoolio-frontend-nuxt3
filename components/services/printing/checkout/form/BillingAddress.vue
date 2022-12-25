<template>
  <div class="card-body gap-8 p-2 py-0">
    <div class="card-title flex justify-between">
      Billing address
      <div
        class="btn btn-ghost link link-info text-base"
        @click="onUseDefaultClicked"
      >Use default</div>
    </div>
    <FormKit
      type="form"
      id="profile-form"
      submit-label="Update"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <FormKit
          type="select"
          label="Country"
          v-model="county"
          :options="COUNTRIES"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <FormKit
          type="text"
          label="First name"
          v-model="firstName"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          label="Last name"
          v-model="lastName"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="text"
        label="Street address"
        v-model="address"
        validation="required"
        validation-visibility="blur"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 md:gap-5">
        <FormKit
          type="text"
          label="City/Locality"
          v-model="city"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          label="State/Province"
          v-model="state"
          validation=""
          validation-visibility="blur"
        />
        <FormKit
          type="number"
          label="ZIP code"
          v-model="postalCode"
          validation="required"
          validation-visibility="blur"
        />
      </div>
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
      <div class="pt-2">
        <FormKit
          type="submit"
          label="Save"
          :classes="{
                input: 'btn btn-primary btn-block btn-lg'
            }"
        />
      </div>

    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { COUNTRIES } from "~~/constants/countries";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { billingAddress } = storeToRefs(printOrderStore);

const county = ref("");
const firstName = ref("");
const lastName = ref("");
const address = ref("");
const city = ref("");
const state = ref("");
const postalCode = ref("");
const phoneNumber = ref("");

const submittingGeneralInfo = ref(false);

onMounted(() => {
  county.value = billingAddress.value.country ?? "";
  firstName.value = billingAddress.value.first_name ?? "";
  lastName.value = billingAddress.value.last_name ?? "";
  address.value = billingAddress.value.address ?? "";
  city.value = billingAddress.value.locality ?? "";
  state.value = billingAddress.value.state ?? "";
  postalCode.value = billingAddress.value.postal_code ?? "";
  phoneNumber.value = billingAddress.value.phone_number ?? "";
});

function onUseDefaultClicked() {
  if (!user.value?.profile?.billing_address) {
    notificationStore.show("Cannot do that", ToastLevel.error());
    return;
  }

  county.value = user.value?.profile?.billing_address.country ?? "";
  firstName.value = user.value?.profile?.billing_address.first_name ?? "";
  lastName.value = user.value?.profile?.billing_address.last_name ?? "";
  address.value = user.value?.profile?.billing_address.address ?? "";
  city.value = user.value?.profile?.billing_address.locality ?? "";
  state.value = user.value?.profile?.billing_address.state ?? "";
  postalCode.value = user.value?.profile?.billing_address.postal_code ?? "";
  phoneNumber.value = user.value?.profile?.billing_address.phone_number ?? "";
}

function submitHandler() {
  billingAddress.value.country = county.value;
  billingAddress.value.first_name = firstName.value;
  billingAddress.value.last_name = lastName.value;
  billingAddress.value.address = address.value;
  billingAddress.value.locality = city.value;
  billingAddress.value.state = state.value;
  billingAddress.value.postal_code = postalCode.value;
  billingAddress.value.phone_number = phoneNumber.value;

  dialogStore.close();
}
</script>

<style>
</style>