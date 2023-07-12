<template>
  <div class="container mx-auto max-w-7xl flex flex-col gap-8 text-stone-600 px-0 md:px-12 py-12">
    <ServicesPrintingStepsPreview
      class="px-12 md:px-0"
      :current-step-index="1"
      :steps="[$t('import_3d_models'), $t('shipping') + ' ' + $t('and') + ' ' + $t('payment'), $t('finish_order')]"
      :icon-names="['ph:file-arrow-up', 'ph:truck', 'ph:credit-card']"
    />
    <FormKit
      type="form"
      id="print-order-checkout-form"
      @submit="submitHandler"
      :actions="false"
      :incomplete-message="false"
    >
      <div class="relative flex flex-col lg:flex-row gap-6">
        <div class="md:px-0 px-6 flex-1 flex flex-col gap-4">
          <FormKit
            :type="contactEmailInput"
            name="Contact email"
            v-model="contact_email_ref"
            dialogComponent="FormContactEmail"
            validation="required|email"
            validation-visibility="submit"
            @input="(value) => print_order.contact_email = value"
          />
          <div class="bg-white p-5 flex flex-col gap-2 border border-stone-400/80 rounded-md">
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
                @input="(value) => print_order.shipping_address = value"
              />
              <div @click="() => null">
                <FormKit
                  :key="billing_address_ref"
                  :disabled="useBillingSameAsShippingAddress"
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
            <div class="flex gap-1 items-end text-lg text-stone-500">
              <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate">
                <input
                  type="checkbox"
                  v-model="useBillingSameAsShippingAddress"
                />
                <Icon
                  name="ph:square"
                  class="swap-off text-gray-500"
                  size="24"
                />
                <Icon
                  name="ph:check-square"
                  class="swap-on text-gray-500"
                  size="24"
                />
              </label>
              {{ capitalizeOnlyFirstLetter($t('billing_address_same_as_shipping_address')) }}
            </div>
          </div>
          <FormKit
            :type="shippingMethodInput"
            name="Shipping method"
            v-model="shipping_method_ref"
            dialogComponent="FormShippingMethod"
            validation="required"
            validation-visibility="submit"
            @input="(value) => print_order.shipping_method = value"
          />
          <FormInputPaymentMethod />
        </div>
        <aside class="md:px-0 px-6 flex-1 md:sticky order-first md:order-last top-8 h-full">
          <div class="card border border-stone-400/80 rounded-md bg-white">
            <div class="card-body">
              <div class="flex flex-col gap-5">
                <div class="text-3xl font-semibold">{{ capitalizeOnlyFirstLetter($t('order_summary')) }}</div>
                <div class="p-4 pt-2 flex flex-col gap-1 border border-stone-400/80 rounded-md">
                  <div class="flex gap-2 justify-between">
                    <div class="text-lg">{{ capitalizeOnlyFirstLetter($t('items')) }}</div>
                    <NuxtLink to="/services/printing">
                      <div class="btn btn-outline btn-info btn-xs text-base">
                        <Icon
                          name="ph:pencil"
                          class="mb-0.5"
                        />
                        {{ capitalizeFirstLetter($t('edit')) }}
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="flex flex-wrap gap-4 overflow-x-auto">
                    <div
                      v-for="unit in units"
                      :key="unit.localUrl"
                      class="relative w-24 h-24 border border-gray-400 rounded-md"
                    > <nuxt-img
                        class="rounded-md"
                        :src="unit.screenshotURL"
                      >

                      </nuxt-img>
                      <div class="absolute bottom-1 right-2 font-bold text-sm text-gray-600">
                        x{{ unit.quantity }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-4 text-sm">
                  <table class="table table-compact w-full text-lg font-semibold text-stone-500">
                    <tbody class="">
                      <tr class="border-none">
                        <td class="pl-0 py-1 pb-0 text-start">{{ capitalizeOnlyFirstLetter($t('items_price')) }} ({{ $t('vat_excluded') }})</td>
                        <td class="py-1 pb-0 text-xl font-bold border-none text-end">€{{ (totalPrice).toFixed(2) }}</td>
                      </tr>
                      <tr class="border-none">
                        <td class="pl-0 py-1 pb-0 border-transparent text-start bg-transparent">{{`${$t('tax').toUpperCase()} (${taxPercentage * 100}%)`}}</td>
                        <td class="py-1 pb-0 text-xl font-bold border-transparent text-end bg-transparent">€{{ (totalPrice * taxPercentage).toFixed(2) }}</td>
                      </tr>
                      <tr class="border-none">
                        <td class="pl-0 py-1 pt-0 border-b border-stone-400/80 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
                        <td class="py-1 pt-0 text-xl font-bold border-b border-stone-400/80 text-end bg-transparent">€{{ Number(print_order?.shipping_method?.price).toFixed(2) }}</td>
                      </tr>
                      <tr class="border-none text-2xl">
                        <td class="pl-0 py-2 text-start border-transparent bg-transparent">
                          <div class="flex gap-1"><strong>{{ $t('total_price').toUpperCase() }}</strong></div>
                        </td>
                        <td class="py-2 text-end border-transparent bg-transparent"> <strong>€{{ (totalPrice * (1+taxPercentage) + Number(print_order?.shipping_method?.price)).toFixed(2) }}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex flex-col gap-4">
                  <div class="flex gap-1 items-start">
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
                    <div class="space-x-1 ml-2 text-lg font-medium">
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

const useBillingSameAsShippingAddress = ref(false);

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
  dialogStore.open(
    "ServicesPrintingCreatingOrderDialog",
    {},
    undefined,
    "2xl",
    false
  );
}

watch(useBillingSameAsShippingAddress, (value) => {
  if (value) {
    printOrderStore.setBillingAddressSameAsShippingAddress();
  }
});
</script>

<style>
</style>