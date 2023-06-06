<template>
  <div class="flex flex-col gap-3 items-start text-gray-500">
    <div class="flex justify-between mt-0.5 gap-1">
      <Icon
        name="lucide:rotate-3d"
        size="25"
        class="text-gray-500"
      />
      <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate -mt-0.5">
        <input
          type="checkbox"
          v-model="useOptimalRotation"
        />
        <Icon
          name="lucide:lock"
          class="swap-on text-gray-400"
          size="20"
        />
        <Icon
          name="lucide:unlock"
          class="swap-off text-gray-400"
          size="20"
        />
      </label>
      <div class="mt-1.5 text-sm">
        {{ useOptimalRotation ? capitalizeOnlyFirstLetter($t('optimal_orientation')) : capitalizeOnlyFirstLetter($t('custom_orientation')) }}
      </div>

    </div>
    <div class="flex flex-col gap-2 items-start rounded-lg shadow bg-white">
      <FormKit
        type="form"
        id="rotation-form"
        submit-label="Save"
        @submit="submitHandler"
        :actions="false"
      >
        <div class="flex flex-col gap-1 p-4">
          <div class="flex gap-2 items-center">
            <strong class="text-xs"> X </strong>
            <FormKit
              type="number"
              v-model="rotationX"
              :disabled="useOptimalRotation"
              :classes="{
                input: 'input input-bordered w-20 input-sm !outline-none bg-white',
                inner: 'p-0 m-0 border-none bg-transparent',
                outer: '!m-0',
              }"
            />
            <div class="text-sm">{{ $t(RotationUnit[rotationUnit]) }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <strong class="text-xs"> Y </strong>
            <FormKit
              type="number"
              v-model="rotationY"
              :disabled="useOptimalRotation"
              :classes="{
                input: 'input input-bordered w-20 input-sm !outline-none bg-white',
                inner: 'p-0 m-0 border-none bg-transparent',
                outer: '!m-0',
              }"
            />
            <div class="text-sm">{{ $t(RotationUnit[rotationUnit]) }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <strong class="text-xs"> Z </strong>
            <FormKit
              type="number"
              v-model="rotationZ"
              :disabled="useOptimalRotation"
              :classes="{
                input: 'input input-bordered w-20 input-sm !outline-none bg-white',
                inner: 'p-0 m-0 border-none bg-transparent',
                outer: '!m-0',
              }"
            />
            <div class="text-sm">{{ $t(RotationUnit[rotationUnit]) }}</div>
          </div>
          <FormKit
            v-if="!useOptimalRotation"
            type="submit"
            :label="capitalizeOnlyFirstLetter($t('save'))"
            :classes="{input: 'btn btn-sm btn-block mt-2 rounded-lg text-xs', outer: '!m-0', }"
            :input-class="{
              'loading': slicerEstimationPending
            }"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Vector3 } from "three";
import { useGlobalsStore } from "~~/stores/globals";
import { usePrintOrderStore } from "~~/stores/print_order";

const globalsStore = useGlobalsStore();
const printOrderStore = usePrintOrderStore();

const { rotationUnit } = storeToRefs(globalsStore);

const { localUrl } = defineProps<{
  localUrl: string;
}>();

const unit = printOrderStore.getUnitByLocalUrl(localUrl);

if (!unit) {
  throw createError(
    `Unit with localUrl=${localUrl} not found in print order store`
  );
}

const rotations = vector3Parse(unit.model_rotation);

const useOptimalRotation = ref(unit.use_optimal_rotation);
const slicerEstimationPending = ref(false);

const rotationX = ref(rotations.x);
const rotationY = ref(rotations.y);
const rotationZ = ref(rotations.z);

async function submitHandler() {
  slicerEstimationPending.value = true;

  printOrderStore.updateUnit(localUrl, {
    model_rotation: vector3ToString(
      new Vector3(rotationX.value, rotationY.value, rotationZ.value)
    ),
  });

  slicerEstimationPending.value = false;
}

watch(useOptimalRotation, (value) => {
  if (value) {
    unit.model_rotation = unit.optimal_rotation;

    const optimal_rotation = vector3Parse(unit.optimal_rotation);

    rotationX.value = optimal_rotation.x;
    rotationY.value = optimal_rotation.y;
    rotationZ.value = optimal_rotation.z;
  }

  printOrderStore.updateUnit(localUrl, { use_optimal_rotation: value });
});

watch(rotationX, (value) => {
  printOrderStore.updateUnit(localUrl, {
    model_rotation_display: vector3ToString(
      new Vector3(value, rotationY.value, rotationZ.value)
    ),
  });
});

watch(rotationY, (value) => {
  printOrderStore.updateUnit(localUrl, {
    model_rotation_display: vector3ToString(
      new Vector3(rotationX.value, value, rotationZ.value)
    ),
  });
});

watch(rotationZ, (value) => {
  printOrderStore.updateUnit(localUrl, {
    model_rotation_display: vector3ToString(
      new Vector3(rotationX.value, rotationY.value, value)
    ),
  });
});
</script>

<style>
</style>