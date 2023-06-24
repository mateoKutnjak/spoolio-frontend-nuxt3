import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { IPaginatedResponse, IPrintOrder, IPrintOrderUnit } from '~~/constants/data';
import { useAuthStore } from "../stores/auth";
import { adjustPrice } from './print_order';

export const usePrintOrderHistoryStore = defineStore('order-history-print', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        print_orders: [] as IPrintOrder[]
    }),

    getters: {
        getPrintOrders: (state) => state,
        getPrintOrderById: (state) => {
            return (id: number) => state.print_orders.find((item) => item.id === id)
        },
        getPriceByLocalUrl: (state) => {
            return (orderId: number, orderUnitId: number) => {
                const order = state.print_orders.find(el => el.id === orderId)

                if (!order) {
                    throw createError(`Cannot calculate unit price. Order with id=${orderId} not found`);
                }

                const unit = order.units.find(el => el.id === orderUnitId)

                if (!unit) {
                    throw createError(`Cannot calculate unit price. Unit with id ${orderUnitId} not found`);
                }

                return unit.quantity * adjustPrice(unit);
            }
        },
    },

    actions: {
        async fetchPrintOrderHistoryPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPaginatedResponse<IPrintOrder>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IPrintOrder>>(`api/print-orders/orders/?limit=${limit}&offset=${offset}&search=${search}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPaginatedResponse<IPrintOrder>) => {
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

            const config = useRuntimeConfig();


            return promiseWithTimeout<IPrintOrder>(new Promise(async (resolve, reject) => {
                customFetch<IPrintOrder>(`api/print-orders/orders/${id}/`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintOrder) => {
                    const index = this.print_orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.print_orders[index] = response;
                    } else {
                        this.print_orders.push(response);
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchPrintOrderUnitNamesById(id: number) {

            const config = useRuntimeConfig();
            

            return promiseWithTimeout<IPrintOrderUnit[]>(new Promise(async (resolve, reject) => {
                customFetch<IPrintOrderUnit[]>(`api/print-orders/units/?order=${id}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPrintOrderUnit[]) => {
                    const index = this.print_orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.print_orders[index].units = response;
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

        async updatePrintOrderStatusById(id: number, status: string) {

            const config = useRuntimeConfig();
            const authStore = useAuthStore();

            return promiseWithTimeout<IPrintOrder>(new Promise((resolve, reject) => {
                customFetch<IPrintOrder>(`api/print-orders/orders/${id}/`, {
                    baseURL: config.public.baseURL,
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: {
                        status: status,
                    },
                }).then((response: IPrintOrder) => {
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

        add(order: IPrintOrder) {
            this.print_orders.unshift(order);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderHistoryStore, import.meta.hot))
}
