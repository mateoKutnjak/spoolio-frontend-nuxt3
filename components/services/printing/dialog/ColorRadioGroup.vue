<template>
    <div class="">
      <div class="">
        <RadioGroup
          v-model="selected"
          @update:modelValue="value => $emit('on-color-selected', value)"
        >
          <RadioGroupLabel class="text-sm">3. Choose filament color</RadioGroupLabel>
          <div class="flex gap-2 py-2">
            <RadioGroupOption
              class="w-min p-2 rounded-full"
              as="template"
              v-for="color in filamentColors"
              :key="color.name"
              :value="color"
              v-slot="{ checked }"
            >
              <div
                :class="[
                  checked ? 'ring-2 ring-offset-0' : 'bg-white ',
                ]"
                :style="checked ? `--tw-ring-color: ${color.value}` : ''"
                class="relative flex cursor-pointer p-[3px]"
              >
                <div
                  class="btn btn-circle btn-ghost"
                  :style="`background-color: ${color.value}`"
                >
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
  import { useFilamentColorStore } from "~~/stores/filament_color";
  
  const filamentColorStore = useFilamentColorStore();
  
  const { filamentColors } = storeToRefs(filamentColorStore);
  
  const selected = ref(filamentColors[0]); // todo index error check
  </script>