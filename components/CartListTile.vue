<template>
  <div class="grid gap-6">
    <div class="grid gap-1">
      <div class="text-md font-bold">{{item.title}} <NuxtLink :to="`/store/${item.id}`">
          <div
            class="btn btn-ghost btn-xs text-blue-500"
            @click="drawerStore.close()"
          >Details</div>
        </NuxtLink>
      </div>
      <div>{{item.description}}
      </div>
    </div>
    <div class="flex justify-between items-end">
      <div class="btn-group">
        <button
          class="btn btn-primary btn-sm"
          @click="decreaseQuantity"
        >-</button>
        <button class="btn btn-sm">{{quantity}}x</button>
        <button
          class="btn btn-primary btn-sm "
          @click="increaseQuantity"
        >+</button>
      </div>
      <p class="text-xl font-bold">${{item.price * quantity}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDrawerStore } from "~~/stores/drawer";
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore();
const drawerStore = useDrawerStore();

const { item, quantity } = defineProps(["item", "quantity"]); // props

function increaseQuantity() {
  cartStore.add(item);
}

function decreaseQuantity() {
  cartStore.remove(item);
}
</script>

<style scoped>
.router-link-exact-active {
  background-color: transparent;
}
</style>