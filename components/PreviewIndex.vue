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
  BufferGeometry,
  Color,
  HemisphereLight,
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
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const { stlFileUrl, backgroundColor } = defineProps<{
  stlFileUrl: string;
  backgroundColor: string;
}>();

let renderer: WebGLRenderer;
let controls: OrbitControls;
const experience = ref<HTMLCanvasElement | null>(null);

const root = ref(null);
const { width, height } = useElementSize(root);

const aspectRatio = computed(() => width.value / height.value);

const scene = new Scene();

setSceneBackground(scene, new Color(backgroundColor));

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
    controls.enableZoom = false;

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

// *** OBJECT LOADING *** //

const loader = new STLLoader();

loader.load(stlFileUrl, (geometry) => {
  // *** OBJECT MODELING *** //

  const meshColor = "#aaaaaa";

  const mesh = new Mesh(
    geometry,
    new MeshStandardMaterial({
      color: meshColor,
      roughness: 0.9,
      metalness: 0.5,
    })
  );

  geometry.computeBoundingBox();

  if (mesh.geometry.boundingBox) {
    centerObject(mesh, mesh.geometry.boundingBox);
    positionCameraOnObject(camera, mesh.geometry.boundingBox);
  }

  scene.add(mesh);
});

watch(aspectRatio, () => {
  updateCamera();
  updateRenderer();
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

function positionCameraOnObject(camera: PerspectiveCamera, bbox: Box3) {
  let largestDimension = Math.max(bbox.max.x, bbox.max.y, bbox.max.z);
  camera.position.x = largestDimension * 0.5;
  camera.position.y = largestDimension * 0.5;
  camera.position.z = largestDimension * 1.75;
}

function centerObject(mesh: Mesh<BufferGeometry, Material>, bbox: Box3) {
  let middle = new Vector3();
  bbox.getCenter(middle);

  mesh.geometry.applyMatrix4(
    new Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
  );
}
</script>

<style>
</style>