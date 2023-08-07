<template>
  <div>
    <Menu
      as="div"
      class="relative inline-block text-left"
    >


      <MenuButton
        class="btn btn-ghost btn-square avatar"
        :class="isLoggedIn ? 'hover:bg-transparent' : ''"
      >
        <div
          class="w-10 rounded-full "
          :key="user?.id"
        >
          <!-- * ClientOnly tag added to remove Hydration node musmatch warning -->
          <ClientOnly>
            <div v-if="isLoggedIn">
              <div class="avatar placeholder">
                <div class=" bg-primary text-neutral-content rounded-full w-10 bg-gradient-to-r from-secondary to-primary">
                  <span class="text-md text-white">{{ userProfileInitials(authStore.getUser?.profile) }}</span>
                </div>
              </div>

            </div>
            <div v-else>
              <Icon
                class="text-stone-700 mt-1"
                name="ph:user-circle-duotone"
                size="32"
                aria-hidden="true"
              />
            </div>
          </ClientOnly>
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
        <MenuItems class="z-20 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">

          <div
            v-if="!authStore.loggedIn"
            class="px-2 py-2"
          >
            <MenuItem
              as="div"
              @click="dialogStore.open('LoginForm', {}, $t('sign_in').toUpperCase())"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 !font-medium text-lg rounded-md shadow-none">
              <Icon
                class="mb-[2px]"
                name="ph:sign-in"
                size="22"
                aria-hidden="true"
              />{{ capitalizeOnlyFirstLetter($t('sign_in')) }}
            </div>
            </MenuItem>
            <MenuItem
              as="div"
              @click="dialogStore.open('RegisterForm', {}, $t('sign_up').toUpperCase())"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 !font-medium text-lg rounded-md shadow-none">
              <Icon
                class="mb-[2px]"
                name="ph:user-plus-duotone"
                size="22"
                aria-hidden="true"
              />{{ capitalizeOnlyFirstLetter($t('sign_up')) }}
            </div>
            </MenuItem>

          </div>

          <div
            v-else
            class="px-2 py-2"
          >
            <NuxtLink :to="localePath('/profile/order-history/')">
              <MenuItem as="div">
              <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 !font-medium text-lg rounded-md shadow-none">
                <Icon
                  class="mb-[2px]"
                  name="ph:clipboard-text-duotone"
                  size="20"
                  aria-hidden="true"
                />{{ capitalizeOnlyFirstLetter($t('order_history')) }}
              </div>
              </MenuItem>
            </NuxtLink>
            <MenuItem as="div">
            <NuxtLink :to="localePath('/profile/')">

              <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 !font-medium text-lg rounded-md shadow-none">
                <Icon
                  class="mb-[2px]"
                  name="ph:user"
                  size="20"
                  aria-hidden="true"
                />{{ capitalizeOnlyFirstLetter($t('profile')) }}
              </div>
            </NuxtLink>
            </MenuItem>
            <MenuItem
              as="div"
              @click="logout"
            >
            <div class="btn btn-ghost btn-block justify-start gap-3 text-gray-700 !font-medium text-lg rounded-md shadow-none">
              <Icon
                class="mb-[2px]"
                name="ph:sign-out"
                size="20"
                aria-hidden="true"
              />{{ capitalizeOnlyFirstLetter($t('logout')) }}
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
import { useNotificationStore } from "~~/stores/notification";

const localePath = useLocalePath();

const authStore = useAuthStore();
const dialogStore = useDialogStore();
const notificationStore = useNotificationStore();

const { user } = storeToRefs(authStore);

const isLoggedIn = computed(() => {
  return authStore.accessToken;
});

function logout() {
  authStore.logout();
  notificationStore.show("You are logged out", ToastLevelType.info);
  navigateTo(localePath("/"));
}
</script>