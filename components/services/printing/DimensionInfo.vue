<template>
  <div
    v-if="data"
    class="space-x-1 text-stone-400 text-lg"
  >
    <span>{{ data.x.toFixed(1) }}</span>
    <span>x</span>
    <span>{{ data.y.toFixed(1) }}</span>
    <span>x</span>
    <span>{{ data.z.toFixed(1) }}</span>
    <span>{{ unit }}</span>
  </div>
</template>

<script lang="ts" setup>
import { Vector3 } from "three";

const { data, unit } = defineProps<{
  data: Vector3 | undefined;
  unit: string;
}>();
</script>

<style>
</style>