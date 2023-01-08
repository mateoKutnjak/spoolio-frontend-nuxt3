

<template>
  <div
    class="w-full btn btn-ghost border-gray-300 text-start text-base justify-start h-20 px-7 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div
      class="w-full"
      v-if="shippingMethod && Object.keys(shippingMethod).length"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <div>
            {{shippingMethod.provider}}
          </div>
          <div class="font-light">
            {{shippingMethod.description}}
          </div>
        </div>
        <div>
          ${{shippingMethod.price}}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-normal text-gray-500">
        <Icon
          name="material-symbols:add"
          size="20"
        />
        Add shipping method
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
const { shippingMethod } = storeToRefs(printOrderStore);

onMounted(() => {
  context.node.input(shippingMethod.value || "");
});

watch(
  shippingMethod,
  (value) => {
    if (value) {
      context.node.input("1");
    } else {
      context.node.input("");
    }
  },
  { deep: true }
);

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutDialogShippingMethod", []);
}
</script>
  
  <style>
</style>