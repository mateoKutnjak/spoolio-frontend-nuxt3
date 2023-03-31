<template>
  <div class="menu p-4 w-80 bg-base-100 text-base-content flex justify-between">
    <div class="flex flex-col">
      <ul>
        <div v-if="cartItems.size > 0">
          <div class="p-4 pb-12 flex gap-2 items-center">
            <Icon
              name="lucide:shopping-cart"
              class="block h-6 w-6"
              aria-hidden="true"
            />
            <h2 class=" text-2xl">
              Cart items
            </h2>
          </div>
          <li
            v-for="value, index in cartItems.values()"
            :key="value[0].id"
          >
            <CartItem
              :combination="value[0]"
              :quantity="value[1]"
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
          <div class="flex flex-col gap-2 italic h-screen justify-center items-center">
            <p class="font-bold text-gray-500 text-lg">Your cart is empty</p>
          </div>
        </div>
      </ul>
    </div>
    <div class="flex flex-col gap-1 p-4">
      <div class="flex gap-1 justify-end">
        <div class="py-2 text-lg">Total: </div>
        <strong class="py-2 text-xl text-end">${{totalSum.toFixed(2)}}</strong>

      </div>
      <div class="justify-center items-end gap-2 text-2xl font-bold">
        <NuxtLink to="/store/checkout">
          <!-- * ClientOnly tag added to remove Hydration node musmatch warning -->
          <ClientOnly>
            <div
              class="btn btn-success btn-block text-lg"
              @click="drawerStore.close()"
            >{{ isLoggedIn ? 'Checkout' : 'Checkout as guest'}}</div>
          </ClientOnly>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { IProductVariationOptionCombination } from "~~/constants/data";
import { useAuthStore } from "~~/stores/auth";
import { useCartStore } from "~~/stores/cart";
import { useDrawerStore } from "~~/stores/drawer";

const authStore = useAuthStore();
const cartStore = useCartStore();
const drawerStore = useDrawerStore();

const { cartItems } = storeToRefs(cartStore);

const isLoggedIn = computed(() => authStore.loggedIn);

const totalSum = ref(0);

watch(cartItems, (value) => {
  let tmpTotalValue = 0;

  cartItems.value.forEach(
    (value: [IProductVariationOptionCombination, number], key: number) => {
      tmpTotalValue += value[1] * value[0].price;
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