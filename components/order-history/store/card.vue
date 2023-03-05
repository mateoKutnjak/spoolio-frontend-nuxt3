<template>
  <div class="card w-full rounded-none sm:rounded-xl bg-white px-2 py-1 shadow rounded-lg">
    <div class="card-body p-4 gap-8">
      <div class="flex flex-wrap gap-5 items-center justify-between">
        <div class="text-base font-mono font-bold link link-info">#{{order?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5">{{ reformatDate(order?.created_at)}}</div>
        <div class="flex-1"></div>
        <div class=" gap-5 justify-end items-end text-lg text-gray-700 font-medium">
          €{{ total_price }}
        </div>
        <OrderStatusView :raw-status="order?.status" />

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";
const { orderId } = defineProps(["orderId"]);

const storeOrderHistoryStore = useStoreOrderHistoryStore();

const order = storeOrderHistoryStore.getOrderById(orderId);

if (!order) {
  throw createError(`No order with giver id ${orderId}`);
}

const total_price = computed(() => {
  if (!order?.total_price || !order?.shipping_method?.price) {
    return "-";
  }
  return (
    Number(order?.total_price) * (1 + TAX_FRACTION) +
    Number(order?.shipping_method.price)
  ).toFixed(2);
});
</script>

<style>
</style>