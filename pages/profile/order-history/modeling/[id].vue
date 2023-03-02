<template>
  <div>
    <div v-if="pending">Pending [TODO]</div>
    <OrderHistoryModelingDetails
      v-if="data"
      :order="data"
    />
  </div>
</template>

<script lang="ts" setup>
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const { id } = useRoute().params;

const numericId = Number(id);
if (!numericId) {
  throw createError(`Order id ${id} cannot be parsed as number`);
}

const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const { data, pending, error, refresh } = await useAsyncData(
  "modeling_order_details",
  () => modelingOrderHistoryStore.fetchById(numericId)
);
</script>

<style>
</style>