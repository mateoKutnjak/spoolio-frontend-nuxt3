import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";

export interface IShippingMethod {
    id: number,
    provider: string,
    description: string,
    price: number
}

export const useShippingMethodStore = defineStore('shipping-method', {
    state: () => ({
        shippingMethods: [] as IShippingMethod[]
    }),

    getters: {
        getShippingMethods: (state) => state.shippingMethods,
    },

    actions: {
        async fetchShippingMethods() {
            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IShippingMethod[]>('http://localhost:8000/api/shipping-methods/?available=true', {
                    method: 'GET',
                }).then((response: IShippingMethod[]) => {
                    this.shippingMethods = response;
                    resolve(response);
                }).catch((err) => {
                    alert(err);
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useShippingMethodStore, import.meta.hot))
}
