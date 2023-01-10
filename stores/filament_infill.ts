import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";

export interface IFilamentInfill {
    id: number,
    name: string,
    percentage: number
}

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
            return promiseWithTimeout(new Promise((resolve, reject) => {
                $fetch<IFilamentInfill[]>('http://localhost:8000/api/filament/infills/?available=true', {
                    method: 'GET',
                }).then((response: IFilamentInfill[]) => {
                    this.filamentInfills = response;
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
    import.meta.hot.accept(acceptHMRUpdate(useFilamentInfillStore, import.meta.hot))
}
