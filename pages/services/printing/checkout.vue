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
            outer-class="!mb-0"
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
            outer-class="!mb-0"
            :type="shippingMethodInput"
            name="Shipping method"
            v-model="shipping_method_ref"
            dialogComponent="FormShippingMethod"
            validation="required"
            validation-visibility="submit"
            @input="(value) => print_order.shipping_method = value"
          />
          <FormPaymentMethod
            :payment_num="payment_num"
            :payment_card="payment_card"
            @click="onPaymentEdit"
          />
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
                      <div class="absolute top-1 right-2 font-bold text-sm text-gray-600">
                        {{ unit.printing_method.name }} - {{ unit.spool.material.name}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-4 text-sm">
                  <table class="table table-compact w-full text-lg font-semibold text-stone-500">
                    <tbody class="">
                      <tr class="border-none">
                        <td class="pl-0 py-1 pb-0 text-start">{{ capitalizeOnlyFirstLetter($t('items_price')) }}</td>
                        <td class="py-1 pb-0 text-xl font-bold border-none text-end">€{{ (totalPrice).toFixed(2) }}</td>
                      </tr>
                      <tr v-if="taxPercentage > 0" class="border-none">
                        <td class="pl-0 py-1 pb-0 border-transparent text-start bg-transparent">{{`${$t('tax').toUpperCase()} (${taxPercentage * 100}%)`}}</td>
                        <td class="py-1 pb-0 text-xl font-bold border-transparent text-end bg-transparent">€{{ (totalPrice * taxPercentage).toFixed(2) }}</td>
                      </tr>
                      <tr class="border-none">
                        <td class="pl-0 py-1 pt-0 border-b border-stone-400/80 text-start bg-transparent">{{ capitalizeOnlyFirstLetter($t('shipping_fee')) }}</td>
                        <td class="py-1 pt-0 text-xl font-bold border-b border-stone-400/80 text-end bg-transparent">€{{ Number(print_order?.shipping_method?.price).toFixed(2) }}</td>
                      </tr>
                      <tr class="border-none text-2xl">
                        <td class="pl-0 py-2 border-b border-stone-400/80 text-start bg-transparent">
                          <div class="flex gap-1 "><strong>{{ $t('total_price').toUpperCase() }}</strong></div>
                        </td>
                        <td class="py-2 text-end border-b border-stone-400/80 bg-transparent"> <strong>€{{ (totalPrice * (1+taxPercentage) + Number(print_order?.shipping_method?.price)).toFixed(2) }}</strong></td>
                      </tr>
                      <tr class="border-none text-2xl">
                        <td class="pl-0 py-2 text-start border-transparent bg-transparent">
                          <div class="text-xl font-semibold"> {{ $t('eta').toUpperCase() }} ({{ $t('without_delivery') }}): </div>
                        </td>
                        <td class="py-2 text-end border-transparent bg-transparent"> <strong>
                            <ServicesPrintingOrderETA
                              class="-mr-4"
                              :eta="eta"
                            />
                          </strong></td>
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
                      <NuxtLink :to="localePath('/privacy-policy')"><span class="link link-primary">
                          {{ $t('privacy_policy__instrumental') }}
                        </span>
                      </NuxtLink>
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
import { PAYMENT_ORDER_NAMES } from "~~/constants/constants";
import { createInput } from "@formkit/vue";
import { usePrintOrderStore } from "~~/stores/print_order";
import { usePaymentStore } from "~~/stores/payment";
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
  IPrintOrderUnit,
  IShippingMethod,
} from "~~/constants/data";
import { loadStripe, PaymentMethod, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from "@stripe/stripe-js";

const order = "printing";

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

const config = useRuntimeConfig();

const stripe = await loadStripe(config.stripePublishableApiKey, {
  apiVersion: "2022-11-15",
});

let card_num = null as StripeCardNumberElement | null;
let card_exp = null as StripeCardExpiryElement | null;
let card_cvc = null as StripeCardCvcElement | null;

const taxPercentage = 0;

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();
const shippingMethodStore = useShippingMethodStore();
const printOrderStore = usePrintOrderStore();
const paymentStore = usePaymentStore();

const { user } = storeToRefs(authStore);
const { print_order, units } = storeToRefs(printOrderStore);

const useBillingSameAsShippingAddress = ref(false);
let paymentMethod = null as PaymentMethod | null;

let intentId = '';
let clientSecret = '';

const payment_num = ref('');
const payment_card = ref('');

const localePath = useLocalePath();

const eta = computed(() => {
  return printOrderStore.getETA;
});

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

  await paymentStore
    .initPaymentIntent(order)
    .then((data) => {
      intentId = data.intentId;
      clientSecret = data.clientSecret;
    })
    .catch((err) => notificationStore.showFetchError(err));
  
  await printOrderStore
    .estimatePrintJobsOnly()
    .then(() => {
      console.log("Estimated time calculated!");
    });
  
  await shippingMethodStore
    .fetchShippingMethods()
    .then(() => {
      console.log("Shipping methods fetched successfuly TODO");
    })
    .catch((err) => notificationStore.showFetchError(err));

  console.log("Shipping method fetched successfuly TODO");

  const units_test = printOrderStore.getUnits as IPrintOrderUnit[];
  units_test.forEach((u) => {
    console.log("Unit quantity: %o, Unit estimated time: %o", u.quantity, u.estimated_time/3600);
  })

  if (!stripe) {
    throw createError(
      "Payment system could not be initialized. Please try again"
    );
  }else{
    const style = {
      base: {
        iconColor: '#EF7745',
        color: '#191816',
        fontWeight: '500',
        fontFamily: 'Rajdhani',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#191816',
        },
        '::placeholder': {
          color: '#b3b2af',
        },
      },
      invalid: {
        iconColor: '#e75f6b',
        color: '#e75f6b',
      },
    }  
    var elements = stripe.elements();

    card_num = elements.create("cardNumber", {style: style});
    card_exp = elements.create("cardExpiry", {style: style});
    card_cvc = elements.create("cardCvc", {style: style});

    card_num.on("change", ({ error }) => {
      let displayError = document.getElementById("card-num-error");
      if (error) {
        displayError!.textContent = error.message;
      } else {
        displayError!.textContent = "";
      }
    });
    card_exp.on("change", ({ error }) => {
      let displayError = document.getElementById("card-exp-error");
      if (error) {
        displayError!.textContent = error.message;
      } else {
        displayError!.textContent = "";
      }
    });
    card_cvc.on("change", ({ error }) => {
      let displayError = document.getElementById("card-cvc-error");
      if (error) {
        displayError!.textContent = error.message;
      } else {
        displayError!.textContent = "";
      }
    });
  }
  
});

onUnmounted(async () => {

  await printOrderStore
    .clearCheckoutJobs()
    .then(() => {
      printOrderStore.clearJobIds();
      console.log("Clear Jobs Request Sent!");
    });  

});

const totalPrice = ref<number>(printOrderStore.getTotalPrice);

function saveCard(){
  console.log("Saved card data!");
  if (card_num){
    stripe!.createPaymentMethod({
      type: 'card',
      card: card_num            
    })
    .then((result) => {
      if (result.error) {
        // Show error to your customer (for example, insufficient funds)
        console.log(`Payment error = ${result.error.message}`);

        notificationStore.show(
          result.error.message?.toString() || "Error occurred",
          ToastLevelType.error
        );
        paymentMethod = null;
        payment_num.value = '';
        payment_card.value = '';  
      } else {
        paymentMethod = result.paymentMethod;
        if (paymentMethod.card){
          payment_num.value = paymentMethod.card.last4;
          payment_card.value = paymentMethod.card.brand;          
        }        
        console.log("Parent num: %s", payment_num.value);
        dialogStore.close();
      }
    })
  }
  
}

async function makePayment(orderId: number){
  console.log("MAKING PAYMENT FOR ORDER %d", orderId);
  if (card_num && clientSecret && stripe){
    if (clientSecret.length > 0){
      await paymentStore
        .modifyPaymentIntent(intentId, orderId)
        .then((data) => {
          console.log("Added amount and order data to payment!");
        })
        .catch((err) => notificationStore.showFetchError(err));


      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod?.id
      })
      .then((result) => {
        if (result.error) {
          // Show error to your customer (for example, insufficient funds)
          console.log(`Payment error = ${result.error.message}`);

          dialogStore.close();
          navigateTo(localePath("/profile/order-history/"));
          notificationStore.show(
            result.error.message?.toString() || "Error occurred",
            ToastLevelType.error
          );
        } else {
          console.log(`PaymentIntent status = ${result.paymentIntent.status}`);

          // The payment has been processed!
          if (result.paymentIntent.status === "requires_capture") {
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.

            dialogStore.close();

            dialogStore.open(
              "DialogSuccess",
              {
                title: "success",
                message: "payment_successfull_check_your_email",
                onClose: () => {
                  navigateTo(localePath("/profile/order-history/"));
                },
              },
              undefined,
              undefined,
              false
            );

            // Order update happens with stripe webhooks on server
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } 
  }
}

function onPaymentEdit(){
  dialogStore.openEmits(
    "FormPaymentMethod2",
    {
      card_num: card_num,
      card_exp: card_exp,
      card_cvc: card_cvc
    },
    undefined,
    "lg",
    true,
    saveCard
  );
}

function submitHandler() {
  if (clientSecret){
    if (clientSecret.length > 0){
      dialogStore.openEmits(
        "ServicesPrintingCreatingOrderDialog",
        {},
        undefined,
        "lg",
        true,
        makePayment
      );
    }
  }    
}

watch(useBillingSameAsShippingAddress, (value) => {
  if (value) {
    printOrderStore.setBillingAddressSameAsShippingAddress();
  }
});
</script>

<style>
</style>