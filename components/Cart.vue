<template>
  <ul class="menu p-4 w-80 bg-base-100 text-base-content">
    <div v-if="getCartItems.size > 0">
      <h2 class="p-4">Items in your cart</h2>
      <li
        v-for="[item, quantity] in Array.from(getCartItems)"
        :key="item.id"
      >
        <CartListTile
          :item="item"
          :quantity="quantity"
        />
      </li>
    </div>
    <div v-else>
      <div class="flex h-screen justify-center items-center gap-2">
        <div class="text-center ">
          <Icon
            name="material-symbols:remove-shopping-cart-outline-rounded"
            size="30"
            aria-hidden="true"
          />
          <p>Your cart is empty</p>
        </div>
      </div>
    </div>
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