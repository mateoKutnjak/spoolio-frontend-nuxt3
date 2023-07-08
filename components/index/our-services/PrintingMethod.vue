<template>
  <div class="flex flex-col gap-2">
    <div>
      <div class="text-4xl font-bold text-stone-600">{{ printingMethod.name }}</div>
      <div class="font-medium text-stone-600">({{printingMethod.full_name}})</div>
    </div>
    <div class="mt-4 grid grid-cols-1 text-stone-600 font-bold text-lg sm:gap-1 gap-3">
      <div class="w-full flex sm:flex-row flex-col justify-between">
        <div>{{ capitalizeOnlyFirstLetter($t('resolution')) }}</div>
        <RatingPreview :rating-value="printingMethod.resolution" />
      </div>
      <div class="w-full flex sm:flex-row flex-col justify-between">
        <div>{{ capitalizeOnlyFirstLetter($t('precision')) }}</div>
        <RatingPreview :rating-value="printingMethod.precision" />
      </div>
      <div class="w-full flex sm:flex-row flex-col justify-between">
        <div>{{ capitalizeOnlyFirstLetter($t('smoothness')) }}</div>
        <RatingPreview :rating-value="printingMethod.resolution" />
      </div>
    </div>
    <div class="mt-4 self-end text-lg font-black text-primary">
      <span>{{ $t('price').toUpperCase() }}: {{ '€'.repeat(printingMethod.pricing) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPrintingMethod } from "~~/constants/data";

const { printingMethod } = defineProps<{
  printingMethod: IPrintingMethod;
}>();
</script>

<style>
</style>