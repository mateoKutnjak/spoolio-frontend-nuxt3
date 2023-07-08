<template>
  <div class="card w-full sm:rounded-xl bg-white px-2 py-1 shadow rounded-lg">
    <div class="card-body p-4 gap-8">
      <div class="flex flex-wrap gap-5 items-center justify-between">
        <div class="text-base font-mono font-bold link link-info">#{{printOrder?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5 font-normal">{{ reformatDate(printOrder?.created_at)}}</div>
        <div class="flex-1"></div>
        <div class="card-actions gap-5 justify-end items-end text-lg text-gray-700 font-medium">
          €{{ total_price }}
        </div>
        <OrderStatusView :raw-status="printOrder?.status" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const { printOrderId } = defineProps(["printOrderId"]);

const printOrderHistoryStore = usePrintOrderHistoryStore();

const printOrder = printOrderHistoryStore.getPrintOrderById(printOrderId);

const total_price = computed(() => {
  if (!printOrder?.estimated_price || !printOrder?.shipping_method?.price) {
    return "-";
  }
  return (
    Number(printOrder?.estimated_price) * (1 + TAX_FRACTION) +
    Number(printOrder?.shipping_method.price)
  ).toFixed(2);
});
</script>

<style>
</style>