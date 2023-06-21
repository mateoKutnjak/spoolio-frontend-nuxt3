<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="infillWallCombinations && infillWallCombinations.length > 0"
      class="flex flex-col"
    >
      <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('mechanical_profile')) }}</div>
      <Dropdown
        :items="infillWallCombinations"
        :preselected-item="unit.infill_wall_combination"
        :extract-name="(el: IPrintOrderUnitInfillWallCombination) => `${$t(el.name).toUpperCase()} - ${$t('infill').toUpperCase()}: ${el.infill.percentage * 100}%, ${$t('outer_layers').toUpperCase()}: ${el.wall.amount}`"
        :disabled="useCustomCombination"
        background-color="bg-stone-200"
        size="md"
        @on-item-clicked="el => selectedInfillWallCombination = el"
      />
    </div>

    <div class="flex gap-1 items-center text-stone-600 text-sm">{{ capitalizeOnlyFirstLetter($t('advanced_settings')) }}
      <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate">
        <input
          type="checkbox"
          v-model="useCustomCombination"
        />
        <Icon
          name="lucide:square"
          class="swap-off text-gray-500"
          size="20"
        />
        <Icon
          name="lucide:check-square"
          class="swap-on text-gray-500"
          size="20"
        />
      </label>
    </div>

    <div class="grid md:grid-cols-3 grid-cols-1 gap-4">
      <div
        v-if="infills && infills.length > 0"
        class="flex flex-col"
      >
        <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('infill')) }}</div>
        <Dropdown
          :key="unit.infill.id"
          :items="infills"
          :preselected-item="unit.infill"
          :extract-name="(el: IPrintOrderUnitInfill) => `${el.percentage * 100}%`"
          background-color="bg-stone-200"
          size="md"
          :disabled="!useCustomCombination"
          @on-item-clicked="infill => selectedInfill = infill"
        />
      </div>
      <div
        v-if="walls && walls.length > 0"
        class="flex flex-col"
      >
        <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('outer_layers')) }}</div>
        <Dropdown
          :key="unit.wall.id"
          :items="walls"
          :preselected-item="unit.wall"
          :extract-name="(el: IPrintOrderUnitWall) => `${el.amount}`"
          background-color="bg-stone-200"
          size="md"
          :disabled="!useCustomCombination"
          @on-item-clicked="wall => selectedWall = wall"
        />
      </div>
      <div
        v-if="wallThicknesses && wallThicknesses.length > 0"
        class="flex flex-col"
      >
        <div class="text-stone-400 text-sm">{{ capitalizeOnlyFirstLetter($t('layer_height')) }}</div>
        <Dropdown
          :items="wallThicknesses"
          :preselected-item="unit.wall_thickness"
          :extract-name="(el: IPrintOrderUnitWallThickness) => `${el.thickness}mm`"
          background-color="bg-stone-200"
          size="md"
          :disabled="!useCustomCombination"
          @on-item-clicked="wallThickness => selectedWallThickness = wallThickness"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePrintOrderUnitInfillStore } from "~~/stores/print_order_unit_infill";
import { usePrintOrderStore } from "~~/stores/print_order";
import { usePrintOrderUnitInfillWallCombinationStore } from "~~/stores/print_order_unit_infill_wall_combination";
import { usePrintOrderUnitWallStore } from "~~/stores/print_order_unit_wall";
import {
  IPrintOrderUnit,
  IPrintOrderUnitInfill,
  IPrintOrderUnitInfillWallCombination,
  IPrintOrderUnitWall,
  IPrintOrderUnitWallThickness,
} from "~~/constants/data";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const printOrderUnitInfillStore = usePrintOrderUnitInfillStore();
const printOrderUnitWallStore = usePrintOrderUnitWallStore();
const printOrderUnitInfillWallCombinationStore =
  usePrintOrderUnitInfillWallCombinationStore();
const printOrderStore = usePrintOrderStore();

const walls = computed(() => printOrderUnitWallStore.getWalls);
const wallThicknesses = computed(
  () => printOrderUnitWallStore.getWallThicknesses
);
const infills = computed(() => printOrderUnitInfillStore.getInfills);
const infillWallCombinations = computed(
  () => printOrderUnitInfillWallCombinationStore.getAll
);

const useCustomCombination = ref(unit.infill_wall_combination === null);

const selectedInfillWallCombination = ref(unit.infill_wall_combination);
const selectedInfill = ref(
  unit.infill_wall_combination
    ? unit.infill_wall_combination.infill
    : unit.infill
);
const selectedWall = ref(
  unit.infill_wall_combination ? unit.infill_wall_combination.wall : unit.wall
);
const selectedWallThickness = ref(unit.wall_thickness);

watch(selectedInfillWallCombination, (value) => {
  if (value) {
    selectedInfill.value = value.infill;
    selectedWall.value = value.wall;

    printOrderStore.updateUnit(unit.localUrl, {
      infill_wall_combination: value,
    });

    if (!useCustomCombination.value) {
      // * With this check slicer will be called only once for changing two values
      // * which can trigger slicer independently

      printOrderStore.updateUnit(unit.localUrl, {
        infill: value.infill,
        wall: value.wall,
      });
    }
  }
});

watch(selectedInfill, (value) => {
  if (value) {
    if (useCustomCombination.value) {
      // * Without this check, slicer will be called twice when combinaiton changes
      printOrderStore.updateUnit(unit.localUrl, { infill: value });
    }
  }
});

watch(selectedWall, (value) => {
  if (value) {
    if (useCustomCombination.value) {
      // * Without this check, slicer will be called twice when combinaiton changes
      printOrderStore.updateUnit(unit.localUrl, { wall: value });
    }
  }
});

watch(selectedWallThickness, (value) => {
  if (value) {
    if (useCustomCombination.value) {
      // * Without this check, slicer will be called twice when combinaiton changes
      printOrderStore.updateUnit(unit.localUrl, { wall_thickness: value });
    }
  }
});
</script>

<style>
</style>