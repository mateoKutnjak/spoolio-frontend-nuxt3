<template>
  <div class="flex gap-1 items-end text-gray-500">
    <Icon
      class="mr-2"
      name="gis:cube-3d"
      size="30"
    />
    <strong>{{ (data / 1000).toFixed(3) }}</strong>
    <div class="text-sm">{{ DimensionUnit[dimensionUnit] }}3</div>
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