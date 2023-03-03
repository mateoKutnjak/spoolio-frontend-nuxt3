<template>
  <div class="flex gap-1 items-end text-gray-500">
    <Icon
      class="mr-2"
      name="gis:cube-3d"
      size="25"
    />
    <strong>{{ data.toFixed(3) }}</strong>
    <div class="flex gap-0.5">
      <div class="text-sm">{{ DimensionUnit[dimensionUnit] }}</div>
      <sup class="pt-2.5">3</sup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useGlobalsStore } from "~~/stores/globals";

const globalsStore = useGlobalsStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const { data } = defineProps<{
  data: number;
}>();
</script>

<style>
</style>