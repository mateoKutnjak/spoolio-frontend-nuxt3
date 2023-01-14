import { acceptHMRUpdate, defineStore } from 'pinia'
import { IStoreOrderResponse } from './cart'

interface IStoreOrderListResponse {
    count: number,
    next: string,
    previous: string,
    results: IStoreOrderResponse[]
}

export const useStoreOrderHistoryStore = defineStore('order-history-store', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        orders: [] as IStoreOrderResponse[]
    }),

    getters: {
        getOrders: (state) => state,
        getOrderById: (state) => {
            return (id: number) => state.orders.find((item) => item.id === id)
        },
    },

    actions: {
        async fetchOrderHistoryPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            return new Promise((resolve, reject) => {
                customFetch<IStoreOrderListResponse>(`http://localhost:8000/api/store-orders/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET',
                }).then((response: IStoreOrderListResponse) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.orders = [...this.orders, ...response.results];
                    } else {
                        this.orders = response.results;
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
    import.meta.hot.accept(acceptHMRUpdate(useStoreOrderHistoryStore, import.meta.hot))
}
