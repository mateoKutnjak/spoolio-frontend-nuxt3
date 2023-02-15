import { BufferGeometry } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";


export function useSTLModel() {
    const loader = new STLLoader();

    function load(url: string) {
        return new Promise<BufferGeometry>((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        })
    }

    return {
        load
    }
}