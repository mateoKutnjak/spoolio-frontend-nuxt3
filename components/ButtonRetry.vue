<template>
  <div
    class="btn btn-sm btn-primary btn-outline gap-2 rounded-md hover:!text-white font-thin items-center"
    @click.stop="emit('onClick')"
  >
    <!-- <Icon
      class="mb-0.5"
      name="ph:arrows-clockwise-bold"
      size="15"
    /> -->
    <div class="text-base">
      {{ $t('calculate').toUpperCase() }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["onClick"]);
</script>

<style>
</style>