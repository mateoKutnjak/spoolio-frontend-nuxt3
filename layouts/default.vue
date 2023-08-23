<template>
  <div>
    <div class="drawer drawer-end">
      <input
        id="my-drawer"
        type="checkbox"
        class="drawer-toggle"
      />
      <div class="drawer-content">
        <div class="flex flex-col h-screen">
          <Navbar ref="navbar" />
          <Toast />
          <div
            class="w-full flex-1 flex flex-col gap-12 font-medium text-xl text-base-content bg-base-100"
          >
            <!-- <Breadcrumbs class="px-12" /> -->
            <slot />
          </div>
          <Footer />
        </div>

      </div>
      <div class="drawer-side overflow-x-hidden">
        <label
          for="my-drawer"
          class="drawer-overlay"
        ></label>
        <!-- <CartDrawerMenu /> -->
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
        class="grow text-primary"
        name="eos-icons:three-dots-loading"
        size="150"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { BACKGROUND_COLOR } from "~~/constants/constants";
import { useDialogStore } from "~~/stores/dialog";
import { useDrawerStore } from "../stores/drawer";
import { useLoadingOverlayStore } from "~~/stores/loading_overlay";
import { useElementSize } from "@vueuse/core";

const dialogStore = useDialogStore();
const drawerStore = useDrawerStore();
const loadingOverlayStore = useLoadingOverlayStore();

const { isDialogOpened, componentName } = storeToRefs(dialogStore);

const navbar = ref(null);
const { height } = useElementSize(navbar);

var drawerInput: HTMLElement | null = null;

const isDrawerOpened = computed(() => {
  return drawerStore.isDrawerOpened;
});

const isLoadingOverlayVisible = computed(() => {
  return loadingOverlayStore.isVisible;
});

function beforeWindowUnload(e: any) {
  console.log(e);

  if (!window.confirm("Do you want to leave? Your orders won't be saved.")) {
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = "";
  }
}

onMounted(() => {
  console.debug("onMounted: adding listeners (beforeunload, )");
  window.addEventListener("beforeunload", beforeWindowUnload);

  drawerInput = document.getElementById("my-drawer");
});

onBeforeUnmount(() => {
  console.debug("onBeforeUnmount: removing listeners (beforeunload, )");
  window.removeEventListener("beforeunload", beforeWindowUnload);
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