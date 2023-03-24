

<template>
  <div
    class="w-full btn btn-ghost border-gray-300 text-start text-base justify-start h-20 px-7 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div
      class="w-full"
      v-if="print_order?.shipping_method && Object.keys(print_order.shipping_method).length"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <div>
            {{print_order.shipping_method.provider}}
          </div>
          <div class="font-light">
            {{print_order.shipping_method.description}}
          </div>
        </div>
        <div>
          €{{print_order.shipping_method.price}}
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
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

const { print_order } = storeToRefs(printOrderStore);

onMounted(() => {
  context.node.input(print_order.value?.shipping_method || "");
});

watch(
  print_order,
  (value) => {
    if (value?.shipping_method) {
      context.node.input("1");
    } else {
      context.node.input("");
    }
  },
  { deep: true }
);

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutDialogShippingMethod", {});
}
</script>
  
  <style>
</style>