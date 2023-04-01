<template>
  <div class="container mx-auto">
    <client-only class="flex-1">
      <PreviewIndex
        class="w-92 h-[55vh] p-0"
        :backgroundColor="BACKGROUND_COLOR"
        stlFileUrl="/3d/complete.stl"
      />
    </client-only>

  </div>
</template>

<script lang="ts" setup>
import { BACKGROUND_COLOR } from "~~/constants/constants";
import { useGlobalsStore } from "~~/stores/globals";

const globalsStore = useGlobalsStore();
</script>

<style>
</style>