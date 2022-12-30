<template>
  <div class="text-base flex gap-3 justify-start items-center">
    <Icon
      name="material-symbols:info-rounded"
      class="text-info"
      size="30"
    />
    <div class="italic text-base text-gray-600">{{ message }}</div>
  </div>
</template>

<script lang="ts" setup>
const { message } = defineProps(["message"]);
</script>

<style>
</style>