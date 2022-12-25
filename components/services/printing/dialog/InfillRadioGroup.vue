<template>
  <div class="">
    <div class="">
      <RadioGroup
        v-model="selected"
        @update:modelValue="value => $emit('on-infill-selected', value)"
      >
        <RadioGroupLabel class="text-sm">2. Choose infill percentage</RadioGroupLabel>
        <div class="flex gap-2 space-y-2">
          <RadioGroupOption
            class="w-min"
            as="template"
            v-for="infill in sortedFilamentInfills"
            :key="infill.name"
            :value="infill"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 '
                      : '',
                    checked ? 'bg-gray-300 bg-opacity-75 text-white' : 'bg-white ',
                  ]"
              class="relative flex cursor-pointer rounded-lg px-5 py-3 shadow-md focus:outline-none"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <RadioGroupLabel
                      as="p"
                      class="text-gray-800 font-medium"
                    >
                      {{ infill.percentage * 100 }}%
                    </RadioGroupLabel>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>
    
    <script setup>
import { ref } from "vue";
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from "@headlessui/vue";
import { storeToRefs } from "pinia";
import { useFilamentInfillStore } from "~~/stores/filament_infill";

const filamentInfillStore = useFilamentInfillStore();

const { filamentInfills } = storeToRefs(filamentInfillStore);

var sortedFilamentInfills = computed(() => {
  if (filamentInfills.value) {
    return filamentInfills.value.sort((a, b) => {
      if (a.percentage > b.percentage) return 1;
      else return -1;
    });
  }
  return [];
});

const selected = ref(filamentInfills.value[0]); // todo index error check
</script>