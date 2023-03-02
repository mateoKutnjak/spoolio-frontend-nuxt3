import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IAddressBilling, IAddressShipping, IProductVariationOptionCombination, IShippingMethod, IStoreOrder, IStoreOrderUnit } from '~~/constants/data';
import { useAuthStore } from './auth';

function reformatItems(cartItems: Map<number, [IProductVariationOptionCombination, number]>): any[] {
    let items = [] as any[];

    cartItems.forEach((value: [IProductVariationOptionCombination, number], key: number) => {
        items.push({
            item: key,
            quantity: value[1],
        })
    })

    return items;
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        cartItems: new Map<number, [IProductVariationOptionCombination, number]>,

        store_order: <IStoreOrder>{
            contact_email: '',
            shipping_address: <IAddressShipping>{},
            billing_address: <IAddressBilling>{},
            shipping_method: <IShippingMethod>{},
            payment_method: '',
        },
    }),

    getters: {
        // * Used as a trigger because map changes are not triggered
        getCartItems: (state) => state.cartItems,
        getCartTotalPrice: (state) => {
            let totalPrice = 0;

            state.cartItems.forEach(
                (value: [IProductVariationOptionCombination, number], key: number) => {
                    totalPrice += value[1] * value[0].price;
                }
            );

            return totalPrice;
        },
        getCartTotalQuantity: (state) => {
            let totalQuantity = 0;

            state.cartItems.forEach(
                (value: [IProductVariationOptionCombination, number], key: number) => {
                    totalQuantity += value[1];
                }
            );

            return totalQuantity;
        },
        getCartQuantityForId: (state) => {
            return (id: number): number => {
                const value = state.cartItems.get(id);

                if (value) {
                    return value[1];
                }
                return 0;
            }
        },
        getCartItemForId: (state) => {
            return (id: number): IProductVariationOptionCombination | undefined => {
                const value = state.cartItems.get(id);

                if (value) {
                    return value[0];
                }
                return undefined;
            }
        },
    },

    actions: {
        clear() {
            this.cartItems = new Map<number, [IProductVariationOptionCombination, number]>();
            this.store_order = <IStoreOrder>{
                payment_method: "",
                contact_email: '',
                shipping_address: <IAddressShipping>{},
                billing_address: <IAddressBilling>{},
                shipping_method: <IShippingMethod>{}
            };
        },
        add(combinationId: number, combination: IProductVariationOptionCombination) {
            const cartItemsCopy = new Map<number, [IProductVariationOptionCombination, number]>(this.cartItems);

            let currentQuantity = this.getCartQuantityForId(combinationId) || 0;

            cartItemsCopy.set(combinationId, [combination, currentQuantity + 1])

            this.cartItems = cartItemsCopy;
        },
        remove(combinationId: number) {
            const cartItemsCopy = new Map<number, [IProductVariationOptionCombination, number]>(this.cartItems);

            let currentQuantity = this.getCartQuantityForId(combinationId) || 0;
            let currentItem = this.getCartItemForId(combinationId);

            if (currentQuantity > 1 && currentItem) {
                cartItemsCopy.set(combinationId, [currentItem, currentQuantity - 1])
            } else {
                cartItemsCopy.delete(combinationId)
            }

            this.cartItems = cartItemsCopy;
        },
        setQuantity(combinationId: number, combination: IProductVariationOptionCombination, quantity: number) {
            const cartItemsCopy = new Map<number, [IProductVariationOptionCombination, number]>(this.cartItems);

            if (quantity <= 0) {
                cartItemsCopy.delete(combinationId);
            } else {
                cartItemsCopy.set(combinationId, [combination, quantity])
            }

            this.cartItems = cartItemsCopy;
        },
        async postOrder(): Promise<IStoreOrder> {

            const authStore = useAuthStore();

            const body = {
                contact_email: this.store_order.contact_email,
                shipping_address: this.store_order.shipping_address,
                billing_address: this.store_order.billing_address,
                shipping_method: this.store_order.shipping_method.id,
                payment_method: this.store_order.payment_method,
                user_profile: authStore.getUser?.profile?.id,
                items: reformatItems(this.cartItems),
            }

            return promiseWithTimeout<IStoreOrder>(new Promise<IStoreOrder>((resolve, reject) => {
                customFetch<IStoreOrder>('http://localhost:8000/api/store-orders/', {
                    method: 'POST',
                    body: body,
                }).then((response: IStoreOrder) => {
                    console.log(response);
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);;
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
