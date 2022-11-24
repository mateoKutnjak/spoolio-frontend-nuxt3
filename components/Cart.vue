<template>
  <ul class="menu p-4 w-80 bg-base-100 text-base-content">
    <li
      v-for="item in getItems"
      :key="item.id"
    >
      <CartListTile :item="item" />
    </li>

    <!-- Sidebar content here -->
    <li><a>Sidebar Item 1</a></li>
    <li><a>Sidebar Item 2</a></li>

  </ul>
</template>

<script setup>
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore();

const getItems = computed(() => {
  return cartStore.getItems;
});
</script>

<style>
</style>