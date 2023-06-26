<template>
  <div class="flex gap-3 items-center">
    <div class="text-stone-600 text-sm">{{ capitalizeOnlyFirstLetter($t('item_attributes')) }}: </div>
    <div class="flex gap-2">
      <div
        v-for="item_attribute in item_attributes"
        :key="item_attribute.id"
        class="btn btn-sm btn-success rounded-full text-white gap-1 no-animation"
      >
        <Icon
          name="ph:check"
          size="16"
        /> {{ item_attribute.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IModelingOrderItemAttribute } from "~~/constants/data";

const { item_attributes } = defineProps<{
  item_attributes: IModelingOrderItemAttribute[];
}>();
</script>

<style>
</style>