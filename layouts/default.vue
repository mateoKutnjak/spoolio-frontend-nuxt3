<template>
  <div class="drawer drawer-end">
    <input
      id="my-drawer"
      type="checkbox"
      class="drawer-toggle"
    />
    <div class="drawer-content">
      <div class="flex flex-col h-screen">
        <Navbar />
        <div class="flex-1 container mx-auto p-4">
          <slot />
        </div>
        <Footer />
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
  
<style scoped>
</style>