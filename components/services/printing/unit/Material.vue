<template>
  <div
    v-if="spools && spools.length > 0"
    class="flex flex-col"
  >
    <Dropdown
      :items="spools"
      :preselected-item="unit.spool"
      :extract-name="(el: IFilamentSpool) => el.material.name"
      background-color="bg-stone-200"
      size="md"
      @on-item-clicked="onMaterialSelected"
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

const spools = computed(() =>
  filamentSpoolStore.getSpoolsUniqueMaterials.filter((el) =>
    listContains(
      unit.printing_method.supported_materials.map((el) => el.id),
      el.material.id
    )
  )
);

function onMaterialSelected(spool: IFilamentSpool) {
  printOrderStore.updateUnit(unit.localUrl, { spool: spool });
}
</script>

<style>
</style>