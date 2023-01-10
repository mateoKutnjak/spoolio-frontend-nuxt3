import { acceptHMRUpdate, defineStore } from 'pinia'
import { IPrintOrderResponse } from './print_order'

interface IPrintOrderListResponse {
    count: number,
    next: string,
    previous: string,
    results: IPrintOrderResponse[]
}

export const usePrintOrderHistoryStore = defineStore('order-history-print', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        print_orders: [] as IPrintOrderResponse[]
    }),

    getters: {
        getPrintOrders: (state) => state,
        getPrintOrderById: (state) => {
            return (id: number) => state.print_orders.find((item) => item.id === id)
        },
    },

    actions: {
        async fetchPrintOrderHistoryPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            return new Promise((resolve, reject) => {
                customFetch<IPrintOrderListResponse>(`http://localhost:8000/api/print-orders/orders/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET',
                }).then((response: IPrintOrderListResponse) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.print_orders = [...this.print_orders, ...response.results];
                    } else {
                        this.print_orders = response.results;
                    }

                    resolve(response)
                }).catch(err => {
                    // ! needs proper error handling
                    // alert("TODO error handling")
                    reject(err)
                })
            })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderHistoryStore, import.meta.hot))
}
