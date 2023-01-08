

<template>
  <StoreCheckoutFormViewShippingMethod class="w-full" />
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";

const { context } = defineProps(["context"]);

const cartStore = useCartStore();

const { shippingMethod } = storeToRefs(cartStore);

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