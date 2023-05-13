<template>
  <div class="flex justify-center btn-group my-2 shadow-sm">
    <div
      v-for="dimensionUnit in dimensionUnits"
      :key="dimensionUnit"
      class="btn btn-sm"
      :class="dimensionUnit === unit.length_unit ? 'btn-active !text-white' : 'btn-ghost bg-white'"
      @click="selected = dimensionUnit"
    >
      {{ dimensionUnit }}
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { DimensionUnit } from "~~/utils/enums";
import { useGlobalsStore } from "~~/stores/globals";
import { IPrintOrderUnit } from "~~/constants/data";
import { usePrintOrderStore } from "~~/stores/print_order";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const globalsStore = useGlobalsStore();
const printOrderStore = usePrintOrderStore();

const dimensionUnits: string[] = Object.keys(DimensionUnit).filter((item) => {
  return isNaN(Number(item));
});

const selected = ref<string>(unit.length_unit);

watch(selected, (value) => {
  printOrderStore.updateUnit(unit.localUrl, { length_unit: value });
});
</script>