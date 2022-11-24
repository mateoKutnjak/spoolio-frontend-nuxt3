<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label
          tabindex="0"
          class="btn btn-ghost lg:hidden"
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
              <a class="justify-between">
                {{ item.name }}
              </a>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost normal-case text-xl">Spoolio</a>
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

        <button
          class="btn btn-ghost"
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
            class="btn btn-ghost bg-transparent hover:bg-transparent"
          >
            <div class="avatar">
              <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://placeimg.com/192/192/people" />
              </div>
            </div>
          </label>
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <div>
              <li>
                <a>
                  <Icon
                    name="material-symbols:person-outline"
                    size="20"
                    aria-hidden="true"
                  />
                  Profile
                </a>
              </li>
              <li>
                <a @click="logout">
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
            <div class="btn btn-ghost">
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
  { name: "Home", to: "/" },
  { name: "Blogs", to: "/blogs" },
  { name: "Print", to: "/job-order" },
  { name: "Shop", to: "/store" },
  { name: "About", to: "/about" },
];

function logout() {
  authStore.logout();
}

function toggleDrawer() {
  drawerStore.toggle();
}
</script>

<style>
.router-link-exact-active {
  color: white;
  background-color: gainsboro;
  border-radius: 5rem;
}
</style>