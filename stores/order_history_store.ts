import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { IPaginatedResponse, IStoreOrder } from '~~/constants/data'
import { useAuthStore } from './auth'

export const useStoreOrderHistoryStore = defineStore('order-history-store', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        orders: [] as IStoreOrder[]
    }),

    getters: {
        getOrders: (state) => state,
        getOrderById: (state) => {
            return (id: number) => state.orders.find((item) => item.id === id)
        },
        getTotalPriceById: (state) => {
            return (id: number) => {
                const order = state.orders.find((item) => item.id === id)

                if (!order) return undefined;

                let totalQuantity = 0;

                order.items.forEach(el => {
                    totalQuantity = totalQuantity + el.quantity * el.item.price
                });

                return totalQuantity;
            }
        }
    },

    actions: {
        async fetchOrderHistoryPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            return promiseWithTimeout<IPaginatedResponse<IStoreOrder>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IStoreOrder>>(`http://localhost:8000/api/store-orders/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET',
                }).then((response: IPaginatedResponse<IStoreOrder>) => {
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
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchById(id: number) {
            return promiseWithTimeout<IStoreOrder>(new Promise((resolve, reject) => {
                customFetch<IStoreOrder>(`http://localhost:8000/api/store-orders/${id}/`, {
                    method: 'GET',
                }).then((response: IStoreOrder) => {
                    const index = this.orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.orders[index] = response;
                    } else {
                        this.orders.push(response)
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async updateOrderStatusById(id: number, status: string) {
            const authStore = useAuthStore();

            return promiseWithTimeout<IStoreOrder>(new Promise((resolve, reject) => {
                customFetch<IStoreOrder>(`http://localhost:8000/api/store-orders/${id}/`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: {
                        status: status,
                    },
                }).then((response: IStoreOrder) => {
                    const index = this.orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.orders[index] = response;
                    } else {
                        console.error("Store order with id cannot be find locally. Refresh please");
                        reject("Store order with id cannot be find locally. Refresh please")
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
        
        add(order: IStoreOrder) {
            this.orders.unshift(order);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStoreOrderHistoryStore, import.meta.hot))
}
