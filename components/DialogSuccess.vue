<template>
  <div class="flex flex-col gap-6 text-stone-700">
    <div class="flex gap-3 items-center">
      <Icon
        name="ph:check-circle-fill"
        size="40"
        class="text-primary"
      />
      <div class="text-2xl font-bold">{{ $t(title).toUpperCase() }}</div>
    </div>
    <p class="text-lg font-semibold text-stone-600">
      {{ capitalizeOnlyFirstLetter($t(message)) }}
    </p>

    <div class="flex gap-2 justify-center pt-2">
      <div
        class="btn btn-primary btn-block rounded-md"
        @click="onCloseClicked"
      >
        {{ capitalizeOnlyFirstLetter($t('close')) }}
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { title, message, onClose } = defineProps<{
  title: string;
  message: string;
  onClose?: Function;
}>();

function onCloseClicked() {
  if (onClose) {
    onClose();
  }
  dialogStore.close();
}
</script>
  
  <style>
</style>