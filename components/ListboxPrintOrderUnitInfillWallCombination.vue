<template>
  <div class="border border-gray-700 p-2">

    <div class="mb-2 font-bold">{{ capitalizeOnlyFirstLetter($t('mechanical_properties')) }}</div>

    <div class="max-w-xs">
      <Listbox
        v-model="selectedItem"
        @update:modelValue="value => $emit('on-selected', value)"
      >
        <div class="relative mt-1">
          <ListboxButton
            class="btn btn-sm btn-block"
            :class="useCustomCombination ? 'btn-disabled text-gray-600' : ''"
          >
            <span class="block truncate">{{ selectedItem.name }}</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon name="lucide:chevrons-up-down" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="infillWallCombination in infillWallCombinations"
                :key="infillWallCombination.id"
                :value="infillWallCombination"
                as="template"
              >
                <li :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 px-4',
                  ]">
                  <span :class="[
                      selected ? 'font-medium' : 'font-base',
                      'block truncate',
                    ]">{{ infillWallCombination.name }}</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>

    <div class="flex gap-2 items-center">{{ capitalizeOnlyFirstLetter($t('advanced_settings')) }}
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

    <div class="max-w-xs">
      <Listbox
        v-model="selectedInfill"
        @update:modelValue="value => $emit('on-selected', value)"
      >
        <div class="relative mt-1">
          <ListboxButton
            class="btn btn-sm btn-block"
            :class="useCustomCombination ? '' : 'btn-disabled text-gray-600'"
          >
            <span class="block truncate">{{ selectedInfill.percentage * 100 }}%</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon name="lucide:chevrons-up-down" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="infill in infills"
                :key="infill.id"
                :value="infill"
                as="template"
              >
                <li :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 px-4',
                  ]">
                  <span :class="[
                      selected ? 'font-medium' : 'font-base',
                      'block truncate',
                    ]">{{ infill.percentage * 100 }}%</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>

    <div class="max-w-xs">
      <Listbox
        v-model="selectedWall"
        @update:modelValue="value => $emit('on-selected', value)"
      >
        <div class="relative mt-1">
          <ListboxButton
            class="btn btn-sm btn-block"
            :class="useCustomCombination ? '' : 'btn-disabled text-gray-600'"
          >
            <span class="block truncate">Walls: {{ selectedWall.amount }}</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon name="lucide:chevrons-up-down" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="wall in walls"
                :key="wall.id"
                :value="wall"
                as="template"
              >
                <li :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 px-4',
                  ]">
                  <span :class="[
                      selected ? 'font-medium' : 'font-base',
                      'block truncate',
                    ]">Walls: {{ wall.amount }}</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { usePrintOrderUnitInfillStore } from "~~/stores/print_order_unit_infill";
import { usePrintOrderStore } from "~~/stores/print_order";
import { usePrintOrderUnitInfillWallCombinationStore } from "~~/stores/print_order_unit_infill_wall_combination";
import { usePrintOrderUnitWallStore } from "~~/stores/print_order_unit_wall";

const { fileUrl } = defineProps<{
  fileUrl: string;
}>();

const printOrderUnitInfillStore = usePrintOrderUnitInfillStore();
const printOrderUnitWallStore = usePrintOrderUnitWallStore();
const printOrderUnitInfillWallCombinationStore =
  usePrintOrderUnitInfillWallCombinationStore();
const printOrderStore = usePrintOrderStore();

const { walls } = storeToRefs(printOrderUnitWallStore);
const { infills } = storeToRefs(printOrderUnitInfillStore);
const { infillWallCombinations } = storeToRefs(
  printOrderUnitInfillWallCombinationStore
);
const printOrderUnit = printOrderStore.getUnitByLocalUrl(fileUrl);

if (!printOrderUnit) {
  console.error(`Print order unit is null for fileUrl=${fileUrl}`);
  throw createError(`Print order unit is null for fileUrl=${fileUrl}`);
}

const useCustomCombination = ref(
  printOrderUnit.infill_wall_combination === null
);

const selectedItem = ref(printOrderUnit.infill_wall_combination);
const selectedInfill = ref(
  printOrderUnit.infill_wall_combination
    ? printOrderUnit.infill_wall_combination.infill
    : printOrderUnit.infill
);
const selectedWall = ref(
  printOrderUnit.infill_wall_combination
    ? printOrderUnit.infill_wall_combination.wall
    : printOrderUnit.wall
);

watch(selectedItem, (value) => {
  if (value) {
    selectedInfill.value = value.infill;
    selectedWall.value = value.wall;

    printOrderStore.updateUnit(fileUrl, { infill_wall_combination: value });

    if (!useCustomCombination.value) {
      // * With this check slicer will be called only once for changing two values
      // * which can trigger slicer independently

      printOrderStore.updateUnit(fileUrl, {
        infill: value.infill,
        walls: value.wall,
      });
    }
  }
});

watch(selectedInfill, (value) => {
  if (value) {
    if (useCustomCombination.value) {
      // * Without this check, slicer will be called twice when combinaiton changes
      printOrderStore.updateUnit(fileUrl, { infill: value });
    }
  }
});

watch(selectedWall, (value) => {
  if (value) {
    if (useCustomCombination.value) {
      // * Without this check, slicer will be called twice when combinaiton changes
      printOrderStore.updateUnit(fileUrl, { walls: value });
    }
  }
});
</script>