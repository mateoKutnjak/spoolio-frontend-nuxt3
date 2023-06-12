<template>
  <div class="drawer drawer-end">
    <input
      id="my-drawer"
      type="checkbox"
      class="drawer-toggle"
    />
    <div
      class="drawer-content"
      :style="`background-color: ${BACKGROUND_COLOR};`"
    >
      <div class="flex flex-col h-screen">
        <Navbar />
        <Toast />
        <div class="w-full flex-1 flex flex-col gap-12">
          <!-- <Breadcrumbs class="px-12" /> -->
          <div class="">
            <slot />
          </div>
        </div>
        <Footer />
      </div>

    </div>
    <div class="drawer-side overflow-x-hidden">
      <label
        for="my-drawer"
        class="drawer-overlay"
      ></label>
      <CartDrawerMenu />
    </div>

    <GenericDialog
      :component-name="componentName"
      :show="isDialogOpened"
      @on-close-clicked="dialogStore.close()"
    >
    </GenericDialog>
  </div>
  <div
    v-if="isLoadingOverlayVisible"
    class="absolute z-50 top-0 bottom-0 right-0 left-0 bg-gray-400/60 flex flex-col justify-center items-center"
  >
    <Icon
      class="grow text-gray-500 text-primary"
      name="eos-icons:three-dots-loading"
      size="150"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { BACKGROUND_COLOR } from "~~/constants/constants";
import { useDialogStore } from "~~/stores/dialog";
import { useDrawerStore } from "../stores/drawer";
import { useLoadingOverlayStore } from "~~/stores/loading_overlay";

const dialogStore = useDialogStore();
const drawerStore = useDrawerStore();
const loadingOverlayStore = useLoadingOverlayStore();

const { isDialogOpened, componentName } = storeToRefs(dialogStore);

var drawerInput: HTMLElement | null = null;

const isDrawerOpened = computed(() => {
  return drawerStore.isDrawerOpened;
});

const isLoadingOverlayVisible = computed(() => {
  return loadingOverlayStore.isVisible;
});

onMounted(() => {
  drawerInput = document.getElementById("my-drawer");
});

watch([isDrawerOpened], (value, oldValue, onInvalidate) => {
  drawerInput?.click();
});
</script>
  
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* This is added because of autofill background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 9999s;
  transition-delay: 9999s;
}

::-webkit-scrollbar {
  display: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield;
}
</style>