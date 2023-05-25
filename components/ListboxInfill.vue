<template>
  <div
    v-if="selectedItem"
    class="max-w-xs"
  >
    <Listbox
      v-model="selectedItem"
      @update:modelValue="value => $emit('on-selected', value)"
    >
      <div class="relative mt-1">
        <ListboxButton class="relative z-0 w-48 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span class="block truncate">{{ selectedItem.name }} ({{selectedItem.percentage * 100}}%)</span>
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
              v-for="infill in filamentInfills"
              :key="infill.name"
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
                    ]">{{ infill.name }} ({{infill.percentage * 100}}%)</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
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
import { useFilamentInfillStore } from "~~/stores/filament_infill";
import { usePrintOrderStore } from "~~/stores/print_order";

const { fileUrl } = defineProps<{
  fileUrl: string;
}>();

const filamentInfillStore = useFilamentInfillStore();
const printOrderStore = usePrintOrderStore();

const { filamentInfills } = storeToRefs(filamentInfillStore);
const printOrderUnit = printOrderStore.getUnitByLocalUrl(fileUrl);

if (!printOrderUnit) {
  console.error(`Print order unit is null for fileUrl=${fileUrl}`);
  throw createError(`Print order unit is null for fileUrl=${fileUrl}`);
}

const selectedItem = ref(printOrderUnit.infill);

watch(selectedItem, (value) => {
  if (value) {
    printOrderStore.updateUnit(fileUrl, { infill: value });
  }
});
</script>