<template>
  <div class="grid grid-cols-2 gap-4">
    <div
      v-for="printingMethod in printingMethods"
      :key="printingMethod.id"
      class="p-4 grid grid-cols-2 gap-2 rounded-md bg-white"
      :class="selectedMethod?.id === printingMethod.id ? 'border-4 border-primary' : 'border-4 border-stone-300/80 grayscale'"
      @click="selectedMethod = printingMethod"
    >
      <nuxt-img
        v-if="printingMethod.printer_type_picture"
        class="rounded-none sm:rounded sm:aspect-square "
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
import { useFilamentSpoolStore } from "~~/stores/filament_spool";
import { usePrintingMethodStore } from "~~/stores/printing_method";
import { usePrintOrderStore } from "~~/stores/print_order";

const filamentSpoolStore = useFilamentSpoolStore();
const printOrderStore = usePrintOrderStore();
const printingMethodStore = usePrintingMethodStore();

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const printingMethods = printingMethodStore.getPrintingMethods;

const selectedMethod = ref<IPrintingMethod | null>(unit.printing_method);

watch(selectedMethod, (value) => {
  if (value) {
    printOrderStore.updateUnit(unit.localUrl, {
      printing_method_display: value,
    });

    if (!value.supported_materials || !value.supported_materials.length) {
      throw createError(
        `Supported materials not existant for printing method ${value.name}. Got ${value.supported_materials}`
      );
    }
    const firstSupportedMaterial = value.supported_materials[0];

    const spoolWithFirstSupportedMaterial =
      filamentSpoolStore.getSpoolsWithMaterial(firstSupportedMaterial);

    if (
      !spoolWithFirstSupportedMaterial ||
      !spoolWithFirstSupportedMaterial.length
    ) {
      throw createError(
        `Spools not found for material ${firstSupportedMaterial.name}. Got ${spoolWithFirstSupportedMaterial}`
      );
    }

    printOrderStore.updateUnit(unit.localUrl, {
      spool_display: spoolWithFirstSupportedMaterial[0],
    });
  }
});
</script>

<style>
</style>