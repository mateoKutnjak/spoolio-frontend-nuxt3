<template>
  <div class="navbar bg-base-100/70 shadow relative">
    <div class="navbar-start">
      <NavbarDropdownNavigation
        class="lg:hidden"
        :navigation="navigation"
      />
      <NuxtLink
        class="btn btn-ghost"
        :to="localePath('/')"
      >
        <nuxt-img
          width="112px"
          src="/img/ur3d-primary.svg"
          alt="logo"
        />
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex gap-1">
      <NuxtLink :to="localePath('/blogs')">
        <button class="btn btn-ghost ">{{$t('projects')}}</button>
      </NuxtLink>
      <NavbarDropdownServices :navigation="servicesNavigation" />
      <NuxtLink :to="localePath('/store')">
        <button class="btn btn-ghost">{{$t('store')}}</button>
      </NuxtLink>
      <NuxtLink :to="localePath('/about')">
        <button class="btn btn-ghost ">{{$t('about')}}</button>
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
              class="indicator-item indicator-middle badge badge-primary text-white text-xs"
            >{{cartStore.getCartTotalQuantity}}</span>

            <Icon
              class="text-stone-700"
              name="ph:shopping-cart-duotone"
              size="30"
              aria-hidden="true"
            />
          </div>
        </button>
        <NavbarDropdownAdmin v-if="authStore.user?.is_staff || false" />
        <NavbarDropdownProfile />
      </div>
    </div>
  </div>
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

let currentLocale = locale.value;
let currentLanguage;

switch (currentLocale) {
  case Language.croatian.localeName:
    currentLanguage = Language.croatian;
    break;
  case Language.english.localeName:
    currentLanguage = Language.english;
    break;
  default:
    currentLanguage = Language.croatian;
    break;
}

globalsStore.setLanguage(currentLanguage);

const languageCheckbox = ref(
  currentLanguage.localeName !== Language.croatian.localeName
);

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