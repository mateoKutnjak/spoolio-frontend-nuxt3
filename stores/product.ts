import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IProduct, IProductVariationOptionCombination } from '~~/constants/data';

export const useProductStore = defineStore('product', {
    state: () => ({
        product: undefined as IProduct | undefined,
        activeOptionsCombination: undefined as IProductVariationOptionCombination | undefined
    }),

    getters: {
        getProduct: (state) => state.product,
        getActiveOptionsCombination: (state) => state.activeOptionsCombination
    },

    actions: {
        async fetchProduct(id: number) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IProduct>(new Promise<IProduct>((resolve, reject) => {
                customFetch<IProduct>(`api/products/${id}/`, {
                     baseURL: config.public.baseURL,
                     method: 'GET'
                }).then((response: IProduct) => {
                    this.product = response;
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
        async fetchProductVariationOptionCombination(optionIds: number[], productId: number) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IProductVariationOptionCombination[]>(new Promise<IProductVariationOptionCombination[]>((resolve, reject) => {
                customFetch<IProductVariationOptionCombination[]>(`api/product-variation-option-combinations/?${optionIds.map(el => `options=${el}&`).join('')}product=${productId}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET'
                }).then((response: IProductVariationOptionCombination[]) => {
                    if (response.length > 0) {
                        this.activeOptionsCombination = response[0]; // TODO is this ok?
                    } else {
                        this.activeOptionsCombination = undefined;
                    }
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        clear() {
            this.product = undefined;
            this.activeOptionsCombination = undefined;
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
