<template>
    <form
      id="payment-form"
      class="w-full flex flex-col items-center bg-white gap-2"
    >
      <div
        id="card-num"
        class="w-full p-4 bg-gray-200 rounded-md"
      >
      </div>
      <div
        id="card-num-error"
        role="alert"
      ></div>
      <div
        id="card-exp"
        class="w-full p-4 bg-gray-200 rounded-md"
      >
      </div>
      <div
        id="card-exp-error"
        role="alert"
      ></div>
      <div
        id="card-cvc"
        class="w-full p-4 bg-gray-200 rounded-md"
      >
      </div>
      <div
        id="card-cvc-error"
        role="alert"
      ></div>

      <div
        class="btn btn-primary btn-block mt-5"
        id="submit"
        @click="onSubmit"       
      >
      {{ capitalizeOnlyFirstLetter($t('pay')) }}
        </div>
    </form>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";
import { StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from "@stripe/stripe-js";

const printOrderStore = usePrintOrderStore();

const {card_num, card_exp, card_cvc} = defineProps({
    card_num: Object,
    card_exp: Object,
    card_cvc: Object
});

const emit = defineEmits(['action']);

const { print_order } = storeToRefs(printOrderStore);

onMounted(() => {
    card_num?.mount('#card-num');
    card_exp?.mount('#card-exp');
    card_cvc?.mount('#card-cvc');

});

function onSubmit() {    
    emit('action');
}
</script>

<style>
</style>