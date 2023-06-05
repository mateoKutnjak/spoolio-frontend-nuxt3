import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IPaginatedResponse, IPrinter } from '~~/constants/data';

export const usePrinterStore = defineStore('printer', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        printers: [] as IPrinter[]
    }),

    getters: {
        getPrinters: (state) => state.printers,
        getPrinterById: (state) => {
            return (id: number) => state.printers.find((it) => it.id === id);
        }
    },

    actions: {
        async fetchPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {

            const config = useRuntimeConfig();


            return promiseWithTimeout<IPaginatedResponse<IPrinter>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IPrinter>>(`api/printers/printers/?limit=${limit}&offset=${offset}&search=${search}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPaginatedResponse<IPrinter>) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.printers = [...this.printers, ...response.results];
                    } else {
                        this.printers = response.results;
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchById(id: number) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPrinter>(new Promise((resolve, reject) => {
                customFetch<IPrinter>(`api/modeling-orders/${id}/`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrinter) => {
                    const index = this.printers.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.printers[index] = response;
                    } else {
                        this.printers.push(response)
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrinterStore, import.meta.hot))
}
