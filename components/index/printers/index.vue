<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-12 md:px-0">

    <div class="flex flex-col gap-6 justify-center text-xl">
      <span class="text-5xl font-bold text-stone-600">{{ $t('printers').toUpperCase() }} {{ $t('and').toUpperCase() }} {{ $t('materials').toUpperCase() }}</span>

      <div>
        <div class="space-x-1.5 tracking-wide">
          <span class="text-stone-600">{{ capitalizeOnlyFirstLetter($t('available_printers')) }}:</span>
        </div>
        <ul class="mt-2 list-inside list-disc font-bold">
          <li
            v-for="printerType in data"
            :key="printerType.id"
          >
            <span>{{ printerType.printer_count }} x {{ printerType.name }}</span>
          </li>
        </ul>
      </div>
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
    <carousel
      :items-to-show="2"
      class="sm:block hidden bg-white border border-primary rounded"
    >
      <slide
        v-for="printerType, index in data"
        :key="printerType.id"
        :id="`slide${index}`"
        class="divide-x divide-primary"
      >
        <IndexPrintersPrinterType :printer-type="printerType" />
        <div
          v-if="data && index < data?.length-1"
          class="divider w-0 h-full m-0 divider-primary"
        ></div>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </carousel>
    <div class="sm:hidden flex flex-col bg-white border border-primary rounded">
      <div
        v-for="printerType, index in data"
        :key="printerType.id"
        :id="`slide${index}`"
        class="divide-y divide-primary"
      >
        <IndexPrintersPrinterType :printer-type="printerType" />
        <div
          v-if="data && index < data?.length-1"
          class="divider h-0 w-full m-0 divider-primary"
        ></div>
      </div>
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