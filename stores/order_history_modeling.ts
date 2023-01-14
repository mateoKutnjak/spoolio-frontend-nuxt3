import { acceptHMRUpdate, defineStore } from 'pinia'
import { IModelingOrderResponse } from './modeling_order'

interface IModelingOrderListResponse {
    count: number,
    next: string,
    previous: string,
    results: IModelingOrderResponse[]
}

export const useModelingOrderHistoryStore = defineStore('order-history-modeling', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        modeling_orders: [] as IModelingOrderResponse[]
    }),

    getters: {
        getState: (state) => state,
        getOrderById: (state) => {
            return (id: number) => state.modeling_orders.find((item) => item.id === id)
        },
    },

    actions: {
        async fetchPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            return new Promise((resolve, reject) => {
                customFetch<IModelingOrderListResponse>(`http://localhost:8000/api/modeling-orders/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET',
                }).then((response: IModelingOrderListResponse) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.modeling_orders = [...this.modeling_orders, ...response.results];
                    } else {
                        this.modeling_orders = response.results;
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useModelingOrderHistoryStore, import.meta.hot))
}
