<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-8">
    <TabGroup>
      <TabList class="p-2 flex gap-2 justify-start sm:rounded-xl bg-white overflow-x-auto shadow-md rounded-lg">
        <Tab
          v-for="
          tabCategory
          in
          tabCategories"
          as="template"
          :key="tabCategory"
          v-slot="{ selected }"
        >
          <div :class="[
              'btn  px-3 text-lg font-medium text-gray-600',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
              selected
                ? 'btn-primary'
                : 'btn-ghost',
            ]">
            {{ capitalizeOnlyFirstLetter($t(tabCategory)) }}
          </div>
        </Tab>
      </TabList>

      <!-- This shadow and rounded must be aligned with card shadow and rounede and tables also -->
      <TabPanels class="mt-4">
        <TabPanel>
          <OrderHistoryPrinting />
        </TabPanel>
        <TabPanel>
          <OrderHistoryModeling />
        </TabPanel>
        <!-- <TabPanel>
          <OrderHistoryStore />
        </TabPanel> -->
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script lang="ts" setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";
import { useStoreOrderHistoryStore } from "~~/stores/order_history_store";
import { useNotificationStore } from "~~/stores/notification";

const modelingOrderHistoryStore = useModelingOrderHistoryStore();
const notificationStore = useNotificationStore();
const printOrderHistoryStore = usePrintOrderHistoryStore();
const storeOrderHistoryStore = useStoreOrderHistoryStore();

printOrderHistoryStore
  .fetchPrintOrderHistoryPaginated()
  .catch((err) => notificationStore.showFetchError(err));
modelingOrderHistoryStore
  .fetchPaginated()
  .catch((err) => notificationStore.showFetchError(err));
storeOrderHistoryStore
  .fetchOrderHistoryPaginated()
  .catch((err) => notificationStore.showFetchError(err));

const tabCategories = ["print_orders", "modeling_orders" /*"store_orders"*/];
</script>

<style>
</style>