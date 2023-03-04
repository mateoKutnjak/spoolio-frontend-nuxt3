import { ofetch } from "ofetch";
import { acceptHMRUpdate, defineStore } from "pinia";
import { HTTP_REQUEST_TIMEOUT, ServiceType } from "~~/constants/constants";
import { IPaymenIntent } from "~~/constants/data";

export const usePaymentStore = defineStore('payment', {
    state: () => ({
    }),

    getters: {
    },

    actions: {
        async createPaymentIntent(serviceType: string, order_id: number, amountCents: number, currency: string = 'EUR') {
            const body = {
                service: serviceType,
                id: order_id,
                amount: amountCents,
                currency: currency,
            };

            return promiseWithTimeout(new Promise<IPaymenIntent>((resolve, reject) => {
                ofetch<IPaymenIntent>('http://localhost:8000/api/create-payment-intent/', {
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
