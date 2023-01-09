<template>
  <div class="container p-12">

    <FormKit
      type="form"
      id="print-order-checkout-form"
      @submit="submitHandler"
      :actions="false"
      :incomplete-message="false"
    >
      <div class="relative flex flex-col lg:flex-row gap-6">
        <div class="flex-1 flex flex-col gap-4">
          <div class="card shadow-md border bg-white">
            <div class="card-body gap-5">
              <div class="card-title">1. Email<div class="pt-1">
                </div>
              </div>
              <FormKit
                :type="contactEmailInput"
                name="Contact email"
                validation="required"
                validation-visibility="submit"
              />
            </div>
          </div>
          <div class="card shadow-md border bg-white">
            <div class="card-body gap-5">
              <div class="card-title">
                2. Addresses
              </div>
              <div class="grid grid-cols-2 gap-5">
                <FormKit
                  :type="shippingAddressInput"
                  name="Shipping address"
                  validation="required"
                  validation-visibility="submit"
                />
                <FormKit
                  :type="billingAddressInput"
                  name="Billing address"
                  validation="required"
                  validation-visibility="submit"
                />
              </div>
            </div>
          </div>
          <div class="card shadow-md border bg-white">
            <div class="card-body gap-4">
              <div class="card-title">3. Shipping method</div>
              <FormKit
                :type="shippingMethodInput"
                name="Shipping method"
                validation="required"
                validation-visibility="submit"
              />
            </div>
          </div>
          <div class="card shadow-md border bg-white">
            <div class="card-body gap-4">
              <div class="card-title">4. Payment method</div>
              <StoreCheckoutFormViewPaymentMethod />
            </div>
          </div>
        </div>
        <aside class="flex-1 md:sticky order-first md:order-last top-8 h-full">
          <div class="card shadow-md border bg-white">
            <div class="card-body gap-8">
              <div class="card-title font-medium text-2xl text-gray-700">Order Summary</div>
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
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">Items total price</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">${{(cartStore.getCartTotalPrice).toFixed(2)}}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 py-0 text-base text-start border-b-2 border-gray-500 bg-transparent">
                          <div class="flex gap-1"><strong>Subtotal</strong>(VAT excluded)</div>
                        </td>
                        <td class="py-1 pt-0 text-lg text-end border-b-2 border-gray-500 bg-transparent"> <strong>${{(cartStore.getCartTotalPrice).toFixed(2)}}</strong></td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{`Tax (${taxPercentage * 100}%)`}}</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">${{(cartStore.getCartTotalPrice * taxPercentage).toFixed(2)}}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pt-0 text-base border-b-2 border-gray-500 text-start bg-transparent">Shipping fees</td>
                        <td class="py-1 pt-0 text-lg border-b-2 border-gray-500 text-end bg-transparent">${{shippingMethod.price}}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-2 text-base text-start border-transparent bg-transparent">
                          <div class="flex gap-1"><strong>TOTAL PRICE</strong>(VAT included)</div>
                        </td>
                        <td class="py-2 text-lg text-end border-transparent bg-transparent"> <strong>${{(cartStore.getCartTotalPrice * (1+taxPercentage) + Number(shippingMethod.price)).toFixed(2)}}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex flex-col gap-4">
                  <FormKit
                    type="checkbox"
                    label="I agree to Terms & Condition and the Privacy Policy"
                    name="Terms and Conditions"
                    validation="accepted"
                    validation-visibility="submit"
                    :validation-messages="{
                      accepted: 'Please accept Terms and Conditions'
                    }"
                  />
                  <FormKit
                    type="submit"
                    label="PAY NOW"
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

import FormkitShippingAddress from "~~/components/store/checkout/formkit/ShippingAddress.vue";
import FormkitBillingAddress from "~~/components/store/checkout/formkit/BillingAddress.vue";
import FormkitContactEmail from "~~/components/store/checkout/formkit/ContactEmail.vue";
import FormkitShippingMethod from "~~/components/store/checkout/formkit/ShippingMethod.vue";
import { createInput } from "@formkit/vue";
import { useShippingMethodStore } from "~~/stores/shipping_method";

const taxPercentage = 0.25;

const dialogStore = useDialogStore();
const shippingMethodStore = useShippingMethodStore();

const shippingAddressInput = createInput(FormkitShippingAddress);
const billingAddressInput = createInput(FormkitBillingAddress);
const contactEmailInput = createInput(FormkitContactEmail);
const shippingMethodInput = createInput(FormkitShippingMethod);

const cartStore = useCartStore();

const { cartItems, shippingMethod } = storeToRefs(cartStore);

onMounted(async () => {
  await shippingMethodStore
    .fetchShippingMethods()
    .then(() => {
      console.log("Shipping methods fetched successfuly TODO");
    })
    .catch((err) => console.log("Shipping method fetch error TODO"));

  console.log("Shipping method fetched successfuly TODO");
});

function submitHandler() {
  dialogStore.open("StoreCheckoutCreatingOrderDialog", [], "2xl", true);
}
</script>

<style>
</style>