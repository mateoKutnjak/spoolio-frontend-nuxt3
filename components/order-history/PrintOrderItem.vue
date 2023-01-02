<template>
  <div class="card-body gap-4 rounded-lg py-4">
    <div class="card-title justify-between items-start">
      <div class="flex flex-col md:flex-row gap-2 md:gap-5 items-start">
        <div class="flex gap-2 items-center">
          <div class="text-sm text-gray-400">ORDER NUMBER:</div>
          <div class="text-base">{{ printOrderItem?.id || 'null' }}</div>
        </div>
        <div class="flex gap-2 items-center">
          <div class="text-sm text-gray-400">ORDER DATE:</div>
          <div class="text-base">{{ reformatDate(printOrderItem?.created_at || 'null') }}</div>
        </div>
        <div class="flex gap-2 items-center text-green-600">
          <div class="text-sm text-gray-400">STATUS:</div>
          <Icon
            size="25"
            name="ph:check-circle-duotone"
          />
          <div class="text-base">Delivered (TODO)</div>
        </div>
      </div>
      <div class="btn btn-ghost btn-circle btn-sm">
        <Icon
          name="mdi:dots-vertical"
          class="text-gray-700"
          size="20"
        />
      </div>
    </div>
    <div class="flex gap-4">
      <div
        v-for="index in printOrderItem?.unit_count || 0"
        :key="index"
        class="btn btn-outline w-16 h-16 rounded border-2 border-gray-400 text-gray-700 hover:bg-gray-200 hover:border-gray-500 hover:text-gray-700"
      >
        <Icon
          name="carbon:3d-mpr-toggle"
          size="27"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const printOrderHistoryStore = usePrintOrderHistoryStore();

const { id } = defineProps(["id"]);

const printOrderItem = printOrderHistoryStore.getPrintOrderById(id);
</script>

<style>
</style>