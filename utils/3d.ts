import { AmbientLight, Box3, BufferAttribute, BufferGeometry, Color, HemisphereLight, InterleavedBufferAttribute, Material, Matrix4, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SpotLight, Vector3, WebGLRenderer } from "three";

export async function create3dObjectScreenshot(stlFileUrl: string, meshColor: string | undefined, width: number, height: number, callback: (blob: Blob) => void) {
    let experience = document.createElement('canvas') as HTMLCanvasElement

    const scene = new Scene();
    scene.background = new Color("#EAEAEA");

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
    camera.position.set(0, 0, 1);
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

    geometry.computeBoundingBox();

    if (!mesh.geometry.boundingBox) {
        return;
    }

    centerObject(mesh, mesh.geometry.boundingBox);
    positionCameraOnObject(camera, mesh.geometry.boundingBox);

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
            callback(blob);
        }
    });
}

export async function preprocess3dObject(stlFileUrl: string): Promise<{ modelVolume: number, modelDimensions: Vector3 }> {
    const { load } = useSTLModel();
    const geometry = await load(stlFileUrl);

    geometry.computeBoundingBox();

    if (!geometry.boundingBox) {
        throw Error('Bounding box not calculated')
    }

    const modelVolume = calculateVolume(geometry)
    const modelDimensions = new Vector3(
        Math.abs(geometry.boundingBox.max.x - geometry.boundingBox.min.x),
        Math.abs(geometry.boundingBox.max.y - geometry.boundingBox.min.y),
        Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z)
    );

    return { modelVolume, modelDimensions }
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

function positionCameraOnObject(camera: PerspectiveCamera, bbox: Box3) {
    let largestDimension = Math.max(bbox.max.x, bbox.max.y, bbox.max.z);
    camera.position.x = largestDimension * 0.5;
    camera.position.y = largestDimension * 0.5;
    camera.position.z = largestDimension * 2;

    camera.lookAt(new Vector3())
}
