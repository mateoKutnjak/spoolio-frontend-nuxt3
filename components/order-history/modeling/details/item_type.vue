<template>
  <div class="flex gap-3 items-center">
    <div class="text-stone-600 text-sm">{{ capitalizeOnlyFirstLetter($t('item_type')) }}: </div>
    <div class="btn btn-sm btn-success rounded-full text-white gap-1 no-animation">
      <Icon
        name="ph:check"
        size="16"
      /> {{ item_type.name }}
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { IModelingOrderItemType } from "~~/constants/data";

const { item_type } = defineProps<{
  item_type: IModelingOrderItemType;
}>();
</script>
  
  <style>
</style>