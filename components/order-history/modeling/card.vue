<template>
  <div class="card w-full rounded-none sm:rounded-xl bg-white px-2 py-1">
    <div class="card-body p-4 gap-8">
      <div class="card-title gap-4 items-end">
        <div class="text-base font-mono font-bold link link-info">#{{modelingOrder?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5">{{ reformatDate(modelingOrder?.created_at)}}</div>
        <div
          v-if="modelingOrder"
          class="btn btn-ghost btn-sm px-5 text-gray-700"
          :style="`background-color: ${modelingStatusBackgroundColor(modelingOrder.status)}`"
        >{{ modelingStatusReformat(modelingOrder.status) }}</div>
      </div>
      <div class="flex gap-2 items-end">
        <div class="text-sm text-gray-500">Contact email:</div>
        <div class="text-sm font-medium">{{ modelingOrder?.contact_email }}</div>
      </div>
      <div class="card-actions gap-5 justify-end items-end text-xl text-gray-700 font-bold">
        {{ modelingOrder?.estimated_price ? `$${modelingOrder.estimated_price}` : '-'}}
      </div>
    </div>
  </div>
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