<template>
  <div
    v-if="billing_address && Object.keys(billing_address).length"
    class="card compact px-3 bg-base-100 rounded-none border border-gray-400"
  >
    <div class="card-body">
      <div class="card-title text-base text-gray-400 font-normal justify-between items-center">
        <div class="text font-medium">{{ capitalizeOnlyFirstLetter($t('billing_address')) }}</div>
        <div
          class="btn btn-ghost btn-circle btn-sm text-primary"
          @click="openDialog"
        >
          <Icon
            name="ph:note-pencil"
            size="22"
          />
        </div>
      </div>
      <div class="divider mt-0 mb-2 h-0"></div>
      <div class="flex flex-col gap-1 text-start text-sm font-normal text-gray-600">
        <strong v-if="billing_address.type == BILLING_ADDRESS_TYPE_INDIVIDUAL">{{billing_address.first_name}} {{billing_address.last_name}}</strong>
        <strong v-else>{{billing_address.company_name}}</strong>
        <p>{{billing_address.address}} </p>
        <p>{{billing_address.locality}} {{billing_address.postal_code}}</p>
        <p>{{billing_address.country}}</p>
        <p>{{billing_address.phone_number}}</p>
        <div v-if="billing_address.type == BILLING_ADDRESS_TYPE_COMPANY">VAT ID: <strong>{{billing_address.vat_id}}</strong></div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="btn btn-outline rounded-none flex gap-2 items-bottom italic font-bold text-gray-500"
    @click="openDialog"
  >
    <Icon
      class="text-info mb-0.5"
      name="ph:plus-square"
      size="18"
    />
    {{ capitalizeOnlyFirstLetter($t('add_billing_address')) }}
  </div>
</template>
  
  <script lang="ts" setup>
import {
  BILLING_ADDRESS_TYPE_COMPANY,
  BILLING_ADDRESS_TYPE_INDIVIDUAL,
} from "~~/constants/constants";
import { IAddressBilling } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let billing_address = ref(context.node.value);

onMounted(() => {
  if (isValidBillingAddress(billing_address.value)) {
    context.node.input(billing_address.value);
  } else {
    context.node.input("");
  }
});

function openDialog() {
  dialogStore.open(context.node.props.dialogComponent, {
    billing_address: billing_address.value,
    enableUseDefault: true,
    onSaved: (obj: IAddressBilling) => {
      context.node.input(obj);
      billing_address.value = obj;
    },
  });
}
</script>
  
  <style>
</style>