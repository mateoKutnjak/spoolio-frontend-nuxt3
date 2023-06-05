import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IFilamentMaterial, IFilamentSpool } from "~~/constants/data";

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
        getSpoolsWithSameMaterialAs: (state) => {
            return (spool: IFilamentSpool) => {
                return state.filamentSpools.filter((item) => item.material.id === spool.material.id);
            }
        },
        getSpoolsWithMaterial: (state) => {
            return (material: IFilamentMaterial) => {
                return state.filamentSpools.filter((item) => item.material.id === material.id);
            }
        },
        getSpoolsUniqueMaterials: (state) => {
            return state.filamentSpools.reduce((unique: IFilamentSpool[], item: IFilamentSpool) => {

                // * Checking if accumulation list of spools already contains
                // * spool with current spools material. If not, we add current spool
                // * to accumulation list of spools. If spool with this material already
                // * exists in accumulation list, we skip adding this spool.

                if (unique.findIndex((el) => el.material.id === item.material.id) === -1) {
                    return [...unique, item]
                }
                return unique;
            }, [] as IFilamentSpool[])
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
