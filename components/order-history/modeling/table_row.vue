<template>
  <tr class="w-full hover:bg-base-200/[0.3]">
    <td class="px-4 pt-4 pb-3 font-mono font-bold link link-info">#{{modelingOrder?.id}}</td>
    <td class="px-4 pt-4 pb-3 text-sm">{{ reformatDate(modelingOrder?.created_at)}}</td>
    <td class="px-4 pt-4 pb-3 text-sm ">{{ modelingOrder?.contact_email }} </td>
    <td class="px-4 pt-4 pb-3 text-sm font-bold">{{ modelingOrder?.estimated_price ? `$${modelingOrder.estimated_price}` : '-'}}</td>
    <td class="px-4 pt-4 pb-3 text-end">
      <div
        v-if="modelingOrder"
        class="btn btn-ghost btn-sm px-5 text-gray-700"
        :style="`background-color: ${modelingStatusBackgroundColor(modelingOrder.status)}`"
      >{{ modelingStatusReformat(modelingOrder.status) }}</div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  IModelingOrderResponse,
  modelingStatusBackgroundColor,
  modelingStatusReformat,
} from "~~/stores/modeling_order";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const { modelingOrderId } = defineProps(["modelingOrderId"]);

const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const modelingOrder = modelingOrderHistoryStore.getOrderById(modelingOrderId);
</script>

<style>
</style>