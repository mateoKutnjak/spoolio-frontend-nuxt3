<template>
  <div class="hidden md:block rounded-xl bg-white p-3">
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
        />

      </tbody>
    </table>
  </div>
  <div class="md:hidden flex flex-col gap-2">
    <OrderHistoryStoreCard
      v-for="order in orders"
      :key="order.id"
      :orderId="order.id"
    />
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";

const storeOrderHistoryStore = useStoreOrderHistoryStore();

const { orders } = storeToRefs(storeOrderHistoryStore);

const showInitLoading = ref<boolean>(true);
const showPageLoading = ref<boolean>(false);

var limit = 10;
var offset = 0;

onMounted(() => {
  showInitLoading.value = true;
  storeOrderHistoryStore
    .fetchOrderHistoryPaginated(limit, offset)
    .then((_) => {})
    .catch((err) => {})
    .finally(() => {
      showInitLoading.value = false;
    });
});

const getOrders = computed(() => {
  return storeOrderHistoryStore.getOrders;
});

onMounted(() => {
  // Function listener which detects
  // when page is scrolled to the bottom
  window.onscroll = () => {
    let bottomOfWindow =
      Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      ) +
        window.innerHeight ===
      document.documentElement.offsetHeight;

    if (bottomOfWindow) {
      console.log("bottomOfWindow");
      console.log(getOrders);
      if (
        getOrders.value.next &&
        getOrders.value.count &&
        getOrders.value.count > offset
      ) {
        showPageLoading.value = true;
        offset = offset + limit;
        storeOrderHistoryStore
          .fetchOrderHistoryPaginated(limit, offset, "", true)
          .then(() => (showPageLoading.value = false));
      }
    }
  };
});
</script>
  
  <style>
table th:first-child {
  border-radius: 10px 0 0 0px;
}

table th:last-child {
  border-radius: 0 10px 0px 0;
}
</style>