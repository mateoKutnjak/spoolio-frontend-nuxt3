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
      You are paying for print order amount of
      <strong>{{ printOrder?.estimated_price }} EUR </strong>
    </div>

    <form
      id="payment-form"
      class="w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col items-center"
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
        :class="paymentProcessing ? 'loading' : ''"
        id="submit"
        @click="submitPayment"
      >Pay</div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { order } from "@formkit/i18n";
import { loadStripe, StripeCardElement } from "@stripe/stripe-js";
import { ServiceType } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";
import { usePaymentStore } from "~~/stores/payment";

definePageMeta({
  layout: false,
});

const { id } = useRoute().params;

if (!id) {
  console.error("In url /payment/service/id/ id part is null");
  throw createError("In url /payment/service/id/ id part is null");
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
const printOrderHistoryStore = usePrintOrderHistoryStore();

const paymentProcessing = ref<boolean>(false);

const stripe = await loadStripe(config.stripePublishableKeyTest, {
  apiVersion: "2022-11-15",
});

if (!stripe) {
  throw createError(
    "Payment system could not be initialized. Please try again"
  );
}

let printOrder = printOrderHistoryStore.getPrintOrderById(numericId);

if (!printOrder) {
  console.error(
    `Print order with id ${numericId} not found locally. Trying to fetch from server`
  );

  printOrder = await printOrderHistoryStore.fetchPrintOrderById(numericId);

  if (!printOrder) {
    console.error(`Fetching print order with id ${numericId} failed.`);
    throw createError(`Your order does not exist. Please create order again.`);
  }
}

const { data, pending, error, refresh } = await useAsyncData(
  "payment_intent",
  () =>
    paymentStore.createPaymentIntent(
      ServiceType.printing,
      printOrder!.id,
      printOrder!.estimated_price * 100 // Stripe has cents format for amount
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

        navigateTo("/");
        notificationStore.show(
          result.error.message?.toString() || "Error occurred",
          ToastLevel.error()
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

          printOrderHistoryStore
            .updatePrintOrderStatusById(numericId, "in_progress")
            .then(() => {
              navigateTo("/");
              notificationStore.show(
                "Payment successful. Check your email. [TODO]",
                ToastLevel.success()
              );
            });
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