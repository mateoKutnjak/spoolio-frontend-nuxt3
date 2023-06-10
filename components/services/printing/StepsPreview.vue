<template>
  <div class="flex gap-5 items-center">
    <div>
      <span
        class="text-primary font-bold mr-2"
        :class="stepActive === 0 ? 'btn btn-circle btn-sm btn-primary text-white' : ''"
      >#1</span>
      <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('import_3d_models')) }}</span>
    </div>
    <Icon
      class="text-primary"
      size="22"
      name="lucide:arrow-right"
    />
    <div>
      <span
        class="text-primary font-bold mr-2"
        :class="stepActive === 1 ? 'btn btn-circle btn-sm btn-primary text-white' : ''"
      >#2</span>
      <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('delivery_and_payment')) }}</span>
    </div>
    <Icon
      class="text-primary"
      size="22"
      name="lucide:arrow-right"
    />
    <div>
      <span
        class="text-primary font-bold mr-2"
        :class="stepActive === 2 ? 'btn btn-circle btn-sm btn-primary text-white' : ''"
      >#3</span>
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