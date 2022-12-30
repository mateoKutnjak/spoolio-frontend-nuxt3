<template>
  <div
    v-if="attachmentFiles.length"
    class="flex flex-col gap-1 text-gray-600 text-lg"
  >
    Attachments: {{ attachmentFiles.length }} {{ attachmentFiles.length === 1 ? "item" : "items" }}
    <div class="flex gap-3 border-2 border-gray-300 rounded-md p-3">
      <ServicesModelingFileIcon
        v-for="file in attachmentFiles"
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

const { attachmentFiles, attachmentImages } = storeToRefs(modelingOrderStore);
</script>

<style>
</style>