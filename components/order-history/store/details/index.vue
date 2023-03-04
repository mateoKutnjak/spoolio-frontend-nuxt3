<template>
  <div class="container p-12 mx-auto max-w-5xl">
    <div class="flex flex-col gap-8">
      <div class="px-6 lg:px-0 flex flex-col md:flex-row gap-4 lg:gap-8 justify-between items-start md:items-center">
        <div class="text-3xl font-light">Store order #{{ order.id }}</div>
        <div class="text-xl font-light text-gray-500">{{ reformatDateTime(order.created_at) }}</div>
        <OrderStatusView :raw-status="order.status" />
      </div>
      <div
        v-if="data && data.items"
        class="divider"
      ></div>
      <div
        v-if="data && data.items"
        class=" flex flex-col gap-4"
      >
        <OrderHistoryStoreDetailsUnitCard
          v-for="item in data.items"
          :key="item.id"
          :store-order-unit="item"
        />
      </div>
      <div class="flex flex-col md:flex-row gap-8">
        <CommonAddressShipping :shipping-address="order.shipping_address" />
        <CommonAddressBilling :billing-address="order.billing_address" />
        <OrderHistoryStoreDetailsCheckoutCard
          v-if="OrderStatus.all[order.status] == OrderStatus.awaitingPayment"
          class="flex-1"
          :order="order"
        />
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";
import { IStoreOrder } from "~~/constants/data";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";

const storeOrderHistoryStore = useStoreOrderHistoryStore();

const { order } = defineProps<{
  order: IStoreOrder;
}>();

const { data, pending, error, refresh } = useAsyncData(
  "store_order_history_details",
  () => storeOrderHistoryStore.fetchById(order.id)
);

const total_price = computed(() =>
  storeOrderHistoryStore.getTotalPriceById(order.id)
);
</script>
  
  <style>
</style>