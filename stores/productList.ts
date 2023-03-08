import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IPaginatedResponse, IProduct } from '~~/constants/data';

export const useProductListStore = defineStore('product-list', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        products: [] as IProduct[]
    }),

    getters: {
        getPaginatedProducts: (state) => state,
    },

    actions: {
        async fetchPaginatedProducts(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPaginatedResponse<IProduct>>(new Promise<IPaginatedResponse<IProduct>>((resolve, reject) => {
                customFetch<IPaginatedResponse<IProduct>>(`api/products/?limit=${limit}&offset=${offset}&search=${search}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET'
                }
                ).then((response: IPaginatedResponse<IProduct>) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.products = [...this.products, ...response.results];
                    } else {
                        this.products = response.results;
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
    import.meta.hot.accept(acceptHMRUpdate(useProductListStore, import.meta.hot))
}
