<template>
  <div class="container mx-auto">
    <FormKit
      type="form"
      id="print-order-checkout-form"
      @submit="submitHandler"
      :actions="false"
      :incomplete-message="false"
    >
      <div class="relative flex flex-col lg:flex-row gap-6">
        <div class="flex-1 flex flex-col gap-4">
          <div class="card compact px-5 pt-5 shadow border bg-base-100 rounded-none">
            <div class="card-body gap-5">
              <div class="card-title font-normal text-gray-700">1. {{ capitalizeOnlyFirstLetter($t('contact_email')) }}<div class="pt-1">
                </div>
              </div>
              <FormKit
                :type="contactEmailInput"
                name="Contact email"
                v-model="contact_email_ref"
                dialogComponent="FormContactEmail"
                validation="required|email"
                validation-visibility="submit"
                @input="(value) => print_order.contact_email = value"
              />
            </div>
          </div>
          <div class="card compact px-5 pt-5 shadow border bg-base-100 rounded-none">
            <div class="card-body gap-5">
              <div class="card-title font-normal text-gray-700">
                2. {{ capitalizeOnlyFirstLetter($t('addresses')) }}
              </div>
              <div class="flex flex-col">
                <FormKit
                  :type="shippingAddressInput"
                  name="Shipping address"
                  v-model="shipping_address_ref"
                  dialogComponent="FormShippingAddress"
                  validation="required"
                  validation-visibility="submit"
                  @input="(value) => print_order.shipping_address = value"
                />
                <FormKit
                  :type="billingAddressInput"
                  name="Billing address"
                  v-model="billing_address_ref"
                  dialogComponent="FormBillingAddress"
                  validation="required"
                  validation-visibility="submit"
                  @input="(value) => print_order.billing_address = value"
                />
              </div>
            </div>
          </div>
          <div class="card compact px-5 pt-5 shadow border bg-base-100 rounded-none">
            <div class="card-body gap-4">
              <div class="card-title font-normal text-gray-700">3. {{ capitalizeOnlyFirstLetter($t('shipping_method')) }}</div>
              <FormKit
                :type="shippingMethodInput"
                name="Shipping method"
                v-model="shipping_method_ref"
                dialogComponent="FormShippingMethod"
                validation="required"
                validation-visibility="submit"
                @input="(value) => print_order.shipping_method = value"
              />
            </div>
          </div>
          <div class="card compact px-5 py-5 shadow border bg-base-100 rounded-none">
            <div class="card-body gap-4">
              <div class="card-title font-normal text-gray-700">4. {{ capitalizeOnlyFirstLetter($t('payment_method')) }}</div>
              <FormInputPaymentMethod />
            </div>
          </div>
        </div>
        <aside class="flex-1 md:sticky order-first md:order-last top-8 h-full">
          <div class="card shadow-md border bg-white">
            <div class="card-body">
              <div class="flex flex-col gap-10">
                <div class="flex flex-col gap-4">
                  <div class="card-title">{{ capitalizeOnlyFirstLetter($t('items')) }}: {{ units.length }}</div>
                  <div class="flex gap-4 overflow-x-auto pb-1">
                    <div
                      v-for="unit in units"
                      :key="unit.localUrl"
                      class="relative w-24 h-24 border-gray-400 rounded-none"
                    > <nuxt-img :src="unit.screenshotURL">

                      </nuxt-img>
                      <div class="absolute bottom-1 right-2 font-bold text-sm text-gray-600">
                        x{{ unit.quantity }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-4">
                  <div class="card-title">{{ capitalizeOnlyFirstLetter($t('summary')) }}</div>
                  <table class="table table-compact w-full">
                    <tbody class="">
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('items_price')) }}</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">€{{ (totalPrice).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 py-0 text-base text-start border-b-2 border-gray-500 bg-transparent">
                          <div class="flex gap-1"><strong>{{ capitalizeOnlyFirstLetter($t('subtotal')) }}</strong>({{ capitalizeOnlyFirstLetter($t('vat_excluded')) }})</div>
                        </td>
                        <td class="py-1 pt-0 text-lg text-end border-b-2 border-gray-500 bg-transparent"> <strong>€{{ (totalPrice).toFixed(2) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{`${capitalizeOnlyFirstLetter($t('tax'))} (${taxPercentage * 100}%)`}}</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">€{{ (totalPrice * taxPercentage).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pt-0 text-base border-b-2 border-gray-500 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
                        <td class="py-1 pt-0 text-lg border-b-2 border-gray-500 text-end bg-transparent">€{{ Number(print_order?.shipping_method?.price).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-2 text-base text-start border-transparent bg-transparent">
                          <div class="flex gap-1"><strong>{{ $t('total_price').toUpperCase() }}</strong>({{ capitalizeOnlyFirstLetter($t('vat_included')) }})</div>
                        </td>
                        <td class="py-2 text-lg text-end border-transparent bg-transparent"> <strong>€{{ (totalPrice * (1+taxPercentage) + Number(print_order?.shipping_method?.price)).toFixed(2) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex flex-col gap-4">
                  <FormKit
                    type="checkbox"
                    :label="capitalizeOnlyFirstLetter($t('i_agree_to_terms_and_conditions_and_privacy_policy'))"
                    name="Terms and Conditions"
                    validation="accepted"
                    validation-visibility="submit"
                    :validation-messages="{
                      accepted: 'Please accept Terms and Conditions'
                    }"
                  />
                  <FormKit
                    type="submit"
                    :label="$t('pay_now').toUpperCase()"
                    :classes="{
                    input: 'btn btn-primary btn-block text-base'
                  }"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { createInput } from "@formkit/vue";
import { usePrintOrderStore } from "~~/stores/print_order";
import { useShippingMethodStore } from "~~/stores/shipping_method";
import ShippingAddress from "~~/components/form/input/ShippingAddress.vue";
import BillingAddress from "~~/components/form/input/BillingAddress.vue";
import ContactEmail from "~~/components/form/input/ContactEmail.vue";
import ShippingMethod from "~~/components/form/input/ShippingMethod.vue";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "~~/stores/auth";
import {
  IAddressBilling,
  IAddressShipping,
  IShippingMethod,
} from "~~/constants/data";

const shippingAddressInput = createInput(ShippingAddress, {
  props: ["dialogComponent"],
});
const billingAddressInput = createInput(BillingAddress, {
  props: ["dialogComponent"],
});
const contactEmailInput = createInput(ContactEmail, {
  props: ["dialogComponent"],
});
const shippingMethodInput = createInput(ShippingMethod, {
  props: ["dialogComponent"],
});

const taxPercentage = 0.25;

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const shippingMethodStore = useShippingMethodStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { print_order, units } = storeToRefs(printOrderStore);

const contact_email_ref = computed(() => {
  return (
    print_order.value.contact_email ||
    user.value?.profile?.email ||
    user.value?.email ||
    ""
  );
});

const shipping_address_ref = computed(() => {
  return Object.keys(print_order.value.shipping_address).length
    ? print_order.value.shipping_address
    : Object.keys(user.value?.profile?.shipping_address || {}).length
    ? user.value?.profile?.shipping_address
    : <IAddressShipping>{};
});

const billing_address_ref = computed(() => {
  return Object.keys(print_order.value.billing_address).length
    ? print_order.value.billing_address
    : Object.keys(user.value?.profile?.billing_address || {}).length
    ? user.value?.profile?.billing_address
    : <IAddressBilling>{};
});

const shipping_method_ref = computed(() => {
  return print_order.value.shipping_method || <IShippingMethod>{};
});

onMounted(async () => {
  await shippingMethodStore
    .fetchShippingMethods()
    .then(() => {
      console.log("Shipping methods fetched successfuly TODO");
    })
    .catch((err) => notificationStore.showFetchError(err));

  console.log("Shipping method fetched successfuly TODO");
});

const totalPrice = ref<number>(printOrderStore.getTotalPrice);

function submitHandler() {
  dialogStore.open("ServicesPrintingCreatingOrderDialog", {}, "2xl", false);
}
</script>

<style>
</style>