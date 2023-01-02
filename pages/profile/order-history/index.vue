<template>
  <div class="container py-12 md:p-12">
    <div class="max-w-4xl mx-auto">
      <TabGroup>
        <TabList class="p-2 flex gap-2 justify-start sm:rounded-xl bg-white overflow-x-auto">
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
              'btn btn-ghost px-3 text-base font-medium text-gray-600',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
              selected
                ? 'bg-accent/[0.2]'
                : '',
            ]">
              {{ tabCategory }}
            </div>
          </Tab>
        </TabList>

        <TabPanels class="mt-4">
          <TabPanel class="rounded-xl bg-white p-3">
            <div class="grid grid-cols-1 gap-1">
              <div
                class="w-full"
                v-for="printOrder, index in print_orders"
                :key="printOrder.id"
              >
                <OrderHistoryPrintOrderItem :id="printOrder.id" />
                <div
                  v-if="index < print_orders.length-1"
                  class="divider my-0 mx-8"
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <OrderHistoryModelingTabPanel />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { usePrintOrderHistoryStore } from "~~/stores/order_history_print";
import { useModelingOrderHistoryStore } from "~~/stores/order_history_modeling";

const printOrderHistoryStore = usePrintOrderHistoryStore();
const modelingOrderHistoryStore = useModelingOrderHistoryStore();

const { print_orders } = storeToRefs(printOrderHistoryStore);
const { modeling_orders } = storeToRefs(modelingOrderHistoryStore);

printOrderHistoryStore.fetchPrintOrderHistoryPaginated();
modelingOrderHistoryStore.fetchPaginated();

const tabCategories = ["Print orders", "Modeling orders", "Purchases"];
</script>

<style>
</style>