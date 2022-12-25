<template>
  <div class="flex flex-col gap-1">
    <div class="card-title flex justify-start text-base text-gray-400 font-semibold px-2">
      SHIPPING
      <div
        class="btn btn-circle btn-ghost"
        @click="openDialog"
      >
        <Icon
          name="material-symbols:edit"
          size="22"
        />
      </div>
    </div>
    <div
      class="btn btn-outline border-gray-500 text-start text-base justify-start h-40 px-7 shadow-lg rounded-xl text-gray-800 hover:bg-gray-200 hover:text-gray-800"
      @click="openDialog"
    >
      <div v-if="shippingAddress">
        <strong>{{shippingAddress.first_name}} {{shippingAddress.last_name}}</strong>
        <p>{{shippingAddress.address}} </p>
        <p>{{shippingAddress.locality}} {{shippingAddress.postal_code}}</p>
        <p>{{shippingAddress.country}}</p>
        <p>{{shippingAddress.phone_number}}</p>
      </div>
      <div v-else-if="user?.profile?.shipping_address">
        <strong>{{user.profile.shipping_address.first_name}} {{user.profile.shipping_address.last_name}}</strong>
        <p>{{user.profile.shipping_address.address}}</p>
        <p>{{user.profile.shipping_address.locality}} {{user.profile.shipping_address.postal_code}}</p>
        <p>{{user.profile.shipping_address.country}}</p>
        <p>{{user.profile.shipping_address.phone_number}}</p>
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

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutFormShippingAddress", []);
}
</script>

<style>
</style>