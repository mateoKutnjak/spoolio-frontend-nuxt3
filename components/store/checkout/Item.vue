<template>
  <div class="flex gap-10">
    <div v-if="cartItem?.product.productimage_set.length || 0 > 0">
      <nuxt-img
        class="rounded-md h-44 w-44 bg-white"
        :src="cartItem?.product.productimage_set[2].image"
        fit="contain"
      />
    </div>
    <div
      v-else
      class="h-44 w-44 rounded-2xl bg-gray-300"
    >
    </div>
    <div class="flex-1 flex flex-col gap-4 justify-end">
      <div>
        <div class="text-xl font-bold">{{cartItem?.product.title}}</div>
        <div class="text-md line-clamp-2">{{cartItem?.product.description}}</div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="text-md font-bold">Quantity: </div>
        <div class="text-lg font-bold text-info">{{ (cartItemQuantity || 0) }}</div>
      </div>
      <div class="flex gap-2">
        <div
          v-for="option in cartItem?.options"
          :key="option.id"
          class="btn btn-sm"
        >{{ option.type.name }}: {{ option.title }}</div>
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-end items-end">
      <div class="text-3xl font-bold">${{ (cartItem?.price || 0) * (cartItemQuantity || 0) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from "~~/stores/cart";

const cartStore = useCartStore();

const { id } = defineProps<{
  id: number;
}>();

const cartItem = cartStore.getCartItemForId(id);
const cartItemQuantity = cartStore.getCartItemQuantityForId(id);
</script>

<style>
</style>