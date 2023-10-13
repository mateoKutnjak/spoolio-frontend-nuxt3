import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT } from "~~/constants/constants";
import { IPaymenIntent } from "~~/constants/data";

export const usePaymentStore = defineStore('payment', {
    state: () => ({
    }),

    getters: {
    },

    actions: {
        async createPaymentIntent(serviceType: string, order_id: number, amountCents: number, currency: string = 'EUR') {

            const config = useRuntimeConfig();

            const body = {
                service: serviceType,
                id: order_id,
                amount: amountCents,
                currency: currency,
            };

            return promiseWithTimeout(new Promise<IPaymenIntent>((resolve, reject) => {
                ofetch<IPaymenIntent>('api/create-payment-intent/', {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    body: body,
                }).then((response: IPaymenIntent) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async initPaymentIntent(serviceType: string, currency: string = 'EUR') {

            const config = useRuntimeConfig();

            const body = {
                service: serviceType,
                currency: currency,
            };

            return promiseWithTimeout(new Promise<IPaymenIntent>((resolve, reject) => {
                ofetch<IPaymenIntent>('api/init-payment-intent/', {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    body: body,
                }).then((response: IPaymenIntent) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
        
        async modifyPaymentIntent(clientSecret: string, orderId: number) {

            const config = useRuntimeConfig();

            const body = {
                client_secret: clientSecret,
                order_id: orderId,
            };

            return promiseWithTimeout(new Promise<IPaymenIntent>((resolve, reject) => {
                ofetch<IPaymenIntent>('api/modify-payment-intent/', {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    body: body,
                }).then((response: IPaymenIntent) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot))
}
