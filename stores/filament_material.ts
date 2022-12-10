import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";

export interface IFilamentMaterial {
    id: number,
    name: string,
    density: number,
    price: number,
}

export const useFilamentMaterialStore = defineStore('filament-material', {
    state: () => ({
        filamentMaterials: [] as IFilamentMaterial[]
    }),

    getters: {
        getFilamentMaterials: (state) => state.filamentMaterials,
    },

    actions: {
        async fetchFilamentMaterials() {
            return promiseWithTimeout(new Promise((resolve, reject) => {
                $fetch<IFilamentMaterial[]>('http://localhost:8000/api/filament/materials/?available=true', {
                    method: 'GET',
                }).then((response: IFilamentMaterial[]) => {
                    this.filamentMaterials = response;
                    resolve(response);
                }).catch((err) => {
                    alert(err);
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFilamentMaterialStore, import.meta.hot))
}
