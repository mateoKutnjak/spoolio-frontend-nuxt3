<template>
  <div class="flex flex-col gap-6">
    <SelectSingleChoice
      :options="shippingMethods"
      :preselect-option="shipping_method"
      :extract-id="el => el.id"
      :extract-title="el => `${el.provider} • €${el.price}`"
      :extract-description="el => `${el.description}`"
      :full-width="true"
      @on-selection-change="el => selected = el"
    />
    <div
      class="btn btn-block btn-primary text-lg"
      @click="onSubmit"
    >{{ capitalizeOnlyFirstLetter($t('save')) }}</div>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { IShippingMethod } from "~~/constants/data";
import { useDialogStore } from "~~/stores/dialog";
import { useShippingMethodStore } from "~~/stores/shipping_method";

const dialogStore = useDialogStore();
const shippingMethodStore = useShippingMethodStore();

const { shippingMethods } = storeToRefs(shippingMethodStore);

const { shipping_method, enableUseDefault, onSaved } = defineProps<{
  shipping_method: IShippingMethod;
  enableUseDefault: boolean;
  onSaved: Function;
}>();

const selected = ref(shipping_method || shippingMethods.value[0]); // todo check index error

function onSubmit() {
  onSaved(selected.value);
  dialogStore.close();
}
</script>
  
  <style>
</style>