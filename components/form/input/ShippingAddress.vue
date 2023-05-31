<template>
  <div
    v-if="shipping_address && Object.keys(shipping_address).length"
    class="card compact px-3 bg-base-100 rounded-none border border-gray-400"
  >
    <div class="card-body">
      <div class="card-title text-base text-gray-400 font-normal justify-between items-center">
        <div class="text font-medium">{{ capitalizeOnlyFirstLetter($t('shipping_address')) }}</div>
        <div
          class="btn btn-ghost btn-circle btn-sm text-primary"
          @click="openDialog"
        >
          <Icon
            name="lucide:edit-2"
            size="18"
          />
        </div>
      </div>
      <div class="divider mt-0 mb-2 h-0"></div>
      <div class="flex flex-col gap-1 text-start text-sm font-normal text-gray-600">
        <strong>{{shipping_address.first_name}} {{shipping_address.last_name}}</strong>
        <p>{{shipping_address.address}} </p>
        <p>{{shipping_address.locality}} {{shipping_address.postal_code}}</p>
        <p>{{shipping_address.country}}</p>
        <p>{{shipping_address.phone_number}}</p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="btn btn-outline rounded-none flex gap-2 items-bottom italic font-normal text-gray-500"
    @click="openDialog"
  >
    <Icon
      class="text-info mb-0.5"
      name="lucide:plus-square"
      size="18"
    />
    {{ capitalizeOnlyFirstLetter($t('add_shipping_address')) }}
  </div>
</template>
    
    <script lang="ts" setup>
import { IAddressShipping } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";

const dialogStore = useDialogStore();

const { context } = defineProps(["context"]);

let shipping_address = ref(context.node.value);

onMounted(() => {
  if (isValidShippingAddress(shipping_address.value)) {
    context.node.input(shipping_address.value);
  } else {
    context.node.input("");
  }
});

function openDialog() {
  dialogStore.open(context.node.props.dialogComponent, {
    shipping_address: shipping_address.value,
    enableUseDefault: true,
    onSaved: (obj: IAddressShipping) => {
      context.node.input(obj);
      shipping_address.value = obj;
    },
  });
}
</script>
    
    <style>
</style>