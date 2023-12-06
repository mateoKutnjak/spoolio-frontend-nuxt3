<template>
  <div class="flex flex-col gap-2 max-w-[450px]">

    <div class="flex justify-between mb-2">
      <div class="text-xl self-center font-bold text-base-content pr-2">{{ $t('dimensions').toUpperCase() }}:</div>

      <div class="flex px-2">
        <FormKit
          type="number"
          v-model="scale"
          :min="0.01"
          :max="10000.00"
          step="any"
          :classes="{
              input: 'input input-bordered input-sm !text-right !outline-none border !border-gray-400 !text-lg',
              inner: '!p-0 m-0 border-none bg-basis-100',
              outer: 'w-[60px] !m-0 self-center',
            }"
        />
        <p class="self-center ml-2">%</p>
      </div>

      <Dropdown
        class="w-[100px] h-full"
        :items="dimensionUnits"
        :preselected-item="unit.length_unit"
        :extract-name="a => a"
        size="sm"
        background-color="bg-white"
        @on-item-clicked="onDimensionUnitSelected"
      />
      
    </div>

    <!-- X, Y, Z Scale -->
    <div class="flex gap-5 justify-between">
      <div class="flex gap-2 items-center">
        <p class="text-md"> X </p>
        <FormKit
          type="number"
          v-model="dimensionX"
          :disabled="true"
          :classes="{
                input: 'input input-bordered input-sm !text-center !outline-none !border-gray-400 !text-lg',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-[100px] !m-0',
              }"
        />
      </div>
      <div class="flex gap-2 items-center">
        <p class="text-md"> Y </p>
        <FormKit
          type="number"
          v-model="dimensionY"
          :disabled="true"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-center !outline-none !border-gray-400 !text-lg',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-[100px] !m-0',
              }"
        />
      </div>
      <div class="flex gap-2 items-center">
        <p class="text-md"> Z </p>
        <FormKit
          type="number"
          v-model="dimensionZ"
          :disabled="true"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-center !outline-none !border-gray-400 !text-lg',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-[100px] !m-0',
              }"
        />
      </div>


    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { IPrintOrderUnit } from "~~/constants/data";
import { usePrintOrderStore } from "~~/stores/print_order";

const printOrderStore = usePrintOrderStore();

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const dimensionUnits: string[] = Object.keys(DimensionUnit).filter((item) => {
  return isNaN(Number(item));
});

let model_dim = unit.model_dimensions;
const modelDimensions = vector3Parse(unit.model_dimensions);

const lockScale = ref(true);
const dimensionX = ref((modelDimensions.x).toFixed(2));
const dimensionY = ref((modelDimensions.y).toFixed(2));
const dimensionZ = ref((modelDimensions.z).toFixed(2));
const scale = ref(unit.scale*100);

const submitted = ref(true);

function onDimensionUnitSelected(e: any) {
  printOrderStore.updateUnit(unit.localUrl, {
    length_unit_display: e,
  });
}

// async function submitHandler() {
//   printOrderStore.updateUnit(unit.localUrl, { scale: scale.value });

//   submitted.value = true;
// }

watch(scale, (value) => {
  let percent = value/100;
  printOrderStore.updateUnit(unit.localUrl, {
    scale_display: percent,
  });
/*
  dimensionX.value = (percent * modelDimensions.x).toFixed(2);
  dimensionY.value = (percent * modelDimensions.y).toFixed(2);
  dimensionZ.value = (percent * modelDimensions.z).toFixed(2);

  submitted.value = false;
  */
});

watch(printOrderStore.getUnits, (value) => {
  const item = value.find((el) => el.localUrl === unit.localUrl);

  if (item){
    if (item.model_dimensions != model_dim){
      model_dim = item.model_dimensions;
      let dim = vector3Parse(model_dim);
        
      dimensionX.value = (dim.x).toFixed(2);
      dimensionY.value = (dim.y).toFixed(2);
      dimensionZ.value = (dim.z).toFixed(2);

      submitted.value = false;
    }
  }
  
});

watch(lockScale, (value) => {});
</script>
  
  <style></style>