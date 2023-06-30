<template>
  <div class="h-screen w-screen flex flex-col gap-12 justify-center items-center">

    <div class="flex flex-col items-center">

      <div class="text-gray-600 font-base ">
        Powered by
      </div>
      <Icon
        class="h-16"
        name="logos:stripe"
        size="100"
      />
    </div>

    <div class="text-gray-500 font-base">
      {{ capitalizeOnlyFirstLetter($t('you_are_paying_amount_of')) }}
      <strong>{{ amountToPay.toFixed(2) }} EUR </strong>
    </div>

    <form
      id="payment-form"
      class="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col items-center bg-white"
    >

      <div
        id="card-element"
        class="w-full p-4 bg-gray-200 rounded-md"
      >
      </div>
      <div
        id="card-errors"
        role="alert"
      ></div>

      <div
        class="btn btn-primary btn-block mt-5"
        id="submit"
        @click="submitPayment"
      ><span
          v-if="paymentProcessing"
          class="loading loading-spinner"
        ></span>{{ capitalizeOnlyFirstLetter($t('pay')) }}</div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { loadStripe, StripeCardElement } from "@stripe/stripe-js";
import { PAYMENT_ORDER_NAMES, TAX_FRACTION } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";
import { usePaymentStore } from "~~/stores/payment";

definePageMeta({
  layout: "clean",
});

const { t } = useI18n();
const localePath = useLocalePath();

const { order, id } = useRoute().params;

if (!id) {
  console.error("In url /payment/service/id/ id part is null");
  throw createError("In url /payment/service/id/ id part is null");
}

if (!order) {
  console.error("In url /payment/service/id/ service part is null");
  throw createError("In url /payment/service/id/ service part is null");
}

if (typeof order !== "string") {
  console.error("In url /payment/service/id/ service part is not string");
  throw createError("In url /payment/service/id/ service part is not string");
}

console.log(
  "TODO change this. Service in payment/service/id only accepts service=printing for now"
);
const numericId = Number(id);

if (!numericId) {
  console.error("Falsy ID provided in url /payment/service/id/");
  throw createError("Falsy ID provided in url /payment/service/id/");
}

const config = useRuntimeConfig();

const notificationStore = useNotificationStore();
const paymentStore = usePaymentStore();

const paymentProcessing = ref<boolean>(false);

const stripe = await loadStripe(config.stripePublishableApiKey, {
  apiVersion: "2022-11-15",
});

if (!stripe) {
  throw createError(
    "Payment system could not be initialized. Please try again"
  );
}

if (!listContains(PAYMENT_ORDER_NAMES, order.trim())) {
  console.error(`Cannot proceed with payment for order name ${order}`);
  throw createError(`Cannot proceed with payment for order name ${order}`);
}

let amountToPay = 0;

if (order === "printing") {
  const printOrderHistoryStore = usePrintOrderHistoryStore();
  let printOrder = printOrderHistoryStore.getPrintOrderById(numericId);

  if (!printOrder) {
    console.error(
      `Print order with id ${numericId} not found locally. Trying to fetch from server`
    );

    printOrder = await printOrderHistoryStore.fetchPrintOrderById(numericId);

    if (!printOrder) {
      console.error(`Fetching print order with id ${numericId} failed.`);
      throw createError(
        `Your order does not exist. Please create order again.`
      );
    }
  }

  printOrder = await printOrderHistoryStore.fetchPrintOrderById(numericId);

  if (!printOrder) {
    console.error(`Fetching print order with id ${numericId} failed.`);
    throw createError(`Your order does not exist. Please create order again.`);
  }

  amountToPay =
    Number(printOrder.estimated_price) * (1 + TAX_FRACTION) +
    Number(printOrder.shipping_method.price);
} else if (order === "modeling") {
  const modelingOrderHistoryStore = useModelingOrderHistoryStore();
  let modelingOrder = modelingOrderHistoryStore.getOrderById(numericId);

  if (!modelingOrder) {
    console.error(
      `Print order with id ${numericId} not found locally. Trying to fetch from server`
    );

    modelingOrder = await modelingOrderHistoryStore.fetchById(numericId);

    if (!modelingOrder) {
      console.error(`Fetching modeling order with id ${numericId} failed.`);
      throw createError(
        `Your order does not exist. Please create order again.`
      );
    }
  }

  amountToPay = Number(modelingOrder.estimated_price) * (1 + TAX_FRACTION);
} else if (order === "store") {
  const storeOrderHistoryStore = useStoreOrderHistoryStore();
  let storeOrder = storeOrderHistoryStore.getOrderById(numericId);

  if (!storeOrder) {
    console.error(
      `Store order with id ${numericId} not found locally. Trying to fetch from server`
    );

    storeOrder = await storeOrderHistoryStore.fetchById(numericId);

    if (!storeOrder) {
      console.error(`Fetching store order with id ${numericId} failed.`);
      throw createError(
        `Your order does not exist. Please create order again.`
      );
    }
  }

  const items_price = storeOrder.items.reduce((acc, el) => {
    return acc + el.quantity * el.item.price;
  }, 0);

  amountToPay =
    Number(items_price) * (1 + TAX_FRACTION) +
    Number(storeOrder.shipping_method.price);
} else {
  throw createError(`Cannot proceed with checkout for order type ${order}`);
}

const { data, pending, error, refresh } = await useAsyncData(
  "payment_intent",
  () =>
    paymentStore.createPaymentIntent(
      order,
      numericId,
      amountToPay // Stripe has cents format for amount
    )
);

if (!data.value || error.value) {
  throw createError(error.value?.message || "Error occurred");
}

let card = null as StripeCardElement | null;

onMounted(() => {
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
    },
  };

  card = elements.create("card", { style: style });

  card.mount("#card-element");

  card.on("change", ({ error }) => {
    let displayError = document.getElementById("card-errors");
    if (error) {
      displayError!.textContent = error.message;
    } else {
      displayError!.textContent = "";
    }
  });
});

function submitPayment() {
  paymentProcessing.value = true;

  stripe!
    .confirmCardPayment(data.value!.clientSecret, {
      payment_method: {
        card: card!,
        // billing_details: {
        //   name: "Jenny Rosen",
        // },
      },
    })
    .then(function (result) {
      if (result.error) {
        // Show error to your customer (for example, insufficient funds)
        console.log(`Payment error = ${result.error.message}`);

        navigateTo(localePath("/"));
        notificationStore.show(
          result.error.message?.toString() || "Error occurred",
          ToastLevelType.error
        );
      } else {
        console.log(`PaymentIntent status = ${result.paymentIntent.status}`);

        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.

          navigateTo(localePath("/"));
          notificationStore.show(
            capitalizeOnlyFirstLetter(
              t("payment_successfull_check_your_email")
            ),
            ToastLevelType.success
          );

          // Order update happens with stripe webhooks on server
        }
      }
    })
    .finally(() => {
      paymentProcessing.value = false;
    });
}
</script>

<style scoped>
form {
  width: 30vw;
  min-width: 500px;
  align-self: center;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
  padding: 40px;
}

.hidden {
  display: none;
}

#payment-message {
  color: rgb(105, 115, 134);
  font-size: 16px;
  line-height: 20px;
  padding-top: 12px;
  text-align: center;
}

#payment-element {
  margin-bottom: 24px;
}

/* Buttons and links */
button {
  background: #5469d4;
  font-family: Arial, sans-serif;
  color: #ffffff;
  border-radius: 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}

/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: "";
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: #5469d4;
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: #5469d4;
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}

@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@media only screen and (max-width: 600px) {
  form {
    width: 80vw;
    min-width: initial;
  }
}
</style>