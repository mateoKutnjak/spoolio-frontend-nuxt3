<template>
  <div class="flex flex-col gap-2">

    <div class="h-9 flex gap-1 items-end">
      <div class="mb-0.5 text-lg text-stone-600">{{ capitalizeOnlyFirstLetter($t('orientation')) }}</div>
      <div
        class="tooltip tooltip-bottom"
        :data-tip="capitalizeOnlyFirstLetter($t('optimal_orientation'))"
      >
        <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate -mt-0.5">
          <input
            type="checkbox"
            v-model="useOptimalRotation"
          />
          <Icon
            name="ph:lock"
            class="swap-on text-stone-600"
            size="20"
          />
          <Icon
            name="ph:lock-open"
            class="swap-off text-stone-400"
            size="20"
          />
        </label>
      </div>
    </div>

    <FormKit
      type="form"
      id="rotation-form"
      @submit="submitHandler"
      :actions="false"
    >
      <div class="flex flex-col gap-1">
        <div class="flex gap-2 items-center">
          <strong class="text-xs"> X </strong>
          <FormKit
            type="number"
            v-model="rotationX"
            :disabled="useOptimalRotation"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-right  !outline-none border !border-stone-300',
                inner: '!p-0 m-0 border-none bg-white',
                outer: 'w-full !m-0',
              }"
          />
        </div>
        <div class="flex gap-2 items-center">
          <strong class="text-xs"> Y </strong>
          <FormKit
            type="number"
            v-model="rotationY"
            :disabled="useOptimalRotation"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-right  !outline-none border !border-stone-300',
                inner: '!p-0 m-0 border-none bg-white',
                outer: 'w-full !m-0',
              }"
          />
        </div>
        <div class="flex gap-2 items-center">
          <strong class="text-xs"> Z </strong>
          <FormKit
            type="number"
            v-model="rotationZ"
            :disabled="useOptimalRotation"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-right  !outline-none border !border-stone-300',
                inner: '!p-0 m-0 border-none bg-white',
                outer: 'w-full !m-0',
              }"
          />
        </div>
        <FormKit
          v-if="!useOptimalRotation && !submitted"
          type="submit"
          :label="capitalizeOnlyFirstLetter($t('save'))"
          :disabled="submitted"
          :classes="{
            input: `btn btn-sm btn-block mt-2 rounded-lg text-xs text-white` , 
            outer: '!m-0', 
          }"
          :input-class="{
              'loading': slicerEstimationPending,
            }"
        />
      </div>
    </FormKit>
  </div>
</template>
  
  <script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Vector3 } from "three";
import { IPrintOrderUnit } from "~~/constants/data";
import { useGlobalsStore } from "~~/stores/globals";
import { usePrintOrderStore } from "~~/stores/print_order";

const globalsStore = useGlobalsStore();
const printOrderStore = usePrintOrderStore();

const { rotationUnit } = storeToRefs(globalsStore);

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const rotationUnits: string[] = Object.keys(RotationUnit).filter((item) => {
  return isNaN(Number(item));
});

const rotations = vector3Parse(unit.model_rotation);

const useOptimalRotation = ref(unit.use_optimal_rotation);
const selectedRotationUnit = ref(unit.rotation_unit);
const slicerEstimationPending = ref(false);

const rotationX = ref(rotations.x);
const rotationY = ref(rotations.y);
const rotationZ = ref(rotations.z);

const submitted = ref(true);

async function submitHandler() {
  console.log("Sumbit handler");
  slicerEstimationPending.value = true;

  await printOrderStore.updateUnit(unit.localUrl, {
    model_rotation: vector3ToString(
      new Vector3(rotationX.value, rotationY.value, rotationZ.value)
    ),
  });

  slicerEstimationPending.value = false;

  submitted.value = true;
}

watch(useOptimalRotation, (value) => {
  if (value) {
    unit.model_rotation = unit.optimal_rotation;

    const optimal_rotation = vector3Parse(unit.optimal_rotation);

    rotationX.value = optimal_rotation.x;
    rotationY.value = optimal_rotation.y;
    rotationZ.value = optimal_rotation.z;
  }

  printOrderStore.updateUnit(unit.localUrl, { use_optimal_rotation: value });

  submitted.value = true;
});

watch(rotationX, (value) => {
  printOrderStore.updateUnit(unit.localUrl, {
    model_rotation_display: vector3ToString(
      new Vector3(value, rotationY.value, rotationZ.value)
    ),
  });

  submitted.value = false;
});

watch(rotationY, (value) => {
  printOrderStore.updateUnit(unit.localUrl, {
    model_rotation_display: vector3ToString(
      new Vector3(rotationX.value, value, rotationZ.value)
    ),
  });

  submitted.value = false;
});

watch(rotationZ, (value) => {
  printOrderStore.updateUnit(unit.localUrl, {
    model_rotation_display: vector3ToString(
      new Vector3(rotationX.value, rotationY.value, value)
    ),
  });

  submitted.value = false;
});
</script>
  
  <style></style>