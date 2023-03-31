<template>
  <div class="text-base flex gap-3 justify-start items-start">
    <Icon
      name="lucide:info"
      class="text-info"
      size="25"
    />
    <div class="text-sm text-gray-500">{{ message }}</div>
  </div>
</template>

<script lang="ts" setup>
const { message } = defineProps(["message"]);
</script>

<style>
</style>