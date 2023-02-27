<template>
  <div class="card w-full rounded-none sm:rounded-xl bg-white px-2 py-1 shadow rounded-lg">
    <div class="card-body p-4 gap-8">
      <div class="flex flex-wrap gap-5 items-center justify-between">
        <div class="text-base font-mono font-bold link link-info">#{{printOrder?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5 font-normal">{{ reformatDate(printOrder?.created_at)}}</div>
        <div class="flex-1"></div>
        <div class="card-actions gap-5 justify-end items-end text-lg text-gray-700 font-medium">
          {{ printOrder?.estimated_price ? `$${printOrder.estimated_price}` : '-'}}
        </div>
        <div
          v-if="printOrder"
          class="btn btn-ghost btn-sm px-5 text-gray-700"
          :style="`background-color: ${OrderStatus.all[printOrder.status].colorHex}`"
        >{{ OrderStatus.all[printOrder.status].display_name }}</div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const { printOrderId } = defineProps(["printOrderId"]);

const printOrderHistoryStore = usePrintOrderHistoryStore();

const printOrder = printOrderHistoryStore.getPrintOrderById(printOrderId);
</script>

<style>
</style>