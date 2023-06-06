import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IPrinterType } from '~~/constants/data';

export const usePrinterTypeStore = defineStore('printer-type', {
    state: () => ({
        printerTypes: [] as IPrinterType[]
    }),

    getters: {
        getAll: (state) => state.printerTypes,
    },

    actions: {
        async fetch(): Promise<IPrinterType[]> {

            const config = useRuntimeConfig();


            return promiseWithTimeout<IPrinterType[]>(new Promise((resolve, reject) => {
                customFetch<IPrinterType[]>(`api/printers/printer-types/`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrinterType[]) => {
                    this.printerTypes = response;

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrinterTypeStore, import.meta.hot))
}
