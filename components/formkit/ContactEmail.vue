<template>
  <ServicesPrintingCheckoutEmailOverview class="w-full" />
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const printOrderStore = usePrintOrderStore();

const { contactEmail } = storeToRefs(printOrderStore);

onMounted(() => {
  context.node.input(contactEmail.value || "");
});

watch(contactEmail, (value) => {
  context.node.input(value);
});
</script>
  
  <style>
</style>