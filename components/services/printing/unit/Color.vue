<template>
  <div
    v-if="spoolsWithSelectedMaterial && spoolsWithSelectedMaterial.length > 0"
    class="flex flex-col"
  >
    <Dropdown
      :items="spoolsWithSelectedMaterial"
      :preselected-item="unit.spool_display"
      :extract-name="(el: IFilamentSpool) => el.color.name.toUpperCase()"
      background-color="bg-white"
      size="md"
      @on-item-clicked="onColorSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import { IFilamentSpool, IPrintOrderUnit } from "~~/constants/data";
import { useFilamentSpoolStore } from "~~/stores/filament_spool";
import { usePrintOrderStore } from "~~/stores/print_order";

const filamentSpoolStore = useFilamentSpoolStore();
const printOrderStore = usePrintOrderStore();

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const spoolsWithSelectedMaterial = computed(() =>
  filamentSpoolStore.getSpoolsWithSameMaterialAs(unit.spool_display)
);

function onColorSelected(spool: IFilamentSpool) {
  printOrderStore.updateUnit(unit.localUrl, { spool_display: spool });
  printOrderStore.updateScreenshot(unit.localUrl);
}
</script>

<style>
</style>