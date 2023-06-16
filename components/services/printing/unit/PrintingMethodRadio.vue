<template>
  <div class="grid grid-cols-2 gap-4">
    <div
      v-for="printingMethod in printingMethods"
      :key="printingMethod.id"
      class="p-4 grid grid-cols-2 gap-2 rounded-md bg-stone-200"
      :class="selectedMethod?.id === printingMethod.id ? 'border-4 border-primary' : 'border-4 border-transparent grayscale'"
      @click="selectedMethod = printingMethod"
    >
      <nuxt-img
        v-if="printingMethod.printer_type_picture"
        class="rounded-none sm:rounded sm:aspect-square"
        :src="printingMethod.printer_type_picture"
        style="object-fit: scale-down;"
      />
      <div class="flex flex-col justify-center">
        <div class="text-primary text-2xl font-bold">{{ printingMethod.name }}</div>
        <span
          class="hyphens-auto"
          lang="de"
        >{{ printingMethod.full_name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IPrintingMethod, IPrintOrderUnit } from "~~/constants/data";
import { usePrintingMethodStore } from "~~/stores/printing_method";
import { usePrintOrderStore } from "~~/stores/print_order";

const printOrderStore = usePrintOrderStore();
const printingMethodStore = usePrintingMethodStore();

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const printingMethods = printingMethodStore.getPrintingMethods;

const selectedMethod = ref<IPrintingMethod | null>(unit.printing_method);

watch(selectedMethod, (value) => {
  printOrderStore.updateUnit(unit.localUrl, { printing_method: value });
});
</script>

<style>
</style>