<template>
  <div class="flex flex-col gap-3">
    <div class="text-xl font-medium leading-6 text-gray-900">
      Are you sure?
    </div>
    <p class="text-sm text-gray-500">
      You will remove all your order units
    </p>

    <div class="flex gap-2 justify-end pt-5">
      <div
        class="btn btn-ghost rounded-sm border-gray-500 text-gray-700"
        @click="onReject"
      >
        Cancel
      </div>
      <div
        class="btn btn-error rounded-sm"
        @click="onConfirm"
      >
        Delete
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

function onConfirm() {
  printOrderStore.clear();
  dialogStore.close();
}

function onReject() {
  dialogStore.close();
}
</script>

<style>
</style>