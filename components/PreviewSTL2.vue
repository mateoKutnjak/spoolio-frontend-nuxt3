<template>
    <div ref="root">
      <canvas ref="experience">
      </canvas>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {
    AmbientLight,
    AxesHelper,
    Box3,
    BufferAttribute,
    BufferGeometry,
    Color,
    DoubleSide,
    Euler,
    HemisphereLight,
    InterleavedBufferAttribute,
    Line,
    LineSegments,
    LineDashedMaterial,
    LineBasicMaterial,
    Float32BufferAttribute,
    Material,
    Matrix4,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Plane,
    PointLight,
    PlaneGeometry,
    PlaneHelper,
    Scene,
    SpotLight,
    Vector3,
    Vector2,
    WebGLRenderer,
Group,
UnsignedInt248Type,
Raycaster,
  } from "three";
  import { useElementSize } from "@vueuse/core";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import { usePrintOrderStore } from "~~/stores/print_order";
  import { usePrinterTypeStore } from "~~/stores/printer_type";
  import { DimensionUnit, RotationUnit } from "~~/utils/enums";
  import { IPrintOrderUnit, IPrinterType } from "~~/constants/data";
import { radToDeg } from "three/src/math/MathUtils";
  
  const { unit } = defineProps<{
    unit: IPrintOrderUnit;
  }>();

  const volume_box = new Box3();
  const model_dimensions = new Vector3(0,0,0);

  var face_rot = new Vector3(0,0,0);
  const raycaster = new Raycaster();
  var face_angle = 0;
  var rot_order = [0,1,2];
  var updateObject = false;
  const mouse = new Vector2();
  const downVect = new Vector3(0, 0, -1);
  var prevNormal = new Vector3(0, 0, -1);
  
  const printOrderStore = usePrintOrderStore();
  const printerTypeStore = usePrinterTypeStore();

  let renderer: WebGLRenderer;
  let controls: OrbitControls;
  const experience = ref<HTMLCanvasElement | null>(null);

  onMounted(() => {
    if (experience.value){
      experience.value.addEventListener('mousemove', onMouseMove, false);
      experience.value.addEventListener('click', onClick, false);
    }
  });
  
  function onMouseMove(event) {
    if (event.target){
      // Calculate mouse position in normalized device coordinates (-1 to +1) for raycasting
      var rect = event.target.getBoundingClientRect();
      var x = event.clientX - rect.left; //x position within the element.
      var y = event.clientY - rect.top;  //y position within the element.
      mouse.x = (x / width.value) * 2 - 1;
      mouse.y = -(y / height.value) * 2 + 1;
    }    
  }

  function onClick(event) {
    if (show_faces){
      raycaster.setFromCamera(mouse, camera);

      let intersects = raycaster.intersectObject(mesh);
      let plane_data = unit.plane_data;
      if (intersects.length > 0 && intersects[0].faceIndex && plane_data){
        let rot_axis = new Vector3();
        let intersectedPlaneId = plane_data.unique_planes.ids[intersects[0].faceIndex];

        // If selected plane is in the border planes
        if (plane_data.border_planes.includes(intersectedPlaneId)){
          console.log("Border Clicked!");
          let selPlane = plane_data.unique_planes.planes[intersectedPlaneId];
        
          // Get the vector perpendicular both to the plane normal and z=-1 (will be used as the rotation axis) 
          rot_axis.crossVectors(selPlane.normal, downVect);
          // If cross product returns zero vector --> plane normal is colinear to z=-1
          if (rot_axis.length() == 0){
            // any combination of (x,y,0) can be used as rotation axis
            rot_axis.set(1,0,0);
          }
          rot_axis.normalize();
          let angle = selPlane.normal.angleTo(downVect);

          if (angle != 0 || !prevNormal.equals(downVect)){
            // rotate the mesh and rotate all the border plane normals
            prevNormal = selPlane.normal;
            show_faces = !show_faces;
            
            rot_order = [0,1,2];
            face_rot = rot_axis.clone();
            face_angle = angle;

            // set global rotation to zero
            printOrderStore.updateUnit(unit.localUrl, { 
              model_rotation_display: '0,0,0',
              show_faces: show_faces
            });
            if (unit.plane_data){
              colorBorders(mesh, unit.plane_data.border_groups, 0);
            }            
            updateObject = true;   
                             
          }
        }
      }
    }
  }
    
  const root = ref(null);
  const { width, height } = useElementSize(root);
  
  const aspectRatio = computed(() => width.value / height.value);
  
  printOrderStore.updateUnit(unit.localUrl, { scale_display: unit.scale });
  
  const scale_display = computed(
    () => {
      let print_order = printOrderStore.getUnitByLocalUrl(unit.localUrl);
      if (print_order){
        return print_order.scale_display;
      }else{
        return 1;
      }
    }
  );

  const print_volume = computed(
    () => {
      let printer_type = printerTypeStore.getByMethodId(unit.printing_method_display.id);
      let dimensionUnit = unit.length_unit_display;

      let print_area = new Vector3(200,200,200);

      if (typeof printer_type !== 'undefined'){
        print_area = vector3Parse(printer_type.max_print_size);
      }
      if (dimensionUnit === DimensionUnit.inches){
        print_area.divideScalar(25.4);
      }
      return print_area;
    }
  );
  
  const global_rot = computed(
    () => {
      let rot_vec = vector3Parse(unit.model_rotation_display);
      rot_vec.multiplyScalar(Math.PI/180);
      return rot_vec.toArray();
    }
  );
  
  const scene = new Scene();
  
  setSceneBackground(scene, new Color("#FFFAF9"));
  
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
      
      controls.addEventListener('start', stopAutoRotate);
  
      updateRenderer();
    }
  }

  function stopAutoRotate(){
    controls.autoRotate = false;
    controls.removeEventListener('start', stopAutoRotate);
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
  
  // ** LIGHTS & PLANE ** //
  
  drawPlane();
  
  // *** OBJECT LOADING *** //
  
  const { load } = useSTLModel();
  const geometry = await load(unit.localUrl);
  if (unit.plane_data){
    createGroups(geometry, unit.plane_data.border_planes, unit.plane_data.unique_planes.ids);
  }else{
    geometry.addGroup(0, Infinity, 0);
  }  
  
  // *** OBJECT MODELING *** //
  
  const meshColor = unit.spool.color.value;
  
  var opacMaterial = new MeshStandardMaterial({
    transparent: true, 
    opacity: 0.4,
    color: meshColor,
    roughness: 1,
    metalness: 0.5
  });
  var solidMaterial = new MeshStandardMaterial({
    transparent:false, 
    color: meshColor,
    roughness: 1,
    metalness: 0.5
  });

  console.log(geometry);
  const mesh = new Mesh(
    geometry,
    [solidMaterial, opacMaterial]
  );

  let show_faces = unit.show_faces;
  if (unit.plane_data){
    let color_id = 0
    if (show_faces){
      color_id = 1;
    }
    colorBorders(mesh, unit.plane_data.border_groups, color_id);
  }

  //const mesh = new Mesh(
  //  geometry,
  //  new MeshStandardMaterial({ color: meshColor, roughness: 1, metalness: 0.5 })
  //);

  var center = new Vector3();
  mesh.geometry.computeBoundingBox();
  if (mesh.geometry.boundingBox) {
    mesh.geometry.boundingBox?.getCenter(center);
    mesh.geometry.center();
    mesh.updateMatrix();

    volume_box.setFromObject(mesh);
    positionCameraOnObject(camera, mesh.geometry.boundingBox);
  } 
  
  // *** OBJECT ROTATION *** //

  refreshObject(mesh, global_rot.value, rot_order, face_rot, face_angle, scale_display.value, volume_box);
  model_dimensions.setComponent(0, volume_box.max.x - volume_box.min.x);
  model_dimensions.setComponent(1, volume_box.max.y - volume_box.min.y);
  model_dimensions.setComponent(2, volume_box.max.z - volume_box.min.z);

  // *** ADD OBJECT TO SCENE *** //
  scene.add(mesh);
  
  // ********************** //
  
  watch(aspectRatio, () => {
    updateCamera();
    updateRenderer();
  });

  watch(print_volume, () => {
    drawPlane();
  })

  watch(global_rot, (value, oldValue) => { 
    console.log("Global rotation refreshed")   
    // ROTATION ORDER 
    setRotOrder(rot_order, value, oldValue);
    
    refreshObject(mesh, value, rot_order, face_rot, face_angle, scale_display.value, volume_box);
    model_dimensions.setComponent(0, volume_box.max.x - volume_box.min.x);
    model_dimensions.setComponent(1, volume_box.max.y - volume_box.min.y);
    model_dimensions.setComponent(2, volume_box.max.z - volume_box.min.z);
    printOrderStore.updateUnit(unit.localUrl, { 
      model_xyz_rotation: getXYZRot(mesh),
      model_dimensions: vector3ToString(model_dimensions)
    });
  });
  
  
  watch(printOrderStore.getUnits, (value, oldValue, onInvalidate) => {
    const item = value.find((el) => el.localUrl === unit.localUrl);
    const prev_item = oldValue.find((el) => el.localUrl === unit.localUrl);
  
    if (!item) {
      mesh.material[0].color.set(0xeaeaea);
      mesh.material[1].color.set(0xeaeaea);
      return;
    }

    if (item.show_faces != show_faces){
      console.log('Coloring')
      show_faces = item.show_faces;
      if (unit.plane_data){
        let color_id = 0
        if (show_faces){
          color_id = 1;
        }
        colorBorders(mesh, unit.plane_data.border_groups, color_id);
      }
    }

    const colorStringValue = unit.spool_display.color.value;
    const colorStringValueTrimmed = colorStringValue.substring(1);
    const parsed = parseInt(colorStringValueTrimmed, 16);
  
    mesh.material[0].color.set(parsed);
    mesh.material[1].color.set(parsed);
  });
  
  
  watch(scale_display, (value, oldValue) => {
    if (value){
      refreshObject(mesh, global_rot.value, rot_order, face_rot, face_angle, value, volume_box);
      model_dimensions.setComponent(0, volume_box.max.x - volume_box.min.x);
      model_dimensions.setComponent(1, volume_box.max.y - volume_box.min.y);
      model_dimensions.setComponent(2, volume_box.max.z - volume_box.min.z);
      printOrderStore.updateUnit(unit.localUrl, { 
        model_dimensions: vector3ToString(model_dimensions)
      });
    }    
  });
  
  onMounted(() => {
    setRenderer();
    loop();
  });
  
  const loop = () => {
    controls.update();

    if (updateObject){
      refreshObject(mesh, global_rot.value, rot_order, face_rot, face_angle, scale_display.value, volume_box);
      model_dimensions.setComponent(0, volume_box.max.x - volume_box.min.x);
      model_dimensions.setComponent(1, volume_box.max.y - volume_box.min.y);
      model_dimensions.setComponent(2, volume_box.max.z - volume_box.min.z);
      printOrderStore.updateUnit(unit.localUrl, { 
        model_xyz_rotation: getXYZRot(mesh),
        model_dimensions: vector3ToString(model_dimensions)
      });
      updateObject = false;
    }
  
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  
  function setSceneBackground(scene: Scene, color: Color) {
    scene.background = color;
  }
  
  function positionCameraOnObject(camera: PerspectiveCamera, bbox: Box3) {
    let largestDimension = Math.max(bbox.max.x, bbox.max.y, bbox.max.z);
    camera.position.x = largestDimension * 0.5;
    camera.position.y = largestDimension * 0.5;
    camera.position.z = largestDimension * 2.5;
  }
  
  function drawPlane() {
    
    const print_dim = print_volume.value;

    removeObjectFromSceneByName("print_area");

    const surface_geo = new PlaneGeometry(print_dim.getComponent(0) + 10, print_dim.getComponent(1) + 10, 8, 8);
    const surface_mat = new MeshStandardMaterial({ color: 0x4E4F49, roughness: 0.9, metalness: 0, side: DoubleSide});
    surface_mat.transparent = true;
    surface_mat.opacity = 0.5;
    const surface = new Mesh(surface_geo, surface_mat);

    const box_geo = box( print_dim.getComponent(0) - 5, print_dim.getComponent(1) - 5, print_dim.getComponent(2));
    box_geo.translate(0,0,print_dim.getComponent(2)/2);
    const line_segments = new LineSegments( box_geo, new LineDashedMaterial( { color: 0xEF7745, dashSize: 5, gapSize: 5 } ) );
    line_segments.computeLineDistances();

    const axes_points = [
			0, 0, 0,	print_dim.getComponent(0)/2 + 5, 0, 0,
			0, 0, 0,	0, print_dim.getComponent(1)/2 + 5, 0,
			0, 0, 0,	0, 0, print_dim.getComponent(2)/2 + 5
		];
    
    const axes_helper = new AxesHelper();
    axes_helper.geometry.setAttribute('position', new Float32BufferAttribute( axes_points, 3 ));
    
    // Add lights
    const point_light_1 = new PointLight(0xFFFFFF);
    point_light_1.position.set(print_dim.getComponent(0)/2 + 40, print_dim.getComponent(1)/2 + 40, print_dim.getComponent(2) + 40);
    point_light_1.castShadow = true;

    const point_light_2 = new PointLight(0xFFFFFF);
    point_light_2.position.set(-print_dim.getComponent(0)/2 - 40, - print_dim.getComponent(1)/2 - 40, print_dim.getComponent(2) + 40);
    point_light_2.castShadow = true;

    const ambientLight = new AmbientLight(0xFFFFFF);

    const print_area = new Group();
    print_area.add(surface);
    print_area.add(line_segments);
    print_area.add(axes_helper);
    print_area.add(point_light_1);
    print_area.add(point_light_2);
    print_area.add(ambientLight);
    print_area.name = "print_area"
  
    scene.add(print_area);
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