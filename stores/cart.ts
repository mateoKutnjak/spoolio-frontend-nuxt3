import { acceptHMRUpdate, defineStore } from 'pinia'
import IProductResponse from './product';

export const useCartStore = defineStore('cart', {
    // * State contains map and list objects
    // *
    // * as map object is not serializable, pinia won't recognize
    // * change inside the map, so every time list changes, state
    // * changes and we cean get new map with updated quantities
    state: () => ({
        items: [] as IProductResponse[],
        cartItems: new Map<IProductResponse, number>,
    }),

    getters: {
        getItems: (state) => state.items,
        getCartItems: (state) => state.cartItems
    },

    actions: {
        add(item: IProductResponse) {
            // * list update part
            this.items.push(item);

            // * map update part
            var currentQuantity = this.cartItems.get(item) || 0
            this.cartItems.set(item, currentQuantity + 1)
        },
        remove(item: IProductResponse) {
            // * list update part
            var index = this.items.reverse().indexOf(item);
            if (index > -1) {
                this.items.splice(index, 1);
            } else {
                console.error("Item not found in cart");
            }

            // * map update part
            var currentQuantity = this.cartItems.get(item) || 0
            if (currentQuantity > 1) {
                this.cartItems.set(item, currentQuantity - 1)
            } else {
                this.cartItems.delete(item)
            }
        },
        clear() {
            // * list update part
            this.items = []

            // * map update part
            this.cartItems.clear()
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
