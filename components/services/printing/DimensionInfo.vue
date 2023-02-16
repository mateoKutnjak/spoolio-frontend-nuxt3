<template>
  <div class="flex gap-1 items-end text-gray-500">
    <Icon
      class="mr-2"
      name="gis:coord-system-3d-alt"
      size="25"
    />
    <strong v-if="data">{{ data.x.toFixed(0)}}
      x
      {{ data.y.toFixed(0)}}
      x
      {{ data.z.toFixed(0)}}</strong>
    <div class="text-sm">{{ DimensionUnit[dimensionUnit] }}</div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Vector3 } from "three";
import { useGlobalsStore } from "~~/stores/globals";

const globalsStore = useGlobalsStore();

const { dimensionUnit } = storeToRefs(globalsStore);

const { data } = defineProps<{
  data: Vector3 | undefined;
}>();
</script>

<style>
</style>