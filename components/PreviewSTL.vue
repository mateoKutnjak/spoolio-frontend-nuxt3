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
  Euler,
  HemisphereLight,
  InterleavedBufferAttribute,
  Line,
  LineBasicMaterial,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  PlaneHelper,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from "three";
import { useElementSize } from "@vueuse/core";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { usePrintOrderStore } from "~~/stores/print_order";
import { useGlobalsStore } from "~~/stores/globals";
import { DimensionUnit, RotationUnit } from "~~/utils/enums";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { IPrintOrderUnit } from "~~/constants/data";

const { unit } = defineProps<{
  unit: IPrintOrderUnit;
}>();

const globalsStore = useGlobalsStore();
const printOrderStore = usePrintOrderStore();

let renderer: WebGLRenderer;
let controls: OrbitControls;
const experience = ref<HTMLCanvasElement | null>(null);

const root = ref(null);
const { width, height } = useElementSize(root);

const aspectRatio = computed(() => width.value / height.value);

printOrderStore.updateUnit(unit.localUrl, {scale_display: unit.scale})


const scale_display = computed(
  () => printOrderStore.getUnitByLocalUrl(unit.localUrl)?.scale_display
);

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

    controls.autoRotate = true;
    controls.update();

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
camera.up = new Vector3(0, 0, 1);
scene.add(camera);

// ** LIGHTS ** //

addLights();
// addAxisLines();

// *** OBJECT LOADING *** //

const { load } = useSTLModel();
const exporter = new STLExporter();
console.log("exporter");
console.log(exporter);
const geometry = await load(unit.localUrl);

// *** OBJECT SCALE *** //

geometry.scale(unit.scale, unit.scale, unit.scale);

// *** OBJECT MODELING *** //

const meshColor = unit.spool.color.value;

const mesh = new Mesh(
  geometry,
  new MeshStandardMaterial({ color: meshColor, roughness: 0.9, metalness: 0.5 })
);

geometry.computeBoundingBox();

if (mesh.geometry.boundingBox) {
  centerObject(mesh, mesh.geometry.boundingBox);
  positionCameraOnObject(camera, mesh.geometry.boundingBox);

  const bbox = mesh.geometry.boundingBox;
  const rotationVector = vector3Parse(unit.model_rotation);
  const rotationUnit = unit.rotation_unit;
  const dimensionUnit = unit.length_unit;

  if (bbox) {
    drawPlane(
      bbox,
      rotationVector,
      rotationUnit as RotationUnit,
      dimensionUnit as DimensionUnit
    );
  } else {
    console.error("Bounding box not calculated after rotation changes");
  }
}

// *** OBJECT ROTATION *** //

const model_rotation = vector3Parse(unit.model_rotation);

mesh.rotation.set(model_rotation.x, model_rotation.y, model_rotation.z);

// *** ADD OBJECT TO SCENE *** //

scene.add(mesh);

// ********************** //

watch(aspectRatio, () => {
  updateCamera();
  updateRenderer();
});

watch(color, (value) => {
  mesh.material.color.setHex(value || 0xffffff);
});

watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
  const item = value.find((el) => el.localUrl === unit.localUrl);

  if (!item) {
    mesh.material.color.setHex(0xeaeaea);
    return;
  }

  const colorStringValue = unit.spool.color.value;
  const colorStringValueTrimmed = colorStringValue.substring(1);
  const parsed = parseInt(colorStringValueTrimmed, 16);

  mesh.material.color.setHex(parsed);

  mesh.geometry.computeBoundingBox();
  const bbox = mesh.geometry.boundingBox;
  const rotationVector = vector3Parse(item.model_rotation_display);
  const rotationUnit = item.rotation_unit;
  const dimensionUnit = item.length_unit;

  if (bbox) {
    drawPlane(
      bbox,
      rotationVector,
      rotationUnit as RotationUnit,
      dimensionUnit as DimensionUnit
    );
  } else {
    console.error("Bounding box not calculated after rotation changes");
  }

  mesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
});

watch(scale_display, (value, oldValue) => {
  if (value && oldValue) {
    const newScale = value / oldValue;
    mesh.geometry.scale(newScale, newScale, newScale);

    recenterCameraAndRedrawPlane(mesh);
  }
});

function recenterCameraAndRedrawPlane(
  mesh: Mesh<BufferGeometry, MeshStandardMaterial>
) {
  geometry.computeBoundingBox();

  if (mesh.geometry.boundingBox) {
    centerObject(mesh, mesh.geometry.boundingBox);
    positionCameraOnObject(camera, mesh.geometry.boundingBox);

    const bbox = mesh.geometry.boundingBox;
    const rotationVector = vector3Parse(unit.model_rotation);
    const rotationUnit = unit.rotation_unit;
    const dimensionUnit = unit.length_unit;

    if (bbox) {
      drawPlane(
        bbox,
        rotationVector,
        rotationUnit as RotationUnit,
        dimensionUnit as DimensionUnit
      );
    } else {
      console.error("Bounding box not calculated after rotation changes");
    }
  }
}

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

function drawPlane(
  bbox: Box3,
  rotationVector: Vector3,
  rotationUnit: RotationUnit,
  dimensionUnit: DimensionUnit
) {
  const rotationMatrix = new Matrix4();
  rotationMatrix.makeRotationFromEuler(
    new Euler(rotationVector.x, rotationVector.y, rotationVector.z)
  );
  bbox?.applyMatrix4(rotationMatrix);

  removeObjectFromSceneByName("plane_helper");

  const plane = new Plane(new Vector3(0, 0, 1), bbox.max.z);
  const planeSize = dimensionUnit === DimensionUnit.mms ? 210 : 82.7;
  const helper = new PlaneHelper(plane, planeSize, 0x888888);
  helper.name = "plane_helper";

  scene.add(helper);
}

function removeObjectFromSceneByName(name: string) {
  var selectedObject = scene.getObjectByName(name);

  if (selectedObject) {
    scene.remove(selectedObject);
  } else {
    console.error(
      `Cannot remove object ${name} from scene. It does not exist in scene.`
    );
  }
}
</script>

<style>
</style>