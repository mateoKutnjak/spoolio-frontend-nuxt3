<template>
  <div class="">
    <Menu
      as="div"
      class="z-20 relative inline-block text-left"
    >
      <MenuButton>
        <div class="btn btn-ghost ">{{ $t('services') }}</div>
      </MenuButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="px-2 py-2">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="localePath(`${item.to}`)"
            >

              <MenuItem as="div">
              <div class="btn btn-ghost btn-block justify-start !font-medium rounded-md">
                {{$t(item.name)}}
              </div>
              </MenuItem>
            </NuxtLink>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
      
    <script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const { navigation } = defineProps(["navigation"]);
</script>