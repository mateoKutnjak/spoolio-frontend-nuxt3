<template>
  <div class="flex flex-col gap-6">
    <div class="text-xl font-medium leading-6 text-gray-900">
      {{ title }}
    </div>
    <p class="text text-gray-500">
      {{ subtitle }}
    </p>

    <div class="flex gap-2 justify-end pt-5">
      <div
        class="btn btn-ghost rounded-sm border-gray-500 text-gray-700"
        @click="onNegative"
      >
        Cancel
      </div>
      <div
        class="btn btn-primary rounded-sm"
        @click="onPositive"
      >
        Confirm
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { title, onConfirm, onDismiss } = defineProps<{
  title: string;
  subtitle: string;
  onConfirm: Function;
  onDismiss: Function;
}>();

function onPositive() {
  dialogStore.close();
  onConfirm();
}

function onNegative() {
  dialogStore.close();
  onDismiss();
}
</script>
  
  <style>
</style>