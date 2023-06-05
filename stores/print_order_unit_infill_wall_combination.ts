import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IPrintOrderUnitInfillWallCombination } from "~~/constants/data";

export const usePrintOrderUnitInfillWallCombinationStore = defineStore('print-order-unit-infill-wall-combination', {
    state: () => ({
        infillWallCombinations: [] as IPrintOrderUnitInfillWallCombination[]
    }),

    getters: {
        getAll: (state) => state.infillWallCombinations.sort((a, b) => {

            // * Sorts first by infill percentage (ascending) and then
            // * by walls amout (ascending)

            if (a.infill.percentage > b.infill.percentage) return 1;
            else if (a.infill.percentage < b.infill.percentage) return -1;
            else {
                if (a.wall.amount > b.wall.amount) return 1;
                else if (a.wall.amount < b.wall.amount) return -1;
                else return 0;
            }
        }),
    },

    actions: {
        async fetchAll() {

            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IPrintOrderUnitInfillWallCombination[]>('api/print-orders/infill-wall-combinations/', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintOrderUnitInfillWallCombination[]) => {
                    this.infillWallCombinations = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderUnitInfillWallCombinationStore, import.meta.hot))
}
