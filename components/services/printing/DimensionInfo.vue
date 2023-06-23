<template>
  <div
    v-if="unit"
    class="space-x-1 text-stone-400 text-lg"
  >
    <span>{{ dimensionX }}</span>
    <span>x</span>
    <span>{{ dimensionY }}</span>
    <span>x</span>
    <span>{{ dimensionZ }}</span>
    <span>{{ unit.length_unit }}</span>
  </div>
</template>

<script lang="ts" setup>
import { IPrintOrderUnit } from "~~/constants/data";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const modelDimensions = vector3Parse(unit.model_dimensions);

const dimensionX = ref((modelDimensions.x * unit.scale).toFixed(1));
const dimensionY = ref((modelDimensions.y * unit.scale).toFixed(1));
const dimensionZ = ref((modelDimensions.z * unit.scale).toFixed(1));
</script>

<style>
</style>