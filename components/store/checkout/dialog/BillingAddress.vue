<template>
  <div class="card-body gap-8 p-2 py-0">
    <div class="card-title flex justify-between">
      Billing address
      <div
        v-if="user"
        class="btn btn-ghost link link-info text-sm"
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
      <FormKit
        v-model="type"
        type="radio"
        :options="BILLING_ADDRESS_TYPES"
      />
      <div class="">
        <FormKit
          type="select"
          label="Country"
          v-model="county"
          :options="COUNTRIES"
          validation="required"
          validation-visibility="blur"
        />
      </div>
      <div
        v-if="type == BILLING_ADDRESS_TYPE_INDIVIDUAL"
        class="grid grid-cols-1 md:grid-cols-2 md:gap-5"
      >
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
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-5">
          <FormKit
            type="text"
            label="Contact first name"
            v-model="contactFirstName"
            validation="required"
            validation-visibility="blur"
          />
          <FormKit
            type="text"
            label="Contact last name"
            v-model="contactLastName"
            validation="required"
            validation-visibility="blur"
          />
        </div>
        <FormKit
          type="text"
          label="Company name"
          v-model="companyName"
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
      <FormKit
        v-if="type == BILLING_ADDRESS_TYPE_COMPANY"
        type="text"
        label="VAT ID"
        v-model="vatId"
        :validation="[['required'], ['matches', new RegExp('^((AT)?U[0-9]{8}|(BE)?0[0-9]{9}|(BG)?[0-9]{9,10}|(HR)?[0-9]{11}|(CY)?[0-9]{8}L|(CZ)?[0-9]{8,10}|(DE)?[0-9]{9}|(DK)?[0-9]{8}|(EE)?[0-9]{9}|(EL|GR)?[0-9]{9}|ES[A-Z][0-9]{7}(?:[0-9]|[A-Z])|(FI)?[0-9]{8}|(FR)?[0-9A-Z]{2}[0-9]{9}|(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)?[0-9]{8}|(IE)?[0-9]S[0-9]{5}L|(IT)?[0-9]{11}|(LT)?([0-9]{9}|[0-9]{12})|(LU)?[0-9]{8}|(LV)?[0-9]{11}|(MT)?[0-9]{8}|(NL)?[0-9]{9}B[0-9]{2}|(PL)?[0-9]{10}|(PT)?[0-9]{9}|(RO)?[0-9]{2,10}|(SE)?[0-9]{12}|(SI)?[0-9]{8}|(SK)?[0-9]{10})$')]]"
        :validation-messages="{
                  matches: 'VAT ID has invalid format',
                }"
        validation-visibility="blur"
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
import {
  BILLING_ADDRESS_TYPES,
  BILLING_ADDRESS_TYPE_INDIVIDUAL,
  BILLING_ADDRESS_TYPE_COMPANY,
} from "~~/constants/constants";
import { COUNTRIES } from "~~/constants/countries";
import { useAuthStore } from "~~/stores/auth";
import { useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const cartStore = useCartStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);
const { store_order } = storeToRefs(cartStore);

const type = ref("");

const firstName = ref("");
const lastName = ref("");

const county = ref("");
const address = ref("");
const city = ref("");
const state = ref("");
const postalCode = ref("");
const phoneNumber = ref("");

const contactFirstName = ref("");
const contactLastName = ref("");
const companyName = ref("");
const vatId = ref("");

const submittingGeneralInfo = ref(false);

onMounted(() => {
  if (!store_order.value) {
    throw createError("Print order for this id is undefined");
  }

  if (Object.keys(store_order.value.billing_address).length) {
    type.value =
      store_order.value.billing_address.type || BILLING_ADDRESS_TYPE_INDIVIDUAL;

    firstName.value = store_order.value.billing_address.first_name || "";
    lastName.value = store_order.value.billing_address.last_name || "";

    county.value = store_order.value.billing_address.country || "";
    address.value = store_order.value.billing_address.address || "";
    city.value = store_order.value.billing_address.locality || "";
    state.value = store_order.value.billing_address.state || "";
    postalCode.value = store_order.value.billing_address.postal_code || "";
    phoneNumber.value = store_order.value.billing_address.phone_number || "";

    contactFirstName.value =
      store_order.value.billing_address.contact_first_name || "";
    contactLastName.value =
      store_order.value.billing_address.contact_last_name || "";
    companyName.value = store_order.value.billing_address.company_name || "";
    vatId.value = store_order.value.billing_address.vat_id || "";
  } else if (user?.value?.profile?.billing_address) {
    type.value =
      user?.value?.profile?.billing_address.type ||
      BILLING_ADDRESS_TYPE_INDIVIDUAL;

    firstName.value = user?.value?.profile?.billing_address.first_name || "";
    lastName.value = user?.value?.profile?.billing_address.last_name || "";

    county.value = user?.value?.profile?.billing_address.country || "";
    address.value = user?.value?.profile?.billing_address.address || "";
    city.value = user?.value?.profile?.billing_address.locality || "";
    state.value = user?.value?.profile?.billing_address.state || "";
    postalCode.value = user?.value?.profile?.billing_address.postal_code || "";
    phoneNumber.value =
      user?.value?.profile?.billing_address.phone_number || "";

    contactFirstName.value =
      user?.value?.profile?.billing_address.contact_first_name || "";
    contactLastName.value =
      user?.value?.profile?.billing_address.contact_last_name || "";
    companyName.value =
      user?.value?.profile?.billing_address.company_name || "";
    vatId.value = user?.value?.profile?.billing_address.vat_id || "";
  } else {
    type.value = BILLING_ADDRESS_TYPE_INDIVIDUAL;
  }
});

function onUseDefaultClicked() {
  if (!user.value?.profile?.billing_address) {
    notificationStore.show("Cannot do that", ToastLevel.error());
    return;
  }

  type.value =
    user.value?.profile?.billing_address.type ||
    BILLING_ADDRESS_TYPE_INDIVIDUAL;

  firstName.value = user.value?.profile?.billing_address.first_name || "";
  lastName.value = user.value?.profile?.billing_address.last_name || "";

  county.value = user.value?.profile?.billing_address.country || "";
  address.value = user.value?.profile?.billing_address.address || "";
  city.value = user.value?.profile?.billing_address.locality || "";
  state.value = user.value?.profile?.billing_address.state || "";
  postalCode.value = user.value?.profile?.billing_address.postal_code || "";
  phoneNumber.value = user.value?.profile?.billing_address.phone_number || "";

  contactFirstName.value =
    user.value?.profile?.billing_address.contact_first_name || "";
  contactLastName.value =
    user.value?.profile?.billing_address.contact_last_name || "";
  companyName.value = user.value?.profile?.billing_address.company_name || "";
  vatId.value = user.value?.profile?.billing_address.vat_id || "";
}

function submitHandler() {
  if (!store_order.value) {
    throw createError("Print order for this id is undefined");
  }

  store_order.value.billing_address.type = type.value;

  store_order.value.billing_address.first_name = firstName.value;
  store_order.value.billing_address.last_name = lastName.value;

  store_order.value.billing_address.country = county.value;
  store_order.value.billing_address.address = address.value;
  store_order.value.billing_address.locality = city.value;
  store_order.value.billing_address.state = state.value;
  store_order.value.billing_address.postal_code = postalCode.value;
  store_order.value.billing_address.phone_number = phoneNumber.value;

  store_order.value.billing_address.contact_first_name = contactFirstName.value;
  store_order.value.billing_address.contact_last_name = contactLastName.value;
  store_order.value.billing_address.company_name = companyName.value;
  store_order.value.billing_address.vat_id = vatId.value;

  dialogStore.close();
}
</script>

<style>
</style>