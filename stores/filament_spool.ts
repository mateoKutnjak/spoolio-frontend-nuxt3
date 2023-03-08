import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IFilamentSpool } from "~~/constants/data";

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

            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                customFetch<IFilamentSpool[]>('api/filament/spools/?available=true', {
                    baseURL: config.public.baseURL,
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
