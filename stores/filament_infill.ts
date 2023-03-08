import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IFilamentInfill } from "~~/constants/data";

export const useFilamentInfillStore = defineStore('filament-infill', {
    state: () => ({
        filamentInfills: [] as IFilamentInfill[]
    }),

    getters: {
        getFilamentInfills: (state) => state.filamentInfills,
        getPercentageById: (state) => {
            return (id: number) => state.filamentInfills.find((item) => item.id === id)?.percentage
        },
    },

    actions: {
        async fetchFilamentInfills() {

            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IFilamentInfill[]>('api/filament/infills/?available=true', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IFilamentInfill[]) => {
                    this.filamentInfills = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFilamentInfillStore, import.meta.hot))
}
