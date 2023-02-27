import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IAddressResponse, useAuthStore } from './auth';
import { IProductVariationOptionCombinationResponse } from './product';
import { IShippingMethod } from './shipping_method';

export interface IStoreOrderUnitResponse {
    id: number,
    quantity: number,
    item: number,
    order: number,
}

export interface IStoreOrderResponse {
    id: number,
    items: IStoreOrderUnitResponse[],
    created_at: string,
    updated_at: string,
    contact_email: string,
    shipping_address: IAddressResponse,
    billing_address: IAddressResponse,
    shipping_method: IShippingMethod,
    total_price: number,
    payment_method: string,
    status: string,
}

function reformatItems(cartItems: Map<number, [IProductVariationOptionCombinationResponse, number]>): IStoreOrderUnitResponse[] {
    let items = [] as IStoreOrderUnitResponse[];

    cartItems.forEach((value: [IProductVariationOptionCombinationResponse, number], key: number) => {
        items.push(<IStoreOrderUnitResponse>{
            item: key,
            quantity: value[1],
        })
    })

    return items;
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        cartItems: new Map<number, [IProductVariationOptionCombinationResponse, number]>,

        store_order: <IStoreOrderResponse>{
            contact_email: '',
            shipping_address: <IAddressResponse>{},
            billing_address: <IAddressResponse>{},
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
                (value: [IProductVariationOptionCombinationResponse, number], key: number) => {
                    totalPrice += value[1] * value[0].price;
                }
            );

            return totalPrice;
        },
        getCartTotalQuantity: (state) => {
            let totalQuantity = 0;

            state.cartItems.forEach(
                (value: [IProductVariationOptionCombinationResponse, number], key: number) => {
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
            return (id: number): IProductVariationOptionCombinationResponse | undefined => {
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
            this.cartItems = new Map<number, [IProductVariationOptionCombinationResponse, number]>();
            this.store_order = <IStoreOrderResponse>{
                payment_method: "",
                contact_email: '',
                shipping_address: <IAddressResponse>{},
                billing_address: <IAddressResponse>{},
                shipping_method: <IShippingMethod>{}
            };
        },
        add(combinationId: number, combination: IProductVariationOptionCombinationResponse) {
            const cartItemsCopy = new Map<number, [IProductVariationOptionCombinationResponse, number]>(this.cartItems);

            let currentQuantity = this.getCartQuantityForId(combinationId) || 0;

            cartItemsCopy.set(combinationId, [combination, currentQuantity + 1])

            this.cartItems = cartItemsCopy;
        },
        remove(combinationId: number) {
            const cartItemsCopy = new Map<number, [IProductVariationOptionCombinationResponse, number]>(this.cartItems);

            let currentQuantity = this.getCartQuantityForId(combinationId) || 0;
            let currentItem = this.getCartItemForId(combinationId);

            if (currentQuantity > 1 && currentItem) {
                cartItemsCopy.set(combinationId, [currentItem, currentQuantity - 1])
            } else {
                cartItemsCopy.delete(combinationId)
            }

            this.cartItems = cartItemsCopy;
        },
        setQuantity(combinationId: number, combination: IProductVariationOptionCombinationResponse, quantity: number) {
            const cartItemsCopy = new Map<number, [IProductVariationOptionCombinationResponse, number]>(this.cartItems);

            if (quantity <= 0) {
                cartItemsCopy.delete(combinationId);
            } else {
                cartItemsCopy.set(combinationId, [combination, quantity])
            }

            this.cartItems = cartItemsCopy;
        },
        async postOrder(): Promise<IStoreOrderResponse> {

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

            return promiseWithTimeout<IStoreOrderResponse>(new Promise<IStoreOrderResponse>((resolve, reject) => {
                customFetch<IStoreOrderResponse>('http://localhost:8000/api/store-orders/', {
                    method: 'POST',
                    body: body,
                }).then((response: IStoreOrderResponse) => {
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
