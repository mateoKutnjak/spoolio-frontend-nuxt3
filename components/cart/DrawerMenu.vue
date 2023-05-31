<template>
  <div class="menu w-80 bg-base-100 text-base-content flex justify-between">
    <div class="flex flex-col h-full">
      <ul
        v-if="cartItems.size > 0"
        class="p-4 h-full flex flex-col"
      >
        <div class="p-4 pb-8 flex gap-4 items-center">
          <Icon
            name="lucide:shopping-cart"
            class="block h-6 w-6"
            aria-hidden="true"
          />
          <h2 class="mt-1 text-xl">
            {{ capitalizeOnlyFirstLetter($t('cart_items')) }}
          </h2>
        </div>
        <div class="grow">
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
            />
          </li>
        </div>
        <div class="flex flex-col gap-1 p-4">
          <div class="flex gap-1 justify-end">
            <div class="py-2 text-lg">{{ capitalizeOnlyFirstLetter($t('total')) }}: </div>
            <strong class="py-2 text-xl text-end">€{{totalSum.toFixed(2)}}</strong>

          </div>
          <div class="justify-center items-end gap-2 text-2xl font-bold">
            <NuxtLink to="/store/checkout">
              <!-- * ClientOnly tag added to remove Hydration node musmatch warning -->
              <ClientOnly>
                <div
                  class="btn btn-success btn-block text-lg"
                  @click="drawerStore.close()"
                >{{ capitalizeOnlyFirstLetter($t('checkout')) }}</div>
              </ClientOnly>
            </NuxtLink>
          </div>
        </div>
      </ul>
      <ul
        v-else
        class="h-full flex flex-col"
      >
        <div class="h-full flex flex-col gap-2 italic justify-center items-center">
          <p class="font-bold text-gray-500 text-lg">{{ capitalizeOnlyFirstLetter($t('your_cart_is_empty')) }}</p>
        </div>
      </ul>
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