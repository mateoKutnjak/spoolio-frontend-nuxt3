<template>
  <div class="flex flex-col gap-2">
    <div class="h-9 flex gap-1 justify-between items-end">
      <div class="mb-0.5 text-lg text-stone-600">{{ capitalizeOnlyFirstLetter($t('dimensions')) }}</div>

      <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate -mt-0.5">
        <input
          type="checkbox"
          v-model="lockScale"
        />
        <Icon
          name="lucide:lock"
          class="swap-on text-gray-500"
          size="20"
        />
        <Icon
          name="lucide:unlock"
          class="swap-off text-gray-400"
          size="20"
        />
      </label>
      <div class="flex-1"></div>
      <Dropdown
        class="w-fit"
        :items="dimensionUnits"
        :preselected-item="unit.length_unit"
        :extract-name="a => a"
        size="sm"
        background-color="bg-stone-200"
        @on-item-clicked="onDimensionUnitSelected"
      />
    </div>

    <div class="flex flex-col gap-1">
      <div class="flex gap-2 items-center">
        <strong class="text-xs"> X </strong>
        <FormKit
          type="number"
          v-model="dimensionX"
          :disabled="true"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-right !outline-none',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-full !m-0',
              }"
        />
      </div>
      <div class="flex gap-2 items-center">
        <strong class="text-xs"> Y </strong>
        <FormKit
          type="number"
          v-model="dimensionY"
          :disabled="true"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-right !outline-none',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-full !m-0',
              }"
        />
      </div>
      <div class="flex gap-2 items-center">
        <strong class="text-xs"> Z </strong>
        <FormKit
          type="number"
          v-model="dimensionZ"
          :disabled="true"
          :classes="{
                input: 'input input-bordered w-full input-sm !text-right !outline-none',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-full !m-0',
              }"
        />
      </div>

    </div>

    <FormKit
      type="form"
      id="dimension-form"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="flex flex-col gap-1">
        <div class="flex gap-2 items-center">
          <strong class="text-xs"> Scale </strong>
          <FormKit
            type="number"
            v-model="scale"
            :disabled="lockScale && submitted"
            :min="0.01"
            :max="100.00"
            step="any"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-right  !outline-none border border-stone-300',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-full !m-0',
              }"
          />
        </div>
        <FormKit
          v-if="!lockScale && !submitted"
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('save'))"
          :disabled="submitted"
          :classes="{
            input: 'btn btn-sm btn-block mt-2 rounded-lg text-xs text-white', 
            outer: '!m-0', 
          }"
          :input-class="{
              'loading': slicerEstimationPending
            }"
        />
      </div>
    </FormKit>
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

const modelDimensions = vector3Parse(unit.model_dimensions);

const lockScale = ref(true);
const dimensionX = ref((modelDimensions.x * unit.scale).toFixed(2));
const dimensionY = ref((modelDimensions.y * unit.scale).toFixed(2));
const dimensionZ = ref((modelDimensions.z * unit.scale).toFixed(2));
const scale = ref(unit.scale);

const submitted = ref(true);

function onDimensionUnitSelected(e: any) {
  unit.length_unit = e;
}

async function submitHandler() {
  printOrderStore.updateUnit(unit.localUrl, { scale: scale.value });

  submitted.value = true;
}

watch(scale, (value) => {
  printOrderStore.updateUnit(unit.localUrl, {
    scale_display: value,
  });

  dimensionX.value = (value * modelDimensions.x).toFixed(2);
  dimensionY.value = (value * modelDimensions.y).toFixed(2);
  dimensionZ.value = (value * modelDimensions.z).toFixed(2);

  submitted.value = false;
});

watch(lockScale, (value) => {});
</script>
  
  <style></style>