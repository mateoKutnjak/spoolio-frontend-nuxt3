<template>
  <div class="z-10">
    <Menu
      as="div"
      class="relative inline-block text-left"
    >
      <MenuButton class="btn btn-ghost btn-square avatar bg-transparent hover:bg-transparent">
        <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <div v-if="user">
            <nuxt-img src="https://placeimg.com/192/192/people" />
          </div>
          <div v-else>
            <Icon
              name="ph:user-duotone"
              size="30"
              aria-hidden="true"
            />
          </div>
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

          <div
            v-if="!user"
            class="px-2 py-2"
          >
            <MenuItem
              as="div"
              @click="dialogStore.open(LoginForm.__name)"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 font-normal">
              <Icon
                name="material-symbols:person-outline"
                size="20"
                aria-hidden="true"
              />Login
            </div>
            </MenuItem>
            <MenuItem
              as="div"
              @click="dialogStore.open(RegisterForm.__name)"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 font-normal">
              <Icon
                name="material-symbols:logout"
                size="20"
                aria-hidden="true"
              />Sign Up
            </div>
            </MenuItem>
          </div>

          <div
            v-else
            class="px-2 py-2"
          >
            <NuxtLink to="/profile/order-history/">
              <MenuItem as="div">
              <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 font-normal">
                <Icon
                  name="material-symbols:receipt-long"
                  size="20"
                  aria-hidden="true"
                />Order history
              </div>
              </MenuItem>
            </NuxtLink>
            <MenuItem as="div">
            <NuxtLink to="/profile/">

              <MenuItem as="div">
              <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 font-normal">
                <Icon
                  name="material-symbols:person-outline"
                  size="20"
                  aria-hidden="true"
                />Profile
              </div>
              </MenuItem>
            </NuxtLink>
            </MenuItem>
            <MenuItem
              as="div"
              @click="authStore.logout()"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 font-normal">
              <Icon
                name="material-symbols:logout"
                size="20"
                aria-hidden="true"
              />Logout
            </div>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
  
<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

import { storeToRefs } from "pinia";

import { useAuthStore } from "../stores/auth";
import { useDialogStore } from "~~/stores/dialog";

const authStore = useAuthStore();
const dialogStore = useDialogStore();

const { user } = storeToRefs(authStore);

watch(user, (value) => console.log(value));
</script>