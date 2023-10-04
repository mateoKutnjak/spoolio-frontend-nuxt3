import { AmbientLight, Float32BufferAttribute, Quaternion, Plane, Euler, Triangle, Box3, BufferAttribute, BufferGeometry, Color, HemisphereLight, InterleavedBufferAttribute, Material, Matrix4, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SpotLight, Vector3, WebGLRenderer, Object3D, Camera } from "three";
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { radToDeg } from "three/src/math/MathUtils";


export async function create3dObjectScreenshot(stlFileUrl: string, meshColor: string | undefined, width: number, height: number, callback: (blob: Blob, simplifiedModelBlob: Blob) => void) {
    let experience = document.createElement('canvas') as HTMLCanvasElement

    const scene = new Scene();
    scene.background = new Color("#FFFAF9");

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

    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    //camera.position.set(0, 0, 1);
    camera.up = new Vector3(0, 0, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    scene.add(camera);
    

    // *** OBJECT LOADING *** //

    const { load } = useSTLModel();
    const geometry = await load(stlFileUrl);

    const mesh = new Mesh(
        geometry,
        new MeshStandardMaterial({ color: meshColor ?? '#EAEAEA', roughness: 0.9, metalness: 0.5 })
    );

    const exporter = new STLExporter();
    const modifier = new SimplifyModifier();

    const meshSimplified = mesh.clone();
    meshSimplified.material = mesh.material.clone();
    meshSimplified.material.flatShading = true;
    const count = Math.floor(meshSimplified.geometry.attributes.position.count * 0.1); // number of vertices to remove
    meshSimplified.geometry = modifier.modify(meshSimplified.geometry, count);

    const result = exporter.parse(meshSimplified, { binary: true });
    const simplifiedBlob = new Blob([result], { type: "application/octet-stream" });

    var center = new Vector3();
    mesh.geometry.computeBoundingBox();
    if (mesh.geometry.boundingBox) {
      mesh.geometry.boundingBox?.getCenter(center);
      mesh.geometry.center();
      mesh.updateMatrix();
    }else{
      return;
    }

    const volume_box = new Box3();
    // GET BOUNDING VOLUME
    volume_box.setFromObject(mesh);

    positionCameraOnObject(camera, volume_box, 0);

    //centerObject(mesh, mesh.geometry.boundingBox);
    scene.add(mesh);


    // *********************** //
    
    const renderer = new WebGLRenderer({
        canvas: experience,
        alpha: true,
        antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    experience.toBlob(blob => {
        if (blob) {
            callback(blob, simplifiedBlob);
        }
    });
}

export async function preprocess3dObject(stlFileUrl: string): Promise<{ model_volume: number, model_dimensions: Vector3, optimal_rotation: Vector3, model_rotation: Vector3, border_planes: number[], border_groups: number[], unique_planes: {planes: {normal: Vector3, constant: number}[], ids: number[]} }> {
    const { load } = useSTLModel();
    const geometry = await load(stlFileUrl);

    console.log("Preprocessing object");

    geometry.computeBoundingBox();
    geometry.center();

    if (!geometry.boundingBox) {
        throw Error('Bounding box not calculated')
    }

    const model_volume = calculateVolume(geometry)
    const model_dimensions = new Vector3(
        Math.abs(geometry.boundingBox.max.x - geometry.boundingBox.min.x),
        Math.abs(geometry.boundingBox.max.y - geometry.boundingBox.min.y),
        Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z)
    );

    // TODO this will be calculated by Bojan algorithm
    const analyzed = analyzePlanes(geometry, 5);
    const border_planes = analyzed.border_planes;
    const unique_planes = analyzed.unique_planes;
    const border_groups = analyzed.border_groups;

    const maxBorderPlane = unique_planes.planes[border_planes[0]];
    const face_normal = maxBorderPlane.normal.clone();
    const optimal = rotationToFace(face_normal);
    //optimal_rotation = rot_axis * rot_angle
    const optimal_rotation = optimal.rot_axis.multiplyScalar(optimal.angle);

    const model_rotation = new Vector3(0, 0, 0);

    return { model_volume, model_dimensions, optimal_rotation, model_rotation, border_planes, border_groups, unique_planes }
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

function centerObject(mesh: Mesh<BufferGeometry, Material>, bbox: Box3) {
    let middle = new Vector3();
    bbox.getCenter(middle);

    mesh.geometry.applyMatrix4(
        new Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
    );
}

function positionCameraOnObject(camera: PerspectiveCamera, bbox: Box3, lookZ: number) {
    //let largestDimension = Math.max(bbox.max.x, bbox.max.y, bbox.max.z);
    camera.position.x = bbox.max.x * 2;
    camera.position.y = bbox.max.y * 2;
    camera.position.z = bbox.max.z + 0.2*(bbox.max.z - bbox.min.z);

    camera.lookAt(new Vector3(0,0,lookZ));
    camera.updateProjectionMatrix();
}

export function vector3ToString(obj: Vector3 | undefined): string {
    if (!obj) {
        return 'null'
    }
    return `${obj.x},${obj.y},${obj.z}`
}

export function vector3Parse(rawObj: string | undefined): Vector3 {
    if (!rawObj || rawObj === 'null' || rawObj === 'undefined') {
        throw createError(`Cannot parse object ${rawObj} to Vector3`)
    }

    const rawDimensions = rawObj.split(',')
    if (rawDimensions.length != 3) {
        throw createError(`Number of dimensions of an object trying to parse as Vector3d is not 3. Obj=${rawObj}`)
    }

    let x = Number(rawDimensions[0])
    let y = Number(rawDimensions[1])
    let z = Number(rawDimensions[2])

    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
        throw createError(`Some of the following values cannot be parsed as number: ${rawDimensions[0]} ${rawDimensions[1]} ${rawDimensions[2]}`)
    }

    return new Vector3(x, y, z);
}

// ADDITIONAL FUNCTIONS (by Bojan)
export function analyzePlanes(
    geometry: BufferGeometry,
    decimals: number){

    let unique_planes;
    let border_planes;
  
    let point;
    let plane = new Plane();
    let count = geometry.attributes.position.count*3;
    console.log("Vertex Count: %d", count);
    let pos = Array.from((geometry.attributes.position as BufferAttribute).array);
    //let vert_colors = [];
    let areas = [];
    let planes = [];
    //let face_color = primary_color;
  
    // Loop over all triangles (3x3 coordinates)
    for (let x = 0; x < count; x += 9){
      let points = [];
      // Loop over vertices in single triangle
      for (let y = 0; y < 9; y += 3 ){
        let i = x + y;
  
        point = new Vector3(parseFloat(pos[i].toFixed(decimals)), parseFloat(pos[i+1].toFixed(decimals)), parseFloat(pos[i+2].toFixed(decimals))); 
        points.push(point);
  
        /*
        // Color each vertex
        for (let i = 0; i < 3; i++){
          vert_colors.push(face_color.r);
          vert_colors.push(face_color.g);
          vert_colors.push(face_color.b);
        }
        */        
      }
          
      let triangle = new Triangle(points[0], points[1], points[2]);
      // Fill lists of triangle areas and normals
      areas.push(triangle.getArea());
      triangle.getPlane(plane);
      plane.normalize();
      let new_normal = new Vector3(parseFloat(plane.normal.getComponent(0).toFixed(decimals)), parseFloat(plane.normal.getComponent(1).toFixed(decimals)), parseFloat(plane.normal.getComponent(2).toFixed(decimals)));
      // Plane is defined by normal vector and offset from (0,0,0) along the normal
      planes.push({normal: new_normal, constant: parseFloat(plane.constant.toFixed(decimals))});
    }
  
    // Get unique planes and coplanar faces
    unique_planes = getUniquePlanes(planes);  
    let planeSizes = getPlaneSizes(unique_planes.planes, unique_planes.ids, areas);
  
    // Test the biggest borderTestNum planes if they are borders
    let borderTestNum = Math.min(unique_planes.planes.length, 600);
    border_planes = [];
    for (let i = 0; i < borderTestNum; i++){
      let id = planeSizes[i].index;
      let borders = isBorderPlane(unique_planes.planes[id], id, unique_planes.ids, pos);
      if (borders.isBorder){
        border_planes.push(id);
      }
    }

    const border_groups = createGroups(geometry, border_planes, unique_planes.ids);
    //geometry.setAttribute('color', new BufferAttribute(new Float32Array(vert_colors), 3));
  
    return { border_planes, unique_planes, border_groups }
  }

export function createGroups(
    geometry: BufferGeometry,
    border_planes: number[],
    unique_planes_ids: number[])
    {

    let border_groups : number[];
    border_groups = [];
    let group_num = 0;
    let prev_group = -1; // -1: no prev, 0: prev not border, 1: prev border
    let group = -1;
    let start_id = -1;
    let end_id = -1;

    unique_planes_ids.forEach((plane_id, i) => {
      let add_group = false;
      
      if (border_planes.includes(plane_id)){
        group = 1;
      }else{
        group = 0;
      }

      // GROUP CHANGE
      if (prev_group != group){
        // ADD PREVIOUS GROUP
        if (prev_group != -1){
          add_group = true;          
        }else{
          start_id = i;
          end_id = i;
        }
      }else{
        // SAME GROUP
        end_id = i;
      }

      // ADD LAST TRIANGLE
      if (i == unique_planes_ids.length - 1){
        add_group = true;
      }

      if (add_group){
        geometry.addGroup(start_id*3, (end_id-start_id+1)*3, 0);
        start_id = i;
        end_id = i;
        // IF BORDER GROUP, ADD TO LIST
        if (prev_group == 0){
          border_groups.push(group_num);
        }
        group_num += 1;
      }
      
      prev_group = group;

    });

    return border_groups
}

export function colorBorders(mesh: Mesh, border_groups: number[], mat_id: number){
  border_groups.forEach((group_id) => {
    mesh.geometry.groups[group_id].materialIndex = mat_id;
  });
}

export function getUniquePlanes(array: {normal: Vector3, constant: number}[]){
    // in: [{normal: Vector3, constant: float}]
    // out: {planes: [], ids: [indexi uniquesPlanesa za svaki trokut]
    let planes = [];
    let ids = [];
    let count = 0;

    for (let i = 0; i < array.length; i++){
      let plane = array[i];
      let index = planes.findIndex(function(el){
        return el.normal.equals(plane.normal) && (el.constant == plane.constant);
      });

      if (index == -1){
        planes.push(plane);
        ids.push(count);
        count += 1;
      } else {
        ids.push(index);
      }
    }

    return {planes: planes, ids: ids}
}

export function getPlaneSizes(
    planes: {normal: Vector3, constant: number}[],
    ids: number[],
    areas: number[]){

    let planeAreas = new Array(planes.length).fill(undefined).map((__,index) => ({area: 0.0, index: index}));
    for (let i = 0; i < areas.length; i++){
    planeAreas[ids[i]].area += areas[i];
    }
    planeAreas.sort((a,b) => (a.area > b.area ? -1 : 1));
    return planeAreas;
}

export function isBorderPlane(
    plane_params: {normal: Vector3, constant: number},
    id: number,
    ids: number[],
    verts: number[]){

    let plane = new Plane(plane_params.normal, plane_params.constant);

    let vert_count = verts.length;
    let x_face_ids = getAllIndexes(ids, id);
    let positives = false;
    let negatives = false;

    let distances = [];
    let distance = 0;
    let face_id = -1;
    let point = new Vector3();
    for (let i = 0; i < vert_count; i += 3){
    face_id = Math.floor(i/9);
    if (!x_face_ids.includes(face_id)){
        point.set(verts[i], verts[i+1], verts[i+2]);
        distance = plane.distanceToPoint(point);
        distances.push(distance);
        if(distance > 0.001 && !positives){
        positives = true;
        }else if (distance < -0.001 && !negatives) {
        negatives = true;
        }
    } else {
        i += 6; //skip whole triangle
    }

    if (positives && negatives) {
        return {distances: distances, isBorder: false};
    }
    }
    return {distances: distances, isBorder: true};
}

export function getAllIndexes(arr: number[], val: number) {
  var indexes = [], i;
  for(i = 0; i < arr.length; i++)
      if (arr[i] === val)
          indexes.push(i);
  return indexes;
}

export function box( width: number, height: number, depth: number ) {

    width = width * 0.5,
    height = height * 0.5,
    depth = depth * 0.5;
  
    const geometry = new BufferGeometry();
    const position = [];
  
    position.push(
      - width, - height, - depth,
      - width, height, - depth,
  
      - width, height, - depth,
      width, height, - depth,
  
      width, height, - depth,
      width, - height, - depth,
  
      width, - height, - depth,
      - width, - height, - depth,
  
      - width, - height, depth,
      - width, height, depth,
  
      - width, height, depth,
      width, height, depth,
  
      width, height, depth,
      width, - height, depth,
  
      width, - height, depth,
      - width, - height, depth,
  
      - width, - height, - depth,
      - width, - height, depth,
  
      - width, height, - depth,
      - width, height, depth,
  
      width, height, - depth,
      width, height, depth,
  
      width, - height, - depth,
      width, - height, depth
      );
  
    geometry.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );
  
    return geometry;
}

function minPoint(mesh: Mesh) {
  let min_point = 0.0;
  let point = new Vector3();
  let pos = Array.from((mesh.geometry.attributes.position as BufferAttribute).array);
  let quart = new Quaternion();
  mesh.getWorldQuaternion(quart);

  for (let i = 0; i < pos.length; i += 3 ){
    // Transform local to global
    point.set(pos[i], pos[i+1], pos[i+2]);
    point.applyQuaternion(quart);
    // Find lowest point to place object on surface
    if (i==0){
      min_point = point.getComponent(2);
    } else {
      if (min_point > point.getComponent(2)){
        min_point = point.getComponent(2);
      }
    }
  }

  return min_point;
}

export function setToSurface(mesh: Mesh){
  mesh.updateWorldMatrix(true, true);
  let min_z = minPoint(mesh);
  let upVector = new Vector3(0,0,1);
  // SET OBJECT FLAT ON SURFACE
  if(min_z != 0){
    let localUp = new Vector3();
    let quart = new Quaternion();
    
    mesh.getWorldQuaternion(quart);
    localUp = mesh.worldToLocal(upVector);
    
    return {
      'axis': localUp.normalize(),
      'amount': Math.abs(min_z)
    };
  }else{
    return {
      'axis': upVector,
      'amount': 0
    };
  }
}

export function scaleObject(mesh: Mesh, current_scale: number){
  if (mesh){
    mesh.scale.set(current_scale, current_scale, current_scale);
    // SET OBJECT FLAT ON SURFACE
    var move;
    move = setToSurface(mesh);
    mesh.translateOnAxis(move.axis, move.amount*current_scale);
    mesh.updateWorldMatrix(true, true);    
    mesh.updateMatrix();
  }
}

function rotationToFace(face_normal: Vector3){
    const rot_axis = new Vector3();
    const down_vector = new Vector3(0,0,-1);
    let angle;

    // Get the vector perpendicular both to the plane normal
    // and z=-1 (will be used as the rotation axis) 
    rot_axis.crossVectors(face_normal, down_vector);
    // If cross product returns zero vector --> plane normal is colinear to z=-1
    if (rot_axis.length() == 0){
        // any combination of (x,y,0) can be used as rotation axis
        rot_axis.set(1,0,0);
      }
    rot_axis.normalize();

    angle = face_normal.angleTo(down_vector);

    return {rot_axis, angle}
}

export function refreshObject(
  mesh: Mesh,
  global_rot: number[],
  rot_order: number[],
  face_rot: Vector3,
  face_angle: number,
  scale: number,
  volume_box: Box3,
  camera: PerspectiveCamera,
  lookZ: number
  ) 
  {
  if (mesh){    
    // RESET ROTATION AND POSITION
    mesh.rotation.set(0,0,0);
    mesh.position.set(0,0,0);
    mesh.scale.set(1,1,1);

    // APPLY 2FACE ROTATION
    mesh.rotateOnAxis(face_rot, face_angle);
    
    // SET GLOBAL EULER ROTATION
    var global_axis = new Vector3(0,0,0);
    var local_axis = new Vector3(0,0,0);
    var axisOrder;
    for (var i = 0; i < 3; i++){
      axisOrder = rot_order.indexOf(i);
      global_axis.set(0,0,0);
      global_axis.setComponent(axisOrder, 1.0);

      mesh.updateWorldMatrix(true, true);
      local_axis = mesh.worldToLocal(global_axis);
      mesh.rotateOnAxis(local_axis, global_rot[axisOrder]);
    }
    mesh.updateMatrix();
  
    //SCALE OBJECT & PLACE ON SURFACE
    scaleObject(mesh, scale);

    volume_box.setFromObject(mesh);

    if (lookZ){
      lookZ = volume_box.max.z/2;
    }
    
    positionCameraOnObject(camera, volume_box, lookZ);
  }  
}


export function setRotOrder(rot_order: number[], rotation: number[], prev_rotation: number[]){
  
  let index = 0;
  let rot_val = 0;

  rotation.forEach((el, i) => {
    if ((el - prev_rotation[i]) != 0){
      index = i;
      rot_val = el;
    }
  });
  
  var new_rank = rot_order[index];
  if (rot_val != 0){
    rotation.forEach((e, i) => {
      if (i != index){
        if ((e == 0) && (rot_order[i] <= new_rank)){
          new_rank = Math.max(0, (new_rank - 1));
        }
      }
    });
  }
  // Place element on new rank
  var last_el = rot_order.indexOf(new_rank);
  if (last_el != index){
    if (rotation[last_el] != 0){
      var zero_el = rot_order.indexOf(0);
      rot_order[zero_el] = 2;
      rot_order[last_el] = 0;
      rot_order[index] = 1;
    }else{
      rot_order[last_el] = rot_order[index];
      rot_order[index] = new_rank;
    }    
  }
}

export function getXYZRot(mesh: Mesh)
{
  var rotation = new Vector3();
  var quart = new Quaternion();
  var euler = new Euler();
  mesh.updateMatrix();
  mesh.updateWorldMatrix(true, true);
  mesh.getWorldQuaternion(quart);
  euler.setFromQuaternion(quart, 'ZYX');
  rotation.setComponent(0, Math.round(radToDeg(euler.x)*10 - 0.1)/10);
  rotation.setComponent(1, Math.round(radToDeg(euler.y)*10 - 0.1)/10);
  rotation.setComponent(2, Math.round(radToDeg(euler.z)*10 - 0.1)/10);

  return vector3ToString(rotation);
}


