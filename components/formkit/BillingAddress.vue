<template>
  <ServicesPrintingCheckoutBillingAddressOverview />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const printOrderStore = usePrintOrderStore();

const { billingAddress } = storeToRefs(printOrderStore);

watch(
  billingAddress,
  (value) => {
    if (isValidBillingAddress(value)) {
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