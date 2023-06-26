<template>
  <div v-if="totalPrice === Number.NEGATIVE_INFINITY">
    <Icon
      class="text-gray-500 -my-10"
      name="eos-icons:three-dots-loading"
      size="50"
    />
  </div>
  <div
    v-else-if="totalPrice === Number.POSITIVE_INFINITY"
    class="text-stone-500 text-xl"
  >
    -
  </div>
  <div
    v-else-if="totalPrice <= PRINT_ORDER_MIN_PRICE"
    class="flex gap-1 items-center justify-end"
  >
    <div
      class="btn btn-ghost btn-sm text-lg"
      @click="notificationStore.show(`${capitalizeOnlyFirstLetter($t('minimum_price_for_printing_order_is'))} ${PRINT_ORDER_MIN_PRICE}€`)"
    >
      <Icon
        class="text-warning"
        name="ph:warning"
        size="20"
      />
      €{{totalPrice.toFixed(2) }}
    </div>

  </div>
  <div
    v-else
    class="flex gap-1 items-center justify-end"
  >
    <div
      class="btn btn-ghost btn-sm text-lg !font-bold btn-disabled"
      @click="notificationStore.show(`${capitalizeOnlyFirstLetter($t('minimum_price_for_printing_order_is'))} ${PRINT_ORDER_MIN_PRICE}€`)"
    >
      €{{totalPrice.toFixed(2) }}
    </div>

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