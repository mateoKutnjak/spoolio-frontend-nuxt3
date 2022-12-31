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
              <ServicesPrintingCheckoutPaymentMethodOverview />
            </div>
          </div>
        </div>
        <aside class="flex-1 md:sticky order-first md:order-last top-8 h-full">
          <div class="card shadow-md border bg-white">
            <div class="card-body">
              <div class="flex flex-col gap-10">
                <div class="flex flex-col gap-4">
                  <div class="card-title">Items: {{ units.length }}</div>
                  <div class="flex gap-4 overflow-x-auto pb-1">
                    <div
                      v-for="unit in units"
                      :key="unit.localUrl"
                      class="btn btn-square btn-lg btn-outline rounded-none text-xs font-normal"
                    >Preview static image with x{number of items}</div>
                  </div>
                </div>
                <div class="flex flex-col gap-4">
                  <div class="card-title">Summary</div>
                  <table class="table table-compact w-full">
                    <tbody class="">
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">Items total price</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">${{(totalPrice).toFixed(2)}}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 py-0 text-base text-start border-b-2 border-gray-500 bg-transparent">
                          <div class="flex gap-1"><strong>Subtotal</strong>(VAT excluded)</div>
                        </td>
                        <td class="py-1 pt-0 text-lg text-end border-b-2 border-gray-500 bg-transparent"> <strong>${{(totalPrice).toFixed(2)}}</strong></td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pb-0 text-base border-transparent text-start bg-transparent">{{`Tax (${taxPercentage * 100}%)`}}</td>
                        <td class="py-1 pb-0 text-lg border-transparent text-end bg-transparent">${{(totalPrice * taxPercentage).toFixed(2)}}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-1 pt-0 text-base border-b-2 border-gray-500 text-start bg-transparent">Shipping fees</td>
                        <td class="py-1 pt-0 text-lg border-b-2 border-gray-500 text-end bg-transparent">${{shippingMethod.price}}</td>
                      </tr>
                      <tr>
                        <td class="pl-0 py-2 text-base text-start border-transparent bg-transparent">
                          <div class="flex gap-1"><strong>TOTAL PRICE</strong>(VAT included)</div>
                        </td>
                        <td class="py-2 text-lg text-end border-transparent bg-transparent"> <strong>${{(totalPrice * (1+taxPercentage) + Number(shippingMethod.price)).toFixed(2)}}</strong></td>
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
import { createInput } from "@formkit/vue";
import { useAuthStore } from "~~/stores/auth";
import { usePrintOrderStore } from "~~/stores/print_order";
import { useShippingMethodStore } from "~~/stores/shipping_method";
import FormkitShippingAddress from "~~/components/formkit/ShippingAddress.vue";
import FormkitBillingAddress from "~~/components/formkit/BillingAddress.vue";
import FormkitContactEmail from "~~/components/formkit/ContactEmail.vue";
import FormkitShippingMethod from "~~/components/formkit/ShippingMethod.vue";
import { useDialogStore } from "~~/stores/dialog";

const shippingAddressInput = createInput(FormkitShippingAddress);
const billingAddressInput = createInput(FormkitBillingAddress);
const contactEmailInput = createInput(FormkitContactEmail);
const shippingMethodInput = createInput(FormkitShippingMethod);

const taxPercentage = 0.25;

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const shippingMethodStore = useShippingMethodStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { contactEmail, units, shippingAddress, shippingMethod } =
  storeToRefs(printOrderStore);

onMounted(async () => {
  await shippingMethodStore
    .fetchShippingMethods()
    .then(() => {
      console.log("Shipping methods fetched successfuly TODO");
    })
    .catch((err) => console.log("Shipping method fetch error TODO"));

  console.log("Shipping method fetched successfuly TODO");
});

const totalPrice = ref<number>(
  units.value.reduce(
    (acc, item) => Number(acc) + Number(item.estimatedPrice * item.quantity),
    0
  )
);

function submitHandler() {
  dialogStore.open("ServicesPrintingCreatingOrderDialog", [], "2xl", false);
}
</script>

<style>
</style>