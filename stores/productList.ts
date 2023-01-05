import { acceptHMRUpdate, defineStore } from 'pinia'
import { IProductResponse } from './product';

interface IProductListResponse {
    count: number,
    next: string,
    previous: string,
    results: IProductResponse[]
}

export const useProductListStore = defineStore('product-list', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        products: [] as IProductResponse[]
    }),

    getters: {
        getPaginatedProducts: (state) => state,
    },

    actions: {
        async fetchPaginatedProducts(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            await $fetch<IProductListResponse>(`http://localhost:8000/api/products/?limit=${limit}&offset=${offset}&search=${search}`, {
                method: 'GET'
            }
            ).then((response: IProductListResponse) => {
                this.count = response.count;
                this.next = response.next;
                this.previous = response.previous;

                if (append) {
                    this.products = [...this.products, ...response.results];
                } else {
                    this.products = response.results;
                }
            }).catch(err => {
                throw err
            })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductListStore, import.meta.hot))
}
