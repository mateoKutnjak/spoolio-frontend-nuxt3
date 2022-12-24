<template>
  <div class="drawer drawer-end">
    <input
      id="my-drawer"
      type="checkbox"
      class="drawer-toggle"
    />
    <div class="drawer-content bg-slate-200">
      <div class="flex flex-col h-screen">
        <Navbar />
        <Toast />
        <div class="flex-1 container mx-auto">
          <Breadcrumbs class="pt-6 pb-4 px-12" />
          <slot />
        </div>
      </div>

    </div>
    <div class="drawer-side">
      <label
        for="my-drawer"
        class="drawer-overlay"
      ></label>
      <Cart />
    </div>

    <GenericDialog
      title="Login"
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
  transition: opacity 0.2s ease-in-out;
}

.page-from-leave-from,
.page-to-enter-to {
  opacity: 1;
}

.page-to-enter-from,
.page-from-leave-to {
  opacity: 0;
}
</style>