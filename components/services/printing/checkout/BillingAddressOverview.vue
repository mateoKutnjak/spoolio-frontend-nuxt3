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
      class="btn btn-ghost border-gray-300 text-start text-base justify-start h-40 px-7 shadow-lg rounded-md text-gray-800 hover:bg-gray-200 hover:text-gray-800"
      @click="openDialog"
    >
      <div v-if="Object.keys(billingAddress).length">
        <div class="text-start text-base text-gray-800">
          <strong>{{billingAddress.first_name}} {{billingAddress.last_name}}</strong>
          <p>{{billingAddress.address}}</p>
          <p>{{billingAddress.locality}} {{billingAddress.postal_code}}</p>
          <p>{{billingAddress.country}}</p>
          <p>{{billingAddress.phone_number}}</p>
        </div>
      </div>
      <div v-else-if="user?.profile?.billing_address">
        <div class="text-start text-base text-gray-800">
          <strong>{{user.profile.billing_address.first_name}} {{user.profile.billing_address.last_name}}</strong>
          <p>{{user.profile.billing_address.address}}</p>
          <p>{{user.profile.billing_address.locality}} {{user.profile.billing_address.postal_code}}</p>
          <p>{{user.profile.billing_address.country}}</p>
          <p>{{user.profile.billing_address.phone_number}}</p>
        </div>
      </div>
      <div v-else>
        <div class="flex gap-2 items-center italic font-normal text-gray-500">
          <Icon
            name="material-symbols:add"
            size="20"
          />
          Add billing address
        </div>
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