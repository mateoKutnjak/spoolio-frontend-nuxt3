import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IPaginatedResponse, IPrintingJob } from '~~/constants/data';
import { useAuthStore } from './auth';

export const usePrintingJobStore = defineStore('print-jobs', {
    state: () => ({
        printJobs: [] as IPrintingJob[]
    }),

    getters: {
        getByPrinterId: (state) => {
            return (id: number) => state.printJobs.filter((item) => item.printer === id)
        }
    },

    actions: {
        async fetchAllByPrinterId(printerId: number, append: boolean = false) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPrintingJob[]>(new Promise((resolve, reject) => {
                customFetch<IPrintingJob[]>(`api/print-jobs/?printer=${printerId}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintingJob[]) => {
                    if (append) {
                        this.printJobs = [...this.printJobs, ...response];
                    } else {
                        this.printJobs = response;
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPaginatedResponse<IPrintingJob>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IPrintingJob>>(`api/print-jobs/?limit=${limit}&offset=${offset}&search=${search}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPaginatedResponse<IPrintingJob>) => {
                    if (append) {
                        this.printJobs = [...this.printJobs, ...response.results];
                    } else {
                        this.printJobs = response.results;
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchById(id: number) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPrintingJob>(new Promise((resolve, reject) => {
                customFetch<IPrintingJob>(`api/modeling-orders/${id}/`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintingJob) => {
                    const index = this.printJobs.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.printJobs[index] = response;
                    } else {
                        this.printJobs.push(response)
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async updateStatus(id: number, status: string) {

            const config = useRuntimeConfig();
            const authStore = useAuthStore();

            return promiseWithTimeout<IPrintingJob>(new Promise((resolve, reject) => {
                customFetch<IPrintingJob>(`api/print-jobs/${id}/`, {
                    baseURL: config.public.baseURL,
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: {
                        status: status,
                    },
                }).then((response: IPrintingJob) => {
                    const index = this.printJobs.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.printJobs[index] = response;
                    } else {
                        console.error(`Print job with id=${id} cannot be find locally. Refresh please`);
                        reject(`Print job with id=${id} cannot be find locally. Refresh please`)
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintingJobStore, import.meta.hot))
}
