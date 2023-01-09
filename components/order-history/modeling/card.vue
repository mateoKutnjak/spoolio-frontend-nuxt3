<template>
  <div class="card w-full rounded-none sm:rounded-xl bg-white px-2 py-1 shadow rounded-lg">
    <div class="card-body p-4 gap-8">
      <div class="flex flex-wrap gap-5 items-center justify-between">
        <div class="text-base font-mono font-bold link link-info">#{{modelingOrder?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5">{{ reformatDate(modelingOrder?.created_at)}}</div>
        <div class="flex-1"></div>
        <div class="card-actions gap-5 justify-end items-end text-lg text-gray-700 font-medium">
          {{ modelingOrder?.estimated_price ? `$${modelingOrder.estimated_price}` : '-'}}
        </div>
        <div
          v-if="modelingOrder"
          class="btn btn-ghost btn-sm px-5 text-gray-700"
          :style="`background-color: ${modelingStatusBackgroundColor(modelingOrder.status)}`"
        >{{ modelingStatusReformat(modelingOrder.status) }}</div>

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