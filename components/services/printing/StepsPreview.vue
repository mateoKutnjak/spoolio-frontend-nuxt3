<template>
  <div class="md:px-0 px-12 flex gap-5 items-center">
    <div class="flex items-">
      <div
        class="text-primary font-bold mr-2"
        :class="stepActive === 0 ? 'btn btn-circle btn-sm btn-primary text-white' : ''"
      >#1</div>
      <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('import_3d_models')) }}</span>
    </div>
    <Icon
      class="text-primary"
      size="22"
      name="ph:arrow-right-bold"
    />
    <div class="flex">
      <div
        class="text-primary font-bold mr-2"
        :class="stepActive === 1 ? 'btn btn-circle btn-sm btn-primary text-white' : ''"
      >#2</div>
      <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('delivery_and_payment')) }}</span>
    </div>
    <Icon
      class="text-primary"
      size="22"
      name="ph:arrow-right-bold"
    />
    <div class="flex">
      <div
        class="text-primary font-bold mr-2"
        :class="stepActive === 2 ? 'btn btn-circle btn-sm btn-primary text-white' : ''"
      >#3</div>
      <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('finish_order')) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { stepActive } = defineProps<{
  stepActive: number;
}>();
</script>

<style>
</style>