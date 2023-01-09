<template>
  <div class="card w-full rounded-none sm:rounded-xl bg-white px-2 py-1 shadow rounded-lg">
    <div class="card-body p-4 gap-8">
      <div class="flex flex-wrap gap-5 items-center justify-between">
        <div class="text-base font-mono font-bold link link-info">#{{order?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5">{{ reformatDate(order?.created_at)}}</div>
        <div class="flex-1"></div>
        <div class=" gap-5 justify-end items-end text-lg text-gray-700 font-medium">
          {{ order?.total_price ? `$${order.total_price}` : '-'}}
        </div>
        <div
          v-if="order"
          class="btn btn-ghost btn-sm px-5 text-gray-700"
          :style="`background-color: ${printOrderStatusBackgroundColor(order.status)}`"
        >{{ printOrderStatusReformat(order.status) }}</div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";
import {
  printOrderStatusReformat,
  printOrderStatusBackgroundColor,
} from "~~/stores/print_order";
const { orderId } = defineProps(["orderId"]);

const storeOrderHistoryStore = useStoreOrderHistoryStore();

const order = storeOrderHistoryStore.getOrderById(orderId);
</script>

<style>
</style>