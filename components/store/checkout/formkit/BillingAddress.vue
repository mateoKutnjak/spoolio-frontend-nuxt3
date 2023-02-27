<template>
  <div class="flex flex-col">
    <div class="card-title flex justify-start text-base text-gray-400 font-semibold px-2">
      BILLING
      <div
        class="btn btn-circle btn-ghost"
        @click="openDialog"
      >
        <Icon
          name="material-symbols:edit-outline"
          size="22"
        />
      </div>
    </div>
    <div
      class="btn btn-ghost border-gray-300 text-start text-base justify-start h-40 px-7 rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
      @click="openDialog"
    >
      <div v-if="store_order?.billing_address && Object.keys(store_order.billing_address).length">
        <div class="flex flex-col text-start text-base text-gray-800">
          <strong>{{store_order.billing_address.first_name}} {{store_order.billing_address.last_name}}</strong>
          <p class="font-normal">{{store_order.billing_address.address}}</p>
          <p class="font-normal">{{store_order.billing_address.locality}} {{store_order.billing_address.postal_code}}</p>
          <p class="font-normal">{{store_order.billing_address.country}}</p>
          <p class="font-normal">{{store_order.billing_address.phone_number}}</p>
        </div>
      </div>
      <div v-else>
        <h1 class="flex gap-2 items-center italic font-normal text-gray-500 text-center">
          Add billing address
        </h1>
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
const dialogStore = useDialogStore();
const cartStore = useCartStore();

const { user } = storeToRefs(authStore);
const { store_order } = storeToRefs(cartStore);

onMounted(() => {
  if (!store_order.value) {
    throw createError("Printing order undefined");
  }

  if (!Object.keys(store_order.value.billing_address).length) {
    if (user.value?.profile?.billing_address) {
      console.error("TODO check if billing address updates (see linr below)");
      store_order.value!.billing_address = user.value.profile.billing_address;
    }
  }

  if (isValidShippingAddress(store_order.value!.shipping_address)) {
    context.node.input("1");
  } else {
    context.node.input("");
  }
});

watch(
  store_order,
  (value) => {
    if (isValidBillingAddress(value?.billing_address)) {
      context.node.input("1");
    } else {
      context.node.input("");
    }
  },
  { deep: true }
);

function openDialog() {
  dialogStore.open("StoreCheckoutDialogBillingAddress", []);
}
</script>

<style>
</style>