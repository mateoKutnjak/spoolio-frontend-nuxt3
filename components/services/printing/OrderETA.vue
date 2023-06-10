<template>
  <div class="px-3 py-2 flex gap-2 items-center">
    <div class="text-base text-gray-700 font-normal"> {{ $t('eta').toUpperCase() }} ({{ $t('without_delivery') }}): </div>

    <div v-if="eta === null">
      <Icon
        class="text-gray-500 -my-10"
        name="eos-icons:three-dots-loading"
        size="50"
      />
    </div>
    <div v-else-if="eta === undefined">
      <ButtonRetry @on-click="printOrderStore.estimatePrintJobsOnly()" />
    </div>
    <strong
      class="text-md font-bold"
      v-else
    >{{reformatDateShort(eta)}}</strong>
  </div>
</template>

<script lang="ts" setup>
import { usePrintOrderStore } from "~~/stores/print_order";

const printOrderStore = usePrintOrderStore();

const { eta } = defineProps<{
  eta: string | null | undefined;
}>();
</script>

<style>
</style>