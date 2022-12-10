<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <NavbarNavigationDropdown
        class="lg:hidden"
        :navigation="navigation"
      />
      <NuxtLink
        to="/"
        class="btn btn-ghost"
      >
        <nuxt-img
          width="112px"
          src="/img/logo-primary.svg"
          alt="logo"
        />
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <NuxtLink
        v-for="item in navigation"
        :key="item.name"
        :to="`${item.to}`"
      >
        <button class="btn btn-ghost text-gray-700">{{ item.name }}</button>
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <div class="flex items-center">

        <div>
          <button
            class="btn btn-ghost btn-square hover:bg-transparent"
            :class="getItems.length > 0 ? '' : 'btn-square'"
          >
            <label class="swap swap-rotate">
              <input type="checkbox" />
              <Icon
                class="swap-on"
                name="emojione:flag-for-united-states"
                size="27"
                aria-hidden="true"
              />
              <Icon
                class="swap-off"
                name="emojione:flag-for-croatia"
                size="27"
                aria-hidden="true"
              />

            </label>
          </button>
        </div>

        <button
          class="btn btn-ghost"
          :class="getItems.length > 0 ? '' : 'btn-square'"
          @click="toggleDrawer"
        >
          <div class="flex items-center gap-1 ">
            <span
              v-show="getItems.length > 0"
              class="indicator-item indicator-middle badge badge-primary"
            >{{getItems.length}}</span>

            <Icon
              name="ph:shopping-cart-duotone"
              size="30"
              aria-hidden="true"
            />
          </div>
        </button>
        <NavbarProfileDropdown
          @on-login-pressed="isLoginDialogShown=true"
          @on-sign-up-pressed="isRegisterDialogShown=true"
          @on-logout-pressed="authStore.logout()"
        />
      </div>
    </div>
  </div>

  <GenericDialog
    title="Login"
    :show="isLoginDialogShown"
    @on-close-clicked="isLoginDialogShown=false"
  >
    <LoginForm />
  </GenericDialog>

  <GenericDialog
    title="Sign up"
    :show="isRegisterDialogShown"
    @on-close-clicked="isRegisterDialogShown=false"
  >
    <RegisterForm />
  </GenericDialog>
</template>

<script lang="ts" setup>
import { useAuthStore } from "../stores/auth";
import { useCartStore } from "../stores/cart";
import { useDrawerStore } from "../stores/drawer";

const authStore = useAuthStore();
const cartStore = useCartStore();
const drawerStore = useDrawerStore();

const isLoginDialogShown = ref(false);
const isRegisterDialogShown = ref(false);

const getUser = computed(() => {
  return authStore.getUser;
});

const getItems = computed(() => {
  return cartStore.getItems;
});

const navigation = [
  { name: "projects", to: "/blogs" },
  { name: "order parts", to: "/job-order" },
  { name: "store", to: "/store" },
  { name: "about", to: "/about" },
];

function logout() {
  authStore.logout();
}

function toggleDrawer() {
  drawerStore.toggle();
}

function closeDropdown(e: any) {
  e.target?.blur();
}
</script>

<style>
</style>