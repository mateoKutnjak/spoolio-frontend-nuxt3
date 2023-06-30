<template>
  <div class="card  lg:card-side bg-base-100 rounded-md border border-stone-400/80">
    <div class="relative lg:m-4 lg:w-40 h-40 lg:order-last  flex justify-center items-center">
      <nuxt-img
        class="h-40"
        v-if="unit.screenshot"
        :src="unit.screenshot"
        style="object-fit: cover;"
      />
      <Icon
        v-else
        class="text-stone-500"
        name="file-icons:3d-model"
        size="75"
      />
      <div class="absolute bottom-2 right-2 font-bold text-stone-500 text-xl">x{{ unit.quantity }}</div>
    </div>
    <div class="card-body px-8 py-6 gap-8 justify-between">

      <div class="flex justify-between">
        <div class="flex flex-col">
          <div class="text-stone-400">
            MODEL {{ index+1 }}/{{ order.unit_count }}
          </div>
          <a
            class="text-info font-bold link link-info"
            :href="extractUrlFileStringUnion(unit.file)"
          >{{ urlExtractFilename(extractUrlFileStringUnion(unit.file)).toUpperCase() }}</a>
          <ServicesPrintingDimensionInfo :unit="unit" />
        </div>
      </div>

      <div class="w-full h-min flex flex-wrap gap-12 text-stone-600">
        <div>
          <div class="text-sm">{{ capitalizeOnlyFirstLetter($t('infill')) }}</div>
          <div class="text-lg font-bold">
            <Icon
              class="mb-1.5 mr-1 text-stone-400"
              name="ph:hash-bold"
              size="20"
            />{{ unit.infill.percentage * 100 }}%
          </div>
        </div>
        <div>
          <div class="text-sm">{{ capitalizeOnlyFirstLetter($t('material')) }}</div>
          <div class="text-lg font-bold">{{ unit.spool.material.name }}</div>
        </div>
        <div>
          <div class="line-clamp-1 text-sm">{{ capitalizeOnlyFirstLetter($t('layer_height')) }}</div>
          <div class="text-lg font-bold">
            <Icon
              class="mb-1.5 mr-1 text-stone-400"
              name="ph:stack-bold"
              size="20"
            />{{ unit.wall_thickness.thickness }}mm
          </div>
        </div>
        <div>
          <div class="text-sm">{{ capitalizeOnlyFirstLetter($t('color')) }}</div>
          <div class="text-lg font-bold">{{ unit.spool.color.name.toUpperCase() }}</div>
        </div>
        <div>
          <div class="text-sm line-clamp-1">{{ capitalizeOnlyFirstLetter($t('outer_layers')) }}</div>
          <div class="text-lg font-bold">
            <Icon
              class="mb-1.5 mr-1 text-stone-400"
              name="ph:list-bold"
              size="20"
            />{{ unit.wall.amount }}
          </div>
        </div>
        <div class="flex-1"></div>
        <div>
          <div class="text-sm">{{ capitalizeOnlyFirstLetter($t('price')) }}</div>
          <div class="text-xl font-bold">€{{ price.toFixed(2) }}</div>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { TAX_FRACTION } from "~~/constants/constants";
import { IPrintOrder, IPrintOrderUnit } from "~~/constants/data";
import { adjustPrice } from "~~/stores/print_order";

const { unit, order, index } = defineProps<{
  unit: IPrintOrderUnit;
  order: IPrintOrder;
  index: number;
}>();

const price = computed(
  () => adjustPrice(unit) * unit.quantity * (TAX_FRACTION + 1)
);
</script>

<style>
</style>