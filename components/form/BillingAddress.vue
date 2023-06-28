<template>
  <div class="p-4">
    <!-- <div class="card-title flex justify-between font-normal">
      {{ capitalizeOnlyFirstLetter($t('billing_address')) }}
      <div
        v-if="enableUseDefault"
        class="btn btn-ghost link link-info text-sm"
        @click="onFillUserProfileBillingAddress"
      >{{ capitalizeOnlyFirstLetter($t('use_default')) }}</div>
    </div> -->
    <FormKit
      type="form"
      id="profile-form"
      @submit="submitHandler"
      :actions="false"
    >
      <FormKit
        v-model="billing_address_ref.type"
        type="radio"
        :options="BILLING_ADDRESS_TYPES"
      />
      <div class="">
        <FormKit
          type="select"
          :name="capitalizeOnlyFirstLetter($t('country'))"
          :placeholder="capitalizeOnlyFirstLetter($t('country'))"
          v-model="billing_address_ref.country"
          :options="COUNTRIES"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div
        v-if="billing_address_ref.type == BILLING_ADDRESS_TYPE_INDIVIDUAL"
        class="grid grid-cols-1 md:grid-cols-2 md:gap-5"
      >
        <FormKit
          type="text"
          :name="capitalizeOnlyFirstLetter($t('first_name'))"
          :placeholder="capitalizeOnlyFirstLetter($t('first_name'))"
          v-model="billing_address_ref.first_name"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          :name="capitalizeOnlyFirstLetter($t('last_name'))"
          :placeholder="capitalizeOnlyFirstLetter($t('last_name'))"
          v-model="billing_address_ref.last_name"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
          <FormKit
            type="text"
            :name="capitalizeOnlyFirstLetter($t('first_name'))"
            :placeholder="capitalizeOnlyFirstLetter($t('first_name'))"
            v-model="billing_address_ref.contact_first_name"
            validation="required"
            validation-visibility="blur"
          />
          <FormKit
            type="text"
            :name="capitalizeOnlyFirstLetter($t('last_name'))"
            :placeholder="capitalizeOnlyFirstLetter($t('last_name'))"
            v-model="billing_address_ref.contact_last_name"
            validation="required"
            validation-visibility="blur"
          />
        </div>
        <FormKit
          type="text"
          :name="capitalizeOnlyFirstLetter($t('company'))"
          :placeholder="capitalizeOnlyFirstLetter($t('company'))"
          v-model="billing_address_ref.company_name"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="text"
        :name="capitalizeOnlyFirstLetter($t('street_address'))"
        :placeholder="capitalizeOnlyFirstLetter($t('street_address'))"
        v-model="billing_address_ref.address"
        validation="required"
        validation-visibility="blur"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 md:gap-5">
        <FormKit
          type="text"
          :name="capitalizeOnlyFirstLetter($t('city_locality'))"
          :placeholder="capitalizeOnlyFirstLetter($t('city_locality'))"
          v-model="billing_address_ref.locality"
          validation="required"
          validation-visibility="blur"
        />
        <FormKit
          type="text"
          :name="capitalizeOnlyFirstLetter($t('state_province'))"
          :placeholder="capitalizeOnlyFirstLetter($t('state_province'))"
          v-model="billing_address_ref.state"
          validation=""
          validation-visibility="blur"
        />
        <FormKit
          type="number"
          :name="capitalizeOnlyFirstLetter($t('zip_code'))"
          :placeholder="capitalizeOnlyFirstLetter($t('zip_code'))"
          v-model="billing_address_ref.postal_code"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <FormKit
        type="tel"
        :name="capitalizeOnlyFirstLetter($t('phone_number'))"
        :placeholder="capitalizeOnlyFirstLetter($t('phone_number'))"
        v-model="billing_address_ref.phone_number"
        :validation="[['matches', /^\+\d{9,15}$/]]"
        :validation-messages="{
                    matches: 'Phone number must be in the format +xxx...x [max 15]',
                  }"
        validation-visibility="dirty"
      />
      <FormKit
        v-if="billing_address_ref.type == BILLING_ADDRESS_TYPE_COMPANY"
        type="text"
        :name="capitalizeOnlyFirstLetter($t('vat_id'))"
        :placeholder="capitalizeOnlyFirstLetter($t('vat_id'))"
        v-model="billing_address_ref.vat_id"
        :validation="[['required'], ['matches', new RegExp('^((AT)?U[0-9]{8}|(BE)?0[0-9]{9}|(BG)?[0-9]{9,10}|(HR)?[0-9]{11}|(CY)?[0-9]{8}L|(CZ)?[0-9]{8,10}|(DE)?[0-9]{9}|(DK)?[0-9]{8}|(EE)?[0-9]{9}|(EL|GR)?[0-9]{9}|ES[A-Z][0-9]{7}(?:[0-9]|[A-Z])|(FI)?[0-9]{8}|(FR)?[0-9A-Z]{2}[0-9]{9}|(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)?[0-9]{8}|(IE)?[0-9]S[0-9]{5}L|(IT)?[0-9]{11}|(LT)?([0-9]{9}|[0-9]{12})|(LU)?[0-9]{8}|(LV)?[0-9]{11}|(MT)?[0-9]{8}|(NL)?[0-9]{9}B[0-9]{2}|(PL)?[0-9]{10}|(PT)?[0-9]{9}|(RO)?[0-9]{2,10}|(SE)?[0-9]{12}|(SI)?[0-9]{8}|(SK)?[0-9]{10})$')]]"
        :validation-messages="{
                  matches: 'VAT ID has invalid format',
                }"
        validation-visibility="blur"
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
import {
  BILLING_ADDRESS_TYPES,
  BILLING_ADDRESS_TYPE_INDIVIDUAL,
  BILLING_ADDRESS_TYPE_COMPANY,
} from "~~/constants/constants";
import { COUNTRIES } from "~~/constants/countries";
import { IAddressBilling } from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";

const { t } = useI18n();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const { billing_address, enableUseDefault, onSaved } = defineProps<{
  billing_address: IAddressBilling;
  enableUseDefault: boolean;
  onSaved: Function;
}>();

class AddressBilling implements IAddressBilling {
  type = billing_address.type || BILLING_ADDRESS_TYPE_INDIVIDUAL;

  address = billing_address.address || "";
  locality = billing_address.locality || "";
  state = billing_address.state || "";
  postal_code = billing_address.postal_code || "";
  country = billing_address.country || "";
  phone_number = billing_address.phone_number || "";

  first_name = billing_address.first_name || "";
  last_name = billing_address.last_name || "";

  contact_first_name = billing_address.contact_first_name || "";
  contact_last_name = billing_address.contact_last_name || "";
  company_name = billing_address.company_name || "";
  vat_id = billing_address.vat_id || "";
}

const billing_address_ref = ref<AddressBilling>(new AddressBilling());

function onFillUserProfileBillingAddress() {
  if (!user.value?.profile?.billing_address) {
    notificationStore.show(
      capitalizeOnlyFirstLetter(t("cannot_do_that")),
      ToastLevelType.error
    );
    return;
  }

  billing_address_ref.value = user.value.profile
    .billing_address as AddressBilling;
}

function submitHandler() {
  onSaved({ ...billing_address_ref.value });
  dialogStore.close();
}
</script>
  
  <style>
</style>