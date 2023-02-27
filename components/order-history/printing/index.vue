<template>
  <div>
    <div
      v-if="count"
      class="flex flex-col gap-5 items-center"
    >
      <div class="w-full hidden md:block rounded-xl bg-white p-3 shadow-md rounded-lg">
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
              @click="onItemClicked(order)"
            />

          </tbody>
        </table>
      </div>
      <div class="w-full md:hidden flex flex-col gap-2">
        <OrderHistoryPrintingCard
          v-for="order in print_orders"
          :key="order.id"
          :printOrderId="order.id"
          @click="onItemClicked(order)"
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
    <div v-else>
      <div class="hero h-96">
        <div class="hero-content text-center text-gray-400">
          <div class="max-w-md">
            <Icon
              name="file-icons:3d-model"
              size="50"
            />
            <p class="text-2xl pt-4 py-8 font-light">You have not created any printing orders yet</p>
            <NuxtLink to="/services/printing">
              <div class="btn btn-outline bg-white gap-2 border-gray-500">
                <Icon
                  name="material-symbols:add"
                  size="22"
                />
                <div class="text-lg font-light"> New printing order </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { OrderStatus, PAGE_SIZE } from "~~/constants/constants";
import { useNotificationStore } from "~~/stores/notification";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";
import { IPrintOrderResponse } from "~~/stores/print_order";

const notificationStore = useNotificationStore();
const printOrderHistoryStore = usePrintOrderHistoryStore();

const { count, previous, next, print_orders } = storeToRefs(
  printOrderHistoryStore
);

var currentPage = ref(0);

onMounted(() => {
  printOrderHistoryStore
    .fetchPrintOrderHistoryPaginated(PAGE_SIZE, currentPage.value * PAGE_SIZE)
    .then((_) => {})
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => {});
});

function onPageSelected(pageSelected: number) {
  currentPage.value = pageSelected;

  printOrderHistoryStore
    .fetchPrintOrderHistoryPaginated(PAGE_SIZE, pageSelected * PAGE_SIZE)
    .then((_) => {})
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => {});
}

function onItemClicked(order: IPrintOrderResponse) {
  if (OrderStatus.all[order.status] === OrderStatus.awaitingPayment) {
    navigateTo({
      path: `/payment/printing/${order.id}`,
    });
  } else {
    console.error("TODO order details");
  }
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