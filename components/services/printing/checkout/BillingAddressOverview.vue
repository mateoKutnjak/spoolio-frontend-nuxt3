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
      <div v-if="Object.keys(billingAddress).length">
        <div class="flex flex-col text-start text-base text-gray-800">
          <strong>{{billingAddress.first_name}} {{billingAddress.last_name}}</strong>
          <p class="font-normal">{{billingAddress.address}}</p>
          <p class="font-normal">{{billingAddress.locality}} {{billingAddress.postal_code}}</p>
          <p class="font-normal">{{billingAddress.country}}</p>
          <p class="font-normal">{{billingAddress.phone_number}}</p>
        </div>
      </div>
      <div v-else-if="user?.profile?.billing_address">
        <h2 class="flex flex-col text-start text-base text-gray-800">
          <strong>{{user.profile.billing_address.first_name}} {{user.profile.billing_address.last_name}}</strong>
          <p class="font-normal">{{user.profile.billing_address.address}}</p>
          <p class="font-normal">{{user.profile.billing_address.locality}} {{user.profile.billing_address.postal_code}}</p>
          <p class="font-normal">{{user.profile.billing_address.country}}</p>
          <p class="font-normal">{{user.profile.billing_address.phone_number}}</p>
        </h2>
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
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { billingAddress } = storeToRefs(printOrderStore);

function openDialog() {
  dialogStore.open("ServicesPrintingCheckoutFormBillingAddress", []);
}
</script>

<style>
</style>