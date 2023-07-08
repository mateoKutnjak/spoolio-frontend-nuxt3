<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-8">
      <div class="px-12 md:px-0 flex flex-col md:flex-row gap-4 lg:gap-8 justify-between items-start md:items-center">
        <div class="text-4xl font-bold text-stone-600">{{ `${capitalizeOnlyFirstLetter($t('print_order'))} #${order.id}` }}</div>
        <div class="text-xl text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
        <OrderStatusView :raw-status="order.status" />
      </div>
      <div
        v-if="data"
        class=" flex flex-col gap-4"
      >
        <OrderHistoryPrintingDetailsUnitCard
          v-for="unit, index in data"
          :key="unit.id"
          :unit="unit"
          :order="order"
          :index="index"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-8">
        <CommonAddressShipping :shipping-address="order.shipping_address" />
        <CommonAddressBilling :billing-address="order.billing_address" />
        <OrderHistoryPrintingDetailsCheckoutCard
          class="flex-1"
          :order="order"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OrderStatus, TAX_FRACTION } from "~~/constants/constants";
import { IPrintOrder } from "~~/constants/data";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const { order } = defineProps<{
  order: IPrintOrder;
}>();

const printOrderHistoryStore = usePrintOrderHistoryStore();

const { data, pending, error, refresh } = useAsyncData(
  "print_order_units",
  () => printOrderHistoryStore.fetchPrintOrderUnitNamesById(order.id)
);
</script>

<style>
</style>