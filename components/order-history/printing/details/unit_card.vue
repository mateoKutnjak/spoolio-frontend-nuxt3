<template>
  <div class="card bg-base-100 rounded-none sm:rounded-lg shadow">
    <div class="card-body">
      <div class="flex justify-between">
        <div class="flex flex-col gap-3">
          <div class="flex gap-3 items-center">

            <a
              class="link link-info"
              :href="extractFilenameFileStringUnion(unit.file)"
            >{{ urlExtractFilename(unit.file.toString()) }}</a>
            <div class="btn btn-xs btn-primary">x{{ unit.quantity }}</div>
          </div>
          <div class="flex flex-col gap-4 justify-center">
            <div class="flex items-start justify-start">
              <div
                class="tooltip tooltip-bottom"
                data-tip="Filament material"
              >{{ unit.spool.color.name }}</div>
              <Icon
                name="bi:dot"
                size="20"
              />
              <div
                class="tooltip tooltip-bottom"
                data-tip="Infill percentage"
              >{{ unit.infill.percentage * 100 }}%</div>
              <Icon
                name="bi:dot"
                size="20"
              />
              <div
                class="tooltip tooltip-bottom"
                data-tip="Material color"
              >{{ unit.spool.material.name }}</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center">
          <div class="text-xl font-light">{{ unit.estimated_price }} €</div>
        </div>
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