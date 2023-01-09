<template>
  <div class="hidden md:block rounded-xl bg-white p-3">
    <table class="table-auto w-full">
      <thead class="rounded-lg">
        <tr class="bg-base-200">
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Id</th>
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Order date</th>
          <th class="px-4 pt-4 pb-3 text-center text-xs uppercase">Customer info</th>
          <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Price</th>
          <th class="px-8 pt-4 pb-3 text-end text-xs uppercase">Status</th>
        </tr>
      </thead>
      <tbody>
        <OrderHistoryPrintingTableRow
          v-for="order in print_orders"
          :key="order.id"
          :printOrderId="order.id"
        />

      </tbody>
    </table>
  </div>
  <div class="md:hidden flex flex-col gap-2">
    <OrderHistoryPrintingCard
      v-for="order in print_orders"
      :key="order.id"
      :printOrderId="order.id"
    />
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";

const printOrderHistoryStore = usePrintOrderHistoryStore();

const { print_orders } = storeToRefs(printOrderHistoryStore);

printOrderHistoryStore.fetchPrintOrderHistoryPaginated();
</script>
  
  <style>
table th:first-child {
  border-radius: 10px 0 0 0px;
}

table th:last-child {
  border-radius: 0 10px 0px 0;
}
</style>