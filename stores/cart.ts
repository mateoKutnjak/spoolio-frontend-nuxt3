import { acceptHMRUpdate, defineStore } from 'pinia'
import { IProductResponse } from './product';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as IProductResponse[]
    }),

    getters: {
        getItems: (state) => state.items,
    },

    actions: {
        add(item: IProductResponse) {
            this.items.push(item);
        },
        remove(item: IProductResponse) {
            var index = this.items.reverse().indexOf(item);
            if (index > -1)
            {
                this.items.splice(index, 1);
            } else
            {
                console.error("Item not found inn cart");

            }
        },
        clear() {
            this.items = []
        }
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
