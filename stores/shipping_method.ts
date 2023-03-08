import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IShippingMethod } from "~~/constants/data";

export const useShippingMethodStore = defineStore('shipping-method', {
    state: () => ({
        shippingMethods: [] as IShippingMethod[]
    }),

    getters: {
        getShippingMethods: (state) => state.shippingMethods,
    },

    actions: {
        async fetchShippingMethods(): Promise<IShippingMethod[]> {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IShippingMethod[]>(new Promise<IShippingMethod[]>((resolve, reject) => {
                ofetch<IShippingMethod[]>('api/shipping-methods/?available=true', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IShippingMethod[]) => {
                    this.shippingMethods = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useShippingMethodStore, import.meta.hot))
}
