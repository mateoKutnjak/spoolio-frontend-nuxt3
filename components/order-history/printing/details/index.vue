<template>
  <div class="container p-12 mx-auto">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-8 lg:flex-row justify-between lg:items-end">
        <div class="flex flex-col gap-4 justify-between items-start">
          <div class="text-3xl font-light">Print order #{{ order.id }}</div>
          <div class="text-xl font-light text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
          <OrderStatusView :raw-status="order.status" />
        </div>
        <div class="flex flex-col sm:flex-row gap-8">
          <CommonAddressShipping
            :shipping-address="order.shipping_address"
            class="flex-1"
          />
          <CommonAddressBilling
            :billing-address="order.billing_address"
            class="flex-1"
          />
        </div>
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
          <div class="text-lg font-light text-gray-700">Total price: <strong>{{ order.estimated_price }} €</strong></div>
          <div class="text-lg font-light text-gray-700">Number of files: <strong>{{ data.length }}</strong></div>
        </div>
        <OrderHistoryPrintingDetailsUnitCard
          v-for="unit in data"
          :key="unit.id"
          :unit="unit"
        />
      </div>
      <div v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment && order.estimated_price">
        <NuxtLink
          :to="`/payment/printing/${order.id}`"
          class="btn btn-primary btn-block btn-lg"
        >
          Pay Now ({{order.estimated_price}} €)
        </NuxtLink>
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