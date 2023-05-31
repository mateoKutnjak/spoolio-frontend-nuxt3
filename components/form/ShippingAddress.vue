<template>
  <div class="card-body gap-8">
    <div class="card-title flex justify-between font-normal text-gray-700">
      {{ capitalizeOnlyFirstLetter($t('shipping_address')) }}
      <div
        v-if="enableUseDefault"
        class="btn btn-ghost link link-info text-sm"
        @click="onFillUserProfileShippingAddress"
      >{{ capitalizeOnlyFirstLetter($t('use_default')) }}</div>
    </div>
    <FormKit
      type="form"
      id="profile-form"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="">
        <FormKit
          type="select"
          :label="capitalizeOnlyFirstLetter($t('country'))"
          v-model="shipping_address_ref.country"
          :options="COUNTRIES"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <FormKit
          type="text"
          :label="capitalizeOnlyFirstLetter($t('first_name'))"
          v-model="shipping_address_ref.first_name"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          :label="capitalizeOnlyFirstLetter($t('last_name'))"
          v-model="shipping_address_ref.last_name"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="text"
        :label="capitalizeOnlyFirstLetter($t('street_address'))"
        v-model="shipping_address_ref.address"
        validation="required"
        validation-visibility="blur"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 md:gap-5">
        <FormKit
          type="text"
          :label="capitalizeOnlyFirstLetter($t('city_locality'))"
          v-model="shipping_address_ref.locality"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          :label="capitalizeOnlyFirstLetter($t('state_province'))"
          v-model="shipping_address_ref.state"
          validation=""
          validation-visibility="blur"
        />
        <FormKit
          type="number"
          :label="capitalizeOnlyFirstLetter($t('zip_code'))"
          v-model="shipping_address_ref.postal_code"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="tel"
        :label="capitalizeOnlyFirstLetter($t('phone_number'))"
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
          :label="capitalizeOnlyFirstLetter($t('save'))"
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
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const {t} = useI18n();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const { shipping_address, enableUseDefault, onSaved } = defineProps<{
  shipping_address: IAddressShipping;
  enableUseDefault: boolean;
  onSaved: Function;
}>();

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
    notificationStore.show(capitalizeOnlyFirstLetter(t('cannot_do_that')), ToastLevelType.error);
    return;
  }

  shipping_address_ref.value = user.value.profile
    .shipping_address as AddressShipping;
}

function submitHandler() {
  onSaved({ ...shipping_address_ref.value });
  dialogStore.close();
}
</script>
  
  <style>
</style>