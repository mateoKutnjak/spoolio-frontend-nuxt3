<template>
  <StoreCheckoutFormViewEmail class="w-full" />
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";

const { context } = defineProps(["context"]);

const cartStore = useCartStore();

const { contactEmail } = storeToRefs(cartStore);

onMounted(() => {
  context.node.input(contactEmail.value || "");
});

watch(contactEmail, (value) => {
  context.node.input(value);
});
</script>
  
  <style>
</style>