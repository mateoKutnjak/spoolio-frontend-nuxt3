<template>
  <div class="flex gap-3 items-start text-gray-500">
    <Icon
      name="lucide:rotate-3d"
      size="25"
      class="text-gray-500"
    />
    <div class="flex gap-1 items-end"> <strong> ({{ rotations.x }},{{ rotations.y }},{{ rotations.z }})</strong>
      <div class="text-sm">{{ unit }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data } = defineProps<{
  data: string;
  unit: string;
}>();

const rotations = vector3Parse(data);
</script>

<style>
</style>