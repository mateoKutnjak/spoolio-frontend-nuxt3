<template>
  <div class="container py-12 md:p-12">
    <div class="max-w-4xl mx-auto">
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

        <!-- This shadow and rounded must be aligned with card shadow and rounede and tables also -->
        <TabPanels class="mt-4">
          <TabPanel>
            <OrderHistoryPrinting />
          </TabPanel>
          <TabPanel>
            <OrderHistoryModeling />
          </TabPanel>
          <TabPanel>
            <OrderHistoryStore />
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
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();
const printOrderHistoryStore = usePrintOrderHistoryStore();
const modelingOrderHistoryStore = useModelingOrderHistoryStore();

if (!authStore.getUser) {
  throw createError({
    statusCode: 404,
    statusMessage: "Create account to access order history",
  });
}

printOrderHistoryStore.fetchPrintOrderHistoryPaginated();
modelingOrderHistoryStore.fetchPaginated();

const tabCategories = ["Print orders", "Modeling orders", "Purchases"];
</script>

<style>
</style>