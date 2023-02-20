import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";

export default interface IFilamentColor {
    id: number,
    name: string,
    value: string
}

export interface IFilamentMaterial {
    id: number,
    name: string,
    description: string,
    density: number,
    price: number,
    printing_speed: number,
}

export interface IFilamentSpool {
    id: number,
    material: IFilamentMaterial,
    color: IFilamentColor,
}

export const useFilamentSpoolStore = defineStore('filament-spool', {
    state: () => ({
        filamentSpools: [] as IFilamentSpool[]
    }),

    getters: {
        getAll: (state) => state.filamentSpools,
        getById: (state) => {
            return (id: number) => state.filamentSpools.find((item) => item.id === id);
        },
        getByColorId: (state) => {
            return (id: number) => state.filamentSpools.filter((item) => item.color.id === id);
        },
        getByMaterialId: (state) => {
            return (id: number) => state.filamentSpools.filter((item) => item.material.id === id);
        },
        getColorsForCurrentMaterial: (state) => {
            return (spoolId: number) => {
                const spool = state.filamentSpools.find((item) => item.id === spoolId);
                if (!spool) {
                    console.error(`No colors found. Spool with id={spoolId} does not exist.`)
                    return [];
                }
                return state.filamentSpools.filter(el => el.material.id == spool.material.id).map(el => el.color)
            }
        },
        getMaterials: (state) => {
            return state.filamentSpools.map(el => el.material);
        }
    },

    actions: {
        async fetchFilamentSpools() {
            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IFilamentSpool[]>('http://localhost:8000/api/filament/spools/?available=true', {
                    method: 'GET',
                }).then((response: IFilamentSpool[]) => {
                    this.filamentSpools = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFilamentSpoolStore, import.meta.hot))
}
