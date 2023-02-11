<template>
  <div
    ref="root_container"
    class="cursor-move"
  >
    <Renderer
      ref="renderer"
      :alpha="true"
      :resize="true"
      :orbitCtrl="{active: false, enableZoom: true}"
    >
      <Camera
        ref="camera"
        :position="{ z: 2.5 }"
        :look-at="{x: 0, y: 0, z: 0}"
      />
      <Scene
        :background="'#FAFAFA'"
        ref="scene"
      >

        <Mesh ref="box">
        </Mesh>
      </Scene>
      <EffectComposer>
        <RenderPass />
        <FXAAPass />
      </EffectComposer>
    </Renderer>
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
  AmbientLight,
  HemisphereLight,
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

const root_container = ref<any>(null);

const color = ref<number>();

const volume = ref<number>(0);

onMounted(() => {
  renderer.value.onBeforeRender(() => {
    // box.value.mesh.rotation.x -= 0.003;
    box.value.mesh.rotation.y += 0.002;
    // box.value.mesh.rotation.z += 0.002;
  });

  root_container.value.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    console.log("here");

    camera.value.aspect =
      root_container.value.innerWidth / root_container.value.innerHeight;
    camera.value.updateProjectionMatrix();

    renderer.value.setSize(
      root_container.value.innerWidth / 2,
      root_container.value.innerHeight / 2
    );
  }

  const loader = new STLLoader();
  loader.load(stlFileUrl, (geometry: BufferGeometry) => {
    const material = new Three.MeshStandardMaterial({
      color: 0xffff00,
    });
    const mesh = new Three.Mesh(geometry, material);
    box.value.add(mesh);

    var size = new Three.Vector3();
    var box2 = new Three.Box3().setFromObject(mesh);
    box2.getSize(size);

    volume.value = getVolume(geometry);

    if (volume.value) {
      printOrderStore.updateUnit(stlFileUrl, {
        modelVolume: volume.value,
      });
    }

    var middle = new Three.Vector3();
    geometry.computeBoundingBox();

    if (geometry.boundingBox) {
      printOrderStore.updateUnit(stlFileUrl, {
        modelDimensions: new Vector3(
          Math.abs(geometry.boundingBox.max.x - geometry.boundingBox.min.x),
          Math.abs(geometry.boundingBox.max.y - geometry.boundingBox.min.y),
          Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z),
        )
      });
    }

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

  function getVolume(geometry: BufferGeometry) {
    let position = geometry.attributes.position;
    let faces = position.count / 3;
    let sum = 0;
    let p1 = new Three.Vector3(),
      p2 = new Three.Vector3(),
      p3 = new Three.Vector3();
    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3 + 0);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);
      sum += signedVolumeOfTriangle(p1, p2, p3);
    }
    return sum;
  }

  function signedVolumeOfTriangle(
    p1: Three.Vector3,
    p2: Three.Vector3,
    p3: Three.Vector3
  ) {
    return p1.dot(p2.cross(p3)) / 6.0;
  }

  // const origin = new Three.Vector3(0, 0, 0);
  // const xAxis = new Three.Vector3(100, 0, 0);
  // const yAxis = new Three.Vector3(0, 100, 0);
  // const zAxis = new Three.Vector3(0, 0, 100);

  // const points = [];
  // points.push(new Three.Vector3(0, 0, 0));
  // points.push(new Three.Vector3(0, 10, 0));
  // points.push(new Three.Vector3(10, 0, 0));

  // const xAxisGeometry = new Three.BufferGeometry().setFromPoints([
  //   origin,
  //   xAxis,
  // ]);
  // const yAxisGeometry = new Three.BufferGeometry().setFromPoints([
  //   origin,
  //   yAxis,
  // ]);
  // const zAxisGeometry = new Three.BufferGeometry().setFromPoints([
  //   origin,
  //   zAxis,
  // ]);

  // const xAxisMaterial = new Three.LineBasicMaterial({ color: 0xff0000 });
  // const yAxisMaterial = new Three.LineBasicMaterial({ color: 0x00ff00 });
  // const zAxisMaterial = new Three.LineBasicMaterial({ color: 0x0000ff });

  // const xAxisLine = new Three.Line(xAxisGeometry, xAxisMaterial);
  // const yAxisLine = new Three.Line(yAxisGeometry, yAxisMaterial);
  // const zAxisLine = new Three.Line(zAxisGeometry, zAxisMaterial);

  // scene.value.add(xAxisLine);
  // scene.value.add(yAxisLine);
  // scene.value.add(zAxisLine);

  const hemiLight = new Three.HemisphereLight(0xffeeb1, 0x080820, 1);
  scene.value.add(hemiLight);

  const light = new Three.SpotLight(0xffa95c, 1);
  light.position.set(-50, 50, 50);
  light.castShadow = true;
  scene.value.add(light);
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

watch(volume, (value) => {
  console.log("VOLUME = " + value);
});
</script>