<template>
  <div class="relative">
    <Menu
      as="div"
      class="inline-block text-left"
    >
      <div>
        <MenuButton class="btn btn-circle btn-ghost btn-sm">
          <Icon
            :name="menuButtonIcon"
            size="20"
          />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="px-1 py-1">
            <MenuItem>
            <div class="px-2 py-2 text-sm text-gray-500"> {{ capitalizeOnlyFirstLetter($t('change_job_status')) }}</div>
            </MenuItem>
            <div class="divider h-0 m-1"></div>
            <MenuItem
              v-for="choice in choices"
              :key="choice"
              v-slot="{ active }"
            >
            <button
              :class="[
                  active ? 'bg-primary text-white' : 'text-gray-900',
                  choice === preselected ? 'btn-disabled' : '',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              @click="onItemClicked(choice)"
            >
              {{ capitalizeOnlyFirstLetter($t(choice)) }}
            </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const emit = defineEmits(["onItemChosen"]);

const { menuButtonIcon } = defineProps<{
  choices: string[];
  preselected: string;
  menuButtonIcon: string;
}>();

function onItemClicked(item: string) {
  emit("onItemChosen", item);
}
</script>

<style>
</style>