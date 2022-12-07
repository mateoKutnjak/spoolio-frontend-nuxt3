<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">

        <label
          tabindex="0"
          class="btn btn-ghost btn-square lg:hidden"
        >
          <Icon
            name="material-symbols:menu"
            class="block h-6 w-6"
            aria-hidden="true"
          />
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li tabindex="0">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="`${item.to}`"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
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
              name="material-symbols:shopping-cart-outline-rounded"
              size="27"
              aria-hidden="true"
            />
          </div>
        </button>

        <div
          v-if="getUser"
          class="dropdown dropdown-end"
        >

          <label
            tabindex="0"
            class="btn btn-ghost btn-square bg-transparent hover:bg-transparent"
          >
            <div class="avatar">
              <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <nuxt-img src="https://placeimg.com/192/192/people" />
              </div>
            </div>
          </label>
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <div>
              <li class="">
                <a class="flex gap-3">
                  <Icon
                    name="material-symbols:mail"
                    size="20"
                    aria-hidden="true"
                  /> {{getUser.email}}
                </a>
              </li>
            </div>
            <div class="divider h-0 pl-4 pr-4"></div>
            <div>
              <li>
                <NuxtLink to="/profile/">
                  <a class="flex gap-3">
                    <Icon
                      name="material-symbols:person"
                      size="20"
                      aria-hidden="true"
                    />
                    Profile
                  </a>
                </NuxtLink>
              </li>
              <li>
                <a
                  class="flex gap-3"
                  @click="logout"
                >
                  <Icon
                    name="material-symbols:logout"
                    size="20"
                    aria-hidden="true"
                  />
                  Logout
                </a>
              </li>
            </div>
          </ul>

        </div>
        <div
          v-else
          class="dropdown dropdown-end"
        >
          <label tabindex="
          0">
            <div class="btn btn-ghost btn-square">
              <Icon
                name="material-symbols:person-outline"
                size="30"
                aria-hidden="true"
              />
            </div>
          </label>
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <div>
              <li>
                <a @click="isLoginDialogShown=true">
                  <Icon
                    name="material-symbols:person-outline"
                    size="20"
                    aria-hidden="true"
                  />
                  Login
                </a>
              </li>
              <li>
                <a @click="isRegisterDialogShown=true">
                  <Icon
                    name="material-symbols:logout"
                    size="20"
                    aria-hidden="true"
                  />
                  Sign Up
                </a>
              </li>
            </div>
          </ul>
        </div>
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