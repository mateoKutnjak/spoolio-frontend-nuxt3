<template>
  <div class="flex gap-1 items-end text-gray-500">
    <Icon
      class="mr-2"
      name="lucide:box"
      size="25"
    />
    <strong>{{ data.toFixed(0) }}</strong>
    <div class="flex gap-0.5">
      <div class="text-sm">{{ unit }}</div>
      <sup class="pt-2.5">3</sup>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data, unit } = defineProps<{
  data: number;
  unit: string,
}>();
</script>

<style>
</style>