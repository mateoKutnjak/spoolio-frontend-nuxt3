import { BufferGeometry, LoadingManager } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";


export function useSTLModel() {
    const loadingManager = new LoadingManager();

    const loader = new STLLoader(loadingManager);

    function load(url: string) {
        return new Promise<BufferGeometry>((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        })
    }

    return {
        load,
        loadingManager,
    }
}