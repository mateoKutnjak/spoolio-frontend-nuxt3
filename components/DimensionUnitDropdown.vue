<template>
  <div class="w-36">
    <Listbox
      v-model="selectedUnit"
      class="z-10"
    >
      <div class="relative mt-1">
        <ListboxButton class="btn btn-ghost relative w-full cursor-default rounded-lg bg-white justify-between pl-5 pr-3 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span class="">{{ selectedUnit }}</span>
          <Icon
            name="lucide:chevrons-up-down"
            size="24"
            class="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="person in dimensionUnits"
              :key="person"
              :value="person"
              as="template"
            >
              <li :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                  ]">
                <span :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate',
                    ]">{{ person }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <Icon
                    name="material-symbols:check"
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { DimensionUnit } from "~~/utils/enums";
import { useGlobalsStore } from "~~/stores/globals";

const globalsStore = useGlobalsStore();

const dimensionUnits: string[] = Object.keys(DimensionUnit).filter((item) => {
  return isNaN(Number(item));
});

const selectedUnit = ref<string>(dimensionUnits[0]);

watch(selectedUnit, (value) => {
  globalsStore.setDimensionUnit(
    DimensionUnit[value as keyof typeof DimensionUnit]
  );
});
</script>