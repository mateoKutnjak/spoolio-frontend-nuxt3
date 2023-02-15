import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export function useGLTFModel() {
    const gltfLoader = new GLTFLoader();

    function load(url: string) {
        return new Promise<GLTF>((resolve, reject) => {
            gltfLoader.load(url, resolve, undefined, reject);
        })
    }

    return {
        load
    }
}