<template>
  <div class="flex flex-col">
    <div class="card-title flex justify-start text-base text-gray-400 font-semibold px-2">
      SHIPPING
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
      <div v-if="Object.keys(shippingAddress).length">
        <div class="flex flex-col text-start text-base text-gray-800">
          <strong>{{shippingAddress.first_name}} {{shippingAddress.last_name}}</strong>
          <p class="font-normal">{{shippingAddress.address}} </p>
          <p class="font-normal">{{shippingAddress.locality}} {{shippingAddress.postal_code}}</p>
          <p class="font-normal">{{shippingAddress.country}}</p>
          <p class="font-normal">{{shippingAddress.phone_number}}</p>
        </div>
      </div>
      <div v-else>
        <h1 class="flex gap-2 items-center italic font-normal text-gray-500 text-center">
          Add shipping address
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { shippingAddress } = storeToRefs(printOrderStore);

onMounted(() => {
  if (!Object.keys(shippingAddress.value).length) {
    if (user.value?.profile?.shipping_address) {
      shippingAddress.value = user.value.profile.shipping_address;
    }
  }
});

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutFormShippingAddress", []);
}
</script>

<style>
</style>