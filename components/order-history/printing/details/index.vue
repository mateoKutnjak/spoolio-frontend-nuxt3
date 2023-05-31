<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-8">
      <div class="px-12 md:px-0 flex flex-col md:flex-row gap-4 lg:gap-8 justify-between items-start md:items-center">
        <div class="text-3xl">{{ `${capitalizeOnlyFirstLetter($t('print_order'))} #${order.id}` }}</div>
        <div class="text-xl text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
        <OrderStatusView :raw-status="order.status" />
      </div>
      <div
        v-if="data"
        class="divider"
      ></div>
      <div
        v-if="data"
        class=" flex flex-col gap-4"
      >
        <div class="px-6 md:px-0 flex gap-8 justify-between">
          <div class="text-lg text-gray-700">{{ capitalizeOnlyFirstLetter($t('total_price')) }}: <strong>{{ order.estimated_price }} €</strong></div>
          <div class="text-lg text-gray-700">{{ capitalizeOnlyFirstLetter($t('number_od_files')) }}: <strong>{{ data.length }}</strong></div>
        </div>
        <OrderHistoryPrintingDetailsUnitCard
          v-for="unit in data"
          :key="unit.id"
          :unit="unit"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-8">
        <CommonAddressShipping :shipping-address="order.shipping_address" />
        <CommonAddressBilling :billing-address="order.billing_address" />
        <OrderHistoryPrintingDetailsCheckoutCard
          v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment"
          class="flex-1"
          :order="order"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";
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