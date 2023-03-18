<template>
  <div class="card-body gap-8">
    <div class="card-title flex justify-between">
      Shipping address
      <div
        v-if="enableUseDefault"
        class="btn btn-ghost link link-info text-sm"
        @click="onFillUserProfileShippingAddress"
      >Use default</div>
    </div>
    <FormKit
      type="form"
      id="profile-form2"
      submit-label="Save"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="">
        <FormKit
          type="select"
          label="Country"
          v-model="shipping_address_ref.country"
          :options="COUNTRIES"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <FormKit
          type="text"
          label="First name"
          v-model="shipping_address_ref.first_name"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          label="Last name"
          v-model="shipping_address_ref.last_name"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="text"
        label="Street address"
        v-model="shipping_address_ref.address"
        validation="required"
        validation-visibility="blur"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 md:gap-5">
        <FormKit
          type="text"
          label="City/Locality"
          v-model="shipping_address_ref.locality"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          label="State/Province"
          v-model="shipping_address_ref.state"
          validation=""
          validation-visibility="blur"
        />
        <FormKit
          type="number"
          label="ZIP code"
          v-model="shipping_address_ref.postal_code"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="tel"
        label="Phone number"
        v-model="shipping_address_ref.phone_number"
        placeholder="+123456789"
        :validation="[['matches', /^\+\d{9,15}$/]]"
        :validation-messages="{
                      matches: 'Phone number must be in the format +xxx...x [max 15]',
                    }"
        validation-visibility="dirty"
      />
      <div class="pt-8">
        <FormKit
          type="submit"
          label="Save"
          :classes="{
                    input: 'btn btn-primary btn-block'
                }"
        />
      </div>

    </FormKit>
  </div>
</template>
    
    <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { COUNTRIES } from "~~/constants/countries";
import { IAddressShipping } from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useNotificationStore } from "~~/stores/notification";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const { shipping_address, enableUseDefault } = defineProps<{
  shipping_address: IAddressShipping;
  enableUseDefault: boolean;
}>();

const emitObject = defineEmits(["onSaved"]);

class AddressShipping implements IAddressShipping {
  address = shipping_address.address || "";
  locality = shipping_address.locality || "";
  state = shipping_address.state || "";
  postal_code = shipping_address.postal_code || "";
  country = shipping_address.country || "";
  phone_number = shipping_address.phone_number || "";

  first_name = shipping_address.first_name || "";
  last_name = shipping_address.last_name || "";
}

const shipping_address_ref = ref<AddressShipping>(new AddressShipping());

function onFillUserProfileShippingAddress() {
  if (!user.value?.profile?.shipping_address) {
    notificationStore.show("Cannot do that", ToastLevel.error());
    return;
  }

  shipping_address_ref.value = user.value.profile
    .shipping_address as AddressShipping;
}

function submitHandler() {
  emitObject("onSaved", { ...shipping_address_ref.value });
}
</script>
    
    <style>
</style>