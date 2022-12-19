<template>
  <div
    v-if="selectedInfill"
    class="max-w-xs"
  >
    <Listbox
      v-model="selectedInfill"
      @update:modelValue="value => $emit('on-selected', value)"
    >
      <div class="relative mt-1">
        <ListboxButton class="relative z-0 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span class="block truncate">{{ selectedInfill.name }} ({{selectedInfill.percentage * 100}}%)</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon name="charm:chevrons-up-down" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="infill in filamentInfills"
              :key="infill.name"
              :value="infill"
              as="template"
            >
              <li :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                  ]">
                <span :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate',
                    ]">{{ infill.name }} ({{infill.percentage * 100}}%)</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <Icon name="material-symbols:check" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
  
  <script setup>
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { useFilamentInfillStore } from "~~/stores/filament_infill";
import { storeToRefs } from "pinia";

const { filamentInfillId } = defineProps(["filamentInfillId"]);

const filamentInfillStore = useFilamentInfillStore();

const { filamentInfills } = storeToRefs(filamentInfillStore);

const selectedInfill = ref(
  filamentInfills.value.find((el) => el.id === Number(filamentInfillId))
);
</script>