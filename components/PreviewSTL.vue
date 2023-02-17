<template>
  <div ref="root">
    <canvas ref="experience">
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import {
  AmbientLight,
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  HemisphereLight,
  InterleavedBufferAttribute,
  Line,
  LineBasicMaterial,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from "three";
import { useElementSize } from "@vueuse/core";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { usePrintOrderStore } from "~~/stores/print_order";
import { useFilamentColorStore } from "~~/stores/filament_color";

const { stlFileUrl } = defineProps<{
  stlFileUrl: string;
}>();

const filamentColorStore = useFilamentColorStore();
const printOrderStore = usePrintOrderStore();

const printOrderUnit = printOrderStore.getUnitByLocalUrl(stlFileUrl);

if (!printOrderUnit) {
  console.error(`Print order unit is null for fileUrl=${stlFileUrl}`);
  throw createError(`Print order unit is null for fileUrl=${stlFileUrl}`);
}

let renderer: WebGLRenderer;
let controls: OrbitControls;
const experience = ref<HTMLCanvasElement | null>(null);

const root = ref(null);
const { width, height } = useElementSize(root);

const aspectRatio = computed(() => width.value / height.value);

const color = ref<number>();

const scene = new Scene();

setSceneBackground(scene, new Color("#EAEAEA"));

function setRenderer() {
  if (experience.value) {
    renderer = new WebGLRenderer({
      canvas: experience.value,
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    updateRenderer();
  }
}

function updateRenderer() {
  renderer.setSize(width.value, height.value);
  renderer.render(scene, camera);
}

function updateCamera() {
  camera.aspect = aspectRatio.value;
  camera.updateProjectionMatrix();
}

// ** CAMERA ** //

const camera = new PerspectiveCamera(75, aspectRatio.value, 0.1, 1000);
camera.position.set(0, 0, 4);
scene.add(camera);

// ** LIGHTS ** //

addLights();
// addAxisLines();

// *** OBJECT LOADING *** //

const { load } = useSTLModel();
const geometry = await load(stlFileUrl);

// *** OBJECT MODELING *** //

const meshColor =
  filamentColorStore.getFilamentColors.find(
    (el) => el.id === printOrderUnit.color
  )?.value || "#EAEAEA";

const mesh = new Mesh(
  geometry,
  new MeshStandardMaterial({ color: meshColor, roughness: 0.9, metalness: 0.5 })
);

geometry.computeBoundingBox();

if (mesh.geometry.boundingBox) {
  centerObject(mesh, mesh.geometry.boundingBox);
  positionCameraOnObject(camera, mesh.geometry.boundingBox);
}

scene.add(mesh);

// ** OBJECT INFORMATION ** //

printOrderStore.updateUnit(stlFileUrl, {
  modelVolume: calculateVolume(mesh.geometry),
});

if (geometry.boundingBox) {
  printOrderStore.updateUnit(stlFileUrl, {
    modelDimensions: new Vector3(
      Math.abs(geometry.boundingBox.max.x - geometry.boundingBox.min.x),
      Math.abs(geometry.boundingBox.max.y - geometry.boundingBox.min.y),
      Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z)
    ),
  });
}

// ********************** //

watch(aspectRatio, () => {
  updateCamera();
  updateRenderer();
});

watch(color, (value) => {
  mesh.material.color.setHex(value || 0xffffff);
});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  const item = value.find((el) => el.localUrl === stlFileUrl);

  if (!item) {
    mesh.material.color.setHex(0xeaeaea);
    return;
  }

  const colorStringValue =
    filamentColorStore.getFilamentColors.find((el) => el.id === item.color)
      ?.value || "#EAEAEA";
  const colorStringValueTrimmed = colorStringValue.substring(1);
  const parsed = parseInt(colorStringValueTrimmed, 16);

  mesh.material.color.setHex(parsed);
});

onMounted(() => {
  setRenderer();
  loop();
});

const loop = () => {
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};

function setSceneBackground(scene: Scene, color: Color) {
  scene.background = color;
}

function addLights() {
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const hemisphereLight = new HemisphereLight(0xffeeb1, 0x080820, 0.5);
  scene.add(hemisphereLight);

  const spotLight = new SpotLight(0xffa95c, 0.5);
  spotLight.position.set(-50, 50, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const spotLight2 = new SpotLight(0xffa95c, 0.5);
  spotLight2.position.set(50, -50, -50);
  spotLight2.castShadow = true;
  scene.add(spotLight2);
}

function addAxisLines() {
  const origin = new Vector3(0, 0, 0);
  const xAxis = new Vector3(100, 0, 0);
  const yAxis = new Vector3(0, 100, 0);
  const zAxis = new Vector3(0, 0, 100);

  const points = [];
  points.push(new Vector3(0, 0, 0));
  points.push(new Vector3(0, 10, 0));
  points.push(new Vector3(10, 0, 0));

  const xAxisGeometry = new BufferGeometry().setFromPoints([origin, xAxis]);
  const yAxisGeometry = new BufferGeometry().setFromPoints([origin, yAxis]);
  const zAxisGeometry = new BufferGeometry().setFromPoints([origin, zAxis]);

  const xAxisMaterial = new LineBasicMaterial({ color: 0xff0000 });
  const yAxisMaterial = new LineBasicMaterial({ color: 0x00ff00 });
  const zAxisMaterial = new LineBasicMaterial({ color: 0x0000ff });

  const xAxisLine = new Line(xAxisGeometry, xAxisMaterial);
  const yAxisLine = new Line(yAxisGeometry, yAxisMaterial);
  const zAxisLine = new Line(zAxisGeometry, zAxisMaterial);

  scene.add(xAxisLine);
  scene.add(yAxisLine);
  scene.add(zAxisLine);
}

function positionCameraOnObject(camera: PerspectiveCamera, bbox: Box3) {
  let largestDimension = Math.max(bbox.max.x, bbox.max.y, bbox.max.z);
  camera.position.x = largestDimension * 0.5;
  camera.position.y = largestDimension * 0.5;
  camera.position.z = largestDimension * 2.5;
}

function centerObject(mesh: Mesh<BufferGeometry, Material>, bbox: Box3) {
  let middle = new Vector3();
  bbox.getCenter(middle);

  mesh.geometry.applyMatrix4(
    new Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
  );
}

function calculateVolume(geometry: BufferGeometry) {
  let position = geometry.attributes.position as
    | BufferAttribute
    | InterleavedBufferAttribute;
  let faces = position.count / 3;
  let sum = 0;
  let p1 = new Vector3(),
    p2 = new Vector3(),
    p3 = new Vector3();
  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0);
    p2.fromBufferAttribute(position, i * 3 + 1);
    p3.fromBufferAttribute(position, i * 3 + 2);
    sum += signedVolumeOfTriangle(p1, p2, p3);
  }
  return sum;
}

function signedVolumeOfTriangle(p1: Vector3, p2: Vector3, p3: Vector3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}
</script>

<style>
</style>