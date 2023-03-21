<template>
  <div class="drawer drawer-end">
    <input
      id="my-drawer"
      type="checkbox"
      class="drawer-toggle"
    />
    <div
      class="drawer-content"
      style="background-color: #ECECEC"
    >
      <div>
        <Navbar />
        <Toast />
        <div class="container mx-auto">
          <Breadcrumbs class="p-12 pb-0" />
          <slot />
        </div>
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
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useDialogStore } from "~~/stores/dialog";
import { useDrawerStore } from "../stores/drawer";

const dialogStore = useDialogStore();
const drawerStore = useDrawerStore();

const { isDialogOpened, componentName } = storeToRefs(dialogStore);

var drawerInput: HTMLElement | null = null;

const isDrawerOpened = computed(() => {
  return drawerStore.isDrawerOpened;
});

onMounted(() => {
  drawerInput = document.getElementById("my-drawer");
});

watch([isDrawerOpened], (value, oldValue, onInvalidate) => {
  drawerInput?.click();
});
</script>
  
<style>
.page-to-enter-active,
.page-from-leave-active {
  position: fixed;
  transition: opacity 0.3s ease-in-out;
}

.page-from-leave-from,
.page-to-enter-to {
  opacity: 1;
}

.page-to-enter-from,
.page-from-leave-to {
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