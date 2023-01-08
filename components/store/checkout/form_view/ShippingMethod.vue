<template>
  <div
    class="btn btn-ghost border-gray-300 text-start text-base justify-start h-20 px-7 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div
      class="w-full"
      v-if="shippingMethod && Object.keys(shippingMethod).length"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <div>
            {{shippingMethod.provider}}
          </div>
          <div class="font-light">
            {{shippingMethod.description}}
          </div>
        </div>
        <div>
          ${{shippingMethod.price}}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 items-center italic font-normal text-gray-500">
        <Icon
          name="material-symbols:add"
          size="20"
        />
        Add shipping method
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useCartStore } from "~~/stores/cart";
import { useDialogStore } from "~~/stores/dialog";
import { useShippingMethodStore } from "~~/stores/shipping_method";

const authStore = useAuthStore();
const cartStore = useCartStore();
const dialogStore = useDialogStore();
const shippingMethodStore = useShippingMethodStore();

const { user } = storeToRefs(authStore);
const { shippingMethod } = storeToRefs(cartStore);

function openDialog() {
  dialogStore.open("StoreCheckoutFormDialogShippingMethod", []);
}
</script>

<style>
</style>