<template>
  <StoreCheckoutFormViewShippingAddress />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";

const { context } = defineProps(["context"]);

const cartStore = useCartStore();

const { shippingAddress } = storeToRefs(cartStore);

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