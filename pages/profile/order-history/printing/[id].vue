<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <OrderHistoryPrintingDetails
      v-if="data"
      :order="data"
    />
  </div>
</template>

<script lang="ts" setup>
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";
import { usePrintOrderStore } from "~~/stores/print_order";

const { id } = useRoute().params;

const numericId = Number(id);
if (!numericId) {
  throw createError(`Order id ${id} cannot be parsed as number`);
}

const printOrderHistoryStore = usePrintOrderHistoryStore();
const printOrderStore = usePrintOrderStore();

const { data, pending, error, refresh } = await useAsyncData(
  "print_order_details",
  () => printOrderHistoryStore.fetchPrintOrderById(numericId)
);
</script>

<style>
</style>