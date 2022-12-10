<template>
  <div class="menu p-4 w-80 bg-base-100 text-base-content flex justify-between">
    <div class="flex flex-col">
      <ul>
        <div v-if="getCartItems.size > 0">
          <div class="p-4 pb-12 flex gap-2 items-center">
            <Icon
              name="material-symbols:shopping-cart-rounded"
              class="block h-6 w-6"
              aria-hidden="true"
            />
            <h2 class=" text-2xl">
              Cart items
            </h2>
          </div>
          <li
            v-for="(item, index) in Array.from(getCartItems)"
            :key="item[0].id"
          >
            <CartListTile
              :item="item[0]"
              :quantity="item[1]"
            />
            <div
              class="divider"
              v-if="index < getCartItems.size - 1"
              :key="`${index}-divider`"
            >
            </div>
          </li>
        </div>
        <div v-else>
          <div class="flex flex-col h-screen justify-center items-center gap-1">
            <Icon
              name="ph:shopping-cart"
              size="30"
              aria-hidden="true"
            />
            <p>Your cart is empty</p>
          </div>
        </div>
      </ul>
    </div>
    <div class="flex flex-col">
      <strong class="py-2 text-lg ">Total: ${{getItems.reduce((acc, item) => Number(acc) + Number(item.price), 0)}}</strong>
      <div class="justify-center items-end gap-2 text-2xl font-bold">
        <NuxtLink to="/checkout">
          <div
            class="btn btn-success btn-block"
            @click="drawerStore.close()"
          >Checkout</div>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from "../stores/cart";
import { useDrawerStore } from "../stores/drawer";

const cartStore = useCartStore();
const drawerStore = useDrawerStore();

const getItems = computed(() => {
  return cartStore.getItems;
});

const getCartItems = computed(() => {
  return cartStore.getCartItems;
});
</script>

<style scoped>
.router-link-exact-active {
  background-color: transparent;
}
</style>