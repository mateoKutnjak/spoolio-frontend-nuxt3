<template>
  <div class="font-bold">
    <div v-if="price === Number.NEGATIVE_INFINITY">
      <Icon
        class="text-gray-500 -my-10"
        name="eos-icons:three-dots-loading"
        size="50"
      />
    </div>
    <div v-else-if="price === Number.POSITIVE_INFINITY">
      <ButtonRetry @on-click="unit ? printOrderStore.estimateSlicerAndPrintJobs(unit) : () => null" />
    </div>
    <div
      v-else
      class="flex gap-1 items-center"
    >€{{ (price).toFixed(2)}}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPrintOrderUnit } from "~~/constants/data";
import { usePrintOrderStore } from "~~/stores/print_order";

const printOrderStore = usePrintOrderStore();

const { price, unit } = defineProps<{ price: number; unit: IPrintOrderUnit }>();
</script>

<style>
</style>