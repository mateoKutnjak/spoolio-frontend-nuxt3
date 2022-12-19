<template>
  <div v-if="selectedColor">
    <Listbox
      v-model="selectedColor"
      @update:modelValue="value => $emit('on-color-selected', value)"
      horizontal
    >
      <div class="relative">
        <ListboxButton class="p-0 m-0">
          <div
            class="btn btn-xs btn-circle btn-ghost"
            :style="`background-color: ${selectedColor.value}`"
          ></div>
          <!-- <span class="block truncate">{{ selectedColor.name }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          </span> -->
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions class="absolute mt-1 right-0 z-40 flex flex-row bg-gray-50 rounded-lg shadow-md">
            <ListboxOption
              class="mb-0 pb-0"
              v-slot="{ active, selected }"
              v-for="color in colors"
              :key="color.id"
              :value="color"
              as="div"
            >
              <li
                class="p-3 pb-1"
                :class="[
                  active ? 'bg-gray-200 rounded-lg' : '',
                ]"
              >
                <div
                  class="btn btn-xs btn-circle btn-ghost"
                  :class="selected ? `bg-green-200` : ``"
                  :style="`background-color: ${color.value}`"
                ></div>
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
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const { colors } = defineProps(["colors"]);

const selectedColor = ref();

onMounted(() => {
  selectedColor.value = colors[0]; // todo check index error
});
</script>