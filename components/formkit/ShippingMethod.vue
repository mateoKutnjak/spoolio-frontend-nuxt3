

<template>
  <ServicesPrintingCheckoutShippingMethodOverview class="w-full" />
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const printOrderStore = usePrintOrderStore();

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
</script>
  
  <style>
</style>