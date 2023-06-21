<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div v-if="pending">Pending [TODO]</div>
    <OrderHistoryStoreDetails
      v-if="data"
      :order="data"
    />
  </div>
</template>

<script lang="ts" setup>
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";

const { id } = useRoute().params;

const numericId = Number(id);
if (!numericId) {
  throw createError(`Order id ${id} cannot be parsed as number`);
}

const storeOrderHistoryStore = useStoreOrderHistoryStore();

const { data, pending, error, refresh } = await useAsyncData(
  "store_order_details",
  () => storeOrderHistoryStore.fetchById(numericId)
);
</script>

<style>
</style>