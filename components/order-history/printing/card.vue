<template>
  <div class="card w-full rounded-none sm:rounded-xl bg-white px-2 py-1">
    <div class="card-body p-4 gap-8">
      <div class="card-title gap-4 items-end">
        <div class="text-base font-mono font-bold link link-info">#{{printOrder?.id}}</div>
        <div class="text-base text-gray-500 pb-0.5">{{ reformatDate(printOrder?.created_at)}}</div>
        <div
          v-if="printOrder"
          class="btn btn-ghost btn-sm px-5 text-gray-700"
          :style="`background-color: ${printOrderStatusBackgroundColor(printOrder.status)}`"
        >{{ printOrderStatusReformat(printOrder.status) }}</div>
      </div>
      <div class="text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, tempore quod ipsam deserunt cumque asperiores delectus aliquid nostrum distinctio ullam magni suscipit facere iure aliquam ut nulla esse, sint sunt.</div>
      <div class="card-actions gap-5 justify-end items-end text-xl text-gray-700 font-bold">
        {{ printOrder?.estimated_price ? `$${printOrder.estimated_price}` : '-'}}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
  printOrderStatusReformat,
  printOrderStatusBackgroundColor,
} from "~~/stores/print_order";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const { printOrderId } = defineProps(["printOrderId"]);

const printOrderHistoryStore = usePrintOrderHistoryStore();

const printOrder = printOrderHistoryStore.getPrintOrderById(printOrderId);
</script>

<style>
</style>