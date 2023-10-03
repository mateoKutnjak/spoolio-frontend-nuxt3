<template>
  <div class="flex flex-col gap-2 max-w-[450px]">

    <div class="flex gap-1 mb-2 justify-between">
      <div class="text-xl self-end font-bold text-base-content pr-2">{{ $t('orientation').toUpperCase() }}:</div>
      <div 
        class="btn btn-sm"
        @click="toggleFaces"
        :class="{'btn-primary': show_faces, 'btn-outline': !show_faces}"
      >
        <Icon
          name="mdi:cube"
          size="18"
        />
        TO FACE
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
            :disabled="show_faces"
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
            :disabled="show_faces"
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
            :disabled="show_faces"
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
import { Euler, Quaternion, Vector3 } from "three";
import { radToDeg } from "three/src/math/MathUtils";
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

const show_faces = ref(false);

onMounted(() => {
  if (unit.show_faces){
    show_faces.value = unit.show_faces;
  }  
});

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

function toggleFaces(event){
  show_faces.value = !show_faces.value;
  console.log(show_faces.value);
  printOrderStore.updateUnit(unit.localUrl, {
    show_faces: show_faces.value
  });
}

watch(useOptimalRotation, (value) => {
  /*
  if (value) {
    // GET XYZ EULER FROM AXIS AND ANGLE
    let optimal_rotation = new Vector3();
    let new_rotation = vector3Parse(unit.optimal_rotation);
    let angle = new_rotation.distanceTo(new Vector3(0,0,0));
    let rot_axis = new_rotation.normalize();

    let quaternion = new Quaternion().setFromAxisAngle(rot_axis, angle);
    let euler = new Euler().setFromQuaternion(quaternion, 'ZYX');
    optimal_rotation.set(radToDeg(euler.x),radToDeg(euler.y),radToDeg(euler.z));

    unit.model_rotation_display = vector3ToString(optimal_rotation);
    
  }

  printOrderStore.updateUnit(unit.localUrl, { 
    use_optimal_rotation_display: value, 
    model_rotation_display: unit.model_rotation_display
  });

  submitted.value = true;
  */
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

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  const item = value.find((el) => el.localUrl === unit.localUrl);
  if (item){
    let rotation = vector3Parse(item.model_rotation_display);
    rotationX.value = rotation.x;
    rotationY.value = rotation.y;
    rotationZ.value = rotation.z;
    console.log("item changed")
    if ((item.show_faces != show_faces.value) && (typeof item.show_faces == "boolean")){
      show_faces.value = item.show_faces;
      console.log("show faces changed")
    }
  }
});

</script>
  
  <style></style>