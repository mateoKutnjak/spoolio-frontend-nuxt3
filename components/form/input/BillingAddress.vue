<template>
  <div
    class="h-full btn btn-block btn-ghost no-animation btn-lg gap-4 rounded-md border border-stone-400/80 text-stone-500"
    @click="context.disabled ? () => null : openDialog()"
  >
    <div
      v-if="billing_address && Object.keys(billing_address).length"
      class="w-full py-5 flex flex-col gap-4"
    >
      <div class="flex text-lg font-normal justify-between items-center">
        <div class="text-stone-400 font-bold">{{ $t('billing').toUpperCase() }}</div>
        <Icon
          name="ph:note-pencil-bold"
          size="25"
        />
      </div>
      <div class="flex flex-col text-start text-lg font-medium text-stone-500">
        <strong v-if="billing_address.type == BILLING_ADDRESS_TYPE_INDIVIDUAL">{{billing_address.first_name}} {{billing_address.last_name}}</strong>
        <strong v-else>{{billing_address.company_name}}</strong>
        <p>{{billing_address.address}} </p>
        <p>{{billing_address.locality}} {{billing_address.postal_code}}</p>
        <p>{{billing_address.country}}</p>
        <p>{{billing_address.phone_number}}</p>
        <div v-if="billing_address.type == BILLING_ADDRESS_TYPE_COMPANY">VAT ID: <strong>{{billing_address.vat_id}}</strong></div>
      </div>
    </div>
    <div
      v-else
      class="py-5 text-sm font-bold flex gap-2 items-center"
    >
      <Icon
        name="ph:credit-card"
        size="25"
      />
      <div class="mt-0.5">
        {{ capitalizeOnlyFirstLetter($t('add_billing_address')) }}
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import {
  BILLING_ADDRESS_TYPE_COMPANY,
  BILLING_ADDRESS_TYPE_INDIVIDUAL,
} from "~~/constants/constants";
import { IAddressBilling } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const { t } = useI18n();

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
  dialogStore.open(
    context.node.props.dialogComponent,
    {
      billing_address: billing_address.value,
      enableUseDefault: true,
      onSaved: (obj: IAddressBilling) => {
        context.node.input(obj);
        billing_address.value = obj;
      },
    },
    (t("add") + " " + t("billing_address__dativ")).toUpperCase()
  );
}
</script>
  
  <style>
</style>