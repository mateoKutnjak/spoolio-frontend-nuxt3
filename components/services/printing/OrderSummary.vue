<template>
  <div class="p-2 flex flex-col lg:flex-row gap-2 justify-start sm:rounded-xl bg-white overflow-x-auto shadow rounded-none">
    <div class="px-3 py-2 flex items-center">
      <div class="text-base text-gray-700 font-normal mr-2"> {{ capitalizeOnlyFirstLetter($t('number_of_different_items')) }}: </div>
      <div class="text-md font-bold">{{ numberOfDifferentItems }}</div>
    </div>
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
          name="ph:warning-circle"
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
            name="ph:warning"
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
    <div class="px-3 py-2 flex gap-2 items-center">
      <div class="text-base text-gray-700 font-normal"> {{ $t('eta').toUpperCase() }} ({{ $t('without_delivery') }}): </div>

      <div v-if="eta === null">
        <Icon
          class="text-gray-500 -my-10"
          name="eos-icons:three-dots-loading"
          size="50"
        />
      </div>
      <div v-else-if="eta === undefined">
        <ButtonRetry @on-click="printOrderStore.estimatePrintJobsOnly()" />
      </div>
      <strong
        class="text-md font-bold"
        v-else
      >{{reformatDateShort(eta)}}</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PRINT_ORDER_MIN_PRICE } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderStore } from "~~/stores/print_order";

const notificationStore = useNotificationStore();
const printOrderStore = usePrintOrderStore();

const { eta, totalPrice, numberOfDifferentItems, numberOfItems } = defineProps<{
  eta: string | null | undefined;
  totalPrice: number;
  numberOfDifferentItems: number;
  numberOfItems: number;
}>();
</script>

<style>
</style>