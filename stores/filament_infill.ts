import { acceptHMRUpdate, defineStore } from "pinia";

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
            }), 5000);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFilamentInfillStore, import.meta.hot))
}
