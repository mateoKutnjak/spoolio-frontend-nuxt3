<template>
  <div class="container mx-auto max-w-7xl px-0 md:px-12 py-12">
    <div>{{ capitalizeOnlyFirstLetter($t('about')) }}</div>
    <!-- <div
      class="btn"
      @click="onClick"
    >show toast</div>
    <div
      class="btn"
      @click="notificationStore.show(
    'short text',
    ToastLevelType.info
  )"
    >show toast</div> -->
  </div>
</template>
  
  <script lang="ts" setup>
import { useNotificationStore } from "~~/stores/notification";

const notificationStore = useNotificationStore();

function onClick() {
  notificationStore.show(
    "Very long text that should be placed well in toast. But will it be? Probably not in the first try as it should break and toast should be thicker rather than longer. Still in the first try toast is still long.",
    ToastLevelType.info
  );
}
</script>
  <style>
</style>