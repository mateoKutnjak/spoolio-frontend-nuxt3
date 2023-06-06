<template>
  <div class="px-8 py-4 flex flex-col gap-3">
    <div class="text-3xl text-stone-600 font-bold">{{ printerType.name }}</div>
    <nuxt-img
      v-if="printerType.picture"
      class="rounded-none sm:rounded sm:aspect-square"
      :src="printerType.picture"
      style="object-fit: scale-down;"
    />
    <div>
      <div>{{ capitalizeOnlyFirstLetter($t('pieces')) }}: {{ printerType.printer_count }}</div>
      <div>{{ capitalizeOnlyFirstLetter($t('build_volume')) }}: {{ `${buildVolume.x}x${buildVolume.y}x${buildVolume.z}` }}</div>
      <div>{{ capitalizeOnlyFirstLetter($t('technology')) }}: {{ printerType.printing_method.name }}</div>
      <div>{{ capitalizeOnlyFirstLetter($t('max_resolution')) }} {{ printerType.max_resolution }}mm</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPrinterType } from "~~/constants/data";

const { printerType } = defineProps<{
  printerType: IPrinterType;
}>();

const buildVolume = vector3Parse(printerType.max_print_size);
</script>

<style>
</style>