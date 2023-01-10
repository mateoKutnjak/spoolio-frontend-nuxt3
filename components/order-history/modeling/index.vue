<template>
  <div class="flex flex-col gap-5 items-center">
    <div class="w-full hidden md:block rounded-xl bg-white p-3 shadow-md rounded-lg">
      <table class="table-auto w-full">
        <thead class="rounded-lg">
          <tr class="bg-base-200">
            <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Id</th>
            <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Order date</th>
            <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Contact email</th>
            <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Price</th>
            <th class="px-8 pt-4 pb-3 text-end text-xs uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          <OrderHistoryModelingTableRow
            v-for="order in modeling_orders"
            :key="order.id"
            :modelingOrderId="order.id"
          />

        </tbody>
      </table>
    </div>
    <div class="w-full md:hidden flex flex-col gap-2">
      <OrderHistoryModelingCard
        v-for="order in modeling_orders"
        :key="order.id"
        :modelingOrderId="order.id"
      />
    </div>
    <PaginationButtons
      :key="currentPage + (count || -1)"
      :count="count"
      :previous="previous"
      :next="next"
      :currentPage="currentPage"
      @on-page-selected="onPageSelected"
    />
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { PAGE_SIZE } from "~~/constants/constants";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const { count, previous, next, modeling_orders } = storeToRefs(
  modelingOrderHistoryStore
);

var currentPage = ref(0);

onMounted(() => {
  modelingOrderHistoryStore
    .fetchPaginated(PAGE_SIZE, currentPage.value * PAGE_SIZE)
    .then((_) => {})
    .catch((err) => {})
    .finally(() => {});
});

function onPageSelected(pageSelected: number) {
  currentPage.value = pageSelected;

  modelingOrderHistoryStore
    .fetchPaginated(PAGE_SIZE, pageSelected * PAGE_SIZE)
    .then((_) => {})
    .catch((err) => {})
    .finally(() => {});
}
</script>
  
  <style>
table th:first-child {
  border-radius: 10px 0 0 0px;
}

table th:last-child {
  border-radius: 0 10px 0px 0;
}
</style>