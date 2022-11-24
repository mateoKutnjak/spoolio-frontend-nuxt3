<template>
  <ul class="menu p-4 w-80 bg-base-100 text-base-content">
    <h2 class="p-4">Your cart</h2>
    <li
      v-for="[item, quantity] in Array.from(getCartItems)"
      :key="item.id"
    >
      <CartListTile
        :item="item"
        :quantity="quantity"
      />
    </li>

  </ul>
</template>

<script setup>
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore();

const getCartItems = computed(() => {
  console.log(cartStore.getCartItems);
  return cartStore.getCartItems;
});
</script>

<style>
</style>