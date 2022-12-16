<template>
  <div class="drawer drawer-end">
    <input
      id="my-drawer"
      type="checkbox"
      class="drawer-toggle"
    />
    <div class="drawer-content bg-slate-50">
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

  </div>
</template>

<script lang="ts" setup>
import { useDrawerStore } from "../stores/drawer";

const drawerStore = useDrawerStore();

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