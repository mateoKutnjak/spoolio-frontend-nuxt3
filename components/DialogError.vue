<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-3 items-center">
      <Icon
        name="ph:warning-fill"
        size="26"
        class="text-error"
      />
      <div class="text-2xl font-bold text-error">{{ capitalizeOnlyFirstLetter($t('error_occurred')) }}</div>
    </div>
    <p class="text-xl font-medium text-gray-500">
      {{ message }}
    </p>

    <div class="flex gap-2 justify-center pt-2">
      <div
        class="btn btn-primary rounded-md"
        @click="dialogStore.close()"
      >
        {{ capitalizeOnlyFirstLetter($t('close')) }}
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { message } = defineProps<{
  message: string;
}>();
</script>
  
  <style>
</style>