<template>
  <div
    v-if="attachmentImages.length"
    class="flex flex-col gap-1 text-gray-600 text-lg"
  >
    <!-- <div class="text-gray-500 text-sm font-medium pl-2">
      Images: {{ attachmentImages.length }} {{ attachmentImages.length === 1 ? "item" : "items" }}</div> -->
    <div class="flex flex-wrap gap-3 rounded-xl p-3">
      <ServicesModelingImageIcon
        v-for="file in attachmentImages"
        :key="file.localUrl"
        :localUrl="file.localUrl"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useModelingOrderStore } from "~~/stores/modeling_order";

const modelingOrderStore = useModelingOrderStore();

const { attachmentImages } = storeToRefs(modelingOrderStore);
</script>

<style>
</style>