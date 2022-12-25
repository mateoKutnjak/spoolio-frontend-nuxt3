<template>
  <div class="card-body gap-8 p-2 py-0">
    <div class="card-title flex justify-between">
      Shipping address
      <div
        v-if="user"
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
const { shippingAddress } = storeToRefs(printOrderStore);

const shippingAddressCountry = ref("");
const shippingAddressFirstName = ref("");
const shippingAddressLastName = ref("");
const shippingAddressStreetAddress = ref("");
const shippingAddressCity = ref("");
const shippingAddressState = ref("");
const shippingAddressPostalCode = ref("");
const shippingAddressPhoneNumber = ref("");

const submittingGeneralInfo = ref(false);

onMounted(() => {
  if (Object.keys(shippingAddress.value).length) {
    shippingAddressCountry.value = shippingAddress.value.country || "";
    shippingAddressFirstName.value = shippingAddress.value.first_name || "";
    shippingAddressLastName.value = shippingAddress.value.last_name || "";
    shippingAddressStreetAddress.value = shippingAddress.value.address || "";
    shippingAddressCity.value = shippingAddress.value.locality || "";
    shippingAddressState.value = shippingAddress.value.state || "";
    shippingAddressPostalCode.value = shippingAddress.value.postal_code || "";
    shippingAddressPhoneNumber.value = shippingAddress.value.phone_number || "";
  } else if (user.value?.profile?.shipping_address) {
    shippingAddressCountry.value =
      user?.value?.profile?.shipping_address.country || "";
    shippingAddressFirstName.value =
      user?.value?.profile?.shipping_address.first_name || "";
    shippingAddressLastName.value =
      user?.value?.profile?.shipping_address.last_name || "";
    shippingAddressStreetAddress.value =
      user?.value?.profile?.shipping_address.address || "";
    shippingAddressCity.value =
      user?.value?.profile?.shipping_address.locality || "";
    shippingAddressState.value =
      user?.value?.profile?.shipping_address.state || "";
    shippingAddressPostalCode.value =
      user?.value?.profile?.shipping_address.postal_code || "";
    shippingAddressPhoneNumber.value =
      user?.value?.profile?.shipping_address.phone_number || "";
  }
});

function onUseDefaultClicked() {
  if (!user.value?.profile?.shipping_address) {
    notificationStore.show("Cannot do that", ToastLevel.error());
    return;
  }

  shippingAddressCountry.value =
    user.value?.profile?.shipping_address.country || "";
  shippingAddressFirstName.value =
    user.value?.profile?.shipping_address.first_name || "";
  shippingAddressLastName.value =
    user.value?.profile?.shipping_address.last_name || "";
  shippingAddressStreetAddress.value =
    user.value?.profile?.shipping_address.address || "";
  shippingAddressCity.value =
    user.value?.profile?.shipping_address.locality || "";
  shippingAddressState.value =
    user.value?.profile?.shipping_address.state || "";
  shippingAddressPostalCode.value =
    user.value?.profile?.shipping_address.postal_code || "";
  shippingAddressPhoneNumber.value =
    user.value?.profile?.shipping_address.phone_number || "";
}

function submitHandler() {
  shippingAddress.value.country = shippingAddressCountry.value;
  shippingAddress.value.first_name = shippingAddressFirstName.value;
  shippingAddress.value.last_name = shippingAddressLastName.value;
  shippingAddress.value.address = shippingAddressStreetAddress.value;
  shippingAddress.value.locality = shippingAddressCity.value;
  shippingAddress.value.state = shippingAddressState.value;
  shippingAddress.value.postal_code = shippingAddressPostalCode.value;
  shippingAddress.value.phone_number = shippingAddressPhoneNumber.value;

  dialogStore.close();
}
</script>

<style>
</style>