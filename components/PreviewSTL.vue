<template>
  <div style="display: flex; justify-content: center; align-items: center;">
    <div>
      <Renderer
        ref="renderer"
        :alpha="true"
        :resize="true"
        :orbitCtrl="{active: true, enableZoom: false}"
      >
        <Camera
          ref="camera"
          :position="{ z: 2.5 }"
          :look-at="{x: 0, y: 0, z: 0}"
        />
        <Scene
          :background="'#FFFFFF'"
          ref="scene"
        >
          <PointLight :position="{x: 50, y: 50, z: 50 }" />
          <PointLight :position="{x: 50, y: 50, z: -50 }" />
          <PointLight :position="{x: -50, y: -50, z: -50 }" />
          <Mesh ref="box">
          </Mesh>
        </Scene>
        <EffectComposer>
          <RenderPass />
          <FXAAPass />
        </EffectComposer>
      </Renderer>
    </div>
  </div>
</template>
      
      <script lang="ts" setup>
import {
  Box,
  Mesh,
  Camera,
  PointLight,
  Renderer,
  Scene,
  TorusKnotGeometry,
  ToonMaterial,
  EffectComposer,
  RenderPass,
  FXAAPass,
} from "troisjs";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import * as Three from "three";
import { Vector3 } from "three";
import { useFilamentColorStore } from "~~/stores/filament_color";
import {
  IPrintOrderUnitResponse,
  usePrintOrderStore,
} from "~~/stores/print_order";

const filamentColorStore = useFilamentColorStore();
const printOrderStore = usePrintOrderStore();

const { stlFileUrl } = defineProps(["stlFileUrl"]);

const renderer = ref<any>(null);
const scene = ref<any>(null);
const camera = ref<any>(null);
const box = ref<any>(null);

const color = ref<number>();

onMounted(() => {
  renderer.value.onBeforeRender(() => {
    // box.value.mesh.rotation.x -= 0.003;
    box.value.mesh.rotation.y += 0.02;
    // box.value.mesh.rotation.z += 0.002;
  });

  const loader = new STLLoader();
  loader.load(stlFileUrl, (geometry: BufferGeometry) => {
    const material = new Three.MeshStandardMaterial({
      color: 0xffff00,
    });
    const mesh = new Three.Mesh(geometry, material);
    box.value.add(mesh);

    var middle = new Three.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox?.getCenter(middle);
    mesh.geometry.applyMatrix4(
      new Three.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
    );

    var largestDimension = Math.max(
      geometry?.boundingBox?.max.x || 0,
      geometry?.boundingBox?.max.y || 0,
      geometry?.boundingBox?.max.z || 0
    );

    camera.value.camera.position.z = largestDimension * 3;

    watch(color, (value) => {
      mesh.material.color.setHex(value || 0xffffff);
    });
  });
});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  const item = value.find((el) => el.localUrl === stlFileUrl);

  if (!item) {
    color.value = 0xffffff;
    return;
  }

  const colorStringValue =
    filamentColorStore.getFilamentColors.find((el) => el.id === item.color)
      ?.value || "#FFFFFF";

  const colorStringValueTrimmed = colorStringValue.substring(1);

  const parsed = parseInt(colorStringValueTrimmed, 16);

  color.value = parsed;
});
</script>