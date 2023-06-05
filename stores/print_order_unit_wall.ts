import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IPrintOrderUnitWall } from "~~/constants/data";

export const usePrintOrderUnitWallStore = defineStore('print-order-unit-wall', {
    state: () => ({
        walls: [] as IPrintOrderUnitWall[]
    }),

    getters: {
        getWalls: (state) => state.walls,
    },

    actions: {
        async fetchWalls() {

            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IPrintOrderUnitWall[]>('api/print-orders/walls/?available=true', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintOrderUnitWall[]) => {
                    this.walls = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderUnitWallStore, import.meta.hot))
}
