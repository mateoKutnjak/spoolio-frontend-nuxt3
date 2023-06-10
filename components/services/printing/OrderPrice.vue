<template>
  <div class="px-3 py-2 flex items-center ">
    <div class="text-base text-gray-700 font-normal mr-2"> {{ capitalizeOnlyFirstLetter($t('total_price')) }}: </div>

    <div v-if="totalPrice === Number.NEGATIVE_INFINITY">
      <Icon
        class="text-gray-500 -my-10"
        name="eos-icons:three-dots-loading"
        size="50"
      />
    </div>
    <div
      v-else-if="totalPrice === Number.POSITIVE_INFINITY"
      class="mb-0.5 text-error"
    >
      <Icon
        name="lucide:alert-circle"
        size="20"
      />
    </div>
    <div
      v-else-if="totalPrice <= PRINT_ORDER_MIN_PRICE"
      class="flex gap-1 items-center justify-end"
    >
      <div
        class="btn btn-ghost btn-sm gap-2 text-lg text-gray-700"
        @click="notificationStore.show(`${capitalizeOnlyFirstLetter($t('minimum_price_for_printing_order_is'))} ${PRINT_ORDER_MIN_PRICE}€`)"
      >
        <Icon
          class="text-warning"
          name="lucide:alert-triangle"
          size="20"
        />
        €{{totalPrice.toFixed(2) }}
      </div>

    </div>
    <strong
      class="text-lg font-bold text-gray-700 "
      v-else
    >€{{totalPrice.toFixed(2) }}</strong>
  </div>
</template>

<script lang="ts" setup>
import { PRINT_ORDER_MIN_PRICE } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";

const notificationStore = useNotificationStore();

const { totalPrice } = defineProps<{
  totalPrice: number;
}>();
</script>

<style>
</style>