<template>
  <div class="flex flex-col gap-6 items-start">
    <div class="flex flex-col gap-1">
      <div class="text-md font-bold">{{combination.product?.title || 'null'}} <NuxtLink :to="`/store/${combination.product?.id}`">
          <div
            class="btn btn-ghost btn-xs text-blue-500"
            @click="drawerStore.close()"
          >Details</div>
        </NuxtLink>
      </div>
      <div>{{combination.product?.description}}
      </div>

    </div>
    <div class="flex gap-2 justify-start">
      <div
        class="btn btn-outline btn-sm no-animation"
        v-for="option in combination.options"
        :key="option.id"
      > {{ option.title }}</div>
    </div>
    <div class="w-full flex justify-between items-start">
      <IncreaseDecreaseQuantityButtons
        :max="MAX_CART_ITEMS"
        :min="0"
        :initialValue="quantity"
        :key="quantity"
        @on-decrease-value="decreaseQuantity"
        @on-increase-value="increaseQuantity"
        @on-value-set="(q) => setQuantity(q) "
      />
      <div class="text-xl font-bold mt-2">${{floor2Decimals(combination.price * quantity).toFixed(2) }}</div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useDrawerStore } from "~~/stores/drawer";
import { useCartStore } from "~~/stores/cart";

import { storeToRefs } from "pinia";
import { useNotificationStore } from "~~/stores/notification";
import { MAX_CART_ITEMS } from "~~/constants/constants";
import { IProductVariationOptionCombination } from "~~/constants/data";

const cartStore = useCartStore();
const drawerStore = useDrawerStore();

const { combination } = defineProps<{
  combination: IProductVariationOptionCombination;
}>();

const quantity = computed(() => {
  return cartStore.getCartQuantityForId(combination.id);
});

console.log(quantity);

function increaseQuantity() {
  cartStore.add(combination.id, combination);
}

function decreaseQuantity() {
  cartStore.remove(combination.id);
}

function setQuantity(quantity: number) {
  cartStore.setQuantity(combination.id, combination, quantity);
}
</script>
  
  <style scoped>
.router-link-exact-active {
  background-color: transparent;
}
</style>