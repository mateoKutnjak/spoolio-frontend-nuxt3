import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { IAttachmentFile, IAttachmentImage, IModelingOrder, IPaginatedResponse } from '~~/constants/data'

export const useModelingOrderHistoryStore = defineStore('order-history-modeling', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        modeling_orders: [] as IModelingOrder[]
    }),

    getters: {
        getState: (state) => state,
        getOrderById: (state) => {
            return (id: number) => state.modeling_orders.find((item) => item.id === id)
        },
    },

    actions: {
        async fetchPaginated(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            return promiseWithTimeout<IPaginatedResponse<IModelingOrder>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IModelingOrder>>(`http://localhost:8000/api/modeling-orders/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET',
                }).then((response: IPaginatedResponse<IModelingOrder>) => {
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
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchById(id: number) {
            return promiseWithTimeout<IModelingOrder>(new Promise((resolve, reject) => {
                customFetch<IModelingOrder>(`http://localhost:8000/api/modeling-orders/${id}/`, {
                    method: 'GET',
                }).then((response: IModelingOrder) => {
                    const index = this.modeling_orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.modeling_orders[index] = response;
                    } else {
                        this.modeling_orders.push(response)
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchAttachmentFilesById(id: number, contentType: string = 'modelingorder') {
            return promiseWithTimeout<IAttachmentFile[]>(new Promise((resolve, reject) => {
                customFetch<IAttachmentFile[]>(`http://localhost:8000/api/attachment-files/?content_type=${contentType}&object_id=${id}`, {
                    method: 'GET',
                }).then((response: IAttachmentFile[]) => {
                    const index = this.modeling_orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.modeling_orders[index].attachmentFiles = response;
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

        async fetchAttachmentImagesById(id: number, contentType: string = 'modelingorder') {
            return promiseWithTimeout<IAttachmentImage[]>(new Promise((resolve, reject) => {
                customFetch<IAttachmentImage[]>(`http://localhost:8000/api/attachment-images/?content_type=${contentType}&object_id=${id}`, {
                    method: 'GET',
                }).then((response: IAttachmentImage[]) => {
                    const index = this.modeling_orders.findIndex(el => el.id === id);

                    if (index != -1) {
                        this.modeling_orders[index].attachmentImages = response;
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
    import.meta.hot.accept(acceptHMRUpdate(useModelingOrderHistoryStore, import.meta.hot))
}
