import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";

export default interface IFilamentColor {
    id: number,
    name: string,
    value: string
}

export const useFilamentColorStore = defineStore('filament-color', {
    state: () => ({
        filamentColors: [] as IFilamentColor[]
    }),

    getters: {
        getFilamentColors: (state) => state.filamentColors,
    },

    actions: {
        async fetchFilamentColors() {
            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IFilamentColor[]>('http://localhost:8000/api/filament/colors/?available=true', {
                    method: 'GET',
                }).then((response: IFilamentColor[]) => {
                    this.filamentColors = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFilamentColorStore, import.meta.hot))
}
