<template>
  <div class="flex gap-3 items-start text-gray-500">
    <div class="flex flex-col justify-between mt-0.5">
      <Icon
        name="lucide:rotate-3d"
        size="25"
        class="text-gray-500"
      />

    </div>
    <div class="flex flex-col gap-2">

      <div class="flex gap-2 items-center">
        <div class="text-sm">
          {{ useOptimalRotation ? 'Optimal orientation' : 'Suboptimal orientation' }}
        </div>
        <label class="btn btn-sm btn-ghost btn-circle swap swap-rotate">
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
      </div>
      <div class="ml-2 flex flex-col gap-1">
        <div class="flex gap-2 items-center">
          <strong class="text-xs"> X </strong>
          <input
            type="number"
            v-model="rotationX"
            :disabled="useOptimalRotation"
            class="input input-bordered w-20 input-sm !outline-none"
          />
          <div class="text-sm">{{ RotationUnit[rotationUnit] }}</div>
        </div>

        <div class="flex gap-2 items-center">
          <strong class="text-xs"> Y </strong>
          <input
            type="number"
            v-model="rotationY"
            :disabled="useOptimalRotation"
            class="input input-bordered w-20 input-sm !outline-none"
          />
          <div class="text-sm">{{ RotationUnit[rotationUnit] }}</div>
        </div>

        <div class="flex gap-2 items-center">
          <strong class="text-xs"> Z </strong>
          <input
            type="number"
            v-model="rotationZ"
            :disabled="useOptimalRotation"
            class="input input-bordered w-20 input-sm !outline-none"
          />
          <div class="text-sm">{{ RotationUnit[rotationUnit] }}</div>
        </div>

      </div>
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

const rotationX = ref(rotations.x);
const rotationY = ref(rotations.y);
const rotationZ = ref(rotations.z);

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
    model_rotation: vector3ToString(
      new Vector3(value, rotationY.value, rotationZ.value)
    ),
  });
});

watch(rotationY, (value) => {
  printOrderStore.updateUnit(localUrl, {
    model_rotation: vector3ToString(
      new Vector3(rotationX.value, value, rotationZ.value)
    ),
  });
});

watch(rotationZ, (value) => {
  printOrderStore.updateUnit(localUrl, {
    model_rotation: vector3ToString(
      new Vector3(rotationX.value, rotationY.value, value)
    ),
  });
});
</script>

<style>
</style>