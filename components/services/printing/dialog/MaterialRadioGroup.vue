<template>
    <div class="w-full">
      <div class="mx-auto w-full max-w-md">
        <RadioGroup v-model="selected" @update:modelValue="value => $emit('on-material-selected', value)">
          <RadioGroupLabel class="text-sm">1. Choose material</RadioGroupLabel>
          <div class="space-y-2">
            <RadioGroupOption
              as="template"
              v-for="material in filamentMaterials"
              :key="material.name"
              :value="material"
              v-slot="{ active, checked }"
            >
              <div
                :class="[
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 '
                      : '',
                    checked ? 'bg-gray-300 bg-opacity-75 text-white' : 'bg-white ',
                  ]"
                class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <div class="text-sm">
                      <RadioGroupLabel
                        as="p"
                        class="text-gray-800 font-medium"
                      >
                        {{ material.name }}
                      </RadioGroupLabel>
                      <RadioGroupDescription
                        as="span"
                        class="text-gray-500 inline"
                      >
                        <span> {{ material.description }}</span>
                        <!-- <span aria-hidden="true"> &middot; </span>
                        <span>{{ material.price }}</span> -->
                      </RadioGroupDescription>
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
  import { useFilamentMaterialStore } from "~~/stores/filament_material";
  
  const filamentMaterialStore = useFilamentMaterialStore();
  
  const { filamentMaterials } = storeToRefs(filamentMaterialStore);
  
  const selected = ref(filamentMaterials[0]); // todo index error check
  </script>