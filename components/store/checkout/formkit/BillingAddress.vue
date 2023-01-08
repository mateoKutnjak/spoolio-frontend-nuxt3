<template>
  <StoreCheckoutFormViewBillingAddress />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";

const { context } = defineProps(["context"]);

const cartStore = useCartStore();

const { billingAddress } = storeToRefs(cartStore);

onMounted(() => {
  if (isValidShippingAddress(billingAddress.value)) {
      context.node.input("1");
    } else {
      context.node.input("");
    }
});

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