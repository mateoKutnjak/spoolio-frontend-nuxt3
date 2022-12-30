<template>
  <ServicesPrintingCheckoutShippingAddressOverview />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const printOrderStore = usePrintOrderStore();

const { shippingAddress } = storeToRefs(printOrderStore);

onMounted(() => {
  if (isValidShippingAddress(shippingAddress.value)) {
      context.node.input("1");
    } else {
      context.node.input("");
    }
});

watch(
  shippingAddress,
  (value) => {
    if (isValidShippingAddress(value)) {
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