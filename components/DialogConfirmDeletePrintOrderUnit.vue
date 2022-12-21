<template>
  <div class="flex flex-col gap-4">
    <DialogTitle
      as="h3"
      class="text-lg font-medium leading-6 text-gray-900"
    >
      Are you sure?
    </DialogTitle>
    <p class="text-sm text-gray-500">
      By deleting this unit all its data will be lost
    </p>

    <div class="flex gap-2 justify-end">
      <div
        class="btn btn-outline border-gray-500 text-gray-700"
        @click="onReject"
      >
        Cancel
      </div>
      <div
        class="btn btn-error"
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

const { props } = defineProps(["props"]);

const localUrl = props[0];

function onConfirm() {
  printOrderStore.removeUnitByFileLocalUrl(localUrl);
  dialogStore.close();
}

function onReject() {
  dialogStore.close();
}
</script>

<style>
</style>