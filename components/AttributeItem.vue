<template>

  <div
    v-if="tooltip"
    class="tooltip tooltip-bottom"
    :data-tip="tooltip"
  >
    <div class="btn btn-sm btn-ghost bg-stone-200 text-gray-600 rounded-full no-animation">
      {{ title }}
    </div>
  </div>

  <div
    v-else
    class="btn btn-sm btn-ghost bg-stone-200 text-gray-600 rounded-full no-animation"
  >
    {{ title }}
  </div>
</template>

<script lang="ts" setup>
const { title, tooltip } = defineProps<{
  title: string;
  tooltip?: string;
}>();
</script>

<style>
</style>