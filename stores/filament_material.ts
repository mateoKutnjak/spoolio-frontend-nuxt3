import { acceptHMRUpdate, defineStore } from "pinia";

export interface IFilamentMaterial {
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
                $fetch<IFilamentMaterial[]>('http://localhost:8000/api/filament/materials/', {
                    method: 'GET',
                }).then((response: IFilamentMaterial[]) => {
                    this.filamentMaterials = response;
                    resolve(response);
                }).catch((err) => {
                    alert(err);
                    reject(err);
                })
            }), 5000);
        }
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useFilamentMaterialStore, import.meta.hot))
}
