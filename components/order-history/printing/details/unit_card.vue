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
    <div class="card-body gap-5 justify-between lg:pr-0 pb-5">
      <h2 class="card-title font-medium text-gray-700">{{ urlExtractFilename(unit.file.toString()) }}</h2>
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
          <div
            class="tooltip tooltip-bottom"
            data-tip="Filament material"
          >
            <div class="btn btn-sm btn-ghost bg-stone-200 text-gray-600 rounded-full">
              {{ unit.spool.color.name }}
            </div>
          </div>
          <div
            class="tooltip tooltip-bottom"
            data-tip="Infill percentage"
          >
            <div class="btn btn-sm btn-ghost bg-stone-200 text-gray-600 rounded-full"> {{ unit.infill.percentage * 100 }}%</div>
          </div>
          <div
            class="tooltip tooltip-bottom"
            data-tip="Material color"
          >
            <div class="btn btn-sm btn-ghost bg-stone-200 text-gray-600 rounded-full">{{ unit.spool.material.name }}</div>
          </div>
        </div>
        <a
          class="btn btn-circle btn-ghost text-gray-500"
          :href="extractFilenameFileStringUnion(unit.file)"
        >
          <Icon
            name="mdi:file-download-outline"
            size="25"
          />
        </a>
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