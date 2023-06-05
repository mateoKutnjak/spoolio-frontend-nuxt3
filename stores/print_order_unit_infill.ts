import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IPrintOrderUnitInfill } from "~~/constants/data";

export const usePrintOrderUnitInfillStore = defineStore('print-order-unit-infill', {
    state: () => ({
        infills: [] as IPrintOrderUnitInfill[]
    }),

    getters: {
        getInfills: (state) => state.infills,
        getPercentageById: (state) => {
            return (id: number) => state.infills.find((item) => item.id === id)?.percentage
        },
    },

    actions: {
        async fetchInfills() {

            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IPrintOrderUnitInfill[]>('api/print-orders/infills/?available=true', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintOrderUnitInfill[]) => {
                    this.infills = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderUnitInfillStore, import.meta.hot))
}
