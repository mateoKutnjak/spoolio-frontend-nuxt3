<template>
  <div
    class="w-full btn btn-ghost border-gray-300 text-start text-base justify-start px-4 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div v-if="print_order?.contact_email">
      <h1 class="font-normal">{{print_order?.contact_email}}</h1>
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-normal text-gray-500">
        <Icon
          name="material-symbols:add"
          size="20"
        />
        Add email
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { print_order } = storeToRefs(printOrderStore);

onMounted(() => {
  if (!print_order.value) {
    throw createError("Printing order undefined");
  }

  if (
    !print_order.value.contact_email ||
    !Object.keys(print_order.value.contact_email)
  ) {
    if (user.value?.profile?.email) {
      print_order.value!.contact_email = user.value.profile.email;
    }
  }

  context.node.input(print_order.value?.contact_email || "");
});

watch(print_order, (value) => {
  context.node.input(value?.contact_email);
});

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutDialogContactEmail", []);
}
</script>
  
  <style>
</style>