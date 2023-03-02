<template>
  <div
    v-if="rawStatus"
    class="btn btn-ghost btn-sm no-animation px-5 text-gray-600 border-gray-400 hover:border-gray-400 shadow"
    :style="`background-color: ${ OrderStatus.all[rawStatus].colorHex}`"
  >{{ OrderStatus.all[rawStatus].display_name }}</div>
</template>

<script lang="ts" setup>
import { OrderStatus } from "~~/constants/constants";

const { rawStatus } = defineProps<{
  rawStatus: string | undefined;
}>();
</script>

<style>
</style>