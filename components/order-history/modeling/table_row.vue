<template>
  <tr class="w-full hover:bg-base-200/[0.3]">
    <td class="px-4 pt-4 pb-3 font-mono font-bold link link-info">#{{modelingOrder?.id}}</td>
    <td class="px-4 pt-4 pb-3 text-lg">{{ reformatDate(modelingOrder?.created_at)}}</td>
    <td class="px-4 pt-4 pb-3 text-lg ">{{ modelingOrder?.contact_email }} </td>
    <td class="px-4 pt-4 pb-3 text-lg font-bold">€{{ total_price }}</td>
    <td class="px-4 pt-4 pb-3 text-end">
      <OrderStatusView :raw-status="modelingOrder?.status" />
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const { modelingOrderId } = defineProps(["modelingOrderId"]);

const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const modelingOrder = modelingOrderHistoryStore.getOrderById(modelingOrderId);

const total_price = computed(() => {
  if (!modelingOrder?.estimated_price) {
    return "-";
  }
  return (Number(modelingOrder?.estimated_price) * (1 + TAX_FRACTION)).toFixed(
    2
  );
});
</script>

<style>
</style>