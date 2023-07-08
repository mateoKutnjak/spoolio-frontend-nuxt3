<template>
  <div class="flex flex-col gap-10 px-12 md:px-0">
    <div class="text-5xl font-bold text-stone-600">{{ $t('our_services').toUpperCase() }}</div>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1 flex flex-col rounded border border-primary items-center bg-white">
        <div class="py-4 text-4xl font-bold text-stone-600">{{ capitalizeFirstLetter($t('_3d_printing')) }}</div>
        <div class="w-full grid sm:grid-cols-2 grid-cols-1 sm:border-t sm:border-b sm:border-l-0 sm:border-r-0 border-t border-b border-primary sm:divide-x divide-x-0 sm:divide-y-0 divide-y divide-primary">
          <div
            v-for="printing_method in data"
            :key="printing_method.id"
            class="p-8"
          >
            <IndexOurServicesPrintingMethod :printing-method="printing_method"></IndexOurServicesPrintingMethod>
          </div>
        </div>
        <div class="pb-6 pt-4 px-6 w-full grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 items-end">
          <div class="w-full">
            <div class="flex gap-2">
              <div class="text-sm font-medium text-stone-600">
                {{ capitalizeOnlyFirstLetter($t('supported_formats')) }}: STL
              </div>
            </div>
            <NuxtLink
              :to="localePath('/services/printing')"
              class="btn btn-lg btn-block btn-primary text-base-100 shadow-md"
            >{{ $t('i_have_a_model').toUpperCase() }}</NuxtLink>
          </div>
          <NuxtLink
            :to="localePath('/services/modeling')"
            class="btn btn-lg btn-outline btn-block text-stone-600 border-stone-300 shadow"
          >{{ $t('i_dont_have_a_model').toUpperCase() }}</NuxtLink>
        </div>
      </div>
      <div class="flex flex-col rounded border border-primary items-center bg-white">
        <div class="py-4 text-4xl font-bold text-stone-600">{{ capitalizeFirstLetter($t('_3d_modeling')) }}</div>
        <div class="px-12 pt-6 w-full flex-1 flex flex-col gap-4 justify-center border-t border-b border-primary divide-primary">
          <ul class="text-primary text-lg font-semibold list-inside list-disc space-y-1">
            <li>
              <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('product_development')) }}</span>
            </li>
            <li>
              <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('designing_new_model')) }}</span>
            </li>
            <li>
              <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('object_reconstruction')) }}</span>
            </li>
            <li>
              <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('model_adjustment')) }}</span>
            </li>
          </ul>
          <div class="mt-4 self-end text-lg font-black text-primary">
            <span>{{ $t('price').toUpperCase() }}: 30€/h</span>
          </div>
        </div>
        <div class="pb-6 pt-4 flex flex-col gap-4 items-end">
          <div>
            <div class="flex gap-2 opacity-0">
              <div class="text-sm font-medium text-stone-600">
                {{ capitalizeOnlyFirstLetter($t('supported_formats')) }}: STL
              </div>
            </div>
            <NuxtLink
              :to="localePath('/services/modeling')"
              class="btn btn-lg btn-outline text-stone-600 border-stone-300 shadow"
            >{{ $t('_3d_modeling').toUpperCase() }}</NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { usePrintingMethodStore } from "~~/stores/printing_method";

const printingMethodStore = usePrintingMethodStore();

const { data, pending, error, refresh } = await useAsyncData(
  "index_our_services_printing_methods",
  () => printingMethodStore.fetch()
);
</script>
  
  <style>
</style>