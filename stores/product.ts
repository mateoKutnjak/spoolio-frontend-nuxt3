import { acceptHMRUpdate, defineStore } from 'pinia'

export interface IProductResponse {
    id: number,
    title: string,
    description: string,
    comment_count: number,
    like_count: number,
    productvariationoption_set: IProductVariationOptionResponse[],
    productimage_set: IProductImageResponse[],
    starting_price: number,
    ending_price: number,
}

export interface IProductImageResponse {
    image: string,
    comment: string,
}

export interface IProductVariationResponse {
    id: number,
    name: string,
}

export interface IProductVariationOptionResponse {
    id: number,
    title: string,
    description: string,
    type: IProductVariationResponse,
}

export interface IProductVariationOptionCombinationResponse {
    id: number,
    price: number,
    sku: number,
    product: IProductResponse,
    options: IProductVariationOptionResponse[],
}

export const useProductStore = defineStore('product', {
    state: () => ({
        product: undefined as IProductResponse | undefined,
        activeOptionsCombination: undefined as IProductVariationOptionCombinationResponse | undefined
    }),

    getters: {
        getProduct: (state) => state.product,
        getActiveOptionsCombination: (state) => state.activeOptionsCombination
    },

    actions: {
        async fetchProduct(id: number) {
            return new Promise<IProductResponse>((resolve, reject) => {
                customFetch<IProductResponse>(`http://localhost:8000/api/products/${id}/`, {
                    method: 'GET'
                }).then((response: IProductResponse) => {
                    this.product = response;
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        async fetchProductVariationOptionCombination(optionIds: number[], productId: number) {
            return new Promise<IProductVariationOptionCombinationResponse[]>((resolve, reject) => {
                customFetch<IProductVariationOptionCombinationResponse[]>(`http://localhost:8000/api/product-variation-option-combinations/?${optionIds.map(el => `options=${el}&`).join('')}product=${productId}`, {
                    method: 'GET'
                }).then((response: IProductVariationOptionCombinationResponse[]) => {
                    if (response.length > 0) {
                        this.activeOptionsCombination = response[0]; // TODO is this ok?
                    } else {
                        this.activeOptionsCombination = undefined;
                    }
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
            })
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
