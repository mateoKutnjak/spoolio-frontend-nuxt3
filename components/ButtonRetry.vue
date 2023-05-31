<template>
  <div
    class="btn btn-sm btn-error gap-2 shadow text-white"
    @click.stop="emit('onClick')"
  >
    <Icon
      name="lucide:refresh-cw"
      size="18"
    />
    <div class="mt-0.5 text-base">
      {{ capitalizeOnlyFirstLetter($t('retry')) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["onClick"]);
</script>

<style>
</style>