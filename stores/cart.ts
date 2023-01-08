import { acceptHMRUpdate, defineStore } from 'pinia'
import { IAddressResponse } from './auth';
import { IProductVariationOptionCombinationResponse } from './product';
import { IShippingMethod } from './shipping_method';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cartItems: new Map<IProductVariationOptionCombinationResponse, number>,
        paymentMethod: "",
        contactEmail: "",
        shippingAddress: <IAddressResponse>{},
        billingAddress: <IAddressResponse>{},
        shippingMethod: <IShippingMethod>{},
    }),

    getters: {
        // * Used as a trigger because map changes are not triggered
        getCartItems: (state) => state.cartItems,
        getCartTotalPrice: (state) => {
            let totalPrice = 0;

            state.cartItems.forEach(
                (value: number, key: IProductVariationOptionCombinationResponse) => {
                    totalPrice += value * key.price;
                }
            );

            return totalPrice;
        },
        getCartTotalQuantity: (state) => {
            let totalQuantity = 0;

            state.cartItems.forEach(
                (value: number, key: IProductVariationOptionCombinationResponse) => {
                    totalQuantity += value;
                }
            );

            return totalQuantity;
        },
        getCartQuantityForItem: (state) => {
            return (item: IProductVariationOptionCombinationResponse): number => state.cartItems.get(item) || 0
        },
        getCartItemForId: (state) => {
            return (id: number): IProductVariationOptionCombinationResponse | undefined => Array.from(state.cartItems.keys()).find(el => el.id === id)
        },
        getCartItemQuantityForId: (state) => {
            return (id: number): number | undefined => {
                const item = Array.from(state.cartItems.keys()).find(el => el.id === id);
                if (!item) return undefined;
                return state.cartItems.get(item);
            }
        },
    },

    actions: {
        add(combination: IProductVariationOptionCombinationResponse) {
            const cartItemsCopy = new Map<IProductVariationOptionCombinationResponse, number>(this.cartItems);

            var currentQuantity = cartItemsCopy.get(combination) || 0
            cartItemsCopy.set(combination, currentQuantity + 1)

            this.cartItems = cartItemsCopy;
        },
        remove(combination: IProductVariationOptionCombinationResponse) {
            const cartItemsCopy = new Map<IProductVariationOptionCombinationResponse, number>(this.cartItems);

            var currentQuantity = cartItemsCopy.get(combination) || 0
            if (currentQuantity > 1) {
                cartItemsCopy.set(combination, currentQuantity - 1)
            } else {
                cartItemsCopy.delete(combination)
            }

            this.cartItems = cartItemsCopy;
        },
        setQuantity(combination: IProductVariationOptionCombinationResponse, quantity: number) {
            const cartItemsCopy = new Map<IProductVariationOptionCombinationResponse, number>(this.cartItems);

            if (quantity <= 0) {
                cartItemsCopy.delete(combination);
            } else {
                cartItemsCopy.set(combination, quantity)
            }

            this.cartItems = cartItemsCopy;
        },
        clear() {
            this.cartItems = new Map<IProductVariationOptionCombinationResponse, number>
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
