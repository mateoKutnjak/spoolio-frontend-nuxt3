<template>
  <div class="flex justify-end">
    <div
      v-if="rawStatus"
      class="w-fit whitespace-nowrap px-4 py-1.5 text-white text-sm font-bold rounded-full"
      :style="`background-color: ${ OrderStatus.all[rawStatus].colorHex}`"
    >{{ capitalizeOnlyFirstLetter($t(OrderStatus.all[rawStatus].server_name)) }}</div>
  </div>
</template>

<script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";

const { rawStatus } = defineProps<{
  rawStatus: string | undefined;
}>();
</script>

<style>
</style>