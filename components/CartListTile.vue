<template>
  <div class="grid gap-4">
    <div class="">sdflgkjsdf sfjg klsdfjg sdjg sldgldsfhj gklsjdh gklsjdfhgghskfh dhsl hg</div>
    <div>
      <div class="flex justify-end gap-4">
        <NuxtLink :to="`/store/${item.id}`">
          <div class="btn btn-outline btn-sm">Details</div>
        </NuxtLink>
        <div class="btn-group">
          <button
            class="btn btn-primary btn-sm"
            @click="decreaseQuantity"
          >-</button>
          <button class="btn btn-sm">{{quantity}}</button>
          <button
            class="btn btn-primary btn-sm "
            @click="increaseQuantity"
          >+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore();

const { item, quantity } = defineProps(["item", "quantity"]); // props

function increaseQuantity() {
  cartStore.add(item);
}

function decreaseQuantity() {
  cartStore.remove(item);
}
</script>

<style>
</style>