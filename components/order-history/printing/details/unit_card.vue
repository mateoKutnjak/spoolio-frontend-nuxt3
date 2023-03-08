<template>
  <div class="card lg:card-side bg-base-100 rounded-sm shadow">
    <div class="relative lg:m-4 lg:w-48 h-48 lg:order-last bg-stone-300 flex justify-center items-center">
      <Icon
        class="text-stone-500"
        name="file-icons:3d-model"
        size="75"
      />
      <div class="absolute bottom-2 right-2 font-bold text-stone-500 text-xl">x{{ unit.quantity }}</div>
    </div>
    <div class="card-body gap-5 justify-between">
      <div class="flex gap-5 justify-between items-start">
        <h2 class="card-title font-medium text-gray-700 break-all max-w-sm">{{ urlExtractFilename(unit.file.toString()) }}</h2>
        <a
          class="link link-info"
          :href="extractUrlFileStringUnion(unit.file)"
        >
          Download
        </a>
      </div>
      <div class="flex flex-col md:flex-row gap-5">

        <OrderHistoryPrintingDetailsDimensionInfo
          :data="vector3Parse(unit.model_dimensions)"
          :predefined-dimension-unit="unit.length_unit"
        />
        <OrderHistoryPrintingDetailsVolumeInfo
          :data="unit.model_volume"
          :predefined-dimension-unit="unit.length_unit"
        />
      </div>
      <div class="card-actions justify-end justify-between items-center">
        <div class="flex gap-2">
          <AttributeItem
            :title="unit.spool.material.name"
            tooltip="Material color"
          />
          <AttributeItem
            :title="unit.spool.color.name"
            tooltip="Filament material"
          />
          <AttributeItem
            :title="`${unit.infill.percentage * 100}%`"
            tooltip="Infill percentage"
          />
        </div>
        <div class="text-xl text-gray-600">{{ unit.estimated_price }} €</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPrintOrderUnit } from "~~/constants/data";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();
</script>

<style>
</style>