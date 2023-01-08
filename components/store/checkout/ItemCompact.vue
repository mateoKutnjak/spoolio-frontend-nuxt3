<template>
  <div class="flex gap-10 items-center">
    <div
      class="flex-none"
      v-if="cartItem?.product.productimage_set.length || 0 > 0"
    >
      <nuxt-img
        class="rounded-md h-24 w-24 bg-gray-200"
        :src="cartItem?.product.productimage_set[0].image"
        fit="contain"
      />
    </div>
    <div
      v-else
      class="shrink-0 h-24 w-24 rounded-2xl bg-gray-300"
    >
    </div>
    <div class="flex-auto flex flex-col gap-2 justify-center">
      <div class="flex gap-1 items-center">
        <div class="text-lg font-medium">{{cartItem?.product.title}}</div>
        <Icon name="ci:dot-02-s" />
        <div class="text-md text-gray-500 mr-1">Quantity: </div>
        <div class="text-lg font-bold text-info">{{ (cartItemQuantity || 0) }}</div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <div
          v-for="option in cartItem?.options"
          :key="option.id"
          class="btn btn-outline btn-xs no-animation"
        >{{ option.type.name }}: {{ option.title }}</div>
      </div>
    </div>
    <div class="text-xl font-medium">${{ (cartItem?.price || 0) * (cartItemQuantity || 0) }}.00</div>
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