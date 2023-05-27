<template>
  <div class="bg-stone-300/70 flex flex-col gap-6 items-start">
    <div class="flex flex-col gap-1">
      <div class="flex">
        <div class="text-md font-bold line-clamp-2">{{combination.product?.title || 'null'}}

        </div>
        <div
          class="btn btn-ghost btn-sm btn-circle text-error"
          @click="onDeleteClicked"
        >
          <Icon
            name="lucide:trash-2"
            size="20"
          />
        </div>
      </div>
      <div>{{combination.product?.description}}
      </div>
      <NuxtLink :to="`/store/${combination.product?.id}`">
        <div
          class="-ml-3 btn btn-ghost btn-sm text-info"
          @click="drawerStore.close()"
        >Details</div>
      </NuxtLink>

    </div>
    <div class="flex gap-2 justify-start">
      <AttributeItem
        v-for="option in combination.options"
        :key="option.id"
        :title="option.title"
      />
    </div>
    <div class="w-full flex justify-between items-start">
      <IncreaseDecreaseQuantityButtons
        :max="MAX_CART_ITEMS"
        :min="1"
        :initialValue="quantity"
        @on-decrease-value="decreaseQuantity"
        @on-increase-value="increaseQuantity"
        @on-value-set="(q) => setQuantity(q) "
      />
      <div class="text-xl font-bold mt-2">${{(combination.price * quantity).toFixed(2) }}</div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useDrawerStore } from "~~/stores/drawer";
import { useCartStore } from "~~/stores/cart";

import { MAX_CART_ITEMS } from "~~/constants/constants";
import { IProductVariationOptionCombination } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const cartStore = useCartStore();
const dialogStore = useDialogStore();
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

function onDeleteClicked() {
  dialogStore.open("DialogConfirm", {
    title: `Are you sure about that?`,
    subtitle: `You will remove this item from your cart`,
    onConfirm: () => {
      cartStore.removeAll(combination.id);
    },
    onDismiss: () => {},
  });
}
</script>
  
  <style scoped>
.router-link-exact-active {
  background-color: transparent;
}
</style>