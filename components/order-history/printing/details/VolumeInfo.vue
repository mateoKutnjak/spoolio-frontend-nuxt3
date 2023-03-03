<template>
  <div class="flex gap-1 items-end text-gray-500">
    <Icon
      class="mr-2"
      name="gis:cube-3d"
      size="25"
    />
    <strong>{{ data.toFixed(3) }}</strong>
    <div class="flex gap-0.5">
      <div class="text-sm">{{ predefinedDimensionUnit }}</div>
      <sup class="pt-2.5">3</sup>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
const { data, predefinedDimensionUnit } = defineProps<{
  data: number;
  predefinedDimensionUnit: string;
}>();
</script>
  
  <style>
</style>