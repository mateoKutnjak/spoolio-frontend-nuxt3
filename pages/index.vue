<template>
  <div class="container mx-auto">
    <client-only class="flex-1">
      <PreviewIndex
        class="w-92 h-[55vh] p-0"
        :backgroundColor="globalsStore.getBackgroundColor"
        stlFileUrl="/3d/complete.stl"
      />
    </client-only>

  </div>
</template>

<script lang="ts" setup>
import { useGlobalsStore } from "~~/stores/globals";

const globalsStore = useGlobalsStore();
</script>

<style>
</style>