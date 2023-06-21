<template>
  <div
    class="btn btn-sm btn-error gap-2 rounded-md text-white font-thin items-center"
    @click.stop="emit('onClick')"
  >
    <Icon
      class="mb-0.5"
      name="lucide:alert-triangle"
      size="17"
    />
    <div class="text-base">
      {{ capitalizeOnlyFirstLetter($t('retry')) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["onClick"]);
</script>

<style>
</style>