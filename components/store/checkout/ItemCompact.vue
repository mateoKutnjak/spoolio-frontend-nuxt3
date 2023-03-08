<template>
  <div class="flex gap-10 items-center">
    <div
      class="relative flex-none"
      v-if="cartItem?.product.productimage_set.length || 0 > 0"
    >
      <nuxt-img
        class="rounded-md h-24 w-24 bg-gray-200"
        :src="cartItem?.product.productimage_set[0].image"
        fit="contain"
      />
      <div class="absolute bottom-2 right-2 btn btn-xs btn-outline bg-white hover:bg-white text-gray-600 hover:text-gray-600 no-animation">x{{ cartItemQuantity }}</div>
    </div>
    <div
      v-else
      class="shrink-0 h-24 w-24 rounded-2xl bg-gray-300"
    >
    </div>
    <div class="flex-auto flex flex-col gap-2 justify-center">
      <div class="text-lg font-medium">{{cartItem?.product.title}}</div>
      <div class="flex gap-2 flex-wrap">
        <AttributeItem
          v-for="option in cartItem?.options"
          :key="option.id"
          :title="option.title"
        />
      </div>
    </div>
    <div class="text-xl font-medium">€{{ (cartItem?.price || 0) * (cartItemQuantity || 0) }}.00</div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from "~~/stores/cart";

const cartStore = useCartStore();

const { id } = defineProps<{
  id: number;
}>();

const cartItem = cartStore.getCartItemForId(id);
const cartItemQuantity = cartStore.getCartQuantityForId(id);
</script>

<style>
</style>