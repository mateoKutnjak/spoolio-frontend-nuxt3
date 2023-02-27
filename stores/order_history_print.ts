import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { IPrintOrderResponse } from './print_order'
import { useAuthStore } from "../stores/auth";

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
            return promiseWithTimeout<IPrintOrderListResponse>(new Promise((resolve, reject) => {
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
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchPrintOrderById(id: number) {
            return promiseWithTimeout<IPrintOrderResponse>(new Promise((resolve, reject) => {
                customFetch<IPrintOrderResponse>(`http://localhost:8000/api/print-orders/orders/${id}/`, {
                    method: 'GET',
                }).then((response: IPrintOrderResponse) => {
                    this.print_orders.push(response);
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async updatePrintOrderStatusById(id: number, status: string) {

            const authStore = useAuthStore();

            return promiseWithTimeout<IPrintOrderResponse>(new Promise((resolve, reject) => {
                customFetch<IPrintOrderResponse>(`http://localhost:8000/api/print-orders/orders/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: {
                        status: status,
                    },
                }).then((response: IPrintOrderResponse) => {
                    const index = this.print_orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.print_orders[index] = response;
                    } else {
                        console.error("Print order with id cannot be find locally. Refresh please");
                        reject("Print order with id cannot be find locally. Refresh please")
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
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderHistoryStore, import.meta.hot))
}
