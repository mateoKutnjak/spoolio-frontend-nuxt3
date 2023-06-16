<template>
  <div class="navbar bg-base-100/70 shadow">
    <div class="navbar-start">
      <NavbarDropdownNavigation
        class="lg:hidden"
        :navigation="navigation"
      />
      <NuxtLink class="btn btn-ghost">
        <nuxt-img
          width="112px"
          src="/img/ur3d-primary.svg"
          alt="logo"
        />
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <NuxtLink to="/blogs">
        <button class="btn btn-ghost text-gray-700">{{$t('projects')}}</button>
      </NuxtLink>
      <NavbarDropdownServices :navigation="servicesNavigation" />
      <NuxtLink to="/store">
        <button class="btn btn-ghost text-gray-700">{{$t('store')}}</button>
      </NuxtLink>
      <NuxtLink to="/about">
        <button class="btn btn-ghost text-gray-700">{{$t('about')}}</button>
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <div class="flex items-center">

        <div>
          <label
            class="btn btn-square btn-ghost swap swap-rotate"
            :class="getCartItems.size > 0 ? '' : 'btn-square'"
          >

            <!-- this hidden checkbox controls the state -->
            <input
              type="checkbox"
              v-model="languageCheckbox"
            />

            <Icon
              :class="'swap-on'"
              name="emojione:flag-for-united-states"
              size="27"
              aria-hidden="true"
            />
            <Icon
              :class="'swap-off'"
              name="emojione:flag-for-croatia"
              size="27"
              aria-hidden="true"
            />

          </label>
        </div>
        <button
          class="btn btn-ghost"
          :class="getCartItems.size > 0 ? '' : 'btn-square'"
          @click="toggleDrawer"
        >
          <div class="flex items-center gap-1 ">
            <span
              v-show="getCartItems.size > 0"
              class="indicator-item indicator-middle badge badge-primary"
            >{{cartStore.getCartTotalQuantity}}</span>

            <Icon
              class="text-stone-700"
              name="lucide:shopping-cart"
              size="27"
              aria-hidden="true"
            />
          </div>
        </button>
        <NavbarDropdownAdmin v-if="authStore.user?.is_staff || false" />
        <NavbarDropdownProfile />
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
import { Language } from "~~/constants/constants";
import { useAuthStore } from "~~/stores/auth";
import { useCartStore } from "~~/stores/cart";
import { useDrawerStore } from "~~/stores/drawer";
import { useGlobalsStore } from "~~/stores/globals";

const { locale } = useI18n();

const authStore = useAuthStore();
const cartStore = useCartStore();
const drawerStore = useDrawerStore();
const globalsStore = useGlobalsStore();

const isLoginDialogShown = ref(false);
const isRegisterDialogShown = ref(false);

const initialLanguage = globalsStore.getLanguage;

// TODO this wont support more than two languages
const languageCheckbox = ref(initialLanguage === Language.croatian);

const getUser = computed(() => {
  return authStore.getUser;
});

const getCartItems = computed(() => {
  return cartStore.getCartItems;
});

const navigation = [
  { name: "projects", to: "/blogs" },
  { name: "_3d_printing", to: "/services/printing" },
  { name: "modeling", to: "/services/modeling" },
  { name: "store", to: "/store" },
  { name: "about", to: "/about" },
];

const servicesNavigation = [
  { name: "_3d_printing", to: "/services/printing" },
  { name: "modeling", to: "/services/modeling" },
];

function toggleDrawer() {
  drawerStore.toggle();
}

function closeDropdown(e: any) {
  e.target?.blur();
}

watch(languageCheckbox, (value) => {
  console.log(value);
  if (value) {
    globalsStore.setLanguage(Language.english);
    locale.value = Language.english.localeName;
  } else {
    globalsStore.setLanguage(Language.croatian);
    locale.value = Language.croatian.localeName;
  }
});
</script>
  
  <style>
</style>