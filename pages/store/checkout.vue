<template>
  <div class="container p-12">
    <div class="flex gap-5">
      <div class="flex-1 flex flex-col gap-4">
        <div class="card shadow-md border border-gray-300 rounded-lg bg-white">
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
        <div class="card shadow-md border border-gray-300 rounded-lg bg-white">
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
        <div class="card shadow-md border border-gray-300 rounded-lg bg-white">
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
        <div class="card shadow-md border border-gray-300 rounded-lg bg-white">
          <div class="card-body gap-4">
            <div class="card-title">4. Payment method</div>
            <ServicesPrintingCheckoutPaymentMethodOverview />
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-5">
          <div class="card border border-gray-300 rounded-lg bg-white shadow-md">
            <div class="card-body gap-0">
              <div class="card-title justify-between mb-8">
                <div class="text-2xl font-medium text-gray-700 ">Your Items</div>
                <div class="btn btn-ghost btn-circle">
                  <Icon
                    name="mdi:dots-vertical"
                    size="20"
                  />
                </div>
              </div>
              <div
                v-for="cartItem, index in cartItems.keys()"
                :key="cartItem.id"
              >
                <StoreCheckoutItem
                  :id="cartItem.id"
                  class="text-gray-700"
                />
                <div
                  v-if="index < cartItems.size-1"
                  class="divider"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";

import FormkitShippingAddress from "~~/components/formkit/ShippingAddress.vue";
import FormkitBillingAddress from "~~/components/formkit/BillingAddress.vue";
import FormkitContactEmail from "~~/components/formkit/ContactEmail.vue";
import FormkitShippingMethod from "~~/components/formkit/ShippingMethod.vue";
import { createInput } from "@formkit/vue";

const shippingAddressInput = createInput(FormkitShippingAddress);
const billingAddressInput = createInput(FormkitBillingAddress);
const contactEmailInput = createInput(FormkitContactEmail);
const shippingMethodInput = createInput(FormkitShippingMethod);

const cartStore = useCartStore();

const { cartItems } = storeToRefs(cartStore);
</script>

<style>
</style>