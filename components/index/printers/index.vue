<template>
  <div class="xl:text-7xl md:text-6xl font-bold text-base-content pb-10">{{ $t('printers').toUpperCase() }} {{ $t('and').toUpperCase() }} {{ $t('materials').toUpperCase() }}</div>
  <carousel
    :items-to-show="2"
    class="lg:block hidden mb-10 xl:px-16 px-8"
  >
    <slide
      v-for="printerType, index in data"
      :key="printerType.id"
      :id="`slide${index}`"
      class=""
    >
      <IndexPrintersPrinterType :printer-type="printerType" />
    </slide>

    <template #addons>
      <navigation />
    </template>
  </carousel>

  <carousel
    :items-to-show="1"
    class="lg:hidden block mb-10 px-8"
  >
    <slide
      v-for="printerType, index in data"
      :key="printerType.id"
      :id="`slide${index}`"
      class=""
    >
      <IndexPrintersPrinterType :printer-type="printerType" />
    </slide>

    <template #addons>
      <navigation />
    </template>
  </carousel>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-12 md:px-0 mb-32">
    
    <div class="flex flex-col gap-6 justify-center text-xl">
      
      <div class="space-x-1.5 tracking-wide">
        <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('for_every_technology_we_have_list_of')) }}</span>
        <span class="font-bold text-stone-600">{{ $t('supported_materials') }}</span>
        <span class="text-stone-600">{{ $t('and') }}</span>
        <span class="font-bold text-stone-600">{{ $t('maximum_size_limit_of_models') }}.</span>
      </div>
      <div class="space-x-1.5 tracking-wide">
        <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('if_your_item_exceeds_the_size_of_the_printers_workspace_the_item_is_printed_in_several_pieces_that_are_then_glued_together')) }}.</span>
      </div>
    </div>

    <div class="flex flex-col justify-center">
      <NuxtLink
          :to="localePath('/services/modeling')"
          class="btn sm:btn-lg btn-outline xl:!text-2xl sm:!text-xl xl:!h-16 text-primary border-4 border-primary mb-3"
        >
        OGRANIČENJA U DIZAJNU
      </NuxtLink>
      <NuxtLink
        :to="localePath('/services/modeling')"
        class="btn sm:btn-lg btn-outline xl:!text-2xl sm:!text-xl xl:!h-16 text-primary border-4 border-primary"
        >
        LISTA PODRŽANIH MATERIJALA
      </NuxtLink>
    </div>
  </div>
</template>
      
<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import { usePrinterTypeStore } from "~~/stores/printer_type";

const printerTypeStore = usePrinterTypeStore();

const { data, pending, error, refresh } = await useAsyncData(
  "index_printers_and_materials_printer_types",
  () => printerTypeStore.fetch()
);
</script>
      
      <style>
</style>