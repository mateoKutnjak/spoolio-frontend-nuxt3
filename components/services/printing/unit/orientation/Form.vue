<template>
  <div class="flex flex-col gap-2 max-w-[450px]">

    <div class="flex gap-1 mb-2">
      <div class="text-xl self-end font-bold text-base-content pr-2">{{ $t('orientation').toUpperCase() }}:</div>
      <div
        class="tooltip tooltip-bottom"
        :data-tip="capitalizeOnlyFirstLetter($t('optimal_orientation'))"
      >
        <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate">
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
      :actions="false"
    >
      <div class="flex gap-1 justify-between">
        <div class="flex gap-2 items-center">
          <p class="text-md"> X </p>
          <FormKit
            type="number"
            v-model="rotationX"
            :disabled="useOptimalRotation"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-center !outline-none border !border-gray-400 !text-lg',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-[100px] !m-0',
              }"
          />
        </div>
        <div class="flex gap-2 items-center">
          <p class="text-md"> Y </p>
          <FormKit
            type="number"
            v-model="rotationY"
            :disabled="useOptimalRotation"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-center !outline-none border !border-gray-400 !text-lg',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-[100px] !m-0',
              }"
          />
        </div>
        <div class="flex gap-2 items-center">
          <p class="text-md"> Z </p>
          <FormKit
            type="number"
            v-model="rotationZ"
            :disabled="useOptimalRotation"
            :classes="{
                input: 'input input-bordered w-full input-sm !text-center !outline-none border !border-gray-400 !text-lg',
                inner: '!p-0 m-0 border-none bg-transparent',
                outer: 'w-[100px] !m-0',
              }"
          />
        </div>
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

// async function submitHandler() {
//   console.log("Sumbit handler");
//   slicerEstimationPending.value = true;

//   await printOrderStore.updateUnit(unit.localUrl, {
//     model_rotation: vector3ToString(
//       new Vector3(rotationX.value, rotationY.value, rotationZ.value)
//     ),
//   });

//   slicerEstimationPending.value = false;

//   submitted.value = true;
// }

watch(useOptimalRotation, (value) => {
  if (value) {
    unit.model_rotation_display = unit.optimal_rotation;

    const optimal_rotation = vector3Parse(unit.optimal_rotation);

    rotationX.value = optimal_rotation.x;
    rotationY.value = optimal_rotation.y;
    rotationZ.value = optimal_rotation.z;
  }

  printOrderStore.updateUnit(unit.localUrl, { use_optimal_rotation_display: value });

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