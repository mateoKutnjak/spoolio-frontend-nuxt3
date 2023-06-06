import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IPrintingMethod } from "~~/constants/data";

export const usePrintingMethodStore = defineStore('printing-method', {
    state: () => ({
        printingMethods: [] as IPrintingMethod[]
    }),

    getters: {
        getPrintingMethods: (state) => state.printingMethods,
    },

    actions: {
        async fetch(): Promise<IPrintingMethod[]> {

            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IPrintingMethod[]>('api/printers/printing-methods/', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintingMethod[]) => {
                    this.printingMethods = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintingMethodStore, import.meta.hot))
}
