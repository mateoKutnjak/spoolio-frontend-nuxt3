<template>
  <div
    class="btn btn-outline border-gray-500 text-start text-base justify-start px-7 shadow rounded-xl text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >{{contactEmail}}
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { contactEmail } = storeToRefs(printOrderStore);

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutFormEmail", []);
}
</script>

<style>
</style>