<template>
  <div
    class="h-full btn btn-block btn-ghost btn-lg no-animation gap-6 rounded-md border border-stone-400/80 text-stone-500"
    @click="openDialog"
  >
    <div
      v-if="shipping_address && Object.keys(shipping_address).length"
      class="w-full py-5 flex flex-col gap-4"
    >
      <div class="flex text-sm font-normal justify-between items-center">
        <div class="text-stone-400 font-bold text-lg">{{ $t('shipping').toUpperCase() }}</div>
        <Icon
          name="ph:note-pencil-bold"
          size="25"
        />
      </div>
      <div class="flex flex-col text-start text-lg font-medium text-stone-500">
        <strong>{{shipping_address.first_name}} {{shipping_address.last_name}}</strong>
        <p>{{shipping_address.address}} </p>
        <p>{{shipping_address.locality}} {{shipping_address.postal_code}}</p>
        <p>{{shipping_address.country}}</p>
        <p>{{shipping_address.phone_number}}</p>
      </div>
    </div>
    <div
      v-else
      class="py-5 text-sm font-bold flex gap-2 items-center"
    >
      <Icon
        name="ph:house"
        size="25"
      />
      <div class="mt-0.5">
        {{ capitalizeOnlyFirstLetter($t('add_shipping_address')) }}
      </div>
    </div>
  </div>
</template>
    
    <script lang="ts" setup>
import { IAddressShipping } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const { t } = useI18n();

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let shipping_address = ref(context.node.value);

function openDialog() {
  dialogStore.open(
    context.node.props.dialogComponent,
    {
      shipping_address: shipping_address.value,
      enableUseDefault: true,
      onSaved: (obj: IAddressShipping) => {
        context.node.input(obj);
      },
    },
    (t("add") + " " + t("shipping_address__dativ")).toUpperCase()
  );
}
</script>
    
    <style>
</style>