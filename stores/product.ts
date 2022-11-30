import { acceptHMRUpdate, defineStore } from 'pinia'

export default interface IProductResponse {
    id: number,
    title: string,
    description: string,
    picture: string
    price: number,
}

export const useProductStore = defineStore('product', {
    state: () => ({
        product: undefined as IProductResponse | undefined
    }),

    getters: {
        getProduct: (state) => state.product,
    },

    actions: {
        async fetchProduct(id: number) {
            return new Promise<IProductResponse>((resolve, reject) => {
                $fetch<IProductResponse>(`http://localhost:8000/api/products/${id}/`, {
                    method: 'GET'
                }).then((response: IProductResponse) => {
                    this.product = response;
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
