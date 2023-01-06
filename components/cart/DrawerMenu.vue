<template>
  <div class="menu p-4 w-80 bg-base-100 text-base-content flex justify-between">
    <div class="flex flex-col">
      <ul>
        <div v-if="cartItems.size > 0">
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
            v-for="item, index in cartItems.keys()"
            :key="item.id"
          >
            <CartItem
              :combination="item"
              :quantity="cartItems.get(item) || 0"
            />
            <div
              class="divider"
              v-if="index < cartItems.size - 1"
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
    <div class="flex flex-col p-4">
      <strong class="py-2 text-lg ">Total: ${{totalSum}}</strong>
      <div class="justify-center items-end gap-2 text-2xl font-bold">
        <NuxtLink to="/store/checkout">
          <div
            class="btn btn-success btn-block text-lg"
            @click="drawerStore.close()"
          >Checkout</div>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "~~/stores/cart";
import { useDrawerStore } from "~~/stores/drawer";
import { IProductVariationOptionCombinationResponse } from "~~/stores/product";

const cartStore = useCartStore();
const drawerStore = useDrawerStore();

const { cartItems } = storeToRefs(cartStore);

const totalSum = ref(0);

watch(cartItems, (value) => {
  let tmpTotalValue = 0;

  cartItems.value.forEach(
    (value: number, key: IProductVariationOptionCombinationResponse) => {
      tmpTotalValue += value * key.price;
    }
  );

  totalSum.value = tmpTotalValue;
});
</script>
  
  <style scoped>
.router-link-exact-active {
  background-color: transparent;
}
</style>