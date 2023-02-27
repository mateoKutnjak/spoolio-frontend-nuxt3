

<template>
  <div
    class="w-full btn btn-ghost border-gray-300 text-start text-base justify-start h-20 px-7 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
    @click="openDialog"
  >
    <div
      class="w-full"
      v-if="store_order?.shipping_method && Object.keys(store_order.shipping_method).length"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <div>
            {{store_order.shipping_method.provider}}
          </div>
          <div class="font-light">
            {{store_order.shipping_method.description}}
          </div>
        </div>
        <div>
          ${{store_order.shipping_method.price}}
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

const { context } = defineProps(["context"]);

const authStore = useAuthStore();
const cartStore = useCartStore();
const dialogStore = useDialogStore();

const { user } = storeToRefs(authStore);
const { store_order } = storeToRefs(cartStore);

onMounted(() => {
  context.node.input(store_order.value?.shipping_method || "");
});

watch(
  store_order,
  (value) => {
    if (value.shipping_method) {
      context.node.input("1");
    } else {
      context.node.input("");
    }
  },
  { deep: true }
);

function openDialog() {
  dialogStore.open("StoreCheckoutDialogShippingMethod", []);
}
</script>
  
  <style>
</style>