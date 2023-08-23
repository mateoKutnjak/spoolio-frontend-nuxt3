<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-24">
      <IndexHead />
      <IndexOurServices />
      <IndexWorkshop />
      <IndexPrinters />
      <IndexOrders />
      <IndexProjects />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalsStore } from "~~/stores/globals";

const globalsStore = useGlobalsStore();
</script>

<style>
</style>