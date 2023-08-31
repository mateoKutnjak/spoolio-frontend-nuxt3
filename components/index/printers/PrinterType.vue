<template>
  <div class="py-7 px-4 flex bg-accent 2xl:w-[85%] xl:w-[90%] w-[93%] h-full rounded-md justify-center relative">
    <div class="absolute top-0 left-0 mt-3 lg:ml-6 ml-16 font-bold text-primary text-3xl">{{ printerType.printer_count }} x</div>
    <nuxt-img
      v-if="printerType.picture"
      class="xl:mr-10 mr-8 ml-[-10px]"
      :src="printerType.picture"
      style="object-fit: scale-down;"
    />
    <div class="flex flex-col justify-between">
      <div class="2xl:text-4xl text-3xl text-base-content font-bold self-start">{{ printerType.name }}</div>
      
      <div class="flex flex-col">
        <div class="mr-5 mb-[-4px] text-sm self-start">{{ capitalizeOnlyFirstLetter($t('technology')) }}</div>
        <div class="mr-5 mb-2 self-start font-bold">{{ printerType.printing_method.name }}</div>
        
        <div class="mr-5 mb-[-4px] text-sm self-start">{{ capitalizeOnlyFirstLetter($t('max_resolution')) }}</div>
        <div class="mr-5 mb-2 self-start font-bold">{{ printerType.max_resolution }} mm</div>

        <div class="mr-5 mb-[-4px] text-sm self-start">{{ capitalizeOnlyFirstLetter($t('build_volume')) }} (mm)</div>
        <div class="mr-5 self-start font-bold">{{ `${buildVolume.x}x${buildVolume.y}x${buildVolume.z}` }}</div>
        
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