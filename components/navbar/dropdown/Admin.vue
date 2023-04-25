<template>
  <div class="z-20">
    <Menu
      as="div"
      class="relative inline-block text-left"
    >
      <MenuButton class="btn btn-ghost btn-square avatar">
        <div
          class="w-8 rounded-full "
          :key="user?.id"
        >
          <Icon
            class="text-stone-700 mt-1"
            name="lucide:shield"
            size="27"
            aria-hidden="true"
          />
        </div>
      </MenuButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">

          <div class="px-2 py-2">
            <MenuItem
              as="div"
              @click="navigateTo('/admin/print-jobs')"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 font-normal">
              <Icon
                name="lucide:boxes"
                size="20"
                aria-hidden="true"
              />Print Jobs
            </div>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import { storeToRefs } from "pinia";

import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";

const authStore = useAuthStore();
const dialogStore = useDialogStore();

const { user } = storeToRefs(authStore);

function logout() {
  authStore.logout();
  navigateTo("/blogs");
}
</script>

<style>
</style>