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
      <div v-if="print_order?.billing_address && Object.keys(print_order.billing_address).length">
        <div class="flex flex-col text-start text-base text-gray-800">
          <strong v-if="print_order.billing_address.type == BILLING_ADDRESS_TYPE_INDIVIDUAL">{{print_order.billing_address.first_name}} {{print_order.billing_address.last_name}}</strong>
          <strong v-else>{{print_order.billing_address.company_name}}</strong>
          <p class="font-normal">{{print_order.billing_address.address}}</p>
          <p class="font-normal">{{print_order.billing_address.locality}} {{print_order.billing_address.postal_code}}</p>
          <p class="font-normal">{{print_order.billing_address.country}}</p>
          <p class="font-normal">{{print_order.billing_address.phone_number}}</p>
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
import { BILLING_ADDRESS_TYPE_INDIVIDUAL } from "~~/constants/constants";
import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { usePrintOrderStore } from "~~/stores/print_order";

const { context } = defineProps(["context"]);

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const printOrderStore = usePrintOrderStore();

const { user } = storeToRefs(authStore);
const { print_order } = storeToRefs(printOrderStore);

onMounted(() => {
  if (!print_order.value) {
    throw createError("Printing order undefined");
  }

  if (!Object.keys(print_order.value.billing_address).length) {
    if (user.value?.profile?.billing_address) {
      print_order.value!.billing_address = user.value.profile.billing_address;
    }
  }

  if (isValidBillingAddress(print_order.value!.billing_address)) {
    context.node.input("1");
  } else {
    context.node.input("");
  }
});

watch(
  print_order,
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
  dialogStore.open("ServicesPrintingCheckoutDialogBillingAddress", []);
}
</script>

<style>
</style>