<template>
    <div
      class="bg-white btn btn-block btn-ghost btn-lg no-animation rounded-md border border-stone-400/80 text-stone-500"
      @click="onSubmit"
    >
      <div
        v-if="paymentMethod"
        class="w-full flex gap-6 font-normal items-center"
      >
        <Icon
          name="ph:money"
          size="30"
        />
        <div class="font-bold text-lg">{{paymentMethod.type}}</div>
        <div class="flex-1"></div>
        <Icon
          name="ph:note-pencil-bold"
          size="25"
        />
      </div>
      <div v-else>
        <div class="flex gap-2 items-center italic font-bold text-gray-500">
          <Icon
            name="ph:plus-square"
            size="20"
          />
          {{ capitalizeOnlyFirstLetter($t('choose') + ' ' + $t('payment_method')) }}
        </div>
      </div>
    </div>
  </template>
    
<script lang="ts" setup>
import { PaymentMethod } from "@stripe/stripe-js";

const props = defineProps(['payment']);
let paymentMethod = null as PaymentMethod | null;

const refresh = computed(() => {
  paymentMethod = props.payment;
  console.log(paymentMethod);
});

function onSubmit() {
    console.log(paymentMethod);
}
</script>

<style>
</style>