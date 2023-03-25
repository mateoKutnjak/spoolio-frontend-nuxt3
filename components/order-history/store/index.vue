<template>
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
            <th class="px-4 pt-4 pb-3 text-center text-xs uppercase">Order details</th>
            <th class="px-4 pt-4 pb-3 text-start text-xs uppercase">Price</th>
            <th class="px-8 pt-4 pb-3 text-end text-xs uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          <OrderHistoryStoreTableRow
            v-for="order in orders"
            :key="order.id"
            :orderId="order.id"
            @click="onItemClicked(order)"
          />

        </tbody>
      </table>
    </div>
    <div class="w-full md:hidden flex flex-col gap-2">
      <OrderHistoryStoreCard
        v-for="order in orders"
        :key="order.id"
        :orderId="order.id"
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
          <p class="text-2xl pt-4 py-8">You have not created any purchasing orders yet</p>
          <NuxtLink to="/store/">
            <div class="btn btn-outline bg-white gap-2 border-gray-500">
              <div class="text-lg"> Go to store </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { PAGE_SIZE } from "~~/constants/constants";
import { IStoreOrder } from "~~/constants/data";
import { useNotificationStore } from "~~/stores/notification";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";

const notificationStore = useNotificationStore();
const storeOrderHistoryStore = useStoreOrderHistoryStore();

const { count, previous, next, orders } = storeToRefs(storeOrderHistoryStore);

const showInitLoading = ref<boolean>(true);
const showPageLoading = ref<boolean>(false);

// var limit = 10;
var currentPage = ref(0);

onMounted(() => {
  showInitLoading.value = true;
  storeOrderHistoryStore
    .fetchOrderHistoryPaginated(PAGE_SIZE, currentPage.value * PAGE_SIZE)
    .then((_) => {})
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => {
      showInitLoading.value = false;
    });
});

function onPageSelected(pageSelected: number) {
  currentPage.value = pageSelected;

  showInitLoading.value = true;
  storeOrderHistoryStore
    .fetchOrderHistoryPaginated(PAGE_SIZE, pageSelected * PAGE_SIZE)
    .then((_) => {})
    .catch((err) => notificationStore.showFetchError(err))
    .finally(() => {
      showInitLoading.value = false;
    });
}

function onItemClicked(order: IStoreOrder) {
  navigateTo(`/profile/order-history/store/${order.id}`);
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