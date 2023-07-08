<template>
  <div class="py-4 flex flex-col gap-3">
    <div class="px-8 text-3xl text-stone-600 font-bold">{{ printerType.name }}</div>
    <nuxt-img
      v-if="printerType.picture"
      class="px-8 rounded-none sm:rounded sm:aspect-square"
      :src="printerType.picture"
      style="object-fit: scale-down;"
    />
    <div class="px-4 grid grid-cols-1 text-sm">
      <div class="flex gap-1 justify-between">
        <td class="py-1 text-start">{{ capitalizeOnlyFirstLetter($t('pieces')) }}</td>
        <td class="py-1 text-end">{{ printerType.printer_count }}</td>
      </div>
      <div class="flex gap-1 justify-between">
        <td class="py-1 text-start">{{ capitalizeOnlyFirstLetter($t('build_volume')) }}</td>
        <td class="py-1 text-end">{{ `${buildVolume.x}x${buildVolume.y}x${buildVolume.z}` }}</td>
      </div>
      <div class="flex gap-1 justify-between">
        <td class="py-1 first-letter:text-start">{{ capitalizeOnlyFirstLetter($t('technology')) }}</td>
        <td class="py-1 text-end">{{ printerType.printing_method.name }}</td>
      </div>
      <div class="flex gap-1 justify-between">
        <td class="py-1 text-start">{{ capitalizeOnlyFirstLetter($t('max_resolution')) }}</td>
        <td class="py-1 text-end">{{ printerType.max_resolution }}mm</td>
      </div>
    </div>
    <!-- 
    <div class="px-4 overflow-x-auto">
      <table class="table table-compact overflow-scroll w-full text-sm border-separate border-spacing-y-0">
        <tbody class="">
          <tr class="border-none ">
            <td class="py-1 text-start">{{ capitalizeOnlyFirstLetter($t('pieces')) }}</td>
            <td class="py-1 text-end">{{ printerType.printer_count }}</td>
          </tr>
          <tr class="border-none">
            <td class="py-1 text-start">{{ capitalizeOnlyFirstLetter($t('build_volume')) }}</td>
            <td class="py-1 text-end">{{ `${buildVolume.x}x${buildVolume.y}x${buildVolume.z}` }}</td>
          </tr>
          <tr class="border-none">
            <td class="py-1 first-letter:text-start">{{ capitalizeOnlyFirstLetter($t('technology')) }}</td>
            <td class="py-1 text-end">{{ printerType.printing_method.name }}</td>
          </tr>
          <tr class="border-none">
            <td class="py-1 text-start">{{ capitalizeOnlyFirstLetter($t('max_resolution')) }}</td>
            <td class="py-1 text-end">{{ printerType.max_resolution }}mm</td>
          </tr>
        </tbody>
      </table>
    </div> -->
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