<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">

    <FormKit
      type="form"
      id="print-order-checkout-form"
      @submit="submitHandler"
      :actions="false"
      :incomplete-message="false"
    >
      <div class="relative flex flex-col lg:flex-row gap-6">
        <div class="flex-1 flex flex-col gap-4">

          <FormKit
            :type="contactEmailInput"
            name="Contact email"
            v-model="contact_email_ref"
            dialogComponent="FormContactEmail"
            validation="required|email"
            validation-visibility="submit"
            @input="(value) => store_order.contact_email = value"
          />
          <div class="p-5 flex flex-col gap-2 border border-stone-400/80 rounded-md">
            <div class="mb-2 flex gap-3 items-center text-stone-500">
              <Icon
                name="ph:house"
                size="30"
              />
              <div class="font-bold"> {{ capitalizeOnlyFirstLetter($t('addresses')) }}</div>
            </div>
            <div class="grid gap-6 sm:grid-cols-2 grid-cols-1">
              <FormKit
                :type="shippingAddressInput"
                name="Shipping address"
                v-model="shipping_address_ref"
                dialogComponent="FormShippingAddress"
                validation="required"
                validation-visibility="submit"
                @input="(value) => store_order.shipping_address = value"
              />
              <FormKit
                :type="billingAddressInput"
                name="Billing address"
                v-model="billing_address_ref"
                dialogComponent="FormBillingAddress"
                validation="required"
                validation-visibility="submit"
                @input="(value) => store_order.billing_address = value"
              />
            </div>
          </div>

          <FormKit
            :type="shippingMethodInput"
            name="Shipping method"
            v-model="shipping_method_ref"
            dialogComponent="FormShippingMethod"
            validation="required"
            validation-visibility="submit"
            @input="(value) => store_order.shipping_method = value"
          />
          <FormInputPaymentMethod />
        </div>
        <aside class="flex-1 md:sticky order-first md:order-last top-8 h-full">
          <div class="card shadow-md border border-stone-400/80 rounded-md bg-white">
            <div class="card-body gap-8">
              <div class="card-title font-medium text-2xl text-gray-700">{{ capitalizeOnlyFirstLetter($t('order_summary')) }}</div>
              <div class="flex flex-col gap-10">

                <div
                  v-for="cartItemId in cartItems.keys()"
                  :key="cartItemId"
                >
                  <StoreCheckoutItemCompact
                    :id="cartItemId"
                    class="text-gray-700"
                  />
                </div>

                <div class="divider m-0"></div>

                <div class="flex flex-col gap-4">
                  <table class="table table-compact w-full">
                    <tbody class="">
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('items_price')) }}</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">€{{ (cartStore.getCartTotalPrice).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 py-0 text-base text-start border-b-2 border-gray-500 bg-transparent">
                          <div class="flex gap-1"><strong>{{ capitalizeOnlyFirstLetter($t('subtotal')) }}</strong>({{ capitalizeOnlyFirstLetter($t('vat_excluded')) }})</div>
                        </td>
                        <td class="py-1 pt-0 text-lg text-end border-b-2 border-gray-500 bg-transparent"> <strong>€{{ (cartStore.getCartTotalPrice).toFixed(2) }}</strong></td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{`${capitalizeOnlyFirstLetter($t('tax'))} (${taxPercentage * 100}%)`}}</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">€{{ (cartStore.getCartTotalPrice * taxPercentage).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pt-0 text-base border-b-2 border-gray-500 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
                        <td class="py-1 pt-0 text-lg border-b-2 border-gray-500 text-end bg-transparent">€{{ Number(store_order?.shipping_method?.price).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-2 text-base text-start border-transparent bg-transparent">
                          <div class="flex gap-1"><strong>{{ $t('total_price').toUpperCase() }}</strong>({{ capitalizeOnlyFirstLetter($t('vat_included')) }})</div>
                        </td>
                        <td class="py-2 text-lg text-end border-transparent bg-transparent"> <strong>€{{ (cartStore.getCartTotalPrice * (1+taxPercentage) + Number(store_order?.shipping_method?.price)).toFixed(2) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex flex-col gap-4">

                  <div class="flex gap-1">
                    <FormKit
                      type="checkbox"
                      name="Terms and Conditions"
                      validation="accepted"
                      validation-visibility="submit"
                      :validation-messages="{
                        accepted: 'Please accept Terms and Conditions'
                      }"
                      :classes="{
                        messages: '-mr-96'
                      }"
                    />
                    <div class="flex gap-1 mt-1 ml-1">
                      <span>
                        {{ capitalizeOnlyFirstLetter($t('i_agree_with')) }}
                      </span>
                      <span class="link link-primary">
                        {{ $t('terms_and_conditions') }}
                      </span>
                      <span>
                        {{ $t('and') }}
                      </span>
                      <span class="link link-primary">
                        {{ $t('privacy_policy__instrumental') }}
                      </span>
                    </div>
                  </div>
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
import { useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";
import ShippingAddress from "~~/components/form/input/ShippingAddress.vue";
import BillingAddress from "~~/components/form/input/BillingAddress.vue";
import ContactEmail from "~~/components/form/input/ContactEmail.vue";
import ShippingMethod from "~~/components/form/input/ShippingMethod.vue";
import { createInput } from "@formkit/vue";
import { useShippingMethodStore } from "~~/stores/shipping_method";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "~~/stores/auth";
import {
  IAddressBilling,
  IAddressShipping,
  IShippingMethod,
} from "~~/constants/data";

const taxPercentage = 0.25;

const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const shippingMethodStore = useShippingMethodStore();

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

const authStore = useAuthStore();
const cartStore = useCartStore();

const { user } = storeToRefs(authStore);
const { cartItems, store_order } = storeToRefs(cartStore);

const contact_email_ref = computed(() => {
  return (
    store_order.value.contact_email ||
    user.value?.profile?.email ||
    user.value?.email ||
    ""
  );
});

const shipping_address_ref = computed(() => {
  return Object.keys(store_order.value.shipping_address).length
    ? store_order.value.shipping_address
    : Object.keys(user.value?.profile?.shipping_address || {}).length
    ? user.value?.profile?.shipping_address
    : <IAddressShipping>{};
});

const billing_address_ref = computed(() => {
  return Object.keys(store_order.value.billing_address).length
    ? store_order.value.billing_address
    : Object.keys(user.value?.profile?.billing_address || {}).length
    ? user.value?.profile?.billing_address
    : <IAddressBilling>{};
});

const shipping_method_ref = computed(() => {
  return store_order.value.shipping_method || <IShippingMethod>{};
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

function submitHandler() {
  dialogStore.open(
    "StoreCheckoutCreatingOrderDialog",
    {},
    undefined,
    "lg",
    true
  );
}
</script>

<style>
</style>